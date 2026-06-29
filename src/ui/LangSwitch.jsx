import { useTranslation } from 'react-i18next'
import { SUPPORTED } from '../i18n/index.js'

// Manual language override (auto-detection runs first; this persists a choice).
export default function LangSwitch({ dark = false }) {
  const { i18n } = useTranslation()
  const current = (i18n.resolvedLanguage || i18n.language || 'en').slice(0, 2)
  const base = dark ? 'text-paper/55' : 'text-ink/50'
  const active = dark ? 'text-lamp' : 'text-evidence'

  return (
    <div className={`flex items-center gap-2 font-type text-[11px] uppercase tracking-[0.18em] ${base}`}>
      {SUPPORTED.map((lng, i) => (
        <span key={lng} className="flex items-center gap-2">
          {i > 0 && <span className="opacity-40">/</span>}
          <button
            onClick={() => i18n.changeLanguage(lng)}
            className={`transition-colors hover:opacity-100 ${current === lng ? `${active} font-bold` : 'hover:text-current'}`}
            aria-label={`Switch language to ${lng}`}
          >
            {lng}
          </button>
        </span>
      ))}
    </div>
  )
}
