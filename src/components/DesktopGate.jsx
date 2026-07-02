import { useTranslation } from 'react-i18next'

// Shown on touch / narrow devices. The simulation needs a real workstation.
export default function DesktopGate() {
  const { t } = useTranslation()
  return (
    <div className="fixed inset-0 grain flex items-center justify-center bg-ink px-6 text-center">
      <div className="vignette absolute inset-0 pointer-events-none" />
      <div className="relative max-w-md">
        <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full border-2 border-redink/70">
          <span className="font-stencil text-2xl text-redink">!</span>
        </div>
        <p className="hud-chip mb-3 text-redink/80">{t('gate.chip')}</p>
        <h1 className="font-stencil text-2xl leading-tight tracking-[0.12em] text-paper">
          {t('gate.title')}
        </h1>
        <p className="mt-5 font-ui text-sm leading-relaxed text-paper/70">{t('gate.body')}</p>
        <p className="mt-6 font-hud text-xs tracking-widest text-paper/55">{t('gate.hint')}</p>
      </div>
    </div>
  )
}
