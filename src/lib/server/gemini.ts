import "server-only";
import crypto from "crypto";
import { GoogleGenAI } from "@google/genai";
import { listActiveServices, getServiceById } from "./services-repository";
import {
  computeAvailableSlots,
  createPersistedAppointment,
  cancelPersistedAppointment,
  getPersistedAppointmentByToken,
  SchedulingConflictError,
  ServiceInactiveError,
} from "./appointments-repository";
import { signProposal } from "./auth";
import { sendBookingConfirmationEmail } from "./email";
import type { BookingProposal, ConfirmedBookingResult } from "@/lib/types";

/**
 * Server-only helper to verify whether GEMINI_API_KEY is configured.
 * Does not expose the key value.
 */
export function isGeminiConfigured(): boolean {
  const key = process.env.GEMINI_API_KEY;
  return typeof key === "string" && key.trim().length > 0;
}

/**
 * Supported Gemini model from free tier.
 * Defaults to "gemini-3.8-flash", overridable via GEMINI_MODEL.
 */
export function getGeminiModelName(): string {
  const configured = process.env.GEMINI_MODEL?.trim();
  // Automatically migrate deprecated 2.5-flash to 3.8-flash if still configured
  if (!configured || configured === "gemini-2.5-flash") {
    return "gemini-3.8-flash";
  }
  return configured;
}

/**
 * Build dynamic system instructions injecting current date/time in Asia/Kolkata timezone.
 * This guarantees the model grounds relative dates (e.g. "tomorrow", "next Tuesday")
 * and time constraints (such as "after 12 AM" / midnight) against actual business hours.
 */
