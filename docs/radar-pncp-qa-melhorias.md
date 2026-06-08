# QA Report: Melhorias — Perfil editavel, Ordenacao e Filtros

## Status: PASSOU

## Validacao Estatica

| Check | Resultado |
|-------|-----------|
| `tsc --noEmit` | Sem erros |
| `vite build` | Sem erros (262 kB gzip 79 kB) |

## Build

```
npm run build → tsc --noEmit && vite build
1657 modules transformed, 0 erros, 0 warnings
```

## Dev Server

```
localhost:5173 → HTTP 200
```

---

## Cenario 1 — Perfil: seed + CRUD via anon

### 1.1 GET perfil singleton

```bash
GET /rest/v1/empresa_perfil?id=eq.00000000-0000-0000-0000-000000000001
  &select=razao_social,cnpj,area,portfolio_texto&limit=1
```

**Resultado:** HTTP 200, 1 linha retornada com dados seedados corretos:
- `razao_social`: "AI Solution Exp LTDA - ME"
- `cnpj`: "53.075.641/0001-71"
- `area`: "Automacoes, agentes de IA, integracoes e atendimento automatizado"
- `portfolio_texto`: texto completo do portfolio

**PASSOU**

### 1.2 PATCH perfil singleton

```bash
PATCH /rest/v1/empresa_perfil?id=eq.00000000-0000-0000-0000-000000000001
  Body: {"area": "QA_TEST_AREA_temporario"}
  Prefer: return=minimal
```

**Resultado:** HTTP 204 (sucesso sem corpo)

GET confirmacao: `{"area":"QA_TEST_AREA_temporario"}` — PATCH refletido.

Restauracao: PATCH de volta para valor original → HTTP 204
GET confirmacao: `{"area":"Automacoes, agentes de IA, integracoes e atendimento automatizado"}` — restaurado.

**PASSOU**

### 1.3 Singleton CHECK constraint

```bash
POST /rest/v1/empresa_perfil
  Body: {"id":"11111111-1111-1111-1111-111111111111", "razao_social":"Teste", ...}
```

**Resultado:** HTTP 400, mensagem:
```json
{"code":"23514","message":"new row for relation \"empresa_perfil\" violates check constraint \"empresa_perfil_id_check\""}
```

Constraint `empresa_perfil_id_check` funcionando — apenas o UUID singleton e aceito.

**PASSOU**

---

## Cenario 2 — Coletor le perfil do banco

```bash
POST /functions/v1/coletar-pncp?dias=3&paginas=1
  Authorization: Bearer $ANON_KEY
```

**Resultado:** HTTP 200
```json
{
  "ok": true,
  "varridos": 250,
  "oportunidades": 2,
  "upserted": 2,
  "perfilSource": "db",
  "keywordsSource": "db",
  "keywordsCount": 27
}
```

- `perfilSource: "db"` — coletor le portfolio da tabela `empresa_perfil` (nao do hardcoded)
- `keywordsSource: "db"` — keywords vem da tabela `keywords`
- `varridos: 250` — API PNCP respondeu (sem throttle)
- `oportunidades: 2` — 2 editais encontrados no periodo de 3 dias

**PASSOU**

---

## Cenario 3 — Ordenacao (logica + dados)

### 3.1 Query ao banco

`db.ts` linha 130: `order=data_publicacao.desc.nullslast` — ordena por data de publicacao decrescente com nulls por ultimo. Correto.

### 3.2 rowToEdital preenche ISO

`db.ts` linhas 78-79:
```typescript
publicadoISO: r.data_publicacao?.slice(0, 10) || undefined
prazoISO: r.data_encerramento?.slice(0, 10) || undefined
```

Extrai YYYY-MM-DD do ISO. Correto.

### 3.3 Ordenacao no Dashboard usa ISO

`Dashboard.tsx` linha 99: `(b.publicadoISO ?? '').localeCompare(a.publicadoISO ?? '')` — compara strings ISO (YYYY-MM-DD), nao a string dd/mm formatada. Correto.

### 3.4 Prazo mais proximo joga nulls por ultimo

`Dashboard.tsx` linhas 106-113:
```typescript
if (!a.prazoISO && !b.prazoISO) return 0
if (!a.prazoISO) return 1   // null → final
if (!b.prazoISO) return -1  // null → final
return a.prazoISO.localeCompare(b.prazoISO)
```

Nulls por ultimo, deadline mais proxima primeiro. Correto.

### 3.5 Default = "Mais recentes"

`App.tsx` linha 45: `useState<SortId>('recentes')` — default correto.

`Dashboard.tsx` linha 89: primeira opcao do SORT_OPTIONS e `{ id: 'recentes', label: 'Mais recentes' }`.

**PASSOU**

---

## Cenario 4 — Filtros (logica)

### 4.1 Combinaveis em AND

`Dashboard.tsx` `applyFilters` (linhas 140-149): cada filtro e um `if ... return false` encadeado — AND logico. Se qualquer filtro nao bate, o edital e excluido. Correto.

### 4.2 Opcoes de modalidade/UF derivadas dos dados

`Dashboard.tsx` linhas 219-225:
```typescript
const modalidadeOptions = [...new Set(editais.map(e => e.modalidade).filter(Boolean))].sort()
const estadoOptions = [...new Set(editais.map(e => e.estado).filter(Boolean))].sort()
```

Derivadas dinamicamente dos dados carregados, ordenadas alfabeticamente. Correto.

