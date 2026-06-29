import { useTranslation } from 'react-i18next'
import { useStore } from '../store/useStore.js'
import { profile } from '../data/profile.js'
import LangSwitch from './LangSwitch.jsx'

function Dot() {
  return <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-[#42f59b]" />
}

export default function Hud() {
  const { t } = useTranslation()
  const overlay = useStore((s) => s.overlay)
  const focus = useStore((s) => s.focus)
  const close = useStore((s) => s.closeOverlay)
  const openContact = useStore((s) => s.openContact)
  const openCredits = useStore((s) => s.openCredits)
  const quality = useStore((s) => s.quality)
  const toggleQuality = useStore((s) => s.toggleQuality)

  return (
    <div className="pointer-events-none fixed inset-0 z-20 select-none font-ui">
      {/* corner ticks */}
      <Corner className="left-3 top-3" d="tl" />
      <Corner className="right-3 top-3" d="tr" />
      <Corner className="bottom-3 left-3" d="bl" />
      <Corner className="bottom-3 right-3" d="br" />

      {/* top-left: system status */}
      <div className="absolute left-6 top-6 space-y-1">
        <p className="hud-chip text-[#42f59b]/90">
          <Dot />
          {t('hud.status')}
        </p>
        <p className="hud-chip">{t('hud.secure')}</p>
        <p className="hud-chip">
          {t('hud.coord')} // {profile.coords}
        </p>
      </div>

      {/* top-right: controls */}
      <div className="pointer-events-auto absolute right-6 top-6 flex flex-col items-end gap-2">
        <LangSwitch dark />
        <button
          onClick={toggleQuality}
          className="hud-chip transition-colors hover:text-lamp"
          title="Toggle visual quality"
        >
          {t('hud.quality')}: {quality === 'high' ? t('quality.high') : t('quality.performance')}
        </button>
        <div className="flex gap-3">
          <button onClick={openContact} className="hud-chip transition-colors hover:text-lamp">
            {t('hud.contact')}
          </button>
          <button onClick={openCredits} className="hud-chip transition-colors hover:text-lamp">
            {t('hud.credits')}
          </button>
        </div>
      </div>

      {/* bottom-left: subject dossier */}
      <div className="absolute bottom-6 left-6 space-y-0.5">
        <p className="hud-chip text-paper/50">
          {t('hud.caseNo')} {profile.caseNo}
        </p>
        <p className="font-stencil text-2xl uppercase tracking-[0.14em] text-paper">{profile.name}</p>
        <p className="hud-chip text-lamp/80">{t('hud.role')}</p>
        <p className="mt-2 flex items-center gap-2 text-[11px] text-paper/60">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#42f59b]" />
          {t('hud.availableNow')}
        </p>
      </div>

      {/* bottom-center: hint / back */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
        {overlay || focus ? (
          <button onClick={close} className="pointer-events-auto btn-noir bg-ink/40 text-xs">
            ← {t('hud.back')}
          </button>
        ) : (
          <p className="hud-chip animate-pulse text-paper/55">{t('hud.hint')}</p>
        )}
      </div>
    </div>
  )
}

function Corner({ className, d }) {
  const borders =
    d === 'tl'
      ? 'border-l border-t'
      : d === 'tr'
        ? 'border-r border-t'
        : d === 'bl'
          ? 'border-l border-b'
          : 'border-r border-b'
  return <div className={`pointer-events-none absolute h-5 w-5 border-paper/25 ${borders} ${className}`} />
}
