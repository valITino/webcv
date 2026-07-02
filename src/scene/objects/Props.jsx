import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { PROPS } from '../layout.js'
import { fit, warmify, makeScreenTexture } from '../utils.js'
import Interactive from './Interactive.jsx'
import { useStore } from '../../store/useStore.js'
import { useContent } from '../../store/useContent.js'

// Generic loader for a static GLB desk prop: fit + hover-scale + tooltip.
// `mutate` (optional, stable) runs once after warmify for per-prop tweaks.
function GlbProp({ url, cfg, env = 0.3, onClick, mutate }) {
  const { scene } = useGLTF(url)
  const obj = useMemo(() => {
    warmify(scene, { env })
    mutate?.(scene)
    return scene
  }, [scene, env, mutate])
  const { scale, position } = useMemo(() => fit(obj, cfg.target, 'bottom'), [obj, cfg.target])
  return (
    <Interactive kind={cfg.kind} position={cfg.position} rotation={cfg.rotation} onClick={onClick}>
      {(hovered) => (
        <group scale={hovered ? 1.06 : 1}>
          <primitive object={obj} scale={scale} position={position} />
        </group>
      )}
    </Interactive>
  )
}

// ── Desk lamp (GLB) — clicking it toggles the key light (burn out / on) ────
export function Lamp() {
  const toggleLamp = useStore((s) => s.toggleLamp)
  const setFlash = useStore((s) => s.setFlash)
  return (
    <GlbProp
      url="/models/lamp.glb"
      cfg={PROPS.lamp}
      env={0.4}
      onClick={() => {
        toggleLamp()
        setFlash(useStore.getState().lampOn ? 'easter.lampon' : 'easter.lampoff')
      }}
    />
  )
}

// ── Desk phone (GLB) → Communications Terminal (contact) ──────────────────
// The stock body is teal; noir bakelite red makes the phone read as THE
// contact affordance (the reference's iconic red phone). Only the body
// material ("Material" — untextured factor colour) is retinted; buttons,
// cord and the textured dial face keep their stock look.
const redPhoneBody = (root) => {
  root.traverse((o) => {
    if (o.isMesh && o.material?.name === 'Material') o.material.color.set('#a62a1e')
  })
}

export function Phone() {
  const openContact = useStore((s) => s.openContact)
  return <GlbProp url="/models/phone.glb" cfg={PROPS.phone} onClick={openContact} mutate={redPhoneBody} />
}

// ── Vintage terminal (GLB) → opens the evidence log ───────────────────────
// The screen ("Material.002", the only emissive material) gets its baked
// generic readout redrawn with this case's trace log, and a gentle CRT
// flicker on the emissive keeps the phosphor alive.
export function Monitor() {
  const openCredits = useStore((s) => s.openCredits)
  const caseNo = useContent((s) => s.profile.caseNo)
  const { scene } = useGLTF('/models/monitor.glb')
  const screenMat = useRef(null)

  const obj = useMemo(() => {
    warmify(scene, { env: 0.3 })
    scene.traverse((o) => {
      if (o.isMesh && o.material?.name === 'Material.002') screenMat.current = o.material
    })
    const m = screenMat.current
    if (m && !m.userData.__readout) {
      const tex = makeScreenTexture(m.map, { caseNo })
      if (tex) {
        m.map = tex
        m.emissiveMap = tex
        m.userData.__readout = true
        m.needsUpdate = true
      }
    }
    return scene
  }, [scene, caseNo])
  const { scale, position } = useMemo(() => fit(obj, PROPS.monitor.target, 'bottom'), [obj])

  useFrame(({ clock }) => {
    const m = screenMat.current
    if (m) {
      const t = clock.elapsedTime
      m.emissiveIntensity = 1 + 0.05 * Math.sin(t * 12.3) + 0.035 * Math.sin(t * 3.1)
    }
  })

  return (
    <Interactive kind="monitor" position={PROPS.monitor.position} rotation={PROPS.monitor.rotation} onClick={openCredits}>
      {(hovered) => (
        <group scale={hovered ? 1.06 : 1}>
          <primitive object={obj} scale={scale} position={position} />
        </group>
      )}
    </Interactive>
  )
}

// ── Magnifying glass (GLB) ────────────────────────────────────────────────
export function Magnifier() {
  return <GlbProp url="/models/magnifier.glb" cfg={PROPS.magnifier} />
}

// ── Keys with tag (GLB) ───────────────────────────────────────────────────
export function Keys() {
  return <GlbProp url="/models/keys.glb" cfg={PROPS.keys} />
}

// ── Office supplies pack (GLB) ────────────────────────────────────────────
export function Supplies() {
  return <GlbProp url="/models/supplies.glb" cfg={PROPS.supplies} />
}

// ── LEGO Darth Vader (GLB, static) — personality piece ────────────────────
export function Vader() {
  const setFlash = useStore((s) => s.setFlash)
  return <GlbProp url="/models/vader.glb" cfg={PROPS.vader} env={0.5} onClick={() => setFlash('easter.vader')} />
}

// ── LEGO Yoda (GLB, looping idle animation) — personality piece ───────────
export function Yoda() {
  const setFlash = useStore((s) => s.setFlash)
  const { scene, animations } = useGLTF('/models/yoda.glb')
  const obj = useMemo(() => {
    warmify(scene, { env: 0.45 })
    return scene
  }, [scene])
  const { scale, position } = useMemo(() => fit(obj, PROPS.yoda.target, 'bottom'), [obj])
  const { actions, names } = useAnimations(animations, obj)
  useEffect(() => {
    const a = names.length ? actions[names[0]] : null
    if (!a) return undefined
    a.reset().fadeIn(0.4).play()
    a.loop = THREE.LoopRepeat
    return () => {
      a.fadeOut(0.2)
    }
  }, [actions, names])
  return (
    <Interactive
      kind="yoda"
      position={PROPS.yoda.position}
      rotation={PROPS.yoda.rotation}
      onClick={() => setFlash('easter.yoda')}
    >
      {(hovered) => (
        <group scale={hovered ? 1.06 : 1}>
          <primitive object={obj} scale={scale} position={position} />
        </group>
      )}
    </Interactive>
  )
}

useGLTF.preload('/models/lamp.glb')
useGLTF.preload('/models/phone.glb')
useGLTF.preload('/models/monitor.glb')
useGLTF.preload('/models/magnifier.glb')
useGLTF.preload('/models/keys.glb')
useGLTF.preload('/models/supplies.glb')
useGLTF.preload('/models/vader.glb')
useGLTF.preload('/models/yoda.glb')
