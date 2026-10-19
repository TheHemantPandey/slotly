import "server-only";
import { db } from "@/lib/db";
import { Service, AvailabilityRule } from "@prisma/client";

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
 */
export async function getServiceById(idOrSlug: string): Promise<Service | null> {
  return db.service.findFirst({
    where: {
      OR: [{ id: idOrSlug }, { slug: idOrSlug }],
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
