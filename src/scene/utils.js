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

// Redraw the vintage terminal's screen with a phosphor readout for THIS case.
// The screen is a small rotated rect inside the monitor's shared texture atlas
// (UV rect measured from the GLB's TEXCOORD_0 for Material.002); the rest of
// the atlas is preserved pixel-for-pixel. Returned texture replaces both the
// base and emissive maps so the readout glows.
export function makeScreenTexture(srcTex, { caseNo = 'VT-8305' } = {}) {
  const img = srcTex?.image
  if (!img || !img.width) return null
  const c = document.createElement('canvas')
  c.width = img.width
  c.height = img.height
  const ctx = c.getContext('2d')
  ctx.drawImage(img, 0, 0, c.width, c.height)

  // measured screen UV rect (glTF V axis: no flip)
  const rx = 0.01 * c.width
  const ry = 0.4525 * c.height
  const rw = (0.1631 - 0.01) * c.width
  const rh = (0.6803 - 0.4525) * c.height

  ctx.save()
  ctx.beginPath()
  ctx.rect(rx, ry, rw, rh)
  ctx.clip()
  ctx.fillStyle = '#031008'
  ctx.fillRect(rx, ry, rw, rh)

  // The baked screen content sits rotated 90° AND mirrored in the atlas (the
  // mesh UVs flip it back). Rotate, then mirror x — the reflection and the
  // negated anchors cancel, so line coordinates below read naturally.
  ctx.translate(rx + rw / 2, ry + rh / 2)
  ctx.rotate(Math.PI / 2)
  ctx.scale(-1, 1)
  const W = rh // writing-space width
  const lines = [
    ['KAPO-BE // CYBERCRIME UNIT', '#8fe8c8'],
    ['TRACE SESSION — ACTIVE', '#5ad3ae'],
    ['──────────────────────', '#2c7a5e'],
    [`SUBJ  V. TOTARO`, '#7df0c9'],
    [`FILE  ${caseNo}`, '#7df0c9'],
    ['STAT  AT LARGE', '#ffb46b'],
    ['EXHB  A–F LOGGED', '#7df0c9'],
    ['LINK  SECURE', '#5ad3ae'],
    ['> _', '#b7ffe3'],
  ]
  ctx.font = '700 15px "Courier New", monospace'
  ctx.textBaseline = 'top'
  lines.forEach(([txt, col], i) => {
    ctx.fillStyle = col
    ctx.fillText(txt, -W / 2 + 12, -rw / 2 + 10 + i * 15.5)
  })
  // CRT scanlines along the text rows
  ctx.fillStyle = 'rgba(0,0,0,0.28)'
  for (let y = -rw / 2; y < rw / 2; y += 3) ctx.fillRect(-W / 2, y, W, 1)
  ctx.restore()

  const tex = new THREE.CanvasTexture(c)
  tex.flipY = false
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

// Typed case-report sheet (A4) revealed when a folder opens — the "typed
// report" of the hybrid design: typewriter face on in-world paper only.
export function makeReportTexture(code, title, { caseNo = '' } = {}) {
  const w = 512
  const h = 724
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')

  ctx.fillStyle = '#e6dfca'
  ctx.fillRect(0, 0, w, h)
  const vg = ctx.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, h * 0.75)
  vg.addColorStop(0, 'rgba(120,96,54,0)')
  vg.addColorStop(1, 'rgba(96,74,40,0.20)')
  ctx.fillStyle = vg
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = 'rgba(120,96,54,0.10)'
  for (let i = 0; i < 300; i++) ctx.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5)

  ctx.fillStyle = '#3a3327'
  ctx.textAlign = 'center'
  ctx.font = '20px "Special Elite", monospace'
  ctx.fillText('KANTONSPOLIZEI — CONFIDENTIAL', w / 2, 58)
  ctx.font = '16px "Special Elite", monospace'
  ctx.fillText(`CASE ${caseNo}`, w / 2, 86)

  ctx.fillStyle = '#1a160e'
  ctx.font = '34px "Special Elite", monospace'
  ctx.fillText(code, w / 2, 138)
  ctx.font = '19px "Special Elite", monospace'
  ctx.fillStyle = '#2e2a20'
  ctx.fillText(title.toUpperCase(), w / 2, 168)

  ctx.strokeStyle = 'rgba(58,51,39,0.6)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(60, 192)
  ctx.lineTo(w - 60, 192)
  ctx.stroke()

  // typed body with redactions
  ctx.textAlign = 'left'
  ctx.font = '17px "Special Elite", monospace'
  ctx.fillStyle = '#2e2a20'
  const body = [
    'field notes, transcribed:',
    '',
    'subject observed maintaining a',
    'home lab of unusual persistence.',
    '@REDACT',
    'approach with strong coffee and',
    'a well-formed question.',
    '',
    'witnesses describe the subject:',
    '"thorough. annoyingly so."',
    '@REDACT',
    'recommend immediate interview.',
  ]
  let yy = 236
  for (const line of body) {
    if (line === '@REDACT') {
      ctx.fillStyle = '#141210'
      ctx.fillRect(64, yy - 14, w - 148, 20)
      ctx.fillStyle = '#2e2a20'
    } else {
      ctx.fillText(line, 64, yy)
    }
    yy += 30
  }

  ctx.font = '16px "Special Elite", monospace'
  ctx.fillStyle = '#3a3327'
  ctx.fillText('FILED BY: V.T.', 64, h - 74)
  ctx.fillText('DO NOT CIRCULATE', 64, h - 48)

  // oxblood EVIDENCE stamp, worn
  ctx.save()
  ctx.translate(w - 128, h - 92)
  ctx.rotate(-0.12)
  ctx.font = '700 26px "Oswald", Impact, sans-serif'
  ctx.textAlign = 'center'
  ctx.strokeStyle = 'rgba(178,44,32,0.55)'
  ctx.fillStyle = 'rgba(178,44,32,0.58)'
  ctx.lineWidth = 3
  ctx.strokeRect(-82, -24, 164, 48)
  ctx.fillText('EVIDENCE', 0, 9)
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
