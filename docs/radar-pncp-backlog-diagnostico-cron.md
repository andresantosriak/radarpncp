# Backlog — Modo Diagnostico + Agendamento Periodico (Querido Diario)

> Feature de telemetria e agendamento para o coletor Querido Diario. O coletor ja
> funciona mas descarta excerpts silenciosamente — esta feature persiste TODOS os
> resultados da classificacao IA (capturados + descartados) numa tabela dedicada
> `diagnostico_coleta` e agenda execucao automatica via pg_cron a cada 12h.
> O escopo e pequeno-medio: 1 migration, modificacao da Edge Function existente e
> 1 job pg_cron. Uma unica sprint cobre tudo — da tabela ao cron.

**Sprints (ordem de execucao):**
1. Sprint 1 — Telemetria e Agendamento (objetivo: persistir todos os resultados IA + pg_cron ativo)

**Gerado em:** 2026-06-08
**Baseado em:** PRD v1 (diagnostico-cron), Stories v1 (diagnostico-cron), Data Architecture v1

**Notas:**
- Stack: Vite + React 18 + TypeScript + Supabase (Edge Functions Deno + Postgres + pg_cron)
- Branch: feature/analise-ia-detalhada
- Projeto existente com codigo funcional — esta feature ADICIONA funcionalidade
- Sem autenticacao no projeto
- DDL completo da tabela `diagnostico_coleta` e do pg_cron job esta no data-architecture.md
- O coletor `coletar-querido-diario/index.ts` ja existe e sera MODIFICADO (nao criado do zero)

---

## Sprint 1 — Telemetria e Agendamento

**Objetivo da sprint:** Todo excerpt analisado pelo coletor Querido Diario gera registro em `diagnostico_coleta` (capturado ou descartado, com score/justificativa/motivo). pg_cron executa o coletor automaticamente a cada 12h. Resposta JSON inclui estatisticas de diagnostico.
**Pre-requisitos:** nenhum (projeto existente com coletor funcional)
**Definition of Done:** (1) Migration aplicada com tabela + RLS + indices funcionais; (2) Coletor persiste todos os resultados na telemetria sem regressao no fluxo de capturas; (3) pg_cron job ativo e executando; (4) Resposta JSON com campo `diagnostico` populado; (5) Build compila sem erros TypeScript.

### Task 1.1 — Criar migration da tabela diagnostico_coleta com RLS e indices

- **Tipo:** feat
- **Estimativa:** P
- **Prioridade:** alta
- **Dependencias:** nenhuma
- **Stories cobertas:** US-003
- **Arquivos esperados:** Criar: `supabase/migrations/20260608190000_create_diagnostico_coleta.sql`
- **Resultado esperado:** Tabela `diagnostico_coleta` criada com todas as colunas do schema (id, fonte, territory_id, gazette_date, excerpt_hash, territory_name, state_code, gazette_url, eh_licitacao, relevante, score, justificativa, objeto, orgao, modalidade, valor_estimado, prazo, capturado, motivo_descarte, dados_brutos, created_at), RLS habilitado com policy SELECT para anon/authenticated, constraint unique em (fonte, excerpt_hash), CHECK constraint em motivo_descarte (4 valores + null), e indices em created_at, motivo_descarte, score, fonte, capturado.
- **Criterios de aceite:**
  - [ ] Tabela `diagnostico_coleta` existe com todas as colunas do DDL do data-architecture.md
  - [ ] RLS habilitado: `alter table public.diagnostico_coleta enable row level security`
  - [ ] Policy `diagnostico_select_public` permite SELECT para anon e authenticated
  - [ ] Sem policies de INSERT/UPDATE/DELETE para anon (escrita so via service_role)
  - [ ] Constraint unique `uq_diagnostico_fonte_hash` em `(fonte, excerpt_hash)` (permite upsert idempotente)
  - [ ] CHECK constraint em `motivo_descarte` com valores: `nao_e_licitacao`, `nao_relevante`, `score_abaixo_threshold`, `erro_ia`, ou null
  - [ ] 5 indices criados: `idx_diagnostico_created`, `idx_diagnostico_motivo`, `idx_diagnostico_score`, `idx_diagnostico_fonte`, `idx_diagnostico_capturado`
  - [ ] Migration idempotente (usar `IF NOT EXISTS` em CREATE TABLE e indices)
  - [ ] Migration aplicada com `npx supabase db push` sem erros

