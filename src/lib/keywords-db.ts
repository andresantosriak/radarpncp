/* Radar PNCP — CRUD keywords na tabela `keywords` (Supabase).
 * Fonte de verdade: banco. DEFAULT_KEYWORDS (keywords.ts) é só fallback.
 * Usa REST PostgREST direto (mesmo padrão de db.ts — sem @supabase/supabase-js). */

const URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

const headers = () => ({
  apikey: ANON!,
  Authorization: `Bearer ${ANON!}`,
  'Content-Type': 'application/json',
})

/** Busca todos os termos ativos, ordenados alfabeticamente. */
export async function fetchKeywords(signal?: AbortSignal): Promise<string[]> {
  if (!URL || !ANON) throw new Error('Supabase não configurado')
  const res = await fetch(
    `${URL}/rest/v1/keywords?select=termo&ativo=eq.true&order=termo.asc`,
    { headers: headers(), signal },
  )
  if (!res.ok) throw new Error(`keywords HTTP ${res.status}`)
  const rows = (await res.json()) as { termo: string }[]
  return rows.map((r) => r.termo)
}

/** Insere um novo termo (trim). Ignora duplicados (unique constraint — 409). */
export async function addKeyword(termo: string): Promise<void> {
  if (!URL || !ANON) throw new Error('Supabase não configurado')
  const t = termo.trim()
  if (!t) return
  const res = await fetch(`${URL}/rest/v1/keywords`, {
    method: 'POST',
    headers: { ...headers(), Prefer: 'return=minimal' },
    body: JSON.stringify({ termo: t }),
  })
  // 409 = duplicate — gracioso, nao e erro
  if (!res.ok && res.status !== 409) throw new Error(`addKeyword HTTP ${res.status}`)
}

/** Remove um termo pelo texto exato. */
export async function removeKeyword(termo: string): Promise<void> {
  if (!URL || !ANON) throw new Error('Supabase não configurado')
  const res = await fetch(
    `${URL}/rest/v1/keywords?termo=eq.${encodeURIComponent(termo)}`,
    { method: 'DELETE', headers: headers() },
  )
  if (!res.ok) throw new Error(`removeKeyword HTTP ${res.status}`)
}
