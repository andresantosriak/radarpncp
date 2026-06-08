/* @ds-bundle: {"format":3,"namespace":"RadarPNCPDesignSystem_ba9943","components":[{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"DataTable","sourcePath":"components/data/DataTable.jsx"},{"name":"OpportunityCard","sourcePath":"components/data/OpportunityCard.jsx"},{"name":"ScoreGauge","sourcePath":"components/data/ScoreGauge.jsx"},{"name":"StatCard","sourcePath":"components/data/StatCard.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/core/Avatar.jsx":"a0a745e5370c","components/core/Badge.jsx":"eef622cfd4d1","components/core/Button.jsx":"0dee5dabab14","components/core/Card.jsx":"4409fc43a807","components/core/Icon.jsx":"f0352b49e6c2","components/core/IconButton.jsx":"e54829715e42","components/core/Tag.jsx":"53cebefe7e17","components/data/DataTable.jsx":"f5a40d2fc4a1","components/data/OpportunityCard.jsx":"1227e7d9bdf6","components/data/ScoreGauge.jsx":"efd55a9c2c36","components/data/StatCard.jsx":"a917baa1a303","components/feedback/Dialog.jsx":"5c47c70a6028","components/feedback/Toast.jsx":"8ba8709aaae1","components/feedback/Tooltip.jsx":"1910145eb53e","components/forms/Checkbox.jsx":"8f29b0dd6fb5","components/forms/Input.jsx":"814c707a56aa","components/forms/Select.jsx":"bef88ee7e33f","components/forms/Switch.jsx":"ad913f456d08","components/navigation/Tabs.jsx":"e88832aa075d","ui_kits/radar/App.jsx":"544757e6755b","ui_kits/radar/Dashboard.jsx":"95a108bdfdba","ui_kits/radar/Detail.jsx":"f0185ea82398","ui_kits/radar/chrome.jsx":"3f8225feb641","ui_kits/radar/data.js":"3548965592c8","ui_kits/radar/parts.jsx":"a32d7a413ed8"},"inlinedExternals":[],"unexposedExports":[{"name":"scoreBand","sourcePath":"components/data/ScoreGauge.jsx"}]} */

(() => {

const __ds_ns = (window.RadarPNCPDesignSystem_ba9943 = window.RadarPNCPDesignSystem_ba9943 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
  const s = document.createElement('style');
  s.id = 'rp-avatar-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
const SIZES = {
  sm: 28,
  md: 36,
  lg: 48,
  xl: 64
};
function initials(name = '') {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
}
function Avatar({
  name = '',
  src,
  size = 'md',
  shape = 'circle',
  tone = 'brand',
  className = '',
  ...rest
}) {
  const px = SIZES[size] || size;
  const cls = ['rp-avatar', shape === 'square' && 'rp-avatar--square', tone !== 'brand' && `rp-avatar--${tone}`, className].filter(Boolean).join(' ');
  const fs = Math.round(px * 0.4);
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls,
    style: {
      width: px,
      height: px,
      fontSize: fs
    },
    title: name
  }, rest), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name
  }) : initials(name));
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.rp-badge{display:inline-flex;align-items:center;gap:6px;
  font-family:var(--font-sans);font-size:var(--text-xs);font-weight:var(--fw-semibold);
  line-height:1;letter-spacing:var(--tracking-tight);white-space:nowrap;
  padding:4px 9px;border-radius:var(--radius-pill);border:1px solid transparent;}
.rp-badge--lg{font-size:var(--text-sm);padding:5px 12px;}
.rp-badge__dot{width:6px;height:6px;border-radius:50%;background:currentColor;flex:none;}
.rp-badge--neutral{background:var(--bg-subtle);color:var(--text-muted);border-color:var(--border);}
.rp-badge--brand{background:var(--brand-soft);color:var(--brand-soft-fg);}
.rp-badge--gold{background:var(--accent-soft);color:var(--accent-soft-fg);}
.rp-badge--success{background:var(--success-soft);color:var(--success-fg);}
.rp-badge--warning{background:var(--warning-soft);color:var(--warning-fg);}
.rp-badge--danger{background:var(--danger-soft);color:var(--danger-fg);}
.rp-badge--info{background:var(--info-soft);color:var(--info-soft-fg);}
.rp-badge--solid{border:0;color:#fff;}
.rp-badge--solid.rp-badge--brand{background:var(--brand);color:var(--brand-contrast);}
.rp-badge--solid.rp-badge--success{background:var(--success);}
.rp-badge--solid.rp-badge--warning{background:var(--warning);}
.rp-badge--solid.rp-badge--danger{background:var(--danger);}
`;
if (typeof document !== 'undefined' && !document.getElementById('rp-badge-css')) {
  const s = document.createElement('style');
  s.id = 'rp-badge-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Badge({
  tone = 'neutral',
  size = 'md',
  solid = false,
  dot = false,
  className = '',
  children,
  ...rest
}) {
  const cls = ['rp-badge', `rp-badge--${tone}`, size === 'lg' && 'rp-badge--lg', solid && 'rp-badge--solid', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    className: "rp-badge__dot",
    "aria-hidden": "true"
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
  const s = document.createElement('style');
  s.id = 'rp-btn-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Button({
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
  const cls = ['rp-btn', `rp-btn--${variant}`, size !== 'md' && `rp-btn--${size}`, fullWidth && 'rp-btn--full', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls,
    disabled: Tag === 'button' ? disabled || loading : undefined,
    "aria-disabled": disabled || loading || undefined
  }, rest), loading && /*#__PURE__*/React.createElement("span", {
    className: "rp-btn__spin",
    "aria-hidden": "true"
  }), !loading && iconLeft, children && /*#__PURE__*/React.createElement("span", null, children), !loading && iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.rp-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);
  box-shadow:var(--shadow-sm);color:var(--text-body);
  transition:box-shadow var(--dur-base) var(--ease-out),border-color var(--dur-base) var(--ease-out),transform var(--dur-base) var(--ease-out);}
.rp-card--pad{padding:var(--space-5);}
.rp-card--raised{box-shadow:var(--shadow-md);}
.rp-card--flat{box-shadow:none;}
.rp-card--interactive{cursor:pointer;}
.rp-card--interactive:hover{box-shadow:var(--shadow-lg);border-color:var(--border-strong);transform:translateY(-2px);}
.rp-card--accent{border-left:3px solid var(--brand);}
.rp-card__head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:var(--space-3);}
.rp-card__title{font-size:var(--text-lg);font-weight:var(--fw-bold);color:var(--text-strong);letter-spacing:var(--tracking-tight);}
.rp-card__sub{font-size:var(--text-sm);color:var(--text-muted);margin-top:2px;}
`;
if (typeof document !== 'undefined' && !document.getElementById('rp-card-css')) {
  const s = document.createElement('style');
  s.id = 'rp-card-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Card({
  padded = true,
  elevation = 'sm',
  interactive = false,
  accent = false,
  title,
  subtitle,
  action,
  className = '',
  children,
  ...rest
}) {
  const cls = ['rp-card', padded && 'rp-card--pad', elevation === 'md' && 'rp-card--raised', elevation === 'none' && 'rp-card--flat', interactive && 'rp-card--interactive', accent && 'rp-card--accent', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls
  }, rest), (title || action) && /*#__PURE__*/React.createElement("div", {
    className: "rp-card__head"
  }, /*#__PURE__*/React.createElement("div", null, title && /*#__PURE__*/React.createElement("div", {
    className: "rp-card__title"
  }, title), subtitle && /*#__PURE__*/React.createElement("div", {
    className: "rp-card__sub"
  }, subtitle)), action), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.rp-ic{display:inline-flex;align-items:center;justify-content:center;flex:none;line-height:0;}
.rp-ic svg{width:100%;height:100%;display:block;}
`;
if (typeof document !== 'undefined' && !document.getElementById('rp-ic-css')) {
  const s = document.createElement('style');
  s.id = 'rp-ic-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function pascal(n) {
  return String(n).replace(/(^|-)([a-z0-9])/g, (_, _a, c) => c.toUpperCase());
}

/* Build the SVG markup once from lucide's icon data and inject it as the
   span's innerHTML. React only ever manages the <span>, never the <svg>,
   so re-renders / unmounts never collide with DOM lucide would mutate. */
function Icon({
  name,
  size = 18,
  strokeWidth = 2,
  className = '',
  style,
  ...rest
}) {
  const html = React.useMemo(() => {
    const L = typeof window !== 'undefined' ? window.lucide : null;
    const node = L && L.icons ? L.icons[pascal(name)] || L.icons[name] : null;
    if (!node) return '';
    const kids = node.map(entry => {
      const tag = entry[0];
      const attrs = entry[1] || {};
      const a = Object.keys(attrs).map(k => `${k}="${attrs[k]}"`).join(' ');
      return `<${tag} ${a} />`;
    }).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${kids}</svg>`;
  }, [name, strokeWidth]);
  return /*#__PURE__*/React.createElement("span", _extends({
    className: `rp-ic ${className}`,
    "aria-hidden": "true",
    style: {
      width: size,
      height: size,
      ...style
    },
    dangerouslySetInnerHTML: {
      __html: html
    }
  }, rest));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.rp-iconbtn{display:inline-flex;align-items:center;justify-content:center;
  width:40px;height:40px;border-radius:var(--radius-md);cursor:pointer;
  border:1px solid transparent;background:transparent;color:var(--text-muted);
  transition:background var(--dur-fast) var(--ease-out),color var(--dur-fast) var(--ease-out),
    border-color var(--dur-fast) var(--ease-out),transform var(--dur-fast) var(--ease-out);}
