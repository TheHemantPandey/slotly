import { NextResponse } from "next/server";
import { listActiveServices } from "@/lib/server/services-repository";

export async function GET() {
  try {
    const services = await listActiveServices();

    const formatted = services.map((s) => ({
      id: s.id,
      slug: s.slug,
      title: s.name,
      tagline: s.tagline,
      description: s.description,
      durationMinutes: s.durationMinutes,
      priceInPaise: s.priceInPaise,
      feeINR: Math.round(s.priceInPaise / 100),
      standardFeeINR: Math.round((s.priceInPaise / 100) * 1.25),
      priceUnit: s.id === "website-maintenance-support" ? "/month" : undefined,
      currency: s.currency,
      category: s.category,
      deliverables: s.deliverables,
      idealFor: s.idealFor,
      isActive: s.isActive,
    }));

    return NextResponse.json(
      {
        success: true,
        services: formatted,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120",
        },
      }
    );
  } catch (error) {
    console.error("API /api/services error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve active consulting services." },
      { status: 500 }
    );
  }
}
