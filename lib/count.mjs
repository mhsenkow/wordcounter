/**
 * Pure text metrics — shared by index.html (inline), test.mjs, and MCP worker.
 * Keep in sync with index.html count() / clock().
 */

export function count(s) {
  const trimmed = String(s || '').trim();
  return {
    words: trimmed ? trimmed.split(/\s+/).length : 0,
    chars: String(s || '').length,
    sentences: (trimmed.match(/[^\s.!?…]+(?:[^.!?…]*[.!?…]+|[^.!?…]*$)/g) || []).length,
    paragraphs: trimmed
      ? trimmed.split(/\n\s*\n/).filter((p) => p.trim()).length
      : 0
  };
}

/** ~200 wpm → m:ss (matches index.html clock()) */
export function readingTime(words) {
  const secs = Math.round(words / 200 * 60);
  return Math.floor(secs / 60) + ':' + String(secs % 60).padStart(2, '0');
}

export function countWithReading(s) {
  const c = count(s);
  return { ...c, reading: readingTime(c.words) };
}
