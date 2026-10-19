import { NextRequest, NextResponse } from "next/server";
import { safeConnection } from "@/lib/server/connection";
import {
  getAdminSessionFromRequest,
  verifyCsrfOrigin,
} from "@/lib/server/auth";
import {
  cancelPersistedAppointmentAsAdmin,
  AppointmentNotFoundError,
} from "@/lib/server/appointments-repository";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await safeConnection();

  try {
    const session = getAdminSessionFromRequest(request);
    if (!session.valid) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized. Admin session required to perform cancellation.",
        },
        { status: 401 }
      );
    }

    if (!verifyCsrfOrigin(request)) {
      return NextResponse.json(
        {
          success: false,
          error: "CSRF check failed. Cross-origin mutation forbidden.",
        },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Appointment ID is required." },
        { status: 400 }
      );
    }

    let reason: string | undefined;
    try {
      const body = await request.json();
      reason = body.reason;
    } catch {
      // optional body
    }

    const cancelled = await cancelPersistedAppointmentAsAdmin(id, reason);

    return NextResponse.json({
      success: true,
      message: "Appointment cancelled by administrator.",
      appointment: {
        id: cancelled.id,
        status: cancelled.status,
        cancellationReason: cancelled.cancellationReason,
        cancelledAt: cancelled.cancelledAt?.toISOString(),
      },
    });
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "digest" in error) {
      throw error;
    }

    if (error instanceof AppointmentNotFoundError) {
      return NextResponse.json(
        { success: false, error: "Appointment not found." },
        { status: 404 }
      );
    }

    console.error("Admin cancellation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to cancel appointment as admin." },
      { status: 500 }
    );
  }
}
