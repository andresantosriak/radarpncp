/* Radar PNCP — score banding.
 * Aderência 0-100 → 4 faixas, sempre com a mesma redação:
 *   0-39 Baixa · 40-69 Possível · 70-84 Boa · 85-100 Muito forte */
export type ScoreTone = 'success' | 'brand' | 'warning' | 'danger'

export interface Band {
  color: string
  label: string
  tone: ScoreTone
}

export function scoreBand(v: number): Band {
  if (v >= 85) return { color: 'var(--score-strong)', label: 'Muito forte', tone: 'success' }
  if (v >= 70) return { color: 'var(--score-good)', label: 'Boa', tone: 'brand' }
  if (v >= 40) return { color: 'var(--score-mid)', label: 'Possível', tone: 'warning' }
  return { color: 'var(--score-low)', label: 'Baixa', tone: 'danger' }
}
