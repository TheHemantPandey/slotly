import { ServiceDetail } from "./types";

export const FREELANCE_SERVICES: ServiceDetail[] = [
  {
    id: "business-websites-landing-pages",
    slug: "business-websites-landing-pages",
    title: "Business Websites & Landing Pages",
    tagline: "High-performance business websites, portfolios, and landing pages designed for credible presentation and lead capture.",
    description:
      "Professional website engineering for small businesses, founders, consultants, and local brands. We build fast, mobile-first websites with clear conversion pathways, validated inquiry forms, and technical SEO hygiene so visitors easily understand your value and reach out.",
    durationMinutes: 20,
    feeINR: 9600,
    startingPriceINR: 9600,
    introductoryPriceINR: 9600,
    originalPriceINR: 12000,
    originalFeeINR: 12000,
    standardPriceINR: 12000,
    standardFeeINR: 12000,
    discountPercent: 20,
    category: "Websites",
    popular: true,
    idealFor: "Consultants, small businesses, startups, creators, and local service providers",
    deliverables: [
      "Responsive bespoke design (Home, About, Services, Social Proof, and Contact sections)",
      "Validated lead capture contact form with direct email alerts & spam filtering",
      "Core Web Vitals 90+ score with semantic HTML5, Open Graph meta tags, and XML sitemap",
      "Mobile-first fluid layouts tested across iOS, Android, and desktop viewports",
      "Production deployment to Vercel or Cloudflare with custom domain DNS setup",
      "Clean source code handover with 14 days of post-launch technical support",
    ],
    whoIsItFor: [
      "Independent consultants, coaches, and professionals wanting a trustworthy online presence",
      "Small businesses and local enterprises needing a modern website that turns search traffic into client inquiries",
      "Startup founders and product creators needing high-impact landing pages for waiting lists or product launches",
      "Businesses replacing sluggish, template-heavy page builders with modern custom-coded web architecture",
    ],
    problemsSolved: [
      "Visitors bouncing immediately because heavy website templates take 4+ seconds to load on mobile",
      "Websites looking broken, unaligned, or awkward on modern smartphones and tablets",
      "Inquiry forms failing silently without notifying the site owner or lacking basic spam protection",
      "Paying high recurring monthly fees for rigid site builder tools that lock in your content",
    ],
    includedDeliverables: [
      "Custom responsive design and production-grade Next.js 16 / Tailwind CSS implementation",
      "Up to 5 core functional sections or pages (Hero, Value Proposition, Services, Proof/Testimonials, Contact)",
      "Interactive inquiry form with input validation and instant transactional email delivery",
      "Technical SEO foundation: title tags, meta descriptions, Open Graph preview cards, and robots.txt",
      "DNS configuration and SSL certificate activation on your chosen custom domain",
      "100% full source code ownership with GitHub repository transfer and deployment walkthrough",
    ],
    notIncluded: [
      "Third-party paid domain registration fees and business email inbox hosting (e.g. Google Workspace)",
      "Commercial stock photography or video production licensing (client assets or curated open-license images used)",
      "User login accounts, subscription billing, or complex database backends (covered under Custom Web Applications)",
      "Multi-product shopping cart and payment gateway checkout (covered under E-commerce & Payment Integration)",
    ],
    benefitsAndOutcomes: [
      "Immediate credibility boost that reflects the real quality of your services to high-ticket prospects",
      "Sub-second page transitions that keep mobile visitors engaged and ready to inquire",
      "A steady, direct pipeline of customer leads delivered straight to your email inbox without intermediary platform fees",
      "Zero vendor lock-in—your website is your intellectual property with virtually zero marginal hosting cost",
    ],
    techStack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS",
      "Vercel Edge CDN",
      "Semantic SEO",
    ],
    beforeAfter: [
      {
        before: "Slow, generic website with high bounce rates and inquiries lost in spam or non-existent forms.",
        after: "High-contrast, high-converting digital storefront loading in under 1 second with instant lead alerts.",
      },
      {
        before: "Paying ₹1,500–₹3,000 monthly in website builder fees for clunky, rigid template blocks.",
        after: "Clean custom Next.js deployment hosted on high-speed global edges with zero recurring platform charges.",
      },
    ],
    developmentProcess: [
      {
        step: "01",
        title: "20-Min Discovery Session",
        description: "We review your audience, value proposition, conversion goals, and visual aesthetic preferences.",
      },
      {
        step: "02",
        title: "Structure & Content Layout",
        description: "We organize the section hierarchy, hero hook, proof points, and call-to-action layout.",
      },
      {
        step: "03",
        title: "Next.js & Tailwind Engineering",
        description: "We code clean, semantic, responsive components with smooth micro-interactions and form validation.",
      },
      {
        step: "04",
        title: "Speed, SEO & Mobile Audit",
        description: "We test across real devices, verify Core Web Vitals, and review search metadata cards.",
      },
      {
        step: "05",
        title: "Domain Setup & Handover",
        description: "We connect your custom domain, verify SSL encryption, and transfer the clean Git repository.",
      },
    ],
    estimatedDelivery: "5 to 7 business days from content receipt",
    addOns: [
      {
        title: "Additional Custom Pages",
        priceINR: 2000,
        priceNote: "per page",
        description: "Add detailed sub-service pages, deep case studies, or career/team pages.",
      },
      {
        title: "Markdown Blog / Article CMS",
        priceINR: 4000,
        priceNote: "flat add-on",
        description: "Publish content easily with static markdown/MDX articles for ongoing organic SEO.",
      },
      {
        title: "Multi-Language Toggle",
        priceINR: 3500,
        priceNote: "flat add-on",
        description: "Client-side language switcher supporting dual language content versions.",
      },
    ],
    faqs: [
      {
        question: "What is the difference between the Standard Package Price and the Introductory Price?",
        answer:
          "The Standard Package Price is ₹12,000, and our current Introductory Price is ₹9,600, reflecting a 20% introductory discount for direct engagements. All scope items, deliverables, and guarantees are identical.",
      },
      {
        question: "Can I connect my own custom domain (.com, .in, etc.)?",
        answer:
          "Yes. We configure your DNS records on your registrar (GoDaddy, Namecheap, Cloudflare, etc.) and configure automated SSL certificates with global CDN edge distribution.",
      },
      {
        question: "Do I get full ownership of the source code?",
        answer:
          "Yes, 100%. All repository source code, styling tokens, and deployment scripts are transferred directly to your own GitHub or code repository upon completion. There are zero licensing fees.",
      },
      {
        question: "Are hosting costs included?",
        answer:
          "Static Next.js deployments easily qualify for generous free tiers on platforms like Vercel or Cloudflare Pages for normal traffic volumes. We set up your deployment directly on your account so you maintain full control.",
      },
      {
        question: "What if I need more than 5 pages or custom features?",
        answer:
          "Additional pages can be added at ₹2,000 per page. For dynamic databases, user logins, or custom backend portals, our Custom Web Applications & Dashboards track is the ideal choice.",
      },
    ],
    relatedServiceSlugs: [
      "custom-web-apps-dashboards",
      "website-fixes-redesign-optimization",
      "booking-management-systems",
    ],
  },
  {
    id: "custom-web-apps-dashboards",
    slug: "custom-web-apps-dashboards",
    title: "Custom Web Applications & Dashboards",
    tagline: "Tailored dashboards, client portals, internal operational tools, and database-backed SaaS MVPs.",
    description:
      "End-to-end full-stack web application development engineered for specific operational workflows. We build authenticated dashboards, customer portals, data pipelines, and transactional web apps with Next.js 16, React 19, TypeScript, and PostgreSQL.",
    durationMinutes: 20,
    feeINR: 28000,
    startingPriceINR: 28000,
    introductoryPriceINR: 28000,
    originalPriceINR: 35000,
    originalFeeINR: 35000,
    standardPriceINR: 35000,
    standardFeeINR: 35000,
    discountPercent: 20,
    category: "Web Applications",
    popular: true,
    idealFor: "Startups, growing teams, agencies, and businesses replacing spreadsheet chaos",
    deliverables: [
      "Relational database architecture designed on PostgreSQL / Neon with Prisma ORM",
      "Secure user authentication (session management, password hashing, and role checks)",
      "Server-side rendered (SSR) reactive UI with Next.js 16 App Router & Tailwind CSS",
      "Interactive data tables with live filtering, multi-field search, and CSV export",
      "RESTful API endpoints / Server Actions with strict input validation via Zod",
      "Production deployment to Vercel/Neon with CI/CD pipeline and 30 days warranty support",
    ],
    whoIsItFor: [
      "Startup founders validating and launching a functional SaaS MVP to paying customers",
      "Growing companies outgrowing spreadsheet sprawl and needing a unified internal operations hub",
      "Service businesses needing secure client portals for project intake, approvals, and deliverable handoffs",
      "Businesses requiring administrative tools with role-based access controls and audit trails",
    ],
    problemsSolved: [
      "No-code builders (Bubble, Airtable) slowing down, hitting data limits, or charging steep monthly per-seat fees",
      "Sensitive company data scattered across unauthenticated spreadsheets without permission guardrails",
      "Manual data entry and repetitive copy-pasting between fragmented software tools",
      "Slow, sluggish legacy software creating friction for your team and prospective customers",
    ],
    includedDeliverables: [
      "Complete custom full-stack web application codebase in type-safe TypeScript",
      "Relational PostgreSQL database schema design with automated migrations (up to 6 core entities)",
      "Authentication and authorization system supporting up to 2 distinct user roles (e.g. Admin and Client)",
      "Executive dashboard interface with responsive high-contrast dark theme",
      "Complete CRUD transactional workflows with field validation and toast notifications",
      "Error boundaries, telemetry logging, and deployment to production cloud infrastructure",
      "30-day post-launch technical warranty covering bug fixes and developer guidance",
    ],
    notIncluded: [
      "Third-party paid cloud infrastructure subscriptions beyond free tier usage (e.g. AWS S3, Neon compute tiers)",
      "Native mobile builds for iOS App Store or Android Google Play (this package provides a fully responsive web app)",
      "Complex multi-tenant enterprise billing architectures with thousands of seats (quoted individually)",
    ],
    benefitsAndOutcomes: [
      "100% intellectual property ownership with zero recurring per-user software licensing overhead",
      "Blazing sub-second page transitions powered by React 19 Server Components",
      "Centralized operational truth that saves your team hours of manual administrative overhead each week",
      "Scalable database architecture designed to handle tens of thousands of records effortlessly",
    ],
    techStack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "PostgreSQL / Neon",
      "Prisma ORM",
      "Tailwind CSS",
      "Zod Validation",
      "Vercel Edge",
    ],
    beforeAfter: [
      {
        before: "Stitching together multiple spreadsheets and brittle Zapier automations that break unpredictably.",
        after: "One unified, lightning-fast web application custom-built for your exact operational workflow.",
      },
      {
        before: "Paying hundreds of dollars monthly in per-seat software licenses with rigid feature limitations.",
        after: "Full ownership of your source code and database with near-zero marginal operational costs.",
      },
    ],
    developmentProcess: [
      {
        step: "01",
        title: "Discovery & Entity Mapping",
        description: "We review your operational workflows, data entities, user roles, and required business logic.",
      },
      {
        step: "02",
        title: "Schema & Architecture Contract",
        description: "We design the relational database schema, permission matrix, and interface wireframes.",
      },
      {
        step: "03",
        title: "Sprint Execution & Backend APIs",
        description: "We build database models, authentication layers, transactional queries, and reactive views.",
      },
      {
        step: "04",
        title: "Testing, Security & Optimization",
        description: "We stress-test queries, sanitize inputs, test role boundaries, and refine responsive views.",
      },
      {
        step: "05",
        title: "Production Deployment & Handover",
        description: "We deploy to cloud infrastructure, configure backups, and walk through administration.",
      },
    ],
    estimatedDelivery: "2 to 4 weeks depending on entity complexity",
    addOns: [
      {
        title: "Stripe / Razorpay Subscriptions",
        priceINR: 8000,
        priceNote: "flat add-on",
        description: "Recurring subscription billing, customer portal, and automated webhook handling.",
      },
      {
        title: "Cloud File Storage (S3 / R2)",
        priceINR: 4000,
        priceNote: "flat add-on",
        description: "Secure presigned uploads and storage for client documents, PDFs, and assets.",
      },
      {
        title: "Audit Logging & Activity History",
        priceINR: 5000,
        priceNote: "flat add-on",
        description: "Track and display who created, edited, or deleted records across your organization.",
      },
    ],
    faqs: [
      {
        question: "What does the ₹28,000 introductory package cover?",
        answer:
          "It covers a focused full-stack custom application or operational portal with authentication, up to 2 user roles, a PostgreSQL database (up to 6 core entities), CRUD views, and responsive dashboard layouts.",
      },
      {
        question: "Do I get full ownership of the codebase and database?",
        answer:
          "Yes, completely. You retain 100% intellectual property ownership of all source code, database migrations, and schema definitions upon final delivery.",
      },
      {
        question: "Can this scale as our team and traffic grow?",
        answer:
          "Yes. Built with Next.js 16 Server Components and serverless PostgreSQL, the platform easily scales to thousands of concurrent transactions without needing architectural rewrites.",
      },
      {
        question: "What hosting environment do you recommend?",
        answer:
          "We typically configure Vercel or Cloudflare for frontend edge rendering, alongside Neon Serverless PostgreSQL, providing sub-millisecond connection pooling and automated daily snapshots.",
      },
      {
        question: "How are complex multi-tenant SaaS platforms priced?",
        answer:
          "Larger platforms requiring dozens of models, complex multi-tenant isolation, or enterprise compliance are scoped transparently through our discovery session with milestone-based quotes.",
      },
    ],
    relatedServiceSlugs: [
      "booking-management-systems",
      "backend-apis-integrations",
      "business-websites-landing-pages",
    ],
  },
  {
    id: "booking-management-systems",
    slug: "booking-management-systems",
    title: "Booking & Management Systems",
    tagline: "Automated reservation and appointment management systems with live availability and confirmation workflows.",
    description:
      "Purpose-built appointment and booking systems for service professionals, clinics, consultants, salons, and studios. Eliminate back-and-forth scheduling with real-time calendar availability, intake forms, automated confirmations, and booking management.",
    durationMinutes: 20,
    feeINR: 20000,
    startingPriceINR: 20000,
    introductoryPriceINR: 20000,
    originalPriceINR: 25000,
    originalFeeINR: 25000,
    standardPriceINR: 25000,
    standardFeeINR: 25000,
    discountPercent: 20,
    category: "Web Applications",
    popular: false,
    idealFor: "Consultants, clinics, salons, coaches, tutors, and appointment-based businesses",
    deliverables: [
      "Interactive appointment booking wizard with timezone-aware time slot calculation",
      "Atomic database locking (concurrency-safe: zero double-bookings or overlapping slots)",
      "Client intake brief capture collecting contact details and agenda notes",
      "Instant confirmation screen with one-click Google Calendar sync and .ics download",
      "Admin appointments management dashboard to review, filter, and track upcoming bookings",
      "Cryptographically signed private client management / cancellation links",
    ],
    whoIsItFor: [
      "Medical clinics, wellness studios, therapists, and legal practitioners needing organized scheduling",
      "Consultants, coaches, and financial advisors booking paid or introductory strategy sessions",
      "Salons and creative studios managing client slots across working hours",
      "Businesses seeking to replace recurring per-seat fees from tools like Calendly or Acuity",
    ],
    problemsSolved: [
      "Exchanging 5+ emails or WhatsApp messages just to align on an open meeting time",
      "Accidental double-bookings and scheduling conflicts from manual calendar tracking",
      "Clients attending calls unprepared because intake questions were not captured upfront",
      "Recurring monthly SaaS bills that increase every time you add a team member or calendar",
    ],
    includedDeliverables: [
      "Complete custom booking wizard and backend availability engine",
      "Configurable availability rules engine (working hours, weekdays, and buffer intervals)",
      "Concurrency-safe appointment booking transactional endpoints",
      "Cryptographic client token generator for self-service cancellation/rescheduling",
      "Admin appointment management table with status filtering (Confirmed, Pending, Cancelled)",
      "Production deployment and 30 days of post-launch technical support",
    ],
    notIncluded: [
      "Third-party SMS gateway delivery fees (e.g. Twilio / MSG91 per-SMS charges paid directly to provider)",
      "Complex multi-location enterprise staff rota scheduling (available as a custom scope expansion)",
    ],
    benefitsAndOutcomes: [
      "Zero calendar friction: clients book instantly when their buying intent is highest",
      "Complete elimination of scheduling race conditions and double-booked commitments",
      "Direct ownership of your customer scheduling records without ongoing subscription fees",
      "Structured client intake details captured before every consultation call begins",
    ],
    techStack: [
      "Next.js 16",
      "React 19",
      "PostgreSQL",
      "Prisma ORM",
      "Tailwind CSS",
      "Advisory Locking",
      "Calendar Engine",
    ],
    beforeAfter: [
      {
        before: "Wasting hours weekly in email back-and-forth asking 'does Tuesday at 3 PM work for you?'.",
        after: "Sharing one polished link where clients choose an authentic open slot in 30 seconds.",
      },
      {
        before: "Paying expensive monthly subscriptions per team member to third-party booking tools.",
        after: "Self-hosted custom booking system that lives natively on your own domain with zero ongoing per-seat fees.",
      },
    ],
    developmentProcess: [
      {
        step: "01",
        title: "Availability & Intake Discovery",
        description: "We determine your operating hours, session durations, buffer times, and intake questions.",
      },
      {
        step: "02",
        title: "Rules & Database Setup",
        description: "We set up availability rules, timezone resolution logic, and appointment models.",
      },
      {
        step: "03",
        title: "Wizard & Concurrency Locking",
        description: "We code the booking wizard, reactive calendar strip, and atomic transactional lock checks.",
      },
      {
        step: "04",
        title: "Admin Management & Notifications",
        description: "We build the administrative appointments screen, confirmation views, and calendar sync.",
      },
      {
        step: "05",
        title: "Testing & Deployment",
        description: "We simulate concurrent bookings, verify timezone edge cases, and deploy live to your domain.",
      },
    ],
    estimatedDelivery: "1 to 2 weeks",
    addOns: [
      {
        title: "Upfront Payment Integration",
        priceINR: 6000,
        priceNote: "flat add-on",
        description: "Require full or partial fee payment via Razorpay / Stripe before slot is locked.",
      },
      {
        title: "Multi-Staff Assignment",
        priceINR: 6000,
        priceNote: "flat add-on",
        description: "Allow clients to pick specific team members or auto-assign by round-robin.",
      },
      {
        title: "WhatsApp Notification Webhook",
        priceINR: 4500,
        priceNote: "flat add-on",
        description: "Trigger automated booking confirmations and reminder pings via WhatsApp Business API.",
      },
    ],
    faqs: [
      {
        question: "How does the system prevent double-bookings?",
        answer:
          "We enforce atomic database transactions and locking mechanisms (e.g. pg_advisory_xact_lock in PostgreSQL) so that if two clients attempt to confirm the same slot simultaneously, the second attempt is safely prevented.",
      },
      {
        question: "Can clients manage or cancel their own bookings?",
        answer:
          "Yes. Each confirmed appointment generates a cryptographically signed private URL where clients can review their session details or request cancellation within your designated notice window.",
      },
      {
        question: "Can I adjust my available working hours and buffer times?",
        answer:
          "Yes. Your operating hours per weekday, session lengths, and buffer intervals between calls are fully configurable in the availability rules.",
      },
      {
        question: "Are there any monthly per-booking fees?",
        answer:
          "No. Unlike third-party SaaS scheduling platforms, you own the application and database with zero recurring platform commission or per-appointment charges.",
      },
      {
        question: "Can payments be collected before the appointment is confirmed?",
        answer:
          "Yes, upfront payment gateway collection (supporting UPI, cards, and netbanking via Razorpay or Stripe) can be integrated as an optional add-on.",
      },
    ],
    relatedServiceSlugs: [
      "custom-web-apps-dashboards",
      "business-websites-landing-pages",
      "ai-chatbots-automation",
    ],
  },
  {
    id: "ai-chatbots-automation",
    slug: "ai-chatbots-automation",
    title: "AI Chatbots & Business Automation",
    tagline: "Intelligent website chatbots, lead qualification assistants, and custom LLM workflow automation.",
    description:
      "Deploy custom AI assistants grounded in your business documentation, service catalog, and customer FAQs. We build conversational concierge widgets and automated data pipelines powered by Google Gemini, OpenAI, and LangChain to capture leads and handle repetitive inquiries 24/7.",
    durationMinutes: 20,
    feeINR: 14400,
    startingPriceINR: 14400,
    introductoryPriceINR: 14400,
    originalPriceINR: 18000,
    originalFeeINR: 18000,
    standardPriceINR: 18000,
    standardFeeINR: 18000,
    discountPercent: 20,
    category: "AI & Automation",
    popular: false,
    idealFor: "Businesses wanting 24/7 lead qualification, automated FAQ answering, and smart workflows",
    deliverables: [
      "Custom conversational AI widget embedded on your website with streaming UI and dark theme",
      "Grounded knowledge base compiled from your verified services, FAQs, and business rules",
      "Strict system guardrails and prompt engineering to prevent hallucinations and off-topic queries",
      "Automated lead capture extracting visitor contact info and project requirements in conversational flow",
      "Function calling tool bridge (e.g. check live availability or prepare discovery bookings)",
      "Admin conversation inspection screen to audit logs and refine assistant instructions",
    ],
    whoIsItFor: [
      "Businesses receiving repeated inquiries about pricing, availability, and service inclusions",
      "Agencies and consultancies needing 24/7 lead qualification while team members are offline",
      "Companies with complex product documentation or service catalogs needing fast guidance",
      "Founders wanting to add modern LLM capabilities to their existing web platform",
    ],
    problemsSolved: [
      "Losing qualified prospects who visit late at night when nobody is available to chat",
      "Staff spending hours each day answering identical basic questions about services and pricing",
      "Frustrating rule-based chatbots that irritate users with rigid 'press 1 for sales' loops",
      "Untrained AI models hallucinating incorrect pricing or making up false deliverables",
    ],
    includedDeliverables: [
      "Custom Gemini 1.5/3.8 Flash or OpenAI LLM integration with system prompt architecture",
      "Embeddable website chat widget with responsive layout, typing indicators, and streaming responses",
      "Knowledge base grounding covering up to 25 core service questions, guidelines, and FAQs",
      "Lead extraction pipeline delivering visitor name, email, and requirements to your inbox",
      "Structured function-calling tools to query live availability or initiate booking workflows",
      "30-day prompt tuning warranty to refine responses based on real visitor interactions",
    ],
    notIncluded: [
      "Third-party AI token consumption costs (charged directly by Google Cloud / OpenAI; Gemini Flash offers generous free/low-cost tiers)",
      "Voice telephony / phone call automation (this package provides interactive web chat)",
    ],
    benefitsAndOutcomes: [
      "24/7 automated lead capture that qualifies prospects and collects contact details instantly",
      "Up to 70% reduction in repetitive customer support inquiries",
      "Natural conversational answers tailored precisely to your brand voice and factual offerings",
      "Higher conversion rates from visitors who receive immediate answers to their buying questions",
    ],
    techStack: [
      "Google Gemini 3.8 Flash",
      "@google/genai SDK",
      "Next.js 16",
      "TypeScript",
      "Serverless APIs",
      "Rate Limiting",
    ],
    beforeAfter: [
      {
        before: "Unanswered visitor inquiries bouncing late at night without leaving contact information.",
        after: "Smart conversational AI answering questions factually and capturing qualified leads 24/7.",
      },
      {
        before: "Staff spending 2+ hours daily answering repetitive catalog questions.",
        after: "Automated concierge resolving routine queries instantly with zero human intervention.",
      },
    ],
    developmentProcess: [
      {
        step: "01",
        title: "Knowledge Discovery Session",
        description: "We collect your business FAQs, service boundaries, pricing rules, and preferred conversational tone.",
      },
      {
        step: "02",
        title: "Prompt Engineering & Guardrails",
        description: "We configure grounded system instructions, hallucination guardrails, and lead extraction triggers.",
      },
      {
        step: "03",
        title: "Widget & Streaming Backend",
        description: "We build the streaming chat interface, API endpoints, rate limiting, and session history management.",
      },
      {
        step: "04",
        title: "Accuracy Testing & Benchmarking",
        description: "We test challenging questions, boundary tests, and verify lead alert delivery.",
      },
      {
        step: "05",
        title: "Live Embedding & Tuning",
        description: "We embed the widget on your site and monitor initial conversations to polish response precision.",
      },
    ],
    estimatedDelivery: "1 to 2 weeks",
    addOns: [
      {
        title: "Vector Database RAG Engine",
        priceINR: 7000,
        priceNote: "flat add-on",
        description: "Retrieval-Augmented Generation for hundreds of PDF manuals, docs, or knowledge bases.",
      },
      {
        title: "CRM Sync Integration",
        priceINR: 4000,
        priceNote: "flat add-on",
        description: "Automatically push qualified leads into HubSpot, Notion, or Airtable.",
      },
      {
        title: "Multi-Language Auto-Response",
        priceINR: 3500,
        priceNote: "flat add-on",
        description: "Instruct model to detect and respond in Hindi, Spanish, or other international languages.",
      },
    ],
    faqs: [
      {
        question: "How do you prevent the AI from making up false information or hallucinating?",
        answer:
          "We implement strict retrieval grounding and negative prompt constraints: the model is explicitly instructed to only answer from your verified knowledge base and politely refer unlisted questions to your team.",
      },
      {
        question: "How much do third-party AI model tokens cost?",
        answer:
          "With modern models like Gemini 3.8 Flash, costs are exceptionally low (often fractions of a rupee per thousand tokens), and Google provides a generous free tier for standard query volumes.",
      },
      {
        question: "Can the AI assistant capture visitor contact information?",
        answer:
          "Yes. When a prospect expresses interest in a service or project, the assistant naturally asks for their name and email/phone, then delivers the lead details directly to your inbox.",
      },
      {
        question: "Can I customize the chat widget's appearance?",
        answer:
          "Yes. The widget is fully customized to match your website's branding, color palette, logo, and light/dark mode aesthetic.",
      },
      {
        question: "Does the chatbot work reliably on mobile devices?",
        answer:
          "Yes. The chat drawer is 100% responsive and touch-optimized with smooth slide-in animations across smartphones and tablets.",
      },
    ],
    relatedServiceSlugs: [
      "business-websites-landing-pages",
      "custom-web-apps-dashboards",
      "booking-management-systems",
    ],
  },
  {
    id: "ecommerce-payment-integration",
    slug: "ecommerce-payment-integration",
    title: "E-commerce & Payment Integration",
    tagline: "Direct-to-consumer online stores, product catalogs, and frictionless Indian & international checkout.",
    description:
      "Fast, custom e-commerce storefronts engineered to showcase your catalog, calculate orders, and process payments without monthly platform sales commissions. Integrates Razorpay, Cashfree, UPI, or Stripe with order tracking and receipts.",
    durationMinutes: 20,
    feeINR: 20000,
    startingPriceINR: 20000,
    introductoryPriceINR: 20000,
    originalPriceINR: 25000,
    originalFeeINR: 25000,
    standardPriceINR: 25000,
    standardFeeINR: 25000,
    discountPercent: 20,
    category: "E-commerce",
    popular: false,
    idealFor: "Direct-to-consumer brands, retail shops, authors, and creators selling products",
    deliverables: [
      "Responsive product catalog with categories, search, and variant selectors (sizes/colors)",
      "Product detail pages with high-res image galleries, stock badges, and specifications",
      "Interactive shopping cart with dynamic subtotal calculation and coupon code support",
      "Streamlined checkout flow collecting customer shipping & billing details",
      "Payment gateway integration (Razorpay, Cashfree, Stripe, or direct UPI)",
      "Automated customer order confirmation email and WhatsApp purchase alerts",
      "Admin order management dashboard to track purchases, review statuses, and fulfill orders",
    ],
    whoIsItFor: [
      "Retail shops and D2C brands looking to sell directly without marketplace commission cuts",
      "Creators and authors selling physical merchandise, books, or digital downloads",
      "Businesses moving away from high-fee platforms like Shopify or WooCommerce",
      "Indian businesses needing seamless 1-click UPI and QR checkout that converts mobile shoppers",
    ],
    problemsSolved: [
      "Paying 2% marketplace cuts plus heavy monthly Shopify app subscriptions",
      "Complex, multi-step checkout processes causing 70%+ mobile cart abandonment",
      "Payment gateway failures and lack of native UPI / QR checkout in foreign site builders",
      "Slow product page load times frustrating smartphone shoppers",
    ],
    includedDeliverables: [
      "Full Next.js 16 e-commerce storefront frontend & transactional backend APIs",
      "Product catalog supporting up to 50 initial product entries and variant options",
      "Razorpay / Cashfree / Stripe payment gateway integration with secure webhook verification",
      "Admin order management table to inspect purchases and update fulfillment status",
      "Transactional order confirmation email receipts and admin notification triggers",
      "30-day warranty for technical support and bug fixes",
    ],
    notIncluded: [
      "Payment gateway merchant account transaction fees (typically ~2% charged directly by Razorpay/Stripe)",
      "Product photography and commercial stock image licenses (provided by client)",
      "Third-party courier logistics API automation (Shiprocket / Delhivery available as an add-on)",
    ],
    benefitsAndOutcomes: [
      "Zero monthly platform sales commission—keep 100% of your retail margin",
      "Frictionless 1-click UPI and QR checkout that converts Indian mobile shoppers effortlessly",
      "Full ownership of customer contact emails, phone numbers, and purchasing history",
      "Sub-second catalog browsing powered by modern Next.js edge caching",
    ],
    techStack: [
      "Next.js 16",
      "Razorpay / Stripe",
      "PostgreSQL",
      "Prisma ORM",
      "Tailwind CSS",
      "Transactional Email",
    ],
    beforeAfter: [
      {
        before: "Paying ₹3,000+ monthly in Shopify app subscriptions plus transaction cuts.",
        after: "Custom high-speed store on your domain with zero monthly builder fees and direct payouts.",
      },
      {
        before: "Clunky checkout resulting in high cart drop-offs on mobile devices.",
        after: "Instant 2-step checkout with UPI, cards, and netbanking closing sales in seconds.",
      },
    ],
    developmentProcess: [
      {
        step: "01",
        title: "Catalog & Payment Discovery",
        description: "We review your product catalog, variant matrix, shipping zones, and payment accounts.",
      },
      {
        step: "02",
        title: "Data Modeling & Cart Logic",
        description: "We set up product schemas, variant selectors, inventory flags, and cart calculation logic.",
      },
      {
        step: "03",
        title: "Gateway & Webhook Integration",
        description: "We connect Razorpay/Cashfree/Stripe with secure webhook signature verification.",
      },
      {
        step: "04",
        title: "Testing Real Transactions",
        description: "We test sandbox and real payments, verify order emails, and audit mobile checkout UX.",
      },
      {
        step: "05",
        title: "Go-Live & Fulfillment Walkthrough",
        description: "We launch the live store and demonstrate how to manage products and orders in the admin view.",
      },
    ],
    estimatedDelivery: "1 to 3 weeks",
    addOns: [
      {
        title: "Shipping Aggregator API (Shiprocket)",
        priceINR: 6000,
        priceNote: "flat add-on",
        description: "Automated waybill generation, shipping label printing, and tracking updates.",
      },
      {
        title: "WhatsApp Order Alerts",
        priceINR: 4000,
        priceNote: "flat add-on",
        description: "Send automated WhatsApp purchase confirmations and tracking links to customers.",
      },
      {
        title: "Bulk CSV Catalog Import Tool",
        priceINR: 3500,
        priceNote: "flat add-on",
        description: "Import or update hundreds of products from a single spreadsheet file.",
      },
    ],
    faqs: [
      {
        question: "Which payment gateways do you support?",
        answer:
          "We natively integrate Razorpay, Cashfree, PayU, and Stripe, supporting Google Pay, PhonePe, Paytm, all UPI apps, credit/debit cards, and Net Banking.",
      },
      {
        question: "Are there any recurring sales commissions on my store revenue?",
        answer:
          "No. Unlike Shopify, there are zero monthly platform commissions. You only pay standard merchant transaction processing fees directly to Razorpay or Stripe.",
      },
      {
        question: "Can I manage products, inventory, and orders myself?",
        answer:
          "Yes! We provide an intuitive administrative dashboard where you can add new items, update pricing and stock, and inspect customer orders with one click.",
      },
      {
        question: "Can this system handle digital downloads or e-books?",
        answer:
          "Yes. We can configure automated secure download links dispatched to customer emails immediately upon verified payment.",
      },
      {
        question: "Who owns my customer data?",
        answer:
          "You own 100% of your customer records, emails, phone numbers, and purchase history stored in your private database.",
      },
    ],
    relatedServiceSlugs: [
      "business-websites-landing-pages",
      "custom-web-apps-dashboards",
      "backend-apis-integrations",
    ],
  },
  {
    id: "backend-apis-integrations",
    slug: "backend-apis-integrations",
    title: "Backend, APIs & Third-Party Integrations",
    tagline: "Robust RESTful APIs, database architectures, authentication layers, and reliable third-party webhook integrations.",
    description:
      "Focused server-side engineering and API integration for existing websites and applications. We build secure REST endpoints, PostgreSQL schemas, webhook pipelines, authentication systems, and third-party service connections (payment gateways, CRMs, email, cloud storage).",
    durationMinutes: 20,
    feeINR: 9600,
    startingPriceINR: 9600,
    introductoryPriceINR: 9600,
    originalPriceINR: 12000,
    originalFeeINR: 12000,
    standardPriceINR: 12000,
    standardFeeINR: 12000,
    discountPercent: 20,
    category: "Backend & APIs",
    popular: false,
    idealFor: "Frontend developers, agencies, and businesses needing dependable server-side architecture",
    deliverables: [
      "Type-safe RESTful API endpoints or Server Actions with strict Zod validation",
      "Relational database schema design on PostgreSQL with Prisma ORM and migrations",
      "Secure webhook listener with cryptographic signature verification and idempotent handling",
      "Integration with third-party APIs (payment gateways, transactional email, CRMs, cloud storage)",
      "Endpoint rate limiting, error boundaries, and telemetry logging",
      "Clear technical API documentation with request/response schemas and curl examples",
    ],
    whoIsItFor: [
      "Frontend teams needing a specialized backend engineer to build reliable database queries and APIs",
      "Businesses needing to connect their website to external systems (HubSpot, Notion, Google Sheets, or CRMs)",
      "Companies processing asynchronous webhooks from payment gateways or external SaaS platforms",
      "Teams migrating legacy SQL setups to modern serverless PostgreSQL architecture",
    ],
    problemsSolved: [
      "Frontend applications unable to persist data securely due to lack of a structured backend",
      "Webhooks failing silently, dropping customer transactions or duplicating entries",
      "Security vulnerabilities and exposed secret keys in makeshift serverless scripts",
      "Slow, unindexed database queries causing API timeouts and sluggish user experience",
    ],
    includedDeliverables: [
      "Up to 5 custom API endpoints or webhook event handlers with input sanitization",
      "Relational database schema setup (PostgreSQL / Neon / Supabase) with automated migrations",
      "API authentication (API keys, JWT, or session verification)",
      "Telemetry logging, structured error handling, and rate limiting",
      "Deployment to serverless edge or Node.js environment with environment variable management",
      "14 days of post-deployment monitoring and bug resolution",
    ],
    notIncluded: [
      "Frontend user interface redesign (this package focuses purely on server-side backend logic)",
      "Third-party API consumption billing or vendor subscription fees",
    ],
    benefitsAndOutcomes: [
      "Rock-solid data integrity with zero lost webhooks or corrupted records",
      "Strict type safety and input validation preventing SQL injections and invalid payloads",
      "Sub-50ms API response times powered by connection-pooled serverless PostgreSQL",
      "Clean, modular backend architecture that your frontend team can integrate effortlessly",
    ],
    techStack: [
      "Node.js",
      "TypeScript",
      "PostgreSQL",
      "Prisma ORM",
      "RESTful APIs",
      "Zod Validation",
      "Cryptographic HMAC",
    ],
    beforeAfter: [
      {
        before: "Brittle backend scripts failing silently without error logging or signature checks.",
        after: "Production-grade API endpoints with cryptographic webhook verification and comprehensive logging.",
      },
      {
        before: "Frontend directly exposing sensitive third-party API credentials in client-side code.",
        after: "Secure server-side proxy architecture keeping all secrets encrypted and inaccessible to visitors.",
      },
    ],
    developmentProcess: [
      {
        step: "01",
        title: "API Contract & Schema Discovery",
        description: "We define endpoint specifications, payload schemas, and authentication requirements.",
      },
      {
        step: "02",
        title: "Schema & Validation Architecture",
        description: "We configure PostgreSQL relational models, migrations, and strict Zod validation schemas.",
      },
      {
        step: "03",
        title: "Endpoint & Webhook Engineering",
        description: "We code server actions, API handlers, third-party clients, and signature verification logic.",
      },
      {
        step: "04",
        title: "Integration & Edge Case Testing",
        description: "We test rate limits, malformed payloads, retry policies, and transactional rollbacks.",
      },
      {
        step: "05",
        title: "Cloud Deployment & Handover",
        description: "We deploy to your serverless environment and provide full documentation with curl examples.",
      },
    ],
    estimatedDelivery: "4 to 7 business days",
    addOns: [
      {
        title: "Background Job Queue (Redis/Inngest)",
        priceINR: 5000,
        priceNote: "flat add-on",
        description: "Asynchronous background queue for heavy tasks, report generation, or scheduled batch jobs.",
      },
      {
        title: "Granular Role Permissions Engine",
        priceINR: 4000,
        priceNote: "flat add-on",
        description: "Multi-tier RBAC system with fine-grained endpoint authorization checks.",
      },
      {
        title: "Custom Cron Job Scheduler",
        priceINR: 3000,
        priceNote: "flat add-on",
        description: "Automated recurring cron triggers for daily reconciliation or data syncing.",
      },
    ],
    faqs: [
      {
        question: "Can you integrate APIs into our existing website?",
        answer:
          "Yes. As long as your existing stack supports HTTP requests or Next.js/Node.js, we can integrate new API endpoints and webhook listeners seamlessly.",
      },
      {
        question: "How do you handle security and sensitive API keys?",
        answer:
          "All credentials and secret keys are stored exclusively in server-side environment variables. We enforce rate limiting and cryptographic HMAC signature verification on all incoming webhooks.",
      },
      {
        question: "Which database platforms do you support?",
        answer:
          "Our primary specialty is PostgreSQL (via Neon, Supabase, or AWS RDS) with Prisma ORM, but we also support SQLite and MongoDB for lighter workloads.",
      },
      {
        question: "What documentation do you provide for our frontend team?",
        answer:
          "You receive clear API documentation including request/response JSON schemas, error codes, authentication headers, and Postman/curl test examples.",
      },
      {
        question: "How do you protect endpoints against spam or DDoS?",
        answer:
          "We implement token-bucket or sliding-window rate limiters per IP address or user token to ensure endpoints cannot be abused by runaway scripts or attacks.",
      },
    ],
    relatedServiceSlugs: [
      "custom-web-apps-dashboards",
      "ecommerce-payment-integration",
      "ai-chatbots-automation",
    ],
  },
  {
    id: "website-fixes-redesign-optimization",
    slug: "website-fixes-redesign-optimization",
    title: "Website Fixes, Redesign & Optimization",
    tagline: "Visual modernization, responsive mobile fixes, sub-second speed optimization, and technical SEO repair.",
    description:
      "Rapid diagnosis and resolution for underperforming websites. We repair broken layouts, eliminate mobile usability glitches, optimize Core Web Vitals to achieve green Lighthouse scores, and modernize outdated visual aesthetics while protecting your existing content and search ranking.",
    durationMinutes: 20,
    feeINR: 6400,
    startingPriceINR: 6400,
    introductoryPriceINR: 6400,
    originalPriceINR: 8000,
    originalFeeINR: 8000,
    standardPriceINR: 8000,
    standardFeeINR: 8000,
    discountPercent: 20,
    category: "Design & Optimization",
    popular: false,
    idealFor: "Businesses with aging sites that load slowly, look dated, or fail to convert visitors",
    deliverables: [
      "Comprehensive performance and UX audit identifying site bottlenecks and console errors",
      "Core Web Vitals overhaul (LCP, FID, CLS scores optimized into the green 90+ zone)",
      "Mobile responsiveness audit and repair of touch targets, text scaling, and viewport overflow",
      "Visual modernization with high-contrast executive aesthetic and improved typography hierarchy",
      "Clean URL structure preservation with 301 redirects to safeguard existing Google rankings",
      "Image optimization pipeline (WebP conversion, responsive sizing, and zero render-blocking scripts)",
    ],
    whoIsItFor: [
      "Established businesses whose current website looks like it was designed a decade ago",
      "Sites penalized by Google because of sluggish mobile load times and failed Core Web Vitals",
      "Companies embarrassed when sending links to high-ticket clients due to visual misalignment",
      "Website owners facing specific broken layouts, failing forms, or mobile navigation bugs",
    ],
    problemsSolved: [
      "Losing qualified prospects because the site takes 5+ seconds to open on mobile connections",
      "Navigation menus or buttons overflowing off-screen on modern smartphones",
      "Broken contact forms or script errors preventing prospective clients from reaching out",
      "Outdated design aesthetic diminishing client trust and perceived service value",
    ],
    includedDeliverables: [
      "Detailed diagnostic report inspecting site health, Lighthouse metrics, and mobile bugs",
      "Resolution of up to 3 defined functional bugs, layout glitches, or performance bottlenecks",
      "Asset optimization overhaul (WebP/AVIF images, font subsetting, script deferral)",
      "Visual styling modernization for primary client-facing sections",
      "Cross-browser and multi-device verification before and after optimization",
      "14-day post-fix guarantee for all applied improvements",
    ],
    notIncluded: [
      "Complete ground-up multi-page rebuild from scratch (available under Business Websites)",
      "Brand-new company logo creation or commercial legal copywriting",
    ],
    benefitsAndOutcomes: [
      "Page load speeds cut by 50%–70%, keeping mobile visitors engaged instead of bouncing",
      "Immediate lift in Google search ranking and mobile usability compliance",
      "Modern executive presentation that builds instant trust with prospective clients",
      "Elimination of annoying visual and form errors that cost you customer inquiries",
    ],
    techStack: [
      "Core Web Vitals",
      "Next.js / HTML5",
      "Lighthouse 90+",
      "Tailwind CSS",
      "Asset Compression",
      "Technical SEO",
    ],
    beforeAfter: [
      {
        before: "Dated, cluttered site loading in 5.8s with failing red Lighthouse scores.",
        after: "Refreshed, high-contrast experience loading in under 1 second with 95+ green Lighthouse scores.",
      },
      {
        before: "Broken mobile navigation causing frustrated visitors to immediately exit.",
        after: "Fluid, touch-optimized mobile experience designed for effortless reading and inquiry.",
      },
    ],
    developmentProcess: [
      {
        step: "01",
        title: "20-Min Audit & Discovery",
        description: "We inspect your current website, traffic drop-offs, console errors, and optimization goals.",
      },
      {
        step: "02",
        title: "Prioritized Action Plan",
        description: "We benchmark baseline metrics and present a targeted list of fixes and modernization items.",
      },
      {
        step: "03",
        title: "Code, Media & CSS Refactoring",
        description: "We clean render-blocking code, compress assets, repair mobile breakpoints, and tune styling.",
      },
      {
        step: "04",
        title: "SEO Safety & Speed Verification",
        description: "We verify 301 redirects, test forms, and benchmark speed across real iOS and Android devices.",
      },
      {
        step: "05",
        title: "Safe Go-Live",
        description: "We deploy updates with zero downtime and provide a side-by-side performance comparison report.",
      },
    ],
    estimatedDelivery: "3 to 5 business days",
    addOns: [
      {
        title: "Full WordPress to Next.js Migration",
        priceNote: "Custom scope",
        description: "Rebuild your existing WordPress content into a clean, modern Next.js static architecture.",
      },
      {
        title: "Accessibility (WCAG 2.1 AA) Audit",
        priceINR: 3500,
        priceNote: "flat add-on",
        description: "Audit and fix color contrast, keyboard navigation, and screen reader tags.",
      },
      {
        title: "Structured Data Schema Enhancement",
        priceINR: 3000,
        priceNote: "flat add-on",
        description: "Add rich JSON-LD snippets for Google search cards (Organization, LocalBusiness, FAQ).",
      },
    ],
    faqs: [
      {
        question: "Will optimizing my site harm my current Google search ranking?",
        answer:
          "No! We strictly preserve your URL paths, meta structures, and canonical tags. In fact, improving Core Web Vitals and mobile responsiveness is recognized by Google as a direct ranking boost.",
      },
      {
        question: "Can you fix sites built on WordPress, Shopify, or custom HTML?",
        answer:
          "Yes. We diagnose and optimize standard HTML/CSS/JS, WordPress, and Next.js/React websites.",
      },
      {
        question: "What kind of speed improvement can I realistically expect?",
        answer:
          "While specific results depend on your hosting and third-party scripts, most sites see 50%–70% reductions in load times and substantial jumps into the green Lighthouse zone.",
      },
      {
        question: "What if my site is too broken for a quick fix?",
        answer:
          "If our diagnostic audit reveals that the underlying platform is too compromised, we provide a transparent technical breakdown and credit your consultation toward our full Business Websites package.",
      },
      {
        question: "How does this differ from monthly maintenance?",
        answer:
          "This is a one-time targeted repair and optimization sprint. Website Maintenance & Technical Support provides ongoing proactive monthly monitoring, backups, and regular update hours.",
      },
    ],
    relatedServiceSlugs: [
      "business-websites-landing-pages",
      "website-maintenance-support",
      "custom-web-apps-dashboards",
    ],
  },
  {
    id: "website-maintenance-support",
    slug: "website-maintenance-support",
    title: "Website Maintenance & Technical Support",
    tagline: "Proactive monthly website health, security updates, uptime monitoring, and dedicated developer support hours.",
    description:
      "Reliable technical support and peace of mind for business websites. Includes scheduled health checks, database backups, dependency and security updates, uptime monitoring, and a defined monthly allocation of developer hours for content updates and minor fixes.",
    durationMinutes: 20,
    feeINR: 4000,
    startingPriceINR: 4000,
    introductoryPriceINR: 4000,
    originalPriceINR: 5000,
    originalFeeINR: 5000,
    standardPriceINR: 5000,
    standardFeeINR: 5000,
    discountPercent: 20,
    priceUnit: "/month",
    category: "Maintenance & Support",
    popular: false,
    idealFor: "Businesses requiring reliable monthly technical upkeep, updates, and fast developer response",
    deliverables: [
      "24/7 automated uptime and SSL certificate monitoring with immediate alert triage",
      "Automated weekly or monthly verified database and file backup snapshots",
      "Regular dependency audits, security patching, and vulnerability scans",
      "Defined monthly allocation of 3 hours for content edits, banner swaps, or bug fixes",
      "Priority email and WhatsApp developer communication channel for technical inquiries",
      "Monthly health report summarizing site uptime, performance status, and completed tasks",
    ],
    whoIsItFor: [
      "Business owners who cannot afford website downtime or broken contact forms disrupting inquiries",
      "Companies without an in-house developer needing a dependable, trusted technical partner on call",
      "Growing brands needing regular monthly content, banner, pricing, or team updates",
      "Founders wanting to focus on business growth while an engineer keeps their web stack running smoothly",
    ],
    problemsSolved: [
      "Websites quietly breaking after unmonitored dependency updates or server configuration changes",
      "Scrambling to find an expensive emergency freelancer when a critical contact form or checkout fails",
      "Unpatched security vulnerabilities and lack of verified database backups risking data loss",
      "Small content and pricing edits sitting delayed for weeks due to lack of technical bandwidth",
    ],
    includedDeliverables: [
      "Continuous uptime monitoring with 5-minute interval checks and SSL expiry alerts",
      "Defined 3 hours/month allocation for minor tasks (text changes, image swaps, banner updates, bug fixes)",
      "Routine dependency updates and security vulnerability patching",
      "Automated database backup verification",
      "Direct priority communication via private developer channel (WhatsApp/Email)",
      "Flexible month-to-month agreement: cancel anytime with 15 days advance notice",
    ],
    notIncluded: [
      "Major new feature development or full page redesigns exceeding monthly allocated hours (quoted at discounted retainer rates)",
      "Third-party hosting, domain renewal, and cloud provider usage fees",
    ],
    benefitsAndOutcomes: [
      "Complete peace of mind knowing a dedicated software engineer is monitoring your web stack",
      "Quick turnaround on routine website updates without hiring full-time technical staff",
      "Prevention of costly website downtime and broken customer inquiry pipelines",
      "Regular backups ensuring your business records and content are always recoverable",
    ],
    techStack: [
      "Uptime Monitoring",
      "Automated Backups",
      "Security Audits",
      "Dependency Management",
      "Next.js / Node.js",
      "Direct Support",
    ],
    beforeAfter: [
      {
        before: "Worrying about site downtime or broken forms while dealing with unresponsive freelancers.",
        after: "Direct developer retainer with proactive health monitoring and fast turnaround on updates.",
      },
      {
        before: "Leaving websites unpatched for months until a security exploit or crash occurs.",
        after: "Regular scheduled updates, verified backups, and continuous uptime supervision.",
      },
    ],
    developmentProcess: [
      {
        step: "01",
        title: "Onboarding & Health Audit",
        description: "We review repository access, hosting settings, analytics, and current backup status.",
      },
      {
        step: "02",
        title: "Monitoring & Backup Automation",
        description: "We configure automated uptime pingers, error telemetry, and scheduled backup routines.",
      },
      {
        step: "03",
        title: "Monthly Maintenance Cycles",
        description: "We apply security patches, clean logs, verify forms, and monitor performance health.",
      },
      {
        step: "04",
        title: "On-Demand Request Handling",
        description: "Submit your update requests via chat or email; completed within guaranteed 24–48 hour turnaround.",
      },
      {
        step: "05",
        title: "Monthly Health Summary",
        description: "You receive a clear monthly report detailing completed work and site uptime metrics.",
      },
    ],
    estimatedDelivery: "Onboarding in 24–48 hours; ongoing monthly support",
    addOns: [
      {
        title: "Additional Developer Hours",
        priceINR: 1200,
        priceNote: "per hour (discounted retainer rate)",
        description: "Add additional hours for larger content updates or custom feature enhancements.",
      },
      {
        title: "Emergency 2-Hour SLA Response",
        priceINR: 3000,
        priceNote: "per month",
        description: "Guaranteed urgent investigation within 2 hours for mission-critical web platforms.",
      },
      {
        title: "Multi-Website Retainer",
        priceNote: "20% bundle discount",
        description: "Consolidate multiple brand websites under a single shared monthly maintenance plan.",
      },
    ],
    faqs: [
      {
        question: "What tasks are covered under the 3 monthly developer hours?",
        answer:
          "You can use your hours for any routine website tasks: updating photos, changing pricing, adding testimonials, editing layout sections, troubleshooting email delivery, or testing forms.",
      },
      {
        question: "What happens if I don't use all 3 hours in a given month?",
        answer:
          "To ensure developer availability, hours do not roll over indefinitely, but up to 1 unused hour can be carried forward into the following consecutive month.",
      },
      {
        question: "Is there any long-term contract or lock-in?",
        answer:
          "No. Our maintenance service operates on a flexible month-to-month retainer. You can cancel at any time with 15 days advance notice before your next billing cycle.",
      },
      {
        question: "How quickly do you respond if my website goes down?",
        answer:
          "Retainer clients receive priority triage. Urgent outages and broken form/checkout issues are acknowledged and investigated within 2–4 hours during business hours.",
      },
      {
        question: "What if I need a major new feature or complete page redesign?",
        answer:
          "Any scope exceeding your monthly allowance is scoped transparently beforehand and billed at our discounted client retainer rate of ₹1,200/hour, or quoted as a fixed milestone.",
      },
    ],
    relatedServiceSlugs: [
      "website-fixes-redesign-optimization",
      "business-websites-landing-pages",
      "custom-web-apps-dashboards",
    ],
  },
];

