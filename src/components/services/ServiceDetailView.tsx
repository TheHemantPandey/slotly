"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { ServiceDetail } from "@/lib/types";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { QuoteContactForm } from "./QuoteContactForm";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  Calendar,
  Check,
  Target,
  AlertCircle,
  Code2,
  Database,
  Cpu,
  Layers,
  Smartphone,
  Lock,
  TrendingUp,
} from "lucide-react";

interface ServiceDetailViewProps {
  service: ServiceDetail;
  relatedServices: ServiceDetail[];
}

function getTechIcon(tech: string) {
  const t = tech.toLowerCase();
  if (t.includes("next") || t.includes("react")) return <Code2 className="w-3.5 h-3.5 text-blue-400" />;
  if (t.includes("sql") || t.includes("database") || t.includes("prisma")) return <Database className="w-3.5 h-3.5 text-emerald-400" />;
  if (t.includes("gemini") || t.includes("ai") || t.includes("llm")) return <Cpu className="w-3.5 h-3.5 text-teal-400" />;
  if (t.includes("mobile") || t.includes("responsive")) return <Smartphone className="w-3.5 h-3.5 text-amber-400" />;
  if (t.includes("auth") || t.includes("security")) return <Lock className="w-3.5 h-3.5 text-indigo-400" />;
  return <Layers className="w-3.5 h-3.5 text-violet-400" />;
}

