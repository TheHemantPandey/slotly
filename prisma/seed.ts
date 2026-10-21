/**
 * Slotly Database Seed Script - 8 Core Practical Freelance Web Services
 * Idempotent: Can be run repeatedly without duplicating or corrupting records.
 */

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;
const prisma =
  connectionString && connectionString.includes("neon.tech")
    ? new PrismaClient({ adapter: new PrismaNeon({ connectionString }) })
    : new PrismaClient();

const SERVICES_SEED = [
  {
    id: "business-websites-landing-pages",
    slug: "business-websites-landing-pages",
    name: "Business Websites & Landing Pages",
    tagline: "High-performance business websites, portfolios, and landing pages designed for credible presentation and lead capture.",
    description:
      "Professional website engineering for small businesses, founders, consultants, and local brands. Fast, mobile-first websites with clear conversion pathways, validated inquiry forms, and technical SEO hygiene.",
    durationMinutes: 20,
    priceInPaise: 960000, // Introductory: ₹9,600.00 (Standard: ₹12,000.00)
    currency: "INR",
    category: "Websites",
    deliverables: [
      "Responsive bespoke design (Home, About, Services, Social Proof, and Contact sections)",
      "Validated lead capture contact form with direct email alerts & spam filtering",
      "Core Web Vitals 90+ score with semantic HTML5, Open Graph meta tags, and XML sitemap",
      "Mobile-first fluid layouts tested across iOS, Android, and desktop viewports",
      "Production deployment to Vercel or Cloudflare with custom domain DNS setup",
      "Clean source code handover with 14 days of post-launch technical support",
    ],
    idealFor: "Consultants, small businesses, startups, creators, and local service providers",
    isActive: true,
  },
  {
    id: "custom-web-apps-dashboards",
    slug: "custom-web-apps-dashboards",
    name: "Custom Web Applications & Dashboards",
    tagline: "Tailored dashboards, client portals, internal operational tools, and database-backed SaaS MVPs.",
    description:
      "End-to-end full-stack web application development engineered for specific operational workflows. Authenticated dashboards, customer portals, data pipelines, and transactional web apps with Next.js 16, React 19, TypeScript, and PostgreSQL.",
    durationMinutes: 20,
    priceInPaise: 2800000, // Introductory: ₹28,000.00 (Standard: ₹35,000.00)
    currency: "INR",
    category: "Web Applications",
    deliverables: [
      "Relational database architecture designed on PostgreSQL / Neon with Prisma ORM",
      "Secure user authentication (session management, password hashing, and role checks)",
      "Server-side rendered (SSR) reactive UI with Next.js 16 App Router & Tailwind CSS",
      "Interactive data tables with live filtering, multi-field search, and CSV export",
      "RESTful API endpoints / Server Actions with strict input validation via Zod",
      "Production deployment to Vercel/Neon with CI/CD pipeline and 30 days warranty support",
    ],
    idealFor: "Startups, growing teams, agencies, and businesses replacing spreadsheet chaos",
    isActive: true,
  },
  {
    id: "booking-management-systems",
    slug: "booking-management-systems",
    name: "Booking & Management Systems",
    tagline: "Automated reservation and appointment management systems with live availability and confirmation workflows.",
    description:
      "Purpose-built appointment and booking systems for service professionals, clinics, consultants, salons, and studios. Eliminate back-and-forth scheduling with real-time calendar availability, intake forms, automated confirmations, and booking management.",
    durationMinutes: 20,
    priceInPaise: 2000000, // Introductory: ₹20,000.00 (Standard: ₹25,000.00)
    currency: "INR",
    category: "Web Applications",
    deliverables: [
      "Interactive appointment booking wizard with timezone-aware time slot calculation",
      "Atomic database locking (concurrency-safe: zero double-bookings or overlapping slots)",
      "Client intake brief capture collecting contact details and agenda notes",
      "Instant confirmation screen with one-click Google Calendar sync and .ics download",
      "Admin appointments management dashboard to review, filter, and track upcoming bookings",
      "Cryptographically signed private client management / cancellation links",
    ],
    idealFor: "Consultants, clinics, salons, coaches, tutors, and appointment-based businesses",
    isActive: true,
  },
  {
    id: "ai-chatbots-automation",
    slug: "ai-chatbots-automation",
    name: "AI Chatbots & Business Automation",
    tagline: "Intelligent website chatbots, lead qualification assistants, and custom LLM workflow automation.",
    description:
      "Deploy custom AI assistants grounded in your business documentation, service catalog, and customer FAQs. Conversational concierge widgets and automated data pipelines powered by Google Gemini, OpenAI, and LangChain to capture leads and handle inquiries 24/7.",
    durationMinutes: 20,
    priceInPaise: 1440000, // Introductory: ₹14,400.00 (Standard: ₹18,000.00)
    currency: "INR",
    category: "AI & Automation",
    deliverables: [
      "Custom conversational AI widget embedded on your website with streaming UI and dark theme",
      "Grounded knowledge base compiled from your verified services, FAQs, and business rules",
      "Strict system guardrails and prompt engineering to prevent hallucinations and off-topic queries",
      "Automated lead capture extracting visitor contact info and project requirements in conversational flow",
      "Function calling tool bridge (e.g. check live availability or prepare discovery bookings)",
      "Admin conversation inspection screen to audit logs and refine assistant instructions",
    ],
    idealFor: "Businesses wanting 24/7 lead qualification, automated FAQ answering, and smart workflows",
    isActive: true,
  },
  {
    id: "ecommerce-payment-integration",
    slug: "ecommerce-payment-integration",
    name: "E-commerce & Payment Integration",
    tagline: "Direct-to-consumer online stores, product catalogs, and frictionless Indian & international checkout.",
    description:
      "Fast, custom e-commerce storefronts engineered to showcase your catalog, calculate orders, and process payments without monthly platform sales commissions. Integrates Razorpay, Cashfree, UPI, or Stripe with order tracking and receipts.",
    durationMinutes: 20,
    priceInPaise: 2000000, // Introductory: ₹20,000.00 (Standard: ₹25,000.00)
    currency: "INR",
    category: "E-commerce",
    deliverables: [
      "Responsive product catalog with categories, search, and variant selectors (sizes/colors)",
      "Product detail pages with high-res image galleries, stock badges, and specifications",
      "Interactive shopping cart with dynamic subtotal calculation and coupon code support",
      "Streamlined checkout flow collecting customer shipping & billing details",
      "Payment gateway integration (Razorpay, Cashfree, Stripe, or direct UPI)",
      "Automated customer order confirmation email and WhatsApp purchase alerts",
      "Admin order management dashboard to track purchases, review statuses, and fulfill orders",
    ],
    idealFor: "Direct-to-consumer brands, retail shops, authors, and creators selling products",
    isActive: true,
  },
  {
    id: "backend-apis-integrations",
    slug: "backend-apis-integrations",
    name: "Backend, APIs & Third-Party Integrations",
    tagline: "Robust RESTful APIs, database architectures, authentication layers, and reliable third-party webhook integrations.",
    description:
      "Focused server-side engineering and API integration for existing websites and applications. Secure REST endpoints, PostgreSQL schemas, webhook pipelines, authentication systems, and third-party service connections (payment gateways, CRMs, email, cloud storage).",
    durationMinutes: 20,
    priceInPaise: 960000, // Introductory: ₹9,600.00 (Standard: ₹12,000.00)
    currency: "INR",
    category: "Backend & APIs",
    deliverables: [
      "Type-safe RESTful API endpoints or Server Actions with strict Zod validation",
      "Relational database schema design on PostgreSQL with Prisma ORM and migrations",
      "Secure webhook listener with cryptographic signature verification and idempotent handling",
      "Integration with third-party APIs (payment gateways, transactional email, CRMs, cloud storage)",
      "Endpoint rate limiting, error boundaries, and telemetry logging",
      "Clear technical API documentation with request/response schemas and curl examples",
    ],
    idealFor: "Frontend developers, agencies, and businesses needing dependable server-side architecture",
    isActive: true,
  },
  {
    id: "website-fixes-redesign-optimization",
    slug: "website-fixes-redesign-optimization",
    name: "Website Fixes, Redesign & Optimization",
    tagline: "Visual modernization, responsive mobile fixes, sub-second speed optimization, and technical SEO repair.",
    description:
      "Rapid diagnosis and resolution for underperforming websites. Repair broken layouts, eliminate mobile usability glitches, optimize Core Web Vitals to achieve green Lighthouse scores, and modernize outdated visual aesthetics while protecting existing content and search ranking.",
    durationMinutes: 20,
    priceInPaise: 640000, // Introductory: ₹6,400.00 (Standard: ₹8,000.00)
    currency: "INR",
    category: "Design & Optimization",
    deliverables: [
      "Comprehensive performance and UX audit identifying site bottlenecks and console errors",
      "Core Web Vitals overhaul (LCP, FID, CLS scores optimized into the green 90+ zone)",
      "Mobile responsiveness audit and repair of touch targets, text scaling, and viewport overflow",
      "Visual modernization with high-contrast executive aesthetic and improved typography hierarchy",
      "Clean URL structure preservation with 301 redirects to safeguard existing Google rankings",
      "Image optimization pipeline (WebP conversion, responsive sizing, and zero render-blocking scripts)",
    ],
    idealFor: "Businesses with aging sites that load slowly, look dated, or fail to convert visitors",
    isActive: true,
  },
  {
    id: "website-maintenance-support",
    slug: "website-maintenance-support",
    name: "Website Maintenance & Technical Support",
    tagline: "Proactive monthly website health, security updates, uptime monitoring, and dedicated developer support hours.",
    description:
      "Reliable technical support and peace of mind for business websites. Scheduled health checks, database backups, dependency and security updates, uptime monitoring, and a defined monthly allocation of developer hours for content updates and minor fixes.",
    durationMinutes: 20,
    priceInPaise: 400000, // Introductory: ₹4,000.00/month (Standard: ₹5,000.00/month)
    currency: "INR",
    category: "Maintenance & Support",
    deliverables: [
      "24/7 automated uptime and SSL certificate monitoring with immediate alert triage",
      "Automated weekly or monthly verified database and file backup snapshots",
      "Regular dependency audits, security patching, and vulnerability scans",
      "Defined monthly allocation of 3 hours for content edits, banner swaps, or bug fixes",
      "Priority email and WhatsApp developer communication channel for technical inquiries",
      "Monthly health report summarizing site uptime, performance status, and completed tasks",
    ],
    idealFor: "Businesses requiring reliable monthly technical upkeep, updates, and fast developer response",
    isActive: true,
  },
];

