import React from "react";
import type { Metadata } from "next";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { ServiceCatalogView } from "@/components/services/ServiceCatalogView";
import { Sparkles, Code2, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Freelance Web Development Services & Transparent Pricing | Slotly",
  description:
    "Explore 8 practical freelance web services for individuals, small businesses, startups, and local shops. Landing pages, business websites, e-commerce, custom web apps, and maintenance with transparent INR starting prices.",
  openGraph: {
    title: "Freelance Web Development Services & Transparent Pricing | Slotly",
    description:
      "Explore 8 practical freelance web services for individuals, small businesses, startups, and local shops. Transparent starting prices in INR, dedicated deliverables, and direct engineering execution.",
    url: "https://slotly.hemantpandey.in/services",
  },
};

export default function ServicesPage() {
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
          {/* Header Banner */}
          <div className="max-w-3xl mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-xs font-mono text-emerald-300 mb-4 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>15–20 MIN DISCOVERY CALLS • 20% LIMITED MARKET DISCOUNT</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              Websites &amp; web apps built for{" "}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
                real business results.
              </span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-zinc-300 leading-relaxed font-sans">
              I help individuals, small businesses, startups, and local shops build, modernize, and maintain high-performance websites and web applications. Every project features transparent &quot;starts from&quot; pricing with a 20% market discount, direct developer communication, and fast discovery calls.
            </p>

            {/* Micro Guarantees Strip */}
            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Starts From Pricing with 20% OFF</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-blue-400" />
                <span>15–20 Min Low-Friction Calls</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <span>Zero Outsourced Agency Bloat</span>
              </div>
            </div>
          </div>

          {/* Interactive Catalog Component */}
          <ServiceCatalogView />
        </div>
      </main>

      <Footer />
    </div>
  );
}
