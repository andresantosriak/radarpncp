/* Radar PNCP — state persisted to localStorage (palavras-chave, alertas,
 * editais descartados). SSR/availability safe. */
import { useCallback, useEffect, useState } from 'react'

export function useLocalState<T>(key: string, initial: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state))
    } catch {
      /* indisponível (modo privado / quota) — estado segue só em memória */
    }
  }, [key, state])

  const set = useCallback((value: T | ((prev: T) => T)) => setState(value), [])
  return [state, set]
}
