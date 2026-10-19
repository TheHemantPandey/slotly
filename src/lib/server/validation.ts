import "server-only";
import { z } from "zod";

/**
 * Server-side validation schema for staging and persisting appointments.
 */
export const createAppointmentSchema = z.object({
  serviceId: z
    .string()
    .min(1, "Service ID is required.")
    .regex(/^[a-z0-9-]+$/, "Service ID must be a valid identifier slug."),
  clientName: z
    .string()
    .trim()
    .min(2, "Client name must be at least 2 characters.")
    .max(100, "Client name cannot exceed 100 characters."),
  clientEmail: z
    .string()
    .trim()
    .email("Please provide a valid email address.")
    .max(255, "Email address is too long."),
  clientNotes: z
    .string()
    .trim()
    .max(1000, "Session notes cannot exceed 1000 characters.")
    .optional(),
  startTime: z
    .string()
    .datetime({ message: "Start time must be a valid ISO 8601 UTC timestamp." })
    .refine(
      (val) => new Date(val).getTime() > Date.now(),
      "Appointment start time must be in the future."
    ),
  timezone: z
    .string()
    .default("Asia/Kolkata"),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;

/**
 * Server-side validation schema for cancelling an appointment.
 */
export const cancelAppointmentSchema = z.object({
  cancellationToken: z
    .string()
    .min(1, "Cancellation token is required."),
  reason: z
    .string()
    .trim()
    .max(500, "Cancellation reason cannot exceed 500 characters.")
    .optional(),
});

export type CancelAppointmentInput = z.infer<typeof cancelAppointmentSchema>;

/**
 * Server-side validation schema for admin login.
 */
export const adminLoginSchema = z.object({
  email: z.string().trim().email("Please provide a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

/**
 * Server-side validation schema for admin cancelling an appointment.
 */
export const adminCancelAppointmentSchema = z.object({
  appointmentId: z.string().min(1, "Appointment ID is required."),
  reason: z
    .string()
    .trim()
    .max(500, "Cancellation reason cannot exceed 500 characters.")
    .optional(),
});

export type AdminCancelAppointmentInput = z.infer<typeof adminCancelAppointmentSchema>;

