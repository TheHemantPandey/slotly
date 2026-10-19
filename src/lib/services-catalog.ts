import { ServiceDetail } from "./types";

export const FREELANCE_SERVICES: ServiceDetail[] = [
  {
    id: "landing-page-development",
    slug: "landing-page-development",
    title: "Landing Page Development",
    tagline: "High-impact single-page website built for conversions, product launches, and targeted campaigns.",
    description:
      "A fast, modern single-page website engineered to convert visitors into leads or paying customers. Ideal for new businesses, digital product launches, event promotions, or personal brand marketing.",
    durationMinutes: 45,
    feeINR: 2999,
    startingPriceINR: 2999,
    category: "Websites",
    popular: true,
    idealFor: "Campaigns, new businesses, product launches, and personal brands",
    deliverables: [
      "Custom hero section with compelling value proposition & primary CTA",
      "Features, services, and product highlights layout",
      "About section, social proof & credentials display",
      "Functional lead capture / contact form & WhatsApp trigger",
      "100% mobile-responsive layout across all device screens",
      "Basic on-page SEO setup (meta tags, Open Graph, search indexing readiness)",
      "Direct deployment to your domain and hosting",
    ],
    whoIsItFor: [
      "Startups & founders validating a new product idea with a waiting list",
      "Local businesses running Google or Meta ad campaigns",
      "Freelancers, creators, and authors promoting an event, book, or course",
      "Entrepreneurs needing a professional web presence in days, not months",
    ],
    problemsSolved: [
      "Losing ad spend on slow, unoptimized, or confusing templates",
      "Visitors bouncing because the website looks broken on mobile devices",
      "No clear conversion path or way for prospective clients to inquire",
      "Expensive agency quotes that take weeks just to get a single page online",
    ],
    includedDeliverables: [
      "Full single-page website design and clean, production-ready code",
      "Engaging Hero section with headline, subline, and conversion buttons",
      "Service/Product features grid with clean modern iconography",
      "About the company/founder section with credibility points",
      "Contact details, inquiry form with field validation, and social links",
      "Mobile-first responsive design tested across iOS and Android",
      "Basic on-page SEO (Title, Meta Description, Open Graph preview image)",
      "Deployment assistance to Vercel, Netlify, or your existing cPanel/hosting",
    ],
    notIncluded: [
      "Multi-page site architecture (available under Business Website package)",
      "Complex user authentication or custom database backends",
      "Third-party paid domain registration and hosting server subscriptions",
      "Original brand copywriting or paid commercial stock photo licenses",
    ],
    benefitsAndOutcomes: [
      "Fast page load speeds that keep prospective customers engaged",
      "Clear, focused call-to-actions that drive inquiries directly to your email or WhatsApp",
      "Clean visual polish that makes your business look credible from day one",
      "Full ownership of your source code without recurring proprietary platform lock-in",
    ],
    developmentProcess: [
      {
        step: "01",
        title: "Discussion & Discovery",
        description: "We review your business goals, target audience, brand assets, content, and reference inspirations.",
      },
      {
        step: "02",
        title: "Planning & Wireframe",
        description: "We outline the section hierarchy, conversion funnel, and visual styling before code begins.",
      },
      {
        step: "03",
        title: "Development & Coding",
        description: "Your landing page is built using clean, modern web standards with fluid mobile responsiveness.",
      },
      {
        step: "04",
        title: "Testing & Refinement",
        description: "We test form submissions, mobile usability, cross-browser compatibility, and speed scores.",
      },
      {
        step: "05",
        title: "Delivery & Launch",
        description: "We connect your custom domain, run final deployment checks, and hand over the live website.",
      },
    ],
    estimatedDelivery: "2 to 4 working days (estimated based on prompt content and feedback)",
    faqs: [
      {
        question: "Do I need to have my own domain and hosting before starting?",
        answer:
          "Not necessarily. I can guide you through purchasing a domain from reputable registrars (e.g., Namecheap or GoDaddy) and show you how free or affordable modern hosting (like Vercel) can save you money.",
      },
      {
        question: "Can I add more sections or pages later?",
        answer:
          "Yes! The codebase is built modularly, making it straightforward to expand into a multi-page business website or add a blog whenever your business is ready.",
      },
      {
        question: "What happens if I need revisions after delivery?",
        answer:
          "Every project includes a dedicated revision period after initial delivery to adjust copy, layout nuances, colors, and polish any details until you're completely satisfied.",
      },
    ],
    relatedServiceSlugs: [
      "business-website-development",
      "website-redesign",
      "bug-fixes-maintenance",
    ],
  },
  {
    id: "business-website-development",
    slug: "business-website-development",
    title: "Business Website Development",
    tagline: "Professional multi-page website engineered for shops, consultants, clinics, and local enterprises.",
    description:
      "A complete, professional 5-page business website designed to establish trust, showcase your full service catalog, and capture high-intent customer inquiries via form, WhatsApp, and interactive maps.",
    durationMinutes: 60,
    feeINR: 6999,
    startingPriceINR: 6999,
    category: "Websites",
    popular: true,
    idealFor: "Shops, consultants, agencies, clinics, and local businesses",
    deliverables: [
      "Up to 5 custom-designed pages (Home, About, Services, Contact + 1 custom page)",
      "Mobile-responsive layout optimized for fast performance",
      "Functional enquiry form with instant email alerts",
      "1-click WhatsApp chat button for instant lead capture",
      "Interactive Google Maps integration for store or clinic location",
      "On-page SEO fundamentals (meta tags, XML sitemap, clean URL structure)",
      "Production deployment and domain setup",
    ],
    whoIsItFor: [
      "Doctors, dentists, and specialized wellness clinics",
      "Local retail shops, showrooms, and service centers",
      "Consulting practices, chartered accountants, and legal advisors",
      "Real estate agencies, interior designers, and architects",
      "B2B service providers seeking credible corporate presentation",
    ],
    problemsSolved: [
      "Looking unprofessional or illegitimate to prospective clients who search your name",
      "Missing local customers who search on Google Maps for your services",
      "Inability to clearly explain multiple service tiers on social media alone",
      "Dependence on third-party aggregators that take hefty commissions",
    ],
    includedDeliverables: [
      "Up to 5 structured pages: Home, About Us, Services, Contact, plus 1 custom page (e.g., FAQ, Gallery, or Testimonials)",
      "Mobile-first, responsive design tested on smartphones, tablets, and desktops",
      "Interactive Google Maps embed for direct GPS navigation to your premises",
      "Direct WhatsApp contact button for 1-tap customer chat initiation",
      "Contact enquiry form routing leads straight to your corporate or personal email",
      "Clean navigation menu with mobile drawer / hamburger navigation",
      "Essential on-page SEO (meta titles, descriptions, heading hierarchy)",
      "Full live deployment to your custom domain",
    ],
    notIncluded: [
      "Full e-commerce payment gateway with shopping carts (covered in E-commerce package)",
      "Complex user membership portals or multi-tenant database systems",
      "Third-party paid domain names, corporate email hosting, and hosting server costs",
      "Writing large volumes of technical copy or creating proprietary company videos",
    ],
    benefitsAndOutcomes: [
      "An authoritative online presence that turns skeptical visitors into trusted clients",
      "Higher local search visibility so customers near your shop or clinic find you first",
      "Multiple frictionless ways for clients to reach you: WhatsApp, phone, and email forms",
      "Complete autonomy over your company presentation without monthly website builder locks",
    ],
    developmentProcess: [
      {
        step: "01",
        title: "Discussion & Sitemap",
        description: "We define your 5 pages, brand color palette, content assets, and key service offerings.",
      },
      {
        step: "02",
        title: "Planning & Architecture",
        description: "We organize the user journey, contact triggers, map embeds, and responsive layouts.",
      },
      {
        step: "03",
        title: "Development & Integration",
        description: "We code each page with clean modern components, fast assets, and accessible semantic HTML.",
      },
      {
        step: "04",
        title: "Testing & Validation",
        description: "We test form submissions, WhatsApp buttons, map locations, and mobile viewports.",
      },
      {
        step: "05",
        title: "Delivery & Domain Launch",
        description: "We configure DNS records, verify SSL certificate security, and hand over the live business site.",
      },
    ],
    estimatedDelivery: "5 to 8 working days (estimated based on page count and content readiness)",
    faqs: [
      {
        question: "Can I choose which pages are included in the 5 pages?",
        answer:
          "Absolutely. While Home, About, Services, and Contact are recommended, the 5th page can be whatever your business needs most—such as a Photo Gallery, FAQs, Pricing Table, or Case Studies.",
      },
      {
        question: "Can customers contact me directly on WhatsApp?",
        answer:
          "Yes! A floating or embedded WhatsApp button is included, pre-configured with your phone number and an optional greeting message so clients can chat in one tap.",
      },
      {
        question: "Will my website show up on Google?",
        answer:
          "Yes. We configure all foundational on-page SEO—including descriptive meta tags, semantic headings, and clean URL structure—making it straightforward for Google to crawl and index your site.",
      },
    ],
    relatedServiceSlugs: [
      "landing-page-development",
      "booking-website",
      "website-redesign",
    ],
  },
  {
    id: "portfolio-website",
    slug: "portfolio-website",
    title: "Portfolio & Personal Website",
    tagline: "Modern personal brand showcase designed for developers, designers, freelancers, and professionals.",
    description:
      "A sleek, high-contrast personal portfolio website that highlights your skills, projects, experience, and achievements. Built to impress recruiters, prospective clients, and collaborators.",
    durationMinutes: 45,
    feeINR: 3999,
    startingPriceINR: 3999,
    category: "Personal & Brand",
    popular: false,
    idealFor: "Developers, designers, freelancers, students, and professionals",
    deliverables: [
      "Hero introduction with personal branding, headline, and profile visual",
      "Interactive skills, tools, and technical competencies matrix",
      "Curated project showcase with live preview buttons & GitHub/Figma links",
      "Experience, education, and career milestones timeline",
      "One-click downloadable resume/CV link",
      "Responsive contact section with active social profiles (LinkedIn, GitHub, X)",
      "Responsive layout and basic SEO configuration",
    ],
    whoIsItFor: [
      "Software engineers & frontend/backend developers applying for remote or top-tier roles",
      "UI/UX and graphic designers wanting a dedicated stage beyond generic portfolio platforms",
      "Independent freelancers, copywriters, and video editors pitching high-ticket clients",
      "University students and career switchers aiming to stand out in competitive hiring pools",
    ],
    problemsSolved: [
      "Getting overlooked by recruiters because a flat PDF resume doesn't show your real work",
      "Depending entirely on third-party networks (LinkedIn, Behance) that control your reach",
      "Cluttered, slow free portfolio templates that fail on mobile devices",
      "Struggling to showcase live interactive demonstrations of your projects",
    ],
    includedDeliverables: [
      "Executive Hero section with professional title, bio, and profile visual",
      "Categorized skills breakdown (e.g. Languages, Frameworks, Tools, Design)",
      "Project cards with high-res screenshots, tech stack badges, and GitHub / Live demo links",
      "Chronological career & education experience timeline",
      "Direct resume / CV PDF download button",
      "Contact form and linked social icon badges (LinkedIn, GitHub, Twitter/X, Email)",
      "Smooth micro-interactions and dark/light responsive aesthetics",
      "Deployment to a free host like Vercel/GitHub Pages or your personal custom domain",
    ],
    notIncluded: [
      "Complex dynamic blogging CMS with multiple author accounts (available as custom add-on)",
      "Resume writing or interview coaching services",
      "Third-party paid custom domain registration fees",
    ],
    benefitsAndOutcomes: [
      "A permanent, professional digital home under your own name (e.g., yourname.in)",
      "Significant credibility boost when sending proposals to freelance clients or hiring managers",
      "Live interactive demonstrations of your best code and design projects",
      "Clean, modern design that communicates that you take your craft seriously",
    ],
    developmentProcess: [
      {
        step: "01",
        title: "Discussion & Content Gathering",
        description: "We collect your bio, project links, screenshots, resume PDF, and preferred visual aesthetic.",
      },
      {
        step: "02",
        title: "Planning & Curation",
        description: "We curate your 4–8 strongest projects to emphasize the exact roles or clients you want to attract.",
      },
      {
        step: "03",
        title: "Development & Styling",
        description: "We build your portfolio using modern responsive components, crisp typography, and subtle physics.",
      },
      {
        step: "04",
        title: "Testing & Review",
        description: "We verify every outbound link, resume download, mobile viewport, and contact channel.",
      },
      {
        step: "05",
        title: "Delivery & Domain Setup",
        description: "We connect your personal custom domain (or provide a fast live URL) and deliver the source code.",
      },
    ],
    estimatedDelivery: "3 to 5 working days (estimated based on asset and project details readiness)",
    faqs: [
      {
        question: "Can I update my projects and resume later?",
        answer:
          "Yes! The codebase is structured cleanly with modular data files, making it simple to add new projects, update skills, or swap your resume PDF whenever your career progresses.",
      },
      {
        question: "Can I host this for free on Vercel or GitHub Pages?",
        answer:
          "Yes. Modern portfolio sites built with modern frameworks can be hosted at $0/month on platforms like Vercel with automatic SSL and global CDN speeds.",
      },
      {
        question: "Can I connect my own custom domain (e.g., myname.com)?",
        answer:
          "Yes, I will help you connect your custom domain so your portfolio loads directly on your personal web address.",
      },
    ],
    relatedServiceSlugs: [
      "landing-page-development",
      "website-redesign",
      "custom-web-applications",
    ],
  },
  {
    id: "ecommerce-development",
    slug: "ecommerce-development",
    title: "E-commerce Website",
    tagline: "Online storefront for small businesses selling physical or digital products with secure checkout.",
    description:
      "A fast, mobile-friendly online store engineered to display your products, process customer orders, and accept payments via verified Indian payment gateways (Razorpay, Cashfree, UPI, Stripe).",
    durationMinutes: 60,
    feeINR: 14999,
    startingPriceINR: 14999,
    category: "E-commerce",
    popular: true,
    idealFor: "Small businesses, retail shops, and creators selling physical or digital products",
    deliverables: [
      "Product catalog with category navigation and search",
      "Product detail pages with image galleries, variants (sizes/colors), and specs",
      "Interactive shopping cart with real-time subtotal calculation",
      "Streamlined checkout flow with customer shipping & billing collection",
      "Payment gateway integration (Razorpay, Cashfree, Stripe, or direct UPI)",
      "Basic admin dashboard for order inspection and product management",
      "Mobile-friendly product browsing and order confirmation receipts",
    ],
    whoIsItFor: [
      "Small retail shops and boutique brands selling clothing, jewelry, or home decor",
      "Direct-to-consumer (D2C) founders launching their first physical product lines",
      "Digital creators selling templates, graphics, presets, or downloadable files",
      "Local businesses transitioning from Instagram DM sales to automated online orders",
    ],
    problemsSolved: [
      "Wasting hours manually replying to 'price please' DMs and collecting screenshots of UPI payments",
      "Customers abandoning purchases because checkout is slow, complicated, or feels insecure",
      "High monthly commission cuts charged by marketplace platforms",
      "Store looking clunky or broken when shoppers browse on their phones",
    ],
    includedDeliverables: [
      "Full storefront layout: Homepage with featured collections, banners, and bestseller highlights",
      "Product catalog grid with filters, pricing, and stock status",
      "Dedicated product pages with multi-image gallery, descriptions, and variant selection",
      "Slide-out / modal shopping cart with quantity adjustments and discount field",
      "Secure checkout flow with customer address inputs and order summary",
      "Integration with your approved Razorpay, Cashfree, or Stripe merchant account",
      "Automated customer order confirmation email triggers",
      "Simple admin dashboard to view incoming orders and manage inventory",
      "Full mobile optimization for fast shopping on 4G/5G connections",
    ],
    notIncluded: [
      "Third-party payment gateway transaction fees (typically ~2% charged directly by Razorpay/Stripe)",
      "Commercial SMS gateway credits for bulk marketing campaigns",
      "Complex multi-vendor marketplace architecture (like Amazon/Flipkart)",
      "Paid domain, SSL, or hosting server subscription fees",
      "Product photography or bulk inventory data entry beyond the initial seed batch",
    ],
    benefitsAndOutcomes: [
      "Accept payments 24/7 automatically via UPI, credit/debit cards, and netbanking",
      "Build your own customer database and direct brand equity without paying 20-30% marketplace fees",
      "Frictionless mobile checkout experience that minimizes cart abandonment",
      "Streamlined order processing with clean order records and client details",
    ],
    developmentProcess: [
      {
        step: "01",
        title: "Discussion & Product Catalog Review",
        description: "We review your product types, variants, shipping policies, and preferred payment gateways.",
      },
      {
        step: "02",
        title: "Storefront Planning & Flow",
        description: "We map category organization, product page layouts, and the step-by-step checkout funnel.",
      },
      {
        step: "03",
        title: "Development & Gateway Hookup",
        description: "We build the catalog, cart, and integrate the payment gateway API in test mode.",
      },
      {
        step: "04",
        title: "Testing & Live Transactions",
        description: "We test end-to-end purchasing, verify webhooks, test failure states, and mobile responsiveness.",
      },
      {
        step: "05",
        title: "Delivery & Merchant Handover",
        description: "We switch to live payment mode, configure DNS, and train you on managing orders and products.",
      },
    ],
    estimatedDelivery: "10 to 18 working days (estimated based on product count and payment approval)",
    faqs: [
      {
        question: "Which payment gateways can be integrated?",
        answer:
          "I integrate standard, verified Indian and international gateways including Razorpay, Cashfree, Stripe, or standard UPI QR integrations. You will need your own verified merchant account with the provider.",
      },
      {
        question: "Are payment gateway transaction fees included in the starting price?",
        answer:
          "No. Payment gateways (such as Razorpay or Stripe) charge their standard transaction fees (typically ~2% per transaction) directly to your merchant account.",
      },
      {
        question: "Can I sell digital downloadable products (like PDFs or software)?",
        answer:
          "Yes! The e-commerce store can be configured to sell either physical products requiring shipping addresses or instant digital downloads delivered post-payment.",
      },
    ],
    relatedServiceSlugs: [
      "business-website-development",
      "custom-web-applications",
      "website-redesign",
    ],
  },
  {
    id: "booking-website",
    slug: "booking-website",
    title: "Booking & Appointment Website",
    tagline: "Automated reservation system for salons, clinics, consultants, tutors, and service providers.",
    description:
      "A streamlined booking website that eliminates calendar ping-pong. Display your services, present live availability, collect client intake details, and confirm appointments with automated receipts.",
    durationMinutes: 60,
    feeINR: 9999,
    startingPriceINR: 9999,
    category: "Web Applications",
    popular: true,
    idealFor: "Salons, tutors, consultants, clinics, and appointment-based businesses",
    deliverables: [
      "Service catalog with transparent descriptions, durations, and pricing",
      "Interactive calendar with selectable time slots and real-time conflict prevention",
      "Client intake brief capture (name, contact, agenda notes)",
      "Instant appointment confirmation screen with calendar (.ics / Google Calendar) sync",
      "Admin dashboard to view, manage, and track upcoming appointments",
      "Customer details database",
      "Email or WhatsApp notification hooks (where credentials are provided)",
    ],
    whoIsItFor: [
      "Beauty salons, spas, and wellness practitioners",
      "Private tutors, language coaches, and educational consultants",
      "Doctors, dietitians, therapists, and healthcare specialists",
      "Independent lawyers, financial planners, and tech consultants",
    ],
    problemsSolved: [
      "Endless phone calls and WhatsApp messages just to find a mutually open 30-minute slot",
      "Accidental double-bookings that embarrass your business and alienate clients",
      "No-shows caused by lack of confirmation receipts or calendar reminders",
      "Paying high monthly subscriptions for rigid third-party booking SaaS platforms",
    ],
    includedDeliverables: [
      "Clean, modern booking website interface matching your brand identity",
      "Service selection screen with transparent pricing, durations, and details",
      "Interactive availability calendar with defined operating hours and days",
      "Client intake form capturing name, corporate or personal email, phone, and requirements",
      "Instant confirmation screen with reference ID and one-click Google Calendar / .ics file export",
      "Admin portal to inspect all booked appointments, view client briefs, and filter schedules",
      "Automated transactional confirmation email alerts to both client and business owner",
      "Mobile-optimized flow that works smoothly on any customer's smartphone",
    ],
    notIncluded: [
      "Mandatory upfront online payment gateway collection (available as an optional add-on)",
      "Complex two-way enterprise sync with external proprietary scheduling engines",
      "Third-party paid SMS gateway message packs",
      "Paid domain and hosting server subscriptions",
    ],
    benefitsAndOutcomes: [
      "Save 5–10 hours every week by automating routine scheduling conversations",
      "Provide clients with a modern, self-serve booking experience available 24/7",
      "Guaranteed conflict-free scheduling with deterministic slot validation",
      "Own your customer data and appointment records directly without third-party fees",
    ],
    developmentProcess: [
      {
        step: "01",
        title: "Discussion & Scheduling Rules",
        description: "We review your service tracks, operating days, session durations, buffer times, and intake questions.",
      },
      {
        step: "02",
        title: "Planning & Workflow Design",
        description: "We map the client booking journey from service selection to confirmation receipt.",
      },
      {
        step: "03",
        title: "Development & Database Setup",
        description: "We build the frontend interface, wire the database schema, and implement schedule logic.",
      },
      {
        step: "04",
        title: "Testing & Conflict Simulation",
        description: "We test concurrent slot bookings, intake form validation, and calendar export files.",
      },
      {
        step: "05",
        title: "Delivery & Operational Handover",
        description: "We deploy the website, configure custom domain settings, and train you on managing appointments.",
      },
    ],
    estimatedDelivery: "7 to 12 working days (estimated based on workflow complexity)",
    faqs: [
      {
        question: "Can I collect payments when a client books an appointment?",
        answer:
          "Yes! Online payment gateway integration (via Razorpay or Stripe) can be added as an optional upgrade so clients must pay a deposit or full consulting fee before their slot is locked.",
      },
      {
        question: "Can I set my own available days and working hours?",
        answer:
          "Yes. Your schedule can be configured for specific days (e.g., Monday through Friday) and specific hours (e.g., 10:00 AM – 6:00 PM IST) with custom session durations.",
      },
      {
        question: "Do customers get a calendar invite?",
        answer:
          "Yes. The confirmation screen provides one-click 'Add to Google Calendar' and downloadable .ics calendar files that automatically add the session to their personal calendar.",
      },
    ],
    relatedServiceSlugs: [
      "business-website-development",
      "landing-page-development",
      "custom-web-applications",
    ],
  },
  {
    id: "website-redesign",
    slug: "website-redesign",
    title: "Website Redesign & Improvement",
    tagline: "Visual, typography, and mobile UX overhaul for outdated, slow, or poorly converting websites.",
    description:
      "Transform an outdated, clunky, or unappealing website into a sleek, executive digital presence. We modernize your layouts, colors, navigation, and mobile responsiveness while safeguarding your existing content.",
    durationMinutes: 45,
    feeINR: 3999,
    startingPriceINR: 3999,
    category: "Design & Optimization",
    popular: false,
    idealFor: "Businesses and individuals with an outdated or underperforming existing website",
    deliverables: [
      "Comprehensive visual hierarchy & mobile UX evaluation of current site",
      "Modernized visual design system (curated typography, palette, card styling)",
      "Mobile layout overhaul for seamless touch usability on modern devices",
      "Navigation restructure to streamline visitor user pathways",
      "Fixing visual inconsistencies, misaligned elements, and broken styling",
      "Preservation of existing business logic, SEO rankings, and backend integrations",
    ],
    whoIsItFor: [
      "Businesses whose websites were built 4–8 years ago and look visibly dated",
      "Websites that pinch and zoom on modern smartphones or break on mobile",
      "Founders who recently refreshed their brand identity and need their site to match",
      "Sites with high bounce rates due to confusing visual hierarchy and poor readability",
    ],
    problemsSolved: [
      "Looking like a legacy company when competitors have sleek modern websites",
      "High mobile bounce rate because buttons are too small or layouts overflow",
      "Cluttered pages that bury your primary value proposition and call-to-action",
      "Slow, bloated templates that frustrate visitors on mobile network connections",
    ],
    includedDeliverables: [
      "Detailed audit of current visual, typography, and mobile bottlenecks",
      "Redesigned modern user interface with cohesive styling, subtle glassmorphism, and modern cards",
      "Typography upgrade using curated fonts (e.g., Inter, Outfit) with calibrated line heights",
      "100% mobile-first overhaul ensuring effortless navigation on all phone screen sizes",
      "Cleaner navigation header with streamlined menus and high-contrast CTA buttons",
      "Retaining your core content, existing URLs, and SEO structure to protect search rankings",
      "Final review and cross-browser quality assurance across Chrome, Safari, and Firefox",
    ],
    notIncluded: [
      "Complete backend database rewrite or full replatforming (available under Custom Web Apps)",
      "Complete corporate rebranding or new logo creation from scratch",
      "Massive multi-page overhauls (base price covers defined scope; multi-page quotes provided upfront)",
      "Purchasing commercial third-party fonts or paid photography licenses",
    ],
    benefitsAndOutcomes: [
      "Instantly elevate your perceived brand value and command higher pricing for your services",
      "Dramatically improve mobile engagement and eliminate layout-related customer drop-offs",
      "Maintain existing SEO value and backlink equity with URL-structure preservation",
      "A fast, modern website you feel proud to share with clients, partners, and investors",
    ],
    developmentProcess: [
      {
        step: "01",
        title: "Discussion & Visual Audit",
        description: "We review your current website, identify specific pain points, and define target aesthetic benchmarks.",
      },
      {
        step: "02",
        title: "Planning & Design System",
        description: "We define modern typography tokens, color harmonies, button styles, and responsive layout structures.",
      },
      {
        step: "03",
        title: "Development & Rebuilding",
        description: "We recode the frontend layouts with modern standards, cleaner CSS, and optimized assets.",
      },
      {
        step: "04",
        title: "Testing & Comparison",
        description: "We test responsive behavior, verify all links and forms, and perform before-and-after quality checks.",
      },
      {
        step: "05",
        title: "Delivery & Live Replacement",
        description: "We deploy the redesigned views with zero disruption to your existing domain or services.",
      },
    ],
    estimatedDelivery: "4 to 7 working days (estimated based on page count and design scope)",
    faqs: [
      {
        question: "Will my website go down while you redesign it?",
        answer:
          "No. The redesign is built and thoroughly tested in a separate development environment. Your live website remains 100% operational until you approve the new design and we perform the swap.",
      },
      {
        question: "Will a redesign hurt my existing Google search rankings?",
        answer:
          "No. We prioritize preserving your existing URL structure, heading semantics, and content so that your search engine visibility is protected and usually improved through faster page speeds.",
      },
      {
        question: "How does the pricing scale for larger websites?",
        answer:
          "The starting price of ₹3,999 covers foundational visual redesign of key pages or single-page sites. Multi-page sites receive a clear, upfront fixed quote based on total page count and functional complexity.",
      },
    ],
    relatedServiceSlugs: [
      "business-website-development",
      "bug-fixes-maintenance",
      "landing-page-development",
    ],
  },
  {
    id: "bug-fixes-maintenance",
    slug: "bug-fixes-maintenance",
    title: "Bug Fixes & Website Maintenance",
    tagline: "Rapid diagnosis and resolution for UI glitches, broken links, and ongoing site health.",
    description:
      "Direct technical troubleshooting for annoying website issues, broken layouts, contact form failures, and routine site upkeep. Starting at ₹999 for defined small tasks, with optional ongoing maintenance starting at ₹1,999/month.",
    durationMinutes: 30,
    feeINR: 999,
    startingPriceINR: 999,
    category: "Maintenance & Support",
    popular: false,
    idealFor: "Website owners facing unexpected technical bugs or needing routine maintenance",
    deliverables: [
      "Targeted diagnosis & fix for up to 1-2 defined minor frontend/UI bugs",
      "Broken link resolution and layout overflow repairs on mobile",
      "Troubleshooting contact form, email notification, or webhook delivery failures",
      "Minor text, image, banner, or pricing updates",
      "Diagnostic summary explaining the root cause and the fix applied",
      "Optional monthly maintenance retainer available starting at ₹1,999/month",
    ],
    whoIsItFor: [
      "Business owners whose website suddenly broke or shows visual glitches after an update",
      "Website managers whose contact forms stopped sending notification emails",
      "Site owners noticing awkward horizontal scrolling or misaligned elements on mobile phones",
      "Teams needing a reliable on-call developer for quick fixes without hiring a full-time engineer",
    ],
    problemsSolved: [
      "Losing potential clients because your contact form quietly stopped delivering submissions",
      "Embarrassing layout breaks on iPhone/Android devices that you don't know how to code",
      "Agencies charging massive minimum retainers just to fix a single CSS alignment issue",
      "Wasting hours searching Stack Overflow instead of focusing on running your business",
    ],
    includedDeliverables: [
      "Rapid code inspection of your repository or live site files",
      "Resolution of defined scope: fixing specific CSS/HTML layout bugs, broken buttons, or alignment errors",
      "Form submission debugging (SMTP credentials, mail API keys, or validation logic)",
      "Cross-browser verification to confirm the fix works on Safari, Chrome, and Firefox",
      "Clear, plain-English summary of what caused the bug and how it was resolved",
      "Optional monthly retainer (₹1,999/month): routine dependency updates, uptime monitoring, security patches, and up to 2 hours of monthly support",
    ],
    notIncluded: [
      "Major full-system architectural rewrites or complete database migrations under the base ₹999 ticket",
      "Server disaster recovery for compromised/hacked hosts without clean existing backups",
      "Developing large new feature sets from scratch (quoted separately)",
      "Third-party software subscription or API usage fees",
    ],
    benefitsAndOutcomes: [
      "Rapid turnaround from an experienced systems engineer who knows modern web architectures",
      "Transparent, fair pricing without hidden diagnostic surprise fees",
      "Peace of mind knowing your forms and customer touchpoints are actively functioning",
      "Clean, documented fixes that don't introduce technical debt or break other pages",
    ],
    developmentProcess: [
      {
        step: "01",
        title: "Discussion & Issue Report",
        description: "You describe the problem with error screenshots, live URLs, and steps to reproduce the issue.",
      },
      {
        step: "02",
        title: "Planning & Diagnosis",
        description: "We inspect the codebase, identify the root cause, and confirm the exact fix scope.",
      },
      {
        step: "03",
        title: "Development & Fix",
        description: "We patch the bug cleanly in code, verifying responsive behavior and edge cases.",
      },
      {
        step: "04",
        title: "Testing & Verification",
        description: "We verify the fix across multiple browsers and test form submissions or interactions.",
      },
      {
        step: "05",
        title: "Delivery & Report",
        description: "We deploy the fix, confirm live operational status, and share a summary report.",
      },
    ],
    estimatedDelivery: "24 to 48 hours for small fixes (estimated based on bug complexity)",
    faqs: [
      {
        question: "What does the base ₹999 price cover?",
        answer:
          "The starting price of ₹999 covers up to 1-2 defined minor issues—such as a broken mobile layout, an unaligned header, a non-working button, or basic contact form troubleshooting. If an issue requires deeper architectural rewrites, I will inspect it first and provide an upfront quote before doing any work.",
      },
      {
        question: "How does the monthly maintenance plan work?",
        answer:
          "Starting at ₹1,999/month, our maintenance retainer includes routine package/dependency updates, uptime monitoring checks, basic security scans, and up to 2 hours of dedicated developer time each month for content updates, minor tweaks, or emergency assistance.",
      },
      {
        question: "What access do you need to fix a bug?",
        answer:
          "Depending on where your site is hosted, I will typically need temporary access to your code repository (GitHub/GitLab) or hosting panel (cPanel, Vercel, Netlify, or FTP). You can revoke access as soon as the fix is verified.",
      },
    ],
    relatedServiceSlugs: [
      "website-redesign",
      "business-website-development",
      "custom-web-applications",
    ],
  },
  {
    id: "custom-web-applications",
    slug: "custom-web-applications",
    title: "Custom Web Application Development",
    tagline: "Bespoke full-stack web applications, internal business tools, portals, and startup MVPs.",
    description:
      "Tailor-made web applications engineered for startups, businesses, and founders. From operational dashboards and customer portals to automated business workflows with secure authentication and database integration.",
    durationMinutes: 60,
    feeINR: 14999,
    startingPriceINR: 14999,
    category: "Web Applications",
    popular: true,
    idealFor: "Startups, growing businesses, and individuals needing custom software tools",
    deliverables: [
      "Full-stack architecture built on Next.js, React, and modern PostgreSQL / SQL",
      "Custom administrative dashboards and operational tooling",
      "User authentication and role-based permissions (admin, staff, client)",
      "Type-safe APIs and database schema with strict validation",
      "Interactive data tables with searching, filtering, and exportable records",
      "Modern, executive UI built with fluid micro-interactions",
      "Clear technical documentation and production deployment",
    ],
    whoIsItFor: [
      "Startups building their core minimum viable product (MVP) to show investors and users",
      "Businesses outgrowing spreadsheets and needing custom internal management portals",
      "Service firms needing a secure client portal for document sharing and updates",
      "Founders wanting bespoke software tailored to their exact operational workflows",
    ],
    problemsSolved: [
      "Frustration with generic off-the-shelf software that doesn't fit your business processes",
      "Chaos from manual data entry across disconnected spreadsheets and WhatsApp chats",
      "Massive quotes from large agencies that take months before showing a working prototype",
      "Fragile no-code tools that break or become prohibitively expensive at scale",
    ],
    includedDeliverables: [
      "Requirement analysis, database entity mapping, and architecture blueprint",
      "Modern full-stack application built with Next.js App Router, React, and PostgreSQL",
      "Authentication system (email/password, magic links, or OAuth) with secure session handling",
      "Role-based access control (e.g., Administrator vs. Standard Client roles)",
      "Database schema with relational integrity and automated migrations",
      "Custom administrative dashboard to view, create, edit, and filter records",
      "Fast, responsive executive interface built with modern dark/light styling",
      "Production deployment to high-availability infrastructure (Vercel, AWS, or VPS)",
    ],
    notIncluded: [
      "Full-scale complex enterprise SaaS systems (e.g., multi-tenant billing, team management, SOC2) for the base starting price",
      "Third-party paid cloud infrastructure subscriptions (AWS, Neon DB, Vercel Pro)",
      "Ongoing third-party API usage costs (OpenAI, Twilio, SendGrid)",
      "Final scope, features, and pricing are defined collaboratively following requirement discovery",
    ],
    benefitsAndOutcomes: [
      "Software that adapts 100% to your unique business workflow, rather than forcing you to adapt to rigid tools",
      "Drastic reduction in manual overhead and operational errors across your team",
      "Full intellectual property ownership of clean, maintainable TypeScript source code",
      "Solid architectural foundation that can easily scale to thousands of users without rewriting",
    ],
    developmentProcess: [
      {
        step: "01",
        title: "Discussion & Requirements Discovery",
        description: "We deep-dive into your workflow, user roles, data entities, business rules, and technical objectives.",
      },
      {
        step: "02",
        title: "Planning & Architecture Spec",
        description: "We design the relational database schema, API contracts, user flows, and wireframes.",
      },
      {
        step: "03",
        title: "Development & Iterative Sprints",
        description: "We build the core data models, backend API endpoints, auth layers, and frontend dashboard views.",
      },
      {
        step: "04",
        title: "Testing & Security Validation",
        description: "We validate authentication safeguards, data isolation, input sanitization, and responsive UX.",
      },
      {
        step: "05",
        title: "Delivery & Deployment",
        description: "We deploy to production cloud infrastructure, configure backups, and provide technical documentation.",
      },
    ],
    estimatedDelivery: "2 to 4 weeks depending on scoped feature set (defined after requirement review)",
    faqs: [
      {
        question: "Does the starting price of ₹14,999 include a full SaaS app?",
        answer:
          "No. The starting price covers a focused, well-defined custom application or internal tool (such as an administrative dashboard or customer intake portal). Complete SaaS applications with multi-tier subscription billing, complex workspaces, and enterprise features require deeper scoping and an upfront custom quote.",
      },
      {
        question: "What tech stack do you build custom applications with?",
        answer:
          "I build with modern, production-grade industry standards: Next.js 16/React 19, TypeScript, PostgreSQL (via Prisma or Neon), Tailwind CSS, and secure serverless APIs. This ensures high speed, security, and developer ergonomics.",
      },
      {
        question: "Do I own the source code?",
        answer:
          "Yes! You retain 100% intellectual property ownership of the codebase and database schema upon completion. No proprietary platform lock-in.",
      },
    ],
    relatedServiceSlugs: [
      "booking-website",
      "ecommerce-development",
      "business-website-development",
    ],
  },
];

export function getServiceBySlug(slug: string): ServiceDetail | undefined {
  return FREELANCE_SERVICES.find((s) => s.slug === slug || s.id === slug);
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
