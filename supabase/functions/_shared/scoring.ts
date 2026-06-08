// Radar PNCP — scoring de aderência (porta Deno do src/lib de frontend).
// Usado pelo coletor server-side. Mesma lógica calibrada do app.

export interface WeightedTerm {
  term: string
  weight: number
}

export const DEFAULT_KEYWORDS = [
  'inteligência artificial', 'chatbot', 'assistente virtual', 'atendimento digital',
  'atendimento automatizado', 'automação', 'software', 'licenciamento de software',
  'desenvolvimento de sistema', 'sistema de informação', 'sistema', 'integração de sistemas',
  'integração', 'aplicativo', 'plataforma', 'dashboard', 'business intelligence', 'SaaS',
  'transformação digital', 'workflow', 'tecnologia da informação', 'informática',
  'gestão eletrônica', 'prontuário eletrônico', 'portal do cidadão', 'central de atendimento',
]

export const SCORING_TERMS: WeightedTerm[] = [
  { term: 'chatbot', weight: 4 }, { term: 'inteligencia artificial', weight: 4 },
  { term: 'assistente virtual', weight: 4 }, { term: 'agente virtual', weight: 4 },
  { term: 'atendimento digital', weight: 3.5 }, { term: 'atendimento automatizado', weight: 3.5 },
  { term: 'automacao', weight: 3 }, { term: 'atendimento ao cidadao', weight: 3 },
  { term: 'software', weight: 3 }, { term: 'desenvolvimento de sistema', weight: 3 },
  { term: 'desenvolvimento de software', weight: 3 }, { term: 'integracao de sistemas', weight: 3 },
  { term: 'licenciamento de software', weight: 3 }, { term: 'central de atendimento', weight: 3 },
  { term: 'portal do cidadao', weight: 3 }, { term: 'aplicativo', weight: 2.5 },
  { term: 'plataforma digital', weight: 2.5 }, { term: 'business intelligence', weight: 2.5 },
  { term: 'transformacao digital', weight: 2.5 }, { term: 'tecnologia da informacao', weight: 2.5 },
  { term: 'saas', weight: 2.5 }, { term: 'prontuario eletronico', weight: 2.5 },
  { term: 'sistema de informacao', weight: 2.5 }, { term: 'gestao eletronica', weight: 2.2 },
  { term: 'dashboard', weight: 2 }, { term: 'plataforma', weight: 2 }, { term: 'workflow', weight: 2 },
  { term: 'sistema', weight: 2 }, { term: 'integracao', weight: 1.8 }, { term: 'portal', weight: 1.5 },
  { term: 'informatica', weight: 1.5 },
]

export const CORE_TERMS = new Set<string>([
  'chatbot', 'inteligencia artificial', 'assistente virtual', 'agente virtual', 'atendimento digital',
  'atendimento automatizado', 'automacao', 'software', 'desenvolvimento de sistema',
  'desenvolvimento de software', 'integracao de sistemas',
])

const TERM_LABEL: Record<string, string> = {
  'inteligencia artificial': 'inteligência artificial', automacao: 'automação',
  'atendimento ao cidadao': 'atendimento ao cidadão', 'integracao de sistemas': 'integração de sistemas',
  'portal do cidadao': 'portal do cidadão', 'transformacao digital': 'transformação digital',
  'tecnologia da informacao': 'tecnologia da informação', saas: 'SaaS',
  'prontuario eletronico': 'prontuário eletrônico', 'sistema de informacao': 'sistema de informação',
  'gestao eletronica': 'gestão eletrônica', integracao: 'integração', informatica: 'informática',
}
export const termLabel = (t: string) => TERM_LABEL[t] ?? t

export function normalize(s: string): string {
  return ' ' + (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ').trim() + ' '
}
const containsTerm = (h: string, t: string) => h.includes(' ' + t + ' ')
function hashCode(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}
const semPrefixoPlataforma = (o: string) => o.replace(/^\s*\[[^\]]*\]\s*-?\s*/, '')

export type EditalStatus = 'forte' | 'boa' | 'possivel' | 'baixa'
export function statusFromScore(score: number): EditalStatus {
  if (score >= 85) return 'forte'
  if (score >= 70) return 'boa'
  if (score >= 40) return 'possivel'
  return 'baixa'
}

export interface Aderencia {
  score: number
  status: EditalStatus
  tags: string[]
  hasCore: boolean
}

export function computeAderencia(objeto: string, id: string): Aderencia | null {
  const t = normalize(semPrefixoPlataforma(objeto))
  const raw = SCORING_TERMS.filter((st) => containsTerm(t, st.term))
  const hits = raw.filter((a) => !raw.some((b) => b !== a && ` ${b.term} `.includes(` ${a.term} `)))
  let weight = 0
  let maxWeight = 0
  for (const h of hits) {
    weight += h.weight
    if (h.weight > maxWeight) maxWeight = h.weight
  }
  if (maxWeight < 2.5 && weight < 3.5) return null
  hits.sort((a, b) => b.weight - a.weight)
  const tags = hits.map((h) => h.term)
  const hasCore = tags.some((x) => CORE_TERMS.has(x))
  let score = Math.round(40 + weight * 7.5 + ((hashCode(id) % 7) - 3))
  if (!hasCore) score = Math.min(score, 82)
  score = Math.max(8, Math.min(97, score))
  return { score, status: statusFromScore(score), tags, hasCore }
}

export function matchesKeywords(objeto: string, keywords: string[]): boolean {
  const t = normalize(semPrefixoPlataforma(objeto))
  return keywords.some((k) => {
    const nk = normalize(k).trim()
    return nk.length > 0 && t.includes(' ' + nk + ' ')
  })
}
