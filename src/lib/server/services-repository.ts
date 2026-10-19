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
 * Gracefully resolves legacy slugs via SLUG_ALIASES fallback.
 */
export async function getServiceById(idOrSlug: string): Promise<Service | null> {
  const direct = await db.service.findFirst({
    where: {
      OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      isActive: true,
    },
  });
  if (direct) return direct;

  const aliasedSlug = SLUG_ALIASES[idOrSlug];
  if (aliasedSlug) {
    return db.service.findFirst({
      where: {
        OR: [{ id: aliasedSlug }, { slug: aliasedSlug }],
        isActive: true,
      },
    });
  }

  return null;
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