### 4.3 Faixas de valor sem gap/sobreposicao

```
[0, 50000)  →  [50000, 200000)  →  [200000, 1000000)  →  [1000000, +inf)
```

`matchesFaixaValor` usa `>= min && < max`. Cobertura contínua sem gap nem sobreposicao. Correto.

### 4.4 Aderencia mapeia status

`ADERENCIA_OPTIONS` valores: `forte`, `boa`, `possivel` — mapeiam 1:1 para `EditalStatus` em `types.ts`. O filtro compara `e.status !== filters.aderencia`. Correto.

### 4.5 "Limpar" reseta

`Dashboard.tsx` linhas 354-376: botao "Limpar" chama `setFilters(EMPTY_FILTERS)` onde `EMPTY_FILTERS = { modalidade: '', estado: '', faixaValor: '', aderencia: '', urgente: null }`. Correto.

### 4.6 Contagem bate

`Dashboard.tsx` linhas 396-400: exibe `list.length editais encontrados` quando filtros ativos. `list` e derivado de `applyFilters(ativos, filters)` + `applySorting`. A contagem reflete os filtros aplicados. Correto.

### 4.7 Busca textual coexiste

`App.tsx` linha 131: `applySearch(allEditais, search).filter(byKeyword)` acontece antes de passar `activeEditais` ao Dashboard. O Dashboard aplica filtros sobre essa lista ja filtrada por busca. Busca + filtros coexistem. Correto.

### 4.8 Reset ao navegar para "Radar"

`App.tsx` linhas 148-150:
```typescript
if (id === 'radar') {
  setRadarFilters({ modalidade: '', estado: '', faixaValor: '', aderencia: '', urgente: null })
}
```

Filtros resetados ao navegar para Radar. Correto.

### 4.9 "Urgentes" pre-aplica

`App.tsx` linhas 143-146:
```typescript
if (id === 'urgentes') {
  setRoute('radar')
  setRadarFilters({ modalidade: '', estado: '', faixaValor: '', aderencia: '', urgente: true })
}
```

Navegar via sidebar "Urgentes" vai para Radar com filtro urgente pre-aplicado. Correto.

**PASSOU**

---

## Cenario 5 — Build

```
npm run build → tsc --noEmit && vite build → 0 erros
```

**PASSOU**

---

## Cenario 6 — Dev server

```
localhost:5173 → HTTP 200 (node PID 67502)
```

**PASSOU**

---

## Cenario 7 — Regressao

### 7.1 Dead code FilterId removido

```bash
grep -rn "FilterId" src/ → 0 resultados
```

**PASSOU**

### 7.2 Counts da sidebar intactos

`App.tsx` linhas 123-128:
```typescript
const activeAll = allEditais.filter(e => !isDismissed(e.id) && e.status !== 'baixa')
const counts = {
  radar: activeAll.length,
  urgentes: activeAll.filter(e => e.urgente).length,
  descartados: allEditais.filter(e => isDismissed(e.id) || e.status === 'baixa').length,
}
```

Counts independentes da busca/filtros. Correto.

### 7.3 byKeyword intacto

`App.tsx` linha 72: `keywords.length === 0 || matchesKeywords(e.titulo, keywords)` — sem keywords monitoradas, mostra tudo; com keywords, filtra por titulo. Correto.

**PASSOU**

---

## Cenario extra — Form de perfil (ConfigScreen)

- 4 campos editaveis: razao_social, cnpj, area, portfolio_texto
- Estado sincronizado com hook `useEmpresaPerfil` via `useEffect` (linha 70-78)
- `empDirty` flag controla habilitacao do botao "Salvar" (so ativa apos editar)
- `handleEmpresaSave` envia PATCH com `mutate()` e mostra toast de sucesso/erro
- `invalidateQueries` no `onSuccess` do mutation recarrega dados do banco

**PASSOU**

---

## Resumo

| # | Cenario | Metodo | Resultado |
|---|---------|--------|-----------|
| 1 | Perfil — GET singleton | curl REST | PASSOU |
| 1 | Perfil — PATCH + confirmacao | curl REST | PASSOU |
| 1 | Perfil — Singleton CHECK | curl REST | PASSOU |
| 2 | Coletor le perfil do banco | curl Edge Function | PASSOU |
| 3 | Ordenacao por ISO + nulls last | Leitura de logica | PASSOU |
| 4 | Filtros combinaveis AND | Leitura de logica | PASSOU |
| 4 | Faixas de valor sem gap | Leitura de logica | PASSOU |
| 4 | Reset ao navegar / Urgentes pre-aplica | Leitura de logica | PASSOU |
| 5 | Build | npm run build | PASSOU |
| 6 | Dev server | curl localhost:5173 | PASSOU |
| 7 | Regressao (FilterId, counts, byKeyword) | grep + leitura | PASSOU |

## Dados de teste restaurados

- `area` do perfil: restaurado para valor original apos teste CRUD

## Veredicto Final

**PASSOU** — todas as 3 frentes (perfil editavel, ordenacao, filtros) estao funcionando corretamente. Build limpo, dev server rodando, coletor lendo perfil do banco (`perfilSource: "db"`, `keywordsSource: "db"`), singleton protegido por CHECK constraint, ordenacao por ISO com nulls-last, filtros combinaveis sem gap/sobreposicao, reset e pre-aplicacao de urgentes corretos, zero dead code.
