import { Suspense, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, AdaptiveEvents } from '@react-three/drei'
import Scene from '../scene/Scene.jsx'
import { useStore } from '../store/useStore.js'
import { useKonami } from '../hooks/useKonami.js'
import Hud from '../ui/Hud.jsx'
import Tooltip from '../ui/Tooltip.jsx'
import IdleToast from '../ui/IdleToast.jsx'
import ExhibitPanel from '../ui/ExhibitPanel.jsx'
import ContactTerminal from '../ui/ContactTerminal.jsx'
import Credits from '../ui/Credits.jsx'
import { Flash, RavenclawBadge } from '../ui/Flash.jsx'

export default function Experience() {
  const entered = useStore((s) => s.entered)
  const quality = useStore((s) => s.quality)

  // Hidden Ravenclaw mode (Konami code) — house-colour lighting + crest.
  const onKonami = useCallback(() => {
    useStore.getState().toggleRavenclaw()
    if (useStore.getState().ravenclaw) useStore.getState().setFlash('easter.ravenclaw')
  }, [])
  useKonami(onKonami)

  return (
    <>
      <Canvas
        className="!absolute inset-0"
        shadows
        dpr={[1, quality === 'high' ? 2 : 1.3]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0.96, 2.45], fov: 42, near: 0.1, far: 100 }}
      >
        <color attach="background" args={['#0c0b09']} />
        <fog attach="fog" args={['#0c0b09', 5.5, 14]} />
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
      </Canvas>

      {entered && (
        <>
          <Hud />
          <Tooltip />
          <IdleToast />
          <ExhibitPanel />
          <ContactTerminal />
          <Credits />
          <Flash />
          <RavenclawBadge />
        </>
      )}
    </>
  )
}
