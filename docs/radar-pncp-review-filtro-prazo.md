# Code Review: Fix Filtro de Prazo Encerrado

## Status: Aprovado

## Objetivo
Filtrar editais com prazo de envio de propostas vencido, marcando-os como encerrados em vez de exibi-los como oportunidades ativas. Bug fix que afetava ~44% dos editais exibidos.

## Decisoes Validadas (compliance)
- [x] D1: Editais sem data de encerramento mantidos (encerrado=false) — `isEncerrado` retorna `false` quando `prazoISO` e null
- [x] D2: Coluna `encerrado boolean` separada, nao sobrescreve `status` — migration cria coluna propria
- [x] D3: Frontend oculta encerrados por padrao + toggle — `fetchOportunidades` filtra `encerrado=eq.false` por padrao; toggle no Dashboard remove filtro
- [x] D4: Ordenacao por urgencia opcional com nullslast — implementada em `db.ts` e no sort do Dashboard
- [x] D5: Querido Diario nao alterado — zero ocorrencias de `encerrado` no coletor QD

## Criterios de Aceite das Stories

### US-FP01 (Coletor)
- [x] `isEncerrado` verifica se `dataEncerramentoProposta` esta preenchido E se data e anterior a hoje
- [x] Prazo vencido → `encerrado = true` no payload de upsert
- [x] Prazo null → `encerrado = false`
- [x] Prazo futuro ou hoje → `encerrado = false` (comparacao `deadline < today` — igualdade nao e "encerrado")
- [x] Janela de busca (45 dias) inalterada
- [x] Editais encerrados continuam coletados (upsert normal), apenas marcados
- [x] Re-coleta atualiza `encerrado` via upsert on conflict
- [x] `urgente` recalculado: `!encerrado && isUrgente(prazoISO)` — edital encerrado nunca e urgente

### US-FP02 (Limpeza de dados existentes)
- [x] Migration faz `UPDATE SET encerrado = true WHERE data_encerramento IS NOT NULL AND data_encerramento::date < CURRENT_DATE`
- [x] Clausula `AND encerrado = false` evita re-processar
- [x] NAO deleta registros — apenas UPDATE
- [x] Editais sem `data_encerramento` (NULL) nao afetados — `NULL IS NOT NULL` e false em SQL
- [x] `updated_at = now()` atualizado no backfill
- [x] Comentario SQL com SELECT de preview para auditoria

### US-FP03 (Schema)
- [x] `ALTER TABLE ADD COLUMN IF NOT EXISTS encerrado boolean NOT NULL DEFAULT false` — idempotente
- [x] `CREATE INDEX IF NOT EXISTS idx_oportunidades_encerrado` — idempotente
- [x] Backfill na mesma migration — atomico
- [x] Nomeacao correta: `20260609000000_add_encerrado_flag.sql`

### US-FP04 (Frontend)
- [x] `fetchOportunidades` filtra `encerrado=eq.false` por padrao
- [x] Toggle "Mostrar encerrados" no Dashboard remove o filtro
- [x] Editais encerrados com opacidade reduzida (0.55) no card
- [x] Badge "Encerrado" (Pill danger) no card e no detalhe
- [x] Ordenacao "Prazo mais proximo" com `data_encerramento.asc.nullslast`
- [x] Estado vazio: mensagem adequada com sugestao de ativar "Mostrar encerrados"
- [x] `queryKey` do `useRadar` inclui `mostrarEncerrados` e `orderByPrazo` — invalida corretamente ao mudar toggle/sort
- [x] `RadarFilters` tipado com `mostrarEncerrados: boolean`

### US-FP05 (Querido Diario)
- [x] Nenhuma alteracao — confirmado por grep

## Pontos Positivos
- Boa separacao: flag `encerrado` ortogonal ao `status` de aderencia — preserva ambas dimensoes sem conflito
- `isEncerrado` e uma funcao pura e testavel, com comparacao date-only que evita problemas de hora/minuto
- Migration e 100% idempotente — segura para re-aplicacao
- `urgente` recalculado inteligentemente: `!encerrado && isUrgente(prazoISO)` — evita que um edital encerrado apareca como urgente
- Toggle de filtro no frontend e query-key no useRadar garantem reatividade correta
- Estado vazio tratado com UX orientadora ("Ative Mostrar encerrados para ver o historico")

