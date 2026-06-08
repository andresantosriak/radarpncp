/* Radar PNCP — alert toast. Bottom-right, accent edge, auto-dismiss.
 * Supports dynamic title/message and tone (success / warning / info).
 * Only renders when `data` is provided — no fake defaults. */
import { useEffect } from 'react'
import { Icon, type IconName } from './Icon'

export type ToastTone = 'success' | 'warning' | 'info'

export interface ToastData {
  title: string
  message?: string
  tone?: ToastTone
  /** Optional callback when the body of the toast is clicked. */
  onClick?: () => void
}

export interface ToastProps {
  show: boolean
  onClose: () => void
  data?: ToastData
}

const TONE_STYLES: Record<ToastTone, { border: string; bg: string; fg: string; icon: IconName }> = {
  success: {
    border: 'var(--brand)',
    bg: 'var(--brand-soft)',
    fg: 'var(--brand-soft-fg)',
    icon: 'circle-check',
  },
  warning: {
    border: 'var(--accent)',
    bg: 'var(--accent-soft)',
    fg: 'var(--accent-soft-fg)',
    icon: 'circle-alert',
  },
  info: {
    border: 'var(--info, var(--accent))',
    bg: 'var(--accent-soft)',
    fg: 'var(--accent-soft-fg)',
    icon: 'sparkles',
  },
}

export function Toast({ show, onClose, data }: ToastProps) {
  useEffect(() => {
    if (show) {
      const t = setTimeout(onClose, 6000)
      return () => clearTimeout(t)
    }
  }, [show, onClose])

  // Only render when visible AND real data is provided
  if (!show || !data) return null

  const tone = data.tone ?? 'info'
  const s = TONE_STYLES[tone]
  const clickable = !!data.onClick

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
        borderLeft: `3px solid ${s.border}`,
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
        padding: '14px 16px',
        maxWidth: 360,
        cursor: clickable ? 'pointer' : undefined,
      }}
      onClick={clickable ? data.onClick : undefined}
      role={clickable ? 'button' : undefined}
    >
      <span
        style={{
          width: 32,
          height: 32,
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: s.bg,
          color: s.fg,
          flex: 'none',
        }}
      >
        <Icon name={s.icon} size={18} />
      </span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-strong)' }}>{data.title}</div>
        {data.message && (
          <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.4 }}>{data.message}</div>
        )}
      </div>
      <button
        className="icon-btn-ghost"
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
        style={{ padding: 2 }}
        aria-label="Fechar"
      >
        <Icon name="x" size={15} />
      </button>
    </div>
  )
}
