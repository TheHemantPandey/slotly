import "server-only";
import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

export interface BookingEmailPayload {
  appointmentId: string;
  serviceTitle: string;
  clientName: string;
  clientEmail: string;
  clientNotes?: string;
  startTime: Date | string;
  endTime: Date | string;
  durationMinutes: number;
  feeINR: number;
  timezone?: string;
  customerToken: string;
}

export interface CancellationEmailPayload {
  appointmentId: string;
  serviceTitle: string;
  clientName: string;
  clientEmail: string;
  startTime: Date | string;
  timezone?: string;
  cancellationReason?: string;
}

export interface EmailDeliveryResult {
  success: boolean;
  delivered: boolean;
  id?: string;
  error?: string;
  reason?: "NOT_CONFIGURED" | "DELIVERY_ERROR" | "SUCCESS";
}

export interface SendMailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

/**
 * Returns whether Gmail SMTP credentials (GMAIL_USER and GMAIL_APP_PASSWORD) are configured.
 */
export function isGmailConfigured(): boolean {
  const user = process.env.GMAIL_USER?.trim();
  const pass = process.env.GMAIL_APP_PASSWORD?.trim();
  return Boolean(user && pass);
}

// Backward-compatible aliases
export const isEmailConfigured = isGmailConfigured;
export const isResendConfigured = isGmailConfigured;

let cachedTransporter: Transporter | null = null;

/**
 * Returns a configured Nodemailer Transporter instance for Gmail SMTP.
 * Host: smtp.gmail.com, Port: 465, Secure: true
 */
export function getEmailTransporter(): Transporter | null {
  if (!isGmailConfigured()) {
    return null;
  }

  if (cachedTransporter) {
    return cachedTransporter;
  }

  const user = process.env.GMAIL_USER!.trim();
  const pass = process.env.GMAIL_APP_PASSWORD!.trim();

  cachedTransporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user,
      pass,
    },
  });

  return cachedTransporter;
}

/**
 * Default sender address using GMAIL_USER or custom EMAIL_FROM.
 */
export function getDefaultFromAddress(): string {
  const customFrom = process.env.EMAIL_FROM?.trim() || process.env.GMAIL_FROM?.trim();
  if (customFrom) {
    return customFrom;
  }
  const user = process.env.GMAIL_USER?.trim() || "noreply@gmail.com";
  return `Slotly <${user}>`;
}

/**
 * Reusable server-side email sender via Nodemailer and Gmail SMTP.
 * Failsafe: logs clearly, catches unexpected errors, and returns a structured result without throwing.
 */
export async function sendMail(options: SendMailOptions): Promise<EmailDeliveryResult> {
  const user = process.env.GMAIL_USER?.trim();
  const pass = process.env.GMAIL_APP_PASSWORD?.trim();

  if (!user || !pass) {
    console.log(
      `[Email Notice] GMAIL_USER or GMAIL_APP_PASSWORD is not configured. Email skipped for: ${JSON.stringify(options.to)}`
    );
    return {
      success: true,
      delivered: false,
      reason: "NOT_CONFIGURED",
    };
  }

  const transporter = getEmailTransporter();
  if (!transporter) {
    return {
      success: false,
      delivered: false,
      error: "Nodemailer transporter could not be initialized.",
      reason: "DELIVERY_ERROR",
    };
  }

  const from = options.from || getDefaultFromAddress();

  try {
    const info = await transporter.sendMail({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
    });

    console.log(
      `[Email Delivered] Successfully sent email to ${JSON.stringify(options.to)} (Message ID: ${info.messageId})`
    );

    return {
      success: true,
      delivered: true,
      id: info.messageId,
      reason: "SUCCESS",
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(
      `[Email Exception] Failed to send email to ${JSON.stringify(options.to)}: ${message}`
    );
    return {
      success: false,
      delivered: false,
      error: message,
      reason: "DELIVERY_ERROR",
    };
  }
}

/**
 * Formats a date cleanly in Asia/Kolkata (or specified timezone) for display.
 */
function formatAppointmentTime(dateInput: Date | string, tz = "Asia/Kolkata") {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return formatter.format(date);
}

function getAppBaseUrl(): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (appUrl && appUrl.length > 0) {
    return appUrl.replace(/\/$/, "");
  }
  return "https://slotly.hemantpandey.in";
}

