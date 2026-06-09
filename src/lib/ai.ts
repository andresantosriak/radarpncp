/* Radar PNCP — cliente da análise por IA.
 * Chama a Edge Function `analisar-edital` (Supabase), que lê o PDF do edital no
 * PNCP e analisa com LLM (GPT-4o-mini) no servidor. A chave da OpenAI vive só lá;
 * o frontend usa apenas a chave anon (pública por design). */
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
  requisitosTecnicos: string[]
  prazos: string[]
  criterioJulgamento: string
  modelo: string
  fontePdf?: string
  textoChars?: number
  lidoDoPdf?: boolean
  cache?: boolean
  analisadoEm?: string
}

/** Há backend configurado para análise por IA? */
export function iaDisponivel(): boolean {
  return Boolean(FN_URL && ANON)
}

function statusFromScore(s: number): string {
  if (s >= 85) return 'forte'
  if (s >= 70) return 'boa'
  if (s >= 40) return 'possivel'
  return 'baixa'
}

/** Busca a análise salva no banco (REST anon, custo zero — não chama OpenAI). */
export async function fetchAnaliseSalva(controle: string): Promise<AnaliseIA | null> {
  if (!FN_URL || !ANON) return null
  try {
    const res = await fetch(
      `${FN_URL}/rest/v1/analises_ia?controle_pncp=eq.${encodeURIComponent(controle)}&order=created_at.desc&limit=1`,
      {
        headers: {
          apikey: ANON,
          Authorization: `Bearer ${ANON}`,
          Accept: 'application/json',
        },
      },
    )
    if (!res.ok) return null
    const rows = await res.json()
    if (!Array.isArray(rows) || rows.length === 0) return null
    const c = rows[0]
    return {
      score: c.score_ia ?? 0,
      status: statusFromScore(c.score_ia ?? 0),
      recomendacao: c.recomendacao ?? '',
      resumo: c.resumo ?? '',
      porQueCombina: Array.isArray(c.por_que_combina) ? c.por_que_combina : [],
      porQueNao: Array.isArray(c.por_que_nao) ? c.por_que_nao : [],
      documentos: Array.isArray(c.documentos) ? c.documentos : [],
      custos: Array.isArray(c.custos) ? c.custos : [],
      custoTotal: c.custo_total ?? '—',
      propostaMin: c.proposta_min ?? '—',
      propostaIdeal: c.proposta_ideal ?? '—',
      margem: c.margem ?? '—',
      risco: c.risco ?? '—',
      concorrencia: c.concorrencia ?? '—',
      burocracia: c.burocracia ?? '—',
      chance: c.chance ?? '—',
      requisitosTecnicos: Array.isArray(c.requisitos_tecnicos) ? c.requisitos_tecnicos : [],
      prazos: Array.isArray(c.prazos) ? c.prazos : [],
      criterioJulgamento: c.criterio_julgamento ?? '',
      modelo: c.modelo ?? '',
      fontePdf: c.fonte_pdf ?? undefined,
      textoChars: c.texto_chars ?? undefined,
      lidoDoPdf: (c.texto_chars ?? 0) > 200,
      cache: true,
      analisadoEm: c.created_at ?? undefined,
    }
  } catch {
    return null
  }
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
