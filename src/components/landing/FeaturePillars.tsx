"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Lock, Cpu, KeyRound, RefreshCw, CheckCircle2, LucideIcon } from "lucide-react";

interface BenefitItem {
  num: string;
  icon: LucideIcon;
  title: string;
  headline: string;
  description: string;
  color: string;
  glow: string;
  badge: string;
}

const BENEFITS: BenefitItem[] = [
  {
    num: "01",
    icon: Lock,
    title: "Guaranteed Zero Double-Bookings",
    headline: "Millisecond-level transactional locks",
    description:
      "Our database transactions lock availability windows at the millisecond level. If a slot is visible on your screen, it is truly yours—eliminating embarrassing booking collisions forever.",
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    glow: "hover:border-emerald-500/40",
    badge: "Deterministic Locks",
  },
  {
    num: "02",
    icon: Cpu,
    title: "AI with Real Authority",
    headline: "Direct database tools, no hallucinations",
    description:
      "The AI Concierge doesn't guess, hallucinate, or scrape calendars. It holds direct server authorization to verify genuine availability and sign authentic appointment proposals.",
    color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
    glow: "hover:border-indigo-500/40",
    badge: "Direct Engine Access",
  },
  {
    num: "03",
    icon: KeyRound,
    title: "Privacy by Design",
    headline: "Zero plaintext token storage",
    description:
      "We store zero plaintext booking tokens in our database. Your customer management links are protected with high-entropy SHA-256 cryptographic hashing to ensure strict client confidentiality.",
    color: "text-violet-400 bg-violet-500/10 border-violet-500/30",
    glow: "hover:border-violet-500/40",
    badge: "SHA-256 Protected",
  },
  {
    num: "04",
    icon: RefreshCw,
    title: "Seamless Rescheduling & Cancellation",
    headline: "One-click self-service empowerment",
    description:
      "Dedicated, authenticated self-service links empower clients to manage, reschedule, or cancel sessions with a single click—no back-and-forth emails, no scheduling friction.",
    color: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    glow: "hover:border-blue-500/40",
    badge: "One-Click Control",
  },
];

function BenefitCard({ benefit }: { benefit: BenefitItem }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const Icon = benefit.icon;

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={shouldReduceMotion ? {} : { scale: 1.015, y: -4 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className={`rounded-2xl border border-white/10 ${benefit.glow} bg-gradient-to-b from-white/[0.04] to-transparent p-8 flex flex-col justify-between transition-colors duration-300 shadow-xl backdrop-blur-xl relative overflow-hidden group`}
    >
      {/* Deliverable 4: Mouse-tracking spotlight */}
      {isHovered && !shouldReduceMotion && (
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-60 transition-opacity duration-300 z-0"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.12), transparent 75%)`,
          }}
          aria-hidden="true"
        />
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <motion.div
            animate={isHovered && !shouldReduceMotion ? { rotate: [0, -8, 8, 0], scale: 1.08 } : {}}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={`h-11 w-11 rounded-xl border ${benefit.color} flex items-center justify-center shadow-sm`}
          >
            <Icon className="w-5 h-5" strokeWidth={1.75} />
          </motion.div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 px-3 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08]">
            {benefit.badge}
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight group-hover:text-zinc-100 transition-colors">
          {benefit.title}
        </h3>
        <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-4">
          {benefit.headline}
        </div>
        <p className="text-sm text-zinc-400 leading-relaxed font-sans">
          {benefit.description}
        </p>
      </div>

      <div className="mt-8 pt-5 border-t border-white/[0.08] flex items-center justify-between font-mono text-xs text-zinc-500 relative z-10">
        <span className="text-zinc-500">SLOTLY ENTERPRISE INVARIANT</span>
        <span className="text-emerald-400 flex items-center gap-1.5 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          VERIFIED ACTIVE
        </span>
      </div>
    </motion.div>
  );
}

export function FeaturePillars() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      id="why-slotly"
      initial={shouldReduceMotion ? {} : { opacity: 0, y: 24 }}
      whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="py-20 md:py-28 bg-[#04060e] border-b border-white/[0.08] relative overflow-hidden"
    >
      {/* Background Subtle Gradient */}
      <div
        className="pointer-events-none absolute top-1/3 right-1/4 w-[600px] h-[300px] opacity-15 blur-[120px]"
        style={{
          background: "radial-gradient(circle, #3b82f6 0%, #6366f1 50%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-xs font-mono text-emerald-300 mb-3 shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Enterprise Reliability</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Why Leaders Choose Slotly.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-400 leading-relaxed font-sans">
            Built for engineering directors, CTOs, and high-velocity founders who value their time.
            Experience industrial reliability where every commitment is locked with mathematical precision.
          </p>
        </div>

        {/* 4 Clear Business & Technical Benefits Grid with Mouse-tracking spotlight */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {BENEFITS.map((benefit) => (
            <BenefitCard key={benefit.num} benefit={benefit} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
