Labelled text input — search bars, valores, keyword entry, settings.

```jsx
<Input label="Buscar editais" placeholder="palavra-chave, órgão, objeto…" iconLeft={<i data-lucide="search"></i>} />
<Input label="Valor mínimo" defaultValue="R$ 50.000" hint="Filtra oportunidades acima deste valor" />
<Input label="CNPJ" error="CNPJ inválido" defaultValue="53.075.641/0001-71" />
```

Props: `label`, `hint`, `error`, `iconLeft`/`iconRight`, `size` (sm/md).
