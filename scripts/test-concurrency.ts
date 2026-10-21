import assert from "node:assert";
import { NextRequest } from "next/server";
import { POST as postAppointmentsHandler } from "../src/app/api/appointments/route";
import { computeAvailableSlots } from "../src/lib/server/appointments-repository";
import { db } from "../src/lib/db";

const BASE_URL = "http://localhost:3000";

async function runConcurrencyTests() {
  console.log("==========================================================");
  console.log("Slotly Atelier Concurrency & Race-Condition Test Suite");
  console.log("PostgreSQL Advisory Lock & Cross-Service Collision Verification");
  console.log("==========================================================\n");

  let passed = 0;
  let failed = 0;
  const createdAptIds: string[] = [];

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

  try {
    // -------------------------------------------------------------------------
    // 1. Same-Service Simultaneous Booking Race Condition
    // -------------------------------------------------------------------------
    await test("Simultaneous bookings for the exact same slot & service: exactly 1 succeeds, others 409", async () => {
      // Pick a future weekday (3 weeks out) at 11:00 UTC (16:30 IST)
      const slotTime = new Date();
      slotTime.setDate(slotTime.getDate() + 21);
      // Ensure weekday (Mon-Fri: 1-5)
      while (slotTime.getUTCDay() === 0 || slotTime.getUTCDay() === 6) {
        slotTime.setDate(slotTime.getDate() + 1);
      }
      slotTime.setUTCHours(11, 0, 0, 0);
      const startTimeIso = slotTime.toISOString();

      // Launch 3 simultaneous requests for the exact same slot and service
      const requests = [
        { name: "Client Alpha", email: "alpha@concurrency-test.dev" },
        { name: "Client Beta", email: "beta@concurrency-test.dev" },
        { name: "Client Gamma", email: "gamma@concurrency-test.dev" },
      ].map((client) => {
        const req = new NextRequest(`${BASE_URL}/api/appointments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            serviceId: "business-websites-landing-pages",
            clientName: client.name,
            clientEmail: client.email,
            clientNotes: "Same-service concurrency race test",
            startTime: startTimeIso,
            timezone: "Asia/Kolkata",
          }),
        });
        return postAppointmentsHandler(req);
      });

      // Fire simultaneously
      const responses = await Promise.all(requests);
      const results = await Promise.all(
        responses.map(async (res) => ({
          status: res.status,
          json: await res.json(),
        }))
      );

      const successResults = results.filter((r) => r.status === 201);
      const conflictResults = results.filter((r) => r.status === 409);

      // Collect created ID for cleanup
      for (const s of successResults) {
        if (s.json.appointment?.id) {
          createdAptIds.push(s.json.appointment.id);
        }
      }

      assert.strictEqual(
        successResults.length,
        1,
        `Expected exactly 1 success (201), got ${successResults.length}`
      );
      assert.strictEqual(
        conflictResults.length,
        2,
        `Expected exactly 2 conflicts (409), got ${conflictResults.length}`
      );

      // Verify in DB that only 1 record exists for this exact time
      const dbCount = await db.appointment.count({
        where: {
          startTime: slotTime,
          status: { in: ["CONFIRMED", "PENDING_INTAKE"] },
        },
      });
      assert.strictEqual(dbCount, 1, "Database must contain exactly 1 active appointment for this slot");
    });

    // -------------------------------------------------------------------------
    // 2. Cross-Service Overlapping Simultaneous Race Condition
    // -------------------------------------------------------------------------
    await test("Simultaneous bookings across DIFFERENT services with overlapping times: exactly 1 succeeds, other 409", async () => {
      // Pick another future slot (22 days out)
      const slotTime = new Date();
      slotTime.setDate(slotTime.getDate() + 22);
      while (slotTime.getUTCDay() === 0 || slotTime.getUTCDay() === 6) {
        slotTime.setDate(slotTime.getDate() + 1);
      }
      slotTime.setUTCHours(10, 0, 0, 0); // 10:00 UTC
      const startTimeIso = slotTime.toISOString();

      // Service A: "business-websites-landing-pages"
      const reqA = new NextRequest(`${BASE_URL}/api/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: "business-websites-landing-pages",
          clientName: "Cross-Service Client A",
          clientEmail: "cross-a@concurrency-test.dev",
          clientNotes: "Cross-service concurrency test - Service A",
          startTime: startTimeIso,
          timezone: "Asia/Kolkata",
        }),
      });

      // Service B: "custom-web-apps-dashboards"
      const reqB = new NextRequest(`${BASE_URL}/api/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: "custom-web-apps-dashboards",
          clientName: "Cross-Service Client B",
          clientEmail: "cross-b@concurrency-test.dev",
          clientNotes: "Cross-service concurrency test - Service B",
          startTime: startTimeIso,
          timezone: "Asia/Kolkata",
        }),
      });

      // Fire simultaneously
      const [resA, resB] = await Promise.all([
        postAppointmentsHandler(reqA),
        postAppointmentsHandler(reqB),
      ]);

      const [resultA, resultB] = await Promise.all([
        resA.json().then((json) => ({ status: resA.status, json })),
        resB.json().then((json) => ({ status: resB.status, json })),
      ]);

      if (resultA.status === 201 && resultA.json.appointment?.id) {
        createdAptIds.push(resultA.json.appointment.id);
      }
      if (resultB.status === 201 && resultB.json.appointment?.id) {
        createdAptIds.push(resultB.json.appointment.id);
      }

      const statuses = [resultA.status, resultB.status].sort();
      assert.deepStrictEqual(
        statuses,
        [201, 409],
        `Expected [201, 409], but got [${resultA.status}, ${resultB.status}]`
      );

      // Verify in DB that only 1 record exists across ANY service
      const dbCount = await db.appointment.count({
        where: {
          startTime: slotTime,
          status: { in: ["CONFIRMED", "PENDING_INTAKE"] },
        },
      });
      assert.strictEqual(dbCount, 1, "Database must contain exactly 1 active appointment across all services");
    });

    // -------------------------------------------------------------------------
    // 3. Cross-Service Availability Blocking Verification
    // -------------------------------------------------------------------------
    await test("Available slots for Service B reflect booking already made under Service A", async () => {
      // Pick a future date (23 days out)
      const slotTime = new Date();
      slotTime.setDate(slotTime.getDate() + 23);
      while (slotTime.getUTCDay() === 0 || slotTime.getUTCDay() === 6) {
        slotTime.setDate(slotTime.getDate() + 1);
      }
      slotTime.setUTCHours(9, 30, 0, 0); // 15:00 IST
      const startTimeIso = slotTime.toISOString();

      // Book under Service A
      const req = new NextRequest(`${BASE_URL}/api/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: "business-websites-landing-pages",
          clientName: "Service A Client",
          clientEmail: "service-a@concurrency-test.dev",
          clientNotes: "Availability reflection check",
          startTime: startTimeIso,
          timezone: "Asia/Kolkata",
        }),
      });

      const res = await postAppointmentsHandler(req);
      assert.strictEqual(res.status, 201, "Initial booking must succeed");
      const json = await res.json();
      createdAptIds.push(json.appointment.id);

      // Now query availability for Service B on that date
      const dateStr = slotTime.toISOString().split("T")[0];
      const availabilityB = await computeAvailableSlots("custom-web-apps-dashboards", dateStr);

      // The slot matching startTimeIso must NOT be available
      const matchingSlot = availabilityB.slots.find((s) => s.startTime === startTimeIso);
      if (matchingSlot) {
        assert.strictEqual(
          matchingSlot.available,
          false,
          "Slot booked under Service A must be marked unavailable when querying Service B"
        );
      }
    });
  } finally {
    // Teardown: Clean up all test appointments created during this test run
    if (createdAptIds.length > 0) {
      await db.appointment.deleteMany({
        where: { id: { in: createdAptIds } },
      });
    }
    await db.$disconnect();
  }

  console.log("\n==========================================================");
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log("==========================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runConcurrencyTests().catch((err) => {
  console.error("Concurrency test runner encountered an unhandled error:", err);
  process.exit(1);
});
