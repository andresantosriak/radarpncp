/* Radar PNCP — Dashboard / Radar screen: KPI tiles, sort selector,
 * combinable filters, and opportunity list. */
import { useMemo, type ReactNode } from 'react'
import type { Edital, SortId, RadarFilters } from '../lib/types'
import type { IconName } from '../components/Icon'
import type { RadarSource } from '../hooks/useRadar'
import { Icon } from '../components/Icon'
import { Button } from '../components/Button'
import { OpportunityCard } from '../components/OpportunityCard'

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

function compactBRL(n: number): string {
  if (n >= 1_000_000) return `R$ ${(n / 1_000_000).toFixed(1).replace('.', ',')}M`
  if (n >= 1000) return `R$ ${Math.round(n / 1000)}k`
  if (n <= 0) return '—'
  return `R$ ${Math.round(n).toLocaleString('pt-BR')}`
}

// --- Sort helpers ---
const SORT_OPTIONS: { id: SortId; label: string }[] = [
  { id: 'recentes', label: 'Mais recentes' },
  { id: 'aderencia', label: 'Maior aderência' },
  { id: 'valor', label: 'Maior valor' },
  { id: 'prazo', label: 'Prazo mais próximo' },
]

function applySorting(list: Edital[], sort: SortId): Edital[] {
  const sorted = [...list]
  switch (sort) {
    case 'recentes':
      return sorted.sort((a, b) => (b.publicadoISO ?? '').localeCompare(a.publicadoISO ?? ''))
    case 'aderencia':
      return sorted.sort((a, b) => b.score - a.score)
    case 'valor':
      return sorted.sort((a, b) => b.valorNum - a.valorNum)
    case 'prazo':
      // nulls last, closest deadline first
      return sorted.sort((a, b) => {
        if (!a.prazoISO && !b.prazoISO) return 0
        if (!a.prazoISO) return 1
        if (!b.prazoISO) return -1
        return a.prazoISO.localeCompare(b.prazoISO)
      })
    default:
      return sorted
  }
}

// --- Filter helpers ---
const FAIXA_VALOR_OPTIONS = [
  { value: '', label: 'Todas' },
  { value: '0-50000', label: 'Até R$ 50k' },
  { value: '50000-200000', label: 'R$ 50k – 200k' },
  { value: '200000-1000000', label: 'R$ 200k – 1M' },
  { value: '1000000+', label: 'Acima de R$ 1M' },
]

const ADERENCIA_OPTIONS = [
  { value: '', label: 'Todas' },
  { value: 'forte', label: 'Forte' },
  { value: 'boa', label: 'Boa' },
  { value: 'possivel', label: 'Possível' },
]

function matchesFaixaValor(valorNum: number, faixa: string): boolean {
  if (!faixa) return true
  if (faixa === '1000000+') return valorNum >= 1_000_000
  const [min, max] = faixa.split('-').map(Number)
  return valorNum >= min && valorNum < max
}

function applyFilters(list: Edital[], filters: RadarFilters): Edital[] {
  return list.filter((e) => {
    if (filters.modalidade && e.modalidade !== filters.modalidade) return false
    if (filters.estado && e.estado !== filters.estado) return false
    if (filters.faixaValor && !matchesFaixaValor(e.valorNum, filters.faixaValor)) return false
    if (filters.aderencia && e.status !== filters.aderencia) return false
    if (filters.urgente === true && !e.urgente) return false
    return true
  })
}

const EMPTY_FILTERS: RadarFilters = {
  modalidade: '',
  estado: '',
  faixaValor: '',
  aderencia: '',
  urgente: null,
  mostrarEncerrados: false,
}

function hasActiveFilters(f: RadarFilters): boolean {
  return !!(f.modalidade || f.estado || f.faixaValor || f.aderencia || f.urgente || f.mostrarEncerrados)
}

// --- Inline select style ---
const selectStyle: React.CSSProperties = {
  appearance: 'none',
  border: '1px solid var(--border-strong)',
  borderRadius: 'var(--radius-md)',
  padding: '6px 28px 6px 10px',
  fontSize: 13,
  fontFamily: 'var(--font-sans)',
  fontWeight: 500,
  color: 'var(--text-body)',
  background: 'var(--surface)',
  cursor: 'pointer',
  outline: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2.5'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 8px center',
  backgroundSize: 12,
  minWidth: 0,
}

const selectActiveStyle: React.CSSProperties = {
  ...selectStyle,
  borderColor: 'var(--brand)',
  color: 'var(--brand)',
}

export interface DashboardProps {
  editais: Edital[]
  onOpen: (op: Edital) => void
  sort: SortId
  setSort: (id: SortId) => void
  filters: RadarFilters
  setFilters: (f: RadarFilters) => void
  isLoading: boolean
  isFetching: boolean
  onRefresh: () => void
  source: RadarSource
  coletando?: boolean
  onColetar?: () => void
}

