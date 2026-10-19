import { NextRequest, NextResponse } from "next/server";
import { safeConnection } from "@/lib/server/connection";
import {
  getAdminEmail,
  verifyPassword,
  createAdminSessionToken,
  setAdminSessionCookie,
} from "@/lib/server/auth";
import { checkRateLimit } from "@/lib/server/rate-limit";
import { adminLoginSchema } from "@/lib/server/validation";
import { ZodError } from "zod";

export async function POST(request: NextRequest) {
  await safeConnection();

  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    // Strict rate limiting: max 5 login attempts per 15 minutes per IP
    const rate = checkRateLimit(`admin_login_${ip}`, 5, 15 * 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many authentication attempts. Please try again in 15 minutes.",
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validated = adminLoginSchema.parse(body);

    const configuredEmail = getAdminEmail().toLowerCase();
    const configuredHash = process.env.ADMIN_PASSWORD_HASH;

    if (!configuredHash) {
      console.error("ADMIN_PASSWORD_HASH is not configured in environment.");
      return NextResponse.json(
        {
          success: false,
          error: "Admin credentials are not configured on the server.",
        },
        { status: 500 }
      );
    }

    // Verify email match (case-insensitive)
    const emailMatches =
      validated.email.trim().toLowerCase() === configuredEmail;

    // Verify password with constant-time comparison
    const passwordMatches = verifyPassword(validated.password, configuredHash);

    if (!emailMatches || !passwordMatches) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    // Authentication successful: issue cryptographically signed session token
    const sessionToken = createAdminSessionToken(configuredEmail);

    const response = NextResponse.json({
      success: true,
      message: "Admin authentication successful.",
      admin: {
        email: configuredEmail,
      },
    });

    setAdminSessionCookie(response, sessionToken);

    return response;
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "digest" in error) {
      throw error;
    }

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed.",
          details: error.errors.map((e) => e.message),
        },
        { status: 400 }
      );
    }

    console.error("Admin login error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred during sign-in." },
      { status: 500 }
    );
  }
}
