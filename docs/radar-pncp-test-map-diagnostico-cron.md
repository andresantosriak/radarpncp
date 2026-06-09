# Test Map: Modo Diagnóstico + Agendamento Periódico

**Feature:** Telemetria de classificação IA do coletor Querido Diário + pg_cron a cada 12h
**Data:** 2026-06-08
**Stories cobertas:** US-001 a US-005
**Arquivos sob teste:**
- `supabase/functions/coletar-querido-diario/index.ts` (persiste descartes + capturas em `diagnostico_coleta`, retorna estatísticas)
- `supabase/migrations/20260608190000_create_diagnostico_coleta.sql` (tabela + RLS + índices + constraint)
- `supabase/migrations/20260608200000_cron_querido_diario.sql` (pg_cron 0 */12 * * *)

**Cenário motivador (não esquecer):** o coletor rodou 4x, analisou **30 diários**, capturou **0**. A feature existe para responder POR QUE 0 de 30 — categorizando cada descarte com score + motivo. Os testes devem reproduzir esse cenário real, não casos genéricos.

**Legenda:** `[AUTO]` automatizável (SQL/curl/script) · `[MANUAL]` requer execução real do coletor/cron/OpenAI · `[VISUAL]` inspeção no Supabase Dashboard

---

## 1. Fluxo principal (happy path)

| # | Cenário | Resultado esperado | Tipo |
|---|---------|--------------------|------|
| 1.1 | Invocar coletor (`POST /functions/v1/coletar-querido-diario`) com diários disponíveis | HTTP 200, `ok:true`, corpo contém campo `diagnostico` | [MANUAL] |
| 1.2 | Após execução que analisou N excerpts | `count(*)` em `diagnostico_coleta` para a execução = N (todo excerpt analisado vira 1 registro, capturado ou descartado) | [AUTO] |
| 1.3 | Excerpt **descartado** persiste linha completa | registro com `capturado=false`, `score` preenchido (int 0-100), `motivo_descarte` ∈ {nao_e_licitacao, nao_relevante, score_abaixo_threshold}, `objeto/orgao/modalidade/valor_estimado/prazo` presentes (mesmo null) | [AUTO] |
| 1.4 | Excerpt **capturado** persiste em ambas as tabelas | linha em `oportunidades` (controle_pncp `QD:...`) **e** linha em `diagnostico_coleta` com `capturado=true`, `motivo_descarte=null`, mesmo score | [AUTO] |
| 1.5 | Resposta JSON traz estatísticas (US-005) | `diagnostico.total_analisados`, `.capturados`, `.descartados`, `.motivos.{nao_e_licitacao,nao_relevante,score_abaixo_threshold,erro_ia}` — todos inteiros ≥ 0 | [AUTO] |
| 1.6 | Coerência dos contadores | `total_analisados == capturados + descartados`; `descartados == soma dos 4 motivos`; `capturados == count diagnostico_coleta WHERE capturado=true` da execução | [AUTO] |

---

## 2. Edge cases

