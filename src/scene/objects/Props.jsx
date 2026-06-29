import { useMemo } from 'react'
import * as THREE from 'three'
import { PROPS } from '../layout.js'
import Interactive from './Interactive.jsx'
import { useStore } from '../../store/useStore.js'
import { profile } from '../../data/profile.js'

// ── Shared materials ──────────────────────────────────────
const brass = { color: '#caa24a', metalness: 0.9, roughness: 0.35 }
const darkMetal = { color: '#26221c', metalness: 0.85, roughness: 0.45 }
const bakelite = { color: '#141210', metalness: 0.2, roughness: 0.55 }

// ── Desk lamp (light source visual; the SpotLight lives in Lighting) ──────
export function Lamp() {
  const p = PROPS.lamp
  return (
    <Interactive kind="lamp" position={p.position}>
      {() => (
        <group>
          {/* base */}
          <mesh castShadow position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.13, 0.15, 0.04, 32]} />
            <meshStandardMaterial {...darkMetal} />
          </mesh>
          {/* stem */}
          <mesh castShadow position={[0, 0.34, 0]}>
            <cylinderGeometry args={[0.016, 0.02, 0.64, 16]} />
            <meshStandardMaterial {...brass} />
          </mesh>
          {/* arm toward desk centre */}
          <mesh castShadow position={[0.22, 0.66, 0.16]} rotation={[0.5, 0, -0.9]}>
            <cylinderGeometry args={[0.014, 0.014, 0.6, 16]} />
            <meshStandardMaterial {...brass} />
          </mesh>
          {/* shade */}
          <group position={[0.42, 0.74, 0.32]} rotation={[0.9, 0, -0.5]}>
            <mesh castShadow>
              <coneGeometry args={[0.16, 0.2, 32, 1, true]} />
              <meshStandardMaterial {...darkMetal} side={THREE.DoubleSide} />
            </mesh>
            {/* warm bulb */}
            <mesh position={[0, 0.02, 0]}>
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshStandardMaterial color="#fff4d0" emissive="#ffebb3" emissiveIntensity={3} toneMapped={false} />
            </mesh>
            <pointLight position={[0, -0.02, 0]} color="#ffebb3" intensity={2.2} distance={1.4} decay={2} />
          </group>
        </group>
      )}
    </Interactive>
  )
}

// ── Desk phone → Communications Terminal (contact) ────────────────────────
export function Phone() {
  const p = PROPS.phone
  const openContact = useStore((s) => s.openContact)
  return (
    <Interactive kind="phone" position={p.position} rotation={p.rotation} onClick={openContact}>
      {(hovered) => (
        <group scale={hovered ? 1.05 : 1}>
          {/* base */}
          <mesh castShadow position={[0, 0.03, 0]}>
            <boxGeometry args={[0.26, 0.06, 0.16]} />
            <meshStandardMaterial {...bakelite} />
          </mesh>
          {/* dial */}
          <mesh position={[0.05, 0.062, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.045, 0.012, 12, 24]} />
            <meshStandardMaterial {...brass} />
          </mesh>
          {/* handset cradle */}
          <mesh castShadow position={[-0.085, 0.085, 0]}>
            <boxGeometry args={[0.05, 0.05, 0.18]} />
            <meshStandardMaterial {...bakelite} />
          </mesh>
          {/* handset bar */}
          <mesh castShadow position={[-0.085, 0.12, 0]}>
            <boxGeometry args={[0.04, 0.03, 0.22]} />
            <meshStandardMaterial {...bakelite} />
          </mesh>
          <mesh castShadow position={[-0.085, 0.11, 0.11]}>
            <cylinderGeometry args={[0.03, 0.03, 0.03, 16]} />
            <meshStandardMaterial {...bakelite} />
          </mesh>
          <mesh castShadow position={[-0.085, 0.11, -0.11]}>
            <cylinderGeometry args={[0.03, 0.03, 0.03, 16]} />
            <meshStandardMaterial {...bakelite} />
          </mesh>
        </group>
      )}
    </Interactive>
  )
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

// ── Magnifying glass (decorative inspect tool) ────────────────────────────
export function Magnifier() {
  const p = PROPS.magnifier
  return (
    <Interactive kind="magnifier" position={p.position} rotation={p.rotation}>
      {(hovered) => (
        <group rotation={[-Math.PI / 2.1, 0, 0]} scale={hovered ? 1.06 : 1}>
          <mesh castShadow>
            <torusGeometry args={[0.11, 0.012, 16, 40]} />
            <meshStandardMaterial {...brass} />
          </mesh>
          <mesh>
            <circleGeometry args={[0.1, 40]} />
            <meshPhysicalMaterial
              color="#bfe0ee"
              transmission={0.9}
              transparent
              opacity={0.5}
              roughness={0.05}
              thickness={0.05}
            />
          </mesh>
          <mesh castShadow position={[0, -0.2, 0]}>
            <cylinderGeometry args={[0.016, 0.02, 0.2, 16]} />
            <meshStandardMaterial color="#3a2a18" roughness={0.6} />
          </mesh>
        </group>
      )}
    </Interactive>
  )
}

// ── Keys (decorative) ─────────────────────────────────────────────────────
export function Keys() {
  const p = PROPS.keys
  return (
    <Interactive kind="keys" position={p.position}>
      {(hovered) => (
        <group rotation={[0, 0.4, 0]} scale={hovered ? 1.08 : 1}>
          <mesh castShadow position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.035, 0.006, 12, 24]} />
            <meshStandardMaterial {...brass} />
          </mesh>
          {[0.0, 0.35, -0.35].map((a, i) => (
            <group key={i} rotation={[0, a, 0]}>
              <mesh castShadow position={[0.07, 0.01, 0]}>
                <boxGeometry args={[0.11, 0.004, 0.022]} />
                <meshStandardMaterial color="#b9b2a0" metalness={0.8} roughness={0.4} />
              </mesh>
              <mesh castShadow position={[0.135, 0.01, 0.012]}>
                <boxGeometry args={[0.02, 0.004, 0.01]} />
                <meshStandardMaterial color="#b9b2a0" metalness={0.8} roughness={0.4} />
              </mesh>
            </group>
          ))}
        </group>
      )}
    </Interactive>
  )
}
