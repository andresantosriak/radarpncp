/* Radar PNCP — hook react-query para perfil da empresa (singleton).
 * Fonte de verdade: tabela `empresa_perfil`. Fallback: `empresa` de data.ts. */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchPerfil, updatePerfil, type PerfilRow } from '../lib/perfil-db'
import { empresa } from '../lib/data'

/** Perfil retornado pelo hook — sempre tem valores (fallback se banco offline). */
export interface EmpresaPerfil {
  razaoSocial: string
  cnpj: string
  area: string
  portfolioTexto: string
}

const FALLBACK: EmpresaPerfil = {
  razaoSocial: empresa.nome,
  cnpj: empresa.cnpj,
  area: empresa.area,
  portfolioTexto: '',
}

function rowToPerfil(row: PerfilRow): EmpresaPerfil {
  return {
    razaoSocial: row.razao_social,
    cnpj: row.cnpj,
    area: row.area,
    portfolioTexto: row.portfolio_texto,
  }
}

export function useEmpresaPerfil() {
  const qc = useQueryClient()

  const query = useQuery<EmpresaPerfil>({
    queryKey: ['empresa-perfil'],
    queryFn: async ({ signal }) => {
      const row = await fetchPerfil(signal)
      return row ? rowToPerfil(row) : FALLBACK
    },
    staleTime: 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  })

  const update = useMutation({
    mutationFn: (patch: Partial<PerfilRow>) => updatePerfil(patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['empresa-perfil'] }),
    onError: (err) => {
      console.error('updatePerfil failed:', err)
      qc.invalidateQueries({ queryKey: ['empresa-perfil'] })
    },
  })

  // banco respondeu → usar; senão fallback
  const perfil = query.data ?? FALLBACK

  return { perfil, isLoading: query.isLoading, update }
}
