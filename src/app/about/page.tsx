import React from "react";
import type { Metadata } from "next";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { AboutView } from "@/components/about/AboutView";
import { UserCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "About Slotly & Hemant Pandey | Architecture & Engineering Profile",
  description:
    "Learn about Slotly's deterministic scheduling architecture, core philosophies, developer runbook, and creator Hemant Pandey — Principal Software Architect.",
};

export default function AboutPage() {
  return (
    <div className="min-h-full flex flex-col bg-[#04060e] text-zinc-100 relative selection:bg-indigo-600 selection:text-white">
      {/* Background Ambient Radial Glow */}
      <div
        className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 w-[900px] h-[450px] opacity-25 blur-[140px]"
        style={{
          background:
            "radial-gradient(circle, #2563eb 0%, #7c3aed 50%, #059669 90%, transparent 100%)",
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
          {/* Section Eyebrow */}
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-950/40 text-xs font-mono text-blue-300 mb-4 shadow-xs">
              <UserCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Architect Profile &amp; System Runbook</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              Engineering High-Availability Systems &amp; Deterministic AI Infrastructure.
            </h1>
            <p className="mt-3 text-base sm:text-lg text-zinc-400 leading-relaxed font-sans">
              Slotly was conceived and engineered by <strong>Hemant Pandey</strong> to demonstrate
              how transactional database primitives and generative AI can converge into a zero-compromise
              advisory scheduling engine.
            </p>
          </div>

          {/* Interactive About Component */}
          <AboutView />
        </div>
      </main>

      <Footer />
    </div>
  );
}
