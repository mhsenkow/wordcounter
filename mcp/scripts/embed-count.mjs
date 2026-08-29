#!/usr/bin/env node
/** Generates mcp/src/count-bundle.txt from lib/count.mjs for the widget iframe. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const src = fs.readFileSync(path.join(root, 'lib/count.mjs'), 'utf8');
const body = src
  .replace(/^\/\*\*[\s\S]*?\*\/\n/m, '')
  .replace(/^export function /gm, 'function ')
  .trim();

const out = `/* AUTO-GENERATED from lib/count.mjs — node mcp/scripts/embed-count.mjs */
(function (global) {
${body}
  global.WCCount = {
    count: count,
    readingTime: readingTime,
    speakingTime: speakingTime,
    pageEstimate: pageEstimate,
    countWithReading: countWithReading,
    countFull: countFull,
    limitCheck: limitCheck,
    countDelta: countDelta,
    formatSummary: formatSummary,
    buildFullCounterUrl: buildFullCounterUrl,
    parseCounterHandoff: parseCounterHandoff
  };
})(typeof window !== 'undefined' ? window : globalThis);
`;

const dest = path.join(root, 'mcp/src/count-bundle.txt');
fs.writeFileSync(dest, out);
console.log('wrote', dest);
