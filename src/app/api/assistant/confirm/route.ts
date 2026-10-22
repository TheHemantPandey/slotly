import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { safeConnection } from "@/lib/server/connection";
import {
  createPersistedAppointment,
  SchedulingConflictError,
  ServiceInactiveError,
} from "@/lib/server/appointments-repository";
import {
  verifyProposalSignature,
  verifyCsrfOrigin,
  deriveCustomerToken,
} from "@/lib/server/auth";
import { checkRateLimit } from "@/lib/server/rate-limit";
import type { ConfirmedBookingResult } from "@/lib/types";
import { sendBookingConfirmationEmail } from "@/lib/server/email";

const proposalPayloadSchema = z.object({
  proposalId: z.string().min(1, "Proposal ID is required"),
  expiresAt: z.number().int().positive("Expiry timestamp is required"),
  signature: z.string().min(1, "Cryptographic signature is required"),
  serviceId: z.string().min(1, "Service ID is required"),
  serviceTitle: z.string().min(1, "Service title is required"),
  durationMinutes: z.number().int().positive("Duration must be positive"),
  feeINR: z.number().int().nonnegative("Fee must be non-negative"),
  startTime: z.string().datetime("Start time must be ISO 8601 UTC string"),
  endTime: z.string().datetime("End time must be ISO 8601 UTC string"),
  displayRange: z.string().min(1, "Display range is required"),
  clientName: z.string().trim().min(2, "Client name must be at least 2 characters").max(100),
  clientEmail: z.string().trim().email("Valid email address is required").toLowerCase(),
  clientNotes: z.string().trim().max(1000).optional(),
  timezone: z.string().default("Asia/Kolkata"),
});

const confirmProposalRequestSchema = z.object({
  proposal: proposalPayloadSchema,
  customerConfirmed: z.boolean(),
});

interface CachedConfirmation {
  appointment: {
    id: string;
    serviceId: string;
    serviceTitle: string;
    clientName: string;
    clientEmail: string;
    clientNotes?: string;
    startTime: string;
    endTime: string;
    timezone: string;
    feeINR: number;
    status: string;
    createdAt: string;
  };
  customerToken: string;
  managementUrl: string;
  confirmedBooking: ConfirmedBookingResult;
  isExisting?: boolean;
}

// In-memory cache for idempotency and duplicate confirmation deduplication
const confirmedProposalsCache = new Map<string, CachedConfirmation>();
const inFlightConfirmations = new Map<string, Promise<CachedConfirmation>>();

