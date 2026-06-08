/* Radar PNCP — brand mark. Concentric rings + sweep needle (teal) and a
 * gold "blip": the found opportunity. Drawn with var(--brand)/var(--accent)
 * so it follows the active theme. */
export function Mark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="21" stroke="var(--brand)" strokeWidth="2" />
      <circle cx="24" cy="24" r="13.5" stroke="var(--brand)" strokeOpacity="0.35" strokeWidth="1.5" />
      <circle cx="24" cy="24" r="6" stroke="var(--brand)" strokeOpacity="0.35" strokeWidth="1.5" />
      <line x1="24" y1="24" x2="24" y2="3" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="35" cy="14" r="3.4" fill="var(--accent)" />
      <circle cx="35" cy="14" r="6.5" fill="var(--accent)" fillOpacity="0.22" />
    </svg>
  )
}
