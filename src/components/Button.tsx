/* Radar PNCP — Button. Primary (brand), secondary (outline), ghost. Press
 * applies a subtle scale(0.98). Verbs imperativos: Participar, Analisar… */
import type { CSSProperties, MouseEvent, ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  iconLeft?: ReactNode
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  children?: ReactNode
  style?: CSSProperties
}

export function Button({ variant = 'primary', size = 'md', iconLeft, onClick, children, style }: ButtonProps) {
  const base: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: size === 'sm' ? 32 : size === 'lg' ? 48 : 40,
    padding: size === 'sm' ? '0 12px' : '0 18px',
    fontFamily: 'var(--font-sans)',
    fontSize: size === 'sm' ? 13 : 15,
    fontWeight: 600,
    borderRadius: 'var(--radius-md)',
    border: '1px solid transparent',
    cursor: 'pointer',
    letterSpacing: '-0.01em',
    whiteSpace: 'nowrap',
    transition: 'all var(--dur-fast) var(--ease-out)',
  }
  const v: CSSProperties = {
    primary: { background: 'var(--brand)', color: 'var(--brand-contrast)' },
    secondary: { background: 'var(--surface)', color: 'var(--text-strong)', borderColor: 'var(--border-strong)' },
    ghost: { background: 'transparent', color: 'var(--text-body)' },
  }[variant]
  return (
    <button
      onClick={onClick}
      style={{ ...base, ...v, ...style }}
      onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
      onMouseUp={(e) => (e.currentTarget.style.transform = '')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = '')}
    >
      {iconLeft}
      {children}
    </button>
  )
}
