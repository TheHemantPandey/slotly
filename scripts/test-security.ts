import assert from "node:assert";
import { NextRequest } from "next/server";
import { GET as getAppointmentsHandler, POST as postAppointmentsHandler } from "../src/app/api/appointments/route";
import { POST as adminLoginHandler } from "../src/app/api/admin/auth/login/route";
import { GET as getAdminAppointmentsHandler } from "../src/app/api/admin/appointments/route";
import { GET as getAdminStatsHandler } from "../src/app/api/admin/stats/route";
import { POST as adminCancelHandler } from "../src/app/api/admin/appointments/[id]/cancel/route";
import { GET as getCustomerBookingHandler } from "../src/app/api/customer/booking/route";
import { POST as cancelCustomerBookingHandler } from "../src/app/api/customer/cancel/route";
import { db } from "../src/lib/db";
import { hashCustomerToken, hashPassword } from "../src/lib/server/auth";

const BASE_URL = "http://localhost:3000";

async function runTests() {
  console.log("==========================================================");
  console.log("Slotly Atelier Security & Authorization Test Suite");
  console.log("Direct Handler & Real PostgreSQL Persistence Testing");
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
  // 1. Public Appointments API Data Leak Prevention
  // -------------------------------------------------------------------------
  await test("Public GET /api/appointments rejects anonymous bulk listing (403)", async () => {
    const req = new NextRequest(`${BASE_URL}/api/appointments`, {
      method: "GET",
    });
    const res = await getAppointmentsHandler(req);
    assert.strictEqual(res.status, 403, "Must return 403 Forbidden");
    const json = await res.json();
    assert.strictEqual(json.success, false);
    assert.strictEqual(json.appointments, undefined, "Must NOT return appointments array");
    assert.ok(json.error.includes("restricted for privacy"), "Must explain privacy restriction");
  });

  // -------------------------------------------------------------------------
  // 2. Admin API Authentication Boundary
  // -------------------------------------------------------------------------
  await test("Admin GET /api/admin/appointments rejects unauthenticated requests (401)", async () => {
    const req = new NextRequest(`${BASE_URL}/api/admin/appointments`, {
      method: "GET",
    });
    const res = await getAdminAppointmentsHandler(req);
    assert.strictEqual(res.status, 401, "Must return 401 Unauthorized");
    const json = await res.json();
    assert.strictEqual(json.success, false);
  });

  await test("Admin GET /api/admin/stats rejects unauthenticated requests (401)", async () => {
    const req = new NextRequest(`${BASE_URL}/api/admin/stats`, {
      method: "GET",
    });
    const res = await getAdminStatsHandler(req);
    assert.strictEqual(res.status, 401, "Must return 401 Unauthorized");
  });

  await test("Admin Login rejects invalid credentials (401)", async () => {
    const req = new NextRequest(`${BASE_URL}/api/admin/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@slotly.atelier",
        password: "IncorrectPassword123!",
      }),
    });
    const res = await adminLoginHandler(req);
    assert.strictEqual(res.status, 401, "Must return 401 for incorrect password");
    const json = await res.json();
    assert.strictEqual(json.success, false);
  });

  // -------------------------------------------------------------------------
  // 3. Admin Login & Session Cookie Verification
  // -------------------------------------------------------------------------
  const originalEnvHash = process.env.ADMIN_PASSWORD_HASH;
  const originalEnvEmail = process.env.ADMIN_EMAIL;

  const testPassword = "SlotlyAdminTestPassword2026!";
  const testAdminEmail = "test-admin@slotly.atelier";

  // Temporarily configure test admin credentials in memory for the test suite
  process.env.ADMIN_EMAIL = testAdminEmail;
  process.env.ADMIN_PASSWORD_HASH = hashPassword(testPassword);

  let adminSessionCookie = "";
  await test("Admin Login with valid credentials succeeds and issues HttpOnly cookie", async () => {
    const req = new NextRequest(`${BASE_URL}/api/admin/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testAdminEmail,
        password: testPassword,
      }),
    });
    const res = await adminLoginHandler(req);
    assert.strictEqual(res.status, 200, "Must return 200 OK");
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.admin.email, testAdminEmail);

    // Verify session cookie was set
    const setCookieHeader = res.headers.get("set-cookie");
    assert.ok(setCookieHeader, "Must set cookie header");
    assert.ok(setCookieHeader.includes("slotly_admin_session="), "Must contain slotly_admin_session");
    assert.ok(setCookieHeader.toLowerCase().includes("httponly"), "Must be HttpOnly");

    // Extract cookie value for subsequent authenticated calls
    const match = setCookieHeader.match(/slotly_admin_session=([^;]+)/);
    assert.ok(match, "Must extract session cookie value");
    adminSessionCookie = match[1];
  });

  await test("Authenticated Admin can access GET /api/admin/appointments", async () => {
    const req = new NextRequest(`${BASE_URL}/api/admin/appointments`, {
      method: "GET",
      headers: {
        cookie: `slotly_admin_session=${adminSessionCookie}`,
      },
    });
    const res = await getAdminAppointmentsHandler(req);
    assert.strictEqual(res.status, 200, "Must return 200 OK for valid admin session");
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(Array.isArray(json.appointments), "Must return appointments array to admin");
  });

  await test("Authenticated Admin can access GET /api/admin/stats", async () => {
    const req = new NextRequest(`${BASE_URL}/api/admin/stats`, {
      method: "GET",
      headers: {
        cookie: `slotly_admin_session=${adminSessionCookie}`,
      },
    });
    const res = await getAdminStatsHandler(req);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(typeof json.stats.totalUpcoming === "number");
    assert.ok(typeof json.stats.appointmentsToday === "number");
    assert.ok(typeof json.stats.activeServicesCount === "number");
  });

  // -------------------------------------------------------------------------
  // 4. Booking Creation & Token Hashing Verification
  // -------------------------------------------------------------------------
  let createdAptId = "";
  let customerToken = "";

  const futureTestDate = new Date();
  futureTestDate.setDate(futureTestDate.getDate() + 14); // 2 weeks in future
  futureTestDate.setUTCHours(9, 30, 0, 0);
  const startTimeIso = futureTestDate.toISOString();

  await test("POST /api/appointments creates booking, hashes token in DB, returns private token once", async () => {
    const req = new NextRequest(`${BASE_URL}/api/appointments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceId: "software-architecture",
        clientName: "Security Boundary Auditor",
        clientEmail: "auditor@slotly-test.dev",
        clientNotes: "Verification of token hashing and zero customer leaks.",
        startTime: startTimeIso,
        timezone: "Asia/Kolkata",
      }),
    });

    const res = await postAppointmentsHandler(req);
    assert.strictEqual(res.status, 201, "Must return 201 Created");
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(json.customerToken, "Must return high-entropy customerToken in 201 response");
    assert.strictEqual(json.customerToken.length, 64, "Customer token must have 256 bits of entropy (64 hex chars)");
    assert.strictEqual(json.managementUrl, `/my-booking/${json.customerToken}`);

    createdAptId = json.appointment.id;
    customerToken = json.customerToken;

    // Direct Database inspection: verify plaintext token is NOT stored
    const dbRecord = await db.appointment.findUnique({
      where: { id: createdAptId },
    });
    assert.ok(dbRecord, "Record must exist in PostgreSQL");
    assert.strictEqual(dbRecord.cancellationToken, null, "Plaintext cancellationToken in DB must be NULL");
    assert.ok(dbRecord.cancellationTokenHash, "cancellationTokenHash must be present in DB");
    assert.strictEqual(
      dbRecord.cancellationTokenHash,
      hashCustomerToken(customerToken),
      "DB hash must match SHA-256 of customerToken"
    );
  });

  // -------------------------------------------------------------------------
  // 5. Private Customer Booking Authorization
  // -------------------------------------------------------------------------
  await test("Customer GET /api/customer/booking with valid token returns ONLY their booking", async () => {
    const req = new NextRequest(`${BASE_URL}/api/customer/booking`, {
      method: "GET",
      headers: {
        "x-booking-token": customerToken,
      },
    });
    const res = await getCustomerBookingHandler(req);
    assert.strictEqual(res.status, 200, "Must return 200 OK");
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.appointment.id, createdAptId);
    assert.strictEqual(json.appointment.clientName, "Security Boundary Auditor");
    // Verify no internal secret hashes are returned
    assert.strictEqual(json.appointment.cancellationTokenHash, undefined);
    assert.strictEqual(json.appointment.customerToken, undefined);
  });

  await test("Customer GET /api/customer/booking with invalid token returns generic 404", async () => {
    const req = new NextRequest(`${BASE_URL}/api/customer/booking`, {
      method: "GET",
      headers: {
        "x-booking-token": "a1b2c3d4e5f60000000000000000000000000000000000000000000000000000",
      },
    });
    const res = await getCustomerBookingHandler(req);
    assert.strictEqual(res.status, 404, "Must return 404 Not Found");
    const json = await res.json();
    assert.strictEqual(json.success, false);
    assert.strictEqual(json.appointment, undefined);
  });

  // -------------------------------------------------------------------------
  // 6. Concurrency Conflict Prevention
  // -------------------------------------------------------------------------
  await test("Concurrent booking attempt for same window is rejected with 409 Conflict", async () => {
    const req = new NextRequest(`${BASE_URL}/api/appointments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceId: "software-architecture",
        clientName: "Overlapping Interceptor",
        clientEmail: "interceptor@slotly-test.dev",
        clientNotes: "Should conflict with existing test appointment.",
        startTime: startTimeIso,
        timezone: "Asia/Kolkata",
      }),
    });

    const res = await postAppointmentsHandler(req);
    assert.strictEqual(res.status, 409, "Must return 409 Conflict for overlapping slot");
    const json = await res.json();
    assert.strictEqual(json.success, false);
  });

  // -------------------------------------------------------------------------
  // 7. Cancellation Authorization (Customer & Admin)
  // -------------------------------------------------------------------------
  await test("Customer cancellation rejects invalid token (404)", async () => {
    const req = new NextRequest(`${BASE_URL}/api/customer/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-booking-token": "invalid_token_attempt_12345",
      },
      body: JSON.stringify({ reason: "Unauthorized attempt" }),
    });
    const res = await cancelCustomerBookingHandler(req);
    assert.strictEqual(res.status, 404, "Must return 404 for invalid token");
  });

  await test("Customer cancellation with valid token succeeds", async () => {
    const req = new NextRequest(`${BASE_URL}/api/customer/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-booking-token": customerToken,
      },
      body: JSON.stringify({ reason: "Auditor testing customer cancellation flow" }),
    });
    const res = await cancelCustomerBookingHandler(req);
    assert.strictEqual(res.status, 200, "Must return 200 OK");
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.appointment.status, "CANCELLED");

    // Verify in database
    const dbRecord = await db.appointment.findUnique({
      where: { id: createdAptId },
    });
    assert.strictEqual(dbRecord?.status, "CANCELLED");
  });

  // Create a second appointment to test Admin cancellation override
  const secondTestDate = new Date();
  secondTestDate.setDate(secondTestDate.getDate() + 15);
  secondTestDate.setUTCHours(10, 30, 0, 0);

  const req2 = new NextRequest(`${BASE_URL}/api/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      serviceId: "web-development",
      clientName: "Admin Override Target",
      clientEmail: "target@slotly-test.dev",
      startTime: secondTestDate.toISOString(),
      timezone: "Asia/Kolkata",
    }),
  });
  const res2 = await postAppointmentsHandler(req2);
  const json2 = await res2.json();
  const secondAptId = json2.appointment.id;

  await test("Admin cancellation override succeeds with valid admin session", async () => {
    const req = new NextRequest(`${BASE_URL}/api/admin/appointments/${secondAptId}/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: `slotly_admin_session=${adminSessionCookie}`,
      },
      body: JSON.stringify({ reason: "Administrative schedule adjustment" }),
    });

    const res = await adminCancelHandler(req, {
      params: Promise.resolve({ id: secondAptId }),
    });
    assert.strictEqual(res.status, 200, "Must return 200 OK");
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.appointment.status, "CANCELLED");

    const dbRecord = await db.appointment.findUnique({
      where: { id: secondAptId },
    });
    assert.strictEqual(dbRecord?.status, "CANCELLED");
  });

  // Teardown test appointments
  await db.appointment.deleteMany({
    where: { id: { in: [createdAptId, secondAptId] } },
  });

  // Restore environment variables
  process.env.ADMIN_PASSWORD_HASH = originalEnvHash;
  process.env.ADMIN_EMAIL = originalEnvEmail;

  await db.$disconnect();

  console.log("\n==========================================================");
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log("==========================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test runner encountered an unhandled error:", err);
  process.exit(1);
});
