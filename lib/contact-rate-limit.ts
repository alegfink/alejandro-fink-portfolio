const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1_000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

export function exceedsRateLimit(key: string, now = Date.now()) {
  const current = rateLimitBuckets.get(key);
  if (!current || current.resetAt <= now) {
    rateLimitBuckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > RATE_LIMIT_MAX_REQUESTS;
}

export function clearContactRateLimitForTests() {
  rateLimitBuckets.clear();
}

