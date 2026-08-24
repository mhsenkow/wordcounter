# Submission assets — Word Counter MCP

## Icons (upload to OpenAI portal)

| File | Size | Use |
|---|---|---|
| [`icon-512.png`](./icon-512.png) | 512×512 | App listing hero icon |
| [`icon-48.png`](./icon-48.png) | 48×48 | Small icon / favicon |
| [`icon.svg`](./icon.svg) | vector | Source (three-line mark + accent bar) |

## Demo video

### Option A — Record the mock ChatGPT page (easiest)

1. Open **https://wordcount-mcp.mhsenkow.workers.dev/demo/chat**
2. Screen-record 30–60 seconds:
   - Show the user prompt + widget with seeded fox sentence (9 words)
   - Click **Open settings** — cycle a theme, toggle chart type
   - Type in the textarea — counts update live
   - Click **Essay sample** — longer draft loads
3. Save as MP4 or MOV (1080p recommended)

### Option B — Record live in ChatGPT

1. Developer Mode → Word Counter connector → **refresh tools**
2. New chat → `@Word Counter`
3. Record:
   - *“Open a word counter”*
   - *“Count: The quick brown fox jumps over the lazy dog.”*
   - Open settings, change theme
   - Type a few words in the widget editor

### Automated preview (no screen recorder)

After deploy, a stitched preview MP4 may exist at [`demo-recording.mp4`](./demo-recording.mp4) (generated via browser frames + ffmpeg).

## Portal checklist

1. [OpenAI Apps SDK submission](https://developers.openai.com/apps-sdk/deploy/submission)
2. MCP URL: `https://wordcount-mcp.mhsenkow.workers.dev/mcp`
3. Demo URL: `https://wordcount-mcp.mhsenkow.workers.dev/demo/chat`
4. Privacy: `https://wordcount-mcp.mhsenkow.workers.dev/privacy`
5. Terms: `https://wordcount-mcp.mhsenkow.workers.dev/terms`
6. Website: `https://ibm.io/wordcount/`
7. Upload icons + demo video
8. Domain verification token → `npx wrangler secret put OPENAI_APPS_CHALLENGE` → redeploy

Copy for listing fields: see [SUBMISSION.md](../SUBMISSION.md).
