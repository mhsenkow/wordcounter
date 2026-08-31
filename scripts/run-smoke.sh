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
const tools = ['bill','hourly','fuel','unit','dose','bitrate','scalemap','ratio','typescale','odds','combo','sample','budget','exposure','deal','streak','tax','pace','contrast','bayes'];
let fail = 0;
function bad(msg) { console.error('FAIL', msg); fail++; }

const suite = fs.readFileSync('lib/suite.js','utf8');
const suite2 = fs.readFileSync('timecount/lib/suite.js','utf8');
if (suite !== suite2) bad('suite.js drift vs timecount/lib');

for (const t of tools) {
  const html = fs.readFileSync(path.join(t,'index.html'),'utf8');
  if (!/number-tool\.js\?v=36/.test(html)) bad(t + ' missing number-tool.js?v=36');
  if (!/number-tool\.css\?v=36/.test(html)) bad(t + ' missing number-tool.css?v=36');
  if (!/viewport-fit=cover/.test(html)) bad(t + ' viewport');
  if (/\bis-soon\b/.test(html) && /coming soon/.test(html)) bad(t + ' still soon stub');
  if (!/data-primary/.test(html)) bad(t + ' missing data-primary');
  if (!/toolUI/.test(html)) bad(t + ' missing toolUI');
  if (!/__ibmToolRender/.test(html)) bad(t + ' missing __ibmToolRender');
  if (!/"fieldsHtml"/.test(html) && !/fieldsHtml/.test(html)) bad(t + ' missing extra fieldsHtml');
  if (!/copyResultBtn|mountShareActions|face-actions/.test(html) && !fs.readFileSync('lib/number-tool.js','utf8').includes('mountShareActions')) bad(t + ' share helpers missing from lib');
}

const nt = fs.readFileSync('lib/number-tool.js','utf8');
const ntcss = fs.readFileSync('lib/number-tool.css','utf8');
if (!/wireScrubKeyboard/.test(nt)) bad('number-tool missing wireScrubKeyboard');
if (!/clampNumberInput/.test(nt)) bad('number-tool missing clampNumberInput');
if (!/function haptic/.test(nt) || !/vibrate/.test(nt)) bad('number-tool missing haptic');
if (!/hydrateFromValues|ibm\.tool\..*\.values|valuesStorageKey/.test(nt)) bad('number-tool missing field value persistence');
if (!/is-clamped/.test(ntcss)) bad('number-tool.css missing is-clamped');
if (!/@media \(max-width: 380px\)/.test(ntcss)) bad('number-tool.css missing 380px pass');
const smokeGestures = fs.readFileSync('scripts/smoke-gestures.html','utf8');
if (!/tool: 'words'|tool: \"words\"/.test(smokeGestures)) bad('smoke-gestures missing words desk');
if (!/tool: 'time'|tool: \"time\"/.test(smokeGestures)) bad('smoke-gestures missing time desk');

const words = fs.readFileSync('index.html','utf8');
if (!/role="dialog"/.test(words) || !/aria-modal="true"/.test(words)) bad('words settings dialog');
if (!/suite\.js\?v=36/.test(words) && !/suite\.js\?v=35/.test(words) && !/suite\.js\?v=34/.test(words) && !/suite\.js\?v=32/.test(words)) bad('words suite cache');
const time = fs.readFileSync('timecount/index.html','utf8');
if (!/role="dialog"/.test(time) || !/aria-modal="true"/.test(time)) bad('time settings dialog');
if (!fs.existsSync('tools/index.html')) bad('missing tools map');
if (!fs.existsSync('manifest.webmanifest')) bad('missing manifest');
if (!fs.existsSync('lib/calc/index.mjs')) bad('missing calc lib');

if (fail) { console.error(fail + ' contract failures'); process.exit(1); }
console.log('OK static contracts (' + tools.length + ' tools + desk)');
NODE
