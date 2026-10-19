"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { DEMO_SERVICES } from "@/lib/data";
import { ConsultingService } from "@/lib/types";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle2,
  Lock,
  Calendar as CalendarIcon,
  Clock,
  User,
  Mail,
  Check,
  ArrowRight,
  ShieldCheck,
  Sun,
  Sunset,
  ExternalLink,
  Download,
  AlertCircle,
  Laptop,
  Globe,
  Layers,
  Code2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Sparkles,
} from "lucide-react";

interface SlotResponse {
  id: string;
  startTime: string; // ISO UTC
  endTime: string;   // ISO UTC
  displayTime: string;
  displayRange: string;
  available: boolean;
  conflictReason?: string;
}

interface ConfirmedBookingRecord {
  id: string;
  serviceId: string;
  serviceTitle: string;
  clientName: string;
  clientEmail: string;
  clientNotes?: string;
  startTime: string;
  endTime: string;
  timezone: string;
  feeINR: number;
  status: string;
  customerToken: string;
  managementUrl: string;
  createdAt: string;
}

interface CalendarDayItem {
  date: string;
  dayLabel: string;
  dayNumber: string;
  weekday: string;
  monthName: string;
  isSunday: boolean;
}

function generateUpcomingBusinessDays(count = 10): CalendarDayItem[] {
  const days: CalendarDayItem[] = [];
  const start = new Date();
  start.setDate(start.getDate() + 1); // Start tomorrow to give notice

  let checked = 0;
  while (days.length < count && checked < 30) {
    const current = new Date(start);
    current.setDate(start.getDate() + checked);
    checked++;

    const isSunday = current.getDay() === 0;
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, "0");
    const day = String(current.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    const weekdayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "short" });
    const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "short" });
    const dayFormatter = new Intl.DateTimeFormat("en-US", { day: "numeric" });

    const weekday = weekdayFormatter.format(current);
    const dayNumber = dayFormatter.format(current);
    const monthName = monthFormatter.format(current);
    const dayLabel = `${weekday} ${dayNumber} ${monthName}`;

    days.push({
      date: dateStr,
      dayLabel,
      dayNumber,
      weekday,
      monthName,
      isSunday,
    });
  }
  return days;
}

function getServiceIcon(id: string) {
  switch (id) {
    case "custom-web-app":
    case "custom-web-applications":
    case "booking-website":
    case "business-website-development":
      return <Code2 className="w-4 h-4 text-indigo-400 shrink-0" />;
    case "landing-page":
    case "landing-page-development":
    case "portfolio-website":
      return <Laptop className="w-4 h-4 text-emerald-400 shrink-0" />;
    case "ecommerce-store":
    case "ecommerce-development":
      return <Layers className="w-4 h-4 text-purple-400 shrink-0" />;
    case "website-redesign":
    case "website-redesign-modernization":
    case "speed-seo-optimization":
    case "bug-fixes-maintenance":
    case "custom-feature-bug-fix":
    case "website-maintenance-support":
      return <RefreshCw className="w-4 h-4 text-amber-400 shrink-0" />;
    case "ai-integration":
      return <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />;
    default:
      return <Globe className="w-4 h-4 text-blue-400 shrink-0" />;
  }
}

