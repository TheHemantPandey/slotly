"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import {
  Sparkles,
  Lock,
  CheckCircle2,
  Calendar,
  User,
  Bot,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface SlotOption {
  id: string;
  time: string;
  label: string;
  status: "reserved" | "available" | "booked";
}

const INITIAL_SLOTS: SlotOption[] = [
  { id: "slot-1", time: "10:00 AM IST", label: "Morning Block", status: "booked" },
  { id: "slot-2", time: "11:30 AM IST", label: "Executive Sync", status: "booked" },
  { id: "slot-3", time: "02:30 PM IST", label: "Advisory Slot A", status: "reserved" },
  { id: "slot-4", time: "04:15 PM IST", label: "Advisory Slot B", status: "available" },
  { id: "slot-5", time: "05:45 PM IST", label: "Late Afternoon", status: "available" },
  { id: "slot-6", time: "07:00 PM IST", label: "Evening Wrap", status: "booked" },
];

export function ProductShowcase() {
  const [selectedSlotTime, setSelectedSlotTime] = useState<string>("02:30 PM IST");
  const [isSimulatingLock, setIsSimulatingLock] = useState<boolean>(false);
  const [lockTimestamp, setLockTimestamp] = useState<string>("t=0.8ms");
  const [clockTick, setClockTick] = useState<string>("14:02:19");
  const shouldReduceMotion = useReducedMotion();

  // Ticking timestamp for active live synchronization demonstration
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const mins = String(now.getMinutes()).padStart(2, "0");
      const secs = String(now.getSeconds()).padStart(2, "0");
      setClockTick(`${hours}:${mins}:${secs}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSelectSlot = (time: string) => {
    setIsSimulatingLock(true);
    setSelectedSlotTime(time);
    setTimeout(() => {
      setIsSimulatingLock(false);
      setLockTimestamp("t=0.8ms");
    }, 380);
  };

  return (
    <motion.section
      id="experience"
      initial={shouldReduceMotion ? {} : { opacity: 0, y: 24 }}
      whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="py-20 md:py-28 bg-[#04060e] border-b border-white/[0.08] relative overflow-hidden"
    >
      {/* Background Ambient Cosmic Glows */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/4 -translate-y-1/2 w-[700px] h-[400px] opacity-25 blur-[130px]"
        style={{
          background: "radial-gradient(circle, #4f46e5 0%, #065f46 60%, transparent 100%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-10 right-1/4 w-[600px] h-[350px] opacity-20 blur-[120px]"
        style={{
          background: "radial-gradient(circle, #2563eb 0%, #7c3aed 70%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-950/40 text-xs font-mono text-indigo-300 mb-4 shadow-sm backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>The Slotly Experience</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Conversational Intelligence Meets Atomic Precision.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-400 leading-relaxed font-sans">
            No endless calendars or booking ping-pong. Watch how our AI Concierge matches requirements,
            interrogates real-time PostgreSQL availability, and instantly locks guaranteed conflict-free slots.
          </p>
        </div>

        {/* High-Fidelity 2-Column Product Experience Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* LEFT PANE: AI Concierge Interactive Demo (6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between rounded-2xl border border-white/10 bg-[#070b16]/90 p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-white/[0.08] mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
                    <Bot className="w-5 h-5" strokeWidth={1.75} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">Slotly AI Concierge</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        Live Engine
                      </span>
                    </div>
                    <span className="text-xs text-zinc-400 font-sans">Powered by Google Gemini 3.8 Flash</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="hidden sm:inline">IST Database Connected</span>
                </div>
              </div>

              {/* Chat Conversation Thread */}
              <div className="space-y-5">
                {/* User Message Bubble */}
                <div className="flex items-start gap-3 justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white shadow-lg">
                    <div className="flex items-center gap-2 mb-1 opacity-80 text-[11px] font-mono">
                      <span>Startup Founder / Client</span>
                      <span>•</span>
                      <span>14:02 IST</span>
                    </div>
                    <p className="text-sm leading-relaxed font-sans">
                      &quot;Hi Hemant! We need a fast, responsive Landing Page with a lead form for our product launch next week. Do you have time for a discovery call?&quot;
                    </p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-300 shrink-0 mt-1">
                    <User className="w-4 h-4" strokeWidth={1.75} />
                  </div>
                </div>

                {/* AI Concierge Reply Bubble with Scroll Fade-in & Typing Streaming feel */}
                <motion.div
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: 15 }}
                  whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-start gap-3"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white shrink-0 mt-1 shadow-md shadow-indigo-500/20">
                    <Bot className="w-4 h-4" strokeWidth={1.75} />
                  </div>
                  <div className="max-w-[90%] rounded-2xl rounded-tl-sm border border-white/10 bg-white/[0.04] p-5 text-zinc-200 shadow-xl backdrop-blur-md">
                    <div className="flex items-center gap-2 mb-2 text-[11px] font-mono text-indigo-300">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Verified Database Availability</span>
                      <span>•</span>
                      <span>0.4s response</span>
                    </div>

                    <p className="text-sm text-zinc-200 leading-relaxed font-sans mb-4">
                      I checked Hemant&apos;s live schedule for <strong className="text-white font-medium">Landing Page Development &amp; Discovery</strong>. I found 2 verified slots on <strong className="text-white font-medium">Tuesday, Oct 20th</strong>:
                    </p>

                    {/* Interactive Action Pills with Gentle Shimmer / Glow Pulse */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <motion.button
                        type="button"
                        onClick={() => handleSelectSlot("02:30 PM IST")}
                        whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                        whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                        animate={
                          selectedSlotTime === "02:30 PM IST" && !shouldReduceMotion
                            ? {
                                boxShadow: [
                                  "0 0 0px rgba(16, 185, 129, 0)",
                                  "0 0 16px rgba(16, 185, 129, 0.45)",
                                  "0 0 0px rgba(16, 185, 129, 0)",
                                ],
                              }
                            : {}
                        }
                        transition={{
                          repeat: selectedSlotTime === "02:30 PM IST" ? Infinity : 0,
                          duration: 2.2,
                          ease: "easeInOut",
                        }}
                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-medium transition-all shadow-md cursor-pointer ${
                          selectedSlotTime === "02:30 PM IST"
                            ? "bg-emerald-500 text-zinc-950 font-bold border border-emerald-400 shadow-emerald-500/30"
                            : "bg-white/[0.08] text-zinc-200 hover:bg-white/[0.15] border border-white/15"
                        }`}
                      >
                        {selectedSlotTime === "02:30 PM IST" ? (
                          <CheckCircle2 className="w-4 h-4 text-zinc-950" strokeWidth={2.2} />
                        ) : (
                          <Calendar className="w-4 h-4 text-indigo-300" strokeWidth={1.75} />
                        )}
                        <span>Reserve 02:30 PM IST</span>
                        {selectedSlotTime === "02:30 PM IST" && (
                          <span className="text-[10px] bg-zinc-950/20 px-1.5 py-0.5 rounded font-bold">LOCKED</span>
                        )}
                      </motion.button>

                      <motion.button
                        type="button"
                        onClick={() => handleSelectSlot("04:15 PM IST")}
                        whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                        whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                        animate={
                          selectedSlotTime === "04:15 PM IST" && !shouldReduceMotion
                            ? {
                                boxShadow: [
                                  "0 0 0px rgba(16, 185, 129, 0)",
                                  "0 0 16px rgba(16, 185, 129, 0.45)",
                                  "0 0 0px rgba(16, 185, 129, 0)",
                                ],
                              }
                            : {}
                        }
                        transition={{
                          repeat: selectedSlotTime === "04:15 PM IST" ? Infinity : 0,
                          duration: 2.2,
                          ease: "easeInOut",
                        }}
                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-medium transition-all shadow-md cursor-pointer ${
                          selectedSlotTime === "04:15 PM IST"
                            ? "bg-emerald-500 text-zinc-950 font-bold border border-emerald-400 shadow-emerald-500/30"
                            : "bg-white/[0.08] text-zinc-200 hover:bg-white/[0.15] border border-white/15"
                        }`}
                      >
                        {selectedSlotTime === "04:15 PM IST" ? (
                          <CheckCircle2 className="w-4 h-4 text-zinc-950" strokeWidth={2.2} />
                        ) : (
                          <Calendar className="w-4 h-4 text-indigo-300" strokeWidth={1.75} />
                        )}
                        <span>Reserve 04:15 PM IST</span>
                        {selectedSlotTime === "04:15 PM IST" && (
                          <span className="text-[10px] bg-zinc-950/20 px-1.5 py-0.5 rounded font-bold">LOCKED</span>
                        )}
                      </motion.button>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Click either slot above to simulate instantaneous database locking.</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Bottom CTA to Chat Directly */}
            <div className="mt-8 pt-5 border-t border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <span className="text-xs text-zinc-400 font-sans">
                Experience the full conversational agent in real-time.
              </span>
              <Link
                href="/assistant"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600/50 hover:text-white border border-indigo-500/40 text-xs font-mono transition-all shadow-sm"
              >
                <span>Launch Live AI Concierge</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* RIGHT PANE: Real-Time Availability Calendar (6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between rounded-2xl border border-white/10 bg-[#070b16]/90 p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div>
              {/* Calendar Header with Live Date & Advisor & Live Blinking Cursor */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/[0.08] mb-6">
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <Image
                      src="/images/dev_hemantpandey.jpg"
                      alt="Hemant Pandey"
                      width={38}
                      height={38}
                      className="h-9 w-9 rounded-xl object-cover ring-1 ring-white/20 shadow-md"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-1.5 ring-[#070b16]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">Hemant Pandey</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-300 border border-blue-500/20">
                        Lead Consultant
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5 font-sans flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-blue-400" />
                      <span>Tuesday, Oct 20, 2026</span>
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-mono text-xs shadow-xs self-start sm:self-auto">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{clockTick} IST</span>
                  {/* Blinking live sync cursor */}
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
                    className="text-emerald-400 font-bold"
                  >
                    |
                  </motion.span>
                </div>
              </div>

              {/* Time Slots Grid */}
              <div className="space-y-3">
                <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Advisory Availability Window</span>
                  <span>Duration: 45 Minutes</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {INITIAL_SLOTS.map((slot) => {
                    const isSelected = selectedSlotTime === slot.time;
                    const isBooked = slot.status === "booked";

                    return (
                      <motion.div
                        key={slot.id}
                        onClick={() => {
                          if (!isBooked) handleSelectSlot(slot.time);
                        }}
                        whileHover={
                          !isBooked && !shouldReduceMotion
                            ? { scale: 1.015, y: -2 }
                            : {}
                        }
                        whileTap={!isBooked && !shouldReduceMotion ? { scale: 0.98 } : {}}
                        animate={
                          isSelected && !shouldReduceMotion
                            ? {
                                boxShadow: [
                                  "0 0 0px rgba(16, 185, 129, 0)",
                                  "0 0 18px rgba(16, 185, 129, 0.4)",
                                  "0 0 0px rgba(16, 185, 129, 0)",
                                ],
                              }
                            : {}
                        }
                        transition={{
                          repeat: isSelected ? Infinity : 0,
                          duration: 2.4,
                          ease: "easeInOut",
                        }}
                        className={`rounded-xl p-3.5 border transition-all duration-200 select-none ${
                          isSelected
                            ? "bg-emerald-950/50 border-emerald-400 shadow-lg shadow-emerald-950/60 ring-1 ring-emerald-400/50 cursor-pointer"
                            : isBooked
                            ? "bg-white/[0.015] border-white/[0.05] opacity-50 cursor-not-allowed"
                            : "bg-white/[0.04] border-white/10 hover:border-white/20 hover:bg-white/[0.07] cursor-pointer"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span
                            className={`font-mono text-sm font-semibold ${
                              isSelected
                                ? "text-emerald-300"
                                : isBooked
                                ? "text-zinc-500 line-through"
                                : "text-white"
                            }`}
                          >
                            {slot.time}
                          </span>

                          {isSelected ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-bold shadow-xs">
                              <Lock className="w-2.5 h-2.5" />
                              <span>Reserved</span>
                            </span>
                          ) : isBooked ? (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500 border border-zinc-700">
                              Booked
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30">
                              Available
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-[11px] font-sans text-zinc-400">
                          <span>{slot.label}</span>
                          {isSelected && (
                            <span className="text-emerald-400 font-mono text-[10px] flex items-center gap-1">
                              <Zap className="w-2.5 h-2.5" />
                              <span>Zero-Overlap Lock</span>
                            </span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Concurrency Verification Bar */}
              <div className="mt-6 rounded-xl border border-white/[0.08] bg-[#04060e] p-4 font-mono text-xs shadow-inner space-y-2">
                <div className="flex items-center justify-between text-zinc-300 font-semibold border-b border-white/[0.06] pb-2">
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>PostgreSQL Advisory Lock Active</span>
                  </span>
                  <span className="text-[11px] text-emerald-400 font-mono">
                    {isSimulatingLock ? "Serializing..." : `ACID Verified (${lockTimestamp})`}
                  </span>
                </div>

                <div className="text-[11px] text-zinc-400 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Lock Target:</span>
                    <span className="text-zinc-300">slotly_booking_landing-page-development</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Selected Slot:</span>
                    <span className="text-emerald-300 font-semibold">{selectedSlotTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Conflict Guarantee:</span>
                    <span className="text-white">100% Deterministic (Zero Overlap)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Direct Booking CTA */}
            <div className="mt-8 pt-5 border-t border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <span className="text-xs text-zinc-400 font-sans">
                Ready to discuss your website or web app project?
              </span>
              <motion.div
                whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                className="w-full sm:w-auto"
              >
                <Link
                  href="/book?service=landing-page-development"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-100 text-xs font-mono font-semibold transition-all shadow-md group"
                >
                  <span>Book Project Discovery Call</span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-950 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
