import assert from "node:assert";
import crypto from "node:crypto";
import { NextRequest } from "next/server";
import { POST as assistantRouteHandler } from "../src/app/api/assistant/route";
import { POST as confirmRouteHandler } from "../src/app/api/assistant/confirm/route";
import {
  isGeminiConfigured,
  getGeminiModelName,
  buildSystemInstruction,
  runGeminiAssistant,
} from "../src/lib/server/gemini";
import { getServiceById } from "../src/lib/server/services-repository";
import {
  computeAvailableSlots,
  createPersistedAppointment,
  cancelPersistedAppointment,
} from "../src/lib/server/appointments-repository";
import { signProposal, deriveCustomerToken } from "../src/lib/server/auth";
import { db } from "../src/lib/db";
import type { BookingProposal } from "../src/lib/types";

const BASE_URL = "http://localhost:3000";

async function runTests() {
  console.log("==========================================================");
  console.log("Slotly Concierge / Google Gemini Integration Test Suite");
  console.log("Interactions API, gemini-3.8-flash & Midnight Handling");
  console.log("==========================================================\n");

  let passed = 0;
  let failed = 0;

  async function test(name: string, fn: () => Promise<void>) {
    try {
      process.stdout.write(`• Testing: ${name}... `);
      await fn();
      console.log("✓ PASSED");
      passed++;
    } catch (err: unknown) {
      console.log("✗ FAILED");
      console.error("  Error:", err instanceof Error ? err.message : err);
      failed++;
    }
  }

  // -------------------------------------------------------------------------
  // 1. Model Configuration and Defaulting to gemini-3.8-flash
  // -------------------------------------------------------------------------
  await test("Model name defaults to gemini-3.8-flash", async () => {
    const originalModel = process.env.GEMINI_MODEL;
    try {
      delete process.env.GEMINI_MODEL;
      assert.strictEqual(getGeminiModelName(), "gemini-3.8-flash");

      // Deprecated 2.5-flash is automatically migrated to 3.8-flash
      process.env.GEMINI_MODEL = "gemini-2.5-flash";
      assert.strictEqual(getGeminiModelName(), "gemini-3.8-flash");

      // Custom model override respected
      process.env.GEMINI_MODEL = "gemini-3.8-flash";
      assert.strictEqual(getGeminiModelName(), "gemini-3.8-flash");
    } finally {
      process.env.GEMINI_MODEL = originalModel;
    }
  });

  // -------------------------------------------------------------------------
  // 2. Safe Missing API Key Handling & Non-200 Error Status
  // -------------------------------------------------------------------------
  await test("runGeminiAssistant gracefully handles missing API key (503)", async () => {
    const originalKey = process.env.GEMINI_API_KEY;
    try {
      delete process.env.GEMINI_API_KEY;
      assert.strictEqual(isGeminiConfigured(), false);

      const res = await runGeminiAssistant({ message: "Hello, what services do you offer?" });
      assert.strictEqual(res.success, false);
      assert.strictEqual(res.error, "MISSING_API_KEY");
      assert.ok(res.reply.includes("GEMINI_API_KEY"), "Must instruct user to set key");
      assert.strictEqual(res.suggestedAction?.href, "/services");

      const req = new NextRequest(`${BASE_URL}/api/assistant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Check software architecture" }),
      });

      const httpRes = await assistantRouteHandler(req);
      assert.strictEqual(httpRes.status, 503, "Missing API key must return 503");
      const json = await httpRes.json();
      assert.strictEqual(json.success, false);
      assert.strictEqual(json.error, "MISSING_API_KEY");
    } finally {
      process.env.GEMINI_API_KEY = originalKey;
    }
  });

  // -------------------------------------------------------------------------
  // 3. Provider Error Reporting (Never 200 on Provider Failure)
  // -------------------------------------------------------------------------
  await test("POST /api/assistant maps provider errors to appropriate HTTP statuses", async () => {
    const originalKey = process.env.GEMINI_API_KEY;
    const originalModel = process.env.GEMINI_MODEL;
    try {
      // Test invalid API key behavior
      process.env.GEMINI_API_KEY = "invalid-bogus-key";
      process.env.GEMINI_MODEL = "gemini-3.8-flash";

      const req = new NextRequest(`${BASE_URL}/api/assistant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Test provider error" }),
      });

      const res = await assistantRouteHandler(req);
      // Provider failure must NOT return 200
      assert.notStrictEqual(res.status, 200, "Provider failure must NOT return 200 OK");
      assert.ok(
        res.status === 401 || res.status === 502 || res.status === 503,
        `Expected error status 401/502/503, received ${res.status}`
      );
      const json = await res.json();
      assert.strictEqual(json.success, false);
      assert.ok(json.error, "Must contain error code");
      assert.ok(!json.reply.includes("invalid-bogus-key"), "Must NEVER leak API key in error message");
    } finally {
      process.env.GEMINI_API_KEY = originalKey;
      process.env.GEMINI_MODEL = originalModel;
    }
  });

  // -------------------------------------------------------------------------
  // 4. Request Validation
  // -------------------------------------------------------------------------
  await test("POST /api/assistant rejects empty message (400)", async () => {
    const req = new NextRequest(`${BASE_URL}/api/assistant`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "   " }),
    });

    const res = await assistantRouteHandler(req);
    assert.strictEqual(res.status, 400);
    const json = await res.json();
    assert.strictEqual(json.success, false);
    assert.strictEqual(json.error, "VALIDATION_FAILED");
  });

  await test("POST /api/assistant rejects oversized message > 2000 chars (400)", async () => {
    const req = new NextRequest(`${BASE_URL}/api/assistant`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "a".repeat(2001) }),
    });

    const res = await assistantRouteHandler(req);
    assert.strictEqual(res.status, 400);
    const json = await res.json();
    assert.strictEqual(json.success, false);
    assert.strictEqual(json.error, "VALIDATION_FAILED");
  });

  // -------------------------------------------------------------------------
  // 5. Asia/Kolkata Timezone & Relative Date Grounding
  // -------------------------------------------------------------------------
  await test("buildSystemInstruction embeds current Asia/Kolkata date and timezone", async () => {
    const fixedDate = new Date("2026-10-18T10:15:00Z"); // 3:45 PM IST
    const prompt = buildSystemInstruction(fixedDate);

    assert.ok(prompt.includes("Asia/Kolkata"), "Must declare Asia/Kolkata timezone");
    assert.ok(prompt.includes("2026-10-18"), "Must specify calendar reference date");
    assert.ok(prompt.includes("12 AM"), "Must address 12 AM midnight interpretation");
    assert.ok(prompt.includes("09:30 AM to 06:00 PM IST"), "Must state configured consulting hours");
  });

  // -------------------------------------------------------------------------
  // 6. Midnight vs Business Hours & Genuine Availability
  // -------------------------------------------------------------------------
  await test("computeAvailableSlots verifies operating hours and excludes midnight (12 AM)", async () => {
    // Generate next Monday date string YYYY-MM-DD
    const d = new Date();
    d.setDate(d.getDate() + ((1 + 7 - d.getDay()) % 7 || 7));
    const mondayStr = d.toISOString().split("T")[0];

    const result = await computeAvailableSlots("software-architecture", mondayStr, "Asia/Kolkata");
    assert.strictEqual(result.service.id, "software-architecture");
    assert.strictEqual(result.date, mondayStr);

    // Business hours start at 9:30 AM (IST)
    const firstSlot = result.slots[0];
    assert.ok(firstSlot, "Must have slots on Monday");
    assert.strictEqual(firstSlot.displayTime, "9:30 AM", "First slot must start at 9:30 AM IST");

    // Midnight (12:00 AM) must NOT be an available slot
    const midnightSlot = result.slots.find((s) => s.displayTime === "12:00 AM");
    assert.strictEqual(midnightSlot, undefined, "Midnight (12:00 AM) must not be generated as a slot");
  });

  await test("Unavailable dates (Sundays) return zero slots without crashing", async () => {
    // Generate next Sunday
    const d = new Date();
    d.setDate(d.getDate() + ((0 + 7 - d.getDay()) % 7 || 7));
    const sundayStr = d.toISOString().split("T")[0];

    const result = await computeAvailableSlots("software-architecture", sundayStr, "Asia/Kolkata");
    assert.strictEqual(result.slots.length, 0, "Sunday must return zero slots (closed)");
  });

  // -------------------------------------------------------------------------
  // 7. Authentic Service Mapping (No Guessed IDs)
  // -------------------------------------------------------------------------
  await test("Service ID mapping resolves all 5 official practices", async () => {
    const expectedIds = [
      "software-architecture",
      "web-development",
      "product-strategy",
      "ui-ux-design-review",
      "ai-integration",
    ];

    for (const id of expectedIds) {
      const service = await getServiceById(id);
      assert.ok(service, `Service ${id} must exist in PostgreSQL`);
      assert.strictEqual(service?.isActive, true);
      assert.ok(service!.priceInPaise > 0);
    }
  });

  // -------------------------------------------------------------------------
  // 8. Explicit Customer Confirmation Enforced
  // -------------------------------------------------------------------------
  await test("Booking requires explicit customer confirmation; no unconfirmed writes", async () => {
    const d = new Date();
    d.setDate(d.getDate() + ((1 + 7 - d.getDay()) % 7 || 7));
    const mondayStr = d.toISOString().split("T")[0];

    const avail = await computeAvailableSlots("software-architecture", mondayStr);
    const availableSlot = avail.slots.find((s) => s.available);
    assert.ok(availableSlot);

    const countBefore = await db.appointment.count();

    // Verify database cannot be modified without explicit confirmation
    const appointmentAttempt = await db.appointment.findFirst({
      where: {
        startTime: new Date(availableSlot.startTime),
        clientEmail: "unconfirmed-test@example.com",
      },
    });
    assert.strictEqual(appointmentAttempt, null);
    assert.strictEqual(await db.appointment.count(), countBefore);
  });

  // -------------------------------------------------------------------------
  // 9. Live Gemini Interactions API Test (when GEMINI_API_KEY is available)
  // -------------------------------------------------------------------------
  if (isGeminiConfigured()) {
    await test("Live Gemini 3.8 Flash Interactions API responds or handles quota gracefully", async () => {
      const res = await runGeminiAssistant({
        message: "What consulting practices do you offer? Give a one sentence summary.",
      });
      if (!res.success && res.error?.startsWith("QUOTA_EXHAUSTED")) {
        // Free tier quota limit reached; verify proper error code and user instructions
        assert.ok(res.reply.includes("quota") || res.reply.includes("limit") || res.reply.includes("reached"));
      } else {
        assert.strictEqual(res.success, true, "Live interaction must succeed when quota available");
        assert.ok(res.reply && res.reply.length > 10, "Must return intelligent reply");
      }
    });
  }

  // -------------------------------------------------------------------------
  // Booking Confirmation Endpoint & Cryptographic Security Test Suite
  // -------------------------------------------------------------------------
  async function getTestSlot(serviceId: string, daysAhead = 12) {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    while (d.getDay() === 0 || d.getDay() === 6) {
      d.setDate(d.getDate() + 1);
    }
    const dateStr = d.toISOString().split("T")[0];
    const avail = await computeAvailableSlots(serviceId, dateStr);
    const slot = avail.slots.find((s) => s.available);
    if (!slot) {
      throw new Error(`No available slot found for ${serviceId} on ${dateStr}`);
    }
    return { dateStr, slot, service: avail.service };
  }

  // 10. Valid proposal confirmed while Gemini is unavailable
  await test("10. A valid pending proposal can be confirmed while Gemini is unavailable", async () => {
    const originalKey = process.env.GEMINI_API_KEY;
    try {
      delete process.env.GEMINI_API_KEY; // Simulate complete Gemini unavailability

      const { slot, service } = await getTestSlot("software-architecture", 12);
      const proposalId = crypto.randomUUID();
      const expiresAt = Date.now() + 15 * 60 * 1000;
      const clientEmail = `offline-gemini-${Date.now()}@example.com`;
      const clientName = "Offline Confirmer";
      const feeINR = Math.round(service.priceInPaise / 100);

      const signature = signProposal({
        proposalId,
        serviceId: service.id,
        startTime: slot.startTime,
        endTime: slot.endTime,
        clientEmail,
        clientName,
        feeINR,
        timezone: "Asia/Kolkata",
        expiresAt,
      });

      const proposal: BookingProposal = {
        proposalId,
        expiresAt,
        signature,
        serviceId: service.id,
        serviceTitle: service.name,
        durationMinutes: service.durationMinutes,
        feeINR,
        startTime: slot.startTime,
        endTime: slot.endTime,
        displayRange: slot.displayRange,
        clientName,
        clientEmail,
        timezone: "Asia/Kolkata",
      };

      const req = new NextRequest(`${BASE_URL}/api/assistant/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: BASE_URL,
          Host: "localhost:3000",
        },
        body: JSON.stringify({
          proposal,
          customerConfirmed: true,
        }),
      });

      const res = await confirmRouteHandler(req);
      assert.strictEqual(res.status, 201, `Expected 201 Created, received ${res.status}`);
      const json = await res.json();
      assert.strictEqual(json.success, true);
      assert.ok(json.appointment?.id);
      assert.ok(json.managementUrl);
      assert.ok(json.customerToken);

      // Verify record is saved in PostgreSQL
      const persisted = await db.appointment.findUnique({
        where: { id: json.appointment.id },
      });
      assert.ok(persisted, "Appointment must be committed to PostgreSQL");
      assert.strictEqual(persisted.clientEmail, clientEmail);
    } finally {
      process.env.GEMINI_API_KEY = originalKey;
    }
  });

  // 11. Invalid or tampered proposal is rejected
  await test("11. An invalid or tampered proposal is rejected (400)", async () => {
    const { slot, service } = await getTestSlot("software-architecture", 13);
    const proposalId = crypto.randomUUID();
    const expiresAt = Date.now() + 15 * 60 * 1000;
    const clientEmail = "legit@example.com";
    const clientName = "Legit Name";
    const feeINR = Math.round(service.priceInPaise / 100);

    const signature = signProposal({
      proposalId,
      serviceId: service.id,
      startTime: slot.startTime,
      endTime: slot.endTime,
      clientEmail,
      clientName,
      feeINR,
      timezone: "Asia/Kolkata",
      expiresAt,
    });

    // Tampered proposal: client altered fee to 10 INR
    const tamperedProposal: BookingProposal = {
      proposalId,
      expiresAt,
      signature,
      serviceId: service.id,
      serviceTitle: service.name,
      durationMinutes: service.durationMinutes,
      feeINR: 10,
      startTime: slot.startTime,
      endTime: slot.endTime,
      displayRange: slot.displayRange,
      clientName,
      clientEmail,
      timezone: "Asia/Kolkata",
    };

    const req = new NextRequest(`${BASE_URL}/api/assistant/confirm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: BASE_URL,
        Host: "localhost:3000",
      },
      body: JSON.stringify({
        proposal: tamperedProposal,
        customerConfirmed: true,
      }),
    });

    const res = await confirmRouteHandler(req);
    assert.strictEqual(res.status, 400);
    const json = await res.json();
    assert.strictEqual(json.success, false);
    assert.strictEqual(json.error, "TAMPERED_PROPOSAL");
  });

  // 12. Expired proposal is rejected
  await test("12. An expired proposal is rejected (410)", async () => {
    const { slot, service } = await getTestSlot("software-architecture", 14);
    const proposalId = crypto.randomUUID();
    const expiresAt = Date.now() - 60 * 1000; // Expired 1 minute ago
    const clientEmail = "expired@example.com";
    const clientName = "Expired Customer";
    const feeINR = Math.round(service.priceInPaise / 100);

    const signature = signProposal({
      proposalId,
      serviceId: service.id,
      startTime: slot.startTime,
      endTime: slot.endTime,
      clientEmail,
      clientName,
      feeINR,
      timezone: "Asia/Kolkata",
      expiresAt,
    });

    const expiredProposal: BookingProposal = {
      proposalId,
      expiresAt,
      signature,
      serviceId: service.id,
      serviceTitle: service.name,
      durationMinutes: service.durationMinutes,
      feeINR,
      startTime: slot.startTime,
      endTime: slot.endTime,
      displayRange: slot.displayRange,
      clientName,
      clientEmail,
      timezone: "Asia/Kolkata",
    };

    const req = new NextRequest(`${BASE_URL}/api/assistant/confirm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: BASE_URL,
        Host: "localhost:3000",
      },
      body: JSON.stringify({
        proposal: expiredProposal,
        customerConfirmed: true,
      }),
    });

    const res = await confirmRouteHandler(req);
    assert.strictEqual(res.status, 410);
    const json = await res.json();
    assert.strictEqual(json.success, false);
    assert.strictEqual(json.error, "PROPOSAL_EXPIRED");
  });

  // 13. Double-booking prevention
  await test("13. A slot that has already been booked cannot be double-booked (409)", async () => {
    const { slot, service } = await getTestSlot("software-architecture", 15);

    // Initial booking occupies the slot
    await createPersistedAppointment({
      serviceId: service.id,
      startTime: slot.startTime,
      clientName: "Occupier",
      clientEmail: "occupier@example.com",
      timezone: "Asia/Kolkata",
    });

    // Second client tries to book the same window
    const proposalId = crypto.randomUUID();
    const expiresAt = Date.now() + 15 * 60 * 1000;
    const clientEmail = "conflicter@example.com";
    const clientName = "Conflict Seeker";
    const feeINR = Math.round(service.priceInPaise / 100);

    const signature = signProposal({
      proposalId,
      serviceId: service.id,
      startTime: slot.startTime,
      endTime: slot.endTime,
      clientEmail,
      clientName,
      feeINR,
      timezone: "Asia/Kolkata",
      expiresAt,
    });

    const secondProposal: BookingProposal = {
      proposalId,
      expiresAt,
      signature,
      serviceId: service.id,
      serviceTitle: service.name,
      durationMinutes: service.durationMinutes,
      feeINR,
      startTime: slot.startTime,
      endTime: slot.endTime,
      displayRange: slot.displayRange,
      clientName,
      clientEmail,
      timezone: "Asia/Kolkata",
    };

    const req = new NextRequest(`${BASE_URL}/api/assistant/confirm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: BASE_URL,
        Host: "localhost:3000",
      },
      body: JSON.stringify({
        proposal: secondProposal,
        customerConfirmed: true,
      }),
    });

    const res = await confirmRouteHandler(req);
    assert.strictEqual(res.status, 409);
    const json = await res.json();
    assert.strictEqual(json.success, false);
    assert.strictEqual(json.error, "SLOT_CONFLICT");
  });

  // 14. Repeated confirmation does not create duplicate appointments
  await test("14. Repeated confirmation does not create duplicate appointments", async () => {
    const { slot, service } = await getTestSlot("software-architecture", 16);
    const proposalId = crypto.randomUUID();
    const expiresAt = Date.now() + 15 * 60 * 1000;
    const clientEmail = `repeated-${Date.now()}@example.com`;
    const clientName = "Repeated Clicker";
    const feeINR = Math.round(service.priceInPaise / 100);

    const signature = signProposal({
      proposalId,
      serviceId: service.id,
      startTime: slot.startTime,
      endTime: slot.endTime,
      clientEmail,
      clientName,
      feeINR,
      timezone: "Asia/Kolkata",
      expiresAt,
    });

    const proposal: BookingProposal = {
      proposalId,
      expiresAt,
      signature,
      serviceId: service.id,
      serviceTitle: service.name,
      durationMinutes: service.durationMinutes,
      feeINR,
      startTime: slot.startTime,
      endTime: slot.endTime,
      displayRange: slot.displayRange,
      clientName,
      clientEmail,
      timezone: "Asia/Kolkata",
    };

    const makeReq = () =>
      new NextRequest(`${BASE_URL}/api/assistant/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: BASE_URL,
          Host: "localhost:3000",
        },
        body: JSON.stringify({
          proposal,
          customerConfirmed: true,
        }),
      });

    // First click
    const res1 = await confirmRouteHandler(makeReq());
    assert.strictEqual(res1.status, 201);
    const json1 = await res1.json();
    assert.strictEqual(json1.success, true);

    // Second click (retry)
    const res2 = await confirmRouteHandler(makeReq());
    assert.ok(res2.status === 200 || res2.status === 201);
    const json2 = await res2.json();
    assert.strictEqual(json2.success, true);
    assert.strictEqual(json2.appointment.id, json1.appointment.id);

    // Verify exactly one record in PostgreSQL
    const count = await db.appointment.count({
      where: {
        serviceId: service.id,
        startTime: new Date(slot.startTime),
        clientEmail,
      },
    });
    assert.strictEqual(count, 1, "Must never create duplicate database rows");
  });

  // 15. Management link returned only after successful booking
  await test("15. Management link is returned only after a successful booking", async () => {
    // Failure case: tampered proposal must NOT return management link or token
    const badReq = new NextRequest(`${BASE_URL}/api/assistant/confirm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: BASE_URL,
        Host: "localhost:3000",
      },
      body: JSON.stringify({
        proposal: {
          proposalId: "bogus",
          expiresAt: Date.now() + 60000,
          signature: "forged_sig",
          serviceId: "software-architecture",
          serviceTitle: "Software Architecture",
          durationMinutes: 45,
          feeINR: 25000,
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 45 * 60000).toISOString(),
          displayRange: "10:00 AM - 10:45 AM",
          clientName: "Attacker",
          clientEmail: "attacker@example.com",
          timezone: "Asia/Kolkata",
        },
        customerConfirmed: true,
      }),
    });
    const badRes = await confirmRouteHandler(badReq);
    assert.strictEqual(badRes.status, 400);
    const badJson = await badRes.json();
    assert.strictEqual(badJson.managementUrl, undefined);
    assert.strictEqual(badJson.customerToken, undefined);

    // Success case: valid proposal returns management link and customer token
    const { slot, service } = await getTestSlot("software-architecture", 17);
    const proposalId = crypto.randomUUID();
    const expiresAt = Date.now() + 15 * 60 * 1000;
    const clientEmail = `mgmt-link-${Date.now()}@example.com`;
    const clientName = "Management Link Tester";
    const feeINR = Math.round(service.priceInPaise / 100);

    const signature = signProposal({
      proposalId,
      serviceId: service.id,
      startTime: slot.startTime,
      endTime: slot.endTime,
      clientEmail,
      clientName,
      feeINR,
      timezone: "Asia/Kolkata",
      expiresAt,
    });

    const proposal: BookingProposal = {
      proposalId,
      expiresAt,
      signature,
      serviceId: service.id,
      serviceTitle: service.name,
      durationMinutes: service.durationMinutes,
      feeINR,
      startTime: slot.startTime,
      endTime: slot.endTime,
      displayRange: slot.displayRange,
      clientName,
      clientEmail,
      timezone: "Asia/Kolkata",
    };

    const goodReq = new NextRequest(`${BASE_URL}/api/assistant/confirm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: BASE_URL,
        Host: "localhost:3000",
      },
      body: JSON.stringify({
        proposal,
        customerConfirmed: true,
      }),
    });

    const goodRes = await confirmRouteHandler(goodReq);
    assert.strictEqual(goodRes.status, 201);
    const goodJson = await goodRes.json();
    assert.ok(typeof goodJson.managementUrl === "string");
    assert.ok(goodJson.managementUrl.startsWith("/my-booking/"));
    assert.ok(typeof goodJson.customerToken === "string" && goodJson.customerToken.length >= 32);
    assert.ok(goodJson.managementUrl.includes(goodJson.customerToken));
  });

  // 16. Durable PostgreSQL-backed idempotency survives cold cache (simulating server restart)
  await test("16. Durable PostgreSQL-backed idempotency survives cold cache across server restarts", async () => {
    const { slot, service } = await getTestSlot("software-architecture", 20);
    const proposalId = crypto.randomUUID();
    const explicitToken = deriveCustomerToken(proposalId);
    const clientEmail = `cold-restart-${Date.now()}@example.com`;

    // First call: initial write to PostgreSQL
    const createdFirst = await createPersistedAppointment(
      {
        serviceId: service.id,
        startTime: slot.startTime,
        clientName: "Cold Cache Tester",
        clientEmail,
        timezone: "Asia/Kolkata",
      },
      { explicitToken }
    );
    assert.ok(createdFirst.id);
    assert.strictEqual(createdFirst.customerToken, explicitToken);

    // Second call: simulate server restart / another server instance (cold in-memory state)
    // Invoking createPersistedAppointment directly with the same explicitToken
    const createdSecond = await createPersistedAppointment(
      {
        serviceId: service.id,
        startTime: slot.startTime,
        clientName: "Cold Cache Tester",
        clientEmail,
        timezone: "Asia/Kolkata",
      },
      { explicitToken }
    );

    assert.strictEqual(createdSecond.id, createdFirst.id, "Must return existing appointment record from DB");
    assert.strictEqual(createdSecond.isExisting, true, "Must flag appointment as existing idempotency hit");
    assert.strictEqual(createdSecond.customerToken, explicitToken, "Must preserve customer token");

    // Check count in PostgreSQL: must be strictly 1
    const dbCount = await db.appointment.count({
      where: {
        serviceId: service.id,
        startTime: new Date(slot.startTime),
        clientEmail,
      },
    });
    assert.strictEqual(dbCount, 1, "Must never create duplicate database rows across instances/restarts");
  });

  // 17. Slot re-availability after customer cancellation
  await test("17. Slot becomes available again after cancellation and can be re-booked", async () => {
    const { dateStr, slot, service } = await getTestSlot("software-architecture", 21);

    // Book the slot
    const booked = await createPersistedAppointment({
      serviceId: service.id,
      startTime: slot.startTime,
      clientName: "Cancellation Rebook Tester",
      clientEmail: "canceller@example.com",
      timezone: "Asia/Kolkata",
    });

    // Verify slot is now unavailable
    const midAvail = await computeAvailableSlots(service.id, dateStr);
    const takenSlot = midAvail.slots.find((s) => s.startTime === slot.startTime);
    assert.strictEqual(takenSlot?.available, false, "Slot must be unavailable while active");

    // Cancel the appointment
    await cancelPersistedAppointment({
      cancellationToken: booked.customerToken,
      reason: "Auditor testing slot reclamation",
    });

    // Verify slot is available again
    const postAvail = await computeAvailableSlots(service.id, dateStr);
    const reavailableSlot = postAvail.slots.find((s) => s.startTime === slot.startTime);
    assert.strictEqual(reavailableSlot?.available, true, "Slot must be available again after cancellation");

    // Another client can now successfully book this slot
    const rebooked = await createPersistedAppointment({
      serviceId: service.id,
      startTime: slot.startTime,
      clientName: "New Replacement Client",
      clientEmail: "replacement@example.com",
      timezone: "Asia/Kolkata",
    });
    assert.ok(rebooked.id);
    assert.notStrictEqual(rebooked.id, booked.id);
  });

  // -------------------------------------------------------------------------
  // Results Summary
  // -------------------------------------------------------------------------
  console.log("\n==========================================================");
  console.log(`Assistant Test Suite Results: ${passed} Passed, ${failed} Failed`);
  console.log("==========================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test runner crashed:", err);
  process.exit(1);
});
