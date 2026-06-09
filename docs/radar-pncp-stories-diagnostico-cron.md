# User Stories: Modo Diagnostico + Agendamento Periodico

**Classificacao da demanda:** Feature media
**Fluxo:** PO (story) -> Data Architect -> Backlog -> Stack agent -> Code Review -> QA

---

## [Epico] Telemetria de Classificacao e Agendamento Automatico

**Outcome do epico:** Visibilidade total sobre o pipeline de classificacao IA do coletor Querido Diario + execucao periodica sem intervencao manual.
**Metricas:** 100+ registros de telemetria em 2 semanas; 0 descartes silenciosos; 2 execucoes automaticas por dia.

---

### US-001: Persistir resultado de classificacao para excerpts descartados

**Como** operador do Radar
**Quero** que todo excerpt descartado pela IA seja registrado numa tabela de telemetria com score, justificativa e dados extraidos
**Para** entender por que a IA esta descartando e identificar licitacoes que estao "quase passando" (score proximo do threshold)

**Contexto:** Hoje o coletor faz `continue` silencioso (linhas 295-298 do `coletar-querido-diario/index.ts`) quando `ehLicitacao=false` ou `relevante=false`. O operador so ve "0 capturados" sem saber por que. Esta story transforma o descarte silencioso em registro persistente.

**Criterios de Aceite — Happy Path:**
- [ ] Dado que a IA classificou um excerpt como `ehLicitacao=false`, quando o coletor processa o resultado, entao um registro e inserido em `diagnostico_coleta` com `capturado=false`, `motivo_descarte='nao_e_licitacao'`, score, justificativa e demais campos extraidos
- [ ] Dado que a IA classificou um excerpt como `relevante=false` (mas `ehLicitacao=true`), quando o coletor processa o resultado, entao um registro e inserido com `capturado=false`, `motivo_descarte='nao_relevante'`
- [ ] Dado que a IA classificou um excerpt com score < threshold (mas `ehLicitacao=true` e `relevante=true`), quando o coletor processa o resultado, entao um registro e inserido com `capturado=false`, `motivo_descarte='score_abaixo_threshold'`
- [ ] Dado que a IA retornou classificacao completa, quando o registro e inserido, entao os campos `objeto`, `orgao`, `modalidade`, `valor_estimado`, `prazo` sao persistidos (mesmo que null/vazio)

**Criterios de Aceite — Edge Cases e Erros:**
- [ ] Dado que a IA retorna erro ou timeout na classificacao de um excerpt, quando o coletor trata o erro, entao um registro e inserido com `capturado=false`, `motivo_descarte='erro_ia'`, `justificativa` com a mensagem de erro
- [ ] Dado que o INSERT na tabela de telemetria falha (ex: banco offline), quando o erro ocorre, entao o coletor loga o erro e continua processando os demais excerpts (nao interrompe a coleta)
- [ ] Dado que o mesmo excerpt ja foi processado em execucao anterior, quando o coletor tenta inserir novamente, entao usa upsert por `excerpt_hash` + `fonte` para evitar duplicatas (atualiza campos se houver mudanca)

**Requisitos Nao-Funcionais:**
- [ ] INSERT na telemetria adiciona no maximo 100ms por excerpt
- [ ] Sem credencial exposta (usa service_role existente do coletor)

**Fora do escopo desta story:**
- UI para visualizar os descartes (consulta via Supabase Dashboard)
- Ajuste dinamico de threshold
- Alertas automaticos

**Prioridade:** Alta
**Tamanho:** M (2-3d)
**Dependencias:** Tabela `diagnostico_coleta` criada (implica migration — inclusa nesta story ou em story de infra separada)

---

### US-002: Persistir resultado de classificacao para excerpts capturados

**Como** operador do Radar
**Quero** que todo excerpt capturado tambem seja registrado na tabela de telemetria
**Para** ter uma visao completa de todos os resultados da classificacao (capturados + descartados) e calcular taxas de captura por execucao

**Contexto:** US-001 cobre os descartados. Esta story garante que os capturados tambem alimentam a telemetria, permitindo analise completa (ex: "de 30 analisados, 2 capturados com score 65 e 72, 28 descartados com score medio 25").

**Criterios de Aceite — Happy Path:**
- [ ] Dado que a IA classificou um excerpt como capturavel (todas as condicoes passaram), quando o coletor grava em `oportunidades`, entao tambem insere em `diagnostico_coleta` com `capturado=true`, `motivo_descarte=null`
- [ ] Dado que o registro foi inserido na telemetria, quando consultado, entao contem os mesmos campos de classificacao: score, justificativa, objeto, orgao, modalidade, valor_estimado, prazo

