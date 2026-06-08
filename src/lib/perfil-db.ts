/* Radar PNCP — CRUD perfil empresa na tabela `empresa_perfil` (Supabase).
 * Fonte de verdade: banco (singleton). Fallback: `empresa` de data.ts.
 * Usa REST PostgREST direto (mesmo padrão de keywords-db.ts). */

const URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

const SINGLETON_ID = '00000000-0000-0000-0000-000000000001'

const headers = () => ({
  apikey: ANON!,
  Authorization: `Bearer ${ANON!}`,
  'Content-Type': 'application/json',
})

export interface PerfilRow {
  razao_social: string
  cnpj: string
  area: string
  portfolio_texto: string
}

/** Busca o perfil singleton da empresa. Retorna null se falhar ou não existir. */
export async function fetchPerfil(signal?: AbortSignal): Promise<PerfilRow | null> {
  if (!URL || !ANON) return null
  try {
    const res = await fetch(
      `${URL}/rest/v1/empresa_perfil?id=eq.${SINGLETON_ID}&select=razao_social,cnpj,area,portfolio_texto&limit=1`,
      { headers: headers(), signal },
    )
    if (!res.ok) return null
    const rows = (await res.json()) as PerfilRow[]
    return rows.length > 0 ? rows[0] : null
  } catch {
    return null
  }
}

/** Atualiza campos do perfil singleton. Patch parcial. */
export async function updatePerfil(patch: Partial<PerfilRow>): Promise<void> {
  if (!URL || !ANON) throw new Error('Supabase não configurado')
  const res = await fetch(
    `${URL}/rest/v1/empresa_perfil?id=eq.${SINGLETON_ID}`,
    {
      method: 'PATCH',
      headers: { ...headers(), Prefer: 'return=minimal' },
      body: JSON.stringify(patch),
    },
  )
  if (!res.ok) throw new Error(`updatePerfil HTTP ${res.status}`)
}
