"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { DEMO_SERVICES } from "@/lib/data";
import { ConsultingService } from "@/lib/types";
import { Check, ArrowRight, Clock, Zap, ShieldCheck } from "lucide-react";

// Curated order to highlight primary freelance web services
const ORDERED_SERVICE_IDS = [
  "custom-web-app",
  "landing-page",
  "ecommerce-store",
  "website-redesign",
  "ai-integration",
];

// High-fidelity styling tokens per category
const CATEGORY_STYLES: Record<
  string,
  {
    border: string;
    hoverBorder: string;
    badgeBg: string;
    badgeText: string;
    glow: string;
    priceColor: string;
    pillBg: string;
  }
> = {
  "Web Applications": {
    border: "border-indigo-500/30",
    hoverBorder: "hover:border-indigo-400/60",
    badgeBg: "bg-indigo-500/15 border-indigo-500/30",
    badgeText: "text-indigo-300",
    glow: "from-indigo-600/15 via-indigo-950/20 to-transparent",
    priceColor: "text-indigo-200",
    pillBg: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
  },
  Websites: {
    border: "border-sky-500/30",
    hoverBorder: "hover:border-sky-400/60",
    badgeBg: "bg-sky-500/15 border-sky-500/30",
    badgeText: "text-sky-300",
    glow: "from-sky-600/15 via-sky-950/20 to-transparent",
    priceColor: "text-sky-200",
    pillBg: "bg-sky-500/10 text-sky-300 border-sky-500/20",
  },
  "E-commerce": {
    border: "border-emerald-500/30",
    hoverBorder: "hover:border-emerald-400/60",
    badgeBg: "bg-emerald-500/15 border-emerald-500/30",
    badgeText: "text-emerald-300",
    glow: "from-emerald-600/15 via-emerald-950/20 to-transparent",
    priceColor: "text-emerald-200",
    pillBg: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  },
  "Design & Optimization": {
    border: "border-amber-500/30",
    hoverBorder: "hover:border-amber-400/60",
    badgeBg: "bg-amber-500/15 border-amber-500/30",
    badgeText: "text-amber-300",
    glow: "from-amber-600/15 via-amber-950/20 to-transparent",
    priceColor: "text-amber-200",
    pillBg: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  },
  "AI & Automation": {
    border: "border-teal-500/30",
    hoverBorder: "hover:border-teal-400/60",
    badgeBg: "bg-teal-500/15 border-teal-500/30",
    badgeText: "text-teal-300",
    glow: "from-teal-600/15 via-teal-950/20 to-transparent",
    priceColor: "text-teal-200",
    pillBg: "bg-teal-500/10 text-teal-300 border-teal-500/20",
  },
};

