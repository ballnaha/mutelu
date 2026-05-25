function hashString(value: string) {
  let hash = 2166136261;

  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function seededRandom(seed: number) {
  let state = seed || 1;

  return () => {
    state = Math.imul(state ^ (state >>> 15), 1 | state);
    state ^= state + Math.imul(state ^ (state >>> 7), 61 | state);
    return ((state ^ (state >>> 14)) >>> 0) / 4294967296;
  };
}

export function dailySeedKey(scope: string, date = new Date()) {
  const dayKey = date.toISOString().slice(0, 10);
  return `${scope}:${dayKey}`;
}

export function shuffleBySeed<T>(items: T[], seedKey: string) {
  const result = [...items];
  const random = seededRandom(hashString(seedKey));

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

export function selectDailyItems<T>(items: T[], limit: number, scope: string) {
  return shuffleBySeed(items, dailySeedKey(scope)).slice(0, limit);
}
