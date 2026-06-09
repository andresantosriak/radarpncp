# Decisões — Radar PNCP

### [2026-06-09] Filtro do Querido Diário está calibrado; gargalo é cobertura, não threshold
**Contexto:** o coletor QD trazia 0 capturas. Modo diagnóstico (tabela `diagnostico_coleta`) deu visibilidade. Amostra de 30 diários (90 dias): 23 `nao_e_licitacao` (excerpts genéricos do diário, score 0), 7 `nao_relevante` (licitações reais de outras áreas: medicamentos, uniformes, material didático, leitor biométrico). Distribuição de score: máximo 30, **zero na faixa 40-49**, nada perto do corte de 50.
**Decisão:** NÃO baixar o threshold de score (50) — não há candidatos na zona de corte, baixar não capturaria TI real. O filtro está rejeitando corretamente. O gargalo é a montante: 77% dos excerpts nem são licitações, e licitações municipais de TI/IA são genuinamente raras no período. Alavancas reais: melhorar precisão da busca da API do QD / ampliar territórios e keywords / deixar o cron acumular meses. Confirma a hipótese "filtro correto + evento de baixa frequência", não "filtro apertado demais".
**Escopo:** fonte Querido Diário (coletar-querido-diario).

### [2026-06-09] Editais sem data de encerramento: manter como ativos
**Contexto:** 52% dos editais coletados (26/50) não informam `dataEncerramentoProposta` na API do PNCP. Dispensas, credenciamentos e inexigibilidades frequentemente não publicam prazo ou têm prazo indeterminado.
**Decisão:** Editais sem data de encerramento são mantidos como ativos (`encerrado = false`). O filtro de prazo aplica-se apenas a editais que informam data e cuja data já passou. Descartar editais sem prazo perderia mais da metade das oportunidades reais.
**Escopo:** coletor `coletar-pncp` + tabela `oportunidades`.

### [2026-06-09] Coluna `encerrado` (boolean) em vez de sobrescrever `status`
**Contexto:** a coluna `status` armazena scores de aderência (`boa`, `forte`, `possivel`). Sobrescrevê-la com `encerrado` perderia a informação de relevância — são dimensões ortogonais (aderência vs ciclo de vida).
**Decisão:** Adicionar coluna `encerrado boolean NOT NULL DEFAULT false` na tabela `oportunidades`. O status de aderência permanece intacto. O coletor seta `encerrado = true` para editais com prazo vencido; o frontend filtra por essa flag.
**Escopo:** schema `oportunidades`, coletor, frontend.

### [2026-06-09] Frontend: ocultar encerrados por padrão com toggle
**Contexto:** exibir editais vencidos misturados com ativos confunde o usuário e corrói confiança no radar.
**Decisão:** Dashboard oculta editais com `encerrado = true` por padrão. Toggle "Mostrar encerrados" permite visualizá-los com opacidade reduzida + badge "Encerrado". Ordenação padrão mantém `data_publicacao DESC`; opção adicional "Prazo (mais urgentes)" ordena por `data_encerramento ASC NULLS LAST`.
**Escopo:** frontend (Dashboard, `src/lib/db.ts`).

### [2026-06-09] Querido Diário: filtro de prazo não aplicável
**Contexto:** o coletor `coletar-querido-diario` extrai `prazo` como texto livre via IA (ex: "30 dias", "até 15/07"). Não há campo estruturado de data de encerramento. Parsing de texto livre seria frágil e propenso a erros.
**Decisão:** Nenhuma alteração no coletor Querido Diário para filtro de prazo. Documentado como "não aplicável — prazo não estruturado".
**Escopo:** fonte Querido Diário (coletar-querido-diario).

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