### Task 1.2 — Persistir resultados de descarte na telemetria (coletor)

- **Tipo:** feat
- **Estimativa:** M
- **Prioridade:** alta
- **Dependencias:** Task 1.1
- **Stories cobertas:** US-001
- **Arquivos esperados:** Modificar: `supabase/functions/coletar-querido-diario/index.ts`
- **Resultado esperado:** Quando a IA classifica um excerpt e ele e descartado (ehLicitacao=false, relevante=false ou score < 50), o coletor insere um registro em `diagnostico_coleta` com `capturado=false` e `motivo_descarte` correto, em vez de fazer `continue` silencioso. O fluxo de capturas (gravacao em `oportunidades`) nao e afetado.
- **Criterios de aceite:**
  - [ ] Excerpt com `ehLicitacao=false` gera registro com `motivo_descarte='nao_e_licitacao'`
  - [ ] Excerpt com `relevante=false` (mas ehLicitacao=true) gera registro com `motivo_descarte='nao_relevante'`
  - [ ] Excerpt com `score < 50` (mas ehLicitacao=true e relevante=true) gera registro com `motivo_descarte='score_abaixo_threshold'`
  - [ ] Erro na classificacao IA (OpenAI timeout/falha) gera registro com `motivo_descarte='erro_ia'` e justificativa com mensagem de erro
  - [ ] Todos os campos de classificacao persistidos: score, justificativa, objeto, orgao, modalidade, valor_estimado, prazo
  - [ ] Campos de contexto do diario persistidos: fonte='querido-diario', territory_id, gazette_date, territory_name, state_code, gazette_url
  - [ ] `excerpt_hash` calculado via `hash8()` existente sobre `g.url` (mesma fonte estavel usada no syntheticId)
  - [ ] `dados_brutos` contem o excerpt original como JSONB (para debug)
  - [ ] Upsert por `(fonte, excerpt_hash)` para idempotencia em reprocessamento
  - [ ] Falha no INSERT de telemetria nao interrompe o loop — loga erro e continua processando demais excerpts
  - [ ] O `continue` silencioso das linhas 295-298 e substituido por INSERT na telemetria + continue

### Task 1.3 — Persistir resultados de captura na telemetria (coletor)

- **Tipo:** feat
- **Estimativa:** P
- **Prioridade:** alta
- **Dependencias:** Task 1.2
- **Stories cobertas:** US-002
- **Arquivos esperados:** Modificar: `supabase/functions/coletar-querido-diario/index.ts`
- **Resultado esperado:** Excerpts capturados (gravados em `oportunidades`) tambem geram registro em `diagnostico_coleta` com `capturado=true` e `motivo_descarte=null`. A telemetria reflete o estado real: so marca `capturado=true` se o upsert em `oportunidades` foi bem-sucedido.
- **Criterios de aceite:**
  - [ ] Apos upsert bem-sucedido em `oportunidades`, insere registro em `diagnostico_coleta` com `capturado=true`, `motivo_descarte=null`
  - [ ] Se o upsert em `oportunidades` falhar, NAO registra como `capturado=true` na telemetria (registrar como descarte com motivo adequado ou nao registrar)
  - [ ] Ordem de operacao: (1) upsert em `oportunidades`, (2) INSERT em `diagnostico_coleta` — telemetria nunca bloqueia o fluxo principal
  - [ ] Falha no INSERT de telemetria apos sucesso em `oportunidades` e aceitavel — loga erro e continua
  - [ ] Campos identicos aos de descarte: score, justificativa, objeto, orgao, modalidade, valor_estimado, prazo, dados de contexto do diario

