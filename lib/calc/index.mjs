/**
 * Pure formulas for number instruments — shared by MCP + tests.
 * Pages keep inline compute for zero-module static hosting; keep these in sync.
 */

export function billSplit({ total, tipPct, people }) {
  const t = Math.max(0, Number(total) || 0);
  const tip = Math.max(0, Number(tipPct) || 0);
  const p = Math.max(1, Math.floor(Number(people) || 1));
  const tipAmt = t * (tip / 100);
  const grand = t + tipAmt;
  return {
    tipAmount: tipAmt,
    grand,
    perPerson: grand / p,
    people: p
  };
}

/** Tip on pre-tax subtotal vs on tax-inclusive total. */
export function taxTip({ subtotal, taxPct, tipPct, tipOn }) {
  const sub = Math.max(0, Number(subtotal) || 0);
  const tax = Math.max(0, Number(taxPct) || 0);
  const tip = Math.max(0, Number(tipPct) || 0);
  const taxAmt = sub * (tax / 100);
  const tipBase = tipOn === 'total' ? sub + taxAmt : sub;
  const tipAmt = tipBase * (tip / 100);
  const grand = sub + taxAmt + tipAmt;
  return { taxAmount: taxAmt, tipAmount: tipAmt, tipBase, grand };
}

/** Distance at pace → duration ms; or duration → required pace. */
export function paceEta({ distance, paceMinPerUnit, hours, mode }) {
  const d = Math.max(0, Number(distance) || 0);
  const pace = Math.max(0, Number(paceMinPerUnit) || 0);
  if (mode === 'pace') {
    const h = Math.max(0, Number(hours) || 0);
    const mins = h * 60;
    const needed = d > 0 ? mins / d : 0;
    return { etaHours: h, paceMinPerUnit: needed, distance: d };
  }
  const etaMin = d * pace;
  return { etaHours: etaMin / 60, paceMinPerUnit: pace, distance: d };
}

function srgbToLinear(c) {
  const x = c / 255;
  return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
}

export function parseHexColor(hex) {
  const h = String(hex || '').replace('#', '').trim();
  if (h.length === 3) {
    return [
      parseInt(h[0] + h[0], 16),
      parseInt(h[1] + h[1], 16),
      parseInt(h[2] + h[2], 16)
    ];
  }
  if (h.length !== 6 || /[^0-9a-fA-F]/.test(h)) return null;
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16)
  ];
}

export function relativeLuminance(rgb) {
  if (!rgb) return 0;
  const [r, g, b] = rgb.map(srgbToLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(fgHex, bgHex) {
  const fg = parseHexColor(fgHex);
  const bg = parseHexColor(bgHex);
  if (!fg || !bg) return { ratio: 0, aa: false, aaa: false, aaLarge: false, aaaLarge: false };
  const L1 = relativeLuminance(fg);
  const L2 = relativeLuminance(bg);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  const ratio = (lighter + 0.05) / (darker + 0.05);
  return {
    ratio,
    aa: ratio >= 4.5,
    aaa: ratio >= 7,
    aaLarge: ratio >= 3,
    aaaLarge: ratio >= 4.5
  };
}

export function combinations(n, k) {
  n = Math.max(0, Math.floor(Number(n) || 0));
  k = Math.max(0, Math.floor(Number(k) || 0));
  if (k > n) return 0;
  k = Math.min(k, n - k);
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return Math.round(r);
}

/**
 * Simple Bayes update for a binary hypothesis.
 * prior = P(H), hit = P(E|H), miss = P(E|¬H) → posterior P(H|E)
 */
export function bayesUpdate({ prior, hit, miss }) {
  const p = Math.min(1, Math.max(0, Number(prior) || 0));
  const ph = Math.min(1, Math.max(0, Number(hit) || 0));
  const pm = Math.min(1, Math.max(0, Number(miss) || 0));
  const num = ph * p;
  const den = num + pm * (1 - p);
  const posterior = den > 0 ? num / den : 0;
  return { prior: p, posterior, likelihoodRatio: pm > 0 ? ph / pm : Infinity };
}

export function formatDurationHours(hours) {
  const h = Math.max(0, Number(hours) || 0);
  const totalMin = Math.round(h * 60);
  const hh = Math.floor(totalMin / 60);
  const mm = totalMin % 60;
  if (hh <= 0) return mm + ' min';
  return hh + ':' + String(mm).padStart(2, '0');
}
