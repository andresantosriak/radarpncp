# Code Review: Sprint 1 — Telemetria e Agendamento

## Status: APROVADO COM RESSALVAS

## Objetivo do Sprint
Todo excerpt analisado pelo coletor Querido Diario gera registro em `diagnostico_coleta` (capturado ou descartado, com score/justificativa/motivo). pg_cron executa o coletor automaticamente a cada 12h. Resposta JSON inclui estatisticas de diagnostico.

## Criterio de Saida
- [x] Migration aplicada com tabela + RLS + indices funcionais
- [x] Coletor persiste todos os resultados na telemetria sem regressao no fluxo de capturas
- [x] pg_cron job ativo e executando
- [x] Resposta JSON com campo `diagnostico` populado
- [x] Build compila sem erros TypeScript

## Tasks Validadas
| Task | Status | Observacao |
|------|--------|------------|
| 1.1: Migration diagnostico_coleta | OK | Schema identico ao Data Architecture, RLS + indices corretos |
| 1.2: Persistir descartes | Ressalva | Justificativa da IA nao persistida (sempre null); ver W1 |
| 1.3: Persistir capturas | Ressalva | Falha de upsert em oportunidades nao persiste em diagnostico_coleta; ver W2 |
| 1.4: pg_cron job | OK | Idempotente, Vault, schedule correto |
| 1.5: Estatisticas na resposta | Ressalva | Soma de motivos pode divergir de descartados; ver W3 |

## Criterios de Aceite das Stories
- [x] US-003 CA: Tabela existe com todas as colunas — OK
- [x] US-003 CA: RLS habilitado, SELECT anon+authenticated — OK
- [x] US-003 CA: Sem policies INSERT/UPDATE/DELETE para anon — OK
- [x] US-003 CA: Constraint unique (fonte, excerpt_hash) — OK
- [x] US-003 CA: CHECK constraint motivo_descarte (4 valores + null) — OK
- [x] US-003 CA: 5 indices criados — OK
- [x] US-003 CA: Migration idempotente (IF NOT EXISTS) — OK
- [x] US-001 CA: ehLicitacao=false gera motivo nao_e_licitacao — OK
- [x] US-001 CA: relevante=false gera motivo nao_relevante — OK
- [x] US-001 CA: score < 50 gera motivo score_abaixo_threshold — OK
- [x] US-001 CA: Erro IA gera motivo erro_ia com justificativa — OK
- [ ] US-001 CA: "Todos os campos de classificacao persistidos: score, justificativa" — justificativa sempre null (ver W1)
- [x] US-001 CA: Campos de contexto do diario persistidos — OK
- [x] US-001 CA: Upsert por (fonte, excerpt_hash) para idempotencia — OK
- [x] US-001 CA: Falha no INSERT de telemetria nao interrompe o loop — OK
- [x] US-002 CA: Captura persiste em diagnostico_coleta com capturado=true — OK
- [x] US-002 CA: Upsert em oportunidades falha -> nao marca capturado=true — OK
- [ ] US-002 CA: Falha de upsert em oportunidades deveria persistir descarte na telemetria — nao persiste (ver W2)
- [x] US-004 CA: Job criado com schedule 0 */12 * * * — OK
- [x] US-004 CA: net.http_post com URL correta — OK
- [x] US-004 CA: Auth via Vault — OK
- [x] US-004 CA: Idempotente (unschedule + schedule) — OK
- [x] US-005 CA: Campo diagnostico na resposta com contadores — OK
- [ ] US-005 CA: "Soma de diagnostico.motivos.* = diagnostico.descartados" — pode divergir quando upsert em oportunidades falha (ver W3)
- [x] US-005 CA: Contadores calculados em memoria sem query extra — OK

## Pontos Positivos
- Excelente organizacao do coletor: separacao clara entre diagBase (contexto) e diagIA (classificacao), com spread operator limpo
- `persistDiagnostico()` com try/catch isolado garante que falha de telemetria nunca quebra o loop principal — decisao acertada
- Logica de motivo_descarte segue prioridade correta (ehLicitacao > relevante > score) com cascata if/else-if/else
- Migration 100% fiel ao DDL do Data Architecture — zero divergencia
- pg_cron migration com idempotencia via unschedule + guard de existencia — padrao correto
- Uso de hash16 (16 hex) para excerpt_hash oferece melhor margem contra colisoes do que o hash8 original

