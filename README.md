# Word Counter

A word counter. Nothing else.

Paste or type text. The primary number is yours to choose. Secondary metrics sit underneath — or fold away. Your draft and settings persist in the browser via `localStorage`. No accounts, no network, no build step.

## Intent

| | |
|---|---|
| **Job** | Count words (and a few related metrics) with zero friction |
| **Success** | Open → type/paste → numbers update instantly |
| **Constraint** | Single file, no build step; works offline aside from optional webfonts |
| **Non-goals** | Accounts, export, AI, formatting tools, SEO content suites |

**Design ethos (Rams):** useful first; as little UI as possible; quiet chrome; honest states; thorough details (targets, selection, voice, print) without turning into a dashboard.

## Open it

```bash
open index.html
```

Or drop the folder on any static host (GitHub Pages, Netlify, Cloudflare Pages, etc.). There is nothing to install or compile.

## What it counts

| Metric | How |
|---|---|
| **Words** | Whitespace-separated tokens after trim |
| **Characters** | Full string length, including spaces |
| **Sentences** | Heuristic split on `.` `!` `?` `…` |
| **Paragraphs** | Blocks separated by blank lines |
| **Reading** | ~200 words per minute, shown as `m:ss` |

Word and sentence rules are tuned for English prose. They are good enough for drafts and essays; they are not a linguistic parser.

## Settings

Open **Settings** in the masthead. Choices are stored under `wordcounter.settings`.

### Layout

| Mode | Behavior |
|---|---|
| **Hero** *(default)* | Large primary metric + secondary row (primary omitted from the row) |
| **Compact** | All metrics in a dense strip; more room for the textarea |
| **Focus** | Only the primary metric; everything else hidden |

### Primary metric

Any counted value can be the hero number: words, characters, sentences, paragraphs, or reading time.

### Font

**Chrome** (interface) and **type** (draft) are separate.

Chrome faces — each nods to a reference:

| Setting | Mimics | Face |
|---|---|---|
| **braun** | Braun manuals | Helvetica Neue |
| **monocle** | Monocle magazine | Source Sans 3 |
| **bauhaus** | Bauhaus / geometric modern | Josefin Sans |
| **noyes** | Eliot Noyes / IBM | IBM Plex Sans |
| **ikea** | IKEA catalog | Verdana |
| **military** | Field manuals | Oswald (tracked caps) |
| **terminal** | CLI / teletype | System mono |
| **nyt** | New York Times | Georgia |

Draft **type** follows the active **chrome** style: sans / serif / book / mono are that style’s family (e.g. Noyes → IBM Plex Sans/Serif/Mono). **Dyslexic** is OpenDyslexic in every style.

### Reach

When a word target is met, **reach** picks the cue:

| Mode | Behavior |
|---|---|
| **Tint** | Goal fraction turns mark-red (default) |
| **Wash** | Soft green wash across the page |
| **Dot** | Small red mark above the hero number |
| **Alarm** | Red flash on the hero (and a brief page pulse when you cross) |
| **Tag** | Rounded pill on the `/ target` label |

One orb in the masthead cycles **light → dark → contrast → paper**. Click it (or `⌘/Ctrl+Shift+T`). Preference is stored with the other settings.

### Target

Enter a word goal (e.g. `200`). The Nth word in the draft gets a quiet red underline/wash so you can see where you’ll cross the line. Leave blank to turn it off.

A progress chart appears under the hero when a target is set. **Chart** in Settings picks the shape:

| Chart | Idea |
|---|---|
| **Dots** | Isotype grid — each filled dot is progress toward the goal |
| **Squares** | Waffle grid — same encoding, sharper geometry |
| **Ticks** | Braun-style meter — short/tall marks like an instrument scale |
| **Bar** | Single horizontal fill |
| **Ring** | 1–5 donuts that subdivide the goal (~60 words each when possible) and flex to fill the row |

Goals above 100 words collapse for dots/squares/ticks so each mark ≈ several words. Hits goal → marks turn green.

### Stop word

Settings → **stop word** (default `stop listening`). Say that phrase while dictating to end recording; the phrase is stripped and not inserted.

### Annotate

Click a metric in the strip (**Words**, **Characters**, **Sentences**, **Paragraphs**) to underline each unit in the text. Sesame-bright colors, rounded underline tips, and tiny footnote indices (`¹` `²` `³`…) count them in place. Click again to clear.

### Voice

If the browser supports the Web Speech API, a mic appears in the masthead.

1. First visit explains the browser mic prompt once, then remembers (`localStorage`).
2. While listening, a dock shows status + **live italic interim text**; finals land at the caret.
3. Say your **stop word**, or tap **stop** / mic / `esc`, to end.
4. If the browser already granted the mic, we skip re-prompting when possible.

