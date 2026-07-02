import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { fit, warmify } from '../utils.js'
import { DESK } from '../layout.js'

const URL = '/models/desk.glb'

export default function Desk() {
  const { scene } = useGLTF(URL)
  const obj = useMemo(() => {
    warmify(scene, { env: 0.18 })
    return scene
  }, [scene])
  const { scale, position } = useMemo(() => fit(obj, DESK.target, DESK.anchor), [obj])
  return <primitive object={obj} scale={scale} position={position} />
}

useGLTF.preload(URL)
