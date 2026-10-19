import { NextRequest, NextResponse } from "next/server";
import { getServiceBySlug } from "@/lib/services-catalog";
import { isResendConfigured } from "@/lib/server/email";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, serviceId, budget, requirements } = body;

    // Validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid full name (at least 2 characters)." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!requirements || typeof requirements !== "string" || requirements.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: "Please briefly describe your project requirements (at least 5 characters)." },
        { status: 400 }
      );
    }

    const matchedService = serviceId ? getServiceBySlug(serviceId) : undefined;
    const serviceTitle = matchedService ? matchedService.title : serviceId || "Custom Web Project";
    const startingPrice = matchedService ? `Starting at ₹${matchedService.startingPriceINR.toLocaleString("en-IN")}` : "Custom Quote";

    // Generate unique reference
    const timestampStr = Date.now().toString(36).toUpperCase();
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const referenceId = `QT-${new Date().getFullYear()}-${timestampStr.slice(-4)}${randomSuffix}`;

    console.log(`[Quote Request Received] Ref: ${referenceId}`);
    console.log(`  Client: ${name.trim()} <${email.trim()}>`);
    console.log(`  Service: ${serviceTitle}`);
    console.log(`  Budget: ${budget || "Not specified"}`);
    console.log(`  Requirements: ${requirements.trim()}`);

    // If Resend is configured, trigger transactional notification emails
    if (isResendConfigured()) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const fromEmail = process.env.EMAIL_FROM || "Hemant Pandey <onboarding@resend.dev>";
        const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "contact@hemantpandey.in";

        // 1. Send confirmation to client
        await resend.emails.send({
          from: fromEmail,
          to: email.trim(),
          subject: `Quote Request Received: ${serviceTitle} (${referenceId})`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #04060e; color: #f4f4f5; padding: 32px 20px;">
              <div style="max-width: 580px; margin: 0 auto; background-color: #090e1d; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 32px;">
                <div style="color: #6366f1; font-family: monospace; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 8px;">
                  Quote Inquiry Confirmation
                </div>
                <h1 style="color: #ffffff; font-size: 24px; margin-top: 0; margin-bottom: 16px;">
                  Project Request Received
                </h1>
                <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6;">
                  Hi ${name.trim()}, thank you for reaching out regarding <strong>${serviceTitle}</strong>. I have received your project details and will review them carefully.
                </p>
                <div style="background-color: #04060e; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 18px; margin: 24px 0; font-family: monospace; font-size: 13px;">
                  <div style="margin-bottom: 8px;"><span style="color: #71717a;">Reference:</span> <strong style="color: #ffffff;">${referenceId}</strong></div>
                  <div style="margin-bottom: 8px;"><span style="color: #71717a;">Service:</span> <strong style="color: #38bdf8;">${serviceTitle}</strong> (${startingPrice})</div>
                  <div style="margin-bottom: 8px;"><span style="color: #71717a;">Budget:</span> <strong style="color: #34d399;">${budget || "Standard Scope"}</strong></div>
                  <div><span style="color: #71717a;">Brief:</span> <span style="color: #e4e4e7;">${requirements.trim()}</span></div>
                </div>
                <p style="color: #a1a1aa; font-size: 13px; line-height: 1.6;">
                  <strong>Next Steps:</strong> I will evaluate your requirements and respond within 24 hours with an initial scope outline and transparent milestone pricing.
                </p>
                <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.08); margin: 24px 0;" />
                <div style="font-size: 12px; color: #71717a;">
                  Hemant Pandey • Principal Software Architect & Full-Stack Systems Engineer<br />
                  <a href="https://hemantpandey.in" style="color: #6366f1; text-decoration: none;">hemantpandey.in</a>
                </div>
              </div>
            </div>
          `,
        });

        // 2. Send notification to admin/developer
        await resend.emails.send({
          from: fromEmail,
          to: adminEmail,
          subject: `⚡ New Quote Request: ${name.trim()} - ${serviceTitle} (${referenceId})`,
          html: `
            <div style="font-family: monospace; padding: 20px; background: #000; color: #fff;">
              <h2>New Project Quote Request [${referenceId}]</h2>
              <p><strong>Client:</strong> ${name.trim()} &lt;${email.trim()}&gt;</p>
              <p><strong>Service:</strong> ${serviceTitle} (${serviceId})</p>
              <p><strong>Budget:</strong> ${budget}</p>
              <p><strong>Requirements:</strong></p>
              <pre style="background: #111; padding: 12px; border: 1px solid #333; color: #00ffaa; white-space: pre-wrap;">${requirements.trim()}</pre>
            </div>
          `,
        });
      } catch (emailErr) {
        console.warn("Could not dispatch quote email via Resend:", emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      referenceId,
      serviceTitle,
      clientName: name.trim(),
      message:
        "Your project inquiry has been received! I will review your requirements and respond to your email within 24 hours.",
    });
  } catch (error) {
    console.error("Quote submission error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred while processing your quote request. Please try again." },
      { status: 500 }
    );
  }
}
