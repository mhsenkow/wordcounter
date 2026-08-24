# ChatGPT plugin submission — Word Counter

Use this checklist when submitting via the [OpenAI plugin submission portal](https://developers.openai.com/apps-sdk/deploy/submission).

## URLs for submission form

| Field | URL |
|---|---|
| Website | `https://ibm.io/wordcount/` |
| Support | `https://ibm.io/wordcount/` |
| Privacy policy | `https://wordcount-mcp.mhsenkow.workers.dev/privacy` |
| Terms | `https://wordcount-mcp.mhsenkow.workers.dev/terms` |
| Demo | `https://wordcount-mcp.mhsenkow.workers.dev/demo/chat` |
| Demo (MCP API) | `https://wordcount-mcp.mhsenkow.workers.dev/demo` |

## Domain verification

When the portal gives you a token, set it on the Worker:

```bash
cd mcp
npx wrangler secret put OPENAI_APPS_CHALLENGE
# paste the token from the portal
npm run deploy
```

OpenAI checks: `https://wordcount-mcp.mhsenkow.workers.dev/.well-known/openai-apps-challenge`

## MCP server URL

```
https://wordcount-mcp.mhsenkow.workers.dev/mcp
```

Universal URL (same for all users). Authless — no OAuth setup required unless review requests it.

## Listing copy

### Name

```
Word Counter
```

Alternative: `ibm.io Word Counter`

### Short description (≈80 chars)

```
Count words, characters, sentences, paragraphs, and reading time. Text is not stored.
```

### Long description

```
Accurate word and character counts for drafts, essays, and snippets — using the same rules as ibm.io/wordcount.

• Words, characters, sentences, paragraphs, reading time (~200 wpm)
• In-chat widget for quick visual summary
• Link to the full offline editor when you need goals, themes, or private local editing

Text is processed in memory for each request and is not stored on the server. For long private drafts, use open_full_counter to open the browser app where your text stays on your device.
```

### Tags / categories

- writing
- editing
- word count
- character count
- utilities

### Tool discovery hints (already in server metadata)

The model should invoke tools when users ask to:
- count words / characters / sentences / paragraphs
- get reading time or length of a draft
- check essay or article length

Prefer `count_text_with_ui` when a visual summary helps; `count_text` for plain answers; `open_full_counter` when the user wants to edit or count privately offline.

## Icon

PNG exports in [`mcp/submission/`](./submission/):

- `icon-512.png` — portal hero icon
- `icon-48.png` — small icon
- `icon.svg` — source (same three-line mark as [`index.html`](../index.html) favicon)

## Demo video

Record **https://wordcount-mcp.mhsenkow.workers.dev/demo/chat** (ChatGPT-style mock with live widget), or record the same flow in ChatGPT Developer Mode. See [`submission/README.md`](./submission/README.md) for a shot list (~30–60 s, MP4/MOV).

## Privacy blurb (for submission form)

```
The MCP server receives text only when a user (or the model on their behalf) calls a counting tool. Text is analyzed in memory and discarded after the response. No accounts, no persistent storage, no logging of draft content. The full editor at ibm.io/wordcount runs entirely in the browser with localStorage on the user's device.
```

## Pre-submission test script

1. ChatGPT **Developer Mode** → connect `https://wordcount-mcp.mhsenkow.workers.dev/mcp`
2. *“How many words in: Hello world. This is a test.”* → 7 words, 2 sentences
3. *“Count this with a widget: …”* → widget renders hero + secondary metrics
4. *“Open the full word counter”* → returns ibm.io/wordcount URL

## After approval

1. **Publish** from the submission portal (approved ≠ automatically listed on main directory pages)
2. Search the directory by exact publication name to confirm listing
3. Update [`AGENTS.md`](../AGENTS.md) if the MCP URL changes

## If review requests OAuth

Add Cloudflare Access or a minimal OAuth layer per [Apps SDK auth docs](https://developers.openai.com/apps-sdk). Authless is acceptable for read-only utility tools; escalate only if rejected.
