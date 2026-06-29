import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../store/useStore.js'
import Overlay from './Overlay.jsx'
import Stars from './Stars.jsx'
import { getExhibit } from '../data/registry.js'
import { useContent } from '../store/useContent.js'
import { techSkills, softSkills } from '../data/skills.js'
import { experience, certificates, education, projects, testimonials } from '../data/exhibits.js'

const FLAGS = { IT: '🇮🇹', RS: '🇷🇸', CH: '🇨🇭', de: '🇩🇪', en: '🇬🇧', fr: '🇫🇷' }

function Header({ no, code, title }) {
  const { t } = useTranslation()
  return (
    <div className="mb-6 border-b-2 border-ink/80 pb-4">
      <div className="flex items-center justify-between font-type text-[10px] uppercase tracking-[0.2em] text-evidence">
        <span>
          {t('panel.exhibit')} — {no}
        </span>
        <span className="text-ink/50">{code}</span>
      </div>
      <h2 className="mt-1 font-stencil text-3xl font-bold uppercase tracking-tight text-ink md:text-4xl">{title}</h2>
    </div>
  )
}

function Label({ children }) {
  return <p className="mb-2 font-type text-[11px] uppercase tracking-[0.2em] text-evidence">{children}</p>
}

// ── per-exhibit content ───────────────────────────────────
function Subject() {
  const { t } = useTranslation()
  const profile = useContent((s) => s.profile)
  return (
    <div className="space-y-6 text-ink/85">
      <div className="flex flex-col gap-5 sm:flex-row">
        <div className="w-32 shrink-0 border-4 border-ink bg-paperdark p-1">
          <img
            src="/images/portrait.png"
            alt={profile.name}
            className="block w-full"
            style={{ filter: 'grayscale(1) contrast(1.2) brightness(0.95) sepia(0.15)' }}
          />
          <p className="bg-ink py-0.5 text-center font-type text-[8px] tracking-widest text-paper">{profile.caseNo}</p>
        </div>
        <div className="font-ui text-sm">
          <p className="font-headline text-2xl text-ink">{profile.name}</p>
          <p className="font-type text-xs uppercase tracking-[0.2em] text-evidence">{profile.title}</p>
          <dl className="mt-3 space-y-1.5">
            <Row k={t('panel.current')} v={`${profile.current.org} · ${profile.current.period}`} />
            <Row k="DOB" v={profile.dob} />
            <Row k="LOC" v={profile.location} />
            <Row k={t('panel.nationalities')} v={profile.nationalities.map((n) => FLAGS[n]).join('  ')} />
          </dl>
        </div>
      </div>

      <div>
        <Label>{t('panel.languages')}</Label>
        <ul className="space-y-1.5 font-ui text-sm">
          {profile.languages.map((l) => (
            <li key={l.lang} className="flex flex-wrap items-baseline gap-x-2">
              <span className="font-semibold text-ink">{l.lang}</span>
              <span className="font-type text-[11px] uppercase tracking-widest text-evidence">{l.level}</span>
              <span className="italic text-ink/60">{l.exhibit}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <Label>{t('panel.hobbies')}</Label>
        <div className="flex flex-wrap gap-2">
          {profile.hobbies.map((h) => (
            <span key={h} className="border border-ink/30 px-2 py-1 font-type text-[11px] text-ink/70">
              {h}
            </span>
          ))}
        </div>
      </div>

      <div className="border-l-2 border-evidence/60 pl-4">
        <Label>{t('panel.statement')}</Label>
        {profile.manifesto.map((p, i) => (
          <p key={i} className="mb-3 font-headline text-[15px] italic leading-relaxed text-ink/80">
            {p}
          </p>
        ))}
        <p className="text-right font-type text-xs tracking-widest text-ink/60">{profile.manifestoSign}</p>
      </div>
    </div>
  )
}

function Row({ k, v }) {
  return (
    <div className="flex gap-3">
      <dt className="w-20 shrink-0 font-type text-[11px] uppercase tracking-widest text-ink/45">{k}</dt>
      <dd className="text-ink/85">{v}</dd>
    </div>
  )
}

function SkillGroup({ group, items }) {
  return (
    <div className="mb-4 break-inside-avoid">
      <p className="mb-1.5 font-stencil text-sm font-semibold uppercase tracking-wide text-ink">{group}</p>
      <ul className="space-y-1">
        {items.map(([name, val]) => (
          <li key={name} className="flex items-center justify-between gap-3 text-[13px] text-ink/80">
            <span>{name}</span>
            <Stars value={val} />
          </li>
        ))}
      </ul>
    </div>
  )
}

function Skills() {
  const { t } = useTranslation()
  const [tab, setTab] = useState('tech')
  const data = tab === 'tech' ? techSkills : softSkills
  return (
    <div>
      <div className="mb-5 flex gap-2">
        {[
          ['tech', t('panel.tech')],
          ['soft', t('panel.soft')],
        ].map(([id, lbl]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-4 py-1.5 font-type text-[11px] uppercase tracking-[0.18em] transition-colors ${
              tab === id ? 'bg-ink text-paper' : 'border border-ink/30 text-ink/60 hover:border-ink/60'
            }`}
          >
            {lbl}
          </button>
        ))}
      </div>
      <div className="columns-1 gap-8 sm:columns-2">
        {data.map((g) => (
          <SkillGroup key={g.group} {...g} />
        ))}
      </div>
    </div>
  )
}

function Record() {
  return (
    <ol className="relative space-y-5 border-l-2 border-ink/25 pl-5">
      {experience.map((e, i) => (
        <li key={i} className="relative">
          <span className="absolute -left-[27px] top-1.5 h-3 w-3 rounded-full border-2 border-paper bg-evidence" />
          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
            <h3 className="font-stencil text-lg font-semibold uppercase text-ink">{e.role}</h3>
            {e.current && (
              <span className="border border-evidence px-1.5 py-0.5 font-type text-[9px] uppercase tracking-widest text-evidence">
                ACTIVE
              </span>
            )}
          </div>
          <p className="font-type text-[12px] uppercase tracking-wide text-evidence/90">
            {e.org} · {e.period}
          </p>
          <ul className="mt-1.5 list-disc space-y-0.5 pl-4 text-[13px] text-ink/75">
            {e.points.map((p, j) => (
              <li key={j}>{p}</li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  )
}

function Credentials() {
  const { t } = useTranslation()
  const badge = { 'in-progress': t('panel.inProgress'), completed: t('panel.completed'), planned: t('panel.planned') }
  return (
    <div className="space-y-7">
      <div>
        <Label>{t('panel.certificates')}</Label>
        <ul className="space-y-3">
          {certificates.map((c, i) => (
            <li key={i} className="border-l-2 border-ink/20 pl-3">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <h4 className="font-semibold text-ink">{c.title}</h4>
                <span className="font-type text-[11px] tracking-wide text-ink/50">{c.date}</span>
              </div>
              <p className="font-type text-[11px] uppercase tracking-wide text-evidence/90">{c.issuer}</p>
              {c.detail && <p className="mt-0.5 text-[12px] leading-snug text-ink/70">{c.detail}</p>}
              {c.verify && (
                <a
                  href={`https://${c.verify}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-type text-[11px] tracking-wide text-cyber underline decoration-dotted hover:text-evidence"
                >
                  {t('panel.verify')} ↗
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <Label>{t('panel.education')}</Label>
        <ul className="space-y-3">
          {education.map((e, i) => (
            <li key={i} className="border-l-2 border-ink/20 pl-3">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <h4 className="font-semibold text-ink">{e.program}</h4>
                <span className="border border-ink/30 px-1.5 font-type text-[9px] uppercase tracking-widest text-ink/55">
                  {badge[e.status] || e.status}
                </span>
              </div>
              <p className="font-type text-[11px] uppercase tracking-wide text-evidence/90">
                {e.school} · {e.period}
              </p>
              {e.detail && <p className="mt-0.5 text-[12px] leading-snug text-ink/70">{e.detail}</p>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function Cases() {
  const { t } = useTranslation()
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {projects.map((p, i) => (
        <div key={i} className="flex flex-col border border-ink/20 bg-paper/40 p-3">
          <div className="mb-1 flex items-baseline justify-between gap-2">
            <h4 className="font-stencil text-base font-semibold uppercase text-ink">{p.name}</h4>
            <span className="font-type text-[9px] uppercase tracking-widest text-ink/40">{String(i + 1).padStart(2, '0')}</span>
          </div>
          <p className="flex-1 text-[12px] leading-snug text-ink/75">{p.blurb}</p>
          <p className="mt-2 font-type text-[11px] tracking-wide text-ink/50">{p.repo}</p>
          {p.url && (
            <a
              href={p.url}
              target="_blank"
              rel="noreferrer"
              className="mt-1 font-type text-[11px] uppercase tracking-widest text-cyber underline decoration-dotted hover:text-evidence"
            >
              {t('panel.open')} ↗
            </a>
          )}
        </div>
      ))}
    </div>
  )
}

function Testimonials() {
  return (
    <div className="space-y-4">
      {testimonials.map((tm, i) => (
        <figure
          key={i}
          className={`border-l-4 pl-4 ${tm.onRequest ? 'border-ink/30' : 'border-evidence/60'}`}
        >
          <blockquote className="font-headline text-[15px] italic leading-relaxed text-ink/85">“{tm.quote}”</blockquote>
          {!tm.onRequest && (
            <figcaption className="mt-1.5 font-type text-[11px] uppercase tracking-wide text-ink/55">
              {tm.org}
              {tm.role ? ` — ${tm.role}` : ''} · {tm.by} · {tm.date}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  )
}

const CONTENT = {
  subject: Subject,
  skills: Skills,
  record: Record,
  credentials: Credentials,
  cases: Cases,
  testimonials: Testimonials,
}

export default function ExhibitPanel() {
  const { t } = useTranslation()
  const overlay = useStore((s) => s.overlay)
  const id = useStore((s) => s.activeExhibit)
  const ex = getExhibit(id)
  const open = overlay === 'exhibit' && !!ex
  const Body = ex ? CONTENT[ex.id] : null

  return (
    <Overlay open={open} align="left" maxW="max-w-2xl">
      {ex && (
        <>
          <Header no={ex.no} code={t(`exhibits.${ex.key}.code`)} title={t(`exhibits.${ex.key}.title`)} />
          {Body && <Body />}
        </>
      )}
    </Overlay>
  )
}
