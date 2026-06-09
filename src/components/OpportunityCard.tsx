/* Radar PNCP — OpportunityCard. The product's signature row: status pills,
 * órgão + objeto, valor/prazo (mono), recomendação, and the score gauge.
 * Clickable cards lift 2px on hover. Left accent bar uses the score band color. */
import type { Edital } from '../lib/types'
import type { PillTone } from './Pill'
import { Icon } from './Icon'
import { Gauge } from './Gauge'
import { Pill } from './Pill'
import { scoreBand } from './score'

const STATUS_LABEL: Record<Edital['status'], [PillTone, string]> = {
  forte: ['success', 'Forte aderência'],
  boa: ['brand', 'Boa oportunidade'],
  possivel: ['warning', 'Possível'],
  baixa: ['danger', 'Baixa aderência'],
}

const FONTE_LABEL: Record<string, [PillTone, string]> = {
  pncp: ['info', 'PNCP'],
  'querido-diario': ['gold', 'Diário Oficial'],
}

export interface OpportunityCardProps {
  op: Edital
  onOpen: (op: Edital) => void
}

export function OpportunityCard({ op, onOpen }: OpportunityCardProps) {
  const b = scoreBand(op.score)
  const [st, label] = STATUS_LABEL[op.status] || STATUS_LABEL.baixa
  return (
    <div
      onClick={() => onOpen(op)}
      style={{
        display: 'flex',
        gap: 18,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '18px 20px',
        boxShadow: 'var(--shadow-sm)',
        cursor: 'pointer',
        transition: 'all var(--dur-base) var(--ease-out)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.borderColor = 'var(--border-strong)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
        e.currentTarget.style.transform = ''
        e.currentTarget.style.borderColor = 'var(--border)'
      }}
    >
      <span style={{ width: 3, borderRadius: 99, background: b.color, flex: 'none', margin: '2px 0' }} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <Pill tone={st} dot>
            {label}
          </Pill>
          {op.urgente && (
            <Pill tone="gold" solid>
              Urgente
            </Pill>
          )}
          <Pill tone="neutral">{op.modalidade}</Pill>
          {op.fonte && op.fonte !== 'pncp' && (() => {
            const [ft, fl] = FONTE_LABEL[op.fonte] ?? ['neutral', op.fonte]
            return <Pill tone={ft}>{fl}</Pill>
          })()}
        </div>
        <div>
          <div
            style={{
              fontSize: 13,
              color: 'var(--text-muted)',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <Icon name="landmark" size={14} />
            {op.orgao} · {op.cidade}/{op.estado}
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: 'var(--text-strong)',
              lineHeight: 1.3,
              letterSpacing: '-0.01em',
              marginTop: 3,
            }}
          >
            {op.titulo}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px 18px',
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            color: 'var(--text-muted)',
          }}
        >
          <span>
            Valor estimado <b style={{ color: 'var(--text-body)' }}>{op.valor}</b>
          </span>
          <span style={{ color: 'var(--warning-fg)' }}>
            Prazo <b>{op.prazo}</b>
          </span>
        </div>
        <div style={{ fontSize: 14, color: 'var(--text-body)' }}>
          <b style={{ color: 'var(--text-strong)' }}>Recomendação:</b> {op.recomendacao}
        </div>
      </div>
      <div style={{ flex: 'none', display: 'flex', alignItems: 'center' }}>
        <Gauge value={op.score} size={78} />
      </div>
    </div>
  )
}
