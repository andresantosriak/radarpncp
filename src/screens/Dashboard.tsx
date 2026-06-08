/* Radar PNCP — Dashboard / Radar screen: KPI tiles, filter tabs, opportunity
 * list. Consome o resultado do radar (ao vivo do PNCP ou demonstração), com
 * estados de carregamento e vazio. */
import type { ReactNode } from 'react'
import type { Edital, FilterId } from '../lib/types'
import type { IconName } from '../components/Icon'
import type { RadarSource } from '../hooks/useRadar'
import { Icon } from '../components/Icon'
import { Button } from '../components/Button'
import { OpportunityCard } from '../components/OpportunityCard'
import { normalize } from '../lib/text'

type StatTone = 'brand' | 'gold' | 'danger' | 'info'

interface StatTileProps {
  label: string
  value: ReactNode
  icon: IconName
  tone?: StatTone
  sub?: string
}

function StatTile({ label, value, icon, tone = 'brand', sub }: StatTileProps) {
  const iconBg: Record<StatTone, [string, string]> = {
    brand: ['var(--brand-soft)', 'var(--brand-soft-fg)'],
    gold: ['var(--accent-soft)', 'var(--accent-soft-fg)'],
    danger: ['var(--danger-soft)', 'var(--danger-fg)'],
    info: ['var(--info-soft)', 'var(--info-soft-fg)'],
  }
  const [bg, fg] = iconBg[tone]
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '18px 20px',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{label}</span>
        <span
          style={{
            width: 34,
            height: 34,
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: bg,
            color: fg,
          }}
        >
          <Icon name={icon} size={18} />
        </span>
      </div>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontWeight: 600,
          fontSize: 34,
          color: 'var(--text-strong)',
          lineHeight: 1,
          letterSpacing: '-0.01em',
        }}
      >
        {value}
      </span>
      {sub && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
          <span style={{ color: 'var(--text-subtle)' }}>{sub}</span>
        </div>
      )}
    </div>
  )
}

interface FilterEntry {
  id: FilterId
  label: string
  icon?: IconName
}

const FILTERS: FilterEntry[] = [
  { id: 'todos', label: 'Melhores' },
  { id: 'urgentes', label: 'Urgentes', icon: 'alarm-clock' },
  { id: 'ia', label: 'IA / chatbot' },
  { id: 'alto', label: 'Acima de R$ 50 mil' },
]

// Aba "IA / chatbot": casa tags inteiras (evita 'ia' dentro de 'licenciamento').
const IA_TERMS = new Set([
  'ia',
  'chatbot',
  'inteligencia artificial',
  'assistente virtual',
  'agente virtual',
  'atendimento digital',
  'atendimento automatizado',
  'atendimento ao cidadao',
  'central de atendimento',
])
const isIa = (e: Edital) => e.tags.some((t) => IA_TERMS.has(normalize(t).trim()))

function compactBRL(n: number): string {
  if (n >= 1_000_000) return `R$ ${(n / 1_000_000).toFixed(1).replace('.', ',')}M`
  if (n >= 1000) return `R$ ${Math.round(n / 1000)}k`
  if (n <= 0) return '—'
  return `R$ ${Math.round(n).toLocaleString('pt-BR')}`
}

export interface DashboardProps {
  editais: Edital[]
  onOpen: (op: Edital) => void
  filter: FilterId
  setFilter: (id: FilterId) => void
  isLoading: boolean
  isFetching: boolean
  onRefresh: () => void
  source: RadarSource
}

export function Dashboard({ editais, onOpen, filter, setFilter, isLoading, isFetching, onRefresh, source }: DashboardProps) {
  const ativos = editais.filter((e) => e.status !== 'baixa')
  let list = ativos
  if (filter === 'urgentes') list = ativos.filter((e) => e.urgente)
  else if (filter === 'ia') list = ativos.filter(isIa)
  else if (filter === 'alto') list = ativos.filter((e) => e.valorNum >= 50000)
  list = [...list].sort((a, b) => b.score - a.score)

  const counts: Record<FilterId, number> = {
    todos: ativos.length,
    urgentes: ativos.filter((e) => e.urgente).length,
    ia: ativos.filter(isIa).length,
    alto: ativos.filter((e) => e.valorNum >= 50000).length,
  }

  const valorEmJogo = compactBRL(ativos.reduce((s, e) => s + (e.valorNum || 0), 0))
  const fortes = ativos.filter((e) => e.score >= 85).length

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="page-title">Radar de oportunidades</div>
          <div className="page-sub">
            {isLoading
              ? 'Consultando o PNCP e cruzando com o perfil da AI Solution…'
              : source === 'live'
                ? `${ativos.length} editais ativos cruzados com o perfil da AI Solution · ao vivo do PNCP`
                : `${ativos.length} editais (demonstração) cruzados com o perfil da AI Solution`}
          </div>
        </div>
        <Button
          variant="secondary"
          onClick={onRefresh}
          iconLeft={<Icon name="refresh-cw" size={16} />}
        >
          {isFetching ? 'Atualizando…' : 'Atualizar PNCP'}
        </Button>
      </div>

      <div className="stat-row">
        <StatTile
          label="Oportunidades ativas"
          value={ativos.length}
          icon="radar"
          sub={source === 'live' ? 'ao vivo do PNCP' : 'demonstração'}
        />
        <StatTile label="Forte aderência" value={fortes} icon="target" tone="gold" sub="score 85+" />
        <StatTile label="Editais urgentes" value={counts.urgentes} icon="alarm-clock" tone="danger" sub="prazo ≤ 7 dias" />
        <StatTile label="Valor em jogo" value={valorEmJogo} icon="banknote" tone="info" sub="soma das ativas" />
      </div>

      <div className="filter-bar">
        <div style={{ display: 'flex', gap: 2, borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
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
                gap: 7,
              }}
            >
              {f.icon && <Icon name={f.icon} size={16} />}
              {f.label}
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  background: filter === f.id ? 'var(--brand-soft)' : 'var(--bg-subtle)',
                  color: filter === f.id ? 'var(--brand-soft-fg)' : 'var(--text-muted)',
                  padding: '1px 7px',
                  borderRadius: 99,
                  fontWeight: 600,
                }}
              >
                {counts[f.id]}
              </span>
              {filter === f.id && (
                <span
                  style={{
                    position: 'absolute',
                    left: 8,
                    right: 8,
                    bottom: -1,
                    height: 2,
                    background: 'var(--brand)',
                    borderRadius: '2px 2px 0 0',
                  }}
                />
              )}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="ghost" size="sm" iconLeft={<Icon name="sliders-horizontal" size={15} />}>
            Filtros
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="opp-list">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: 132 }} />
          ))}
        </div>
      ) : (
        <div className="opp-list">
          {list.map((op) => (
            <OpportunityCard key={op.id} op={op} onOpen={onOpen} />
          ))}
          {list.length === 0 && (
            <div className="empty">
              <Icon name="radar" size={32} />
              <span>Nenhum edital neste filtro.</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
