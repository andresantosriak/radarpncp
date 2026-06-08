# Radar PNCP — Design System

**Radar PNCP** é uma plataforma SaaS da **AI Solution Exp** que monitora editais de licitação no Brasil (via a API oficial do PNCP — Portal Nacional de Contratações Públicas), cruza cada edital com o portfólio da empresa e entrega um painel com as melhores oportunidades: score de aderência, riscos, documentos exigidos e proposta de preço sugerida.

> *"Um radar de ouro no meio do pântano burocrático."*

Este projeto é o **sistema de design** do produto: tokens, fontes, componentes React reutilizáveis, um UI kit do app e um template de slides. Tudo em **português do Brasil**, com suporte a tema **claro e escuro** (o escuro é o "centro de comando" padrão do dashboard).

- **Empresa:** AI Solution Exp LTDA - ME · CNPJ 53.075.641/0001-71
- **Domínio:** automações, agentes de IA, integrações, atendimento automatizado (n8n, Make, WhatsApp, APIs, dashboards, BI, SaaS sob demanda)
- **Fontes / referências:** produto novo, sem codebase ou Figma anexados — a identidade foi criada do zero a partir do briefing. Não há links externos a preservar.

---

## CONTENT FUNDAMENTALS — voz e copy

O produto fala com pequenas empresas de tecnologia que **não dominam o labirinto das licitações**. O tom é de um **especialista direto e tranquilizador** — quem traduz a burocracia, não quem a reproduz.

- **Idioma:** português do Brasil, em tudo (UI, specimens, comentários de código).
- **Pessoa:** trate o usuário por **você**. O sistema fala em 1ª pessoa do plural quando age por ele ("monitoramos o PNCP", "cruzamos cada edital").
- **Casing:** títulos e botões em **sentence case** ("Analisar oportunidade", "Gerar proposta"), nunca Title Case. Eyebrows e micro-labels em **MAIÚSCULAS com tracking** ("OPORTUNIDADE EM DESTAQUE").
- **Verbos imperativos** nos botões e recomendações: *Participar, Analisar, Descartar, Gerar proposta, Ver no PNCP*.
- **Decisão antes de dado.** Toda tela responde a "participar ou não?". O número existe para sustentar a recomendação, nunca para enfeitar.
- **Números são literais e em monospace:** `R$ 62.000`, `87/100`, `14/06/2026`, `53.075.641/0001-71`. Sem aproximações vagas.
- **Vocabulário do domínio** (use sempre os termos reais): edital, órgão, objeto da contratação, modalidade (Dispensa eletrônica, Pregão eletrônico, Concorrência), termo de referência, atestado de capacidade técnica, aderência, score, proposta, margem.
- **Sem emoji.** A marca não usa emoji em nenhuma superfície.
- **Score em 4 faixas, sempre com a mesma redação:** 0–39 *Baixa*, 40–69 *Possível*, 70–84 *Boa*, 85–100 *Muito forte*.

Exemplos de copy real do produto:
- *"Participar — objeto compatível com automação, IA e atendimento digital."*
- *"Nova oportunidade · score 91 · Plataforma de atendimento digital · R$ 78.000 · prazo 12/06."*
- *"Proposta recomendada: R$ 48.000–54.000 · mínimo saudável R$ 41.000 · margem 35%."*

---

## VISUAL FOUNDATIONS

A metáfora central é o **radar / centro de comando**: anéis concêntricos, uma varredura (sweep) em teal e um *blip* dourado — a oportunidade encontrada.

- **Cor.** Base de **navy frio** (`--ink-*`). A marca é um **teal de varredura** (`--brand`; no escuro vira o `--teal-glow #1fd1a3`). O **ouro** (`--accent`) marca scores e destaques — o "ouro no pântano". **Azul** para info, e um conjunto semântico completo (success/warning/danger). As faixas de score reusam essas cores: vermelho → âmbar → teal → verde.
- **Dois temas.** `:root` é o claro (SaaS limpo); `[data-theme="dark"]` é o escuro (dashboard). Os componentes leem só **tokens semânticos** (`--surface`, `--text-strong`, `--brand`…), então viram tema sem alteração.
- **Tipografia.** **Hanken Grotesk** (humanista, amigável, acessível) para UI e texto; **IBM Plex Mono** para todo número que "significa algo" (score, valor, data, ID) — com `tabular-nums`. Títulos em peso 700–800, tracking levemente negativo.
- **Espaçamento.** Grade base de 4px (`--space-*`). Densidade **equilibrada** — é um produto de dados, mas legível.
- **Cantos.** Controles `--radius-md (10px)`; cards `--radius-lg (14px)`; painéis/modais `--radius-xl (20px)`; pills `--radius-pill`.
- **Cards.** Superfície `--surface`, borda `1px --border`, sombra suave `--shadow-sm`. Cards clicáveis sobem 2px e ganham `--shadow-lg` no hover. Cards de oportunidade levam uma **faixa de acento à esquerda** na cor da faixa do score.
- **Sombras vs. glow.** No claro, sombras em camadas suaves (`--shadow-*`). No escuro, sombras quase pretas + **glows** teal/ouro (`--glow-brand`, `--glow-gold`) para o brilho de radar.
- **Fundos.** Sólidos e sóbrios — sem gradientes decorativos. A única "imagem" é o **motivo de radar** (anéis + sweep em `conic-gradient`), usado em capas, estados vazios e decoração de hero.
- **Movimento.** Transições curtas (`--dur-fast 120ms` / `--dur-base 200ms`) com `--ease-out`; toggles/checks usam `--ease-spring`. O sweep do radar gira em `--dur-radar (4s)` linear. Tudo respeita `prefers-reduced-motion`.
- **Estados.** Hover: superfície mais clara/escura (`--bg-subtle`) ou cor de marca mais escura. Press: leve `scale(0.98–0.99)`. Foco: anel `--ring` de 3px (teal translúcido).
- **Transparência/blur.** Reservados para a topbar (vidro: `--surface` 80% + `blur(--blur-md)`) e o scrim de modais (`--overlay-scrim` + `blur(--blur-sm)`).

