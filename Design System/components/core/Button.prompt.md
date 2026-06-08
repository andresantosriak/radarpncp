Primary action button — use for the main decision on a view; secondary/ghost for the rest.

```jsx
<Button variant="primary" iconLeft={<i data-lucide="radar"></i>}>Analisar oportunidade</Button>
<Button variant="secondary">Ver edital</Button>
<Button variant="ghost" size="sm">Descartar</Button>
<Button variant="danger">Excluir</Button>
<Button loading>Salvando…</Button>
```

Variants: `primary` (teal brand), `secondary` (bordered surface), `ghost` (text), `danger`.
Sizes: `sm` · `md` (default) · `lg`. Props: `iconLeft`, `iconRight`, `fullWidth`, `loading`, `as`.
Keep one primary per view. Labels are sentence-case, imperative ("Participar", "Gerar proposta").
