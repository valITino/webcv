import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { useStore } from '../store/useStore.js'

// Cinematic post: lamp/screen bloom, vignette, film grain.
// Disabled in performance mode (the CSS vignette/grain remain).
export default function Effects() {
  const quality = useStore((s) => s.quality)
  if (quality !== 'high') return null
  return (
    <EffectComposer disableNormalPass multisampling={4}>
      <Bloom intensity={0.7} luminanceThreshold={0.55} luminanceSmoothing={0.25} mipmapBlur radius={0.7} />
      <Vignette offset={0.28} darkness={0.82} eskil={false} />
      <Noise premultiply blendFunction={BlendFunction.OVERLAY} opacity={0.35} />
    </EffectComposer>
  )
}
