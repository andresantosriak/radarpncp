import React from 'react';
import { ScoreGauge, scoreBand } from './ScoreGauge.jsx';
import { Badge } from '../core/Badge.jsx';
import { Icon } from '../core/Icon.jsx';

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
  const s = document.createElement('style'); s.id = 'rp-opp-css'; s.textContent = CSS;
  document.head.appendChild(s);
}

const STATUS = {
  forte:    { tone: 'success', label: 'Forte aderência' },
  boa:      { tone: 'brand',   label: 'Boa oportunidade' },
  possivel: { tone: 'warning', label: 'Possível' },
  baixa:    { tone: 'danger',  label: 'Baixa aderência' },
};

export function OpportunityCard({
  orgao, titulo, cidade, estado, modalidade, valor, prazo,
  score = 0, status, recomendacao, urgente = false, onClick, className = '',
}) {
  const band = scoreBand(score);
  const st = STATUS[status] || STATUS[band.key === 'strong' ? 'forte' : band.key === 'good' ? 'boa' : band.key === 'mid' ? 'possivel' : 'baixa'];
  const loc = [cidade, estado].filter(Boolean).join('/');
  return (
    <div className={['rp-opp', onClick && 'rp-opp--clickable', className].filter(Boolean).join(' ')} onClick={onClick}>
      <span className="rp-opp__accent" style={{ background: band.color }} />
      <div className="rp-opp__body">
        <div className="rp-opp__head">
          <Badge tone={st.tone} dot>{st.label}</Badge>
          {urgente && <Badge tone="gold" solid>Urgente</Badge>}
          {modalidade && <Badge tone="neutral">{modalidade}</Badge>}
        </div>
        <div>
          {orgao && <div className="rp-opp__org"><Icon name="landmark" size={14} />{orgao}{loc && ` · ${loc}`}</div>}
          <div className="rp-opp__title">{titulo}</div>
        </div>
        <div className="rp-opp__meta">
          {valor && <span>Valor estimado <b>{valor}</b></span>}
          {prazo && <span className="due">Prazo <b>{prazo}</b></span>}
        </div>
        {recomendacao && <div className="rp-opp__rec"><b>Recomendação:</b> {recomendacao}</div>}
      </div>
      <div className="rp-opp__side">
        <ScoreGauge value={score} size={78} />
      </div>
    </div>
  );
}
