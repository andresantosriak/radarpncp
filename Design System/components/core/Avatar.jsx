import React from 'react';

const CSS = `
.rp-avatar{display:inline-flex;align-items:center;justify-content:center;flex:none;
  border-radius:50%;background:var(--brand-soft);color:var(--brand-soft-fg);
  font-family:var(--font-sans);font-weight:var(--fw-bold);letter-spacing:var(--tracking-tight);
  overflow:hidden;user-select:none;}
.rp-avatar img{width:100%;height:100%;object-fit:cover;}
.rp-avatar--square{border-radius:var(--radius-md);}
.rp-avatar--gold{background:var(--accent-soft);color:var(--accent-soft-fg);}
.rp-avatar--neutral{background:var(--bg-subtle);color:var(--text-muted);}
`;
if (typeof document !== 'undefined' && !document.getElementById('rp-avatar-css')) {
  const s = document.createElement('style'); s.id = 'rp-avatar-css'; s.textContent = CSS;
  document.head.appendChild(s);
}

const SIZES = { sm: 28, md: 36, lg: 48, xl: 64 };

function initials(name = '') {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

export function Avatar({
  name = '',
  src,
  size = 'md',
  shape = 'circle',
  tone = 'brand',
  className = '',
  ...rest
}) {
  const px = SIZES[size] || size;
  const cls = [
    'rp-avatar',
    shape === 'square' && 'rp-avatar--square',
    tone !== 'brand' && `rp-avatar--${tone}`,
    className,
  ].filter(Boolean).join(' ');
  const fs = Math.round(px * 0.4);
  return (
    <span className={cls} style={{ width: px, height: px, fontSize: fs }} title={name} {...rest}>
      {src ? <img src={src} alt={name} /> : initials(name)}
    </span>
  );
}
