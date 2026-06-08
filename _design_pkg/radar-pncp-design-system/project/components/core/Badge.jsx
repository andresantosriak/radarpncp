import React from 'react';

const CSS = `
.rp-badge{display:inline-flex;align-items:center;gap:6px;
  font-family:var(--font-sans);font-size:var(--text-xs);font-weight:var(--fw-semibold);
  line-height:1;letter-spacing:var(--tracking-tight);white-space:nowrap;
  padding:4px 9px;border-radius:var(--radius-pill);border:1px solid transparent;}
.rp-badge--lg{font-size:var(--text-sm);padding:5px 12px;}
.rp-badge__dot{width:6px;height:6px;border-radius:50%;background:currentColor;flex:none;}
.rp-badge--neutral{background:var(--bg-subtle);color:var(--text-muted);border-color:var(--border);}
.rp-badge--brand{background:var(--brand-soft);color:var(--brand-soft-fg);}
.rp-badge--gold{background:var(--accent-soft);color:var(--accent-soft-fg);}
.rp-badge--success{background:var(--success-soft);color:var(--success-fg);}
.rp-badge--warning{background:var(--warning-soft);color:var(--warning-fg);}
.rp-badge--danger{background:var(--danger-soft);color:var(--danger-fg);}
.rp-badge--info{background:var(--info-soft);color:var(--info-soft-fg);}
.rp-badge--solid{border:0;color:#fff;}
.rp-badge--solid.rp-badge--brand{background:var(--brand);color:var(--brand-contrast);}
.rp-badge--solid.rp-badge--success{background:var(--success);}
.rp-badge--solid.rp-badge--warning{background:var(--warning);}
.rp-badge--solid.rp-badge--danger{background:var(--danger);}
`;
if (typeof document !== 'undefined' && !document.getElementById('rp-badge-css')) {
  const s = document.createElement('style'); s.id = 'rp-badge-css'; s.textContent = CSS;
  document.head.appendChild(s);
}

export function Badge({
  tone = 'neutral',
  size = 'md',
  solid = false,
  dot = false,
  className = '',
  children,
  ...rest
}) {
  const cls = [
    'rp-badge',
    `rp-badge--${tone}`,
    size === 'lg' && 'rp-badge--lg',
    solid && 'rp-badge--solid',
    className,
  ].filter(Boolean).join(' ');
  return (
    <span className={cls} {...rest}>
      {dot && <span className="rp-badge__dot" aria-hidden="true" />}
      {children}
    </span>
  );
}