## Compliance (codigo segue os docs?)

### Design & UI
- [x] Opacidade reduzida (0.55) para cards encerrados — visual diferenciado
- [x] Badge "Encerrado" com Pill tone danger
- [x] Toggle no filter bar com estilo consistente com "Urgentes"
- [x] Estado vazio com mensagem orientadora

### Arquitetura
- [x] Logica de data no coletor (server-side) — nao no frontend
- [x] Frontend so consome flag booleana — sem logica de data duplicada
- [x] `fetchOportunidades` aceita opcoes tipadas via `FetchOportunidadesOpts`
- [x] Hook `useRadar` propaga opcoes corretamente e inclui na queryKey

### Banco de Dados
- [x] Coluna com default — retrocompativel
- [x] Index para filtro `encerrado = false`
- [x] Backfill correto com clausula de seguranca

## Qualidade de Codigo

### Code Smells
- [x] Sem duplicacao significativa — `isEncerrado` definido uma vez no coletor
- [x] Sem god class — alteracoes distribuidas nos arquivos corretos

### Nomes e Legibilidade
- [x] `isEncerrado` — nome auto-explicativo
- [x] `mostrarEncerrados` — claro no contexto de filtro
- [x] `encerradoFilter` — explicito

### Complexidade
- [x] `isEncerrado` e 5 linhas — simples
- [x] Nenhum aumento de indentacao nos arquivos alterados
- [x] Sem funcoes acima do limite

### Performance
- [x] Index `idx_oportunidades_encerrado` cobre o filtro REST
- [x] Backfill com clausula `AND encerrado = false` — evita UPDATE desnecessario

### React Patterns
- [x] `queryKey` inclui novos parametros — evita stale data
- [x] Nenhum useEffect novo necessario para este fix
- [x] Nenhuma mutacao direta de estado

### Acoplamento
- [x] Frontend nao depende de logica de data — so consome flag booleana
- [x] Coletor calcula tudo server-side

## Seguranca
- [x] Nenhuma credencial exposta
- [x] Filtro server-side (coletor) — nao depende apenas do client
- [x] Migration nao deleta dados

## Regressao
- [x] Scoring e keywords inalterados no coletor — `computeAderencia`, `matchesKeywords`, `statusFromScore` intocados
- [x] Coletor Querido Diario inalterado
- [x] Dados demo incluem `encerrado: false` — fallback funciona
- [x] Mapper client-side (`pncp/mapper.ts`) seta `encerrado: false` — coerente (fallback proxy nao calcula encerramento)
- [x] Filtros existentes (modalidade, estado, faixaValor, aderencia, urgente) preservados sem alteracao logica
- [x] Tela de detalhe continua carregando analise IA normalmente

## Resumo de Problemas

### Blockers
Nenhum.

### Warnings
Nenhum.

### Suggestions
1. **Inconsistencia de texto badge:** OpportunityCard exibe "Encerrado", Detail exibe "Prazo encerrado" — padronizar para um ou outro (`src/components/OpportunityCard.tsx:64`, `src/screens/Detail.tsx:133`)
2. **Inconsistencia pre-existente no threshold de urgencia:** coletor server-side usa 5 dias (`coletor-pncp/index.ts:57`), mapper client-side usa 7 dias (`src/lib/pncp/mapper.ts:11`), dashboard exibe "prazo <= 7 dias" (`Dashboard.tsx:269`). Nao introduzido por este fix, mas gera confusao.
3. **`select=*` na query REST** (`db.ts:145`) traz todas as colunas incluindo `embedding` (potencialmente grande). Considerar selecionar apenas colunas necessarias para o frontend. Pre-existente, nao deste fix.

## Veredicto
Code Review aprovado. Zero blockers, zero warnings. 3 suggestions anotadas como pendencia tecnica (nenhuma introduzida por este fix). Pode avancar para o QA.
