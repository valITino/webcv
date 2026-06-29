import { useIsDesktop } from './hooks/useIsDesktop.js'
import { useStore } from './store/useStore.js'
import DesktopGate from './components/DesktopGate.jsx'
import Intro from './components/Intro.jsx'
import Experience from './components/Experience.jsx'
import Cursor from './ui/Cursor.jsx'

export default function App() {
  const isDesktop = useIsDesktop()
  const entered = useStore((s) => s.entered)

  if (!isDesktop) return <DesktopGate />

  return (
    <div className="fixed inset-0 overflow-hidden bg-ink vignette" style={{ cursor: 'none' }}>
      {/* 3D canvas mounts immediately so assets preload behind the intro */}
      <Experience />

      {/* Newspaper intro overlays the scene until the visitor enters */}
      {!entered && <Intro />}

      {/* Custom magnifier cursor */}
      <Cursor />
    </div>
  )
}
