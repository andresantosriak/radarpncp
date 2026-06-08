import React from 'react';

const CSS = `
.rp-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);
  box-shadow:var(--shadow-sm);color:var(--text-body);
  transition:box-shadow var(--dur-base) var(--ease-out),border-color var(--dur-base) var(--ease-out),transform var(--dur-base) var(--ease-out);}
.rp-card--pad{padding:var(--space-5);}
.rp-card--raised{box-shadow:var(--shadow-md);}
.rp-card--flat{box-shadow:none;}
.rp-card--interactive{cursor:pointer;}
.rp-card--interactive:hover{box-shadow:var(--shadow-lg);border-color:var(--border-strong);transform:translateY(-2px);}
.rp-card--accent{border-left:3px solid var(--brand);}
.rp-card__head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:var(--space-3);}
.rp-card__title{font-size:var(--text-lg);font-weight:var(--fw-bold);color:var(--text-strong);letter-spacing:var(--tracking-tight);}
.rp-card__sub{font-size:var(--text-sm);color:var(--text-muted);margin-top:2px;}
`;
if (typeof document !== 'undefined' && !document.getElementById('rp-card-css')) {
  const s = document.createElement('style'); s.id = 'rp-card-css'; s.textContent = CSS;
  document.head.appendChild(s);
}

export function Card({
  padded = true,
  elevation = 'sm',
  interactive = false,
  accent = false,
  title,
  subtitle,
  action,
  className = '',
  children,
  ...rest
}) {
  const cls = [
    'rp-card',
    padded && 'rp-card--pad',
    elevation === 'md' && 'rp-card--raised',
    elevation === 'none' && 'rp-card--flat',
    interactive && 'rp-card--interactive',
    accent && 'rp-card--accent',
    className,
  ].filter(Boolean).join(' ');
  return (
    <div className={cls} {...rest}>
      {(title || action) && (
        <div className="rp-card__head">
          <div>
            {title && <div className="rp-card__title">{title}</div>}
            {subtitle && <div className="rp-card__sub">{subtitle}</div>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
