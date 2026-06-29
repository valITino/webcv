import { Environment, Lightformer } from '@react-three/drei'
import { useStore } from '../store/useStore.js'

// Film-noir lighting: one warm key "from the lamp", a faint cool fill, a soft
// board wash, and a cheap procedural environment (no network HDR) for metal
// reflections. Konami → Ravenclaw mode flips the warm palette to house blue/bronze.
export default function Lighting() {
  const ravenclaw = useStore((s) => s.ravenclaw)
  const lampOn = useStore((s) => s.lampOn)
  const key = ravenclaw ? '#5b8bd0' : '#ffebb3' // lamp key light
  const warm = ravenclaw ? '#cd7f32' : '#e7b87a' // warm bounce / rim → bronze in RC mode
  const keyIntensity = lampOn ? (ravenclaw ? 20 : 16) : 0 // clicking the lamp burns it out
  const glow = lampOn ? 1.3 : 0

  return (
    <>
      <ambientLight intensity={0.1} color="#2a2620" />

      {/* Key light — emanating from the desk lamp (back-left) */}
      <spotLight
        position={[-1.05, 1.0, -0.05]}
        target-position={[0.1, 0, 0.22]}
        color={key}
        intensity={keyIntensity}
        angle={0.74}
        penumbra={0.65}
        distance={9}
        decay={1.7}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0006}
        shadow-normalBias={0.02}
      />
      {/* Local glow at the lamp head (sells "the lamp is on" + feeds bloom) */}
      <pointLight position={[-1.02, 0.62, -0.02]} color={key} intensity={glow} distance={1.5} decay={2} />

      {/* Cool fill so the front + right side of objects read */}
      <directionalLight position={[2.6, 2.0, 3.0]} intensity={0.42} color="#6076a0" />
      {/* Warm bounce from the desk */}
      <pointLight position={[0.4, 0.5, 0.8]} intensity={0.5} distance={3} decay={2} color={warm} />
      {/* Soft wash on the evidence board — kept low so the rich baked texture
          reads as atmospheric backdrop and the pinned portrait stays the focus */}
      <pointLight position={[0, 1.4, -0.7]} intensity={0.55} distance={3.2} decay={2} color="#cdbe9a" />
      {/* Gentle rim from the right to lift the coffee / Exhibit F corner */}
      <pointLight position={[1.7, 0.7, 0.9]} intensity={0.45} distance={2.6} decay={2} color={warm} />

      <Environment resolution={64} frames={1}>
        <Lightformer form="rect" intensity={1.4} color={key} position={[-1.2, 1.4, 0.4]} scale={[2, 1.2, 1]} />
        <Lightformer form="rect" intensity={0.4} color="#43597f" position={[2.5, 1.6, 1.5]} scale={[2.5, 2, 1]} />
        <Lightformer form="ring" intensity={0.3} color="#ffffff" position={[0, 2.2, -1]} scale={1.4} />
      </Environment>
    </>
  )
}
