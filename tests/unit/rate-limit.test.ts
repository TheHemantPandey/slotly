import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  checkRateLimit,
  checkMemoryRateLimit,
  clearRateLimitMemoryStore,
} from "@/lib/server/rate-limit";
import * as redisModule from "@/lib/server/redis";

describe("Rate Limiting Service", () => {
  beforeEach(() => {
    clearRateLimitMemoryStore();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    clearRateLimitMemoryStore();
  });

  // ---------------------------------------------------------------------------
  // 1. In-Memory Store Behavior (Unconfigured or Fallback Mode)
  // ---------------------------------------------------------------------------
  describe("In-Memory Sliding Window Store", () => {
    it("allows requests under the limit and tracks remaining quota", () => {
      const key = "test_ip_1";
      const limit = 3;

      const first = checkMemoryRateLimit(key, limit, 60000);
      expect(first.allowed).toBe(true);
      expect(first.remaining).toBe(2);
      expect(first.resetInMs).toBeGreaterThan(0);

      const second = checkMemoryRateLimit(key, limit, 60000);
      expect(second.allowed).toBe(true);
      expect(second.remaining).toBe(1);

      const third = checkMemoryRateLimit(key, limit, 60000);
      expect(third.allowed).toBe(true);
      expect(third.remaining).toBe(0);
    });

    it("rejects requests once the threshold limit is reached", () => {
      const key = "test_ip_blocked";
      const limit = 2;

      checkMemoryRateLimit(key, limit, 60000); // 1
      checkMemoryRateLimit(key, limit, 60000); // 2

      // 3rd attempt exceeds limit
      const blocked = checkMemoryRateLimit(key, limit, 60000);
      expect(blocked.allowed).toBe(false);
      expect(blocked.remaining).toBe(0);
      expect(blocked.resetInMs).toBeGreaterThan(0);
    });

    it("isolates quotas across distinct keys/IPs", () => {
      const limit = 1;
      const resA1 = checkMemoryRateLimit("user_a", limit, 60000);
      const resB1 = checkMemoryRateLimit("user_b", limit, 60000);

      expect(resA1.allowed).toBe(true);
      expect(resB1.allowed).toBe(true);

      const resA2 = checkMemoryRateLimit("user_a", limit, 60000);
      expect(resA2.allowed).toBe(false);

      // user_b was not impacted by user_a's rate exhaustion
      expect(resB1.remaining).toBe(0);
    });
  });

  // ---------------------------------------------------------------------------
  // 2. Redis-Backed Distributed Rate Limiting
  // ---------------------------------------------------------------------------
  describe("Redis-backed Rate Limiter with Lua script", () => {
    it("delegates to Redis Lua script when Redis client is available", async () => {
      const mockEval = vi.fn().mockResolvedValue([1, 59900]);
      const mockClient = {
        status: "ready",
        connect: vi.fn().mockResolvedValue(undefined),
        eval: mockEval,
      };

      vi.spyOn(redisModule, "getRedisClient").mockReturnValue(mockClient as any);

      const result = await checkRateLimit("redis_key_1", 5, 60000);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(4);
      expect(result.resetInMs).toBe(59900);
      expect(mockEval).toHaveBeenCalledWith(
        expect.any(String),
        1,
        "slotly:ratelimit:redis_key_1",
        "60000"
      );
    });

    it("correctly flags rate limit violation when Redis returns count > limit", async () => {
      const mockEval = vi.fn().mockResolvedValue([6, 35000]); // 6th request against limit 5
      const mockClient = {
        status: "ready",
        connect: vi.fn().mockResolvedValue(undefined),
        eval: mockEval,
      };

      vi.spyOn(redisModule, "getRedisClient").mockReturnValue(mockClient as any);

      const result = await checkRateLimit("redis_key_exceeded", 5, 60000);
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
      expect(result.resetInMs).toBe(35000);
    });
  });

  // ---------------------------------------------------------------------------
  // 3. Resiliency & Graceful Fallback
  // ---------------------------------------------------------------------------
  describe("Failsafe Resilience & Graceful Fallback", () => {
    it("falls back to in-memory protection when Redis throws an unexpected error", async () => {
      const mockClient = {
        status: "ready",
        connect: vi.fn().mockResolvedValue(undefined),
        eval: vi.fn().mockRejectedValue(new Error("ECONNREFUSED: Redis cluster unreachable")),
      };

      vi.spyOn(redisModule, "getRedisClient").mockReturnValue(mockClient as any);

      // Should NOT throw; must gracefully fall back to local in-memory store
      const result = await checkRateLimit("fallback_key", 2, 60000);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(1);

      // Second attempt through fallback
      const result2 = await checkRateLimit("fallback_key", 2, 60000);
      expect(result2.allowed).toBe(true);
      expect(result2.remaining).toBe(0);

      // Third attempt through fallback is properly blocked
      const result3 = await checkRateLimit("fallback_key", 2, 60000);
      expect(result3.allowed).toBe(false);
    });

    it("falls back to in-memory protection when Redis connection fails", async () => {
      const mockClient = {
        status: "wait",
        connect: vi.fn().mockRejectedValue(new Error("Timeout connecting to Redis")),
        eval: vi.fn(),
      };

      vi.spyOn(redisModule, "getRedisClient").mockReturnValue(mockClient as any);

      const result = await checkRateLimit("conn_fail_key", 5, 60000);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(4);
    });

    it("uses in-memory store when REDIS_URL is not set", async () => {
      vi.spyOn(redisModule, "getRedisClient").mockReturnValue(null);

      const result = await checkRateLimit("no_redis_env", 10, 60000);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(9);
    });
  });
});
