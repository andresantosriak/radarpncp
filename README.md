# Radar PNCP

Monitoramento de editais de licitação do **PNCP** (Portal Nacional de Contratações Públicas), da **AI Solution Exp**. O radar consulta a API oficial do PNCP, cruza cada edital com o portfólio da empresa e entrega as melhores oportunidades: score de aderência, riscos, documentos exigidos e proposta de preço sugerida.

> *"Um radar de ouro no meio do pântano burocrático."*

App **Vite + React 18 + TypeScript**, recriação fiel do design system Radar PNCP (`ui_kits/radar/index.html`) **com camada funcional real**: dados ao vivo do PNCP, score computado e estado persistido.

## Stack

- **Vite 5** + **React 18** + **TypeScript** (strict)
- **TanStack Query** para data fetching (cache, loading, retry)
- **Design tokens** em CSS custom properties (claro + escuro) — portados verbatim do design system
- **lucide-react** para iconografia
- Sem backend: integração direta com a API pública do PNCP (via proxy em dev) + estado em `localStorage`

Identidade visual 100% **token-driven**: troca de tema só com `data-theme="dark"` no `<html>`. **Dark é o padrão** ("centro de comando").

## Como rodar

```bash
npm install
npm run dev      # servidor de dev (Vite) — modo AO VIVO (proxy para o PNCP)
npm run build    # typecheck (tsc) + build de produção
npm run preview  # serve o build (modo demonstração, sem proxy)
```

App em `http://localhost:5173` (dark por padrão).

- **`npm run dev`** → o Vite faz proxy de `/pncp/*` para `https://pncp.gov.br/api/consulta/*`, então o radar mostra **editais reais** (badge verde "Ao vivo · PNCP").
- **Build estático / sem proxy** → o fetch falha graciosamente e o radar cai para **dados de demonstração** (badge "Demonstração"). Em produção, a coleta real roda server-side (Edge Function / n8n) — ver "Próximos passos".

## O que é funcional

- **Coleta real do PNCP** — varre em paralelo as modalidades de TI (Pregão eletrônico, Dispensa, Concorrência eletrônica) dos últimos 30 dias, filtra pelas palavras-chave monitoradas e mapeia cada edital.
- **Score de aderência computado** (`src/lib/scoring.ts`) — heurística determinística e auditável que cruza o objeto do edital com o portfólio (termos ponderados, de-overlap de frases, 4 faixas). Calibrada sobre editais reais. **Não é LLM** — essa é uma camada plugável futura.
- **Análise gerada** (`src/lib/analysis.ts`) — resumo, por que combina / pontos de atenção, documentos prováveis, composição de custos, proposta sugerida (faixa + mínimo saudável + margem) e leitura de risco/concorrência/burocracia/chance.
- **Interatividade persistida** (`localStorage`) — busca, filtros, **palavras-chave editáveis**, **alertas** toggláveis, **descartar/restaurar** editais.
- **Estados de UI** — loading (skeleton), vazio, indicador de fonte (ao vivo / demonstração), responsivo.
- **Análise por IA que lê o edital** — botão "Analisar com IA" no detalhe → Edge Function do Supabase baixa o **PDF do edital** no PNCP, extrai o texto (`unpdf`) e analisa com **GPT-4o** (resumo, score, documentos, custos, proposta), persistindo em Postgres (com cache).

## Backend (Supabase) — análise por IA

A chave da OpenAI **nunca** vai pro frontend: ela vive só na Edge Function (servidor). O frontend usa apenas `VITE_SUPABASE_URL` + a chave **anon** (públicas por design).

- **Migration** `supabase/migrations/*_init_radar.sql` — tabelas `oportunidades` + `analises_ia` (RLS + índices + trigger). Aplicada via Management API.
- **Edge Function** `supabase/functions/analisar-edital/` (Deno) — fluxo: lista arquivos do PNCP → baixa o PDF do edital → `unpdf` extrai texto → GPT-4o devolve JSON estruturado → grava em `analises_ia` → responde. Cache por `controle_pncp` (reanálise com `force`).
- **Segredos**: `OPENAI_API_KEY` via `supabase secrets set`. `SUPABASE_URL`/`SERVICE_ROLE` são injetados pela plataforma.

Deploy: `supabase functions deploy analisar-edital --project-ref <ref>` (a CLI usa `SUPABASE_ACCESS_TOKEN` do `.env`).

## Fluxo do app

Radar (dashboard) → filtros/busca → card de oportunidade → **detalhe com análise** (resumo · documentos · custos & proposta) → **gerar proposta** / **ver no PNCP** / **descartar**. Telas de **Palavras-chave**, **Alertas**, **Perfil da empresa** e **Descartados**, com toggle claro/escuro.

## Estrutura

```
src/
  main.tsx                 # entry (QueryClientProvider + <App/> + CSS)
  App.tsx                  # shell: routing, tema, busca, descarte, dialog, toast
  styles/                  # index.css → tokens/ (verbatim) + kit.css
  lib/
    types.ts  data.ts      # tipos + editais de demonstração (fallback)
    text.ts  format.ts     # normalização/matching + formatação BRL/data/link
    keywords.ts            # portfólio: palavras-chave + termos ponderados
    scoring.ts             # computeAderencia (score 0-100), matchesKeywords
    analysis.ts            # buildAnalysis (resumo, custos, proposta, riscos)
    ai.ts                  # cliente da Edge Function de análise por IA
    pncp/                  # client (proxy + paralelo), mapper (PNCP→Edital), types
  hooks/
    useRadar.ts            # TanStack Query: live PNCP + fallback demo + source
    useLocalState.ts       # estado persistido em localStorage
  components/              # primitivos (Icon, Gauge, Pill, Button, OpportunityCard…)
  screens/                 # Sidebar, Topbar, Dashboard, Detail, ConfigScreen
supabase/
  migrations/              # schema: oportunidades + analises_ia (RLS + índices)
  functions/analisar-edital/   # Edge Function: lê o PDF + GPT-4o + persiste
```

## Próximos passos

- **Coleta server-side (cron)** — hoje a varredura do PNCP roda no browser via proxy de dev. Mover para uma Edge Function agendada (ou n8n) que varre diariamente e popula `oportunidades`, dispensando o proxy em produção.
- **Análise por IA em lote** — disparar `analisar-edital` automaticamente para os editais de score alto (hoje é sob demanda no detalhe).
- **Alertas reais** — disparo por WhatsApp (Evolution API) / e-mail / Telegram (a tela de Alertas já controla os canais).
- **Auth / multi-tenant** — para virar SaaS para outras empresas (perfil/portfólio por empresa).

## Origem do design

Bundle de handoff do **Claude Design** em `Design System/` (tokens, componentes, UI kit, slides, guidelines) e `_design_pkg/` (bundle original + transcript). A camada visual recria fielmente `Design System/ui_kits/radar/index.html`; sobre ela foi construída a camada funcional acima.

### Desvios intencionais do protótipo (produção-correto)

- `lucide-react` no lugar do CDN-Lucide + `dangerouslySetInnerHTML`.
- Globais `window.RADAR.*` → imports ES; JSX dos protótipos → componentes TSX tipados.

### Caveats

- **Fontes via Google Fonts** (Hanken Grotesk + IBM Plex Mono). Para self-host, troque o `@import` em `src/styles/tokens/fonts.css`.
- **Score por heurística**, não LLM (decisão consciente; ponto de extensão isolado).
- **Marca e nome "Radar PNCP"** vêm do design system (confirmado pelo cliente).
