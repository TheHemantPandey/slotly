import { ServiceDetail } from "./types";

export const FREELANCE_SERVICES: ServiceDetail[] = [
  {
    id: "custom-web-app",
    slug: "custom-web-app",
    title: "Full-Stack Web Application",
    tagline: "Custom SaaS platforms, portals, and database systems built for performance, scale, and workflow automation.",
    description:
      "End-to-end full-stack web application development engineered from scratch. We build tailored dashboards, client portals, internal operational tools, and subscription SaaS products with Next.js 16, React 19, Node.js, and PostgreSQL.",
    durationMinutes: 20,
    feeINR: 14999,
    startingPriceINR: 14999,
    originalPriceINR: 18999,
    originalFeeINR: 18999,
    discountPercent: 20,
    category: "Web Applications",
    popular: true,
    idealFor: "Startups, founders, agencies, and businesses needing bespoke software",
    deliverables: [
      "Custom relational database architecture (PostgreSQL / Neon / Prisma)",
      "Secure user authentication (OAuth, JWT, role-based access control)",
      "Server-side rendered (SSR) reactive UI with Next.js 16 & Tailwind CSS",
      "RESTful / Server Actions API endpoints with transactional data integrity",
      "Interactive data tables, filters, search, and CSV/PDF export workflows",
      "Production deployment to Vercel/Cloudflare with automated CI/CD pipeline",
      "Full clean source code handover with 30 days post-launch support",
    ],
    whoIsItFor: [
      "Founders validating and launching an MVP SaaS product to paying customers",
      "Growing companies replacing spreadsheet chaos with a centralized operations portal",
      "Service businesses needing client portals for project intake and file delivery",
      "Enterprises requiring internal administrative tooling with strict role permissions",
    ],
    problemsSolved: [
      "Rigid no-code platforms (Bubble, Airtable) breaking under real customer scale",
      "High ongoing monthly subscription costs for generic off-the-shelf software",
      "Security vulnerabilities and lack of audit logging in makeshift web tools",
      "Slow, sluggish legacy backends frustrating users and damaging conversion rates",
    ],
    includedDeliverables: [
      "Complete custom full-stack web application source code (TypeScript)",
      "PostgreSQL relational database schema design with migrations",
      "Role-based authentication & authorization layers (Admin, Member, Guest)",
      "Responsive admin/client dashboard with modern high-contrast dark theme",
      "CRUD workflows, form validations, and transactional database queries",
      "Error boundaries, automated email notifications, and telemetry logging",
      "Cloud hosting configuration (Vercel, Neon DB, Supabase, or AWS)",
      "30-day warranty for post-launch bug fixes and technical questions",
    ],
    notIncluded: [
      "Third-party paid cloud server infrastructure and domain renewals",
      "External proprietary API consumption billing (e.g. OpenAI/Twilio usage)",
      "Custom native mobile apps for iOS App Store or Android Google Play",
    ],
    benefitsAndOutcomes: [
      "100% intellectual property ownership without recurring software vendor lock-in",
      "Blazing sub-second page transitions powered by React 19 and Next.js 16 Server Components",
      "Operational efficiency that saves hours of manual team administrative overhead every week",
      "Scalable infrastructure designed to handle thousands of concurrent transactions",
    ],
    techStack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Node.js",
      "PostgreSQL / Neon",
      "Prisma ORM",
      "Tailwind CSS",
      "Vercel / Cloudflare",
    ],
    beforeAfter: [
      {
        before: "Stitching together 5 different SaaS tools, spreadsheets, and Zapier zaps that break unexpectedly.",
        after: "One unified, lightning-fast web application custom-built for your exact business process.",
      },
      {
        before: "Paying hundreds of dollars monthly in per-seat software licensing fees.",
        after: "Full ownership of your source code and database with near-zero marginal operating costs.",
      },
      {
        before: "Clunky, slow legacy software that users struggle to navigate.",
        after: "Contemporary, responsive, executive-grade UX that delights clients and team members.",
      },
    ],
    developmentProcess: [
      {
        step: "01",
        title: "20-Min Discovery & Requirements Call",
        description: "We review your user roles, core data entities, business rules, and technical objectives.",
      },
      {
        step: "02",
        title: "Architecture & Schema Blueprint",
        description: "We design the relational database schema, user flows, and wireframes for complete alignment.",
      },
      {
        step: "03",
        title: "Rapid Iterative Sprints",
        description: "We build the core database models, backend API endpoints, authentication layers, and dashboard views.",
      },
      {
        step: "04",
        title: "Security & Performance Hardening",
        description: "We conduct stress testing, input sanitization, database index optimization, and responsive checks.",
      },
      {
        step: "05",
        title: "Production Deployment & Handover",
        description: "We ship to production cloud infrastructure, configure backups, and walk through the code.",
      },
    ],
    estimatedDelivery: "2 to 4 weeks (defined after discovery call)",
    faqs: [
      {
        question: "What does the 'Starts from ₹14,999' fee cover?",
        answer:
          "The starting rate covers a focused full-stack custom application or internal tool with authenticated dashboard views, database CRUD operations, and core workflows. More complex multi-tenant SaaS products are scoped transparently based on additional user roles and integrations.",
      },
      {
        question: "Do I get full ownership of the code?",
        answer:
          "Yes, absolutely. You retain 100% intellectual property ownership of the codebase and database schema upon completion. No recurring licensing fees or vendor lock-in.",
      },
      {
        question: "How do we get started?",
        answer:
          "Book a 20-minute discovery call below. We will discuss your functional requirements, technical stack, timeline, and deliverables.",
      },
    ],
    relatedServiceSlugs: [
      "landing-page",
      "ecommerce-store",
      "ai-integration",
    ],
  },
  {
    id: "landing-page",
    slug: "landing-page",
    title: "High-Converting Landing Page & Portfolio",
    tagline: "Ultra-fast single-page website engineered to convert visitors into paying clients or qualified leads.",
    description:
      "A fast, modern single-page website engineered to turn clicks into clients. Built with Next.js 16 and Tailwind CSS with high-contrast luxury aesthetics, 100/100 Lighthouse performance, mobile responsiveness, and direct lead capture.",
    durationMinutes: 15,
    feeINR: 4799,
    startingPriceINR: 4799,
    originalPriceINR: 5999,
    originalFeeINR: 5999,
    discountPercent: 20,
    category: "Websites",
    popular: true,
    idealFor: "Campaigns, new businesses, founders, consultants, and product launches",
    deliverables: [
      "High-impact Hero section with persuasive value proposition & primary CTA",
      "Features, services, and product highlights layout with modern iconography",
      "Founder/Company credibility, social proof, and testimonials showcase",
      "Validated lead capture form with instant email alerts & WhatsApp button",
      "100% mobile-responsive layout tested across iOS and Android screens",
      "Core Web Vitals 95+ score with basic on-page SEO meta tags",
      "Direct deployment to your domain on Vercel or Cloudflare",
    ],
    whoIsItFor: [
      "Startups & founders testing a new product with an early-access waiting list",
      "Businesses running Meta, Google, or LinkedIn ad campaigns needing high conversion",
      "Consultants, freelancers, and authors promoting high-ticket services",
      "Entrepreneurs needing an executive, trustworthy web presence in 3–5 days",
    ],
    problemsSolved: [
      "Wasting ad spend on slow, bloated WordPress templates that bounce visitors",
      "Websites looking broken, misaligned, or unreadable on mobile phones",
      "No clear conversion path or way for prospective clients to book or inquire",
      "Waiting weeks and paying high agency retainers just to get one page online",
    ],
    includedDeliverables: [
      "Custom single-page responsive design and production-grade Next.js code",
      "Hero section with conversion-optimized typography and call-to-actions",
      "Product/Service capability cards and interactive pricing grid",
      "About and credentials section with client proof points",
      "Interactive enquiry form with spam protection & WhatsApp click-to-chat",
      "On-page SEO optimization (Meta tags, Open Graph card, sitemap)",
      "Deployment assistance to Vercel, Netlify, or custom domain",
    ],
    notIncluded: [
      "Multi-page enterprise site architecture (available under Custom Web App)",
      "User login accounts or customer database storage backends",
      "Third-party paid domain registration fees",
    ],
    benefitsAndOutcomes: [
      "Under 1-second load times that keep mobile visitors from bouncing",
      "Clean visual polish that makes your brand look established and premium from day one",
      "Direct pipeline of customer leads delivered immediately to your inbox or WhatsApp",
      "Full ownership of your source code without ongoing platform builder subscriptions",
    ],
    techStack: [
      "Next.js 16",
      "Tailwind CSS",
      "TypeScript",
      "Framer Motion",
      "Vercel Edge",
      "SEO Meta Engine",
    ],
    beforeAfter: [
      {
        before: "Slow, generic website with 50% bounce rates and zero incoming enquiries.",
        after: "High-contrast, high-converting landing page that turns ad clicks into direct client messages.",
      },
      {
        before: "Paying expensive monthly fees for bloated page-builder tools.",
        after: "Clean static Next.js deployment that runs virtually free on high-speed CDN edges.",
      },
    ],
    developmentProcess: [
      {
        step: "01",
        title: "15-Min Quick Discovery Call",
        description: "We align on your product, target audience, conversion goals, and brand aesthetic.",
      },
      {
        step: "02",
        title: "Content & Visual Layout",
        description: "We organize your copy, hero hook, social proof, and call-to-action layout.",
      },
      {
        step: "03",
        title: "Next.js & Tailwind Coding",
        description: "We write clean, semantic, responsive code with micro-animations and field validation.",
      },
      {
        step: "04",
        title: "Speed Optimization & Launch",
        description: "We test across real devices, verify SEO tags, and deploy directly to your domain.",
      },
    ],
    estimatedDelivery: "3 to 5 business days",
    faqs: [
      {
        question: "What does the ₹4,799 starting package include?",
        answer:
          "It covers a full custom landing page built from scratch with custom sections (Hero, Features, About, Testimonials, Contact/Lead Form, Footer), mobile optimization, basic SEO, and direct deployment.",
      },
      {
        question: "Can I connect my own custom domain?",
        answer:
          "Yes. We configure your DNS records to connect your custom .com, .in, or any other domain with free SSL.",
      },
    ],
    relatedServiceSlugs: [
      "custom-web-app",
      "website-redesign",
      "ecommerce-store",
    ],
  },
  {
    id: "ecommerce-store",
    slug: "ecommerce-store",
    title: "E-Commerce & Online Store Setup",
    tagline: "Direct-to-consumer digital storefront with seamless Indian & international payment checkout.",
    description:
      "A fast, mobile-friendly online storefront engineered to showcase your catalog, process orders, and accept payments via verified payment gateways (Razorpay, Cashfree, UPI, Stripe) with zero transaction sales commissions.",
    durationMinutes: 20,
    feeINR: 9599,
    startingPriceINR: 9599,
    originalPriceINR: 11999,
    originalFeeINR: 11999,
    discountPercent: 20,
    category: "E-commerce",
    popular: false,
    idealFor: "Direct-to-consumer brands, retail shops, and creators selling physical or digital goods",
    deliverables: [
      "Product catalog with categories, search, and variant selectors (sizes/colors)",
      "Product detail pages with high-res galleries, stock badges, and specs",
      "Interactive shopping cart with dynamic subtotal and coupon support",
      "Streamlined checkout flow with customer shipping & billing collection",
      "Payment gateway integration (Razorpay, Cashfree, Stripe, or direct UPI)",
      "Automated order confirmation email and WhatsApp purchase alert",
      "Admin order management dashboard to track purchases and fulfill orders",
    ],
    whoIsItFor: [
      "Retail shops and D2C brands looking to sell directly without marketplace cut",
      "Creators and authors selling merchandise, books, or digital downloads",
      "Businesses moving away from high-fee platforms like Shopify or WooCommerce",
    ],
    problemsSolved: [
      "Paying 2% marketplace cuts plus heavy monthly Shopify app subscriptions",
      "Complex, multi-step checkout processes causing 70%+ mobile cart abandonment",
      "Payment gateway failures and lack of native UPI / QR checkout in foreign builders",
    ],
    includedDeliverables: [
      "Full Next.js e-commerce storefront frontend & backend APIs",
      "Product catalog, detail pages, cart, and checkout flow",
      "Razorpay / Cashfree / Stripe payment gateway integration",
      "Admin order tracking and inventory status management",
      "Transactional email receipt and WhatsApp order notification trigger",
    ],
    notIncluded: [
      "Payment gateway merchant account transaction fees (typically 2% charged by Razorpay)",
      "Product photography and commercial stock image licenses",
    ],
    benefitsAndOutcomes: [
      "Zero monthly platform fees and zero extra commission on your revenue",
      "Seamless 1-click UPI and QR checkout that converts Indian shoppers effortlessly",
      "Full ownership of customer emails, phone numbers, and purchase history",
    ],
    techStack: [
      "Next.js 16",
      "Razorpay / Stripe",
      "PostgreSQL",
      "Tailwind CSS",
      "Serverless APIs",
      "WhatsApp Order Engine",
    ],
    beforeAfter: [
      {
        before: "Paying ₹3,000+ monthly in Shopify app subscriptions and transaction cuts.",
        after: "Self-hosted high-speed custom store with zero monthly builder fees and direct bank payouts.",
      },
      {
        before: "Slow, clunky checkout resulting in customer drop-offs.",
        after: "Instant 2-step checkout with UPI, cards, and netbanking that closes sales in seconds.",
      },
    ],
    developmentProcess: [
      {
        step: "01",
        title: "20-Min Store Discovery Call",
        description: "We review your product catalog, payment requirements, shipping zones, and brand aesthetic.",
      },
      {
        step: "02",
        title: "Catalog & Checkout Architecture",
        description: "We configure product categories, variants, shipping fields, and cart logic.",
      },
      {
        step: "03",
        title: "Payment Gateway Integration",
        description: "We connect Razorpay/Cashfree/Stripe with secure webhook verification and test transactions.",
      },
      {
        step: "04",
        title: "End-to-End Testing & Go-Live",
        description: "We verify real order checkout, email confirmations, admin dashboards, and launch.",
      },
    ],
    estimatedDelivery: "1 to 2 weeks",
    faqs: [
      {
        question: "Which payment gateways do you support?",
        answer:
          "We natively integrate Razorpay, Cashfree, PayU, and Stripe, supporting Google Pay, PhonePe, Paytm, all UPI apps, credit/debit cards, and Net Banking.",
      },
      {
        question: "Can I manage products and orders myself?",
        answer:
          "Yes! We provide an intuitive administrative dashboard where you can add new items, update stock, and inspect customer orders with one click.",
      },
    ],
    relatedServiceSlugs: [
      "custom-web-app",
      "landing-page",
      "ai-integration",
    ],
  },
  {
    id: "website-redesign",
    slug: "website-redesign",
    title: "Website Redesign & Performance Optimization",
    tagline: "Modernize outdated websites with executive dark aesthetics, sub-second speed, and SEO boost.",
    description:
      "Transform legacy, slow, or outdated websites into contemporary, high-performance web experiences. We audit and rebuild bottlenecks to achieve 95+ Google Lighthouse scores, modern responsive UI, and enhanced search indexing.",
    durationMinutes: 15,
    feeINR: 3999,
    startingPriceINR: 3999,
    originalPriceINR: 4999,
    originalFeeINR: 4999,
    discountPercent: 20,
    category: "Design & Optimization",
    popular: false,
    idealFor: "Businesses with aging sites that load slowly, look dated, or fail to convert",
    deliverables: [
      "Complete visual UI/UX modernization with high-contrast, executive aesthetic",
      "Migration from clunky WordPress/Wix to ultra-fast Next.js architecture",
      "Core Web Vitals overhaul (LCP, FID, CLS scores in the green 95+ zone)",
      "Full mobile responsiveness audit and tactile touch-target optimization",
      "Clean URL structure preservation with 301 redirects to maintain existing SEO rank",
      "Image compression, font optimization, and zero render-blocking scripts",
    ],
    whoIsItFor: [
      "Established businesses whose websites look like they were designed a decade ago",
      "Sites penalized by Google because of slow load times and failed Core Web Vitals",
      "Companies wanting a sleek modern tech feel that reflects their true service quality",
    ],
    problemsSolved: [
      "Losing qualified prospects because the site takes 5+ seconds to open on 4G mobile",
      "Outdated layout embarrassing sales teams when sending links to high-ticket clients",
      "Plugin updates breaking WordPress sites and creating critical security exploits",
    ],
    includedDeliverables: [
      "Comprehensive performance and UX audit of existing website",
      "Fresh, modern, executive-grade UI redesign built in Next.js",
      "Asset optimization, webp image pipelines, and clean code refactoring",
      "Seamless migration preserving your existing content and domain authority",
    ],
    notIncluded: [
      "Brand-new logo design from scratch (we modernize existing brand assets)",
      "Rewriting all commercial legal agreements or terms of service",
    ],
    benefitsAndOutcomes: [
      "Page load times reduced from 6+ seconds down to under 800 milliseconds",
      "Immediate lift in Google search ranking and mobile user engagement",
      "Professional, polished presentation that builds instant trust with executive clients",
    ],
    techStack: [
      "Next.js",
      "Core Web Vitals",
      "Lighthouse 100/100",
      "Tailwind CSS",
      "Semantic HTML5",
      "Clean Architecture",
    ],
    beforeAfter: [
      {
        before: "Clunky 2016-era WordPress theme loading in 6.2s with red Lighthouse scores.",
        after: "Sleek Next.js experience loading in 0.7s with 98+ green Lighthouse performance.",
      },
      {
        before: "Broken mobile navigation causing visitors to immediately bounce.",
        after: "Fluid, touch-optimized mobile experience designed for frictionless inquiry.",
      },
    ],
    developmentProcess: [
      {
        step: "01",
        title: "15-Min Audit & Discovery Call",
        description: "We inspect your current website, traffic pain points, competitor benchmarks, and goals.",
      },
      {
        step: "02",
        title: "Modernized Visual Concept",
        description: "We present a streamlined, high-contrast modern UI direction tailored to your brand.",
      },
      {
        step: "03",
        title: "Next.js Rebuild & Asset Tuning",
        description: "We reconstruct the site with clean components, responsive breakpoints, and zero bloat.",
      },
      {
        step: "04",
        title: "SEO Safety & Launch",
        description: "We map 301 redirects, verify Core Web Vitals, and switch DNS smoothly with zero downtime.",
      },
    ],
    estimatedDelivery: "5 to 7 business days",
    faqs: [
      {
        question: "Will my current Google search ranking drop if I redesign?",
        answer:
          "No! We carefully map 301 redirects for all existing URLs and preserve meta structures. In fact, improving Core Web Vitals and mobile responsiveness almost always boosts organic search rankings.",
      },
      {
        question: "Can you migrate content from my existing WordPress site?",
        answer:
          "Yes. We migrate your existing text, images, case studies, and brand assets directly into the clean Next.js architecture.",
      },
    ],
    relatedServiceSlugs: [
      "landing-page",
      "custom-web-app",
      "ai-integration",
    ],
  },
  {
    id: "ai-integration",
    slug: "ai-integration",
    title: "AI Integration & Custom Chatbot / Tooling",
    tagline: "Automate customer support, lead qualification, and internal ops with custom Gemini & LLM workflows.",
    description:
      "Deploy intelligent AI assistants, internal copilots, and automated data pipelines powered by Google Gemini, OpenAI, and LangChain. Tailored to your business documentation, service catalog, and support knowledge base.",
    durationMinutes: 20,
    feeINR: 7999,
    startingPriceINR: 7999,
    originalPriceINR: 9999,
    originalFeeINR: 9999,
    discountPercent: 20,
    category: "AI & Automation",
    popular: false,
    idealFor: "Businesses wanting to automate repetitive client queries, lead qualification, or workflow tasks",
    deliverables: [
      "Custom AI chatbot concierge trained on your business docs, services, and FAQs",
      "Seamless embed widget for your website with streaming responses and typing indicators",
      "Automatic lead capture: collects visitor name, email, and project scope in conversational flow",
      "Internal AI copilot / document summarization tools for your team",
      "Guardrails and system prompting to prevent hallucinations and off-topic responses",
      "Direct integration with email alerts, webhooks, or CRM database",
    ],
    whoIsItFor: [
      "Businesses receiving repeated inquiries about pricing, availability, and services",
      "Agencies and consultancies needing 24/7 lead qualification while the team is offline",
      "Companies with complex product manuals or internal documentation",
    ],
    problemsSolved: [
      "Support staff spending hours each day answering identical basic questions",
      "Losing prospective client leads who visit late at night when nobody is available to chat",
      "Clunky rule-based chatbots that frustrate users with rigid 'press 1 for sales' logic",
    ],
    includedDeliverables: [
      "Custom Gemini 1.5 / OpenAI LLM integration with vector knowledge embedding",
      "Embeddable website chat widget with responsive dark theme and streaming UI",
      "Lead extraction and automated email/webhook dispatch",
      "Admin inspection of conversation logs and assistant response tuning",
    ],
    notIncluded: [
      "Third-party LLM API token consumption costs (e.g. Google Cloud / OpenAI billing)",
    ],
    benefitsAndOutcomes: [
      "24/7 automated lead capture that qualifies clients and collects contact details instantly",
      "Up to 70% reduction in repetitive customer support inquiries",
      "Instant, natural conversational answers tailored precisely to your company voice",
    ],
    techStack: [
      "Gemini 1.5 Pro / Flash",
      "LangChain / Vercel AI SDK",
      "Vector DB / Embeddings",
      "Next.js",
      "Node.js",
      "Secure Webhooks",
    ],
    beforeAfter: [
      {
        before: "Unanswered late-night visitor inquiries bouncing without leaving contact info.",
        after: "Smart conversational AI answering questions instantly and booking discovery calls into your calendar.",
      },
      {
        before: "Staff spending 2+ hours daily answering repetitive pricing and catalog questions.",
        after: "Automated AI concierge resolving 80% of inquiries with zero human intervention.",
      },
    ],
    developmentProcess: [
      {
        step: "01",
        title: "20-Min AI Discovery Call",
        description: "We identify your target use cases, knowledge sources, lead qualification criteria, and integrations.",
      },
      {
        step: "02",
        title: "Knowledge Base & Prompt Engineering",
        description: "We ingest your company documents, tune system guardrails, and benchmark accuracy.",
      },
      {
        step: "03",
        title: "UI Widget & Backend Pipeline",
        description: "We build the streaming chat interface, API endpoints, and webhook notification triggers.",
      },
      {
        step: "04",
        title: "Testing & Live Deployment",
        description: "We conduct stress testing, verify lead collection, and embed the widget on your site.",
      },
    ],
    estimatedDelivery: "1 to 2 weeks",
    faqs: [
      {
        question: "Will the AI hallucinate or make up false prices?",
        answer:
          "We implement strict retrieval-augmented generation (RAG) and guardrail system prompts that instruct the model to only answer from your verified knowledge base and gracefully refer unlisted questions to your team.",
      },
      {
        question: "Can it capture lead contact details?",
        answer:
          "Yes! The AI can naturally ask for the user's name, email, and requirements in conversation, and immediately dispatch a notification to your email or database.",
      },
    ],
    relatedServiceSlugs: [
      "custom-web-app",
      "landing-page",
      "ecommerce-store",
    ],
  },
];

