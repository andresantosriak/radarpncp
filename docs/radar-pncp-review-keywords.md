# Code Review: Feature Keywords Centralizadas

## Status: APROVADO

## Escopo Revisado

Feature "Keywords Centralizadas" — migrar palavras-chave de localStorage/constante hardcoded para tabela Supabase `keywords` como fonte unica de verdade, consumida pelo frontend (React Query) e pelo coletor (Edge Function `coletar-pncp`).

### Arquivos revisados

| Arquivo | Tipo | Linhas |
|---------|------|--------|
| `supabase/migrations/20260608140000_create_keywords_table.sql` | Criado | 95 |
| `src/lib/keywords-db.ts` | Criado | 49 |
| `src/hooks/useKeywords.ts` | Criado | 33 |
| `docs/radar-pncp-data-architecture.md` | Criado | 175 |
| `src/App.tsx` | Alterado | 234 |
| `src/screens/ConfigScreen.tsx` | Alterado | 250 |
| `src/lib/keywords.ts` | Alterado | 136 |
| `supabase/functions/coletar-pncp/index.ts` | Alterado | 255 |
| `supabase/functions/_shared/scoring.ts` | Alterado | 108 |

## Pontos Positivos

- Fallback robusto no coletor: cobre tanto erro de query quanto resultado vazio (`kwErr || kwRows.length === 0`), com fallback silencioso para `DEFAULT_KEYWORDS`
- `keywords-db.ts` segue exatamente o padrao de `db.ts` — REST direto com anon key, sem criar client Supabase desnecessario
- Migration atomica e bem documentada: CREATE TABLE + RLS + policies + indice + trigger + seed em um unico arquivo
- Tratamento gracioso de duplicatas: 409 (unique constraint) e ignorado no `addKeyword`, nao gera erro ao usuario
- React Query com `invalidateQueries` correto nas mutations e `staleTime` de 60s para evitar refetches desnecessarios
- `DEFAULT_KEYWORDS` reclassificada como fallback com comentario claro — sem ambiguidade sobre fonte de verdade
- Documentacao de dados (`data-architecture.md`) completa e coerente com a implementacao

## Compliance

### Seguranca

