/* Radar PNCP UI kit — app chrome (sidebar + topbar). */
function Sidebar({ active, onNav, counts }) {
  const nav = [
    { id: 'radar', label: 'Radar', icon: 'radar', n: counts.radar },
    { id: 'urgentes', label: 'Urgentes', icon: 'alarm-clock', n: counts.urgentes },
    { id: 'descartados', label: 'Descartados', icon: 'archive', n: counts.descartados },
  ];
  const config = [
    { id: 'palavras', label: 'Palavras-chave', icon: 'tags' },
    { id: 'alertas', label: 'Alertas', icon: 'bell' },
    { id: 'empresa', label: 'Perfil da empresa', icon: 'building-2' },
  ];
  return (
    <aside className="sidebar">
      <div className="sb-brand">
        <Mark size={32} />
        <div className="sb-wm">
          <div className="top"><span className="radar">Radar</span><span className="pncp">PNCP</span></div>
          <span className="by">AI Solution Exp</span>
        </div>
      </div>
      <div className="sb-sec">Monitoramento</div>
      {nav.map((it) => (
        <button key={it.id} className={`nav-item ${active === it.id ? 'nav-item--active' : ''}`} onClick={() => onNav(it.id)}>
          <Icon name={it.icon} />{it.label}
          {it.n != null && <span className="badge-n">{it.n}</span>}
        </button>
      ))}
      <div className="sb-sec">Configuração</div>
      {config.map((it) => (
        <button key={it.id} className={`nav-item ${active === it.id ? 'nav-item--active' : ''}`} onClick={() => onNav(it.id)}>
          <Icon name={it.icon} />{it.label}
        </button>
      ))}
      <div className="sb-foot">
        <span style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--brand-soft)', color: 'var(--brand-soft-fg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flex: 'none' }}>AI</span>
        <div className="info">
          <span className="nm">AI Solution Exp</span>
          <span className="cnpj">53.075.641/0001-71</span>
        </div>
      </div>
    </aside>
  );
}

function Topbar({ crumb, theme, onToggleTheme, onSearch }) {
  return (
    <header className="topbar">
      {crumb}
      <div className="spacer" />
      <div style={{ position: 'relative', width: 280 }}>
        <Icon name="search" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', width: 17, height: 17, color: 'var(--text-subtle)' }} />
        <input placeholder="Buscar órgão, objeto, palavra-chave…" onChange={onSearch}
          style={{ width: '100%', height: 38, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-strong)', background: 'var(--surface)', padding: '0 12px 0 34px', fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-strong)', outline: 'none' }} />
      </div>
      <div className="actions">
        <button className="icon-btn-ghost" onClick={onToggleTheme} title="Alternar tema" aria-label="Alternar tema">
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
        </button>
        <button className="icon-btn-ghost" aria-label="Notificações"><Icon name="bell" /></button>
      </div>
    </header>
  );
}

Object.assign(window, { Sidebar, Topbar });
