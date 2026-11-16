import { describe, expect, it } from "vitest";

import {
  changed,
  dialogLanguages,
  dialogSummary,
  dialogTitle,
  urlPattern,
  type RoutingImpact,
} from "./routing";

const impact: RoutingImpact = {
  setting: "careerPage",
  domains: ["duniakimia.com"],
  locales: ["en", "id"],
  current: { title: "Career", paths: { en: "/career", id: "/karir" } },
  next: { title: "Join us", paths: { en: "/join-us", id: "/gabung" } },
  total: 9,
  records: 7,
  redirects: 14,
  overLimit: false,
};

describe("routing dialog copy (RT-02)", () => {
  it("opens with the verbatim title and summary", () => {
    expect(dialogTitle("careerPage")).toBe("Change the Career page?");
    expect(dialogSummary("careerPage", impact)).toBe(
      "7 job URLs on duniakimia.com move from /career to /join-us. 14 redirects are created.",
    );
  });

  it("lists both languages", () => {
    expect(dialogLanguages(impact)).toEqual([
      "English: /career → /join-us",
      "Indonesian: /karir → /gabung",
    ]);
  });

  it("names every site for a shared base", () => {
    const shared: RoutingImpact = {
      ...impact,
      setting: "productsPage",
      domains: ["a.com", "b.com", "c.com"],
      records: 1,
      redirects: 2,
    };
    expect(dialogSummary("productsPage", shared)).toBe(
      "1 product URL on all 3 sites moves from /career to /join-us. 2 redirects are created.",
    );
  });

  it("says plainly when nothing moves or the change is too big", () => {
    expect(dialogSummary("careerPage", { ...impact, records: 0 })).toBe(
      "No job URLs move on duniakimia.com. No redirects are created.",
    );
    expect(
      dialogSummary("careerPage", {
        ...impact,
        overLimit: true,
        message: "Too many.",
      }),
    ).toBe("Too many.");
  });
});

describe("routing helpers", () => {
  it("builds the URL pattern", () => {
    expect(urlPattern("/career")).toBe("/career/{slug}");
    expect(urlPattern("/")).toBe("/{slug}");
    expect(urlPattern(undefined)).toBeUndefined();
  });

  it("compares picker values by id", () => {
    expect(changed(3, { id: 3 })).toBe(false);
    expect(changed(null, "")).toBe(false);
    expect(changed(3, 4)).toBe(true);
    expect(changed(undefined, 4)).toBe(true);
  });
});
