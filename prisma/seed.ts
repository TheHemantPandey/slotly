/**
 * Slotly Database Seed Script - Freelance Practical Services
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
    id: "custom-web-app",
    slug: "custom-web-app",
    name: "Full-Stack Web Application",
    tagline: "Custom SaaS platforms, portals, and database systems built for performance, scale, and workflow automation.",
    description:
      "End-to-end full-stack web application development engineered from scratch with Next.js 16, React 19, Node.js, and PostgreSQL. Tailored dashboards, client portals, and subscription SaaS products.",
    durationMinutes: 20,
    priceInPaise: 1499900, // ₹14,999.00
    currency: "INR",
    category: "Web Applications",
    deliverables: [
      "Custom relational database architecture (PostgreSQL / Neon / Prisma)",
      "Secure user authentication (OAuth, JWT, role-based access control)",
      "Server-side rendered (SSR) reactive UI with Next.js 16 & Tailwind CSS",
      "RESTful / Server Actions API endpoints with transactional data integrity",
      "Interactive data tables, filters, search, and CSV/PDF export workflows",
      "Production deployment to Vercel/Cloudflare with automated CI/CD pipeline",
      "Full clean source code handover with 30 days post-launch support",
    ],
    idealFor: "Startups, founders, agencies, and businesses needing bespoke software",
    isActive: true,
  },
  {
    id: "landing-page",
    slug: "landing-page",
    name: "High-Converting Landing Page & Portfolio",
    tagline: "Ultra-fast single-page website engineered to convert visitors into paying clients or qualified leads.",
    description:
      "A fast, modern single-page website engineered to turn clicks into clients. Built with Next.js 16 and Tailwind CSS with high-contrast luxury aesthetics, 100/100 Lighthouse performance, mobile responsiveness, and direct lead capture.",
    durationMinutes: 15,
    priceInPaise: 479900, // ₹4,799.00
    currency: "INR",
    category: "Websites",
    deliverables: [
      "High-impact Hero section with persuasive value proposition & primary CTA",
      "Features, services, and product highlights layout with modern iconography",
      "Founder/Company credibility, social proof, and testimonials showcase",
      "Validated lead capture form with instant email alerts & WhatsApp button",
      "100% mobile-responsive layout tested across iOS and Android screens",
      "Core Web Vitals 95+ score with basic on-page SEO meta tags",
      "Direct deployment to your domain on Vercel or Cloudflare",
    ],
    idealFor: "Campaigns, new businesses, founders, consultants, and product launches",
    isActive: true,
  },
  {
    id: "ecommerce-store",
    slug: "ecommerce-store",
    name: "E-Commerce & Online Store Setup",
    tagline: "Direct-to-consumer digital storefront with seamless Indian & international payment checkout.",
    description:
      "Modern online store with product catalog, variant filters, cart management, inventory tracking, and full payment gateway integration (Razorpay, Cashfree, UPI, Stripe) with zero transaction sales commissions.",
    durationMinutes: 20,
    priceInPaise: 959900, // ₹9,599.00
    currency: "INR",
    category: "E-commerce",
    deliverables: [
      "Product catalog with categories, search, and variant selectors (sizes/colors)",
      "Product detail pages with high-res galleries, stock badges, and specs",
      "Interactive shopping cart with dynamic subtotal and coupon support",
      "Streamlined checkout flow with customer shipping & billing collection",
      "Payment gateway integration (Razorpay, Cashfree, Stripe, or direct UPI)",
      "Automated order confirmation email and WhatsApp purchase alert",
      "Admin order management dashboard to track purchases and fulfill orders",
    ],
    idealFor: "Direct-to-consumer brands, retail shops, and creators selling physical or digital goods",
    isActive: true,
  },
  {
    id: "website-redesign",
    slug: "website-redesign",
    name: "Website Redesign & Performance Optimization",
    tagline: "Modernize outdated websites with executive dark aesthetics, sub-second speed, and SEO boost.",
    description:
      "Transform legacy, slow, or outdated websites into contemporary, high-performance web experiences. We audit and rebuild bottlenecks to achieve 95+ Google Lighthouse scores, modern responsive UI, and enhanced search indexing.",
    durationMinutes: 15,
    priceInPaise: 399900, // ₹3,999.00
    currency: "INR",
    category: "Design & Optimization",
    deliverables: [
      "Complete visual UI/UX modernization with high-contrast, executive aesthetic",
      "Migration from clunky WordPress/Wix to ultra-fast Next.js architecture",
      "Core Web Vitals overhaul (LCP, FID, CLS scores in the green 95+ zone)",
      "Full mobile responsiveness audit and tactile touch-target optimization",
      "Clean URL structure preservation with 301 redirects to maintain existing SEO rank",
      "Image compression, font optimization, and zero render-blocking scripts",
    ],
    idealFor: "Businesses with aging sites that load slowly, look dated, or fail to convert",
    isActive: true,
  },
  {
    id: "ai-integration",
    slug: "ai-integration",
    name: "AI Integration & Custom Chatbot / Tooling",
    tagline: "Automate customer support, lead qualification, and internal ops with custom Gemini & LLM workflows.",
    description:
      "Deploy intelligent AI assistants, internal copilots, and automated data pipelines powered by Google Gemini, OpenAI, and LangChain. Tailored to your business documentation, service catalog, and support knowledge base.",
    durationMinutes: 20,
    priceInPaise: 799900, // ₹7,999.00
    currency: "INR",
    category: "AI & Automation",
    deliverables: [
      "Custom AI chatbot concierge trained on your business docs, services, and FAQs",
      "Seamless embed widget for your website with streaming responses and typing indicators",
      "Automatic lead capture: collects visitor name, email, and project scope in conversational flow",
      "Internal AI copilot / document summarization tools for your team",
      "Guardrails and system prompting to prevent hallucinations and off-topic responses",
      "Direct integration with email alerts, webhooks, or CRM database",
    ],
    idealFor: "Businesses wanting to automate repetitive client queries, lead qualification, or workflow tasks",
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
    console.log(`  ✓ Service upserted: ${upserted.name} (Starting at ₹${upserted.priceInPaise / 100})`);
  }

  // Deactivate any legacy services not in the new 8 services list
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
