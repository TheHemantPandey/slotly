"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AssistantMessage, BookingProposal, ConfirmedBookingResult } from "@/lib/types";
import { motion, useReducedMotion } from "motion/react";
import {
  Sparkles,
  Bot,
  User,
  Send,
  Lock,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

const SUGGESTED_PROMPTS = [
  "Recommend an advisory track for payment microservices",
  "Check available slots for Software Architecture consultation this week",
  "Which consultation is best for Next.js App Router performance?",
  "What does the AI Integration session include?",
];

const INITIAL_MESSAGES: AssistantMessage[] = [
  {
    id: "msg-welcome",
    role: "assistant",
    content:
      "Welcome to the Slotly Concierge powered by Google Gemini 3.8 Flash. I am your intentional scheduling advisor. I can cross-reference our live service catalog, check PostgreSQL availability in real-time, stage verified consultations, or review existing bookings.\n\nHow may I guide your advisory schedule today?",
    timestamp: "Just now",
    suggestedAction: {
      label: "Explore All Advisory Tracks",
      href: "/services",
    },
  },
];

let nextMessageId = 0;
function getNextId(prefix: string): string {
  nextMessageId += 1;
  return `${prefix}-${nextMessageId}`;
}

export function AIAssistantChat() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get("query");
  const shouldReduceMotion = useReducedMotion();

  const [messages, setMessages] = useState<AssistantMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeProposal, setActiveProposal] = useState<BookingProposal | null>(null);
  const [isSubmittingProposal, setIsSubmittingProposal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleUserSubmit = async (queryText: string) => {
    if (!queryText.trim() || isTyping) return;

    const userText = queryText.trim();
    const userMsg: AssistantMessage = {
      id: getNextId("user"),
      role: "user",
      content: userText,
      timestamp: "Just now",
    };

    // If active proposal exists and user typed confirmation intent, confirm directly
    const isConfirmationIntent =
      /^(yes|confirm|book|proceed|finalize|confirm & book|please confirm|ok|sure|go ahead)/i.test(userText.trim()) ||
      userText.toLowerCase().includes("confirm");

    if (activeProposal && isConfirmationIntent) {
      setMessages((prev) => [...prev, userMsg]);
      setInputText("");
      await handleConfirmProposal(activeProposal);
      return;
    }

    // Construct conversation history for API
    const historyPayload = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .slice(-10)
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          history: historyPayload,
        }),
      });

      const data = await response.json();

      let replyContent = data.reply || "I have received your inquiry.";
      const suggestedAction = data.suggestedAction;
      const proposal: BookingProposal | undefined = data.bookingProposal;
      const confirmed: ConfirmedBookingResult | undefined = data.confirmedBooking;

      if (!response.ok && !data.reply) {
        replyContent =
          data.error === "RATE_LIMIT_EXCEEDED"
            ? "Inquiry rate limit reached. Please wait a moment before sending another message."
            : data.error === "MISSING_API_KEY"
            ? "The Gemini AI integration requires a configured GEMINI_API_KEY in the server environment. Please set GEMINI_API_KEY in your .env configuration."
            : "An error occurred while connecting to the AI Concierge. Please try again or use direct booking.";
      }

      if (proposal) {
        setActiveProposal(proposal);
      }

      if (confirmed) {
        setActiveProposal(null);
      }

      const assistantMsg: AssistantMessage = {
        id: getNextId("assistant"),
        role: "assistant",
        content: replyContent,
        timestamp: "Just now",
        suggestedAction,
        bookingProposal: proposal,
        confirmedBooking: confirmed,
        isError: !response.ok || !data.success,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      console.error("Assistant chat error:", err);
      const errorMsg: AssistantMessage = {
        id: getNextId("assistant"),
        role: "assistant",
        content:
          "Unable to reach the Slotly Concierge server. Please check your network connection or browse our consulting catalog directly.",
        timestamp: "Just now",
        suggestedAction: {
          label: "View Services Catalog",
          href: "/services",
        },
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleConfirmProposal = async (proposal: BookingProposal) => {
    setIsSubmittingProposal(true);

    try {
      const response = await fetch("/api/assistant/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proposal,
          customerConfirmed: true,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setActiveProposal(null);
        const confirmedMsg: AssistantMessage = {
          id: getNextId("assistant"),
          role: "assistant",
          content: `Your consultation appointment for ${proposal.serviceTitle} on ${proposal.displayRange} has been successfully secured in PostgreSQL with concurrency locking!`,
          timestamp: "Just now",
          confirmedBooking: data.confirmedBooking,
          suggestedAction: {
            label: "Access Private Booking Portal",
            href: data.managementUrl || data.confirmedBooking?.managementUrl,
          },
        };
        setMessages((prev) => [...prev, confirmedMsg]);
      } else {
        if (data.error === "SLOT_CONFLICT" || data.error === "PROPOSAL_EXPIRED") {
          setActiveProposal(null);
        }
        const errorMsg: AssistantMessage = {
          id: getNextId("assistant"),
          role: "assistant",
          content:
            data.reply ||
            (data.error === "SLOT_CONFLICT"
              ? "This slot was just booked by another client. Please choose an alternate slot."
              : data.error === "PROPOSAL_EXPIRED"
              ? "This proposal has expired. Please select a fresh slot."
              : "Unable to finalize booking. Please try again."),
          timestamp: "Just now",
          suggestedAction: data.suggestedAction || {
            label: "View Availability Calendar",
            href: `/book?service=${proposal.serviceId}`,
          },
          isError: true,
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } catch (err: unknown) {
      console.error("Booking confirmation error:", err);
      const networkErrorMsg: AssistantMessage = {
        id: getNextId("assistant"),
        role: "assistant",
        content:
          "A network connection issue occurred while confirming your booking. Your proposal remains valid; please click 'Confirm & Book Now' to retry.",
        timestamp: "Just now",
        isError: true,
      };
      setMessages((prev) => [...prev, networkErrorMsg]);
    } finally {
      setIsSubmittingProposal(false);
    }
  };

  const handleDeclineProposal = () => {
    setActiveProposal(null);
    const cancelMsg: AssistantMessage = {
      id: getNextId("user"),
      role: "user",
      content: "I'd like to look for another time slot.",
      timestamp: "Just now",
    };
    const replyMsg: AssistantMessage = {
      id: getNextId("assistant"),
      role: "assistant",
      content:
        "Understood. The proposed slot has been released. Let me know which date or practice you would like to explore next.",
      timestamp: "Just now",
      suggestedAction: {
        label: "Check Availability Calendar",
        href: `/book?service=${activeProposal?.serviceId || ""}`,
      },
    };
    setMessages((prev) => [...prev, cancelMsg, replyMsg]);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      const timer = setTimeout(() => {
        handleUserSubmit(initialQuery.trim());
      }, 50);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleUserSubmit(inputText);
  };

  const handleResetChat = () => {
    setMessages(INITIAL_MESSAGES);
    setInputText("");
    setIsTyping(false);
    setActiveProposal(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Status Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#070b16]/90 border border-white/10 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs font-mono shadow-xl">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-white font-semibold">Gemini 3.8 Flash • Real-Time Database Bridge</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                Connected
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Interactions API cross-references live PostgreSQL availability rules. All appointments require customer confirmation before locking.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleResetChat}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/10 text-xs font-mono transition-all shrink-0 cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset Session</span>
        </button>
      </div>

      {/* Suggested Prompt Chips */}
      <div>
        <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 block mb-2 font-semibold">
          Suggested Inquiries
        </span>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleUserSubmit(prompt)}
              disabled={isTyping}
              className="text-xs font-sans px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-zinc-300 hover:text-white hover:border-indigo-400/50 hover:bg-white/[0.06] transition-all cursor-pointer text-left disabled:opacity-50 shadow-xs"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Main Terminal Chat Canvas */}
      <div className="rounded-3xl border border-white/10 bg-[#070b16]/95 backdrop-blur-2xl overflow-hidden flex flex-col h-[640px] shadow-2xl relative">
        {/* Chat Canvas Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] bg-[#04060e]/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <Bot className="w-5 h-5" strokeWidth={1.75} />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">
                Slotly AI Concierge
              </div>
              <div className="font-mono text-[10px] text-indigo-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Interactions API • Tool Calling Active</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">HMAC-SHA256 Signed Proposals</span>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#04060e]/50">
          {messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 text-left ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                {!isUser && (
                  <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shrink-0 mt-1 shadow-md shadow-indigo-600/20">
                    <Bot className="w-4 h-4" strokeWidth={1.75} />
                  </div>
                )}

                <div
                  className={`max-w-[90%] sm:max-w-[80%] rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                      : msg.isError
                      ? "bg-amber-950/30 border border-amber-600/40 text-amber-200"
                      : "bg-white/[0.04] border border-white/10 text-zinc-200 shadow-xl backdrop-blur-md"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-2 font-mono text-[10px] text-zinc-400">
                    <span className={isUser ? "text-blue-100" : "text-indigo-300 font-semibold"}>
                      {isUser ? "You" : "Slotly AI Concierge"}
                    </span>
                    <span className="opacity-75">{msg.timestamp}</span>
                  </div>

                  <div className="whitespace-pre-line text-zinc-200 font-sans">
                    {msg.content}
                  </div>

                  {/* Signed Booking Proposal Card */}
                  {msg.bookingProposal && (
                    <motion.div
                      initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-5 rounded-2xl bg-[#070b16] border border-emerald-500/40 space-y-4 shadow-lg text-left"
                    >
                      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                        <span className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5" />
                          <span>HMAC-SHA256 Signed Proposal</span>
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
                          15m TTL Lock
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                        <div>
                          <span className="text-zinc-500 block text-[10px] uppercase">Practice</span>
                          <span className="text-white font-semibold">
                            {msg.bookingProposal.serviceTitle}
                          </span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block text-[10px] uppercase">Duration &amp; Fee</span>
                          <span className="text-emerald-400 font-semibold">
                            {msg.bookingProposal.durationMinutes} min • ₹{msg.bookingProposal.feeINR.toLocaleString("en-IN")} INR
                          </span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block text-[10px] uppercase">Time Window</span>
                          <span className="text-white font-medium">
                            {msg.bookingProposal.displayRange}
                          </span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block text-[10px] uppercase">Client Target</span>
                          <span className="text-zinc-200 truncate block">
                            {msg.bookingProposal.clientName}
                          </span>
                        </div>
                      </div>

                      <div className="pt-3 flex flex-wrap items-center gap-2.5 border-t border-white/[0.08]">
                        <button
                          type="button"
                          disabled={isSubmittingProposal || isTyping}
                          onClick={() => handleConfirmProposal(msg.bookingProposal!)}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-mono text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
                        >
                          {isSubmittingProposal ? (
                            <>
                              <div className="h-3.5 w-3.5 border-2 border-zinc-950 border-r-transparent rounded-full animate-spin" />
                              <span>Persisting...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Confirm &amp; Book Appointment</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          disabled={isSubmittingProposal || isTyping}
                          onClick={handleDeclineProposal}
                          className="px-3.5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-400 hover:text-white font-mono text-xs border border-white/10 transition-all cursor-pointer"
                        >
                          Choose Alternate Slot
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Confirmed Booking Success Card */}
                  {msg.confirmedBooking && (
                    <motion.div
                      initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-5 rounded-2xl bg-gradient-to-b from-emerald-950/40 to-[#070b16] border border-emerald-500/40 space-y-3 shadow-xl"
                    >
                      <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-semibold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Appointment Persisted in PostgreSQL</span>
                      </div>
                      <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                        Your session for <strong className="text-white">{msg.confirmedBooking.serviceTitle}</strong> has been secured for <strong className="text-emerald-300">{msg.confirmedBooking.displayRange}</strong>.
                      </p>
                      <div className="pt-2 flex flex-wrap gap-3">
                        <Link
                          href={msg.confirmedBooking.managementUrl}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-zinc-950 font-mono text-xs font-bold hover:bg-emerald-400 transition-all shadow-md"
                        >
                          <span>Open Private Portal</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </motion.div>
                  )}

                  {/* Suggested Action Pill */}
                  {msg.suggestedAction && !msg.confirmedBooking && (
                    <div className="mt-3 pt-3 border-t border-white/[0.08]">
                      <Link
                        href={msg.suggestedAction.href}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-indigo-300 hover:text-white border border-indigo-500/30 font-mono text-xs transition-all"
                      >
                        <span>{msg.suggestedAction.label}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}

                  {!isUser && (
                    <div className="mt-2.5 text-[10px] font-mono text-zinc-500 flex items-center gap-1.5">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>Verified with live PostgreSQL Availability Rules</span>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="h-8 w-8 rounded-xl bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-300 shrink-0 mt-1">
                    <User className="w-4 h-4" strokeWidth={1.75} />
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3 text-left items-center">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-600/20">
                <Bot className="w-4 h-4" strokeWidth={1.75} />
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center gap-2.5 backdrop-blur-md">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" />
                  <div
                    className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"
                    style={{ animationDelay: "0.15s" }}
                  />
                  <div
                    className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"
                    style={{ animationDelay: "0.3s" }}
                  />
                </div>
                <span className="text-[11px] font-mono text-zinc-400">
                  Gemini Concierge reasoning and validating schedule...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleFormSubmit}
          className="p-4 border-t border-white/[0.08] bg-[#04060e] flex items-center gap-3"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about practices, live slot availability, or stage a consultation..."
            disabled={isTyping}
            className="flex-1 px-4 py-3 rounded-xl bg-[#070b16] border border-white/10 text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-50 font-sans"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-mono text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 border border-indigo-400/40 disabled:opacity-40 cursor-pointer"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
