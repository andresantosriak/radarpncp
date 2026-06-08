# QA Report: Toast Real + Cron Horario

## Status: PASSOU

## Escopo Validado

- **F-A Toast real**: Toast.tsx sem defaults fake, dados obrigatorios, baseline silencioso na 1a carga, notifica somente oportunidades novas genuinas.
- **F-B Cron**: job reagendado para 1x/hora via Management API, verificado diretamente no banco de producao.

## Cenario 1: Toast sem fake

| Verificacao | Resultado |
|-------------|-----------|
| Toast.tsx NAO contem "score 91" / "R$ 78.000" / "Plataforma de atendimento digital" | PASSOU |
| Toast.tsx retorna `null` quando `!show \|\| !data` (linha 53) | PASSOU |
| App.tsx NAO dispara toast de boas-vindas no mount | PASSOU |
| Nenhum `defaultTitle` ou `defaultMessage` hardcoded | PASSOU |
| Toast so renderiza com `data` real fornecida pelo caller | PASSOU |

## Cenario 2: Logica de novidade

| Verificacao | Resultado |
|-------------|-----------|
| Baseline silencioso: `seenIds.length === 0` → popula sem toast (linha 118) | PASSOU |
| Cargas seguintes: detecta IDs novos via diff `seenSet` vs `relevant` (linha 124) | PASSOU |
| Marca novos como vistos apos toast: `setSeenIds` com merge (linha 155) | PASSOU |
| Demo NAO dispara: `source !== 'live'` retorna cedo (linha 107) | PASSOU |
| Editais com `status === 'baixa'` excluidos do calculo de novidade (linha 114) | PASSOU |
| Descartados (`dismissedSet`) excluidos do calculo de novidade (linha 114) | PASSOU |
| `lastCheckedRef` + fingerprint evita re-disparo no mesmo dataset (linhas 104, 110-111) | PASSOU |
| Deps do useEffect: `[isLoading, source, allEditais, dismissedSet]` — `seenIds` omitido deliberadamente para evitar loop. eslint-disable justificado (linha 158-159) | PASSOU |
| Cleanup do timeout: `return () => clearTimeout(t)` (linha 157) — sem memory leak | PASSOU |

## Cenario 3: CRON — Verificacao Real (via Management API)

Verificacao executada via `POST https://api.supabase.com/v1/projects/.../database/query` com SQL `select jobid, jobname, schedule, active, command from cron.job;`.

### Resultado da query

| Campo | Valor | Esperado | Status |
|-------|-------|----------|--------|
| jobid | 2 | qualquer | OK |
| jobname | `coletar-pncp-horario` | `coletar-pncp-horario` | PASSOU |
| schedule | `0 * * * *` (1x/hora) | `0 * * * *` | PASSOU |
| active | true | true | PASSOU |
| Total de jobs no cron.job | 1 | nenhum job diario antigo | PASSOU |

### Integridade do command

| Propriedade | Presente | Status |
|-------------|----------|--------|
| Chama `coletar-pncp` | sim | PASSOU |
| Parametro `dias=2` | sim | PASSOU |
| Parametro `paginas=2` | sim | PASSOU |
| Usa `net.http_post` | sim | PASSOU |
| Possui header Authorization | sim (valor nao exposto) | PASSOU |
| Contem `semantico` | nao | PASSOU |
| Contem `analisar` | nao | PASSOU |

### Job diario antigo

| Verificacao | Resultado |
|-------------|-----------|
| Query `WHERE schedule = '0 6 * * *'` retornou 0 resultados | PASSOU |
| Total de jobs = 1 (apenas o horario) | PASSOU |

## Cenario 4: Coletor responde (teste leve)

Chamada: `POST coletar-pncp?dias=2&paginas=1` com anon key.

| Campo | Valor | Status |
|-------|-------|--------|
| ok | true | PASSOU |
| varridos | 250 | PASSOU |
| upserted | 2 | PASSOU |
| perfilSource | db | PASSOU |
| keywordsSource | db | PASSOU |

## Cenario 5: Build

```
npm run build → tsc --noEmit && vite build
1657 modules transformed, 0 errors, 0 warnings
dist/index-D5W5FQO2.js 263.01 kB (gzip: 79.82 kB)
```

| Verificacao | Resultado |
|-------------|-----------|
| `tsc --noEmit` sem erros | PASSOU |
| `vite build` sem erros | PASSOU |

## Cenario 6: Dev server

| Verificacao | Resultado |
|-------------|-----------|
| localhost:5173 responde HTTP 200 | PASSOU |
| Processo node ativo na porta 5173 | PASSOU |

## Resumo

| Cenario | Resultado |
|---------|-----------|
| 1. Toast sem fake | PASSOU |
| 2. Logica de novidade | PASSOU |
| 3. Cron real (SQL direto) | PASSOU |
| 4. Coletor responde | PASSOU |
| 5. Build | PASSOU |
| 6. Dev server | PASSOU |

## Atribuicao de Origem

Nenhum problema encontrado. Todos os agentes anteriores (Stack Agent, Code Reviewer) entregaram corretamente.

## Veredicto

**PASSOU**. Todos os 6 cenarios validados com sucesso. O toast nao exibe conteudo fake, baseline silencioso funciona na 1a carga, oportunidades novas sao notificadas corretamente, modo demo nao dispara toast de novidade, cron confirmado no banco de producao com schedule correto (`0 * * * *`), command integro (dias=2, paginas=2, sem semantico/analisar, com auth), job diario antigo removido. Build e dev server operacionais.
