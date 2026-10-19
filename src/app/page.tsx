import React from "react";
import { Header } from "@/components/landing/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProductShowcase } from "@/components/landing/ProductShowcase";
import { PracticeShowcase } from "@/components/landing/PracticeShowcase";
import { FeaturePillars } from "@/components/landing/FeaturePillars";
import { IntegrityBar } from "@/components/landing/IntegrityBar";
import { BottomConversion } from "@/components/landing/BottomConversion";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <div className="min-h-full flex flex-col bg-[#04060e] text-zinc-100 relative selection:bg-indigo-600 selection:text-white">
      <Header />
      <main className="flex-1 relative z-10">
        <HeroSection />
        <ProductShowcase />
        <PracticeShowcase />
        <FeaturePillars />
        <IntegrityBar />
        <BottomConversion />
      </main>
      <Footer />
    </div>
  );
}
