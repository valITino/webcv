# V.T. // Case File — Interactive 3D Résumé

An immersive, film-noir **"case file"** résumé for **Valentino Totaro — Cybercrime Investigator**.
The visitor plays the detective: a vintage newspaper assigns you the case, then you explore a
lamp-lit 3D desk, open the **Exhibits** (CV sections), follow the strings on the evidence board,
and ring the communications terminal to get in touch.

Built to mirror the design language of object-driven cinematic 3D portfolios, adapted 1:1 to V.T.'s
résumé and a detective/cyber-police theme.

**Documentation map**

| File | What it is |
| --- | --- |
| `README.md` | You are here — setup, development, deployment, customisation |
| [`DESIGN_PROMPT.md`](DESIGN_PROMPT.md) | The project's design system as a ready-to-paste prompt for Claude |
| `CLAUDE.md` | Working protocol for AI-assisted development on this repo |
| `deploy.config.example` | Template for your local deploy settings |

---

## Experience flow

1. **Desktop gate** — the simulation needs a mouse + GPU; touch/small screens get a notice.
2. **Newspaper intro** — *“THE DAILY INVESTIGATOR — WANTED BY CYBER-POLICE”* doubles as the asset loader.
3. **The desk** — move the mouse to look around; click a folder to examine an exhibit.
   - **EXHIBIT A — The Subject** · identity, languages, habits, statement
   - **EXHIBIT B — Modus Operandi** · technical & behavioural skills (with ratings)
   - **EXHIBIT C — Track Record** · experience timeline
   - **EXHIBIT D — Credentials** · certificates & education
   - **EXHIBIT E — Case Files** · projects & portfolio
   - **EXHIBIT F — Testimonials** · references
   - **Phone** → Communications Terminal (contact) · **Monitor** → Evidence Log (credits)

## Tech stack

React 18 + Vite 5 · React Three Fiber 8 + drei 9 · three 0.169 ·
@react-three/postprocessing (Bloom / Vignette / Grain) · GSAP (intro animation) ·
Zustand (state) · i18next (auto language detection, EN/DE/FR) · Tailwind CSS 3.

> Version pins are deliberate: R3F v9 / drei v10 require React 19 — do not bump them (see
> `CLAUDE.md`). The `overrides: { esbuild: "0.25.12" }` entry in `package.json` remediates a
> dev-server security advisory (GHSA-67mh-4wv8-2f99) — keep it in place.

---

## Getting started

### Prerequisites

| Requirement | Version / detail | Why |
| --- | --- | --- |
| **Node.js** | **≥ 18** required; **20 LTS or newer recommended** (18 is end-of-life) | Vite 5's engine range is `^18.0.0 \|\| >=20.0.0`; the model-optimizer CLI needs ≥ 18 |
| **npm** | ships with Node — nothing extra to install | installs dependencies from `package-lock.json` |
| **git** | any recent version | to clone the repo |
| **A desktop browser** | current Chrome / Edge / Firefox / Safari with hardware WebGL enabled | it's a real-time 3D scene |
| **Screen + mouse** | viewport ≥ 1024 px wide **and** a fine pointer (mouse/trackpad) | smaller/touch devices intentionally get the "ACCESS RESTRICTED // DESKTOP ONLY" gate |

There is **no backend, no database, no API keys and no `.env` file** — the site is fully static.
The optimised 3D models are committed in `public/models/`, so a fresh clone runs immediately.
The only thing the running site loads from outside is its fonts (Google Fonts CDN); offline it
falls back to system faces.

