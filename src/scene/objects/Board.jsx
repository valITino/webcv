import { useMemo } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { fit, warmify } from '../utils.js'
import { BOARD } from '../layout.js'

const URL = '/models/board.glb'

export default function Board() {
  const { scene } = useGLTF(URL)
  const obj = useMemo(() => {
    warmify(scene, { env: 0.12 })
    scene.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = false // backdrop shouldn't cast onto desk
        if (o.material) o.material.side = THREE.DoubleSide // show whichever face points at us
      }
    })
    return scene
  }, [scene])
  const { scale, position } = useMemo(() => fit(obj, BOARD.target, BOARD.anchor), [obj])
  return (
    <group position={BOARD.position} rotation={BOARD.rotation}>
      <primitive object={obj} scale={scale} position={position} />
    </group>
  )
}

useGLTF.preload(URL)
