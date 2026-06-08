/* Radar PNCP — app chrome: topbar (breadcrumb, data-source badge, search,
 * theme toggle, alerts). Glass surface: var(--surface) 80% + blur. */
import type { ReactNode } from 'react'
import { Icon } from '../components/Icon'
import type { RadarSource } from '../hooks/useRadar'

export type Theme = 'dark' | 'light'

export interface TopbarProps {
  crumb: ReactNode
  theme: Theme
  onToggleTheme: () => void
  search: string
  onSearchChange: (value: string) => void
  source: RadarSource
}

function SourceBadge({ source }: { source: RadarSource }) {
  const live = source === 'live'
  return (
    <span
      title={live ? 'Editais reais consultados na API do PNCP' : 'Dados de demonstração (API do PNCP indisponível)'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '.04em',
        textTransform: 'uppercase',
        padding: '4px 10px',
        borderRadius: 'var(--radius-pill)',
        background: live ? 'var(--success-soft)' : 'var(--bg-subtle)',
        color: live ? 'var(--success-fg)' : 'var(--text-muted)',
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: live ? 'var(--success)' : 'var(--text-subtle)',
          boxShadow: live ? '0 0 0 3px color-mix(in oklab, var(--success) 25%, transparent)' : 'none',
        }}
      />
      {live ? 'Ao vivo · PNCP' : 'Demonstração'}
    </span>
  )
}

export function Topbar({ crumb, theme, onToggleTheme, search, onSearchChange, source }: TopbarProps) {
  return (
    <header className="topbar">
      {crumb}
      <SourceBadge source={source} />
      <div className="spacer" />
      <div className="topbar-search">
        <Icon
          name="search"
          style={{
            position: 'absolute',
            left: 11,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-subtle)',
          }}
          size={17}
        />
        <input
          value={search}
          placeholder="Buscar órgão, objeto, palavra-chave…"
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            width: '100%',
            height: 38,
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-strong)',
            background: 'var(--surface)',
            padding: '0 12px 0 34px',
            fontFamily: 'var(--font-sans)',
            fontSize: 14,
            color: 'var(--text-strong)',
            outline: 'none',
          }}
        />
      </div>
      <div className="actions">
        <button className="icon-btn-ghost" onClick={onToggleTheme} title="Alternar tema" aria-label="Alternar tema">
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
        </button>
        <button className="icon-btn-ghost" aria-label="Notificações">
          <Icon name="bell" />
        </button>
      </div>
    </header>
  )
}