.rp-iconbtn:hover{background:var(--bg-subtle);color:var(--text-strong);}
.rp-iconbtn:active{transform:scale(0.94);}
.rp-iconbtn:disabled{opacity:.45;pointer-events:none;}
.rp-iconbtn svg{width:20px;height:20px;}
.rp-iconbtn--sm{width:32px;height:32px;border-radius:var(--radius-sm);}
.rp-iconbtn--sm svg{width:16px;height:16px;}
.rp-iconbtn--lg{width:48px;height:48px;}
.rp-iconbtn--solid{background:var(--brand);color:var(--brand-contrast);}
.rp-iconbtn--solid:hover{background:var(--brand-hover);color:var(--brand-contrast);}
.rp-iconbtn--outline{border-color:var(--border-strong);color:var(--text-body);}
.rp-iconbtn--outline:hover{border-color:var(--ink-300);background:var(--bg-subtle);}
.rp-iconbtn--active{background:var(--brand-soft);color:var(--brand-soft-fg);}
`;
if (typeof document !== 'undefined' && !document.getElementById('rp-iconbtn-css')) {
  const s = document.createElement('style');
  s.id = 'rp-iconbtn-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function IconButton({
  variant = 'ghost',
  size = 'md',
  active = false,
  label,
  className = '',
  children,
  ...rest
}) {
  const cls = ['rp-iconbtn', variant !== 'ghost' && `rp-iconbtn--${variant}`, size !== 'md' && `rp-iconbtn--${size}`, active && 'rp-iconbtn--active', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("button", _extends({
    className: cls,
    "aria-label": label,
    title: label
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.rp-tag{display:inline-flex;align-items:center;gap:6px;font-family:var(--font-sans);
  font-size:var(--text-sm);font-weight:var(--fw-medium);line-height:1;color:var(--text-body);
  background:var(--surface);border:1px solid var(--border-strong);border-radius:var(--radius-pill);
  padding:6px 12px;cursor:default;transition:all var(--dur-fast) var(--ease-out);}
.rp-tag--button{cursor:pointer;}
.rp-tag--button:hover{border-color:var(--ink-300);background:var(--bg-subtle);}
.rp-tag--selected{background:var(--brand-soft);border-color:transparent;color:var(--brand-soft-fg);font-weight:var(--fw-semibold);}
.rp-tag__remove{display:inline-flex;margin:-2px -4px -2px 0;width:18px;height:18px;align-items:center;
  justify-content:center;border-radius:50%;cursor:pointer;color:var(--text-subtle);}
.rp-tag__remove:hover{background:color-mix(in oklab,var(--text-muted) 20%,transparent);color:var(--text-strong);}
.rp-tag svg{width:14px;height:14px;}
`;
if (typeof document !== 'undefined' && !document.getElementById('rp-tag-css')) {
  const s = document.createElement('style');
  s.id = 'rp-tag-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Tag({
  selected = false,
  icon,
  onRemove,
  onClick,
  className = '',
  children,
  ...rest
}) {
  const interactive = !!onClick;
  const cls = ['rp-tag', interactive && 'rp-tag--button', selected && 'rp-tag--selected', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls,
    onClick: onClick
  }, rest), icon, children, onRemove && /*#__PURE__*/React.createElement("span", {
    className: "rp-tag__remove",
    role: "button",
    "aria-label": "Remover",
    onClick: e => {
      e.stopPropagation();
      onRemove(e);
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 14
  })));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/data/DataTable.jsx
try { (() => {
const CSS = `
.rp-table-wrap{width:100%;overflow:auto;border:1px solid var(--border);border-radius:var(--radius-lg);background:var(--surface);}
.rp-table{width:100%;border-collapse:collapse;font-family:var(--font-sans);font-size:var(--text-sm);}
.rp-table thead th{position:sticky;top:0;background:var(--bg-subtle);text-align:left;
  font-size:var(--text-xs);font-weight:var(--fw-semibold);letter-spacing:var(--tracking-wide);
  text-transform:uppercase;color:var(--text-muted);padding:11px 16px;white-space:nowrap;
  border-bottom:1px solid var(--border);}
.rp-table tbody td{padding:13px 16px;border-bottom:1px solid var(--border-subtle);color:var(--text-body);vertical-align:middle;}
.rp-table tbody tr:last-child td{border-bottom:0;}
.rp-table tbody tr{transition:background var(--dur-fast) var(--ease-out);}
.rp-table--hover tbody tr:hover{background:var(--bg-subtle);cursor:pointer;}
.rp-table .num{font-family:var(--font-mono);font-variant-numeric:tabular-nums;}
.rp-table .ta-right{text-align:right;}
.rp-table .ta-center{text-align:center;}
.rp-table .strong{color:var(--text-strong);font-weight:var(--fw-semibold);}
`;
if (typeof document !== 'undefined' && !document.getElementById('rp-table-css')) {
  const s = document.createElement('style');
  s.id = 'rp-table-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function DataTable({
  columns = [],
  rows = [],
  onRowClick,
  getRowKey,
  className = ''
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `rp-table-wrap ${className}`
  }, /*#__PURE__*/React.createElement("table", {
    className: ['rp-table', onRowClick && 'rp-table--hover'].filter(Boolean).join(' ')
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, columns.map(c => /*#__PURE__*/React.createElement("th", {
    key: c.key,
    className: c.align === 'right' ? 'ta-right' : c.align === 'center' ? 'ta-center' : '',
    style: c.width ? {
      width: c.width
    } : undefined
  }, c.header)))), /*#__PURE__*/React.createElement("tbody", null, rows.map((row, i) => /*#__PURE__*/React.createElement("tr", {
    key: getRowKey ? getRowKey(row, i) : i,
    onClick: onRowClick ? () => onRowClick(row, i) : undefined
  }, columns.map(c => {
    const cls = [c.mono && 'num', c.align === 'right' ? 'ta-right' : c.align === 'center' ? 'ta-center' : '', c.strong && 'strong'].filter(Boolean).join(' ');
    return /*#__PURE__*/React.createElement("td", {
      key: c.key,
      className: cls
    }, c.render ? c.render(row[c.key], row, i) : row[c.key]);
  }))))));
}
Object.assign(__ds_scope, { DataTable });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/DataTable.jsx", error: String((e && e.message) || e) }); }

