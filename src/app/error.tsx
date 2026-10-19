"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import {
  ShieldAlert,
  RefreshCw,
  Home,
  Sparkles,
  CheckCircle2,
  Terminal,
} from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [telemetryReportId, setTelemetryReportId] = useState<string | null>(null);
  const [isReporting, setIsReporting] = useState(false);
  const [showStack, setShowStack] = useState(false);
  const reportedRef = useRef(false);

  useEffect(() => {
    // Log exception to browser console for developer inspection
    console.error("Critical Runtime Exception Intercepted:", error);

    if (reportedRef.current) return;
    reportedRef.current = true;

    // Dispatch automated error report to telemetry API
    async function reportRuntimeError() {
      try {
        setIsReporting(true);
        const currentPath = typeof window !== "undefined" ? window.location.pathname : "/unknown";

        const res = await fetch("/api/telemetry/error-report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            errorCode: "ERR_500_RUNTIME_EXCEPTION",
            message: error?.message || "Unhandled client-side runtime error",
            digest: error?.digest || undefined,
            stack: error?.stack ? error.stack.slice(0, 1500) : undefined,
            path: currentPath,
            userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
            timestamp: new Date().toISOString(),
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.reportId) {
            setTelemetryReportId(data.reportId);
          }
        }
      } catch {
        // Non-blocking telemetry
      } finally {
        setIsReporting(false);
      }
    }

    reportRuntimeError();
  }, [error]);

  return (
    <div className="min-h-full flex flex-col bg-[#04060e] text-zinc-100 relative selection:bg-indigo-600 selection:text-white">
      {/* Background Ambient Radial Glow */}
      <div
        className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 w-[850px] h-[450px] opacity-25 blur-[140px]"
        style={{
          background:
            "radial-gradient(circle, #f43f5e 0%, #7c3aed 50%, #2563eb 90%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* Subtle Dot Grid */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40"
        aria-hidden="true"
      />

      <Header />

      <main className="flex-1 relative z-10 py-16 md:py-24 px-6 flex flex-col items-center justify-center">
        <div className="max-w-xl w-full text-center">
          <div className="rounded-3xl border border-rose-500/30 bg-[#070b16]/90 p-8 sm:p-12 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
            {/* Top Accent Line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-rose-500/60 to-transparent" />

            {/* Glowing Icon Container */}
            <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-b from-rose-500/20 to-rose-500/5 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-6 shadow-xl shadow-rose-950/50">
              <ShieldAlert className="w-8 h-8 animate-pulse" strokeWidth={1.75} />
            </div>

            {/* Diagnostic Code Chip */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-rose-500/30 bg-rose-950/40 text-xs font-mono text-rose-300 mb-5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span>ERR_500_RUNTIME_EXCEPTION</span>
              <span className="text-zinc-500">•</span>
              <span className="text-zinc-400">Fault-Tolerant Boundary</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
              Application exception contained.
            </h1>

            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-sans mb-6">
              An unexpected execution error was safely intercepted by our fault boundary.
              Transactional state invariants remain protected.
            </p>

            {/* Diagnostic Digest & Telemetry Badge */}
            <div className="mb-6 p-4 rounded-xl bg-[#04060e] border border-white/[0.08] text-xs font-mono text-left space-y-2.5">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-zinc-500">Telemetry Status:</span>
                {telemetryReportId ? (
                  <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Dispatched ({telemetryReportId})</span>
                  </span>
                ) : isReporting ? (
                  <span className="text-indigo-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                    <span>Dispatching alert email...</span>
                  </span>
                ) : (
                  <span className="text-zinc-400">Logged to Console</span>
                )}
              </div>

              {error?.digest && (
                <div className="flex items-center justify-between text-zinc-400 border-t border-white/[0.06] pt-2">
                  <span className="text-zinc-500">Next.js Digest:</span>
                  <span className="text-purple-300 font-semibold">{error.digest}</span>
                </div>
              )}

              {error?.message && (
                <div className="border-t border-white/[0.06] pt-2">
                  <span className="text-zinc-500 block mb-1">Message:</span>
                  <span className="text-rose-300 block truncate">{error.message}</span>
                </div>
              )}
            </div>

            {/* Collapsible Stack Trace Toggle (Development aid) */}
            {error?.stack && (
              <div className="mb-6 text-left">
                <button
                  type="button"
                  onClick={() => setShowStack(!showStack)}
                  className="text-[11px] font-mono text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>{showStack ? "Hide Stack Trace" : "Show Diagnostic Stack Trace"}</span>
                </button>
                {showStack && (
                  <pre className="mt-2 p-3 rounded-xl bg-black/60 border border-white/[0.08] text-[10px] font-mono text-zinc-400 overflow-x-auto max-h-40 whitespace-pre-wrap word-break-all">
                    {error.stack}
                  </pre>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => reset()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-rose-600 text-white text-xs font-mono font-medium tracking-wide hover:from-blue-500 hover:to-rose-500 transition-all shadow-md shadow-rose-500/20 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Recover / Try Again</span>
              </button>

              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-white/10 bg-white/[0.04] text-zinc-300 text-xs font-mono tracking-wide hover:bg-white/[0.08] hover:text-white transition-all cursor-pointer"
              >
                <Home className="w-3.5 h-3.5 text-zinc-400" />
                <span>Return to Home</span>
              </Link>

              <Link
                href="/services"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-white/10 bg-transparent text-zinc-400 text-xs font-mono tracking-wide hover:text-white transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Browse Services</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