| # | Cenário | Resultado esperado | Tipo |
|---|---------|--------------------|------|
| 2.1 | **Cenário real "0 de 30 capturados"** — 30 diários, todos descartados | `total_analisados=30`, `capturados=0`, `descartados=30`; `diagnostico_coleta` tem 30 linhas todas `capturado=false`, cada uma com `motivo_descarte` categorizado (nenhuma com motivo null) — o operador consegue ver POR QUE cada uma caiu | [MANUAL] |
| 2.2 | Distribuição de motivos somando 30 | ex.: `nao_e_licitacao=18`, `nao_relevante=9`, `score_abaixo_threshold=3` → soma=30=`descartados`; query `SELECT motivo_descarte, count(*) GROUP BY 1` confere | [AUTO] |
| 2.3 | Score "quase passando" (40-49) | excerpt com `eh_licitacao=true`, `relevante=true`, `score=49` → `capturado=false`, `motivo_descarte='score_abaixo_threshold'`; query `WHERE score BETWEEN 40 AND 49` retorna esses registros (este é o sinal de H1 — threshold restritivo demais) | [AUTO] |
| 2.4 | Limite exato do threshold (score=50) | excerpt com `score=50`, `eh_licitacao=true`, `relevante=true` → `capturado=true` (condição de descarte é `score < 50`, então 50 captura) | [AUTO] |
| 2.5 | `eh_licitacao=false` mesmo com score alto | registro `capturado=false`, `motivo_descarte='nao_e_licitacao'` (a 1ª condição vence — verifica precedência `!ehLicitacao` antes de `!relevante` e `score<50`) | [AUTO] |
| 2.6 | `eh_licitacao=true` mas `relevante=false` | `capturado=false`, `motivo_descarte='nao_relevante'` | [AUTO] |
| 2.7 | **Erro/timeout da OpenAI** num excerpt | linha com `motivo_descarte='erro_ia'`, `capturado=false`, `eh_licitacao=null`, `relevante=null`, `score=null`, `justificativa` contém a mensagem (`Erro IA: ...`); `diagnostico.motivos.erro_ia` incrementado; **loop continua** processando os demais excerpts | [MANUAL] |
| 2.8 | INSERT em `diagnostico_coleta` falha (banco indisponível p/ telemetria) | erro logado via `console.error('[diagnostico] upsert failed')`, coletor **não interrompe** — segue para o próximo excerpt (telemetria nunca bloqueia o fluxo) | [MANUAL] |
| 2.9 | Upsert idempotente — mesmo diário coletado 2x | 2ª execução do mesmo `g.url` gera mesmo `excerpt_hash` (sha256/16hex); `ON CONFLICT (fonte, excerpt_hash) DO UPDATE` substitui a linha, **não duplica** — `count(*) WHERE excerpt_hash=X AND fonte='querido-diario'` permanece 1 | [AUTO] |
| 2.10 | API Querido Diário retorna vazio (0 gazettes) | `diagnostico.total_analisados=0` e todos os contadores zerados; `gazettesVarridas=0`; HTTP 200 (não é erro) | [MANUAL] |
| 2.11 | Falha no upsert de `oportunidades` num capturado | NÃO grava `capturado=true` em `diagnostico_coleta`; incrementa `erros` + `diagnostico.descartados`; loga `[oportunidades] upsert failed` (US-002: telemetria reflete estado real) | [MANUAL] |
| 2.12 | **Gap detectado — `justificativa` sempre null no caminho normal** | No código (linha ~372) `diagIA.justificativa = null` para todo excerpt classificado; só `erro_ia` preenche justificativa. PRD/US-001 pedem "justificativa da IA" persistida nos descartes. Verificar: o critério de aceite "registro de descarte contém justificativa da IA" **não é atendido** — a IA não retorna campo justificativa no JSON e o código não o mapeia. Reportar ao Code Review/Stack | [AUTO] |

---

## 3. Permissões / RLS

| # | Cenário | Resultado esperado | Tipo |
|---|---------|--------------------|------|
| 3.1 | SELECT com `anon` key em `diagnostico_coleta` | **sucesso** — leitura pública (policy `diagnostico_select_public` `using(true)` p/ anon, authenticated) | [AUTO] |
| 3.2 | INSERT com `anon` key | **falha** (sem policy de INSERT para anon; RLS bloqueia) | [AUTO] |
| 3.3 | UPDATE com `anon` key | **falha** (sem policy de UPDATE para anon) | [AUTO] |
| 3.4 | DELETE com `anon` key | **falha** (sem policy de DELETE para anon) | [AUTO] |
| 3.5 | INSERT/UPDATE com `service_role` (usado pelo coletor) | **sucesso** — service_role bypassa RLS; é como o coletor grava | [AUTO] |
| 3.6 | RLS habilitado na tabela | `relrowsecurity=true` em `pg_class WHERE relname='diagnostico_coleta'` | [AUTO] |

---

## 4. Integração backend

