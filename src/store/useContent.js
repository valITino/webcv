import { create } from 'zustand'
import { profile as defaults } from '../data/profile.js'

// Static-site "CMS": the visitor-facing profile/contact content is the defaults
// from src/data overlaid with edits made in the in-browser admin and persisted
// to localStorage. No backend — content is editable live and exportable as JSON.
const KEY = 'vt_content'
const clone = (o) => JSON.parse(JSON.stringify(o))

function deepMerge(base, over) {
  const out = clone(base)
  for (const k in over) {
    const v = over[k]
    if (v && typeof v === 'object' && !Array.isArray(v) && out[k] && typeof out[k] === 'object') {
      out[k] = deepMerge(out[k], v)
    } else {
      out[k] = v
    }
  }
  return out
}

function setPath(obj, path, value) {
  const keys = path.split('.')
  let o = obj
  for (let i = 0; i < keys.length - 1; i++) {
    if (!o[keys[i]] || typeof o[keys[i]] !== 'object') o[keys[i]] = {}
    o = o[keys[i]]
  }
  o[keys[keys.length - 1]] = value
}

function loadOverrides() {
  if (typeof localStorage === 'undefined') return {}
  try {
    // stored "null"/scalars parse fine but aren't usable overrides
    const parsed = JSON.parse(localStorage.getItem(KEY) || '{}')
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}
  } catch {
    return {}
  }
}

const initialOverrides = loadOverrides()

export const useContent = create((set, get) => ({
  profile: deepMerge(defaults, initialOverrides.profile || {}),
  overrides: initialOverrides,
  adminOpen: typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('admin'),

  setAdmin: (open) => set({ adminOpen: open }),

  // Edit a single profile field by dot-path; persists immediately.
  setField: (path, value) => {
    const overrides = clone(get().overrides)
    if (!overrides.profile) overrides.profile = {}
    setPath(overrides.profile, path, value)
    set({ overrides, profile: deepMerge(defaults, overrides.profile) })
    try {
      localStorage.setItem(KEY, JSON.stringify(overrides))
    } catch {
      /* storage unavailable */
    }
  },

  reset: () => {
    try {
      localStorage.removeItem(KEY)
    } catch {
      /* ignore */
    }
    set({ overrides: {}, profile: clone(defaults) })
  },

  exportJSON: () => JSON.stringify(get().profile, null, 2),

  importJSON: (str) => {
    try {
      const data = JSON.parse(str)
      // a scalar or array would silently corrupt every profile consumer
      if (!data || typeof data !== 'object' || Array.isArray(data)) return false
      const overrides = { profile: data }
      set({ overrides, profile: deepMerge(defaults, data) })
      localStorage.setItem(KEY, JSON.stringify(overrides))
      return true
    } catch {
      return false
    }
  },
}))