---

## ICONOGRAPHY

- **Sistema:** [**Lucide**](https://lucide.dev) — traço de 2px, cantos arredondados, estilo outline. Combina com a tipografia humanista. *(Substituição declarada: não havia ícones próprios; padronizamos em Lucide, CDN.)*
- **Componente `Icon`** (`components/core/Icon.jsx`): renderiza o glyph Lucide como **SVG dentro de um `<span>` que o React controla** (via `dangerouslySetInnerHTML`). Isso evita o bug clássico de `removeChild` quando o `lucide.createIcons()` mutaria nós gerenciados pelo React. **Sempre use `<Icon name="…">` dentro de React** — nunca `<i data-lucide>` cru. Em páginas estáticas (slides), `<i data-lucide>` + `lucide.createIcons()` é seguro.
- Os ícones herdam `currentColor` e são dimensionados por `size` (px) ou pela CSS do contexto.
- **Logo:** marca de radar em `assets/mark.svg` (anéis + sweep teal + blip dourado). Para uso em React/tema, a marca é desenhada inline com `var(--brand)` / `var(--accent)` para acompanhar o tema (ver `guidelines/brand-logo.html`).
- **Sem emoji. Sem unicode como ícone.**

---

## ÍNDICE / MANIFESTO

**Entrada global:** `styles.css` (só `@import`s). Consumidores linkam **apenas este arquivo**.

**Tokens** (`tokens/`): `fonts.css` · `colors.css` (claro + `[data-theme="dark"]`) · `typography.css` · `spacing.css` · `effects.css` · `base.css` (resets + helpers `.eyebrow`, `.rp-field*`, `.tnum`).

**Componentes** (`components/`) — namespace de runtime `window.RadarPNCPDesignSystem_ba9943`:
- `core/` — **Button, IconButton, Icon, Badge, Tag, Avatar, Card**
- `forms/` — **Input, Select, Checkbox** (+ radio), **Switch**
- `data/` — **ScoreGauge** (+ `scoreBand`), **OpportunityCard**, **StatCard**, **DataTable**
- `navigation/` — **Tabs**
- `feedback/` — **Dialog, Toast, Tooltip**

Cada pasta tem `<Nome>.jsx` + `.d.ts` + `.prompt.md` e um `*.card.html` (`@dsCard group="Components"`).

**UI kit** (`ui_kits/radar/`): recriação interativa do app — `index.html` (dark, command-center) compondo `parts.jsx`, `chrome.jsx`, `Dashboard.jsx`, `Detail.jsx`, `App.jsx` + `data.js` (editais fictícios) + `kit.css`. Fluxo: radar → filtros → card de oportunidade → detalhe com análise da IA (resumo, documentos, custos & proposta) → gerar proposta. Inclui telas de Palavras-chave, Alertas e Perfil da empresa, e toggle claro/escuro.

**Slides** (`slides/`): template de pitch 16:9 (`@dsCard group="Slides"`) — `TitleSlide`, `MetricsSlide`, `StepsSlide`, `OpportunitySlide`, `ClosingSlide` + `slides.css`.

**Specimens** (`guidelines/`): cards do Design System tab — tipografia, cores (marca, ouro, neutros, semântico, faixas de score, superfícies claro/escuro), espaçamento, raios, sombras, logo e motivo de radar.

**Assets** (`assets/`): `mark.svg` (logo).

**Pontos de partida:** `ScoreGauge` e `OpportunityCard` (componentes) e o app Radar (`ui_kits/radar/index.html`, tela).
