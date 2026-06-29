import { useTranslation } from 'react-i18next'
import { useStore } from '../store/useStore.js'
import { useContent } from '../store/useContent.js'
import Overlay from './Overlay.jsx'

function Line({ k, children }) {
  return (
    <div className="flex items-center gap-3 border-b border-paper/10 py-2.5">
      <span className="w-20 shrink-0 font-type text-[11px] uppercase tracking-[0.18em] text-evidence">{k}</span>
      <span className="font-ui text-sm text-paper/85">{children}</span>
    </div>
  )
}

export default function ContactTerminal() {
  const { t } = useTranslation()
  const profile = useContent((s) => s.profile)
  const overlay = useStore((s) => s.overlay)
  return (
    <Overlay open={overlay === 'contact'} align="right" maxW="max-w-lg">
      <div className="mb-5 border-b border-evidence/30 pb-4 pr-20">
        <p className="font-type text-[10px] uppercase tracking-[0.22em] text-evidence">{t('contact.ref')}</p>
        <h2 className="mt-1 font-headline text-3xl tracking-tight text-paper">{t('contact.title')}</h2>
      </div>

      <p className="mb-5 font-headline text-[15px] italic leading-relaxed text-paper/70">{t('contact.voicemail')}</p>

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

      <div className="flex items-center gap-2 border border-[#42f59b]/40 bg-[#42f59b]/[0.06] px-3 py-2">
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#42f59b]" />
        <p className="font-type text-[12px] tracking-wide text-paper/80">{t('contact.availability')}</p>
      </div>
    </Overlay>
  )
}
