import "server-only";

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, RateLimitRecord>();

/**
 * Basic sliding window rate limiter for public endpoints.
 * @param key unique identifier (e.g. IP + endpoint)
 * @param limit maximum allowed requests within window
 * @param windowMs window duration in milliseconds (default: 60s)
 */
export function checkRateLimit(
  key: string,
  limit = 10,
  windowMs = 60 * 1000
): { allowed: boolean; remaining: number; resetInMs: number } {
  const now = Date.now();

  // Periodic eviction to prevent unbounded memory growth in long-running processes
  if (memoryStore.size > 2000) {
    for (const [k, v] of memoryStore.entries()) {
      if (now > v.resetAt) {
        memoryStore.delete(k);
      }
    }
  }

  const record = memoryStore.get(key);

  if (!record || now > record.resetAt) {
    memoryStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetInMs: windowMs };
  }

  if (record.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetInMs: Math.max(0, record.resetAt - now),
    };
  }

  record.count += 1;
  return {
    allowed: true,
    remaining: limit - record.count,
    resetInMs: Math.max(0, record.resetAt - now),
  };
}
