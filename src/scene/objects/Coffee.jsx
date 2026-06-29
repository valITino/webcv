import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { fit, warmify } from '../utils.js'
import { PROPS } from '../layout.js'
import Interactive from './Interactive.jsx'
import { useStore } from '../../store/useStore.js'

const URL = '/models/coffee.glb'

export default function Coffee() {
  const { scene } = useGLTF(URL)
  const setFlash = useStore((s) => s.setFlash)
  const obj = useMemo(() => {
    warmify(scene, { env: 0.3 })
    return scene
  }, [scene])
  const { scale, position } = useMemo(() => fit(obj, PROPS.coffee.target, 'bottom'), [obj])
  return (
    <Interactive kind="coffee" position={PROPS.coffee.position} onClick={() => setFlash('easter.coffee')}>
      {(hovered) => (
        <group scale={hovered ? 1.05 : 1}>
          <primitive object={obj} scale={scale} position={position} />
        </group>
      )}
    </Interactive>
  )
}

useGLTF.preload(URL)
