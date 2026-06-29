import { useEffect, useRef } from 'react'
import { useStore } from '../store/useStore.js'

// Custom magnifier-style cursor. Follows the pointer; grows over hot objects.
export default function Cursor() {
  const wrap = useRef(null)
  const hovered = useStore((s) => s.hovered)

  useEffect(() => {
    const move = (e) => {
      if (wrap.current) wrap.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [])

  return (
    <div ref={wrap} className="pointer-events-none fixed left-0 top-0 z-[60]" style={{ willChange: 'transform' }}>
      <div
        className={`rounded-full border transition-[width,height,border-color] duration-200 ${
          hovered ? 'h-10 w-10 border-lamp' : 'h-5 w-5 border-paper/60'
        }`}
        style={{ transform: 'translate(-50%, -50%)', mixBlendMode: 'difference' }}
      />
      <div
        className="absolute h-1 w-1 rounded-full bg-paper"
        style={{ transform: 'translate(-50%, -50%)', mixBlendMode: 'difference' }}
      />
    </div>
  )
}
