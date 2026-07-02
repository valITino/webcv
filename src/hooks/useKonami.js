import { useEffect, useRef } from 'react'

// Classic Konami sequence → fires `onMatch`. Used for the hidden Ravenclaw mode.
const SEQUENCE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a',
]

export function useKonami(onMatch) {
  const idx = useRef(0)
  useEffect(() => {
    const onKey = (e) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
      idx.current = key === SEQUENCE[idx.current] ? idx.current + 1 : key === SEQUENCE[0] ? 1 : 0
      if (idx.current === SEQUENCE.length) {
        idx.current = 0
        onMatch()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onMatch])
}
