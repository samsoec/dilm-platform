import { describe, expect, it } from "vitest";

import { collections } from "../../../collections";
import { navGroup } from "../../navGroups";
import {
  entityFromPath,
  entityGroup,
  hasLocalizedFields,
  isAdministration,
  localeHref,
  siteURL,
  withShellCrumbs,
} from "./topbar";

const bySlug = (slug: string) =>
  collections.find((collection) => collection.slug === slug)!;

describe("hasLocalizedFields", () => {
  it("finds localized fields nested in groups, arrays, tabs and blocks", () => {
    const text = { name: "label", type: "text" } as const;
    const localized = { ...text, localized: true } as const;
    expect(hasLocalizedFields([localized])).toBe(true);
    expect(
      hasLocalizedFields([{ name: "g", type: "group", fields: [localized] }]),
    ).toBe(true);
    expect(
      hasLocalizedFields([
        { type: "tabs", tabs: [{ label: "Tab", fields: [localized] }] },
      ]),
    ).toBe(true);
    expect(
      hasLocalizedFields([
        {
          name: "b",
          type: "blocks",
          blocks: [{ slug: "block", fields: [localized] }],
        },
      ]),
    ).toBe(true);
    expect(
      hasLocalizedFields([
        { name: "a", type: "array", fields: [text] },
        { ...text, localized: false },
      ]),
    ).toBe(false);
  });

  it.each(["header", "footer", "tenant-settings"])(
    "treats %s as localized content",
    (slug) => {
      expect(hasLocalizedFields(bySlug(slug).fields)).toBe(true);
    },
  );

  it.each(["users", "tenants", "cv-submissions", "consent-logs"])(
    "treats %s as not localized",
    (slug) => {
      expect(hasLocalizedFields(bySlug(slug).fields)).toBe(false);
    },
  );
});

describe("entityFromPath", () => {
  it.each([
    ["/admin/collections/header/3", { type: "collections", slug: "header" }],
    [
      "/admin/collections/cv-submissions",
      { type: "collections", slug: "cv-submissions" },
    ],
    ["/admin/globals/site/api", { type: "globals", slug: "site" }],
  ])("reads %s", (pathname, entity) => {
    expect(entityFromPath(pathname, "/admin")).toEqual(entity);
  });

  it.each([
    "/admin",
    "/admin/account",
    "/admin/collections",
    "/other/collections/header",
  ])("finds no entity on %s", (pathname) => {
    expect(entityFromPath(pathname, "/admin")).toBeUndefined();
  });

  it("handles an admin route mounted at the root", () => {
    expect(entityFromPath("/collections/users", "/")).toEqual({
      type: "collections",
      slug: "users",
    });
  });
});

describe("entityGroup", () => {
  const config = { collections, globals: [] };

  it("names the nav group of the open collection", () => {
    expect(
      entityGroup(config, { type: "collections", slug: "cv-submissions" }),
    ).toBe(navGroup("inbox"));
  });

  it("marks users and tenants as Administration screens", () => {
    for (const slug of ["users", "tenants"]) {
      expect(
        isAdministration(entityGroup(config, { type: "collections", slug })),
      ).toBe(true);
    }
    expect(
      isAdministration(
        entityGroup(config, { type: "collections", slug: "header" }),
      ),
    ).toBe(false);
    expect(isAdministration(undefined)).toBe(false);
  });
});

describe("withShellCrumbs", () => {
  const view = [{ label: "CV submissions", url: "/admin/collections/cv" }];

  it("puts the tenant and group ahead of the view's crumbs", () => {
    const crumbs = withShellCrumbs(view, ["Dunia Kimia Utama", "Inbox"]);
    expect(crumbs.map(({ label }) => label)).toEqual([
      "Dunia Kimia Utama",
      "Inbox",
      "CV submissions",
    ]);
    expect(crumbs[2]).toBe(view[0]);
  });

  it("returns the same array once the shell crumbs are in place", () => {
    const crumbs = withShellCrumbs(view, ["Dunia Kimia Utama", "Inbox"]);
    expect(withShellCrumbs(crumbs, ["Dunia Kimia Utama", "Inbox"])).toBe(
      crumbs,
    );
  });

  it("replaces the shell crumbs when the tenant changes", () => {
    const before = withShellCrumbs(view, ["Dunia Kimia Utama", "Inbox"]);
    const after = withShellCrumbs(before, ["Likutelaga"]);
    expect(after.map(({ label }) => label)).toEqual([
      "Likutelaga",
      "CV submissions",
    ]);
  });

  it("does not mistake a view crumb with the same label for a shell crumb", () => {
    const own = [{ label: "Inbox" }];
    expect(withShellCrumbs(own, ["Inbox"]).map(({ label }) => label)).toEqual([
      "Inbox",
      "Inbox",
    ]);
  });

  it("gives the dashboard just the tenant", () => {
    expect(
      withShellCrumbs([], ["Dunia Kimia Utama"]).map(({ label }) => label),
    ).toEqual(["Dunia Kimia Utama"]);
  });
});

describe("localeHref", () => {
  it("swaps the locale and keeps the other query parameters", () => {
    const href = localeHref(
      "/admin/collections/header/3",
      "locale=en&depth=1",
      "id",
    );
    const url = new URL(href, "https://cms.example");
    expect(url.pathname).toBe("/admin/collections/header/3");
    expect(url.searchParams.get("locale")).toBe("id");
    expect(url.searchParams.get("depth")).toBe("1");
  });

  it("adds the locale when there is no query string", () => {
    expect(localeHref("/admin/collections/header/3", "", "en")).toBe(
      "/admin/collections/header/3?locale=en",
    );
  });
});

describe("siteURL", () => {
  it("opens the tenant's domain in the content locale", () => {
    expect(siteURL("duniakimia.com", "id")).toBe("https://duniakimia.com/id/");
  });

  it("tolerates a scheme or trailing slash in the stored domain", () => {
    expect(siteURL(" https://likutelaga.com/ ", "en")).toBe(
      "https://likutelaga.com/en/",
    );
  });
});