// Backward-compatibility alias map for legacy database seeds and URLs
export const SLUG_ALIASES: Record<string, string> = {
  "landing-page-development": "landing-page",
  "portfolio-website": "landing-page",
  "ecommerce-development": "ecommerce-store",
  "custom-web-applications": "custom-web-app",
  "booking-website": "custom-web-app",
  "business-website-development": "custom-web-app",
  "website-redesign-modernization": "website-redesign",
  "speed-seo-optimization": "website-redesign",
  "bug-fixes-maintenance": "website-redesign",
  "custom-feature-bug-fix": "website-redesign",
  "website-maintenance-support": "website-redesign",
};

export function resolveServiceSlug(rawSlug: string): string {
  const clean = rawSlug.trim().toLowerCase();
  return SLUG_ALIASES[clean] || clean;
}

export function getServiceBySlug(slug: string): ServiceDetail | undefined {
  const resolved = resolveServiceSlug(slug);
  return (
    FREELANCE_SERVICES.find((s) => s.slug === resolved || s.id === resolved) ||
    FREELANCE_SERVICES.find((s) => s.slug === slug || s.id === slug)
  );
}

export function getAllServiceSlugs(): string[] {
  return FREELANCE_SERVICES.map((s) => s.slug);
}

export function getRelatedServices(currentSlug: string): ServiceDetail[] {
  const current = getServiceBySlug(currentSlug);
  if (!current) return FREELANCE_SERVICES.slice(0, 3);
  return current.relatedServiceSlugs
    .map((slug) => getServiceBySlug(slug))
    .filter((s): s is ServiceDetail => Boolean(s))
    .slice(0, 3);
}