**Windows users:** every shell helper has a native PowerShell twin — use `.\scripts\dev.ps1`
and `.\scripts\deploy.ps1` (same behaviour, PowerShell-style options: `-Check`, `-DryRun`, …).
The `.sh` versions need Git Bash or WSL. If PowerShell refuses to run scripts ("running scripts
is disabled on this system"), run once via `powershell -NoProfile -ExecutionPolicy Bypass -File
scripts\dev.ps1`, or allow local scripts for your user with
`Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`. The plain `npm` commands below work in
any shell.

### Quick start (one command)

```bash
git clone https://github.com/valITino/webcv.git
cd webcv
./scripts/dev.sh          # checks prerequisites, installs deps, starts the dev server
```

```powershell
# Windows (PowerShell) — same thing, native:
git clone https://github.com/valITino/webcv.git
cd webcv
.\scripts\dev.ps1
```

Then open **http://localhost:5173** in a desktop browser. The script also accepts:

```bash
./scripts/dev.sh --check       # only verify Node/npm are OK, change nothing
./scripts/dev.sh --fresh       # wipe node_modules and reinstall first
./scripts/dev.sh --port 3000   # serve on a different port
```

(PowerShell: `.\scripts\dev.ps1 -Check` / `-Fresh` / `-Port 3000`, and `-Help` for usage.)

### Manual setup (what the script does)

```bash
npm ci             # exact install from package-lock.json (or: npm install)
npm run dev        # dev server → http://localhost:5173
```

> The dev server binds to **all network interfaces** (`server.host: true` in `vite.config.js`),
> so you can open the site from another machine on your LAN. Don't expose `npm run dev` to
> untrusted networks or the public internet — the dev server is a development tool, not a web
> server. Deploy the built `dist/` instead (below).

### All commands

| Command | What it does |
| --- | --- |
| `./scripts/dev.sh` · `.\scripts\dev.ps1` | Verify prerequisites → install deps if needed → start the dev server |
| `npm run dev` | Start the Vite dev server on port 5173 (hot reload) |
| `npm run build` | Production build → `dist/` (ES2020 target, vendor chunks split) |
| `npm run preview` | Serve the built `dist/` locally on port 4173 — a pre-deploy sanity check, **not** a production server |
| `npm run optimize:models` | Re-optimise raw GLBs from `raw-assets/` into `public/models/` (a harmless no-op if `raw-assets/` is absent) |
| `./scripts/deploy.sh <target>` · `.\scripts\deploy.ps1 <target>` | Build and deploy to a webserver or hosting platform (see **Deployment**) |

---

## Development guide

**URL parameters** (read once at page load):

| Parameter | Effect |
| --- | --- |
| `?lang=de` (or `en`/`fr`) | Force a language; also persisted for next visit |
| `?admin` | Open the in-browser content admin (see **Content admin**) |
| `?debug` | Expose `window.__store` (+ camera debug hooks) in production builds, for headless screenshot harnesses; dev builds expose it always |

**In-experience controls:**

- Move the mouse to look around; click folders / phone / monitor / lamp to interact; `Esc` closes any open panel.
- HUD (top-right): **QUALITY** toggles Cinematic ↔ Performance, **SOUND** unmutes (audio starts
  muted and is primed by the ENTER click), plus **CONTACT** and **EVIDENCE LOG** shortcuts.
- `Ctrl/Cmd+Shift+E` toggles the content admin.
- A couple of easter eggs are hidden in the scene — the evidence log won't spoil them here.

**Render quality modes** (HUD toggle, resets to Cinematic on reload):

- **Cinematic** — post-processing chain on (Outline hover glow, Bloom, ACES filmic tone mapping,
  Vignette, film grain), device pixel ratio up to 2, 2048 px shadow maps.
- **Performance** — composer off (the CSS vignette remains), DPR capped at 1.3, 1024 px shadow maps.

A WebGL failure is caught by an error boundary with a themed fallback ("EVIDENCE ROOM
UNAVAILABLE") instead of a blank page.

---

## Building for production

```bash
npm run build      # → dist/  (index.html + hashed assets + models + images)
npm run preview    # serve dist/ at http://localhost:4173 to check it before deploying
```

The output is a plain static site (~415 kB gzipped JS + the GLB models). There is **no
client-side routing** — no SPA rewrite/fallback rules are needed on any server; only
`index.html` is ever requested as a page.

## Deployment

The one requirement: **serve the site from a domain root** (`https://cv.example.com/`, not
`https://example.com/cv/`). The app loads its models with root-absolute URLs (`/models/*.glb`),
which Vite's `base` option does not rewrite — under a sub-path the 3D assets would 404.

`scripts/deploy.sh` — or `scripts\deploy.ps1` in PowerShell on Windows — builds and ships
`dist/` in one step (both read the same `deploy.config`):

```bash
cp deploy.config.example deploy.config   # fill in the target you use (git-ignored)
./scripts/deploy.sh ssh                  # your own webserver (rsync over SSH)
./scripts/deploy.sh netlify              # Netlify — direct upload of the prebuilt dist/
./scripts/deploy.sh vercel               # Vercel — uploads source, builds in their cloud
./scripts/deploy.sh cloudflare           # Cloudflare Pages — direct upload
./scripts/deploy.sh gh-pages             # GitHub Pages (domain-root setups only — see below)
```

Useful flags: `--dry-run` (ssh: preview the sync without changing anything), `--draft`
(netlify: preview URL instead of production), `--skip-build` (reuse the existing `dist/`).
PowerShell: same targets — `.\scripts\deploy.ps1 ssh` etc. — with the flags spelled
`-DryRun`, `-Draft`, `-SkipBuild`.

