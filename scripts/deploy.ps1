#Requires -Version 5.1

<#
.SYNOPSIS
  Build the production bundle and ship it to a web server or host.

.DESCRIPTION
  PowerShell twin of scripts/deploy.sh — same targets, same ./deploy.config.
  Runs in Windows PowerShell 5.1 and PowerShell 7+ (any OS).

    .\scripts\deploy.ps1 ssh          your own webserver, over SSH (rsync, or tar+scp)
    .\scripts\deploy.ps1 netlify      Netlify (prebuilt dist/, direct upload)
    .\scripts\deploy.ps1 vercel       Vercel (uploads source, builds in cloud)
    .\scripts\deploy.ps1 cloudflare   Cloudflare Pages (direct upload)
    .\scripts\deploy.ps1 gh-pages     GitHub Pages branch (domain root only!)

  Settings come from ./deploy.config (git-ignored) — copy deploy.config.example
  to deploy.config and fill in your target's values. Both deploy.sh and
  deploy.ps1 read the same file (keep it to simple KEY="value" lines).

  IMPORTANT — serve from the DOMAIN ROOT. The app loads its 3D models with
  root-absolute URLs (/models/*.glb), which Vite's `base` option does not
  rewrite. https://example.com/ works; https://example.com/subfolder/ will
  404 the models. All targets below serve from a root, except gh-pages
  project sites — hence the extra guard there.

  If Windows refuses to run the script ("running scripts is disabled on this
  system"), either run it once via
    powershell -NoProfile -ExecutionPolicy Bypass -File scripts\deploy.ps1 <target>
  or allow locally created scripts for your user account once:
    Set-ExecutionPolicy -Scope CurrentUser RemoteSigned

.PARAMETER Target
  Deploy target: ssh, netlify, vercel, cloudflare or gh-pages.

.PARAMETER DryRun
  Show what WOULD be uploaded, change nothing (ssh target).

.PARAMETER Draft
  Deploy a preview instead of production (netlify target).

.PARAMETER SkipBuild
  Deploy the existing dist/ without rebuilding.

.PARAMETER Help
  Show this help text, then exit.

.EXAMPLE
  .\scripts\deploy.ps1 ssh
  rsync (or tar+scp) dist/ to your own webserver — set DEPLOY_SSH_* in deploy.config.

.EXAMPLE
  .\scripts\deploy.ps1 ssh -DryRun
  Preview the sync without uploading or deleting anything (needs rsync).

.EXAMPLE
  .\scripts\deploy.ps1 netlify -Draft
  Deploy a Netlify draft preview instead of production.
#>
[CmdletBinding()]
param(
  [Parameter(Position = 0)][string]$Target = '',
  [switch]$DryRun,
  [switch]$Draft,
  [switch]$SkipBuild,
  [switch]$Help
)

Set-StrictMode -Version 3.0
$ErrorActionPreference = 'Stop'
# Success/failure of native commands is judged via $LASTEXITCODE checks below —
# keep pwsh 7.4+'s optional auto-error behaviour off even if a profile set it.
$PSNativeCommandUseErrorActionPreference = $false

function Note([string]$Message) { Write-Host "── $Message" }
function Fail([string]$Message) {
  Write-Host "error: $Message" -ForegroundColor Red
  exit 1
}
# Run git and stop on failure (the .sh version gets this from `set -e`).
function Invoke-Git {
  git @args
  if ($LASTEXITCODE -ne 0) { Fail "git $($args -join ' ') failed (exit code $LASTEXITCODE)" }
}
# Bare `npm`/`npx` in Windows PowerShell run Node's npm.ps1/npx.ps1 shims, which
# re-parse the calling statement and mishandle `--` and $variable arguments on
# several npm versions. Literal-only statements are safe; anything interpolated
# must go through cmd.exe (→ npm.cmd/npx.cmd) as a pre-built line instead.
function Invoke-NpmLine([string]$Line) {
  if ($env:OS -eq 'Windows_NT') { cmd /c $Line } else { sh -c $Line }
}

if ($Help) { Get-Help -Detailed $PSCommandPath; exit 0 }
if (-not $Target) { Get-Help -Detailed $PSCommandPath; exit 1 }
$Target = $Target.ToLowerInvariant()

if (@('ssh', 'netlify', 'vercel', 'cloudflare', 'gh-pages') -notcontains $Target) {
  Fail "unknown target '$Target' — valid targets: ssh, netlify, vercel, cloudflare, gh-pages (see -Help)"
}

# Refuse safety flags on targets that ignore them — silently swallowing
# -DryRun and then deploying for real would be far worse than an error.
if ($DryRun -and $Target -ne 'ssh') { Fail '-DryRun is only supported by the ssh target' }
if ($Draft -and $Target -ne 'netlify') { Fail '-Draft is only supported by the netlify target' }

# Always operate from the repository root, wherever the script is called from.
Push-Location (Join-Path $PSScriptRoot '..')
try {

  # Local settings (hosts, paths, project names) from ./deploy.config — the same
  # file deploy.sh sources. Parsed as simple KEY="value" lines; values in
  # deploy.config win over inherited environment variables.
  $Config = @{}
  if (Test-Path 'deploy.config') {
    foreach ($line in Get-Content 'deploy.config') {
      if ($line -match '^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)=(.*)$') {
        $name = $Matches[1]
        $value = $Matches[2].Trim()
        if ($value -match '^"(.*)"$') { $value = $Matches[1] }
        elseif ($value -match "^'(.*)'$") { $value = $Matches[1] }
        else { $value = ($value -split '\s+#', 2)[0].Trim() }   # strip trailing comments
        $Config[$name] = $value
      }
    }
  }
  function Get-Setting([string]$Name, [string]$Default = '') {
    if ($Config.ContainsKey($Name) -and $Config[$Name] -ne '') { return $Config[$Name] }
    $fromEnv = [Environment]::GetEnvironmentVariable($Name)
    if ($fromEnv) { return $fromEnv }
    return $Default
  }

  if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Fail 'Node.js not found — install Node >= 18 (https://nodejs.org)'
  }
  $NodeVersion = "$(node --version)".Trim()
  $NodeMajor = [int]($NodeVersion.TrimStart('v').Split('.')[0])
  if ($NodeMajor -lt 18) { Fail "Node $NodeVersion is too old — the build needs Node >= 18" }

  function Invoke-Build {
    if ($SkipBuild) {
      if (-not (Test-Path 'dist/index.html')) {
        Fail "-SkipBuild set but dist/ has no build — run 'npm run build' first"
      }
      Note 'Skipping build (using existing dist/)'
      return
    }
    if (-not (Test-Path 'node_modules')) {
      Note 'Installing dependencies (npm ci)…'
      npm ci --no-audit --no-fund
      if ($LASTEXITCODE -ne 0) { Fail "npm ci failed (exit code $LASTEXITCODE)" }
    }
    Note 'Building production bundle → dist/'
    if (Test-Path 'dist') { Remove-Item -Recurse -Force 'dist' }
    npm run build
    if ($LASTEXITCODE -ne 0) { Fail "npm run build failed (exit code $LASTEXITCODE)" }
  }

  switch ($Target) {

    # ── Your own webserver: rsync dist/ over SSH (tar+scp when rsync is absent) ──
    # Needs in deploy.config: DEPLOY_SSH_HOST, DEPLOY_SSH_PATH
    # Optional: DEPLOY_SSH_USER, DEPLOY_SSH_PORT (default 22)
    'ssh' {
      $SshHost = Get-Setting 'DEPLOY_SSH_HOST'
      $SshPath = Get-Setting 'DEPLOY_SSH_PATH'
      if (-not $SshHost) { Fail 'DEPLOY_SSH_HOST is not set — copy deploy.config.example to deploy.config and fill it in' }
      if (-not $SshPath) { Fail 'DEPLOY_SSH_PATH is not set — the docroot directory on the server (e.g. /var/www/cv)' }
      if (-not (Get-Command ssh -ErrorAction SilentlyContinue)) {
        Fail 'no ssh client found — on Windows 10/11 install it with: Add-WindowsCapability -Online -Name OpenSSH.Client~~~~0.0.1.0 (elevated), or Settings → System → Optional features → "OpenSSH Client"'
      }
      Invoke-Build
      $SshUser = Get-Setting 'DEPLOY_SSH_USER'
      $SshPort = Get-Setting 'DEPLOY_SSH_PORT' '22'
      $HostSpec = if ($SshUser) { "$SshUser@$SshHost" } else { $SshHost }
      $RemoteDir = $SshPath.TrimEnd('/')
      if ($RemoteDir -match "[\r\n]") { Fail 'DEPLOY_SSH_PATH must not contain newlines' }

      if (Get-Command rsync -ErrorAction SilentlyContinue) {
        $rsyncFlags = @('-az', '--delete', '--delete-delay', '--chmod=D755,F644', '--exclude=.DS_Store')
        if ($DryRun) {
          $rsyncFlags += @('-n', '-v')
          Note 'DRY RUN — nothing will be uploaded or deleted'
        }
        Note "rsync dist/ → ${HostSpec}:${RemoteDir}/"
        # trailing slash on dist/ = sync the CONTENTS of dist into the docroot
        rsync @rsyncFlags -e "ssh -p $SshPort" dist/ "${HostSpec}:${RemoteDir}/"
        if ($LASTEXITCODE -ne 0) { Fail "rsync failed (exit code $LASTEXITCODE)" }
      } else {
        # PowerShell pipelines corrupt binary data (until pwsh 7.4), so instead of
        # the .sh version's `tar | ssh` this stages a tarball and scp-uploads it.
        if ($DryRun) { Fail '-DryRun needs rsync, which is not installed' }
        if (-not (Get-Command scp -ErrorAction SilentlyContinue)) { Fail 'scp not found — it ships with the OpenSSH client' }
        if (-not (Get-Command tar -ErrorAction SilentlyContinue)) { Fail 'tar not found — Windows 10 (1803+) and 11 ship it; otherwise install bsdtar' }
        Note 'rsync not found — falling back to tar + scp (old files are NOT deleted; install rsync for clean syncs)'
        $bundleName = 'webcv-deploy-' + [IO.Path]::GetRandomFileName().Replace('.', '') + '.tgz'
        $bundle = Join-Path ([IO.Path]::GetTempPath()) $bundleName
        try {
          tar -czf $bundle -C dist .
          if ($LASTEXITCODE -ne 0) { Fail "tar failed (exit code $LASTEXITCODE)" }
          Note "Uploading → ${HostSpec}:${RemoteDir}/"
          scp -P $SshPort -q $bundle "${HostSpec}:$bundleName"
          if ($LASTEXITCODE -ne 0) { Fail "scp upload failed (exit code $LASTEXITCODE)" }
          # Single-quote the docroot for the remote POSIX shell; keep $-signs literal.
          $remoteDirQ = "'" + ($RemoteDir -replace "'", "'\''") + "'"
          $remoteCmd = 'mkdir -p {0} && tar -xzf "$HOME/{1}" -C {0}; s=$?; rm -f "$HOME/{1}"; exit $s' -f $remoteDirQ, $bundleName
          ssh -p $SshPort $HostSpec $remoteCmd
          if ($LASTEXITCODE -ne 0) { Fail "remote extraction failed (exit code $LASTEXITCODE)" }
        } finally {
          Remove-Item -Force $bundle -ErrorAction SilentlyContinue
        }
      }
      if (-not $DryRun) { Note 'Deployed. The site is fully static — no rewrites or server config needed beyond serving index.html.' }
    }

    # ── Netlify: direct upload of the prebuilt dist/ ────────────────────────
    # One-time setup: npx netlify-cli login && npx netlify-cli init
    # (or set NETLIFY_AUTH_TOKEN + NETLIFY_SITE_ID for non-interactive deploys)
    'netlify' {
      if ($NodeMajor -lt 20) { Fail "the netlify target needs Node >= 20 (netlify-cli requires >= 20.12.2) — you have $NodeVersion" }
      Invoke-Build
      $netlifyLine = 'npx --yes netlify-cli deploy --dir dist --no-build'   # --no-build: we already built; Netlify CLI builds by default since v17
      $mode = 'draft preview'
      if (-not $Draft) { $netlifyLine += ' --prod'; $mode = 'production' }
      Note "Deploying dist/ to Netlify ($mode)…"
      Invoke-NpmLine $netlifyLine
      if ($LASTEXITCODE -ne 0) { Fail "netlify deploy failed (exit code $LASTEXITCODE)" }
    }

    # ── Vercel: uploads the project, Vercel builds it (auto-detects Vite) ───
    # One-time setup: npx vercel login  (first deploy will prompt to link a project)
    'vercel' {
      Note 'Vercel builds in its cloud — skipping local build and uploading the project source…'
      npx --yes vercel --prod
      if ($LASTEXITCODE -ne 0) { Fail "vercel deploy failed (exit code $LASTEXITCODE)" }
    }

    # ── Cloudflare Pages: direct upload of the prebuilt dist/ ───────────────
    # One-time setup: npx wrangler login && npx wrangler pages project create
    # Optional in deploy.config: CF_PAGES_PROJECT (for non-interactive deploys)
    'cloudflare' {
      if ($NodeMajor -lt 22) { Fail "wrangler (Cloudflare's CLI) requires Node >= 22 — you have $NodeVersion" }
      Invoke-Build
      Note 'Deploying dist/ to Cloudflare Pages…'
      $CfProject = Get-Setting 'CF_PAGES_PROJECT'
      if ($CfProject) {
        # Pages project names are lowercase alphanumerics and hyphens — enforce
        # that before splicing the value into the npx command line.
        if ($CfProject -notmatch '^[A-Za-z0-9-]+$') { Fail "CF_PAGES_PROJECT may only contain letters, digits and hyphens (got '$CfProject')" }
        Invoke-NpmLine "npx --yes wrangler pages deploy dist --project-name=$CfProject"
      } else {
        npx --yes wrangler pages deploy dist
      }
      if ($LASTEXITCODE -ne 0) { Fail "cloudflare deploy failed (exit code $LASTEXITCODE)" }
    }

    # ── GitHub Pages: force-push dist/ to a gh-pages branch ─────────────────
    # ONLY works when the site is served at a domain root: a user/org site
    # (<user>.github.io) or a custom domain (set GHPAGES_CNAME). On a project
    # site (github.io/<repo>/) the root-absolute /models/*.glb URLs would 404.
    'gh-pages' {
      $Cname = Get-Setting 'GHPAGES_CNAME'
      if (-not $Cname -and (Get-Setting 'GHPAGES_ROOT_OK' '0') -ne '1') {
        Fail @'
gh-pages would serve this repo at github.io/<repo>/, where the app's root-absolute
       /models/*.glb URLs break. Either set GHPAGES_CNAME=<your-domain> in deploy.config
       (a custom domain serves from the root), or — if this repo IS a <user>.github.io
       root site — set GHPAGES_ROOT_OK=1.
'@
      }
      if (-not (Get-Command git -ErrorAction SilentlyContinue)) { Fail 'git not found — install Git for Windows (https://git-scm.com)' }
      Invoke-Build
      $Remote = Get-Setting 'GHPAGES_REMOTE' 'origin'
      $Branch = Get-Setting 'GHPAGES_BRANCH' 'gh-pages'
      $RemoteUrl = git remote get-url $Remote
      if ($LASTEXITCODE -ne 0 -or -not $RemoteUrl) { Fail "could not read the URL of git remote '$Remote'" }
      $RemoteUrl = "$RemoteUrl".Trim()
      $Tmp = Join-Path ([IO.Path]::GetTempPath()) ('webcv-ghpages-' + [IO.Path]::GetRandomFileName().Replace('.', ''))
      New-Item -ItemType Directory -Path $Tmp | Out-Null
      try {
        Copy-Item -Path (Join-Path 'dist' '*') -Destination $Tmp -Recurse -Force
        New-Item -ItemType File -Path (Join-Path $Tmp '.nojekyll') -Force | Out-Null
        if ($Cname) { [IO.File]::WriteAllText((Join-Path $Tmp 'CNAME'), "$Cname`n") }
        Note "Publishing dist/ to the '$Branch' branch of $Remote…"
        Invoke-Git -C $Tmp init -q
        Invoke-Git -C $Tmp symbolic-ref HEAD "refs/heads/$Branch"   # portable branch naming (git init -b needs >= 2.28)
        Invoke-Git -C $Tmp add -A
        $AuthorName = if ($env:GIT_AUTHOR_NAME) { $env:GIT_AUTHOR_NAME } else { 'deploy' }
        $AuthorEmail = if ($env:GIT_AUTHOR_EMAIL) { $env:GIT_AUTHOR_EMAIL } else { 'deploy@localhost' }
        Invoke-Git -C $Tmp -c "user.name=$AuthorName" -c "user.email=$AuthorEmail" commit -q -m 'deploy: production build'
        Invoke-Git -C $Tmp push --force $RemoteUrl $Branch
        Note "Pushed. In the repo settings enable Pages → 'Deploy from a branch' → $Branch / root."
      } finally {
        Remove-Item -Recurse -Force $Tmp -ErrorAction SilentlyContinue
      }
    }
  }
}
finally {
  Pop-Location
}
