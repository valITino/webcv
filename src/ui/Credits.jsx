import { useTranslation } from 'react-i18next'
import { useStore } from '../store/useStore.js'
import Overlay from './Overlay.jsx'
import { credits } from '../data/credits.js'

export default function Credits() {
  const { t } = useTranslation()
  const overlay = useStore((s) => s.overlay)
  return (
    <Overlay open={overlay === 'credits'} align="center" maxW="max-w-lg">
      <div className="mb-5 border-b-2 border-ink/80 pb-4">
        <p className="font-type text-[10px] uppercase tracking-[0.2em] text-evidence">{t('credits.ref')}</p>
        <h2 className="mt-1 font-stencil text-2xl font-bold uppercase tracking-tight text-ink md:text-3xl">
          {t('credits.title')}
        </h2>
      </div>

      <p className="mb-5 text-[13px] leading-relaxed text-ink/75">{credits.intro}</p>

      <ul className="mb-6 space-y-2">
        {credits.assets.map((a) => (
          <li key={a.ref} className="flex gap-3 border-b border-ink/15 pb-2">
            <span className="w-24 shrink-0 font-type text-[11px] uppercase tracking-wide text-ink/45">{a.ref}</span>
            <span className="flex-1 text-[13px] text-ink/85">
              <span className="font-semibold text-ink">{a.name}</span> — {a.note}
            </span>
          </li>
        ))}
      </ul>

      <p className="font-type text-[10px] uppercase tracking-[0.2em] text-evidence">{t('credits.thanksTitle')}</p>
      <p className="mt-2 text-[12px] leading-relaxed text-ink/65">{credits.thanks}</p>
      <p className="mt-4 text-center font-type text-[11px] uppercase tracking-[0.2em] text-ink/40">{credits.build}</p>
    </Overlay>
  )
}
