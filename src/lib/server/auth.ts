import "server-only";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

export const ADMIN_COOKIE_NAME = "slotly_admin_session";
const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export interface AdminSessionPayload {
  email: string;
  iat: number;
  exp: number;
  jti: string;
}

/**
 * Returns the configured admin email.
 */
export function getAdminEmail(): string {
  return process.env.ADMIN_EMAIL || "admin@slotly.atelier";
}

/**
 * Returns the secret key for signing admin sessions.
 */
function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("ADMIN_SESSION_SECRET must be configured in production.");
    }
    // Deterministic fallback for dev only
    return "dev_slotly_atelier_session_secret_change_in_production_32b";
  }
  return secret;
}

/**
 * Generate a cryptographically secure password hash using PBKDF2 (SHA-512, 100k iterations).
 * Format: `<saltHex>:<hashHex>`
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 100_000, 64, "sha512")
    .toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Verify a plaintext password against a stored `<saltHex>:<hashHex>`.
 * Uses constant-time comparison to protect against timing attacks.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash || !storedHash.includes(":")) {
    return false;
  }

  const [salt, expectedHash] = storedHash.split(":");
  if (!salt || !expectedHash) {
    return false;
  }

  const computedHash = crypto
    .pbkdf2Sync(password, salt, 100_000, 64, "sha512")
    .toString("hex");

  const expectedBuffer = Buffer.from(expectedHash, "hex");
  const computedBuffer = Buffer.from(computedHash, "hex");

  if (expectedBuffer.length !== computedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, computedBuffer);
}

/**
 * Create a cryptographically signed admin session cookie string.
 */
export function createAdminSessionToken(email: string): string {
  const payload: AdminSessionPayload = {
    email: email.trim().toLowerCase(),
    iat: Date.now(),
    exp: Date.now() + SESSION_TTL_MS,
    jti: crypto.randomBytes(16).toString("hex"),
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", getSessionSecret())
    .update(payloadB64)
    .digest("hex");

  return `${payloadB64}.${signature}`;
}

/**
 * Verify and decode an admin session token.
 */
export function verifyAdminSessionToken(
  token: string | undefined | null
): { valid: boolean; email?: string } {
  if (!token || !token.includes(".")) {
    return { valid: false };
  }

  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) {
    return { valid: false };
  }

  const expectedSignature = crypto
    .createHmac("sha256", getSessionSecret())
    .update(payloadB64)
    .digest("hex");

  const sigBuffer = Buffer.from(signature, "hex");
  const expBuffer = Buffer.from(expectedSignature, "hex");

  if (sigBuffer.length !== expBuffer.length) {
    return { valid: false };
  }

  if (!crypto.timingSafeEqual(sigBuffer, expBuffer)) {
    return { valid: false };
  }

  try {
    const payload: AdminSessionPayload = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf-8")
    );

    if (Date.now() > payload.exp) {
      return { valid: false };
    }

    const adminEmail = getAdminEmail().toLowerCase();
    if (payload.email !== adminEmail) {
      return { valid: false };
    }

    return { valid: true, email: payload.email };
  } catch {
    return { valid: false };
  }
}

/**
 * Extract and verify admin session from a NextRequest.
 */
export function getAdminSessionFromRequest(
  request: NextRequest
): { valid: boolean; email?: string } {
  const cookieValue = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return verifyAdminSessionToken(cookieValue);
}

/**
 * Attach the secure HttpOnly admin session cookie to a NextResponse.
 */
export function setAdminSessionCookie(
  response: NextResponse,
  token: string
): void {
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });
}

/**
 * Clear the admin session cookie.
 */
export function clearAdminSessionCookie(response: NextResponse): void {
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

/**
 * Generate a cryptographically random, high-entropy (256-bit) customer access token.
 */
export function generateCustomerToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Compute the SHA-256 hash of a customer token.
 * Only this hash is stored in PostgreSQL.
 */
export function hashCustomerToken(token: string): string {
  return crypto.createHash("sha256").update(token.trim()).digest("hex");
}

/**
 * Basic CSRF check for sensitive mutations.
 * Ensures the request origin matches the host header.
 */
export function verifyCsrfOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) {
    // If no origin header, check sec-fetch-site
    const secFetchSite = request.headers.get("sec-fetch-site");
    if (secFetchSite === "cross-site") {
      return false;
    }
    return true;
  }

  try {
    const originUrl = new URL(origin);
    const forwardedHost = request.headers
      .get("x-forwarded-host")
      ?.split(",")[0]
      .trim();
    const rawHost = request.headers.get("host")?.split(",")[0].trim() || "";
    const expectedHost = (forwardedHost || rawHost).toLowerCase();
    const originHost = originUrl.host.toLowerCase();
    return originHost === expectedHost;
  } catch {
    return false;
  }
}

export interface ProposalSignaturePayload {
  proposalId: string;
  serviceId: string;
  startTime: string; // ISO 8601 UTC
  endTime: string;   // ISO 8601 UTC
  clientEmail: string;
  clientName: string;
  feeINR: number;
  timezone: string;
  expiresAt: number; // Unix timestamp in ms
}

/**
 * Generate a cryptographically secure HMAC-SHA256 signature for a booking proposal.
 * Binds the proposal to its exact service, time window, client details, and expiry.
 */
export function signProposal(payload: ProposalSignaturePayload): string {
  const secret = getSessionSecret();
  const canonical = [
    payload.proposalId,
    payload.serviceId,
    payload.startTime,
    payload.endTime,
    payload.clientEmail.trim().toLowerCase(),
    payload.clientName.trim(),
    payload.feeINR,
    payload.timezone,
    payload.expiresAt,
  ].join("|");

  return crypto.createHmac("sha256", secret).update(canonical).digest("hex");
}

/**
 * Verify that a proposal's signature is valid and authentic.
 * Uses timing-safe constant-time comparison to prevent timing attacks.
 */
export function verifyProposalSignature(
  payload: ProposalSignaturePayload,
  providedSignature: string
): boolean {
  if (!providedSignature || typeof providedSignature !== "string") {
    return false;
  }
  const expectedSignature = signProposal(payload);
  if (expectedSignature.length !== providedSignature.length) {
    return false;
  }
  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, "hex"),
    Buffer.from(providedSignature, "hex")
  );
}

/**
 * Derive a deterministic, high-entropy (256-bit) customer access token from a valid proposalId
 * using the server's session secret.
 * This enables durable PostgreSQL-backed idempotency across restarts and multi-instance deployments
 * while keeping only the SHA-256 hash in the database.
 */
export function deriveCustomerToken(proposalId: string): string {
  const secret = getSessionSecret();
  return crypto
    .createHmac("sha256", secret)
    .update(`slotly_customer_token:${proposalId}`)
    .digest("hex");
}

