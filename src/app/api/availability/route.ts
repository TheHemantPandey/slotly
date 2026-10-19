import { NextRequest, NextResponse } from "next/server";
import { safeConnection } from "@/lib/server/connection";
import { computeAvailableSlots, ServiceInactiveError } from "@/lib/server/appointments-repository";

export async function GET(request: NextRequest) {
  await safeConnection();

  try {
    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get("serviceId");
    const date = searchParams.get("date");
    const timezone = searchParams.get("timezone") || "Asia/Kolkata";

    if (!serviceId) {
      return NextResponse.json(
        { success: false, error: "Query parameter 'serviceId' is required." },
        { status: 400 }
      );
    }

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { success: false, error: "Valid date in YYYY-MM-DD format is required." },
        { status: 400 }
      );
    }

    const availability = await computeAvailableSlots(serviceId, date, timezone);

    return NextResponse.json(
      {
        success: true,
        ...availability,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=10, stale-while-revalidate=30",
        },
      }
    );
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "digest" in error) {
      throw error;
    }

    if (error instanceof ServiceInactiveError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 404 }
      );
    }

    console.error("API /api/availability error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to compute availability slots." },
      { status: 500 }
    );
  }
}