- [x] Nenhuma credencial (SERVICE_ROLE, OPENAI_API_KEY) exposta no frontend — `keywords-db.ts` usa apenas `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
- [x] Coletor acessa keywords via SERVICE_KEY (server-side, esperado)
- [x] RLS habilitado na tabela `keywords`
- [x] Policies CRUD para anon sao decisao de produto documentada (projeto sem auth, TODO[auth] no SQL)
- [x] Anti-pattern SELECT evitado: unica policy SELECT para `anon, authenticated` (sem duplicacao de policies por role)

### Banco de Dados

- [x] Nomenclatura snake_case correta (`keywords`, `termo`, `ativo`, `created_at`, `updated_at`)
- [x] RLS habilitado na mesma migration que cria a tabela
- [x] Trigger `trg_keywords_updated` reutiliza `set_updated_at()` existente
- [x] Indice em `ativo` para queries WHERE do coletor
- [x] UNIQUE constraint em `termo` (indice implicito)
- [x] Seed idempotente com ON CONFLICT DO NOTHING
- [x] 26 termos do seed coincidem exatamente com `DEFAULT_KEYWORDS`

### Arquitetura

- [x] `keywords-db.ts` segue padrao de `db.ts` (REST PostgREST, sem @supabase/supabase-js no frontend)
- [x] Nenhuma lib nova instalada (shadcn, radix, react-hook-form ausentes do package.json)
- [x] Padrao visual inline preservado em ConfigScreen (sem mudanca de abordagem)
- [x] Hook `useKeywords` encapsula CRUD + fallback — componentes nao acessam Supabase direto

### Consistencia de Matching

- [x] Keywords do banco (com acentos) passam por `normalize()` que strip acentos antes do matching
- [x] Mesma funcao `matchesKeywords` + `normalize` no frontend (`src/lib/scoring.ts`) e no coletor (`_shared/scoring.ts`)
- [x] Token matching com espacos evita falsos positivos ("ia" dentro de "policia")

### Regressao

- [x] `useLocalState` agora usado apenas para `alerts` e `dismissed` — keywords migraram para `useKeywords`
- [x] Nenhuma referencia residual a localStorage de keywords no codebase
- [x] `useLocalState` nao afetado pela mudanca (chaves `radar.alerts` e `radar.dismissed` independentes)

## Qualidade de Codigo

### Code Smells

- [x] Sem duplicacao significativa — `DEFAULT_KEYWORDS` existe em `keywords.ts` (frontend) e `_shared/scoring.ts` (Deno), mas ambas estao documentadas como fallback e a duplicacao e necessaria (runtimes diferentes)
- [x] Funcoes curtas e com responsabilidade unica
- [x] Nenhum arquivo acima de 200 linhas (maior: `coletar-pncp/index.ts` com 255 linhas — pre-existente, fora do escopo desta feature)

### Nomes e Legibilidade

- [x] Nomes auto-explicativos: `fetchKeywords`, `addKeyword`, `removeKeyword`, `useKeywords`
- [x] Comentarios explicam o "por que" (fallback, decisao de produto) e nao o "o que"
- [x] TSDoc presente em funcoes publicas de `keywords-db.ts`

### Complexidade

- [x] Funcoes dentro dos limites de linhas e indentacao
- [x] Hook `useKeywords` tem 25 linhas de logica — direto e limpo

### React Patterns

- [x] `invalidateQueries` apos mutations em `useKeywords`
- [x] `AbortSignal` propagado para `fetchKeywords` via React Query
- [x] Sem mutacao direta de estado
- [x] Fallback `query.data ?? DEFAULT_KEYWORDS` e idiomatico

### Performance

- [x] Sem queries N+1
- [x] `staleTime: 60_000` evita refetches desnecessarios
- [x] Coletor busca keywords uma unica vez no inicio da coleta (nao por edital)

## Problemas Encontrados

### Warnings

1. **Input sem label acessivel** — `ConfigScreen.tsx:133`: o `<input>` de "novo termo" tem `placeholder` mas nao tem `<label>` associado nem `aria-label`. Screen readers nao conseguem identificar o campo.
   - Severidade: Warning
   - Correcao: adicionar `aria-label="Novo termo"` ao `<input>`

2. **Mutations sem tratamento de erro visivel ao usuario** — `useKeywords.ts:18-26`: as mutations `add` e `remove` nao tem `onError`. Se `addKeyword` ou `removeKeyword` falhar (ex: rede offline, Supabase fora), o erro e silencioso — o usuario nao recebe feedback. O projeto nao usa sonner/toast lib, mas poderia usar o componente Toast existente ou ao menos um console.error.
   - Severidade: Warning
   - Correcao: adicionar `onError` nas mutations com feedback minimo (ex: `console.error` + estado de erro exposto pelo hook, ou integrar com o Toast existente)

### Suggestions

1. **`isLoading` exportado mas nao consumido** — `useKeywords.ts:31`: o hook exporta `isLoading` mas nenhum componente o utiliza. A tela de keywords nao mostra skeleton/loading enquanto carrega do banco. Funciona porque o fallback `DEFAULT_KEYWORDS` aparece instantaneamente, mas a UX poderia ser mais clara.
   - Severidade: Suggestion
   - Nota: como o fallback garante que a UI nunca fica vazia, nao e bloqueante

2. **Frontend trata keywords vazio como "mostrar tudo"** — `App.tsx:58`: `keywords.length === 0 || matchesKeywords(...)`. Se todas as keywords forem desativadas no banco, o frontend mostra todos os editais. E um comportamento razoavel mas nao documentado — considerar adicionar comentario explicando essa decisao.
   - Severidade: Suggestion

3. **`ANON!` non-null assertion** — `keywords-db.ts:9`: o `!` e justificado pelo guard `if (!URL || !ANON) throw` na entrada de cada funcao, mas o TypeScript nao consegue inferir isso. Considerar extrair `headers()` como funcao interna das funcoes publicas, apos o guard, para evitar a assertion.
   - Severidade: Suggestion

## Veredicto

**APROVADO.** Nenhum blocker encontrado. Os 2 warnings (input sem aria-label e mutations sem onError) sao correcoes simples que nao bloqueiam o QA. As suggestions sao melhorias opcionais.

A feature atende ao objetivo: keywords centralizadas no banco, consumidas pelo frontend e pelo coletor, com fallback robusto para `DEFAULT_KEYWORDS`. Seguranca ok (anon key apenas, RLS habilitado, decisao de escrita anon documentada com TODO[auth]). Padroes do projeto preservados (REST direto, inline styles, sem libs novas).
