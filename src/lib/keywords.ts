/* Radar PNCP — the AI Solution portfolio profile.
 *
 * DEFAULT_KEYWORDS: human-readable terms the radar monitors (editable in the
 * Palavras-chave screen). Used as the coarse filter over PNCP objects.
 *
 * SCORING_TERMS: weighted, pre-normalized terms used to compute aderência.
 * CORE_TERMS: the strong-signal terms that justify a high (forte) score. */

// Vocabulário monitorado. Inclui o nicho-alvo (chatbot, IA…) MAS também os
// termos como editais públicos realmente são escritos (sistema, licença de
// software, informática…) — senão o radar quase não acha nada, porque órgãos
// não usam os jargões literais. Editável na tela de Palavras-chave.
export const DEFAULT_KEYWORDS = [
  'inteligência artificial',
  'chatbot',
  'assistente virtual',
  'atendimento digital',
  'atendimento automatizado',
  'automação',
  'software',
  'licenciamento de software',
  'desenvolvimento de sistema',
  'sistema de informação',
  'sistema',
  'integração de sistemas',
  'integração',
  'aplicativo',
  'plataforma',
  'dashboard',
  'business intelligence',
  'SaaS',
  'transformação digital',
  'workflow',
  'tecnologia da informação',
  'informática',
  'gestão eletrônica',
  'prontuário eletrônico',
  'portal do cidadão',
  'central de atendimento',
]

export interface WeightedTerm {
  /** já normalizado (sem acento, minúsculo) */
  term: string
  weight: number
}

export const SCORING_TERMS: WeightedTerm[] = [
  { term: 'chatbot', weight: 4 },
  { term: 'inteligencia artificial', weight: 4 },
  { term: 'assistente virtual', weight: 4 },
  { term: 'agente virtual', weight: 4 },
  { term: 'atendimento digital', weight: 3.5 },
  { term: 'atendimento automatizado', weight: 3.5 },
  { term: 'automacao', weight: 3 },
  { term: 'atendimento ao cidadao', weight: 3 },
  { term: 'software', weight: 3 },
  { term: 'desenvolvimento de sistema', weight: 3 },
  { term: 'desenvolvimento de software', weight: 3 },
  { term: 'integracao de sistemas', weight: 3 },
  { term: 'licenciamento de software', weight: 3 },
  { term: 'central de atendimento', weight: 3 },
  { term: 'portal do cidadao', weight: 3 },
  { term: 'aplicativo', weight: 2.5 },
  { term: 'plataforma digital', weight: 2.5 },
  { term: 'business intelligence', weight: 2.5 },
  { term: 'transformacao digital', weight: 2.5 },
  { term: 'tecnologia da informacao', weight: 2.5 },
  { term: 'saas', weight: 2.5 },
  { term: 'prontuario eletronico', weight: 2.5 },
  { term: 'sistema de informacao', weight: 2.5 },
  { term: 'gestao eletronica', weight: 2.2 },
  { term: 'dashboard', weight: 2 },
  { term: 'plataforma', weight: 2 },
  { term: 'workflow', weight: 2 },
  { term: 'sistema', weight: 2 },
  { term: 'integracao', weight: 1.8 },
  { term: 'portal', weight: 1.5 },
  { term: 'informatica', weight: 1.5 },
]

export const CORE_TERMS = new Set<string>([
  'chatbot',
  'inteligencia artificial',
  'assistente virtual',
  'agente virtual',
  'atendimento digital',
  'atendimento automatizado',
  'automacao',
  'software',
  'desenvolvimento de sistema',
  'desenvolvimento de software',
  'integracao de sistemas',
])

/** display label (com acento) para um termo normalizado de scoring */
export const TERM_LABEL: Record<string, string> = {
  chatbot: 'chatbot',
  'inteligencia artificial': 'inteligência artificial',
  'assistente virtual': 'assistente virtual',
  'agente virtual': 'agente virtual',
  'atendimento digital': 'atendimento digital',
  'atendimento automatizado': 'atendimento automatizado',
  automacao: 'automação',
  'atendimento ao cidadao': 'atendimento ao cidadão',
  software: 'software',
  'desenvolvimento de sistema': 'desenvolvimento de sistema',
  'desenvolvimento de software': 'desenvolvimento de software',
  'integracao de sistemas': 'integração de sistemas',
  'licenciamento de software': 'licenciamento de software',
  'central de atendimento': 'central de atendimento',
  'portal do cidadao': 'portal do cidadão',
  aplicativo: 'aplicativo',
  'plataforma digital': 'plataforma digital',
  'business intelligence': 'business intelligence',
  'transformacao digital': 'transformação digital',
  'tecnologia da informacao': 'tecnologia da informação',
  saas: 'SaaS',
  'prontuario eletronico': 'prontuário eletrônico',
  'sistema de informacao': 'sistema de informação',
  'gestao eletronica': 'gestão eletrônica',
  dashboard: 'dashboard',
  plataforma: 'plataforma',
  workflow: 'workflow',
  sistema: 'sistema',
  integracao: 'integração',
  portal: 'portal',
  informatica: 'informática',
}

export function termLabel(term: string): string {
  return TERM_LABEL[term] || term
}
