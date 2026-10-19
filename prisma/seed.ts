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
    id: "landing-page-development",
    slug: "landing-page-development",
    name: "Landing Page Development",
    tagline: "High-impact single-page website built for conversions, product launches, and targeted campaigns.",
    description:
      "A fast, modern single-page website engineered to convert visitors into leads or paying customers. Ideal for new businesses, digital product launches, event promotions, or personal brand marketing.",
    durationMinutes: 45,
    priceInPaise: 299900, // ₹2,999.00
    currency: "INR",
    category: "Websites",
    deliverables: [
      "Custom hero section with compelling value proposition & primary CTA",
      "Features, services, and product highlights layout",
      "About section, social proof & credentials display",
      "Functional lead capture / contact form & WhatsApp trigger",
      "100% mobile-responsive layout across all device screens",
      "Basic on-page SEO setup (meta tags, Open Graph, search indexing readiness)",
      "Direct deployment to your domain and hosting",
    ],
    idealFor: "Campaigns, new businesses, product launches, and personal brands",
    isActive: true,
  },
  {
    id: "business-website-development",
    slug: "business-website-development",
    name: "Business Website Development",
    tagline: "Professional multi-page website engineered for shops, consultants, clinics, and local enterprises.",
    description:
      "A complete, professional 5-page business website designed to establish trust, showcase your full service catalog, and capture high-intent customer inquiries via form, WhatsApp, and interactive maps.",
    durationMinutes: 60,
    priceInPaise: 699900, // ₹6,999.00
    currency: "INR",
    category: "Websites",
    deliverables: [
      "Up to 5 custom-designed pages (Home, About, Services, Contact + 1 custom page)",
      "Mobile-responsive layout optimized for fast performance",
      "Functional enquiry form with instant email alerts",
      "1-click WhatsApp chat button for instant lead capture",
      "Interactive Google Maps integration for store or clinic location",
      "On-page SEO fundamentals (meta tags, XML sitemap, clean URL structure)",
      "Production deployment and domain setup",
    ],
    idealFor: "Shops, consultants, agencies, clinics, and local businesses",
    isActive: true,
  },
  {
    id: "portfolio-website",
    slug: "portfolio-website",
    name: "Portfolio & Personal Website",
    tagline: "Modern personal brand showcase designed for developers, designers, freelancers, and professionals.",
    description:
      "A sleek, high-contrast personal portfolio website that highlights your skills, projects, experience, and achievements. Built to impress recruiters, prospective clients, and collaborators.",
    durationMinutes: 45,
    priceInPaise: 399900, // ₹3,999.00
    currency: "INR",
    category: "Personal & Brand",
    deliverables: [
      "Hero introduction with personal branding, headline, and profile visual",
      "Interactive skills, tools, and technical competencies matrix",
      "Curated project showcase with live preview buttons & GitHub/Figma links",
      "Experience, education, and career milestones timeline",
      "One-click downloadable resume/CV link",
      "Responsive contact section with active social profiles (LinkedIn, GitHub, X)",
      "Responsive layout and basic SEO configuration",
    ],
    idealFor: "Developers, designers, freelancers, students, and professionals",
    isActive: true,
  },
  {
    id: "ecommerce-development",
    slug: "ecommerce-development",
    name: "E-commerce Website",
    tagline: "Online storefront for small businesses selling physical or digital products with secure checkout.",
    description:
      "A fast, mobile-friendly online store engineered to display your products, process customer orders, and accept payments via verified Indian payment gateways (Razorpay, Cashfree, UPI, Stripe).",
    durationMinutes: 60,
    priceInPaise: 1499900, // ₹14,999.00
    currency: "INR",
    category: "E-commerce",
    deliverables: [
      "Product catalog with category navigation and search",
      "Product detail pages with image galleries, variants (sizes/colors), and specs",
      "Interactive shopping cart with real-time subtotal calculation",
      "Streamlined checkout flow with customer shipping & billing collection",
      "Payment gateway integration (Razorpay, Cashfree, Stripe, or direct UPI)",
      "Basic admin dashboard for order inspection and product management",
      "Mobile-friendly product browsing and order confirmation receipts",
    ],
    idealFor: "Small businesses, retail shops, and creators selling physical or digital products",
    isActive: true,
  },
  {
    id: "booking-website",
    slug: "booking-website",
    name: "Booking & Appointment Website",
    tagline: "Automated reservation system for salons, clinics, consultants, tutors, and service providers.",
    description:
      "A streamlined booking website that eliminates calendar ping-pong. Display your services, present live availability, collect client intake details, and confirm appointments with automated receipts.",
    durationMinutes: 60,
    priceInPaise: 999900, // ₹9,999.00
    currency: "INR",
    category: "Web Applications",
    deliverables: [
      "Service catalog with transparent descriptions, durations, and pricing",
      "Interactive calendar with selectable time slots and real-time conflict prevention",
      "Client intake brief capture (name, contact, agenda notes)",
      "Instant appointment confirmation screen with calendar (.ics / Google Calendar) sync",
      "Admin dashboard to view, manage, and track upcoming appointments",
      "Customer details database",
      "Email or WhatsApp notification hooks (where credentials are provided)",
    ],
    idealFor: "Salons, tutors, consultants, clinics, and appointment-based businesses",
    isActive: true,
  },
  {
    id: "website-redesign",
    slug: "website-redesign",
    name: "Website Redesign & Improvement",
    tagline: "Visual, typography, and mobile UX overhaul for outdated, slow, or poorly converting websites.",
    description:
      "Transform an outdated, clunky, or unappealing website into a sleek, executive digital presence. We modernize your layouts, colors, navigation, and mobile responsiveness while safeguarding your existing content.",
    durationMinutes: 45,
    priceInPaise: 399900, // ₹3,999.00
    currency: "INR",
    category: "Design & Optimization",
    deliverables: [
      "Comprehensive visual hierarchy & mobile UX evaluation of current site",
      "Modernized visual design system (curated typography, palette, card styling)",
      "Mobile layout overhaul for seamless touch usability on modern devices",
      "Navigation restructure to streamline visitor user pathways",
      "Fixing visual inconsistencies, misaligned elements, and broken styling",
      "Preservation of existing business logic, SEO rankings, and backend integrations",
    ],
    idealFor: "Businesses and individuals with an outdated or underperforming existing website",
    isActive: true,
  },
  {
    id: "bug-fixes-maintenance",
    slug: "bug-fixes-maintenance",
    name: "Bug Fixes & Website Maintenance",
    tagline: "Rapid diagnosis and resolution for UI glitches, broken links, and ongoing site health.",
    description:
      "Direct technical troubleshooting for annoying website issues, broken layouts, contact form failures, and routine site upkeep. Starting at ₹999 for defined small tasks, with optional ongoing maintenance starting at ₹1,999/month.",
    durationMinutes: 30,
    priceInPaise: 99900, // ₹999.00
    currency: "INR",
    category: "Maintenance & Support",
    deliverables: [
      "Targeted diagnosis & fix for up to 1-2 defined minor frontend/UI bugs",
      "Broken link resolution and layout overflow repairs on mobile",
      "Troubleshooting contact form, email notification, or webhook delivery failures",
      "Minor text, image, banner, or pricing updates",
      "Diagnostic summary explaining the root cause and the fix applied",
      "Optional monthly maintenance retainer available starting at ₹1,999/month",
    ],
    idealFor: "Website owners facing unexpected technical bugs or needing routine maintenance",
    isActive: true,
  },
  {
    id: "custom-web-applications",
    slug: "custom-web-applications",
    name: "Custom Web Application Development",
    tagline: "Bespoke full-stack web applications, internal business tools, portals, and startup MVPs.",
    description:
      "Tailor-made web applications engineered for startups, businesses, and founders. From operational dashboards and customer portals to automated business workflows with secure authentication and database integration.",
    durationMinutes: 60,
    priceInPaise: 1499900, // ₹14,999.00
    currency: "INR",
    category: "Web Applications",
    deliverables: [
      "Full-stack architecture built on Next.js, React, and modern PostgreSQL / SQL",
      "Custom administrative dashboards and operational tooling",
      "User authentication and role-based permissions (admin, staff, client)",
      "Type-safe APIs and database schema with strict validation",
      "Interactive data tables with searching, filtering, and exportable records",
      "Modern, executive UI built with fluid micro-interactions",
      "Clear technical documentation and production deployment",
    ],
    idealFor: "Startups, growing businesses, and individuals needing custom software tools",
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
