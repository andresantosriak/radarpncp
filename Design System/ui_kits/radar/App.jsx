/* Radar PNCP UI kit — App shell + routing + theme. */
const { useState: useS, useEffect: useE } = React;

function MiniDialog({ open, onClose, op }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'var(--overlay-scrim)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, zIndex: 1000 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)', width: '100%', maxWidth: 460, padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-strong)', letterSpacing: '-0.01em' }}>Proposta gerada</div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>Composição automática pela IA</div>
          </div>
          <button className="icon-btn-ghost" onClick={onClose} aria-label="Fechar"><Icon name="x" /></button>
        </div>
        <div style={{ margin: '18px 0', padding: 16, background: 'var(--brand-soft)', borderRadius: 'var(--radius-lg)', border: '1px solid color-mix(in oklab, var(--brand) 30%, transparent)' }}>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--brand-soft-fg)', fontWeight: 700 }}>Valor recomendado</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 30, fontWeight: 600, color: 'var(--text-strong)', marginTop: 4 }}>{op ? op.propostaIdeal : ''}</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Mínimo saudável {op && op.propostaMin} · margem {op && op.margem}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <Btn variant="ghost" onClick={onClose}>Fechar</Btn>
          <Btn variant="primary" onClick={onClose} iconLeft={<Icon name="download" style={{width:16,height:16}} />}>Baixar PDF</Btn>
        </div>
      </div>
    </div>
  );
}

function Toast({ show, onClose }) {
  useE(() => { if (show) { const t = setTimeout(onClose, 6000); return () => clearTimeout(t); } }, [show]);
  if (!show) return null;
  return (
    <div style={{ position: 'fixed', right: 24, bottom: 24, zIndex: 1100, display: 'flex', alignItems: 'flex-start', gap: 12, background: 'var(--surface)', border: '1px solid var(--border)', borderLeft: '3px solid var(--accent)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', padding: '14px 16px', maxWidth: 360 }}>
      <span style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--accent-soft)', color: 'var(--accent-soft-fg)', flex: 'none' }}><Icon name="sparkles" style={{width:18,height:18}} /></span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-strong)' }}>Nova oportunidade · score 91</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.4 }}>Plataforma de atendimento digital · R$ 78.000 · prazo 12/06</div>
      </div>
      <button className="icon-btn-ghost" onClick={onClose} style={{ padding: 2 }} aria-label="Fechar"><Icon name="x" style={{width:15,height:15}} /></button>
    </div>
  );
}

function ConfigScreen({ which }) {
  const map = {
    palavras: { t: 'Palavras-chave monitoradas', d: 'O radar consulta o PNCP diariamente buscando estes termos.', icon: 'tags', body: ['inteligência artificial','chatbot','assistente virtual','atendimento digital','automação','software','desenvolvimento de sistema','integração de sistemas','API','dashboard','business intelligence','SaaS','transformação digital','workflow','portal do cidadão','central de atendimento'] },
    alertas: { t: 'Alertas', d: 'Canais de notificação para novas oportunidades.', icon: 'bell' },
    empresa: { t: 'Perfil da empresa', d: 'Base de comparação estratégica do radar.', icon: 'building-2' },
  }[which];
  return (
    <div className="page">
      <div className="page-head"><div><div className="page-title">{map.t}</div><div className="page-sub">{map.d}</div></div></div>
      {which === 'palavras' && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {map.body.map((k, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 500, color: i < 6 ? 'var(--brand-soft-fg)' : 'var(--text-body)', background: i < 6 ? 'var(--brand-soft)' : 'var(--surface)', border: i < 6 ? '1px solid transparent' : '1px solid var(--border-strong)', borderRadius: 99, padding: '7px 13px' }}>
              <Icon name="hash" style={{width:13,height:13,opacity:.6}} />{k}
            </span>
          ))}
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600, color: 'var(--brand)', background: 'transparent', border: '1px dashed var(--border-strong)', borderRadius: 99, padding: '7px 13px', cursor: 'pointer' }}><Icon name="plus" style={{width:15,height:15}} />Adicionar termo</button>
        </div>
      )}
      {which === 'alertas' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 520 }}>
          {[['WhatsApp','message-circle',true],['E-mail','mail',true],['Telegram','send',false],['Painel','layout-dashboard',true]].map(([n, ic, on], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '14px 18px' }}>
              <span style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}><Icon name={ic} style={{width:18,height:18}} /></span>
              <span style={{ flex: 1, fontWeight: 600, color: 'var(--text-strong)' }}>{n}</span>
              <span style={{ width: 40, height: 23, borderRadius: 99, background: on ? 'var(--brand)' : 'var(--ink-200)', padding: 2, display: 'flex', justifyContent: on ? 'flex-end' : 'flex-start' }}><span style={{ width: 19, height: 19, borderRadius: '50%', background: '#fff', boxShadow: 'var(--shadow-sm)' }} /></span>
            </div>
          ))}
        </div>
      )}
      {which === 'empresa' && (
        <div style={{ maxWidth: 560, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 24 }}>
          <KV k="Razão social" v={window.RADAR.empresa.nome} />
          <KV k="CNPJ" v={window.RADAR.empresa.cnpj} />
          <div className="kv" style={{ borderBottom: 0 }}><span className="k">Área</span><span style={{ fontSize: 14, color: 'var(--text-body)', textAlign: 'right', maxWidth: 320 }}>{window.RADAR.empresa.area}</span></div>
        </div>
      )}
    </div>
  );
}

