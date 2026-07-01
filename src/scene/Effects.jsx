import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
  ToneMapping,
  Outline,
  BrightnessContrast,
} from '@react-three/postprocessing'
import { BlendFunction, ToneMappingMode } from 'postprocessing'
import { useStore } from '../store/useStore.js'

// Cinematic post (matches the reference's stack): hover Outline, Bloom on the
// HDR buffer, ACES tone mapping (the composer disables the renderer default),
// a touch of contrast grade, then vignette + film grain.
// Disabled in performance mode (the CSS vignette/grain remain).
export default function Effects() {
  const quality = useStore((s) => s.quality)
  if (quality !== 'high') return null
  return (
    <EffectComposer disableNormalPass multisampling={4}>
      <Outline
        blur
        xRay={false}
        edgeStrength={4}
        visibleEdgeColor={0xffebb3}
        hiddenEdgeColor={0x4a3d1e}
        blendFunction={BlendFunction.SCREEN}
      />
      {/* Threshold ~0.9 keeps bloom on true emitters (lamp, screen glow) only —
          unlit paper textures (placards, stickies) sit just below and stay matte. */}
      <Bloom intensity={0.7} luminanceThreshold={0.9} luminanceSmoothing={0.18} mipmapBlur radius={0.7} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      <BrightnessContrast brightness={0.0} contrast={0.07} />
      <Vignette offset={0.28} darkness={0.82} eskil={false} />
      <Noise premultiply blendFunction={BlendFunction.OVERLAY} opacity={0.35} />
    </EffectComposer>
  )
}
