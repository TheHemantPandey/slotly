import { describe, it, expect } from "vitest";
import {
  FREELANCE_SERVICES,
  resolveServiceSlug,
  getServiceBySlug,
  getAllServiceSlugs,
  getRelatedServices,
} from "@/lib/services-catalog";
import { getAvailabilityCalendar } from "@/lib/data";

describe("Services Catalog Pure Functions & Pricing", () => {
  it("contains exactly 8 active services in the catalog", () => {
    expect(FREELANCE_SERVICES.length).toBe(8);
    const slugs = getAllServiceSlugs();
    expect(slugs.length).toBe(8);
  });

  it("calculates exact 20% introductory discount across all 8 services", () => {
    for (const service of FREELANCE_SERVICES) {
      expect(service.discountPercent).toBe(20);
      const expectedIntro = Math.round(service.standardPriceINR * 0.8);
      expect(service.introductoryPriceINR).toBe(expectedIntro);
      expect(service.feeINR).toBe(expectedIntro);
      expect(service.startingPriceINR).toBe(expectedIntro);
      expect(service.standardFeeINR).toBe(service.standardPriceINR);
    }
  });

  describe("resolveServiceSlug", () => {
    it("returns canonical slug unchanged", () => {
      expect(resolveServiceSlug("business-websites-landing-pages")).toBe(
        "business-websites-landing-pages"
      );
      expect(resolveServiceSlug("custom-web-apps-dashboards")).toBe(
        "custom-web-apps-dashboards"
      );
    });

    it("resolves legacy slug aliases to modern service slugs", () => {
      expect(resolveServiceSlug("landing-page")).toBe("business-websites-landing-pages");
      expect(resolveServiceSlug("portfolio-website")).toBe("business-websites-landing-pages");
      expect(resolveServiceSlug("custom-web-app")).toBe("custom-web-apps-dashboards");
      expect(resolveServiceSlug("software-architecture")).toBe("custom-web-apps-dashboards");
      expect(resolveServiceSlug("ai-integration")).toBe("ai-chatbots-automation");
      expect(resolveServiceSlug("ecommerce-store")).toBe("ecommerce-payment-integration");
      expect(resolveServiceSlug("bug-fixes-maintenance")).toBe("website-maintenance-support");
    });
  });

  describe("getServiceBySlug", () => {
    it("finds service by canonical slug", () => {
      const service = getServiceBySlug("ai-chatbots-automation");
      expect(service).toBeDefined();
      expect(service?.title).toBe("AI Chatbots & Business Automation");
      expect(service?.introductoryPriceINR).toBe(14400);
      expect(service?.standardPriceINR).toBe(18000);
    });

    it("finds service using legacy alias", () => {
      const service = getServiceBySlug("landing-page");
      expect(service).toBeDefined();
      expect(service?.slug).toBe("business-websites-landing-pages");
      expect(service?.title).toBe("Business Websites & Landing Pages");
    });

    it("returns undefined for non-existent service", () => {
      const service = getServiceBySlug("non-existent-service-12345");
      expect(service).toBeUndefined();
    });
  });

  describe("getRelatedServices", () => {
    it("returns related services for a valid slug without self-reference", () => {
      const currentSlug = "business-websites-landing-pages";
      const related = getRelatedServices(currentSlug);
      expect(related.length).toBeGreaterThan(0);
      expect(related.length).toBeLessThanOrEqual(3);
      for (const item of related) {
        expect(item.slug).not.toBe(currentSlug);
      }
    });

    it("returns default fallback services for unknown slug", () => {
      const related = getRelatedServices("unknown-slug");
      expect(related.length).toBe(3);
    });
  });

  describe("getAvailabilityCalendar", () => {
    it("generates structured calendar days with slots and valid properties", () => {
      const calendar = getAvailabilityCalendar();
      expect(Array.isArray(calendar)).toBe(true);
      expect(calendar.length).toBeGreaterThan(0);

      for (const day of calendar) {
        expect(day.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(day.slots.length).toBeGreaterThan(0);
        for (const slot of day.slots) {
          expect(slot.id).toBeDefined();
          expect(typeof slot.time).toBe("string");
          expect(typeof slot.displayRange).toBe("string");
          expect(typeof slot.available).toBe("boolean");
        }
      }
    });
  });
});
