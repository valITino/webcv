import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useProgress } from '@react-three/drei'
import gsap from 'gsap'
import { useStore } from '../store/useStore.js'
import { profile } from '../data/profile.js'
import LangSwitch from '../ui/LangSwitch.jsx'

export default function Intro() {
  const { t } = useTranslation()
  const enter = useStore((s) => s.enter)
  const { progress } = useProgress()
  const [loaded, setLoaded] = useState(false)
  const rootRef = useRef(null)
  const sheetRef = useRef(null)

  // Consider assets ready once progress hits 100 once, with an 9s safety fallback.
  useEffect(() => {
    if (progress >= 100) setLoaded(true)
  }, [progress])
  useEffect(() => {
    const id = setTimeout(() => setLoaded(true), 9000)
    return () => clearTimeout(id)
  }, [])

  // Entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(sheetRef.current, { y: 60, opacity: 0, duration: 0.9, ease: 'power3.out' })
      gsap.from('.intro-stagger', { y: 18, opacity: 0, duration: 0.7, stagger: 0.08, delay: 0.25, ease: 'power2.out' })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  const handleEnter = () => {
    gsap.to(rootRef.current, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut',
      onComplete: enter,
    })
  }

  const pct = Math.min(100, Math.round(progress))

  return (
    <div ref={rootRef} className="fixed inset-0 z-40 grain flex items-center justify-center bg-ink/95 p-4 md:p-8">
      <div className="absolute right-4 top-4 z-50">
        <LangSwitch dark />
      </div>

      <div
        ref={sheetRef}
        className="paper grain relative w-full max-w-5xl rotate-[-0.6deg] overflow-hidden px-6 py-7 md:px-12 md:py-10"
      >
        {/* Masthead */}
        <div className="intro-stagger flex items-center justify-between font-type text-[10px] uppercase tracking-[0.2em] text-ink/70">
          <span>{t('intro.dateline')}</span>
          <span>{new Date('2026-06-29').toDateString()}</span>
          <span>PRICE: ONE FAVOUR</span>
        </div>
        <h1 className="intro-stagger mt-2 text-center font-headline text-4xl font-black tracking-tight text-ink md:text-6xl">
          {t('intro.masthead')}
        </h1>
        <div className="intro-stagger mt-2 flex items-center justify-between border-y-2 border-ink/80 py-1 font-type text-[10px] uppercase tracking-[0.18em] text-ink/70">
          <span>{t('intro.vol')}</span>
          <span>{t('intro.kicker')}</span>
        </div>

        {/* Body */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[1.4fr_1fr]">
          <div className="intro-stagger">
            <h2 className="font-stencil text-3xl font-bold uppercase leading-[0.95] tracking-tight text-evidence md:text-5xl">
              {t('intro.headline')}
            </h2>
            <p className="mt-3 font-headline text-lg italic text-ink/80 md:text-xl">{t('intro.subhead')}</p>
            <div className="mt-4 columns-1 gap-5 font-ui text-[13px] leading-relaxed text-ink/85 md:columns-2 md:text-sm">
              <p className="drop-cap">{t('intro.standfirst')}</p>
            </div>
          </div>

          {/* Mugshot */}
          <div className="intro-stagger relative">
            <div className="relative mx-auto max-w-[260px] border-[6px] border-ink bg-ink/5 p-1 shadow-xl">
              <div className="relative overflow-hidden bg-paperdark">
                <img
                  src="/images/portrait.png"
                  alt="Subject V.T."
                  className="block w-full object-cover"
                  style={{ filter: 'grayscale(1) contrast(1.25) brightness(0.92) sepia(0.18)' }}
                />
                {/* halftone overlay */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-40 mix-blend-multiply"
                  style={{
                    backgroundImage: 'radial-gradient(rgba(0,0,0,0.9) 1px, transparent 1.4px)',
                    backgroundSize: '4px 4px',
                  }}
                />
                {/* measuring scale */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-between bg-ink/80 px-2 py-0.5 font-type text-[8px] tracking-widest text-paper/80">
                  <span>180</span><span>170</span><span>160</span><span>150</span>
                </div>
              </div>
              <div
                className="stamp absolute -right-4 -top-5 rotate-[-12deg] animate-stampin px-3 py-1 font-stencil text-lg font-bold tracking-[0.2em]"
              >
                WANTED
              </div>
            </div>
            <p className="mt-2 text-center font-type text-[10px] uppercase tracking-widest text-ink/60">
              {t('intro.caption')}
            </p>
          </div>
        </div>

        {/* Footer: loader + enter */}
        <div className="intro-stagger mt-7 border-t-2 border-ink/80 pt-5">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="w-full md:w-1/2">
              <div className="flex items-center justify-between font-type text-[10px] uppercase tracking-widest text-ink/70">
                <span>{t('intro.loading')}</span>
                <span>{pct}%</span>
              </div>
              <div className="mt-1 h-[3px] w-full bg-ink/20">
                <div className="h-full bg-evidence transition-[width] duration-300" style={{ width: `${pct}%` }} />
              </div>
            </div>
            <button
              onClick={handleEnter}
              disabled={!loaded}
              className={`relative border-2 px-7 py-3 font-stencil text-sm uppercase tracking-[0.2em] transition-all duration-300 ${
                loaded
                  ? 'animate-flicker border-evidence bg-evidence text-paper hover:bg-ink hover:border-ink'
                  : 'cursor-not-allowed border-ink/30 text-ink/40'
              }`}
            >
              {loaded ? t('intro.enter') : t('intro.establishing')}
            </button>
          </div>
          <p className="mt-3 text-center font-type text-[10px] uppercase tracking-[0.2em] text-ink/45">
            {profile.name} · {t('intro.tip')}
          </p>
        </div>
      </div>
    </div>
  )
}
