# Agent notes — Word Counter (`ibm.io/wordcount`)

Static single-file apps. No build, no package manager, no framework.

## Tools suite

Surreptitious **tools panel** (top-right grid): icons + micro titles, grouped. Theme/chrome/font sync via `localStorage` key `ibm.tools.shared` (`lib/suite.js`). Quiet map at [`tools/`](tools/) (`/tools/`).

| Group | Tool | Path | URL | Status |
|---|---|---|---|---|
| desk | **words** | `index.html` | `/wordcount/` | live |
| desk | **time** | `timecount/index.html` | `/timecount/` | live |
| money | **bill** | `bill/` | `/bill/` | live |
| money | **hourly** | `hourly/` | `/hourly/` | live |
| money | **budget** | `budget/` | `/budget/` | live |
| money | **fuel** | `fuel/` | `/fuel/` | live |
| money | **tax** | `tax/` | `/tax/` | live |
| convert | **unit** | `unit/` | `/unit/` | live |
| convert | **dose** | `dose/` | `/dose/` | live |
| convert | **bandwidth** | `bitrate/` | `/bitrate/` | live · labeled bandwidth |
| convert | **scale** | `scalemap/` | `/scalemap/` | live · labeled scale |
| convert | **pace** | `pace/` | `/pace/` | live |
| form | **ratio** | `ratio/` | `/ratio/` | live |
| form | **type** | `typescale/` | `/typescale/` | live · labeled type |
| form | **exposure** | `exposure/` | `/exposure/` | live |
| form | **contrast** | `contrast/` | `/contrast/` | live |
| chance | **odds** | `odds/` | `/odds/` | live |
| chance | **combo** | `combo/` | `/combo/` | live |
| chance | **deal** | `deal/` | `/deal/` | live |
| chance | **sample** | `sample/` | `/sample/` | live |
| chance | **streak** | `streak/` | `/streak/` | live |
| chance | **bayes** | `bayes/` | `/bayes/` | live |

## Deploy sync

```bash
# Keep suite copies identical, mirror into portfolio/public
scripts/sync-deploy.sh

# Mirror + FTP GreenGeeks
scripts/sync-deploy.sh --ftp

# Mirror + Cloudflare Worker deploy
scripts/sync-deploy.sh --cf

# Everything
scripts/sync-deploy.sh --all
```

`PORTFOLIO_PUBLIC` overrides the default `/Users/powerox/portfolio/portfolio/public`.

Regenerate number-tool pages: `node scripts/gen-number-tools.mjs`. Keep `lib/suite.js` and `timecount/lib/suite.js` identical. Number tools load `lib/number-tool.css` + `lib/number-tool.js` for the same theme / chrome / digits / faces settings (synced via `ibm.tools.shared`) plus optional viz layers. Shared formulas for MCP/tests live in `lib/calc/index.mjs`.

### Gesture vocabulary (number tools)

| Surface | Vertical | Horizontal | Notes |
|---|---|---|---|
| Face / chart | `data-primary` | `data-axis-x` | Pinch → `data-pinch` or primary |
| Chart `[data-scrub]` | that input | same | Mapped viz cell; tab/focus + arrows nudge; `pointer-events` |
| Value row | that row’s input | same field | Tap (no drag) focuses to type |
| Stack | scroll if mid-list | — | Wheel defers while scrollable |
| Ratio stage | own drag | own drag | Skips shared scrub |
| Steppers | ± hold | — | Independent of scrub |
| Words primary | — | cycle metric | Touch swipe + wheel/drag on hero (never the draft) |
| Time dial / chart | nudge limit | coarse 5m | Accel wheel, arrows/`[` `]`, soft presets while running |

Attrs on inputs: `data-primary`, `data-axis-x`, `data-pinch`, `data-step-fast`.
Number tools: haptic `vibrate(8)` on each stepped change; blur clamps min/max (soft red flash); percent fields default 0–100 when unit is `%`.

Desk apps: words primary swipe cycles metrics; time dial scrub nudges limit. Number tools also support **copy** / **link** under the face (clipboard result + URL field hydrate) and print styles.

### Persistence

| Key | Scope | Fields |
|---|---|---|
| `ibm.tools.shared` | suite-wide | `theme`, `ui`, `font`, `faces`, `recent`, optional `lastSessionMs` |
| `ibm.tools.session` | time → words hint | `elapsedMs`, `label`, `updatedAt` |
| `ibm.tool.<id>.settings` | one number tool | look + `showViz` + extras |
| `ibm.tool.<id>.values` | one number tool | last field/select values (URL params win on share links) |
| `wordcounter.settings` / `wordcounter.text` | words | desk-local |
| timecount local keys | time | desk-local |