export function buildSystemInstruction(now = new Date()): string {
  const istFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const parts = istFormatter.formatToParts(now);
  const partMap: Record<string, string> = {};
  for (const p of parts) {
    partMap[p.type] = p.value;
  }
  const todayYMD = `${partMap.year}-${partMap.month}-${partMap.day}`;
  const istFormattedString = istFormatter.format(now);

  return `You are the Slotly Concierge, an intentional and articulate AI scheduling advisor for Slotly.
Brand tagline: "Your time, intentionally spent."
Design and Brand Aesthetic: Midnight Atelier (calm, precise, sophisticated, professional).

TIMEZONE & TEMPORAL CONTEXT:
- Primary booking timezone: Asia/Kolkata (IST, UTC+5:30).
- Current reference time in Asia/Kolkata: ${istFormattedString}
- Current calendar date in Asia/Kolkata (YYYY-MM-DD): ${todayYMD}
- Resolve all relative dates (e.g., "today", "tomorrow", "this Friday", "next Monday") against this Asia/Kolkata reference date (${todayYMD}).
- "12 AM" means midnight (00:00). "12 PM" means noon (12:00).

PRACTICE CATALOG & SERVICE ID MAPPING:
Always map inquiries to the authentic service ID in the database:
• 'business-websites-landing-pages' -> Business Websites & Landing Pages (Standard: ₹12,000 | Introductory: ₹9,600 • 20% Savings, 20-min Discovery Call)
• 'custom-web-apps-dashboards' -> Custom Web Applications & Dashboards (Standard: ₹35,000 | Introductory: ₹28,000 • 20% Savings, 20-min Discovery Call)
• 'booking-management-systems' -> Booking & Management Systems (Standard: ₹25,000 | Introductory: ₹20,000 • 20% Savings, 20-min Discovery Call)
• 'ai-chatbots-automation' -> AI Chatbots & Business Automation (Standard: ₹18,000 | Introductory: ₹14,400 • 20% Savings, 20-min Discovery Call)
• 'ecommerce-payment-integration' -> E-commerce & Payment Integration (Standard: ₹25,000 | Introductory: ₹20,000 • 20% Savings, 20-min Discovery Call)
• 'backend-apis-integrations' -> Backend, APIs & Third-Party Integrations (Standard: ₹12,000 | Introductory: ₹9,600 • 20% Savings, 20-min Discovery Call)
• 'website-fixes-redesign-optimization' -> Website Fixes, Redesign & Optimization (Standard: ₹8,000 | Introductory: ₹6,400 • 20% Savings, 20-min Discovery Call)
• 'website-maintenance-support' -> Website Maintenance & Technical Support (Standard: ₹5,000/mo | Introductory: ₹4,000/mo • 20% Savings, 20-min Discovery Call)
(Note: Legacy aliases like 'landing-page', 'custom-web-app', 'ecommerce-store', 'website-redesign', 'ai-integration', 'bug-fixes-maintenance' automatically resolve).

OPERATIONAL RULES:
1. MIDNIGHT & BUSINESS HOURS INTERPRETATION:
   - Slotly consulting sessions operate strictly during configured business hours in Asia/Kolkata:
     Monday to Friday: 09:30 AM to 06:00 PM IST
     Saturday: 10:00 AM to 03:00 PM IST
     Sunday: Closed
   - If a client asks for "any available time after 12 AM" or "after midnight", recognize that 12:00 AM is midnight (00:00).
   - Midnight is outside configured consulting hours. You must NEVER invent or hallucinate midnight or late-night slots (like 12:30 AM or 1:00 AM).
   - Check the service's actual availability rules and booked slots by calling \`check_availability\` with the requested serviceId and date (YYYY-MM-DD).
   - Explain politely that midnight (12:00 AM) is outside operating hours, and offer the actual available daytime slots on that date (e.g. 09:30 AM, 10:15 AM, etc.).

2. SERVICE & DATE AMBIGUITY:
   - If the requested consulting service is ambiguous or not specified (e.g. "I want to book an appointment tomorrow"), ask ONE concise clarification question asking which consulting track they prefer.
   - If the requested date is ambiguous or in the past, ask for clarification.

3. TRUTHFUL AVAILABILITY:
   - NEVER invent or assume appointment slots. You have access to real-time tools.
   - Always call \`check_availability\` with the exact serviceId and date (YYYY-MM-DD).
   - If no slots are open or the day is non-working, state that clearly and offer alternative available dates.

4. EXPLICIT CONFIRMATION FOR BOOKINGS:
   - Inquiring about availability or asking to see open slots DOES NOT create a booking.
   - When a client wants to book a specific slot:
     a) Ensure you have verified open slots via \`check_availability\`.
     b) Ensure you have their name, email, chosen slot start time, and optional notes. If missing, ask for them politely.
     c) Call \`prepare_booking_confirmation\`. This validates parameters against the database and stages a structured proposal card.
     d) Clearly present the details: Practice Title, Date, Time Window, Duration, Fee in INR, Client Name, and Email.
     e) Explicitly instruct the client: "Please review the proposal above and click 'Confirm & Book Now' or tell me to confirm."
     f) ONLY call \`confirm_booking\` after the client explicitly confirms with \`customerConfirmed: true\`. Never call \`confirm_booking\` without explicit user confirmation.

5. PRIVATE BOOKING MANAGEMENT:
   - A customer can view or cancel their appointment using their private token.
   - For cancellation, verify the booking first, ask for explicit confirmation, and call \`confirm_cancellation\` only with \`customerConfirmed: true\`.`;
}

/**
 * Tool Declarations for the Google Gen AI SDK Interactions API.
 * Uses OpenAPI 3.0 specification.
 */
