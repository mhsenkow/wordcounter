import { McpServer } from '@modelcontextprotocol/server';
import { createMcpHandler } from 'agents/mcp/server';
import { z } from 'zod';
import { countWithReading } from '../../lib/count.mjs';
// @ts-expect-error wrangler Text module rule
import widgetShell from './widget-shell.html';
// @ts-expect-error wrangler Text module rule (.css must be .txt — esbuild treats .css as a module object)
import widgetCss from './widget-styles.txt';
// @ts-expect-error wrangler Text module rule
import widgetScript from './widget-script.txt';
// @ts-expect-error wrangler Text module rule
import demoHtml from './demo.html';
// @ts-expect-error wrangler Text module rule
import demoChatHtml from './demo-chat.html';
// @ts-expect-error wrangler Text module rule
import privacyHtml from './privacy.html';
// @ts-expect-error wrangler Text module rule
import termsHtml from './terms.html';

const FULL_COUNTER_URL = 'https://ibm.io/wordcount/';
const WIDGET_URI = 'ui://widget/wordcount-v2.html';
const WIDGET_MIME = 'text/html+skybridge';

const widgetHtml =
  '<style>' + widgetCss + '</style>' + widgetShell + '<script>' + widgetScript + '<\/script>';

function widgetDocument(seedText?: string) {
  var seed = '';
  if (seedText !== undefined) {
    var escaped = JSON.stringify(seedText);
    seed =
      '<script>window.openai={toolInput:{text:' +
      escaped +
      '},toolOutput:{text:' +
      escaped +
      '}};<\/script>';
  }
  return (
    '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' +
    seed +
    widgetHtml +
    '</body></html>'
  );
}

const COUNT_DESCRIPTION =
  'Count words, characters, sentences, paragraphs, and estimated reading time in text. ' +
  'Opens an interactive editor widget where the user can type or paste and see live counts alongside the chat. ' +
  'Use when the user asks to count words, characters, sentences, paragraphs, or reading time in a draft, essay, or passage.';

const OPEN_COUNTER_DESCRIPTION =
  'Open the interactive word counter editor in chat with an optional starting draft. ' +
  'The user can type, paste, and edit while counts update live. Use when they want to write or revise text with a word counter, ' +
  'not just a one-shot count of text they already pasted in chat.';

const textSchema = {
  text: z.string().describe('The text to analyze')
};

function formatSummary(c: ReturnType<typeof countWithReading>) {
  return (
    `${c.words} word${c.words === 1 ? '' : 's'}, ` +
    `${c.chars} character${c.chars === 1 ? '' : 's'}, ` +
    `${c.sentences} sentence${c.sentences === 1 ? '' : 's'}, ` +
    `${c.paragraphs} paragraph${c.paragraphs === 1 ? '' : 's'}, ` +
    `reading time ${c.reading}`
  );
}

function createServer() {
  const server = new McpServer({
    name: 'ibm.io-wordcount',
    version: '1.0.0'
  });

  server.registerResource(
    'wordcount-widget',
    WIDGET_URI,
    {
      description: 'Word count results widget for ChatGPT Apps SDK',
      mimeType: WIDGET_MIME
    },
    async () => ({
      contents: [
        {
          uri: WIDGET_URI,
          mimeType: WIDGET_MIME,
          text: widgetHtml
        }
      ]
    })
  );

  const widgetToolMeta = {
    'openai/outputTemplate': WIDGET_URI,
    'openai/toolInvocation/invoking': 'Opening word counter…',
    'openai/toolInvocation/invoked': 'Word counter ready',
    'openai/widgetAccessible': true,
    ui: { resourceUri: WIDGET_URI, prefersBorder: true }
  };

  async function runCount(text: string) {
    const result = countWithReading(text);
    return {
      content: [{ type: 'text' as const, text: formatSummary(result) }],
      structuredContent: { ...result, text },
      _meta: { ui: { resourceUri: WIDGET_URI } }
    };
  }

  // Primary tool — always renders the in-chat widget in ChatGPT Apps SDK
  server.registerTool(
    'count_text',
    {
      title: 'Count text',
      description: COUNT_DESCRIPTION,
      inputSchema: textSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false
      },
      _meta: widgetToolMeta
    },
    async ({ text }) => runCount(text)
  );

  // Alias kept for older prompts / docs that name this tool explicitly
  server.registerTool(
    'count_text_with_ui',
    {
      title: 'Count text with widget',
      description:
        COUNT_DESCRIPTION +
        ' Same interactive editor widget as count_text.',
      inputSchema: textSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false
      },
      _meta: widgetToolMeta
    },
    async ({ text }) => runCount(text)
  );

  server.registerTool(
    'open_word_counter',
    {
      title: 'Open word counter editor',
      description: OPEN_COUNTER_DESCRIPTION,
      inputSchema: {
        text: z
          .string()
          .optional()
          .describe('Optional draft to pre-fill in the editor (omit for a blank counter)')
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false
      },
      _meta: widgetToolMeta
    },
    async ({ text }) => runCount(text ?? '')
  );

  server.registerTool(
    'open_full_counter',
    {
      title: 'Open full word counter',
      description:
        'Return the URL to the full offline word counter at ibm.io/wordcount. ' +
        'Use when the user wants to edit, set a word goal, or count privately in the browser.',
      inputSchema: {
        text: z.string().optional().describe('Optional draft text (not sent to the server; user opens the site locally)')
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: true
      }
    },
    async () => ({
      content: [
        {
          type: 'text',
          text: `Open the full word counter at ${FULL_COUNTER_URL} — your draft stays on your device.`
        }
      ],
      structuredContent: { url: FULL_COUNTER_URL }
    })
  );

  return server;
}

const mcpHandler = createMcpHandler(createServer, {
  route: '/mcp',
  corsOptions: {
    origin: '*',
    methods: 'GET, POST, OPTIONS',
    headers: 'Content-Type, Authorization, Mcp-Session-Id'
  }
});

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    if (url.pathname === '/demo') {
      return new Response(demoHtml, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    if (url.pathname === '/demo/chat') {
      return new Response(demoChatHtml, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    if (url.pathname === '/preview') {
      const text = url.searchParams.get('text') ?? '';
      return new Response(widgetDocument(text), {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Content-Security-Policy': "default-src 'self' 'unsafe-inline'; connect-src *"
        }
      });
    }

    if (url.pathname === '/privacy') {
      return new Response(privacyHtml, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    if (url.pathname === '/terms') {
      return new Response(termsHtml, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    if (url.pathname === '/.well-known/openai-apps-challenge') {
      const token = env.OPENAI_APPS_CHALLENGE;
      if (!token) {
        return new Response('Domain verification token not configured. Set OPENAI_APPS_CHALLENGE in wrangler.', {
          status: 503,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
      }
      return new Response(token, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }

    if (url.pathname === '/' || url.pathname === '') {
      return new Response(
        JSON.stringify({
          name: 'ibm.io Word Counter MCP',
          mcp: `${url.origin}/mcp`,
          demo: `${url.origin}/demo`,
          demoChat: `${url.origin}/demo/chat`,
          preview: `${url.origin}/preview`,
          privacy: `${url.origin}/privacy`,
          terms: `${url.origin}/terms`,
          site: FULL_COUNTER_URL,
          tools: ['count_text', 'count_text_with_ui', 'open_word_counter', 'open_full_counter']
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    return mcpHandler(request, env, ctx);
  }
} satisfies ExportedHandler;

interface Env {
  OPENAI_APPS_CHALLENGE?: string;
}
