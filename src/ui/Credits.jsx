import { useTranslation } from 'react-i18next'
import { useStore } from '../store/useStore.js'
import Overlay from './Overlay.jsx'
import { credits } from '../data/credits.js'

export default function Credits() {
  const { t } = useTranslation()
  const overlay = useStore((s) => s.overlay)
  return (
    <Overlay open={overlay === 'credits'} align="center" maxW="max-w-lg">
      <div className="mb-5 border-b border-redink/30 pb-4 pr-20">
        <p className="font-hud text-[10px] uppercase tracking-[0.22em] text-redink">{t('credits.ref')}</p>
        <h2 className="mt-1 font-headline text-2xl tracking-tight text-paper md:text-3xl">{t('credits.title')}</h2>
      </div>

      <p className="mb-5 text-[13px] leading-relaxed text-paper/70">{credits.intro}</p>

      <ul className="mb-6 space-y-2">
        {credits.assets.map((a) => (
          <li key={a.ref} className="flex gap-3 border-b border-paper/10 pb-2">
            <span className="w-24 shrink-0 font-hud text-[11px] uppercase tracking-wide text-paper/40">{a.ref}</span>
            <span className="flex-1 text-[13px] text-paper/85">
              <span className="font-semibold text-paper">{a.name}</span> — {a.note}
            </span>
          </li>
        ))}
      </ul>

      <p className="font-hud text-[10px] uppercase tracking-[0.22em] text-redink">{t('credits.thanksTitle')}</p>
      <p className="mt-2 text-[12px] leading-relaxed text-paper/65">{credits.thanks}</p>
      <p className="mt-4 text-center font-hud text-[11px] uppercase tracking-[0.2em] text-paper/40">{credits.build}</p>
    </Overlay>
  )
}
