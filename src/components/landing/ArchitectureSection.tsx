"use client";

import React from "react";
import { Lock, Cpu, Globe, Database, Terminal, ShieldCheck, CheckCircle2 } from "lucide-react";

const SPECS = [
  {
    num: "01",
    icon: Lock,
    title: "PostgreSQL Advisory Locks",
    headline: "Zero double-booking guarantee",
    description:
      "All booking writes acquire transaction-scoped pg_advisory_xact_lock keyed to the service ID. Overlapping attempts are serialized and deterministically rejected with HTTP 409 Conflict.",
    tagColor: "from-emerald-500 to-teal-500",
    badge: "ACID Concurrency",
    schematic: "SELECT pg_advisory_xact_lock(hashtext('slotly_booking_' || serviceId));",
  },
  {
    num: "02",
    icon: Database,
    title: "Zero Plaintext Tokens",
    headline: "Privacy-preserving customer links",
    description:
      "Customer access credentials possess 256 bits of entropy. The database stores only the SHA-256 hash. Management endpoints enforce strict no-referrer policies to prevent token leakage.",
    tagColor: "from-blue-500 to-indigo-500",
    badge: "SHA-256 Hashes",
    schematic: "cancellationTokenHash: sha256(rawToken) // plaintext never written to DB",
  },
  {
    num: "03",
    icon: Globe,
    title: "Multi-Timezone UTC Clock",
    headline: "Canonical temporal normalization",
    description:
      "All calendar computations normalize to UTC timestamps while dynamically referencing business hours in Asia/Kolkata (IST), preventing midnight hallucinations and off-hour bookings.",
    tagColor: "from-cyan-500 to-blue-500",
    badge: "UTC Normalized",
    schematic: "dayStartUtc = Date.UTC(Y, M-1, D, 9, 30) - (330 * 60 * 1000);",
  },
  {
    num: "04",
    icon: Cpu,
    title: "Decoupled AI Execution",
    headline: "Survives free-tier AI quotas",
    description:
      "Conversational scheduling generates a cryptographically signed HMAC-SHA256 proposal. Confirmation persists directly to PostgreSQL without touching Gemini, preventing booking drops.",
    tagColor: "from-violet-500 to-purple-500",
    badge: "HMAC-SHA256",
    schematic: "hmacSha256(canonicalPayload, sessionSecret) // 15-min TTL lock",
  },
];

export function ArchitectureSection() {
  return (
    <section id="architecture" className="py-20 md:py-28 bg-[#04060e] border-b border-white/[0.08] relative overflow-hidden">
      {/* Background Cosmic Glow */}
      <div
        className="pointer-events-none absolute bottom-0 right-1/4 w-[700px] h-[350px] opacity-20 blur-[130px]"
        style={{
          background: "radial-gradient(circle, #3b82f6 0%, #8b5cf6 60%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-950/40 text-xs font-mono text-violet-300 mb-3 shadow-xs">
            <Terminal className="w-3.5 h-3.5 text-violet-400" />
            <span>Reliability Specifications</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Engineered Invariants &amp; Deep Technical Specs
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-400 leading-relaxed font-sans">
            Built without decorative illusions. Every scheduling primitive enforces strict data
            sovereignty, deterministic persistence, and verified cryptographic guarantees.
          </p>
        </div>

        {/* 4-Column Technical Specification Layout with Gradient Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SPECS.map((spec) => {
            const Icon = spec.icon;
            return (
              <div
                key={spec.num}
                className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6 flex flex-col justify-between hover:border-white/20 transition-all shadow-xl backdrop-blur-xl group"
              >
                <div>
                  {/* Digital Number Tag with Gradient */}
                  <div className="flex items-center justify-between mb-5">
                    <span
                      className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-gradient-to-r ${spec.tagColor} text-white shadow-xs`}
                    >
                      {spec.num}
                    </span>
                    <div className="h-8 w-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-zinc-300 group-hover:scale-105 transition-transform">
                      <Icon className="w-4 h-4 text-white" strokeWidth={1.75} />
                    </div>
                  </div>

                  <span className="inline-block text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-zinc-300 mb-3">
                    {spec.badge}
                  </span>

                  <h3 className="text-base font-bold text-white mb-1">
                    {spec.title}
                  </h3>
                  <div className="text-xs font-mono text-emerald-400 mb-3">
                    {spec.headline}
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                    {spec.description}
                  </p>

                  {/* Micro Code Schematic */}
                  <div className="p-2 rounded-lg bg-[#04060e] border border-white/[0.06] text-[10px] font-mono text-zinc-400 overflow-x-auto">
                    <code>{spec.schematic}</code>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-zinc-500">
                  <span>INVARIANT</span>
                  <span className="text-emerald-400 inline-flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3 h-3" />
                    ENFORCED
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Technical Architecture Flow Diagram */}
        <div className="mt-12 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent p-6 md:p-8 backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold">
              Deterministic Booking Verification Lifecycle
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono text-zinc-400">
            <div className="p-4 rounded-xl border border-white/[0.08] bg-[#04060e]/80 shadow-xs">
              <span className="text-emerald-400 font-semibold block mb-1">1. Tool Verification</span>
              Gemini or Web Client calls check_availability against Neon PostgreSQL
            </div>
            <div className="p-4 rounded-xl border border-white/[0.08] bg-[#04060e]/80 shadow-xs">
              <span className="text-blue-400 font-semibold block mb-1">2. Signed Proposal</span>
              Server signs proposalId + timestamps with HMAC-SHA256 (15-min TTL)
            </div>
            <div className="p-4 rounded-xl border border-white/[0.08] bg-[#04060e]/80 shadow-xs">
              <span className="text-indigo-400 font-semibold block mb-1">3. Advisory Lock Commit</span>
              POST /api/assistant/confirm acquires pg_advisory_xact_lock &amp; writes appointment
            </div>
            <div className="p-4 rounded-xl border border-white/[0.08] bg-[#04060e]/80 shadow-xs">
              <span className="text-violet-400 font-semibold block mb-1">4. Zero-Plaintext Hash</span>
              Token returned once to client; only sha256 hash stored in DB
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
