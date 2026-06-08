import React from 'react';

const CSS = `
.rp-field{display:flex;flex-direction:column;gap:6px;}
.rp-field__label{font-size:var(--text-sm);font-weight:var(--fw-semibold);color:var(--text-strong);}
.rp-field__hint{font-size:var(--text-xs);color:var(--text-muted);}
.rp-field__err{font-size:var(--text-xs);color:var(--danger-fg);font-weight:var(--fw-medium);}
.rp-input{display:flex;align-items:center;gap:8px;background:var(--surface);
  border:1px solid var(--border-strong);border-radius:var(--radius-md);
  padding:0 12px;height:42px;transition:border-color var(--dur-fast) var(--ease-out),box-shadow var(--dur-fast) var(--ease-out);}
.rp-input:focus-within{border-color:var(--brand);box-shadow:0 0 0 3px var(--ring);}
.rp-input--err{border-color:var(--danger);}
.rp-input--sm{height:34px;border-radius:var(--radius-sm);}
.rp-input__el{flex:1;border:0;background:transparent;outline:none;font-family:var(--font-sans);
  font-size:var(--text-base);color:var(--text-strong);min-width:0;}
.rp-input__el::placeholder{color:var(--text-subtle);}
.rp-input svg{width:18px;height:18px;color:var(--text-subtle);flex:none;}
`;
if (typeof document !== 'undefined' && !document.getElementById('rp-input-css')) {
  const s = document.createElement('style'); s.id = 'rp-input-css'; s.textContent = CSS;
  document.head.appendChild(s);
}

export function Input({
  label, hint, error, iconLeft, iconRight, size = 'md', id,
  className = '', ...rest
}) {
  const fid = id || (label ? `f-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  return (
    <div className={`rp-field ${className}`}>
      {label && <label className="rp-field__label" htmlFor={fid}>{label}</label>}
      <div className={['rp-input', size === 'sm' && 'rp-input--sm', error && 'rp-input--err'].filter(Boolean).join(' ')}>
        {iconLeft}
        <input id={fid} className="rp-input__el" {...rest} />
        {iconRight}
      </div>
      {error ? <span className="rp-field__err">{error}</span> : hint && <span className="rp-field__hint">{hint}</span>}
    </div>
  );
}
