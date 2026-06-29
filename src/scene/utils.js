import * as THREE from 'three'

// Fit any loaded scene to a target max-dimension and re-anchor it.
// Returns { scale, position } to apply to a wrapper <primitive/>, so the
// model sits predictably regardless of its original export transform.
export function fit(object3d, target = 1, anchor = 'bottom') {
  object3d.updateMatrixWorld(true)
  const box = new THREE.Box3().setFromObject(object3d)
  const size = new THREE.Vector3()
  const center = new THREE.Vector3()
  box.getSize(size)
  box.getCenter(center)
  const maxAxis = Math.max(size.x, size.y, size.z) || 1
  const scale = target / maxAxis

  const position = [-center.x * scale, -center.y * scale, -center.z * scale]
  if (anchor === 'bottom') position[1] = -box.min.y * scale
  if (anchor === 'top') position[1] = -box.max.y * scale
  return { scale, position }
}

// Apply warm, slightly aged material tweaks shared across props.
export function warmify(root, { env = 0.25 } = {}) {
  root.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = true
      o.receiveShadow = true
      const m = o.material
      if (m && 'envMapIntensity' in m) m.envMapIntensity = env
    }
  })
}

// Draw a printed paper label (folder tab) to a canvas → CanvasTexture.
// No external font files required; uses the loaded typewriter face if present.
export function makeLabelTexture(code, title, { w = 512, h = 256 } = {}) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')

  // aged paper
  ctx.fillStyle = '#e8e2d4'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = 'rgba(120,96,54,0.10)'
  for (let i = 0; i < 240; i++) {
    ctx.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5)
  }

  // red top rule
  ctx.fillStyle = '#c0392b'
  ctx.fillRect(0, 0, w, 12)

  ctx.fillStyle = '#1a160e'
  ctx.textBaseline = 'middle'
  ctx.font = '700 92px "Oswald", Impact, sans-serif'
  ctx.fillText(code, 26, 96)

  ctx.font = '28px "Special Elite", monospace'
  ctx.fillStyle = '#3a3327'
  wrapText(ctx, title.toUpperCase(), 26, 168, w - 52, 34)

  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ')
  let line = ''
  let yy = y
  for (const word of words) {
    const test = line + word + ' '
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line.trim(), x, yy)
      line = word + ' '
      yy += lineHeight
    } else {
      line = test
    }
  }
  ctx.fillText(line.trim(), x, yy)
}
