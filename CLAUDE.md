# CLAUDE.md — Working protocol for this repository

This is an interactive 3D, film-noir "case file" résumé for **Valentino Totaro —
Cybercrime Investigator** (React + Vite + React Three Fiber). Follow the protocol
below on **every** session before writing code. See `README.md` for run/build/asset
details and project structure.

## Baseline reading (always)
- This file (`CLAUDE.md`) and `README.md`
- `package.json`, `vite.config.js`, `tailwind.config.js`
- `src/store/useStore.js` (global state), `src/scene/layout.js` (world layout)
- All résumé content lives in `src/data/*` — never invent CV facts; transcribe from source.

## Stack invariants (do not violate without explicit need)
- **React 18** + **@react-three/fiber v8** + **@react-three/drei v9** + **three 0.169**.
  Do NOT jump to R3F v9 / drei v10 — they require React 19.
- GLB props use `useGLTF` + the `fit()` helper (`src/scene/utils.js`); raw models in
  `raw-assets/` (git-ignored) are optimised into `public/models/` via
  `npm run optimize:models` (WebP + meshopt; node hierarchy & animations preserved).
- Desktop-only experience; the camera is GSAP-driven with `OrbitControls` at rest.

---

## Phase 1: Web Research — Cast a Wide Net
Search the web for current, accurate information on anything the task touches that may
have changed, broken, or gained known issues since training cutoff. Err on the side of
over-researching. Catch surprises before writing code, not after. At minimum research:
- Every framework, library, package, runtime, or base image involved — current API,
  deprecations, breaking changes between versions, known CVEs, security advisories.
- Every external tool, CLI, flag, or service the change depends on — verify signatures,
  current output format, auth/permission model.
- Every protocol, spec, or standard the change interacts with — look for recent revisions.
- Domain context relevant to the task — current security best practices, exploit
  techniques, detection signatures, compliance requirements — whatever applies.

Then broaden: is there a recent post-mortem, GitHub issue, or advisory describing a bug
very similar to what you're about to fix or introduce? Check. If research is
inconclusive, contradicts prior assumptions, or returns nothing relevant — say so
explicitly before proceeding. Do not silently fill gaps with memory.

## Phase 2: Full Codebase Review — Understand the Blast Radius
Read the actual current state of the codebase. Do not rely on memory or summaries — open
the files.
- Baseline reading above, every session.
- Every file you plan to modify — in full, not just the region. Adjacent code encodes
  invariants.
- Every file that imports or is imported by the files you're touching — see the blast radius.
- Related tests, schemas, fixtures, type definitions — they describe the contract.
- Any documentation, comment, or template referencing the behavior you're changing.
- Any orchestration/glue (vite config, scripts, entrypoints) wiring the touched component in.
If mid-review the change touches more than you thought, expand the review.

## Phase 2.5: Design & Experience Review (this project)
Understand the design and check that everything the design contains is **logically
correctly placed**, **accordingly animated**, and has its **suitable functionality**.
So review it, understand it, and refactor if and where necessary — the goal is that the
full experience matches the Killian Herzer reference (https://3d.killianherzer.com/):
object-driven exploration, believable desk staging, animated/interactive props
(folders open, lamp toggles, phone/monitor functional), witty hover/idle copy, cohesive
cinematic mood. After any scene change, re-verify with a headless screenshot pass.

## Phase 3: Understand Before Acting
Before writing code, answer internally:
1. **Root cause** — not the symptom, the actual root cause?
2. **Blast radius** — which other files, modules, behaviors, or contracts are affected?
3. **Stable contracts** — does the fix break any internal contract downstream consumers rely on?
4. **Security invariants** — does it violate any core safety rule?
5. **Simplicity** — is there a simpler fix that achieves the same result?
Only after answering all five — write the fix.

---

## Implementation Principles

### 1. Think Before Coding
State assumptions explicitly; if uncertain, ask. If multiple interpretations exist,
present them. If a simpler approach exists, say so. If something is unclear, stop and ask.

### 2. Simplicity First
Minimum code that solves the problem. No speculative features, no abstractions for
single-use code, no unrequested "flexibility", no error handling for impossible scenarios.
If 200 lines could be 50, rewrite. Ask: "Would a senior engineer call this overcomplicated?"

### 3. Surgical Changes
Touch only what you must. Don't "improve" adjacent code, refactor what isn't broken, or
restyle. Match existing style. Mention unrelated dead code; don't delete it. Remove only
the orphans your own changes create.

### 4. Goal-Driven Execution
Define success criteria and loop until verified. Turn tasks into verifiable goals
("add validation" → "write tests for invalid inputs, then make them pass"). For
multi-step tasks, state a brief plan with a verify step each. In this repo, verification =
`npm run build` clean + a headless screenshot pass (see README / scripts).
