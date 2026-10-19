import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : undefined) ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ||
  "https://slotly.hemantpandey.in";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  alternates: {
    canonical: "/",
  },
  title: {
    default: "Slotly — Your time, intentionally spent.",
    template: "%s | Slotly",
  },
  description:
    "A bespoke, AI-assisted appointment scheduling platform tailored for high-touch consulting practices and elite technology advisory services.",
  keywords: [
    "executive scheduling",
    "consulting appointments",
    "advisory booking",
    "AI scheduling assistant",
    "time management",
    "Slotly",
  ],
  authors: [{ name: "Slotly Atelier" }],
  creator: "Slotly Atelier",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "Slotly — Your time, intentionally spent.",
    description:
      "A bespoke, AI-assisted appointment scheduling platform for high-touch consulting practices and technology advisory services.",
    type: "website",
    locale: "en_US",
  },
};

export const viewport: Viewport = {
  themeColor: "#04060e",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} dark h-full`}
    >
      <body className="min-h-full flex flex-col bg-[#04060e] text-zinc-100 antialiased selection:bg-indigo-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
