import { Component } from 'react'
import { useTranslation } from 'react-i18next'

function Fallback() {
  const { t } = useTranslation()
  return (
    <div className="grain fixed inset-0 flex items-center justify-center bg-ink px-6 text-center" style={{ cursor: 'auto' }}>
      <div className="relative max-w-md">
        <p className="hud-chip mb-3 text-redink glow-red">{t('error.title')}</p>
        <p className="font-ui text-sm leading-relaxed text-paper/70">{t('error.body')}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 border border-redink/70 bg-ink/80 px-6 py-2.5 font-hud text-[11px] uppercase tracking-[0.2em] text-paper transition-colors hover:bg-redink"
        >
          {t('error.reload')}
        </button>
      </div>
    </div>
  )
}

// The R3F Canvas has no built-in recovery: a WebGL/context failure would
// otherwise unmount the whole app into a permanent blank screen.
export default class CanvasBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? <Fallback /> : this.props.children
  }
}