function PracticeCard({ service }: { service: ConsultingService }) {
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

  const style = CATEGORY_STYLES[service.category] || CATEGORY_STYLES["Web Applications"];
  const originalPrice = service.originalFeeINR || Math.round(service.feeINR * 1.25);

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={shouldReduceMotion ? {} : { scale: 1.015, y: -4 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className={`rounded-3xl border ${style.border} ${style.hoverBorder} bg-gradient-to-b ${style.glow} p-7 flex flex-col justify-between transition-colors duration-300 shadow-xl backdrop-blur-xl relative group overflow-hidden`}
    >
      {/* Mouse-Tracking Spotlight Border */}
      {isHovered && !shouldReduceMotion && (
        <div
          className="pointer-events-none absolute -inset-px rounded-3xl opacity-60 transition-opacity duration-300 z-0"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.12), transparent 75%)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Subtle top ambient light */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-20 bg-white/[0.04] rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />

      <div className="relative z-10">
        {/* Category Badge & Duration Pill */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${style.badgeBg} ${style.badgeText} font-semibold`}
            >
              {service.category}
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-300 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <Clock className="w-3 h-3 text-emerald-400" />
            <span>{service.durationMinutes}-Min Enquiry Call</span>
          </div>
        </div>

        {/* Title & Tagline with Micro-rotation on Hover */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-zinc-100 transition-colors">
            {service.title}
          </h3>
          <motion.div
            animate={isHovered && !shouldReduceMotion ? { rotate: [0, -8, 8, 0], scale: 1.08 } : {}}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="shrink-0 text-zinc-400 group-hover:text-white transition-colors"
          >
            <Zap className="w-4 h-4" />
          </motion.div>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed mb-5 font-sans line-clamp-2">
          {service.tagline}
        </p>

        {/* Price Plate: Starts from ₹X,XXX with strikethrough original and 20% OFF */}
        <div className="pb-5 border-b border-white/[0.08] mb-5">
          <div className="p-3.5 rounded-xl bg-[#04060e]/90 border border-white/10 shadow-inner flex items-baseline justify-between gap-2">
            <div>
              <div className="text-[10px] font-mono text-zinc-500 line-through">
                Was ₹{originalPrice.toLocaleString("en-IN")}
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs font-mono text-zinc-400">Starts from</span>
                <span className={`text-2xl sm:text-3xl font-mono font-bold ${style.priceColor}`}>
                  ₹{service.feeINR.toLocaleString("en-IN")}
                </span>
                <span className="text-[11px] font-mono text-zinc-500">INR</span>
              </div>
            </div>

            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold shrink-0">
              20% OFF
            </span>
          </div>
        </div>

        {/* 3 Clean Deliverables */}
        <div className="space-y-2.5 mb-6">
          <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
            Included Deliverables
          </div>
          {service.deliverables.slice(0, 3).map((item, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
              <div className="h-4 w-4 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5 text-emerald-400">
                <Check className="w-2.5 h-2.5" strokeWidth={3} />
              </div>
              <span className="leading-snug">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Two Action Buttons: Know More & Book Call */}
      <div className="pt-4 border-t border-white/[0.08] relative z-10 grid grid-cols-2 gap-2.5">
        <Link
          href={`/services/${service.slug}`}
          className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-white/15 bg-white/[0.04] text-white text-xs font-mono font-medium hover:bg-white/[0.08] hover:border-white/30 transition-all text-center"
        >
          <span>Know More</span>
          <ArrowRight className="w-3 h-3 text-zinc-400" />
        </Link>

        <Link
          href={`/book?service=${service.slug}`}
          className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 text-xs font-mono font-bold tracking-wide transition-all shadow-md text-center"
        >
          <span>Book Call</span>
        </Link>
      </div>
    </motion.div>
  );
}

export function PracticeShowcase() {
  const shouldReduceMotion = useReducedMotion();

  // Sort according to prioritized order
  const services = [...DEMO_SERVICES].sort((a, b) => {
    const idxA = ORDERED_SERVICE_IDS.indexOf(a.id);
    const idxB = ORDERED_SERVICE_IDS.indexOf(b.id);
    return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
  });

  return (
    <motion.section
      id="practices"
      initial={shouldReduceMotion ? {} : { opacity: 0, y: 24 }}
      whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="py-20 md:py-28 bg-[#04060e] border-b border-white/[0.08] relative overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-950/40 text-xs font-mono text-blue-300 mb-3 shadow-xs">
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              <span>Practical Web Development Services</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              Websites &amp; Apps Built to Scale.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-zinc-400 leading-relaxed font-sans">
              Direct engineering for individuals, shops, startups, and growing businesses. Transparent starting prices, dedicated milestone delivery, and zero hidden agency overhead.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>8 Core Freelance Services</span>
          </div>
        </div>

        {/* 3-Column Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service) => (
            <PracticeCard key={service.id} service={service} />
          ))}

          {/* 9th Card: Custom Solution Card */}
          <motion.div
            whileHover={shouldReduceMotion ? {} : { scale: 1.015, y: -4 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="rounded-3xl border border-dashed border-white/20 bg-gradient-to-b from-white/[0.03] to-transparent p-7 flex flex-col justify-between backdrop-blur-xl relative overflow-hidden group"
          >
            <div>
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-6 shadow-xs group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight mb-2">
                Need a Custom Solution?
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-6 font-sans">
                Have a specialized web requirement, complex database, or legacy codebase you need help auditing? Discuss your requirements directly for a fixed-price proposal.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/[0.08]">
              <Link
                href="/services"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/15 bg-white/[0.05] text-white text-xs font-mono font-medium hover:bg-white/[0.1] hover:border-white/30 transition-all shadow-xs"
              >
                <span>Explore All 8 Services</span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-300" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
