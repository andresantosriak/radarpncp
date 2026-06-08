/* Radar PNCP — leitura das oportunidades coletadas no Supabase.
 * O coletor server-side (Edge Function `coletar-pncp`, agendado) varre o PNCP e
 * grava em `oportunidades`. O frontend lê daqui (REST + chave anon, RLS select
 * público) — funciona em produção, sem o proxy de dev, com dados completos. */
import type { Edital, EditalStatus } from './types'
import { buildAnalysis } from './analysis'
import { statusFromScore } from './scoring'
import { CORE_TERMS } from './keywords'
import { normalize } from './text'
import { formatBRL, formatDateISO } from './format'

const URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export function dbDisponivel(): boolean {
  return Boolean(URL && ANON)
}

interface Row {
  controle_pncp: string
  cnpj: string | null
  ano: number | null
  sequencial: number | null
  orgao: string | null
  cidade: string | null
  estado: string | null
  titulo: string | null
  objeto: string | null
  objeto_curto: string | null
  modalidade: string | null
  valor_estimado: number | null
  data_publicacao: string | null
  data_encerramento: string | null
  link: string | null
  status: string | null
  score_heuristico: number | null
  score_semantico: number | null
  tags: string[] | null
  urgente: boolean | null
}

function rowToEdital(r: Row): Edital {
  const valorNum = Math.max(0, Math.round(r.valor_estimado || 0))
  const tags = Array.isArray(r.tags) ? r.tags : []
  const hasCore = tags.some((t) => CORE_TERMS.has(normalize(t).trim()))
  const score = r.score_heuristico ?? r.score_semantico ?? 0
  const status = (r.status as EditalStatus) || statusFromScore(score)
  const orgao = r.orgao || 'Órgão público'
  const cidade = r.cidade || '—'
  const estado = r.estado || ''
  const objeto = r.objeto || r.titulo || ''
  const modalidade = r.modalidade || 'Dispensa'

  const analysis = buildAnalysis({
    objeto,
    orgao,
    cidade,
    estado,
    modalidade,
    valorNum,
    valor: formatBRL(valorNum),
    score,
    status,
    tags,
    hasCore,
  })

  return {
    id: 'db-' + (r.controle_pncp || '').replace(/[^a-z0-9]/gi, ''),
    orgao,
    cidade,
    estado,
    titulo: (r.titulo || objeto).trim(),
    objetoCurto: r.objeto_curto || objeto.slice(0, 60),
    modalidade,
    publicado: formatDateISO(r.data_publicacao),
    prazo: r.data_encerramento ? formatDateISO(r.data_encerramento) : '—',
    valor: formatBRL(valorNum),
    valorNum,
    score,
    status,
    urgente: Boolean(r.urgente),
    tags,
    link: r.link || undefined,
    pncp:
      r.cnpj && r.ano && r.sequencial
        ? { cnpj: r.cnpj, ano: r.ano, sequencial: r.sequencial, controle: r.controle_pncp }
        : undefined,
    ...analysis,
  }
}

export async function fetchOportunidades(signal?: AbortSignal): Promise<Edital[]> {
  if (!URL || !ANON) throw new Error('Supabase não configurado')
  const res = await fetch(
    `${URL}/rest/v1/oportunidades?select=*&order=score_heuristico.desc.nullslast&limit=300`,
    { headers: { apikey: ANON, Authorization: `Bearer ${ANON}` }, signal },
  )
  if (!res.ok) throw new Error(`DB HTTP ${res.status}`)
  const rows = (await res.json()) as Row[]
  return rows.map(rowToEdital)
}
