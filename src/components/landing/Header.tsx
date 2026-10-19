"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { SlotlyLogo } from "@/components/brand/SlotlyLogo";
import { NAVIGATION_LINKS } from "@/lib/constants";
import { X, Menu, Calendar, ArrowUpRight } from "lucide-react";

function DesktopNavLinks() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-7 lg:gap-8">
      {NAVIGATION_LINKS.map((link) => {
        const isActive =
          link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`text-xs uppercase font-mono tracking-wider transition-all duration-200 py-1 relative ${
              isActive
                ? "text-white font-medium"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <span>{link.label}</span>
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 rounded-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

function StaticDesktopNav() {
  return (
    <nav className="hidden md:flex items-center gap-7 lg:gap-8">
      {NAVIGATION_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-xs uppercase font-mono tracking-wider text-zinc-400 hover:text-zinc-200 py-1"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

function MobileNavLinks({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col space-y-1.5">
      {NAVIGATION_LINKS.map((link) => {
        const isActive =
          link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={`flex items-center justify-between text-sm tracking-wide px-3.5 py-2.5 rounded-lg transition-all ${
              isActive
                ? "bg-white/[0.08] text-white font-medium border-l-2 border-emerald-400 shadow-sm"
                : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <span>{link.label}</span>
            {isActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-xs shadow-emerald-400" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close on Escape key press and freeze body scroll when drawer is open
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  return (
    <header
      suppressHydrationWarning
      className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#04060e]/80 backdrop-blur-xl transition-all"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Brand with Enterprise Micro-Badge */}
        <div className="flex items-center gap-3.5">
          <Link
            href="/"
            className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-400 rounded transition-transform hover:scale-[1.02]"
          >
            <SlotlyLogo size="sm" />
          </Link>

          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-blue-500/20 bg-blue-950/40 text-[11px] font-mono text-blue-300 tracking-tight shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-xs shadow-emerald-400" />
            v2.1 Core Engine
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <Suspense fallback={<StaticDesktopNav />}>
          <DesktopNavLinks />
        </Suspense>

        {/* Right CTA Actions with Vibrant Glow */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/book"
            className="relative inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 text-white text-xs font-mono font-medium tracking-wider uppercase hover:from-blue-500 hover:to-emerald-500 transition-all shadow-md shadow-emerald-500/20 border border-emerald-400/30 group"
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-200" />
            <span>Book Session</span>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/book"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-emerald-600 text-white text-xs font-mono font-medium shadow-sm shadow-emerald-500/20"
          >
            <Calendar className="w-3 h-3 text-emerald-200" />
            <span>Book</span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={mobileMenuOpen}
            className="p-2 rounded-lg border border-white/10 bg-white/[0.04] text-zinc-300 hover:text-white hover:bg-white/[0.08] focus:outline-none focus:ring-1 focus:ring-blue-400"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Slide-Over Drawer with AnimatePresence & Hydration Protection */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md md:hidden"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Slide-Over Drawer */}
            <motion.aside
              suppressHydrationWarning
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation Menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 sm:w-80 max-w-[82vw] bg-[#070b16] border-l border-white/10 shadow-2xl flex flex-col md:hidden"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-5 h-16 border-b border-white/[0.08] bg-[#070b16]">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-400 rounded"
                >
                  <SlotlyLogo size="sm" />
                </Link>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close navigation menu"
                  className="p-2 rounded-lg border border-white/10 bg-white/[0.04] text-zinc-400 hover:text-white hover:border-white/20 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-400 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Body Links */}
              <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
                <Suspense fallback={null}>
                  <MobileNavLinks onNavigate={() => setMobileMenuOpen(false)} />
                </Suspense>

                {/* Quick Actions */}
                <div className="pt-6 border-t border-white/[0.08] flex flex-col gap-2.5">
                  <Link
                    href="/book"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full"
                  >
                    <div className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 text-white text-xs font-mono font-medium uppercase tracking-wider shadow-md shadow-emerald-500/20 hover:opacity-95 transition-opacity">
                      <Calendar className="w-3.5 h-3.5 text-emerald-200" />
                      <span>Book Consultation</span>
                    </div>
                  </Link>

                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full"
                  >
                    <div className="w-full flex items-center justify-center gap-1.5 py-2 px-4 text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors">
                      <span>Admin Console</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </Link>
                </div>
              </div>

              {/* Drawer Footer Branding */}
              <div className="px-6 py-4 border-t border-white/[0.08] bg-[#04060e]">
                <p className="text-[11px] text-zinc-500 tracking-wider uppercase font-mono text-center">
                  Slotly Atelier · Asia/Kolkata (IST)
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
