"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SlotlyLogo } from "@/components/brand/SlotlyLogo";
import {
  ArrowUpRight,
  Lock,
  ShieldCheck,
  Key,
  Cpu,
  ArrowUp,
  Activity,
  CheckCircle2,
  Layers,
  Sparkles,
  Code2,
  Palette,
  Bot,
  Calendar,
  Search,
  UserCheck,
  ShieldAlert,
} from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="mt-auto border-t border-white/[0.08] bg-[#03050c] text-zinc-400 font-sans relative overflow-hidden">
      {/* 1. Top Pre-Footer / Live System Health Bar */}
      <div className="border-b border-white/[0.08] bg-[#050814]/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-mono">
          {/* Left: Operational Badge with Pulsing Emerald Dot */}
          <div className="flex items-center gap-2 text-zinc-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-emerald-400 font-semibold tracking-wider uppercase text-[11px]">
              Systems Operational
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-400 text-[11px]">Asia/Kolkata (IST)</span>
          </div>

          {/* Center: Engine Version & Protocol */}
          <div className="hidden lg:flex items-center gap-2 text-zinc-400 text-[11px]">
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            <span>Core Engine v2.1</span>
            <span className="text-zinc-600">•</span>
            <span>Neon PostgreSQL</span>
            <span className="text-zinc-600">•</span>
            <span>Gemini 3.8 Flash</span>
          </div>

          {/* Right: Concurrency Metric */}
          <div className="flex items-center gap-2 text-indigo-300 text-[11px]">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
            <span className="font-semibold text-zinc-300">pg_advisory_xact_lock</span>
            <span className="text-emerald-400 font-medium">active</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-400">0 Race Conditions</span>
          </div>
        </div>
      </div>

      {/* 2. Main 4-Column Structured Directory */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Column 1: Brand & Architecture Thesis (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-400 rounded transition-transform hover:scale-[1.02]"
              >
                <SlotlyLogo size="sm" />
              </Link>
              <span className="px-2 py-0.5 rounded-md border border-white/10 bg-white/[0.04] text-[10px] font-mono text-zinc-400">
                v2.1 Enterprise
              </span>
            </div>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-sm font-sans">
              Deterministic advisory scheduling for high-velocity engineering and product practices.
              Cryptographically verified, concurrency-safe, zero open auctions.
            </p>

            <div className="pt-2">
              <a
                href="https://hemantpandey.in"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-3 px-3.5 py-2 rounded-xl border border-indigo-500/30 bg-gradient-to-r from-blue-950/50 via-indigo-950/40 to-emerald-950/30 hover:from-blue-900/60 hover:via-indigo-900/50 hover:to-emerald-900/40 hover:border-indigo-400/60 shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/25 transition-all duration-300"
              >
                {/* Portrait Photo Avatar */}
                <div className="relative shrink-0">
                  <Image
                    src="/images/dev_hemantpandey.jpg"
                    alt="Hemant Pandey"
                    width={28}
                    height={28}
                    className="h-7 w-7 rounded-lg object-cover ring-1 ring-white/30 group-hover:scale-105 group-hover:ring-indigo-400 transition-all duration-200"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-[#03050c]" />
                </div>

                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 leading-tight">
                    Architected by
                  </span>
                  <span className="text-xs font-semibold tracking-tight bg-gradient-to-r from-white via-zinc-100 to-indigo-200 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:via-indigo-200 group-hover:to-emerald-300 transition-colors">
                    Hemant Pandey
                  </span>
                </div>

                <div className="h-6 w-6 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-white/[0.1] transition-colors ml-1">
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                </div>
              </a>
            </div>
          </div>

          {/* Column 2: Freelance Services */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200">
              Web Services
            </h4>
            <ul className="space-y-2.5 text-xs font-sans">
              <li>
                <Link
                  href="/services/landing-page-development"
                  className="inline-flex items-center gap-2 hover:text-white transition-colors group"
                >
                  <Layers className="w-3.5 h-3.5 text-blue-400 group-hover:scale-125 transition-transform duration-200 shrink-0" />
                  <span>Landing Pages (₹2,999)</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/services/business-website-development"
                  className="inline-flex items-center gap-2 hover:text-white transition-colors group"
                >
                  <Code2 className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-125 transition-transform duration-200 shrink-0" />
                  <span>Business Websites (₹6,999)</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/services/ecommerce-development"
                  className="inline-flex items-center gap-2 hover:text-white transition-colors group"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-125 transition-transform duration-200 shrink-0" />
                  <span>E-commerce Stores (₹14,999)</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/services/booking-website"
                  className="inline-flex items-center gap-2 hover:text-white transition-colors group"
                >
                  <Calendar className="w-3.5 h-3.5 text-amber-400 group-hover:scale-125 transition-transform duration-200 shrink-0" />
                  <span>Booking Websites (₹9,999)</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/services/custom-web-applications"
                  className="inline-flex items-center gap-2 hover:text-white transition-colors group"
                >
                  <Cpu className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-125 transition-transform duration-200 shrink-0" />
                  <span>Custom Web Apps (₹14,999)</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/services/bug-fixes-maintenance"
                  className="inline-flex items-center gap-2 hover:text-white transition-colors group"
                >
                  <Palette className="w-3.5 h-3.5 text-violet-400 group-hover:scale-125 transition-transform duration-200 shrink-0" />
                  <span>Bug Fixes &amp; Maintenance (₹999)</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform & Access */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200">
              Platform &amp; Access
            </h4>
            <ul className="space-y-2.5 text-xs font-sans">
              <li>
                <Link
                  href="/assistant"
                  className="inline-flex items-center gap-2 hover:text-white transition-colors group"
                >
                  <Bot className="w-3.5 h-3.5 text-violet-400 group-hover:scale-125 transition-transform duration-200 shrink-0" />
                  <span className="flex items-center gap-1.5">
                    <span>AI Concierge</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      Live
                    </span>
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/book"
                  className="inline-flex items-center gap-2 hover:text-white transition-colors group"
                >
                  <Calendar className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-125 transition-transform duration-200 shrink-0" />
                  <span>Direct Slot Booking</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/appointments"
                  className="inline-flex items-center gap-2 hover:text-white transition-colors group"
                >
                  <Search className="w-3.5 h-3.5 text-blue-400 group-hover:scale-125 transition-transform duration-200 shrink-0" />
                  <span>Lookup Reservation</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 hover:text-white transition-colors group"
                >
                  <UserCheck className="w-3.5 h-3.5 text-amber-400 group-hover:scale-125 transition-transform duration-200 shrink-0" />
                  <span>System Architecture &amp; Bio</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 hover:text-white transition-colors group"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400 group-hover:scale-125 transition-transform duration-200 shrink-0" />
                  <span className="inline-flex items-center gap-1 text-zinc-400 group-hover:text-white">
                    <span>Administrative Console</span>
                    <ArrowUpRight className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300" />
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Security & System Invariants */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200">
              Security Invariants
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5 group cursor-default">
                <Lock className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-125 transition-transform duration-200 shrink-0 mt-0.5" />
                <div>
                  <span className="text-zinc-200 font-medium font-mono text-[11px] block group-hover:text-indigo-300 transition-colors">
                    Deterministic Concurrency
                  </span>
                  <span className="text-zinc-500 text-[11px] font-sans">
                    Transaction-scoped locks
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-2.5 group cursor-default">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-125 transition-transform duration-200 shrink-0 mt-0.5" />
                <div>
                  <span className="text-zinc-200 font-medium font-mono text-[11px] block group-hover:text-emerald-300 transition-colors">
                    Cryptographic Proposals
                  </span>
                  <span className="text-zinc-500 text-[11px] font-sans">
                    HMAC-SHA256 signed
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-2.5 group cursor-default">
                <Key className="w-3.5 h-3.5 text-amber-400 group-hover:scale-125 transition-transform duration-200 shrink-0 mt-0.5" />
                <div>
                  <span className="text-zinc-200 font-medium font-mono text-[11px] block group-hover:text-amber-300 transition-colors">
                    Zero Plaintext Leaks
                  </span>
                  <span className="text-zinc-500 text-[11px] font-sans">
                    SHA-256 hashed customer tokens
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-2.5 group cursor-default">
                <Cpu className="w-3.5 h-3.5 text-blue-400 group-hover:scale-125 transition-transform duration-200 shrink-0 mt-0.5" />
                <div>
                  <span className="text-zinc-200 font-medium font-mono text-[11px] block group-hover:text-blue-300 transition-colors">
                    Canonical Temporal Engine
                  </span>
                  <span className="text-zinc-500 text-[11px] font-sans">
                    UTC normalized, IST operating hours
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* 3. Bottom Legal & Attribution Bar */}
        <div className="mt-14 pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div>
            © 2026 Slotly. All rights reserved.
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span>Default Timezone: Asia/Kolkata (UTC+05:30)</span>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer group"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 text-zinc-500 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
