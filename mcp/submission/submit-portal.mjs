import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EDIT_URL =
  'https://platform.openai.com/plugins/edit/asdk_app_6a8c9fc167cc8191ab878e64b3940ca8/asdk_app_v_6a8c9fc1f7308191b391a7b91276863f';
const ICON512 = path.join(__dirname, 'icon-512.png');
const ICON48 = path.join(__dirname, 'icon-48.png');
const PROFILE = path.join(__dirname, '.pw-openai-profile');

const context = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  channel: 'chrome',
  viewport: { width: 1400, height: 900 },
  slowMo: 80
});
const page = context.pages()[0] || (await context.newPage());

await page.goto(EDIT_URL + '?section=App%20Info', { waitUntil: 'domcontentloaded', timeout: 120000 });
await page.waitForTimeout(3000);

if (page.url().includes('login') || page.url().includes('auth')) {
  console.log('Log in to OpenAI Platform in the opened Chrome window… waiting up to 3 minutes');
  await page.waitForURL(/platform\.openai\.com\/plugins/, { timeout: 180000 });
  await page.goto(EDIT_URL + '?section=App%20Info', { waitUntil: 'domcontentloaded' });
}

const wait = (ms) => page.waitForTimeout(ms);

// Icons — hidden file inputs accept PNG
const fileInputs = page.locator('input[type="file"][accept*="png"]');
await fileInputs.nth(0).setInputFiles(ICON512);
await wait(800);
await fileInputs.nth(1).setInputFiles(ICON48);
await wait(800);

await page.getByRole('textbox', { name: /^Subtitle/ }).fill(
  'Count words, characters, sentences, paragraphs, and reading time'
);
await page.getByRole('textbox', { name: /^Description/ }).fill(
  'Accurate word and character counts for drafts, essays, and snippets — using the same rules as ibm.io/wordcount.\n\n' +
    '• Words, characters, sentences, paragraphs, reading time (~200 wpm)\n' +
    '• Interactive in-chat widget with themes, word goals, and chart visualizations\n' +
    '• Link to the full offline editor for private local editing\n\n' +
    'Text is processed in memory for each request and is not stored on the server.'
);
await page.getByRole('textbox', { name: /Demo Recording URL/ }).fill(
  'https://raw.githubusercontent.com/mhsenkow/wordcounter/main/mcp/submission/demo-recording.mp4'
);
await wait(500);

// MCP tab
await page.getByRole('button', { name: 'MCP', exact: true }).click();
await wait(1000);

const mcpInput = page.locator('input').filter({ hasText: '' }).first();
// Try common selectors for MCP URL field
const urlField =
  page.getByPlaceholder(/mcp/i).first().or(page.locator('input[type="url"]')).or(page.locator('input').nth(0));
const mcpUrlField = page.locator('input[value*="workers.dev"], input[placeholder*="http"], input[name*="mcp" i]').first();
if (await mcpUrlField.count()) {
  await mcpUrlField.fill('https://wordcount-mcp.mhsenkow.workers.dev/mcp');
} else {
  const inputs = page.locator('main input[type="text"], main input:not([type])');
  for (let i = 0; i < (await inputs.count()); i++) {
    const el = inputs.nth(i);
    const ph = (await el.getAttribute('placeholder')) || '';
    if (/url|mcp|server/i.test(ph)) {
      await el.fill('https://wordcount-mcp.mhsenkow.workers.dev/mcp');
      break;
    }
  }
}

const scanBtn = page.getByRole('button', { name: /Scan tools/i });
if (await scanBtn.count()) {
  await scanBtn.click();
  await wait(5000);
}

// Testing tab
await page.getByRole('button', { name: 'Testing', exact: true }).click();
await wait(1000);

async function fillTestRow(index, prompt, response) {
  const prompts = page.locator('textarea, input[type="text"]').filter({ has: page.locator('xpath=..') });
  // Fallback: fill by placeholder patterns
}

const testPrompts = [
  {
    prompt: 'How many words in: Hello world. This is a test.',
    response: '7 words, 2 sentences — opens interactive word counter widget with live counts.'
  },
  {
    prompt: 'Open a word counter',
    response: 'Blank interactive editor widget with settings, themes, word goals, and chart visualizations.'
  },
  {
    prompt: 'Count: The quick brown fox jumps over the lazy dog.',
    response: '9 words, 1 sentence — widget shows hero metric and secondary stats.'
  }
];

const promptBoxes = page.locator('textarea');
const count = await promptBoxes.count();
for (let i = 0; i < Math.min(testPrompts.length, Math.max(0, count - 1)); i++) {
  await promptBoxes.nth(i * 2).fill(testPrompts[i].prompt).catch(() => {});
  await promptBoxes.nth(i * 2 + 1).fill(testPrompts[i].response).catch(() => {});
}

await wait(1000);

// Submit tab
await page.getByRole('button', { name: 'Submit', exact: true }).click();
await wait(1500);

const submitReview = page.getByRole('button', { name: /Submit for review/i });
if (await submitReview.count()) {
  console.log('Ready to submit — clicking Submit for review');
  await submitReview.click();
  await wait(3000);
  console.log('Submitted (or confirmation shown). URL:', page.url());
} else {
  console.log('Submit for review button not found. Open Submit tab manually. URL:', page.url());
  await page.screenshot({ path: path.join(__dirname, 'submit-screen.png'), fullPage: true });
}

console.log('Done. Leaving browser open 5s…');
await wait(5000);
await context.close();
