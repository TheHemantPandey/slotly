import "server-only";
import { db } from "@/lib/db";
import { Service, AvailabilityRule } from "@prisma/client";
import { SLUG_ALIASES } from "@/lib/services-catalog";

/**
 * List all currently active consulting services from PostgreSQL.
 */
export async function listActiveServices(): Promise<Service[]> {
  return db.service.findMany({
    where: { isActive: true },
    orderBy: [{ category: "asc" }, { priceInPaise: "asc" }],
  });
}

/**
 * Retrieve a specific service by its stable ID or unique slug.
 * Gracefully resolves legacy slugs via SLUG_ALIASES fallback and reverse lookups.
 */
export async function getServiceById(idOrSlug: string): Promise<Service | null> {
  if (!idOrSlug) return null;
  const clean = idOrSlug.trim();

  // 1. Direct match by ID or slug
  const direct = await db.service.findFirst({
    where: {
      OR: [{ id: clean }, { slug: clean }],
      isActive: true,
    },
  });
  if (direct) return direct;

  // 2. Direct alias mapping (legacy -> new)
  const aliasedSlug = SLUG_ALIASES[clean];
  if (aliasedSlug) {
    const byAlias = await db.service.findFirst({
      where: {
        OR: [{ id: aliasedSlug }, { slug: aliasedSlug }],
        isActive: true,
      },
    });
    if (byAlias) return byAlias;
  }

  // 3. Reverse alias mapping (new -> legacy if DB not yet seeded)
  for (const [legacyKey, newTarget] of Object.entries(SLUG_ALIASES)) {
    if (newTarget === clean) {
      const byLegacy = await db.service.findFirst({
        where: {
          OR: [{ id: legacyKey }, { slug: legacyKey }],
          isActive: true,
        },
      });
      if (byLegacy) return byLegacy;
    }
  }

  // 4. Case-insensitive fallback
  return db.service.findFirst({
    where: {
      OR: [
        { id: { equals: clean, mode: "insensitive" } },
        { slug: { equals: clean, mode: "insensitive" } },
      ],
      isActive: true,
    },
  });
}

/**
 * Retrieve all active availability rules for appointment generation.
 */
export async function getActiveAvailabilityRules(): Promise<AvailabilityRule[]> {
  return db.availabilityRule.findMany({
    where: { isActive: true },
    orderBy: { weekday: "asc" },
  });
}
