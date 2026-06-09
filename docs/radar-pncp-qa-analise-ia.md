# QA Report: Análise IA — Persistir/Carregar + Leitura Profunda

## Status: APROVADO

## Validação Estática
| Check | Resultado |
|-------|-----------|
| `tsc --noEmit` | Sem erros |
| `vite build` | Sem erros (267.56 kB JS gzip 81 kB) |

## Cenários Testados

### 1. Migration aplicada (colunas novas)
| Item | Resultado |
|------|-----------|
| GET `analises_ia?select=requisitos_tecnicos,prazos,criterio_julgamento` | PASSOU |
| Colunas existem, sem erro de coluna inexistente | Confirmado |
| Tipos corretos (jsonb para arrays, text para string) | Confirmado |

### 2. Análise profunda E2E (chamada real force=true)
**Oportunidade testada:** CREFITO 5a Região — `90601147000120-1-000021/2026`
(Pregão Eletrônico, SaaS, R$ 60.335,20)

| Item | Resultado | Evidência |
|------|-----------|-----------|
| HTTP 200, sem error | PASSOU | Status 200 |
| `textoChars` alto (profundidade) | PASSOU | **69.998 chars** (vs ~1.500 anterior sem leitura profunda) |
| `lidoDoPdf: true` | PASSOU | `true` |
| `requisitosTecnicos[]` presente | PASSOU | 3 itens: certificações, experiência SaaS, equipe |
| `prazos[]` presente | PASSOU | 2 itens: sessão pública 17/06/2026, validade 60 dias |
| `criterioJulgamento` presente | PASSOU | "Menor preço global" |
| Resumo mais longo e detalhado | PASSOU | 392 chars com contexto rico |
| `porQueCombina` detalhado | PASSOU | 4 itens detalhados |
| `porQueNao` detalhado | PASSOU | 2 itens com riscos reais |
| Sem timeout | PASSOU | Respondeu em **~42.5 segundos** |
| `cache: false` (análise nova) | PASSOU | Confirmado |
| `modelo: gpt-4o-mini` | PASSOU | Confirmado |
| `fontePdf` com URL PNCP | PASSOU | URL do arquivo do edital |

### 3. Persistência e cache
| Item | Resultado | Evidência |
|------|-----------|-----------|
| GET `analises_ia` por controle retorna análise | PASSOU | Linha com `score_ia=85`, todos os campos |
| Campos novos persistidos no banco | PASSOU | `requisitos_tecnicos`, `prazos`, `criterio_julgamento` presentes |
| POST sem force retorna `cache: true` | PASSOU | `cache: true` confirmado |
| Cache rápido (sem OpenAI) | PASSOU | **~1.0 segundo** (vs 42.5s da análise) |
| Cache preserva campos novos | PASSOU | Todos os 3 campos retornados |
| Cache preserva `textoChars` e `lidoDoPdf` | PASSOU | 69.998 chars, `lidoDoPdf: true` |

### 4. Carregamento no front (lógica Detail.tsx)
| Item | Resultado | Evidência |
|------|-----------|-----------|
| useEffect chama `fetchAnaliseSalva` ao abrir op | PASSOU | Linha 60-72: `useEffect([op.id])` → `fetchAnaliseSalva(op.pncp.controle).then(setIa)` |
| Carrega sem clique do usuário | PASSOU | Automático via useEffect |
| Selo "Analisada por IA em DD/MM/AAAA" | PASSOU | Linhas 194-197: exibe quando `analysisDate` existe |
| Botão "Reanalisar" quando há análise salva | PASSOU | Linhas 371-404: mostra "Analisado por IA ... reanalisar" com `onClick={() => runIA(true)}` |
| Botão "Analisar com IA" quando não há análise | PASSOU | Linhas 397-404: exibe quando `!ia` |
| `fetchAnaliseSalva` usa apenas anon key | PASSOU | ai.ts:53-58 usa `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` (sem OpenAI) |
| Backward-compat: análise antiga sem campos novos | PASSOU | Análise antiga (02928213000103) retorna `requisitos_tecnicos: []`, `prazos: []`, `criterio_julgamento: null` — fallbacks em ai.ts e Detail.tsx impedem crash |
| Cleanup correto no useEffect (cancelled flag) | PASSOU | Linha 67-71: `let cancelled = false; return () => { cancelled = true }` |

### 5. Build
| Item | Resultado |
|------|-----------|
| `npm run build` (tsc + vite) | PASSOU — sem erros TypeScript, sem warnings críticos |

### 6. Dev server
| Item | Resultado |
|------|-----------|
| localhost:5173 responde 200 | PASSOU |

## Resumo
| Cenário | Resultado |
|---------|-----------|
| 1. Migration (colunas novas) | PASSOU |
| 2. Análise profunda E2E | PASSOU |
| 3. Persistência e cache | PASSOU |
| 4. Carregamento no front | PASSOU |
| 5. Build | PASSOU |
| 6. Dev server | PASSOU |

## Métricas-Chave
- **textoChars antes (sem leitura profunda):** ~1.500
- **textoChars agora (leitura profunda):** **69.998** (46x mais texto)
- **Tempo análise real:** ~42.5s (inclui download PDFs + OpenAI)
- **Tempo cache:** ~1.0s (sem OpenAI)
- **Campos novos:** 3/3 presentes e funcionais

## Veredicto
QA **APROVADO**. Todos os 6 cenários passaram. A leitura profunda do edital está funcionando (69.998 chars vs ~1.500 anterior), os 3 campos novos são persistidos e carregados corretamente, o cache funciona sem chamar OpenAI, e a UI carrega automaticamente a análise salva sem clique do usuário.
