import "server-only";
import { db } from "@/lib/db";
import { AppointmentStatus, Prisma } from "@prisma/client";
import {
  createAppointmentSchema,
  cancelAppointmentSchema,
  CreateAppointmentInput,
  CancelAppointmentInput,
} from "./validation";

import {
  generateCustomerToken,
  hashCustomerToken,
} from "./auth";
import { getServiceById } from "./services-repository";

export type AppointmentWithService = Prisma.AppointmentGetPayload<{
  include: { service: true };
}>;

export type CreatedAppointmentResult = AppointmentWithService & {
  customerToken: string;
  isExisting?: boolean;
};

export class SchedulingConflictError extends Error {
  constructor(message = "The requested window conflicts with an existing appointment.") {
    super(message);
    this.name = "SchedulingConflictError";
  }
}

export class AppointmentNotFoundError extends Error {
  constructor(message = "The requested appointment was not found.") {
    super(message);
    this.name = "AppointmentNotFoundError";
  }
}

export class ServiceInactiveError extends Error {
  constructor(message = "The requested service is not currently available for booking.") {
    super(message);
    this.name = "ServiceInactiveError";
  }
}

export interface ComputedSlot {
  id: string;
  startTime: string; // ISO 8601 UTC
  endTime: string;   // ISO 8601 UTC
  displayTime: string; // e.g. "10:00 AM"
  displayRange: string; // e.g. "10:00 AM - 10:45 AM"
  available: boolean;
  conflictReason?: string;
}

export interface AdminAppointmentFilters {
  status?: AppointmentStatus;
  serviceId?: string;
  date?: string; // YYYY-MM-DD
  search?: string;
}

export interface AdminOverviewStats {
  totalUpcoming: number;
  appointmentsToday: number;
  totalCancelled: number;
  activeServicesCount: number;
}

/**
 * List persisted appointments with optional status, email, and timeline filters.
 * Note: Only for authorized internal/admin usage.
 */
export async function listPersistedAppointments(options?: {
  status?: AppointmentStatus;
  clientEmail?: string;
  upcomingOnly?: boolean;
}): Promise<AppointmentWithService[]> {
  const where: Prisma.AppointmentWhereInput = {};

  if (options?.status) {
    where.status = options.status;
  }

  if (options?.clientEmail) {
    where.clientEmail = options.clientEmail;
  }

  if (options?.upcomingOnly) {
    where.startTime = { gte: new Date() };
    if (!options.status) {
      where.status = { in: ["CONFIRMED", "PENDING_INTAKE"] };
    }
  }

  return db.appointment.findMany({
    where,
    include: { service: true },
    orderBy: { startTime: "asc" },
  });
}

/**
 * List appointments for the protected admin dashboard with advanced filtering.
 */
export async function listAdminAppointments(
  filters?: AdminAppointmentFilters
): Promise<AppointmentWithService[]> {
  const where: Prisma.AppointmentWhereInput = {};

  if (filters?.status) {
    where.status = filters.status;
  }

  if (filters?.serviceId) {
    where.serviceId = filters.serviceId;
  }

  if (filters?.date) {
    const [year, month, day] = filters.date.split("-").map(Number);
    // IST start and end UTC
    const istOffsetMs = 330 * 60 * 1000;
    const startUtc = new Date(Date.UTC(year, month - 1, day, 0, 0, 0) - istOffsetMs);
    const endUtc = new Date(Date.UTC(year, month - 1, day, 23, 59, 59) - istOffsetMs);
    where.startTime = { gte: startUtc, lte: endUtc };
  }

  if (filters?.search && filters.search.trim().length > 0) {
    const query = filters.search.trim();
    where.OR = [
      { clientName: { contains: query, mode: "insensitive" } },
      { clientEmail: { contains: query, mode: "insensitive" } },
      { clientNotes: { contains: query, mode: "insensitive" } },
    ];
  }

  return db.appointment.findMany({
    where,
    include: { service: true },
    orderBy: { startTime: "desc" },
  });
}

