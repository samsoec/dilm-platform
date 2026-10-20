import type { Field } from "payload";
import { describe, expect, it } from "vitest";

import {
  type AttentionInput,
  attentionItems,
  countTranslations,
  footerSummary,
  greeting,
  headerSummary,
  percent,
  relativeDay,
  savedLine,
} from "./model";

const now = new Date("2026-10-20T01:00:00.000Z");

describe("greeting (Asia/Jakarta)", () => {
  it("follows the time of day in WIB", () => {
    expect(greeting("Rani Saputra", now)).toBe("Good morning, Rani");
    expect(greeting("Rani", new Date("2026-10-20T08:00:00.000Z"))).toBe(
      "Good afternoon, Rani",
    );
    expect(greeting(undefined, new Date("2026-10-20T13:00:00.000Z"))).toBe(
      "Good evening",
    );
  });
});

describe("relativeDay", () => {
  it("counts calendar days in WIB", () => {
    expect(relativeDay("2026-10-19T20:00:00.000Z", now)).toBe("today");
    expect(relativeDay("2026-10-18T20:00:00.000Z", now)).toBe("yesterday");
    expect(relativeDay("2026-10-17T01:00:00.000Z", now)).toBe("3 days ago");
    expect(relativeDay("2026-10-11T01:00:00.000Z", now)).toBe("last week");
    expect(relativeDay("2026-09-03T01:00:00.000Z", now)).toBe("3 Sep");
  });
});

describe("countTranslations (FR-UI-35)", () => {
  const fields: Field[] = [
    { name: "label", type: "text", localized: true },
    { name: "slug", type: "text" },
    {
      name: "items",
      type: "array",
      fields: [
        { name: "title", type: "text", localized: true },
        {
          name: "link",
          type: "group",
          fields: [{ name: "label", type: "text", localized: true }],
        },
      ],
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "SEO",
          name: "seo",
          fields: [{ name: "title", type: "textarea", localized: true }],
        },
      ],
    },
  ];

  it("counts a label once its ID exists and differs from EN", () => {
    const doc = {
      label: { en: "Products", id: "Produk" },
      slug: "x",
      items: [
        {
          title: { en: "About", id: "About" },
          link: { label: { en: "More", id: "" } },
        },
        {
          title: { en: "Careers", id: "Karier" },
          link: { label: { en: "", id: "" } },
        },
      ],
      seo: { title: { en: "Chemicals", id: "Kimia" } },
    };
    expect(countTranslations(fields, doc)).toEqual({ translated: 3, total: 5 });
  });

  it("reads 100% when nothing needs translating", () => {
    expect(percent({ translated: 0, total: 0 })).toBe(100);
    expect(percent({ translated: 9, total: 38 })).toBe(23);
    expect(percent({ translated: 38, total: 38 })).toBe(100);
  });
});

const base: AttentionInput = {
  canEdit: true,
  recruiterEmailMissing: true,
  otherLaunchGaps: 0,
  settingsHref: "/admin/collections/tenant-settings/10",
  received: { count: 6, oldest: "2026-10-17T01:00:00.000Z" },
  syncFailed: { count: 1, attempts: 3 },
  untranslated: [
    { label: "Header", count: 15, href: "/h?locale=id" },
    { label: "Footer", count: 0, href: "/f?locale=id" },
  ],
  links: { received: "/cv?received", syncFailed: "/cv?failed" },
};

describe("attentionItems (FR-UI-34)", () => {
  it("lists editor items in severity order with deep links", () => {
    const items = attentionItems(base, now);
    expect(items.map(({ title }) => title)).toEqual([
      "Recruiter email is missing",
      "6 new Career applications",
      "1 application didn't reach the job platform",
      "15 Header labels are still in English on the ID site",
    ]);
    expect(items[0]).toMatchObject({
      action: "Open Company settings",
      href: "/admin/collections/tenant-settings/10?tab=careers",
    });
    expect(items[1].body).toBe(
      'Status "Received" — oldest arrived 3 days ago.',
    );
    expect(items[2].body).toBe(
      "Sync failed after 3 attempts. The applicant was still notified.",
    );
  });

  it("names the day for an application older than a fortnight", () => {
    const items = attentionItems(
      { ...base, received: { count: 2, oldest: "2026-09-23T01:00:00.000Z" } },
      now,
    );
    expect(items[1].body).toBe('Status "Received" — oldest arrived on 23 Sep.');
  });

  it("turns every action into View for viewers (D-03)", () => {
    const items = attentionItems({ ...base, canEdit: false }, now);
    expect(new Set(items.map(({ action }) => action))).toEqual(
      new Set(["View"]),
    );
    expect(items[0].body).toBe("New applications can't notify anyone.");
    expect(items[1]).toMatchObject({
      title: "6 applications still Received",
      body: "Oldest arrived 3 days ago.",
    });
  });

  it("is empty when all is clear (D-01) and never longer than five", () => {
    expect(
      attentionItems(
        {
          ...base,
          recruiterEmailMissing: false,
          received: { count: 0 },
          syncFailed: { count: 0 },
          untranslated: [],
        },
        now,
      ),
    ).toEqual([]);
    const many = {
      ...base,
      otherLaunchGaps: 2,
      untranslated: [
        { label: "Header", count: 1, href: "/h" },
        { label: "Footer", count: 2, href: "/f" },
      ],
    };
    expect(attentionItems(many, now)).toHaveLength(5);
  });
});

describe("site layout lines", () => {
  it("summarises header, footer and the last save", () => {
    expect(
      headerSummary({ navItems: Array(7).fill({}), cta: { enabled: true } }),
    ).toBe("7 menu items · CTA on");
    expect(
      footerSummary({ linkColumns: [{}, {}, {}], partOf: { enabled: false } }),
    ).toBe('3 link columns · "Part of" off');
    expect(savedLine("2026-10-18T01:00:00.000Z", "Rani Saputra", now)).toBe(
      "Saved 2 days ago by Rani",
    );
  });
});