Needs https or localhost. No AI — browser speech recognition only.

### Keyboard

| Key | Action |
|---|---|
| `Esc` | Close settings / stop voice / cancel clear / clear annotate |
| `⌘/Ctrl+K` | Focus the draft |
| `⌘/Ctrl+,` | Toggle settings |
| `⌘/Ctrl+Shift+T` | Cycle theme |
| `⌘/Ctrl+Shift+M` | Toggle voice |
| `⌘/Ctrl+Shift+⌫` | Clear (asks confirm) |
| `/` | Focus draft (when not typing in a field) |

Select text in the draft to see a **selection** count in the hero.

## Time counter

Sibling tool at [`timecount/index.html`](timecount/index.html) — a **chronograph**, not a clone of the word counter.

| Mode | Job |
|---|---|
| **Duration** | How long have I been at this? Optional limit arc; pause creates **segments**. |
| **Limit** | Count down to a preset (5m · 15m · 25m · 1h). Face shows **remaining**; ring / chart fill. |
| **Splits** | Mark **split** times; record table shows split + total columns. |

Layout: masthead (modes left, limit presets + theme + settings right) → dial face (time + optional ring) → optional chart → start / reset lower-right → record (when density = full). Dial and chart are independent layers. Same suite menu and shared theme as word counter.

## Tools suite

Top-right **panel** (icons + micro titles) links every live instrument. Theme / chrome / font sync via `localStorage` key `ibm.tools.shared`. Regenerate number pages with `node scripts/gen-number-tools.mjs`. Quiet map: [`/tools/`](tools/).

| Group | Tools |
|---|---|
| **desk** | words, time |
| **money** | bill, hourly, budget, fuel, tax |
| **convert** | unit, dose, bandwidth (`/bitrate/`), scale (`/scalemap/`), pace |
| **form** | ratio, type (`/typescale/`), exposure, contrast |
| **chance** | odds, combo, deal, sample, streak, bayes |

Number tools share gestures, settings, stage viz, **copy** / **link** (URL field state), and print styles via `lib/number-tool.*`. Pure formulas for agents/tests: `lib/calc/index.mjs` (+ `lib/count.mjs`, `lib/time.mjs`).

## Testing

Fast checks (no browser):

```bash
node test.mjs                 # unit tests — count, calc, deep-viz map, markup
scripts/run-smoke.sh          # unit + static HTML contracts
```

Browser smokes (serve repo root, open each page — `document.title` must be `PASS`):

```bash
python3 -m http.server 8777 &
# open http://127.0.0.1:8777/scripts/smoke-gestures.html
# open http://127.0.0.1:8777/scripts/smoke-touch.html
# open http://127.0.0.1:8777/scripts/smoke-a11y.html
# open http://127.0.0.1:8777/scripts/smoke-deep.html
# open http://127.0.0.1:8777/scripts/smoke-input.html
# open http://127.0.0.1:8777/scripts/smoke-suite.html
```

After deploy:

```bash
scripts/verify-live.sh        # curl matrix for ibm.io + GreenGeeks origin
```

Gate before deploy: `node test.mjs` + `scripts/run-smoke.sh` green + all six smoke pages `PASS` + `scripts/verify-live.sh` green.

## File layout

```
wordcounter/
├── index.html              # Word counter
├── timecount/              # Time counter
├── tools/                  # Quiet suite map
├── bill/ hourly/ budget/ … # Number instruments (each index.html)
├── bandwidth/              # Redirect → /bitrate/
├── icons/                  # PWA icons
├── manifest.webmanifest
├── sw.js                   # Offline shell for static assets
├── lib/
│   ├── count.mjs           # Pure word metrics (pages + MCP + tests)
│   ├── time.mjs            # Pure time metrics
│   ├── calc/               # Shared number-tool formulas (MCP + tests)
│   ├── suite.js            # Panel nav + shared theme
│   ├── number-tool.js      # Settings, gestures, stage, share/URL
│   └── number-tool.css
├── scripts/
│   ├── gen-number-tools.mjs
│   ├── sync-deploy.sh
│   └── smoke-*.html / run-smoke.sh / verify-live.sh
├── mcp/                    # Cloudflare Worker MCP
├── README.md
└── AGENTS.md
```

## Production

Live desk apps at [ibm.io/wordcount](https://ibm.io/wordcount/) and [ibm.io/timecount](https://ibm.io/timecount/); suite map at [ibm.io/tools](https://ibm.io/tools/); number tools at sibling paths (`/bill/`, `/unit/`, …). Deploy steps in `AGENTS.md`. Dual origin: Cloudflare Worker + GreenGeeks mirror.

## License

Use it however you like.
