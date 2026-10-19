/**
 * Slotly Brand & Architectural Design System Constants
 * "Your time, intentionally spent."
 */

export const BRAND = {
  name: "Slotly",
  tagline: "Your time, intentionally spent.",
  description:
    "Professional freelance web development services and custom web applications for businesses, startups, local shops, and creators by Hemant Pandey.",
  foundedYear: 2026,
  status: "Active Atelier",
} as const;

export const PALETTE = {
  background: "#171717",
  surface: "#222222",
  surfaceElevated: "#292929",
  accent: "#F0B35A",
  accentHover: "#E2A349",
  accentSubtle: "rgba(240, 179, 90, 0.12)",
  textPrimary: "#F3EEE5",
  textSecondary: "#A7A29A",
  border: "#393633",
  borderSubtle: "#292724",
} as const;

export const NAVIGATION_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/book", label: "Book Session" },
  { href: "/appointments", label: "Appointments" },
  { href: "/about", label: "About" },
] as const;

export const FEATURE_PILLARS = [
  {
    code: "01",
    title: "Direct Developer Partnership",
    description:
      "Work directly with Hemant Pandey. Transparent fixed milestones, direct communication, and zero agency overhead.",
  },
  {
    code: "02",
    title: "8 Practical Web Services",
    description:
      "From ₹2,999 landing pages to full-scale e-commerce and booking platforms, all tailored to client goals with fixed upfront pricing.",
  },
  {
    code: "03",
    title: "Production-Grade Engineering",
    description:
      "Built with Next.js, React, Tailwind CSS, and PostgreSQL. 100% responsive, SEO-ready, with complete source code ownership.",
  },
] as const;
