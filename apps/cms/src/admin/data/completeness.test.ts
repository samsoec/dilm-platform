import { describe, expect, it } from "vitest";

import {
  type CompletenessInput,
  type CompletenessPath,
  completenessFromValues,
  launchItems,
  optionalSummaries,
  SETTINGS_TABS,
  settingsCompleteness,
  settingsNeedAttention,
} from "./completeness";
import { settingsTabStates } from "./settingsTabs";

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
    .filter(({ complete, severity }) => !complete && severity !== "optional")
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
      total: 1,
      complete: false,
      missing: [{ label: "recruiter email", path: "recruiterEmail" }],
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

describe("completeness from form values", () => {
  const form: Record<string, unknown> = {
    siteName: "Situs",
    contactEmail: "",
    contactPhone: "+62 21 555",
    recruiterEmail: "",
    "brand.logoOnDark": { id: 1, filename: "dark.png" },
    "brand.logoOnLight": 2,
    "brand.legalName": "PT Dunia Kimia Utama",
    "defaultSeo.title": "",
  };

  it("reads upload values as ids and empty strings as missing", () => {
    expect(
      incomplete(
        completenessFromValues((path: CompletenessPath) => form[path]),
      ),
    ).toEqual(["careers", "seo"]);
  });

  it("checks localized fields in the default locale when given", () => {
    expect(
      incomplete(
        completenessFromValues((path: CompletenessPath) => form[path], {
          siteName: "",
          "defaultSeo.title": "Dunia Kimia Utama",
        }),
      ),
    ).toEqual(["general", "careers"]);
  });
});

describe("settings tab states (FR-UI-46)", () => {
  it("follows the tab order, with Social always optional", () => {
    expect(
      settingsTabStates(
        settingsCompleteness({
          ...COMPLETE,
          recruiterEmail: null,
          siteName: "",
        }),
      ),
    ).toEqual([
      "warning",
      "complete",
      "complete",
      "error",
      "optional",
      "optional",
      "complete",
    ]);
    expect(SETTINGS_TABS.map(({ label }) => label)).toEqual([
      "General",
      "Brand",
      "Contact",
      "Careers",
      "Profile",
      "Social",
      "SEO & analytics",
    ]);
  });
});

describe("company profile completeness (US-ENT-1)", () => {
  const PROFILE = {
    hubLabel: "Chemical hub in Sumatra",
    shortDescription: "Makes industrial acids.",
    coverImage: 4,
    regions: [{ name: "All Sumatra" }],
    mapPin: { x: 0, y: 42 },
    mapLocation: { latitude: -6.2, longitude: 106.8 },
    googleMapsUrl: "https://maps.google.com/?q=dil",
  };

  function profile(settings: CompletenessInput["profile"]) {
    return optionalSummaries(
      settingsCompleteness({ ...COMPLETE, profile: settings }),
    ).find(({ section }) => section === "profile")!;
  }

  it("counts seven pieces and names what is missing", () => {
    expect(profile(PROFILE)).toMatchObject({ done: 7, total: 7, missing: [] });
    expect(
      profile({
        hubLabel: "Chemical hub in Sumatra",
        shortDescription: "Makes industrial acids.",
        mapLocation: { latitude: -6.2, longitude: 106.8 },
        regions: [],
        mapPin: { x: null, y: null },
      }),
    ).toEqual({
      section: "profile",
      label: "Profile",
      done: 3,
      total: 7,
      missing: ["cover image", "regions", "map pin", "Google Maps link"],
    });
  });

  it("treats a pin at 0 as set but half a pin or location as missing", () => {
    expect(profile({ ...PROFILE, mapPin: { x: 0, y: 0 } }).missing).toEqual([]);
    expect(profile({ ...PROFILE, mapPin: { x: 10, y: null } }).missing).toEqual(
      ["map pin"],
    );
    expect(
      profile({ ...PROFILE, mapLocation: { latitude: 1, longitude: null } })
        .missing,
    ).toEqual(["map location"]);
  });

  it("never blocks launch or raises attention, even when empty", () => {
    expect(
      settingsCompleteness({ ...COMPLETE, profile: null }).find(
        ({ section }) => section === "profile",
      ),
    ).toMatchObject({ complete: false, severity: "optional" });
    expect(incomplete({ ...COMPLETE, profile: null })).toEqual([]);
    expect(settingsNeedAttention({ ...COMPLETE, profile: null })).toBe(false);
    expect(
      launchItems(settingsCompleteness({ ...COMPLETE, profile: null })),
    ).toEqual([]);
  });

  it("reads the profile from form values, counting region rows", () => {
    const form: Record<string, unknown> = {
      "profile.hubLabel": "Hub",
      "profile.coverImage": { id: 9 },
      "profile.regions": 2,
      "profile.mapPin.x": 0,
      "profile.mapPin.y": 5,
    };
    const input = completenessFromValues(
      (path: CompletenessPath) => form[path],
    );
    expect(input.profile?.regions).toHaveLength(2);
    expect(optionalSummaries(settingsCompleteness(input))[0]?.missing).toEqual([
      "short description",
      "map location",
      "Google Maps link",
    ]);
  });
});

describe("launch items (T-07)", () => {
  it("names each missing piece, launch-blocking ones first", () => {
    expect(
      launchItems(
        settingsCompleteness({
          ...COMPLETE,
          recruiterEmail: "",
          brand: { ...COMPLETE.brand, logoOnDark: null },
        }),
      ),
    ).toEqual([
      {
        label: "Careers · recruiter email",
        path: "recruiterEmail",
        section: "careers",
        severity: "error",
      },
      {
        label: "Brand · dark logo",
        path: "brand.logoOnDark",
        section: "brand",
        severity: "warning",
      },
    ]);
  });

  it("is empty once everything needed for launch is set", () => {
    expect(launchItems(settingsCompleteness(COMPLETE))).toEqual([]);
  });
});
