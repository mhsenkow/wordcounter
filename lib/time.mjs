/**
 * Pure time metrics — shared by timecount/index.html and tests.
 */

export function pad2(n) {
  return String(Math.floor(Math.abs(n))).padStart(2, '0');
}

/** Format milliseconds as H:MM:SS, M:SS, or M:SS.cs */
export function formatClock(ms, opts = {}) {
  const centis = opts.centis === true;
  const neg = ms < 0;
  ms = Math.abs(Math.round(ms));
  const cs = Math.floor((ms % 1000) / 10);
  const s = Math.floor(ms / 1000) % 60;
  const m = Math.floor(ms / 60000) % 60;
  const h = Math.floor(ms / 3600000);
  let body;
  if (h > 0) body = `${h}:${pad2(m)}:${pad2(s)}`;
  else body = `${m}:${pad2(s)}`;
  if (centis) body += `.${pad2(cs)}`;
  return (neg ? '−' : '') + body;
}

/** Parse "5:00", "1:05:30", "90", "5m", "25m" → ms (0 if invalid) */
export function parseDuration(input) {
  const raw = String(input || '').trim().toLowerCase();
  if (!raw) return 0;
  const mMatch = raw.match(/^(\d+(?:\.\d+)?)\s*m(?:in(?:ute)?s?)?$/);
  if (mMatch) return Math.round(parseFloat(mMatch[1], 10) * 60000);
  const sMatch = raw.match(/^(\d+(?:\.\d+)?)\s*s(?:ec(?:ond)?s?)?$/);
  if (sMatch) return Math.round(parseFloat(sMatch[1], 10) * 1000);
  if (/^\d+$/.test(raw)) return parseInt(raw, 10) * 1000;
  const parts = raw.split(':').map((p) => parseInt(p, 10));
  if (parts.some((n) => Number.isNaN(n))) return 0;
  if (parts.length === 3) return (parts[0] * 3600 + parts[1] * 60 + parts[2]) * 1000;
  if (parts.length === 2) return (parts[0] * 60 + parts[1]) * 1000;
  if (parts.length === 1) return parts[0] * 1000;
  return 0;
}

export function elapsedMs(state, now = Date.now()) {
  const base = state.accumulated || 0;
  if (!state.running || state.startedAt == null) return base;
  return base + (now - state.startedAt);
}

export function remainingMs(state, now = Date.now()) {
  const target = state.target || 0;
  if (target <= 0) return 0;
  return Math.max(0, target - elapsedMs(state, now));
}

export function lapStats(laps) {
  const list = Array.isArray(laps) ? laps : [];
  const deltas = list.map((l) => l.delta || 0).filter((d) => d > 0);
  const count = list.length;
  const total = deltas.reduce((a, b) => a + b, 0);
  const best = deltas.length ? Math.min(...deltas) : 0;
  const last = deltas.length ? deltas[deltas.length - 1] : 0;
  const avg = deltas.length ? Math.round(total / deltas.length) : 0;
  return { count, total, best, last, avg };
}

export function progressPct(elapsed, target) {
  if (!target || target <= 0) return 0;
  return Math.min(100, Math.round((elapsed / target) * 100));
}

export function timeMetrics(state, now = Date.now()) {
  const elapsed = elapsedMs(state, now);
  const target = state.target || 0;
  const remaining = target > 0 ? Math.max(0, target - elapsed) : 0;
  const laps = lapStats(state.laps);
  const paused = state.pausedTotal || 0;
  return {
    elapsed,
    remaining,
    target,
    laps: laps.count,
    lapTotal: laps.total,
    lapBest: laps.best,
    lapLast: laps.last,
    lapAvg: laps.avg,
    paused,
    hours: Math.floor(elapsed / 3600000),
    minutes: Math.floor(elapsed / 60000) % 60,
    seconds: Math.floor(elapsed / 1000) % 60,
    centis: Math.floor((elapsed % 1000) / 10)
  };
}

export const TIME_PRESETS = [
  { label: '5m', ms: 5 * 60000 },
  { label: '15m', ms: 15 * 60000 },
  { label: '25m', ms: 25 * 60000 },
  { label: '1h', ms: 60 * 60000 }
];