### Product boundaries

- In-page tools stay local / offline-first. No accounts, export suites, or AI inside the static pages.
- MCP connector is a separate Worker (`mcp/`) for agents — words counts plus suite calcs (`tax_tip`, `pace_eta`, `contrast_ratio`, `combinations`, `bayes_update`, `parse_duration`).
- Suite identity stays quiet: `/tools/` is a map, not a marketing landing; the tools grid is the map.
- PWA: `manifest.webmanifest` + `sw.js` cache static shell assets only.

Look settings prefer `ibm.tools.shared` on load so theme/chrome stay aligned across tools.

## Live hosting (keep both in sync)

| Surface | Where the files live | Who serves `/wordcount` |
|---|---|---|
| **GreenGeeks (origin)** | cPanel: `/home/mhsenkow/public_html/ibm.io/wordcount/index.html` (+ `timecount/index.html`, `lib/suite.js`) | LiteSpeed on `chi202.greengeeks.net` (IP `184.154.70.198`) when a client still hits GG for apex `ibm.io` |
| **Cloudflare Worker** | Portfolio repo: `portfolio/public/wordcount/index.html` → Worker `portfolio` (+ mirror `timecount/` and `lib/`) | `ibm.io` / `www.ibm.io` / `portfolio.mhsenkow.workers.dev` when DNS is Cloudflare |

**DNS stays on Cloudflare** (`dimitris.ns.cloudflare.com`, `tessa.ns.cloudflare.com`). Do **not** point nameservers back at GreenGeeks.

Public URLs: `https://ibm.io/wordcount/`, `https://ibm.io/timecount/`, `https://ibm.io/tools/` (and `www` variants).

Some local machines still resolve apex `ibm.io` to the GreenGeeks IP (stale cache). That is why the GG copy must stay current — not only the Worker.

## How to update (checklist)

1. Edit **`index.html`** (word counter) and/or **`timecount/index.html`** in this repo.
2. **GreenGeeks** — upload to `public_html/ibm.io/`:
   - `wordcount/index.html`, `timecount/index.html` (+ `timecount/lib/suite.js`)
   - Sibling tool folders (`bill/`, `hourly/`, …) and shared `lib/suite.js`
   - Via cPanel File Manager or FTP/SFTP to `chi202.greengeeks.net`, user `mhsenkow` (password from panel — never commit it).
3. **Cloudflare** — mirror into the portfolio app and deploy:
   ```bash
   scripts/sync-deploy.sh --cf
   ```
4. **Verify**:
   ```bash
   curl -sS -o /dev/null -w "%{http_code} %{size_download}\n" https://www.ibm.io/wordcount/
   curl -sS -o /dev/null -w "%{http_code} %{size_download}\n" https://www.ibm.io/bill/
   curl -sS -o /dev/null -w "%{http_code} %{size_download}\n" https://www.ibm.io/tools/
   curl -sS -o /dev/null -w "%{http_code} %{size_download}\n" -H "Host: ibm.io" http://184.154.70.198/bill/
   ```

## Do not

- Require Vercel for `ibm.io` / wordcount.
- Change 101domain nameservers away from Cloudflare for this domain.
- Add a build step, bundler, or backend unless the product intent changes.
- Commit cPanel SSO URLs, session tokens, or FTP passwords.

## Optional: CORS bridge

`portfolio/public/_headers` may include `Access-Control-Allow-Origin: *` for `/wordcount/*` so a logged-in cPanel browser tab can `fetch` the Worker copy and write it via Fileman UAPI. Safe to keep; not required for end users.

## Product constraints (from README)

- Job: count words with zero friction.
- Single file, offline, `localStorage` only.
- Non-goals: accounts, export, AI, SEO suites.

## AI tool (MCP)

Separate Cloudflare Worker — not part of the static `index.html` build.

| Item | Value |
|---|---|
| **MCP URL** | `https://wordcount-mcp.mhsenkow.workers.dev/mcp` |
| **Source** | [`mcp/`](mcp/) in this repo |
| **Deploy** | `cd mcp && npm run deploy` |
| **Docs** | [`mcp/README.md`](mcp/README.md), [`mcp/SUBMISSION.md`](mcp/SUBMISSION.md) |

Verify after deploy:

```bash
curl -sS https://wordcount-mcp.mhsenkow.workers.dev/
curl -sS -X POST https://wordcount-mcp.mhsenkow.workers.dev/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"count_text","arguments":{"text":"Hello world."}}}'
```

Word counter settings include a ChatGPT / Claude icon linking to the MCP demo page for connector setup.
