#Requires -Version 5.1

<#
.SYNOPSIS
  One-command local dev environment for the V.T. // Case File CV.

.DESCRIPTION
  PowerShell twin of scripts/dev.sh — same behaviour, native on Windows.
  Runs in Windows PowerShell 5.1 and PowerShell 7+ (any OS).

  Prerequisites it verifies for you:
    - Node.js >= 18 (Vite 5 requires ^18.0.0 || >=20.0.0)
    - npm (bundled with Node.js)

  If Windows refuses to run the script ("running scripts is disabled on this
  system"), either run it once via
    powershell -NoProfile -ExecutionPolicy Bypass -File scripts\dev.ps1
  or allow locally created scripts for your user account once:
    Set-ExecutionPolicy -Scope CurrentUser RemoteSigned

.PARAMETER Check
  Only verify prerequisites, then exit.

.PARAMETER Fresh
  Wipe node_modules and reinstall before starting.

.PARAMETER Port
  Serve on a custom port (default: 5173).

.PARAMETER Help
  Show this help text, then exit.

.EXAMPLE
  .\scripts\dev.ps1
  Start the dev server (installs dependencies if needed).

.EXAMPLE
  .\scripts\dev.ps1 -Check
  Only verify Node/npm are OK, change nothing.

.EXAMPLE
  .\scripts\dev.ps1 -Fresh
  Wipe node_modules and reinstall before starting.

.EXAMPLE
  .\scripts\dev.ps1 -Port 3000
  Serve on a custom port instead of 5173.
#>
[CmdletBinding()]
param(
  [switch]$Check,
  [switch]$Fresh,
  [int]$Port = 0,
  [switch]$Help
)

Set-StrictMode -Version 3.0
$ErrorActionPreference = 'Stop'
# Success/failure of native commands is judged via $LASTEXITCODE checks below —
# keep pwsh 7.4+'s optional auto-error behaviour off even if a profile set it.
$PSNativeCommandUseErrorActionPreference = $false

$MinNodeMajor = 18

function Write-Ok([string]$Message) { Write-Host "  ✓ $Message" }
function Fail([string]$Message) {
  Write-Host "  ✗ $Message" -ForegroundColor Red
  exit 1
}
# Bare `npm` in Windows PowerShell runs Node's npm.ps1 shim, which re-parses the
# calling statement and mishandles `--` and $variable arguments on several npm
# versions. Literal-only statements are safe; anything interpolated must go
# through cmd.exe (→ npm.cmd) as a pre-built line instead.
function Invoke-NpmLine([string]$Line) {
  if ($env:OS -eq 'Windows_NT') { cmd /c $Line } else { sh -c $Line }
}

if ($Help) { Get-Help -Detailed $PSCommandPath; exit 0 }
if ($Port -lt 0 -or $Port -gt 65535) { Fail '-Port must be between 0 and 65535' }
$PortGiven = $PSBoundParameters.ContainsKey('Port')

# Always operate from the repository root, wherever the script is called from.
Push-Location (Join-Path $PSScriptRoot '..')
try {
  Write-Host '── V.T. // CASE FILE — dev environment ──────────────────────'
  Write-Host 'Checking prerequisites…'

  if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Fail "Node.js not found. Install Node >= $MinNodeMajor (LTS recommended): https://nodejs.org"
  }
  $nodeVersion = "$(node --version)".Trim()          # e.g. v22.22.2
  $nodeMajor = [int]($nodeVersion.TrimStart('v').Split('.')[0])
  if ($nodeMajor -lt $MinNodeMajor) {
    Fail "Node $nodeVersion is too old — Vite 5 needs >= $MinNodeMajor. Upgrade at https://nodejs.org"
  }
  Write-Ok "Node $nodeVersion"

  if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Fail 'npm not found (it ships with Node.js — reinstall Node)'
  }
  Write-Ok "npm $("$(npm --version)".Trim())"

  if ($Check) {
    Write-Host 'All prerequisites satisfied.'
    exit 0
  }

  if ($Fresh -and (Test-Path node_modules)) {
    Write-Host 'Removing node_modules for a fresh install…'
    Remove-Item -Recurse -Force node_modules
  }

  # Install dependencies when missing or out of sync with the lockfile.
  # `npm ci` gives a byte-exact install from package-lock.json.
  $stamp = Join-Path 'node_modules' '.package-lock.json'
  # -Force: on Linux/macOS pwsh treats dot-files as hidden and Get-Item skips
  # them otherwise (Test-Path still sees them, so the guard alone won't help).
  # A missing package-lock.json counts as up to date, like bash's [[ -nt ]].
  $needInstall = (-not (Test-Path node_modules)) -or (-not (Test-Path $stamp)) -or
    ((Test-Path 'package-lock.json') -and
      ((Get-Item -Force 'package-lock.json').LastWriteTimeUtc -gt (Get-Item -Force $stamp).LastWriteTimeUtc))
  if ($needInstall) {
    Write-Host 'Installing dependencies (npm ci)…'
    npm ci --no-audit --no-fund
    if ($LASTEXITCODE -ne 0) { Fail "npm ci failed (exit code $LASTEXITCODE)" }
  } else {
    Write-Ok 'Dependencies up to date'
  }

  Write-Host ''
  Write-Host 'Starting the dev server — press Ctrl+C to stop.'
  Write-Host 'The experience is desktop-only: open it in a desktop browser with a mouse.'
  Write-Host ''

  if ($PortGiven) {
    Invoke-NpmLine "npm run dev -- --port $Port"
  } else {
    npm run dev   # vite.config.js serves on http://localhost:5173 (host: true)
  }
  exit $LASTEXITCODE
}
finally {
  Pop-Location
}
