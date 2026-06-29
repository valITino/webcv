import { useMemo } from 'react'
import * as THREE from 'three'
import { useTexture, Line } from '@react-three/drei'
import Interactive from './Interactive.jsx'
import { profile } from '../../data/profile.js'

// Items pinned to the evidence board: the wanted poster (subject photo),
// a couple of note cards, pushpins and red string. Positioned in the board's
// front plane; the whole group can be nudged via POS.
const POS = [0, 1.2, -1.66] // centre of the board face (tuned against the model)
const SCALE = 1.5

function makeNote(lines, accent = '#1a160e') {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 256
  const ctx = c.getContext('2d')
  ctx.fillStyle = '#e8e2d4'
  ctx.fillRect(0, 0, 256, 256)
  ctx.fillStyle = 'rgba(120,96,54,0.10)'
  for (let i = 0; i < 120; i++) ctx.fillRect(Math.random() * 256, Math.random() * 256, 1.5, 1.5)
  ctx.fillStyle = accent
  ctx.font = '22px "Special Elite", monospace'
  ctx.textBaseline = 'top'
  lines.forEach((l, i) => ctx.fillText(l, 18, 26 + i * 34))
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function Pin({ position, color = '#c0392b' }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.018, 16, 16]} />
      <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} emissive={color} emissiveIntensity={0.15} />
    </mesh>
  )
}

export default function BoardPins() {
  const portrait = useTexture('/images/portrait.png')
  const note1 = useMemo(() => makeNote(['CASE №', profile.caseNo, '', 'STATUS:', 'AT LARGE'], '#c0392b'), [])
  const note2 = useMemo(() => makeNote([profile.fileRef, 'SECURE', 'ACCESS', 'GRANTED']), [])

  const poster = [0, 0.12, 0.01]
  const card1 = [-0.78, -0.28, 0.02]
  const card2 = [0.8, 0.06, 0.02]

  return (
    <group position={POS} scale={SCALE}>
      {/* red string */}
      <Line points={[poster, card1]} color="#c0392b" lineWidth={1.4} />
      <Line points={[poster, card2]} color="#c0392b" lineWidth={1.4} />
      <Line points={[card1, card2]} color="#9c2f23" lineWidth={1} dashed dashSize={0.03} gapSize={0.02} />

      {/* wanted poster */}
      <Interactive kind="portrait" position={poster}>
        {(hovered) => (
          <group scale={hovered ? 1.04 : 1}>
            {/* aged backing */}
            <mesh position={[0, 0, -0.004]}>
              <planeGeometry args={[0.62, 0.78]} />
              <meshStandardMaterial color="#ddd3bc" roughness={0.9} />
            </mesh>
            {/* WANTED bar */}
            <mesh position={[0, 0.31, 0]}>
              <planeGeometry args={[0.62, 0.16]} />
              <meshStandardMaterial color="#1a160e" roughness={0.8} />
            </mesh>
            {/* portrait */}
            <mesh position={[0, -0.02, 0.001]}>
              <planeGeometry args={[0.5, 0.5]} />
              <meshBasicMaterial map={portrait} transparent toneMapped={false} />
            </mesh>
            <Pin position={[-0.26, 0.36, 0.01]} />
            <Pin position={[0.26, 0.36, 0.01]} />
          </group>
        )}
      </Interactive>

      {/* note cards */}
      <group position={card1} rotation={[0, 0, -0.08]}>
        <mesh>
          <planeGeometry args={[0.26, 0.26]} />
          <meshBasicMaterial map={note1} toneMapped={false} />
        </mesh>
        <Pin position={[0, 0.14, 0.01]} />
      </group>
      <group position={card2} rotation={[0, 0, 0.06]}>
        <mesh>
          <planeGeometry args={[0.26, 0.26]} />
          <meshBasicMaterial map={note2} toneMapped={false} />
        </mesh>
        <Pin position={[0, 0.14, 0.01]} color="#caa24a" />
      </group>
    </group>
  )
}

useTexture.preload('/images/portrait.png')
