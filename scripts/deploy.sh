#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# deploy.sh — build the production bundle and ship it to a web server or host.
#
#   ./scripts/deploy.sh ssh                your own webserver, via rsync over SSH
#   ./scripts/deploy.sh netlify            Netlify (prebuilt dist/, direct upload)
#   ./scripts/deploy.sh vercel             Vercel (uploads source, builds in cloud)
#   ./scripts/deploy.sh cloudflare         Cloudflare Pages (direct upload)
#   ./scripts/deploy.sh gh-pages           GitHub Pages branch (domain root only!)
#
# Options:
#   --dry-run      show what WOULD be uploaded, change nothing (ssh target)
#   --draft        deploy a preview instead of production (netlify target)
#   --skip-build   deploy the existing dist/ without rebuilding
#   --help         this text
#
# Settings come from ./deploy.config (git-ignored) — copy deploy.config.example
# to deploy.config and fill in your target's values.
# Windows users: the PowerShell twin scripts/deploy.ps1 reads the same file.
#
# IMPORTANT — serve from the DOMAIN ROOT. The app loads its 3D models with
# root-absolute URLs (/models/*.glb), which Vite's `base` option does not
# rewrite. https://example.com/ works; https://example.com/subfolder/ will 404
# the models. All targets below serve from a root, except gh-pages project
# sites — hence the extra guard there.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

usage() { sed -n '2,26p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'; }
fail()  { printf 'error: %s\n' "$1" >&2; exit 1; }
note()  { printf '── %s\n' "$1"; }

TARGET="${1:-}"
[[ -n "$TARGET" ]] || { usage; exit 1; }
case "$TARGET" in -h|--help) usage; exit 0 ;; esac
shift

DRY_RUN=0 DRAFT=0 SKIP_BUILD=0
while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run)    DRY_RUN=1 ;;
    --draft)      DRAFT=1 ;;
    --skip-build) SKIP_BUILD=1 ;;
    -h|--help)    usage; exit 0 ;;
    *) fail "unknown option '$1' (see --help)" ;;
  esac
  shift
done

# Refuse safety flags on targets that ignore them — silently swallowing
# --dry-run and then deploying for real would be far worse than an error.
if [[ "$DRY_RUN" -eq 1 && "$TARGET" != "ssh" ]]; then
  fail "--dry-run is only supported by the ssh target"
fi
if [[ "$DRAFT" -eq 1 && "$TARGET" != "netlify" ]]; then
  fail "--draft is only supported by the netlify target"
fi

# Local settings (hosts, paths, project names). Values in deploy.config win
# over inherited environment variables.
if [[ -f deploy.config ]]; then
  # shellcheck disable=SC1091
  source deploy.config
fi

command -v node >/dev/null 2>&1 || fail "Node.js not found — install Node >= 18 (https://nodejs.org)"
NODE_MAJOR="$(node --version)"; NODE_MAJOR="${NODE_MAJOR#v}"; NODE_MAJOR="${NODE_MAJOR%%.*}"
[[ "$NODE_MAJOR" -ge 18 ]] || fail "Node $(node --version) is too old — the build needs Node >= 18"

build() {
  if [[ "$SKIP_BUILD" -eq 1 ]]; then
    [[ -f dist/index.html ]] || fail "--skip-build set but dist/ has no build — run 'npm run build' first"
    note "Skipping build (using existing dist/)"
    return
  fi
  if [[ ! -d node_modules ]]; then
    note "Installing dependencies (npm ci)…"
    npm ci --no-audit --no-fund
  fi
  note "Building production bundle → dist/"
  rm -rf dist
  npm run build
}

