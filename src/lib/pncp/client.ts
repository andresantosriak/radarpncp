/* Radar PNCP — client for the official PNCP consultation API.
 *
 * In dev, requests go to `/pncp/*`, proxied by Vite to
 * https://pncp.gov.br/api/consulta/* (the upstream sends no CORS headers, so a
 * server-side hop is required). In a static production build there is no proxy
 * — fetch fails and the radar falls back to demo data (ver README: a coleta
 * real roda server-side, ex. Edge Function / n8n). */
import type { PncpContratacao, PncpPage } from './types'

const BASE = '/pncp/v1/contratacoes/publicacao'

/** Modalidades mais relevantes para TI: 6 Pregão eletrônico, 8 Dispensa,
 * 4 Concorrência eletrônica. */
export const MODALIDADES_TI = [6, 8, 4]

function yyyymmdd(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}${m}${day}`
}

export interface FetchOptions {
  dias?: number
  modalidades?: number[]
  paginasPorModalidade?: number
  signal?: AbortSignal
}

async function fetchPage(
  mod: number,
  pagina: number,
  dataInicial: string,
  dataFinal: string,
  signal?: AbortSignal,
): Promise<PncpContratacao[]> {
  const url =
    `${BASE}?dataInicial=${dataInicial}&dataFinal=${dataFinal}` +
    `&codigoModalidadeContratacao=${mod}&pagina=${pagina}&tamanhoPagina=50`
  const res = await fetch(url, { signal, headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`PNCP HTTP ${res.status}`)
  // PNCP devolve 204 (sem corpo) para páginas além do total — não tentar parsear.
  if (res.status === 204) return []
  const text = await res.text()
  if (!text) return []
  return ((JSON.parse(text) as PncpPage).data) || []
}

/** Busca contratações publicadas na janela recente, varrendo em paralelo as
 * modalidades de TI e N páginas de cada. Tolerante a falhas parciais — só
 * rejeita se TODAS as páginas falharem. */
export async function fetchPublicacoes(opts: FetchOptions = {}): Promise<PncpContratacao[]> {
  const dias = opts.dias ?? 30
  const modalidades = opts.modalidades ?? MODALIDADES_TI
  const maxPaginas = opts.paginasPorModalidade ?? 4

  const hoje = new Date()
  const inicio = new Date(hoje.getTime() - dias * 86_400_000)
  const dataInicial = yyyymmdd(inicio)
  const dataFinal = yyyymmdd(hoje)

  const jobs: { mod: number; pagina: number }[] = []
  for (const mod of modalidades) {
    for (let pagina = 1; pagina <= maxPaginas; pagina++) jobs.push({ mod, pagina })
  }

  const settled = await Promise.allSettled(
    jobs.map(({ mod, pagina }) => fetchPage(mod, pagina, dataInicial, dataFinal, opts.signal)),
  )

  const all: PncpContratacao[] = []
  let anyOk = false
  let lastError: unknown = null
  for (const r of settled) {
    if (r.status === 'fulfilled') {
      anyOk = true
      all.push(...r.value)
    } else {
      lastError = r.reason
    }
  }

  if (!anyOk) {
    throw lastError instanceof Error ? lastError : new Error('PNCP indisponível')
  }
  return all
}