/**
 * Compute real-time dashboard overview metrics for admin.
 */
export async function getAdminOverviewStats(): Promise<AdminOverviewStats> {
  const now = new Date();

  // Start & end of today in Asia/Kolkata (UTC+5:30)
  const istOffsetMs = 330 * 60 * 1000;
  const nowIst = new Date(now.getTime() + istOffsetMs);
  const todayYear = nowIst.getUTCFullYear();
  const todayMonth = nowIst.getUTCMonth();
  const todayDay = nowIst.getUTCDate();

  const todayStartUtc = new Date(Date.UTC(todayYear, todayMonth, todayDay, 0, 0, 0) - istOffsetMs);
  const todayEndUtc = new Date(Date.UTC(todayYear, todayMonth, todayDay, 23, 59, 59) - istOffsetMs);

  const [totalUpcoming, appointmentsToday, totalCancelled, activeServicesCount] = await Promise.all([
    db.appointment.count({
      where: {
        startTime: { gte: now },
        status: { in: ["PENDING_INTAKE", "CONFIRMED"] },
      },
    }),
    db.appointment.count({
      where: {
        startTime: { gte: todayStartUtc, lte: todayEndUtc },
      },
    }),
    db.appointment.count({
      where: {
        status: "CANCELLED",
      },
    }),
    db.service.count({
      where: {
        isActive: true,
      },
    }),
  ]);

  return {
    totalUpcoming,
    appointmentsToday,
    totalCancelled,
    activeServicesCount,
  };
}

/**
 * Retrieve a single appointment by ID.
 */
export async function getPersistedAppointmentById(
  id: string
): Promise<AppointmentWithService | null> {
  return db.appointment.findUnique({
    where: { id },
    include: { service: true },
  });
}

/**
 * Retrieve appointment by high-entropy customer access token.
 * Matches against stored SHA-256 hash or legacy token.
 */
export async function getPersistedAppointmentByToken(
  token: string
): Promise<AppointmentWithService | null> {
  const cleanToken = token.trim();
  const hash = hashCustomerToken(cleanToken);

  return db.appointment.findFirst({
    where: {
      OR: [
        { cancellationTokenHash: hash },
        { cancellationToken: cleanToken },
      ],
    },
    include: { service: true },
  });
}

/**
 * Create a new appointment in PostgreSQL with strict concurrency locking.
 * Uses PostgreSQL advisory transaction lock to prevent race-condition overlaps.
 * Stores only the SHA-256 hash of the generated high-entropy token in the database.
 */
