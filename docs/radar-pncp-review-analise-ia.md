# Code Review: Análise IA — Persistir/Carregar + Leitura Profunda

## Status: APROVADO com ressalvas

## Objetivo
Persistir análises IA no banco e carregá-las automaticamente ao abrir oportunidade (custo zero); enriquecer a leitura do edital (múltiplos docs, até 70k chars) e adicionar 3 campos novos (requisitosTecnicos, prazos, criterioJulgamento).

## Arquivos Revisados
- `src/lib/ai.ts` — fetchAnaliseSalva + tipo AnaliseIA
- `src/screens/Detail.tsx` — carregamento salvo + exibição novos campos
- `src/components/Icon.tsx` — 4 ícones novos (scale, clipboard-list, calendar-clock, file-check)
- `supabase/functions/analisar-edital/index.ts` — leitura profunda + campos novos
- `supabase/migrations/20260608170000_analise_detalhada.sql` — ADD COLUMN IF NOT EXISTS

## Pontos Positivos
- Separação clara entre carregamento salvo (REST anon, custo zero) e análise nova (Edge Function + OpenAI) — excelente decisão arquitetural
- Tratamento defensivo exemplar no `fetchAnaliseSalva`: try/catch total, fallback `null`, sem lançar exceção que quebre a UI
- Migration aditiva e idempotente (ADD COLUMN IF NOT EXISTS) — não quebra dados existentes
- Cancelamento correto no useEffect via flag `cancelled` — previne race condition ao trocar de oportunidade
- Timeout por documento (AbortSignal.timeout 20s) + teto de docs (MAX_DOCS=8) + teto de chars (MAX_TEXT_CHARS=70k) — controle triplo contra travamento
- Nenhuma credencial sensível no frontend (OPENAI_API_KEY e SERVICE_ROLE_KEY só na Edge Function)
- Backward-compat: campos novos com fallback (arrays vazios, string vazia) — análises antigas exibem sem quebrar
- Zero console.log perdido no código

## Compliance

### Segurança
- [x] RLS habilitado em analises_ia (init_radar.sql:85)
- [x] Novas colunas herdam RLS da tabela (policy é por tabela, não por coluna)
- [x] service_role e OPENAI_API_KEY nunca no frontend
- [x] fetchAnaliseSalva usa apenas chave anon (pública)
- [x] Sem dados sensíveis expostos no client

### Arquitetura
- [x] Código em inglês (variáveis, funções, componentes)
- [x] UI em português (labels, textos)
- [x] Lógica de negócio separada em `ai.ts`, não inline no componente

### Banco de Dados
- [x] Nomenclatura snake_case conforme padrão
- [x] Tipos coerentes (jsonb para arrays, text para string)
- [x] Índices em colunas filtradas (controle_pncp, created_at desc)
- [x] Migration aditiva e idempotente

### Cadeia completa dos 3 campos novos
- [x] Schema da function (SCHEMA string) → define requisitosTecnicos, prazos, criterioJulgamento
- [x] analisarComIA retorno → mapeia os 3 campos
- [x] INSERT no banco → persiste requisitos_tecnicos, prazos, criterio_julgamento
- [x] Cache da function → retorna os 3 campos com fallback ([] e '')
- [x] fetchAnaliseSalva → lê e mapeia os 3 campos do banco
- [x] Tipo AnaliseIA → declara requisitosTecnicos: string[], prazos: string[], criterioJulgamento: string
- [x] Detail.tsx → exibe os 3 campos com condicionais (só mostra se houver dados)

## Qualidade de Código

### Code Smells
- [x] Sem duplicação significativa
- [x] Sem God Class — Detail.tsx tem 487 linhas mas a maioria é JSX declarativo com pouca lógica

### Nomes e Legibilidade
- [x] Nomes auto-explicativos (fetchAnaliseSalva, statusFromScore, runIA)
- [x] Variáveis claras (cancelled, iaLoading, iaErr)

### Complexidade
- [x] Funções dentro do limite (runIA ~10 linhas, fetchAnaliseSalva ~45 linhas)
- [x] Máximo 2 níveis de indentação na lógica

### Performance
- [x] fetchAnaliseSalva não chama OpenAI — custo zero confirmado
- [x] Sem queries N+1
- [x] Sem re-renders desnecessários (estado no componente que usa)

### React Patterns
- [x] useEffect com cleanup (cancelled flag)
- [x] Sem mutação direta de estado
- [x] Dependência [op.id] correta — reseta e recarrega ao trocar oportunidade

## Resumo de Problemas

### Blockers
Nenhum.

### Warnings
1. **select('*') na Edge Function cache** — `supabase/functions/analisar-edital/index.ts:234` usa `.select('*')` para ler a análise cacheada. Em tabela pequena (<10 colunas) isso é aceitável, mas como a tabela cresceu com 3 colunas novas (e pode crescer mais), melhor selecionar explicitamente as colunas necessárias para evitar tráfego desnecessário futuro.
2. **key={i} em listas dinâmicas** — `src/screens/Detail.tsx:222,240,261,279,299,330` usa índice numérico como key em listas de porQueCombina, porQueNao, prazos, requisitosTecnicos, documentos e custos. Essas listas são estáticas após carregamento (não reordenadas/filtradas em runtime), então o impacto real é mínimo. Mas o padrão correto seria usar o conteúdo como key (`key={r}` para strings únicas) quando possível.

### Suggestions
1. **Race entre salva e Reanalisar** — Se o fetchAnaliseSalva estiver em andamento e o usuário clicar "Analisar com IA" simultaneamente, ambas podem resolver e sobrescrever o estado. Risco real baixo (fetchAnaliseSalva é rápido, ~50ms), mas um guard `if (iaLoading) return` no início do useEffect ou um ref de controle preveniria.
2. **Timeout global da Edge Function** — A function tem AbortSignal.timeout(20s) por doc individual, mas sem timeout global para o conjunto de docs + OpenAI. Na prática, o Supabase Edge Functions tem timeout padrão de 60s que cobre, mas documentar essa dependência seria útil.
3. **Tela sem feedback durante carregamento salvo** — Quando fetchAnaliseSalva está rodando (ao abrir a op), não há indicador visual. O carregamento é rápido (<100ms geralmente), mas um shimmer/skeleton momentâneo poderia melhorar a UX em conexões lentas.

## Veredicto
Code Review **APROVADO com ressalvas**. Os warnings identificados (select('*') e key={i}) não bloqueiam a entrega — são melhorias incrementais. As suggestions são refinamentos de UX e robustez que podem ser endereçados em iteração futura. O código está limpo, seguro, performático e com backward-compat correto. Pode avançar para o QA.
