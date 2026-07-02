import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../store/useStore.js'

// Brief themed line shown on easter-egg interactions (object clicks, Konami).
export function Flash() {
  const { t } = useTranslation()
  const flash = useStore((s) => s.flash)
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!flash) return undefined
    setShow(true)
    const id = setTimeout(() => setShow(false), 3500)
    return () => clearTimeout(id)
  }, [flash?.n])

  return (
    <div
      className={`pointer-events-none fixed bottom-28 left-1/2 z-30 -translate-x-1/2 px-4 text-center transition-all duration-300 ${
        show ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      }`}
    >
      <p className="font-headline text-lg italic text-lamp drop-shadow">{flash ? `“${t(flash.key)}”` : ''}</p>
    </div>
  )
}

// House badge shown while Ravenclaw mode is engaged (Konami code).
export function RavenclawBadge() {
  const active = useStore((s) => s.ravenclaw)
  if (!active) return null
  return (
    <div className="pointer-events-none fixed left-1/2 top-16 z-30 -translate-x-1/2">
      <div
        className="flex items-center gap-2 border px-4 py-1.5 shadow-lg"
        style={{ borderColor: '#946b2d', background: 'rgba(34,47,91,0.88)' }}
      >
        <span className="text-base">🦅</span>
        <span className="font-stencil text-sm tracking-[0.3em]" style={{ color: '#cDA434' }}>
          RAVENCLAW
        </span>
      </div>
    </div>
  )
}
