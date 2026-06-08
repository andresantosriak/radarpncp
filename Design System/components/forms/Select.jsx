import React from 'react';
import { Icon } from '../core/Icon.jsx';

const CSS = `
.rp-select{position:relative;display:flex;align-items:center;background:var(--surface);
  border:1px solid var(--border-strong);border-radius:var(--radius-md);height:42px;
  transition:border-color var(--dur-fast) var(--ease-out),box-shadow var(--dur-fast) var(--ease-out);}
.rp-select:focus-within{border-color:var(--brand);box-shadow:0 0 0 3px var(--ring);}
.rp-select--sm{height:34px;border-radius:var(--radius-sm);}
.rp-select select{appearance:none;-webkit-appearance:none;border:0;background:transparent;outline:none;
  font-family:var(--font-sans);font-size:var(--text-base);color:var(--text-strong);
  padding:0 36px 0 12px;height:100%;width:100%;cursor:pointer;}
.rp-select__chev{position:absolute;right:11px;pointer-events:none;color:var(--text-subtle);display:flex;}
.rp-select__chev svg{width:18px;height:18px;}
`;
if (typeof document !== 'undefined' && !document.getElementById('rp-select-css')) {
  const s = document.createElement('style'); s.id = 'rp-select-css'; s.textContent = CSS;
  document.head.appendChild(s);
}

export function Select({
  label, options = [], size = 'md', id, className = '', children, ...rest
}) {
  const fid = id || (label ? `s-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  return (
    <div className={`rp-field ${className}`}>
      {label && <label className="rp-field__label" htmlFor={fid}>{label}</label>}
      <div className={['rp-select', size === 'sm' && 'rp-select--sm'].filter(Boolean).join(' ')}>
        <select id={fid} {...rest}>
          {options.map((o) => {
            const val = typeof o === 'string' ? o : o.value;
            const lbl = typeof o === 'string' ? o : o.label;
            return <option key={val} value={val}>{lbl}</option>;
          })}
          {children}
        </select>
        <span className="rp-select__chev"><Icon name="chevron-down" /></span>
      </div>
    </div>
  );
}
