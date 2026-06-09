# PRD: Modo Diagnostico do Coletor Querido Diario + Agendamento Periodico

**Status:** Aprovado
**Versao:** 1.0
**Data:** 2026-06-08

## TL;DR

Persistir TODOS os resultados da classificacao IA do coletor Querido Diario (incluindo descartados) numa tabela de telemetria, e agendar a execucao periodica do coletor via pg_cron — permitindo calibrar thresholds com dados reais e acumular volume ao longo de semanas sem intervencao manual.

## Problema

- O coletor Querido Diario foi executado 4 vezes pelo QA, analisou 30 diarios oficiais, e **0 foram capturados**. A IA (gpt-4o-mini) descarta tudo silenciosamente.
- Nao ha visibilidade sobre **por que** a IA descarta. O coletor faz `continue` silencioso (linhas 295-298) quando a classificacao retorna `ehLicitacao=false` ou `relevante=false`, sem persistir score, justificativa ou dados extraidos.
- Sem dados de descarte, e impossivel saber: (a) se o threshold esta alto demais, (b) se a IA esta classificando corretamente, (c) quais diarios estao "quase passando" (score 40-49).
- O coletor depende de execucao manual. Licitacoes municipais de TI/IA sao raras — o volume precisa acumular ao longo de semanas com execucoes periodicas automaticas.

## Personas e Jobs-to-be-Done

### Operador do Radar (Andre — unico usuario)

- **Perfil:** Desenvolvedor e operador do SaaS. Acompanha o pipeline de coleta, calibra parametros, analisa resultados.
- **Job:** Quando configuro um coletor novo e ele retorna 0 resultados, quero ver exatamente o que a IA analisou e por que descartou, para que eu possa ajustar thresholds e garantir que licitacoes relevantes nao estejam sendo perdidas.
- **Dores atuais:**
  - Zero visibilidade sobre descartes — so sabe que "nao capturou nada"
  - Precisa executar o coletor manualmente a cada teste
  - Nao sabe se o problema e no threshold, no prompt da IA, ou se realmente nao ha licitacoes relevantes
- **Ganhos esperados:**
  - Ver todos os resultados da classificacao (capturados + descartados) com score e justificativa
  - Identificar diarios "quase passando" (score proximo do threshold) para ajustar calibragem
  - Coletor rodando automaticamente, acumulando dados sem intervencao

## Hipoteses

| # | Hipotese | Metrica de validacao | Risco |
|---|----------|---------------------|-------|
| H1 | A IA esta descartando diarios que contem licitacoes de TI/IA porque o threshold (score >= 50) e muito restritivo para o volume municipal | Apos 1 semana de coleta com telemetria, havera diarios com score 30-49 que contem licitacoes relevantes | Medio |
| H2 | O agendamento periodico (a cada 12h) acumulara volume suficiente para calibrar thresholds em 1-2 semanas | Apos 2 semanas, havera 100+ registros na tabela de telemetria | Baixo |
| H3 | Os dados de telemetria (score, justificativa, campos extraidos) serao suficientes para decidir se o problema e no threshold ou no prompt | Com 50+ descartes registrados, sera possivel identificar padroes de descarte | Baixo |

## Validacao de Riscos (Cagan)

| Risco | Avaliacao | Mitigacao |
|-------|-----------|-----------|
| Valor | Alto — sem essa feature, o coletor e uma caixa-preta que descarta tudo sem explicacao | Dados de telemetria dao visibilidade imediata |
| Usabilidade | Baixo — a tabela e consultavel via Supabase Dashboard ou SQL direto; nao precisa de UI dedicada no MVP | Se necessario, UI futura de dashboard de telemetria |
| Viabilidade | Baixo — persistir dados no banco e adicionar pg_cron sao operacoes simples com Supabase | pg_cron ja esta habilitado (coletor-pncp usa) |
| Negocio | Baixo — custo marginal (armazenamento de texto + 1 chamada pg_cron a cada 12h) | Volume municipal e baixo; custo OpenAI ja existe |

## Story Map (resumo)

```
[Classificar diario]  ->  [Persistir resultado]  ->  [Agendar execucao]
       |                         |                          |
 IA analisa e retorna      Gravar na tabela            pg_cron job
 score + justificativa     (capturado ou descartado)    a cada 12h
```

MVP: Persistir todos os resultados da classificacao + agendar pg_cron
v1.1: Dashboard de telemetria no frontend (visualizar descartes, filtrar por score range)

## MVP — O que entra

| Feature | MoSCoW | Justificativa |
|---------|--------|---------------|
| Tabela `diagnostico_coleta` para persistir resultados da classificacao IA | Must | Sem isso, nao ha visibilidade sobre descartes |
| Coletor grava TODOS os resultados (capturados e descartados) na tabela | Must | E o nucleo da feature — transformar `continue` silencioso em registro persistente |
| Campos: fonte, territory_id, gazette_date, excerpt_hash, eh_licitacao, relevante, score, justificativa, objeto, orgao, modalidade, valor_estimado, prazo, capturado (bool), motivo_descarte | Must | Dados minimos para calibrar thresholds e entender descartes |
| pg_cron job para executar coletor Querido Diario a cada 12h | Must | Sem agendamento, o coletor depende de execucao manual |
| Indice em score (para queries de range tipo "score entre 30-49") | Must | Performance de queries de calibragem |