const DEFAULT_AVAILABILITY_RULES = [
  { weekday: 1, startTime: "09:30", endTime: "18:00", timezone: "Asia/Kolkata" }, // Monday
  { weekday: 2, startTime: "09:30", endTime: "18:00", timezone: "Asia/Kolkata" }, // Tuesday
  { weekday: 3, startTime: "09:30", endTime: "18:00", timezone: "Asia/Kolkata" }, // Wednesday
  { weekday: 4, startTime: "09:30", endTime: "18:00", timezone: "Asia/Kolkata" }, // Thursday
  { weekday: 5, startTime: "09:30", endTime: "18:00", timezone: "Asia/Kolkata" }, // Friday
  { weekday: 6, startTime: "10:00", endTime: "15:00", timezone: "Asia/Kolkata" }, // Saturday
];

async function main() {
  console.log("Seeding Slotly freelance service catalog (8 core services)...");

  for (const service of SERVICES_SEED) {
    const upserted = await prisma.service.upsert({
      where: { id: service.id },
      update: {
        name: service.name,
        slug: service.slug,
        tagline: service.tagline,
        description: service.description,
        durationMinutes: service.durationMinutes,
        priceInPaise: service.priceInPaise,
        currency: service.currency,
        category: service.category,
        deliverables: service.deliverables,
        idealFor: service.idealFor,
        isActive: service.isActive,
      },
      create: service,
    });
    console.log(`  ✓ Service upserted: ${upserted.name} (Introductory: ₹${upserted.priceInPaise / 100})`);
  }

  // Deactivate any legacy services not in the new 8 services list (preserves existing foreign keys)
  const activeIds = SERVICES_SEED.map((s) => s.id);
  const deactivated = await prisma.service.updateMany({
    where: { id: { notIn: activeIds } },
    data: { isActive: false },
  });
  if (deactivated.count > 0) {
    console.log(`  ✓ Deactivated ${deactivated.count} legacy service(s).`);
  }

  console.log("Seeding baseline availability rules...");
  for (const rule of DEFAULT_AVAILABILITY_RULES) {
    const existing = await prisma.availabilityRule.findFirst({
      where: { weekday: rule.weekday, timezone: rule.timezone },
    });

    if (existing) {
      await prisma.availabilityRule.update({
        where: { id: existing.id },
        data: {
          startTime: rule.startTime,
          endTime: rule.endTime,
          isActive: true,
        },
      });
    } else {
      await prisma.availabilityRule.create({
        data: {
          ...rule,
          isActive: true,
        },
      });
    }
  }
  console.log("  ✓ Availability rules configured (Mon-Sat, Asia/Kolkata).");

  console.log("Database seed completed successfully.");
}

main()
  .catch((e) => {
    console.error("Error during database seed execution:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
