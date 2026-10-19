import React, { Suspense } from "react";
import type { Metadata } from "next";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { AIAssistantChat } from "@/components/assistant/AIAssistantChat";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Scheduling Concierge | Slotly",
  description:
    "Consult our real-time AI Concierge powered by Google Gemini 3.8 Flash to select advisory tracks, check availability, and lock verified consultations.",
};

export default function AssistantPage() {
  return (
    <div className="min-h-full flex flex-col bg-[#04060e] text-zinc-100 relative selection:bg-indigo-600 selection:text-white">
      {/* Background Ambient Radial Glow */}
      <div
        className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 w-[950px] h-[450px] opacity-25 blur-[140px]"
        style={{
          background: "radial-gradient(circle, #4f46e5 0%, #7c3aed 50%, #064e3b 90%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* Subtle Dot Grid */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40"
        aria-hidden="true"
      />

      <Header />

      <main className="flex-1 relative z-10 py-10 md:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Header Title */}
          <div className="max-w-2xl mb-8 text-center sm:text-left mx-auto sm:mx-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-400/30 bg-indigo-950/40 text-xs font-mono text-indigo-300 mb-3 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Google Gemini 3.8 Flash • Real-Time Database Bridge</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              Slotly AI Concierge
            </h1>
            <p className="mt-2 text-sm sm:text-base text-zinc-400 leading-relaxed font-sans">
              Conversational intelligence that holds direct database tools. Query live availability, evaluate architecture requirements, and sign tamper-proof appointment proposals.
            </p>
          </div>

          <Suspense
            fallback={
              <div className="max-w-4xl mx-auto p-16 text-center text-zinc-400 font-mono text-xs space-y-3">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-indigo-400 border-r-transparent" />
                <div>Connecting to Gemini AI Engine...</div>
              </div>
            }
          >
            <AIAssistantChat />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
