# Agent notes — Word Counter (`ibm.io/wordcount`)

Static single-file app. No build, no package manager, no framework.

## Live hosting (keep both in sync)

| Surface | Where the files live | Who serves `/wordcount` |
|---|---|---|
| **GreenGeeks (origin)** | cPanel: `/home/mhsenkow/public_html/ibm.io/wordcount/index.html` | LiteSpeed on `chi202.greengeeks.net` (IP `184.154.70.198`) when a client still hits GG for apex `ibm.io` |
| **Cloudflare Worker** | Portfolio repo: `portfolio/public/wordcount/index.html` → Worker `portfolio` | `ibm.io` / `www.ibm.io` / `portfolio.mhsenkow.workers.dev` when DNS is Cloudflare |

**DNS stays on Cloudflare** (`dimitris.ns.cloudflare.com`, `tessa.ns.cloudflare.com`). Do **not** point nameservers back at GreenGeeks.

Public URL: `https://ibm.io/wordcount/` (and `https://www.ibm.io/wordcount/`).

Some local machines still resolve apex `ibm.io` to the GreenGeeks IP (stale cache). That is why the GG copy must stay current — not only the Worker.

## How to update (checklist)

1. Edit **`index.html`** in this repo (`/Users/powerox/wordcounter` or wherever this project lives).
2. **GreenGeeks** — upload the same file to:
   - Path: `public_html/ibm.io/wordcount/index.html`
   - Via: GreenGeeks → hosting → cPanel → File Manager → Upload (overwrite), **or** FTP/SFTP to `chi202.greengeeks.net`, user `mhsenkow` (password from the GreenGeeks/cPanel panel — never commit it).
3. **Cloudflare** — copy into the portfolio app and deploy:
   ```bash
   cp index.html /path/to/portfolio/portfolio/public/wordcount/index.html
   cd /path/to/portfolio/portfolio
   npm run deploy   # opennextjs-cloudflare build + deploy
   ```
   Wrangler account used previously: Cloudflare account owning Worker `portfolio` (custom domains `ibm.io`, `www.ibm.io`).
4. **Verify both**:
   ```bash
   # Cloudflare edge
   curl -sS -o /dev/null -w "%{http_code} %{size_download}\n" https://www.ibm.io/wordcount/
   curl -sS -o /dev/null -w "%{http_code} %{size_download}\n" https://portfolio.mhsenkow.workers.dev/wordcount/

   # GreenGeeks origin (Host header)
   curl -sS -o /dev/null -w "%{http_code} %{size_download}\n" -H "Host: ibm.io" http://184.154.70.198/wordcount/
   ```
   Sizes should match local `wc -c index.html`.

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

The static site footer links to the MCP info page for ChatGPT / Claude connector setup.