## Fora do MVP — O que fica pra depois

| Feature | Motivo de exclusao | Quando revisar |
|---------|--------------------|----------------|
| Dashboard de telemetria no frontend | MVP foca em coleta de dados; consulta via Supabase Dashboard ou SQL | Apos 2 semanas com dados acumulados |
| Ajuste dinamico de threshold via UI | Requer UI + logica de reprocessamento; premature sem dados | Apos calibragem manual com dados reais |
| Alertas de "diarios quase passando" | Nice-to-have; operador pode consultar SQL | Apos validar H1 |
| Dedup cross-fonte (PNCP x Querido Diario) | Decisao existente: aceitar duplicacao no piloto | Fase futura |

## Fluxo Principal (Happy Path)

1. pg_cron dispara o coletor `coletar-querido-diario` a cada 12h
2. Coletor busca diarios oficiais via API Querido Diario
3. Para cada excerpt encontrado, a IA classifica: `ehLicitacao`, `relevante`, `score`, `justificativa`, campos extraidos
4. **Se capturado** (score >= threshold): grava em `oportunidades` (comportamento atual) E grava em `diagnostico_coleta` com `capturado = true`
5. **Se descartado** (score < threshold OU ehLicitacao=false OU relevante=false): grava em `diagnostico_coleta` com `capturado = false` e `motivo_descarte` explicativo
6. Operador consulta `diagnostico_coleta` para analisar distribuicao de scores e motivos de descarte

## Metricas de Sucesso

| Metrica | Baseline | Meta | Prazo |
|---------|----------|------|-------|
| Registros de telemetria acumulados | 0 | 100+ | 2 semanas |
| Visibilidade sobre descartes | 0% (caixa-preta) | 100% (todo descarte justificado) | Imediato apos deploy |
| Execucoes automaticas por dia | 0 (manual) | 2 (a cada 12h) | Imediato apos pg_cron |
| Diarios "quase passando" identificados (score 30-49) | Desconhecido | Visivel nos dados | 1 semana |

## Criterios de Aceite do MVP

- [ ] Tabela `diagnostico_coleta` existe com RLS habilitado (SELECT anon; INSERT/UPDATE/DELETE service_role)
- [ ] Todo excerpt analisado pela IA gera um registro em `diagnostico_coleta`, seja capturado ou descartado
- [ ] Registro de descarte contem: score, justificativa da IA, motivo_descarte (qual condicao falhou), dados extraidos (objeto, orgao, modalidade, valor_estimado, prazo)
- [ ] Registro de captura contem os mesmos campos + `capturado = true`
- [ ] pg_cron job `cron-querido-diario` criado e ativo, executando a cada 12h
- [ ] Coletor continua funcionando normalmente para excerpts capturados (sem regressao)
- [ ] Build compila sem erros TypeScript

## Requisitos Nao-Funcionais

- **Performance:** INSERT na tabela de telemetria nao deve adicionar mais que 100ms por excerpt processado
- **Armazenamento:** A tabela de telemetria pode crescer livremente — nao ha SLA de poda no MVP (volume municipal e baixo)
- **Seguranca:** Telemetria segue o mesmo padrao RLS das demais tabelas (SELECT publico, escrita via service_role)

## Suposicoes e Restricoes

- **Suposicoes:**
  - pg_cron ja esta habilitado no Supabase (o coletor PNCP ja usa)
  - O volume de diarios municipais e baixo o suficiente para nao causar problema de custo com OpenAI (estimativa: 10-30 excerpts por execucao, 2x ao dia = 20-60 classificacoes/dia)
  - A API Querido Diario continuara disponivel e estavel
- **Restricoes:**
  - Sem auth — RLS segue padrao anon do projeto
  - Nao ha UI dedicada no MVP — consulta via Supabase Dashboard ou SQL

## Riscos e Mitigacao

| Risco | Probabilidade | Impacto | Mitigacao |
|-------|--------------|---------|-----------|
| Volume de classificacoes gera custo OpenAI inesperado | Baixa | Medio | Monitorar custo nas primeiras 2 semanas; volume estimado e baixo (20-60/dia) |
| API Querido Diario fora do ar impede coleta | Baixa | Baixo | Coletor ja tem tratamento de erro; pg_cron retenta na proxima execucao |
| Tabela de telemetria cresce indefinidamente | Baixa (volume baixo) | Baixo | Implementar poda (DELETE WHERE created_at < 90 dias) em fase futura se necessario |

## Historico de Versoes

| Versao | Data | Mudanca |
|--------|------|---------|
| 1.0 | 2026-06-08 | Versao inicial |
