Dashboard KPI tile — counts and totals with optional trend.

```jsx
<StatCard label="Oportunidades ativas" value="34" icon={<i data-lucide="radar"></i>} delta="+12" sub="vs. semana passada" />
<StatCard label="Editais urgentes" value="6" tone="danger" icon={<i data-lucide="alarm-clock"></i>} />
<StatCard label="Valor em jogo" value="R$ 1,2M" tone="gold" icon={<i data-lucide="banknote"></i>} />
```

Value renders in mono tabular figures. `tone` tints the icon; `delta`/`deltaDir` show the trend.
