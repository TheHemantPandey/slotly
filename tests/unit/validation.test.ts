import { describe, it, expect } from "vitest";
import {
  createAppointmentSchema,
  cancelAppointmentSchema,
  adminLoginSchema,
} from "@/lib/server/validation";

describe("Booking & Appointment Validation Schemas", () => {
  const getFutureIso = (daysAhead = 7) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString();
  };

  describe("createAppointmentSchema", () => {
    it("successfully validates a complete, valid booking payload", () => {
      const validPayload = {
        serviceId: "business-websites-landing-pages",
        clientName: "Aarav Sharma",
        clientEmail: "aarav@example.com",
        clientNotes: "Need a high-converting landing page.",
        startTime: getFutureIso(5),
        timezone: "Asia/Kolkata",
      };

      const result = createAppointmentSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.clientName).toBe("Aarav Sharma");
        expect(result.data.clientEmail).toBe("aarav@example.com");
        expect(result.data.timezone).toBe("Asia/Kolkata");
      }
    });

    it("applies default timezone 'Asia/Kolkata' when omitted", () => {
      const payloadWithoutTz = {
        serviceId: "custom-web-apps-dashboards",
        clientName: "Priya Patel",
        clientEmail: "priya@example.com",
        startTime: getFutureIso(3),
      };

      const result = createAppointmentSchema.safeParse(payloadWithoutTz);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.timezone).toBe("Asia/Kolkata");
      }
    });

    it("rejects an appointment start time in the past", () => {
      const pastPayload = {
        serviceId: "business-websites-landing-pages",
        clientName: "Test User",
        clientEmail: "test@example.com",
        startTime: "2020-01-01T10:00:00.000Z",
      };

      const result = createAppointmentSchema.safeParse(pastPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorMessages = result.error.errors.map((e) => e.message);
        expect(errorMessages).toContain("Appointment start time must be in the future.");
      }
    });

    it("rejects an invalid email format", () => {
      const invalidEmailPayload = {
        serviceId: "ai-chatbots-automation",
        clientName: "John Doe",
        clientEmail: "not-an-email",
        startTime: getFutureIso(2),
      };

      const result = createAppointmentSchema.safeParse(invalidEmailPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        const emailErrors = result.error.errors.filter((e) => e.path.includes("clientEmail"));
        expect(emailErrors.length).toBeGreaterThan(0);
      }
    });

    it("rejects client name shorter than 2 characters", () => {
      const shortNamePayload = {
        serviceId: "business-websites-landing-pages",
        clientName: "J",
        clientEmail: "valid@example.com",
        startTime: getFutureIso(2),
      };

      const result = createAppointmentSchema.safeParse(shortNamePayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        const nameErrors = result.error.errors.filter((e) => e.path.includes("clientName"));
        expect(nameErrors[0].message).toBe("Client name must be at least 2 characters.");
      }
    });

    it("rejects invalid serviceId characters", () => {
      const invalidSlugPayload = {
        serviceId: "INVALID SLUG with spaces!",
        clientName: "Valid Name",
        clientEmail: "valid@example.com",
        startTime: getFutureIso(2),
      };

      const result = createAppointmentSchema.safeParse(invalidSlugPayload);
      expect(result.success).toBe(false);
    });
  });

  describe("cancelAppointmentSchema", () => {
    it("accepts valid cancellation payload with token", () => {
      const payload = {
        cancellationToken: "sec_tok_1234567890abcdef",
        reason: "Scheduling conflict resolved.",
      };

      const result = cancelAppointmentSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it("rejects cancellation without token", () => {
      const result = cancelAppointmentSchema.safeParse({ reason: "Forgot reason" });
      expect(result.success).toBe(false);
    });
  });

  describe("adminLoginSchema", () => {
    it("validates proper email and password", () => {
      const result = adminLoginSchema.safeParse({
        email: "admin@slotly.test",
        password: "SecretPassword123!",
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty password", () => {
      const result = adminLoginSchema.safeParse({
        email: "admin@slotly.test",
        password: "",
      });
      expect(result.success).toBe(false);
    });
  });
});
