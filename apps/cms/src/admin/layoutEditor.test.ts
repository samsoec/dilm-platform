import { describe, expect, it } from "vitest";

import {
  columnMeta,
  countText,
  FOOTER_SECTIONS,
  isSameAsDefault,
  jakartaYear,
  linkTarget,
  navItemMeta,
  navItemTitle,
  renderCopyright,
  rowNumberText,
  savedAtText,
  valueAtPath,
} from "./layoutEditor";

describe("header and footer editor labels (TRD-UI §6.4, §6.5)", () => {
  it("counts rows against maxRows", () => {
    expect(countText("Menu items", 7, 8, false)).toBe("Menu items 7 of 8");
    expect(countText("Link columns", 3, 4, false)).toBe("Link columns 3 of 4");
    expect(countText("Links", 4, 8, true)).toBe("Links 4/8");
  });

  it("summarises nav items like the design", () => {
    const dropdown = {
      type: "dropdown" as const,
      label: "Product & Solutions",
      children: [{}, {}, {}, {}],
    };
    expect(rowNumberText(0)).toBe("01");
    expect(navItemTitle(dropdown)).toBe("Product & Solutions");
    expect(navItemMeta(dropdown)).toEqual(["Dropdown", "4 links"]);

    const single = {
      type: "link" as const,
      link: {
        type: "internal" as const,
        internalPath: "/investor",
        label: "Investor",
      },
    };
    expect(navItemTitle(single)).toBe("Investor");
    expect(navItemMeta(single)).toEqual(["/investor", "Link", "Same tab"]);
  });

  it("shows external targets without the scheme", () => {
    expect(
      linkTarget({
        type: "external",
        externalUrl: "https://dilgroup.co.id/about",
      }),
    ).toBe("dilgroup.co.id/about");
    expect(columnMeta({ links: [{}, {}, {}, {}] }, 8)).toBe("4/8 links");
  });

  it("fills the copyright tokens", () => {
    expect(
      renderCopyright("Hak Cipta © {year} {legalName}.", {
        year: 2026,
        legalName: "PT Dunia Kimia Utama",
      }),
    ).toBe("Hak Cipta © 2026 PT Dunia Kimia Utama.");
    expect(renderCopyright("© {year} {legalName}", { year: 2026 })).toBe(
      "© 2026 {legalName}",
    );
    expect(jakartaYear(new Date("2026-12-31T18:00:00Z"))).toBe(2027);
  });

  it("tags an Indonesian label only when it repeats the English text (FR-UI-42)", () => {
    const en = { navItems: [{ link: { label: "About us" } }] };
    expect(valueAtPath(en, "navItems.0.link.label")).toBe("About us");
    expect(isSameAsDefault("About us", "About us")).toBe(true);
    expect(isSameAsDefault("Tentang kami", "About us")).toBe(false);
    expect(isSameAsDefault("", "")).toBe(false);
    expect(isSameAsDefault(undefined, "About us")).toBe(false);
  });

  it("numbers the footer sections 01 to 04", () => {
    expect(FOOTER_SECTIONS.map(({ number }) => number)).toEqual([
      "01",
      "02",
      "03",
      "04",
    ]);
    expect(savedAtText("2026-10-07T07:22:00.000Z")).toBe("7 Oct, 14:22");
  });
});
