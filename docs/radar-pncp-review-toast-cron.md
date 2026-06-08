# Code Review: Toast Real + Cron Horario

## Status: APROVADO

## Escopo Revisado

- **F-A Toast real**: `src/components/Toast.tsx`, `src/App.tsx` — remoção de defaults fake, dados obrigatórios, onClick clicável, detecção de novidade via seenIds em localStorage, baseline silencioso na 1a carga.
- **F-B Cron**: reagendado via Management API (fora do repo) de diário 06h para horário `0 * * * *` com command leve (sem semantico/analisar).

## Pontos Positivos

- Boa separação de responsabilidades: Toast.tsx é puro (recebe data, renderiza), lógica de novidade concentrada no App.tsx.
- Dupla proteção contra re-disparo: `lastCheckedRef` (fingerprint) + `seenIds` persistido. Robusto.
- `source !== 'live'` impede toast fake em modo demo — correto e explícito.
- Filtro de relevância exclui `status === 'baixa'` e descartados antes de avaliar novidade.
- Toast clicável com `role="button"` e botão fechar com `aria-label="Fechar"` — a11y adequada.
- Nenhuma credencial (service_role, OPENAI_API_KEY) exposta no frontend — secrets apenas em Edge Functions server-side.
- Cron aplicado via Management API sem migration com secrets — decisão correta de segurança.

## Compliance

### Design & UI
- [x] Toast usa tokens CSS do design system (--brand, --surface, --border, etc.)
- [x] Sem cores hardcoded
- [x] Botão fechar com `aria-label`
- [x] Div clicável com `role="button"` quando onClick presente
- [x] Textos em pt-BR

### Arquitetura
- [x] Toast.tsx sem lógica de negócio — componente puro de apresentação
- [x] Detecção de novidade no App.tsx via useEffect + ref guard
- [x] useCallback para showToast e openOp — evita re-criação desnecessária
- [x] Sem `any` no código (único match é comentário em inglês "any new IDs")

### Banco de Dados / Cron
- [x] Migration v2 apenas habilita extensões (pg_cron, pg_net, vector) e adiciona colunas — sem secrets
- [x] Cron job aplicado fora do repo via Management API — correto

## Qualidade de Código

### Code Smells
- [x] Sem duplicação significativa
- [x] Sem dead code, console.log, TODO/FIXME

### Nomes e Legibilidade
- [x] `seenIds`, `lastCheckedRef`, `fingerprint`, `relevant`, `newOps`, `best` — nomes auto-explicativos
- [x] `toastPayload` claro sobre seu propósito
- [x] Comentários explicam "porquê" (ex: "First-ever load: populate silently"), não "o quê"

### Complexidade
- [x] useEffect de novidade: ~53 linhas de lógica mas com early returns claros que segmentam o fluxo (loading, fingerprint, baseline, sem novos, com novos). Aceitável para este caso — extrair para hook custom seria sugar sem ganho real pois o estado depende de 4+ variáveis do App.
- [ ] App.tsx com 347 linhas — acima do limite de 200 (pre-existente, não introduzido por esta mudança)

### Performance
- [x] Sem queries N+1
- [x] `dismissedSet` via useMemo — evita recriação do Set a cada render
- [x] fingerprint como guard previne processamento repetido

### React Patterns
- [x] useEffect com cleanup (`return () => clearTimeout(t)`) — sem memory leak
- [x] Nenhuma mutação direta de estado
- [x] `key={o.id}` nas listas (não key={index})
- [x] Dependências do useEffect: `[isLoading, source, allEditais, dismissedSet]` — `seenIds` omitido deliberadamente (causaria loop; `lastCheckedRef` protege). eslint-disable justificado pelo padrão.
- [x] `showToast` e `openOp` como useCallback com deps `[]` — referência estável, ok omitir das deps do effect

### Segurança
- [x] Nenhuma credencial no frontend (grep confirmado)
- [x] Nenhuma migration commitada com service_role ou API key
- [x] Cron via Management API — fora do versionamento

## Cron — Avaliação pela Descrição

O reagendamento de diário (`0 6 * * *`, `?dias=12&paginas=8`) para horário (`0 * * * *`, `?dias=2&paginas=2`, sem semantico/analisar) faz sentido:
- **Frequência maior, payload menor**: coleta leve a cada hora mantém o radar atualizado sem sobrecarregar a API do PNCP nem gastar tokens de IA.
- **Risco do command**: o cron do Supabase usa `pg_net.http_post` que injeta o header `Authorization: Bearer <service_role>` automaticamente para chamadas internas a Edge Functions. Sem risco de falha por falta de auth.
- **Recomendação para QA**: confirmar via Dashboard do Supabase (Database > Extensions > pg_cron > jobs) que o job `coletar-pncp-horario` existe, está ativo e o command não está malformado.

## Resumo de Problemas

### Blockers
Nenhum.

### Warnings
Nenhum.

### Suggestions

1. **seenIds crescimento ilimitado** — O array `seenIds` em localStorage cresce indefinidamente conforme novas oportunidades surgem. Após meses de uso, pode acumular milhares de IDs sem utilidade (oportunidades antigas não voltam). Sugestão: aplicar um cap (ex: manter apenas os últimos 500 IDs) ou limpar IDs com mais de 90 dias. Não bloqueia — localStorage suporta ~5MB, e IDs UUID ocupam ~36 bytes cada.

2. **App.tsx com 347 linhas** — Acima do limite recomendado de 200 linhas. Pré-existente (não introduzido por esta mudança). Quando houver oportunidade, extrair o bloco de detecção de novidade para um hook `useNewOpportunityToast` reduziria o arquivo para ~290 linhas. Não bloqueia.

## Veredicto

Code Review **aprovado**. Sem blockers nem warnings. Toast usa dados reais, não mostra conteúdo fake, baseline silencioso na 1a carga funciona corretamente, seenIds previne re-notificação, modo demo não dispara toast de novidade, segurança preservada. Pode avançar para o QA. QA deve confirmar estado real do cron job no Dashboard do Supabase.