function downloadIcsFile(booking: ConfirmedBookingRecord) {
  const startDate = new Date(booking.startTime);
  const endDate = new Date(booking.endTime);
  const startIsoClean = startDate.toISOString().replace(/-|:|\.\d\d\d/g, "");
  const endIsoClean = endDate.toISOString().replace(/-|:|\.\d\d\d/g, "");

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Slotly//Web Development Consultation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:slotly-${booking.id}@slotly.dev`,
    `DTSTAMP:${new Date().toISOString().replace(/-|:|\.\d\d\d/g, "")}`,
    `DTSTART:${startIsoClean}`,
    `DTEND:${endIsoClean}`,
    `SUMMARY:${booking.serviceTitle} - Slotly Discovery Call`,
    `DESCRIPTION:Web development discovery session with Hemant Pandey.\\nBooking Reference: #${booking.id.slice(-6).toUpperCase()}\\nManage session: ${
      typeof window !== "undefined" ? window.location.origin : ""
    }${booking.managementUrl}`,
    "LOCATION:Google Meet / Online",
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `slotly-session-${booking.id.slice(-6).toLowerCase()}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

interface BookingWizardProps {
  initialServiceId?: string;
}

export function BookingWizard({ initialServiceId }: BookingWizardProps = {}) {
  const searchParams = useSearchParams();
  const rawServiceParam = initialServiceId || searchParams?.get("service");

  // Services Catalog
  const [services, setServices] = useState<ConsultingService[]>(DEMO_SERVICES);
  const [selectedService, setSelectedService] = useState<ConsultingService>(() => {
    if (rawServiceParam) {
      const found = DEMO_SERVICES.find(
        (s) =>
          s.id === rawServiceParam ||
          (s as { slug?: string }).slug === rawServiceParam ||
          (s as { id?: string }).id === rawServiceParam.toLowerCase()
      );
      if (found) return found;
    }
    return DEMO_SERVICES[0];
  });

  // Calendar Date Strip
  const calendarDays = useMemo(() => generateUpcomingBusinessDays(10), []);
  const [selectedDateIso, setSelectedDateIso] = useState<string>(calendarDays[0].date);
  const [selectedDayLabel, setSelectedDayLabel] = useState<string>(calendarDays[0].dayLabel);

  // Time Slots
  const [availableSlots, setAvailableSlots] = useState<SlotResponse[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<SlotResponse | null>(null);
  const [isLoadingSlots, setIsLoadingSlots] = useState<boolean>(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  // Express Client Intake
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);

  // Status & Validation
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [conflictError, setConflictError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{ name?: string; email?: string; general?: string }>({});
  const [confirmedBooking, setConfirmedBooking] = useState<ConfirmedBookingRecord | null>(null);

  // Sync services from /api/services on mount
  useEffect(() => {
    async function loadServices() {
      try {
        const res = await fetch("/api/services");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.services) && data.services.length > 0) {
            setServices(data.services);
            if (rawServiceParam) {
              const matched = data.services.find(
                (s: ConsultingService & { slug?: string }) =>
                  s.id === rawServiceParam || s.slug === rawServiceParam
              );
              if (matched) setSelectedService(matched);
            }
          }
        }
      } catch (err) {
        console.warn("Using default catalog:", err);
      }
    }
    loadServices();
  }, [rawServiceParam]);

  const [reloadKey, setReloadKey] = useState(0);
  const refreshAvailability = useCallback(() => {
    setReloadKey((prev) => prev + 1);
  }, []);

  // Fetch availability slots when service or date changes
  useEffect(() => {
    let ignore = false;

    async function loadAvailability() {
      try {
        const res = await fetch(
          `/api/availability?serviceId=${encodeURIComponent(selectedService.id)}&date=${encodeURIComponent(
            selectedDateIso
          )}&timezone=Asia/Kolkata`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!ignore && data.success && Array.isArray(data.slots)) {
          setAvailableSlots(data.slots);
          const firstAvailable = data.slots.find((s: SlotResponse) => s.available);
          setSelectedSlot(firstAvailable || null);
          setSlotsError(null);
        } else if (!ignore) {
          setAvailableSlots([]);
          setSelectedSlot(null);
        }
      } catch (err) {
        if (!ignore) {
          console.error("Availability fetch error:", err);
          setSlotsError("Could not retrieve availability for this date. Please try another day.");
          setAvailableSlots([]);
          setSelectedSlot(null);
        }
      } finally {
        if (!ignore) {
          setIsLoadingSlots(false);
        }
      }
    }

    const timer = setTimeout(() => {
      setIsLoadingSlots(true);
      setSlotsError(null);
      setConflictError(null);
      loadAvailability();
    }, 0);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [selectedService.id, selectedDateIso, reloadKey]);

  // Group slots into Morning and Afternoon
  const morningSlots = useMemo(() => {
    return availableSlots.filter((s) => {
      const hour = new Date(s.startTime).getUTCHours();
      const istHour = (hour + 5.5) % 24;
      return istHour < 12;
    });
  }, [availableSlots]);

  const afternoonSlots = useMemo(() => {
    return availableSlots.filter((s) => {
      const hour = new Date(s.startTime).getUTCHours();
      const istHour = (hour + 5.5) % 24;
      return istHour >= 12;
    });
  }, [availableSlots]);

  // Handle Form Submission
  const handleSubmitBooking = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setConflictError(null);
    setFormErrors({});

    const errors: { name?: string; email?: string } = {};
    if (!clientName.trim() || clientName.trim().length < 2) {
      errors.name = "Please enter your name (at least 2 characters).";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!clientEmail.trim() || !emailRegex.test(clientEmail.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (!selectedSlot || !selectedSlot.available) {
      setConflictError("Please select an open time slot from the schedule on the left.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        serviceId: selectedService.id,
        clientName: clientName.trim(),
        clientEmail: clientEmail.trim(),
        clientNotes: notes.trim() || undefined,
        startTime: selectedSlot.startTime, // UTC ISO string
        timezone: "Asia/Kolkata",
      };

      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setConflictError(
            "This slot was just booked by another client. Please select an alternate time."
          );
          refreshAvailability();
          return;
        }

        if (response.status === 400 && data.details) {
          const detailMsg = data.details.map((d: { message: string }) => d.message).join(", ");
          setFormErrors({ general: `Validation error: ${detailMsg}` });
          return;
        }

        throw new Error(data.error || "Failed to confirm appointment. Please try again.");
      }

      // Record successful booking
      const record: ConfirmedBookingRecord = {
        ...data.appointment,
        customerToken: data.customerToken,
        managementUrl: data.managementUrl || `/my-booking/${data.customerToken}`,
      };

      try {
        const storedTokens = JSON.parse(localStorage.getItem("slotly_user_tokens") || "[]");
        storedTokens.unshift({ id: record.id, token: data.customerToken });
        localStorage.setItem("slotly_user_tokens", JSON.stringify(storedTokens));
      } catch {
        // ignore storage errors
      }

      setConfirmedBooking(record);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected network or server error occurred.";
      setFormErrors({ general: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setConfirmedBooking(null);
    setClientName("");
    setClientEmail("");
    setNotes("");
    setConflictError(null);
    setFormErrors({});
    refreshAvailability();
  };

  // ==========================================
  // STREAMLINED FRIENDLY SUCCESS CONFIRMATION
  // ==========================================
  if (confirmedBooking) {
    const startDate = new Date(confirmedBooking.startTime);
    const endDate = new Date(confirmedBooking.endTime);
    const startIsoClean = startDate.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const endIsoClean = endDate.toISOString().replace(/-|:|\.\d\d\d/g, "");

    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      confirmedBooking.serviceTitle + " - Slotly Consultation"
    )}&dates=${startIsoClean}/${endIsoClean}&details=${encodeURIComponent(
      `Web development consultation session with Hemant Pandey.\n\nMeeting link will be shared via calendar invitation.\n\nManage Booking: ${
        typeof window !== "undefined" ? window.location.origin : ""
      }${confirmedBooking.managementUrl}`
    )}&location=${encodeURIComponent("Google Meet (link in calendar invite)")}`;

    const shortBookingId = confirmedBooking.id.slice(-6).toUpperCase();

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="max-w-2xl mx-auto rounded-3xl border border-emerald-500/40 bg-gradient-to-b from-[#070b16] via-[#04060e] to-[#04060e] p-6 sm:p-10 text-left shadow-2xl relative overflow-hidden"
      >
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Badge */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Booking Confirmed</span>
          </div>

          <span className="font-mono text-xs text-zinc-400 font-semibold px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08]">
            Booking ID: #{shortBookingId}
          </span>
        </div>

        {/* Visual Confirmation Icon & Headline */}
        <div className="flex items-start gap-4 mb-6 pb-6 border-b border-white/[0.08]">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-zinc-950 shrink-0 shadow-lg shadow-emerald-500/25">
            <Check className="w-7 h-7" strokeWidth={3} />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Your Session is Confirmed!
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed font-sans mt-1">
              A calendar invitation and session details have been sent to{" "}
              <strong className="text-white">{confirmedBooking.clientEmail}</strong>.
            </p>
          </div>
        </div>

        {/* Meeting Details Spec Card */}
        <div className="p-5 rounded-2xl bg-[#090d1a] border border-white/10 space-y-3.5 font-mono text-xs mb-6 shadow-inner">
          <div className="flex justify-between items-center border-b border-white/[0.06] pb-2.5">
            <span className="text-zinc-400">Service:</span>
            <span className="text-white font-semibold text-right">
              {confirmedBooking.serviceTitle}
            </span>
          </div>
          <div className="flex justify-between items-center border-b border-white/[0.06] pb-2.5">
            <span className="text-zinc-400">Scheduled Date &amp; Time:</span>
            <span className="text-emerald-300 font-semibold text-right">
              {selectedDayLabel} • {selectedSlot?.displayRange} (IST)
            </span>
          </div>
          <div className="flex justify-between items-center border-b border-white/[0.06] pb-2.5">
            <span className="text-zinc-400">Client:</span>
            <span className="text-zinc-200 text-right">
              {confirmedBooking.clientName}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-400">Starting Fee:</span>
            <span className="text-emerald-400 font-bold text-sm">
              ₹{confirmedBooking.feeINR.toLocaleString("en-IN")} INR
            </span>
          </div>
        </div>

        {/* Consultant Info Pill */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10 mb-8">
          <Image
            src="/images/dev_hemantpandey.jpg"
            alt="Hemant Pandey"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover ring-1 ring-white/20 shrink-0"
          />
          <div className="text-left font-sans">
            <div className="text-xs font-semibold text-white">Hemant Pandey</div>
            <div className="text-[11px] text-zinc-400">Full-Stack Web Developer &amp; Tech Consultant</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <a
            href={googleCalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white text-zinc-950 font-mono text-xs font-semibold hover:bg-zinc-100 transition-all shadow-md cursor-pointer text-center"
          >
            <CalendarIcon className="w-3.5 h-3.5 text-blue-600" />
            <span>Add to Google Calendar</span>
            <ExternalLink className="w-3 h-3 text-zinc-600" />
          </a>

          <button
            type="button"
            onClick={() => downloadIcsFile(confirmedBooking)}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white font-mono text-xs border border-white/15 transition-all cursor-pointer text-center"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Download .ics</span>
          </button>

          <Link
            href={confirmedBooking.managementUrl}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white font-mono text-xs border border-white/15 transition-all text-center"
          >
            <span>Manage Booking</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={resetForm}
            className="text-xs font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            ← Book another session
          </button>
        </div>
      </motion.div>
    );
  }

  // ==========================================
  // 1-PAGE EXPRESS CHECKOUT (2-COLUMN LAYOUT)
  // ==========================================
  const isReadyToSubmit = Boolean(
    selectedSlot &&
      selectedSlot.available &&
      clientName.trim().length >= 2 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail.trim())
  );

  return (
    <div className="max-w-6xl mx-auto text-left">
      {/* Concurrency Conflict Banner (HTTP 409) */}
      <AnimatePresence>
        {conflictError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-6 p-4 rounded-2xl bg-amber-950/60 border border-amber-600/60 text-amber-200 text-xs font-mono flex items-start gap-3 shadow-lg"
          >
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="block text-amber-300 font-semibold mb-0.5">Slot Conflict</strong>
              <span>{conflictError}</span>
            </div>
            <button
              type="button"
              onClick={() => setConflictError(null)}
              className="text-amber-400 hover:text-white text-xs cursor-pointer px-1"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ==================================================== */}
        {/* LEFT COLUMN (7 cols / ~60%): Service & Slot Picker */}
        {/* ==================================================== */}
        <div className="lg:col-span-7 space-y-8">
          {/* 1. SERVICE SELECTOR */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] font-mono font-bold flex items-center justify-center">
                  1
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Select Development Service
                </h2>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">
                {services.length} Tracks Available
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {services.map((svc) => {
                const isSelected = selectedService.id === svc.id;
                const originalPrice = svc.originalFeeINR || Math.round(svc.feeINR * 1.25);
                return (
                  <div
                    key={svc.id}
                    onClick={() => {
                      setSelectedService(svc);
                      setConflictError(null);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden group flex flex-col justify-between ${
                      isSelected
                        ? "border-emerald-500/80 bg-emerald-950/20 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500/50"
                        : "border-white/10 bg-[#070b16]/80 hover:border-white/20 hover:bg-white/[0.03]"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <div
                            className={`p-1.5 rounded-lg border shrink-0 ${
                              isSelected
                                ? "bg-emerald-500/20 border-emerald-500/40"
                                : "bg-white/[0.04] border-white/10 group-hover:border-white/20"
                            }`}
                          >
                            {getServiceIcon(svc.id)}
                          </div>
                          <span
                            className={`text-xs font-semibold truncate ${
                              isSelected ? "text-white" : "text-zinc-200"
                            }`}
                          >
                            {svc.title}
                          </span>
                        </div>

                        {isSelected && (
                          <span className="h-4 w-4 rounded-full bg-emerald-400 text-zinc-950 flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-zinc-400 text-[10px] font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3 text-zinc-500" />
                          {svc.durationMinutes} min enquiry
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          20% OFF
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between font-mono text-xs pt-2 border-t border-white/[0.06] mt-1">
                      <div>
                        <div className="text-[10px] text-zinc-500 line-through">
                          ₹{originalPrice.toLocaleString("en-IN")}
                        </div>
                        <div className="text-emerald-400 font-bold text-xs">
                          Starts from ₹{svc.feeINR.toLocaleString("en-IN")}
                        </div>
                      </div>

                      <Link
                        href={`/services/${svc.slug}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white px-2 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
                      >
                        <span>Know More</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. UNIFIED DATE & LIVE SLOT PICKER */}
          <div className="p-5 sm:p-6 rounded-3xl border border-white/10 bg-[#070b16]/90 backdrop-blur-xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] font-mono font-bold flex items-center justify-center">
                  2
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Choose Consultation Slot
                </h2>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Asia/Kolkata (IST)
              </span>
            </div>

            {/* Horizontal Date Selector Strip */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                  Select Date
                </label>
                <span className="text-[11px] font-mono text-zinc-400">
                  Mon – Sat open
                </span>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth">
                {calendarDays.map((day) => {
                  const isSelected = selectedDateIso === day.date;
                  return (
                    <button
                      key={day.date}
                      type="button"
                      disabled={day.isSunday}
                      onClick={() => {
                        setSelectedDateIso(day.date);
                        setSelectedDayLabel(day.dayLabel);
                      }}
                      className={`min-w-[72px] sm:min-w-[80px] p-3 rounded-2xl border text-center transition-all shrink-0 cursor-pointer ${
                        day.isSunday
                          ? "opacity-35 cursor-not-allowed bg-white/[0.01] border-white/[0.05]"
                          : isSelected
                          ? "bg-gradient-to-b from-emerald-500 to-teal-500 text-zinc-950 font-bold border-emerald-400 shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400"
                          : "bg-white/[0.02] border-white/10 text-zinc-400 hover:text-white hover:border-white/25 hover:bg-white/[0.05]"
                      }`}
                    >
                      <div
                        className={`font-mono text-[10px] uppercase tracking-wider mb-1 ${
                          isSelected ? "text-zinc-900 font-bold" : "text-zinc-400"
                        }`}
                      >
                        {day.weekday}
                      </div>
                      <div
                        className={`text-xl font-bold font-mono leading-none mb-1 ${
                          isSelected ? "text-zinc-950" : "text-white"
                        }`}
                      >
                        {day.dayNumber}
                      </div>
                      <div
                        className={`font-mono text-[10px] ${
                          isSelected ? "text-zinc-900 font-semibold" : "text-zinc-400"
                        }`}
                      >
                        {day.isSunday ? "Off" : day.monthName}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Time Slot Grid */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                  Available Slots for {selectedDayLabel}
                </span>
                {selectedSlot && (
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Slot Locked
                  </span>
                )}
              </div>

              {isLoadingSlots ? (
                <div className="py-12 text-center text-xs font-mono text-zinc-400 space-y-2.5">
                  <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-emerald-400 border-r-transparent" />
                  <div>Checking open slots in Asia/Kolkata...</div>
                </div>
              ) : slotsError ? (
                <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-xs font-mono text-rose-300">
                  {slotsError}
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="p-8 rounded-2xl bg-[#04060e] border border-white/10 text-center text-xs text-zinc-400 font-mono">
                  No consultation windows open on this day. Please choose another date above.
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Morning Slots */}
                  {morningSlots.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2.5">
                        <Sun className="w-3.5 h-3.5 text-amber-400" />
                        <span>Morning (09:30 - 12:00 IST)</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {morningSlots.map((slot) => {
                          const isSelected = selectedSlot?.id === slot.id;
                          return (
                            <button
                              key={slot.id}
                              type="button"
                              disabled={!slot.available}
                              onClick={() => {
                                setSelectedSlot(slot);
                                setConflictError(null);
                              }}
                              className={`p-2.5 rounded-xl border text-center font-mono text-xs transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                                !slot.available
                                  ? "bg-white/[0.01] border-white/[0.05] text-zinc-600 cursor-not-allowed line-through"
                                  : isSelected
                                  ? "bg-emerald-950/70 border-emerald-500 text-emerald-300 font-semibold ring-1 ring-emerald-500/50 shadow-md shadow-emerald-950/50"
                                  : "bg-white/[0.02] border-white/10 text-zinc-200 hover:border-emerald-500/40 hover:bg-white/[0.05]"
                              }`}
                            >
                              <div className="flex items-center gap-1.5">
                                {isSelected ? (
                                  <Lock className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <Clock className="w-3 h-3 text-zinc-500" />
                                )}
                                <span>{slot.displayTime}</span>
                              </div>
                              <span className="text-[10px] tracking-tight">
                                {isSelected ? (
                                  <span className="text-emerald-400 font-semibold">Selected</span>
                                ) : slot.available ? (
                                  <span className="text-zinc-400">Available</span>
                                ) : (
                                  <span className="text-zinc-600">Reserved</span>
                                )}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Afternoon Slots */}
                  {afternoonSlots.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2.5">
                        <Sunset className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Afternoon (12:00 - 18:00 IST)</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {afternoonSlots.map((slot) => {
                          const isSelected = selectedSlot?.id === slot.id;
                          return (
                            <button
                              key={slot.id}
                              type="button"
                              disabled={!slot.available}
                              onClick={() => {
                                setSelectedSlot(slot);
                                setConflictError(null);
                              }}
                              className={`p-2.5 rounded-xl border text-center font-mono text-xs transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                                !slot.available
                                  ? "bg-white/[0.01] border-white/[0.05] text-zinc-600 cursor-not-allowed line-through"
                                  : isSelected
                                  ? "bg-emerald-950/70 border-emerald-500 text-emerald-300 font-semibold ring-1 ring-emerald-500/50 shadow-md shadow-emerald-950/50"
                                  : "bg-white/[0.02] border-white/10 text-zinc-200 hover:border-emerald-500/40 hover:bg-white/[0.05]"
                              }`}
                            >
                              <div className="flex items-center gap-1.5">
                                {isSelected ? (
                                  <Lock className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <Clock className="w-3 h-3 text-zinc-500" />
                                )}
                                <span>{slot.displayTime}</span>
                              </div>
                              <span className="text-[10px] tracking-tight">
                                {isSelected ? (
                                  <span className="text-emerald-400 font-semibold">Selected</span>
                                ) : slot.available ? (
                                  <span className="text-zinc-400">Available</span>
                                ) : (
                                  <span className="text-zinc-600">Reserved</span>
                                )}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ==================================================== */}
        {/* RIGHT COLUMN (5 cols / ~40%): Sticky Express Intake */}
        {/* ==================================================== */}
        <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-6">
          <div className="rounded-3xl border border-white/10 bg-[#070b16]/95 backdrop-blur-2xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
            {/* Top Glowing Gradient Accent */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500" />

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Express Checkout</span>
              </span>
              <span className="text-[11px] font-mono text-zinc-400">Under 60 sec</span>
            </div>

            {/* 1. LIVE ORDER SUMMARY BOX */}
            <div className="p-4 rounded-2xl bg-[#04060e] border border-white/10 space-y-3 mb-6">
              <div className="flex justify-between items-start gap-2 border-b border-white/[0.06] pb-3">
                <div>
                  <span className="text-[11px] font-mono uppercase text-emerald-400 font-semibold block">
                    Introductory Project Enquiry ({selectedService.durationMinutes} Mins)
                  </span>
                  <span className="text-sm font-semibold text-white block mt-0.5">
                    {selectedService.title}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-400">
                    Direct call with Hemant Pandey
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-zinc-500 block line-through">
                    Was ₹{(selectedService.originalFeeINR || Math.round(selectedService.feeINR * 1.25)).toLocaleString("en-IN")}
                  </span>
                  <span className="text-sm sm:text-base font-bold font-mono text-emerald-400 block mt-0.5">
                    Starts from ₹{selectedService.feeINR.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 inline-block mt-0.5">
                    20% Market Discount Applied
                  </span>
                </div>
              </div>

              {/* Slot Confirmation or Selection Prompt */}
              {selectedSlot ? (
                <div className="flex items-center justify-between text-xs font-mono pt-1">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <CalendarIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{selectedDayLabel}</span>
                  </div>
                  <div className="text-emerald-300 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{selectedSlot.displayRange}</span>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 shrink-0 animate-pulse text-amber-400" />
                  <span>Select an available time slot on the left to proceed.</span>
                </div>
              )}
            </div>

            {/* 2. EXPRESS 2-FIELD CLIENT INTAKE FORM */}
            <form onSubmit={handleSubmitBooking} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                  Your Name <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => {
                      setClientName(e.target.value);
                      if (formErrors.name) setFormErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    placeholder="e.g. Rahul Sharma"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#04060e] border text-sm text-white placeholder:text-zinc-600 focus:outline-none transition-all ${
                      formErrors.name
                        ? "border-rose-500 focus:ring-1 focus:ring-rose-500"
                        : "border-white/10 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    }`}
                  />
                </div>
                {formErrors.name && (
                  <p className="mt-1 text-xs text-rose-400 font-mono">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                  Email Address <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={clientEmail}
                    onChange={(e) => {
                      setClientEmail(e.target.value);
                      if (formErrors.email) setFormErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    placeholder="rahul@company.com or personal email"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#04060e] border text-sm text-white placeholder:text-zinc-600 focus:outline-none transition-all ${
                      formErrors.email
                        ? "border-rose-500 focus:ring-1 focus:ring-rose-500"
                        : "border-white/10 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    }`}
                  />
                </div>
                {formErrors.email && (
                  <p className="mt-1 text-xs text-rose-400 font-mono">{formErrors.email}</p>
                )}
              </div>

              {/* Optional Project Brief / Notes Accordion */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowNotes((prev) => !prev)}
                  className="flex items-center justify-between w-full text-xs font-mono text-zinc-400 hover:text-zinc-200 py-1 cursor-pointer transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Project Brief / Notes (Optional)</span>
                  </span>
                  {showNotes ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showNotes && (
                  <div className="mt-2">
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Tell me briefly about your website, tech stack, or goals (optional)"
                      className="w-full p-3 rounded-xl bg-[#04060e] border border-white/10 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none font-sans"
                    />
                  </div>
                )}
              </div>

              {formErrors.general && (
                <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-xs font-mono text-rose-300">
                  {formErrors.general}
                </div>
              )}

              {/* 3. 1-CLICK SUBMIT BUTTON */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!isReadyToSubmit || isSubmitting}
                  className={`w-full py-3.5 px-4 rounded-xl font-mono text-xs font-bold tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                    isReadyToSubmit && !isSubmitting
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 shadow-emerald-500/25 ring-1 ring-emerald-400"
                      : "bg-white/[0.08] text-zinc-400 border border-white/10 cursor-not-allowed opacity-75"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-zinc-950 border-r-transparent rounded-full animate-spin" />
                      <span>Locking Session &amp; Syncing...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm Enquiry Call (Free / Discovery) →</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Helpful Micro-copy when button is disabled */}
                {!isReadyToSubmit && !isSubmitting && (
                  <p className="mt-2 text-center text-[11px] font-mono text-zinc-400">
                    {!selectedSlot
                      ? "👉 Pick an available time slot on the left to proceed"
                      : clientName.trim().length < 2
                      ? "👉 Enter your name above to proceed"
                      : "👉 Enter a valid email address to receive session invite"}
                  </p>
                )}
              </div>
            </form>

            {/* Consultant / Direct Sync Guarantee */}
            <div className="mt-5 pt-4 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-zinc-400">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Direct with Hemant Pandey
              </span>
              <span>Zero double-booking guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
