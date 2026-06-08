import React from 'react';

const CSS = `
.rp-gauge{display:inline-flex;flex-direction:column;align-items:center;gap:4px;font-family:var(--font-mono);}
.rp-gauge__svg{display:block;transform:rotate(-90deg);}
.rp-gauge__track{stroke:var(--score-track);}
.rp-gauge__val{font-family:var(--font-mono);font-weight:600;fill:var(--text-strong);}
.rp-gauge__cap{font-family:var(--font-sans);font-size:var(--text-2xs);letter-spacing:var(--tracking-caps);
  text-transform:uppercase;color:var(--text-muted);font-weight:600;}
`;
if (typeof document !== 'undefined' && !document.getElementById('rp-gauge-css')) {
  const s = document.createElement('style'); s.id = 'rp-gauge-css'; s.textContent = CSS;
  document.head.appendChild(s);
}

export function scoreBand(v) {
  if (v >= 85) return { key: 'strong', color: 'var(--score-strong)', label: 'Muito forte' };
  if (v >= 70) return { key: 'good', color: 'var(--score-good)', label: 'Boa' };
  if (v >= 40) return { key: 'mid', color: 'var(--score-mid)', label: 'Possível' };
  return { key: 'low', color: 'var(--score-low)', label: 'Baixa' };
}

export function ScoreGauge({ value = 0, size = 84, stroke = 8, showLabel = true, caption }) {
  const v = Math.max(0, Math.min(100, value));
  const band = scoreBand(v);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - v / 100);
  const fs = Math.round(size * 0.3);
  return (
    <div className="rp-gauge">
      <svg className="rp-gauge__svg" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle className="rp-gauge__track" cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke}
          stroke={band.color} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off}
          style={{ transition: 'stroke-dashoffset .8s var(--ease-out)' }} />
        <text className="rp-gauge__val" x="50%" y="50%" dominantBaseline="central" textAnchor="middle"
          fontSize={fs} transform={`rotate(90 ${size / 2} ${size / 2})`}>{v}</text>
      </svg>
      {showLabel && <span className="rp-gauge__cap" style={{ color: band.color }}>{caption || band.label}</span>}
    </div>
  );
}
