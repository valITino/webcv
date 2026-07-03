# DESIGN_PROMPT.md — rebuild "V.T. // Case File" as an interactive prototype, with Claude Design

This file is a **ready-to-paste prompt** that has **Claude Design** take this project *as it is*
and reproduce it as an **interactive prototype** — the same experience you get running the site on
`localhost`: the newspaper intro, the lamp-lit 3D desk you orbit, the case-file folders that open
into exhibits, the contact terminal, the evidence board. The design-system sections below (1–10)
are the exact look/feel spec the prototype must hit.

**How to use**

1. Open Claude Design **with this project available** — attach the repo or point Claude Design at
   the source. The code is the source of truth for content, flow and assets; this prompt is the
   map and the fidelity bar.
2. Paste everything below the horizontal rule as the instruction. Claude Design rebuilds the
   experience (§0 says what to reproduce; §1–§10 say exactly how it must look, move and read).
3. Every value in this prompt is transcribed from this repo's code (`tailwind.config.js`,
   `src/index.css`, `src/scene/Lighting.jsx`, `src/scene/Effects.jsx`, `src/i18n/en.js`,
   `src/scene/utils.js`, `src/data/*`) — if you change the app, update this file to match.

---

You are rebuilding an existing project — **“V.T. // Case File”**, a film-noir detective
case-file résumé crossed with a cyber-police HUD — as an **interactive prototype in Claude
Design**. The project is provided as-is; reproduce the *whole experience* so it feels like
running it on `localhost`, not a static mockup. Treat §1–§10 as the exact look/feel spec:
reuse its tokens, recipes and voice; invent no new colors, fonts, or rounded corners.

## OBJECTIVE — mirror this project

> **Take the whole project as-is and reproduce it as an interactive prototype that matches the
> localhost experience end to end.** Attempt the **real 3D**: build the lamp-lit desk as an
> actual Three.js / React Three Fiber scene the visitor can orbit, with clickable props — do not
> substitute a flat 2D mockup. Use the repo's `src/data/*` as the real CV content and
> `public/models/*.glb` as the desk props where those assets are available; where a specific
> asset isn't provided, stand it in with simple 3D primitives that read as the same object
> (a boxy folder, a cylinder lamp) — still in 3D. Fidelity priority: the *feeling and flow* of
> §0 first, then the exact tokens/recipes of §1–§10. State any assumption you must make.

## 0. The experience to reproduce (the whole flow)

Rebuild this exact sequence and its interactions — this *is* the localhost experience:

- **Desktop-only gate.** On a coarse pointer or a viewport narrower than 1024 px, show the
  in-world notice instead of the scene: chip `CLASSIFIED`, title
  *“ACCESS RESTRICTED // DESKTOP ONLY”*, and the "runs on a full workstation" body. The
  experience itself assumes mouse + a wide screen.
- **Newspaper intro = loader.** A front page of *“THE DAILY INVESTIGATOR”*
  (`VOL. MMXXVI — NO. 8305 — CONFIDENTIAL`, kicker `CYBER-CRIME DESK · SPECIAL EDITION`) with the
  headline *“WANTED BY CYBER-POLICE”*, a mugshot captioned *“EXHIBIT A — the subject, smiling.
  Considered armed with sarcasm.”*, a `WANTED` stamp that slams in, and a *“Decrypting evidence”*
  progress bar. The **OPEN THE CASE FILE** button unlocks when loading completes; clicking it
  fades the paper away and reveals the desk.
- **The lamp-lit 3D desk.** A free-orbit scene the visitor explores by moving the mouse (subtle
  parallax, damped camera). Clicking any object glides the camera in to inspect it and glides back
  on `Esc` / **BACK TO DESK**. One warm desk lamp is the key light; everything else sits in deep
  shadow (see §8).
- **Six case-file folders = Exhibits A–F.** Fanned across the desk; hovering lifts a folder,
  clicking opens it and brings up its dossier panel. The six, in order, with their two-layer
  naming (serif title / dry file code): **THE SUBJECT** (`EXHIBIT A — IDENTITY`), **MODUS
  OPERANDI** (`EXHIBIT B — CAPABILITIES`), **TRACK RECORD** (`EXHIBIT C — MOVEMENTS`),
  **CREDENTIALS** (`EXHIBIT D — PAPER TRAIL`), **CASE FILES** (`EXHIBIT E — PRIOR WORK`),
  **TESTIMONIALS** (`EXHIBIT F — WITNESSES`). Panels render the real content from `src/data/*`.
