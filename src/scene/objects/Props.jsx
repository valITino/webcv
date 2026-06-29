import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useGLTF, useAnimations } from '@react-three/drei'
import { PROPS } from '../layout.js'
import { fit, warmify } from '../utils.js'
import Interactive from './Interactive.jsx'
import { useStore } from '../../store/useStore.js'

// Generic loader for a static GLB desk prop: fit + hover-scale + tooltip.
function GlbProp({ url, cfg, env = 0.3, onClick }) {
  const { scene } = useGLTF(url)
  const obj = useMemo(() => {
    warmify(scene, { env })
    return scene
  }, [scene, env])
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
export function Phone() {
  const openContact = useStore((s) => s.openContact)
  return <GlbProp url="/models/phone.glb" cfg={PROPS.phone} onClick={openContact} />
}

// ── Vintage terminal (GLB) → opens the evidence log ───────────────────────
export function Monitor() {
  const openCredits = useStore((s) => s.openCredits)
  return <GlbProp url="/models/monitor.glb" cfg={PROPS.monitor} env={0.3} onClick={openCredits} />
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
