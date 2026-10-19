"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { DEMO_SERVICES } from "@/lib/data";
import { ConsultingService } from "@/lib/types";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  CheckCircle2,
  Lock,
  Calendar as CalendarIcon,
  Clock,
  User,
  Mail,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Sun,
  Sunset,
  ExternalLink,
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

const STEPS = [
  { step: 1, label: "Select Service", subtitle: "Project Track" },
  { step: 2, label: "Choose Date", subtitle: "Select Day" },
  { step: 3, label: "Time Slot", subtitle: "Available Window" },
  { step: 4, label: "Project Intake", subtitle: "Requirements" },
  { step: 5, label: "Review & Lock", subtitle: "Confirm Booking" },
];

function generateNextDays(count = 10): { date: string; dayLabel: string; dayNumber: string; weekday: string; isSunday: boolean }[] {
  const days: { date: string; dayLabel: string; dayNumber: string; weekday: string; isSunday: boolean }[] = [];
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

    const formatter = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    const label = formatter.format(current);
    const weekdayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "short" });

    days.push({
      date: dateStr,
      dayLabel: label,
      dayNumber: String(current.getDate()),
      weekday: weekdayFormatter.format(current),
      isSunday,
    });
  }
  return days;
}

export function BookingWizard() {
  const searchParams = useSearchParams();
  const preselectedServiceId = searchParams?.get("service");
  const shouldReduceMotion = useReducedMotion();

  const [services, setServices] = useState<ConsultingService[]>(DEMO_SERVICES);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState<ConsultingService>(() => {
    if (preselectedServiceId) {
      const found = DEMO_SERVICES.find((s) => s.id === preselectedServiceId);
      if (found) return found;
    }
    return DEMO_SERVICES[0];
  });

  const calendarDays = React.useMemo(() => generateNextDays(10), []);
  const [selectedDateIso, setSelectedDateIso] = useState(calendarDays[0].date);
  const [selectedDayLabel, setSelectedDayLabel] = useState(calendarDays[0].dayLabel);

  // Dynamic slots loaded from real PostgreSQL /api/availability
  const [availableSlots, setAvailableSlots] = useState<SlotResponse[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<SlotResponse | null>(null);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  // Intake Form
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    slot?: string;
    general?: string;
  }>({});

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<ConfirmedBookingRecord | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Fetch active services from PostgreSQL on mount
  useEffect(() => {
    async function loadServices() {
      try {
        const res = await fetch("/api/services");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.services) && data.services.length > 0) {
            setServices(data.services);
            if (preselectedServiceId) {
              const matched = data.services.find((s: ConsultingService) => s.id === preselectedServiceId);
              if (matched) setSelectedService(matched);
            }
          }
        }
      } catch (err) {
        console.warn("Could not load services from /api/services, using default catalog:", err);
      }
    }
    loadServices();
  }, [preselectedServiceId]);

  // Fetch dynamic availability slots from /api/availability
  useEffect(() => {
    let active = true;

    async function loadAvailability() {
      setIsLoadingSlots(true);
      try {
        const res = await fetch(
          `/api/availability?serviceId=${encodeURIComponent(selectedService.id)}&date=${encodeURIComponent(selectedDateIso)}&timezone=Asia/Kolkata`
        );
        if (!res.ok) {
          throw new Error(`Server returned HTTP ${res.status}`);
        }
        const data = await res.json();
        if (active && data.success && Array.isArray(data.slots)) {
          setAvailableSlots(data.slots);
          const firstAvailable = data.slots.find((s: SlotResponse) => s.available);
          setSelectedSlot(firstAvailable || null);
          setSlotsError(null);
        } else if (active) {
          setAvailableSlots([]);
          setSelectedSlot(null);
        }
      } catch (err) {
        if (active) {
          console.error("Failed to fetch availability:", err);
          setSlotsError("Could not calculate slots for this date. Please try another day.");
          setAvailableSlots([]);
          setSelectedSlot(null);
        }
      } finally {
        if (active) {
          setIsLoadingSlots(false);
        }
      }
    }

    loadAvailability();

    return () => {
      active = false;
    };
  }, [selectedService.id, selectedDateIso]);

  const refreshAvailability = useCallback(async () => {
    setIsLoadingSlots(true);
    setSlotsError(null);
    try {
      const res = await fetch(
        `/api/availability?serviceId=${encodeURIComponent(selectedService.id)}&date=${encodeURIComponent(selectedDateIso)}&timezone=Asia/Kolkata`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.slots)) {
        setAvailableSlots(data.slots);
        const firstAvailable = data.slots.find((s: SlotResponse) => s.available);
        setSelectedSlot(firstAvailable || null);
      }
    } catch {
      setSlotsError("Could not calculate slots for this date. Please try another day.");
    } finally {
      setIsLoadingSlots(false);
    }
  }, [selectedService.id, selectedDateIso]);

  const validateStep4 = (): boolean => {
    const errors: { name?: string; email?: string } = {};
    if (!clientName.trim() || clientName.trim().length < 2) {
      errors.name = "Please provide your full name (minimum 2 characters).";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!clientEmail.trim() || !emailRegex.test(clientEmail.trim())) {
      errors.email = "Please provide a valid corporate or personal email address.";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 3) {
      if (!selectedSlot || !selectedSlot.available) {
        setValidationErrors({ slot: "Please choose an available consultation time slot." });
        return;
      }
      setValidationErrors({});
    }

    if (currentStep === 4) {
      if (!validateStep4()) return;
    }

    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setValidationErrors({});
    }
  };

  const handlePersistBooking = async () => {
    if (!selectedSlot) return;

    setIsSubmitting(true);
    setValidationErrors({});

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
          setValidationErrors({
            general: "This time window was just reserved by another client. Please select another slot.",
          });
          setCurrentStep(3);
          refreshAvailability();
          return;
        }

        if (response.status === 400 && data.details) {
          setValidationErrors({
            general: `Validation error: ${data.details.map((d: { message: string }) => d.message).join(", ")}`,
          });
          return;
        }

        throw new Error(data.error || "Failed to persist appointment");
      }

      // Success: Save private token to local session for client lookup
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
        // ignore storage error
      }

      setConfirmedBooking(record);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected server error occurred.";
      setValidationErrors({
        general: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetWizard = () => {
    setConfirmedBooking(null);
    setCurrentStep(1);
    setClientName("");
    setClientEmail("");
    setNotes("");
    setValidationErrors({});
    refreshAvailability();
  };

  const handleCopyPrivateUrl = () => {
    if (typeof window !== "undefined" && confirmedBooking) {
      const fullUrl = `${window.location.origin}${confirmedBooking.managementUrl}`;
      navigator.clipboard.writeText(fullUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Split available slots into Morning and Afternoon groups
  const morningSlots = availableSlots.filter((s) => {
    const hour = new Date(s.startTime).getUTCHours();
    // Convert to IST (UTC + 5:30) approx
    const istHour = (hour + 5.5) % 24;
    return istHour < 12;
  });

  const afternoonSlots = availableSlots.filter((s) => {
    const hour = new Date(s.startTime).getUTCHours();
    const istHour = (hour + 5.5) % 24;
    return istHour >= 12;
  });

  // SUCCESS / CONFIRMATION MODAL VIEW
  if (confirmedBooking) {
    const startDate = new Date(confirmedBooking.startTime);
    const endDate = new Date(confirmedBooking.endTime);
    const startIsoClean = startDate.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const endIsoClean = endDate.toISOString().replace(/-|:|\.\d\d\d/g, "");

    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      confirmedBooking.serviceTitle + " - Slotly Advisory"
    )}&dates=${startIsoClean}/${endIsoClean}&details=${encodeURIComponent(
      `Private technical advisory session with Hemant Pandey.\n\nManagement URL: ${
        typeof window !== "undefined" ? window.location.origin : ""
      }${confirmedBooking.managementUrl}`
    )}&location=${encodeURIComponent("Google Meet (link in calendar invite)")}`;

    return (
      <motion.div
        initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="max-w-3xl mx-auto rounded-3xl border border-emerald-500/40 bg-gradient-to-b from-[#070b16] via-[#04060e] to-[#04060e] p-8 md:p-12 text-left shadow-2xl backdrop-blur-2xl relative overflow-hidden"
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />

        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-semibold shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Persisted in PostgreSQL Neon</span>
          </div>

          <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest font-semibold px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08]">
            REF: {confirmedBooking.id}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/[0.08]">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-zinc-950 shrink-0 shadow-lg shadow-emerald-500/25">
              <Check className="w-7 h-7" strokeWidth={3} />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Advisory Session Confirmed!
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed font-sans mt-1">
                Your appointment has been locked with millisecond atomicity. A confirmation receipt has been scheduled for delivery to <strong className="text-white">{confirmedBooking.clientEmail}</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 pr-4 rounded-xl bg-white/[0.03] border border-white/10 shrink-0 self-start sm:self-auto">
            <Image
              src="/images/dev_hemantpandey.jpg"
              alt="Hemant Pandey"
              width={38}
              height={38}
              className="w-9 h-9 rounded-full object-cover ring-1 ring-white/20"
            />
            <div className="text-left font-sans">
              <div className="text-xs font-semibold text-white">Hemant Pandey</div>
              <div className="text-[10px] text-zinc-400 font-mono">Lead Advisor</div>
            </div>
          </div>
        </div>

        {/* Crucial Security Token Callout Box */}
        <div className="p-6 rounded-2xl bg-[#090d1a] border border-emerald-500/30 mb-8 space-y-3 shadow-inner">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-300 font-semibold flex items-center gap-2">
              <Lock className="w-3.5 h-3.5" />
              <span>Zero-Plaintext Customer Access Token</span>
            </span>
            <span className="text-[11px] font-mono text-zinc-400">
              SHA-256 Authenticated
            </span>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed font-sans">
            Bookmark or save this private link to view your booking details or request a cancellation at any time. We store zero plaintext passwords in our database.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
            <div className="flex-1 p-3 rounded-xl bg-[#04060e] border border-white/10 font-mono text-xs text-emerald-300 select-all overflow-x-auto truncate">
              {typeof window !== "undefined"
                ? `${window.location.origin}${confirmedBooking.managementUrl}`
                : confirmedBooking.managementUrl}
            </div>
            <button
              type="button"
              onClick={handleCopyPrivateUrl}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white text-xs font-mono border border-white/15 transition-all shrink-0 cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? "Copied" : "Copy Link"}</span>
            </button>
          </div>
        </div>

        {/* Booking Summary Spec Sheet */}
        <div className="p-6 rounded-2xl bg-[#070b16] border border-white/10 space-y-4 font-mono text-xs mb-8">
          <div className="flex justify-between items-center border-b border-white/[0.06] pb-3">
            <span className="text-zinc-400">Advisory Practice:</span>
            <span className="text-white font-semibold">
              {confirmedBooking.serviceTitle}
            </span>
          </div>
          <div className="flex justify-between items-center border-b border-white/[0.06] pb-3">
            <span className="text-zinc-400">Scheduled Window:</span>
            <span className="text-emerald-300 font-semibold">
              {selectedDayLabel} • {selectedSlot?.displayRange} ({confirmedBooking.timezone})
            </span>
          </div>
          <div className="flex justify-between items-center border-b border-white/[0.06] pb-3">
            <span className="text-zinc-400">Client Details:</span>
            <span className="text-zinc-200">
              {confirmedBooking.clientName} &lt;{confirmedBooking.clientEmail}&gt;
            </span>
          </div>
          <div className="flex justify-between items-center border-b border-white/[0.06] pb-3">
            <span className="text-zinc-400">Consulting Fee:</span>
            <span className="text-white font-bold text-sm">
              ₹{confirmedBooking.feeINR.toLocaleString("en-IN")} INR
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-400">Database Status:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] uppercase font-bold tracking-wider">
              {confirmedBooking.status}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={confirmedBooking.managementUrl}
            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white text-zinc-950 font-mono text-xs font-semibold hover:bg-zinc-100 transition-all shadow-md"
          >
            <span>Open Private Booking Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <a
            href={googleCalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white font-mono text-xs border border-white/15 transition-all"
          >
            <CalendarIcon className="w-3.5 h-3.5 text-blue-400" />
            <span>Add to Google Calendar</span>
            <ExternalLink className="w-3 h-3 text-zinc-400" />
          </a>

          <button
            type="button"
            onClick={resetWizard}
            className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-transparent hover:bg-white/[0.05] text-zinc-400 hover:text-white font-mono text-xs transition-all cursor-pointer"
          >
            <span>Book Another Session</span>
          </button>
        </div>
      </motion.div>
    );
  }

  // WIZARD MULTI-STEP FLOW
  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Stepper Bar */}
      <div className="mb-10">
        <div className="grid grid-cols-5 gap-2 sm:gap-4 text-center">
          {STEPS.map((s) => {
            const isCompleted = s.step < currentStep;
            const isCurrent = s.step === currentStep;
            return (
              <div key={s.step} className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono text-xs font-semibold mb-2 transition-all ${
                    isCurrent
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/50"
                      : isCompleted
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/40"
                      : "bg-[#070b16] text-zinc-500 border border-white/10"
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[2.5]" /> : s.step}
                </div>
                <span
                  className={`text-xs font-mono uppercase tracking-wider hidden sm:block ${
                    isCurrent ? "text-white font-semibold" : "text-zinc-500"
                  }`}
                >
                  {s.label}
                </span>
                <span className="text-[10px] text-zinc-500 hidden md:block">
                  {s.subtitle}
                </span>
              </div>
            );
          })}
        </div>
        <div className="relative mt-4 h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400"
            initial={false}
            animate={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Main Step Container Card */}
      <div className="rounded-3xl border border-white/10 bg-[#070b16]/90 p-6 sm:p-10 backdrop-blur-2xl shadow-2xl relative text-left">
        <AnimatePresence mode="wait">
          {/* STEP 1: Select Service */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-indigo-400 font-semibold">
                  Step 01 // Selection
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
                  Choose an Advisory Practice
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1 font-sans">
                  Connected to PostgreSQL service registry with verified durations and fees.
                </p>
              </div>

              <div className="space-y-3">
                {services.map((svc) => {
                  const isSelected = selectedService.id === svc.id;
                  return (
                    <div
                      key={svc.id}
                      onClick={() => setSelectedService(svc)}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? "bg-gradient-to-r from-indigo-950/40 to-[#04060e] border-indigo-500/80 shadow-lg shadow-indigo-950/60 ring-1 ring-indigo-500/50"
                          : "bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-base sm:text-lg text-white font-semibold">
                            {svc.title}
                          </span>
                          <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/[0.05] text-zinc-300 border border-white/10">
                            {svc.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 font-mono text-sm">
                          <span className="text-zinc-400 text-xs flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {svc.durationMinutes} mins
                          </span>
                          <span className="text-emerald-400 font-bold">
                            ₹{svc.feeINR.toLocaleString("en-IN")} INR
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                        {svc.tagline}
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 2: Choose Date */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-indigo-400 font-semibold">
                  Step 02 // Cadence
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
                  Select an Available Date
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1 font-sans">
                  Configured against availability rules in Asia/Kolkata timezone (Mon–Sat active cadence).
                </p>
              </div>

              {/* Custom Date Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
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
                      className={`p-4 rounded-2xl border text-center transition-all ${
                        day.isSunday
                          ? "opacity-35 cursor-not-allowed bg-white/[0.01] border-white/[0.05]"
                          : isSelected
                          ? "bg-gradient-to-b from-indigo-600 to-indigo-900 border-indigo-400 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400 cursor-pointer"
                          : "bg-white/[0.03] border-white/10 text-zinc-400 hover:text-white hover:border-white/25 cursor-pointer"
                      }`}
                    >
                      <div className="font-mono text-xs uppercase tracking-widest opacity-80 mb-1">
                        {day.weekday}
                      </div>
                      <div className="text-2xl font-bold font-mono text-white mb-1">
                        {day.dayNumber}
                      </div>
                      <div className="font-mono text-[10px] text-zinc-400">
                        {day.isSunday ? "Closed" : day.dayLabel.split(",")[1]?.trim()}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="p-4 rounded-xl bg-[#04060e] border border-white/10 text-xs font-mono text-zinc-400 flex items-center justify-between">
                <span>Selected Day: <strong className="text-white">{selectedDayLabel}</strong></span>
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Timezone: Asia/Kolkata (IST)
                </span>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Choose Time Slot */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-indigo-400 font-semibold">
                  Step 03 // Precision
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
                  Choose a Window for {selectedDayLabel}
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1 font-sans">
                  Availability computed directly from PostgreSQL rules and real-time locked sessions.
                </p>
              </div>

              {isLoadingSlots ? (
                <div className="py-16 text-center text-xs font-mono text-zinc-400 space-y-3">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-emerald-400 border-r-transparent" />
                  <div>Querying availability engine from PostgreSQL...</div>
                </div>
              ) : slotsError ? (
                <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-xs font-mono text-rose-300">
                  {slotsError}
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="p-8 rounded-2xl bg-[#04060e] border border-white/10 text-center text-xs text-zinc-400 font-mono">
                  No consultation windows open on this day. Please choose another date.
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Morning Group */}
                  {morningSlots.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3">
                        <Sun className="w-3.5 h-3.5 text-amber-400" />
                        <span>Morning Windows (09:30 - 12:00 IST)</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {morningSlots.map((slot) => {
                          const isSelected = selectedSlot?.id === slot.id;
                          return (
                            <button
                              key={slot.id}
                              type="button"
                              disabled={!slot.available}
                              onClick={() => {
                                setSelectedSlot(slot);
                                setValidationErrors({});
                              }}
                              className={`p-4 rounded-xl border text-left font-mono text-xs transition-all flex items-center justify-between cursor-pointer ${
                                !slot.available
                                  ? "bg-white/[0.015] border-white/[0.05] text-zinc-600 cursor-not-allowed line-through"
                                  : isSelected
                                  ? "bg-emerald-950/60 border-emerald-400 text-emerald-300 shadow-md ring-1 ring-emerald-400/50"
                                  : "bg-white/[0.03] border-white/10 text-zinc-200 hover:border-white/25 hover:bg-white/[0.06]"
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <span
                                  className={`h-2 w-2 rounded-full ${
                                    !slot.available
                                      ? "bg-zinc-700"
                                      : isSelected
                                      ? "bg-emerald-400"
                                      : "bg-zinc-500"
                                  }`}
                                />
                                <span className="font-semibold text-sm">{slot.displayRange}</span>
                              </div>
                              <span className="text-[10px] uppercase tracking-wider">
                                {isSelected ? (
                                  <span className="text-emerald-300 flex items-center gap-1 font-bold">
                                    <Lock className="w-2.5 h-2.5" />
                                    Selected
                                  </span>
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

                  {/* Afternoon Group */}
                  {afternoonSlots.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3">
                        <Sunset className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Afternoon &amp; Evening Windows (12:00 - 18:00 IST)</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {afternoonSlots.map((slot) => {
                          const isSelected = selectedSlot?.id === slot.id;
                          return (
                            <button
                              key={slot.id}
                              type="button"
                              disabled={!slot.available}
                              onClick={() => {
                                setSelectedSlot(slot);
                                setValidationErrors({});
                              }}
                              className={`p-4 rounded-xl border text-left font-mono text-xs transition-all flex items-center justify-between cursor-pointer ${
                                !slot.available
                                  ? "bg-white/[0.015] border-white/[0.05] text-zinc-600 cursor-not-allowed line-through"
                                  : isSelected
                                  ? "bg-emerald-950/60 border-emerald-400 text-emerald-300 shadow-md ring-1 ring-emerald-400/50"
                                  : "bg-white/[0.03] border-white/10 text-zinc-200 hover:border-white/25 hover:bg-white/[0.06]"
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <span
                                  className={`h-2 w-2 rounded-full ${
                                    !slot.available
                                      ? "bg-zinc-700"
                                      : isSelected
                                      ? "bg-emerald-400"
                                      : "bg-zinc-500"
                                  }`}
                                />
                                <span className="font-semibold text-sm">{slot.displayRange}</span>
                              </div>
                              <span className="text-[10px] uppercase tracking-wider">
                                {isSelected ? (
                                  <span className="text-emerald-300 flex items-center gap-1 font-bold">
                                    <Lock className="w-2.5 h-2.5" />
                                    Selected
                                  </span>
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

              {validationErrors.slot && (
                <p className="text-xs text-rose-400 font-mono">
                  {validationErrors.slot}
                </p>
              )}
            </motion.div>
          )}

          {/* STEP 4: Client Intake Details */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-indigo-400 font-semibold">
                  Step 04 // Intake
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
                  Client &amp; Consultation Brief
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1 font-sans">
                  Validated server-side to guarantee accurate calendar invitations and agenda briefs.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    Full Name <span className="text-indigo-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => {
                        setClientName(e.target.value);
                        if (validationErrors.name) setValidationErrors((prev) => ({ ...prev, name: undefined }));
                      }}
                      placeholder="e.g. Vikram Sharma"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl bg-[#04060e] border text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 transition-all ${
                        validationErrors.name
                          ? "border-rose-500 focus:ring-rose-500"
                          : "border-white/10 focus:border-indigo-500 focus:ring-indigo-500"
                      }`}
                    />
                  </div>
                  {validationErrors.name && (
                    <p className="mt-1 text-xs text-rose-400 font-mono">
                      {validationErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    Corporate Email Address <span className="text-indigo-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => {
                        setClientEmail(e.target.value);
                        if (validationErrors.email) setValidationErrors((prev) => ({ ...prev, email: undefined }));
                      }}
                      placeholder="e.g. vikram@acmetech.com"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl bg-[#04060e] border text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 transition-all ${
                        validationErrors.email
                          ? "border-rose-500 focus:ring-rose-500"
                          : "border-white/10 focus:border-indigo-500 focus:ring-indigo-500"
                      }`}
                    />
                  </div>
                  {validationErrors.email && (
                    <p className="mt-1 text-xs text-rose-400 font-mono">
                      {validationErrors.email}
                    </p>
                  )}
                  <p className="text-[11px] text-zinc-500 mt-1 font-sans">
                    Your appointment receipt, token, and video conference link will be sent here.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    Session Focus &amp; Technical Context{" "}
                    <span className="text-zinc-600">(Optional)</span>
                  </label>
                  <div className="relative">
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Describe specific architecture bottlenecks, scaling hurdles, or codebases you wish to review during this session..."
                      className="w-full p-4 rounded-xl bg-[#04060e] border border-white/10 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none font-sans"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 5: Review & Submit to PostgreSQL */}
          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-indigo-400 font-semibold">
                  Step 05 // Verification
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
                  Confirm &amp; Persist Booking
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1 font-sans">
                  Submitting will lock the slot atomically and write the appointment to PostgreSQL.
                </p>
              </div>

              {validationErrors.general && (
                <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-800 text-xs font-mono text-rose-300">
                  {validationErrors.general}
                </div>
              )}

              {/* Consultant Identity Spec */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="relative shrink-0">
                  <Image
                    src="/images/dev_hemantpandey.jpg"
                    alt="Hemant Pandey"
                    width={44}
                    height={44}
                    className="w-11 h-11 rounded-xl object-cover ring-1 ring-white/20 shadow-md"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#070b16]" />
                </div>
                <div className="text-left font-sans">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">Hemant Pandey</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-300">
                      Available
                    </span>
                  </div>
                  <div className="text-xs text-zinc-400 font-mono mt-0.5">
                    Lead Technology Consultant &amp; Architect
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#04060e] border border-white/10 space-y-4 font-mono text-xs">
                <div className="flex justify-between items-center border-b border-white/[0.06] pb-3">
                  <span className="text-zinc-400">Service Track:</span>
                  <span className="text-white font-semibold text-sm">
                    {selectedService.title}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-white/[0.06] pb-3">
                  <span className="text-zinc-400">Duration:</span>
                  <span className="text-zinc-200">
                    {selectedService.durationMinutes} Minutes Private Advisory
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-white/[0.06] pb-3">
                  <span className="text-zinc-400">Scheduled Window:</span>
                  <span className="text-emerald-400 font-semibold">
                    {selectedDayLabel} • {selectedSlot?.displayRange} (Asia/Kolkata)
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-white/[0.06] pb-3">
                  <span className="text-zinc-400">Client Details:</span>
                  <span className="text-zinc-200">
                    {clientName} &lt;{clientEmail}&gt;
                  </span>
                </div>
                {notes && (
                  <div className="border-b border-white/[0.06] pb-3">
                    <span className="text-zinc-400 block mb-1">
                      Session Agenda Notes:
                    </span>
                    <p className="text-white font-sans text-xs bg-[#070b16] p-3 rounded-xl border border-white/[0.08]">
                      {notes}
                    </p>
                  </div>
                )}
                <div className="flex justify-between items-center pt-1 text-sm">
                  <span className="text-white font-semibold">Consulting Fee:</span>
                  <span className="text-emerald-400 font-bold text-base">
                    ₹{selectedService.feeINR.toLocaleString("en-IN")} INR
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-white/[0.08] flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 text-xs font-mono transition-all border border-white/10 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-100 font-mono text-xs font-semibold transition-all shadow-md cursor-pointer"
            >
              <span>Continue to Step {currentStep + 1}</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-950" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handlePersistBooking}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-mono text-xs font-bold tracking-wide transition-all shadow-lg shadow-emerald-500/25 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-zinc-950 border-r-transparent rounded-full animate-spin" />
                  <span>Locking Slot in PostgreSQL...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-zinc-950" />
                  <span>Confirm &amp; Lock Session ✓</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