- **Clickable props, each with a witty hover tooltip** (exact strings): **lamp** *“The only honest
  light in the room.”* toggles the key light on/off; **phone** *“Direct line. Care to leave a
  message?”* opens the **Communications Terminal** (contact — email/phone/location + voicemail
  line); **monitor** *“Live system readout.”* opens the **Evidence Log** (asset credits) and shows
  a live green CRT trace readout; plus flavor props — **coffee** *“Cold coffee. Older than this
  investigation.”*, **magnifier**, **keys** *“Keys to somewhere. Not your concern.”*, **supplies**,
  and two LEGO guardians (**Vader**, **Yoda**) flanking the terminal.
- **Evidence board** behind the desk: a detective collage joined by **red string**, with a
  pinned sticky note (`CASE №`, status `AT LARGE`). Tooltip: *“The evidence board. Follow the
  strings.”*
- **HUD & ambient life.** Top-right chrome controls: **QUALITY** (Cinematic ↔ Performance),
  **SOUND** (starts muted), **CONTACT**, **EVIDENCE LOG**, and an **EN / DE / FR** language switch.
  Bottom-center: the pulsing hint *“Move your mouse to look · Click a file to examine it”*, which
  becomes **← BACK TO DESK** while inspecting. Status line *“SYSTEM STATUS // ONLINE”* with a
  pulsing green dot. After ~20 s idle, cycling italic quips appear (e.g. *“Still there, inspector?
  The coffee's gone cold.”*). `Esc` closes any open panel. (Sound/quality reset on reload;
  language persists.)
- **Stack it targets.** The original is React + **Three.js / React Three Fiber** with **drei**,
  **GSAP** for the intro, and postprocessing (**Bloom / Vignette / film grain**, ACES tone
  mapping). Build the prototype the same way so the 3D and mood match §8.

## 1. Identity & mood

Two material worlds coexist and must stay distinct:

- **Analog evidence (paper world):** aged document paper, typewriter type, rubber stamps,
  redaction bars, red string, polaroids, halftone mugshots. Warm, stained, tactile.
- **Digital surveillance (chrome world):** near-black panels, neon-red brackets and rings,
  letterspaced uppercase micro-labels, barcodes, scanlines, phosphor-green CRT readouts.
  Cold, precise, glowing.

The mood is a lamp-lit desk at night: one warm light source, deep shadows, cinematic grain
and vignette. The voice is a dry, witty noir narrator addressing the visitor as “inspector.”

## 2. Color tokens (exact — do not deviate)

Core palette (Tailwind token → hex → role):

| Token | Hex | Role & rules |
| --- | --- | --- |
| `ink` | `#0c0b09` | THE background — page, fog, scene. Overlay plates at `/80–/95` opacity |
| `coal` | `#15130f` | secondary near-black (reserve; rarely used) |
| `paper` | `#e8e2d4` | aged paper surface AND the text color on dark chrome, used through an opacity ladder from `/10` to `/90` for hierarchy; borders at `/10–/50` |
| `paperdark` | `#cabd9f` | photo/mugshot backing |
| `sepia` | `#d8c7a0` | warm paper accent (reserve) |
| `lamp` | `#ffebb3` | the desk-lamp warmth — highlight glow, hover outline color, warm emphasis text |
| `brass` | `#d2ac41` | desk hardware/gold accents (pin gold variant: `#caa24a`) |
| `evidence` | `#c0392b` | ANALOG red — stamps, red string, selection background, primary button on paper. On paper it multiplies (worn ink: `rgba(178,44,32,0.55–0.62)`) |
| `redink` | `#ff2a2a` | DIGITAL neon red — chrome accents only: brackets, inner rings, active tabs, labels, dots. Key accents (overlines, section squares, active tabs, primary chrome buttons) carry a soft glow, e.g. `shadow-[0_0_10px_rgba(255,42,42,0.5)]`; secondary labels, badges and dots stay flat |
| `cyber` | `#2cc9ff` | hyperlinks only (`underline decoration-dotted`, hover → `redink`) |
| `olive` | `#6b6a3a` | muted supporting tone (reserve) |

