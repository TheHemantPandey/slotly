import React, { Suspense } from "react";
import type { Metadata } from "next";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Book an Advisory Session | Slotly",
  description:
    "Schedule an executive advisory session with guaranteed zero double-bookings, verified instant locking, and real-time IST calendar sync.",
};

export default function BookPage() {
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
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Header Title */}
          <div className="max-w-3xl mb-12 text-center sm:text-left mx-auto sm:mx-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-xs font-mono text-emerald-300 mb-4 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Deterministic Scheduling Chamber</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              Reserve your advisory window.
            </h1>
            <p className="mt-3 text-sm sm:text-base text-zinc-400 leading-relaxed font-sans">
              Complete the structured multi-step intake to verify your service track, date, time window, and briefing goals. Backed by real-time concurrency locks.
            </p>
          </div>

          <Suspense
            fallback={
              <div className="max-w-4xl mx-auto p-16 text-center text-zinc-400 font-mono text-xs space-y-3">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-indigo-400 border-r-transparent" />
                <div>Initializing Scheduling Engine...</div>
              </div>
            }
          >
            <BookingWizard />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
