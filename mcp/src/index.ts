import { McpServer } from '@modelcontextprotocol/server';
import { createMcpHandler } from 'agents/mcp/server';
import { z } from 'zod';
import {
  countFull,
  limitCheck,
  countDelta,
  formatSummary,
  buildFullCounterUrl
} from '../../lib/count.mjs';
import { parseDuration, formatClock } from '../../lib/time.mjs';
import {
  taxTip,
  paceEta,
  contrastRatio,
  combinations,
  bayesUpdate,
  formatDurationHours
} from '../../lib/calc/index.mjs';
// @ts-expect-error wrangler Text module rule
import widgetShell from './widget-shell.html';
// @ts-expect-error wrangler Text module rule (.css must be .txt — esbuild treats .css as a module object)
import widgetStyles from './widget-styles.txt';
// @ts-expect-error wrangler Text module rule
import countBundle from './count-bundle.txt';
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
  '<style>' +
  widgetStyles +
  '</style>' +
  widgetShell +
  '<script>' +
  countBundle +
  widgetScript +
  '<\/script>';

type WidgetSeed = { text?: string; target?: number };

function widgetDocument(seed?: WidgetSeed) {
  let seedScript = '';
  if (seed !== undefined) {
    const input: Record<string, unknown> = {};
    if (seed.text !== undefined) input.text = seed.text;
    if (seed.target != null && seed.target > 0) input.target = seed.target;
    const escaped = JSON.stringify(input);
    seedScript =
      '<script>window.openai={toolInput:' +
      escaped +
      ',toolOutput:' +
      escaped +
      '}};<\/script>';
  }
  return (
    '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' +
    seedScript +
    widgetHtml +
    '</body></html>'
  );
}

const COUNT_DESCRIPTION =
  'Count words, characters, characters without spaces, sentences, paragraphs, reading time, speaking time, and page estimate in text. ' +
  'Opens an interactive editor widget where the user can type or paste and see live counts alongside the chat. ' +
  'Use when the user asks to count words, characters, sentences, paragraphs, reading time, or check a word limit in a draft, essay, or passage.';

const OPEN_COUNTER_DESCRIPTION =
  'Open the interactive word counter editor in chat with an optional starting draft and word goal. ' +
  'The user can type, paste, and edit while counts update live. Use when they want to write or revise text with a word counter, ' +
  'not just a one-shot count of text they already pasted in chat.';

const countInputSchema = {
  text: z.string().describe('The text to analyze'),
  target: z
    .number()
    .int()
    .positive()
    .optional()
    .describe('Optional word goal shown in the widget progress chart'),
  limit: z
    .number()
    .int()
    .positive()
    .optional()
    .describe('Optional word limit — response includes overBy/underBy when set')
};

const limitResultSchema = z.object({
  limit: z.number(),
  metric: z.string(),
  value: z.number(),
  overBy: z.number(),
  underBy: z.number(),
  met: z.boolean(),
  status: z.enum(['over', 'under', 'exact'])
});

const countOutputSchema = z.object({
  words: z.number(),
  chars: z.number(),
  charsNoSpaces: z.number(),
  sentences: z.number(),
  paragraphs: z.number(),
  reading: z.string(),
  speaking: z.string(),
  pages: z.number(),
  text: z.string(),
  target: z.number().optional(),
  limit: limitResultSchema.optional()
});

const countStatsSchema = z.object({
  words: z.number(),
  chars: z.number(),
  charsNoSpaces: z.number(),
  sentences: z.number(),
  paragraphs: z.number(),
  reading: z.string(),
  speaking: z.string(),
  pages: z.number()
});

const compareOutputSchema = z.object({
  before: countStatsSchema,
  after: countStatsSchema,
  delta: z.object({
    words: z.number(),
    chars: z.number(),
    charsNoSpaces: z.number(),
    sentences: z.number(),
    paragraphs: z.number()
  })
});

const fullCounterOutputSchema = z.object({
  url: z.string()
});

function limitSummaryLine(check: ReturnType<typeof limitCheck>) {
  if (!check) return '';
  if (check.status === 'over') return ` (${check.overBy} over ${check.limit}-word limit)`;
  if (check.status === 'under') return ` (${check.underBy} under ${check.limit}-word limit)`;
  return ` (exactly at ${check.limit}-word limit)`;
}

