import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../store/useStore.js'
import Overlay from './Overlay.jsx'
import Stars from './Stars.jsx'
import { getExhibit } from '../data/registry.js'
import { useContent } from '../store/useContent.js'
import { techSkills, softSkills } from '../data/skills.js'
import { experience, examPrep, certificates, education, projects, testimonials } from '../data/exhibits.js'

const FLAGS = { IT: '🇮🇹', RS: '🇷🇸', CH: '🇨🇭', de: '🇩🇪', en: '🇬🇧', fr: '🇫🇷' }

function Header({ no, code, title }) {
  const { t } = useTranslation()
  return (
    <div className="mb-7 border-b border-redink/30 pb-4 pr-20">
      <div className="flex items-center justify-between font-hud text-[10px] uppercase tracking-[0.22em]">
        <span className="text-redink glow-red">
          {t('panel.exhibit')} — {no}
        </span>
        <span className="text-paper/40">{code}</span>
      </div>
      <h2 className="mt-2 font-headline text-3xl tracking-tight text-paper md:text-4xl">{title}</h2>
    </div>
  )
}

function Label({ children }) {
  return <p className="mb-2 font-hud text-[11px] uppercase tracking-[0.22em] text-redink">{children}</p>
}

// Red square-numbered serif sub-heading (KH "■01 Mission Log" style).
function SecHead({ n, children }) {
  return (
    <div className="mb-3 flex items-center gap-2.5">
      <span className="grid h-5 w-5 place-items-center bg-redink font-hud text-[10px] font-bold text-paper shadow-[0_0_10px_rgba(255,42,42,0.5)]">{n}</span>
      <h3 className="font-headline text-xl text-paper">{children}</h3>
    </div>
  )
}