| Target | One-time setup | Notes |
| --- | --- | --- |
| `ssh` | fill `DEPLOY_SSH_*` in `deploy.config`; SSH access to the docroot | Any static server (nginx, Apache, Caddy). rsync with `--delete` keeps old hashed bundles from piling up; without rsync it falls back to tar-over-ssh (`.sh`) / tar+scp (`.ps1`, works with Windows' built-in OpenSSH client) |
| `netlify` | `npx netlify-cli login` then `npx netlify-cli init` | netlify-cli requires **Node ≥ 20**; deploys the locally built `dist/` (`--no-build`); for CI use `NETLIFY_AUTH_TOKEN` + `NETLIFY_SITE_ID` |
| `vercel` | `npx vercel login` | First run prompts to link a project; Vercel auto-detects Vite and builds server-side |
| `cloudflare` | `npx wrangler login` then `npx wrangler pages project create` | wrangler requires **Node ≥ 22**; set `CF_PAGES_PROJECT` in `deploy.config` for non-interactive deploys |
| `gh-pages` | set `GHPAGES_CNAME` (custom domain) **or** `GHPAGES_ROOT_OK=1` (a `<user>.github.io` root repo) | Project sites (`github.io/<repo>/`) are refused — they'd break the model URLs (see above). Enable Pages → "Deploy from a branch" → `gh-pages` after the first push |

After deploying, replace the relative `og:image` URL in `index.html` with your absolute domain
URL so link previews work (there's a marker comment in the file).

---

## 3D assets

Raw models live in `raw-assets/` (git-ignored). They are optimised — WebP textures + meshopt
geometry compression, node hierarchy & animations preserved — into `public/models/`:

```bash
npm run optimize:models
```

Each model that isn't present in `raw-assets/` is reported as `(not present — skipped)`; with no
`raw-assets/` at all the script is a harmless no-op. You only need it when changing source models
— the 12 optimised GLBs are committed.

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

---

## Customising the content

All résumé content is plain data — no hunting through components:

| File | Exports | Contains |
| --- | --- | --- |
| `src/data/profile.js` | `profile` | identity, contact, languages, hobbies, statement |
| `src/data/skills.js` | `techSkills`, `softSkills` | skill groups with star ratings |
| `src/data/exhibits.js` | `experience`, `examPrep`, `certificates`, `education`, `projects`, `testimonials` | the timeline/credentials/projects/references data |
| `src/data/credits.js` | `credits` | evidence-log / asset attributions |
| `src/data/registry.js` | `EXHIBITS`, `EXHIBIT_IDS`, `getExhibit` | which exhibits exist and their A–F codes |

UI labels and narrative strings live in `src/i18n/{en,de,fr}.js`, not in the data files.

## Language

The site auto-detects the visitor's language (detection order: `?lang=` query →
`localStorage` → browser/OS language → `<html lang>`), with regional codes collapsed
(`de-CH → de`, `fr-FR → fr`, anything unsupported → English). The manual EN/DE/FR switch
(top-right) persists the choice in `localStorage` under `vt_lang`.

## Content admin (no backend)

Press `Ctrl/Cmd+Shift+E` or append `?admin` to open the in-browser content admin. Edits overlay
the defaults from `src/data/profile.js`, persist to `localStorage` (key `vt_content`), and can be
exported/imported as JSON. The scene reads through the overlay live — placards, board note and
terminal readout update as you type. "Reset to defaults" clears the overlay.

## Design system

The full visual language — palette, five-font type system, surface recipes, motion vocabulary,
copy voice — plus the whole experience flow is documented as a ready-to-paste prompt in
[`DESIGN_PROMPT.md`](DESIGN_PROMPT.md). Give it to **Claude Design** together with this project
to rebuild the experience as an interactive prototype that feels like running it on localhost.

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
scripts/       dev.sh + dev.ps1 · deploy.sh + deploy.ps1 · optimize-models.mjs
```

---

## Troubleshooting

| Symptom | Cause & fix |
| --- | --- |
| `npm ci` / `npm run dev` fails immediately | Node too old — run `node --version`; you need ≥ 18 (20 LTS recommended). `./scripts/dev.sh --check` (PowerShell: `.\scripts\dev.ps1 -Check`) verifies this for you |
| Port 5173 already in use | `./scripts/dev.sh --port 3000` / `.\scripts\dev.ps1 -Port 3000` (or `npm run dev -- --port 3000`) |
| `.ps1` won't run — "running scripts is disabled on this system" | PowerShell's execution policy blocks script files — run once via `powershell -NoProfile -ExecutionPolicy Bypass -File scripts\dev.ps1`, or allow local scripts with `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`. Got the repo as a ZIP instead of `git clone`? Also run `Unblock-File scripts\*.ps1` (downloaded files are marked as untrusted) |
| "ACCESS RESTRICTED // DESKTOP ONLY" | Viewport is narrower than 1024 px or the device has no fine pointer — use a desktop browser at full width |
| "EVIDENCE ROOM UNAVAILABLE" / black canvas | WebGL is unavailable — enable hardware acceleration in the browser, update GPU drivers, avoid remote-desktop sessions |
| 3D models 404 after deploying | The site is served under a sub-path — it must live at a domain root (see **Deployment**) |
| No sound | Sound starts muted by design — toggle **SOUND: ON** in the HUD after entering |
| Fonts look plain / different | Google Fonts is unreachable (offline/blocked) — the site falls back to system faces and stays usable |
| `optimize:models` prints "(not present — skipped)" for everything | `raw-assets/` is absent — that's fine unless you're re-optimising source models |
| Language switch didn't stick | Clear the `vt_lang` localStorage key, or use `?lang=en` to override |
