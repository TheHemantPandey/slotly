"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { FREELANCE_SERVICES } from "@/lib/services-catalog";
import { ServiceDetail, ServiceCategory } from "@/lib/types";
import { QuoteContactForm } from "./QuoteContactForm";
import {
  Check,
  ArrowRight,
  Clock,
  Search,
  Zap,
  Target,
  ShieldCheck,
} from "lucide-react";

const CATEGORIES: ("All" | ServiceCategory)[] = [
  "All",
  "Websites",
  "Web Applications",
  "E-commerce",
  "AI & Automation",
  "Backend & APIs",
  "Design & Optimization",
  "Maintenance & Support",
];

const CATEGORY_STYLES: Record<
  string,
  {
    border: string;
    hoverBorder: string;
    badgeBg: string;
    badgeText: string;
    glow: string;
    priceColor: string;
  }
> = {
  "Web Applications": {
    border: "border-indigo-500/30",
    hoverBorder: "hover:border-indigo-400/60",
    badgeBg: "bg-indigo-500/15 border-indigo-500/30",
    badgeText: "text-indigo-300",
    glow: "from-indigo-600/15 via-indigo-950/20 to-transparent",
    priceColor: "text-indigo-200",
  },
  Websites: {
    border: "border-sky-500/30",
    hoverBorder: "hover:border-sky-400/60",
    badgeBg: "bg-sky-500/15 border-sky-500/30",
    badgeText: "text-sky-300",
    glow: "from-sky-600/15 via-sky-950/20 to-transparent",
    priceColor: "text-sky-200",
  },
  "E-commerce": {
    border: "border-emerald-500/30",
    hoverBorder: "hover:border-emerald-400/60",
    badgeBg: "bg-emerald-500/15 border-emerald-500/30",
    badgeText: "text-emerald-300",
    glow: "from-emerald-600/15 via-emerald-950/20 to-transparent",
    priceColor: "text-emerald-200",
  },
  "Design & Optimization": {
    border: "border-amber-500/30",
    hoverBorder: "hover:border-amber-400/60",
    badgeBg: "bg-amber-500/15 border-amber-500/30",
    badgeText: "text-amber-300",
    glow: "from-amber-600/15 via-amber-950/20 to-transparent",
    priceColor: "text-amber-200",
  },
  "AI & Automation": {
    border: "border-teal-500/30",
    hoverBorder: "hover:border-teal-400/60",
    badgeBg: "bg-teal-500/15 border-teal-500/30",
    badgeText: "text-teal-300",
    glow: "from-teal-600/15 via-teal-950/20 to-transparent",
    priceColor: "text-teal-200",
  },
  "Backend & APIs": {
    border: "border-violet-500/30",
    hoverBorder: "hover:border-violet-400/60",
    badgeBg: "bg-violet-500/15 border-violet-500/30",
    badgeText: "text-violet-300",
    glow: "from-violet-600/15 via-violet-950/20 to-transparent",
    priceColor: "text-violet-200",
  },
  "Maintenance & Support": {
    border: "border-rose-500/30",
    hoverBorder: "hover:border-rose-400/60",
    badgeBg: "bg-rose-500/15 border-rose-500/30",
    badgeText: "text-rose-300",
    glow: "from-rose-600/15 via-rose-950/20 to-transparent",
    priceColor: "text-rose-200",
  },
};

