import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useTexture, Line } from '@react-three/drei'
import Interactive from './Interactive.jsx'
import { useContent } from '../../store/useContent.js'

// A few *personalised* items pinned over the board's already-rich baked
// detective collage (map, crime-scene photos, fingerprint card, clippings):
// a small "wanted" polaroid of the subject and a case sticky-note, joined by a
// thread of red string. Kept small and to one side so the baked art behind
// stays legible — the board itself is the backdrop, KH-style.
const POS = [-0.6, 1.26, -1.6] // upper-left region of the board face
const SCALE = 1.0

function makeNote(lines, accent = '#c0392b', paper = '#f0e7a4') {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 256
  const ctx = c.getContext('2d')
  ctx.fillStyle = paper
  ctx.fillRect(0, 0, 256, 256)
  ctx.fillStyle = 'rgba(120,96,54,0.10)'
  for (let i = 0; i < 120; i++) ctx.fillRect(Math.random() * 256, Math.random() * 256, 1.5, 1.5)
  ctx.fillStyle = accent
  ctx.font = '26px "Special Elite", monospace'
  ctx.textBaseline = 'top'
  lines.forEach((l, i) => ctx.fillText(l, 20, 22 + i * 36))
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function Pin({ position, color = '#c0392b' }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.016, 16, 16]} />
      <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} emissive={color} emissiveIntensity={0.25} />
    </mesh>
  )
}

export default function BoardPins() {
  const portrait = useTexture('/images/portrait.png')
  const caseNo = useContent((s) => s.profile.caseNo) // CMS-aware, like placards & terminal
  const note = useMemo(() => makeNote(['CASE №', caseNo, '', 'STATUS:', 'AT LARGE']), [caseNo])
  useEffect(() => () => note.dispose(), [note])

  const card = [0.5, -0.1, 0.02]

  return (
    <group position={POS} scale={SCALE}>
      {/* red string — a short thread joining the polaroid to the case note and a
          tail down into the board's own web. Subtle, not spanning the board. */}
      <Line points={[[0, -0.16, 0.03], [0.5, 0.02, 0.03]]} color="#c0392b" lineWidth={1.3} />
      <Line
        points={[[0, -0.16, 0.03], [-0.34, -0.62, 0.03]]}
        color="#9c2f23"
        lineWidth={1}
        dashed
        dashSize={0.035}
        gapSize={0.022}
      />

      {/* subject "wanted" polaroid — small, framed, pinned (interactive) */}
      <Interactive kind="portrait" position={[0, 0, 0.02]}>
        {(hovered) => (
          <group scale={hovered ? 1.05 : 1} rotation={[0, 0, -0.05]}>
            {/* white polaroid frame (photo sits high → thicker bottom border) */}
            <mesh>
              <planeGeometry args={[0.34, 0.4]} />
              <meshStandardMaterial color="#ece6d8" roughness={0.85} />
            </mesh>
            {/* mugshot-grey photo backing (the portrait PNG is a cut-out) */}
            <mesh position={[0, 0.04, 0.002]}>
              <planeGeometry args={[0.28, 0.28]} />
              <meshStandardMaterial color="#494540" roughness={0.9} />
            </mesh>
            {/* subject */}
            <mesh position={[0, 0.04, 0.004]}>
              <planeGeometry args={[0.28, 0.28]} />
              <meshBasicMaterial map={portrait} transparent toneMapped={false} />
            </mesh>
            <Pin position={[0, 0.22, 0.02]} />
          </group>
        )}
      </Interactive>

      {/* personalised case sticky-note (yellow, like the baked board's notes) */}
      <group position={card} rotation={[0, 0, 0.07]}>
        <mesh>
          <planeGeometry args={[0.24, 0.24]} />
          <meshBasicMaterial map={note} toneMapped={false} />
        </mesh>
        <Pin position={[0, 0.13, 0.01]} color="#caa24a" />
      </group>
    </group>
  )
}

useTexture.preload('/images/portrait.png')