### Task 1.4 — Criar migration do pg_cron job para agendamento a cada 12h

- **Tipo:** feat
- **Estimativa:** P
- **Prioridade:** alta
- **Dependencias:** nenhuma
- **Stories cobertas:** US-004
- **Arquivos esperados:** Criar: `supabase/migrations/20260608200000_cron_querido_diario.sql`
- **Resultado esperado:** pg_cron job `cron-querido-diario` criado com schedule `0 */12 * * *`, chamando a Edge Function `coletar-querido-diario` via `net.http_post` com auth via Vault (service_role_key).
- **Criterios de aceite:**
  - [ ] Job criado com `cron.schedule('cron-querido-diario', '0 */12 * * *', ...)`
  - [ ] Usa `net.http_post` para chamar `https://wqoaieuehgnnnpovwhpy.supabase.co/functions/v1/coletar-querido-diario`
  - [ ] Header `Authorization: Bearer` com service_role_key via `vault.decrypted_secrets` (ou literal com TODO[vault] para dev)
  - [ ] Header `Content-Type: application/json`
  - [ ] Body: `'{}'::jsonb`
  - [ ] Idempotente: `cron.unschedule('cron-querido-diario')` antes de `cron.schedule` (com guard de existencia)
  - [ ] Nao conflita com cron job existente do coletor PNCP (jobs independentes)
  - [ ] `SELECT * FROM cron.job WHERE jobname = 'cron-querido-diario'` retorna 1 linha apos aplicar migration
  - [ ] Migration aplicada com `npx supabase db push` sem erros
- **Acoes manuais do desenvolvedor:**
  - [ ] Verificar se `service_role_key` esta cadastrada no Vault do Supabase (`select * from vault.decrypted_secrets where name = 'service_role_key'`). Se nao estiver, cadastrar via Dashboard (Settings > Vault) ou `select vault.create_secret('<key>', 'service_role_key')`
  - [ ] Verificar se a Edge Function `coletar-querido-diario` esta deployada no Supabase remoto (`npx supabase functions deploy coletar-querido-diario`)

### Task 1.5 — Retornar estatisticas de diagnostico na resposta JSON do coletor

- **Tipo:** feat
- **Estimativa:** P
- **Prioridade:** media
- **Dependencias:** Task 1.2, Task 1.3
- **Stories cobertas:** US-005
- **Arquivos esperados:** Modificar: `supabase/functions/coletar-querido-diario/index.ts`
- **Resultado esperado:** A resposta JSON do coletor inclui campo `diagnostico` com contadores: total_analisados, capturados, descartados, e distribuicao de motivos de descarte (nao_e_licitacao, nao_relevante, score_abaixo_threshold, erro_ia).
- **Criterios de aceite:**
  - [ ] Resposta JSON contem campo `diagnostico` como objeto
  - [ ] `diagnostico.total_analisados` = total de excerpts processados pela IA
  - [ ] `diagnostico.capturados` = quantidade gravada em `oportunidades`
  - [ ] `diagnostico.descartados` = quantidade descartada (total - capturados)
  - [ ] `diagnostico.motivos` = objeto com contadores: `{ nao_e_licitacao: N, nao_relevante: N, score_abaixo_threshold: N, erro_ia: N }`
  - [ ] Soma de `diagnostico.motivos.*` = `diagnostico.descartados`
  - [ ] Se nenhum excerpt processado: `diagnostico.total_analisados=0` e todos contadores zerados
  - [ ] Campos existentes da resposta (`ok`, `gazettesVarridas`, `gravadas`, `descartadasRuido`, `erros`, `fonte`, etc.) continuam presentes e corretos (sem regressao)
  - [ ] Contadores calculados em memoria durante o loop (sem query extra ao banco)
