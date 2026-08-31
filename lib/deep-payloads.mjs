/** Deep-mode payload + scrub contracts for all 20 number tools. */
export const ALL_TOOLS = [
  'bill', 'hourly', 'fuel', 'unit', 'dose', 'bitrate', 'scalemap', 'ratio',
  'typescale', 'odds', 'combo', 'sample', 'budget', 'exposure', 'deal',
  'streak', 'tax', 'pace', 'contrast', 'bayes'
];

/** Vega tools: scrub input id → payload keys the spec must consume. */
export const VEGA = {
  bill: { scrub: 'tip', keys: ['people', 'tipPct', 'total'] },
  hourly: { scrub: 'days', keys: ['rate', 'days', 'hpd'] },
  budget: { scrub: 'live', keys: ['pot', 'live', 'food', 'move', 'fun'] },
  tax: { scrub: 'tip', keys: ['sub', 'taxPct', 'tipPct', 'tipOn'] },
  unit: { scrub: 'amount', keys: ['amount', 'density', 'fromIsVol', 'toIsMass'] },
  dose: { scrub: 'want', keys: ['want', 'have', 'vol'] },
  bitrate: { scrub: 'size', keys: ['size', 'speed'] },
  scalemap: { scrub: 'measure', keys: ['measure', 'real', 'units', 'dist'] },
  pace: { scrub: 'pace', keys: ['distance', 'pace', 'etaH'] },
  typescale: { scrub: 'base', keys: ['base', 'ratio', 'steps'] },
  contrast: { scrub: 'lift', keys: ['L1', 'L2', 'ratio', 'size'] },
  odds: { scrub: 'p', keys: ['p', 'win', 'lose'] },
  deal: { scrub: 'left', keys: ['left', 'want', 'p'] },
  streak: { scrub: 'run', keys: ['p', 'run', 'streakP'] }
};

/** WebGL / Canvas tools. */
export const WEBGL = {
  fuel: { scrub: 'miles', keys: ['miles', 'mpg', 'price'], engine: 'webgl3d' },
  ratio: { scrub: 'w', keys: ['width', 'height', 'ratio'], engine: 'canvas2d' },
  exposure: { scrub: 'iso', keys: ['iso', 'fnum', 'shutN', 'ev'], engine: 'webgl3d' },
  combo: { scrub: 'n', keys: ['n', 'k', 'count'], engine: 'canvas2d' },
  bayes: { scrub: 'prior', keys: ['prior', 'hit', 'miss', 'posterior', 'lr'], engine: 'webgl3d' },
  sample: { scrub: 'n', keys: ['n', 'share', 'moe', 'z'], engine: 'canvas2d' }
};

export function engineFor(toolId) {
  return WEBGL[toolId] ? WEBGL[toolId].engine : 'vega';
}

export function scrubFor(toolId) {
  if (WEBGL[toolId]) return WEBGL[toolId].scrub;
  if (VEGA[toolId]) return VEGA[toolId].scrub;
  return null;
}