// Comprehensive backward-compatibility alias map for legacy URLs and database seeds
export const SLUG_ALIASES: Record<string, string> = {
  // Legacy aliases for Business Websites & Landing Pages
  "landing-page": "business-websites-landing-pages",
  "landing-page-development": "business-websites-landing-pages",
  "portfolio-website": "business-websites-landing-pages",
  "business-website-development": "business-websites-landing-pages",

  // Legacy aliases for Custom Web Applications & Dashboards
  "custom-web-app": "custom-web-apps-dashboards",
  "custom-web-applications": "custom-web-apps-dashboards",

  // Legacy aliases for Booking & Management Systems
  "booking-website": "booking-management-systems",

  // Legacy aliases for AI Chatbots & Business Automation
  "ai-integration": "ai-chatbots-automation",

  // Legacy aliases for E-commerce & Payment Integration
  "ecommerce-store": "ecommerce-payment-integration",
  "ecommerce-development": "ecommerce-payment-integration",

  // Legacy aliases for Backend, APIs & Third-Party Integrations
  "backend-api-development": "backend-apis-integrations",
  "backend-apis": "backend-apis-integrations",

  // Legacy aliases for Website Fixes, Redesign & Optimization
  "website-redesign": "website-fixes-redesign-optimization",
  "website-redesign-modernization": "website-fixes-redesign-optimization",
  "speed-seo-optimization": "website-fixes-redesign-optimization",
  "custom-feature-bug-fix": "website-fixes-redesign-optimization",

  // Legacy aliases for Website Maintenance & Technical Support
  "bug-fixes-maintenance": "website-maintenance-support",
  "website-maintenance": "website-maintenance-support",
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
