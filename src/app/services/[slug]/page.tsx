import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getServiceBySlug,
  getAllServiceSlugs,
  getRelatedServices,
} from "@/lib/services-catalog";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { ServiceDetailView } from "@/components/services/ServiceDetailView";

interface ServicePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return {
      title: "Service Not Found | Slotly",
      description: "The requested freelance service could not be located.",
    };
  }

  const title = `${service.title} — Starting at ₹${service.startingPriceINR.toLocaleString("en-IN")} | Slotly`;
  const description = `${service.tagline} Direct freelance web development by Hemant Pandey. Transparent deliverables, fixed starting price, and fast turnaround.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://slotly.hemantpandey.in/services/${service.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ServiceDedicatedPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const related = getRelatedServices(service.slug);

  // Structured Data for Rich Snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    provider: {
      "@type": "Person",
      name: "Hemant Pandey",
      jobTitle: "Principal Software Architect",
      url: "https://hemantpandey.in",
    },
    offers: {
      "@type": "Offer",
      price: service.startingPriceINR,
      priceCurrency: "INR",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: service.startingPriceINR,
        priceCurrency: "INR",
        unitText: "project starting price",
      },
      availability: "https://schema.org/InStock",
    },
    serviceType: service.category,
  };

  return (
    <div className="min-h-full flex flex-col bg-[#04060e] text-zinc-100 relative selection:bg-indigo-600 selection:text-white">
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Background Ambient Radial Atmosphere */}
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

      <main className="flex-1 relative z-10 py-10 sm:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <ServiceDetailView service={service} relatedServices={related} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