function CatalogCard({ service }: { service: ServiceDetail }) {
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
  const standardPrice = service.standardPriceINR || service.originalPriceINR || Math.round(service.startingPriceINR * 1.25);
  const unit = service.priceUnit || "";

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={shouldReduceMotion ? {} : { scale: 1.015, y: -4 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className={`rounded-3xl border ${style.border} ${style.hoverBorder} bg-gradient-to-b ${style.glow} p-7 sm:p-8 flex flex-col justify-between transition-colors duration-300 shadow-xl backdrop-blur-xl relative group overflow-hidden`}
    >
      {/* Mouse-Tracking Spotlight */}
      {isHovered && !shouldReduceMotion && (
        <div
          className="pointer-events-none absolute -inset-px rounded-3xl opacity-60 transition-opacity duration-300 z-0"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.12), transparent 75%)`,
          }}
          aria-hidden="true"
        />
      )}

      <div className="relative z-10">
        {/* Category Badge & Duration Pill */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span
            className={`text-[11px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${style.badgeBg} ${style.badgeText} font-semibold`}
          >
            {service.category}
          </span>

          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-300 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <Clock className="w-3 h-3 text-emerald-400" />
            <span>{service.durationMinutes}-Min Discovery Call</span>
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

        <p className="text-xs text-zinc-300 leading-relaxed mb-5 font-sans">
          {service.tagline}
        </p>

        {/* Price Plate: Standard vs Introductory Price */}
        <div className="pb-5 border-b border-white/[0.08] mb-5">
          <div className="p-3.5 rounded-xl bg-[#04060e]/90 border border-white/10 shadow-inner flex items-baseline justify-between gap-2">
            <div>
              <div className="text-[10px] font-mono text-zinc-400">
                <span>Standard: </span>
                <span className="line-through text-zinc-500">₹{standardPrice.toLocaleString("en-IN")}{unit}</span>
              </div>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xs font-mono text-emerald-400 font-medium">Introductory:</span>
                <span className={`text-2xl sm:text-3xl font-mono font-bold ${style.priceColor}`}>
                  ₹{service.startingPriceINR.toLocaleString("en-IN")}
                </span>
                <span className="text-[11px] font-mono text-zinc-400">{unit ? unit : "INR"}</span>
              </div>
            </div>

            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold shrink-0">
              20% SAVINGS
            </span>
          </div>
        </div>

        {/* Ideal For Pill Badge */}
        {service.idealFor && (
          <div className="mb-5 flex items-start gap-2 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-zinc-300">
            <Target className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-mono uppercase text-zinc-500 block">Best For:</span>
              <span className="text-zinc-300 text-xs font-sans leading-tight">{service.idealFor}</span>
            </div>
          </div>
        )}

        {/* Key Deliverables (3-4 items) */}
        <div className="space-y-2.5 mb-6">
          <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
            Key Deliverables
          </div>
          {service.deliverables.slice(0, 4).map((item, idx) => (
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
          className="inline-flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl border border-white/15 bg-white/[0.04] text-white text-xs font-mono font-medium hover:bg-white/[0.08] hover:border-white/30 transition-all text-center"
        >
          <span>Know More</span>
          <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
        </Link>

        <Link
          href={`/book?service=${service.slug}`}
          className="inline-flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 text-xs font-mono font-bold tracking-wide transition-all shadow-md text-center"
        >
          <span>Book Call</span>
        </Link>
      </div>
    </motion.div>
  );
}

export function ServiceCatalogView() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const services = FREELANCE_SERVICES;

  // Filter based on active category & search query
  const filteredServices = services.filter((service) => {
    const matchesCategory =
      activeCategory === "All" || service.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.deliverables.some((d) =>
        d.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-16">
      {/* Search and Category Filter Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-2 sm:p-2.5 rounded-2xl border border-white/10 bg-[#070b16]/80 backdrop-blur-xl">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none px-2">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-white text-zinc-950 font-semibold shadow-md shadow-white/10"
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Keyword Search Input */}
        <div className="relative w-full lg:w-72 px-2 lg:px-0">
          <Search className="w-4 h-4 text-zinc-500 absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search deliverables, tools..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#04060e] border border-white/10 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
          />
        </div>
      </div>

      {/* Grid of 8 Service Cards */}
      {filteredServices.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02]">
          <p className="text-sm font-mono text-zinc-400">
            No service matched your current search filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveCategory("All");
              setSearchQuery("");
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-white/[0.08] text-white text-xs font-mono hover:bg-white/[0.12] transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredServices.map((service) => (
            <CatalogCard key={service.id} service={service} />
          ))}

          {/* Custom Project Card */}
          <div className="rounded-3xl border border-dashed border-white/20 bg-gradient-to-b from-white/[0.03] to-transparent p-7 sm:p-8 flex flex-col justify-between backdrop-blur-xl">
            <div>
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-6 shadow-xs">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight mb-2">
                Need a Custom Solution?
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-6 font-sans">
                Have a specialized web requirement, multi-vendor idea, or legacy codebase you need help auditing? Submit your brief directly to receive a realistic scope estimate.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/[0.08]">
              <a
                href="#direct-quote"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/15 bg-white/[0.05] text-white text-xs font-mono font-medium hover:bg-white/[0.1] hover:border-white/30 transition-all shadow-xs"
              >
                <span>Request Custom Quote</span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-300" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Embedded Quote Form on Overview Page */}
      <section id="direct-quote" className="scroll-mt-24 pt-8 border-t border-white/[0.08]">
        <QuoteContactForm />
      </section>
    </div>
  );
}
