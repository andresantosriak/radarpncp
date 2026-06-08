/* Radar PNCP — ScoreGauge. Circular aderência gauge, stroke colored by band,
 * mono numeral in the center, uppercase band caption below. */
import { scoreBand } from './score'

export interface GaugeProps {
  value?: number
  size?: number
  stroke?: number
  showLabel?: boolean
  caption?: string
}

export function Gauge({ value = 0, size = 78, stroke = 8, showLabel = true, caption }: GaugeProps) {
  const v = Math.max(0, Math.min(100, value))
  const b = scoreBand(v)
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const off = c * (1 - v / 100)
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} stroke="var(--score-track)" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          stroke={b.color}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={off}
          style={{ transition: 'stroke-dashoffset .8s var(--ease-out)' }}
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="central"
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontWeight="600"
          fontSize={Math.round(size * 0.3)}
          fill="var(--text-strong)"
          transform={`rotate(90 ${size / 2} ${size / 2})`}
        >
          {v}
        </text>
      </svg>
      {showLabel && (
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '.08em',
            textTransform: 'uppercase',
            color: b.color,
          }}
        >
          {caption || b.label}
        </span>
      )}
    </div>
  )
}
