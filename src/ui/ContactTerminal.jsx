import { useTranslation } from 'react-i18next'
import { useStore } from '../store/useStore.js'
import Overlay from './Overlay.jsx'
import { profile } from '../data/profile.js'

function Line({ k, children }) {
  return (
    <div className="flex items-center gap-3 border-b border-ink/15 py-2.5">
      <span className="w-20 shrink-0 font-type text-[11px] uppercase tracking-[0.18em] text-evidence">{k}</span>
      <span className="font-ui text-sm text-ink/85">{children}</span>
    </div>
  )
}

export default function ContactTerminal() {
  const { t } = useTranslation()
  const overlay = useStore((s) => s.overlay)
  return (
    <Overlay open={overlay === 'contact'} align="right" maxW="max-w-lg">
      <div className="mb-5 border-b-2 border-ink/80 pb-4">
        <p className="font-type text-[10px] uppercase tracking-[0.2em] text-evidence">{t('contact.ref')}</p>
        <h2 className="mt-1 font-stencil text-3xl font-bold uppercase tracking-tight text-ink">{t('contact.title')}</h2>
      </div>

      <p className="mb-5 font-headline text-[15px] italic leading-relaxed text-ink/75">{t('contact.voicemail')}</p>

      <div className="mb-6">
        <Line k={t('contact.email')}>
          <a href={`mailto:${profile.email}`} className="underline decoration-dotted hover:text-evidence">
            {profile.email}
          </a>
        </Line>
        <Line k={t('contact.phone')}>
          <a href={`tel:${profile.phone.replace(/\s/g, '')}`} className="underline decoration-dotted hover:text-evidence">
            {profile.phone}
          </a>
        </Line>
        <Line k={t('contact.location')}>{profile.address}</Line>
        <Line k="LinkedIn">
          <a href={profile.linkedin.url} target="_blank" rel="noreferrer" className="underline decoration-dotted hover:text-evidence">
            {profile.linkedin.label}
          </a>
        </Line>
        <Line k="GitHub">
          <a href={profile.github.url} target="_blank" rel="noreferrer" className="underline decoration-dotted hover:text-evidence">
            {profile.github.label}
          </a>
        </Line>
      </div>

      <div className="flex items-center gap-2 border border-[#42f59b]/40 bg-[#42f59b]/5 px-3 py-2">
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#42f59b]" />
        <p className="font-type text-[12px] tracking-wide text-ink/75">{t('contact.availability')}</p>
      </div>
    </Overlay>
  )
}
