import "server-only";
import { getRedisClient } from "./redis";

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetInMs: number;
}

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, RateLimitRecord>();

/**
 * Reset memory store (used by unit tests)
 */
export function clearRateLimitMemoryStore(): void {
  memoryStore.clear();
}

/**
 * Fallback in-memory rate limiter when Redis is unconfigured or unreachable.
 */
export function checkMemoryRateLimit(
  key: string,
  limit = 10,
  windowMs = 60 * 1000
): RateLimitResult {
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

/**
 * Atomic Redis Fixed-Window Rate Limiter with Millisecond Expiry (Lua script).
 * Executes INCR and PEXPIRE atomically within Redis's single-threaded event loop,
 * preventing race conditions across concurrent client requests and multiple server instances.
 * 
 * Note: If Redis is unavailable, the fallback store operates in Node.js process memory.
 * Process memory is isolated per server instance and is NOT distributed across multiple replicas.
 * Shared, cluster-wide rate limiting requires a reachable Redis instance (REDIS_URL).
 */
const RATE_LIMIT_LUA = `
local key = KEYS[1]
local windowMs = tonumber(ARGV[1])

local current = redis.call('INCR', key)
if current == 1 then
  redis.call('PEXPIRE', key, windowMs)
end

local ttl = redis.call('PTTL', key)
if ttl < 0 then
  redis.call('PEXPIRE', key, windowMs)
  ttl = windowMs
end

return {current, ttl}
`;

/**
 * Rate limit check against Redis using an atomic Lua script.
 */
async function checkRedisRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const redis = getRedisClient();
  if (!redis) {
    return checkMemoryRateLimit(key, limit, windowMs);
  }

  if (redis.status === "wait" || redis.status === "close") {
    await redis.connect();
  }

  const redisKey = `slotly:ratelimit:${key}`;
  const [current, ttl] = (await redis.eval(
    RATE_LIMIT_LUA,
    1,
    redisKey,
    String(windowMs)
  )) as [number, number];

  const currentCount = Number(current);
  const ttlMs = Math.max(0, Number(ttl));

  if (currentCount > limit) {
    return {
      allowed: false,
      remaining: 0,
      resetInMs: ttlMs,
    };
  }

  return {
    allowed: true,
    remaining: Math.max(0, limit - currentCount),
    resetInMs: ttlMs,
  };
}

/**
 * Primary rate limit check.
 * Uses shared Redis when configured via REDIS_URL.
 * Gracefully and safely falls back to local memory store if Redis is unavailable,
 * ensuring rate limiting protection is never accidentally disabled.
 *
 * @param key unique identifier (e.g. IP + endpoint)
 * @param limit maximum allowed requests within window
 * @param windowMs window duration in milliseconds (default: 60s)
 */
export async function checkRateLimit(
  key: string,
  limit = 10,
  windowMs = 60 * 1000
): Promise<RateLimitResult> {
  try {
    const redis = getRedisClient();
    if (redis) {
      return await checkRedisRateLimit(key, limit, windowMs);
    }
  } catch (error) {
    if (process.env.NODE_ENV !== "test") {
      console.warn("[RateLimit] Redis error, falling back to memory store:", error);
    }
  }

  // Safe fallback to in-memory store
  return checkMemoryRateLimit(key, limit, windowMs);
}
