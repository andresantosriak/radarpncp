import React from 'react';
import { Icon } from './Icon.jsx';

const CSS = `
.rp-tag{display:inline-flex;align-items:center;gap:6px;font-family:var(--font-sans);
  font-size:var(--text-sm);font-weight:var(--fw-medium);line-height:1;color:var(--text-body);
  background:var(--surface);border:1px solid var(--border-strong);border-radius:var(--radius-pill);
  padding:6px 12px;cursor:default;transition:all var(--dur-fast) var(--ease-out);}
.rp-tag--button{cursor:pointer;}
.rp-tag--button:hover{border-color:var(--ink-300);background:var(--bg-subtle);}
.rp-tag--selected{background:var(--brand-soft);border-color:transparent;color:var(--brand-soft-fg);font-weight:var(--fw-semibold);}
.rp-tag__remove{display:inline-flex;margin:-2px -4px -2px 0;width:18px;height:18px;align-items:center;
  justify-content:center;border-radius:50%;cursor:pointer;color:var(--text-subtle);}
.rp-tag__remove:hover{background:color-mix(in oklab,var(--text-muted) 20%,transparent);color:var(--text-strong);}
.rp-tag svg{width:14px;height:14px;}
`;
if (typeof document !== 'undefined' && !document.getElementById('rp-tag-css')) {
  const s = document.createElement('style'); s.id = 'rp-tag-css'; s.textContent = CSS;
  document.head.appendChild(s);
}

export function Tag({
  selected = false,
  icon,
  onRemove,
  onClick,
  className = '',
  children,
  ...rest
}) {
  const interactive = !!onClick;
  const cls = [
    'rp-tag',
    interactive && 'rp-tag--button',
    selected && 'rp-tag--selected',
    className,
  ].filter(Boolean).join(' ');
  return (
    <span className={cls} onClick={onClick} {...rest}>
      {icon}
      {children}
      {onRemove && (
        <span
          className="rp-tag__remove"
          role="button"
          aria-label="Remover"
          onClick={(e) => { e.stopPropagation(); onRemove(e); }}
        >
          <Icon name="x" size={14} />
        </span>
      )}
    </span>
  );
}