case "$TARGET" in

  # ── Your own webserver: rsync dist/ over SSH ────────────────────────────
  # Needs in deploy.config: DEPLOY_SSH_HOST, DEPLOY_SSH_PATH
  # Optional: DEPLOY_SSH_USER, DEPLOY_SSH_PORT (default 22)
  ssh)
    [[ -n "${DEPLOY_SSH_HOST:-}" ]] || fail "DEPLOY_SSH_HOST is not set — copy deploy.config.example to deploy.config and fill it in"
    [[ -n "${DEPLOY_SSH_PATH:-}" ]] || fail "DEPLOY_SSH_PATH is not set — the docroot directory on the server (e.g. /var/www/cv)"
    command -v ssh >/dev/null 2>&1 || fail "no ssh client found — install OpenSSH (both rsync and the fallback transport need it)"
    build
    DEST="${DEPLOY_SSH_USER:+${DEPLOY_SSH_USER}@}${DEPLOY_SSH_HOST}:${DEPLOY_SSH_PATH%/}/"
    if command -v rsync >/dev/null 2>&1; then
      RSYNC_FLAGS=(-az --delete --delete-delay --chmod=D755,F644 --exclude='.DS_Store')
      [[ "$DRY_RUN" -eq 1 ]] && RSYNC_FLAGS+=(-n -v) && note "DRY RUN — nothing will be uploaded or deleted"
      note "rsync dist/ → ${DEST}"
      # trailing slash on dist/ = sync the CONTENTS of dist into the docroot
      rsync "${RSYNC_FLAGS[@]}" -e "ssh -p ${DEPLOY_SSH_PORT:-22}" dist/ "$DEST"
    else
      [[ "$DRY_RUN" -eq 1 ]] && fail "--dry-run needs rsync, which is not installed"
      note "rsync not found — falling back to tar over ssh (old files are NOT deleted; install rsync for clean syncs)"
      RPATH="$(printf '%q' "$DEPLOY_SSH_PATH")"   # shell-safe on the remote side
      tar -C dist -czf - . | ssh -p "${DEPLOY_SSH_PORT:-22}" "${DEPLOY_SSH_USER:+${DEPLOY_SSH_USER}@}${DEPLOY_SSH_HOST}" \
        "mkdir -p $RPATH && tar -xzf - -C $RPATH"
    fi
    [[ "$DRY_RUN" -eq 1 ]] || note "Deployed. The site is fully static — no rewrites or server config needed beyond serving index.html."
    ;;

  # ── Netlify: direct upload of the prebuilt dist/ ────────────────────────
  # One-time setup: npx netlify-cli login && npx netlify-cli init
  # (or set NETLIFY_AUTH_TOKEN + NETLIFY_SITE_ID for non-interactive deploys)
  netlify)
    [[ "$NODE_MAJOR" -ge 20 ]] || fail "the netlify target needs Node >= 20 (netlify-cli requires >= 20.12.2) — you have $(node --version)"
    build
    NETLIFY_FLAGS=(--dir dist --no-build)   # --no-build: we already built; Netlify CLI builds by default since v17
    [[ "$DRAFT" -eq 1 ]] || NETLIFY_FLAGS+=(--prod)
    note "Deploying dist/ to Netlify ($([[ $DRAFT -eq 1 ]] && echo 'draft preview' || echo 'production'))…"
    npx --yes netlify-cli deploy "${NETLIFY_FLAGS[@]}"
    ;;

  # ── Vercel: uploads the project, Vercel builds it (auto-detects Vite) ───
  # One-time setup: npx vercel login  (first deploy will prompt to link a project)
  vercel)
    note "Vercel builds in its cloud — skipping local build and uploading the project source…"
    npx --yes vercel --prod
    ;;

  # ── Cloudflare Pages: direct upload of the prebuilt dist/ ───────────────
  # One-time setup: npx wrangler login && npx wrangler pages project create
  # Optional in deploy.config: CF_PAGES_PROJECT (for non-interactive deploys)
  cloudflare)
    [[ "$NODE_MAJOR" -ge 22 ]] || fail "wrangler (Cloudflare's CLI) requires Node >= 22 — you have $(node --version)"
    build
    note "Deploying dist/ to Cloudflare Pages…"
    if [[ -n "${CF_PAGES_PROJECT:-}" ]]; then
      npx --yes wrangler pages deploy dist --project-name "$CF_PAGES_PROJECT"
    else
      npx --yes wrangler pages deploy dist
    fi
    ;;

  # ── GitHub Pages: force-push dist/ to a gh-pages branch ─────────────────
  # ONLY works when the site is served at a domain root: a user/org site
  # (<user>.github.io) or a custom domain (set GHPAGES_CNAME). On a project
  # site (github.io/<repo>/) the root-absolute /models/*.glb URLs would 404.
  gh-pages)
    if [[ -z "${GHPAGES_CNAME:-}" && "${GHPAGES_ROOT_OK:-0}" != "1" ]]; then
      fail "gh-pages would serve this repo at github.io/<repo>/, where the app's root-absolute
       /models/*.glb URLs break. Either set GHPAGES_CNAME=<your-domain> in deploy.config
       (a custom domain serves from the root), or — if this repo IS a <user>.github.io
       root site — set GHPAGES_ROOT_OK=1."
    fi
    build
    REMOTE_URL="$(git remote get-url "${GHPAGES_REMOTE:-origin}")"
    TMP="$(mktemp -d)"
    trap 'rm -rf "$TMP"' EXIT
    cp -R dist/. "$TMP"/
    touch "$TMP/.nojekyll"
    [[ -n "${GHPAGES_CNAME:-}" ]] && printf '%s\n' "$GHPAGES_CNAME" > "$TMP/CNAME"
    note "Publishing dist/ to the '${GHPAGES_BRANCH:-gh-pages}' branch of ${GHPAGES_REMOTE:-origin}…"
    git -C "$TMP" init -q
    git -C "$TMP" symbolic-ref HEAD "refs/heads/${GHPAGES_BRANCH:-gh-pages}"   # portable branch naming (git init -b needs >= 2.28)
    git -C "$TMP" add -A
    git -C "$TMP" -c user.name="${GIT_AUTHOR_NAME:-deploy}" -c user.email="${GIT_AUTHOR_EMAIL:-deploy@localhost}" \
      commit -q -m "deploy: production build"
    git -C "$TMP" push --force "$REMOTE_URL" "${GHPAGES_BRANCH:-gh-pages}"
    note "Pushed. In the repo settings enable Pages → 'Deploy from a branch' → ${GHPAGES_BRANCH:-gh-pages} / root."
    ;;

  *)
    fail "unknown target '$TARGET' — valid targets: ssh, netlify, vercel, cloudflare, gh-pages (see --help)"
    ;;
esac
