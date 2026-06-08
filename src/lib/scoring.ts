/* Radar PNCP — aderência scoring.
 * Computa o "match estratégico" descrito no briefing: cruza o objeto do edital
 * com o portfólio da AI Solution e devolve um score 0-100 (4 faixas). É uma
 * heurística determinística e auditável — não um LLM (essa é a camada plugável
 * futura, ver README). Calibrada sobre editais reais do PNCP. */
import type { EditalStatus } from './types'
import { normalize, containsTerm, hashCode } from './text'
import { SCORING_TERMS, CORE_TERMS, type WeightedTerm } from './keywords'

export function statusFromScore(score: number): EditalStatus {
  if (score >= 85) return 'forte'
  if (score >= 70) return 'boa'
  if (score >= 40) return 'possivel'
  return 'baixa'
}

export interface Aderencia {
  score: number
  status: EditalStatus
  /** termos normalizados que casaram, do mais forte ao mais fraco */
  tags: string[]
  hasCore: boolean
}

/** Avalia um objeto de contratação. Retorna null quando não há match relevante
 * com o portfólio (peso total < 2) — ou seja, não é uma oportunidade. */
/** Remove prefixo de plataforma ("[Portal de Compras Públicas] - ", "[LICITANET] - ")
 * para não casar termos no nome do sistema de compras, só no objeto real. */
function semPrefixoPlataforma(objeto: string): string {
  return objeto.replace(/^\s*\[[^\]]*\]\s*-?\s*/, '')
}

export function computeAderencia(objeto: string, id: string): Aderencia | null {
  const t = normalize(semPrefixoPlataforma(objeto))
  const raw: WeightedTerm[] = []
  for (const st of SCORING_TERMS) {
    if (containsTerm(t, st.term)) raw.push(st)
  }
  // Mantém só frases maximais: descarta termos que são sub-token de outro match
  // (ex.: 'sistema' dentro de 'desenvolvimento de sistema') para não contar 2x.
  const hits = raw.filter((a) => !raw.some((b) => b !== a && ` ${b.term} `.includes(` ${a.term} `)))
  let weight = 0
  let maxWeight = 0
  for (const h of hits) {
    weight += h.weight
    if (h.weight > maxWeight) maxWeight = h.weight
  }
  // É oportunidade se houver um sinal forte (≥2.5, ex. "software") OU dois sinais
  // médios somando ≥3.5. Um termo genérico isolado ('sistema'/'plataforma' = 2)
  // não basta — corta falsos positivos ("Sistema Único de Saúde", "plataforma" física).
  if (maxWeight < 2.5 && weight < 3.5) return null
  hits.sort((a, b) => b.weight - a.weight)
  const tags = hits.map((h) => h.term)
  const hasCore = tags.some((x) => CORE_TERMS.has(x))
  let score = Math.round(40 + weight * 7.5 + ((hashCode(id) % 7) - 3))
  if (!hasCore) score = Math.min(score, 82) // sem sinal forte, teto em "boa"
  score = Math.max(8, Math.min(97, score))
  return { score, status: statusFromScore(score), tags, hasCore }
}

/** Filtro grosso: o objeto casa com alguma das palavras-chave monitoradas? */
export function matchesKeywords(objeto: string, keywords: string[]): boolean {
  const t = normalize(semPrefixoPlataforma(objeto))
  return keywords.some((k) => {
    const nk = normalize(k).trim()
    return nk.length > 0 && t.includes(' ' + nk + ' ')
  })
}
