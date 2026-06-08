import React from 'react';

/* Inject component CSS once (self-contained; reads DS tokens) */
const CSS = `
.rp-btn{--_h:40px;--_px:16px;--_fs:var(--text-base);
  display:inline-flex;align-items:center;justify-content:center;gap:8px;
  height:var(--_h);padding:0 var(--_px);font-family:var(--font-sans);
  font-size:var(--_fs);font-weight:var(--fw-semibold);line-height:1;
  border:1px solid transparent;border-radius:var(--radius-md);cursor:pointer;
  letter-spacing:var(--tracking-tight);white-space:nowrap;text-decoration:none;
  transition:background var(--dur-fast) var(--ease-out),
    border-color var(--dur-fast) var(--ease-out),
    color var(--dur-fast) var(--ease-out),
    transform var(--dur-fast) var(--ease-out),box-shadow var(--dur-fast) var(--ease-out);}
.rp-btn:active{transform:translateY(0.5px) scale(0.99);}
.rp-btn:disabled,.rp-btn[aria-disabled=true]{opacity:.5;pointer-events:none;}
.rp-btn--full{width:100%;}
.rp-btn--sm{--_h:32px;--_px:12px;--_fs:var(--text-sm);border-radius:var(--radius-sm);}
.rp-btn--lg{--_h:48px;--_px:22px;--_fs:var(--text-lg);border-radius:var(--radius-lg);}
.rp-btn--primary{background:var(--brand);color:var(--brand-contrast);}
.rp-btn--primary:hover{background:var(--brand-hover);}
.rp-btn--primary:active{background:var(--brand-press);}
.rp-btn--secondary{background:var(--surface);color:var(--text-strong);border-color:var(--border-strong);box-shadow:var(--shadow-xs);}
.rp-btn--secondary:hover{background:var(--bg-subtle);border-color:var(--ink-300);}
.rp-btn--ghost{background:transparent;color:var(--text-body);}
.rp-btn--ghost:hover{background:var(--bg-subtle);color:var(--text-strong);}
.rp-btn--danger{background:var(--danger);color:#fff;}
.rp-btn--danger:hover{filter:brightness(1.06);}
.rp-btn__spin{width:1em;height:1em;border:2px solid currentColor;border-right-color:transparent;border-radius:50%;animation:rp-btn-spin .6s linear infinite;}
@keyframes rp-btn-spin{to{transform:rotate(360deg)}}
.rp-btn svg{width:1.15em;height:1.15em;flex:none;}
`;
if (typeof document !== 'undefined' && !document.getElementById('rp-btn-css')) {
  const s = document.createElement('style'); s.id = 'rp-btn-css'; s.textContent = CSS;
  document.head.appendChild(s);
}

export function Button({
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  fullWidth = false,
  loading = false,
  disabled = false,
  as = 'button',
  className = '',
  children,
  ...rest
}) {
  const Tag = as;
  const cls = [
    'rp-btn',
    `rp-btn--${variant}`,
    size !== 'md' && `rp-btn--${size}`,
    fullWidth && 'rp-btn--full',
    className,
  ].filter(Boolean).join(' ');

  return (
    <Tag
      className={cls}
      disabled={Tag === 'button' ? disabled || loading : undefined}
      aria-disabled={disabled || loading || undefined}
      {...rest}
    >
      {loading && <span className="rp-btn__spin" aria-hidden="true" />}
      {!loading && iconLeft}
      {children && <span>{children}</span>}
      {!loading && iconRight}
    </Tag>
  );
}
