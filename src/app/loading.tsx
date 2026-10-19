import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#04060e] text-zinc-100 relative selection:bg-indigo-600 selection:text-white">
      {/* Background Ambient Radial Glow */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] opacity-20 blur-[140px]"
        style={{
          background:
            "radial-gradient(circle, #2563eb 0%, #7c3aed 50%, #059669 90%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col items-center gap-4 text-center">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20" />
          <div className="absolute inset-0 rounded-full border-2 border-t-indigo-400 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        </div>

        <div className="space-y-1">
          <div className="text-xs font-mono uppercase tracking-widest text-zinc-400">
            Slotly Engine
          </div>
          <div className="text-sm font-sans text-zinc-500">
            Synchronizing deterministic chamber...
          </div>
        </div>
      </div>
    </div>
  );
}
