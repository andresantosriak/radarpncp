import React from 'react';
import { Icon } from '../core/Icon.jsx';

const CSS = `
.rp-check{display:inline-flex;align-items:flex-start;gap:10px;cursor:pointer;
  font-family:var(--font-sans);font-size:var(--text-base);color:var(--text-body);user-select:none;}
.rp-check input{position:absolute;opacity:0;width:0;height:0;}
.rp-check__box{flex:none;width:20px;height:20px;border-radius:var(--radius-xs);
  border:1.5px solid var(--border-strong);background:var(--surface);display:flex;
  align-items:center;justify-content:center;color:transparent;margin-top:1px;
  transition:all var(--dur-fast) var(--ease-out);}
.rp-check--radio .rp-check__box{border-radius:50%;}
.rp-check input:focus-visible + .rp-check__box{box-shadow:0 0 0 3px var(--ring);}
.rp-check input:checked + .rp-check__box{background:var(--brand);border-color:var(--brand);color:var(--brand-contrast);}
.rp-check--radio input:checked + .rp-check__box{background:var(--brand);}
.rp-check__box svg{width:14px;height:14px;}
.rp-check__dot{width:8px;height:8px;border-radius:50%;background:var(--brand-contrast);transform:scale(0);transition:transform var(--dur-fast) var(--ease-spring);}
.rp-check--radio input:checked + .rp-check__box .rp-check__dot{transform:scale(1);}
.rp-check input:disabled ~ *{opacity:.5;}
.rp-check__txt{display:flex;flex-direction:column;gap:2px;line-height:1.35;}
.rp-check__desc{font-size:var(--text-xs);color:var(--text-muted);}
`;
if (typeof document !== 'undefined' && !document.getElementById('rp-check-css')) {
  const s = document.createElement('style'); s.id = 'rp-check-css'; s.textContent = CSS;
  document.head.appendChild(s);
}

export function Checkbox({ label, description, type = 'checkbox', className = '', children, ...rest }) {
  const isRadio = type === 'radio';
  return (
    <label className={['rp-check', isRadio && 'rp-check--radio', className].filter(Boolean).join(' ')}>
      <input type={type} {...rest} />
      <span className="rp-check__box" aria-hidden="true">
        {isRadio ? <span className="rp-check__dot" /> : <Icon name="check" size={14} />}
      </span>
      <span className="rp-check__txt">
        <span>{label || children}</span>
        {description && <span className="rp-check__desc">{description}</span>}
      </span>
    </label>
  );
}
