"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import {
  ExternalLink,
  ShieldCheck,
  Lock,
  Bot,
  Layers,
  Cpu,
  Database,
  Terminal,
  Check,
  Copy,
  Calendar,
  Sparkles,
  ArrowRight,
  MapPin,
  CheckCircle2,
  Code2,
} from "lucide-react";

interface PhilosophyItem {
  id: string;
  number: string;
  icon: React.ElementType;
  title: string;
  tagline: string;
  description: string;
  accent: string;
  badge: string;
}

const PHILOSOPHIES: PhilosophyItem[] = [
  {
    id: "direct-partnership",
    number: "01",
    icon: Lock,
    title: "Direct Engineering Partnership",
    tagline: "Direct Execution, Zero Agency Overhead",
    description:
      "Work directly with Hemant Pandey. No account managers, no communication bottlenecks, and no inflated agency fees. Clear milestone delivery, fast communication, and agile turnaround.",
    accent: "from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-400",
    badge: "Zero Middlemen",
  },
  {
    id: "performance-seo",
    number: "02",
    icon: Bot,
    title: "Mobile-First & High Performance",
    tagline: "Core Web Vitals & Search Visibility",
    description:
      "Every website is crafted with modern semantic markup and fluid styling for seamless performance across smartphones, tablets, and desktops, optimized for search engines (SEO) and high conversions.",
    accent: "from-indigo-500/20 to-violet-500/10 border-indigo-500/30 text-indigo-400",
    badge: "Mobile & SEO",
  },
  {
    id: "modern-stack",
    number: "03",
    icon: ShieldCheck,
    title: "Modern Full-Stack Architecture",
    tagline: "Next.js 16, React 19 & Serverless SQL",
    description:
      "Leveraging Next.js App Router, React 19, serverless PostgreSQL with Neon, and Prisma ORM to ensure lightning-fast page loads, rock-solid security, and effortless scalability as your business grows.",
    accent: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400",
    badge: "Modern Stack",
  },
  {
    id: "full-ownership",
    number: "04",
    icon: Layers,
    title: "100% Code Ownership & Zero Lock-in",
    tagline: "Clean Handover & Free Deployment",
    description:
      "Clients receive 100% ownership of all repository code, credentials, and design assets upon completion. Free setup and deployment to Vercel or your hosting provider of choice.",
    accent: "from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400",
    badge: "Full Ownership",
  },
];

const STACK_MATRIX = [
  {
    tier: "Core Framework",
    name: "Next.js 16 & React 19",
    tag: "Turbopack App Router",
    icon: Cpu,
    color: "text-blue-400 border-blue-500/30 bg-blue-950/30",
    description:
      "Next.js App Router with Server Components, streaming SSR, and microsecond hot-module replacement via Turbopack.",
    specs: ["React 19 Hooks", "App Router Architecture", "Server Actions & API Routes"],
  },
  {
    tier: "Persistence & State",
    name: "Neon PostgreSQL & Prisma",
    tag: "Serverless SQL",
    icon: Database,
    color: "text-emerald-400 border-emerald-500/30 bg-emerald-950/30",
    description:
      "Serverless PostgreSQL hosted on Neon with sub-millisecond connection pooling, Prisma ORM 6, and advisory row-level locking.",
    specs: ["pg_advisory_xact_lock", "Prisma 6 Type-Safe Schema", "Multi-Tenant Isolation"],
  },
  {
    tier: "Intelligent Tier",
    name: "Google Gemini 3.8 Flash",
    tag: "Real-Time Tool Bridge",
    icon: Bot,
    color: "text-violet-400 border-violet-500/30 bg-violet-950/30",
    description:
      "Real-time bidirectional function calling via `@google/genai` (v2.30.0). Time-grounded availability inspection with HMAC validation.",
    specs: ["@google/genai SDK", "Structured Tool Calling", "15-Min Signed Proposals"],
  },
  {
    tier: "Design & Interaction",
    name: "Tailwind CSS 4 & Motion",
    tag: "Fluid Micro-Physics",
    icon: Code2,
    color: "text-cyan-400 border-cyan-500/30 bg-cyan-950/30",
    description:
      "Executive dark aesthetic powered by Tailwind CSS 4 utility tokens, custom mesh radial atmospheres, and spring-physics micro-interactions.",
    specs: ["Tailwind v4 Engine", "motion/react Physics", "Strict Dark Palette"],
  },
];

