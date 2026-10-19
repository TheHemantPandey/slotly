"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  Search,
  KeyRound,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Trash2,
  RefreshCw,
} from "lucide-react";

interface PersistedAppointmentItem {
  id: string;
  serviceId: string;
  serviceTitle: string;
  serviceDuration?: number;
  clientName: string;
  clientEmail: string;
  clientNotes?: string;
  startTime: string; // ISO UTC
  endTime: string;   // ISO UTC
  timezone: string;
  feeINR: number;
  status: "PENDING_INTAKE" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  cancellationReason?: string;
  cancelledAt?: string;
  createdAt: string;
  token?: string;
}

type FilterTab = "upcoming" | "all" | "past" | "cancelled";

export function AppointmentsManager() {
  const shouldReduceMotion = useReducedMotion();

  const [appointments, setAppointments] = useState<PersistedAppointmentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>("upcoming");
  const [referenceTime, setReferenceTime] = useState<number>(0);

  // Private Key Lookup State
  const [lookupToken, setLookupToken] = useState("");
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [previewBooking, setPreviewBooking] = useState<{
    appointment: PersistedAppointmentItem;
    cleanToken: string;
  } | null>(null);

  // Format validation helper
  const cleanInputToken = (input: string) => {
    let t = input.trim();
    if (t.includes("/my-booking/")) {
      t = t.split("/my-booking/")[1].split("?")[0].trim();
    }
    return t;
  };

  const isHex64 = /^[a-fA-F0-9]{64}$/.test(cleanInputToken(lookupToken));

  // Fetch verified appointments belonging to the client using their locally stored private tokens
  const loadClientBookings = useCallback(async (isManual = false) => {
    if (typeof window === "undefined") return;

    if (isManual) {
      setIsLoading(true);
    }

    try {
      const stored = localStorage.getItem("slotly_user_tokens");
      if (!stored) {
        setAppointments([]);
        setIsLoading(false);
        return;
      }

      const tokenItems: { id: string; token: string }[] = JSON.parse(stored);
      if (!Array.isArray(tokenItems) || tokenItems.length === 0) {
        setAppointments([]);
        setIsLoading(false);
        return;
      }

      // Query customer endpoint for each token securely via x-booking-token header
      const fetchPromises = tokenItems.map(async (item) => {
        try {
          const res = await fetch("/api/customer/booking", {
            headers: {
              "x-booking-token": item.token,
            },
          });
          if (!res.ok) return null;
          const data = await res.json();
          if (data.success && data.appointment) {
            return {
              ...data.appointment,
              token: item.token,
            } as PersistedAppointmentItem;
          }
          return null;
        } catch {
          return null;
        }
      });

      const results = await Promise.all(fetchPromises);
      const validAppointments = results.filter(
        (apt): apt is PersistedAppointmentItem => apt !== null
      );

      validAppointments.sort(
        (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );

      setAppointments(validAppointments);
    } catch {
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const timer = setTimeout(() => {
      if (active) {
        setReferenceTime(Date.now());
        loadClientBookings();
      }
    }, 0);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [loadClientBookings]);

  // Lookup by private token/key
  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanToken = cleanInputToken(lookupToken);
    if (!cleanToken) return;

    setIsLookingUp(true);
    setLookupError(null);
    setPreviewBooking(null);

    try {
      const res = await fetch("/api/customer/booking", {
        headers: {
          "x-booking-token": cleanToken,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Booking not found with this private token.");
      }

      // Save token to client's local list if not already saved
      try {
        const stored = JSON.parse(localStorage.getItem("slotly_user_tokens") || "[]");
        if (!stored.some((item: { token: string }) => item.token === cleanToken)) {
          stored.unshift({ id: data.appointment.id, token: cleanToken });
          localStorage.setItem("slotly_user_tokens", JSON.stringify(stored));
        }
      } catch {
        // ignore storage error
      }

      setPreviewBooking({
        appointment: data.appointment,
        cleanToken,
      });
      loadClientBookings();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid booking token or record not found.";
      setLookupError(msg);
    } finally {
      setIsLookingUp(false);
    }
  };

  const handleClearSavedTokens = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("slotly_user_tokens");
      setAppointments([]);
    }
  };

  const upcomingAppointments = appointments.filter(
    (a) => (referenceTime === 0 || new Date(a.startTime).getTime() >= referenceTime) && a.status !== "CANCELLED"
  );
  const pastAppointments = appointments.filter(
    (a) => referenceTime > 0 && new Date(a.startTime).getTime() < referenceTime && a.status !== "CANCELLED"
  );
  const cancelledAppointments = appointments.filter((a) => a.status === "CANCELLED");

  const displayedAppointments =
    activeTab === "upcoming"
      ? upcomingAppointments
      : activeTab === "past"
      ? pastAppointments
      : activeTab === "cancelled"
      ? cancelledAppointments
      : appointments;

  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      {/* Search Console Card */}
      <motion.div
        initial={shouldReduceMotion ? {} : { opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl border border-white/10 bg-[#070b16]/95 p-8 sm:p-10 text-left shadow-2xl backdrop-blur-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Access Private Advisory Session
            </h2>
            <p className="text-xs text-zinc-400 font-sans">
              Enter your SHA-256 management token or full URL to inspect or reschedule your booking.
            </p>
          </div>
        </div>

        <form onSubmit={handleLookup} className="space-y-3 mt-6">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={lookupToken}
              onChange={(e) => {
                setLookupToken(e.target.value);
                if (lookupError) setLookupError(null);
              }}
              placeholder="Paste 64-character token or https://slotly.../my-booking/<token>"
              className={`w-full pl-11 pr-28 py-3.5 rounded-xl bg-[#04060e] border text-xs sm:text-sm font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 transition-all ${
                lookupError
                  ? "border-rose-500 focus:ring-rose-500"
                  : isHex64
                  ? "border-emerald-500/60 focus:border-emerald-500 focus:ring-emerald-500"
                  : "border-white/10 focus:border-indigo-500 focus:ring-indigo-500"
              }`}
            />

            <button
              type="submit"
              disabled={!lookupToken.trim() || isLookingUp}
              className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-mono text-xs font-semibold transition-all shadow-md disabled:opacity-40 cursor-pointer"
            >
              {isLookingUp ? (
                <>
                  <div className="h-3 w-3 border-2 border-white border-r-transparent rounded-full animate-spin" />
                  <span>Verify...</span>
                </>
              ) : (
                <>
                  <span>Verify</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono">
            {lookupError ? (
              <span className="text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {lookupError}
              </span>
            ) : isHex64 ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Valid 64-character SHA-256 token format
              </span>
            ) : (
              <span className="text-zinc-500">
                Format: 64 hexadecimal characters (256-bit entropy)
              </span>
            )}

            <Link
              href="/book"
              className="text-indigo-400 hover:text-indigo-300 transition-colors ml-auto"
            >
              Need to book a new session? →
            </Link>
          </div>
        </form>

        {/* Fetched Result Preview Card */}
        {previewBooking && (
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-6 rounded-2xl bg-[#04060e] border border-emerald-500/40 text-left space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                  Booking Verified
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                  {previewBooking.appointment.status}
                </span>
              </div>
              <span className="font-mono text-xs text-zinc-500">
                ID: {previewBooking.appointment.id}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase">Service Track</span>
                <span className="text-white font-semibold text-sm">
                  {previewBooking.appointment.serviceTitle}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase">Scheduled Window</span>
                <span className="text-emerald-300 font-semibold">
                  {new Date(previewBooking.appointment.startTime).toLocaleString("en-US", {
                    timeZone: previewBooking.appointment.timezone,
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}{" "}
                  ({previewBooking.appointment.timezone})
                </span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase">Client Target</span>
                <span className="text-zinc-300">
                  {previewBooking.appointment.clientName} &lt;{previewBooking.appointment.clientEmail}&gt;
                </span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase">Consulting Fee</span>
                <span className="text-white font-bold">
                  ₹{previewBooking.appointment.feeINR.toLocaleString("en-IN")} INR
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.08] flex justify-end">
              <Link
                href={`/my-booking/${previewBooking.cleanToken}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-zinc-950 font-mono text-xs font-semibold hover:bg-zinc-100 transition-all shadow-md"
              >
                <span>Open Full Management Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Saved Bookings on this Device */}
      <div className="space-y-6 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Saved Sessions on this Browser
            </h3>
            <p className="text-xs text-zinc-400 font-sans mt-0.5">
              Securely indexed via local browser token vault.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {appointments.length > 0 && (
              <button
                type="button"
                onClick={handleClearSavedTokens}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-rose-400 border border-white/10 text-xs font-mono transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Vault</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => loadClientBookings(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/10 text-xs font-mono transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        {appointments.length > 0 && (
          <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3 overflow-x-auto">
            {(
              [
                { id: "upcoming", label: `Upcoming (${upcomingAppointments.length})` },
                { id: "all", label: `All (${appointments.length})` },
                { id: "past", label: `Past (${pastAppointments.length})` },
                { id: "cancelled", label: `Cancelled (${cancelledAppointments.length})` },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-white/[0.1] text-white font-semibold border border-white/15"
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.04] border border-transparent"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Appointments List */}
        {isLoading ? (
          <div className="p-12 text-center text-xs font-mono text-zinc-400 space-y-2">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-emerald-400 border-r-transparent" />
            <div>Querying customer token records...</div>
          </div>
        ) : displayedAppointments.length === 0 ? (
          <div className="p-10 rounded-2xl bg-[#070b16]/60 border border-dashed border-white/10 text-center">
            <p className="text-xs text-zinc-400 font-mono mb-4">
              {appointments.length === 0
                ? "No active booking tokens saved on this device. Use the search console above or book a new session."
                : `No sessions found in "${activeTab}" filter.`}
            </p>
            <Link
              href="/book"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white font-mono text-xs border border-white/15 transition-all"
            >
              <span>Schedule an Advisory Session</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {displayedAppointments.map((apt) => (
              <div
                key={apt.id}
                className="p-6 rounded-2xl bg-[#070b16]/90 border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg backdrop-blur-xl group"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-base font-bold text-white group-hover:text-zinc-100 transition-colors">
                      {apt.serviceTitle}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        apt.status === "CONFIRMED"
                          ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                          : apt.status === "CANCELLED"
                          ? "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                          : "bg-zinc-800 text-zinc-300 border border-zinc-700"
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400">
                    <span className="flex items-center gap-1.5 text-zinc-300">
                      <Calendar className="w-3.5 h-3.5 text-blue-400" />
                      {new Date(apt.startTime).toLocaleDateString("en-US", {
                        timeZone: apt.timezone,
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1.5 text-zinc-300">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      {new Date(apt.startTime).toLocaleTimeString("en-US", {
                        timeZone: apt.timezone,
                        hour: "numeric",
                        minute: "2-digit",
                      })}{" "}
                      ({apt.timezone})
                    </span>
                    <span>₹{apt.feeINR.toLocaleString("en-IN")} INR</span>
                  </div>
                </div>

                {apt.token && (
                  <Link
                    href={`/my-booking/${apt.token}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white text-xs font-mono border border-white/15 transition-all shrink-0"
                  >
                    <span>Manage Session</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
