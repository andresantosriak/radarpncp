Checkbox / radio with optional description — filter lists, settings, alert channels.

```jsx
<Checkbox label="Apenas editais com IA / chatbot" defaultChecked />
<Checkbox label="Acima de R$ 50 mil" description="Filtra oportunidades de maior valor" />
<Checkbox type="radio" name="canal" label="WhatsApp" defaultChecked />
<Checkbox type="radio" name="canal" label="E-mail" />
```

Use `type="radio"` + a shared `name` for single-choice groups.
