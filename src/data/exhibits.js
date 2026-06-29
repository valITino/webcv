// CV content organised as "exhibits" in the case file.
// Everything here is transcribed / summarised from the source résumé and reference letters.

// ── TRACK RECORD (professional experience) ───────────────────────────────
export const experience = [
  {
    role: 'Cybercrime Investigator',
    org: 'Kantonspolizei Bern — Kapo BE',
    period: 'Aug 2026 — present',
    current: true,
    points: [
      'Investigates cybercrimes — hacking, fraud, identity theft — by collecting and analysing digital evidence.',
      'Builds forensic timelines to identify and prosecute offenders.',
    ],
  },
  {
    role: 'Cyber Security Analyst & Vulnerability Manager',
    org: 'Swiss Post — Bern',
    period: 'Sep 2025 — Jul 2026',
    points: [
      'Operated, steered and monitored enterprise-wide ICT security systems.',
      'Analysed security-relevant events and coordinated immediate defence & remediation measures.',
      'Developed tooling to extend detection systems and surface relevant events more efficiently.',
    ],
  },
  {
    role: 'Jr. Cyber Security Analyst & Detection Engineer',
    org: 'ANOMAL GmbH',
    period: 'Jan 2025 — Jun 2025',
    points: ['SOC analysis and detection engineering.'],
  },
  {
    role: 'Operations Engineer — 2nd & 3rd Level',
    org: 'Stoecklin Logistik AG',
    period: 'Apr 2024 — Nov 2024',
    points: ['2nd & 3rd level operations and systems engineering.'],
  },
  {
    role: 'Digital Document Management Specialist',
    org: 'Recodata GmbH',
    period: 'Jun 2023 — Mar 2024',
    points: [
      'Administered & optimised the "Therefore" document-management system and its workflows.',
      'Maintained network infrastructure; tuned performance & security of MySQL and MS SQL databases.',
      'Built automation solutions and supported IT projects and customer support.',
    ],
  },
  {
    role: 'Owner, Manager & Instructor',
    org: 'FitTech & HealthTech (Aurum Training — Franchise)',
    period: 'Aug 2016 — Jun 2023',
    points: [
      'Ran franchise studios as CEO: personalised training design, sales, and customer retention.',
      'Introduced the 6-minute training method; led digital marketing & performance analysis.',
      'Financial & operational management, team training and development.',
    ],
  },
  {
    role: 'Product Specialist',
    org: 'Tesla Motors Switzerland GmbH — Zürich',
    period: 'Aug 2018 — Oct 2019',
    points: [
      'Showroom hosting, vehicle presentation and the Tesla experience through targeted consultation.',
      'Lead generation, sales-promotion events, and delivery / handover of new vehicles.',
    ],
  },
]

// Short study interludes referenced in the file.
export const examPrep = [
  { label: 'Exam Preparation — Fern-Fachhochschule Schweiz', period: 'Jul 2025 — Aug 2025' },
  { label: 'Exam Preparation — Fern-Fachhochschule Schweiz', period: 'Dec 2024 — Jan 2025' },
]

// ── CREDENTIALS: certificates ────────────────────────────────────────────
export const certificates = [
  {
    title: 'Google Cybersecurity Professional Certificate',
    issuer: 'Google / Coursera',
    date: 'Sep 16, 2024',
    verify: 'coursera.org/verify/professional-cert/57H2W3YU0QRW',
    detail:
      'Eight-course professional certificate: Foundations of Cybersecurity · Play It Safe: Manage Security Risks · Connect and Protect: Networks · Tools of the Trade: Linux & SQL · Assets, Threats & Vulnerabilities · Sound the Alarm: Detection & Response · Automate Cybersecurity Tasks with Python · Put It to Work.',
  },
  {
    title: 'Microsoft Security Operations Analyst — Intensive Training',
    issuer: 'Digicomp Academy AG — Zürich',
    date: 'Dec 08–11, 2025',
    detail: 'Intensive SC-200 aligned training on Microsoft security operations.',
  },
  {
    title: 'Incident Response Basic',
    issuer: 'IOprotect GmbH',
    date: 'Mar 3, 2026',
    detail: 'IR process, suspicious-file & infected-Windows analysis, static vs. dynamic analysis, hands-on with CyberChef. 6h.',
  },
  {
    title: 'ACE (Attack Chain Emulation): Introduction',
    issuer: 'IOprotect GmbH',
    date: 'Mar 24, 2026',
    detail: 'Designing an attack chain — idea, components, implementation, validation, testing, integration. 2h.',
  },
  {
    title: 'ACE (Attack Chain Emulation): Hands-On',
    issuer: 'IOprotect GmbH',
    date: 'Mar 26, 2026',
    detail: 'Hands-on attack-chain emulation. 4.5h.',
  },
  {
    title: 'Splunk — Intro to Splunk · Using Fields',
    issuer: 'Splunk (eLearning)',
    date: 'Aug 2024',
    detail: 'Intro to Splunk and Using Fields eLearning modules; plus IT Essentials Learn walkthrough.',
  },
  {
    title: 'Sololearn — Java, Python & SQL',
    issuer: 'Sololearn',
    date: 'Feb–Mar 2024',
    detail:
      'Introduction to Java (CC-K1FBH3RC) · Java Intermediate (CC-5CF07RHS) · Introduction to Python (CC-ONFTENRF) · Introduction to SQL (CC-PTMHLYSI) · SQL Intermediate (CC-AQ8WECWS) · Tech for Everyone (CC-CWSTRWOT).',
  },
]