Supporting values:

- **System-online green** `#42f59b` — status dots (pulsing), availability notes, “ONLINE” text. Nothing else.
- **Paper ink** `#1a160e` (primary), `#3a3327` / `#2e2a20` (secondary), redaction bar `#141210`.
- **Canvas paper stocks:** label `#e3dbc6`, report `#e6dfca`, sticky note `#f0e7a4`; aging =
  radial edge-darkening `rgba(96,74,40,0.20–0.22)` + ~1.5 px speckles `rgba(120,96,54,0.10)`.
- **CRT terminal:** background `#031008`; greens `#8fe8c8 #5ad3ae #2c7a5e #7df0c9 #b7ffe3`;
  alert amber `#ffb46b`; scanlines `rgba(0,0,0,0.28)` 1 px every 3 px.
- **Selection:** `::selection { background:#c0392b; color:#f5efe1 }`. **Focus (keyboard only):**
  `outline: 1px solid rgba(255,42,42,0.75); outline-offset: 2px`.

**The two-reds rule:** `evidence` red is analog and lives on paper (stamped, multiplied, worn);
`redink` neon is digital and lives on dark chrome (glowing). Never swap them.

## 3. Typography (five faces, strict roles)

Google Fonts load: `Playfair Display (ital,wght 400–900) · Special Elite (400) ·
Oswald (400,700) · Inter (400–700) · Rethink Sans (400–700)`.

| Face | Tailwind | Role |
| --- | --- | --- |
| **Playfair Display** (serif) | `font-headline` | newspaper headlines, panel titles (`text-3xl/4xl tracking-tight`), drop caps (900, `3.2em`, line-height 0.8), *italic* pull-quotes and witty asides. Never uppercase-letterspaced |
| **Special Elite** (typewriter) | `font-type` | **in-world paper only** — captions, typed reports, placards, sticky notes. Never on dark chrome |
| **Oswald** (stencil) | `font-stencil` | stamps and detective display type: “WANTED”-style headlines, big uppercase names, buttons (`tracking-[0.12–0.2em] uppercase`) |
| **Inter** | `font-ui` | readable body copy (`text-sm`/`text-[13px]`), forms, definition lists |
| **Rethink Sans** | `font-hud` | ALL chrome micro-labels — the HUD voice. Recipe `.hud-chip`: `font-hud text-[10px] tracking-[0.22em] uppercase text-paper/70` |

One exception: CRT screens use `700 15px "Courier New", monospace` (phosphor readout).

**Conventions:** every chrome label is UPPERCASE + letterspaced (ladder: `0.12em → 0.14em →
0.18em → 0.2em → 0.22em`, reserve token `0.35em`); label sizes 8–12 px; serif never tracks wide.

## 4. Surface recipes (exact CSS)

- **Paper sheet** — `background-color:#e8e2d4` + faint radial stains
  (`rgba(120,96,54,0.12–0.14)`, `rgba(150,120,70,0.08)`); ink `#1a160e`;
  `box-shadow: inset 0 0 60px rgba(90,70,40,0.18), 0 30px 60px -20px rgba(0,0,0,0.8)`;
  optionally rotated `-0.6deg` with grain.
- **Dossier panel (dark)** — `radial-gradient(120% 80% at 50% 0%, rgba(255,42,42,0.07),
  transparent 60%), linear-gradient(180deg, rgba(17,15,12,0.97), rgba(8,7,6,0.985))`;
  text `#e8e2d4`; `box-shadow: 0 40px 90px -28px rgba(0,0,0,0.92), inset 0 0 0 1px
  rgba(255,42,42,0.16), inset 0 0 80px rgba(0,0,0,0.5)`; corner radius `2px` maximum.
- **HUD corner brackets** — four absolute L-shapes, `18×18px`, `border-l-2 border-t-2`
  (per corner), `border-color: rgba(255,42,42,0.9)`, `filter: drop-shadow(0 0 3px
  rgba(255,42,42,0.45))`; a subtler `/40` variant frames the whole viewport.
- **Barcode strip** — `16×132px`, opacity 0.55, `repeating-linear-gradient(90deg, #e8e2d4 0 1px,
  transparent 1px 3px, #e8e2d4 3px 5px, transparent 5px 6px, #e8e2d4 6px 9px, transparent 9px
  11px, #e8e2d4 11px 12px, transparent 12px 15px)`.
