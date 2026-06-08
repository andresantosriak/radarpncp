Modal dialog — confirm descarte, gerar proposta, edit company profile.

```jsx
const [open, setOpen] = React.useState(false);
<Dialog open={open} onClose={() => setOpen(false)}
  title="Gerar proposta" subtitle="Composição automática pela IA"
  footer={<>
    <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
    <Button variant="primary">Gerar</Button>
  </>}>
  <p>Vamos calcular o valor recomendado por composição de custos…</p>
</Dialog>
```

Sizes `sm`/`md`/`lg`. Renders nothing when `open` is false.
