import React from 'react';

const CSS = `
.rp-tabs{display:flex;gap:2px;border-bottom:1px solid var(--border);}
.rp-tab{appearance:none;border:0;background:transparent;cursor:pointer;font-family:var(--font-sans);
  font-size:var(--text-base);font-weight:var(--fw-medium);color:var(--text-muted);
  padding:11px 16px;position:relative;display:inline-flex;align-items:center;gap:7px;
  transition:color var(--dur-fast) var(--ease-out);}
.rp-tab:hover{color:var(--text-strong);}
.rp-tab svg{width:16px;height:16px;}
.rp-tab__count{font-family:var(--font-mono);font-size:var(--text-xs);background:var(--bg-subtle);
  color:var(--text-muted);padding:1px 7px;border-radius:var(--radius-pill);font-weight:600;}
.rp-tab--active{color:var(--brand);font-weight:var(--fw-semibold);}
.rp-tab--active .rp-tab__count{background:var(--brand-soft);color:var(--brand-soft-fg);}
.rp-tab--active::after{content:'';position:absolute;left:8px;right:8px;bottom:-1px;height:2px;
  background:var(--brand);border-radius:2px 2px 0 0;}
.rp-tabs--pill{border:0;gap:6px;background:var(--bg-subtle);padding:4px;border-radius:var(--radius-md);display:inline-flex;}
.rp-tabs--pill .rp-tab{border-radius:var(--radius-sm);padding:7px 14px;}
.rp-tabs--pill .rp-tab--active{background:var(--surface);box-shadow:var(--shadow-xs);color:var(--text-strong);}
.rp-tabs--pill .rp-tab--active::after{display:none;}
`;
if (typeof document !== 'undefined' && !document.getElementById('rp-tabs-css')) {
  const s = document.createElement('style'); s.id = 'rp-tabs-css'; s.textContent = CSS;
  document.head.appendChild(s);
}

export function Tabs({ items = [], value, defaultValue, onChange, variant = 'underline', className = '' }) {
  const [internal, setInternal] = React.useState(defaultValue ?? items[0]?.value);
  const active = value !== undefined ? value : internal;
  const select = (v) => { if (value === undefined) setInternal(v); onChange && onChange(v); };
  return (
    <div className={['rp-tabs', variant === 'pill' && 'rp-tabs--pill', className].filter(Boolean).join(' ')} role="tablist">
      {items.map((it) => (
        <button key={it.value} role="tab" aria-selected={active === it.value}
          className={['rp-tab', active === it.value && 'rp-tab--active'].filter(Boolean).join(' ')}
          onClick={() => select(it.value)}>
          {it.icon}{it.label}
          {it.count != null && <span className="rp-tab__count">{it.count}</span>}
        </button>
      ))}
    </div>
  );
}
