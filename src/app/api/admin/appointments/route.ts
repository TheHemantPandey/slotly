import { NextRequest, NextResponse } from "next/server";
import { safeConnection } from "@/lib/server/connection";
import { getAdminSessionFromRequest } from "@/lib/server/auth";
import { listAdminAppointments } from "@/lib/server/appointments-repository";
import { AppointmentStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  await safeConnection();

  try {
    const session = getAdminSessionFromRequest(request);
    if (!session.valid) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized. Admin session required to view appointments.",
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as AppointmentStatus | null;
    const serviceId = searchParams.get("serviceId") || undefined;
    const date = searchParams.get("date") || undefined;
    const search = searchParams.get("search") || undefined;

    const appointments = await listAdminAppointments({
      status: status || undefined,
      serviceId,
      date,
      search,
    });

    const formatted = appointments.map((apt) => ({
      id: apt.id,
      serviceId: apt.serviceId,
      serviceTitle: apt.service.name,
      serviceDuration: apt.service.durationMinutes,
      clientName: apt.clientName,
      clientEmail: apt.clientEmail,
      clientNotes: apt.clientNotes,
      startTime: apt.startTime.toISOString(),
      endTime: apt.endTime.toISOString(),
      timezone: apt.timezone,
      feeInPaise: apt.feeInPaise,
      feeINR: Math.round(apt.feeInPaise / 100),
      currency: apt.currency,
      status: apt.status,
      cancellationReason: apt.cancellationReason,
      cancelledAt: apt.cancelledAt?.toISOString(),
      createdAt: apt.createdAt.toISOString(),
      updatedAt: apt.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      appointments: formatted,
    });
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "digest" in error) {
      throw error;
    }

    console.error("Admin appointments listing error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load admin appointments." },
      { status: 500 }
    );
  }
}
