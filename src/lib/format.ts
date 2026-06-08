/* Radar PNCP — value/date/link formatting (literal, mono-friendly). */

/** "R$ 62.000" (sem centavos, separador de milhar pt-BR). 0/desconhecido → "—". */
export function formatBRL(value: number): string {
  if (!value || value <= 0) return '—'
  return 'R$ ' + Math.round(value).toLocaleString('pt-BR')
}

/** Mesmo formato sem o prefixo "R$" (para faixas: "R$ 48.000 – 54.000"). */
export function formatMilhar(value: number): string {
  if (!value || value <= 0) return '—'
  return Math.round(value).toLocaleString('pt-BR')
}

/** Parse robusto: datas só-data ("2026-06-01") viram meia-noite LOCAL, evitando
 * o shift de um dia que `new Date("2026-06-01")` causa (UTC → BRT). */
export function parseDate(iso: string): Date {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : new Date(iso)
}

/** ISO → "dd/mm/aaaa". Nulo/inválido → "—". */
export function formatDateISO(iso: string | null | undefined): string {
  if (!iso) return '—'
  const d = parseDate(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('pt-BR')
}

/** numeroControlePNCP ("CNPJ-1-SEQ/ANO") → URL do edital no portal. */
export function pncpEditalLink(numeroControlePNCP: string): string {
  const m = /^(\d+)-\d+-(\d+)\/(\d+)$/.exec(numeroControlePNCP || '')
  if (!m) return 'https://pncp.gov.br/app/editais'
  const [, cnpj, seq, ano] = m
  return `https://pncp.gov.br/app/editais/${cnpj}/${ano}/${parseInt(seq, 10)}`
}
