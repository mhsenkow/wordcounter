#!/usr/bin/env node
/**
 * Self-tests for wordcounter pure helpers + markup contracts.
 * Run: node test.mjs
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  count,
  readingTime,
  speakingTime,
  pageEstimate,
  countFull,
  limitCheck,
  countDelta,
  buildFullCounterUrl,
  parseCounterHandoff
} from './lib/count.mjs';
import { parseDuration, formatClock } from './lib/time.mjs';
import {
  billSplit,
  taxTip,
  paceEta,
  contrastRatio,
  combinations,
  bayesUpdate,
  formatDurationHours
} from './lib/calc/index.mjs';
import { VEGA, WEBGL, ALL_TOOLS as PAYLOAD_TOOLS, scrubFor } from './lib/deep-payloads.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log('ok  -', name);
  } catch (err) {
    failed++;
    console.error('fail -', name);
    console.error('     ', err.message);
  }
}

function ringPlan(words, target) {
  const IDEAL = 55;
  let best = 1;
  let bestScore = Infinity;
  for (let c = 1; c <= 5; c++) {
    const per = target / c;
    let score = Math.abs(per - IDEAL);
    if (per < 20) score += (20 - per) * 3;
    if (per > 140) score += (per - 140) * 0.35;
    if (target % c === 0) score *= 0.72;
    if (score < bestScore) {
      bestScore = score;
      best = c;
    }
  }
  const per = target / best;
  const rings = [];
  for (let i = 0; i < best; i++) {
    const start = i * per;
    const filled = Math.max(0, Math.min(per, words - start));
    rings.push({
      pct: (filled / per) * 100,
      full: filled >= per - 0.0001
    });
  }
  return { count: best, per, rings };
}

function useWebFaces(faces, online) {
  if (faces === 'local') return false;
  if (faces === 'web') return true;
  return online !== false;
}

function typeStack(facesMap, ui, font) {
  const family = facesMap[ui] || facesMap.braun;
  return family[font] || family.sans;
}

// --- markup contracts ---
test('webFonts link has id for local disable', () => {
  assert.match(html, /id="webFonts"/);
});

test('faces setting radios exist', () => {
  assert.match(html, /name="faces" value="auto"/);
  assert.match(html, /name="faces" value="web"/);
  assert.match(html, /name="faces" value="local"/);
});

test('draft share + copy actions present', () => {
  assert.match(html, /id="copyDraft"/);
  assert.match(html, /id="shareDraft"/);
  assert.match(html, /class="draft-action"/);
});

test('TYPE_FACES_WEB and LOCAL both defined', () => {
  assert.match(html, /var TYPE_FACES_WEB =/);
  assert.match(html, /var TYPE_FACES_LOCAL =/);
  assert.match(html, /var UI_FONTS_WEB =/);
  assert.match(html, /var UI_FONTS_LOCAL =/);
});

test('undo / haptic / wake lock helpers wired', () => {
  assert.match(html, /function armUndo/);
  assert.match(html, /function doUndoClear/);
  assert.match(html, /function haptic\(/);
  assert.match(html, /navigator\.vibrate/);
  assert.match(html, /function requestWakeLock/);
  assert.match(html, /wakeLock\.request\('screen'\)/);
  assert.match(html, /function shareDraftText/);
});

// --- count ---
test('count empty', () => {
  assert.deepEqual(count(''), {
    words: 0,
    chars: 0,
    charsNoSpaces: 0,
    sentences: 0,
    paragraphs: 0
  });
});

test('count chars without spaces', () => {
  assert.equal(count('a b c').charsNoSpaces, 3);
  assert.equal(count('hello\nworld').charsNoSpaces, 10);
});

test('limitCheck over and under', () => {
  const c = count('one two three four five');
  const over = limitCheck(c, 3);
  assert.equal(over.overBy, 2);
  assert.equal(over.underBy, 0);
  assert.equal(over.status, 'over');
  const under = limitCheck(count('hi there'), 10);
  assert.equal(under.underBy, 8);
  assert.equal(under.status, 'under');
});

test('countDelta', () => {
  const d = countDelta('hello world', 'hello brave new world');
  assert.ok(d.delta.words > 0);
  assert.equal(d.before.words, 2);
});

test('speakingTime and pages', () => {
  assert.equal(speakingTime(130), '1:00');
  assert.equal(pageEstimate(250), 1);
  assert.equal(pageEstimate(0), 0);
});

test('countFull includes extended metrics', () => {
  const f = countFull('word');
  assert.ok(f.reading);
  assert.ok(f.speaking);
  assert.equal(f.pages, 0);
});

test('buildFullCounterUrl and parse handoff', () => {
  const url = buildFullCounterUrl({ text: 'hello', target: 500 });
  assert.match(url, /target=500/);
  assert.match(url, /text=hello/);
  const parsed = parseCounterHandoff(new URL(url));
  assert.equal(parsed.text, 'hello');
  assert.equal(parsed.target, 500);
});

test('count words and sentences', () => {
  const c = count('Hello world. Next line!');
  assert.equal(c.words, 4);
  assert.equal(c.sentences, 2);
  assert.ok(c.chars > 10);
});

test('count paragraphs', () => {
  assert.equal(count('one\n\ntwo').paragraphs, 2);
  assert.equal(count('one\ntwo').paragraphs, 1);
});

test('readingTime format', () => {
  assert.equal(readingTime(0), '0:00');
  assert.equal(readingTime(200), '1:00');
  assert.equal(readingTime(4), '0:01');
});

// --- ring plan ---
test('ringPlan prefers ~55-word chunks', () => {
  const rp = ringPlan(0, 165);
  assert.equal(rp.count, 3);
  assert.equal(rp.per, 55);
});

test('ringPlan fills left to right', () => {
  const rp = ringPlan(80, 165);
  assert.equal(rp.rings[0].full, true);
  assert.ok(rp.rings[1].pct > 0 && rp.rings[1].pct < 100);
  assert.equal(rp.rings[2].pct, 0);
});

// --- faces tier ---
test('useWebFaces auto/web/local', () => {
  assert.equal(useWebFaces('local', true), false);
  assert.equal(useWebFaces('web', false), true);
  assert.equal(useWebFaces('auto', true), true);
  assert.equal(useWebFaces('auto', false), false);
});

test('local stacks still resolve roles', () => {
  const LOCAL = {
    braun: {
      sans: 'Helvetica, Arial, sans-serif',
      serif: 'Times, serif',
      book: 'Palatino, Georgia, serif',
      mono: 'Menlo, monospace',
      dyslexic: 'Comic Sans MS, sans-serif'
    }
  };
  assert.match(typeStack(LOCAL, 'braun', 'sans'), /Helvetica/);
  assert.match(typeStack(LOCAL, 'braun', 'mono'), /Menlo/);
  assert.match(typeStack(LOCAL, 'missing', 'book'), /Palatino/);
});

test('index.html still single-file (no bundler markers)', () => {
  assert.doesNotMatch(html, /webpack|vite|parcel/i);
  assert.ok(html.length > 20000);
});

test('calc tax tip on pre-tax', () => {
  const r = taxTip({ subtotal: 100, taxPct: 10, tipPct: 20, tipOn: 'pre' });
  assert.equal(r.taxAmount, 10);
  assert.equal(r.tipAmount, 20);
  assert.equal(r.grand, 130);
});

test('calc tax tip on total', () => {
  const r = taxTip({ subtotal: 100, taxPct: 10, tipPct: 20, tipOn: 'total' });
  assert.equal(r.taxAmount, 10);
  assert.equal(r.tipAmount, 22);
  assert.equal(r.grand, 132);
});

test('calc pace eta', () => {
  const r = paceEta({ distance: 10, paceMinPerUnit: 6, hours: 0, mode: 'eta' });
  assert.equal(r.etaHours, 1);
});

test('calc contrast black on white', () => {
  const r = contrastRatio('#000000', '#ffffff');
  assert.ok(r.ratio >= 20);
  assert.equal(r.aaa, true);
});

test('calc combinations', () => {
  assert.equal(combinations(5, 2), 10);
  assert.equal(combinations(10, 0), 1);
});

test('calc bayes update', () => {
  const r = bayesUpdate({ prior: 0.1, hit: 0.9, miss: 0.2 });
  assert.ok(r.posterior > r.prior);
  assert.ok(r.posterior < 1);
});

test('parse duration helpers', () => {
  assert.equal(parseDuration('25m'), 25 * 60000);
  assert.equal(formatClock(65000), '1:05');
});

const ALL_TOOLS = [
  'bill', 'hourly', 'fuel', 'unit', 'dose', 'bitrate', 'scalemap', 'ratio',
  'typescale', 'odds', 'combo', 'sample', 'budget', 'exposure', 'deal',
  'streak', 'tax', 'pace', 'contrast', 'bayes'
];

test('all 20 number tools exist with live HTML', () => {
  for (const id of ALL_TOOLS) {
    const p = path.join(__dirname, id, 'index.html');
    assert.ok(fs.existsSync(p), id + ' missing');
    const html = fs.readFileSync(p, 'utf8');
    assert.ok(html.length > 5000, id + ' index.html too small');
    assert.doesNotMatch(html, /coming soon/i);
  }
});

test('deep-viz covers all 20 tools', () => {
  const deep = fs.readFileSync(path.join(__dirname, 'lib/deep-viz.js'), 'utf8');
  assert.match(deep, /IBMDeepViz/);
  const webgl = new Set();
  const specs = new Set();
  const vegaScrub = new Set();
  const webglScrub = new Set();
  let m;
  const webglRe = /var WEBGL = \{([^}]+)\}/;
  const specsRe = /var SPECS = \{([^}]+)\}/;
  const vegaScrubRe = /var VEGA_SCRUB = \{([^}]+)\}/;
  const webglScrubRe = /var WEBGL_SCRUB = \{([^}]+)\}/;
  const wm = deep.match(webglRe);
  const sm = deep.match(specsRe);
  const vsm = deep.match(vegaScrubRe);
  const wsm = deep.match(webglScrubRe);
  assert.ok(wm && sm, 'deep-viz WEBGL/SPECS maps missing');
  const keyRe = /(\w+)\s*:/g;
  while ((m = keyRe.exec(wm[1]))) webgl.add(m[1]);
  keyRe.lastIndex = 0;
  while ((m = keyRe.exec(sm[1]))) specs.add(m[1]);
  if (vsm) { keyRe.lastIndex = 0; while ((m = keyRe.exec(vsm[1]))) vegaScrub.add(m[1]); }
  if (wsm) { keyRe.lastIndex = 0; while ((m = keyRe.exec(wsm[1]))) webglScrub.add(m[1]); }
  for (const id of ALL_TOOLS) {
    assert.ok(webgl.has(id) || specs.has(id), id + ' missing from deep-viz');
    if (webgl.has(id)) {
      assert.ok(webglScrub.has(id), id + ' missing WEBGL_SCRUB');
      assert.ok(!vegaScrub.has(id), id + ' wrongly in VEGA_SCRUB');
    } else {
      assert.ok(vegaScrub.has(id), id + ' missing VEGA_SCRUB');
      assert.ok(!webglScrub.has(id), id + ' wrongly in WEBGL_SCRUB');
    }
  }
});

test('deep payload contracts match deep-viz scrub maps', () => {
  const deep = fs.readFileSync(path.join(__dirname, 'lib/deep-viz.js'), 'utf8');
  const vegaBlock = deep.match(/var VEGA_SCRUB = \{([^}]+)\}/);
  const webglBlock = deep.match(/var WEBGL_SCRUB = \{([^}]+)\}/);
  assert.ok(vegaBlock && webglBlock, 'scrub maps in deep-viz.js');
  for (const id of PAYLOAD_TOOLS) {
    const scrub = scrubFor(id);
    assert.ok(scrub, id + ' scrubFor');
    const re = new RegExp(id + ":\\s*['\"]" + scrub + "['\"]");
    if (WEBGL[id]) {
      assert.match(webglBlock[1], re, id + ' WEBGL_SCRUB');
      assert.ok(!vegaBlock[1].includes(id + ':'), id + ' should not be in VEGA_SCRUB');
    } else {
      assert.match(vegaBlock[1], re, id + ' VEGA_SCRUB');
      assert.ok(!webglBlock[1].includes(id + ':'), id + ' should not be in WEBGL_SCRUB');
    }
    const html = fs.readFileSync(path.join(__dirname, id, 'index.html'), 'utf8');
    assert.match(html, /paintDeep\s*\(/, id + ' paintDeep call');
    if (WEBGL[id]) {
      assert.match(html, new RegExp('id="' + scrub + '"'), id + ' scrub input in HTML');
    }
  }
});

test('calc bill split', () => {
  const r = billSplit({ total: 100, tipPct: 20, people: 4 });
  assert.equal(r.grand, 120);
  assert.equal(r.perPerson, 30);
  assert.equal(r.people, 4);
});

test('calc format duration hours', () => {
  assert.equal(formatDurationHours(1.5), '1:30');
  assert.equal(formatDurationHours(0.25), '15 min');
});

test('suite has new instruments', () => {
  const suite = fs.readFileSync(path.join(__dirname, 'lib/suite.js'), 'utf8');
  for (const id of ['tax', 'pace', 'contrast', 'bayes']) {
    assert.match(suite, new RegExp("id: '" + id + "'"));
    assert.ok(fs.existsSync(path.join(__dirname, id, 'index.html')));
  }
  assert.ok(fs.existsSync(path.join(__dirname, 'tools/index.html')));
  assert.ok(fs.existsSync(path.join(__dirname, 'manifest.webmanifest')));
});

if (failed) {
  console.error('\n' + failed + ' failed');
  process.exit(1);
}
console.log('\nall passed');
