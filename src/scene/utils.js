import * as THREE from 'three'

// Fit any loaded scene to a target max-dimension and re-anchor it.
// Returns { scale, position } to apply to a wrapper <primitive/>, so the
// model sits predictably regardless of its original export transform.
//
// The pristine bounding box is measured ONCE per object and cached: callers
// apply the returned transform to the same shared GLTF scene that was
// measured, so a re-measure after commit (React remounts do happen — Suspense
// re-reveals, StrictMode) would see an already-fitted box and return the
// identity transform, silently un-fitting the model.
export function fit(object3d, target = 1, anchor = 'bottom') {
  let box = object3d.userData.__fitBox
  if (!box) {
    object3d.updateMatrixWorld(true)
    box = new THREE.Box3().setFromObject(object3d)
    object3d.userData.__fitBox = box
  }
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
// Reads as a physical case-file cover sheet: aged stock, oxblood print, a
// rubber CONFIDENTIAL stamp and the case reference.
export function makeLabelTexture(code, title, { w = 512, h = 256, caseNo = '' } = {}) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')

  // aged paper with darkened edges
  ctx.fillStyle = '#e3dbc6'
  ctx.fillRect(0, 0, w, h)
  const vg = ctx.createRadialGradient(w / 2, h / 2, h * 0.35, w / 2, h / 2, w * 0.72)
  vg.addColorStop(0, 'rgba(120,96,54,0)')
  vg.addColorStop(1, 'rgba(96,74,40,0.22)')
  ctx.fillStyle = vg
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

  // case reference, bottom-right, faint typewriter
  if (caseNo) {
    ctx.font = '20px "Special Elite", monospace'
    ctx.fillStyle = 'rgba(58,51,39,0.55)'
    ctx.textAlign = 'right'
    ctx.fillText(caseNo, w - 22, h - 26)
    ctx.textAlign = 'left'
  }

  // rubber stamp — slightly rotated, worn ink
  ctx.save()
  ctx.translate(w - 118, 66)
  ctx.rotate(-0.1)
  ctx.font = '700 30px "Oswald", Impact, sans-serif'
  ctx.textAlign = 'center'
  ctx.strokeStyle = 'rgba(178,44,32,0.6)'
  ctx.fillStyle = 'rgba(178,44,32,0.62)'
  ctx.lineWidth = 3
  ctx.strokeRect(-96, -26, 192, 52)
  ctx.fillText('CONFIDENTIAL', 0, 2)
  ctx.restore()

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
