import React from 'react';

const CSS = `
.rp-tip{position:relative;display:inline-flex;}
.rp-tip__pop{position:absolute;z-index:50;left:50%;transform:translateX(-50%) translateY(4px);
  bottom:calc(100% + 8px);background:var(--surface-inverse);color:var(--text-inverse);
  font-family:var(--font-sans);font-size:var(--text-xs);font-weight:var(--fw-medium);line-height:1.4;
  padding:7px 10px;border-radius:var(--radius-sm);box-shadow:var(--shadow-lg);white-space:nowrap;
  max-width:240px;white-space:normal;width:max-content;opacity:0;pointer-events:none;
  transition:opacity var(--dur-fast) var(--ease-out),transform var(--dur-fast) var(--ease-out);}
.rp-tip:hover .rp-tip__pop,.rp-tip:focus-within .rp-tip__pop{opacity:1;transform:translateX(-50%) translateY(0);}
.rp-tip__pop::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);
  border:5px solid transparent;border-top-color:var(--surface-inverse);}
.rp-tip__pop--bottom{bottom:auto;top:calc(100% + 8px);}
.rp-tip__pop--bottom::after{top:auto;bottom:100%;border-top-color:transparent;border-bottom-color:var(--surface-inverse);}
`;
if (typeof document !== 'undefined' && !document.getElementById('rp-tip-css')) {
  const s = document.createElement('style'); s.id = 'rp-tip-css'; s.textContent = CSS;
  document.head.appendChild(s);
}

export function Tooltip({ content, placement = 'top', className = '', children }) {
  return (
    <span className={`rp-tip ${className}`} tabIndex={0}>
      {children}
      <span className={['rp-tip__pop', placement === 'bottom' && 'rp-tip__pop--bottom'].filter(Boolean).join(' ')} role="tooltip">
        {content}
      </span>
    </span>
  );
}
