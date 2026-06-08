The signature radar metric — circular aderência gauge, color follows score bands.

```jsx
<ScoreGauge value={87} />
<ScoreGauge value={52} size={64} stroke={6} />
<ScoreGauge value={91} caption="Recomendado" />
```

Bands: 0–39 baixa (red) · 40–69 possível (amber) · 70–84 boa (teal) · 85–100 muito forte (green).
`scoreBand(v)` returns `{ key, color, label }` for reuse in cards/badges.
