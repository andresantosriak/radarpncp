Dense, sticky-header table — full edital lists, documentos exigidos, composição de custos.

```jsx
<DataTable
  onRowClick={(r) => open(r)}
  columns={[
    { key: 'orgao', header: 'Órgão', strong: true },
    { key: 'objeto', header: 'Objeto' },
    { key: 'valor', header: 'Valor', align: 'right', mono: true },
    { key: 'prazo', header: 'Prazo', align: 'right', mono: true },
    { key: 'score', header: 'Score', align: 'center', render: (v) => <ScoreGauge value={v} size={40} stroke={5} showLabel={false} /> },
  ]}
  rows={editais}
/>
```

Use `mono` on numeric columns, `render` for badges/gauges, `onRowClick` to open detail.
