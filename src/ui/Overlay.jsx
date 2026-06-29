import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../store/useStore.js'
import { useContent } from '../store/useContent.js'

// Shared overlay shell: dimmed backdrop, Esc-to-close, and a docked dark
// "dossier" panel framed by red HUD corner brackets with a SECURE/barcode
// footer. `align` controls which side the panel docks so the 3D focus stays
// visible behind it.
export default function Overlay({ open, align = 'left', maxW = 'max-w-xl', children }) {
  const { t } = useTranslation()
  const close = useStore((s) => s.closeOverlay)
  const profile = useContent((s) => s.profile)

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close])

  if (!open) return null
  const justify = align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start'
  const docRef = `CV_2026_${(profile.name || '').toUpperCase().replace(/\s+/g, '-')}`

  return (
    <div className="fixed inset-0 z-30">
      <div className="absolute inset-0 bg-black/72 backdrop-blur-[3px]" onClick={close} />
      <div className={`pointer-events-none absolute inset-0 flex ${justify} p-4 md:p-8`}>
        <div
          className={`dossier scroll-thin pointer-events-auto relative my-auto flex max-h-[90vh] w-full ${maxW} flex-col overflow-hidden rounded-[2px]`}
        >
          {/* red HUD corner brackets */}
          <span className="hud-corner left-2 top-2 border-l-2 border-t-2" />
          <span className="hud-corner right-2 top-2 border-r-2 border-t-2" />
          <span className="hud-corner bottom-2 left-2 border-b-2 border-l-2" />
          <span className="hud-corner bottom-2 right-2 border-b-2 border-r-2" />

          <button
            onClick={close}
            className="absolute right-5 top-4 z-10 font-hud text-[11px] uppercase tracking-[0.18em] text-paper/55 transition-colors hover:text-redink"
          >
            {t('panel.close')} ✕
          </button>

          <div className="scroll-thin overflow-y-auto px-7 py-8 md:px-10 md:py-9">{children}</div>

          {/* SECURE footer + barcode */}
          <div className="flex items-center justify-between gap-4 border-t border-paper/10 bg-black/30 px-7 py-2.5 md:px-10">
            <span className="font-hud text-[10px] uppercase tracking-[0.18em] text-paper/35">
              DOC_REF: <span className="text-paper/55">{docRef}</span>{' '}
              <span className="text-redink/70">// {t('panel.secure')}</span>
            </span>
            <span className="barcode hidden sm:block" aria-hidden />
          </div>
        </div>
      </div>
    </div>
  )
}
