/* Radar PNCP — alert toast. Bottom-right, gold accent edge, auto-dismiss.
 * Mirrors the product's "nova oportunidade" notification. */
import { useEffect } from 'react'
import { Icon } from './Icon'

export interface ToastProps {
  show: boolean
  onClose: () => void
}

export function Toast({ show, onClose }: ToastProps) {
  useEffect(() => {
    if (show) {
      const t = setTimeout(onClose, 6000)
      return () => clearTimeout(t)
    }
  }, [show, onClose])

  if (!show) return null
  return (
    <div
      style={{
        position: 'fixed',
        right: 24,
        bottom: 24,
        zIndex: 1100,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderLeft: '3px solid var(--accent)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
        padding: '14px 16px',
        maxWidth: 360,
      }}
    >
      <span
        style={{
          width: 32,
          height: 32,
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--accent-soft)',
          color: 'var(--accent-soft-fg)',
          flex: 'none',
        }}
      >
        <Icon name="sparkles" size={18} />
      </span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-strong)' }}>Nova oportunidade · score 91</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.4 }}>
          Plataforma de atendimento digital · R$ 78.000 · prazo 12/06
        </div>
      </div>
      <button className="icon-btn-ghost" onClick={onClose} style={{ padding: 2 }} aria-label="Fechar">
        <Icon name="x" size={15} />
      </button>
    </div>
  )
}
