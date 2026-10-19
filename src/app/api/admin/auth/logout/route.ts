import { NextResponse } from "next/server";
import { safeConnection } from "@/lib/server/connection";
import { clearAdminSessionCookie } from "@/lib/server/auth";

export async function POST() {
  await safeConnection();

  const response = NextResponse.json({
    success: true,
    message: "Admin session cleared successfully.",
  });

  clearAdminSessionCookie(response);
  return response;
}
