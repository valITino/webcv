import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useGLTF, useAnimations } from '@react-three/drei'
import { PROPS } from '../layout.js'
import { fit, warmify } from '../utils.js'
import Interactive from './Interactive.jsx'
import { useStore } from '../../store/useStore.js'
import { profile } from '../../data/profile.js'

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

// ── Desk lamp (GLB) — the warm key light lives in Lighting.jsx ─────────────
export function Lamp() {
  return <GlbProp url="/models/lamp.glb" cfg={PROPS.lamp} env={0.4} />
}

// ── Desk phone (GLB) → Communications Terminal (contact) ──────────────────
export function Phone() {
  const openContact = useStore((s) => s.openContact)
  return <GlbProp url="/models/phone.glb" cfg={PROPS.phone} onClick={openContact} />
}

// ── Monitor with a live terminal readout (opens the evidence log) ─────────
function useTerminalTexture() {
  return useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 512
    c.height = 384
    const ctx = c.getContext('2d')
    ctx.fillStyle = '#04130b'
    ctx.fillRect(0, 0, 512, 384)
    ctx.font = '22px "Special Elite", monospace'
    ctx.fillStyle = '#42f59b'
    ctx.shadowColor = '#42f59b'
    ctx.shadowBlur = 8
    const lines = [
      '> ' + profile.fileRef + ' SECURE_LINK',
      '> SUBJECT .... ' + profile.alias,
      '> CASE ....... ' + profile.caseNo,
      '> STATUS ..... ONLINE',
      '> EVIDENCE ... 6 EXHIBITS',
      '>',
      '> scanning timeline_',
    ]
    lines.forEach((l, i) => ctx.fillText(l, 22, 52 + i * 42))
    // scanlines
    ctx.shadowBlur = 0
    ctx.fillStyle = 'rgba(0,0,0,0.18)'
    for (let y = 0; y < 384; y += 4) ctx.fillRect(0, y, 512, 2)
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])
}

export function Monitor() {
  const p = PROPS.monitor
  const openCredits = useStore((s) => s.openCredits)
  const screen = useTerminalTexture()
  return (
    <Interactive kind="monitor" position={p.position} rotation={p.rotation} onClick={openCredits}>
      {(hovered) => (
        <group scale={hovered ? 1.03 : 1}>
          {/* CRT body */}
          <mesh castShadow position={[0, 0.28, 0]}>
            <boxGeometry args={[0.62, 0.5, 0.42]} />
            <meshStandardMaterial color="#d8cdb4" metalness={0.1} roughness={0.7} />
          </mesh>
          {/* bezel */}
          <mesh position={[0, 0.3, 0.215]}>
            <boxGeometry args={[0.5, 0.4, 0.02]} />
            <meshStandardMaterial color="#1c1a16" roughness={0.6} />
          </mesh>
          {/* screen */}
          <mesh position={[0, 0.3, 0.226]}>
            <planeGeometry args={[0.42, 0.32]} />
            <meshStandardMaterial
              map={screen}
              emissive="#1c9b5e"
              emissiveMap={screen}
              emissiveIntensity={0.8}
              toneMapped={false}
            />
          </mesh>
          {/* stand */}
          <mesh castShadow position={[0, 0.03, -0.02]}>
            <boxGeometry args={[0.26, 0.06, 0.2]} />
            <meshStandardMaterial color="#d8cdb4" metalness={0.1} roughness={0.7} />
          </mesh>
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
useGLTF.preload('/models/magnifier.glb')
useGLTF.preload('/models/keys.glb')
useGLTF.preload('/models/supplies.glb')
useGLTF.preload('/models/vader.glb')
useGLTF.preload('/models/yoda.glb')
