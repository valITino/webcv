import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import gsap from 'gsap'
import { useStore } from '../store/useStore.js'
import { CAMERA, focusPose } from './layout.js'

// OrbitControls for the resting desk shot; GSAP tweens for focus/inspection.
export default function CameraRig() {
  const controls = useRef()
  const { camera } = useThree()
  const focus = useStore((s) => s.focus)
  const proxy = useRef({ px: 0, py: 0, pz: 0, tx: 0, ty: 0, tz: 0 })
  const tween = useRef(null)

  // Initialise at the overview pose.
  useEffect(() => {
    const o = CAMERA.overview
    camera.position.set(...o.pos)
    if (controls.current) {
      controls.current.target.set(...o.target)
      controls.current.update()
    }
    Object.assign(proxy.current, {
      px: o.pos[0], py: o.pos[1], pz: o.pos[2],
      tx: o.target[0], ty: o.target[1], tz: o.target[2],
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Animate camera on focus change.
  useEffect(() => {
    const c = controls.current
    const pose = focusPose(focus)
    if (tween.current) tween.current.kill()
    if (c) c.enabled = false

    // sync proxy from the live camera/target so the tween starts smoothly
    proxy.current.px = camera.position.x
    proxy.current.py = camera.position.y
    proxy.current.pz = camera.position.z
    if (c) {
      proxy.current.tx = c.target.x
      proxy.current.ty = c.target.y
      proxy.current.tz = c.target.z
    }

    tween.current = gsap.to(proxy.current, {
      px: pose.pos[0], py: pose.pos[1], pz: pose.pos[2],
      tx: pose.target[0], ty: pose.target[1], tz: pose.target[2],
      duration: 1.1,
      ease: 'power3.inOut',
      onUpdate: () => {
        camera.position.set(proxy.current.px, proxy.current.py, proxy.current.pz)
        if (c) {
          c.target.set(proxy.current.tx, proxy.current.ty, proxy.current.tz)
          c.update()
        }
      },
      onComplete: () => {
        if (c && !focus) c.enabled = true // only free the camera at overview
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus])

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enablePan={false}
      enableZoom
      minDistance={2.6}
      maxDistance={5.2}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.6}
      zoomSpeed={0.5}
      minPolarAngle={0.7}
      maxPolarAngle={1.4}
      minAzimuthAngle={-0.6}
      maxAzimuthAngle={0.6}
    />
  )
}