// components/data/ScoreGauge.jsx
try { (() => {
const CSS = `
.rp-gauge{display:inline-flex;flex-direction:column;align-items:center;gap:4px;font-family:var(--font-mono);}
.rp-gauge__svg{display:block;transform:rotate(-90deg);}
.rp-gauge__track{stroke:var(--score-track);}
.rp-gauge__val{font-family:var(--font-mono);font-weight:600;fill:var(--text-strong);}
.rp-gauge__cap{font-family:var(--font-sans);font-size:var(--text-2xs);letter-spacing:var(--tracking-caps);
  text-transform:uppercase;color:var(--text-muted);font-weight:600;}
`;
if (typeof document !== 'undefined' && !document.getElementById('rp-gauge-css')) {
  const s = document.createElement('style');
  s.id = 'rp-gauge-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function scoreBand(v) {
  if (v >= 85) return {
    key: 'strong',
    color: 'var(--score-strong)',
    label: 'Muito forte'
  };
  if (v >= 70) return {
    key: 'good',
    color: 'var(--score-good)',
    label: 'Boa'
  };
  if (v >= 40) return {
    key: 'mid',
    color: 'var(--score-mid)',
    label: 'Possível'
  };
  return {
    key: 'low',
    color: 'var(--score-low)',
    label: 'Baixa'
  };
}
function ScoreGauge({
  value = 0,
  size = 84,
  stroke = 8,
  showLabel = true,
  caption
}) {
  const v = Math.max(0, Math.min(100, value));
  const band = scoreBand(v);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - v / 100);
  const fs = Math.round(size * 0.3);
  return /*#__PURE__*/React.createElement("div", {
    className: "rp-gauge"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "rp-gauge__svg",
    width: size,
    height: size,
    viewBox: `0 0 ${size} ${size}`
  }, /*#__PURE__*/React.createElement("circle", {
    className: "rp-gauge__track",
    cx: size / 2,
    cy: size / 2,
    r: r,
    fill: "none",
    strokeWidth: stroke
  }), /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    fill: "none",
    strokeWidth: stroke,
    stroke: band.color,
    strokeLinecap: "round",
    strokeDasharray: c,
    strokeDashoffset: off,
    style: {
      transition: 'stroke-dashoffset .8s var(--ease-out)'
    }
  }), /*#__PURE__*/React.createElement("text", {
    className: "rp-gauge__val",
    x: "50%",
    y: "50%",
    dominantBaseline: "central",
    textAnchor: "middle",
    fontSize: fs,
    transform: `rotate(90 ${size / 2} ${size / 2})`
  }, v)), showLabel && /*#__PURE__*/React.createElement("span", {
    className: "rp-gauge__cap",
    style: {
      color: band.color
    }
  }, caption || band.label));
}
Object.assign(__ds_scope, { scoreBand, ScoreGauge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/ScoreGauge.jsx", error: String((e && e.message) || e) }); }

// components/data/OpportunityCard.jsx
try { (() => {
const CSS = `
.rp-opp{display:flex;gap:18px;background:var(--surface);border:1px solid var(--border);
  border-radius:var(--radius-lg);padding:18px 20px;box-shadow:var(--shadow-sm);
  transition:box-shadow var(--dur-base) var(--ease-out),border-color var(--dur-base) var(--ease-out),transform var(--dur-base) var(--ease-out);}
.rp-opp--clickable{cursor:pointer;}
.rp-opp--clickable:hover{box-shadow:var(--shadow-lg);border-color:var(--border-strong);transform:translateY(-2px);}
.rp-opp__accent{width:3px;border-radius:var(--radius-pill);flex:none;margin:2px 0;}
.rp-opp__body{flex:1;min-width:0;display:flex;flex-direction:column;gap:10px;}
.rp-opp__head{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
.rp-opp__org{font-size:var(--text-sm);color:var(--text-muted);font-weight:var(--fw-medium);display:inline-flex;align-items:center;gap:5px;}
.rp-opp__org svg{width:14px;height:14px;}
.rp-opp__title{font-size:var(--text-lg);font-weight:var(--fw-bold);color:var(--text-strong);
  line-height:var(--leading-snug);letter-spacing:var(--tracking-tight);}
.rp-opp__meta{display:flex;flex-wrap:wrap;gap:6px 16px;font-family:var(--font-mono);font-size:var(--text-xs);color:var(--text-muted);}
.rp-opp__meta b{color:var(--text-body);font-weight:600;}
.rp-opp__meta .due{color:var(--warning-fg);}
.rp-opp__rec{font-size:var(--text-sm);color:var(--text-body);}
.rp-opp__rec b{color:var(--text-strong);}
.rp-opp__side{flex:none;display:flex;flex-direction:column;align-items:center;gap:10px;width:96px;}
`;
if (typeof document !== 'undefined' && !document.getElementById('rp-opp-css')) {
  const s = document.createElement('style');
  s.id = 'rp-opp-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
const STATUS = {
  forte: {
    tone: 'success',
    label: 'Forte aderência'
  },
  boa: {
    tone: 'brand',
    label: 'Boa oportunidade'
  },
  possivel: {
    tone: 'warning',
    label: 'Possível'
  },
  baixa: {
    tone: 'danger',
    label: 'Baixa aderência'
  }
};
function OpportunityCard({
  orgao,
  titulo,
  cidade,
  estado,
  modalidade,
  valor,
  prazo,
  score = 0,
  status,
  recomendacao,
  urgente = false,
  onClick,
  className = ''
}) {
  const band = __ds_scope.scoreBand(score);
  const st = STATUS[status] || STATUS[band.key === 'strong' ? 'forte' : band.key === 'good' ? 'boa' : band.key === 'mid' ? 'possivel' : 'baixa'];
  const loc = [cidade, estado].filter(Boolean).join('/');
  return /*#__PURE__*/React.createElement("div", {
    className: ['rp-opp', onClick && 'rp-opp--clickable', className].filter(Boolean).join(' '),
    onClick: onClick
  }, /*#__PURE__*/React.createElement("span", {
    className: "rp-opp__accent",
    style: {
      background: band.color
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "rp-opp__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rp-opp__head"
  }, /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: st.tone,
    dot: true
  }, st.label), urgente && /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "gold",
    solid: true
  }, "Urgente"), modalidade && /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "neutral"
  }, modalidade)), /*#__PURE__*/React.createElement("div", null, orgao && /*#__PURE__*/React.createElement("div", {
    className: "rp-opp__org"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "landmark",
    size: 14
  }), orgao, loc && ` · ${loc}`), /*#__PURE__*/React.createElement("div", {
    className: "rp-opp__title"
  }, titulo)), /*#__PURE__*/React.createElement("div", {
    className: "rp-opp__meta"
  }, valor && /*#__PURE__*/React.createElement("span", null, "Valor estimado ", /*#__PURE__*/React.createElement("b", null, valor)), prazo && /*#__PURE__*/React.createElement("span", {
    className: "due"
  }, "Prazo ", /*#__PURE__*/React.createElement("b", null, prazo))), recomendacao && /*#__PURE__*/React.createElement("div", {
    className: "rp-opp__rec"
  }, /*#__PURE__*/React.createElement("b", null, "Recomenda\xE7\xE3o:"), " ", recomendacao)), /*#__PURE__*/React.createElement("div", {
    className: "rp-opp__side"
  }, /*#__PURE__*/React.createElement(__ds_scope.ScoreGauge, {
    value: score,
    size: 78
  })));
}
Object.assign(__ds_scope, { OpportunityCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/OpportunityCard.jsx", error: String((e && e.message) || e) }); }

// components/data/StatCard.jsx
try { (() => {
const CSS = `
.rp-stat{display:flex;flex-direction:column;gap:10px;background:var(--surface);
  border:1px solid var(--border);border-radius:var(--radius-lg);padding:18px 20px;box-shadow:var(--shadow-sm);}
.rp-stat__top{display:flex;align-items:center;justify-content:space-between;gap:8px;}
.rp-stat__label{font-size:var(--text-sm);color:var(--text-muted);font-weight:var(--fw-medium);}
.rp-stat__icon{width:34px;height:34px;border-radius:var(--radius-md);display:flex;align-items:center;
  justify-content:center;background:var(--brand-soft);color:var(--brand-soft-fg);flex:none;}
.rp-stat__icon svg{width:18px;height:18px;}
.rp-stat__icon--gold{background:var(--accent-soft);color:var(--accent-soft-fg);}
.rp-stat__icon--danger{background:var(--danger-soft);color:var(--danger-fg);}
.rp-stat__icon--info{background:var(--info-soft);color:var(--info-soft-fg);}
.rp-stat__value{font-family:var(--font-mono);font-weight:600;font-size:var(--text-3xl);
  color:var(--text-strong);letter-spacing:-0.01em;line-height:1;font-variant-numeric:tabular-nums;}
.rp-stat__foot{display:flex;align-items:center;gap:6px;font-size:var(--text-xs);}
.rp-stat__delta{display:inline-flex;align-items:center;gap:3px;font-family:var(--font-mono);font-weight:600;}
.rp-stat__delta--up{color:var(--success);}
.rp-stat__delta--down{color:var(--danger);}
.rp-stat__delta svg{width:13px;height:13px;}
.rp-stat__sub{color:var(--text-subtle);}
`;
if (typeof document !== 'undefined' && !document.getElementById('rp-stat-css')) {
  const s = document.createElement('style');
  s.id = 'rp-stat-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function StatCard({
  label,
  value,
  icon,
  tone = 'brand',
  delta,
  deltaDir,
  sub,
  className = ''
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `rp-stat ${className}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "rp-stat__top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rp-stat__label"
  }, label), icon && /*#__PURE__*/React.createElement("span", {
    className: `rp-stat__icon rp-stat__icon--${tone}`
  }, icon)), /*#__PURE__*/React.createElement("span", {
    className: "rp-stat__value"
  }, value), (delta || sub) && /*#__PURE__*/React.createElement("div", {
    className: "rp-stat__foot"
  }, delta && /*#__PURE__*/React.createElement("span", {
    className: `rp-stat__delta rp-stat__delta--${deltaDir === 'down' ? 'down' : 'up'}`
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": deltaDir === 'down' ? 'trending-down' : 'trending-up'
  }), delta), sub && /*#__PURE__*/React.createElement("span", {
    className: "rp-stat__sub"
  }, sub)));
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StatCard.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
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
  const s = document.createElement('style');
  s.id = 'rp-dialog-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Dialog({
  open,
  onClose,
  title,
  subtitle,
  size = 'md',
  footer,
  className = '',
  children
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "rp-dialog__scrim",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: ['rp-dialog', size !== 'md' && `rp-dialog--${size}`, className].filter(Boolean).join(' '),
    role: "dialog",
    "aria-modal": "true",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "rp-dialog__head"
  }, /*#__PURE__*/React.createElement("div", null, title && /*#__PURE__*/React.createElement("div", {
    className: "rp-dialog__title"
  }, title), subtitle && /*#__PURE__*/React.createElement("div", {
    className: "rp-dialog__sub"
  }, subtitle)), /*#__PURE__*/React.createElement("button", {
    className: "rp-dialog__x",
    "aria-label": "Fechar",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "rp-dialog__body"
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    className: "rp-dialog__foot"
  }, footer)));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
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
  const s = document.createElement('style');
  s.id = 'rp-toast-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
const ICONS = {
  brand: 'radar',
  success: 'check-circle-2',
  warning: 'alert-triangle',
  danger: 'x-circle',
  gold: 'sparkles'
};
function Toast({
  tone = 'brand',
  title,
  message,
  icon,
  onClose,
  className = ''
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: ['rp-toast', tone !== 'brand' && `rp-toast--${tone}`, className].filter(Boolean).join(' '),
    role: "status"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rp-toast__icon"
  }, icon || /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: ICONS[tone] || 'bell'
  })), /*#__PURE__*/React.createElement("div", {
    className: "rp-toast__body"
  }, title && /*#__PURE__*/React.createElement("span", {
    className: "rp-toast__title"
  }, title), message && /*#__PURE__*/React.createElement("span", {
    className: "rp-toast__msg"
  }, message)), onClose && /*#__PURE__*/React.createElement("button", {
    className: "rp-toast__x",
    "aria-label": "Fechar",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 15
  })));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
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
  const s = document.createElement('style');
  s.id = 'rp-tip-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Tooltip({
  content,
  placement = 'top',
  className = '',
  children
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: `rp-tip ${className}`,
    tabIndex: 0
  }, children, /*#__PURE__*/React.createElement("span", {
    className: ['rp-tip__pop', placement === 'bottom' && 'rp-tip__pop--bottom'].filter(Boolean).join(' '),
    role: "tooltip"
  }, content));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
  const s = document.createElement('style');
  s.id = 'rp-check-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Checkbox({
  label,
  description,
  type = 'checkbox',
  className = '',
  children,
  ...rest
}) {
  const isRadio = type === 'radio';
  return /*#__PURE__*/React.createElement("label", {
    className: ['rp-check', isRadio && 'rp-check--radio', className].filter(Boolean).join(' ')
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: type
  }, rest)), /*#__PURE__*/React.createElement("span", {
    className: "rp-check__box",
    "aria-hidden": "true"
  }, isRadio ? /*#__PURE__*/React.createElement("span", {
    className: "rp-check__dot"
  }) : /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 14
  })), /*#__PURE__*/React.createElement("span", {
    className: "rp-check__txt"
  }, /*#__PURE__*/React.createElement("span", null, label || children), description && /*#__PURE__*/React.createElement("span", {
    className: "rp-check__desc"
  }, description)));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
  const s = document.createElement('style');
  s.id = 'rp-input-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Input({
  label,
  hint,
  error,
  iconLeft,
  iconRight,
  size = 'md',
  id,
  className = '',
  ...rest
}) {
  const fid = id || (label ? `f-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  return /*#__PURE__*/React.createElement("div", {
    className: `rp-field ${className}`
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "rp-field__label",
    htmlFor: fid
  }, label), /*#__PURE__*/React.createElement("div", {
    className: ['rp-input', size === 'sm' && 'rp-input--sm', error && 'rp-input--err'].filter(Boolean).join(' ')
  }, iconLeft, /*#__PURE__*/React.createElement("input", _extends({
    id: fid,
    className: "rp-input__el"
  }, rest)), iconRight), error ? /*#__PURE__*/React.createElement("span", {
    className: "rp-field__err"
  }, error) : hint && /*#__PURE__*/React.createElement("span", {
    className: "rp-field__hint"
  }, hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
  const s = document.createElement('style');
  s.id = 'rp-select-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Select({
  label,
  options = [],
  size = 'md',
  id,
  className = '',
  children,
  ...rest
}) {
  const fid = id || (label ? `s-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  return /*#__PURE__*/React.createElement("div", {
    className: `rp-field ${className}`
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "rp-field__label",
    htmlFor: fid
  }, label), /*#__PURE__*/React.createElement("div", {
    className: ['rp-select', size === 'sm' && 'rp-select--sm'].filter(Boolean).join(' ')
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: fid
  }, rest), options.map(o => {
    const val = typeof o === 'string' ? o : o.value;
    const lbl = typeof o === 'string' ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: val,
      value: val
    }, lbl);
  }), children), /*#__PURE__*/React.createElement("span", {
    className: "rp-select__chev"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down"
  }))));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
  const s = document.createElement('style');
  s.id = 'rp-switch-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Switch({
  label,
  className = '',
  children,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    className: `rp-switch ${className}`
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox"
  }, rest)), /*#__PURE__*/React.createElement("span", {
    className: "rp-switch__track",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rp-switch__thumb"
  })), (label || children) && /*#__PURE__*/React.createElement("span", null, label || children));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
const CSS = `
.rp-tabs{display:flex;gap:2px;border-bottom:1px solid var(--border);}
.rp-tab{appearance:none;border:0;background:transparent;cursor:pointer;font-family:var(--font-sans);
  font-size:var(--text-base);font-weight:var(--fw-medium);color:var(--text-muted);
  padding:11px 16px;position:relative;display:inline-flex;align-items:center;gap:7px;
  transition:color var(--dur-fast) var(--ease-out);}
.rp-tab:hover{color:var(--text-strong);}
.rp-tab svg{width:16px;height:16px;}
.rp-tab__count{font-family:var(--font-mono);font-size:var(--text-xs);background:var(--bg-subtle);
  color:var(--text-muted);padding:1px 7px;border-radius:var(--radius-pill);font-weight:600;}
.rp-tab--active{color:var(--brand);font-weight:var(--fw-semibold);}
.rp-tab--active .rp-tab__count{background:var(--brand-soft);color:var(--brand-soft-fg);}
.rp-tab--active::after{content:'';position:absolute;left:8px;right:8px;bottom:-1px;height:2px;
  background:var(--brand);border-radius:2px 2px 0 0;}
.rp-tabs--pill{border:0;gap:6px;background:var(--bg-subtle);padding:4px;border-radius:var(--radius-md);display:inline-flex;}
.rp-tabs--pill .rp-tab{border-radius:var(--radius-sm);padding:7px 14px;}
.rp-tabs--pill .rp-tab--active{background:var(--surface);box-shadow:var(--shadow-xs);color:var(--text-strong);}
.rp-tabs--pill .rp-tab--active::after{display:none;}
`;
if (typeof document !== 'undefined' && !document.getElementById('rp-tabs-css')) {
  const s = document.createElement('style');
  s.id = 'rp-tabs-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Tabs({
  items = [],
  value,
  defaultValue,
  onChange,
  variant = 'underline',
  className = ''
}) {
  const [internal, setInternal] = React.useState(defaultValue ?? items[0]?.value);
  const active = value !== undefined ? value : internal;
  const select = v => {
    if (value === undefined) setInternal(v);
    onChange && onChange(v);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: ['rp-tabs', variant === 'pill' && 'rp-tabs--pill', className].filter(Boolean).join(' '),
    role: "tablist"
  }, items.map(it => /*#__PURE__*/React.createElement("button", {
    key: it.value,
    role: "tab",
    "aria-selected": active === it.value,
    className: ['rp-tab', active === it.value && 'rp-tab--active'].filter(Boolean).join(' '),
    onClick: () => select(it.value)
  }, it.icon, it.label, it.count != null && /*#__PURE__*/React.createElement("span", {
    className: "rp-tab__count"
  }, it.count))));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/radar/App.jsx
try { (() => {
/* Radar PNCP UI kit — App shell + routing + theme. */
const {
  useState: useS,
  useEffect: useE
} = React;
function MiniDialog({
  open,
  onClose,
  op
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      background: 'var(--overlay-scrim)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      zIndex: 1000
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-xl)',
      width: '100%',
      maxWidth: 460,
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      fontWeight: 800,
      color: 'var(--text-strong)',
      letterSpacing: '-0.01em'
    }
  }, "Proposta gerada"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: 'var(--text-muted)',
      marginTop: 4
    }
  }, "Composi\xE7\xE3o autom\xE1tica pela IA")), /*#__PURE__*/React.createElement("button", {
    className: "icon-btn-ghost",
    onClick: onClose,
    "aria-label": "Fechar"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '18px 0',
      padding: 16,
      background: 'var(--brand-soft)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid color-mix(in oklab, var(--brand) 30%, transparent)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: '.08em',
      color: 'var(--brand-soft-fg)',
      fontWeight: 700
    }
  }, "Valor recomendado"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 30,
      fontWeight: 600,
      color: 'var(--text-strong)',
      marginTop: 4
    }
  }, op ? op.propostaIdeal : ''), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, "M\xEDnimo saud\xE1vel ", op && op.propostaMin, " \xB7 margem ", op && op.margem)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    variant: "ghost",
    onClick: onClose
  }, "Fechar"), /*#__PURE__*/React.createElement(Btn, {
    variant: "primary",
    onClick: onClose,
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "download",
      style: {
        width: 16,
        height: 16
      }
    })
  }, "Baixar PDF"))));
}
function Toast({
  show,
  onClose
}) {
  useE(() => {
    if (show) {
      const t = setTimeout(onClose, 6000);
      return () => clearTimeout(t);
    }
  }, [show]);
  if (!show) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      right: 24,
      bottom: 24,
      zIndex: 1100,
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderLeft: '3px solid var(--accent)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-lg)',
      padding: '14px 16px',
      maxWidth: 360
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 32,
      height: 32,
      borderRadius: 'var(--radius-sm)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--accent-soft)',
      color: 'var(--accent-soft-fg)',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkles",
    style: {
      width: 18,
      height: 18
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--text-strong)'
    }
  }, "Nova oportunidade \xB7 score 91"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-muted)',
      lineHeight: 1.4
    }
  }, "Plataforma de atendimento digital \xB7 R$ 78.000 \xB7 prazo 12/06")), /*#__PURE__*/React.createElement("button", {
    className: "icon-btn-ghost",
    onClick: onClose,
    style: {
      padding: 2
    },
    "aria-label": "Fechar"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    style: {
      width: 15,
      height: 15
    }
  })));
}
function ConfigScreen({
  which
}) {
  const map = {
    palavras: {
      t: 'Palavras-chave monitoradas',
      d: 'O radar consulta o PNCP diariamente buscando estes termos.',
      icon: 'tags',
      body: ['inteligência artificial', 'chatbot', 'assistente virtual', 'atendimento digital', 'automação', 'software', 'desenvolvimento de sistema', 'integração de sistemas', 'API', 'dashboard', 'business intelligence', 'SaaS', 'transformação digital', 'workflow', 'portal do cidadão', 'central de atendimento']
    },
    alertas: {
      t: 'Alertas',
      d: 'Canais de notificação para novas oportunidades.',
      icon: 'bell'
    },
    empresa: {
      t: 'Perfil da empresa',
      d: 'Base de comparação estratégica do radar.',
      icon: 'building-2'
    }
  }[which];
  return /*#__PURE__*/React.createElement("div", {
    className: "page"
  }, /*#__PURE__*/React.createElement("div", {
    className: "page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "page-title"
  }, map.t), /*#__PURE__*/React.createElement("div", {
    className: "page-sub"
  }, map.d))), which === 'palavras' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8
    }
  }, map.body.map((k, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 14,
      fontWeight: 500,
      color: i < 6 ? 'var(--brand-soft-fg)' : 'var(--text-body)',
      background: i < 6 ? 'var(--brand-soft)' : 'var(--surface)',
      border: i < 6 ? '1px solid transparent' : '1px solid var(--border-strong)',
      borderRadius: 99,
      padding: '7px 13px'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "hash",
    style: {
      width: 13,
      height: 13,
      opacity: .6
    }
  }), k)), /*#__PURE__*/React.createElement("button", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--brand)',
      background: 'transparent',
      border: '1px dashed var(--border-strong)',
      borderRadius: 99,
      padding: '7px 13px',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    style: {
      width: 15,
      height: 15
    }
  }), "Adicionar termo")), which === 'alertas' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      maxWidth: 520
    }
  }, [['WhatsApp', 'message-circle', true], ['E-mail', 'mail', true], ['Telegram', 'send', false], ['Painel', 'layout-dashboard', true]].map(([n, ic, on], i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '14px 18px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36,
      height: 36,
      borderRadius: 'var(--radius-md)',
      background: 'var(--bg-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ic,
    style: {
      width: 18,
      height: 18
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontWeight: 600,
      color: 'var(--text-strong)'
    }
  }, n), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 40,
      height: 23,
      borderRadius: 99,
      background: on ? 'var(--brand)' : 'var(--ink-200)',
      padding: 2,
      display: 'flex',
      justifyContent: on ? 'flex-end' : 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 19,
      height: 19,
      borderRadius: '50%',
      background: '#fff',
      boxShadow: 'var(--shadow-sm)'
    }
  }))))), which === 'empresa' && /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 560,
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-xl)',
      padding: 24
    }
  }, /*#__PURE__*/React.createElement(KV, {
    k: "Raz\xE3o social",
    v: window.RADAR.empresa.nome
  }), /*#__PURE__*/React.createElement(KV, {
    k: "CNPJ",
    v: window.RADAR.empresa.cnpj
  }), /*#__PURE__*/React.createElement("div", {
    className: "kv",
    style: {
      borderBottom: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, "\xC1rea"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: 'var(--text-body)',
      textAlign: 'right',
      maxWidth: 320
    }
  }, window.RADAR.empresa.area))));
}
function App() {
  const [theme, setTheme] = useS('dark');
  const [route, setRoute] = useS('radar');
  const [filter, setFilter] = useS('todos');
  const [op, setOp] = useS(null);
  const [dialog, setDialog] = useS(false);
  const [toast, setToast] = useS(false);
  useE(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  useE(() => {
    const t = setTimeout(() => setToast(true), 1400);
    return () => clearTimeout(t);
  }, []);
  const editais = window.RADAR.editais;
  const ativos = editais.filter(e => e.status !== 'baixa');
  const counts = {
    radar: ativos.length,
    urgentes: ativos.filter(e => e.urgente).length,
    descartados: editais.filter(e => e.status === 'baixa').length
  };
  const openOp = o => {
    setOp(o);
    window.scrollTo && window.scrollTo(0, 0);
  };
  let crumb;
  if (op) crumb = /*#__PURE__*/React.createElement("div", {
    className: "crumb"
  }, /*#__PURE__*/React.createElement("span", null, "Radar"), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    style: {
      width: 14,
      height: 14
    }
  }), /*#__PURE__*/React.createElement("b", null, "Oportunidade"));else crumb = /*#__PURE__*/React.createElement("div", {
    className: "crumb"
  }, /*#__PURE__*/React.createElement("b", null, route === 'radar' ? 'Radar de oportunidades' : route === 'urgentes' ? 'Urgentes' : route === 'descartados' ? 'Descartados' : route === 'palavras' ? 'Palavras-chave' : route === 'alertas' ? 'Alertas' : 'Perfil da empresa'));
  const onNav = id => {
    setOp(null);
    setRoute(id);
    if (id === 'radar') setFilter('todos');
    if (id === 'urgentes') setFilter('urgentes');
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "app"
  }, /*#__PURE__*/React.createElement(Sidebar, {
    active: op ? 'radar' : route,
    onNav: onNav,
    counts: counts
  }), /*#__PURE__*/React.createElement("div", {
    className: "main"
  }, /*#__PURE__*/React.createElement(Topbar, {
    crumb: crumb,
    theme: theme,
    onToggleTheme: () => setTheme(theme === 'dark' ? 'light' : 'dark')
  }), /*#__PURE__*/React.createElement("div", {
    className: "scroll",
    id: "scrollArea"
  }, op ? /*#__PURE__*/React.createElement(Detail, {
    op: op,
    onBack: () => setOp(null),
    onGenerate: () => setDialog(true)
  }) : route === 'descartados' ? /*#__PURE__*/React.createElement("div", {
    className: "page"
  }, /*#__PURE__*/React.createElement("div", {
    className: "page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "page-title"
  }, "Descartados"), /*#__PURE__*/React.createElement("div", {
    className: "page-sub"
  }, "Editais sem ader\xEAncia ao portf\xF3lio da AI Solution."))), /*#__PURE__*/React.createElement("div", {
    className: "opp-list"
  }, editais.filter(e => e.status === 'baixa').map(o => /*#__PURE__*/React.createElement(OppCard, {
    key: o.id,
    op: o,
    onOpen: openOp
  })))) : route === 'palavras' || route === 'alertas' || route === 'empresa' ? /*#__PURE__*/React.createElement(ConfigScreen, {
    which: route
  }) : /*#__PURE__*/React.createElement(Dashboard, {
    editais: editais,
    onOpen: openOp,
    filter: filter,
    setFilter: setFilter
  }))), /*#__PURE__*/React.createElement(MiniDialog, {
    open: dialog,
    onClose: () => setDialog(false),
    op: op
  }), /*#__PURE__*/React.createElement(Toast, {
    show: toast,
    onClose: () => setToast(false)
  }));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/radar/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/radar/Dashboard.jsx
try { (() => {
/* Radar PNCP UI kit — Dashboard / Radar screen. */
function StatTile({
  label,
  value,
  icon,
  tone = 'brand',
  delta,
  sub
}) {
  const iconBg = {
    brand: ['var(--brand-soft)', 'var(--brand-soft-fg)'],
    gold: ['var(--accent-soft)', 'var(--accent-soft-fg)'],
    danger: ['var(--danger-soft)', 'var(--danger-fg)'],
    info: ['var(--info-soft)', 'var(--info-soft-fg)']
  }[tone];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '18px 20px',
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--text-muted)',
      fontWeight: 500
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 34,
      height: 34,
      borderRadius: 'var(--radius-md)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: iconBg[0],
      color: iconBg[1]
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    style: {
      width: 18,
      height: 18
    }
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontWeight: 600,
      fontSize: 34,
      color: 'var(--text-strong)',
      lineHeight: 1,
      letterSpacing: '-0.01em'
    }
  }, value), (delta || sub) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 12
    }
  }, delta && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 3,
      fontFamily: 'var(--font-mono)',
      fontWeight: 600,
      color: 'var(--success)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "trending-up",
    style: {
      width: 13,
      height: 13
    }
  }), delta), sub && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-subtle)'
    }
  }, sub)));
}
const FILTERS = [{
  id: 'todos',
  label: 'Melhores'
}, {
  id: 'urgentes',
  label: 'Urgentes',
  icon: 'alarm-clock'
}, {
  id: 'ia',
  label: 'IA / chatbot'
}, {
  id: 'alto',
  label: 'Acima de R$ 50 mil'
}];
function Dashboard({
  editais,
  onOpen,
  filter,
  setFilter
}) {
  const ativos = editais.filter(e => e.status !== 'baixa');
  let list = ativos;
  if (filter === 'urgentes') list = ativos.filter(e => e.urgente);else if (filter === 'ia') list = ativos.filter(e => e.tags.some(t => /ia|chatbot|assistente|atendimento/i.test(t)));else if (filter === 'alto') list = ativos.filter(e => e.valorNum >= 50000);
  list = [...list].sort((a, b) => b.score - a.score);
  const counts = FILTERS.reduce((acc, f) => {
    if (f.id === 'todos') acc[f.id] = ativos.length;else if (f.id === 'urgentes') acc[f.id] = ativos.filter(e => e.urgente).length;else if (f.id === 'ia') acc[f.id] = ativos.filter(e => e.tags.some(t => /ia|chatbot|assistente|atendimento/i.test(t))).length;else acc[f.id] = ativos.filter(e => e.valorNum >= 50000).length;
    return acc;
  }, {});
  return /*#__PURE__*/React.createElement("div", {
    className: "page"
  }, /*#__PURE__*/React.createElement("div", {
    className: "page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "page-title"
  }, "Radar de oportunidades"), /*#__PURE__*/React.createElement("div", {
    className: "page-sub"
  }, ativos.length, " editais ativos cruzados com o perfil da AI Solution \xB7 atualizado hoje, 08:00")), /*#__PURE__*/React.createElement(Btn, {
    variant: "secondary",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "refresh-cw",
      style: {
        width: 16,
        height: 16
      }
    })
  }, "Atualizar PNCP")), /*#__PURE__*/React.createElement("div", {
    className: "stat-row"
  }, /*#__PURE__*/React.createElement(StatTile, {
    label: "Oportunidades ativas",
    value: ativos.length,
    icon: "radar",
    delta: "+12",
    sub: "esta semana"
  }), /*#__PURE__*/React.createElement(StatTile, {
    label: "Forte ader\xEAncia",
    value: ativos.filter(e => e.score >= 85).length,
    icon: "target",
    tone: "gold"
  }), /*#__PURE__*/React.createElement(StatTile, {
    label: "Editais urgentes",
    value: ativos.filter(e => e.urgente).length,
    icon: "alarm-clock",
    tone: "danger"
  }), /*#__PURE__*/React.createElement(StatTile, {
    label: "Valor em jogo",
    value: "R$ 374k",
    icon: "banknote",
    tone: "info"
  })), /*#__PURE__*/React.createElement("div", {
    className: "filter-bar"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 2,
      borderBottom: '1px solid var(--border)',
      flexWrap: 'wrap'
    }
  }, FILTERS.map(f => /*#__PURE__*/React.createElement("button", {
    key: f.id,
    onClick: () => setFilter(f.id),
    style: {
      appearance: 'none',
      border: 0,
      background: 'transparent',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      fontWeight: filter === f.id ? 600 : 500,
      color: filter === f.id ? 'var(--brand)' : 'var(--text-muted)',
      padding: '11px 16px',
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7
    }
  }, f.icon && /*#__PURE__*/React.createElement(Icon, {
    name: f.icon,
    style: {
      width: 16,
      height: 16
    }
  }), f.label, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      background: filter === f.id ? 'var(--brand-soft)' : 'var(--bg-subtle)',
      color: filter === f.id ? 'var(--brand-soft-fg)' : 'var(--text-muted)',
      padding: '1px 7px',
      borderRadius: 99,
      fontWeight: 600
    }
  }, counts[f.id]), filter === f.id && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 8,
      right: 8,
      bottom: -1,
      height: 2,
      background: 'var(--brand)',
      borderRadius: '2px 2px 0 0'
    }
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    variant: "ghost",
    size: "sm",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "sliders-horizontal",
      style: {
        width: 15,
        height: 15
      }
    })
  }, "Filtros"))), /*#__PURE__*/React.createElement("div", {
    className: "opp-list"
  }, list.map(op => /*#__PURE__*/React.createElement(OppCard, {
    key: op.id,
    op: op,
    onOpen: onOpen
  })), list.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "empty"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "radar",
    style: {
      width: 32,
      height: 32
    }
  }), /*#__PURE__*/React.createElement("span", null, "Nenhum edital neste filtro."))));
}
Object.assign(window, {
  Dashboard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/radar/Dashboard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/radar/Detail.jsx
try { (() => {
/* Radar PNCP UI kit — Opportunity detail + AI analysis. */
function KV({
  k,
  v,
  color
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "kv"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, k), /*#__PURE__*/React.createElement("span", {
    className: "v",
    style: color ? {
      color
    } : undefined
  }, v));
}
function Detail({
  op,
  onBack,
  onGenerate
}) {
  const [tab, setTab] = React.useState('resumo');
  const tabs = [{
    id: 'resumo',
    label: 'Resumo'
  }, {
    id: 'docs',
    label: 'Documentos'
  }, {
    id: 'custos',
    label: 'Custos & proposta'
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "page"
  }, /*#__PURE__*/React.createElement("button", {
    className: "icon-btn-ghost",
    onClick: onBack,
    style: {
      marginBottom: 14,
      marginLeft: -8
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-left"
  }), "Voltar ao radar"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      flexWrap: 'wrap',
      alignItems: 'center',
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement(Pill, {
    tone: scoreBand(op.score).tone,
    dot: true
  }, scoreBand(op.score).label === 'Muito forte' ? 'Forte aderência' : scoreBand(op.score).label + ' aderência'), op.urgente && /*#__PURE__*/React.createElement(Pill, {
    tone: "gold",
    solid: true
  }, "Urgente"), /*#__PURE__*/React.createElement(Pill, {
    tone: "neutral"
  }, op.modalidade)), /*#__PURE__*/React.createElement("div", {
    className: "page-title",
    style: {
      maxWidth: 760
    }
  }, op.titulo), /*#__PURE__*/React.createElement("div", {
    className: "page-sub",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "landmark",
    style: {
      width: 15,
      height: 15
    }
  }), op.orgao, " \xB7 ", op.cidade, "/", op.estado, " \xB7 publicado ", op.publicado), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 22
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "detail-grid"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      marginBottom: 22,
      background: 'var(--bg-subtle)',
      padding: 4,
      borderRadius: 'var(--radius-md)',
      width: 'fit-content'
    }
  }, tabs.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    onClick: () => setTab(t.id),
    style: {
      appearance: 'none',
      border: 0,
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      fontWeight: 600,
      padding: '7px 14px',
      borderRadius: 'var(--radius-sm)',
      background: tab === t.id ? 'var(--surface)' : 'transparent',
      color: tab === t.id ? 'var(--text-strong)' : 'var(--text-muted)',
      boxShadow: tab === t.id ? 'var(--shadow-xs)' : 'none'
    }
  }, t.label))), tab === 'resumo' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "section"
  }, /*#__PURE__*/React.createElement("h3", null, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkles"
  }), "Resumo da IA"), /*#__PURE__*/React.createElement("p", {
    className: "prose"
  }, op.resumo)), /*#__PURE__*/React.createElement("div", {
    className: "section two-col"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 15
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "circle-check",
    style: {
      color: 'var(--success)'
    }
  }), "Por que combina"), /*#__PURE__*/React.createElement("ul", {
    className: "reason pos"
  }, op.porQueCombina.length ? op.porQueCombina.map((r, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check"
  }), r)) : /*#__PURE__*/React.createElement("li", {
    style: {
      color: 'var(--text-subtle)'
    }
  }, "\u2014"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 15
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "circle-alert",
    style: {
      color: 'var(--danger)'
    }
  }), "Pontos de aten\xE7\xE3o"), /*#__PURE__*/React.createElement("ul", {
    className: "reason neg"
  }, op.porQueNao.map((r, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x"
  }), r)))))), tab === 'docs' && /*#__PURE__*/React.createElement("div", {
    className: "section"
  }, /*#__PURE__*/React.createElement("h3", null, /*#__PURE__*/React.createElement(Icon, {
    name: "file-check"
  }), "Documentos e certid\xF5es exigidos"), op.documentos.length ? /*#__PURE__*/React.createElement("div", {
    className: "doclist"
  }, op.documentos.map((d, i) => /*#__PURE__*/React.createElement("div", {
    className: "docrow",
    key: i
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "file-text"
  }), d))) : /*#__PURE__*/React.createElement("p", {
    className: "prose",
    style: {
      color: 'var(--text-subtle)'
    }
  }, "Edital sem ader\xEAncia \u2014 an\xE1lise documental n\xE3o aplic\xE1vel.")), tab === 'custos' && /*#__PURE__*/React.createElement("div", {
    className: "section"
  }, /*#__PURE__*/React.createElement("h3", null, /*#__PURE__*/React.createElement(Icon, {
    name: "calculator"
  }), "Composi\xE7\xE3o de custos"), /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      background: 'var(--surface)'
    }
  }, op.custos.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '12px 16px',
      borderBottom: '1px solid var(--border-subtle)',
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-body)'
    }
  }, c.item), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontWeight: 600,
      color: 'var(--text-strong)'
    }
  }, c.valor))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '12px 16px',
      fontSize: 14,
      fontWeight: 700,
      background: 'var(--bg-subtle)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-strong)'
    }
  }, "Custo operacional previsto"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      color: 'var(--text-strong)'
    }
  }, op.custoTotal))))), /*#__PURE__*/React.createElement("div", {
    className: "score-panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "big-gauge"
  }, /*#__PURE__*/React.createElement(Gauge, {
    value: op.score,
    size: 120,
    stroke: 11,
    showLabel: false
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      color: scoreBand(op.score).color
    }
  }, op.recomendacao.startsWith('Descartar') ? 'Descartar' : op.recomendacao.startsWith('Participar') ? 'Participar' : 'Analisar')), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(KV, {
    k: "Valor estimado",
    v: op.valor
  }), /*#__PURE__*/React.createElement(KV, {
    k: "Prazo final",
    v: op.prazo,
    color: "var(--warning-fg)"
  }), /*#__PURE__*/React.createElement(KV, {
    k: "Risco jur\xEDdico",
    v: op.risco
  }), /*#__PURE__*/React.createElement(KV, {
    k: "Concorr\xEAncia",
    v: op.concorrencia
  }), /*#__PURE__*/React.createElement(KV, {
    k: "Burocracia",
    v: op.burocracia
  }), /*#__PURE__*/React.createElement(KV, {
    k: "Chance de vit\xF3ria",
    v: op.chance,
    color: op.chance === 'Alta' ? 'var(--success)' : op.chance === 'Média' ? 'var(--warning-fg)' : 'var(--danger-fg)'
  })), op.propostaIdeal !== '—' && /*#__PURE__*/React.createElement("div", {
    className: "proposal"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lbl"
  }, "Proposta recomendada"), /*#__PURE__*/React.createElement("div", {
    className: "amount"
  }, op.propostaIdeal), /*#__PURE__*/React.createElement("div", {
    className: "range"
  }, "M\xEDnimo saud\xE1vel ", op.propostaMin, " \xB7 margem ", op.margem)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    variant: "primary",
    onClick: onGenerate,
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "file-signature",
      style: {
        width: 17,
        height: 17
      }
    }),
    style: {
      width: '100%'
    }
  }, "Gerar proposta"), /*#__PURE__*/React.createElement(Btn, {
    variant: "secondary",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "external-link",
      style: {
        width: 16,
        height: 16
      }
    }),
    style: {
      width: '100%'
    }
  }, "Ver no PNCP")))));
}
Object.assign(window, {
  Detail,
  KV
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/radar/Detail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/radar/chrome.jsx
try { (() => {
/* Radar PNCP UI kit — app chrome (sidebar + topbar). */
function Sidebar({
  active,
  onNav,
  counts
}) {
  const nav = [{
    id: 'radar',
    label: 'Radar',
    icon: 'radar',
    n: counts.radar
  }, {
    id: 'urgentes',
    label: 'Urgentes',
    icon: 'alarm-clock',
    n: counts.urgentes
  }, {
    id: 'descartados',
    label: 'Descartados',
    icon: 'archive',
    n: counts.descartados
  }];
  const config = [{
    id: 'palavras',
    label: 'Palavras-chave',
    icon: 'tags'
  }, {
    id: 'alertas',
    label: 'Alertas',
    icon: 'bell'
  }, {
    id: 'empresa',
    label: 'Perfil da empresa',
    icon: 'building-2'
  }];
  return /*#__PURE__*/React.createElement("aside", {
    className: "sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sb-brand"
  }, /*#__PURE__*/React.createElement(Mark, {
    size: 32
  }), /*#__PURE__*/React.createElement("div", {
    className: "sb-wm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "radar"
  }, "Radar"), /*#__PURE__*/React.createElement("span", {
    className: "pncp"
  }, "PNCP")), /*#__PURE__*/React.createElement("span", {
    className: "by"
  }, "AI Solution Exp"))), /*#__PURE__*/React.createElement("div", {
    className: "sb-sec"
  }, "Monitoramento"), nav.map(it => /*#__PURE__*/React.createElement("button", {
    key: it.id,
    className: `nav-item ${active === it.id ? 'nav-item--active' : ''}`,
    onClick: () => onNav(it.id)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: it.icon
  }), it.label, it.n != null && /*#__PURE__*/React.createElement("span", {
    className: "badge-n"
  }, it.n))), /*#__PURE__*/React.createElement("div", {
    className: "sb-sec"
  }, "Configura\xE7\xE3o"), config.map(it => /*#__PURE__*/React.createElement("button", {
    key: it.id,
    className: `nav-item ${active === it.id ? 'nav-item--active' : ''}`,
    onClick: () => onNav(it.id)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: it.icon
  }), it.label)), /*#__PURE__*/React.createElement("div", {
    className: "sb-foot"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 34,
      height: 34,
      borderRadius: '50%',
      background: 'var(--brand-soft)',
      color: 'var(--brand-soft-fg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 700,
      fontSize: 13,
      flex: 'none'
    }
  }, "AI"), /*#__PURE__*/React.createElement("div", {
    className: "info"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nm"
  }, "AI Solution Exp"), /*#__PURE__*/React.createElement("span", {
    className: "cnpj"
  }, "53.075.641/0001-71"))));
}
function Topbar({
  crumb,
  theme,
  onToggleTheme,
  onSearch
}) {
  return /*#__PURE__*/React.createElement("header", {
    className: "topbar"
  }, crumb, /*#__PURE__*/React.createElement("div", {
    className: "spacer"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: 280
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    style: {
      position: 'absolute',
      left: 11,
      top: '50%',
      transform: 'translateY(-50%)',
      width: 17,
      height: 17,
      color: 'var(--text-subtle)'
    }
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Buscar \xF3rg\xE3o, objeto, palavra-chave\u2026",
    onChange: onSearch,
    style: {
      width: '100%',
      height: 38,
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-strong)',
      background: 'var(--surface)',
      padding: '0 12px 0 34px',
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      color: 'var(--text-strong)',
      outline: 'none'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "icon-btn-ghost",
    onClick: onToggleTheme,
    title: "Alternar tema",
    "aria-label": "Alternar tema"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: theme === 'dark' ? 'sun' : 'moon'
  })), /*#__PURE__*/React.createElement("button", {
    className: "icon-btn-ghost",
    "aria-label": "Notifica\xE7\xF5es"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "bell"
  }))));
}
Object.assign(window, {
  Sidebar,
  Topbar
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/radar/chrome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/radar/data.js
try { (() => {
// Fake edital data for the Radar PNCP UI kit (recreation only).
window.RADAR = window.RADAR || {};
window.RADAR.empresa = {
  nome: 'AI Solution Exp LTDA - ME',
  cnpj: '53.075.641/0001-71',
  area: 'Automações, agentes de IA, integrações e atendimento automatizado'
};
window.RADAR.editais = [{
  id: 'op-418',
  orgao: 'Prefeitura Municipal de Sobral',
  cidade: 'Sobral',
  estado: 'CE',
  titulo: 'Contratação de plataforma de atendimento digital com chatbot e IA para a central do cidadão',
  objetoCurto: 'Plataforma de atendimento digital · chatbot · IA',
  modalidade: 'Dispensa eletrônica',
  publicado: '02/06/2026',
  prazo: '14/06/2026',
  valor: 'R$ 62.000',
  valorNum: 62000,
  score: 87,
  status: 'forte',
  urgente: true,
  recomendacao: 'Participar — objeto fortemente compatível com automação, IA e atendimento digital.',
  tags: ['chatbot', 'IA', 'atendimento digital', 'API'],
  resumo: 'O município quer implantar um canal único de atendimento ao cidadão com chatbot integrado ao portal e ao WhatsApp, com painel de acompanhamento de demandas. Escopo cobre implantação, treinamento e 12 meses de manutenção.',
  porQueCombina: ['Objeto central é atendimento automatizado via chatbot', 'Integração com WhatsApp e APIs — domínio direto da AI Solution', 'CNAE de licenciamento de software compatível', 'Dispensa eletrônica: ciclo curto e menos burocracia'],
  porQueNao: ['Exige atestado de capacidade técnica de projeto similar', 'Prazo de implantação de 30 dias é apertado'],
  documentos: ['Certidão negativa federal', 'Certidão FGTS', 'Atestado de capacidade técnica', 'Contrato social', 'Proposta comercial assinada'],
  custos: [{
    item: 'Horas técnicas (implantação)',
    valor: 'R$ 11.000'
  }, {
    item: 'Setup de integrações / APIs',
    valor: 'R$ 4.500'
  }, {
    item: 'Infraestrutura + LLM (12 meses)',
    valor: 'R$ 3.600'
  }, {
    item: 'Suporte e manutenção',
    valor: 'R$ 2.900'
  }],
  custoTotal: 'R$ 22.000',
  margem: '35%',
  propostaMin: 'R$ 41.000',
  propostaIdeal: 'R$ 48.000 – 54.000',
  risco: 'Baixo',
  concorrencia: 'Média',
  burocracia: 'Baixa',
  chance: 'Alta'
}, {
  id: 'op-377',
  orgao: 'Secretaria de Saúde do Estado do Piauí',
  cidade: 'Teresina',
  estado: 'PI',
  titulo: 'Aquisição de assistente virtual para triagem e agendamento em unidades de saúde',
  objetoCurto: 'Assistente virtual · triagem · agendamento',
  modalidade: 'Pregão eletrônico',
  publicado: '30/05/2026',
  prazo: '21/06/2026',
  valor: 'R$ 178.000',
  valorNum: 178000,
  score: 79,
  status: 'boa',
  urgente: false,
  recomendacao: 'Participar com parceiro — escopo técnico forte, mas exige atestado de grande porte.',
  tags: ['assistente virtual', 'IA', 'integração de sistemas'],
  resumo: 'Implantação de assistente virtual para triagem inicial e agendamento integrado ao prontuário, com relatórios gerenciais. Contrato de 24 meses.',
  porQueCombina: ['Núcleo de IA conversacional e integração', 'Valor relevante e contrato longo'],
  porQueNao: ['Pregão exige atestado de porte e equipe dedicada', 'Concorrência de fornecedores maiores'],
  documentos: ['Atestado de capacidade técnica', 'Balanço patrimonial', 'Certidões fiscais', 'Garantia de proposta'],
  custos: [{
    item: 'Equipe dedicada (6 meses)',
    valor: 'R$ 64.000'
  }, {
    item: 'Integração prontuário',
    valor: 'R$ 18.000'
  }, {
    item: 'Infra + IA (24 meses)',
    valor: 'R$ 14.000'
  }],
  custoTotal: 'R$ 96.000',
  margem: '30%',
  propostaMin: 'R$ 132.000',
  propostaIdeal: 'R$ 150.000 – 165.000',
  risco: 'Médio',
  concorrencia: 'Alta',
  burocracia: 'Média',
  chance: 'Média'
}, {
  id: 'op-355',
  orgao: 'Câmara Municipal de Juazeiro do Norte',
  cidade: 'Juazeiro do Norte',
  estado: 'CE',
  titulo: 'Desenvolvimento de dashboard de transparência e BI para gestão de contratos',
  objetoCurto: 'Dashboard de transparência · BI',
  modalidade: 'Dispensa eletrônica',
  publicado: '01/06/2026',
  prazo: '11/06/2026',
  valor: 'R$ 38.500',
  valorNum: 38500,
  score: 72,
  status: 'boa',
  urgente: true,
  recomendacao: 'Avaliar — bom encaixe técnico, valor um pouco baixo para o escopo.',
  tags: ['dashboard', 'BI', 'transformação digital'],
  resumo: 'Painel público de transparência com indicadores de contratos e BI interno para a controladoria. Implantação + 6 meses de suporte.',
  porQueCombina: ['Dashboards e BI são entregáveis recorrentes da AI Solution', 'Dispensa eletrônica de ciclo curto'],
  porQueNao: ['Valor estimado próximo do custo operacional', 'Dados podem exigir limpeza pesada'],
  documentos: ['Certidões fiscais', 'Contrato social', 'Proposta técnica'],
  custos: [{
    item: 'Desenvolvimento do painel',
    valor: 'R$ 16.000'
  }, {
    item: 'Modelagem de dados / BI',
    valor: 'R$ 6.000'
  }, {
    item: 'Suporte (6 meses)',
    valor: 'R$ 2.400'
  }],
  custoTotal: 'R$ 24.400',
  margem: '28%',
  propostaMin: 'R$ 31.000',
  propostaIdeal: 'R$ 34.000 – 37.000',
  risco: 'Médio',
  concorrencia: 'Baixa',
  burocracia: 'Baixa',
  chance: 'Alta'
}, {
  id: 'op-341',
  orgao: 'Instituto Federal do Maranhão',
  cidade: 'São Luís',
  estado: 'MA',
  titulo: 'Licenciamento de SaaS para automação de processos administrativos (workflow)',
  objetoCurto: 'SaaS · automação de workflow',
  modalidade: 'Pregão eletrônico',
  publicado: '28/05/2026',
  prazo: '25/06/2026',
  valor: 'R$ 96.000',
  valorNum: 96000,
  score: 64,
  status: 'possivel',
  urgente: false,
  recomendacao: 'Analisar com cautela — exige certificações que ainda não temos.',
  tags: ['SaaS', 'automação', 'workflow'],
  resumo: 'Plataforma SaaS para digitalizar fluxos administrativos com trilha de auditoria. Requer hospedagem em nuvem nacional e certificação de segurança.',
  porQueCombina: ['Automação de workflow é core', 'Modelo SaaS recorrente'],
  porQueNao: ['Exige certificação de segurança não disponível', 'Hospedagem nacional específica'],
  documentos: ['Certificação de segurança', 'Atestado técnico', 'Certidões fiscais', 'Garantia'],
  custos: [{
    item: 'Adaptação da plataforma',
    valor: 'R$ 28.000'
  }, {
    item: 'Certificação / compliance',
    valor: 'R$ 22.000'
  }, {
    item: 'Infra nacional (12m)',
    valor: 'R$ 12.000'
  }],
  custoTotal: 'R$ 62.000',
  margem: '22%',
  propostaMin: 'R$ 80.000',
  propostaIdeal: 'R$ 86.000 – 92.000',
  risco: 'Alto',
  concorrencia: 'Média',
  burocracia: 'Alta',
  chance: 'Baixa'
}, {
  id: 'op-329',
  orgao: 'Prefeitura de Caucaia',
  cidade: 'Caucaia',
  estado: 'CE',
  titulo: 'Serviço de manutenção predial e limpeza de áreas comuns',
  objetoCurto: 'Manutenção predial · limpeza',
  modalidade: 'Pregão eletrônico',
  publicado: '29/05/2026',
  prazo: '19/06/2026',
  valor: 'R$ 240.000',
  valorNum: 240000,
  score: 12,
  status: 'baixa',
  urgente: false,
  recomendacao: 'Descartar — objeto sem relação com o portfólio da AI Solution.',
  tags: ['facilities'],
  resumo: 'Contrato de facilities. Fora do escopo de tecnologia.',
  porQueCombina: [],
  porQueNao: ['Objeto não tecnológico', 'Sem aderência ao CNAE de software'],
  documentos: [],
  custos: [],
  custoTotal: '—',
  margem: '—',
  propostaMin: '—',
  propostaIdeal: '—',
  risco: 'Alto',
  concorrencia: 'Alta',
  burocracia: 'Alta',
  chance: 'Baixa'
}];
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/radar/data.js", error: String((e && e.message) || e) }); }

// ui_kits/radar/parts.jsx
try { (() => {
/* Radar PNCP UI kit — shared parts (self-contained, token-driven). */
const {
  useState
} = React;
function lucidePascal(n) {
  return String(n).replace(/(^|-)([a-z0-9])/g, (_, a, c) => c.toUpperCase());
}
function Icon({
  name,
  size = 18,
  strokeWidth = 2,
  style
}) {
  const html = React.useMemo(() => {
    const L = window.lucide;
    const node = L && L.icons ? L.icons[lucidePascal(name)] || L.icons[name] : null;
    if (!node) return '';
    const kids = node.map(e => `<${e[0]} ${Object.keys(e[1] || {}).map(k => `${k}="${e[1][k]}"`).join(' ')} />`).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${kids}</svg>`;
  }, [name, strokeWidth]);
  return /*#__PURE__*/React.createElement("span", {
    className: "kic",
    "aria-hidden": "true",
    style: {
      display: 'inline-flex',
      width: size,
      height: size,
      flex: 'none',
      lineHeight: 0,
      ...style
    },
    dangerouslySetInnerHTML: {
      __html: html
    }
  });
}
function Mark({
  size = 30
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 48 48",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "24",
    cy: "24",
    r: "21",
    stroke: "var(--brand)",
    strokeWidth: "2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "24",
    cy: "24",
    r: "13.5",
    stroke: "var(--brand)",
    strokeOpacity: "0.35",
    strokeWidth: "1.5"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "24",
    cy: "24",
    r: "6",
    stroke: "var(--brand)",
    strokeOpacity: "0.35",
    strokeWidth: "1.5"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "24",
    y1: "24",
    x2: "24",
    y2: "3",
    stroke: "var(--brand)",
    strokeWidth: "2",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "35",
    cy: "14",
    r: "3.4",
    fill: "var(--accent)"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "35",
    cy: "14",
    r: "6.5",
    fill: "var(--accent)",
    fillOpacity: "0.22"
  }));
}
function band(v) {
  if (v >= 85) return {
    color: 'var(--score-strong)',
    label: 'Muito forte',
    tone: 'success'
  };
  if (v >= 70) return {
    color: 'var(--score-good)',
    label: 'Boa',
    tone: 'brand'
  };
  if (v >= 40) return {
    color: 'var(--score-mid)',
    label: 'Possível',
    tone: 'warning'
  };
  return {
    color: 'var(--score-low)',
    label: 'Baixa',
    tone: 'danger'
  };
}
function Gauge({
  value = 0,
  size = 78,
  stroke = 8,
  showLabel = true,
  caption
}) {
  const v = Math.max(0, Math.min(100, value));
  const b = band(v);
  const r = (size - stroke) / 2,
    c = 2 * Math.PI * r,
    off = c * (1 - v / 100);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: `0 0 ${size} ${size}`,
    style: {
      transform: 'rotate(-90deg)'
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    fill: "none",
    strokeWidth: stroke,
    stroke: "var(--score-track)"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    fill: "none",
    strokeWidth: stroke,
    stroke: b.color,
    strokeLinecap: "round",
    strokeDasharray: c,
    strokeDashoffset: off,
    style: {
      transition: 'stroke-dashoffset .8s var(--ease-out)'
    }
  }), /*#__PURE__*/React.createElement("text", {
    x: "50%",
    y: "50%",
    dominantBaseline: "central",
    textAnchor: "middle",
    fontFamily: "var(--font-mono)",
    fontWeight: "600",
    fontSize: Math.round(size * 0.3),
    fill: "var(--text-strong)",
    transform: `rotate(90 ${size / 2} ${size / 2})`
  }, v)), showLabel && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '.08em',
      textTransform: 'uppercase',
      color: b.color
    }
  }, caption || b.label));
}
const TONE_BG = {
  success: ['var(--success-soft)', 'var(--success-fg)'],
  brand: ['var(--brand-soft)', 'var(--brand-soft-fg)'],
  warning: ['var(--warning-soft)', 'var(--warning-fg)'],
  danger: ['var(--danger-soft)', 'var(--danger-fg)'],
  gold: ['var(--accent-soft)', 'var(--accent-soft-fg)'],
  neutral: ['var(--bg-subtle)', 'var(--text-muted)'],
  info: ['var(--info-soft)', 'var(--info-soft-fg)']
};
function Pill({
  tone = 'neutral',
  dot,
  solid,
  children
}) {
  const [bg, fg] = TONE_BG[tone] || TONE_BG.neutral;
  const style = solid ? {
    background: tone === 'gold' ? 'var(--accent)' : `var(--${tone})`,
    color: tone === 'gold' ? '#1a1200' : '#fff'
  } : {
    background: bg,
    color: fg
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 12,
      fontWeight: 600,
      lineHeight: 1,
      padding: '4px 9px',
      borderRadius: 'var(--radius-pill)',
      whiteSpace: 'nowrap',
      ...style
    }
  }, dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: 'currentColor'
    }
  }), children);
}
function Btn({
  variant = 'primary',
  size = 'md',
  iconLeft,
  onClick,
  children,
  style
}) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: size === 'sm' ? 32 : size === 'lg' ? 48 : 40,
    padding: size === 'sm' ? '0 12px' : '0 18px',
    fontFamily: 'var(--font-sans)',
    fontSize: size === 'sm' ? 13 : 15,
    fontWeight: 600,
    borderRadius: 'var(--radius-md)',
    border: '1px solid transparent',
    cursor: 'pointer',
    letterSpacing: '-0.01em',
    whiteSpace: 'nowrap',
    transition: 'all var(--dur-fast) var(--ease-out)'
  };
  const v = {
    primary: {
      background: 'var(--brand)',
      color: 'var(--brand-contrast)'
    },
    secondary: {
      background: 'var(--surface)',
      color: 'var(--text-strong)',
      borderColor: 'var(--border-strong)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-body)'
    }
  }[variant];
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      ...base,
      ...v,
      ...style
    },
    onMouseDown: e => e.currentTarget.style.transform = 'scale(0.98)',
    onMouseUp: e => e.currentTarget.style.transform = '',
    onMouseLeave: e => e.currentTarget.style.transform = ''
  }, iconLeft, children);
}
const STATUS_LABEL = {
  forte: ['success', 'Forte aderência'],
  boa: ['brand', 'Boa oportunidade'],
  possivel: ['warning', 'Possível'],
  baixa: ['danger', 'Baixa aderência']
};
function OppCard({
  op,
  onOpen
}) {
  const b = band(op.score);
  const [st, label] = STATUS_LABEL[op.status] || STATUS_LABEL.baixa;
  return /*#__PURE__*/React.createElement("div", {
    onClick: () => onOpen(op),
    style: {
      display: 'flex',
      gap: 18,
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '18px 20px',
      boxShadow: 'var(--shadow-sm)',
      cursor: 'pointer',
      transition: 'all var(--dur-base) var(--ease-out)'
    },
    onMouseEnter: e => {
      e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.borderColor = 'var(--border-strong)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      e.currentTarget.style.transform = '';
      e.currentTarget.style.borderColor = 'var(--border)';
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 3,
      borderRadius: 99,
      background: b.color,
      flex: 'none',
      margin: '2px 0'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Pill, {
    tone: st,
    dot: true
  }, label), op.urgente && /*#__PURE__*/React.createElement(Pill, {
    tone: "gold",
    solid: true
  }, "Urgente"), /*#__PURE__*/React.createElement(Pill, {
    tone: "neutral"
  }, op.modalidade)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-muted)',
      fontWeight: 500,
      display: 'flex',
      alignItems: 'center',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "landmark",
    style: {
      width: 14,
      height: 14
    }
  }), op.orgao, " \xB7 ", op.cidade, "/", op.estado), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 700,
      color: 'var(--text-strong)',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
      marginTop: 3
    }
  }, op.titulo)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '6px 18px',
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Valor estimado ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--text-body)'
    }
  }, op.valor)), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--warning-fg)'
    }
  }, "Prazo ", /*#__PURE__*/React.createElement("b", null, op.prazo))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: 'var(--text-body)'
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--text-strong)'
    }
  }, "Recomenda\xE7\xE3o:"), " ", op.recomendacao)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 'none',
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Gauge, {
    value: op.score,
    size: 78
  })));
}
Object.assign(window, {
  Icon,
  Mark,
  Gauge,
  Pill,
  Btn,
  OppCard,
  scoreBand: band
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/radar/parts.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.DataTable = __ds_scope.DataTable;

__ds_ns.OpportunityCard = __ds_scope.OpportunityCard;

__ds_ns.ScoreGauge = __ds_scope.ScoreGauge;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