export function Dashboard({
  editais,
  onOpen,
  sort,
  setSort,
  filters,
  setFilters,
  isLoading,
  isFetching,
  onRefresh,
  source,
  coletando,
  onColetar,
}: DashboardProps) {
  // derive unique option values from loaded data
  const modalidadeOptions = useMemo(
    () => [...new Set(editais.map((e) => e.modalidade).filter(Boolean))].sort(),
    [editais],
  )
  const estadoOptions = useMemo(
    () => [...new Set(editais.map((e) => e.estado).filter(Boolean))].sort(),
    [editais],
  )

  const ativos = editais.filter((e) => e.status !== 'baixa')
  const filtered = applyFilters(ativos, filters)
  const list = applySorting(filtered, sort)

  const valorEmJogo = compactBRL(ativos.reduce((s, e) => s + (e.valorNum || 0), 0))
  const fortes = ativos.filter((e) => e.score >= 85).length
  const urgentes = ativos.filter((e) => e.urgente).length
  const active = hasActiveFilters(filters)

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
          onClick={coletando ? undefined : (onColetar ?? onRefresh)}
          disabled={coletando}
          iconLeft={<Icon name="refresh-cw" size={16} />}
        >
          {coletando ? 'Buscando no PNCP…' : isFetching ? 'Atualizando…' : 'Atualizar PNCP'}
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
        <StatTile label="Editais urgentes" value={urgentes} icon="alarm-clock" tone="danger" sub="prazo ≤ 7 dias" />
        <StatTile label="Valor em jogo" value={valorEmJogo} icon="banknote" tone="info" sub="soma das ativas" />
      </div>

      {/* Filter bar + sort selector */}
      <div className="filter-bar" style={{ flexDirection: 'column', gap: 10 }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            alignItems: 'center',
          }}
        >
          <Icon name="filter" size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />

          {/* Modalidade */}
          <select
            value={filters.modalidade}
            onChange={(e) => setFilters({ ...filters, modalidade: e.target.value })}
            style={filters.modalidade ? selectActiveStyle : selectStyle}
          >
            <option value="">Modalidade</option>
            {modalidadeOptions.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          {/* Estado/UF */}
          <select
            value={filters.estado}
            onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
            style={filters.estado ? selectActiveStyle : selectStyle}
          >
            <option value="">Estado</option>
            {estadoOptions.map((uf) => (
              <option key={uf} value={uf}>{uf}</option>
            ))}
          </select>

          {/* Faixa de valor */}
          <select
            value={filters.faixaValor}
            onChange={(e) => setFilters({ ...filters, faixaValor: e.target.value })}
            style={filters.faixaValor ? selectActiveStyle : selectStyle}
          >
            {FAIXA_VALOR_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label === 'Todas' ? 'Valor' : o.label}</option>
            ))}
          </select>

          {/* Aderência */}
          <select
            value={filters.aderencia}
            onChange={(e) => setFilters({ ...filters, aderencia: e.target.value })}
            style={filters.aderencia ? selectActiveStyle : selectStyle}
          >
            {ADERENCIA_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label === 'Todas' ? 'Aderência' : o.label}</option>
            ))}
          </select>

          {/* Urgentes toggle */}
          <button
            onClick={() => setFilters({ ...filters, urgente: filters.urgente ? null : true })}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              border: filters.urgente
                ? '1px solid var(--danger-fg)'
                : '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-md)',
              padding: '5px 10px',
              fontSize: 13,
              fontWeight: 500,
              color: filters.urgente ? 'var(--danger-fg)' : 'var(--text-body)',
              background: filters.urgente ? 'var(--danger-soft)' : 'var(--surface)',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <Icon name="alarm-clock" size={13} />
            Urgentes
          </button>

          {/* Mostrar encerrados toggle */}
          <button
            onClick={() => setFilters({ ...filters, mostrarEncerrados: !filters.mostrarEncerrados })}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              border: filters.mostrarEncerrados
                ? '1px solid var(--text-muted)'
                : '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-md)',
              padding: '5px 10px',
              fontSize: 13,
              fontWeight: 500,
              color: filters.mostrarEncerrados ? 'var(--text-strong)' : 'var(--text-body)',
              background: filters.mostrarEncerrados ? 'var(--bg-subtle)' : 'var(--surface)',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <Icon name="calendar" size={13} />
            Mostrar encerrados
          </button>

          {/* Clear filters */}
          {active && (
            <button
              onClick={() => setFilters(EMPTY_FILTERS)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                border: 0,
                background: 'transparent',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-sans)',
                padding: '4px 6px',
              }}
            >
              <Icon name="rotate-ccw" size={12} />
              Limpar
            </button>
          )}

          {/* spacer → sort to the right */}
          <span style={{ flex: 1 }} />

          {/* Sort selector */}
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            <Icon name="arrow-up-down" size={14} style={{ color: 'var(--text-muted)' }} />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortId)}
              style={selectStyle}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>{o.label}</option>
              ))}
            </select>
          </span>
        </div>

        {/* Result count when filters active */}
        {active && (
          <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>
            {list.length} {list.length === 1 ? 'edital encontrado' : 'editais encontrados'}
          </div>
        )}
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
              <span>
                {active
                  ? 'Nenhum edital com esses filtros.'
                  : 'Nenhuma oportunidade ativa encontrada. Ative "Mostrar encerrados" para ver o histórico.'}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
