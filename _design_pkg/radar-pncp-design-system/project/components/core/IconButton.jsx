import React from 'react';

const CSS = `
.rp-iconbtn{display:inline-flex;align-items:center;justify-content:center;
  width:40px;height:40px;border-radius:var(--radius-md);cursor:pointer;
  border:1px solid transparent;background:transparent;color:var(--text-muted);
  transition:background var(--dur-fast) var(--ease-out),color var(--dur-fast) var(--ease-out),
    border-color var(--dur-fast) var(--ease-out),transform var(--dur-fast) var(--ease-out);}
.rp-iconbtn:hover{background:var(--bg-subtle);color:var(--text-strong);}
.rp-iconbtn:active{transform:scale(0.94);}
.rp-iconbtn:disabled{opacity:.45;pointer-events:none;}
.rp-iconbtn svg{width:20px;height:20px;}
.rp-iconbtn--sm{width:32px;height:32px;border-radius:var(--radius-sm);}
.rp-iconbtn--sm svg{width:16px;height:16px;}
.rp-iconbtn--lg{width:48px;height:48px;}
.rp-iconbtn--solid{background:var(--brand);color:var(--brand-contrast);}
.rp-iconbtn--solid:hover{background:var(--brand-hover);color:var(--brand-contrast);}
.rp-iconbtn--outline{border-color:var(--border-strong);color:var(--text-body);}
.rp-iconbtn--outline:hover{border-color:var(--ink-300);background:var(--bg-subtle);}
.rp-iconbtn--active{background:var(--brand-soft);color:var(--brand-soft-fg);}
`;
if (typeof document !== 'undefined' && !document.getElementById('rp-iconbtn-css')) {
  const s = document.createElement('style'); s.id = 'rp-iconbtn-css'; s.textContent = CSS;
  document.head.appendChild(s);
}

export function IconButton({
  variant = 'ghost',
  size = 'md',
  active = false,
  label,
  className = '',
  children,
  ...rest
}) {
  const cls = [
    'rp-iconbtn',
    variant !== 'ghost' && `rp-iconbtn--${variant}`,
    size !== 'md' && `rp-iconbtn--${size}`,
    active && 'rp-iconbtn--active',
    className,
  ].filter(Boolean).join(' ');
  return (
    <button className={cls} aria-label={label} title={label} {...rest}>
      {children}
    </button>
  );
}
