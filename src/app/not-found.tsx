import React from "react";
import Link from "next/link";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { AlertTriangle, Home, Calendar, ArrowRight } from "lucide-react";

export const metadata = {
  title: "404 - Route Not Found | Slotly",
  description: "The requested advisory page or registry item could not be found.",
};

export default function NotFound() {
  return (
    <div className="min-h-full flex flex-col bg-[#04060e] text-zinc-100 relative selection:bg-indigo-600 selection:text-white">
      {/* Background Ambient Radial Glow */}
      <div
        className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-25 blur-[140px]"
        style={{
          background:
            "radial-gradient(circle, #e11d48 0%, #7c3aed 50%, #2563eb 90%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* Subtle Dot Grid */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40"
        aria-hidden="true"
      />

      <Header />

      <main className="flex-1 relative z-10 flex items-center justify-center py-20 px-6">
        <div className="max-w-xl w-full text-center">
          <div className="rounded-3xl border border-white/10 bg-[#070b16]/90 p-8 sm:p-12 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
            {/* Top Accent Line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-rose-500/60 to-transparent" />

            <div className="mx-auto h-14 w-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-6 shadow-inner">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-rose-500/20 bg-rose-950/30 text-xs font-mono text-rose-300 mb-4">
              <span>HTTP 404 · Unmapped Route</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
              Route not found in registry.
            </h1>

            <p className="text-sm text-zinc-400 leading-relaxed font-sans mb-8">
              The endpoint or token path you navigated to does not exist or has been retired.
              Verify the URL or navigate back to the home chamber.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white text-xs font-mono font-medium tracking-wide hover:from-blue-500 hover:to-violet-500 transition-all shadow-md shadow-indigo-500/20"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return to Home</span>
              </Link>

              <Link
                href="/services"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-white/[0.04] text-zinc-300 text-xs font-mono tracking-wide hover:bg-white/[0.08] hover:text-white transition-all"
              >
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                <span>Browse Services</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
