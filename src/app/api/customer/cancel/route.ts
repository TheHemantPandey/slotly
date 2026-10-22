import { NextRequest, NextResponse } from "next/server";
import { safeConnection } from "@/lib/server/connection";
import {
  cancelPersistedAppointment,
  AppointmentNotFoundError,
} from "@/lib/server/appointments-repository";
import { verifyCsrfOrigin } from "@/lib/server/auth";
import { checkRateLimit } from "@/lib/server/rate-limit";
import { sendBookingCancellationEmail } from "@/lib/server/email";
import { ZodError } from "zod";

export async function POST(request: NextRequest) {
  await safeConnection();

  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    const rate = await checkRateLimit(`customer_cancel_${ip}`, 10, 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many cancellation attempts. Please try again later.",
        },
        { status: 429 }
      );
    }

    if (!verifyCsrfOrigin(request)) {
      return NextResponse.json(
        {
          success: false,
          error: "CSRF verification failed.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const token =
      request.headers.get("x-booking-token") || body.cancellationToken || body.token;

    if (!token || typeof token !== "string" || !token.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Cancellation credential is required.",
        },
        { status: 400 }
      );
    }

    const cancelled = await cancelPersistedAppointment({
      cancellationToken: token.trim(),
      reason: body.reason,
    });

    // Failsafe cancellation email notification
    sendBookingCancellationEmail({
      appointmentId: cancelled.id,
      serviceTitle: cancelled.service.name,
      clientName: cancelled.clientName,
      clientEmail: cancelled.clientEmail,
      startTime: cancelled.startTime,
      timezone: cancelled.timezone,
      cancellationReason: cancelled.cancellationReason ?? undefined,
    }).catch((err) => {
      console.warn("[Email Warning] Non-blocking cancellation email failed:", err);
    });

    return NextResponse.json({
      success: true,
      message: "Your appointment has been cancelled successfully.",
      appointment: {
        id: cancelled.id,
        serviceTitle: cancelled.service.name,
        status: cancelled.status,
        cancellationReason: cancelled.cancellationReason,
        cancelledAt: cancelled.cancelledAt?.toISOString(),
      },
    });
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "digest" in error) {
      throw error;
    }

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request payload.",
        },
        { status: 400 }
      );
    }

    if (error instanceof AppointmentNotFoundError) {
      // Generic error: never leak whether appointment or token exists
      return NextResponse.json(
        {
          success: false,
          error: "Booking record not found or access credential is invalid.",
        },
        { status: 404 }
      );
    }

    console.error("Customer cancellation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process cancellation." },
      { status: 500 }
    );
  }
}
