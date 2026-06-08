import React from 'react';

const CSS = `
.rp-ic{display:inline-flex;align-items:center;justify-content:center;flex:none;line-height:0;}
.rp-ic svg{width:100%;height:100%;display:block;}
`;
if (typeof document !== 'undefined' && !document.getElementById('rp-ic-css')) {
  const s = document.createElement('style'); s.id = 'rp-ic-css'; s.textContent = CSS;
  document.head.appendChild(s);
}

function pascal(n) {
  return String(n).replace(/(^|-)([a-z0-9])/g, (_, _a, c) => c.toUpperCase());
}

/* Build the SVG markup once from lucide's icon data and inject it as the
   span's innerHTML. React only ever manages the <span>, never the <svg>,
   so re-renders / unmounts never collide with DOM lucide would mutate. */
export function Icon({ name, size = 18, strokeWidth = 2, className = '', style, ...rest }) {
  const html = React.useMemo(() => {
    const L = typeof window !== 'undefined' ? window.lucide : null;
    const node = L && L.icons ? (L.icons[pascal(name)] || L.icons[name]) : null;
    if (!node) return '';
    const kids = node.map((entry) => {
      const tag = entry[0];
      const attrs = entry[1] || {};
      const a = Object.keys(attrs).map((k) => `${k}="${attrs[k]}"`).join(' ');
      return `<${tag} ${a} />`;
    }).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${kids}</svg>`;
  }, [name, strokeWidth]);
  return (
    <span className={`rp-ic ${className}`} aria-hidden="true"
      style={{ width: size, height: size, ...style }}
      dangerouslySetInnerHTML={{ __html: html }} {...rest} />
  );
}
