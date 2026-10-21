import { NextRequest, NextResponse } from "next/server";
import { safeConnection } from "@/lib/server/connection";
import {
  listPersistedAppointments,
  createPersistedAppointment,
  getPersistedAppointmentByToken,
  SchedulingConflictError,
  ServiceInactiveError,
} from "@/lib/server/appointments-repository";
import { getAdminSessionFromRequest } from "@/lib/server/auth";
import { checkRateLimit } from "@/lib/server/rate-limit";
import { ZodError } from "zod";
import { AppointmentStatus } from "@prisma/client";
import { sendBookingConfirmationEmail } from "@/lib/server/email";

export async function GET(request: NextRequest) {
  await safeConnection();

  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    const rate = await checkRateLimit(`get_appointments_${ip}`, 60, 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const token =
      request.headers.get("x-booking-token") || searchParams.get("token");

    // 1. If an individual customer provides their private token, return ONLY their verified booking
    if (token && token.trim().length > 0) {
      const appointment = await getPersistedAppointmentByToken(token.trim());
      if (!appointment) {
        return NextResponse.json(
          {
            success: false,
            error: "Booking record not found or access credential is invalid.",
          },
          { status: 404 }
        );
      }

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
          status: appointment.status,
          cancellationReason: appointment.cancellationReason,
          cancelledAt: appointment.cancelledAt?.toISOString(),
          createdAt: appointment.createdAt.toISOString(),
        },
      });
    }

    // 2. Check if caller has an authorized admin session
    const adminSession = getAdminSessionFromRequest(request);
    if (adminSession.valid) {
      const statusParam = searchParams.get("status") as AppointmentStatus | null;
      const upcomingOnly = searchParams.get("upcomingOnly") === "true";

      const appointments = await listPersistedAppointments({
        status: statusParam || undefined,
        upcomingOnly,
      });

      const adminView = appointments.map((apt) => ({
        id: apt.id,
        serviceId: apt.serviceId,
        serviceTitle: apt.service.name,
        clientName: apt.clientName,
        clientEmail: apt.clientEmail,
        clientNotes: apt.clientNotes,
        startTime: apt.startTime.toISOString(),
        endTime: apt.endTime.toISOString(),
        timezone: apt.timezone,
        durationMinutes: apt.service.durationMinutes,
        feeINR: Math.round(apt.feeInPaise / 100),
        status: apt.status,
        cancellationReason: apt.cancellationReason,
        cancelledAt: apt.cancelledAt?.toISOString(),
        createdAt: apt.createdAt.toISOString(),
      }));

      return NextResponse.json({
        success: true,
        appointments: adminView,
      });
    }

    // 3. For all other unauthenticated public requests: REJECT bulk customer listing
    return NextResponse.json(
      {
        success: false,
        error:
          "Public listing of customer appointments is restricted for privacy. Please access your individual booking using your private management URL or log in as an administrator.",
      },
      { status: 403 }
    );
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "digest" in error) {
      throw error;
    }

    console.error("API GET /api/appointments error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve appointments from database." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  await safeConnection();

  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    // Rate limiting: max 10 bookings per minute per IP
    const rate = await checkRateLimit(`post_appointments_${ip}`, 10, 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded. Please wait before staging more bookings.",
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const created = await createPersistedAppointment(body);

    const managementUrl = `/my-booking/${created.customerToken}`;

    // Dispatch professional Resend confirmation email (gracefully failsafe & non-blocking)
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
      console.warn("[Resend Warning] Non-blocking dispatch failed:", err);
    });

    return NextResponse.json(
      {
        success: true,
        message: "Appointment confirmed and persisted to PostgreSQL.",
        appointment: {
          id: created.id,
          serviceId: created.serviceId,
          serviceTitle: created.service.name,
          clientName: created.clientName,
          clientEmail: created.clientEmail,
          clientNotes: created.clientNotes,
          startTime: created.startTime.toISOString(),
          endTime: created.endTime.toISOString(),
          timezone: created.timezone,
          feeINR: Math.round(created.feeInPaise / 100),
          status: created.status,
          createdAt: created.createdAt.toISOString(),
        },
        // Private customer credential returned exclusively to the creator once at creation
        customerToken: created.customerToken,
        managementUrl,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "digest" in error) {
      throw error;
    }

    if (error instanceof ZodError) {
      const fieldErrors = error.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed.",
          details: fieldErrors,
        },
        { status: 400 }
      );
    }

    if (error instanceof SchedulingConflictError) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This consultation window was just booked by another client. Please select an alternate time slot.",
        },
        { status: 409 }
      );
    }

    if (error instanceof ServiceInactiveError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 404 }
      );
    }

    console.error("API POST /api/appointments error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred while booking the appointment.",
      },
      { status: 500 }
    );
  }
}