function createServer() {
  const server = new McpServer({
    name: 'ibm.io-wordcount',
    version: '1.2.0'
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

  async function runCount(
    text: string,
    opts?: { target?: number; limit?: number }
  ) {
    const result = countFull(text);
    const structured: Record<string, unknown> = { ...result, text };
    if (opts?.target != null && opts.target > 0) structured.target = opts.target;
    const check = opts?.limit != null && opts.limit > 0 ? limitCheck(result, opts.limit) : null;
    if (check) structured.limit = check;
    return {
      content: [
        {
          type: 'text' as const,
          text: formatSummary(result) + limitSummaryLine(check)
        }
      ],
      structuredContent: structured,
      _meta: { ui: { resourceUri: WIDGET_URI } }
    };
  }

  server.registerTool(
    'count_text',
    {
      title: 'Count text',
      description: COUNT_DESCRIPTION,
      inputSchema: countInputSchema,
      outputSchema: countOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false
      },
      _meta: widgetToolMeta
    },
    async ({ text, target, limit }) => runCount(text, { target, limit })
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
          .describe('Optional draft to pre-fill in the editor (omit for a blank counter)'),
        target: z
          .number()
          .int()
          .positive()
          .optional()
          .describe('Optional word goal for the progress chart')
      },
      outputSchema: countOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false
      },
      _meta: widgetToolMeta
    },
    async ({ text, target }) => runCount(text ?? '', { target })
  );

  server.registerTool(
    'open_full_counter',
    {
      title: 'Open full word counter',
      description:
        'Return a deep link to the full offline word counter at ibm.io/wordcount with optional draft text and word goal. ' +
        'Use when the user wants to edit, set a word goal, use voice dictation, or count privately in the browser.',
      inputSchema: {
        text: z.string().optional().describe('Optional draft to pre-fill on the full site'),
        target: z
          .number()
          .int()
          .positive()
          .optional()
          .describe('Optional word goal to pre-set on the full site')
      },
      outputSchema: fullCounterOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: true
      }
    },
    async ({ text, target }) => {
      const url = buildFullCounterUrl({ text, target });
      return {
        content: [
          {
            type: 'text',
            text:
              `Open the full word counter at ${url} — your draft stays on your device.` +
              (text ? ' Draft text is included in the link.' : '')
          }
        ],
        structuredContent: { url }
      };
    }
  );

  server.registerTool(
    'compare_text',
    {
      title: 'Compare text versions',
      description:
        'Count two text versions (before and after) and return the delta in words, characters, sentences, and paragraphs. ' +
        'Use when the user asks how much they added, removed, or changed between drafts.',
      inputSchema: {
        before: z.string().describe('Original or earlier text'),
        after: z.string().describe('Revised or later text')
      },
      outputSchema: compareOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false
      }
    },
    async ({ before, after }) => {
      const result = countDelta(before, after);
      const d = result.delta;
      const sign = (n: number) => (n > 0 ? '+' + n : String(n));
      return {
        content: [
          {
            type: 'text',
            text:
              `Delta: ${sign(d.words)} words, ${sign(d.chars)} characters, ` +
              `${sign(d.sentences)} sentences, ${sign(d.paragraphs)} paragraphs. ` +
              `After: ${formatSummary(result.after)}`
          }
        ],
        structuredContent: result
      };
    }
  );

  server.registerTool(
    'parse_duration',
    {
      title: 'Parse duration',
      description:
        'Parse a duration string like 5:00, 1:05:30, 25m, or 90 into milliseconds and a clock string. Use for time math and limits.',
      inputSchema: {
        input: z.string().describe('Duration text (e.g. 25m, 5:00, 1:30:00)')
      },
      annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false }
    },
    async ({ input }) => {
      const ms = parseDuration(input);
      const clock = formatClock(ms);
      return {
        content: [{ type: 'text', text: `${input.trim()} → ${clock} (${ms} ms)` }],
        structuredContent: { input, ms, clock }
      };
    }
  );

  server.registerTool(
    'tax_tip',
    {
      title: 'Tax and tip',
      description:
        'Compute tax and tip from a subtotal. Tip can apply to pre-tax subtotal or to the tax-inclusive total.',
      inputSchema: {
        subtotal: z.number().nonnegative(),
        taxPct: z.number().nonnegative().default(0),
        tipPct: z.number().nonnegative().default(20),
        tipOn: z.enum(['pre', 'total']).default('pre')
      },
      annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false }
    },
    async ({ subtotal, taxPct, tipPct, tipOn }) => {
      const result = taxTip({ subtotal, taxPct, tipPct, tipOn });
      return {
        content: [
          {
            type: 'text',
            text:
              `Grand $${result.grand.toFixed(2)} (tax $${result.taxAmount.toFixed(2)}, tip $${result.tipAmount.toFixed(2)} on ${tipOn === 'total' ? 'total' : 'pre-tax'})`
          }
        ],
        structuredContent: result
      };
    }
  );

  server.registerTool(
    'pace_eta',
    {
      title: 'Pace / ETA',
      description:
        'Distance × pace (min per unit) → ETA hours, or solve for required pace given a finish time in hours.',
      inputSchema: {
        distance: z.number().nonnegative(),
        paceMinPerUnit: z.number().nonnegative().default(0),
        hours: z.number().nonnegative().default(0),
        mode: z.enum(['eta', 'pace']).default('eta')
      },
      annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false }
    },
    async ({ distance, paceMinPerUnit, hours, mode }) => {
      const result = paceEta({ distance, paceMinPerUnit, hours, mode });
      const text =
        mode === 'pace'
          ? `Need ${result.paceMinPerUnit.toFixed(2)} min/unit for ${formatDurationHours(result.etaHours)}`
          : `ETA ${formatDurationHours(result.etaHours)} at ${result.paceMinPerUnit} min/unit`;
      return { content: [{ type: 'text', text }], structuredContent: result };
    }
  );

  server.registerTool(
    'contrast_ratio',
    {
      title: 'Contrast ratio',
      description: 'WCAG contrast ratio for foreground/background hex colors, with AA/AAA flags.',
      inputSchema: {
        fg: z.string().describe('Foreground hex (#rgb or #rrggbb)'),
        bg: z.string().describe('Background hex (#rgb or #rrggbb)')
      },
      annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false }
    },
    async ({ fg, bg }) => {
      const result = contrastRatio(fg, bg);
      return {
        content: [
          {
            type: 'text',
            text:
              `${result.ratio.toFixed(2)}:1 · AA ${result.aa ? 'pass' : 'fail'} · AAA ${result.aaa ? 'pass' : 'fail'}`
          }
        ],
        structuredContent: result
      };
    }
  );

  server.registerTool(
    'combinations',
    {
      title: 'Combinations',
      description:
        'How many ways to pick k items from n when order does not matter (n choose k). Use for poker hands, lottery tickets, teams, and similar.',
      inputSchema: {
        n: z.number().int().nonnegative().describe('Total items to choose from'),
        k: z.number().int().nonnegative().describe('How many to pick')
      },
      annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false }
    },
    async ({ n, k }) => {
      const value = combinations(n, k);
      return {
        content: [{ type: 'text', text: `C(${n}, ${k}) = ${value}` }],
        structuredContent: { n, k, value }
      };
    }
  );

  server.registerTool(
    'bayes_update',
    {
      title: 'Bayes update',
      description:
        'Update a belief when evidence arrives. prior = belief before (0–1), hit = chance of seeing this evidence if the claim is true, miss = chance if false. Returns the belief after.',
      inputSchema: {
        prior: z.number().min(0).max(1).describe('Belief before evidence, 0–1'),
        hit: z.number().min(0).max(1).describe('P(evidence | claim true), 0–1'),
        miss: z.number().min(0).max(1).describe('P(evidence | claim false), 0–1')
      },
      annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false }
    },
    async ({ prior, hit, miss }) => {
      const result = bayesUpdate({ prior, hit, miss });
      return {
        content: [
          {
            type: 'text',
            text:
              `Posterior ${(result.posterior * 100).toFixed(1)}% (from ${(result.prior * 100).toFixed(1)}%, LR ${
                Number.isFinite(result.likelihoodRatio)
                  ? result.likelihoodRatio.toFixed(2)
                  : '∞'
              })`
          }
        ],
        structuredContent: result
      };
    }
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
      const targetRaw = url.searchParams.get('target');
      const target = targetRaw ? parseInt(targetRaw, 10) : undefined;
      const seed: WidgetSeed = { text };
      if (target != null && target > 0) seed.target = target;
      return new Response(widgetDocument(seed), {
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
          version: '1.2.0',
          mcp: `${url.origin}/mcp`,
          demo: `${url.origin}/demo`,
          demoChat: `${url.origin}/demo/chat`,
          preview: `${url.origin}/preview`,
          privacy: `${url.origin}/privacy`,
          terms: `${url.origin}/terms`,
          site: FULL_COUNTER_URL,
          tools: [
            'count_text',
            'open_word_counter',
            'open_full_counter',
            'compare_text',
            'parse_duration',
            'tax_tip',
            'pace_eta',
            'contrast_ratio',
            'combinations',
            'bayes_update'
          ]
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
