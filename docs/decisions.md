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
