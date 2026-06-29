import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useGLTF, useAnimations } from '@react-three/drei'
import { clone as skClone } from 'three/examples/jsm/utils/SkeletonUtils.js'
import { useTranslation } from 'react-i18next'
import { fit, warmify, makeLabelTexture } from '../utils.js'
import Interactive from './Interactive.jsx'
import { useStore } from '../../store/useStore.js'

const URL = '/models/folder.glb'

export default function Folder({ data }) {
  const { t } = useTranslation()
  const { scene, animations } = useGLTF(URL)
  const openExhibit = useStore((s) => s.openExhibit)
  const activeExhibit = useStore((s) => s.activeExhibit)
  const active = activeExhibit === data.id

  const obj = useMemo(() => {
    const c = skClone(scene)
    warmify(c, { env: 0.22 })
    return c
  }, [scene])

  const { scale, position } = useMemo(() => fit(obj, data.target, 'bottom'), [obj, data.target])

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
      // only play the closing animation if this folder was actually opened
      a.timeScale = -1
      a.paused = false
      a.play()
    }
  }, [active, actions, names])

  const label = useMemo(
    () => makeLabelTexture(`EXHIBIT ${data.no}`, t(`exhibits.${data.key}.title`)),
    [data.no, data.key, t],
  )

  const lift = useRef()
  return (
    <Interactive kind="folder" position={data.position} rotation={data.rotation} onClick={() => openExhibit(data.id)}>
      {(hovered) => (
        <group ref={lift} position={[0, hovered || active ? 0.03 : 0, 0]} scale={hovered ? 1.04 : 1}>
          <primitive object={obj} scale={scale} position={position} />
          <mesh position={[0, 0.055, 0.06]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.34, 0.17]} />
            <meshBasicMaterial map={label} transparent toneMapped={false} />
          </mesh>
        </group>
      )}
    </Interactive>
  )
}

useGLTF.preload(URL)
