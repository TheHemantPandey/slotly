import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import { checkRateLimit } from "@/lib/server/rate-limit";
import { isEmailConfigured, sendMail } from "@/lib/server/email";
import { getAdminEmail } from "@/lib/server/auth";

const errorReportSchema = z.object({
  errorCode: z.string().min(1).max(100),
  message: z.string().max(2000).optional(),
  path: z.string().max(1000),
  digest: z.string().max(200).optional(),
  stack: z.string().max(4000).optional(),
  userAgent: z.string().max(1000).optional(),
  timestamp: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    // Rate limiting: 10 reports per minute per IP
    const rate = await checkRateLimit(`telemetry_error_${ip}`, 10, 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Telemetry rate limit exceeded. Please wait a minute.",
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validated = errorReportSchema.parse(body);

    const reportId = `rpt_${crypto.randomBytes(4).toString("hex")}`;
    const adminEmail = getAdminEmail() || process.env.ADMIN_EMAIL || "hement.pandey2121@gmail.com";
    const serverTimestamp = new Date().toISOString();

    // Log diagnostic report to console
    console.warn(
      `[Telemetry Alert ${reportId}] ${validated.errorCode} encountered on "${validated.path}" at ${validated.timestamp} (IP: ${ip})`
    );
    if (validated.message) {
      console.warn(`[Telemetry Alert ${reportId}] Message: ${validated.message}`);
    }
    if (validated.digest) {
      console.warn(`[Telemetry Alert ${reportId}] Digest: ${validated.digest}`);
    }

    // Failsafe automated email dispatch via Nodemailer and Gmail SMTP
    if (isEmailConfigured()) {
      try {
        const emailSubject = `🚨 [Slotly Alert] ${validated.errorCode} on ${validated.path}`;

        const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${emailSubject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #04060e; color: #f4f4f5; margin: 0; padding: 24px;">
  <div style="max-width: 620px; margin: 0 auto; background-color: #070b16; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%); padding: 24px 28px; border-bottom: 1px solid rgba(255,255,255,0.08);">
      <div style="display: inline-block; padding: 4px 10px; border-radius: 9999px; background-color: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.35); color: #f87171; font-size: 11px; font-family: monospace; font-weight: bold; text-transform: uppercase; margin-bottom: 8px;">
        Telemetry Incident
      </div>
      <h1 style="margin: 0; font-size: 20px; font-weight: bold; color: #ffffff;">
        ${validated.errorCode}
      </h1>
      <p style="margin: 6px 0 0; font-size: 13px; color: #94a3b8; font-family: monospace;">
        Path: ${validated.path}
      </p>
    </div>

    <!-- Details Table -->
    <div style="padding: 24px 28px;">
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
        <tr>
          <td style="padding: 8px 0; color: #94a3b8; width: 140px; font-family: monospace;">Report ID</td>
          <td style="padding: 8px 0; color: #38bdf8; font-family: monospace; font-weight: bold;">${reportId}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #94a3b8; font-family: monospace;">Error Code</td>
          <td style="padding: 8px 0; color: #f87171; font-family: monospace; font-weight: bold;">${validated.errorCode}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #94a3b8; font-family: monospace;">Client Path</td>
          <td style="padding: 8px 0; color: #ffffff; font-family: monospace;">${validated.path}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #94a3b8; font-family: monospace;">Timestamp</td>
          <td style="padding: 8px 0; color: #cbd5e1; font-family: monospace;">${validated.timestamp}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #94a3b8; font-family: monospace;">Client IP</td>
          <td style="padding: 8px 0; color: #cbd5e1; font-family: monospace;">${ip}</td>
        </tr>
        ${
          validated.digest
            ? `<tr>
                <td style="padding: 8px 0; color: #94a3b8; font-family: monospace;">Next.js Digest</td>
                <td style="padding: 8px 0; color: #a855f7; font-family: monospace;">${validated.digest}</td>
              </tr>`
            : ""
        }
      </table>

      ${
        validated.message
          ? `<div style="margin-bottom: 20px; padding: 14px; border-radius: 10px; background-color: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.25);">
              <span style="font-size: 11px; font-family: monospace; text-transform: uppercase; color: #f87171; font-weight: bold; display: block; margin-bottom: 6px;">Error Message</span>
              <p style="margin: 0; font-size: 13px; color: #ffffff; font-family: monospace; word-break: break-all;">${validated.message}</p>
            </div>`
          : ""
      }

      ${
        validated.stack
          ? `<div style="margin-bottom: 20px;">
              <span style="font-size: 11px; font-family: monospace; text-transform: uppercase; color: #94a3b8; font-weight: bold; display: block; margin-bottom: 6px;">Sanitized Stack Trace</span>
              <pre style="margin: 0; padding: 12px; border-radius: 8px; background-color: #04060e; border: 1px solid rgba(255, 255, 255, 0.08); color: #cbd5e1; font-size: 11px; font-family: monospace; overflow-x: auto; white-space: pre-wrap; word-break: break-all;">${validated.stack}</pre>
            </div>`
          : ""
      }

      ${
        validated.userAgent
          ? `<div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(255, 255, 255, 0.08); font-size: 11px; color: #64748b; font-family: monospace;">
              User-Agent: ${validated.userAgent}
            </div>`
          : ""
      }
    </div>

    <!-- Footer -->
    <div style="background-color: #04060e; padding: 16px 28px; border-top: 1px solid rgba(255, 255, 255, 0.08); text-align: center;">
      <p style="margin: 0; font-size: 11px; color: #64748b; font-family: monospace;">
        Slotly Atelier Automated Telemetry Dispatch · Asia/Kolkata (IST)
      </p>
    </div>
  </div>
</body>
</html>
        `;

        await sendMail({
          to: adminEmail,
          subject: emailSubject,
          html: htmlBody,
        });

        console.log(`[Telemetry Alert] Gmail notification delivered to ${adminEmail} for ${reportId}`);
      } catch (emailErr) {
        console.warn(`[Telemetry Alert] Could not dispatch email via Gmail SMTP for ${reportId}:`, emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      reportId,
      serverTimestamp,
      message: "Telemetry diagnostic report recorded.",
    });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid telemetry report payload.",
          details: err.errors.map((e) => e.message),
        },
        { status: 400 }
      );
    }

    console.error("Telemetry handler failure:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process error report.",
      },
      { status: 500 }
    );
  }
}
