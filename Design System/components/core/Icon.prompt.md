Brand icon — a Lucide glyph rendered as a React-owned inline SVG (re-render safe). Inherits `currentColor`.

```jsx
<Icon name="radar" />
<Icon name="alarm-clock" size={16} />
<Button iconLeft={<Icon name="file-signature" />}>Gerar proposta</Button>
```

Use kebab-case Lucide names. Requires the Lucide UMD global on the page. Prefer this over raw `<i data-lucide>` inside React.
