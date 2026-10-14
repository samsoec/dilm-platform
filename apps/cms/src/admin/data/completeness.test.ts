import { describe, expect, it } from "vitest";

import {
  type CompletenessInput,
  settingsCompleteness,
  settingsNeedAttention,
} from "./completeness";

const COMPLETE: CompletenessInput = {
  siteName: "Dunia Kimia Utama",
  contactEmail: "info@duniakimia.com",
  contactPhone: null,
  recruiterEmail: "hr@duniakimia.com",
  brand: { logoOnDark: 1, logoOnLight: 2, legalName: "PT Dunia Kimia Utama" },
  defaultSeo: { title: "Dunia Kimia Utama" },
};

function incomplete(settings: CompletenessInput | null) {
  return settingsCompleteness(settings)
    .filter(({ complete }) => !complete)
    .map(({ section }) => section);
}

describe("tenant settings completeness (FR-UI-45)", () => {
  it("passes a fully set up tenant, with Social optional", () => {
    expect(incomplete(COMPLETE)).toEqual([]);
    expect(settingsNeedAttention(COMPLETE)).toBe(false);
  });

  it("needs both logos and the legal name for Brand", () => {
    expect(
      incomplete({
        ...COMPLETE,
        brand: { ...COMPLETE.brand, logoOnLight: null },
      }),
    ).toEqual(["brand"]);
    expect(
      incomplete({ ...COMPLETE, brand: { ...COMPLETE.brand, legalName: " " } }),
    ).toEqual(["brand"]);
  });

  it("accepts either an email or a phone for Contact", () => {
    expect(
      incomplete({
        ...COMPLETE,
        contactEmail: null,
        contactPhone: "+62 21 555",
      }),
    ).toEqual([]);
    expect(incomplete({ ...COMPLETE, contactEmail: "" })).toEqual(["contact"]);
  });

  it("flags a missing recruiter email as an error", () => {
    const careers = settingsCompleteness({
      ...COMPLETE,
      recruiterEmail: null,
    }).find(({ section }) => section === "careers");

    expect(careers).toEqual({
      section: "careers",
      severity: "error",
      complete: false,
    });
  });

  it("needs a default SEO title and a site name", () => {
    expect(
      incomplete({ ...COMPLETE, siteName: "", defaultSeo: { title: null } }),
    ).toEqual(["general", "seo"]);
  });

  it("treats a tenant with no settings document as needing attention", () => {
    expect(incomplete(null)).toEqual([
      "general",
      "brand",
      "contact",
      "careers",
      "seo",
    ]);
    expect(settingsNeedAttention(undefined)).toBe(true);
  });
});
