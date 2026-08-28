/**
 * Pure text metrics — shared by index.html, test.mjs, MCP worker, and widget bundle.
 */

export function count(s) {
  const raw = String(s || '');
  const trimmed = raw.trim();
  return {
    words: trimmed ? trimmed.split(/\s+/).length : 0,
    chars: raw.length,
    charsNoSpaces: raw.replace(/\s/g, '').length,
    sentences: (trimmed.match(/[^\s.!?…]+(?:[^.!?…]*[.!?…]+|[^.!?…]*$)/g) || []).length,
    paragraphs: trimmed
      ? trimmed.split(/\n\s*\n/).filter((p) => p.trim()).length
      : 0
  };
}

/** ~200 wpm → m:ss (matches index.html clock()) */
export function readingTime(words, wpm = 200) {
  const secs = Math.round((words / wpm) * 60);
  return Math.floor(secs / 60) + ':' + String(secs % 60).padStart(2, '0');
}

/** ~130 wpm aloud */
export function speakingTime(words, wpm = 130) {
  return readingTime(words, wpm);
}

/** ~250 words per page, one decimal */
export function pageEstimate(words, perPage = 250) {
  if (words <= 0) return 0;
  return Math.round((words / perPage) * 10) / 10;
}

export function countWithReading(s) {
  const c = count(s);
  return { ...c, reading: readingTime(c.words) };
}

export function countFull(s) {
  const c = count(s);
  return {
    ...c,
    reading: readingTime(c.words),
    speaking: speakingTime(c.words),
    pages: pageEstimate(c.words)
  };
}

/** limit check for word/char goals — returns null when no limit */
export function limitCheck(stats, limit, metric = 'words') {
  if (limit == null || limit <= 0) return null;
  const value = stats[metric] ?? stats.words;
  const overBy = Math.max(0, value - limit);
  const underBy = Math.max(0, limit - value);
  return {
    limit,
    metric,
    value,
    overBy,
    underBy,
    met: value <= limit,
    status: overBy > 0 ? 'over' : underBy > 0 ? 'under' : 'exact'
  };
}

export function countDelta(before, after) {
  const a = countFull(before);
  const b = countFull(after);
  return {
    before: a,
    after: b,
    delta: {
      words: b.words - a.words,
      chars: b.chars - a.chars,
      charsNoSpaces: b.charsNoSpaces - a.charsNoSpaces,
      sentences: b.sentences - a.sentences,
      paragraphs: b.paragraphs - a.paragraphs
    }
  };
}

export function formatSummary(c) {
  const reading = c.reading || readingTime(c.words);
  return (
    `${c.words} word${c.words === 1 ? '' : 's'}, ` +
    `${c.chars} character${c.chars === 1 ? '' : 's'}, ` +
    `${c.sentences} sentence${c.sentences === 1 ? '' : 's'}, ` +
    `${c.paragraphs} paragraph${c.paragraphs === 1 ? '' : 's'}, ` +
    `reading time ${reading}`
  );
}

const FULL_COUNTER_BASE = 'https://ibm.io/wordcount/';

/** Deep link to full app with optional draft + word goal */
export function buildFullCounterUrl(opts = {}) {
  const { text, target } = opts;
  if (text && text.length > 1800) {
    const hash =
      't=' +
      btoa(unescape(encodeURIComponent(text)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    let url = FULL_COUNTER_BASE + '#' + hash;
    if (target != null && target > 0) url += '&target=' + Math.floor(target);
    return url;
  }
  const params = new URLSearchParams();
  if (text) params.set('text', text);
  if (target != null && target > 0) params.set('target', String(Math.floor(target)));
  const qs = params.toString();
  return qs ? FULL_COUNTER_BASE + '?' + qs : FULL_COUNTER_BASE;
}

/** Parse deep-link params from a location-like object (browser or tests) */
export function parseCounterHandoff(locationLike) {
  const out = { text: '', target: 0 };
  const search = locationLike.search || '';
  const hash = (locationLike.hash || '').replace(/^#/, '');
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  const hashParams = new URLSearchParams(hash);

  let text = params.get('text') || hashParams.get('text') || '';
  if (!text) {
    const b64 = hashParams.get('t');
    if (b64) {
      try {
        const padded = b64.replace(/-/g, '+').replace(/_/g, '/');
        text = decodeURIComponent(escape(atob(padded)));
      } catch (_) {
        text = '';
      }
    }
  } else {
    try {
      text = decodeURIComponent(text);
    } catch (_) {}
  }

  const targetRaw = params.get('target') || hashParams.get('target');
  const target = targetRaw ? parseInt(targetRaw, 10) : 0;

  out.text = text;
  out.target = target > 0 ? target : 0;
  return out;
}
