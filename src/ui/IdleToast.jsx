import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useIdle } from '../hooks/useIdle.js'
import { useStore } from '../store/useStore.js'

// The detective's idle quips, surfaced when the visitor goes quiet.
export default function IdleToast() {
  const { t } = useTranslation()
  const overlay = useStore((s) => s.overlay)
  const idle = useIdle(20000, !overlay)
  const [i, setI] = useState(0)

  const lines = t('idle', { returnObjects: true })
  const list = Array.isArray(lines) ? lines : []

  useEffect(() => {
    if (idle) setI((n) => (n + 1) % Math.max(1, list.length))
  }, [idle, list.length])

  const show = idle && !overlay && list.length > 0
  return (
    <div
      className={`pointer-events-none fixed bottom-24 left-1/2 z-20 -translate-x-1/2 transition-all duration-500 ${
        show ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
      }`}
    >
      <p className="font-headline text-lg italic text-lamp/85 drop-shadow">{show ? `“${list[i]}”` : ''}</p>
    </div>
  )
}