export async function createPersistedAppointment(
  rawInput: CreateAppointmentInput,
  options?: { explicitToken?: string }
): Promise<CreatedAppointmentResult> {
  const validated = createAppointmentSchema.parse(rawInput);
  const startTime = new Date(validated.startTime);

  // Generate 256-bit high-entropy customer access token or use explicit deterministic token
  const rawCustomerToken = options?.explicitToken
    ? options.explicitToken.trim()
    : generateCustomerToken();
  const tokenHash = hashCustomerToken(rawCustomerToken);

  // Execute inside transaction with advisory xact lock for concurrency safety
  const created = await db.$transaction(
    async (tx) => {
    // 1. Acquire transaction-scoped PostgreSQL advisory lock keyed to this service
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext('slotly_booking_' || ${validated.serviceId}))`;

    // 2. Durable PostgreSQL-backed idempotency check:
    // If an appointment with this exact cancellationTokenHash already exists, return it
    const existingByIdempotency = await tx.appointment.findFirst({
      where: { cancellationTokenHash: tokenHash },
      include: { service: true },
    });

    if (existingByIdempotency) {
      if (existingByIdempotency.status === "CANCELLED") {
        throw new SchedulingConflictError(
          "This appointment proposal was previously cancelled. Please select a fresh slot."
        );
      }
      return {
        ...existingByIdempotency,
        isExisting: true,
      };
    }

    // 3. Verify service existence and active status (supporting id, slug, or alias)
    const service = await getServiceById(validated.serviceId);

    if (!service || !service.isActive) {
      throw new ServiceInactiveError();
    }

    // 3. Compute exact end time based on service duration
    const endTime = new Date(startTime.getTime() + service.durationMinutes * 60 * 1000);

    // 4. Concurrency-safe overlap check: active bookings cannot overlap
    const existingConflict = await tx.appointment.findFirst({
      where: {
        serviceId: service.id,
        status: { in: ["CONFIRMED", "PENDING_INTAKE"] },
        startTime: { lt: endTime },
        endTime: { gt: startTime },
      },
    });

    if (existingConflict) {
      throw new SchedulingConflictError();
    }

    // 5. Atomic record creation with locked pricing in paise
    return tx.appointment.create({
      data: {
        serviceId: service.id,
        clientName: validated.clientName,
        clientEmail: validated.clientEmail,
        clientNotes: validated.clientNotes,
        startTime,
        endTime,
        timezone: validated.timezone,
        feeInPaise: service.priceInPaise,
        currency: service.currency,
        status: "PENDING_INTAKE",
        cancellationTokenHash: tokenHash,
        cancellationToken: null, // Plaintext token is never stored in DB
      },
      include: { service: true },
    });
  }, { timeout: 20000, maxWait: 10000 });

  return {
    ...created,
    customerToken: rawCustomerToken,
  };
}

/**
 * Cancel an appointment using its customer access token.
 */
export async function cancelPersistedAppointment(
  rawInput: CancelAppointmentInput
): Promise<AppointmentWithService> {
  const validated = cancelAppointmentSchema.parse(rawInput);
  const cleanToken = validated.cancellationToken.trim();
  const hash = hashCustomerToken(cleanToken);

  return db.$transaction(async (tx) => {
    const appointment = await tx.appointment.findFirst({
      where: {
        OR: [
          { cancellationTokenHash: hash },
          { cancellationToken: cleanToken },
        ],
      },
      include: { service: true },
    });

    if (!appointment) {
      throw new AppointmentNotFoundError();
    }

    if (appointment.status === "CANCELLED") {
      return appointment;
    }

    return tx.appointment.update({
      where: { id: appointment.id },
      data: {
        status: "CANCELLED",
        cancellationReason: validated.reason || "Customer requested cancellation via private portal",
        cancelledAt: new Date(),
      },
      include: { service: true },
    });
  }, { timeout: 20000, maxWait: 10000 });
}

/**
 * Cancel an appointment as an authorized administrator.
 */
export async function cancelPersistedAppointmentAsAdmin(
  appointmentId: string,
  reason?: string
): Promise<AppointmentWithService> {
  const appointment = await db.appointment.findUnique({
    where: { id: appointmentId },
    include: { service: true },
  });

  if (!appointment) {
    throw new AppointmentNotFoundError();
  }

  if (appointment.status === "CANCELLED") {
    return appointment;
  }

  return db.appointment.update({
    where: { id: appointment.id },
    data: {
      status: "CANCELLED",
      cancellationReason: reason ? `Admin cancellation: ${reason}` : "Cancelled by administrator",
      cancelledAt: new Date(),
    },
    include: { service: true },
  });
}

/**
 * Compute real-time availability slots for a given service and date (YYYY-MM-DD).
 * Cross-references availability rules and existing bookings in PostgreSQL.
 */
export async function computeAvailableSlots(
  serviceId: string,
  dateStr: string, // YYYY-MM-DD
  userTimezone = "Asia/Kolkata"
): Promise<{
  service: { id: string; name: string; durationMinutes: number; priceInPaise: number };
  date: string;
  slots: ComputedSlot[];
}> {
  const service = await getServiceById(serviceId);

  if (!service || !service.isActive) {
    throw new ServiceInactiveError();
  }

  // Parse target date (local calendar day)
  const [year, month, day] = dateStr.split("-").map(Number);
  const targetDate = new Date(Date.UTC(year, month - 1, day));
  const weekday = targetDate.getUTCDay(); // 0 = Sunday, 1 = Monday, ...

  // Find matching availability rule for this weekday
  const rule = await db.availabilityRule.findFirst({
    where: { weekday, isActive: true },
  });

  if (!rule) {
    return {
      service: {
        id: service.id,
        name: service.name,
        durationMinutes: service.durationMinutes,
        priceInPaise: service.priceInPaise,
      },
      date: dateStr,
      slots: [],
    };
  }

  // Parse start and end hours from rule (e.g. "09:30" and "18:00")
  const [startHour, startMin] = rule.startTime.split(":").map(Number);
  const [endHour, endMin] = rule.endTime.split(":").map(Number);

  // Construct start and end UTC timestamps for the day in IST (UTC+5:30)
  // IST offset is +05:30 -> UTC is local - 5h30m
  const istOffsetMinutes = 330;
  const dayStartUtcMs =
    Date.UTC(year, month - 1, day, startHour, startMin) - istOffsetMinutes * 60 * 1000;
  const dayEndUtcMs =
    Date.UTC(year, month - 1, day, endHour, endMin) - istOffsetMinutes * 60 * 1000;

  // Query existing active bookings for this service on this day
  const existingBookings = await db.appointment.findMany({
    where: {
      serviceId: service.id,
      status: { in: ["CONFIRMED", "PENDING_INTAKE"] },
      startTime: { gte: new Date(dayStartUtcMs - 2 * 3600 * 1000) },
      endTime: { lte: new Date(dayEndUtcMs + 2 * 3600 * 1000) },
    },
    select: {
      id: true,
      startTime: true,
      endTime: true,
      status: true,
    },
  });

  // Generate discrete slot intervals (20 mins for fast enquiry calls)
  const slotDurationMs = service.durationMinutes * 60 * 1000;
  const slotStepMs = (service.durationMinutes <= 20 ? 20 : service.durationMinutes <= 30 ? 30 : 45) * 60 * 1000;

  const slots: ComputedSlot[] = [];
  let currentSlotStartMs = dayStartUtcMs;

  const now = Date.now();

  while (currentSlotStartMs + slotDurationMs <= dayEndUtcMs) {
    const slotStart = new Date(currentSlotStartMs);
    const slotEnd = new Date(currentSlotStartMs + slotDurationMs);

    // Check collision against existing active bookings
    const hasConflict = existingBookings.some((b) => {
      const bStart = b.startTime.getTime();
      const bEnd = b.endTime.getTime();
      return currentSlotStartMs < bEnd && currentSlotStartMs + slotDurationMs > bStart;
    });

    const isPast = currentSlotStartMs <= now;
    const isAvailable = !hasConflict && !isPast;

    // Format local time display in target timezone
    const timeFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: userTimezone,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const displayStart = timeFormatter.format(slotStart);
    const displayEnd = timeFormatter.format(slotEnd);

    slots.push({
      id: `slot-${dateStr}-${slotStart.toISOString()}`,
      startTime: slotStart.toISOString(),
      endTime: slotEnd.toISOString(),
      displayTime: displayStart,
      displayRange: `${displayStart} - ${displayEnd}`,
      available: isAvailable,
      conflictReason: isPast ? "Time slot has passed" : hasConflict ? "Reserved by another client" : undefined,
    });

    currentSlotStartMs += slotStepMs;
  }

  return {
    service: {
      id: service.id,
      name: service.name,
      durationMinutes: service.durationMinutes,
      priceInPaise: service.priceInPaise,
    },
    date: dateStr,
    slots,
  };
}
