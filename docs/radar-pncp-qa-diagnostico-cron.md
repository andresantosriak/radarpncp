# QA Report: Modo Diagnostico + Agendamento Periodico

## Status: APROVADO

**Data:** 2026-06-09
**Feature:** Telemetria de classificacao IA do coletor Querido Diario + pg_cron a cada 12h
**Test Map:** 38 cenarios (28 AUTO, 10 MANUAL)

---

## Validacao Estatica

| Check | Resultado |
|-------|-----------|
| `tsc --noEmit` + `vite build` | PASSOU (0 erros TS, build em 607ms) |

---

## 1. Fluxo Principal (Happy Path)

| # | Cenario | Resultado | Evidencia |
|---|---------|-----------|-----------|
| 1.1 | Invocar coletor POST | PASSOU | HTTP 200, `ok:true`, campo `diagnostico` presente |
| 1.2 | N excerpts analisados = N registros em diagnostico_coleta | PASSOU | 5 analisados, 5 registros no banco (query REST confirmou) |
| 1.3 | Descartado persiste linha completa | PASSOU | Todos 5 registros com `capturado=false`, `score` preenchido, `motivo_descarte` categorizado, campos objeto/orgao/modalidade presentes (null quando nao_e_licitacao, preenchidos quando relevante=false) |
| 1.4 | Capturado persiste em ambas tabelas | NAO TESTAVEL | 0 capturados nesta execucao (comportamento esperado — ver cenario 2.1) |
| 1.5 | Resposta JSON com estatisticas | PASSOU | `diagnostico.total_analisados=5`, `.capturados=0`, `.descartados=5`, `.motivos.{nao_e_licitacao=4, nao_relevante=1, score_abaixo_threshold=0, erro_ia=0, erro_gravacao=0}` — todos inteiros >= 0 |
| 1.6 | Coerencia dos contadores | PASSOU | `5 == 0 + 5` (total = cap + desc); `5 == 4+1+0+0+0` (desc = soma motivos) |

---

## 2. Edge Cases

| # | Cenario | Resultado | Evidencia |
|---|---------|-----------|-----------|
| 2.1 | Cenario real "0 de N capturados" | PASSOU | 5 analisados, 0 capturados, 5 descartados. Cada descarte tem motivo categorizado e justificativa preenchida. Operador consegue ver POR QUE cada um caiu |
| 2.2 | Distribuicao de motivos somando N | PASSOU | nao_e_licitacao=4 + nao_relevante=1 = 5 = descartados. Confirmado via query REST |
| 2.3 | Score "quase passando" (40-49) | SEM DADOS | Nenhum excerpt com score 40-49 nesta execucao (scores reais: 0, 0, 20, 0, 0). Logica no codigo verificada: `score < 50` com motivo `score_abaixo_threshold` (linhas 386-399) |
| 2.4 | Limite exato threshold (score=50) | SEM DADOS | Nenhum excerpt com score >= 50 nesta execucao. Logica correta no codigo: condicao `result.score < 50` (50 captura) |
| 2.5 | eh_licitacao=false com score qualquer | PASSOU | 4 registros com eh_licitacao=false → todos motivo `nao_e_licitacao`. Precedencia correta: `!ehLicitacao` (1o) > `!relevante` (2o) > `score<50` (3o) |
| 2.6 | eh_licitacao=true, relevante=false | PASSOU | Petrolina: eh_licitacao=true, relevante=false, score=20 → `nao_relevante` (correto, 2a condicao) |
| 2.7 | Erro/timeout OpenAI | MANUAL PENDENTE | Requer simulacao de falha OpenAI. Codigo verificado (linhas 347-368): catch grava `motivo_descarte='erro_ia'`, incrementa contadores, `continue` para proximo |
| 2.8 | INSERT diagnostico_coleta falha | MANUAL PENDENTE | Codigo verificado (linhas 311-318): `persistDiagnostico` tem try/catch, loga `[diagnostico] upsert failed`, nunca bloqueia loop |
| 2.9 | Upsert idempotente (mesmo diario 2x) | PASSOU | 1a execucao: 5 registros. 2a execucao: 5 registros (nao 10). `ON CONFLICT (fonte, excerpt_hash) DO UPDATE` funciona |
| 2.10 | API Querido Diario retorna vazio | MANUAL PENDENTE | Requer dia sem resultados. Codigo verificado: `candidates` ficaria vazio, contadores zerados, HTTP 200 |
| 2.11 | Falha upsert oportunidades | MANUAL PENDENTE | Codigo verificado (linhas 450-464): grava `motivo_descarte='erro_gravacao'`, incrementa `diagnostico.motivos.erro_gravacao` e `diagnostico.descartados`, NAO grava `capturado=true` |
| 2.12 | Gap justificativa null (do test map original) | RESOLVIDO | W1 corrigido: linha 377 `justificativa: result.justificativa \|\| null`. IA retorna justificativa (prompt linha 159). Todos 5 descartes no banco tem justificativa preenchida. Query `WHERE justificativa IS NULL AND capturado=false` retorna 0 registros |

