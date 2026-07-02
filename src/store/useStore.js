import { create } from 'zustand'
import * as sound from '../sound.js'

// Single source of truth for the experience.
// `focus` drives the camera rig; `overlay` + `activeExhibit` drive the DOM panels.
export const useStore = create((set, get) => ({
  // ── flow ────────────────────────────────────────────────
  progress: 0, // 0..1 asset load
  ready: false, // assets sufficiently loaded
  entered: false, // user passed the newspaper intro

  setProgress: (p) => set({ progress: Math.max(get().progress, p) }),
  setReady: (b = true) => set({ ready: b }),
  enter: () => {
    sound.resume() // prime audio on the entering click (user gesture)
    set({ entered: true })
  },

  // ── navigation ──────────────────────────────────────────
  overlay: null, // null | 'exhibit' | 'contact' | 'credits'
  activeExhibit: null, // exhibit id when overlay === 'exhibit'
  focus: null, // camera focus target id (exhibit id | 'phone' | 'board' | null)

  openExhibit: (id) => {
    if (!get().muted) sound.whoosh() // folder lifts off the desk to inspect
    set({ overlay: 'exhibit', activeExhibit: id, focus: id })
  },
  openContact: () => {
    if (!get().muted) sound.tick()
    set({ overlay: 'contact', activeExhibit: null, focus: 'phone' })
  },
  openCredits: () => {
    if (!get().muted) sound.tick()
    set({ overlay: 'credits', activeExhibit: null, focus: 'board' })
  },
  closeOverlay: () => set({ overlay: null, activeExhibit: null, focus: null }),

  // ── hover / tooltip ─────────────────────────────────────
  hovered: null, // { kind, label? }  — kind matches i18n tooltips.*
  setHovered: (h) => set({ hovered: h }),

  // ── settings ────────────────────────────────────────────
  quality: 'high', // 'high' | 'performance'
  toggleQuality: () => set({ quality: get().quality === 'high' ? 'performance' : 'high' }),

  muted: true,
  toggleMuted: () => {
    const m = !get().muted
    set({ muted: m })
    sound.setMuted(m)
  },

  // ── lamp (clickable: toggles the key light, KH-style "burn out") ─────────
  lampOn: true,
  toggleLamp: () => set({ lampOn: !get().lampOn }),

  // ── easter eggs ─────────────────────────────────────────
  ravenclaw: false, // Konami code → house-colours light + crest
  toggleRavenclaw: () => set({ ravenclaw: !get().ravenclaw }),

  flash: null, // { key, n } — a brief themed line; `key` is an i18n path
  setFlash: (key) => set({ flash: { key, n: (get().flash?.n || 0) + 1 } }),
}))

// Debug hook: expose the store for automated screenshots / manual poking.
// Enabled in dev, or on any URL carrying ?debug.
if (typeof window !== 'undefined') {
  const enable = import.meta.env.DEV || new URLSearchParams(window.location.search).has('debug')
  if (enable) window.__store = useStore
}