**Criterios de Aceite — Edge Cases e Erros:**
- [ ] Dado que o INSERT em `oportunidades` falha mas o INSERT em `diagnostico_coleta` poderia ter sucesso, quando o erro ocorre, entao a telemetria reflete o estado real: nao registrar como `capturado=true` se o upsert em `oportunidades` falhou
- [ ] Dado que o INSERT na telemetria falha apos o INSERT em `oportunidades` ter sucesso, quando o erro ocorre, entao o coletor loga o erro — o edital esta salvo em `oportunidades` e a perda de telemetria e aceitavel (nao reverter)

**Requisitos Nao-Funcionais:**
- [ ] A ordem de operacao e: (1) upsert em `oportunidades`, (2) INSERT em `diagnostico_coleta` — telemetria nunca bloqueia o fluxo principal

**Fora do escopo desta story:**
- Transacao atomica entre oportunidades e diagnostico_coleta (overhead desnecessario; perda de telemetria e aceitavel)

**Prioridade:** Alta
**Tamanho:** P (<=1d)
**Dependencias:** US-001

---

### US-003: Criar tabela `diagnostico_coleta` com schema e RLS

**Como** operador do Radar
**Quero** uma tabela dedicada para armazenar telemetria de classificacao IA
**Para** que os registros de US-001 e US-002 tenham onde ser persistidos, com seguranca e indices adequados

**Contexto:** A tabela precisa armazenar dados de todas as fontes (Querido Diario hoje, potencialmente outras no futuro). O schema deve cobrir todos os campos que a IA retorna na classificacao.

**Criterios de Aceite — Happy Path:**
- [ ] Dado que a migration foi aplicada, quando a tabela `diagnostico_coleta` e consultada, entao existe com as colunas: `id` (uuid PK), `fonte` (text not null), `territory_id` (text), `gazette_date` (date), `excerpt_hash` (text not null), `eh_licitacao` (boolean), `relevante` (boolean), `score` (int), `justificativa` (text), `objeto` (text), `orgao` (text), `modalidade` (text), `valor_estimado` (numeric), `prazo` (text), `capturado` (boolean not null), `motivo_descarte` (text), `dados_brutos` (jsonb), `created_at` (timestamptz)
- [ ] Dado que RLS esta habilitado, quando um request com anon key tenta SELECT, entao sucesso (leitura publica)
- [ ] Dado que RLS esta habilitado, quando um request com anon key tenta INSERT/UPDATE/DELETE, entao falha (escrita so via service_role)
- [ ] Dado que a tabela tem indice em `score`, quando uma query `WHERE score BETWEEN 30 AND 49` e executada, entao usa index scan
- [ ] Dado que a tabela tem indice em `created_at`, quando uma query `ORDER BY created_at DESC` e executada, entao usa index scan
- [ ] Dado que a tabela tem constraint unique em `(fonte, excerpt_hash)`, quando um INSERT duplicado e tentado, entao o banco retorna conflict (permite upsert)

**Criterios de Aceite — Edge Cases e Erros:**
- [ ] Dado que a migration e idempotente, quando aplicada 2x, entao nao gera erro (usar IF NOT EXISTS)

**Requisitos Nao-Funcionais:**
- [ ] Migration atomica: CREATE TABLE + RLS + indices + constraint na mesma migration

**Fora do escopo desta story:**
- Trigger de updated_at (tabela e append-only no MVP — registros nao sao atualizados, exceto por upsert de reprocessamento)
- Poda automatica de registros antigos

**Prioridade:** Alta
**Tamanho:** P (<=1d)
**Dependencias:** Nenhuma (e pre-requisito de US-001 e US-002)

---

### US-004: Agendar coletor Querido Diario via pg_cron

**Como** operador do Radar
**Quero** que o coletor Querido Diario execute automaticamente a cada 12 horas via pg_cron
**Para** acumular volume de diarios analisados ao longo de semanas sem precisar disparar manualmente

**Contexto:** O coletor PNCP ja tem pg_cron configurado. O coletor Querido Diario depende de execucao manual. Licitacoes municipais de TI/IA sao raras — o volume precisa acumular com execucoes periodicas para gerar dados suficientes para calibrar thresholds.

**Criterios de Aceite — Happy Path:**
- [ ] Dado que a migration de cron foi aplicada, quando `SELECT * FROM cron.job WHERE jobname = 'cron-querido-diario'` e executado, entao retorna 1 linha com schedule `'0 */12 * * *'` (a cada 12h)
- [ ] Dado que o cron job disparou, quando a Edge Function `coletar-querido-diario` executa, entao processa diarios e grava resultados (em `oportunidades` e/ou `diagnostico_coleta` conforme US-001/002)
- [ ] Dado que o cron job esta ativo, quando 24h passam, entao o coletor executou 2 vezes automaticamente

