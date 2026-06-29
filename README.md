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

Currently shipped GLBs: `desk`, `board` (evidence board), `folder` (animated), `coffee`.
The lamp, phone, monitor, magnifier and keys are **temporary Three.js primitives**.

### Adding the remaining models (when you send them)

1. Drop the raw `.glb` into `raw-assets/` using these names:
   `lamp.glb`, `phone.glb`, `monitor.glb`, `magnifier.glb`, `keys.glb`
2. Add a line for each to `scripts/optimize-models.mjs` (`{ in, out, tex }`) and run
   `npm run optimize:models`.
3. In `src/scene/objects/Props.jsx`, replace the primitive body of the matching component with a
   loaded model (see `Coffee.jsx` for the `useGLTF` + `fit()` pattern). Placement/scale lives in
   `src/scene/layout.js` (`PROPS`).

The `fit()` helper (`src/scene/utils.js`) re-centres and scales any model to a target size, so new
assets slot in regardless of their original export transform.

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
  components/  DesktopGate · Intro (newspaper) · Experience (canvas + overlays)
  scene/       Scene · CameraRig · Lighting · Effects · layout · utils
    objects/   Desk · Board · BoardPins · Folder · Coffee · Props (primitives)
  ui/          Hud · ExhibitPanel · ContactTerminal · Credits · Tooltip · IdleToast · Cursor · Stars · LangSwitch · Overlay
  data/        profile · skills · exhibits · credits · registry
  i18n/        en · de · fr + detector
  store/       Zustand store
```
