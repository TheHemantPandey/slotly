# Slotly

> **"Your time, intentionally spent."**

Slotly is a production-grade, AI-assisted appointment scheduling application designed specifically for professional consulting practices and high-touch technology advisory services. It rejects the unconstrained auction of generic calendar links in favor of intentional availability windows, verified prerequisites, deterministic booking confirmation, and editorial visual elegance.

- **Primary Production URL:** [https://slotly.hemantpandey.in](https://slotly.hemantpandey.in)
- **Secondary Deployment URL:** [https://slotly.vercel.app](https://slotly.vercel.app)

---

## Brand & Visual Language: The Midnight Atelier

Slotly's aesthetic is built around the bespoke **Midnight Atelier** design system:

| Token | Value | Role |
| :--- | :--- | :--- |
| **Background** | `#171717` | Obsidian base canvas |
| **Surface** | `#222222` | Structural container surface |
| **Elevated Surface** | `#292929` | Active cards & elevated panels |
| **Warm Amber Accent** | `#F0B35A` | Intentional focus & temporal highlights |
| **Primary Text** | `#F3EEE5` | Warm alabaster editorial type |
| **Secondary Text** | `#A7A29A` | Muted atmospheric typography |
| **Borders** | `#393633` | Restrained architectural gridlines |

Typography pairs **Newsreader** (editorial serif headings and italics) with **Geist** (modern, clean sans-serif UI elements) and **Geist Mono** (technical specification readouts).

---

## Technology Stack

- **Framework:** Next.js 16 (App Router with Turbopack, Partial Prerendering & Cache Components)
- **Runtime & Language:** Node.js >= 18 & TypeScript 5
- **Frontend UI & Motion:** React 19, Tailwind CSS 4, and Motion (`motion` v14) with reduced-motion accessibility
- **Database & Persistence:** PostgreSQL on Neon Serverless with Prisma ORM 6 & `@prisma/adapter-neon`
- **AI Concierge:** Google Gen AI SDK (`@google/genai`) using `gemini-3.8-flash` via the Interactions API
- **Security & Cryptography:** PBKDF2-SHA512 admin passwords, HMAC-SHA256 proposal signatures, SHA-256 customer token hashing, CSRF origin verification, and HTTP security headers
- **Validation:** Zod 3 server-side validation schemas

---

## Architecture & Security Model

1. **Decoupled Deterministic Proposal Confirmation:**
   - The AI Assistant lists practices, checks real-time calendar availability, and prepares a cryptographically signed `BookingProposal`.
   - The proposal binds `proposalId`, `serviceId`, start/end times, fee, and client details using an HMAC-SHA256 signature and a 15-minute expiry.
   - Final confirmation (`POST /api/assistant/confirm`) is executed by a dedicated server endpoint that persists directly to PostgreSQL without calling Gemini. Even if free-tier AI quota is reached, bookings can be confirmed without interruption.

2. **Durable PostgreSQL-Backed Idempotency:**
   - Proposal confirmation generates a deterministic customer token bound to `proposalId` and the server's session secret.
   - Inside a PostgreSQL advisory-locked transaction (`pg_advisory_xact_lock`), the server checks `cancellationTokenHash`.
   - Retried requests or resubmissions across cold serverless instances return the existing appointment without creating duplicate database rows.

3. **Zero Plaintext Customer Tokens in Database:**
   - Customer access tokens have 256 bits of entropy (64 hex characters).
   - Only the SHA-256 hash is stored in `cancellationTokenHash`.
   - Management URLs (`/my-booking/${token}`) enforce `referrer: "no-referrer"` to prevent credential leakage in HTTP `Referer` headers.
   - Tokens are transmitted via the `x-booking-token` header rather than URL query parameters.

4. **Advisory Lock Concurrency Safety:**
   - All booking writes use transaction-scoped advisory locks keyed to the service ID. Overlapping bookings for the same service are serialized and rejected with HTTP 409 (`SchedulingConflictError`).

5. **Rate Limiting Architecture:**
   - In-memory sliding-window rate limiting is enforced on all sensitive endpoints (`/api/assistant`, `/api/assistant/confirm`, `/api/appointments`, `/api/customer/*`, `/api/admin/*`).
   - Rate limit state is local to each Node.js process / serverless instance. For multi-region serverless deployments requiring shared global rate limits, an external provider (such as Upstash Redis or Vercel KV) can be attached.

---

## Local Development Setup

### 1. Prerequisites
- Node.js >= 18 (Tested on v20 and v22)
- npm >= 9

### 2. Clone and Install
```bash
git clone https://github.com/your-username/slotly.git
cd slotly
npm install
```

### 3. Environment Variables
Copy the template to create your local `.env`:
```bash
cp .env.example .env
```

Generate administrator credentials and a secure session secret:
```bash
npm run admin:hash
```
The script will prompt for your admin email and password with terminal masking, and output values for `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, and `ADMIN_SESSION_SECRET`.

Obtain your free-tier Gemini API key from [Google AI Studio](https://aistudio.google.com/) and set:
```env
GEMINI_API_KEY="your-gemini-api-key"
```

Configure your [Neon PostgreSQL](https://console.neon.tech) connection strings:
```env
DATABASE_URL="postgresql://user:password@ep-pooler.region.aws.neon.tech/slotly?sslmode=require"
DIRECT_URL="postgresql://user:password@ep.region.aws.neon.tech/slotly?sslmode=require"
```

### 4. Database Setup & Seed
```bash
# Push schema to PostgreSQL
npm run db:push

# Populate default consulting practices and availability rules
npm run db:seed
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## Automated Verification & Testing

Slotly includes comprehensive end-to-end integration and security test suites:

```bash
# Run AI concierge & booking confirmation integration test suite (19 test cases)
npm run test:assistant

# Run security, authorization, and concurrency test suite (14 test cases)
npm run test:security

# Run ESLint validation
npm run lint

# Build production bundle (Next.js 16 App Router Turbopack)
npm run build
```

---

## Deployment to Vercel

### 1. Import Repository
1. Push this repository to GitHub as a private or public repository.
2. In the [Vercel Dashboard](https://vercel.com/new), import the repository.

### 2. Configure Build & Install Settings
- **Framework Preset:** Next.js
- **Build Command:** `npm run build`
- **Install Command:** `npm ci`

### 3. Configure Environment Variables
Set the following environment variables in Vercel (**Project Settings → Environment Variables**):

| Variable | Description |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `NEXT_PUBLIC_APP_URL` | `https://slotly.hemantpandey.in` |
| `DATABASE_URL` | Neon pooled connection string with `sslmode=require` |
| `DIRECT_URL` | Neon direct (non-pooled) connection string with `sslmode=require` |
| `ADMIN_EMAIL` | Administrator email address |
| `ADMIN_PASSWORD_HASH` | Salted PBKDF2-SHA512 hash generated by `npm run admin:hash` |
| `ADMIN_SESSION_SECRET` | 64-character hex string generated by `openssl rand -hex 32` |
| `GEMINI_API_KEY` | Google AI Studio API key |
| `GEMINI_MODEL` | `gemini-3.8-flash` |

### 4. Custom Domains
In Vercel **Project Settings → Domains**, add:
- `slotly.hemantpandey.in` (Primary)
- `slotly.vercel.app` (Default deployment domain)

---

## License

MIT License. Copyright © 2026 Hemant Pandey. All rights reserved.

