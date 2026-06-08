Generic surface container — dashboard panels, stat blocks, detail sections.

```jsx
<Card title="Resumo da oportunidade" subtitle="Gerado pela IA" action={<IconButton label="Opções"><i data-lucide="more-horizontal"></i></IconButton>}>
  <p>O órgão quer contratar uma plataforma de atendimento digital…</p>
</Card>
<Card interactive accent>Card clicável com faixa de marca</Card>
```

Props: `padded`, `elevation` (none/sm/md), `interactive` (hover lift), `accent` (left brand stripe), `title`/`subtitle`/`action`.
