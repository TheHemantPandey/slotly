import React, { Suspense } from "react";
import type { Metadata } from "next";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { CustomerBookingView } from "@/components/booking/CustomerBookingView";

export const metadata: Metadata = {
  title: "Private Advisory Reservation | Slotly",
  description: "Secure, private booking access and management portal for your Slotly advisory session.",
  referrer: "no-referrer",
};

interface MyBookingPageProps {
  params: Promise<{ token: string }>;
}

async function BookingContent({ params }: MyBookingPageProps) {
  const { token } = await params;
  return <CustomerBookingView token={token} />;
}

export default function MyBookingPage(props: MyBookingPageProps) {
  return (
    <div className="min-h-full flex flex-col bg-[#04060e] text-zinc-100 relative selection:bg-indigo-600 selection:text-white">
      {/* Background Ambient Radial Glow */}
      <div
        className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 w-[900px] h-[450px] opacity-25 blur-[140px]"
        style={{
          background: "radial-gradient(circle, #2563eb 0%, #7c3aed 50%, #059669 90%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* Subtle Dot Grid */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40"
        aria-hidden="true"
      />

      <Header />

      <main className="flex-1 relative z-10 py-12 md:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Suspense
            fallback={
              <div className="py-24 text-center font-mono text-xs text-zinc-400 space-y-3">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-emerald-400 border-r-transparent" />
                <div>Verifying SHA-256 customer credentials...</div>
              </div>
            }
          >
            <BookingContent {...props} />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
