import { NextRequest, NextResponse } from "next/server";
import { safeConnection } from "@/lib/server/connection";
import { getAdminSessionFromRequest } from "@/lib/server/auth";

export async function GET(request: NextRequest) {
  await safeConnection();

  const session = getAdminSessionFromRequest(request);
  if (!session.valid || !session.email) {
    return NextResponse.json(
      {
        success: false,
        authenticated: false,
        error: "Unauthorized. Valid admin session is required.",
      },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    authenticated: true,
    admin: {
      email: session.email,
    },
  });
}