// ── per-exhibit content ───────────────────────────────────
function Subject() {
  const { t } = useTranslation()
  const profile = useContent((s) => s.profile)
  return (
    <div className="space-y-6 text-paper/80">
      <div className="flex flex-col gap-5 sm:flex-row">
        <div className="w-32 shrink-0 border border-paper/20 bg-black/40 p-1">
          <img
            src="/images/portrait.png"
            alt={profile.name}
            className="block w-full"
            style={{ filter: 'grayscale(1) contrast(1.15) brightness(0.92)' }}
          />
          <p className="bg-redink py-0.5 text-center font-hud text-[8px] tracking-widest text-paper">{profile.caseNo}</p>
        </div>
        <div className="font-ui text-sm">
          <p className="font-headline text-2xl text-paper">{profile.name}</p>
          <p className="font-hud text-xs uppercase tracking-[0.2em] text-redink">{profile.title}</p>
          <dl className="mt-3 space-y-1.5">
            <Row k={t('panel.current')} v={`${profile.current.org} · ${profile.current.period}`} />
            <Row k={t('panel.dob')} v={profile.dob} />
            <Row k={t('panel.loc')} v={profile.location} />
            <Row k={t('panel.nationalities')} v={profile.nationalities.map((n) => FLAGS[n]).join('  ')} />
          </dl>
        </div>
      </div>

      <div>
        <Label>{t('panel.languages')}</Label>
        <ul className="space-y-1.5 font-ui text-sm">
          {profile.languages.map((l) => (
            <li key={l.lang} className="flex flex-wrap items-baseline gap-x-2">
              <span aria-hidden>{FLAGS[l.code]}</span>
              <span className="font-semibold text-paper">{l.lang}</span>
              <span className="font-hud text-[11px] uppercase tracking-widest text-redink">{l.level}</span>
              <span className="italic text-paper/50">{l.exhibit}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <Label>{t('panel.hobbies')}</Label>
        <div className="flex flex-wrap gap-2">
          {profile.hobbies.map((h) => (
            <span key={h} className="chip">
              {h}
            </span>
          ))}
        </div>
      </div>

      <div className="border-l-2 border-redink/60 pl-4">
        <Label>{t('panel.statement')}</Label>
        {profile.manifesto.map((p, i) => (
          <p key={i} className="mb-3 font-headline text-[15px] italic leading-relaxed text-paper/75">
            {p}
          </p>
        ))}
        <p className="text-right font-hud text-xs tracking-widest text-paper/50">{profile.manifestoSign}</p>
      </div>
    </div>
  )
}

function Row({ k, v }) {
  return (
    <div className="flex gap-3">
      <dt className="w-20 shrink-0 font-hud text-[11px] uppercase tracking-widest text-paper/40">{k}</dt>
      <dd className="text-paper/80">{v}</dd>
    </div>
  )
}

function SkillGroup({ group, items }) {
  return (
    <div className="mb-5 break-inside-avoid">
      <p className="mb-2 font-hud text-[11px] uppercase tracking-[0.18em] text-redink">{group}</p>
      <ul className="space-y-1.5">
        {items.map(([name, val]) => (
          <li key={name} className="flex items-center justify-between gap-3 text-[13px] text-paper/80">
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
            className={`border px-4 py-1.5 font-hud text-[11px] uppercase tracking-[0.18em] transition-colors ${
              tab === id
                ? 'border-redink bg-redink text-paper shadow-[0_0_12px_rgba(255,42,42,0.45)]'
                : 'border-paper/25 text-paper/60 hover:border-paper/50'
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
  const { t } = useTranslation()
  return (
    <ol className="relative space-y-6 border-l border-paper/15 pl-5">
      {experience.map((e, i) => (
        <li key={i} className="relative">
          <span className="absolute -left-[27px] top-1.5 h-3 w-3 rounded-full border-2 border-ink bg-redink" />
          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
            <h3 className="font-headline text-lg text-paper">{e.role}</h3>
            {e.current && (
              <span className="border border-redink px-1.5 py-0.5 font-hud text-[9px] uppercase tracking-widest text-redink">
                {t('panel.active')}
              </span>
            )}
          </div>
          <p className="font-hud text-[12px] uppercase tracking-wide text-redink/90">
            <span className="text-redink">»</span> {e.org} · {e.period}
          </p>
          <ul className="mt-1.5 list-disc space-y-0.5 pl-4 text-[13px] text-paper/70 marker:text-paper/30">
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
    <div className="space-y-8">
      <div>
        <SecHead n="01">{t('panel.certificates')}</SecHead>
        <ul className="space-y-3">
          {certificates.map((c, i) => (
            <li key={i} className="border-l border-paper/15 pl-3">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <h4 className="font-semibold text-paper">{c.title}</h4>
                <span className="font-hud text-[11px] tracking-wide text-paper/45">{c.date}</span>
              </div>
              <p className="font-hud text-[11px] uppercase tracking-wide text-redink/90">{c.issuer}</p>
              {c.detail && <p className="mt-0.5 text-[12px] leading-snug text-paper/65">{c.detail}</p>}
              {c.verify && (
                <a
                  href={`https://${c.verify}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-hud text-[11px] tracking-wide text-cyber underline decoration-dotted hover:text-redink"
                >
                  {t('panel.verify')} ↗
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <SecHead n="02">{t('panel.education')}</SecHead>
        <ul className="space-y-3">
          {education.map((e, i) => (
            <li key={i} className="border-l border-paper/15 pl-3">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <h4 className="font-semibold text-paper">{e.program}</h4>
                <span className="border border-paper/25 px-1.5 font-hud text-[9px] uppercase tracking-widest text-paper/55">
                  {badge[e.status] || e.status}
                </span>
              </div>
              <p className="font-hud text-[11px] uppercase tracking-wide text-redink/90">
                {e.school} · {e.period}
              </p>
              {e.detail && <p className="mt-0.5 text-[12px] leading-snug text-paper/65">{e.detail}</p>}
            </li>
          ))}
        </ul>
        {/* short study interludes recovered from the file */}
        <p className="mb-1.5 mt-5 font-hud text-[10px] uppercase tracking-[0.18em] text-paper/40">
          {t('panel.interludes')}
        </p>
        <ul className="space-y-1">
          {examPrep.map((x, i) => (
            <li key={i} className="flex flex-wrap justify-between gap-x-3 border-l border-paper/10 pl-3 text-[12px] text-paper/55">
              <span>{x.label}</span>
              <span className="font-hud text-[11px] tracking-wide text-paper/40">{x.period}</span>
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
        <div key={i} className="flex flex-col border border-paper/15 bg-paper/[0.03] p-3.5">
          <div className="mb-1 flex items-baseline justify-between gap-2">
            <h4 className="font-headline text-base text-paper">{p.name}</h4>
            <span className="font-hud text-[9px] uppercase tracking-widest text-redink/70">
              {String(i + 1).padStart(2, '0')}
            </span>
          </div>
          <p className="flex-1 text-[12px] leading-snug text-paper/70">{p.blurb}</p>
          <p className="mt-2 font-hud text-[11px] tracking-wide text-paper/45">{p.repo}</p>
          {p.url && (
            <a
              href={p.url}
              target="_blank"
              rel="noreferrer"
              className="mt-1 font-hud text-[11px] uppercase tracking-widest text-cyber underline decoration-dotted hover:text-redink"
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
    <div className="space-y-5">
      {testimonials.map((tm, i) => (
        <figure key={i} className={`border-l-2 pl-4 ${tm.onRequest ? 'border-paper/20' : 'border-redink/60'}`}>
          <blockquote className="font-headline text-[15px] italic leading-relaxed text-paper/85">“{tm.quote}”</blockquote>
          {!tm.onRequest && (
            <figcaption className="mt-1.5 font-hud text-[11px] uppercase tracking-wide text-paper/50">
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