## Compliance (codigo segue os docs?)

### Arquitetura
- [x] Codigo em ingles (variaveis, funcoes, tipos)
- [x] Edge Function segue padrao Deno existente (imports JSR, CORS, json helper)
- [x] service_role apenas no backend (Edge Function)
- [x] OPENAI_API_KEY apenas no backend
- [x] Sem credencial exposta no frontend

### Banco de Dados
- [x] RLS habilitado na diagnostico_coleta
- [x] Policy diagnostico_select_public: SELECT para anon + authenticated (policy unica — anti-pattern de OR evitado)
- [x] Sem policy INSERT/UPDATE/DELETE para anon/authenticated
- [x] Nomenclatura snake_case correta
- [x] Constraint unique (fonte, excerpt_hash) correta
- [x] CHECK constraint motivo_descarte com 4 valores + null
- [x] 5 indices criados conforme Data Architecture
- [x] pg_cron usa Vault para service_role_key (nao hardcoded)

### Seguranca
- [x] RLS habilitado em diagnostico_coleta
- [x] Sem policy de escrita aberta (INSERT/UPDATE/DELETE)
- [x] service_role_key via Vault no pg_cron (nao hardcoded na migration)
- [x] OPENAI_API_KEY e SERVICE_KEY acessados via Deno.env.get (nao expostos)
- [x] Sem policy DELETE/UPDATE aberta com USING true
- [x] Double submit irrelevante (endpoint backend, nao UI)

## Qualidade de Codigo

### Code Smells
- [x] Sem duplicacao significativa — diagBase/diagIA reutilizados via spread
- [x] Sem god function — persistDiagnostico isolada, classifyWithIA isolada
- [x] Sem dead code

### Nomes e Legibilidade
- [x] Nomes auto-explicativos: `persistDiagnostico`, `excerptHash`, `diagBase`, `diagIA`, `motivo`
- [x] Constantes tipadas: `diagnostico.motivos` com os 4 campos nomeados

### Complexidade
- [x] Funcoes dentro do limite (persistDiagnostico ~8 linhas, classifyWithIA ~30 linhas de logica)
- [x] Sem indentacao excessiva (maximo 3 niveis no loop principal)

### Performance
- [x] Sem queries N+1 — upsert individual por gazette e aceitavel (volume 15-30 por execucao)
- [x] Contadores calculados em memoria sem query extra ao banco
- [x] Hard ceiling em maxGazettes (30)

### React Patterns
- N/A (Edge Function backend, sem React)

### Acoplamento
- [x] Supabase acessado via client criado localmente (padrao Edge Functions)
- [x] statusFromScore importado de _shared/scoring.ts (reutilizacao correta)

## Regressao
- [x] Campos existentes da resposta JSON mantidos: ok, gazettesVarridas, candidatas, gravadas, descartadasRuido, erros, fonte, keywordsCount, params
- [x] Fluxo de captura em oportunidades inalterado (upsert com mesmos campos)
- [x] syntheticId e hash8 preservados para oportunidades.controle_pncp
- [x] Keywords/portfolio lidos do banco com fallback — comportamento existente mantido

## Resumo de Problemas

### Blockers
Nenhum.

### Warnings (deveria corrigir)

**W1 — Justificativa da IA nao persistida na telemetria**
- Arquivo: `supabase/functions/coletar-querido-diario/index.ts:373`
- O PRD e US-001 exigem "score, justificativa" persistidos. O prompt da IA (linhas 136-158) nao pede campo `justificativa` no JSON de resposta. A interface `IAResult` (linhas 54-63) nao inclui `justificativa`. No `diagIA` (linha 373), `justificativa` e fixada como `null`. Apenas o caso de `erro_ia` (linha 354) recebe justificativa com a mensagem de erro.
- Impacto: Todo descarte normal fica sem justificativa no banco — o operador nao consegue entender POR QUE a IA descartou, que era o proposito central da feature (PRD: "quero ver exatamente o que a IA analisou e por que descartou").
- Correcao sugerida: (a) Adicionar campo `justificativa` ao JSON pedido no prompt da IA, (b) incluir na interface `IAResult`, (c) parsear e persistir no `diagIA`.

