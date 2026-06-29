import { create } from 'zustand'

// Single source of truth for the experience.
// `focus` drives the camera rig; `overlay` + `activeExhibit` drive the DOM panels.
export const useStore = create((set, get) => ({
  // ── flow ────────────────────────────────────────────────
  progress: 0, // 0..1 asset load
  ready: false, // assets sufficiently loaded
  entered: false, // user passed the newspaper intro

  setProgress: (p) => set({ progress: Math.max(get().progress, p) }),
  setReady: (b = true) => set({ ready: b }),
  enter: () => set({ entered: true }),

  // ── navigation ──────────────────────────────────────────
  overlay: null, // null | 'exhibit' | 'contact' | 'credits'
  activeExhibit: null, // exhibit id when overlay === 'exhibit'
  focus: null, // camera focus target id (exhibit id | 'phone' | 'board' | null)

  openExhibit: (id) => set({ overlay: 'exhibit', activeExhibit: id, focus: id }),
  openContact: () => set({ overlay: 'contact', activeExhibit: null, focus: 'phone' }),
  openCredits: () => set({ overlay: 'credits', activeExhibit: null, focus: 'board' }),
  closeOverlay: () => set({ overlay: null, activeExhibit: null, focus: null }),

  // ── hover / tooltip ─────────────────────────────────────
  hovered: null, // { kind, label? }  — kind matches i18n tooltips.*
  setHovered: (h) => set({ hovered: h }),

  // ── settings ────────────────────────────────────────────
  quality: 'high', // 'high' | 'performance'
  toggleQuality: () => set({ quality: get().quality === 'high' ? 'performance' : 'high' }),

  muted: true,
  toggleMuted: () => set({ muted: !get().muted }),
}))

// Debug hook: expose the store for automated screenshots / manual poking.
// Enabled in dev, or on any URL carrying ?debug.
if (typeof window !== 'undefined') {
  const enable = import.meta.env.DEV || new URLSearchParams(window.location.search).has('debug')
  if (enable) window.__store = useStore
}
