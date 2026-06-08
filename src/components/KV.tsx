/* Radar PNCP — key/value row (label left, mono value right). Used in the
 * detail score panel and the company profile screen. */
import type { ReactNode } from 'react'

export interface KVProps {
  k: ReactNode
  v: ReactNode
  color?: string
}

export function KV({ k, v, color }: KVProps) {
  return (
    <div className="kv">
      <span className="k">{k}</span>
      <span className="v" style={color ? { color } : undefined}>
        {v}
      </span>
    </div>
  )
}
