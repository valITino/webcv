import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../store/useStore.js'

// Shared overlay shell: dim backdrop, Esc-to-close, and a docked paper sheet.
// `align` controls which side the sheet docks to so the 3D focus stays visible.
export default function Overlay({ open, align = 'left', maxW = 'max-w-xl', children }) {
  const { t } = useTranslation()
  const close = useStore((s) => s.closeOverlay)

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close])

  if (!open) return null
  const justify = align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start'

  return (
    <div className="fixed inset-0 z-30">
      <div className="absolute inset-0 bg-ink/55 backdrop-blur-[2px]" onClick={close} />
      <div className={`pointer-events-none absolute inset-0 flex ${justify} p-4 md:p-8`}>
        <div
          className={`pointer-events-auto relative my-auto flex max-h-[90vh] w-full ${maxW} flex-col overflow-hidden paper grain animate-[stampin_0.01s] rounded-[2px]`}
          style={{ animation: 'none' }}
        >
          {/* tape strips */}
          <div className="pointer-events-none absolute -left-4 top-6 h-7 w-24 -rotate-12 bg-paperdark/50 mix-blend-multiply" />
          <div className="pointer-events-none absolute -right-5 bottom-10 h-7 w-24 rotate-6 bg-paperdark/50 mix-blend-multiply" />

          <button
            onClick={close}
            className="absolute right-3 top-3 z-10 font-type text-[11px] uppercase tracking-[0.18em] text-ink/60 hover:text-evidence"
          >
            {t('panel.close')} ✕
          </button>

          <div className="scroll-thin overflow-y-auto px-7 py-8 md:px-10 md:py-10">{children}</div>

          <div className="border-t border-ink/15 px-7 py-2 text-center font-type text-[10px] uppercase tracking-[0.2em] text-ink/40">
            {t('panel.closeHint')}
          </div>
        </div>
      </div>
    </div>
  )
}
