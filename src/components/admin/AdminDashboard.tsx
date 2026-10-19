"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  ShieldAlert,
  Lock,
  Calendar,
  Clock,
  Mail,
  Search,
  RefreshCw,
  LogOut,
  AlertTriangle,
  CheckCircle2,
  Eye,
  TrendingUp,
  Layers,
  ChevronDown,
} from "lucide-react";

interface AdminStats {
  totalUpcoming: number;
  appointmentsToday: number;
  totalCancelled: number;
  activeServicesCount: number;
}

interface AdminAppointmentItem {
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
  feeInPaise: number;
  feeINR: number;
  currency: string;
  status: "PENDING_INTAKE" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  cancellationReason?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface ServiceOption {
  id: string;
  name: string;
}

const EXIT_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes away from admin panel
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes idle in admin panel
const STORAGE_SAVED_EMAIL_KEY = "slotly_admin_saved_email";
const STORAGE_LAST_ACTIVE_KEY = "slotly_admin_last_active";

export function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminEmail, setAdminEmail] = useState<string>("");
  const shouldReduceMotion = useReducedMotion();

  // Sign-In Form State
  const [emailInput, setEmailInput] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        return localStorage.getItem(STORAGE_SAVED_EMAIL_KEY) || "";
      } catch {
        return "";
      }
    }
    return "";
  });
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [sessionNotice, setSessionNotice] = useState<string | null>(null);

  const [initialTimestamp] = useState(() => Date.now());
  const lastActivityRef = useRef<number>(initialTimestamp);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  // Dashboard Data State
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [appointments, setAppointments] = useState<AdminAppointmentItem[]>([]);
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);

  // Filters State
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [serviceFilter, setServiceFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Inspect / Cancel Modal State
  const [inspectedAppointment, setInspectedAppointment] = useState<AdminAppointmentItem | null>(null);
  const [adminCancelReason, setAdminCancelReason] = useState("");
  const [isAdminCancelling, setIsAdminCancelling] = useState(false);
  const [adminCancelError, setAdminCancelError] = useState<string | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // 1. Check current admin session on mount (with 10-minute away check)
  useEffect(() => {
    let active = true;

    async function checkSession() {
      // Check if user was away from admin panel for more than 10 minutes
      try {
        const lastActiveStr = localStorage.getItem(STORAGE_LAST_ACTIVE_KEY);
        if (lastActiveStr) {
          const lastActive = parseInt(lastActiveStr, 10);
          if (!isNaN(lastActive) && Date.now() - lastActive > EXIT_TIMEOUT_MS) {
            await fetch("/api/admin/auth/logout", { method: "POST" });
            if (active) {
              setIsAuthenticated(false);
              setSessionNotice("You were away from the admin panel for more than 10 minutes. Please enter your password to continue.");
            }
            return;
          }
        }
      } catch {
        // non-blocking
      }

      try {
        const res = await fetch("/api/admin/auth/me");
        const data = await res.json();
        if (active) {
          if (res.ok && data.authenticated && data.admin?.email) {
            setIsAuthenticated(true);
            setAdminEmail(data.admin.email);
            try {
              localStorage.setItem(STORAGE_LAST_ACTIVE_KEY, String(Date.now()));
            } catch {}
          } else {
            setIsAuthenticated(false);
          }
        }
      } catch {
        if (active) setIsAuthenticated(false);
      }
    }

    checkSession();
    return () => {
      active = false;
    };
  }, []);

  // 2. Check 10-minute away timeout when switching back to tab / window focus
  useEffect(() => {
    const handleVisibilityOrFocus = async () => {
      if (document.visibilityState === "visible") {
        try {
          const lastActiveStr = localStorage.getItem(STORAGE_LAST_ACTIVE_KEY);
          if (lastActiveStr && isAuthenticated === true) {
            const lastActive = parseInt(lastActiveStr, 10);
            if (!isNaN(lastActive) && Date.now() - lastActive > EXIT_TIMEOUT_MS) {
              await fetch("/api/admin/auth/logout", { method: "POST" });
              setIsAuthenticated(false);
              setSessionNotice("You were away from the admin panel for more than 10 minutes. Please enter your password to continue.");
              setPasswordInput("");
            }
          }
        } catch {
          // non-blocking
        }
      }
    };

    window.addEventListener("focus", handleVisibilityOrFocus);
    document.addEventListener("visibilitychange", handleVisibilityOrFocus);

    return () => {
      window.removeEventListener("focus", handleVisibilityOrFocus);
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
    };
  }, [isAuthenticated]);

  // 3. 30-minute Inactivity Auto-Logout Tracker
  useEffect(() => {
    if (!isAuthenticated) return;

    lastActivityRef.current = Date.now();
    try {
      localStorage.setItem(STORAGE_LAST_ACTIVE_KEY, String(Date.now()));
    } catch {}

    let throttleTimer: NodeJS.Timeout | null = null;
    const onUserActivity = () => {
      const now = Date.now();
      lastActivityRef.current = now;
      if (!throttleTimer) {
        throttleTimer = setTimeout(() => {
          throttleTimer = null;
          try {
            localStorage.setItem(STORAGE_LAST_ACTIVE_KEY, String(Date.now()));
          } catch {}
        }, 5000);
      }
    };

    const activityEvents = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
      "click",
    ];

    activityEvents.forEach((ev) => {
      window.addEventListener(ev, onUserActivity, { passive: true });
    });

    // Check inactivity every 15 seconds
    const interval = setInterval(async () => {
      const idleTime = Date.now() - lastActivityRef.current;
      if (idleTime >= INACTIVITY_TIMEOUT_MS) {
        try {
          await fetch("/api/admin/auth/logout", { method: "POST" });
        } catch {}
        setIsAuthenticated(false);
        setSessionNotice("You were logged out due to 30 minutes of inactivity. Please enter your password to resume.");
        setPasswordInput("");
      }
    }, 15000);

    return () => {
      activityEvents.forEach((ev) => {
        window.removeEventListener(ev, onUserActivity);
      });
      if (throttleTimer) clearTimeout(throttleTimer);
      clearInterval(interval);
    };
  }, [isAuthenticated]);

  // 4. Auto-focus password input when returning to login with saved email
  useEffect(() => {
    if (isAuthenticated === false && emailInput && passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  }, [isAuthenticated, emailInput]);

  // 2. Fetch services for dropdown
  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch("/api/services");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.services)) {
            setServices(
              data.services.map((s: { id: string; title: string }) => ({
                id: s.id,
                name: s.title,
              }))
            );
          }
        }
      } catch {
        // non-blocking
      }
    }
    fetchServices();
  }, []);

  // 3. Load dashboard appointments and stats
  const loadDashboardData = useCallback(async (isManual = false) => {
    if (isManual) {
      setIsLoadingData(true);
      setDataError(null);
    }

    try {
      const queryParams = new URLSearchParams();
      if (statusFilter !== "ALL") queryParams.set("status", statusFilter);
      if (serviceFilter !== "ALL") queryParams.set("serviceId", serviceFilter);
      if (searchQuery.trim()) queryParams.set("search", searchQuery.trim());

      const [appointmentsRes, statsRes] = await Promise.all([
        fetch(`/api/admin/appointments?${queryParams.toString()}`),
        fetch("/api/admin/stats"),
      ]);

      if (appointmentsRes.status === 401 || statsRes.status === 401) {
        setIsAuthenticated(false);
        return;
      }

      const appointmentsData = await appointmentsRes.json();
      const statsData = await statsRes.json();

      if (appointmentsData.success && Array.isArray(appointmentsData.appointments)) {
        setAppointments(appointmentsData.appointments);
      } else {
        throw new Error(appointmentsData.error || "Failed to load appointments.");
      }

      if (statsData.success && statsData.stats) {
        setStats(statsData.stats);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error fetching dashboard records.";
      setDataError(msg);
    } finally {
      setIsLoadingData(false);
    }
  }, [statusFilter, serviceFilter, searchQuery]);

  useEffect(() => {
    let active = true;

    async function initialFetch() {
      if (!isAuthenticated) return;
      try {
        const queryParams = new URLSearchParams();
        if (statusFilter !== "ALL") queryParams.set("status", statusFilter);
        if (serviceFilter !== "ALL") queryParams.set("serviceId", serviceFilter);
        if (searchQuery.trim()) queryParams.set("search", searchQuery.trim());

        const [appointmentsRes, statsRes] = await Promise.all([
          fetch(`/api/admin/appointments?${queryParams.toString()}`),
          fetch("/api/admin/stats"),
        ]);

        if (appointmentsRes.status === 401 || statsRes.status === 401) {
          if (active) setIsAuthenticated(false);
          return;
        }

        const appointmentsData = await appointmentsRes.json();
        const statsData = await statsRes.json();

        if (active) {
          if (appointmentsData.success && Array.isArray(appointmentsData.appointments)) {
            setAppointments(appointmentsData.appointments);
          }
          if (statsData.success && statsData.stats) {
            setStats(statsData.stats);
          }
        }
      } catch (err: unknown) {
        if (active) {
          const msg = err instanceof Error ? err.message : "Error fetching dashboard records.";
          setDataError(msg);
        }
      } finally {
        if (active) {
          setIsLoadingData(false);
        }
      }
    }

    initialFetch();

    return () => {
      active = false;
    };
  }, [isAuthenticated, statusFilter, serviceFilter, searchQuery]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailInput.trim(),
          password: passwordInput,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed. Check your admin credentials.");
      }

      setIsAuthenticated(true);
      setAdminEmail(data.admin.email);
      setPasswordInput("");
      setSessionNotice(null);

      // Save email in localStorage for password-only re-login and record active time
      try {
        localStorage.setItem(
          STORAGE_SAVED_EMAIL_KEY,
          data.admin?.email || emailInput.trim().toLowerCase()
        );
        localStorage.setItem(STORAGE_LAST_ACTIVE_KEY, String(Date.now()));
      } catch {
        // non-blocking
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected sign-in error occurred.";
      setLoginError(msg);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
    } catch {
      // non-blocking
    } finally {
      setIsAuthenticated(false);
      setAdminEmail("");
      setAppointments([]);
      setStats(null);
      setPasswordInput("");
      setSessionNotice(null);
      try {
        localStorage.removeItem(STORAGE_LAST_ACTIVE_KEY);
      } catch {
        // non-blocking
      }
    }
  };

  // Handle Admin Cancellation Override
  const handleAdminCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspectedAppointment) return;

    setIsAdminCancelling(true);
    setAdminCancelError(null);

    try {
      const res = await fetch(`/api/admin/appointments/${inspectedAppointment.id}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: adminCancelReason.trim() || "Administrative override cancellation",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to cancel appointment.");
      }

      setActionSuccessMsg(`Appointment ${inspectedAppointment.id} cancelled successfully.`);
      setInspectedAppointment(null);
      setAdminCancelReason("");
      loadDashboardData(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to cancel appointment.";
      setAdminCancelError(msg);
    } finally {
      setIsAdminCancelling(false);
    }
  };

  // LOGIN VIEW
  if (isAuthenticated === false) {
    return (
      <div className="max-w-md mx-auto py-8">
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="rounded-3xl border border-white/10 bg-[#070b16]/95 p-8 sm:p-10 text-left shadow-2xl backdrop-blur-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-mono text-xs font-semibold">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Restricted Operations Console</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Admin Authentication
          </h2>
          <p className="text-xs text-zinc-400 font-sans leading-relaxed mb-8">
            Access protected with PBKDF2 cryptography. Enter verified administrative credentials to inspect and manage schedules.
          </p>

          {sessionNotice && (
            <div className="mb-6 p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs font-mono flex items-start justify-between gap-3 shadow-md">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 shrink-0 text-amber-400 animate-pulse mt-0.5" />
                <span>{sessionNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => setSessionNotice(null)}
                className="text-amber-400 hover:text-white text-xs font-mono cursor-pointer shrink-0 ml-2 underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {loginError && (
            <div className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider">
                  Administrator Email
                </label>
                {emailInput && (
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>Saved Email</span>
                  </span>
                )}
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="admin@slotly.local"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#04060e] border border-white/10 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  ref={passwordInputRef}
                  type={showPassword ? "text" : "password"}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-[#04060e] border border-white/10 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-500 hover:text-white cursor-pointer"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-mono text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 border border-indigo-400/40 cursor-pointer disabled:opacity-50"
            >
              {isLoggingIn ? (
                <>
                  <div className="h-3.5 w-3.5 border-2 border-white border-r-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Access Admin Console →</span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/[0.08] text-center">
            <Link
              href="/"
              className="text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              ← Return to Slotly Homepage
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // LOADING INITIAL SESSION VIEW
  if (isAuthenticated === null) {
    return (
      <div className="py-24 text-center font-mono text-xs text-zinc-400 space-y-3">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-indigo-400 border-r-transparent" />
        <div>Verifying administrative session...</div>
      </div>
    );
  }

  // AUTHENTICATED DASHBOARD VIEW
  const cancellationRate =
    stats && stats.totalUpcoming + stats.totalCancelled > 0
      ? Math.round((stats.totalCancelled / (stats.totalUpcoming + stats.totalCancelled)) * 100)
      : 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto text-left">
      {/* Top Console Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Slotly Operations Console
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold">
              Live DB
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono text-zinc-400 mt-1">
            <span>
              Authenticated Admin: <strong className="text-white">{adminEmail}</strong>
            </span>
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Auto-locks: 30m idle / 10m away</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => loadDashboardData(true)}
            disabled={isLoadingData}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/10 text-xs font-mono transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingData ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {actionSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center justify-between shadow-lg">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{actionSuccessMsg}</span>
          </span>
          <button
            onClick={() => setActionSuccessMsg(null)}
            className="text-emerald-400 hover:text-white font-mono text-sm px-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-blue-950/20 to-[#070b16] p-6 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
              Total Upcoming
            </span>
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-mono font-bold text-white mb-1">
            {stats?.totalUpcoming ?? "—"}
          </div>
          <p className="text-[11px] text-zinc-500 font-sans">
            Confirmed active appointments in database
          </p>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-emerald-950/20 to-[#070b16] p-6 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
              Today&apos;s Sessions
            </span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-mono font-bold text-emerald-400 mb-1">
            {stats?.appointmentsToday ?? "—"}
          </div>
          <p className="text-[11px] text-zinc-500 font-sans">
            Scheduled for today in Asia/Kolkata
          </p>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-indigo-950/20 to-[#070b16] p-6 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
              Active Tracks
            </span>
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-mono font-bold text-indigo-300 mb-1">
            {stats?.activeServicesCount ?? 5}
          </div>
          <p className="text-[11px] text-zinc-500 font-sans">
            Consulting disciplines live in catalog
          </p>
        </div>

        {/* Metric 4 */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-violet-950/20 to-[#070b16] p-6 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
              Cancellation Rate
            </span>
            <div className="h-8 w-8 rounded-lg bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-mono font-bold text-violet-300 mb-1">
            {cancellationRate}%
          </div>
          <p className="text-[11px] text-zinc-500 font-sans">
            {stats?.totalCancelled ?? 0} cancelled overall
          </p>
        </div>
      </div>

      {/* Optional Data Error Alert */}
      {dataError && (
        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/20 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{dataError}</span>
        </div>
      )}

      {/* Controls & Search Bar */}
      <div className="p-5 rounded-2xl bg-[#070b16]/90 border border-white/10 shadow-xl backdrop-blur-xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {["ALL", "CONFIRMED", "PENDING_INTAKE", "CANCELLED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                statusFilter === status
                  ? "bg-white/[0.12] text-white font-semibold border border-white/20"
                  : "bg-white/[0.03] text-zinc-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.06]"
              }`}
            >
              {status.replace("_", " ")}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Practice Select Dropdown */}
          <div className="relative">
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="appearance-none w-full sm:w-56 pl-3.5 pr-8 py-2 rounded-xl bg-[#04060e] border border-white/10 text-xs font-mono text-zinc-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="ALL">All Practices</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by client name or email..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#04060e] border border-white/10 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 font-sans"
            />
          </div>
        </div>
      </div>

      {/* High-Density Data Table */}
      <div className="rounded-3xl border border-white/10 bg-[#070b16]/95 overflow-hidden shadow-2xl backdrop-blur-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] bg-[#04060e]/80 text-[11px] uppercase tracking-wider text-zinc-400">
                <th className="py-4 px-6 font-semibold">Ref ID</th>
                <th className="py-4 px-6 font-semibold">Advisory Track</th>
                <th className="py-4 px-6 font-semibold">Client Details</th>
                <th className="py-4 px-6 font-semibold">Time Window (IST)</th>
                <th className="py-4 px-6 font-semibold">Fee</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {isLoadingData ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-zinc-500">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-indigo-400 border-r-transparent mb-2" />
                    <div>Loading database appointments...</div>
                  </td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-zinc-500">
                    No appointments matched the specified filter criteria.
                  </td>
                </tr>
              ) : (
                appointments.map((apt) => (
                  <tr
                    key={apt.id}
                    className="hover:bg-white/[0.03] transition-colors group"
                  >
                    <td className="py-4 px-6 text-zinc-400 font-bold">
                      {apt.id.slice(0, 12)}...
                    </td>
                    <td className="py-4 px-6 text-white font-medium">
                      {apt.serviceTitle}
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-zinc-200 font-sans">{apt.clientName}</div>
                      <div className="text-zinc-500 text-[11px]">{apt.clientEmail}</div>
                    </td>
                    <td className="py-4 px-6 text-zinc-300 whitespace-nowrap">
                      <div>
                        {new Date(apt.startTime).toLocaleDateString("en-US", {
                          timeZone: apt.timezone,
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <div className="text-emerald-400 text-[11px]">
                        {new Date(apt.startTime).toLocaleTimeString("en-US", {
                          timeZone: apt.timezone,
                          hour: "numeric",
                          minute: "2-digit",
                        })}{" "}
                        –{" "}
                        {new Date(apt.endTime).toLocaleTimeString("en-US", {
                          timeZone: apt.timezone,
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-white font-semibold whitespace-nowrap">
                      ₹{apt.feeINR.toLocaleString("en-IN")}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
                          apt.status === "CONFIRMED"
                            ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                            : apt.status === "CANCELLED"
                            ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
                            : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                        }`}
                      >
                        {apt.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setInspectedAppointment(apt)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-white border border-white/10 text-xs transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Inspection / Cancellation Modal */}
      <AnimatePresence>
        {inspectedAppointment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={shouldReduceMotion ? {} : { opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-xl"
            >
              <div className="rounded-3xl border border-white/15 bg-[#070b16] p-6 sm:p-8 text-left shadow-2xl relative space-y-6">
                <div className="flex justify-between items-center border-b border-white/[0.08] pb-4">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold">
                      Appointment Details
                    </span>
                    <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
                      {inspectedAppointment.serviceTitle}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setInspectedAppointment(null);
                      setAdminCancelError(null);
                    }}
                    className="text-zinc-400 hover:text-white font-mono text-sm cursor-pointer p-1"
                  >
                    ✕
                  </button>
                </div>

                {adminCancelError && (
                  <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-mono">
                    {adminCancelError}
                  </div>
                )}

                <div className="p-5 rounded-2xl bg-[#04060e] border border-white/10 space-y-3 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Booking ID:</span>
                    <span className="text-white select-all">{inspectedAppointment.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Client:</span>
                    <span className="text-white">
                      {inspectedAppointment.clientName} ({inspectedAppointment.clientEmail})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Time Window:</span>
                    <span className="text-emerald-400">
                      {new Date(inspectedAppointment.startTime).toLocaleString("en-US", {
                        timeZone: inspectedAppointment.timezone,
                      })}{" "}
                      ({inspectedAppointment.timezone})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Fee Paid:</span>
                    <span className="text-white font-semibold">
                      ₹{inspectedAppointment.feeINR.toLocaleString("en-IN")} INR
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Status:</span>
                    <span className="text-zinc-200 uppercase">{inspectedAppointment.status}</span>
                  </div>
                  {inspectedAppointment.clientNotes && (
                    <div className="pt-2 border-t border-white/[0.06]">
                      <span className="text-zinc-500 block mb-1">Intake Brief:</span>
                      <p className="font-sans text-xs text-zinc-300 bg-[#070b16] p-3 rounded-xl border border-white/10 whitespace-pre-wrap">
                        {inspectedAppointment.clientNotes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Admin Cancellation Form */}
                {inspectedAppointment.status !== "CANCELLED" && (
                  <form onSubmit={handleAdminCancel} className="space-y-4 pt-2">
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-2">
                        Cancellation Reason (Sent to Client)
                      </label>
                      <textarea
                        value={adminCancelReason}
                        onChange={(e) => setAdminCancelReason(e.target.value)}
                        rows={2}
                        placeholder="e.g., Consultant emergency, rescheduling requested by team..."
                        className="w-full p-3 rounded-xl bg-[#04060e] border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:border-rose-500 font-sans text-xs resize-none"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
                      <button
                        type="button"
                        onClick={() => setInspectedAppointment(null)}
                        className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 text-xs font-mono transition-all cursor-pointer"
                      >
                        Close
                      </button>
                      <button
                        type="submit"
                        disabled={isAdminCancelling}
                        className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-semibold transition-all shadow-md cursor-pointer disabled:opacity-50"
                      >
                        {isAdminCancelling ? "Cancelling..." : "Cancel Appointment"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
