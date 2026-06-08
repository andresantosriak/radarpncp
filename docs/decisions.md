# Decisões — Radar PNCP

### [2026-06-08] Chave OpenAI e service_role só no servidor
**Contexto:** Vite empacota qualquer `VITE_*` no bundle do browser → segredo ficaria exposto a qualquer visitante.
**Decisão:** `OPENAI_API_KEY` e a `service_role` vivem só na Edge Function (Deno). O frontend usa apenas `VITE_SUPABASE_URL` + a chave **anon** (pública por design).
**Escopo:** projeto inteiro — qualquer chamada a LLM/API paga.

### [2026-06-08] Frontend lê do banco, não do PNCP direto
**Contexto:** a busca client-side via proxy de dev é amostrada e não funciona em produção (sem proxy).
**Decisão:** o coletor server-side (`coletar-pncp`, cron diário) grava em `oportunidades`; o frontend lê via REST. O proxy de dev permanece apenas como fallback.
**Escopo:** pipeline de dados.

### [2026-06-08] Surface por aderência ampla + gate de precisão (não pelos 16 jargões)
**Contexto:** os jargões do briefing (chatbot, IA, automação) casam ~0 editais reais — órgãos escrevem "licença de software", "sistema informatizado".
**Decisão:** vocabulário ampliado para termos reais + gate de precisão (sinal forte ≥2.5 OU dois médios somando ≥3.5) + limpeza de prefixo de plataforma. Precisão fina fica com a IA lendo o PDF.
**Escopo:** scoring / coletor.

### [2026-06-08] Score por heurística; IA sob demanda
**Contexto:** analisar todos os editais com LLM custaria caro.
**Decisão:** o score de aderência é heurístico determinístico; a análise por LLM (lê o PDF) é sob demanda no detalhe e opt-in em lote no coletor (com teto).
**Escopo:** análise / custo.

### [2026-06-08] Palavras-chave centralizadas na tabela `keywords` (fonte única)
**Contexto:** a tela "Palavras-chave monitoradas" prometia que o radar busca esses termos, mas o coletor usava a constante hardcoded `DEFAULT_KEYWORDS` e a edição do usuário ficava só em localStorage (filtrava só a exibição) — adicionar termo não trazia nada novo.
**Decisão:** a tabela Supabase `keywords` (id, termo, ativo, timestamps) é a fonte de verdade. Frontend lê/grava via REST anon (`src/lib/keywords-db.ts` + `useKeywords`); o coletor lê os termos ativos da tabela no início e usa `DEFAULT_KEYWORDS` apenas como fallback (campo `keywordsSource: db|fallback` na resposta). As constantes `DEFAULT_KEYWORDS` permanecem só como fallback/seed. Validado por QA: `keywordsSource: db`, 26 termos no seed.
**Escopo:** coletor + frontend + schema. RLS: CRUD aberto para `anon` (projeto sem auth) — `TODO[auth]` na migration para restringir escrita se auth for adicionado.