| # | Cenário | Resultado esperado | Tipo |
|---|---------|--------------------|------|
| 4.1 | Edge Function deployada no remoto | `npx supabase functions list` mostra `coletar-querido-diario`; invocação retorna 200 (não 404) | [MANUAL] |
| 4.2 | pg_cron job criado | `SELECT jobname, schedule, active FROM cron.job WHERE jobname='cron-querido-diario'` → 1 linha, schedule `'0 */12 * * *'`, `active=true` | [AUTO] |
| 4.3 | Migration de cron idempotente | aplicar 2x → `count(*) FROM cron.job WHERE jobname='cron-querido-diario'` = 1 (unschedule antes de schedule) | [AUTO] |
| 4.4 | Cron dispara via pg_net com auth do Vault | service_role_key cadastrada: `SELECT name FROM vault.decrypted_secrets WHERE name='service_role_key'` retorna 1 linha; sem ela, o `Bearer ` fica vazio e a function rejeita | [MANUAL] |
| 4.5 | Cron e coletor PNCP coexistem | `SELECT jobname FROM cron.job` lista ambos os jobs sem conflito (jobs independentes) | [AUTO] |
| 4.6 | Execução real do cron grava telemetria | após o job rodar (ou disparo manual via `SELECT net.http_post(...)`), `diagnostico_coleta` recebe novas linhas com `fonte='querido-diario'` | [MANUAL] |
| 4.7 | Índices existem e são usados | `EXPLAIN SELECT ... WHERE score BETWEEN 30 AND 49` usa `idx_diagnostico_score`; `ORDER BY created_at DESC` usa `idx_diagnostico_created`; `WHERE motivo_descarte=$1` usa `idx_diagnostico_motivo` | [AUTO] |
| 4.8 | Constraint unique presente | `uq_diagnostico_fonte_hash` em `(fonte, excerpt_hash)` existe em `pg_constraint` | [AUTO] |
| 4.9 | CHECK de motivo_descarte | INSERT (via service_role) com `motivo_descarte='valor_invalido'` → falha pelo CHECK (só aceita os 4 valores + null) | [AUTO] |

---

## 5. Regressão

| # | Cenário | Resultado esperado | Tipo |
|---|---------|--------------------|------|
| 5.1 | Campos legados da resposta intactos | resposta ainda contém `ok`, `gazettesVarridas`, `candidatas`, `gravadas`, `descartadasRuido`, `erros`, `fonte`, `keywordsCount`, `params` — `diagnostico` é aditivo, não substitui | [AUTO] |
| 5.2 | Captura em `oportunidades` inalterada | excerpts capturados continuam gerando linha em `oportunidades` com `controle_pncp` `QD:<ibge>:<date>:<hash8>`, `fonte='querido-diário'`, `tags=['querido-diário']` (comportamento pré-feature) | [AUTO] |
| 5.3 | Coletor PNCP não afetado | `coletar-pncp` continua funcionando; nenhuma migration alterou tabelas/cron do PNCP | [MANUAL] |
| 5.4 | Build/typecheck do projeto | `npm run build` compila sem erros TS; Edge Function Deno sem erro de import (`statusFromScore`, `createClient`) | [AUTO] |
| 5.5 | Leitura de keywords/perfil inalterada | coletor ainda lê `keywords` (ativo) e `empresa_perfil` antes de classificar; sem essas tabelas usa fallback hardcoded (não quebra) | [AUTO] |

---

## Resumo

| Seção | Cenários | [AUTO] | [MANUAL] | [VISUAL] |
|-------|----------|--------|----------|----------|
| 1. Happy path | 6 | 5 | 1 | 0 |
| 2. Edge cases | 12 | 7 | 5 | 0 |
| 3. RLS | 6 | 6 | 0 | 0 |
| 4. Integração | 9 | 6 | 3 | 0 |
| 5. Regressão | 5 | 4 | 1 | 0 |
| **Total** | **38** | **28** | **10** | **0** |

## Prioridades para o QA

1. **Cenário 2.1 (0 de 30)** — é o motivo da feature existir. Validar que todos os 30 descartes têm motivo categorizado, nenhum silencioso.
2. **2.3 + 2.4** — fronteira do threshold (score 49 descarta, 50 captura). Confirma H1 e a regra `score < 50`.
3. **RLS 3.1-3.5** — anon lê, anon não escreve, service_role escreve. Bloqueante.
4. **2.9 (upsert idempotente)** — cron roda 2x/dia sobre janela sobreposta; sem isso a tabela duplicaria.
5. **Gap 2.12 (justificativa null)** — feedback obrigatório ao Code Review/Stack: o critério de aceite "descarte contém justificativa da IA" não é atendido pelo código atual.
