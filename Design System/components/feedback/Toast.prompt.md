Notification card — new opportunity alerts, generated proposals, errors.

```jsx
<Toast tone="gold" title="Nova oportunidade · score 91"
  message="Plataforma de atendimento digital · R$ 78.000 · prazo 12/06" onClose={dismiss} />
<Toast tone="success" title="Proposta gerada" message="Valor recomendado: R$ 48.000–54.000" />
<Toast tone="danger" title="Falha ao ler edital" message="PDF protegido — tente novamente." />
```

Tones: `brand · success · warning · danger · gold`. Use `gold` for strong-match finds.
