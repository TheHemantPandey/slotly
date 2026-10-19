import { NextRequest, NextResponse } from "next/server";
import { safeConnection } from "@/lib/server/connection";
import { getAdminSessionFromRequest } from "@/lib/server/auth";
import { getAdminOverviewStats } from "@/lib/server/appointments-repository";

export async function GET(request: NextRequest) {
  await safeConnection();

  try {
    const session = getAdminSessionFromRequest(request);
    if (!session.valid) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized. Admin session required to view metrics.",
        },
        { status: 401 }
      );
    }

    const stats = await getAdminOverviewStats();

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "digest" in error) {
      throw error;
    }

    console.error("Admin stats error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load dashboard metrics." },
      { status: 500 }
    );
  }
}
