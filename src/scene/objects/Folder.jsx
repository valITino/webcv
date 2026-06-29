import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { Select } from '@react-three/postprocessing'
import { clone as skClone } from 'three/examples/jsm/utils/SkeletonUtils.js'
import { useTranslation } from 'react-i18next'
import { fit, warmify, makeLabelTexture } from '../utils.js'
import { STAGE } from '../layout.js'
import { useStore } from '../../store/useStore.js'

const URL = '/models/folder.glb'
const tmp = new THREE.Vector3()

// shortest-path angle damp so the spin unwinds cleanly when it returns home
function dampAngle(current, target, k) {
  let d = ((target - current + Math.PI) % (Math.PI * 2)) - Math.PI
  if (d < -Math.PI) d += Math.PI * 2
  return current + d * k
}

export default function Folder({ data }) {
  const { t } = useTranslation()
  const { scene, animations } = useGLTF(URL)
  const openExhibit = useStore((s) => s.openExhibit)
  const setHovered = useStore((s) => s.setHovered)
  const active = useStore((s) => s.activeExhibit) === data.id

  const obj = useMemo(() => {
    const c = skClone(scene)
    warmify(c, { env: 0.22 })
    return c
  }, [scene])
  const { scale, position } = useMemo(() => fit(obj, data.target, 'bottom'), [obj, data.target])

  // open/close clip
  const { actions, names } = useAnimations(animations, obj)
  useEffect(() => {
    const a = names.length ? actions[names[0]] : null
    if (!a) return
    a.clampWhenFinished = true
    a.loop = THREE.LoopOnce
    if (active) {
      a.timeScale = 1
      a.reset().play()
    } else if (a.time > 0) {
      a.timeScale = -1
      a.paused = false
      a.play()
    }
  }, [active, actions, names])

  const label = useMemo(
    () => makeLabelTexture(`EXHIBIT ${data.no}`, t(`exhibits.${data.key}.title`)),
    [data.no, data.key, t],
  )

  const grp = useRef()
  const spin = useRef(0)
  const [hovered, setHover] = useState(false)

  // Per-frame: lift to the inspection stage + slow-spin when examined, else
  // settle back home (with a gentle hover lift). Frame-rate independent.
  useFrame((_, dt) => {
    const g = grp.current
    if (!g) return
    const k = 1 - Math.pow(0.0009, Math.min(dt, 0.05))
    if (active) {
      tmp.set(...STAGE.position)
      g.position.lerp(tmp, k)
      g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, STAGE.scale, k))
      spin.current += dt * 0.5
      g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, STAGE.tilt, k)
      g.rotation.y = dampAngle(g.rotation.y, spin.current, k)
      g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, 0, k)
    } else {
      tmp.set(data.position[0], data.position[1] + (hovered ? 0.03 : 0), data.position[2])
      g.position.lerp(tmp, k)
      g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, hovered ? 1.05 : 1, k))
      g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, 0, k)
      g.rotation.y = dampAngle(g.rotation.y, data.rotation[1], k)
      g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, 0, k)
      spin.current = g.rotation.y
    }
  })

  return (
    <group
      ref={grp}
      position={data.position}
      rotation={data.rotation}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHover(true)
        setHovered({ kind: 'folder' })
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        setHover(false)
        setHovered(null)
      }}
      onClick={(e) => {
        e.stopPropagation()
        openExhibit(data.id)
      }}
    >
      <Select enabled={hovered}>
        <primitive object={obj} scale={scale} position={position} />
        <mesh position={[0, 0.055, 0.06]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.34, 0.17]} />
          <meshBasicMaterial map={label} transparent toneMapped={false} />
        </mesh>
      </Select>
    </group>
  )
}

useGLTF.preload(URL)
