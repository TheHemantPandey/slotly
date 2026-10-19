"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ServiceDetail } from "@/lib/types";
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
} from "lucide-react";

interface ServiceDetailViewProps {
  service: ServiceDetail;
  relatedServices: ServiceDetail[];
}

export function ServiceDetailView({
  service,
  relatedServices,
}: ServiceDetailViewProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="space-y-20 sm:space-y-28">
      {/* 1. Breadcrumbs & Return Link */}
      <nav className="flex items-center gap-2 text-xs font-mono text-zinc-400">
        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Services Overview</span>
        </Link>
        <span className="text-zinc-600">/</span>
        <span className="text-indigo-400 font-semibold">{service.category}</span>
        <span className="text-zinc-600">/</span>
        <span className="text-zinc-200 truncate">{service.title}</span>
      </nav>

      {/* 2. Hero Section: Title, Intro & Prominent Starting Price */}
      <section className="relative">
        <div className="rounded-3xl border border-white/10 bg-[#070b16]/90 p-8 sm:p-12 lg:p-14 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          {/* Subtle Top Accent Highlight */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
            {/* Left Content */}
            <div className="flex-1 space-y-6">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-950/40 text-xs font-mono text-indigo-300">
                  {service.category}
                </span>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-xs font-mono text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Open for Projects</span>
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

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#quote"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 text-white text-xs font-mono font-medium hover:from-blue-500 hover:to-emerald-500 transition-all shadow-lg shadow-indigo-600/20 border border-indigo-400/30 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>Get a Project Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <Link
                  href={`/book?service=${service.id}`}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border border-white/15 bg-white/[0.04] text-zinc-200 text-xs font-mono hover:bg-white/[0.08] hover:text-white transition-all cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-zinc-400" />
                  <span>Book Consultation Call</span>
                </Link>
              </div>
            </div>

            {/* Right: Prominent Starting Price Card */}
            <div className="shrink-0 w-full lg:w-72">
              <div className="relative group">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 opacity-30 blur-xl group-hover:opacity-50 transition duration-500" />
                <div className="relative rounded-2xl bg-[#090e1d] border border-white/15 p-6 shadow-2xl text-left">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold mb-1">
                    Transparent Investment
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-xs font-mono text-zinc-400">Starting at</span>
                    <span className="text-3xl sm:text-4xl font-mono font-bold text-white tracking-tight">
                      ₹{service.startingPriceINR.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs font-mono text-zinc-400">INR</span>
                  </div>

                  <p className="text-[11px] text-zinc-400 leading-relaxed font-sans mb-4 border-b border-white/[0.08] pb-4">
                    Final pricing depends on your exact project scope and custom features. No hidden charges.
                  </p>

                  <div className="space-y-2 text-xs font-mono text-zinc-300">
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
                      <span>Milestone-based progress</span>
                    </div>
                  </div>

                  <a
                    href="#quote"
                    className="mt-6 w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white text-zinc-950 text-xs font-mono font-semibold hover:bg-zinc-100 transition-all shadow-md"
                  >
                    <span>Discuss Requirements</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Who It's For & Problems Solved Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Who This Is For */}
        <div className="p-8 rounded-3xl bg-[#070b16]/70 border border-white/10 backdrop-blur-xl relative overflow-hidden">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold mb-3">
            <Target className="w-4 h-4 text-indigo-400" />
            <span>Target Audience</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight mb-4">
            Who This Service Is For
          </h2>
          <ul className="space-y-3.5">
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

        {/* Right: Problems Solved */}
        <div className="p-8 rounded-3xl bg-[#070b16]/70 border border-white/10 backdrop-blur-xl relative overflow-hidden">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-rose-400 font-semibold mb-3">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>Pain Points Eliminated</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight mb-4">
            Common Problems This Solves
          </h2>
          <ul className="space-y-3.5">
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

      {/* 4. Included Deliverables vs What is NOT Included */}
      <section className="space-y-8">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-indigo-400 font-semibold">
            Scope Clarity // Complete Transparency
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-white mt-1">
            Deliverables &amp; Package Boundaries
          </h2>
          <p className="text-sm text-zinc-400 mt-1 font-sans">
            Every deliverable is clearly specified upfront so you know exactly what is included and what is considered an extra.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Deliverables Included (7 cols) */}
          <div className="lg:col-span-7 p-8 rounded-3xl bg-gradient-to-b from-[#090e1d] to-[#04060e] border border-emerald-500/30 shadow-xl space-y-5">
            <div className="flex items-center gap-2 pb-4 border-b border-white/[0.08]">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white tracking-tight">
                Included in This Package
              </h3>
            </div>
            <div className="space-y-3.5">
              {service.includedDeliverables.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 text-sm text-zinc-200 font-sans">
                  <div className="h-4.5 w-4.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5 text-emerald-400">
                    <Check className="w-2.5 h-2.5" strokeWidth={3} />
                  </div>
                  <span className="leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* What is NOT Included (5 cols) */}
          <div className="lg:col-span-5 p-8 rounded-3xl bg-[#090e1d]/50 border border-white/10 shadow-xl space-y-5">
            <div className="flex items-center gap-2 pb-4 border-b border-white/[0.08]">
              <XCircle className="w-5 h-5 text-zinc-400" />
              <h3 className="text-lg font-bold text-white tracking-tight">
                Not Included / Extra Cost
              </h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              To keep starting prices accessible, third-party subscriptions and advanced customizations are priced separately when needed:
            </p>
            <div className="space-y-3.5">
              {service.notIncluded.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs text-zinc-400 font-sans">
                  <div className="h-4 w-4 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center shrink-0 mt-0.5 text-zinc-500 text-[10px]">
                    —
                  </div>
                  <span className="leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Benefits and Expected Outcomes (No Fake Guarantees) */}
      <section className="p-8 sm:p-12 rounded-3xl bg-[#070b16] border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl mb-8">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Measurable Value</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Expected Outcomes &amp; Core Benefits
          </h2>
          <p className="text-sm text-zinc-400 mt-1 font-sans">
            Real engineering outcomes grounded in speed, usability, and technical ownership—without exaggerated or unsupported revenue claims.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {service.benefitsAndOutcomes.map((benefit, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-3.5 text-sm text-zinc-300 font-sans"
            >
              <div className="h-6 w-6 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0 text-blue-400 font-mono text-xs font-bold">
                0{idx + 1}
              </div>
              <span className="leading-relaxed">{benefit}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 6. 5-Step Development Process */}
      <section className="space-y-8">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-indigo-400 font-semibold">
            Methodology // Structured Delivery
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-white mt-1">
            How We Work Together
          </h2>
          <p className="text-sm text-zinc-400 mt-1 font-sans">
            A clear 5-step development workflow ensuring predictable progress, active feedback, and zero guesswork.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {service.developmentProcess.map((step, idx) => (
            <div
              key={step.step}
              className="p-6 rounded-2xl bg-[#070b16] border border-white/10 flex flex-col justify-between hover:border-indigo-500/30 transition-colors"
            >
              <div>
                <span className="font-mono text-2xl font-bold text-indigo-400 block mb-3">
                  {step.step}
                </span>
                <h3 className="text-base font-bold text-white tracking-tight mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  {step.description}
                </p>
              </div>

              {idx < 4 && (
                <div className="hidden md:flex justify-end pt-4 text-zinc-600">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-zinc-300">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>
              Estimated Project Timeline: <strong className="text-white">{service.estimatedDelivery}</strong>
            </span>
          </div>
          <span className="text-[11px] text-zinc-500">
            * Timelines are practical estimates based on timely asset &amp; feedback turnaround.
          </span>
        </div>
      </section>

      {/* 7. Frequently Asked Questions */}
      <section className="space-y-6">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-indigo-400 font-semibold">
            Common Inquiries
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-white mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
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
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-base font-semibold text-white tracking-tight">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-white" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-sm text-zinc-400 leading-relaxed font-sans border-t border-white/[0.04]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. Functional Quote Contact Form Section */}
      <section id="quote" className="scroll-mt-24">
        <QuoteContactForm initialServiceSlug={service.slug} />
      </section>

      {/* 9. Related Services */}
      {relatedServices.length > 0 && (
        <section className="space-y-6 pt-8 border-t border-white/[0.08]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-indigo-400 font-semibold">
                Explore More Offerings
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
                Related Services
              </h2>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-indigo-300 hover:text-white transition-colors"
            >
              <span>View All 8 Services</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedServices.map((rel) => (
              <Link
                key={rel.slug}
                href={`/services/${rel.slug}`}
                className="group p-6 rounded-2xl bg-[#070b16] border border-white/10 hover:border-indigo-500/40 transition-all flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-3">
                    <span className="text-indigo-400">{rel.category}</span>
                    <span className="text-emerald-400 font-bold">
                      Starting ₹{rel.startingPriceINR.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-200 transition-colors mb-2">
                    {rel.title}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed font-sans mb-4">
                    {rel.tagline}
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-300 group-hover:text-white pt-2 border-t border-white/[0.06]">
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
