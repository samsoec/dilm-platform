import { describe, expect, it } from "vitest";

import { formatDate, formatNumber, getDictionary, localizedHref } from ".";
import { LOCALES } from "@/tenant/locales";

describe("i18n", () => {
  it("has a dictionary for every locale with the same keys", () => {
    const keys = (value: object): string[] =>
      Object.entries(value).flatMap(([k, v]) =>
        typeof v === "string" ? [k] : keys(v).map((c) => `${k}.${c}`),
      );
    const [first, ...rest] = LOCALES.map((l) => keys(getDictionary(l)).sort());
    for (const other of rest) expect(other).toEqual(first);
  });

  it("builds locale-prefixed hrefs", () => {
    expect(localizedHref("id")).toBe("/id");
    expect(localizedHref("en", "/about/")).toBe("/en/about/");
    expect(localizedHref("en", "about")).toBe("/en/about");
  });

  it("formats numbers and dates per locale", () => {
    expect(formatNumber("id", 1234.5)).toBe("1.234,5");
    expect(formatNumber("en", 1234.5)).toBe("1,234.5");
    expect(
      formatDate("id", Date.UTC(2026, 0, 5), {
        dateStyle: "long",
        timeZone: "UTC",
      }),
    ).toBe("5 Januari 2026");
  });
});
