// World layout. The desk's TOP surface is anchored to y = 0, so every prop
// sits at y ≈ 0. z- is into the screen (toward the board), z+ is toward camera.
import { EXHIBITS } from '../data/registry.js'

export const DESK = { target: 3.7, anchor: 'top' }

export const BOARD = {
  // The board's detective texture sits on its +X face → rotate -90° on Y so the
  // FRONT face turns toward the camera (else the baked text renders mirrored).
  position: [0, 0.05, -1.66],
  rotation: [0, -Math.PI / 2, 0],
  target: 3.0,
  anchor: 'bottom',
}

// Six case-file folders fanned across the desktop, one per exhibit (A–F).
const FAN = [
  { x: -1.08, z: 0.2, ry: 0.17, y: 0.0 },
  { x: -0.66, z: 0.38, ry: 0.08, y: 0.012 },
  { x: -0.22, z: 0.48, ry: -0.02, y: 0.024 },
  { x: 0.22, z: 0.48, ry: 0.02, y: 0.036 },
  { x: 0.66, z: 0.38, ry: -0.08, y: 0.024 },
  { x: 1.08, z: 0.2, ry: -0.17, y: 0.012 },
]

export const FOLDERS = EXHIBITS.map((ex, i) => ({
  ...ex,
  position: [FAN[i].x, FAN[i].y, FAN[i].z],
  rotation: [0, FAN[i].ry, 0],
  target: 0.62,
}))

export const PROPS = {
  coffee: { position: [1.22, 0, 0.54], target: 0.2, kind: 'coffee' },
  // GLB props
  lamp: { position: [-1.3, 0, -0.32], rotation: [0, 0.5, 0], target: 0.62, kind: 'lamp' },
  phone: { position: [-1.0, 0, 0.5], rotation: [0, 0.6, 0], target: 0.34, kind: 'phone' },
  magnifier: { position: [0.56, 0.0, 0.58], rotation: [0, 0.5, 0], target: 0.34, kind: 'magnifier' },
  monitor: { position: [0.05, 0, -0.4], rotation: [0, 0, 0], target: 0.75, kind: 'monitor' },
  keys: { position: [-0.42, 0, 0.66], rotation: [0, 0.4, 0], target: 0.2, kind: 'keys' },
  supplies: { position: [-1.5, 0, 0.45], rotation: [0, 0.35, 0], target: 0.46, kind: 'supplies' },
  // Two LEGO "guardians" flank the terminal: Vader back-left, Yoda back-right.
  yoda: { position: [0.74, 0, -0.2], rotation: [0, 0.5, 0], target: 0.32, kind: 'yoda' },
  vader: { position: [-0.66, 0, -0.5], rotation: [0, 0.5, 0], target: 0.34, kind: 'vader' },
}

// Camera poses. CAMERA.overview is the resting desk shot — low and across the
// desk (sitting-at-the-desk intimacy, matching the reference). A clicked folder
// opens flat in place and the camera dives toward it from the front/above.
export const CAMERA = {
  overview: { pos: [0, 0.96, 2.45], target: [0, 0.06, -0.95] },
  folder: (x, z) => ({ pos: [x * 0.4, 0.66, z + 1.18], target: [x, 0.0, z + 0.05] }),
  phone: { pos: [-0.35, 0.6, 1.35], target: [-0.98, 0.02, 0.52] },
  board: { pos: [0.05, 0.95, 1.95], target: [0, 0.7, -1.5] },
}

export function focusPose(focus) {
  if (!focus) return CAMERA.overview
  if (focus === 'phone') return CAMERA.phone
  if (focus === 'board') return CAMERA.board
  const f = FOLDERS.find((x) => x.id === focus)
  if (f) return CAMERA.folder(f.position[0], f.position[2]) // dive to the opened folder
  return CAMERA.overview
}
