import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET as getServicesHandler } from "@/app/api/services/route";
import { GET as getAvailabilityHandler } from "@/app/api/availability/route";
import {
  GET as getAppointmentsHandler,
  POST as postAppointmentsHandler,
} from "@/app/api/appointments/route";
import { GET as getCustomerBookingHandler } from "@/app/api/customer/booking/route";
import { POST as cancelCustomerBookingHandler } from "@/app/api/customer/cancel/route";
import {
  SchedulingConflictError,
  ServiceInactiveError,
  AppointmentNotFoundError,
} from "@/lib/server/appointments-repository";
import { listActiveServices } from "@/lib/server/services-repository";
import {
  createPersistedAppointment,
  getPersistedAppointmentByToken,
  computeAvailableSlots,
  cancelPersistedAppointment,
} from "@/lib/server/appointments-repository";
import { createAppointmentSchema } from "@/lib/server/validation";

// Mock server repositories and email dispatcher to prevent network calls and production DB touches
vi.mock("@/lib/server/services-repository", () => ({
  listActiveServices: vi.fn(),
  getServiceById: vi.fn(),
}));

vi.mock("@/lib/server/appointments-repository", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/server/appointments-repository")>();
  return {
    ...actual,
    createPersistedAppointment: vi.fn(),
    getPersistedAppointmentByToken: vi.fn(),
    listPersistedAppointments: vi.fn(),
    computeAvailableSlots: vi.fn(),
    cancelPersistedAppointment: vi.fn(),
  };
});

vi.mock("@/lib/server/email", () => ({
  sendBookingConfirmationEmail: vi.fn().mockResolvedValue({ success: true }),
  sendBookingCancellationEmail: vi.fn().mockResolvedValue({ success: true }),
  sendMail: vi.fn().mockResolvedValue({ success: true, delivered: true }),
  isEmailConfigured: vi.fn().mockReturnValue(true),
  isGmailConfigured: vi.fn().mockReturnValue(true),
  isResendConfigured: vi.fn().mockReturnValue(true),
}));

