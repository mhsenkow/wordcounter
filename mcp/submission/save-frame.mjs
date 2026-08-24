#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const framesDir = new URL('./frames/', import.meta.url);
const outArg = process.argv.find((a) => a.startsWith('--out='));
const outName = outArg ? outArg.slice(6) : `frame-${String(fs.readdirSync(framesDir).filter((f) => f.endsWith('.png')).length + 1).padStart(3, '0')}.png`;

for (const jsonPath of process.argv.slice(2).filter((a) => !a.startsWith('--'))) {
  const j = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const data = j.result?.data ?? j.data;
  if (!data) {
    console.error('No screenshot data in', jsonPath);
    process.exit(1);
  }
  const out = path.join(framesDir.pathname, outName);
  fs.writeFileSync(out, Buffer.from(data, 'base64'));
  console.log('Wrote', out, fs.statSync(out).size);
}
