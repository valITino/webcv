// World layout. The desk's TOP surface is anchored to y = 0, so every prop
// sits at y ≈ 0. z- is into the screen (toward the board), z+ is toward camera.
import { EXHIBITS } from '../data/registry.js'

export const DESK = { target: 3.7, anchor: 'top' }

export const BOARD = {
  // The board's flat face points along X in the source model → rotate 90° on Y
  // so the large face turns toward the camera as a backdrop behind the desk.
  position: [0, 0.04, -1.7],
  rotation: [0, Math.PI / 2, 0],
  target: 3.5,
  anchor: 'bottom',
}

// Six case-file folders fanned across the desktop, one per exhibit (A–F).
const FAN = [
  { x: -1.42, z: 0.12, ry: 0.16, y: 0.0 },
  { x: -0.86, z: 0.34, ry: 0.08, y: 0.012 },
  { x: -0.28, z: 0.46, ry: -0.02, y: 0.024 },
  { x: 0.3, z: 0.46, ry: 0.04, y: 0.036 },
  { x: 0.88, z: 0.32, ry: -0.1, y: 0.024 },
  { x: 1.44, z: 0.1, ry: -0.18, y: 0.012 },
]

export const FOLDERS = EXHIBITS.map((ex, i) => ({
  ...ex,
  position: [FAN[i].x, FAN[i].y, FAN[i].z],
  rotation: [0, FAN[i].ry, 0],
  target: 0.62,
}))

export const PROPS = {
  coffee: { position: [1.28, 0, 0.5], target: 0.2, kind: 'coffee' },
  lamp: { position: [-1.42, 0, -0.42], target: 1.0, kind: 'lamp' },
  phone: { position: [-0.98, 0, 0.52], rotation: [0, 0.5, 0], target: 0.34, kind: 'phone' },
  monitor: { position: [0.05, 0, -0.86], rotation: [0, 0, 0], target: 0.95, kind: 'monitor' },
  magnifier: { position: [0.58, 0.0, 0.62], rotation: [0, 0.6, 0], target: 0.34, kind: 'magnifier' },
  keys: { position: [-0.42, 0, 0.66], target: 0.2, kind: 'keys' },
}

// Camera poses. CAMERA.overview is the resting desk shot; focus poses frame
// each interactive target while the document panel is docked to one side.
export const CAMERA = {
  overview: { pos: [0, 1.7, 3.7], target: [0, 0.32, -0.35] },
  // dolly toward each folder; panel covers the left, so bias camera right
  folder: (x, z) => ({ pos: [x * 0.45 + 0.35, 0.92, 1.7], target: [x, 0.02, z] }),
  phone: { pos: [-0.2, 0.78, 1.5], target: [-0.98, 0.02, 0.52] },
  board: { pos: [0.1, 0.95, 2.25], target: [0, 0.7, -1.4] },
}

export function focusPose(focus) {
  if (!focus) return CAMERA.overview
  if (focus === 'phone') return CAMERA.phone
  if (focus === 'board') return CAMERA.board
  const f = FOLDERS.find((x) => x.id === focus)
  if (f) return CAMERA.folder(f.position[0], f.position[2])
  return CAMERA.overview
}
