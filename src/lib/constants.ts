/**
 * Slotly Brand & Architectural Design System Constants
 * "Your time, intentionally spent."
 */

export const BRAND = {
  name: "Slotly",
  tagline: "Your time, intentionally spent.",
  description:
    "A bespoke, AI-assisted appointment scheduling platform tailored for high-touch consulting practices and elite technology advisory services.",
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
    title: "Curated Practice Calendars",
    description:
      "Intelligent availability windows tailored to executive consulting cadence, preserving deep work while accommodating high-value client advisory sessions.",
  },
  {
    code: "02",
    title: "Intentional AI Concierge",
    description:
      "A context-aware scheduling intelligence that orchestrates briefs, validates prerequisites, and protects your calendar boundaries through verified server tools.",
  },
  {
    code: "03",
    title: "Sovereign Data Persistence",
    description:
      "Engineered on a dedicated PostgreSQL foundation with strict transactional integrity, real-time availability confirmation, and zero friction booking.",
  },
] as const;