const GEMINI_INTERACTION_TOOLS = [
  {
    type: "function" as const,
    name: "list_services",
    description:
      "Retrieve the live catalog of active consulting practices and advisory tracks offered by Slotly, including IDs, titles, durations, fees in INR, prerequisites, and descriptions.",
    parameters: {
      type: "object",
      properties: {},
    },
  },
  {
    type: "function" as const,
    name: "check_availability",
    description:
      "Query genuinely available appointment slots from PostgreSQL for a specific service and date (YYYY-MM-DD) in Asia/Kolkata timezone. Never invent or hallucinate slots.",
    parameters: {
      type: "object",
      properties: {
        serviceId: {
          type: "string",
          description:
            "Stable ID of the service: 'business-websites-landing-pages', 'custom-web-apps-dashboards', 'booking-management-systems', 'ai-chatbots-automation', 'ecommerce-payment-integration', 'backend-apis-integrations', 'website-fixes-redesign-optimization', or 'website-maintenance-support' (legacy aliases like 'landing-page', 'custom-web-app' are also supported)",
        },
        date: {
          type: "string",
          description: "Calendar date in YYYY-MM-DD format (resolved in Asia/Kolkata timezone)",
        },
        timezone: {
          type: "string",
          description: "Client IANA timezone, defaults to 'Asia/Kolkata'",
        },
      },
      required: ["serviceId", "date"],
    },
  },
  {
    type: "function" as const,
    name: "prepare_booking_confirmation",
    description:
      "Validate booking parameters against the database and prepare an explicit confirmation proposal for the customer to review. Does NOT book the slot yet. Explicit customer confirmation is strictly required before final booking.",
    parameters: {
      type: "object",
      properties: {
        serviceId: {
          type: "string",
          description: "The service ID, e.g. 'custom-web-app' or 'landing-page'",
        },
        startTime: {
          type: "string",
          description: "ISO 8601 UTC timestamp of a genuinely available slot retrieved via check_availability",
        },
        clientName: {
          type: "string",
          description: "Customer full name (at least 2 characters)",
        },
        clientEmail: {
          type: "string",
          description: "Customer valid email address",
        },
        clientNotes: {
          type: "string",
          description: "Optional notes or consultation agenda",
        },
        timezone: {
          type: "string",
          description: "Client timezone, defaults to 'Asia/Kolkata'",
        },
      },
      required: ["serviceId", "startTime", "clientName", "clientEmail"],
    },
  },
  {
    type: "function" as const,
    name: "confirm_booking",
    description:
      "Commit and persist an appointment into PostgreSQL after the client has provided explicit, unambiguous confirmation. Bypassing explicit customer confirmation or inventing slots is strictly forbidden.",
    parameters: {
      type: "object",
      properties: {
        serviceId: { type: "string" },
        startTime: { type: "string" },
        clientName: { type: "string" },
        clientEmail: { type: "string" },
        clientNotes: { type: "string" },
        timezone: { type: "string" },
        customerConfirmed: {
          type: "boolean",
          description: "Must be true indicating the customer explicitly confirmed they want to finalize this booking.",
        },
      },
      required: [
        "serviceId",
        "startTime",
        "clientName",
        "clientEmail",
        "customerConfirmed",
      ],
    },
  },
  {
    type: "function" as const,
    name: "lookup_booking",
    description:
      "Look up details and status of an existing appointment using the customer's private access token.",
    parameters: {
      type: "object",
      properties: {
        token: {
          type: "string",
          description: "The private high-entropy customer booking token",
        },
      },
      required: ["token"],
    },
  },
  {
    type: "function" as const,
    name: "confirm_cancellation",
    description:
      "Cancel an appointment in PostgreSQL using the customer's private token, ONLY after the customer has explicitly confirmed cancellation.",
    parameters: {
      type: "object",
      properties: {
        token: {
          type: "string",
          description: "The customer's private cancellation/booking token",
        },
        reason: {
          type: "string",
          description: "Optional cancellation reason",
        },
        customerConfirmed: {
          type: "boolean",
          description: "Must be true indicating the customer gave explicit confirmation to cancel.",
        },
      },
      required: ["token", "customerConfirmed"],
    },
  },
];

export interface AssistantConversationTurn {
  role: "user" | "assistant";
  content: string;
}

export interface RunAssistantOptions {
  message: string;
  history?: AssistantConversationTurn[];
}

