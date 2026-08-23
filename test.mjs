#!/usr/bin/env node
/**
 * Self-tests for wordcounter pure helpers + markup contracts.
 * Run: node test.mjs
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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

function count(s) {
  const trimmed = String(s || '').trim();
  return {
    words: trimmed ? trimmed.split(/\s+/).length : 0,
    chars: String(s || '').length,
    sentences: (trimmed.match(/[^\s.!?…]+(?:[^.!?…]*[.!?…]+|[^.!?…]*$)/g) || []).length,
    paragraphs: trimmed
      ? trimmed.split(/\n\s*\n/).filter((p) => p.trim()).length
      : 0
  };
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
  assert.match(html, /class="draft-actions"/);
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
  assert.deepEqual(count(''), { words: 0, chars: 0, sentences: 0, paragraphs: 0 });
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

if (failed) {
  console.error('\n' + failed + ' failed');
  process.exit(1);
}
console.log('\nall passed');
