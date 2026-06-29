import { useEffect, useState } from 'react'

// The experience is desktop-only (mouse + keyboard, GPU headroom).
// Treat coarse-pointer / narrow viewports as "not desktop".
export function useIsDesktop(minWidth = 1024) {
  const get = () => {
    if (typeof window === 'undefined') return true
    const finePointer = window.matchMedia('(pointer: fine)').matches
    const wideEnough = window.innerWidth >= minWidth
    return finePointer && wideEnough
  }
  const [isDesktop, setIsDesktop] = useState(get)

  useEffect(() => {
    const onResize = () => setIsDesktop(get())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return isDesktop
}
