/**
 * Core Domain Types for Slotly
 * Designed to cleanly map to future PostgreSQL Prisma schema and AI server tools.
 */

export type ServiceCategory =
  | "Websites"
  | "Personal & Brand"
  | "E-commerce"
  | "Web Applications"
  | "Design & Optimization"
  | "Maintenance & Support";

export interface ConsultingService {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  durationMinutes: number;
  feeINR: number;
  category: ServiceCategory;
  deliverables: readonly string[];
  idealFor: string;
  popular?: boolean;
}

export interface ServiceProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServiceDetail extends ConsultingService {
  startingPriceINR: number;
  whoIsItFor: string[];
  problemsSolved: string[];
  includedDeliverables: string[];
  notIncluded: string[];
  benefitsAndOutcomes: string[];
  developmentProcess: ServiceProcessStep[];
  estimatedDelivery: string;
  faqs: ServiceFAQ[];
  relatedServiceSlugs: string[];
}

export interface QuoteRequest {
  id?: string;
  name: string;
  email: string;
  serviceId: string;
  serviceTitle: string;
  budgetRange: string;
  requirements: string;
  createdAt?: string;
}

export type AppointmentStatus =
  | "confirmed"
  | "pending_intake"
  | "completed"
  | "cancelled";

export interface Appointment {
  id: string;
  serviceId: string;
  serviceTitle: string;
  clientName: string;
  clientEmail: string;
  notes?: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g., "10:00 AM - 10:45 AM"
  durationMinutes: number;
  feeINR: number;
  status: AppointmentStatus;
  createdAt: string;
  isDemo?: boolean;
}

export interface AvailableTimeSlot {
  id: string;
  time: string; // formatted time label (e.g. "10:00 AM")
  displayRange: string; // e.g. "10:00 AM - 10:45 AM"
  available: boolean;
}

export interface AvailabilityCalendarDay {
  date: string; // YYYY-MM-DD
  dayLabel: string; // e.g. "Mon, Oct 26"
  dayNumber: string; // "26"
  slots: AvailableTimeSlot[];
}

export interface BookingFormData {
  serviceId: string;
  date: string;
  timeSlot: string;
  clientName: string;
  clientEmail: string;
  notes?: string;
}

export interface BookingProposal {
  proposalId: string;
  expiresAt: number; // Unix timestamp in ms
  signature: string;
  serviceId: string;
  serviceTitle: string;
  durationMinutes: number;
  feeINR: number;
  startTime: string; // ISO 8601 UTC
  endTime: string;   // ISO 8601 UTC
  displayRange: string;
  clientName: string;
  clientEmail: string;
  clientNotes?: string;
  timezone: string;
}

export interface ConfirmedBookingResult {
  id: string;
  serviceTitle: string;
  startTime: string;
  displayRange: string;
  clientName: string;
  clientEmail: string;
  managementUrl: string;
  customerToken: string;
}

export interface AssistantMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    href: string;
  };
  bookingProposal?: BookingProposal;
  confirmedBooking?: ConfirmedBookingResult;
  isError?: boolean;
}

