/* Radar PNCP — Pill / Badge. Soft tonal chip (or solid for emphasis), with an
 * optional leading status dot. */
import type { CSSProperties, ReactNode } from 'react'

export type PillTone =
  | 'success'
  | 'brand'
  | 'warning'
  | 'danger'
  | 'gold'
  | 'neutral'
  | 'info'

const TONE_BG: Record<PillTone, [string, string]> = {
  success: ['var(--success-soft)', 'var(--success-fg)'],
  brand: ['var(--brand-soft)', 'var(--brand-soft-fg)'],
  warning: ['var(--warning-soft)', 'var(--warning-fg)'],
  danger: ['var(--danger-soft)', 'var(--danger-fg)'],
  gold: ['var(--accent-soft)', 'var(--accent-soft-fg)'],
  neutral: ['var(--bg-subtle)', 'var(--text-muted)'],
  info: ['var(--info-soft)', 'var(--info-soft-fg)'],
}

export interface PillProps {
  tone?: PillTone
  dot?: boolean
  solid?: boolean
  children: ReactNode
}

export function Pill({ tone = 'neutral', dot, solid, children }: PillProps) {
  const [bg, fg] = TONE_BG[tone] || TONE_BG.neutral
  const style: CSSProperties = solid
    ? { background: tone === 'gold' ? 'var(--accent)' : `var(--${tone})`, color: tone === 'gold' ? '#1a1200' : '#fff' }
    : { background: bg, color: fg }
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 12,
        fontWeight: 600,
        lineHeight: 1,
        padding: '4px 9px',
        borderRadius: 'var(--radius-pill)',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />}
      {children}
    </span>
  )
}