const RUNBOOK_SNIPPETS = [
  {
    step: "01",
    title: "Clone & Install Dependencies",
    description: "Install project dependencies with support for React 19 and Next.js 16:",
    code: `git clone https://github.com/your-username/slotly.git
cd slotly
npm install`,
  },
  {
    step: "02",
    title: "Configure Environment Credentials",
    description: "Create your .env file with PostgreSQL (Neon) and Gemini API keys:",
    code: `# Database Connections
DATABASE_URL="postgresql://user:password@ep-pooler.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://user:password@ep.aws.neon.tech/neondb?sslmode=require"

# AI Concierge Engine
GEMINI_API_KEY="your-google-ai-studio-api-key"

# Security & Admin Password
NEXTAUTH_SECRET="generate-32-char-random-secret"
HMAC_SECRET="generate-32-char-hmac-secret"`,
  },
  {
    step: "03",
    title: "Synchronize Schema & Seed Catalog",
    description: "Deploy the Prisma schema and populate default advisory disciplines:",
    code: `npm run db:push
npm run db:seed`,
  },
  {
    step: "04",
    title: "Launch Development Engine",
    description: "Start the local Next.js Turbopack development server on port 3000:",
    code: `npm run dev
# Open in browser: http://localhost:3000`,
  },
];