/**
 * Build bespoke Midnight Atelier HTML confirmation email template.
 */
function buildConfirmationHtml(payload: BookingEmailPayload, managementUrl: string): string {
  const tz = payload.timezone || "Asia/Kolkata";
  const formattedStart = formatAppointmentTime(payload.startTime, tz);
  const startTimeObj = typeof payload.startTime === "string" ? new Date(payload.startTime) : payload.startTime;
  const timeOnlyStart = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(startTimeObj);
  const endTimeObj = typeof payload.endTime === "string" ? new Date(payload.endTime) : payload.endTime;
  const timeOnlyEnd = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(endTimeObj);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Slotly Appointment is Confirmed</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #171717;
      color: #F3EEE5;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
    }
    .wrapper {
      width: 100%;
      background-color: #171717;
      padding: 40px 16px;
    }
    .container {
      max-width: 580px;
      margin: 0 auto;
      background-color: #222222;
      border: 1px solid #393633;
      border-radius: 12px;
      overflow: hidden;
    }
    .header {
      padding: 32px 32px 24px;
      background-color: #1c1c1c;
      border-bottom: 1px solid #2e2b28;
    }
    .brand {
      font-size: 20px;
      font-weight: 700;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #F0B35A;
      margin: 0 0 6px 0;
    }
    .tagline {
      font-size: 13px;
      color: #A7A29A;
      margin: 0;
      font-style: italic;
    }
    .content {
      padding: 32px;
    }
    .headline {
      font-size: 22px;
      font-weight: 600;
      color: #F3EEE5;
      margin: 0 0 16px 0;
      line-height: 1.3;
    }
    .intro {
      font-size: 15px;
      color: #D1CCC4;
      margin: 0 0 28px 0;
    }
    .card {
      background-color: #292929;
      border: 1px solid #393633;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 28px;
    }
    .card-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #33312e;
      font-size: 14px;
    }
    .card-row:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
    .label {
      color: #A7A29A;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .value {
      color: #F3EEE5;
      font-weight: 500;
      text-align: right;
    }
    .highlight {
      color: #F0B35A;
      font-weight: 600;
    }
    .cta-container {
      text-align: center;
      margin: 32px 0 24px;
    }
    .btn {
      display: inline-block;
      background-color: #F0B35A;
      color: #171717 !important;
      font-weight: 600;
      font-size: 15px;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 8px;
      letter-spacing: 0.02em;
    }
    .security-note {
      font-size: 12px;
      color: #8C867E;
      line-height: 1.5;
      text-align: center;
      margin: 20px 0 0;
    }
    .footer {
      padding: 24px 32px;
      background-color: #1c1c1c;
      border-top: 1px solid #2e2b28;
      text-align: center;
      font-size: 12px;
      color: #7A756D;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1 class="brand">SLOTLY</h1>
        <p class="tagline">Your time, intentionally spent.</p>
      </div>
      <div class="content">
        <h2 class="headline">Consultation Confirmed</h2>
        <p class="intro">
          Hello <strong>${escapeHtml(payload.clientName)}</strong>, your consultation appointment has been scheduled and confirmed in our calendar.
        </p>

        <div class="card">
          <table width="100%" cellpadding="6" cellspacing="0" style="border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #33312e;">
              <td style="color: #A7A29A; font-size: 13px; text-transform: uppercase;">Practice</td>
              <td style="color: #F0B35A; font-weight: 600; text-align: right; font-size: 14px;">${escapeHtml(payload.serviceTitle)}</td>
            </tr>
            <tr style="border-bottom: 1px solid #33312e;">
              <td style="color: #A7A29A; font-size: 13px; text-transform: uppercase;">Date & Time</td>
              <td style="color: #F3EEE5; font-weight: 500; text-align: right; font-size: 14px;">
                ${escapeHtml(formattedStart)}<br>
                <span style="color: #A7A29A; font-size: 12px;">(${escapeHtml(timeOnlyStart)} – ${escapeHtml(timeOnlyEnd)} ${escapeHtml(tz)})</span>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #33312e;">
              <td style="color: #A7A29A; font-size: 13px; text-transform: uppercase;">Duration</td>
              <td style="color: #F3EEE5; font-weight: 500; text-align: right; font-size: 14px;">${payload.durationMinutes} minutes</td>
            </tr>
            <tr style="border-bottom: 1px solid #33312e;">
              <td style="color: #A7A29A; font-size: 13px; text-transform: uppercase;">Investment</td>
              <td style="color: #F3EEE5; font-weight: 500; text-align: right; font-size: 14px;">₹${payload.feeINR.toLocaleString("en-IN")}</td>
            </tr>
            ${
              payload.clientNotes
                ? `<tr>
              <td style="color: #A7A29A; font-size: 13px; text-transform: uppercase; vertical-align: top;">Notes</td>
              <td style="color: #D1CCC4; font-size: 13px; text-align: right;">${escapeHtml(payload.clientNotes)}</td>
            </tr>`
                : ""
            }
          </table>
        </div>

        <div class="cta-container">
          <a href="${managementUrl}" class="btn" target="_blank" rel="noopener noreferrer">
            Manage or Reschedule Appointment
          </a>
        </div>

        <p class="security-note">
          Keep this email private. The link above contains your confidential booking token. You can use it anytime to view details, add to your calendar, or manage your reservation.
        </p>
      </div>

      <div class="footer">
        &copy; ${new Date().getFullYear()} Slotly Atelier · Professional Consulting Advisory<br>
        Direct management link: <a href="${managementUrl}" style="color: #A7A29A; text-decoration: underline;">${managementUrl}</a>
      </div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Plain-text fallback for terminal, accessible, or text-only clients.
 */
function buildConfirmationText(payload: BookingEmailPayload, managementUrl: string): string {
  const tz = payload.timezone || "Asia/Kolkata";
  const formattedStart = formatAppointmentTime(payload.startTime, tz);

  return `SLOTLY — Your time, intentionally spent.
==================================================

APPOINTMENT CONFIRMED

Hello ${payload.clientName},

Your consultation appointment has been confirmed in our calendar:

• Practice:  ${payload.serviceTitle}
• Date/Time: ${formattedStart} (${tz})
• Duration:  ${payload.durationMinutes} minutes
• Fee:       ₹${payload.feeINR.toLocaleString("en-IN")}
${payload.clientNotes ? `• Notes:     ${payload.clientNotes}\n` : ""}
MANAGE YOUR APPOINTMENT:
${managementUrl}

Keep this link private; it provides direct access to manage or reschedule your reservation.

Best regards,
Slotly Atelier
https://slotly.hemantpandey.in
`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Send booking confirmation email via Nodemailer and Gmail SMTP.
 * Fully failsafe: If GMAIL_USER/GMAIL_APP_PASSWORD is not configured or if sending fails,
 * this function catches it gracefully, logs a clear message, and never throws.
 */
export async function sendBookingConfirmationEmail(
  payload: BookingEmailPayload
): Promise<EmailDeliveryResult> {
  const appUrl = getAppBaseUrl();
  const managementUrl = `${appUrl}/my-booking/${payload.customerToken}`;
  const html = buildConfirmationHtml(payload, managementUrl);
  const text = buildConfirmationText(payload, managementUrl);

  return sendMail({
    to: payload.clientEmail,
    subject: `Confirmed: ${payload.serviceTitle} with Slotly`,
    html,
    text,
  });
}

/**
 * Send cancellation email via Nodemailer and Gmail SMTP (optional notification).
 * Also completely failsafe and non-blocking.
 */
export async function sendBookingCancellationEmail(
  payload: CancellationEmailPayload
): Promise<EmailDeliveryResult> {
  const tz = payload.timezone || "Asia/Kolkata";
  const formattedStart = formatAppointmentTime(payload.startTime, tz);

  return sendMail({
    to: payload.clientEmail,
    subject: `Cancelled: ${payload.serviceTitle} appointment with Slotly`,
    text: `Hello ${payload.clientName},\n\nYour appointment for "${payload.serviceTitle}" scheduled on ${formattedStart} (${tz}) has been cancelled.\n\n${
      payload.cancellationReason
        ? `Reason: ${payload.cancellationReason}\n\n`
        : ""
    }If this was unintentional, you may book a new slot anytime at ${getAppBaseUrl()}.\n\nSlotly Atelier`,
  });
}
