---
name: radar-pncp-design
description: Use this skill to generate well-branded interfaces and assets for Radar PNCP (the AI Solution Exp licitações-monitoring SaaS), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick orientation
- **Global CSS:** link `styles.css` (only entry point) — it `@import`s all tokens + fonts.
- **Theme:** light is `:root`; add `data-theme="dark"` to any wrapper for the command-center dark theme. Read semantic tokens (`--brand`, `--surface`, `--text-strong`, `--score-*`), not raw scales.
- **Type:** Hanken Grotesk (UI/body), IBM Plex Mono (every meaningful number, with `tabular-nums`).
- **Icons:** Lucide. In React, use the `Icon` component (`<Icon name="radar"/>`), never raw `<i data-lucide>`. In static HTML, `<i data-lucide>` + `lucide.createIcons()` is fine.
- **Components:** load `_ds_bundle.js`, then `const { Button, OpportunityCard, ScoreGauge, … } = window.RadarPNCPDesignSystem_ba9943`.
- **Voice:** PT-BR, sentence case, "você", imperative verbs, no emoji. Decision before data. Score bands: 0–39 Baixa · 40–69 Possível · 70–84 Boa · 85–100 Muito forte.
