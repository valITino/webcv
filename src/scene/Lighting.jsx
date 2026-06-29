import { Environment, Lightformer } from '@react-three/drei'

// Film-noir lighting: one warm key "from the lamp", a faint cool fill,
// and a cheap procedural environment (no network HDR) for metal reflections.
export default function Lighting() {
  return (
    <>
      <ambientLight intensity={0.1} color="#2a2620" />

      {/* Key light — the desk lamp glow */}
      <spotLight
        position={[-1.0, 1.05, -0.02]}
        target-position={[0.05, 0, 0.18]}
        color="#ffebb3"
        intensity={16}
        angle={0.72}
        penumbra={0.65}
        distance={9}
        decay={1.7}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0006}
        shadow-normalBias={0.02}
      />

      {/* Cool fill so the front + right side of objects read */}
      <directionalLight position={[2.6, 2.0, 3.0]} intensity={0.42} color="#6076a0" />
      {/* Warm bounce from the desk */}
      <pointLight position={[0.4, 0.5, 0.8]} intensity={0.5} distance={3} decay={2} color="#e7b87a" />
      {/* Soft wash on the evidence board so its texture + pinned items read */}
      <pointLight position={[0, 1.5, -0.7]} intensity={0.85} distance={3.4} decay={2} color="#cdbe9a" />
      {/* Gentle rim from the right to lift the coffee / Exhibit F corner */}
      <pointLight position={[1.7, 0.7, 0.9]} intensity={0.45} distance={2.6} decay={2} color="#d8b27e" />

      <Environment resolution={64} frames={1}>
        <Lightformer form="rect" intensity={1.4} color="#ffebb3" position={[-1.2, 1.4, 0.4]} scale={[2, 1.2, 1]} />
        <Lightformer form="rect" intensity={0.4} color="#43597f" position={[2.5, 1.6, 1.5]} scale={[2.5, 2, 1]} />
        <Lightformer form="ring" intensity={0.3} color="#ffffff" position={[0, 2.2, -1]} scale={1.4} />
      </Environment>
    </>
  )
}
