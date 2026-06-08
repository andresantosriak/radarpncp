/* Radar PNCP — hook react-query para keywords do banco.
 * Fonte de verdade: tabela `keywords`. Fallback: DEFAULT_KEYWORDS. */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchKeywords, addKeyword, removeKeyword } from '../lib/keywords-db'
import { DEFAULT_KEYWORDS } from '../lib/keywords'

export function useKeywords() {
  const qc = useQueryClient()

  const query = useQuery<string[]>({
    queryKey: ['keywords'],
    queryFn: ({ signal }) => fetchKeywords(signal),
    staleTime: 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  })

  const add = useMutation({
    mutationFn: addKeyword,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['keywords'] }),
    onError: (err) => {
      console.error('addKeyword failed:', err)
      qc.invalidateQueries({ queryKey: ['keywords'] })
    },
  })

  const remove = useMutation({
    mutationFn: removeKeyword,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['keywords'] }),
    onError: (err) => {
      console.error('removeKeyword failed:', err)
      qc.invalidateQueries({ queryKey: ['keywords'] })
    },
  })

  // banco respondeu → usar; senao fallback
  const keywords = query.data ?? DEFAULT_KEYWORDS

  return { keywords, isLoading: query.isLoading, add, remove }
}
