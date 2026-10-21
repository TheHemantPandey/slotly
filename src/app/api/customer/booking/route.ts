import { NextRequest, NextResponse } from "next/server";
import { safeConnection } from "@/lib/server/connection";
import { getPersistedAppointmentByToken } from "@/lib/server/appointments-repository";
import { checkRateLimit } from "@/lib/server/rate-limit";

function extractToken(request: NextRequest): string | null {
  // 1. Header: x-booking-token (preferred to avoid URL leaks)
  const headerToken = request.headers.get("x-booking-token");
  if (headerToken && headerToken.trim()) return headerToken.trim();

  // 2. Authorization: Bearer <token>
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const bearerToken = authHeader.slice(7).trim();
    if (bearerToken) return bearerToken;
  }

  // 3. Fallback: Query parameter
  const { searchParams } = new URL(request.url);
  const queryToken = searchParams.get("token");
  if (queryToken && queryToken.trim()) return queryToken.trim();

  return null;
}

export async function GET(request: NextRequest) {
  await safeConnection();

  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    // Rate limiting: 20 token lookups per minute per IP
    const rate = await checkRateLimit(`customer_lookup_${ip}`, 20, 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many lookup requests. Please wait a moment.",
        },
        { status: 429 }
      );
    }

    const token = extractToken(request);
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "Access credential required. Please provide a valid booking token.",
        },
        { status: 400 }
      );
    }

    const appointment = await getPersistedAppointmentByToken(token);
    if (!appointment) {
      // Generic error: never leak whether an ID or booking exists
      return NextResponse.json(
        {
          success: false,
          error: "Booking record not found or access credential is invalid.",
        },
        { status: 404 }
      );
    }

    // Return sanitized customer view (no secrets or hashes)
    return NextResponse.json({
      success: true,
      appointment: {
        id: appointment.id,
        serviceId: appointment.serviceId,
        serviceTitle: appointment.service.name,
        serviceDuration: appointment.service.durationMinutes,
        clientName: appointment.clientName,
        clientEmail: appointment.clientEmail,
        clientNotes: appointment.clientNotes,
        startTime: appointment.startTime.toISOString(),
        endTime: appointment.endTime.toISOString(),
        timezone: appointment.timezone,
        feeINR: Math.round(appointment.feeInPaise / 100),
        currency: appointment.currency,
        status: appointment.status,
        cancellationReason: appointment.cancellationReason,
        cancelledAt: appointment.cancelledAt?.toISOString(),
        createdAt: appointment.createdAt.toISOString(),
      },
    });
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "digest" in error) {
      throw error;
    }

    console.error("Customer booking lookup error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}
