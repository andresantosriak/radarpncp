import React from 'react';

const CSS = `
.rp-switch{display:inline-flex;align-items:center;gap:10px;cursor:pointer;
  font-family:var(--font-sans);font-size:var(--text-base);color:var(--text-body);user-select:none;}
.rp-switch input{position:absolute;opacity:0;width:0;height:0;}
.rp-switch__track{flex:none;width:40px;height:23px;border-radius:var(--radius-pill);
  background:var(--ink-200);padding:2px;transition:background var(--dur-base) var(--ease-out);}
.rp-switch__thumb{width:19px;height:19px;border-radius:50%;background:#fff;box-shadow:var(--shadow-sm);
  transition:transform var(--dur-base) var(--ease-spring);}
.rp-switch input:checked + .rp-switch__track{background:var(--brand);}
.rp-switch input:checked + .rp-switch__track .rp-switch__thumb{transform:translateX(17px);}
.rp-switch input:focus-visible + .rp-switch__track{box-shadow:0 0 0 3px var(--ring);}
.rp-switch input:disabled ~ *{opacity:.5;}
`;
if (typeof document !== 'undefined' && !document.getElementById('rp-switch-css')) {
  const s = document.createElement('style'); s.id = 'rp-switch-css'; s.textContent = CSS;
  document.head.appendChild(s);
}

export function Switch({ label, className = '', children, ...rest }) {
  return (
    <label className={`rp-switch ${className}`}>
      <input type="checkbox" {...rest} />
      <span className="rp-switch__track" aria-hidden="true"><span className="rp-switch__thumb" /></span>
      {(label || children) && <span>{label || children}</span>}
    </label>
  );
}
