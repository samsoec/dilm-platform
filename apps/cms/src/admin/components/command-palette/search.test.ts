import { describe, expect, it } from "vitest";

import { collections } from "../../../collections";
import { tenantScopedCollections } from "../../../tenancy";
import { fieldNames } from "../../../testing";
import type { NavSection } from "../nav/sections";
import {
  companyCode,
  documentEntries,
  filterEntries,
  highlight,
  isPaletteShortcut,
  jumpEntries,
  SEARCH_FIELDS,
  searchSources,
  searchURL,
  shortcutLabel,
} from "./search";

const bySlug = (slug: string) =>
  collections.find((collection) => collection.slug === slug)!;

const readAll = () => true;

describe("SEARCH_FIELDS (FR-UI-26, FR-UI-28)", () => {
  it.each(Object.keys(SEARCH_FIELDS))(
    "%s is tenant-scoped, so a tenant filter always applies",
    (slug) => {
      expect(Object.keys(tenantScopedCollections(collections) ?? {})).toContain(
        slug,
      );
    },
  );

  it.each(Object.entries(SEARCH_FIELDS))(
    "%s searches fields it really has",
    (slug, { match, extra = [] }) => {
      const names = [
        ...fieldNames(bySlug(slug).fields),
        ...(bySlug(slug).upload ? ["filename"] : []),
      ];
      for (const field of [...match, ...extra]) expect(names).toContain(field);
    },
  );
});

describe("searchSources (FR-UI-28)", () => {
  it("lists the searchable collections in a fixed order", () => {
    expect(
      searchSources(collections, readAll, "en").map(({ slug }) => slug),
    ).toEqual(["cv-submissions", "ir-documents", "media", "tenant-settings"]);
  });

  it("leaves out collections the user can't read", () => {
    const slugs = searchSources(
      collections,
      (slug) => slug !== "cv-submissions",
      "en",
    ).map(({ slug }) => slug);
    expect(slugs).not.toContain("cv-submissions");
    expect(slugs).toContain("ir-documents");
  });

  it("leaves out collections missing from the config", () => {
    expect(
      searchSources([bySlug("media")], readAll, "en").map(({ slug }) => slug),
    ).toEqual(["media"]);
  });

  it("labels each source with its plural label and nav icon", () => {
    const cv = searchSources(collections, readAll, "en").find(
      ({ slug }) => slug === "cv-submissions",
    );
    expect(cv).toMatchObject({ label: "Career applications", icon: "badge" });
  });
});

describe("searchURL (FR-UI-26)", () => {
  const media = searchSources(collections, readAll, "en").find(
    ({ slug }) => slug === "media",
  )!;

  it("asks for five title-only documents of the selected tenant", () => {
    const url = new URL(
      searchURL({
        apiURL: "https://cms.example/api/",
        source: media,
        query: "plant tour",
        tenant: 7,
        locale: "id",
      }),
    );
    const params = Object.fromEntries(url.searchParams);

    expect(url.pathname).toBe("/api/media");
    expect(params).toEqual({
      depth: "0",
      limit: "5",
      pagination: "false",
      locale: "id",
      "select[filename]": "true",
      "select[alt]": "true",
      "where[and][0][tenant][equals]": "7",
      "where[and][1][or][0][filename][like]": "plant tour",
      "where[and][1][or][1][alt][like]": "plant tour",
    });
  });
});

