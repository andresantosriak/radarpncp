# QA Report: Keywords Centralizadas

## Status: PASSOU

## Validacao Estatica
| Check | Resultado |
|-------|-----------|
| `tsc --noEmit` | Sem erros |
| `vite build` | Sem erros (251.91 kB gzip 76.98 kB) |

## Cenarios Executados

### Cenario 1 — Seed: GET keywords ativas
| Item | Resultado |
|------|-----------|
| Comando | `GET /rest/v1/keywords?select=termo&ativo=eq.true&order=termo.asc` |
| Esperado | 26 termos ativos |
| Obtido | 26 termos ativos |
| Termos | aplicativo, assistente virtual, atendimento automatizado, atendimento digital, automacao, business intelligence, central de atendimento, chatbot, dashboard, desenvolvimento de sistema, gestao eletronica, informatica, integracao, integracao de sistemas, inteligencia artificial, licenciamento de software, plataforma, portal do cidadao, prontuario eletronico, SaaS, sistema, sistema de informacao, software, tecnologia da informacao, transformacao digital, workflow |
| Veredicto | **PASSOU** |

### Cenario 2a — INSERT via anon (RLS)
| Item | Resultado |
|------|-----------|
| Comando | `POST /rest/v1/keywords` body `{"termo":"qa-teste-termo-zzz"}` |
| HTTP | 201 Created |
| Verificacao | GET retornou 1 registro com `termo: qa-teste-termo-zzz` |
| Veredicto | **PASSOU** — anon consegue INSERT (RLS aberto) |

### Cenario 2b — DELETE via anon (RLS)
| Item | Resultado |
|------|-----------|
| Comando | `DELETE /rest/v1/keywords?termo=eq.qa-teste-termo-zzz` |
| HTTP | 204 No Content |
| Verificacao | GET retornou 0 registros (termo removido) |
| Veredicto | **PASSOU** — anon consegue DELETE (RLS aberto) |

### Cenario 2c — INSERT duplicado (unique constraint)
| Item | Resultado |
|------|-----------|
| Comando | `POST /rest/v1/keywords` body `{"termo":"software"}` (ja existe) |
| HTTP | 409 Conflict |
| Resposta | `duplicate key value violates unique constraint "keywords_termo_key"` |
| Veredicto | **PASSOU** — unique constraint funciona, 409 tratado graciosamente pelo frontend (keywords-db.ts ignora 409) |

### Cenario 3 — Integracao coletor (Edge Function coletar-pncp)
| Item | Resultado |
|------|-----------|
| Comando | `POST /functions/v1/coletar-pncp?dias=3&paginas=1` (sem semantico, sem analisar) |
| keywordsSource | `db` — leu da tabela keywords, nao do fallback |
| keywordsCount | `26` — todos os termos ativos |
| ok | `true` |
| varridos | 250 editais do PNCP |
| oportunidades | 2 matches encontrados |
| upserted | 2 gravados em oportunidades |
| Veredicto | **PASSOU** — cadeia ponta-a-ponta funciona (tabela keywords -> coletor -> scoring -> upsert) |

### Cenario 4 — Fallback do coletor (validacao por codigo)
| Item | Resultado |
|------|-----------|
| Arquivo | `supabase/functions/coletar-pncp/index.ts` linhas 117-131 |
| Logica | Inicializa com `DEFAULT_KEYWORDS` e `keywordsSource='fallback'`. Tenta ler tabela `keywords` (ativo=true). Se sucesso e nao-vazio, sobrescreve com dados do banco e marca `keywordsSource='db'`. Se falha, catch silencioso mantem fallback |
| Veredicto | **PASSOU** — fallback corretamente implementado |

### Cenario 5 — Build
| Item | Resultado |
|------|-----------|
| Comando | `npm run build` (`tsc --noEmit && vite build`) |
| Resultado | Build limpo, sem erros TypeScript, sem warnings |
| Output | dist/index.html (0.70 kB) + CSS (15.33 kB) + JS (251.91 kB) |
| Veredicto | **PASSOU** |

### Cenario 6 — Dev server
| Item | Resultado |
|------|-----------|
| Comando | `npm run dev` |
| HTTP status | 200 em http://localhost:5173 |
| Veredicto | **PASSOU** — dev server sobe e responde |

## Limpeza de dados de teste
| Dado | Status |
|------|--------|
| `qa-teste-termo-zzz` | Inserido e deletado no cenario 2. Confirmado ausente apos DELETE |

## Resumo
| Cenario | Tipo | Veredicto |
|---------|------|-----------|
| 1. Seed (26 termos) | [AUTO] curl | PASSOU |
| 2a. INSERT via anon | [AUTO] curl | PASSOU |
| 2b. DELETE via anon | [AUTO] curl | PASSOU |
| 2c. INSERT duplicado | [AUTO] curl | PASSOU |
| 3. Integracao coletor | [AUTO] curl | PASSOU |
| 4. Fallback coletor | [CODIGO] leitura | PASSOU |
| 5. Build | [AUTO] npm | PASSOU |
| 6. Dev server | [AUTO] npm+curl | PASSOU |

## Veredicto Final

**PASSOU** — Todos os 8 cenarios validados com sucesso. A cadeia ponta-a-ponta funciona: keywords vivem na tabela Supabase, RLS permite CRUD via anon, unique constraint protege duplicados, o coletor le da tabela (keywordsSource=db, keywordsCount=26), fallback esta implementado, build e dev server limpos.

## Atribuicao de Origem

Nenhum problema encontrado. Todos os agentes anteriores (Data Modeler, Stack Dev, Code Reviewer) entregaram corretamente.
