import React from 'react';

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
  const s = document.createElement('style'); s.id = 'rp-stat-css'; s.textContent = CSS;
  document.head.appendChild(s);
}

export function StatCard({ label, value, icon, tone = 'brand', delta, deltaDir, sub, className = '' }) {
  return (
    <div className={`rp-stat ${className}`}>
      <div className="rp-stat__top">
        <span className="rp-stat__label">{label}</span>
        {icon && <span className={`rp-stat__icon rp-stat__icon--${tone}`}>{icon}</span>}
      </div>
      <span className="rp-stat__value">{value}</span>
      {(delta || sub) && (
        <div className="rp-stat__foot">
          {delta && (
            <span className={`rp-stat__delta rp-stat__delta--${deltaDir === 'down' ? 'down' : 'up'}`}>
              <i data-lucide={deltaDir === 'down' ? 'trending-down' : 'trending-up'}></i>{delta}
            </span>
          )}
          {sub && <span className="rp-stat__sub">{sub}</span>}
        </div>
      )}
    </div>
  );
}
