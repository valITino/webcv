import { useEffect, useMemo, useState } from 'react'
import * as THREE from 'three'
import { useGLTF, useAnimations } from '@react-three/drei'
import { Select } from '@react-three/postprocessing'
import { clone as skClone } from 'three/examples/jsm/utils/SkeletonUtils.js'
import { useTranslation } from 'react-i18next'
import { fit, warmify, makeLabelTexture, makeReportTexture } from '../utils.js'
import { useStore } from '../../store/useStore.js'
import { useContent } from '../../store/useContent.js'

const URL = '/models/folder.glb'

export default function Folder({ data }) {
  const { t } = useTranslation()
  const { scene, animations } = useGLTF(URL)
  const openExhibit = useStore((s) => s.openExhibit)
  const setHovered = useStore((s) => s.setHovered)
  const active = useStore((s) => s.activeExhibit) === data.id
  const [hovered, setHover] = useState(false)

  const obj = useMemo(() => {
    const c = skClone(scene)
    warmify(c, { env: 0.22 })
    return c
  }, [scene])
  const { scale, position } = useMemo(() => fit(obj, data.target, 'bottom'), [obj, data.target])

  // The clip opens the folder flat on the desk (lays out the A4 pages).
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

  const caseNo = useContent((s) => s.profile.caseNo)
  const label = useMemo(
    () => makeLabelTexture(`EXHIBIT ${data.no}`, t(`exhibits.${data.key}.title`), { caseNo }),
    [data.no, data.key, t, caseNo],
  )
  // typed case report — laid on top of the A4 stack once the folder is open
  const report = useMemo(
    () => makeReportTexture(`EXHIBIT ${data.no}`, t(`exhibits.${data.key}.title`), { caseNo }),
    [data.no, data.key, t, caseNo],
  )

  return (
    <group
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
      <Select enabled={hovered && !active}>
        <group position={[0, hovered && !active ? 0.03 : 0, 0]} scale={hovered && !active ? 1.05 : 1}>
          <primitive object={obj} scale={scale} position={position} />
          {/* printed tab label — hidden once the folder is opened */}
          {!active && (
            <mesh position={[0, 0.055, 0.06]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.34, 0.17]} />
              <meshBasicMaterial map={label} transparent toneMapped={false} />
            </mesh>
          )}
          {/* typed case report on the opened stack */}
          {active && (
            <mesh position={[0.03, 0.06, 0.04]} rotation={[-Math.PI / 2, 0, 0.05]}>
              <planeGeometry args={[0.3, 0.42]} />
              <meshBasicMaterial map={report} toneMapped={false} />
            </mesh>
          )}
        </group>
      </Select>
    </group>
  )
}

useGLTF.preload(URL)
