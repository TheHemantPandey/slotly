"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Sparkles, ArrowRight, Calendar } from "lucide-react";

export function BottomConversion() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={shouldReduceMotion ? {} : { opacity: 0, y: 24 }}
      whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="py-20 md:py-28 bg-[#04060e] relative overflow-hidden"
    >
      {/* Deep Ambient Glows */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[850px] h-[400px] opacity-30 blur-[130px]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, #4338ca 0%, #1e1b4b 60%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-b from-indigo-950/40 via-[#070b16]/90 to-[#04060e] p-8 md:p-14 lg:p-16 text-center backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          {/* Subtle Top Highlight */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent" />

          {/* Micro Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-400/30 bg-indigo-950/60 text-xs font-mono text-indigo-300 mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Instant Confirmation • No Double-Bookings</span>
          </div>

          {/* Headline */}
          <h2 className="mx-auto max-w-3xl text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Ready to elevate your engineering and architecture?
          </h2>

          {/* Subhead */}
          <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-zinc-300 leading-relaxed font-sans">
            Select a consulting practice track and secure your advisory window with zero double-bookings.
          </p>

          {/* Dual CTAs with Shimmer & Spring Click Physics */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <motion.div
              whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Link
                href="/book"
                className="relative overflow-hidden inline-flex items-center gap-2.5 px-7 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 text-white text-sm font-mono font-medium tracking-wide hover:from-blue-500 hover:to-emerald-500 transition-all shadow-xl shadow-emerald-500/30 border border-emerald-400/40 group"
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
                className="inline-flex items-center gap-2 px-7 py-4 rounded-xl border border-white/20 bg-white/[0.04] text-zinc-200 text-sm font-mono tracking-wide hover:bg-white/[0.08] hover:text-white hover:border-white/30 transition-all backdrop-blur-sm"
              >
                <Calendar className="w-4 h-4 text-zinc-400" />
                <span>View All Services</span>
              </Link>
            </motion.div>
          </div>

          {/* Mini Guarantee Footnote */}
          <div className="mt-8 pt-6 border-t border-white/[0.08] flex items-center justify-center gap-6 text-xs font-mono text-zinc-400">
            <span>✓ Verified Asia/Kolkata Calendar</span>
            <span>•</span>
            <span>✓ Encrypted Management Token</span>
            <span>•</span>
            <span>✓ Immediate Google Meet / Video Link</span>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