function App() {
  const [theme, setTheme] = useS('dark');
  const [route, setRoute] = useS('radar');
  const [filter, setFilter] = useS('todos');
  const [op, setOp] = useS(null);
  const [dialog, setDialog] = useS(false);
  const [toast, setToast] = useS(false);

  useE(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);
  useE(() => { const t = setTimeout(() => setToast(true), 1400); return () => clearTimeout(t); }, []);

  const editais = window.RADAR.editais;
  const ativos = editais.filter((e) => e.status !== 'baixa');
  const counts = { radar: ativos.length, urgentes: ativos.filter((e) => e.urgente).length, descartados: editais.filter((e) => e.status === 'baixa').length };

  const openOp = (o) => { setOp(o); window.scrollTo && window.scrollTo(0, 0); };

  let crumb;
  if (op) crumb = <div className="crumb"><span>Radar</span><Icon name="chevron-right" style={{width:14,height:14}} /><b>Oportunidade</b></div>;
  else crumb = <div className="crumb"><b>{route === 'radar' ? 'Radar de oportunidades' : route === 'urgentes' ? 'Urgentes' : route === 'descartados' ? 'Descartados' : route === 'palavras' ? 'Palavras-chave' : route === 'alertas' ? 'Alertas' : 'Perfil da empresa'}</b></div>;

  const onNav = (id) => { setOp(null); setRoute(id); if (id === 'radar') setFilter('todos'); if (id === 'urgentes') setFilter('urgentes'); };

  return (
    <div className="app">
      <Sidebar active={op ? 'radar' : route} onNav={onNav} counts={counts} />
      <div className="main">
        <Topbar crumb={crumb} theme={theme} onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
        <div className="scroll" id="scrollArea">
          {op ? (
            <Detail op={op} onBack={() => setOp(null)} onGenerate={() => setDialog(true)} />
          ) : route === 'descartados' ? (
            <div className="page">
              <div className="page-head"><div><div className="page-title">Descartados</div><div className="page-sub">Editais sem aderência ao portfólio da AI Solution.</div></div></div>
              <div className="opp-list">{editais.filter((e) => e.status === 'baixa').map((o) => <OppCard key={o.id} op={o} onOpen={openOp} />)}</div>
            </div>
          ) : (route === 'palavras' || route === 'alertas' || route === 'empresa') ? (
            <ConfigScreen which={route} />
          ) : (
            <Dashboard editais={editais} onOpen={openOp} filter={filter} setFilter={setFilter} />
          )}
        </div>
      </div>
      <MiniDialog open={dialog} onClose={() => setDialog(false)} op={op} />
      <Toast show={toast} onClose={() => setToast(false)} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
