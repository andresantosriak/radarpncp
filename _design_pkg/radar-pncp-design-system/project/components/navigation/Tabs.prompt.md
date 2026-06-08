Tab bar — dashboard filter buckets and detail-view sections. Supports icons + count pills.

```jsx
<Tabs defaultValue="melhores" onChange={setFilter} items={[
  { value: 'melhores', label: 'Melhores', count: 12 },
  { value: 'urgentes', label: 'Urgentes', icon: <i data-lucide="alarm-clock"></i>, count: 6 },
  { value: 'descartados', label: 'Descartados' },
]} />

<Tabs variant="pill" defaultValue="resumo" items={[
  { value: 'resumo', label: 'Resumo' }, { value: 'docs', label: 'Documentos' },
]} />
```

Controlled via `value`+`onChange`, or uncontrolled via `defaultValue`. `pill` is the compact segmented variant.
