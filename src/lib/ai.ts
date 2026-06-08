/* Radar PNCP — cliente da análise por IA.
 * Chama a Edge Function `analisar-edital` (Supabase), que lê o PDF do edital no
 * PNCP e analisa com LLM (GPT-4o) no servidor. A chave da OpenAI vive só lá; o
 * frontend usa apenas a chave anon (pública por design). */
import type { Custo, Edital } from './types'

const FN_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export interface AnaliseIA {
  score: number
  status: string
  recomendacao: string
  resumo: string
  porQueCombina: string[]
  porQueNao: string[]
  documentos: string[]
  custos: Custo[]
  custoTotal: string
  propostaMin: string
  propostaIdeal: string
  margem: string
  risco: string
  concorrencia: string
  burocracia: string
  chance: string
  modelo: string
  fontePdf?: string
  textoChars?: number
  lidoDoPdf?: boolean
  cache?: boolean
}

/** Há backend configurado para análise por IA? */
export function iaDisponivel(): boolean {
  return Boolean(FN_URL && ANON)
}

export async function analisarEditalIA(op: Edital, force = false): Promise<AnaliseIA> {
  if (!op.pncp) throw new Error('Análise por IA disponível só nas oportunidades ao vivo do PNCP.')
  if (!FN_URL || !ANON) throw new Error('Backend não configurado (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).')

  const res = await fetch(`${FN_URL}/functions/v1/analisar-edital`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ANON}`,
      apikey: ANON,
    },
    body: JSON.stringify({
      cnpj: op.pncp.cnpj,
      ano: op.pncp.ano,
      sequencial: op.pncp.sequencial,
      controle: op.pncp.controle,
      orgao: op.orgao,
      cidade: op.cidade,
      estado: op.estado,
      modalidade: op.modalidade,
      valorEstimado: op.valorNum,
      objeto: op.titulo,
      titulo: op.titulo,
      link: op.link,
      scoreHeuristico: op.score,
      force,
    }),
  })

  const data = await res.json().catch(() => ({ error: `Resposta inválida (HTTP ${res.status})` }))
  if (!res.ok || data.error) throw new Error(data.error || `Falha na análise (HTTP ${res.status})`)
  return data as AnaliseIA
}
