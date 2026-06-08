import React from 'react';
import { Icon } from '../core/Icon.jsx';

const CSS = `
.rp-toast{display:flex;align-items:flex-start;gap:12px;background:var(--surface);
  border:1px solid var(--border);border-left:3px solid var(--brand);border-radius:var(--radius-md);
  box-shadow:var(--shadow-lg);padding:14px 16px;max-width:380px;
  animation:rp-toast-in var(--dur-base) var(--ease-spring);}
.rp-toast--success{border-left-color:var(--success);}
.rp-toast--warning{border-left-color:var(--warning);}
.rp-toast--danger{border-left-color:var(--danger);}
.rp-toast--gold{border-left-color:var(--accent);}
.rp-toast__icon{flex:none;width:32px;height:32px;border-radius:var(--radius-sm);display:flex;
  align-items:center;justify-content:center;background:var(--brand-soft);color:var(--brand-soft-fg);}
.rp-toast--success .rp-toast__icon{background:var(--success-soft);color:var(--success-fg);}
.rp-toast--warning .rp-toast__icon{background:var(--warning-soft);color:var(--warning-fg);}
.rp-toast--danger .rp-toast__icon{background:var(--danger-soft);color:var(--danger-fg);}
.rp-toast--gold .rp-toast__icon{background:var(--accent-soft);color:var(--accent-soft-fg);}
.rp-toast__icon svg{width:18px;height:18px;}
.rp-toast__body{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px;}
.rp-toast__title{font-size:var(--text-base);font-weight:var(--fw-semibold);color:var(--text-strong);}
.rp-toast__msg{font-size:var(--text-sm);color:var(--text-muted);line-height:1.4;}
.rp-toast__x{appearance:none;border:0;background:transparent;cursor:pointer;color:var(--text-subtle);
  width:24px;height:24px;display:flex;align-items:center;justify-content:center;border-radius:var(--radius-xs);flex:none;}
.rp-toast__x:hover{color:var(--text-strong);}
.rp-toast__x svg{width:15px;height:15px;}
@keyframes rp-toast-in{from{opacity:0;transform:translateX(12px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.rp-toast{animation:none}}
`;
if (typeof document !== 'undefined' && !document.getElementById('rp-toast-css')) {
  const s = document.createElement('style'); s.id = 'rp-toast-css'; s.textContent = CSS;
  document.head.appendChild(s);
}

const ICONS = { brand: 'radar', success: 'check-circle-2', warning: 'alert-triangle', danger: 'x-circle', gold: 'sparkles' };

export function Toast({ tone = 'brand', title, message, icon, onClose, className = '' }) {
  return (
    <div className={['rp-toast', tone !== 'brand' && `rp-toast--${tone}`, className].filter(Boolean).join(' ')} role="status">
      <span className="rp-toast__icon">{icon || <Icon name={ICONS[tone] || 'bell'} />}</span>
      <div className="rp-toast__body">
        {title && <span className="rp-toast__title">{title}</span>}
        {message && <span className="rp-toast__msg">{message}</span>}
      </div>
      {onClose && <button className="rp-toast__x" aria-label="Fechar" onClick={onClose}><Icon name="x" size={15} /></button>}
    </div>
  );
}
