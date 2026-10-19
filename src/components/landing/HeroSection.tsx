"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "motion/react";
import {
  ArrowRight,
  ShieldCheck,
  Lock,
  Zap,
  Calendar,
} from "lucide-react";

const TRUST_METRICS = [
  {
    icon: ShieldCheck,
    title: "Zero Overlaps",
    description: "Guaranteed instant slot lock via ACID database transactions.",
    badge: "100% Conflict-Free",
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  },
  {
    icon: Lock,
    title: "Verified Bookings",
    description: "Cryptographically secure proposals with tamper-proof signatures.",
    badge: "HMAC-SHA256",
    color: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  },
  {
    icon: Zap,
    title: "Instant Confirmation",
    description: "Direct server writes confirm sessions in under 1 second.",
    badge: "< 1s Finalization",
    color: "text-violet-400 bg-violet-500/10 border-violet-500/30",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 100,
    },
  },
};

export function HeroSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden pt-16 pb-16 md:pt-24 md:pb-24 bg-[#04060e] border-b border-white/[0.08]">
      {/* Deliverable 1: Ambient Background Atmosphere (Two slowly drifting pulsating radial orbs) */}
      <motion.div
        className="pointer-events-none absolute -top-10 left-1/4 -translate-x-1/2 w-[650px] h-[450px] blur-[140px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, #0284c7 0%, #2563eb 45%, transparent 70%)",
        }}
        animate={
          shouldReduceMotion
            ? { opacity: 0.2 }
            : {
                scale: [1, 1.15, 1],
                opacity: [0.15, 0.28, 0.15],
                x: [0, 25, 0],
                y: [0, -18, 0],
              }
        }
        transition={{
          repeat: Infinity,
          duration: 12,
          ease: "easeInOut",
        }}
        aria-hidden="true"
      />

      <motion.div
        className="pointer-events-none absolute top-1/4 right-1/4 translate-x-1/3 w-[600px] h-[480px] blur-[150px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, #7c3aed 0%, #4f46e5 50%, transparent 70%)",
        }}
        animate={
          shouldReduceMotion
            ? { opacity: 0.2 }
            : {
                scale: [1.12, 1, 1.12],
                opacity: [0.22, 0.14, 0.22],
                x: [0, -30, 0],
                y: [0, 20, 0],
              }
        }
        transition={{
          repeat: Infinity,
          duration: 14,
          ease: "easeInOut",
        }}
        aria-hidden="true"
      />

      {/* Subtle Dot Grid */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40"
        aria-hidden="true"
      />

      {/* Deliverable 2: Hero Stagger & Micro-Physics */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          variants={containerVariants}
          initial={shouldReduceMotion ? "visible" : "hidden"}
          animate="visible"
          className="flex flex-col items-center"
        >
          {/* Live Status Pill */}
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-400/30 bg-emerald-950/40 text-emerald-300 font-mono text-xs mb-8 shadow-lg shadow-emerald-950/40 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 duration-1000" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-xs shadow-emerald-300" />
              </span>
              <span className="text-zinc-400 font-normal">LIVE ADVISORY CALENDAR</span>
              <span className="text-zinc-600">•</span>
              <span className="font-semibold text-emerald-300">ASIA/KOLKATA (IST)</span>
            </div>
          </motion.div>

          {/* High-Impact Headline */}
          <motion.h1
            variants={itemVariants}
            className="mx-auto max-w-4xl text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.08]"
          >
            <span className="bg-gradient-to-r from-white via-zinc-100 to-blue-200 bg-clip-text text-transparent">
              Book World-Class Tech Advisory in Seconds.
            </span>
          </motion.h1>

          {/* Executive Subline */}
          <motion.p
            variants={itemVariants}
            className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-zinc-400 leading-relaxed font-sans"
          >
            Direct access to senior technology consultants. Guaranteed zero double-bookings,
            conflict-free scheduling, and verified instant calendar confirmation.
          </motion.p>

          {/* Action CTAs with Deliverable 6 Shimmer & Spring Click Feedback */}
          <motion.div
            variants={itemVariants}
            className="mt-9 flex flex-wrap items-center justify-center gap-4"
          >
            <motion.div
              whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Link
                href="/book"
                className="relative overflow-hidden inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 text-white text-sm font-mono font-medium tracking-wide hover:from-blue-500 hover:to-emerald-500 transition-all shadow-xl shadow-emerald-500/20 border border-emerald-400/40 group"
              >
                {/* Continuous Diagonal Light Shimmer */}
                {!shouldReduceMotion && (
                  <motion.div
                    className="pointer-events-none absolute -inset-y-4 -inset-x-8 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12"
                    animate={{
                      x: ["-100%", "450%"],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 3.2,
                      ease: "easeInOut",
                      repeatDelay: 1.2,
                    }}
                  />
                )}
                <Calendar className="w-4 h-4 text-emerald-200 transition-transform group-hover:scale-110 relative z-10" />
                <span className="relative z-10">Book Advisory Session</span>
                <ArrowRight className="w-4 h-4 text-white transition-transform group-hover:translate-x-1 relative z-10" />
              </Link>
            </motion.div>

            <motion.div
              whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/15 bg-white/[0.04] text-zinc-200 text-sm font-mono tracking-wide hover:bg-white/[0.08] hover:text-white hover:border-white/25 transition-all backdrop-blur-sm"
              >
                <span>Browse Advisory Tracks</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Executive Trust Stats with Entrance Spring & Hover Micro-lift */}
          <motion.div
            variants={containerVariants}
            className="w-full mt-14 pt-10 border-t border-white/[0.08] grid grid-cols-1 md:grid-cols-3 gap-6 text-left"
          >
            {TRUST_METRICS.map((metric) => {
              const Icon = metric.icon;
              return (
                <motion.div
                  key={metric.title}
                  variants={cardVariants}
                  whileHover={
                    shouldReduceMotion
                      ? {}
                      : {
                          y: -3,
                          borderColor: "rgba(255,255,255,0.25)",
                        }
                  }
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6 backdrop-blur-xl shadow-lg cursor-default transition-colors duration-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`h-9 w-9 rounded-xl border ${metric.color} flex items-center justify-center shadow-xs`}
                    >
                      <Icon className="w-4 h-4" strokeWidth={1.75} />
                    </div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 px-2.5 py-0.5 rounded bg-white/[0.03] border border-white/[0.06]">
                      {metric.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {metric.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed font-sans">
                    {metric.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