- **Chip / tag** — `border border-paper/25 bg-paper/[0.03] px-2.5 py-1 font-hud text-[11px]
  tracking-wide text-paper/80`. Square.
- **Rubber stamp** — `border: 3px solid rgba(192,57,43,0.85); color: rgba(192,57,43,0.92);
  box-shadow: inset 0 0 0 1px rgba(192,57,43,0.35); mix-blend-mode: multiply;` rotated `-12deg`,
  Oswald bold uppercase.
- **Film grain** — SVG `feTurbulence fractalNoise baseFrequency 0.9 numOctaves 2`, tile 120 px,
  opacity 0.06, `mix-blend-mode: overlay`. **Vignette** — `radial-gradient(ellipse at center,
  transparent 52%, rgba(0,0,0,0.72) 100%)`.
- **Noir button** — `font-stencil tracking-[0.18em] uppercase border border-paper/40
  text-paper/90 px-6 py-3`, hover inverts to `bg-paper text-ink` over `300ms`.
- **Glow text** — `.glow-red { text-shadow: 0 0 10px rgba(255,42,42,0.5) }`.
- **Scrollbar** — 8 px, thumb `rgba(255,42,42,0.5)` (radius 8 px), track transparent.

## 5. Composition & chrome patterns

- Dark panels dock left/right/center over a `bg-black/72 backdrop-blur-[3px]` backdrop,
  `max-h-[90vh]`, body padding `px-7 py-8` (md: `px-10 py-9`).
- **Panel header:** red-glow overline (`EXHIBIT — B` in hud-chip style) + the muted file code on
  the right (`EXHIBIT B — CAPABILITIES`), serif title (`MODUS OPERANDI`) below, ruled off with
  `border-b border-redink/30`.
- **Section head:** a 20×20 px (`h-5 w-5`) red square (`bg-redink`,
  `shadow-[0_0_10px_rgba(255,42,42,0.5)]`) numbered `01`, `02` in 10 px bold hud face + serif
  `text-xl` title beside it.
- **Panel footer:** thin strip `border-t border-paper/10 bg-black/30` holding
  `DOC_REF: CV_2026_<NAME> // SECURE`, a barcode, and `ESC TO CLOSE`.
- **Timeline:** `border-l border-paper/15`, dots `h-3 w-3 rounded-full border-2 border-ink
  bg-redink`; current item gets an `ACTIVE` outline badge in redink.
- **Mugshot treatment:** `filter: grayscale(1) contrast(1.25) brightness(0.92) sepia(0.18)`,
  thick ink border, halftone dot overlay (`radial-gradient(rgba(0,0,0,0.9) 1px, transparent
  1.4px)` at 4 px, multiply, ~40% opacity), height-scale strip gag (“180 170 160 150”).
- **Status pattern:** pulsing `#42f59b` dot + hud-chip label, e.g. “SYSTEM STATUS // ONLINE”.
- Corners are square everywhere (only exceptions: 2 px dossier radius, circular dots/pins).

## 6. Motion vocabulary

