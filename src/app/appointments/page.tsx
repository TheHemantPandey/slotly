import React, { Suspense } from "react";
import type { Metadata } from "next";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { AppointmentsManager } from "@/components/appointments/AppointmentsManager";
import { Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Advisory Appointments & Booking Registry | Slotly",
  description:
    "Look up, inspect, or manage your upcoming technical advisory sessions using your private SHA-256 booking token.",
};

export default function AppointmentsPage() {
  return (
    <div className="min-h-full flex flex-col bg-[#04060e] text-zinc-100 relative selection:bg-indigo-600 selection:text-white">
      {/* Background Ambient Radial Glow */}
      <div
        className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 w-[900px] h-[450px] opacity-25 blur-[140px]"
        style={{
          background: "radial-gradient(circle, #2563eb 0%, #7c3aed 50%, #059669 90%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* Subtle Dot Grid */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40"
        aria-hidden="true"
      />

      <Header />

      <main className="flex-1 relative z-10 py-12 md:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Header Title */}
          <div className="max-w-2xl mb-12 text-center sm:text-left mx-auto sm:mx-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-950/40 text-xs font-mono text-blue-300 mb-3 shadow-xs">
              <Search className="w-3.5 h-3.5 text-blue-400" />
              <span>Private Booking Registry</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              Advisory Appointments
            </h1>
            <p className="mt-2 text-sm sm:text-base text-zinc-400 leading-relaxed font-sans">
              Enter your 64-character hex management token to access your session agenda, reschedule, or inspect booking status.
            </p>
          </div>

          <Suspense
            fallback={
              <div className="py-20 text-center text-xs font-mono text-zinc-400 space-y-3">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-emerald-400 border-r-transparent" />
                <div>Loading appointment registry...</div>
              </div>
            }
          >
            <AppointmentsManager />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
