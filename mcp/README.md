# Word Counter MCP server

Remote MCP (Model Context Protocol) server for [ibm.io/wordcount](https://ibm.io/wordcount/). Lets ChatGPT, Claude, Gemini, and other MCP clients count words with the same rules as the static app.

**Live endpoint:** `https://wordcount-mcp.mhsenkow.workers.dev/mcp`

## Tools

| Tool | Description |
|---|---|
| `count_text` | Returns words, characters, characters without spaces, sentences, paragraphs, reading/speaking time, pages + widget |
| `open_word_counter` | Blank or pre-filled editor widget with optional word goal |
| `open_full_counter` | Deep link to full offline editor (optional draft + target in URL) |
| `compare_text` | Before/after delta for two text versions |

Text is processed in memory for the request only — nothing is stored.

## Develop

```bash
cd mcp
npm install
npm run dev          # http://127.0.0.1:8787/mcp
```

## Deploy

```bash
cd mcp
npm run deploy       # → wordcount-mcp.mhsenkow.workers.dev
```

Requires Cloudflare Wrangler auth for account `mhsenkow`.

## Verify

```bash
# Info
curl -sS https://wordcount-mcp.mhsenkow.workers.dev/

# Count via MCP
curl -sS -X POST https://wordcount-mcp.mhsenkow.workers.dev/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"count_text","arguments":{"text":"Hello world."}}}'

# Parity with static app
node ../test.mjs
```

**MCP Inspector:** `npx @modelcontextprotocol/inspector` → connect to `https://wordcount-mcp.mhsenkow.workers.dev/mcp` (Streamable HTTP).

## ChatGPT (Apps SDK / plugin)

1. Enable **Developer Mode** in ChatGPT settings.
2. Add MCP server URL: `https://wordcount-mcp.mhsenkow.workers.dev/mcp`
3. Prompt: *“Count words in: The quick brown fox jumps over the lazy dog.”*
4. Expect `count_text` + widget when visual output is appropriate.

**Submit for directory listing:** see [SUBMISSION.md](./SUBMISSION.md) and [OpenAI plugin submission portal](https://developers.openai.com/apps-sdk/deploy/submission).

## Claude (custom connector)

**Pro / Max / Free:**

1. **Customize → Connectors → Add custom connector**
2. URL: `https://wordcount-mcp.mhsenkow.workers.dev/mcp`
3. No OAuth required (authless server)

**Team / Enterprise:** an owner adds the connector under **Organization settings → Connectors** first; users then enable it individually.

Optional: apply for the [Claude Connectors Directory](https://claude.com/docs/connectors/directory) once stable.

## Gemini (API)

Remote MCP in the Interactions API:

```json
{
  "type": "mcp_server",
  "name": "ibm.io Word Counter",
  "url": "https://wordcount-mcp.mhsenkow.workers.dev/mcp"
}
```

## Cursor / Claude Desktop (local proxy)

```json
{
  "mcpServers": {
    "wordcount": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://wordcount-mcp.mhsenkow.workers.dev/mcp"]
    }
  }
}
```

## Shared counting logic

Metrics come from [`../lib/count.mjs`](../lib/count.mjs) — same algorithms as `index.html` and `test.mjs`.