**W2 — Falha de upsert em oportunidades nao persiste na telemetria**
- Arquivo: `supabase/functions/coletar-querido-diario/index.ts:446-451`
- Quando o upsert em `oportunidades` falha, o codigo incrementa `erros` e `diagnostico.descartados` mas NAO chama `persistDiagnostico()`. O registro some tanto de oportunidades quanto de diagnostico_coleta.
- Impacto: Telemetria incompleta — excerpts com erro de upsert em oportunidades ficam sem rastro no banco. Contradiz o objetivo de "persistir TODOS os resultados".
- Correcao sugerida: Chamar `persistDiagnostico()` no bloco else (linha 447) com `capturado: false` e `motivo_descarte: 'erro_ia'` (ou null, conforme preferencia). A justificativa pode conter `opError.message`.

**W3 — Soma de motivos pode divergir de descartados (inconsistencia nos contadores)**
- Arquivo: `supabase/functions/coletar-querido-diario/index.ts:448-449`
- US-005 CA exige: "Soma de diagnostico.motivos.* = diagnostico.descartados". Quando o upsert em oportunidades falha (linha 449), `diagnostico.descartados++` mas nenhum dos 4 contadores em `diagnostico.motivos` e incrementado. Resultado: soma dos motivos < descartados.
- Impacto: Contadores na resposta JSON ficam inconsistentes nesse cenario.
- Correcao sugerida: Incrementar `diagnostico.motivos.erro_ia` no bloco else (ou criar motivo novo se preferir) para manter a invariante.

### Suggestions (poderia melhorar)

**S1 — excerpt_hash usa hash16 em vez de hash8 (diverge do backlog, mas OK)**
- Arquivo: `supabase/functions/coletar-querido-diario/index.ts:319`
- O backlog (Task 1.2) especifica "excerpt_hash calculado via hash8() existente sobre g.url". O codigo usa `hash16()` (16 hex chars). O Data Architecture doc diz "sha256 truncado, 16 hex" — coerente com o Data Architect.
- Avaliacao: hash16 e mais seguro contra colisoes. A divergencia e com o backlog, nao com o schema. Nao e problema real.

**S2 — Campo `candidatas` na resposta tem semantica confusa**
- Arquivo: `supabase/functions/coletar-querido-diario/index.ts:457`
- `candidatas: candidates.length - descartadasRuido - erros` — este campo existia antes da feature e nao faz parte do escopo de revisao. Mas nota-se que com o novo campo `diagnostico`, ele se torna redundante (diagnostico.capturados tem a mesma informacao). Nao precisa corrigir agora.

**S3 — `catch (_)` silencioso em 3 pontos do loop de busca (linhas 224, 239, 264)**
- Esses catches silenciosos ja existiam antes da feature e sao aceitaveis para fallback. Nao sao regressao. Menciono apenas para registro.

## Veredicto
Code Review Sprint 1 encontrou 0 blockers e 3 warnings. Os warnings nao sao criticos para o funcionamento basico da feature (a telemetria persiste descartes e capturas corretamente no happy path), mas afetam a completude dos dados conforme especificado no PRD e nas stories. Stack agent deve corrigir W1, W2 e W3 antes de avancar para o QA.

ATRIBUICAO DE ORIGEM DOS PROBLEMAS:
- [W1] Justificativa nao persistida: Ninguem — erro de implementacao do Stack Agent. O PRD e as stories definem o campo claramente; o Stack Agent nao incluiu `justificativa` no prompt da IA nem na interface `IAResult`.
- [W2] Falha de upsert nao persiste na telemetria: Ninguem — erro de implementacao do Stack Agent. US-002 CA menciona o cenario ("Se o upsert em oportunidades falhar...") e o Stack Agent tratou o contador mas esqueceu de persistir o registro.
- [W3] Contadores inconsistentes: Ninguem — erro de implementacao do Stack Agent. Consequencia direta de W2 — ao nao categorizar o motivo do erro no contador, a invariante de US-005 quebra.
