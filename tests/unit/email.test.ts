import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("nodemailer", () => {
  const sendMailMock = vi.fn().mockResolvedValue({ messageId: "mock-message-id-123" });
  return {
    default: {
      createTransport: vi.fn().mockReturnValue({
        sendMail: sendMailMock,
      }),
    },
  };
});

// Import after mocking
import nodemailer from "nodemailer";
import {
  isGmailConfigured,
  isEmailConfigured,
  sendMail,
  sendBookingConfirmationEmail,
  sendBookingCancellationEmail,
  getDefaultFromAddress,
} from "@/lib/server/email";

describe("Nodemailer Gmail SMTP Email Utility", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("reports unconfigured when GMAIL_USER or GMAIL_APP_PASSWORD is missing", () => {
    delete process.env.GMAIL_USER;
    delete process.env.GMAIL_APP_PASSWORD;

    expect(isGmailConfigured()).toBe(false);
    expect(isEmailConfigured()).toBe(false);
  });

  it("reports configured when both GMAIL_USER and GMAIL_APP_PASSWORD are set", () => {
    process.env.GMAIL_USER = "test@gmail.com";
    process.env.GMAIL_APP_PASSWORD = "abcd efgh ijkl mnop";

    expect(isGmailConfigured()).toBe(true);
    expect(isEmailConfigured()).toBe(true);
  });

  it("falls back gracefully without throwing when credentials are not configured", async () => {
    delete process.env.GMAIL_USER;
    delete process.env.GMAIL_APP_PASSWORD;

    const result = await sendMail({
      to: "recipient@example.com",
      subject: "Test Subject",
      text: "Test content",
    });

    expect(result.success).toBe(true);
    expect(result.delivered).toBe(false);
    expect(result.reason).toBe("NOT_CONFIGURED");
  });

  it("sends email via Nodemailer Gmail SMTP on port 465 when configured", async () => {
    process.env.GMAIL_USER = "developer@gmail.com";
    process.env.GMAIL_APP_PASSWORD = "secretapppassword";

    const result = await sendMail({
      to: "client@example.com",
      subject: "Meeting Confirmation",
      text: "Hello Client",
      html: "<p>Hello Client</p>",
    });

    expect(result.success).toBe(true);
    expect(result.delivered).toBe(true);
    expect(result.id).toBe("mock-message-id-123");
    expect(result.reason).toBe("SUCCESS");

    expect(nodemailer.createTransport).toHaveBeenCalledWith(
      expect.objectContaining({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "developer@gmail.com",
          pass: "secretapppassword",
        },
      })
    );
  });

  it("dispatches booking confirmation email with structured payload", async () => {
    process.env.GMAIL_USER = "developer@gmail.com";
    process.env.GMAIL_APP_PASSWORD = "secretapppassword";

    const result = await sendBookingConfirmationEmail({
      appointmentId: "apt-123",
      serviceTitle: "Full-Stack Web Application",
      clientName: "Jane Doe",
      clientEmail: "jane@example.com",
      startTime: new Date("2026-11-01T10:00:00Z"),
      endTime: new Date("2026-11-01T10:20:00Z"),
      durationMinutes: 20,
      feeINR: 14999,
      timezone: "Asia/Kolkata",
      customerToken: "tok-abc-456",
    });

    expect(result.success).toBe(true);
    expect(result.delivered).toBe(true);
    expect(result.id).toBe("mock-message-id-123");
  });

  it("dispatches booking cancellation email with structured payload", async () => {
    process.env.GMAIL_USER = "developer@gmail.com";
    process.env.GMAIL_APP_PASSWORD = "secretapppassword";

    const result = await sendBookingCancellationEmail({
      appointmentId: "apt-123",
      serviceTitle: "Full-Stack Web Application",
      clientName: "Jane Doe",
      clientEmail: "jane@example.com",
      startTime: new Date("2026-11-01T10:00:00Z"),
      timezone: "Asia/Kolkata",
      cancellationReason: "Rescheduling needed",
    });

    expect(result.success).toBe(true);
    expect(result.delivered).toBe(true);
  });

  it("formats default from address using GMAIL_USER", () => {
    process.env.GMAIL_USER = "myuser@gmail.com";
    delete process.env.EMAIL_FROM;

    expect(getDefaultFromAddress()).toBe("Slotly <myuser@gmail.com>");
  });
});
