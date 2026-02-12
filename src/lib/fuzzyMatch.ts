export function normalizeKey(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function findBestMatch(
  label: string,
  candidates: Iterable<string>
): string | null {
  const normalizedLabel = normalizeKey(label);
  let best: { key: string; score: number } | null = null;

  for (const candidate of candidates) {
    const normalizedCandidate = normalizeKey(candidate);
    const score = similarity(normalizedLabel, normalizedCandidate);
    if (!best || score > best.score) {
      best = { key: candidate, score };
    }
  }

  if (!best || best.score < 0.5) {
    return null;
  }

  return best.key;
}

function similarity(a: string, b: string) {
  if (!a.length || !b.length) {
    return 0;
  }

  const aTokens = new Set(a.split(" "));
  const bTokens = new Set(b.split(" "));
  const intersection = [...aTokens].filter((token) => bTokens.has(token)).length;
  const union = new Set([...aTokens, ...bTokens]).size;

  return intersection / union;
}
