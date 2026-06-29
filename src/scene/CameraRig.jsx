import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../store/useStore.js'
import { CAMERA, focusPose } from './layout.js'

// KH-style camera: a damped mouse-follow "free" orbit at rest that eases into a
// fixed "inspect" pose on focus. No drag — the camera gently follows the pointer
// (frame-rate-independent lerp), which is what gives the cinematic immersion.
const desiredPos = new THREE.Vector3()
const desiredTarget = new THREE.Vector3()

export default function CameraRig() {
  const { camera } = useThree()
  const focus = useStore((s) => s.focus)
  const curTarget = useRef(new THREE.Vector3(...CAMERA.overview.target))
  const base = useRef(null)

  // Derive the resting orbit (radius + angles) from the overview pose, once.
  if (!base.current) {
    const t = new THREE.Vector3(...CAMERA.overview.target)
    const off = new THREE.Vector3(...CAMERA.overview.pos).sub(t)
    const radius = off.length()
    base.current = { radius, az: Math.atan2(off.x, off.z), polar: Math.acos(off.y / radius) }
    camera.position.set(...CAMERA.overview.pos)
  }

  useFrame((state, dt) => {
    const p = state.pointer // NDC, x/y ∈ [-1, 1]
    if (!focus) {
      // Free mode — orbit slightly around the desk following the mouse.
      const b = base.current
      const az = b.az + p.x * 0.42
      const polar = THREE.MathUtils.clamp(b.polar - p.y * 0.16, 0.62, 1.45)
      const hr = b.radius * Math.sin(polar)
      desiredPos.set(
        CAMERA.overview.target[0] + hr * Math.sin(az),
        CAMERA.overview.target[1] + b.radius * Math.cos(polar),
        CAMERA.overview.target[2] + hr * Math.cos(az),
      )
      desiredTarget.set(...CAMERA.overview.target)
    } else {
      // Fixed inspect pose, with a whisper of parallax so it still feels alive.
      const pose = focusPose(focus)
      desiredPos.set(pose.pos[0] + p.x * 0.1, pose.pos[1] - p.y * 0.05, pose.pos[2])
      desiredTarget.set(...pose.target)
    }
    const k = 1 - Math.pow(0.0009, dt) // smooth, frame-rate independent
    camera.position.lerp(desiredPos, k)
    curTarget.current.lerp(desiredTarget, k)
    camera.lookAt(curTarget.current)
  })

  return null
}
