"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { FREELANCE_SERVICES, resolveServiceSlug } from "@/lib/services-catalog";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Lock,
  ArrowRight,
  Clock,
} from "lucide-react";

interface QuoteContactFormProps {
  initialServiceSlug?: string;
  className?: string;
}

const BUDGET_OPTIONS = [
  "Under ₹5,000",
  "₹5,000 – ₹10,000",
  "₹10,000 – ₹25,000",
  "₹25,000 – ₹50,000",
  "₹50,000+",
  "Flexible / Need Guidance",
];

export function QuoteContactForm({
  initialServiceSlug,
  className = "",
}: QuoteContactFormProps) {
  const shouldReduceMotion = useReducedMotion();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState(() => {
    return initialServiceSlug ? resolveServiceSlug(initialServiceSlug) : "business-websites-landing-pages";
  });
  const [budget, setBudget] = useState("₹5,000 – ₹10,000");
  const [requirements, setRequirements] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    referenceId: string;
    serviceTitle: string;
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError("Please enter your name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setFormError("Please enter a valid email address.");
      return;
    }
    if (!requirements.trim() || requirements.trim().length < 5) {
      setFormError("Please briefly describe what you need (at least 5 characters).");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          serviceId: selectedServiceId,
          budget,
          requirements: requirements.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit quote inquiry.");
      }

      setSubmissionSuccess({
        referenceId: data.referenceId,
        serviceTitle: data.serviceTitle,
        message: data.message,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Network error. Please try again.";
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submissionSuccess) {
    return (
      <motion.div
        initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`rounded-3xl border border-emerald-500/40 bg-gradient-to-b from-emerald-950/30 via-[#070b16] to-[#04060e] p-8 sm:p-10 text-left shadow-2xl relative overflow-hidden ${className}`}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />

        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-zinc-950 shrink-0 shadow-lg shadow-emerald-500/25">
            <CheckCircle2 className="w-6 h-6" strokeWidth={2.5} />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold block">
              Inquiry Confirmed
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Quote Request Received!
            </h3>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#090e1d] border border-white/10 font-mono text-xs space-y-3 mb-6">
          <div className="flex justify-between items-center border-b border-white/[0.06] pb-2.5">
            <span className="text-zinc-400">Tracking Reference:</span>
            <span className="text-emerald-300 font-bold px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30">
              {submissionSuccess.referenceId}
            </span>
          </div>
          <div className="flex justify-between items-center border-b border-white/[0.06] pb-2.5">
            <span className="text-zinc-400">Service Requested:</span>
            <span className="text-white font-semibold">
              {submissionSuccess.serviceTitle}
            </span>
          </div>
          <div className="flex justify-between items-center border-b border-white/[0.06] pb-2.5">
            <span className="text-zinc-400">Target Budget:</span>
            <span className="text-zinc-200">{budget}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-400">Response SLA:</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Within 24 Hours
            </span>
          </div>
        </div>

        <p className="text-sm text-zinc-300 leading-relaxed font-sans mb-6">
          Thank you for reaching out, <strong className="text-white">{name}</strong>. I will review your requirements and reply directly to <strong className="text-white">{email}</strong> with an initial scope estimate and milestone plan.
        </p>

        <button
          type="button"
          onClick={() => {
            setSubmissionSuccess(null);
            setRequirements("");
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/15 bg-white/[0.05] text-zinc-300 text-xs font-mono hover:bg-white/[0.1] hover:text-white transition-all cursor-pointer"
        >
          <span>Submit Another Inquiry</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-3xl border border-white/10 bg-[#070b16]/95 p-6 sm:p-10 backdrop-blur-2xl shadow-2xl relative overflow-hidden ${className}`}
    >
      {/* Top Accent Line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent" />

      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-400/30 bg-indigo-950/60 text-xs font-mono text-indigo-300 mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Direct Freelance Quote</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Get a Project Quote
        </h3>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1 font-sans">
          Tell me about your project to receive an honest timeline estimate and fixed-fee proposal. No sales pressure.
        </p>
      </div>

      {formError && (
        <div className="mb-6 p-4 rounded-xl bg-rose-950/50 border border-rose-800 text-xs font-mono text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <div className="space-y-5">
        {/* Name & Email Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Your Name <span className="text-indigo-400">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ramesh Sharma"
              className="w-full px-4 py-3 rounded-xl bg-[#04060e] border border-white/10 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Email Address <span className="text-indigo-400">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. ramesh@example.com"
              className="w-full px-4 py-3 rounded-xl bg-[#04060e] border border-white/10 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
            />
          </div>
        </div>

        {/* Service Selected & Budget Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Service Selected <span className="text-indigo-400">*</span>
            </label>
            <select
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#04060e] border border-white/10 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-sans cursor-pointer"
            >
              {FREELANCE_SERVICES.map((s) => (
                <option key={s.slug} value={s.slug} className="bg-[#090e1d] text-white">
                  {s.title} (Introductory: ₹{s.startingPriceINR.toLocaleString("en-IN")}{s.priceUnit || ""})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Estimated Budget <span className="text-zinc-500">(Optional)</span>
            </label>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#04060e] border border-white/10 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-sans cursor-pointer"
            >
              {BUDGET_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="bg-[#090e1d] text-white">
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Requirements Textarea */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
            Project Requirements &amp; Goals <span className="text-indigo-400">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder="Tell me about your business, the pages you need, any reference websites you like, or specific features required..."
            className="w-full p-4 rounded-xl bg-[#04060e] border border-white/10 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none font-sans"
          />
          <p className="text-[11px] text-zinc-500 mt-1.5 font-sans">
            Final pricing is always quoted upfront based on your exact scope with zero hidden costs.
          </p>
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Strict Privacy • Direct Developer Contact</span>
          </div>

          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white text-xs font-mono font-semibold tracking-wide transition-all shadow-xl shadow-indigo-600/20 border border-indigo-400/30 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <span>Submitting Inquiry...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Submit Quote Request</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </form>
  );
}