export function ServiceDetailView({
  service,
  relatedServices,
}: ServiceDetailViewProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const originalPrice = service.originalPriceINR || Math.round(service.startingPriceINR * 1.25);
  const discountPercent = service.discountPercent || 20;

  return (
    <div className="space-y-16 sm:space-y-24 text-left">
      {/* 1. Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-mono text-zinc-400">
        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Services</span>
        </Link>
        <span className="text-zinc-600">/</span>
        <span className="text-indigo-400 font-semibold">{service.category}</span>
        <span className="text-zinc-600">/</span>
        <span className="text-zinc-200 truncate">{service.title}</span>
      </nav>

      {/* 2. Hero Section: Value Proposition & Pricing Highlight */}
      <section className="relative">
        <div className="rounded-3xl border border-white/10 bg-[#070b16]/90 p-8 sm:p-12 lg:p-14 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          {/* Subtle Top Accent Highlight */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
            {/* Left Content */}
            <div className="flex-1 space-y-6">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-950/40 text-xs font-mono text-indigo-300">
                  {service.category}
                </span>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-xs font-mono text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{service.durationMinutes}-Min Initial Discovery Call</span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/[0.04] text-xs font-mono text-zinc-400">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Est. {service.estimatedDelivery}</span>
                </div>
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                  {service.title}
                </h1>
                <p className="mt-3 text-base sm:text-lg text-zinc-300 leading-relaxed font-sans max-w-3xl">
                  {service.description}
                </p>
              </div>

              {/* Instant Action CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#book-call"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-zinc-950 text-xs font-mono font-bold hover:from-emerald-400 hover:to-teal-400 transition-all shadow-lg shadow-emerald-500/25 border border-emerald-400 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-zinc-950" />
                  <span>Book Discovery Call →</span>
                </a>

                <a
                  href="#deliverables"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border border-white/15 bg-white/[0.04] text-zinc-200 text-xs font-mono hover:bg-white/[0.08] hover:text-white transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>View Exact Deliverables</span>
                </a>
              </div>
            </div>

            {/* Right: Pricing Card with 20% Discount */}
            <div className="shrink-0 w-full lg:w-80">
              <div className="relative group">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 opacity-25 blur-xl group-hover:opacity-40 transition duration-500" />
                <div className="relative rounded-2xl bg-[#090e1d] border border-white/15 p-6 shadow-2xl text-left">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                      Transparent Pricing
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono text-emerald-300 font-bold uppercase">
                      {discountPercent}% Limited Off
                    </span>
                  </div>

                  <div className="mb-1 text-xs font-mono text-zinc-500 line-through">
                    Was ₹{originalPrice.toLocaleString("en-IN")} INR
                  </div>

                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-xs font-mono text-zinc-400">Starts from</span>
                    <span className="text-3xl sm:text-4xl font-mono font-bold text-emerald-400 tracking-tight">
                      ₹{service.startingPriceINR.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs font-mono text-zinc-400">INR</span>
                  </div>

                  <p className="text-[11px] text-zinc-400 leading-relaxed font-sans mb-4 border-b border-white/[0.08] pb-4">
                    Introductory discovery call is 100% free with no obligation. Final project investment is scoped transparently to your exact requirements.
                  </p>

                  <div className="space-y-2 text-xs font-mono text-zinc-300 mb-6">
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Direct developer execution</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Clean modular code handover</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Zero vendor lock-in</span>
                    </div>
                  </div>

                  <a
                    href="#book-call"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white text-zinc-950 text-xs font-mono font-semibold hover:bg-zinc-100 transition-all shadow-md text-center"
                  >
                    <span>Schedule Free Call</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. "What You Get / Exact Deliverables" Section (4 to 6 detailed bullet cards) */}
      <section id="deliverables" className="space-y-6 scroll-mt-24">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Scope Clarity // What You Get</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
            Exact Deliverables &amp; Package Inclusions
          </h2>
          <p className="text-sm text-zinc-400 mt-1 font-sans">
            Every deliverable is engineered for tangible business results, clean maintainability, and fast deployment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {service.deliverables.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#070b16] border border-white/10 hover:border-emerald-500/40 transition-colors shadow-lg flex items-start gap-3.5"
            >
              <div className="h-7 w-7 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5 text-emerald-400">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 block mb-1">
                  Deliverable 0{idx + 1}
                </span>
                <span className="text-sm text-zinc-200 font-sans leading-relaxed block">
                  {item}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. "How This Solves Your Business Bottlenecks" (ROI Focus: Before vs After) */}
      {service.beforeAfter && service.beforeAfter.length > 0 && (
        <section className="space-y-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-indigo-400 font-semibold flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>ROI &amp; Business Transformation</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
              How This Solves Your Business Bottlenecks
            </h2>
            <p className="text-sm text-zinc-400 mt-1 font-sans">
              Compare your current challenges against the operational advantages of working with us.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {service.beforeAfter.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-[#070b16] p-6 shadow-xl flex flex-col justify-between space-y-4"
              >
                {/* Before */}
                <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-900/30">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-semibold flex items-center gap-1 mb-1.5">
                    <XCircle className="w-3 h-3" />
                    <span>Before (Old Way)</span>
                  </span>
                  <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                    {item.before}
                  </p>
                </div>

                {/* After */}
                <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-900/40">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1 mb-1.5">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>After (With Us)</span>
                  </span>
                  <p className="text-xs text-zinc-200 font-sans leading-relaxed font-medium">
                    {item.after}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Tech Stack & Architecture Guarantees */}
      {service.techStack && service.techStack.length > 0 && (
        <section className="p-7 sm:p-8 rounded-3xl bg-[#070b16] border border-white/10 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-indigo-400 font-semibold flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5" />
                <span>Production Standard</span>
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
                Tech Stack &amp; Architecture Guarantees
              </h2>
            </div>
            <span className="text-xs font-mono text-zinc-400">
              Modern • Fast • Self-Hosted
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {service.techStack.map((tech, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all font-mono text-xs text-zinc-200"
              >
                {getTechIcon(tech)}
                <span>{tech}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. Target Audience vs Problems Solved Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-7 rounded-3xl bg-[#070b16] border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold">
            <Target className="w-4 h-4 text-indigo-400" />
            <span>Target Audience</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Who This Service Is Built For
          </h3>
          <ul className="space-y-3">
            {service.whoIsItFor.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-zinc-300 font-sans">
                <div className="h-5 w-5 rounded-full bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5 text-indigo-400 font-mono text-xs">
                  ✓
                </div>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-7 rounded-3xl bg-[#070b16] border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-rose-400 font-semibold">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>Pain Points Eliminated</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Common Bottlenecks We Eliminate
          </h3>
          <ul className="space-y-3">
            {service.problemsSolved.map((problem, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-zinc-300 font-sans">
                <div className="h-5 w-5 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shrink-0 mt-0.5 text-rose-400 font-mono text-xs">
                  ✕
                </div>
                <span className="leading-relaxed">{problem}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 7. FAQs */}
      {service.faqs && service.faqs.length > 0 && (
        <section className="space-y-5">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-indigo-400 font-semibold">
              Clarity &amp; Questions
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-2.5">
            {service.faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-white/10 bg-[#070b16] overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                  >
                    <span className="text-sm sm:text-base font-semibold text-white tracking-tight">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-white" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans border-t border-white/[0.04]">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 8. BOTTOM EXPRESS BOOKING WIDGET (Embedded Directly!) */}
      <section id="book-call" className="scroll-mt-24 pt-6 border-t border-white/[0.08]">
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-xs font-mono text-emerald-300 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>INSTANT DISCOVERY INTAKE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Schedule Your {service.durationMinutes}-Minute Discovery Session
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 font-sans">
            Pick an open slot below to lock in an introductory consultation for {service.title}.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="p-12 text-center font-mono text-xs text-zinc-400 space-y-2">
              <div className="h-5 w-5 border-2 border-emerald-400 border-r-transparent rounded-full animate-spin inline-block" />
              <div>Initializing express booking widget...</div>
            </div>
          }
        >
          <BookingWizard initialServiceId={service.id} />
        </Suspense>
      </section>

      {/* 9. Optional Async Quote Request Form */}
      <section id="quote" className="scroll-mt-24 pt-8 border-t border-white/[0.08]">
        <div className="mb-4">
          <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
            Prefer Email / Written Scope?
          </span>
          <h3 className="text-lg font-bold text-white mt-0.5">
            Request an Async Project Proposal
          </h3>
        </div>
        <QuoteContactForm initialServiceSlug={service.slug} />
      </section>

      {/* 10. Related Services */}
      {relatedServices.length > 0 && (
        <section className="space-y-6 pt-8 border-t border-white/[0.08]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-indigo-400 font-semibold">
                Explore More Solutions
              </span>
              <h2 className="text-xl font-bold tracking-tight text-white mt-1">
                Related Services
              </h2>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-indigo-300 hover:text-white transition-colors"
            >
              <span>View All Services</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedServices.map((rel) => (
              <Link
                key={rel.slug}
                href={`/services/${rel.slug}`}
                className="group p-5 rounded-2xl bg-[#070b16] border border-white/10 hover:border-emerald-500/40 transition-all flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-2.5">
                    <span className="text-indigo-400 text-[11px]">{rel.category}</span>
                    <span className="text-emerald-400 font-bold text-xs">
                      Starts from ₹{rel.startingPriceINR.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors mb-1.5">
                    {rel.title}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed font-sans mb-3">
                    {rel.tagline}
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 group-hover:text-white pt-2 border-t border-white/[0.06]">
                  <span>Explore Service</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
