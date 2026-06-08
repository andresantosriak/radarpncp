/* Radar PNCP UI kit — Dashboard / Radar screen. */
function StatTile({ label, value, icon, tone = 'brand', delta, sub }) {
  const iconBg = { brand: ['var(--brand-soft)','var(--brand-soft-fg)'], gold: ['var(--accent-soft)','var(--accent-soft-fg)'], danger: ['var(--danger-soft)','var(--danger-fg)'], info: ['var(--info-soft)','var(--info-soft-fg)'] }[tone];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '18px 20px', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{label}</span>
        <span style={{ width: 34, height: 34, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: iconBg[0], color: iconBg[1] }}><Icon name={icon} style={{width:18,height:18}} /></span>
      </div>
      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 34, color: 'var(--text-strong)', lineHeight: 1, letterSpacing: '-0.01em' }}>{value}</span>
      {(delta || sub) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
          {delta && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--success)' }}><Icon name="trending-up" style={{width:13,height:13}} />{delta}</span>}
          {sub && <span style={{ color: 'var(--text-subtle)' }}>{sub}</span>}
        </div>
      )}
    </div>
  );
}

const FILTERS = [
  { id: 'todos', label: 'Melhores' },
  { id: 'urgentes', label: 'Urgentes', icon: 'alarm-clock' },
  { id: 'ia', label: 'IA / chatbot' },
  { id: 'alto', label: 'Acima de R$ 50 mil' },
];

function Dashboard({ editais, onOpen, filter, setFilter }) {
  const ativos = editais.filter((e) => e.status !== 'baixa');
  let list = ativos;
  if (filter === 'urgentes') list = ativos.filter((e) => e.urgente);
  else if (filter === 'ia') list = ativos.filter((e) => e.tags.some((t) => /ia|chatbot|assistente|atendimento/i.test(t)));
  else if (filter === 'alto') list = ativos.filter((e) => e.valorNum >= 50000);
  list = [...list].sort((a, b) => b.score - a.score);

  const counts = FILTERS.reduce((acc, f) => {
    if (f.id === 'todos') acc[f.id] = ativos.length;
    else if (f.id === 'urgentes') acc[f.id] = ativos.filter((e) => e.urgente).length;
    else if (f.id === 'ia') acc[f.id] = ativos.filter((e) => e.tags.some((t) => /ia|chatbot|assistente|atendimento/i.test(t))).length;
    else acc[f.id] = ativos.filter((e) => e.valorNum >= 50000).length;
    return acc;
  }, {});

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="page-title">Radar de oportunidades</div>
          <div className="page-sub">{ativos.length} editais ativos cruzados com o perfil da AI Solution · atualizado hoje, 08:00</div>
        </div>
        <Btn variant="secondary" iconLeft={<Icon name="refresh-cw" style={{width:16,height:16}} />}>Atualizar PNCP</Btn>
      </div>

      <div className="stat-row">
        <StatTile label="Oportunidades ativas" value={ativos.length} icon="radar" delta="+12" sub="esta semana" />
        <StatTile label="Forte aderência" value={ativos.filter(e=>e.score>=85).length} icon="target" tone="gold" />
        <StatTile label="Editais urgentes" value={ativos.filter(e=>e.urgente).length} icon="alarm-clock" tone="danger" />
        <StatTile label="Valor em jogo" value="R$ 374k" icon="banknote" tone="info" />
      </div>

      <div className="filter-bar">
        <div style={{ display: 'flex', gap: 2, borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
          {FILTERS.map((f) => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              style={{ appearance: 'none', border: 0, background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: filter===f.id?600:500, color: filter===f.id?'var(--brand)':'var(--text-muted)', padding: '11px 16px', position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 7 }}>
              {f.icon && <Icon name={f.icon} style={{width:16,height:16}} />}{f.label}
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, background: filter===f.id?'var(--brand-soft)':'var(--bg-subtle)', color: filter===f.id?'var(--brand-soft-fg)':'var(--text-muted)', padding: '1px 7px', borderRadius: 99, fontWeight: 600 }}>{counts[f.id]}</span>
              {filter===f.id && <span style={{ position: 'absolute', left: 8, right: 8, bottom: -1, height: 2, background: 'var(--brand)', borderRadius: '2px 2px 0 0' }} />}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn variant="ghost" size="sm" iconLeft={<Icon name="sliders-horizontal" style={{width:15,height:15}} />}>Filtros</Btn>
        </div>
      </div>

      <div className="opp-list">
        {list.map((op) => <OppCard key={op.id} op={op} onOpen={onOpen} />)}
        {list.length === 0 && <div className="empty"><Icon name="radar" style={{width:32,height:32}} /><span>Nenhum edital neste filtro.</span></div>}
      </div>
    </div>
  );
}

Object.assign(window, { Dashboard });
