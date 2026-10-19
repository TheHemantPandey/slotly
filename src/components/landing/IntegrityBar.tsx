"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Terminal, Database, Sparkles, Layers, ShieldCheck } from "lucide-react";

const TECH_STACK = [
  { name: "Next.js 16", icon: Terminal, color: "text-zinc-200" },
  { name: "Neon PostgreSQL", icon: Database, color: "text-emerald-400" },
  { name: "Google Gemini 3.8 Flash", icon: Sparkles, color: "text-indigo-400" },
  { name: "Tailwind CSS 4", icon: Layers, color: "text-sky-400" },
];

export function IntegrityBar() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
      whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="py-12 bg-[#04060e] border-b border-white/[0.08] relative overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 backdrop-blur-md flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
          {/* Headline & Proof statement */}
          <div className="max-w-xl">
            <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-mono text-zinc-400 mb-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="uppercase tracking-wider">Full-Stack Engineering Standards</span>
            </div>
            <p className="text-sm sm:text-base font-medium text-zinc-200 font-sans">
              Delivering high-converting websites &amp; custom web applications for startups, local businesses, and individuals.
            </p>
          </div>

          {/* Stack Badges with micro hover */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            {TECH_STACK.map((tech) => {
              const Icon = tech.icon;
              return (
                <motion.div
                  key={tech.name}
                  whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#070b16] border border-white/10 text-xs font-mono text-zinc-300 shadow-sm hover:border-white/20 transition-colors cursor-default"
                >
                  <Icon className={`w-3.5 h-3.5 ${tech.color}`} strokeWidth={1.75} />
                  <span>{tech.name}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
