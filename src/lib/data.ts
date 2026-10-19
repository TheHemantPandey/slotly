import {
  ConsultingService,
  Appointment,
  AvailabilityCalendarDay,
} from "./types";
import { FREELANCE_SERVICES } from "./services-catalog";

export const DEMO_SERVICES: ConsultingService[] = FREELANCE_SERVICES;

export const INITIAL_DEMO_APPOINTMENTS: Appointment[] = [
  {
    id: "apt-2026-081",
    serviceId: "landing-page",
    serviceTitle: "High-Converting Landing Page & Portfolio",
    clientName: "Rohan Verma",
    clientEmail: "rohan.v@helixsystems.io",
    notes: "New product launch landing page with mobile responsiveness & lead form.",
    date: "2026-10-24",
    timeSlot: "10:00 AM - 10:15 AM",
    durationMinutes: 15,
    feeINR: 4799,
    status: "confirmed",
    createdAt: "2026-10-16T14:30:00Z",
    isDemo: true,
  },
  {
    id: "apt-2026-094",
    serviceId: "custom-web-app",
    serviceTitle: "Full-Stack Web Application",
    clientName: "Ananya Deshmukh",
    clientEmail: "ananya@synthetix.ai",
    notes: "Client intake portal with PostgreSQL database and authenticated dashboard.",
    date: "2026-10-27",
    timeSlot: "03:30 PM - 03:50 PM",
    durationMinutes: 20,
    feeINR: 14999,
    status: "confirmed",
    createdAt: "2026-10-17T09:15:00Z",
    isDemo: true,
  },
  {
    id: "apt-2026-062",
    serviceId: "ecommerce-store",
    serviceTitle: "E-Commerce & Online Store Setup",
    clientName: "Vikram Nair",
    clientEmail: "vikram@nairventures.com",
    notes: "Direct-to-consumer store with Razorpay payment gateway & product catalog.",
    date: "2026-10-12",
    timeSlot: "11:30 AM - 11:50 AM",
    durationMinutes: 20,
    feeINR: 9599,
    status: "completed",
    createdAt: "2026-10-08T11:00:00Z",
    isDemo: true,
  },
];

// Helper to generate dynamic upcoming availability days
export function getAvailabilityCalendar(): AvailabilityCalendarDay[] {
  return [
    {
      date: "2026-10-24",
      dayLabel: "Sat, Oct 24",
      dayNumber: "24",
      slots: [
        { id: "slot-24-1", time: "09:30 AM", displayRange: "09:30 AM - 10:15 AM", available: true },
        { id: "slot-24-2", time: "11:00 AM", displayRange: "11:00 AM - 11:45 AM", available: true },
        { id: "slot-24-3", time: "02:30 PM", displayRange: "02:30 PM - 03:15 PM", available: false },
        { id: "slot-24-4", time: "04:00 PM", displayRange: "04:00 PM - 04:45 PM", available: true },
      ],
    },
    {
      date: "2026-10-26",
      dayLabel: "Mon, Oct 26",
      dayNumber: "26",
      slots: [
        { id: "slot-26-1", time: "10:00 AM", displayRange: "10:00 AM - 10:45 AM", available: true },
        { id: "slot-26-2", time: "11:30 AM", displayRange: "11:30 AM - 12:15 PM", available: true },
        { id: "slot-26-3", time: "03:00 PM", displayRange: "03:00 PM - 03:45 PM", available: true },
        { id: "slot-26-4", time: "05:00 PM", displayRange: "05:00 PM - 05:45 PM", available: false },
      ],
    },
    {
      date: "2026-10-27",
      dayLabel: "Tue, Oct 27",
      dayNumber: "27",
      slots: [
        { id: "slot-27-1", time: "09:00 AM", displayRange: "09:00 AM - 09:45 AM", available: true },
        { id: "slot-27-2", time: "01:30 PM", displayRange: "01:30 PM - 02:15 PM", available: true },
        { id: "slot-27-3", time: "03:30 PM", displayRange: "03:30 PM - 04:15 PM", available: true },
        { id: "slot-27-4", time: "05:30 PM", displayRange: "05:30 PM - 06:15 PM", available: true },
      ],
    },
    {
      date: "2026-10-28",
      dayLabel: "Wed, Oct 28",
      dayNumber: "28",
      slots: [
        { id: "slot-28-1", time: "10:30 AM", displayRange: "10:30 AM - 11:15 AM", available: true },
        { id: "slot-28-2", time: "12:00 PM", displayRange: "12:00 PM - 12:45 PM", available: true },
        { id: "slot-28-3", time: "02:00 PM", displayRange: "02:00 PM - 02:45 PM", available: false },
        { id: "slot-28-4", time: "04:30 PM", displayRange: "04:30 PM - 05:15 PM", available: true },
      ],
    },
  ];
}
