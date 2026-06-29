import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../store/useStore.js'

// Small typewriter caption that trails the cursor while hovering an object.
export default function Tooltip() {
  const { t } = useTranslation()
  const hovered = useStore((s) => s.hovered)
  const overlay = useStore((s) => s.overlay)
  const ref = useRef(null)
  const [pos, setPos] = useState({ x: -100, y: -100 })

  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [])

  const show = hovered && !overlay
  return (
    <div
      ref={ref}
      className={`pointer-events-none fixed z-[55] max-w-[240px] -translate-y-1/2 translate-x-5 transition-opacity duration-150 ${
        show ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ left: pos.x, top: pos.y }}
    >
      <div className="border border-lamp/30 bg-ink/85 px-3 py-1.5 font-type text-[12px] text-lamp/90 shadow-lg">
        {hovered ? t(`tooltips.${hovered.kind}`) : ''}
      </div>
    </div>
  )
}
