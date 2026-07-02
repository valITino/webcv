// Core identity of the subject. All values transcribed from the source résumé.
export const profile = {
  name: 'Valentino Totaro',
  alias: 'V.T.',
  title: 'Cybercrime Investigator',
  caseNo: 'VT-8305',
  fileRef: 'ST_01',
  dob: '10.12.1996',

  current: {
    role: 'Cybercrime Investigator',
    org: 'Kantonspolizei Bern — Kapo BE',
    period: 'Aug 2026 — present',
    summary:
      'Investigates cybercrimes such as hacking, fraud, and identity theft by collecting and analyzing digital evidence to identify and prosecute offenders.',
  },

  location: 'Dietlikon — Zürich, Switzerland',
  address: 'Riedenerstrasse 20, 8305 Dietlikon — Zürich',
  coords: '47.42°N 8.61°E',

  email: 'valentino.totaro@proton.me',
  phone: '+41 76 840 12 96',
  linkedin: { label: 'linkedin.com/in/vtot', url: 'https://www.linkedin.com/in/vtot' },
  github: { label: 'github.com/valITino', url: 'https://github.com/valITino' },

  // Nationalities (ISO codes → flag). Subject holds three.
  nationalities: ['IT', 'RS', 'CH'],

  // Languages, each illustrated with the subject's own "exhibit" line.
  languages: [
    { code: 'de', lang: 'German', level: 'Native', exhibit: '„Betrachten Sie Beweisstück A.“' },
    { code: 'en', lang: 'English', level: 'Professional', exhibit: '“Consider Exhibit A.”' },
    { code: 'fr', lang: 'French', level: 'Intermediate', exhibit: '« Considérez la pièce à conviction n° 1. »' },
  ],

  hobbies: [
    'Grappling (Brazilian Jiu-Jitsu)',
    'Travelling',
    'Cooking',
    'Bug Bounties',
    '(Vibe) Coding',
    'Reading',
  ],

  // The subject's own statement, recovered verbatim from the file.
  manifesto: [
    'Nerd at heart, engineer by trade, cybercrime investigator by conviction. My days are spent following digital evidence: fraud, hacking, identity theft, and people who genuinely believe "delete" means "gone." My evenings belong to a home lab that runs louder than my landlord would like, and CTFs I should’ve abandoned hours ago but didn’t, because that’s not how I’m built. Ambition sits somewhere between a feature and a bug; I haven’t decided yet.',
    'I swim in cold water because it’s the most honest thing I do all week. The lake doesn’t care about your week, your job, or your excuses. Neither does a forensic timeline. I value humor, loyalty, honesty, and the kind of team you’d actually want in a bad situation. Long-term, I want work that stays technical, stays hard, and refuses to get comfortable. Resilience isn’t a trait I claim but it’s something I keep showing up for, one cold morning at a time.',
  ],
  manifestoSign: '— the wise V.T.',
}