**Criterios de Aceite — Edge Cases e Erros:**
- [ ] Dado que a Edge Function retorna erro (API Querido Diario fora do ar), quando o cron job detecta a falha, entao registra o erro no log do pg_cron e retenta na proxima execucao (sem retry imediato)
- [ ] Dado que a migration e aplicada pela 2a vez, quando executada, entao nao duplica o job (usar `cron.unschedule` + `cron.schedule` ou equivalente idempotente)
- [ ] Dado que o coletor PNCP ja tem seu proprio cron job, quando ambos os cron jobs existem, entao nao ha conflito (sao jobs independentes)

**Requisitos Nao-Funcionais:**
- [ ] A URL da Edge Function no pg_cron usa o endpoint publico do Supabase (`https://wqoaieuehgnnnpovwhpy.supabase.co/functions/v1/coletar-querido-diario`)
- [ ] Header `Authorization: Bearer <service_role_key>` no cron job (mesmo padrao do coletor-pncp)

**Fora do escopo desta story:**
- Configuracao de frequencia dinamica via UI
- Monitoramento/dashboard de execucoes do cron
- Retry automatico em caso de falha (pg_cron nao suporta nativamente; proxima execucao agendada cobre)

**Prioridade:** Alta
**Tamanho:** P (<=1d)
**Dependencias:** Nenhuma (pode ser feita em paralelo com US-001/002/003, desde que a Edge Function ja esteja deployada)

---

### US-005: Retornar estatisticas de diagnostico na resposta do coletor

**Como** operador do Radar
**Quero** que a resposta JSON do coletor inclua contadores de diagnostico (total analisados, capturados, descartados, distribuicao de motivos de descarte)
**Para** ter visibilidade imediata do resultado de cada execucao sem precisar consultar o banco

**Contexto:** Hoje a resposta do coletor retorna apenas `inseridos` e `erros`. Com o modo diagnostico, a resposta deve incluir metricas adicionais para analise rapida.

**Criterios de Aceite — Happy Path:**
- [ ] Dado que o coletor processou N excerpts, quando a resposta JSON e retornada, entao inclui campo `diagnostico` com: `total_analisados` (int), `capturados` (int), `descartados` (int), `motivos` (objeto com contadores: `nao_e_licitacao`, `nao_relevante`, `score_abaixo_threshold`, `erro_ia`)
- [ ] Dado que o coletor processou 30 excerpts com 2 capturados e 28 descartados, quando a resposta e lida, entao `diagnostico.total_analisados=30`, `diagnostico.capturados=2`, `diagnostico.descartados=28`
- [ ] Dado que entre os descartados ha 15 com `nao_e_licitacao` e 13 com `nao_relevante`, quando a resposta e lida, entao `diagnostico.motivos.nao_e_licitacao=15`, `diagnostico.motivos.nao_relevante=13`

**Criterios de Aceite — Edge Cases e Erros:**
- [ ] Dado que o coletor nao encontrou nenhum excerpt (API retornou vazio), quando a resposta e retornada, entao `diagnostico.total_analisados=0` e todos os contadores zerados
- [ ] Estado de loading: nao se aplica (endpoint sincrono)
- [ ] Estado de erro: se o coletor falhar antes de processar, a resposta de erro existente e mantida (sem campo `diagnostico`)

**Fora do escopo desta story:**
- Historico de estatisticas por execucao (fica na tabela `diagnostico_coleta` para consulta)
- UI para exibir as estatisticas

**Prioridade:** Media
**Tamanho:** P (<=1d)
**Dependencias:** US-001, US-002

---

## Resumo de Prioridades

| Story | Titulo | Prioridade | Tamanho | Dependencias |
|-------|--------|-----------|---------|--------------|
| US-003 | Tabela diagnostico_coleta | Alta | P | — |
| US-001 | Persistir descartes | Alta | M | US-003 |
| US-002 | Persistir capturas na telemetria | Alta | P | US-001 |
| US-004 | pg_cron agendamento | Alta | P | — |
| US-005 | Estatisticas na resposta | Media | P | US-001, US-002 |

## Proximo Agente Sugerido

**Data Architect** — ha tabela nova (`diagnostico_coleta`) que precisa de DDL formal, RLS, indices e migration. Em paralelo, o Backlog pode consumir estas stories.
