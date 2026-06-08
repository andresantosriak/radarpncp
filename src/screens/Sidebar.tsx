/* Radar PNCP — app chrome: sidebar (brand, monitoring nav, config nav, footer). */
import type { Route } from '../lib/types'
import type { IconName } from '../components/Icon'
import { Icon } from '../components/Icon'
import { Mark } from '../components/Mark'

export interface SidebarCounts {
  radar: number
  urgentes: number
  descartados: number
}

export interface SidebarProps {
  active: Route
  onNav: (id: Route) => void
  counts: SidebarCounts
}

interface NavEntry {
  id: Route
  label: string
  icon: IconName
  n?: number
}

export function Sidebar({ active, onNav, counts }: SidebarProps) {
  const nav: NavEntry[] = [
    { id: 'radar', label: 'Radar', icon: 'radar', n: counts.radar },
    { id: 'urgentes', label: 'Urgentes', icon: 'alarm-clock', n: counts.urgentes },
    { id: 'descartados', label: 'Descartados', icon: 'archive', n: counts.descartados },
  ]
  const config: NavEntry[] = [
    { id: 'palavras', label: 'Palavras-chave', icon: 'tags' },
    { id: 'alertas', label: 'Alertas', icon: 'bell' },
    { id: 'empresa', label: 'Perfil da empresa', icon: 'building-2' },
  ]
  return (
    <aside className="sidebar">
      <div className="sb-brand">
        <Mark size={32} />
        <div className="sb-wm">
          <div className="top">
            <span className="radar">Radar</span>
            <span className="pncp">PNCP</span>
          </div>
          <span className="by">AI Solution Exp</span>
        </div>
      </div>
      <div className="sb-sec">Monitoramento</div>
      {nav.map((it) => (
        <button
          key={it.id}
          className={`nav-item ${active === it.id ? 'nav-item--active' : ''}`}
          onClick={() => onNav(it.id)}
        >
          <Icon name={it.icon} />
          {it.label}
          {it.n != null && <span className="badge-n">{it.n}</span>}
        </button>
      ))}
      <div className="sb-sec">Configuração</div>
      {config.map((it) => (
        <button
          key={it.id}
          className={`nav-item ${active === it.id ? 'nav-item--active' : ''}`}
          onClick={() => onNav(it.id)}
        >
          <Icon name={it.icon} />
          {it.label}
        </button>
      ))}
      <div className="sb-foot">
        <span
          style={{
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
            flex: 'none',
          }}
        >
          AI
        </span>
        <div className="info">
          <span className="nm">AI Solution Exp</span>
          <span className="cnpj">53.075.641/0001-71</span>
        </div>
      </div>
    </aside>
  )
}