export interface AssistantResponsePayload {
  success: boolean;
  reply: string;
  error?: string;
  suggestedAction?: {
    label: string;
    href: string;
  };
  bookingProposal?: BookingProposal;
  confirmedBooking?: ConfirmedBookingResult;
}

/**
 * Tool Dispatcher: Executes backend functions in response to Gemini function call requests.
 */
async function executeToolCall(
  name: string,
  args: Record<string, unknown>,
  state: {
    capturedProposal?: BookingProposal;
    capturedBooking?: ConfirmedBookingResult;
    capturedAction?: { label: string; href: string };
  }
): Promise<unknown> {
  switch (name) {
    case "list_services": {
      const services = await listActiveServices();
      return {
        count: services.length,
        services: services.map((s) => ({
          id: s.id,
          slug: s.slug,
          title: s.name,
          category: s.category,
          durationMinutes: s.durationMinutes,
          feeINR: Math.round(s.priceInPaise / 100),
          currency: s.currency,
          description: s.description,
          idealFor: s.idealFor,
          deliverables: s.deliverables,
        })),
      };
    }

    case "check_availability": {
      const serviceId = String(args.serviceId || "").trim();
      const date = String(args.date || "").trim();
      const timezone = typeof args.timezone === "string" ? args.timezone : "Asia/Kolkata";

      if (!serviceId || !date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return {
          error: "Invalid request. serviceId and date in YYYY-MM-DD format are required.",
        };
      }

      try {
        const result = await computeAvailableSlots(serviceId, date, timezone);
        const availableSlots = result.slots.filter((s) => s.available);

        if (availableSlots.length > 0) {
          state.capturedAction = {
            label: `Book ${result.service.name}`,
            href: `/book?service=${result.service.id}&date=${date}`,
          };
        }

        return {
          service: result.service,
          date: result.date,
          timezone,
          totalSlots: result.slots.length,
          availableSlotsCount: availableSlots.length,
          operatingHoursNotice:
            availableSlots.length > 0
              ? `Consulting hours active. First available slot starts at ${availableSlots[0].displayRange}. Midnight (12:00 AM) is outside operating hours.`
              : "No available slots on this date. Midnight (12:00 AM) is outside configured business hours (09:30 AM - 06:00 PM IST).",
          availableSlots: availableSlots.map((s) => ({
            id: s.id,
            startTime: s.startTime,
            endTime: s.endTime,
            displayRange: s.displayRange,
          })),
        };
      } catch (err: unknown) {
        if (err instanceof ServiceInactiveError) {
          return { error: "Service is not active or not found." };
        }
        return { error: "Failed to calculate availability for the requested date." };
      }
    }

    case "prepare_booking_confirmation": {
      const serviceId = String(args.serviceId || "").trim();
      const startTime = String(args.startTime || "").trim();
      const clientName = String(args.clientName || "").trim();
      const clientEmail = String(args.clientEmail || "").trim();
      const clientNotes = typeof args.clientNotes === "string" ? args.clientNotes.trim() : undefined;
      const timezone = typeof args.timezone === "string" ? args.timezone : "Asia/Kolkata";

      // 1. Validate service
      const service = await getServiceById(serviceId);
      if (!service || !service.isActive) {
        return { error: "Selected consulting service is not available." };
      }

      // 2. Validate start time format & future date
      const startDate = new Date(startTime);
      if (isNaN(startDate.getTime()) || startDate.getTime() <= Date.now()) {
        return { error: "Appointment start time must be a valid future ISO 8601 UTC timestamp." };
      }

      // 3. Verify slot availability against DB
      const dateStr = startDate.toISOString().split("T")[0];
      const availability = await computeAvailableSlots(service.id, dateStr, timezone);
      const matchingSlot = availability.slots.find(
        (s) => s.startTime === startTime && s.available
      );

      if (!matchingSlot) {
        return {
          error: "The requested time slot is not available or conflicts with another booking. Please choose an open slot.",
        };
      }

      // 4. Validate contact data
      if (clientName.length < 2) {
        return { error: "Client name must be at least 2 characters." };
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) {
        return { error: "A valid email address is required." };
      }

      const proposalId = crypto.randomUUID();
      const expiresAt = Date.now() + 15 * 60 * 1000; // 15-minute validity window
      const feeINR = Math.round(service.priceInPaise / 100);

      const signature = signProposal({
        proposalId,
        serviceId: service.id,
        startTime: matchingSlot.startTime,
        endTime: matchingSlot.endTime,
        clientEmail,
        clientName,
        feeINR,
        timezone,
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
        startTime: matchingSlot.startTime,
        endTime: matchingSlot.endTime,
        displayRange: matchingSlot.displayRange,
        clientName,
        clientEmail,
        clientNotes,
        timezone,
      };

      state.capturedProposal = proposal;

      return {
        status: "AWAITING_EXPLICIT_CONFIRMATION",
        message: "Parameters validated against database. Present these details to client and ask for explicit confirmation.",
        proposal,
      };
    }

    case "confirm_booking": {
      const customerConfirmed = args.customerConfirmed === true;
      if (!customerConfirmed) {
        return {
          error: "Explicit customer confirmation is required before committing the appointment to PostgreSQL.",
        };
      }

      try {
        const created = await createPersistedAppointment({
          serviceId: String(args.serviceId),
          startTime: String(args.startTime),
          clientName: String(args.clientName),
          clientEmail: String(args.clientEmail),
          clientNotes: typeof args.clientNotes === "string" ? args.clientNotes : undefined,
          timezone: typeof args.timezone === "string" ? args.timezone : "Asia/Kolkata",
        });

        const timeFormatter = new Intl.DateTimeFormat("en-US", {
          timeZone: created.timezone,
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });

        const displayRange = `${timeFormatter.format(created.startTime)} - ${timeFormatter.format(created.endTime)}`;
        const managementUrl = `/my-booking/${created.customerToken}`;

        const confirmedResult: ConfirmedBookingResult = {
          id: created.id,
          serviceTitle: created.service.name,
          startTime: created.startTime.toISOString(),
          displayRange,
          clientName: created.clientName,
          clientEmail: created.clientEmail,
          managementUrl,
          customerToken: created.customerToken,
        };

        state.capturedBooking = confirmedResult;
        state.capturedAction = {
          label: "View Private Booking",
          href: managementUrl,
        };

        // Failsafe email notification
        sendBookingConfirmationEmail({
          appointmentId: created.id,
          serviceTitle: created.service.name,
          clientName: created.clientName,
          clientEmail: created.clientEmail,
          clientNotes: created.clientNotes ?? undefined,
          startTime: created.startTime,
          endTime: created.endTime,
          durationMinutes: created.service.durationMinutes,
          feeINR: Math.round(created.feeInPaise / 100),
          timezone: created.timezone,
          customerToken: created.customerToken,
        }).catch((err) => {
          console.warn("[Email Warning] Non-blocking dispatch failed:", err);
        });

        return {
          success: true,
          message: "Appointment confirmed and persisted to database.",
          appointmentId: created.id,
          serviceTitle: created.service.name,
          startTime: created.startTime.toISOString(),
          displayRange,
          managementUrl,
          customerToken: created.customerToken,
        };
      } catch (err: unknown) {
        if (err instanceof SchedulingConflictError) {
          return { error: "Scheduling conflict: this window was just booked by another client. Please select an alternate slot." };
        }
        if (err instanceof ServiceInactiveError) {
          return { error: "Selected service is no longer active." };
        }
        return { error: "Validation failed or database rejected the appointment creation." };
      }
    }

    case "lookup_booking": {
      const token = String(args.token || "").trim();
      if (!token) return { error: "Private booking token is required." };

      const appointment = await getPersistedAppointmentByToken(token);
      if (!appointment) {
        return { error: "No appointment found matching this access credential." };
      }

      return {
        id: appointment.id,
        serviceTitle: appointment.service.name,
        clientName: appointment.clientName,
        startTime: appointment.startTime.toISOString(),
        endTime: appointment.endTime.toISOString(),
        timezone: appointment.timezone,
        status: appointment.status,
        feeINR: Math.round(appointment.feeInPaise / 100),
        cancellationReason: appointment.cancellationReason,
        cancelledAt: appointment.cancelledAt?.toISOString(),
      };
    }

    case "confirm_cancellation": {
      const token = String(args.token || "").trim();
      const customerConfirmed = args.customerConfirmed === true;
      const reason = typeof args.reason === "string" ? args.reason : undefined;

      if (!token) return { error: "Booking token is required." };
      if (!customerConfirmed) {
        return { error: "Explicit customer confirmation is required before cancelling the appointment." };
      }

      try {
        const cancelled = await cancelPersistedAppointment({
          cancellationToken: token,
          reason,
        });

        return {
          success: true,
          message: "Appointment has been cancelled successfully.",
          id: cancelled.id,
          status: cancelled.status,
          serviceTitle: cancelled.service.name,
        };
      } catch {
        return { error: "Failed to cancel appointment. Credential may be invalid or appointment not found." };
      }
    }

    default:
      return { error: `Unrecognized function call: ${name}` };
  }
}

/**
 * Run Gemini Assistant Conversation Turn using the official Interactions API.
 * Uses gemini-3.8-flash by default and executes tool calling loops cleanly.
 */
export async function runGeminiAssistant(
  options: RunAssistantOptions
): Promise<AssistantResponsePayload> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  // Safe Handling: Missing API Key
  if (!apiKey) {
    return {
      success: false,
      error: "MISSING_API_KEY",
      reply:
        "The Slotly AI Concierge requires a configured GEMINI_API_KEY in the server environment. Please set GEMINI_API_KEY in your .env configuration.",
      suggestedAction: {
        label: "Browse Services Catalog",
        href: "/services",
      },
    };
  }

  const modelName = getGeminiModelName();
  const client = new GoogleGenAI({ apiKey });

  // Format conversational context
  let inputPrompt = options.message;
  if (options.history && options.history.length > 0) {
    const historyText = options.history
      .map((h) => `${h.role === "user" ? "Client" : "Concierge"}: ${h.content}`)
      .join("\n\n");
    inputPrompt = `Prior conversation context:\n${historyText}\n\nCurrent client inquiry:\n${options.message}`;
  }

  const state: {
    capturedProposal?: BookingProposal;
    capturedBooking?: ConfirmedBookingResult;
    capturedAction?: { label: string; href: string };
  } = {};

  try {
    const systemInstruction = buildSystemInstruction();

    let interaction = await client.interactions.create({
      model: modelName,
      input: inputPrompt,
      system_instruction: systemInstruction,
      tools: GEMINI_INTERACTION_TOOLS,
    });

    let turns = 0;
    while (interaction.status === "requires_action" && turns < 5) {
      turns++;
      const functionCalls: Array<{
        id: string;
        name: string;
        arguments: Record<string, unknown>;
      }> = [];

      for (const step of interaction.steps || []) {
        const candidate = step as Record<string, unknown>;
        if (
          candidate.type === "function_call" &&
          typeof candidate.name === "string" &&
          typeof candidate.id === "string"
        ) {
          functionCalls.push({
            id: candidate.id,
            name: candidate.name,
            arguments: (candidate.arguments as Record<string, unknown>) || {},
          });
        }
      }

      if (functionCalls.length === 0) {
        break;
      }

      const functionResults: Array<{
        type: "function_result";
        name: string;
        call_id: string;
        result: string;
      }> = [];

      for (const call of functionCalls) {
        const result = await executeToolCall(call.name, call.arguments, state);

        functionResults.push({
          type: "function_result",
          name: call.name,
          call_id: call.id,
          result: JSON.stringify(result),
        });
      }

      interaction = await client.interactions.create({
        model: modelName,
        input: functionResults,
        tools: GEMINI_INTERACTION_TOOLS,
        previous_interaction_id: interaction.id,
      });
    }

    if (interaction.status === "failed") {
      throw new Error(
        `Gemini interaction failed: ${JSON.stringify(interaction.errors || "Unknown interaction error")}`
      );
    }

    const replyText =
      interaction.output_text ||
      "I have processed your consultation inquiry. How else may I assist your advisory schedule?";

    return {
      success: true,
      reply: replyText,
      suggestedAction: state.capturedAction,
      bookingProposal: state.capturedProposal,
      confirmedBooking: state.capturedBooking,
    };
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);

    // 404 / Model Not Found handling
    if (
      errorMsg.includes("404") ||
      errorMsg.includes("NOT_FOUND") ||
      errorMsg.includes("is not found") ||
      errorMsg.includes("no longer available")
    ) {
      return {
        success: false,
        error: "MODEL_NOT_FOUND",
        reply: `The Gemini model "${modelName}" is unavailable or deprecated. Please verify GEMINI_MODEL in your environment is set to a supported model such as gemini-3.8-flash.`,
      };
    }

    // Rate Limit / Quota Exhaustion
    if (
      errorMsg.includes("429") ||
      errorMsg.includes("RESOURCE_EXHAUSTED") ||
      errorMsg.toLowerCase().includes("quota")
    ) {
      const isDailyQuota =
        errorMsg.toLowerCase().includes("per day") ||
        errorMsg.toLowerCase().includes("perday") ||
        errorMsg.toLowerCase().includes("daily quota") ||
        errorMsg.toLowerCase().includes("daily");

      if (isDailyQuota) {
        return {
          success: false,
          error: "QUOTA_EXHAUSTED_DAILY",
          reply:
            "The Gemini AI free-tier daily quota has been reached for today. If you have an active proposal above, you can confirm it directly without AI assistance. Otherwise, please browse available slots directly on our booking portal.",
          suggestedAction: {
            label: "Direct Booking Portal",
            href: "/book",
          },
        };
      }

      return {
        success: false,
        error: "QUOTA_EXHAUSTED_RPM",
        reply:
          "The Gemini AI free-tier request rate limit was temporarily reached (RPM limit). If you have an active proposal above, you can click 'Confirm & Book Now' to finalize it directly. Otherwise, please pause a moment before sending another inquiry.",
        suggestedAction: {
          label: "Direct Booking Portal",
          href: "/book",
        },
      };
    }

    // Authentication / Invalid Key
    if (
      errorMsg.includes("API_KEY_INVALID") ||
      errorMsg.includes("401") ||
      errorMsg.includes("403") ||
      errorMsg.toLowerCase().includes("invalid api key")
    ) {
      return {
        success: false,
        error: "INVALID_API_KEY",
        reply:
          "The configured Gemini API key is invalid or lacks required permissions. Please verify your Google AI Studio credentials.",
      };
    }

    // Provider / Network issues
    if (errorMsg.includes("503") || errorMsg.includes("UNAVAILABLE")) {
      return {
        success: false,
        error: "SERVICE_UNAVAILABLE",
        reply:
          "Google Gemini services are momentarily unavailable. Please retry in a few moments.",
      };
    }

    // Provider error without leaking sensitive internals
    const sanitizedError = apiKey ? errorMsg.replaceAll(apiKey, "[REDACTED_API_KEY]") : errorMsg;
    console.error("Gemini Concierge invocation error:", sanitizedError);
    return {
      success: false,
      error: "PROVIDER_ERROR",
      reply:
        "A provider error occurred while contacting the Gemini AI service. Please try your request again shortly.",
      suggestedAction: {
        label: "Direct Booking Portal",
        href: "/book",
      },
    };
  }
}
