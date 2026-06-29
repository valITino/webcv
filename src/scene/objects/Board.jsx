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
      if (o.isMesh && o.material) {
        o.castShadow = false // backdrop shouldn't cast onto desk
        o.material.side = THREE.DoubleSide // show whichever face points at us
        // Self-illuminate the baked detective art so the board reads as a rich,
        // legible backdrop (KH-style) instead of vanishing into the noir shadow.
        if (o.material.map) {
          o.material.emissive = new THREE.Color('#ffffff')
          o.material.emissiveMap = o.material.map
          o.material.emissiveIntensity = 0.32
          o.material.needsUpdate = true
        }
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
