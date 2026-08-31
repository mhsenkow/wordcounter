#!/usr/bin/env bash
# Mirror wordcounter → portfolio/public (Cloudflare) and optionally FTP to GreenGeeks.
# Usage:
#   scripts/sync-deploy.sh           # mirror only
#   scripts/sync-deploy.sh --ftp     # mirror + FTP
#   scripts/sync-deploy.sh --cf      # mirror + npm run deploy in portfolio
#   scripts/sync-deploy.sh --all     # mirror + FTP + CF
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${PORTFOLIO_PUBLIC:-/Users/powerox/portfolio/portfolio/public}"
PORTFOLIO_APP="$(dirname "$PORT")"
TOOLS=(bill hourly fuel unit dose bitrate scalemap ratio typescale odds combo sample budget exposure deal streak tax pace contrast bayes)
DO_FTP=0
DO_CF=0

for arg in "$@"; do
  case "$arg" in
    --ftp) DO_FTP=1 ;;
    --cf) DO_CF=1 ;;
    --all) DO_FTP=1; DO_CF=1 ;;
  esac
done

echo "== sync suite copies =="
cp "$ROOT/lib/suite.js" "$ROOT/timecount/lib/suite.js"

echo "== mirror → $PORT =="
mkdir -p "$PORT/lib" "$PORT/lib/calc" "$PORT/timecount/lib" "$PORT/wordcount/lib" "$PORT/tools" "$PORT/icons"
cp "$ROOT/lib/suite.js" "$ROOT/lib/number-tool.css" "$ROOT/lib/number-tool.js" "$PORT/lib/"
cp "$ROOT/lib/calc/index.mjs" "$PORT/lib/calc/" 2>/dev/null || true
cp "$ROOT/index.html" "$PORT/wordcount/index.html"
cp "$ROOT/lib/suite.js" "$PORT/wordcount/lib/suite.js"
cp "$ROOT/manifest.webmanifest" "$PORT/wordcount/manifest.webmanifest"
mkdir -p "$PORT/wordcount/icons"
cp "$ROOT/icons/"*.png "$PORT/wordcount/icons/" 2>/dev/null || true
cp "$ROOT/timecount/index.html" "$PORT/timecount/index.html"
cp "$ROOT/lib/suite.js" "$PORT/timecount/lib/suite.js"
# timecount resolves ../manifest → suite root
cp "$ROOT/tools/index.html" "$PORT/tools/index.html"
cp "$ROOT/manifest.webmanifest" "$PORT/manifest.webmanifest"
cp "$ROOT/sw.js" "$PORT/sw.js"
cp "$ROOT/icons/"*.png "$PORT/icons/" 2>/dev/null || true
for t in "${TOOLS[@]}"; do
  mkdir -p "$PORT/$t"
  cp "$ROOT/$t/index.html" "$PORT/$t/index.html"
done
if [[ -d "$ROOT/bandwidth" ]]; then
  mkdir -p "$PORT/bandwidth"
  cp -R "$ROOT/bandwidth/." "$PORT/bandwidth/"
fi
echo "mirrored ${#TOOLS[@]} tools + desk + map"

if [[ "$DO_FTP" -eq 1 ]]; then
  echo "== FTP GreenGeeks =="
  PASS="$(security find-internet-password -s ftp.mhsenkow.org -a mhsenkow -w)"
  BASE="public_html/ibm.io"
  upload() {
    curl -sS --ftp-pasv --user "mhsenkow:${PASS}" -T "$1" "ftp://ftp.mhsenkow.org/$2" --ftp-create-dirs >/dev/null
    echo "  ok $2"
  }
  upload "$ROOT/lib/suite.js" "${BASE}/lib/suite.js"
  upload "$ROOT/lib/number-tool.css" "${BASE}/lib/number-tool.css"
  upload "$ROOT/lib/number-tool.js" "${BASE}/lib/number-tool.js"
  upload "$ROOT/index.html" "${BASE}/wordcount/index.html"
  upload "$ROOT/timecount/index.html" "${BASE}/timecount/index.html"
  upload "$ROOT/tools/index.html" "${BASE}/tools/index.html"
  upload "$ROOT/manifest.webmanifest" "${BASE}/manifest.webmanifest"
  upload "$ROOT/manifest.webmanifest" "${BASE}/wordcount/manifest.webmanifest"
  upload "$ROOT/sw.js" "${BASE}/sw.js"
  upload "$ROOT/lib/calc/index.mjs" "${BASE}/lib/calc/index.mjs"
  for icon in "$ROOT/icons/"*.png; do
    upload "$icon" "${BASE}/icons/$(basename "$icon")"
    upload "$icon" "${BASE}/wordcount/icons/$(basename "$icon")"
  done
  for t in "${TOOLS[@]}"; do
    upload "$ROOT/$t/index.html" "${BASE}/$t/index.html"
  done
fi

if [[ "$DO_CF" -eq 1 ]]; then
  echo "== Cloudflare deploy =="
  (cd "$PORTFOLIO_APP" && npm run deploy)
fi

echo "done"
