import { connection } from "next/server";

/**
 * Safe wrapper around Next.js 16 `connection()`.
 * In Next.js runtime, marks the route dynamic.
 * In standalone test runners, allows handler execution without crashing.
 */
export async function safeConnection(): Promise<void> {
  try {
    await connection();
  } catch {
    // Gracefully ignore when invoked outside Next.js request store (e.g. unit tests)
  }
}
