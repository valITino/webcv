import { useEffect } from 'react'
import { useProgress } from '@react-three/drei'
import Lighting from './Lighting.jsx'
import CameraRig from './CameraRig.jsx'
import Effects from './Effects.jsx'
import Desk from './objects/Desk.jsx'
import Board from './objects/Board.jsx'
import Folder from './objects/Folder.jsx'
import Coffee from './objects/Coffee.jsx'
import { Lamp, Phone, Monitor, Magnifier, Keys } from './objects/Props.jsx'
import BoardPins from './objects/BoardPins.jsx'
import { FOLDERS } from './layout.js'
import { useStore } from '../store/useStore.js'

export default function Scene() {
  const setProgress = useStore((s) => s.setProgress)
  const setReady = useStore((s) => s.setReady)
  const { progress, active } = useProgress()

  useEffect(() => {
    setProgress(progress / 100)
    if (!active && progress >= 100) setReady(true)
  }, [progress, active, setProgress, setReady])

  return (
    <>
      <Lighting />
      <CameraRig />

      <group>
        <Desk />
        <Board />
        <BoardPins />
        {FOLDERS.map((f) => (
          <Folder key={f.id} data={f} />
        ))}
        <Coffee />
        <Lamp />
        <Phone />
        <Monitor />
        <Magnifier />
        <Keys />
      </group>

      {/* dark floor to ground the desk legs + catch the lamp shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.52, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#0a0908" roughness={1} />
      </mesh>

      <Effects />
    </>
  )
}
