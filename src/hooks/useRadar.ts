/* Radar PNCP — carrega as oportunidades coletadas no Supabase (gravadas pelo
 * coletor server-side). Funciona em produção, sem o proxy de dev. Cai para os
 * dados de demonstração se o banco estiver vazio/indisponível. */
import { useQuery } from '@tanstack/react-query'
import type { Edital } from '../lib/types'
import { editais as demoEditais } from '../lib/data'
import { fetchOportunidades } from '../lib/db'

export type RadarSource = 'live' | 'demo'

export interface RadarResult {
  editais: Edital[]
  source: RadarSource
}

async function loadRadar(signal?: AbortSignal): Promise<RadarResult> {
  const editais = await fetchOportunidades(signal)
  // banco vazio (coletor ainda não rodou) → demonstração
  if (editais.length === 0) return { editais: demoEditais, source: 'demo' }
  return { editais, source: 'live' }
}

export function useRadar() {
  return useQuery<RadarResult>({
    queryKey: ['radar'],
    queryFn: ({ signal }) =>
      loadRadar(signal).catch(() => ({ editais: demoEditais, source: 'demo' as const })),
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  })
}