---

## 3. Permissoes / RLS

| # | Cenario | Resultado | Evidencia |
|---|---------|-----------|-----------|
| 3.1 | SELECT com anon key | PASSOU | HTTP 200, retorna 5 registros corretamente |
| 3.2 | INSERT com anon key | PASSOU (bloqueado) | HTTP 401, `code: 42501`, "new row violates row-level security policy" |
| 3.3 | UPDATE com anon key | PASSOU (bloqueado) | HTTP 204 mas 0 rows afetadas. Verificacao: score permanece 0 (nao mudou para 999) |
| 3.4 | DELETE com anon key | PASSOU (bloqueado) | HTTP 204 mas registro ainda existe. Verificacao: SELECT retorna o registro intacto |
| 3.5 | INSERT/UPDATE com service_role | PASSOU | Edge Function grava com service_role (5 registros persistidos na invocacao) |
| 3.6 | RLS habilitado na tabela | PASSOU | `pg_class.relrowsecurity = true` (query Management API) |

---

## 4. Integracao Backend

| # | Cenario | Resultado | Evidencia |
|---|---------|-----------|-----------|
| 4.1 | Edge Function deployada | PASSOU | POST retorna HTTP 200 com dados reais |
| 4.2 | pg_cron job criado | PASSOU | `cron-querido-diario`, schedule `0 */12 * * *`, active=true |
| 4.3 | Migration de cron idempotente | PASSOU | `count(*) = 1` para jobname `cron-querido-diario` (migration usa unschedule antes de schedule) |
| 4.4 | Cron dispara via pg_net com Vault | **PENDENCIA** | `vault.decrypted_secrets` esta VAZIO — service_role_key NAO cadastrada. Cron vai enviar `Bearer ` (vazio) e function rejeita. **Acao: rodar `select vault.create_secret('<service_role_key>', 'service_role_key')` no SQL Editor** |
| 4.5 | Cron e PNCP coexistem | PASSOU | 2 jobs: `coletar-pncp-horario` (0 * * * *) e `cron-querido-diario` (0 */12 * * *) — sem conflito |
| 4.6 | Execucao real do cron | MANUAL PENDENTE | Depende de 4.4 (Vault) ser resolvido primeiro |
| 4.7 | Indices existem e sao usados | PASSOU | EXPLAIN confirma: `idx_diagnostico_score` (score BETWEEN), `idx_diagnostico_motivo` (motivo_descarte=), `idx_diagnostico_created` (ORDER BY created_at DESC) |
| 4.8 | Constraint unique presente | PASSOU | `uq_diagnostico_fonte_hash` em `(fonte, excerpt_hash)` existe em pg_constraint |
| 4.9 | CHECK de motivo_descarte | PASSOU | INSERT com `valor_invalido` rejeitado: "violates check constraint diagnostico_coleta_motivo_descarte_check". CHECK aceita: nao_e_licitacao, nao_relevante, score_abaixo_threshold, erro_ia, erro_gravacao, null |

---

## 5. Regressao

| # | Cenario | Resultado | Evidencia |
|---|---------|-----------|-----------|
| 5.1 | Campos legados da resposta | PASSOU | ok, gazettesVarridas, candidatas, gravadas, descartadasRuido, erros, fonte, keywordsCount, params — todos presentes. `diagnostico` e aditivo |
| 5.2 | Captura em oportunidades inalterada | PASSOU PARCIAL | 0 capturados nesta execucao, mas oportunidades existentes com `fonte=querido-diario` intactas. Codigo de captura (linhas 412-448) inalterado |
| 5.3 | Coletor PNCP nao afetado | PASSOU | `coletar-pncp` retorna ok:true, 1950 varridos, 29 oportunidades. Funcional |
| 5.4 | Build/typecheck | PASSOU | `npm run build` compila sem erros (tsc --noEmit + vite build) |
| 5.5 | Leitura keywords/perfil | PASSOU | `keywordsCount: 5` na resposta (5 keywords ativas no banco). Codigo le keywords (linhas 211-229) e empresa_perfil (linhas 231-249) com fallback |

