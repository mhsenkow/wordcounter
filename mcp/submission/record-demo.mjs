import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, 'playwright-video');
const outMp4 = path.join(__dirname, 'demo-recording.mp4');

async function winWidget(page, fn) {
  return page.evaluate(fn);
}

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  recordVideo: { dir: outDir, size: { width: 1280, height: 800 } }
});
const page = await context.newPage();

const wait = (ms) => page.waitForTimeout(ms);

await page.goto('https://wordcount-mcp.mhsenkow.workers.dev/demo/chat', { waitUntil: 'networkidle' });
await page.locator('#widget').waitFor({ state: 'attached', timeout: 15000 });
await wait(1500);

await winWidget(page, () => document.getElementById('widget').contentDocument.getElementById('settingsBtn').click());
await wait(900);

await winWidget(page, () => document.getElementById('widget').contentDocument.querySelector('[data-theme="dark"]').click());
await wait(700);

await winWidget(page, () => {
  const doc = document.getElementById('widget').contentDocument;
  doc.querySelector('input[name="chart"][value="ring"]').click();
  const target = doc.getElementById('targetInput');
  target.value = '500';
  target.dispatchEvent(new Event('input', { bubbles: true }));
});
await wait(900);

await winWidget(page, () => document.getElementById('widget').contentDocument.getElementById('settingsBtn').click());
await wait(500);

await winWidget(page, () => {
  const draft = document.getElementById('widget').contentDocument.getElementById('draft');
  draft.focus();
  draft.value = '';
  draft.dispatchEvent(new Event('input', { bubbles: true }));
});

// Focus iframe body for keyboard events
await page.evaluate(() => document.getElementById('widget').contentWindow.focus());
await page.keyboard.type('The quick brown fox jumps over the lazy dog.', { delay: 40 });
await wait(1200);

await page.locator('#btnEssay').click();
await wait(2000);

await winWidget(page, () => document.getElementById('widget').contentDocument.getElementById('settingsBtn').click());
await wait(600);
await winWidget(page, () => document.getElementById('widget').contentDocument.getElementById('shuffleBtn').click());
await wait(1200);
await winWidget(page, () => document.getElementById('widget').contentDocument.querySelector('input[name="layout"][value="focus"]').click());
await wait(1500);

await context.close();
await browser.close();

const webms = fs.readdirSync(outDir).filter((f) => f.endsWith('.webm'));
if (!webms.length) {
  console.error('No video file in', outDir);
  process.exit(1);
}

const webm = path.join(outDir, webms[0]);
const ff = spawnSync(
  'ffmpeg',
  ['-y', '-i', webm, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', outMp4],
  { stdio: 'inherit' }
);
if (ff.status !== 0) process.exit(ff.status || 1);

fs.rmSync(outDir, { recursive: true, force: true });
console.log('Wrote', outMp4, fs.statSync(outMp4).size, 'bytes');
