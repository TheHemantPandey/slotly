"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  ExternalLink,
  AlertTriangle,
  Lock,
} from "lucide-react";

interface CustomerAppointment {
  id: string;
  serviceId: string;
  serviceTitle: string;
  serviceDuration: number;
  clientName: string;
  clientEmail: string;
  clientNotes?: string;
  startTime: string; // ISO UTC
  endTime: string;   // ISO UTC
  timezone: string;
  feeINR: number;
  currency: string;
  status: "PENDING_INTAKE" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  cancellationReason?: string;
  cancelledAt?: string;
  createdAt: string;
}

interface CustomerBookingViewProps {
  token: string;
}

export function CustomerBookingView({ token }: CustomerBookingViewProps) {
  const [appointment, setAppointment] = useState<CustomerAppointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Cancellation State
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [cancelSuccessMsg, setCancelSuccessMsg] = useState<string | null>(null);

  const fetchBooking = useCallback(async (isManual = false) => {
    if (isManual) {
      setIsLoading(true);
      setErrorMessage(null);
    }

    try {
      const response = await fetch("/api/customer/booking", {
        headers: {
          "x-booking-token": token,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Booking record not found or access credential is invalid.");
      }

      if (data.success && data.appointment) {
        setAppointment(data.appointment);
      } else {
        throw new Error("Invalid response from server.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load booking details.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    let active = true;

    async function initialFetch() {
      try {
        const response = await fetch("/api/customer/booking", {
          headers: {
            "x-booking-token": token,
          },
        });

        const data = await response.json();

        if (active) {
          if (!response.ok) {
            setErrorMessage(data.error || "Booking record not found or access credential is invalid.");
          } else if (data.success && data.appointment) {
            setAppointment(data.appointment);
          } else {
            setErrorMessage("Invalid response from server.");
          }
        }
      } catch (err: unknown) {
        if (active) {
          const msg = err instanceof Error ? err.message : "Failed to load booking details.";
          setErrorMessage(msg);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    initialFetch();

    return () => {
      active = false;
    };
  }, [token]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCancelBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCancelling(true);
    setCancelError(null);

    try {
      const response = await fetch("/api/customer/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-booking-token": token,
        },
        body: JSON.stringify({
          reason: cancelReason.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to cancel appointment.");
      }

      setIsCancelModalOpen(false);
      setCancelSuccessMsg("Your appointment has been cancelled successfully and the slot has been returned to the pool.");
      await fetchBooking();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Cancellation failed.";
      setCancelError(msg);
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-[#070b16]/90 p-12 text-center space-y-4 backdrop-blur-xl shadow-2xl">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-emerald-400 border-r-transparent" />
        <div className="font-mono text-xs text-zinc-400">
          Verifying SHA-256 cryptographic booking credential...
        </div>
      </div>
    );
  }

  if (errorMessage || !appointment) {
    return (
      <div className="rounded-3xl border border-rose-500/30 bg-[#070b16]/95 p-8 md:p-12 text-center max-w-xl mx-auto shadow-2xl backdrop-blur-2xl">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-6">
          <XCircle className="w-7 h-7" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
          Access Restricted or Not Found
        </h2>
        <p className="text-sm text-zinc-400 leading-relaxed mb-8 font-sans">
          {errorMessage || "We could not find an appointment associated with this access key. Please verify your private management link."}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link
            href="/book"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-zinc-950 font-mono text-xs font-semibold hover:bg-zinc-100 transition-all shadow-md"
          >
            <span>Book an Advisory Session</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white font-mono text-xs border border-white/10 transition-all"
          >
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    );
  }

  const isCancelled = appointment.status === "CANCELLED";
  const startLocal = new Date(appointment.startTime);
  const endLocal = new Date(appointment.endTime);

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: appointment.timezone,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: appointment.timezone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const startIsoClean = startLocal.toISOString().replace(/-|:|\.\d\d\d/g, "");
  const endIsoClean = endLocal.toISOString().replace(/-|:|\.\d\d\d/g, "");
  const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    appointment.serviceTitle + " - Slotly Advisory"
  )}&dates=${startIsoClean}/${endIsoClean}&details=${encodeURIComponent(
    `Private technical advisory session with Hemant Pandey.\n\nManagement: ${
      typeof window !== "undefined" ? window.location.href : ""
    }`
  )}&location=${encodeURIComponent("Google Meet (link in calendar invite)")}`;

  return (
    <div className="space-y-6">
      {/* Success Notification */}
      {cancelSuccessMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs font-mono flex items-center justify-between shadow-lg"
        >
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>{cancelSuccessMsg}</span>
          </span>
          <button
            type="button"
            onClick={() => setCancelSuccessMsg(null)}
            className="text-amber-400 hover:text-white font-mono text-sm px-2 cursor-pointer"
          >
            ✕
          </button>
        </motion.div>
      )}

      {/* Main Private Dashboard Card */}
      <div className="rounded-3xl border border-white/10 bg-[#070b16]/95 p-8 md:p-12 text-left relative overflow-hidden shadow-2xl backdrop-blur-2xl">
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 relative z-10">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-mono text-xs font-semibold">
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Private Executive Reservation</span>
            </div>

            {isCancelled ? (
              <span className="px-3 py-1 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold tracking-wider">
                CANCELLED
              </span>
            ) : appointment.status === "COMPLETED" ? (
              <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-mono font-bold tracking-wider">
                COMPLETED
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                CONFIRMED
              </span>
            )}
          </div>

          <span className="font-mono text-xs text-zinc-400 px-3 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08]">
            REF: {appointment.id}
          </span>
        </div>

        {/* Title & Consultant */}
        <div className="mb-8 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-1.5">
              {appointment.serviceTitle}
            </h1>
            <p className="text-sm text-zinc-400 font-sans">
              {appointment.serviceDuration} Minute Structured Advisory Session
            </p>
          </div>

          <div className="flex items-center gap-3 p-2.5 pr-4 rounded-xl bg-white/[0.03] border border-white/10 shrink-0 self-start md:self-auto shadow-sm">
            <div className="relative">
              <Image
                src="/images/dev_hemantpandey.jpg"
                alt="Hemant Pandey"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30 shadow-md"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#070b16]" />
            </div>
            <div className="text-left font-sans">
              <div className="text-xs font-semibold text-white">Hemant Pandey</div>
              <div className="text-[11px] text-zinc-400 font-mono">Lead Systems Architect</div>
            </div>
          </div>
        </div>

        {/* Appointment Overview Two-Column Spec Box */}
        <div className="p-6 rounded-2xl bg-[#04060e] border border-white/10 space-y-4 font-mono text-xs mb-8 relative z-10 shadow-inner">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-white/[0.06] pb-3 gap-1">
            <span className="text-zinc-400">Scheduled Date:</span>
            <span className="text-white font-semibold text-sm">
              {dateFormatter.format(startLocal)}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-white/[0.06] pb-3 gap-1">
            <span className="text-zinc-400">Time Window:</span>
            <span className="text-emerald-400 font-semibold text-sm">
              {timeFormatter.format(startLocal)} – {timeFormatter.format(endLocal)} ({appointment.timezone})
            </span>
          </div>

          <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-white/[0.06] pb-3 gap-1">
            <span className="text-zinc-400">Client Information:</span>
            <span className="text-zinc-200">
              {appointment.clientName} &lt;{appointment.clientEmail}&gt;
            </span>
          </div>

          <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-white/[0.06] pb-3 gap-1">
            <span className="text-zinc-400">Consulting Investment:</span>
            <span className="text-white font-bold text-sm">
              ₹{appointment.feeINR.toLocaleString("en-IN")} INR
            </span>
          </div>

          {appointment.clientNotes && (
            <div className="border-b border-white/[0.06] pb-3">
              <span className="text-zinc-400 block mb-1">Intake Notes / Agenda:</span>
              <p className="text-white font-sans text-xs bg-[#070b16] p-3 rounded-xl border border-white/[0.08] leading-relaxed whitespace-pre-wrap">
                {appointment.clientNotes}
              </p>
            </div>
          )}

          {isCancelled && (
            <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 text-rose-300">
              <span className="font-semibold block mb-1 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Cancellation Notice</span>
              </span>
              <p className="font-sans text-xs text-zinc-300">
                {appointment.cancellationReason || "No specific reason provided."}
              </p>
              {appointment.cancelledAt && (
                <span className="text-[10px] text-rose-400/80 block mt-1">
                  Cancelled on: {new Date(appointment.cancelledAt).toLocaleString("en-US", { timeZone: appointment.timezone })}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Security & Link Management */}
        <div className="p-5 rounded-2xl bg-[#090d1a] border border-white/10 text-xs text-zinc-400 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="text-white font-semibold block mb-0.5">
              Confidential Self-Service Access Link
            </span>
            <span className="text-[11px] text-zinc-400 font-sans">
              Bookmark this URL to access your session agenda or make adjustments at any time. Protected with SHA-256 entropy.
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white font-mono text-xs border border-white/15 transition-all shrink-0 cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? "Link Copied" : "Copy Management Link"}</span>
          </button>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/[0.08] relative z-10">
          <div className="flex flex-wrap items-center gap-3">
            {!isCancelled && (
              <a
                href={googleCalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white font-mono text-xs border border-white/15 transition-all"
              >
                <CalendarIcon className="w-4 h-4 text-blue-400" />
                <span>Add to Google Calendar</span>
                <ExternalLink className="w-3 h-3 text-zinc-400" />
              </a>
            )}

            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-transparent hover:bg-white/[0.05] text-zinc-400 hover:text-white font-mono text-xs transition-all"
            >
              <span>Browse All Tracks</span>
            </Link>
          </div>

          {!isCancelled && (
            <button
              type="button"
              onClick={() => setIsCancelModalOpen(true)}
              className="px-5 py-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-mono text-xs font-semibold border border-rose-500/30 transition-all cursor-pointer"
            >
              Cancel Advisory Booking
            </button>
          )}
        </div>
      </div>

      {/* Cancellation Modal */}
      <AnimatePresence>
        {isCancelModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={shouldReduceMotion ? {} : { opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg"
            >
              <div className="rounded-3xl border border-rose-500/40 bg-[#070b16] p-6 sm:p-8 text-left shadow-2xl relative">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-rose-400" />
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      Cancel Advisory Session
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCancelModalOpen(false)}
                    className="text-zinc-400 hover:text-white font-mono text-sm cursor-pointer p-1"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed mb-6 font-sans">
                  Are you sure you want to cancel this booking? This will immediately release the time window in PostgreSQL so other engineering teams can reserve it.
                </p>

                {cancelError && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-mono">
                    {cancelError}
                  </div>
                )}

                <form onSubmit={handleCancelBooking} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-2">
                      Reason for Cancellation (Optional)
                    </label>
                    <textarea
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      rows={3}
                      placeholder="e.g., Schedule conflict, project priorities shifted..."
                      className="w-full p-3.5 rounded-xl bg-[#04060e] border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:border-rose-500 font-sans text-xs resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
                    <button
                      type="button"
                      onClick={() => setIsCancelModalOpen(false)}
                      disabled={isCancelling}
                      className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-400 hover:text-white text-xs font-mono transition-all cursor-pointer"
                    >
                      Keep Booking
                    </button>
                    <button
                      type="submit"
                      disabled={isCancelling}
                      className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-semibold transition-all shadow-md cursor-pointer disabled:opacity-50"
                    >
                      {isCancelling ? "Cancelling..." : "Confirm Cancellation"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
