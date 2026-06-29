// Skill rating, out of 5. A value of 6 renders 5 + one off-the-scale red star
// (the subject's "Sarkasm" easter egg, preserved from the source résumé).
export default function Stars({ value = 0 }) {
  const full = Math.min(value, 5)
  const bonus = value > 5
  return (
    <span className="inline-flex items-center gap-[2px] align-middle">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < full ? 'text-evidence' : 'text-ink/20'} style={{ fontSize: 13, lineHeight: 1 }}>
          ★
        </span>
      ))}
      {bonus && (
        <span className="ml-[2px] animate-pulse text-evidence" style={{ fontSize: 13, lineHeight: 1 }}>
          ★
        </span>
      )}
    </span>
  )
}
