import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './en.js'
import de from './de.js'
import fr from './fr.js'

export const SUPPORTED = ['en', 'de', 'fr']

// Auto-detect the visitor's language from their browser/OS region.
// de-CH → de, fr-FR → fr, en-US → en … anything else falls back to English.
// A manual choice is persisted to localStorage and wins on the next visit.
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en, de, fr },
    supportedLngs: SUPPORTED,
    nonExplicitSupportedLngs: true,
    load: 'languageOnly',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    detection: {
      order: ['querystring', 'localStorage', 'navigator', 'htmlTag'],
      lookupQuerystring: 'lang',
      lookupLocalStorage: 'vt_lang',
      caches: ['localStorage'],
    },
  })

export default i18n