- `flicker` — 6s infinite; opacity dips to 0.65/0.85 at 93/96% (neon unsteadiness).
- `blink` — 1.1s `step-end` caret blink (`▋`).
- `stampin` — 0.5s `cubic-bezier(.2,1.4,.4,1)`: from `scale(2.4) rotate(-18deg)` fading in,
  slamming to `scale(1) rotate(-12deg)` (stamps land, they don't fade).
- Entrances (GSAP-style): sheet rises `y:60 → 0`, 0.9s `power3.out`; children stagger
  `y:18`, 0.7s, 0.08s apart, `power2.out`; exits fade 0.8s `power2.inOut`.
- Micro-transitions: cursor 200ms, tooltips 150ms, toasts 300–500ms; idle quips appear after
  20s of inactivity; flash lines live for 3.5s.
- 3D camera feel: critically damped follow (`k = 1 − 0.0009^dt`), subtle pointer parallax;
  hover = instant `scale 1.05–1.06` + warm `#ffebb3` outline glow — the damped camera keeps
  the overall motion feeling smooth.
- Respect `prefers-reduced-motion: reduce` — collapse all CSS animation to a single frame.

## 7. Voice & copy rules

- Second person, dry noir wit, visitor is “inspector”; the résumé owner is “the subject.”
- Never break the fiction — even errors stay in-world: *“EVIDENCE ROOM UNAVAILABLE”*,
  *“The case file stays sealed on this device.”*
- Chrome labels: UPPERCASE, `//` as separator — *“SYSTEM STATUS // ONLINE”*,
  *“ST_01 // SECURE ACCESS GRANTED”*, *“DOC_REF: CV_2026_VALENTINO-TOTARO // SECURE”*.
- Content is framed as evidence, with a two-layer naming scheme: serif panel titles
  (**THE SUBJECT**, **MODUS OPERANDI**, **TRACK RECORD**, **CREDENTIALS**, **CASE FILES**,
  **TESTIMONIALS**) over dry chrome file codes (`EXHIBIT A — IDENTITY`, `B — CAPABILITIES`,
  `C — MOVEMENTS`, `D — PAPER TRAIL`, `E — PRIOR WORK`, `F — WITNESSES`);
  case ref format `VT-8305`; stamps say `WANTED`, `CONFIDENTIAL`, `EVIDENCE`.
- Sample register (use as tone calibration, not to copy verbatim):
  - *“Cold coffee. Older than this investigation.”* (object caption)
  - *“The only honest light in the room.”* (lamp)
  - *“Still there, inspector? The coffee's gone cold.”* (idle)
  - *“Direct line to the subject. Leave your message after the beep — he reads everything.”*
  - *“Taking new cases. Bring a hard problem — the coffee is already on.”* (availability)
- Headlines go full tabloid-noir: *“WANTED BY CYBER-POLICE”*, masthead *“THE DAILY
  INVESTIGATOR”*, price gag *“PRICE: ONE FAVOUR”*.

## 8. Light & post-processing mood (the prototype's 3D scene)

Single warm key spotlight `#ffebb3` (the desk lamp) with soft penumbra against ambient
`#2a2620` at 0.1 intensity; cool directional fill `#6076a0`; warm bounce `#e7b87a`; background
and fog `#0c0b09`. Post chain: Bloom intensity 0.7 with luminance threshold 0.9 (only true
emitters glow — lamp, screens), ACES filmic tone mapping, slight contrast (+0.07), vignette
(offset 0.28, darkness 0.82), film-grain noise overlay at 0.35 opacity.

## 9. Do / Don't

**Do:** square corners · letterspaced uppercase micro-labels · glow only on `redink` chrome and
`lamp`-lit emitters · age every paper surface (stains, speckles, slight rotation) · redaction
bars, barcodes, stamps, red string as decoration · keep light warm and shadows deep.

**Don't:** rounded cards or pill buttons · gradients outside the specified recipes · typewriter
type on dark chrome · neon `redink` on paper (use `evidence` red) · colors outside the tokens ·
cheerful marketing tone or exclamation points · breaking the detective fiction.

## 10. Implementation snippets (for web deliverables)

Tailwind tokens (drop into `theme.extend`):

    colors: {
      ink: '#0c0b09', coal: '#15130f', paper: '#e8e2d4', paperdark: '#cabd9f',
      sepia: '#d8c7a0', lamp: '#ffebb3', brass: '#d2ac41', evidence: '#c0392b',
      redink: '#ff2a2a', cyber: '#2cc9ff', olive: '#6b6a3a',
    },
    fontFamily: {
      headline: ['"Playfair Display"', 'serif'],
      type: ['"Special Elite"', '"Courier New"', 'monospace'],
      stencil: ['Oswald', 'Impact', 'sans-serif'],
      ui: ['Inter', 'system-ui', 'sans-serif'],
      hud: ['"Rethink Sans"', 'Inter', 'system-ui', 'sans-serif'],
    },

Google Fonts request:

    https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Special+Elite&family=Oswald:wght@400;700&family=Inter:wght@400;500;600;700&family=Rethink+Sans:wght@400;500;600;700&display=swap

Now rebuild the **interactive prototype** of this project (see the **OBJECTIVE** and §0),
applying this system faithfully. Attempt the real 3D desk; reproduce the whole flow so it feels
like localhost. State any assumption you have to make, and keep every color, face, and copy
convention above.
