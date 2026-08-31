#!/usr/bin/env bash
# Fast contracts + browser smoke URLs (serve repo root first).
# Usage: python3 -m http.server 8777 &  scripts/run-smoke.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
PORT="${SMOKE_PORT:-8777}"
BASE="http://127.0.0.1:${PORT}"
CACHE_V=44

echo "== unit tests =="
node test.mjs

echo ""
echo "== static contracts =="
node <<NODE
const fs = require('fs');
const path = require('path');
const CACHE_V = ${CACHE_V};
const tools = ['bill','hourly','fuel','unit','dose','bitrate','scalemap','ratio','typescale','odds','combo','sample','budget','exposure','deal','streak','tax','pace','contrast','bayes'];
let fail = 0;
function bad(msg) { console.error('FAIL', msg); fail++; }

const suite = fs.readFileSync('lib/suite.js','utf8');
const suite2 = fs.readFileSync('timecount/lib/suite.js','utf8');
if (suite !== suite2) bad('suite.js drift vs timecount/lib');

for (const t of tools) {
  const html = fs.readFileSync(path.join(t,'index.html'),'utf8');
  const cv = 'v=' + CACHE_V;
  if (!new RegExp('number-tool\\\\.js\\\\?' + cv).test(html)) bad(t + ' missing number-tool.js?' + cv);
  if (!new RegExp('number-tool\\\\.css\\\\?' + cv).test(html)) bad(t + ' missing number-tool.css?' + cv);
  if (!/class="presets"/.test(html)) bad(t + ' missing presets grid');
  if (!/paintDeep\\(/.test(html)) bad(t + ' missing paintDeep dispatch');
  if (!/vizMode/.test(html)) bad(t + ' missing vizMode');
  if (!/viewport-fit=cover/.test(html)) bad(t + ' viewport');
  if (/\\bis-soon\\b/.test(html) && /coming soon/.test(html)) bad(t + ' still soon stub');
  if (!/data-primary/.test(html)) bad(t + ' missing data-primary');
  if (!/toolUI/.test(html)) bad(t + ' missing toolUI');
  if (!/__ibmToolRender/.test(html)) bad(t + ' missing __ibmToolRender');
  if (!/"fieldsHtml"/.test(html) && !/fieldsHtml/.test(html) && !/extra:\\s*null/.test(html)) bad(t + ' missing extra fieldsHtml');
}

const nt = fs.readFileSync('lib/number-tool.js','utf8');
const ntcss = fs.readFileSync('lib/number-tool.css','utf8');
if (!/wireScrubKeyboard/.test(nt)) bad('number-tool missing wireScrubKeyboard');
if (!/clampNumberInput/.test(nt)) bad('number-tool missing clampNumberInput');
if (!/function haptic/.test(nt) || !/vibrate/.test(nt)) bad('number-tool missing haptic');
if (!/hydrateFromValues|ibm\\.tool\\..*\\.values|valuesStorageKey/.test(nt)) bad('number-tool missing field value persistence');
if (!/loadDeepViz|paintDeep|vizMode|deepVegaConfig|ensureDeepHost/.test(nt)) bad('number-tool missing deep viz helpers');
if (!/value="deep"/.test(nt)) bad('number-tool missing deep layer radio');
if (!/is-clamped/.test(ntcss)) bad('number-tool.css missing is-clamped');
if (!/@media \\(max-width: 380px\\)/.test(ntcss)) bad('number-tool.css missing 380px pass');
if (!/\\.deep-chart|\\.deep-canvas/.test(ntcss)) bad('number-tool.css missing deep chart layout');

for (const f of ['deep-viz.js','vega.min.js','vega-lite.min.js','vega-embed.min.js','regl.min.js']) {
  if (!fs.existsSync('lib/' + f)) bad('missing lib/' + f);
}
const deep = fs.readFileSync('lib/deep-viz.js','utf8');
if (!/WEBGL_3D|CANVAS_2D/.test(deep)) bad('deep-viz missing engine label maps');

function mapKeys(src, label) {
  const m = deep.match(new RegExp('var ' + label + ' = \\\\{([^}]+)\\\\}'));
  if (!m) { bad('deep-viz missing ' + label); return new Set(); }
  const keys = new Set();
  const re = /(\\w+)\\s*:/g;
  let hit;
  while ((hit = re.exec(m[1]))) keys.add(hit[1]);
  return keys;
}
const webgl = mapKeys(deep, 'WEBGL');
const specs = mapKeys(deep, 'SPECS');
const vegaScrub = mapKeys(deep, 'VEGA_SCRUB');
const webglScrub = mapKeys(deep, 'WEBGL_SCRUB');
for (const t of tools) {
  if (!webgl.has(t) && !specs.has(t)) bad(t + ' missing from deep-viz SPECS/WEBGL');
  if (webgl.has(t)) {
    if (!webglScrub.has(t)) bad(t + ' missing WEBGL_SCRUB');
    if (vegaScrub.has(t)) bad(t + ' wrongly in VEGA_SCRUB');
  } else {
    if (!vegaScrub.has(t)) bad(t + ' missing VEGA_SCRUB');
    if (webglScrub.has(t)) bad(t + ' wrongly in WEBGL_SCRUB');
  }
}

const sw = fs.readFileSync('sw.js','utf8');
if (!/deep-viz\\.js/.test(sw) || !/vega\\.min\\.js/.test(sw) || !/regl\\.min\\.js/.test(sw)) bad('sw.js missing deep vendor precache');

const smokeFiles = ['smoke-gestures.html','smoke-touch.html','smoke-a11y.html','smoke-deep.html','smoke-input.html','smoke-suite.html','smoke-viz.html'];
if (!fs.existsSync('lib/deep-payloads.mjs')) bad('missing lib/deep-payloads.mjs');
for (const f of smokeFiles) {
  if (!fs.existsSync('scripts/' + f)) bad('missing scripts/' + f);
}

const words = fs.readFileSync('index.html','utf8');
if (!/role="dialog"/.test(words) || !/aria-modal="true"/.test(words)) bad('words settings dialog');
if (!new RegExp('suite\\\\.js\\\\?v=' + CACHE_V).test(words)) bad('words suite cache v=' + CACHE_V);
const time = fs.readFileSync('timecount/index.html','utf8');
if (!/role="dialog"/.test(time) || !/aria-modal="true"/.test(time)) bad('time settings dialog');
if (!fs.existsSync('tools/index.html')) bad('missing tools map');
if (!fs.existsSync('manifest.webmanifest')) bad('missing manifest');
if (!fs.existsSync('lib/calc/index.mjs')) bad('missing calc lib');
if (!fs.existsSync('scripts/verify-live.sh')) bad('missing scripts/verify-live.sh');

const mapHtml = fs.readFileSync('tools/index.html','utf8');
for (const t of tools) {
  if (!new RegExp('"' + t + '"|/' + t + '/').test(mapHtml) && !new RegExp("id: '" + t + "'").test(suite)) {
    /* map is JS-rendered; suite must list every tool */
  }
}
for (const t of tools) {
  if (!new RegExp("id: '" + t + "'").test(suite)) bad('suite.js missing tool ' + t);
}

if (fail) { console.error(fail + ' contract failures'); process.exit(1); }
console.log('OK static (' + tools.length + ' tools + desk + map)');
NODE

echo ""
echo "Browser smokes (open each — document.title must be PASS):"
for f in smoke-gestures smoke-touch smoke-a11y smoke-deep smoke-input smoke-suite smoke-viz; do
  echo "  $BASE/scripts/${f}.html"
done
echo ""
echo "After deploy: scripts/verify-live.sh"