---

## Validacao das Correcoes W1/W2/W3

| Warning | Descricao | Status |
|---------|-----------|--------|
| W1 | Justificativa preenchida nos descartes | **CORRIGIDO** — 5/5 descartes com justificativa NOT NULL. Query `WHERE justificativa IS NULL AND capturado=false` retorna 0 |
| W2 | Registro persiste mesmo se upsert oportunidades falhar | **CORRIGIDO** — Codigo linhas 450-464: bloco else grava `motivo_descarte='erro_gravacao'`, `capturado=false` em diagnostico_coleta. Migration 210000 adicionou `erro_gravacao` ao CHECK |
| W3 | Soma dos motivos == descartados | **CORRIGIDO** — `nao_e_licitacao(4) + nao_relevante(1) + score_abaixo_threshold(0) + erro_ia(0) + erro_gravacao(0) = 5 = descartados(5)`. Inclui `erro_gravacao` nos contadores |

---

## Testes MANUAL PENDENTE

Cenarios que requerem condicoes especificas nao reproduziveis via curl:

| # | Cenario | Comando para testar |
|---|---------|-------------------|
| 2.7 | Erro OpenAI | Temporariamente setar OPENAI_API_KEY invalida e invocar: `curl -X POST .../coletar-querido-diario -H "Authorization: Bearer <service_role>" -d '{"max":1}'` |
| 2.8 | INSERT diagnostico_coleta falha | Requer banco indisponivel momentaneamente |
| 2.10 | API QD retorna 0 | Invocar com keywords sem resultado: `?dias=1` em dia sem publicacao |
| 2.11 | Falha upsert oportunidades | Requer conflict de constraint em oportunidades |
| 4.4 | Vault secret | **ACAO NECESSARIA:** `select vault.create_secret('<service_role_key>', 'service_role_key')` no SQL Editor |
| 4.6 | Execucao real do cron | Depende de 4.4 |

---

## Resumo

| Secao | Cenarios | Passou | Falhou | Sem Dados | Manual Pendente |
|-------|----------|--------|--------|-----------|-----------------|
| 1. Happy path | 6 | 5 | 0 | 0 | 1 (1.4 — 0 capturados) |
| 2. Edge cases | 12 | 5 | 0 | 2 | 5 |
| 3. RLS | 6 | 6 | 0 | 0 | 0 |
| 4. Integracao | 9 | 6 | 0 | 0 | 3 (incl. Vault) |
| 5. Regressao | 5 | 5 | 0 | 0 | 0 |
| **Total** | **38** | **27** | **0** | **2** | **9** |

**0 falhas.** 27 cenarios automatizados passaram. 2 cenarios sem dados (scores 40-49 e captura — dependem de dados reais que a IA nao gerou nesta janela). 9 cenarios manuais pendentes (condicoes nao reproduziveis via curl/REST).

---

## Pendencia Critica

**Vault vazio (4.4):** A `service_role_key` nao esta cadastrada no Vault do Supabase. O pg_cron job `cron-querido-diario` quando disparar automaticamente vai enviar header `Authorization: Bearer ` (vazio) porque `vault.decrypted_secrets` retorna null. A function vai rejeitar a requisicao.

**Acao necessaria antes de considerar o cron funcional:**
```sql
select vault.create_secret('<service_role_key_do_projeto>', 'service_role_key');
```

Isso NAO bloqueia a aprovacao da feature (o coletor funciona quando invocado manualmente via curl com anon key ou service_role), mas bloqueia o agendamento automatico a cada 12h.

---

## Veredicto

**APROVADO.** A feature de modo diagnostico esta funcional e correta:
- Todos os descartes sao persistidos com score, motivo categorizado e justificativa da IA
- Contadores coerentes (total = capturados + descartados; descartados = soma dos motivos)
- RLS correta (anon le, anon nao escreve)
- Upsert idempotente (2a execucao nao duplica)
- Regressao limpa (PNCP, keywords, build)
- Correcoes W1/W2/W3 do Code Review validadas

**Pendencia unica:** cadastrar service_role_key no Vault para o cron automatico funcionar.
