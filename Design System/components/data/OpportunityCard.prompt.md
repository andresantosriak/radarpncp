The core radar object — one edital. Composes ScoreGauge + Badge; accent + status derive from the score.

```jsx
<OpportunityCard
  orgao="Prefeitura de Sobral" cidade="Sobral" estado="CE"
  titulo="Contratação de plataforma de atendimento digital com chatbot"
  modalidade="Dispensa eletrônica" valor="R$ 62.000" prazo="14/06/2026"
  score={87} urgente
  recomendacao="Participar — objeto compatível com automação, IA e atendimento digital."
  onClick={() => openDetail(id)}
/>
```

Pass `status` to override the auto-derived band. `urgente` adds the gold badge. `onClick` makes it a clickable row.
