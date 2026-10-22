import "server-only";
import Redis from "ioredis";

declare global {
  var __slotlyRedisInstance: Redis | undefined;
}

/**
 * Singleton Redis client for shared rate-limiting, caching, and background state.
 * Gracefully returns null if REDIS_URL is not configured.
 */
export function getRedisClient(): Redis | null {
  const redisUrl = process.env.REDIS_URL?.trim();

  if (!redisUrl) {
    return null;
  }

  if (global.__slotlyRedisInstance) {
    return global.__slotlyRedisInstance;
  }

  try {
    const client = new Redis(redisUrl, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      connectTimeout: 2000,
      enableOfflineQueue: false,
      retryStrategy(times) {
        // Exponential backoff up to 2 seconds, stop after 5 attempts to prevent thrashing
        if (times > 5) return null;
        return Math.min(times * 200, 2000);
      },
    });

    // Handle connection errors gracefully without crashing the Node process
    client.on("error", (err) => {
      // Suppress repeated spam in console while preserving diagnostics
      if (process.env.NODE_ENV !== "test") {
        console.warn("[Redis Connection Warning]", err.message);
      }
    });

    if (process.env.NODE_ENV !== "production") {
      global.__slotlyRedisInstance = client;
    }

    return client;
  } catch (error) {
    console.warn("[Redis Initialization Error]", error);
    return null;
  }
}

/**
 * Check whether Redis is actively reachable.
 */
export async function isRedisConnected(): Promise<boolean> {
  const client = getRedisClient();
  if (!client) return false;

  try {
    if (client.status === "wait" || client.status === "close") {
      await client.connect();
    }
    const ping = await client.ping();
    return ping === "PONG";
  } catch {
    return false;
  }
}