export function AboutView() {
  const shouldReduceMotion = useReducedMotion();
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(code);
      setCopiedSnippet(id);
      setTimeout(() => setCopiedSnippet(null), 2000);
    }
  };

  return (
    <div className="space-y-24">
      {/* 1. Lead Persona & Executive Hero */}
      <section className="relative">
        <div className="rounded-3xl border border-white/10 bg-[#070b16]/90 p-8 sm:p-12 lg:p-14 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          {/* Subtle Top Accent Highlight */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
            {/* Left: Persona Details */}
            <div className="flex-1 space-y-6">
              {/* Badges Strip */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-xs font-mono text-emerald-300 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-xs shadow-emerald-400" />
                  <span>Available for Client Projects</span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/[0.04] text-xs font-mono text-zinc-300">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Gurugram, India (IST)</span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-950/40 text-xs font-mono text-blue-300">
                  <span>8 Freelance Web Services</span>
                </div>
              </div>

              {/* Persona Headline & Bio */}
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                  Hemant Pandey
                </h1>
                <p className="mt-2 text-lg sm:text-xl font-mono text-indigo-300 font-medium">
                  Full-Stack Web Developer &amp; Systems Engineer
                </p>
                <p className="mt-4 text-base text-zinc-400 leading-relaxed max-w-2xl font-sans">
                  Specialized in crafting high-converting websites, custom web applications, e-commerce
                  platforms, and appointment systems for businesses, startups, and individuals.
                  Offering 8 practical web development services with transparent upfront pricing,
                  fast turnaround, direct developer execution, and 100% full source code ownership.
                </p>
              </div>

              {/* External Portfolio CTA & Actions */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <motion.div
                  whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                >
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white text-sm font-mono font-medium hover:from-blue-500 hover:to-violet-500 transition-all shadow-lg shadow-indigo-500/25 border border-indigo-400/30 cursor-pointer"
                  >
                    <span>View All 8 Services</span>
                    <ArrowRight className="w-4 h-4 text-indigo-200" />
                  </Link>
                </motion.div>

                <Link
                  href="/book"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/15 bg-white/[0.04] text-zinc-200 text-sm font-mono hover:bg-white/[0.08] hover:text-white transition-all cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-zinc-400" />
                  <span>Book Discovery Call</span>
                </Link>

                <a
                  href="https://hemantpandey.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 bg-white/[0.02] text-zinc-400 text-xs font-mono hover:text-white hover:border-white/20 transition-all cursor-pointer"
                >
                  <span>hemantpandey.in</span>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                </a>
              </div>
            </div>

            {/* Right: Real Executive Portrait Card */}
            <div className="shrink-0 flex items-center justify-center w-full lg:w-auto">
              <div className="relative group">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 opacity-40 blur-xl group-hover:opacity-70 transition duration-500" />
                <div className="relative w-60 sm:w-64 rounded-3xl bg-[#090e1d]/95 border border-white/15 flex flex-col items-center justify-center shadow-2xl p-6 text-center backdrop-blur-xl">
                  {/* Portrait Photo with ambient glow & online ring */}
                  <div className="relative mb-4">
                    <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-emerald-400 opacity-60 blur-xs group-hover:opacity-100 transition-opacity" />
                    <Image
                      src="/images/dev_hemantpandey.jpg"
                      alt="Hemant Pandey - Full-Stack Web Developer"
                      width={120}
                      height={120}
                      className="relative h-28 w-28 rounded-2xl object-cover ring-2 ring-white/20 shadow-xl group-hover:scale-105 transition-transform duration-300"
                      priority
                    />
                    <span
                      className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 ring-2 ring-[#090e1d] shadow-sm shadow-emerald-400 animate-pulse"
                      title="Available for Projects"
                    />
                  </div>
                  <span className="text-base font-semibold tracking-tight text-white font-sans">
                    Hemant Pandey
                  </span>
                  <span className="text-xs font-mono text-zinc-400 mt-0.5">
                    Full-Stack Web Developer
                  </span>
                  <div className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Verified Builder</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Core Advisory Philosophy (4 Strategic Cards) */}
      <section className="space-y-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-950/40 text-xs font-mono text-indigo-300 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Architectural Axioms</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
            Core Engineering &amp; Advisory Philosophy
          </h2>
          <p className="mt-3 text-base text-zinc-400 max-w-3xl font-sans">
            Principles honed through designing mission-critical enterprise systems where race
            conditions, ungrounded AI hallucinations, and security leaks are unacceptable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PHILOSOPHIES.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                whileHover={shouldReduceMotion ? {} : { y: -3 }}
                transition={{ duration: 0.2 }}
                className={`rounded-2xl border bg-gradient-to-b p-7 backdrop-blur-xl shadow-xl flex flex-col justify-between ${item.accent}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="h-10 w-10 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-white">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-zinc-300">
                      {item.badge}
                    </span>
                  </div>

                  <div className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-1">
                    Principle {item.number} · {item.tagline}
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. Technical Architecture & Stack Matrix */}
      <section className="space-y-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-950/40 text-xs font-mono text-blue-300 mb-3">
            <Cpu className="w-3.5 h-3.5 text-blue-400" />
            <span>Industrial Stack Matrix</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
            Production Architecture &amp; Technology Stack
          </h2>
          <p className="mt-3 text-base text-zinc-400 max-w-3xl font-sans">
            Every layer of Slotly is chosen for deterministic state verification, speed, and strict
            separation of concerns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STACK_MATRIX.map((stack) => {
            const Icon = stack.icon;
            return (
              <div
                key={stack.tier}
                className="rounded-2xl border border-white/10 bg-[#070b16]/90 p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`h-9 w-9 rounded-lg border flex items-center justify-center ${stack.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-zinc-400">
                      {stack.tag}
                    </span>
                  </div>

                  <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-semibold">
                    {stack.tier}
                  </span>
                  <h3 className="text-lg font-bold text-white tracking-tight mt-1 mb-2">
                    {stack.name}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans mb-5">
                    {stack.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[0.08] space-y-1.5">
                  {stack.specs.map((spec) => (
                    <div key={spec} className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                      <span className="w-1 h-1 rounded-full bg-emerald-400" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Developer Runbook & How to Run Slotly Locally */}
      <section className="space-y-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-xs font-mono text-emerald-300 mb-3">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Engineer Runbook</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
            How to Run &amp; Use Slotly Locally
          </h2>
          <p className="mt-3 text-base text-zinc-400 max-w-3xl font-sans">
            Step-by-step instructions for engineering leads and developers wishing to clone,
            configure, and audit the repository locally.
          </p>
        </div>

        <div className="space-y-6">
          {RUNBOOK_SNIPPETS.map((step) => {
            const isCopied = copiedSnippet === step.step;
            return (
              <div
                key={step.step}
                className="rounded-2xl border border-white/10 bg-[#070b16]/90 p-6 md:p-7 backdrop-blur-xl shadow-xl space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="h-7 w-7 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                      {step.step}
                    </span>
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      {step.title}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(step.code, step.step)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.04] text-xs font-mono text-zinc-300 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer self-start sm:self-auto"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Copy Block</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  {step.description}
                </p>

                <div className="relative rounded-xl border border-white/[0.08] bg-[#020409] p-4 font-mono text-xs text-zinc-300 overflow-x-auto shadow-inner">
                  <pre>
                    <code>{step.code}</code>
                  </pre>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Executive CTA Card */}
      <section className="relative">
        <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-b from-indigo-950/40 via-[#070b16]/90 to-[#04060e] p-8 md:p-14 text-center backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent" />

          {/* Advisor Identity Chip */}
          <div className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full border border-indigo-400/30 bg-indigo-950/60 mb-5 shadow-xs">
            <Image
              src="/images/dev_hemantpandey.jpg"
              alt="Hemant Pandey"
              width={26}
              height={26}
              className="w-6.5 h-6.5 rounded-full object-cover ring-1 ring-white/30"
            />
            <span className="text-xs font-mono text-indigo-200">
              Direct Collaboration with Hemant Pandey
            </span>
          </div>

          <h2 className="mx-auto max-w-3xl text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Have a website or web application project in mind?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-zinc-300 leading-relaxed font-sans">
            Choose from 8 practical web development services starting at ₹999 or schedule a discovery call to discuss your custom project requirements and timeline.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <motion.div
              whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            >
              <Link
                href="/services"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 text-white text-sm font-mono font-medium tracking-wide hover:from-blue-500 hover:to-emerald-500 transition-all shadow-xl shadow-emerald-500/20 border border-emerald-400/30 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-emerald-200" />
                <span>Explore All 8 Services</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>
            </motion.div>

            <motion.div
              whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            >
              <Link
                href="/book"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/15 bg-white/[0.04] text-zinc-200 text-sm font-mono tracking-wide hover:bg-white/[0.08] hover:text-white hover:border-white/25 transition-all backdrop-blur-sm cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-zinc-400" />
                <span>Book Discovery Call</span>
              </Link>
            </motion.div>

            <motion.div
              whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            >
              <Link
                href="/assistant"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/15 bg-white/[0.04] text-zinc-200 text-sm font-mono tracking-wide hover:bg-white/[0.08] hover:text-white hover:border-white/25 transition-all backdrop-blur-sm cursor-pointer"
              >
                <Bot className="w-4 h-4 text-indigo-300" />
                <span>Launch AI Concierge</span>
              </Link>
            </motion.div>

            <motion.div
              whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            >
              <a
                href="https://hemantpandey.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/15 bg-white/[0.04] text-zinc-200 text-sm font-mono tracking-wide hover:bg-white/[0.08] hover:text-white hover:border-white/25 transition-all backdrop-blur-sm cursor-pointer"
              >
                <span>hemantpandey.in</span>
                <ExternalLink className="w-4 h-4 text-zinc-400" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
