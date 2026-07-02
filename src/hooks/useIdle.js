import { useEffect, useRef, useState } from 'react'

// Fires `idle = true` after `timeout` ms without pointer/keyboard activity.
// Used to surface the detective's idle quips.
export function useIdle(timeout = 18000, enabled = true) {
  const [idle, setIdle] = useState(false)
  const timer = useRef(null)

  useEffect(() => {
    if (!enabled) return undefined
    const reset = () => {
      setIdle(false)
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => setIdle(true), timeout)
    }
    const events = ['pointermove', 'pointerdown', 'keydown', 'wheel']
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }))
    reset()
    return () => {
      events.forEach((e) => window.removeEventListener(e, reset))
      if (timer.current) clearTimeout(timer.current)
    }
  }, [timeout, enabled])

  return idle
}
