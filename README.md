# V.T. // Case File — Interactive 3D Résumé

An immersive, film-noir **"case file"** résumé for **Valentino Totaro — Cybercrime Investigator**.
The visitor plays the detective: a vintage newspaper assigns you the case, then you explore a
lamp-lit 3D desk, open the **Exhibits** (CV sections), follow the strings on the evidence board,
and ring the communications terminal to get in touch.

Built to mirror the design language of object-driven cinematic 3D portfolios, adapted 1:1 to V.T.'s
résumé and a detective/cyber-police theme.

## Experience flow

1. **Desktop gate** — the simulation needs a mouse + GPU; touch/small screens get a notice.
2. **Newspaper intro** — *“THE DAILY INVESTIGATOR — WANTED BY CYBER-POLICE”* doubles as the asset loader.
3. **The desk** — orbit to look around; click a folder to examine an exhibit.
   - **EXHIBIT A — The Subject** · identity, languages, habits, statement
   - **EXHIBIT B — Modus Operandi** · technical & behavioural skills (with ratings)
   - **EXHIBIT C — Track Record** · experience timeline
   - **EXHIBIT D — Credentials** · certificates & education
   - **EXHIBIT E — Case Files** · projects & portfolio
   - **EXHIBIT F — Testimonials** · references
   - **Phone** → Communications Terminal (contact) · **Monitor** → Evidence Log (credits)

## Tech stack

React + Vite · React Three Fiber + drei · @react-three/postprocessing (Bloom / Vignette / Grain) ·
GSAP (camera) · Zustand (state) · i18next (auto language detection, EN/DE/FR) · Tailwind CSS.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
npm run preview    # preview the build
```

## Language

The site auto-detects the visitor's language from their browser/OS region
(`de-CH → de`, `fr-FR → fr`, everything else → English) and offers a manual EN/DE/FR switch
(top-right) that is remembered. Strings live in `src/i18n/{en,de,fr}.js`.

## 3D assets

Raw models live in `raw-assets/` (git-ignored). They are optimised — WebP textures + meshopt
geometry compression, node hierarchy & animations preserved — into `public/models/`:

```bash
npm run optimize:models
```

Shipped GLBs (12): `desk`, `board` (evidence board, baked detective collage), `folder` (animated),
`coffee`, `lamp` (clickable — toggles the key light), `phone` (retinted evidence red — opens the
contact terminal), `monitor` (screen redrawn at runtime with the case trace log — opens the
evidence log), `magnifier`, `keys`, `supplies`, `vader`, `yoda` (idle animation).

### Adding a new model

1. Drop the raw `.glb` into `raw-assets/`.
2. Add a line to `scripts/optimize-models.mjs` (`{ in, out, tex }`) and run `npm run optimize:models`.
3. Register placement/scale in `src/scene/layout.js` (`PROPS`) and render it via the `GlbProp`
   pattern in `src/scene/objects/Props.jsx`.

The `fit()` helper (`src/scene/utils.js`) re-centres and scales any model to a target size, so new
assets slot in regardless of their original export transform. It measures each model's pristine
bounding box exactly once (cached on the object), which keeps the transform stable across React
remounts.

## Canvas-drawn print & screen textures

The personalised paper/screen artifacts are drawn at runtime onto canvases (no image assets):
folder placards (aged stock, CONFIDENTIAL stamp, case ref), the typed A4 case report revealed
inside an opened folder, the board's sticky note, and the terminal's phosphor readout (drawn into
the measured UV rect of the monitor's texture atlas, with a gentle emissive flicker). They all
follow the hybrid type system: typewriter faces only on in-world paper, Rethink Sans + neon red
for all screen chrome.

## Content admin (no backend)

Press `Ctrl/Cmd+Shift+E` or append `?admin` to open the in-browser content admin. Edits overlay
the defaults from `src/data/profile.js`, persist to `localStorage`, and can be exported/imported
as JSON. The scene reads through the overlay live — placards, board note and terminal readout
update as you type.

## Customising the content

All résumé content is plain data — no hunting through components:

- `src/data/profile.js` — identity, contact, languages, statement
- `src/data/skills.js` — skill groups + star ratings
- `src/data/exhibits.js` — experience, certificates, education, projects, testimonials
- `src/data/credits.js` — evidence-log / asset attributions
- `src/data/registry.js` — which exhibits exist and their A–F codes

## Project structure

```
src/
  components/  DesktopGate · Intro (newspaper) · Experience (canvas + overlays) · CanvasBoundary
  scene/       Scene · CameraRig · Lighting · Effects · layout · utils (fit + canvas textures)
    objects/   Desk · Board · BoardPins · Folder · Coffee · Props (GLB props) · Interactive
  ui/          Hud · ExhibitPanel · ContactTerminal · Credits · Overlay · Tooltip · IdleToast ·
               Cursor · Stars · LangSwitch · Flash · Admin
  hooks/       useIsDesktop · useIdle · useKonami
  data/        profile · skills · exhibits · credits · registry
  i18n/        en · de · fr + auto-detection
  store/       useStore (experience state) · useContent (CMS overlay)
```

## Quality & verification

- Two render modes (HUD toggle): **Cinematic** (Bloom, ACES, grain, vignette, hover outlines,
  2048px shadows) and **Performance** (composer off, 1024px shadows, lower DPR).
- A WebGL failure is caught by an error boundary with a themed fallback instead of a blank page.
- Dev/`?debug` builds expose `window.__store`, `window.__cam` and `window.__scene` so headless
  screenshot harnesses can drive and assert the experience.
