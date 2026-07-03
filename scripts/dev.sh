#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# dev.sh — one-command local dev environment for the V.T. // Case File CV.
#
#   ./scripts/dev.sh              start the dev server (installs deps if needed)
#   ./scripts/dev.sh --check      only verify prerequisites, then exit
#   ./scripts/dev.sh --fresh      wipe node_modules and reinstall before starting
#   ./scripts/dev.sh --port 3000  serve on a custom port (default: 5173)
#
# Prerequisites it verifies for you:
#   • Node.js >= 18 (Vite 5 requires ^18.0.0 || >=20.0.0)
#   • npm (bundled with Node.js)
# Windows users: run this from Git Bash or WSL, or use `npm install && npm run dev`.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

# Always operate from the repository root, wherever the script is called from.
cd "$(dirname "${BASH_SOURCE[0]}")/.."

MIN_NODE_MAJOR=18
PORT=""
FRESH=0
CHECK_ONLY=0

usage() { sed -n '2,14p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'; }

while [[ $# -gt 0 ]]; do
  case "$1" in
    --check) CHECK_ONLY=1 ;;
    --fresh) FRESH=1 ;;
    --port)
      [[ $# -ge 2 ]] || { echo "error: --port needs a value" >&2; exit 1; }
      PORT="$2"; shift ;;
    -h|--help) usage; exit 0 ;;
    *) echo "error: unknown option '$1' (see --help)" >&2; exit 1 ;;
  esac
  shift
done

fail() { printf '  ✗ %s\n' "$1" >&2; exit 1; }
ok()   { printf '  ✓ %s\n' "$1"; }

echo "── V.T. // CASE FILE — dev environment ──────────────────────"
echo "Checking prerequisites…"

command -v node >/dev/null 2>&1 \
  || fail "Node.js not found. Install Node >= ${MIN_NODE_MAJOR} (LTS recommended): https://nodejs.org"
NODE_VERSION="$(node --version)"           # e.g. v22.22.2
NODE_MAJOR="${NODE_VERSION#v}"; NODE_MAJOR="${NODE_MAJOR%%.*}"
[[ "$NODE_MAJOR" -ge "$MIN_NODE_MAJOR" ]] \
  || fail "Node ${NODE_VERSION} is too old — Vite 5 needs >= ${MIN_NODE_MAJOR}. Upgrade at https://nodejs.org"
ok "Node ${NODE_VERSION}"

command -v npm >/dev/null 2>&1 || fail "npm not found (it ships with Node.js — reinstall Node)"
ok "npm $(npm --version)"

if [[ "$CHECK_ONLY" -eq 1 ]]; then
  echo "All prerequisites satisfied."
  exit 0
fi

if [[ "$FRESH" -eq 1 ]]; then
  echo "Removing node_modules for a fresh install…"
  rm -rf node_modules
fi

# Install dependencies when missing or out of sync with the lockfile.
# `npm ci` gives a byte-exact install from package-lock.json.
if [[ ! -d node_modules ]] || [[ package-lock.json -nt node_modules/.package-lock.json ]]; then
  echo "Installing dependencies (npm ci)…"
  npm ci --no-audit --no-fund
else
  ok "Dependencies up to date"
fi

echo
echo "Starting the dev server — press Ctrl+C to stop."
echo "The experience is desktop-only: open it in a desktop browser with a mouse."
echo

if [[ -n "$PORT" ]]; then
  exec npm run dev -- --port "$PORT"
else
  exec npm run dev   # vite.config.js serves on http://localhost:5173 (host: true)
fi
