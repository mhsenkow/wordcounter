#!/usr/bin/env bash
# Open smoke contracts in sequence (serve repo root first).
# Usage: python3 -m http.server 8777 &  scripts/run-smoke.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${SMOKE_PORT:-8777}"
BASE="http://127.0.0.1:${PORT}"

echo "Smoke pages (open or curl HTML):"
for f in smoke-gestures.html smoke-touch.html smoke-a11y.html; do
  path="$ROOT/scripts/$f"
  if [[ -f "$path" ]]; then
    echo "  $BASE/scripts/$f"
  fi
done

# Static contract checks without a browser
node <<'NODE'
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const tools = ['bill','hourly','fuel','unit','dose','bitrate','scalemap','ratio','typescale','odds','combo','sample','budget','exposure','deal','streak'];
let fail = 0;
function bad(msg) { console.error('FAIL', msg); fail++; }

const suite = fs.readFileSync('lib/suite.js','utf8');
const suite2 = fs.readFileSync('timecount/lib/suite.js','utf8');
if (suite !== suite2) bad('suite.js drift vs timecount/lib');

for (const t of tools) {
  const html = fs.readFileSync(path.join(t,'index.html'),'utf8');
  if (!/number-tool\.js\?v=\d+/.test(html)) bad(t + ' missing number-tool.js cache');
  if (!/viewport-fit=cover/.test(html)) bad(t + ' viewport');
  if (html.includes('is-soon') && !html.includes('coming soon')) {
    /* allow class only if soon page — none should be soon now */
  }
  if (/\bis-soon\b/.test(html) && /coming soon/.test(html)) bad(t + ' still soon stub');
  if (!/data-primary/.test(html) && t !== 'ratio') {
    /* ratio has data-primary on w */
  }
  if (!/data-primary/.test(html)) bad(t + ' missing data-primary');
}

const words = fs.readFileSync('index.html','utf8');
if (!/role="dialog"/.test(words) || !/aria-modal="true"/.test(words)) bad('words settings dialog');
const time = fs.readFileSync('timecount/index.html','utf8');
if (!/role="dialog"/.test(time) || !/aria-modal="true"/.test(time)) bad('time settings dialog');

if (fail) { console.error(fail + ' contract failures'); process.exit(1); }
console.log('OK static contracts (' + tools.length + ' tools + desk)');
NODE
