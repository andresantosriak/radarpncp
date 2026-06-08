/* Radar PNCP — "Proposta gerada" dialog: the AI composition result. Scrim +
 * blur, brand-soft amount box, mono numeral. */
import type { Edital } from '../lib/types'
import { Icon } from './Icon'
import { Button } from './Button'

export interface ProposalDialogProps {
  open: boolean
  onClose: () => void
  op: Edital | null
}

export function ProposalDialog({ open, onClose, op }: ProposalDialogProps) {
  if (!open) return null
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--overlay-scrim)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-xl)',
          width: '100%',
          maxWidth: 460,
          padding: 24,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-strong)', letterSpacing: '-0.01em' }}>
              Proposta gerada
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>Composição automática pela IA</div>
          </div>
          <button className="icon-btn-ghost" onClick={onClose} aria-label="Fechar">
            <Icon name="x" />
          </button>
        </div>
        <div
          style={{
            margin: '18px 0',
            padding: 16,
            background: 'var(--brand-soft)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid color-mix(in oklab, var(--brand) 30%, transparent)',
          }}
        >
          <div
            style={{
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: '.08em',
              color: 'var(--brand-soft-fg)',
              fontWeight: 700,
            }}
          >
            Valor recomendado
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 30, fontWeight: 600, color: 'var(--text-strong)', marginTop: 4 }}>
            {op ? op.propostaIdeal : ''}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Mínimo saudável {op && op.propostaMin} · margem {op && op.margem}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <Button variant="ghost" onClick={onClose}>
            Fechar
          </Button>
          <Button variant="primary" onClick={onClose} iconLeft={<Icon name="download" size={16} />}>
            Baixar PDF
          </Button>
        </div>
      </div>
    </div>
  )
}
