# Code Review: 3 Frentes — Perfil Editável, Ordenação, Filtros

## Status: APROVADO

## Escopo Revisado
- F1: Perfil editável (perfil-db.ts, useEmpresaPerfil.ts, ConfigScreen.tsx, App.tsx, coletar-pncp/index.ts)
- F2: Ordenação por data (types.ts, db.ts, Dashboard.tsx)
- F3: Filtros combináveis (Dashboard.tsx, App.tsx, Icon.tsx, types.ts)

## Pontos Positivos
- Ordenação usa `publicadoISO` / `prazoISO` (yyyy-mm-dd ISO) e NAO a string formatada dd/mm/yyyy — corretamente evita o bug classico de ordenacao lexicografica
- "Prazo mais proximo" trata nulls por ultimo (`!a.prazoISO → return 1`) — correto
- Fallback do coletor (coletar-pncp/index.ts:134-151) le `portfolio_texto` do banco com SERVICE_KEY e cai para const PERFIL se vazio/erro — corretamente defensivo
- Nenhuma credencial sensivel (SERVICE_ROLE_KEY, OPENAI_API_KEY) exposta no frontend — `grep` confirmou 0 matches em `src/`
- Faixas de valor sem gaps nem sobreposicao (0-50k, 50k-200k, 200k-1M, 1M+; limites com `>=min && <max`)
- Filtros combinaveis em AND (funcao `applyFilters` checa cada campo sequencialmente)
- Botao "Limpar" reseta para `EMPTY_FILTERS` — correto
- Contagem de filtrados exibida quando filtros ativos
- Migration atomica (CREATE TABLE + RLS + trigger + seed) — bem estruturada
- Singleton com CHECK constraint no id — previne multiplas linhas
- `updatePerfil` faz PATCH na linha singleton com `id=eq.00...01` + `Prefer: return=minimal` — correto e eficiente

## Compliance

### Arquitetura
- [x] Sem lib nova adicionada
- [x] Codigo em ingles (variaveis, funcoes, componentes)
- [x] UI em portugues (labels, botoes, mensagens)
- [x] Padroes existentes mantidos (REST PostgREST direto, mesmo padrao de keywords-db.ts)

### Banco de Dados
- [x] RLS habilitado na tabela empresa_perfil
- [x] Policies corretas para projeto sem auth (anon + authenticated)
- [x] Trigger updated_at reutiliza funcao existente
- [x] Seed idempotente via ON CONFLICT

### Seguranca
- [x] SERVICE_ROLE_KEY nao exposta no frontend
- [x] Frontend usa apenas ANON key
- [x] Coletor usa SERVICE_KEY apenas server-side (Edge Function)
- [x] Validacao basica no PATCH (throw se Supabase nao configurado)

## Qualidade de Codigo

### Code Smells
- [x] Sem duplicacao significativa
- [x] Funcoes com responsabilidade unica (applySorting, applyFilters, matchesFaixaValor separadas)

### Nomes e Legibilidade
- [x] Nomes auto-explicativos (applySorting, applyFilters, matchesFaixaValor, hasActiveFilters)
- [x] Constantes bem nomeadas (SORT_OPTIONS, FAIXA_VALOR_OPTIONS, ADERENCIA_OPTIONS, EMPTY_FILTERS)

### Complexidade
- [x] Dashboard.tsx tem ~420 linhas — acima do limite de 200, mas e componente visual com helpers internos coesos (nao e god class)
- [x] Funcoes de sorting e filtering estao no topo do arquivo, bem separadas

### Performance
- [x] Sem queries N+1
- [x] Derivacao de opcoes de filtro (modalidade/UF) via useMemo — correto
- [x] `select=*` em fetchOportunidades — pre-existente, nao introduzido nesta sprint

### React Patterns
- [x] useEffect com cleanup nao se aplica aqui (nenhum subscription novo)
- [x] Nenhuma mutacao direta de estado
- [x] Keys usam `o.id` (string unica) — correto
- [x] invalidateQueries no onSuccess e onError da mutation de perfil — correto
- [x] useEffect para sync do form com perfil depende de [perfil] — correto

### Acessibilidade
- [x] Inputs com label associado (wrapping `<label>`)
- [x] aria-label nos botoes de remover keyword
- [x] Botoes de alerta com aria-pressed

## Problemas Encontrados

### Warnings

1. **`FilterId` e dead code** — `src/lib/types.ts:77` define `FilterId = 'todos' | 'urgentes' | 'ia' | 'alto'` mas nenhum arquivo o importa/usa. Remanescente da implementacao anterior, substituido por `RadarFilters`.

2. **`isLoading` em vez de `isPending`** — `useEmpresaPerfil.ts:57` e `useKeywords.ts:39` exportam `query.isLoading`. No TanStack Query v5, `isLoading` existe mas foi redefinido como `isPending && isFetching` (loading do primeiro fetch). Funciona para o caso de uso atual (skeleton enquanto carrega), mas o nome canonico no v5 e `isPending`. Severidade rebaixada para suggestion pois funciona corretamente.

3. **`select=*` no fetchOportunidades** — `db.ts:130` busca todas as colunas. Editais tem campos como `embedding` (array de floats) que podem ser pesados. Pre-existente (nao introduzido nesta sprint), mas oportunidade de otimizar.

### Suggestions

1. **Dashboard.tsx acima de 200 linhas** (~420) — os helpers internos (applySorting, applyFilters, StatTile, selectStyle) poderiam ser extraidos para arquivos separados. Nao e urgente pois a coesao interna e boa.

2. **Sidebar "Urgentes" e filtro urgente no Dashboard** — Ao clicar "Urgentes" na sidebar (`App.tsx:143-147`), `setRoute('radar')` e `setRadarFilters({...urgente: true})` sao setados. Quando o usuario navega de volta clicando "Radar" na sidebar, os filtros persistem (urgente=true continua ativo). Nao e bug — o botao "Limpar" esta visivel — mas pode confundir o usuario. Considerar limpar filtros ao clicar "Radar" na sidebar.

3. **`isLoading` vs `isPending`** — como explicado acima, `isLoading` funciona no v5 para o caso atual, mas considerar migrar para `isPending` para seguir a convencao do v5.

4. **Remover `FilterId`** — dead code; remover para manter types.ts limpo.

## Regressao

- [x] Contagem da sidebar (counts.radar, counts.urgentes, counts.descartados) independente da busca — correto
- [x] Navegacao "Urgentes" na sidebar agora seta filtro urgente e redireciona para radar — funciona
- [x] byKeyword continua sendo aplicado sobre a lista buscada — correto
- [x] Descartados continua funcionando (filtro isDismissed)
- [x] StatTiles calculam sobre `ativos` (sem 'baixa') dentro do Dashboard — correto

## Veredicto

**Code Review APROVADO.** Nenhum blocker encontrado. Os 3 warnings sao todos pre-existentes ou de baixo impacto (dead code, naming convention v5, select=*). As 3 frentes (perfil editavel, ordenacao, filtros) estao implementadas corretamente e de forma defensiva. Pode avancar para o QA.

### Pendencias tecnicas (nao bloqueiam)
- Remover type `FilterId` (dead code)
- Considerar `select` explicito em fetchOportunidades (excluir embedding)
- Considerar extrair helpers do Dashboard.tsx para reduzir tamanho do arquivo