// ── CREDENTIALS: education ───────────────────────────────────────────────
export const education = [
  {
    school: 'Berner Fachhochschule',
    program: 'MAS Digital Forensics & Cybercrime Investigations',
    period: 'Apr 2026 — Sep 2029',
    status: 'in-progress',
    detail:
      'CAS DFCI Fundamentals (Apr–Sep 2026) · CAS DFCI Advanced (Oct 2027–Mar 2028) · CAS DFCI Specialist 1 (Apr–Sep 2028) · CAS DFCI Specialist 2 (Oct 2028–Mar 2029) · Master Thesis (Apr–Sep 2029).',
  },
  {
    school: 'Fern-Fachhochschule Schweiz (FFHS)',
    program: 'B.Sc. Cyber Security',
    period: 'Aug 2024 — Feb 2031',
    status: 'in-progress',
    detail:
      'HS 24/25 completed (1 semester) — Information Security 5.3 · Fundamentals of Technical Computer Science 4.6 · Web Fundamentals 4.8 · Scientific Working 5.8. Remaining 3 semesters planned Aug 2029 — Feb 2031.',
  },
  {
    school: 'Kantonsschule Zürcher Unterland',
    program: 'High School — Math & Language Profile',
    period: 'Aug 2012 — Jul 2016',
    status: 'completed',
    detail: 'Swiss Matura, mathematics & language profile.',
  },
]

// ── CASE FILES: projects & portfolio ─────────────────────────────────────
export const projects = [
  {
    name: 'blhackbox',
    url: 'https://github.com/valITino/blhackbox',
    repo: 'github.com/valITino/blhackbox',
    blurb: 'Personal security / hacking toolbox.',
  },
  {
    name: 'dfireballz',
    url: 'https://github.com/valITino/dfireballz',
    repo: 'github.com/valITino/dfireballz',
    blurb: 'DFIR (digital forensics & incident response) tooling.',
  },
  {
    name: 'ghostpairing-lab',
    url: 'https://github.com/valITino/ghostpairing-lab',
    repo: 'github.com/valITino/ghostpairing-lab',
    blurb: 'Experimental pairing / research lab.',
  },
  {
    name: 'web-fundamentals',
    url: 'https://github.com/valITino/web-fundamentals',
    repo: 'github.com/valITino/web-fundamentals',
    blurb:
      'Containerised e-commerce front-end (HTML5/CSS3/vanilla JS, ~49% JS / 28% CSS / 23% HTML). GitLab CI pipeline with lint, unit tests and Docker build; accessibility-first, sub-second first render.',
  },
  {
    name: 'Malware False Alarm — SOC Investigation',
    repo: 'Incident write-up',
    blurb:
      'Full-cycle triage of "BitCoinTracker.exe" flagged by Defender: pivoted through Sysmon/Elastic, live-memory capture on FlareVM/SIFT, Ghidra disassembly (clipboard-monitoring & wallet-checking routines), Zeek/pcap network forensics — classified as a PUA, IOCs documented, playbook updated.',
  },
  {
    name: 'Semester Thesis — Offensive Cyber & Ethics',
    repo: 'Academic thesis',
    blurb:
      '“Digital Conflicts and Ethical Boundaries: Challenges of Offensive Cyber Capabilities.” Mixed-method study with a Stuxnet case study mapped against IHL / the Tallinn Manual; produced a Checklist for Ethical Cyber Operations and policy recommendations.',
  },
  {
    name: 'Portfolio — Fundamentals of Computer Engineering',
    repo: 'FFHS portfolio',
    blurb:
      'Low-level work across two educational CPUs: JOHNNY assembly (countdown, integer division, configurable Sieve of Eratosthenes), ARM/VisUAL 2 migration with opcode mapping, and a benchmarked linear-search routine with full register/RAM/CPI metrics and UML 2.0 modelling.',
  },
]

// ── TESTIMONIALS: reference letters ──────────────────────────────────────
export const testimonials = [
  {
    org: 'Swiss Post — Die Schweizerische Post AG',
    role: 'Cyber Security Analyst',
    date: 'May 27, 2026',
    by: 'Philippe David Besseghini (People & Transformation Lead) · Philippe Oesch',
    quote:
      'Thanks to his strong analytical skills and well-connected way of thinking, Valentino grasps new matters and draws the right conclusions. He stays resilient and productive under time pressure, is loyal, and builds reliable relationships.',
  },
  {
    org: 'Recodata GmbH',
    role: 'IT / Document Management',
    date: 'Mar 31, 2024',
    by: 'Beat Marti (Managing Director)',
    quote:
      'His profound expertise, quick comprehension and willingness to take on new challenges made him a valuable member of our team. We particularly value his proactive attitude and constant drive to improve systems and processes.',
  },
  {
    org: 'Aurum Training AG',
    role: 'CEO — Franchise Studios',
    date: 'Feb 24, 2024',
    by: 'Julian Massler',
    quote:
      'Valentino stood out through extraordinary commitment and deep passion for the industry. We are grateful for his formative leadership role.',
  },
  {
    org: 'Tesla Motors Switzerland GmbH',
    role: 'Product Specialist',
    date: 'Oct 17, 2019',
    by: 'Charlotte Cuipers (Sr. HR Partner DACH)',
    quote:
      'He has comprehensive expertise which he applied very confidently and successfully in practice, mastering all tasks well even under difficult conditions. His results were of very high quality.',
  },
  {
    org: 'Personal references',
    role: '',
    date: '',
    by: '',
    quote: 'Available on request.',
    onRequest: true,
  },
]
