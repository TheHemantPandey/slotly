import { NextRequest, NextResponse } from "next/server";
import { safeConnection } from "@/lib/server/connection";
import { runGeminiAssistant } from "@/lib/server/gemini";
import { checkRateLimit } from "@/lib/server/rate-limit";
import { z } from "zod";

const assistantRequestSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Inquiry message cannot be empty.")
    .max(2000, "Inquiry message is too long (maximum 2000 characters)."),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().max(4000),
      })
    )
    .max(30, "Conversation history limit exceeded.")
    .optional(),
});

export async function POST(request: NextRequest) {
  await safeConnection();

  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    // Rate limiting: 20 assistant requests per minute per IP
    const rate = checkRateLimit(`assistant_chat_${ip}`, 20, 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "RATE_LIMIT_EXCEEDED",
          reply: "You are submitting inquiries too rapidly. Please pause for a moment before continuing.",
        },
        { status: 429 }
      );
    }

    const json = await request.json();
    const validated = assistantRequestSchema.safeParse(json);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          error: "VALIDATION_FAILED",
          reply: validated.error.errors[0]?.message || "Invalid inquiry format.",
        },
        { status: 400 }
      );
    }

    const result = await runGeminiAssistant({
      message: validated.data.message,
      history: validated.data.history,
    });

    if (!result.success) {
      const httpStatus =
        result.error === "MISSING_API_KEY"
          ? 503
          : result.error?.startsWith("QUOTA_EXHAUSTED")
          ? 429
          : result.error === "INVALID_API_KEY"
          ? 401
          : result.error === "MODEL_NOT_FOUND"
          ? 502
          : result.error === "SERVICE_UNAVAILABLE"
          ? 503
          : 502;

      return NextResponse.json(
        {
          success: false,
          error: result.error,
          reply: result.reply,
          suggestedAction: result.suggestedAction,
        },
        { status: httpStatus }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "digest" in error) {
      throw error;
    }

    console.error("Assistant API handler error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "INTERNAL_ERROR",
        reply: "An internal server error occurred while processing your consultation request.",
      },
      { status: 500 }
    );
  }
}
