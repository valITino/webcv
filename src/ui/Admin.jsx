import { useEffect, useRef } from 'react'
import { useContent } from '../store/useContent.js'

// In-browser content admin (static-site CMS). Toggle with ?admin or Ctrl+Shift+E.
// Edits persist to localStorage and can be exported/imported as JSON.
const FIELDS = [
  { section: 'Identity' },
  { path: 'name', label: 'Name' },
  { path: 'alias', label: 'Alias' },
  { path: 'title', label: 'Title' },
  { path: 'dob', label: 'Date of birth' },
  { path: 'caseNo', label: 'Case №' },
  { path: 'fileRef', label: 'File ref' },
  { path: 'coords', label: 'Coordinates (HUD)' },
  { section: 'Current role' },
  { path: 'current.role', label: 'Role' },
  { path: 'current.org', label: 'Organisation' },
  { path: 'current.period', label: 'Period' },
  { path: 'current.summary', label: 'Summary', area: true },
  { section: 'Location' },
  { path: 'location', label: 'Location (short)' },
  { path: 'address', label: 'Address (full)' },
  { section: 'Contact' },
  { path: 'email', label: 'Email' },
  { path: 'phone', label: 'Phone' },
  { path: 'linkedin.label', label: 'LinkedIn label' },
  { path: 'linkedin.url', label: 'LinkedIn URL' },
  { path: 'github.label', label: 'GitHub label' },
  { path: 'github.url', label: 'GitHub URL' },
]

function get(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj)
}

export default function Admin() {
  const open = useContent((s) => s.adminOpen)
  const setAdmin = useContent((s) => s.setAdmin)
  const profile = useContent((s) => s.profile)
  const setField = useContent((s) => s.setField)
  const reset = useContent((s) => s.reset)
  const exportJSON = useContent((s) => s.exportJSON)
  const importJSON = useContent((s) => s.importJSON)
  const fileRef = useRef(null)

  // Ctrl/Cmd+Shift+E toggles the admin
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'e') {
        e.preventDefault()
        setAdmin(!useContent.getState().adminOpen)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setAdmin])

  if (!open) return null

  const doExport = () => {
    const blob = new Blob([exportJSON()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'vt-content.json'
    a.click()
    URL.revokeObjectURL(url)
  }
  const doImport = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    const r = new FileReader()
    r.onload = () => importJSON(String(r.result))
    r.readAsText(f)
  }

  return (
    <div
      className="fixed right-0 top-0 z-[70] flex h-full w-[380px] flex-col border-l border-ink/40 bg-[#14120e] font-ui text-paper shadow-2xl"
      style={{ cursor: 'auto' }}
    >
      <div className="flex items-center justify-between border-b border-paper/15 px-4 py-3">
        <div>
          <p className="font-stencil text-sm tracking-[0.2em] text-lamp">CONTENT ADMIN</p>
          <p className="font-type text-[10px] uppercase tracking-widest text-paper/40">localStorage · no backend</p>
        </div>
        <button onClick={() => setAdmin(false)} className="font-type text-xs text-paper/60 hover:text-evidence">
          CLOSE ✕
        </button>
      </div>

      <div className="scroll-thin flex-1 overflow-y-auto px-4 py-3">
        {FIELDS.map((f, i) =>
          f.section ? (
            <p key={i} className="mb-1 mt-4 font-type text-[10px] uppercase tracking-[0.2em] text-evidence">
              {f.section}
            </p>
          ) : (
            <label key={i} className="mb-2 block">
              <span className="mb-0.5 block font-type text-[10px] uppercase tracking-wide text-paper/45">{f.label}</span>
              {f.area ? (
                <textarea
                  rows={3}
                  value={get(profile, f.path) ?? ''}
                  onChange={(e) => setField(f.path, e.target.value)}
                  className="w-full resize-none border border-paper/20 bg-ink/60 px-2 py-1 text-[13px] text-paper outline-none focus:border-lamp/60"
                />
              ) : (
                <input
                  value={get(profile, f.path) ?? ''}
                  onChange={(e) => setField(f.path, e.target.value)}
                  className="w-full border border-paper/20 bg-ink/60 px-2 py-1 text-[13px] text-paper outline-none focus:border-lamp/60"
                />
              )}
            </label>
          ),
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 border-t border-paper/15 p-3">
        <button onClick={doExport} className="btn-noir text-[11px]">EXPORT JSON</button>
        <button onClick={() => fileRef.current?.click()} className="btn-noir text-[11px]">IMPORT JSON</button>
        <button
          onClick={() => confirm('Reset all content to defaults?') && reset()}
          className="btn-noir col-span-2 border-evidence/50 text-[11px] text-evidence/90 hover:bg-evidence hover:text-paper"
        >
          RESET TO DEFAULTS
        </button>
        <input ref={fileRef} type="file" accept="application/json" onChange={doImport} className="hidden" />
      </div>
    </div>
  )
}
