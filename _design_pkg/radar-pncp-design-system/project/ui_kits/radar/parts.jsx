/* Radar PNCP UI kit — shared parts (self-contained, token-driven). */
const { useState } = React;

function lucidePascal(n) { return String(n).replace(/(^|-)([a-z0-9])/g, (_, a, c) => c.toUpperCase()); }
function Icon({ name, size = 18, strokeWidth = 2, style }) {
  const html = React.useMemo(() => {
    const L = window.lucide;
    const node = L && L.icons ? (L.icons[lucidePascal(name)] || L.icons[name]) : null;
    if (!node) return '';
    const kids = node.map((e) => `<${e[0]} ${Object.keys(e[1] || {}).map((k) => `${k}="${e[1][k]}"`).join(' ')} />`).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${kids}</svg>`;
  }, [name, strokeWidth]);
  return <span className="kic" aria-hidden="true" style={{ display: 'inline-flex', width: size, height: size, flex: 'none', lineHeight: 0, ...style }} dangerouslySetInnerHTML={{ __html: html }} />;
}

function Mark({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="21" stroke="var(--brand)" strokeWidth="2"/>
      <circle cx="24" cy="24" r="13.5" stroke="var(--brand)" strokeOpacity="0.35" strokeWidth="1.5"/>
      <circle cx="24" cy="24" r="6" stroke="var(--brand)" strokeOpacity="0.35" strokeWidth="1.5"/>
      <line x1="24" y1="24" x2="24" y2="3" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="35" cy="14" r="3.4" fill="var(--accent)"/>
      <circle cx="35" cy="14" r="6.5" fill="var(--accent)" fillOpacity="0.22"/>
    </svg>
  );
}

function band(v) {
  if (v >= 85) return { color: 'var(--score-strong)', label: 'Muito forte', tone: 'success' };
  if (v >= 70) return { color: 'var(--score-good)', label: 'Boa', tone: 'brand' };
  if (v >= 40) return { color: 'var(--score-mid)', label: 'Possível', tone: 'warning' };
  return { color: 'var(--score-low)', label: 'Baixa', tone: 'danger' };
}

function Gauge({ value = 0, size = 78, stroke = 8, showLabel = true, caption }) {
  const v = Math.max(0, Math.min(100, value));
  const b = band(v);
  const r = (size - stroke) / 2, c = 2 * Math.PI * r, off = c * (1 - v / 100);
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" strokeWidth={stroke} stroke="var(--score-track)"/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" strokeWidth={stroke} stroke={b.color}
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off}
          style={{ transition: 'stroke-dashoffset .8s var(--ease-out)' }}/>
        <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle"
          fontFamily="var(--font-mono)" fontWeight="600" fontSize={Math.round(size*0.3)}
          fill="var(--text-strong)" transform={`rotate(90 ${size/2} ${size/2})`}>{v}</text>
      </svg>
      {showLabel && <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: b.color }}>{caption || b.label}</span>}
    </div>
  );
}

const TONE_BG = { success: ['var(--success-soft)','var(--success-fg)'], brand: ['var(--brand-soft)','var(--brand-soft-fg)'], warning: ['var(--warning-soft)','var(--warning-fg)'], danger: ['var(--danger-soft)','var(--danger-fg)'], gold: ['var(--accent-soft)','var(--accent-soft-fg)'], neutral: ['var(--bg-subtle)','var(--text-muted)'], info: ['var(--info-soft)','var(--info-soft-fg)'] };
function Pill({ tone = 'neutral', dot, solid, children }) {
  const [bg, fg] = TONE_BG[tone] || TONE_BG.neutral;
  const style = solid
    ? { background: tone === 'gold' ? 'var(--accent)' : `var(--${tone})`, color: tone === 'gold' ? '#1a1200' : '#fff' }
    : { background: bg, color: fg };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, lineHeight: 1, padding: '4px 9px', borderRadius: 'var(--radius-pill)', whiteSpace: 'nowrap', ...style }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />}
      {children}
    </span>
  );
}

function Btn({ variant = 'primary', size = 'md', iconLeft, onClick, children, style }) {
  const base = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: size === 'sm' ? 32 : size === 'lg' ? 48 : 40, padding: size === 'sm' ? '0 12px' : '0 18px', fontFamily: 'var(--font-sans)', fontSize: size === 'sm' ? 13 : 15, fontWeight: 600, borderRadius: 'var(--radius-md)', border: '1px solid transparent', cursor: 'pointer', letterSpacing: '-0.01em', whiteSpace: 'nowrap', transition: 'all var(--dur-fast) var(--ease-out)' };
  const v = {
    primary: { background: 'var(--brand)', color: 'var(--brand-contrast)' },
    secondary: { background: 'var(--surface)', color: 'var(--text-strong)', borderColor: 'var(--border-strong)' },
    ghost: { background: 'transparent', color: 'var(--text-body)' },
  }[variant];
  return <button onClick={onClick} style={{ ...base, ...v, ...style }} onMouseDown={e=>e.currentTarget.style.transform='scale(0.98)'} onMouseUp={e=>e.currentTarget.style.transform=''} onMouseLeave={e=>e.currentTarget.style.transform=''}>{iconLeft}{children}</button>;
}

const STATUS_LABEL = { forte: ['success','Forte aderência'], boa: ['brand','Boa oportunidade'], possivel: ['warning','Possível'], baixa: ['danger','Baixa aderência'] };
function OppCard({ op, onOpen }) {
  const b = band(op.score);
  const [st, label] = STATUS_LABEL[op.status] || STATUS_LABEL.baixa;
  return (
    <div onClick={() => onOpen(op)} style={{ display: 'flex', gap: 18, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '18px 20px', boxShadow: 'var(--shadow-sm)', cursor: 'pointer', transition: 'all var(--dur-base) var(--ease-out)' }}
      onMouseEnter={e=>{e.currentTarget.style.boxShadow='var(--shadow-lg)';e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.borderColor='var(--border-strong)';}}
      onMouseLeave={e=>{e.currentTarget.style.boxShadow='var(--shadow-sm)';e.currentTarget.style.transform='';e.currentTarget.style.borderColor='var(--border)';}}>
      <span style={{ width: 3, borderRadius: 99, background: b.color, flex: 'none', margin: '2px 0' }} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <Pill tone={st} dot>{label}</Pill>
          {op.urgente && <Pill tone="gold" solid>Urgente</Pill>}
          <Pill tone="neutral">{op.modalidade}</Pill>
        </div>
        <div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 5 }}><Icon name="landmark" style={{width:14,height:14}} />{op.orgao} · {op.cidade}/{op.estado}</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-strong)', lineHeight: 1.3, letterSpacing: '-0.01em', marginTop: 3 }}>{op.titulo}</div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 18px', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
          <span>Valor estimado <b style={{ color: 'var(--text-body)' }}>{op.valor}</b></span>
          <span style={{ color: 'var(--warning-fg)' }}>Prazo <b>{op.prazo}</b></span>
        </div>
        <div style={{ fontSize: 14, color: 'var(--text-body)' }}><b style={{ color: 'var(--text-strong)' }}>Recomendação:</b> {op.recomendacao}</div>
      </div>
      <div style={{ flex: 'none', display: 'flex', alignItems: 'center' }}><Gauge value={op.score} size={78} /></div>
    </div>
  );
}

Object.assign(window, { Icon, Mark, Gauge, Pill, Btn, OppCard, scoreBand: band });
