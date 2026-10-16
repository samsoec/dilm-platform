import { describe, expect, it } from "vitest";

import { collections } from "../../../collections";
import { tenantScopedCollections } from "../../../tenancy";
import { fieldNames } from "../../../testing";
import type { NavSection } from "../nav/sections";
import {
  documentEntries,
  filterEntries,
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
    (slug, fields) => {
      const names = [
        ...fieldNames(bySlug(slug).fields),
        ...(bySlug(slug).upload ? ["filename"] : []),
      ];
      for (const field of fields) expect(names).toContain(field);
    },
  );
});

describe("searchSources (FR-UI-28)", () => {
  it("lists the searchable collections in a fixed order", () => {
    expect(
      searchSources(collections, readAll, "en").map(({ slug }) => slug),
    ).toEqual(["tenant-settings", "cv-submissions", "ir-documents", "media"]);
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
    expect(cv).toMatchObject({ label: "CV submissions", icon: "badge" });
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

describe("documentEntries", () => {
  const media = searchSources(collections, readAll, "en").find(
    ({ slug }) => slug === "media",
  )!;

  it("titles each hit by its first field and links to its edit view", () => {
    expect(
      documentEntries(
        media,
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
        detail: "Plant at dusk",
        href: "/admin/collections/media/3",
        icon: "photo_library",
      },
      {
        key: "media:4",
        label: "#4",
        detail: undefined,
        href: "/admin/collections/media/4",
        icon: "photo_library",
      },
    ]);
  });
});

describe("jumpEntries (FR-UI-25)", () => {
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
          label: "CV submissions",
          icon: "inbox",
          locked: false,
        },
      ],
    },
  ] satisfies NavSection[];

  it("wraps the nav items in Dashboard and Account", () => {
    expect(
      jumpEntries(sections, "/admin").map(({ label, detail, href }) => [
        label,
        detail,
        href,
      ]),
    ).toEqual([
      ["Dashboard", undefined, "/admin"],
      ["CV submissions", "Inbox", "/admin/collections/cv-submissions"],
      ["Account", undefined, "/admin/account"],
    ]);
  });

  it("filters by every typed word across label and group", () => {
    const entries = jumpEntries(sections, "/admin");
    expect(filterEntries(entries, "inbox cv").map(({ key }) => key)).toEqual([
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