describe("documentEntries (S-02)", () => {
  const sources = searchSources(collections, readAll, "en");
  const source = (slug: string) => sources.find((s) => s.slug === slug)!;

  it("shows media by file name with its alt text", () => {
    expect(
      documentEntries(
        source("media"),
        [
          { id: 3, filename: "plant.jpg", alt: "Plant at dusk" },
          { id: 4, filename: "", alt: "" },
        ],
        "/admin",
      ),
    ).toEqual([
      {
        key: "media:3",
        label: "plant.jpg",
        detail: 'alt: "Plant at dusk"',
        href: "/admin/collections/media/3",
        icon: "photo_library",
        thumbnail: true,
      },
      {
        key: "media:4",
        label: "#4",
        href: "/admin/collections/media/4",
        icon: "photo_library",
        thumbnail: true,
      },
    ]);
  });

  it("gives IR documents their language and a published chip", () => {
    expect(
      documentEntries(
        source("ir-documents"),
        [{ id: 5, title: "Annual Report 2025", locale: "en" }],
        "/admin",
      ),
    ).toEqual([
      {
        key: "ir-documents:5",
        label: "Annual Report 2025",
        href: "/admin/collections/ir-documents/5",
        icon: "picture_as_pdf",
        locale: "en",
        published: true,
      },
    ]);
  });

  it("shows applicants by name only", () => {
    expect(source("cv-submissions").fields).toEqual({
      match: ["applicantName"],
    });
    expect(
      documentEntries(
        source("cv-submissions"),
        [{ id: 9, applicantName: "Rani Saputra" }],
        "/admin",
      )[0],
    ).toEqual({
      key: "cv-submissions:9",
      label: "Rani Saputra",
      href: "/admin/collections/cv-submissions/9",
      icon: "badge",
    });
  });
});

describe("highlight (S-02)", () => {
  it("marks every typed word, case-insensitively", () => {
    expect(highlight("cover-annual-2025.jpg", "ANNUAL")).toEqual([
      { text: "cover-", match: false },
      { text: "annual", match: true },
      { text: "-2025.jpg", match: false },
    ]);
    expect(highlight("Annual Report", "report annual")).toEqual([
      { text: "Annual", match: true },
      { text: " ", match: false },
      { text: "Report", match: true },
    ]);
    expect(highlight("Annual", "")).toEqual([{ text: "Annual", match: false }]);
  });
});

describe("jumpEntries (S-01, FR-UI-25)", () => {
  const sections = [
    {
      key: "inbox",
      label: "Inbox",
      icon: "inbox",
      superAdminOnly: false,
      items: [
        {
          slug: "cv-submissions",
          href: "/admin/collections/cv-submissions",
          label: "Career applications",
          icon: "badge",
          locked: false,
        },
      ],
    },
    {
      key: "administration",
      label: "Administration",
      icon: "admin_panel_settings",
      superAdminOnly: true,
      items: [
        {
          slug: "users",
          href: "/admin/collections/users",
          label: "Users",
          icon: "group",
          locked: false,
        },
      ],
    },
  ] satisfies NavSection[];

  it("wraps the nav items in Dashboard and My account, tagging Super Admin items", () => {
    expect(
      jumpEntries(sections, "/admin").map(({ label, href, superAdmin }) => [
        label,
        href,
        superAdmin,
      ]),
    ).toEqual([
      ["Dashboard", "/admin", undefined],
      ["Career applications", "/admin/collections/cv-submissions", undefined],
      ["Users", "/admin/collections/users", true],
      ["My account", "/admin/account", undefined],
    ]);
  });

  it("filters by every typed word", () => {
    const entries = jumpEntries(sections, "/admin");
    expect(filterEntries(entries, "career app").map(({ key }) => key)).toEqual([
      "cv-submissions",
    ]);
    expect(filterEntries(entries, "  ")).toBe(entries);
    expect(filterEntries(entries, "pages")).toEqual([]);
  });
});

describe("palette shortcut (FR-UI-24)", () => {
  const key = (overrides: Partial<Parameters<typeof isPaletteShortcut>[0]>) =>
    isPaletteShortcut({
      key: "k",
      metaKey: false,
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
      ...overrides,
    });

  it("opens on ⌘K or Ctrl+K only", () => {
    expect(key({ metaKey: true })).toBe(true);
    expect(key({ ctrlKey: true, key: "K" })).toBe(true);
    expect(key({})).toBe(false);
    expect(key({ metaKey: true, shiftKey: true })).toBe(false);
    expect(key({ ctrlKey: true, key: "j" })).toBe(false);
  });

  it("shows the platform's modifier", () => {
    expect(shortcutLabel("MacIntel")).toBe("⌘K");
    expect(shortcutLabel("Win32")).toBe("Ctrl K");
  });
});

describe("companyCode (S-02)", () => {
  it("abbreviates the company for the scope tag", () => {
    expect(companyCode("Dunia Kimia Utama")).toBe("DKU");
    expect(companyCode("Indonesian Acids Industry")).toBe("IAI");
    expect(companyCode("Liku Telaga")).toBe("LT");
  });
});
