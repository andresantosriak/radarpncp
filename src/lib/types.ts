/* Domain types for the Radar PNCP UI kit (recreation only). */

export type EditalStatus = 'forte' | 'boa' | 'possivel' | 'baixa'

/** Recommendation chance of winning. */
export type Chance = 'Alta' | 'Média' | 'Baixa'

export interface Custo {
  item: string
  valor: string
}

export interface Edital {
  id: string
  orgao: string
  cidade: string
  estado: string
  titulo: string
  objetoCurto: string
  modalidade: string
  publicado: string
  prazo: string
  valor: string
  valorNum: number
  score: number
  status: EditalStatus
  urgente: boolean
  recomendacao: string
  tags: string[]
  resumo: string
  porQueCombina: string[]
  porQueNao: string[]
  documentos: string[]
  custos: Custo[]
  custoTotal: string
  margem: string
  propostaMin: string
  propostaIdeal: string
  risco: string
  concorrencia: string
  burocracia: string
  chance: Chance
  /** Link para o edital no portal do PNCP (presente em oportunidades ao vivo). */
  link?: string
  /** Identificadores PNCP para análise por IA (só em oportunidades ao vivo). */
  pncp?: { cnpj: string; ano: number; sequencial: number; controle: string }
}

export interface Empresa {
  nome: string
  cnpj: string
  area: string
}

export interface RadarData {
  empresa: Empresa
  editais: Edital[]
}

/** Top-level app routes (sidebar destinations). */
export type Route =
  | 'radar'
  | 'urgentes'
  | 'descartados'
  | 'palavras'
  | 'alertas'
  | 'empresa'

/** Configuration sub-screens. */
export type ConfigKey = 'palavras' | 'alertas' | 'empresa'

/** Dashboard filter tabs. */
export type FilterId = 'todos' | 'urgentes' | 'ia' | 'alto'
