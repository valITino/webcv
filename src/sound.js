// Tiny, asset-free Web Audio layer: a low ambient drone + a soft UI tick.
// Default silent; only audible after the user enables sound (HUD toggle).
// AudioContext must be created/resumed from a user gesture (enter click).
let ctx = null
let master = null
let ambientStarted = false

export function resume() {
  if (typeof window === 'undefined') return
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return
    ctx = new AC()
    master = ctx.createGain()
    master.gain.value = 0
    master.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') ctx.resume()
}

function startAmbient() {
  if (!ctx || ambientStarted) return
  ambientStarted = true
  // two detuned low sines through a lowpass — a warm room drone, not hiss
  const g = ctx.createGain()
  g.gain.value = 0.05
  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 380
  ;[60, 60.4].forEach((f) => {
    const o = ctx.createOscillator()
    o.type = 'sine'
    o.frequency.value = f
    o.connect(g)
    o.start()
  })
  g.connect(lp)
  lp.connect(master)
}

export function setMuted(muted) {
  resume()
  if (!ctx || !master) return
  if (!muted) startAmbient()
  master.gain.cancelScheduledValues(ctx.currentTime)
  master.gain.linearRampToValueAtTime(muted ? 0 : 0.3, ctx.currentTime + 0.5)
}

// Paper "whoosh" — a band-passed noise sweep, for lifting a folder to inspect.
export function whoosh() {
  if (!ctx || !master) return
  const dur = 0.5
  const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  const src = ctx.createBufferSource()
  src.buffer = buf
  const bp = ctx.createBiquadFilter()
  bp.type = 'bandpass'
  bp.Q.value = 0.8
  const t = ctx.currentTime
  bp.frequency.setValueAtTime(280, t)
  bp.frequency.exponentialRampToValueAtTime(2000, t + dur)
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.linearRampToValueAtTime(0.22, t + 0.06)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  src.connect(bp)
  bp.connect(g)
  g.connect(master)
  src.start(t)
  src.stop(t + dur)
}

// Soft interaction tick (file pulled, phone lifted, etc.)
export function tick() {
  if (!ctx || !master) return
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = 'triangle'
  o.frequency.value = 480
  const t = ctx.currentTime
  g.gain.setValueAtTime(0.0001, t)
  g.gain.linearRampToValueAtTime(0.5, t + 0.005)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.13)
  o.connect(g)
  g.connect(master)
  o.start(t)
  o.stop(t + 0.15)
}
