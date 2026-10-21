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
    icon: Cpu,
    title: "Direct Developer Partnership",
    headline: "Zero middlemen, direct engineering execution",
    description:
      "Work directly with Hemant Pandey. No account managers, no communication bottlenecks, and no inflated agency markups. You get direct collaboration, rapid turnaround, and clear milestone progress.",
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    glow: "hover:border-emerald-500/40",
    badge: "Direct Execution",
  },
  {
    num: "02",
    icon: Lock,
    title: "Transparent Fixed Pricing",
    headline: "Clear Standard & Introductory pricing with zero hidden surprises",
    description:
      "Clear, upfront scope and fixed pricing for every project. From single-page landing pages to full-scale web applications, you receive detailed milestone quotes before any work begins.",
    color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
    glow: "hover:border-indigo-500/40",
    badge: "Fixed Upfront Pricing",
  },
  {
    num: "03",
    icon: KeyRound,
    title: "Mobile-First & Blazing Fast",
    headline: "100% responsive, optimized for Core Web Vitals",
    description:
      "Every site is engineered for speed, search engines (SEO), and high conversion. Beautifully responsive across smartphones, tablets, and desktops with clean, modern semantic code.",
    color: "text-violet-400 bg-violet-500/10 border-violet-500/30",
    glow: "hover:border-violet-500/40",
    badge: "Mobile-First & SEO",
  },
  {
    num: "04",
    icon: RefreshCw,
    title: "100% Full Code Ownership",
    headline: "Complete source code, zero vendor lock-in",
    description:
      "You receive 100% ownership of your source code, design assets, and database credentials upon completion. Free setup and deployment to Vercel or your hosting provider of choice.",
    color: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    glow: "hover:border-blue-500/40",
    badge: "Full Code Ownership",
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
        <span className="text-zinc-500">CLIENT DELIVERY GUARANTEE</span>
        <span className="text-emerald-400 flex items-center gap-1.5 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          100% COMMITTED
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
            <span>Client-First Engineering</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Why Founders, Businesses &amp; Agencies Choose Me.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-400 leading-relaxed font-sans">
            No bloated agency overhead or junior handoffs. Every website and web application is built directly with engineering rigor—blazing fast, mobile-first, and delivered on time with transparent fixed pricing.
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
