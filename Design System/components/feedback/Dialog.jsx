import React from 'react';
import { Icon } from '../core/Icon.jsx';

const CSS = `
.rp-dialog__scrim{position:fixed;inset:0;background:var(--overlay-scrim);backdrop-filter:blur(var(--blur-sm));
  display:flex;align-items:center;justify-content:center;padding:24px;z-index:1000;
  animation:rp-dialog-in var(--dur-base) var(--ease-out);}
.rp-dialog{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-xl);
  box-shadow:var(--shadow-xl);width:100%;max-width:480px;max-height:90vh;display:flex;flex-direction:column;
  animation:rp-dialog-pop var(--dur-base) var(--ease-spring);}
.rp-dialog--lg{max-width:680px;}
.rp-dialog--sm{max-width:380px;}
.rp-dialog__head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:22px 24px 6px;}
.rp-dialog__title{font-size:var(--text-xl);font-weight:var(--fw-bold);color:var(--text-strong);letter-spacing:var(--tracking-tight);}
.rp-dialog__sub{font-size:var(--text-sm);color:var(--text-muted);margin-top:4px;}
.rp-dialog__x{appearance:none;border:0;background:transparent;cursor:pointer;color:var(--text-subtle);
  width:32px;height:32px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;flex:none;}
.rp-dialog__x:hover{background:var(--bg-subtle);color:var(--text-strong);}
.rp-dialog__x svg{width:18px;height:18px;}
.rp-dialog__body{padding:14px 24px;overflow:auto;color:var(--text-body);font-size:var(--text-base);}
.rp-dialog__foot{display:flex;justify-content:flex-end;gap:10px;padding:14px 24px 22px;}
@keyframes rp-dialog-in{from{opacity:0}to{opacity:1}}
@keyframes rp-dialog-pop{from{opacity:0;transform:translateY(12px) scale(.97)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.rp-dialog,.rp-dialog__scrim{animation:none}}
`;
if (typeof document !== 'undefined' && !document.getElementById('rp-dialog-css')) {
  const s = document.createElement('style'); s.id = 'rp-dialog-css'; s.textContent = CSS;
  document.head.appendChild(s);
}

export function Dialog({ open, onClose, title, subtitle, size = 'md', footer, className = '', children }) {
  if (!open) return null;
  return (
    <div className="rp-dialog__scrim" onClick={onClose}>
      <div className={['rp-dialog', size !== 'md' && `rp-dialog--${size}`, className].filter(Boolean).join(' ')}
        role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="rp-dialog__head">
          <div>
            {title && <div className="rp-dialog__title">{title}</div>}
            {subtitle && <div className="rp-dialog__sub">{subtitle}</div>}
          </div>
          <button className="rp-dialog__x" aria-label="Fechar" onClick={onClose}><Icon name="x" /></button>
        </div>
        <div className="rp-dialog__body">{children}</div>
        {footer && <div className="rp-dialog__foot">{footer}</div>}
      </div>
    </div>
  );
}