describe("Slotly API Routes Integration Tests", () => {
  const BASE_URL = "http://localhost:3000";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const getFutureIso = (daysAhead = 7) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString();
  };

  // ---------------------------------------------------------------------------
  // 1. GET /api/services
  // ---------------------------------------------------------------------------
  describe("GET /api/services", () => {
    it("returns 200 with formatted active services and calculated pricing", async () => {
      vi.mocked(listActiveServices).mockResolvedValue([
        {
          id: "business-websites-landing-pages",
          slug: "business-websites-landing-pages",
          name: "Business Websites & Landing Pages",
          tagline: "High-performance websites",
          description: "Full service development",
          durationMinutes: 20,
          priceInPaise: 960000,
          currency: "INR",
          category: "Websites",
          deliverables: ["Bespoke design", "SEO setup"],
          idealFor: "Consultants and founders",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const res = await getServicesHandler();
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.services.length).toBe(1);
      expect(json.services[0].title).toBe("Business Websites & Landing Pages");
      expect(json.services[0].feeINR).toBe(9600);
      expect(json.services[0].standardFeeINR).toBe(12000);
    });
  });

  // ---------------------------------------------------------------------------
  // 2. GET /api/availability
  // ---------------------------------------------------------------------------
  describe("GET /api/availability", () => {
    it("returns 400 if serviceId query parameter is missing", async () => {
      const req = new NextRequest(`${BASE_URL}/api/availability?date=2026-11-15`);
      const res = await getAvailabilityHandler(req);
      expect(res.status).toBe(400);

      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error).toContain("serviceId");
    });

    it("returns 400 if date parameter is missing or invalid format", async () => {
      const req = new NextRequest(
        `${BASE_URL}/api/availability?serviceId=business-websites-landing-pages&date=invalid-date`
      );
      const res = await getAvailabilityHandler(req);
      expect(res.status).toBe(400);

      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error).toContain("YYYY-MM-DD");
    });

    it("returns 404 when requested service is inactive or not found", async () => {
      vi.mocked(computeAvailableSlots).mockRejectedValue(new ServiceInactiveError());

      const req = new NextRequest(
        `${BASE_URL}/api/availability?serviceId=inactive-service&date=2026-11-15`
      );
      const res = await getAvailabilityHandler(req);
      expect(res.status).toBe(404);

      const json = await res.json();
      expect(json.success).toBe(false);
    });

    it("returns 200 with available slots on valid service and date", async () => {
      vi.mocked(computeAvailableSlots).mockResolvedValue({
        service: {
          id: "business-websites-landing-pages",
          name: "Business Websites & Landing Pages",
          durationMinutes: 20,
          priceInPaise: 960000,
        },
        date: "2026-11-15",
        slots: [
          {
            id: "slot-1",
            startTime: "2026-11-15T04:30:00.000Z",
            endTime: "2026-11-15T04:50:00.000Z",
            displayTime: "10:00 AM",
            displayRange: "10:00 AM - 10:20 AM",
            available: true,
          },
        ],
      });

      const req = new NextRequest(
        `${BASE_URL}/api/availability?serviceId=business-websites-landing-pages&date=2026-11-15`
      );
      const res = await getAvailabilityHandler(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.slots.length).toBe(1);
      expect(json.slots[0].available).toBe(true);
    });
  });

  // ---------------------------------------------------------------------------
  // 3. POST /api/appointments
  // ---------------------------------------------------------------------------
  describe("POST /api/appointments", () => {
    it("returns 400 when input validation fails (e.g. invalid email, past date)", async () => {
      vi.mocked(createPersistedAppointment).mockImplementation(async (input) => {
        createAppointmentSchema.parse(input);
        return {} as unknown as Awaited<ReturnType<typeof createPersistedAppointment>>;
      });

      const req = new NextRequest(`${BASE_URL}/api/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: "business-websites-landing-pages",
          clientName: "J", // Too short (min 2)
          clientEmail: "invalid-email-address",
          startTime: "2020-01-01T10:00:00.000Z", // Past date
        }),
      });

      const res = await postAppointmentsHandler(req);
      expect(res.status).toBe(400);

      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error).toBe("Validation failed.");
      expect(json.details.length).toBeGreaterThan(0);
    });

    it("returns 409 Conflict when the slot is simultaneously taken by another client", async () => {
      vi.mocked(createPersistedAppointment).mockRejectedValue(new SchedulingConflictError());

      const req = new NextRequest(`${BASE_URL}/api/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: "business-websites-landing-pages",
          clientName: "Rohan V",
          clientEmail: "rohan@example.com",
          startTime: getFutureIso(10),
          timezone: "Asia/Kolkata",
        }),
      });

      const res = await postAppointmentsHandler(req);
      expect(res.status).toBe(409);

      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error).toContain("This consultation window was just booked by another client");
    });

    it("returns 404 when requested service does not exist or is inactive", async () => {
      vi.mocked(createPersistedAppointment).mockRejectedValue(new ServiceInactiveError());

      const req = new NextRequest(`${BASE_URL}/api/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: "non-existent-service",
          clientName: "Rohan V",
          clientEmail: "rohan@example.com",
          startTime: getFutureIso(10),
          timezone: "Asia/Kolkata",
        }),
      });

      const res = await postAppointmentsHandler(req);
      expect(res.status).toBe(404);
    });

    it("returns 201 Created with private customerToken and management URL on successful booking", async () => {
      const mockCreatedDate = new Date();
      const mockStartDate = new Date(Date.now() + 86400000);
      const mockEndDate = new Date(mockStartDate.getTime() + 20 * 60 * 1000);

      vi.mocked(createPersistedAppointment).mockResolvedValue({
        id: "apt_test_123",
        serviceId: "business-websites-landing-pages",
        clientName: "Rohan Verma",
        clientEmail: "rohan@example.com",
        clientNotes: "Project intake",
        startTime: mockStartDate,
        endTime: mockEndDate,
        timezone: "Asia/Kolkata",
        feeInPaise: 960000,
        currency: "INR",
        status: "PENDING_INTAKE",
        cancellationToken: null,
        cancellationTokenHash: "hash_secret",
        cancellationReason: null,
        cancelledAt: null,
        createdAt: mockCreatedDate,
        updatedAt: mockCreatedDate,
        customerToken: "customer_secret_token_abcdef123456",
        service: {
          id: "business-websites-landing-pages",
          slug: "business-websites-landing-pages",
          name: "Business Websites & Landing Pages",
          tagline: "High-performance websites",
          description: "Full service development",
          durationMinutes: 20,
          priceInPaise: 960000,
          currency: "INR",
          category: "Websites",
          deliverables: ["Responsive design"],
          idealFor: "Consultants",
          isActive: true,
          createdAt: mockCreatedDate,
          updatedAt: mockCreatedDate,
        },
      });

      const req = new NextRequest(`${BASE_URL}/api/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: "business-websites-landing-pages",
          clientName: "Rohan Verma",
          clientEmail: "rohan@example.com",
          startTime: getFutureIso(3),
          timezone: "Asia/Kolkata",
        }),
      });

      const res = await postAppointmentsHandler(req);
      expect(res.status).toBe(201);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.customerToken).toBe("customer_secret_token_abcdef123456");
      expect(json.managementUrl).toBe("/my-booking/customer_secret_token_abcdef123456");
      expect(json.appointment.id).toBe("apt_test_123");
      expect(json.appointment.feeINR).toBe(9600);
    });
  });

  // ---------------------------------------------------------------------------
  // 4. GET /api/appointments (Privacy Boundary)
  // ---------------------------------------------------------------------------
  describe("GET /api/appointments Privacy Boundary", () => {
    it("returns 403 Forbidden to anonymous public requests", async () => {
      const req = new NextRequest(`${BASE_URL}/api/appointments`);
      const res = await getAppointmentsHandler(req);
      expect(res.status).toBe(403);

      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error).toContain("restricted for privacy");
    });

    it("returns 200 with single appointment when authorized by customer token", async () => {
      const mockDate = new Date();
      vi.mocked(getPersistedAppointmentByToken).mockResolvedValue({
        id: "apt_test_123",
        serviceId: "business-websites-landing-pages",
        clientName: "Rohan Verma",
        clientEmail: "rohan@example.com",
        clientNotes: "Notes",
        startTime: mockDate,
        endTime: mockDate,
        timezone: "Asia/Kolkata",
        feeInPaise: 960000,
        currency: "INR",
        status: "CONFIRMED",
        cancellationToken: null,
        cancellationTokenHash: "hash",
        cancellationReason: null,
        cancelledAt: null,
        createdAt: mockDate,
        updatedAt: mockDate,
        service: {
          id: "business-websites-landing-pages",
          slug: "business-websites-landing-pages",
          name: "Business Websites & Landing Pages",
          tagline: "Tagline",
          description: "Desc",
          durationMinutes: 20,
          priceInPaise: 960000,
          currency: "INR",
          category: "Websites",
          deliverables: [],
          idealFor: null,
          isActive: true,
          createdAt: mockDate,
          updatedAt: mockDate,
        },
      });

      const req = new NextRequest(`${BASE_URL}/api/appointments`, {
        headers: { "x-booking-token": "valid_token_123" },
      });
      const res = await getAppointmentsHandler(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.appointment.id).toBe("apt_test_123");
      expect(json.appointment.cancellationTokenHash).toBeUndefined();
    });
  });

  // ---------------------------------------------------------------------------
  // 5. GET /api/customer/booking (Ownership & Permissions)
  // ---------------------------------------------------------------------------
  describe("GET /api/customer/booking", () => {
    it("returns 400 when access token credential is not provided", async () => {
      const req = new NextRequest(`${BASE_URL}/api/customer/booking`);
      const res = await getCustomerBookingHandler(req);
      expect(res.status).toBe(400);

      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error).toContain("Access credential required");
    });

    it("returns 404 when access token is invalid or does not match any booking", async () => {
      vi.mocked(getPersistedAppointmentByToken).mockResolvedValue(null);

      const req = new NextRequest(`${BASE_URL}/api/customer/booking`, {
        headers: { "x-booking-token": "non_existent_token" },
      });
      const res = await getCustomerBookingHandler(req);
      expect(res.status).toBe(404);

      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error).toContain("Booking record not found");
    });

    it("returns 200 with sanitized customer booking view when token matches", async () => {
      const mockDate = new Date();
      vi.mocked(getPersistedAppointmentByToken).mockResolvedValue({
        id: "apt_cust_456",
        serviceId: "custom-web-apps-dashboards",
        clientName: "Ananya Deshmukh",
        clientEmail: "ananya@example.com",
        clientNotes: "Intake",
        startTime: mockDate,
        endTime: mockDate,
        timezone: "Asia/Kolkata",
        feeInPaise: 2800000,
        currency: "INR",
        status: "CONFIRMED",
        cancellationToken: null,
        cancellationTokenHash: "secret_hash",
        cancellationReason: null,
        cancelledAt: null,
        createdAt: mockDate,
        updatedAt: mockDate,
        service: {
          id: "custom-web-apps-dashboards",
          slug: "custom-web-apps-dashboards",
          name: "Custom Web Applications & Dashboards",
          tagline: "Tagline",
          description: "Desc",
          durationMinutes: 20,
          priceInPaise: 2800000,
          currency: "INR",
          category: "Web Applications",
          deliverables: [],
          idealFor: null,
          isActive: true,
          createdAt: mockDate,
          updatedAt: mockDate,
        },
      });

      const req = new NextRequest(`${BASE_URL}/api/customer/booking`, {
        headers: { "x-booking-token": "valid_customer_token_456" },
      });
      const res = await getCustomerBookingHandler(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.appointment.id).toBe("apt_cust_456");
      expect(json.appointment.feeINR).toBe(28000);
      expect(json.appointment.cancellationTokenHash).toBeUndefined();
    });
  });

  // ---------------------------------------------------------------------------
  // 6. POST /api/customer/cancel (Cancellation Permissions)
  // ---------------------------------------------------------------------------
  describe("POST /api/customer/cancel", () => {
    it("returns 400 when cancellation token is missing", async () => {
      const req = new NextRequest(`${BASE_URL}/api/customer/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Scheduling conflict" }),
      });

      const res = await cancelCustomerBookingHandler(req);
      expect(res.status).toBe(400);

      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error).toContain("Cancellation credential is required");
    });

    it("returns 404 when cancellation token does not match an active appointment", async () => {
      vi.mocked(cancelPersistedAppointment).mockRejectedValue(new AppointmentNotFoundError());

      const req = new NextRequest(`${BASE_URL}/api/customer/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-booking-token": "invalid_cancel_token",
        },
        body: JSON.stringify({ reason: "No longer needed" }),
      });

      const res = await cancelCustomerBookingHandler(req);
      expect(res.status).toBe(404);

      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error).toContain("Booking record not found or access credential is invalid");
    });

    it("returns 200 with cancelled status when cancellation succeeds", async () => {
      const mockDate = new Date();
      vi.mocked(cancelPersistedAppointment).mockResolvedValue({
        id: "apt_cancel_789",
        serviceId: "business-websites-landing-pages",
        clientName: "Test Client",
        clientEmail: "client@example.com",
        clientNotes: null,
        startTime: mockDate,
        endTime: mockDate,
        timezone: "Asia/Kolkata",
        feeInPaise: 960000,
        currency: "INR",
        status: "CANCELLED",
        cancellationToken: null,
        cancellationTokenHash: "hash",
        cancellationReason: "Client requested reschedule",
        cancelledAt: mockDate,
        createdAt: mockDate,
        updatedAt: mockDate,
        service: {
          id: "business-websites-landing-pages",
          slug: "business-websites-landing-pages",
          name: "Business Websites & Landing Pages",
          tagline: "Tagline",
          description: "Desc",
          durationMinutes: 20,
          priceInPaise: 960000,
          currency: "INR",
          category: "Websites",
          deliverables: [],
          idealFor: null,
          isActive: true,
          createdAt: mockDate,
          updatedAt: mockDate,
        },
      });

      const req = new NextRequest(`${BASE_URL}/api/customer/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-booking-token": "valid_cancel_token",
        },
        body: JSON.stringify({ reason: "Client requested reschedule" }),
      });

      const res = await cancelCustomerBookingHandler(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.appointment.status).toBe("CANCELLED");
      expect(json.appointment.cancellationReason).toBe("Client requested reschedule");
    });
  });
});
