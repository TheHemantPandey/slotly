import { NextRequest, NextResponse } from "next/server";
import { safeConnection } from "@/lib/server/connection";
import {
  cancelPersistedAppointment,
  cancelPersistedAppointmentAsAdmin,
  AppointmentNotFoundError,
} from "@/lib/server/appointments-repository";
import {
  getAdminSessionFromRequest,
  verifyCsrfOrigin,
} from "@/lib/server/auth";
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

    const rate = await checkRateLimit(`cancel_appointment_${ip}`, 15, 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many cancellation attempts. Please try again later." },
        { status: 429 }
      );
    }

    if (!verifyCsrfOrigin(request)) {
      return NextResponse.json(
        { success: false, error: "CSRF verification failed." },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Check if an authenticated admin is performing the cancellation
    const adminSession = getAdminSessionFromRequest(request);
    if (adminSession.valid && body.appointmentId) {
      const cancelled = await cancelPersistedAppointmentAsAdmin(
        body.appointmentId,
        body.reason
      );

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
        console.warn("[Resend Warning] Non-blocking admin cancellation email failed:", err);
      });

      return NextResponse.json({
        success: true,
        message: "Appointment cancelled successfully by administrator.",
        appointment: {
          id: cancelled.id,
          serviceTitle: cancelled.service.name,
          status: cancelled.status,
          cancellationReason: cancelled.cancellationReason,
          cancelledAt: cancelled.cancelledAt?.toISOString(),
        },
      });
    }

    // Customer cancellation via private token
    const token =
      request.headers.get("x-booking-token") ||
      body.cancellationToken ||
      body.token;

    if (!token || typeof token !== "string" || !token.trim()) {
      return NextResponse.json(
        { success: false, error: "Cancellation token is required." },
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
      console.warn("[Resend Warning] Non-blocking customer cancellation email failed:", err);
    });

    return NextResponse.json({
      success: true,
      message: "Appointment cancelled successfully.",
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
          error: "Invalid cancellation payload.",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    if (error instanceof AppointmentNotFoundError) {
      return NextResponse.json(
        { success: false, error: "Booking record not found or access credential is invalid." },
        { status: 404 }
      );
    }

    console.error("API POST /api/appointments/cancel error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process cancellation." },
      { status: 500 }
    );
  }
}
