"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import {
  FileQuestion,
  Home,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Compass,
  CheckCircle2,
} from "lucide-react";

const RECOMMENDED_SERVICES = [
  {
    title: "Business Websites & Landing Pages",
    price: "Introductory: ₹9,600",
    href: "/services/business-websites-landing-pages",
    desc: "Fast, conversion-focused Next.js business website with 20% introductory savings.",
  },
  {
    title: "Custom Web Apps & Dashboards",
    price: "Introductory: ₹28,000",
    href: "/services/custom-web-apps-dashboards",
    desc: "Custom SaaS MVPs, client portals, and secure relational database systems.",
  },
  {
    title: "Booking & Management Systems",
    price: "Introductory: ₹20,000",
    href: "/services/booking-management-systems",
    desc: "Automated reservation system with real-time calendar availability and intake forms.",
  },
];

export default function NotFound() {
  const pathname = usePathname();
  const [telemetryReportId, setTelemetryReportId] = useState<string | null>(null);
  const [isReporting, setIsReporting] = useState(false);
  const reportSentRef = useRef(false);

  useEffect(() => {
    document.title = "404 - Route Not Found | Slotly";

    if (reportSentRef.current) return;
    reportSentRef.current = true;

    // Send automated telemetry report to /api/telemetry/error-report
    async function reportNotFound() {
      try {
        setIsReporting(true);
        const currentPath =
          pathname || (typeof window !== "undefined" ? window.location.pathname : "/unknown");

        const res = await fetch("/api/telemetry/error-report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            errorCode: "ERR_404_UNMAPPED_ROUTE",
            message: `Route not mapped: ${currentPath}`,
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

    reportNotFound();
  }, [pathname]);

  return (
    <div className="min-h-full flex flex-col bg-[#04060e] text-zinc-100 relative selection:bg-indigo-600 selection:text-white">
      {/* Background Ambient Radial Glow */}
      <div
        className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 w-[850px] h-[450px] opacity-25 blur-[140px]"
        style={{
          background:
            "radial-gradient(circle, #e11d48 0%, #6366f1 50%, #06b6d4 90%, transparent 100%)",
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
        <div className="max-w-2xl w-full text-center">
          {/* Main Error Container */}
          <div className="rounded-3xl border border-white/10 bg-[#070b16]/90 p-8 sm:p-12 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
            {/* Top Accent Line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-rose-500/60 to-transparent" />

            {/* Glowing Icon Container */}
            <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-b from-rose-500/20 to-rose-500/5 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-6 shadow-xl shadow-rose-950/50">
              <Compass className="w-8 h-8 animate-pulse" strokeWidth={1.75} />
            </div>

            {/* Diagnostic Code Chip */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-rose-500/30 bg-rose-950/40 text-xs font-mono text-rose-300 mb-5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span>ERR_404_UNMAPPED_ROUTE</span>
              <span className="text-zinc-500">•</span>
              <span className="text-zinc-400">HTTP 404</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
              Route not found in registry.
            </h1>

            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-sans mb-6 max-w-lg mx-auto">
              The endpoint or resource you requested does not exist or has been relocated.
              Our routing engine has contained this navigation gracefully.
            </p>

            {/* Path & Telemetry Strip */}
            <div className="mb-8 p-3.5 rounded-xl bg-[#04060e] border border-white/[0.08] text-xs font-mono text-zinc-400 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2 truncate max-w-full">
                <span className="text-zinc-500">Target Path:</span>
                <span className="text-indigo-300 font-semibold truncate">
                  {pathname || (typeof window !== "undefined" ? window.location.pathname : "/")}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] shrink-0">
                {telemetryReportId ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Alert Dispatched ({telemetryReportId})</span>
                  </span>
                ) : isReporting ? (
                  <span className="text-zinc-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                    <span>Dispatching alert...</span>
                  </span>
                ) : (
                  <span className="text-zinc-500 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Telemetry Active</span>
                  </span>
                )}
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white text-xs font-mono font-medium tracking-wide hover:from-blue-500 hover:to-violet-500 transition-all shadow-md shadow-indigo-500/25 border border-indigo-400/30"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return to Home</span>
              </Link>

              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/15 bg-white/[0.04] text-zinc-200 text-xs font-mono tracking-wide hover:bg-white/[0.08] hover:text-white transition-all backdrop-blur-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                <span>Explore All Services</span>
              </Link>

              <Link
                href="/book"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border border-white/10 bg-transparent text-zinc-400 text-xs font-mono hover:text-white transition-all"
              >
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                <span>Book Call</span>
              </Link>
            </div>
          </div>

          {/* Recommended Alternatives Card */}
          <div className="mt-8 rounded-2xl border border-white/[0.08] bg-[#070b16]/60 p-6 backdrop-blur-md text-left">
            <div className="flex items-center gap-2 mb-4 text-xs font-mono uppercase tracking-wider text-zinc-400">
              <FileQuestion className="w-3.5 h-3.5 text-indigo-400" />
              <span>Looking for one of our web development services?</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {RECOMMENDED_SERVICES.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/15 transition-all group block"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-white group-hover:text-indigo-300 transition-colors">
                      {s.title}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      {s.price}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-sans line-clamp-2">
                    {s.desc}
                  </p>
                  <div className="mt-2.5 flex items-center gap-1 text-[10px] font-mono text-zinc-400 group-hover:text-white transition-colors">
                    <span>View Details</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