export async function POST(request: NextRequest) {
  await safeConnection();

  // 1. Verify CSRF Origin
  if (!verifyCsrfOrigin(request)) {
    return NextResponse.json(
      {
        success: false,
        error: "CSRF_FORBIDDEN",
        reply: "Forbidden cross-origin request.",
      },
      { status: 403 }
    );
  }

  // 2. IP-based Rate Limiting (20 confirmation attempts per minute)
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1";

  const rate = await checkRateLimit(`assistant_confirm_${ip}`, 20, 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: "RATE_LIMIT_EXCEEDED",
        reply: "Too many confirmation attempts. Please pause briefly before retrying.",
      },
      { status: 429 }
    );
  }

  // 3. Parse and validate JSON input format
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "INVALID_JSON",
        reply: "Malformed request payload.",
      },
      { status: 400 }
    );
  }

  const parsed = confirmProposalRequestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: "VALIDATION_FAILED",
        reply: parsed.error.errors[0]?.message || "Invalid confirmation payload.",
      },
      { status: 400 }
    );
  }

  const { proposal, customerConfirmed } = parsed.data;

  // 4. Require explicit customer confirmation
  if (!customerConfirmed) {
    return NextResponse.json(
      {
        success: false,
        error: "CONFIRMATION_REQUIRED",
        reply: "Explicit customer confirmation is required to finalize this booking.",
      },
      { status: 400 }
    );
  }

  // 5. Expiry Check
  if (Date.now() > proposal.expiresAt) {
    return NextResponse.json(
      {
        success: false,
        error: "PROPOSAL_EXPIRED",
        reply: "This booking proposal has expired. Please request a fresh appointment proposal.",
        suggestedAction: {
          label: "View Available Slots",
          href: `/book?service=${proposal.serviceId}`,
        },
      },
      { status: 410 }
    );
  }

  // 6. Cryptographic HMAC Signature Verification (tamper detection)
  const isSignatureValid = verifyProposalSignature(
    {
      proposalId: proposal.proposalId,
      serviceId: proposal.serviceId,
      startTime: proposal.startTime,
      endTime: proposal.endTime,
      clientEmail: proposal.clientEmail,
      clientName: proposal.clientName,
      feeINR: proposal.feeINR,
      timezone: proposal.timezone,
      expiresAt: proposal.expiresAt,
    },
    proposal.signature
  );

  if (!isSignatureValid) {
    return NextResponse.json(
      {
        success: false,
        error: "TAMPERED_PROPOSAL",
        reply: "The booking proposal signature is invalid or has been modified. Booking rejected.",
      },
      { status: 400 }
    );
  }

  // 7. Fast-path in-memory idempotency check (for quick single-instance retries)
  const cached = confirmedProposalsCache.get(proposal.proposalId);
  if (cached) {
    return NextResponse.json(
      {
        success: true,
        message: "Appointment already confirmed.",
        appointment: cached.appointment,
        customerToken: cached.customerToken,
        managementUrl: cached.managementUrl,
        confirmedBooking: cached.confirmedBooking,
      },
      { status: 200 }
    );
  }

  // 8. Derive deterministic high-entropy customer access token bound to proposalId
  const deterministicToken = deriveCustomerToken(proposal.proposalId);

  // 9. Prevent duplicate in-flight requests for the same proposal
  let confirmationPromise = inFlightConfirmations.get(proposal.proposalId);
  if (!confirmationPromise) {
    confirmationPromise = (async (): Promise<CachedConfirmation> => {
      // Passes explicitToken so PostgreSQL enforces durable idempotency via unique cancellationTokenHash
      const created = await createPersistedAppointment(
        {
          serviceId: proposal.serviceId,
          startTime: proposal.startTime,
          clientName: proposal.clientName,
          clientEmail: proposal.clientEmail,
          clientNotes: proposal.clientNotes,
          timezone: proposal.timezone,
        },
        { explicitToken: deterministicToken }
      );

      const managementUrl = `/my-booking/${created.customerToken}`;
      const confirmedBooking: ConfirmedBookingResult = {
        id: created.id,
        serviceTitle: created.service.name,
        startTime: created.startTime.toISOString(),
        displayRange: proposal.displayRange,
        clientName: created.clientName,
        clientEmail: created.clientEmail,
        managementUrl,
        customerToken: created.customerToken,
      };

      // Dispatch professional confirmation email if this is a newly created booking
      if (!created.isExisting) {
        sendBookingConfirmationEmail({
          appointmentId: created.id,
          serviceTitle: created.service.name,
          clientName: created.clientName,
          clientEmail: created.clientEmail,
          clientNotes: created.clientNotes ?? undefined,
          startTime: created.startTime,
          endTime: created.endTime,
          durationMinutes: created.service.durationMinutes,
          feeINR: Math.round(created.feeInPaise / 100),
          timezone: created.timezone,
          customerToken: created.customerToken,
        }).catch((err) => {
          console.warn("[Email Warning] Non-blocking dispatch failed:", err);
        });
      }

      const result: CachedConfirmation = {
        appointment: {
          id: created.id,
          serviceId: created.serviceId,
          serviceTitle: created.service.name,
          clientName: created.clientName,
          clientEmail: created.clientEmail,
          clientNotes: created.clientNotes ?? undefined,
          startTime: created.startTime.toISOString(),
          endTime: created.endTime.toISOString(),
          timezone: created.timezone,
          feeINR: Math.round(created.feeInPaise / 100),
          status: created.status,
          createdAt: created.createdAt.toISOString(),
        },
        customerToken: created.customerToken,
        managementUrl,
        confirmedBooking,
        isExisting: created.isExisting,
      };

      confirmedProposalsCache.set(proposal.proposalId, result);
      return result;
    })();

    inFlightConfirmations.set(proposal.proposalId, confirmationPromise);
  }

  try {
    const finalized = await confirmationPromise;
    const statusCode = finalized.isExisting ? 200 : 201;
    return NextResponse.json(
      {
        success: true,
        message: finalized.isExisting
          ? "Appointment already confirmed."
          : "Appointment confirmed and persisted to PostgreSQL.",
        appointment: finalized.appointment,
        customerToken: finalized.customerToken,
        managementUrl: finalized.managementUrl,
        confirmedBooking: finalized.confirmedBooking,
      },
      { status: statusCode }
    );
  } catch (error: unknown) {
    // Evict failed promise from inFlight map so user may retry if it was transient
    inFlightConfirmations.delete(proposal.proposalId);

    if (error instanceof SchedulingConflictError) {
      return NextResponse.json(
        {
          success: false,
          error: "SLOT_CONFLICT",
          reply: "This time slot was just booked by another client. Please select an alternate available slot.",
          suggestedAction: {
            label: "Select Alternate Slot",
            href: `/book?service=${proposal.serviceId}`,
          },
        },
        { status: 409 }
      );
    }

    if (error instanceof ServiceInactiveError) {
      return NextResponse.json(
        {
          success: false,
          error: "SERVICE_INACTIVE",
          reply: error.message,
        },
        { status: 404 }
      );
    }

    if (typeof error === "object" && error !== null && "digest" in error) {
      throw error;
    }

    console.error("Booking confirmation endpoint error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "INTERNAL_ERROR",
        reply: "An unexpected error occurred while confirming your appointment.",
      },
      { status: 500 }
    );
  } finally {
    inFlightConfirmations.delete(proposal.proposalId);
  }
}
