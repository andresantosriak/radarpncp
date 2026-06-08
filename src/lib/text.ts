/* Radar PNCP — text helpers for keyword matching over edital objects.
 * Matching is accent-insensitive and token-aware (avoids substring false
 * positives like "ia" inside "jurisprudência"/"polícia"). */

/** Lowercase, strip accents, reduce non-alphanumerics to single spaces, and
 * pad with surrounding spaces so callers can test for ` term ` membership. */
export function normalize(s: string): string {
  return (
    ' ' +
    (s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim() +
    ' '
  )
}

/** Whole-token containment: `term` (already normalized, unpadded) appears as a
 * standalone token (or phrase) in `normalizedHaystack`. */
export function containsTerm(normalizedHaystack: string, term: string): boolean {
  return normalizedHaystack.includes(' ' + term + ' ')
}

/** Small deterministic hash — used to add stable jitter to computed scores so
 * identical-object editais don't all collapse to the same number. */
export function hashCode(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

/** Title-case an ALL-CAPS órgão name from the PNCP (small connectives stay
 * lowercase). Accents can't be restored, but readability improves. */
export function titleCase(s: string): string {
  const small = new Set(['de', 'da', 'do', 'das', 'dos', 'e', 'em', 'a', 'o'])
  return (s || '')
    .toLowerCase()
    .split(/\s+/)
    .map((w, i) => (i > 0 && small.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ')
    .trim()
}
