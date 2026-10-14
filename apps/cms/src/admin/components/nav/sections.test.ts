import type { SanitizedPermissions } from "payload";
import { describe, expect, it } from "vitest";

import { collections } from "../../../collections";
import {
  CONTENT_GROUP_HINT,
  type CollectionNav,
  navGroup,
} from "../../navGroups";
import {
  buildNavSections,
  isActiveHref,
  isDashboard,
  type NavEntityGroup,
} from "./sections";

const navConfig = (slug: string) =>
  collections.find((collection) => collection.slug === slug)?.custom?.nav as
    CollectionNav | undefined;

function entity(slug: string, label = slug) {
  return { slug, label, type: "collections" as const };
}

const ALL_GROUPS: NavEntityGroup[] = [
  { label: navGroup("admin"), entities: [entity("tenants"), entity("users")] },
  { label: navGroup("settings"), entities: [entity("tenant-settings")] },
  { label: navGroup("media"), entities: [entity("media")] },
  {
    label: navGroup("inbox"),
    entities: [entity("consent-logs"), entity("cv-submissions")],
  },
  { label: navGroup("investor"), entities: [entity("ir-documents")] },
  { label: navGroup("layout"), entities: [entity("footer"), entity("header")] },
];

const full = { create: true, read: true, update: true, fields: {} };
const readOnly = { read: true, fields: {} };

const permissions = {
  canAccessAdmin: true,
  collections: {
    users: full,
    tenants: full,
    "tenant-settings": full,
    media: full,
    "consent-logs": readOnly,
    "cv-submissions": { read: true, update: true, fields: {} },
    "ir-documents": full,
    header: full,
    footer: full,
  },
} as unknown as SanitizedPermissions;

function sections(superAdmin: boolean, groups = ALL_GROUPS) {
  return buildNavSections({
    groups,
    navConfig,
    permissions,
    adminRoute: "/admin",
    superAdmin,
  });
}

describe("buildNavSections (FR-UI-01, FR-UI-04, FR-UI-15)", () => {
  it("follows NAV_GROUPS order, whatever order Payload hands the groups in", () => {
    expect(sections(true).map(({ key }) => key)).toEqual([
      "content",
      "layout",
      "inbox",
      "investor",
      "media",
      "settings",
      "admin",
    ]);
  });

  it("orders items by custom.nav.order and gives each its icon", () => {
    const [, layout, inbox, , , , admin] = sections(true);

    expect(layout.items.map(({ slug, icon }) => [slug, icon])).toEqual([
      ["header", "web_asset"],
      ["footer", "call_to_action"],
    ]);
    expect(inbox.items.map(({ slug }) => slug)).toEqual([
      "cv-submissions",
      "consent-logs",
    ]);
    expect(admin.items.map(({ slug }) => slug)).toEqual(["users", "tenants"]);
  });

  it("links each item to its collection and carries its badge", () => {
    const inbox = sections(true).find(({ key }) => key === "inbox")!;

    expect(inbox.items[0]).toMatchObject({
      href: "/admin/collections/cv-submissions",
      badge: "cv-received",
    });
  });

  it("locks items the user can read but neither create nor update", () => {
    const inbox = sections(true).find(({ key }) => key === "inbox")!;

    expect(inbox.items.map(({ slug, locked }) => [slug, locked])).toEqual([
      ["cv-submissions", false],
      ["consent-logs", true],
    ]);
  });

  it("shows the content hint while Website content is empty", () => {
    expect(sections(true)[0]).toMatchObject({
      key: "content",
      hint: CONTENT_GROUP_HINT,
      items: [],
    });
  });

  it("drops the hint once a collection joins Website content", () => {
    const [content] = sections(true, [
      { label: navGroup("content"), entities: [entity("pages", "Pages")] },
    ]);

    expect(content.hint).toBeUndefined();
    expect(content.items.map(({ label }) => label)).toEqual(["Pages"]);
  });

  it("hides other groups with no visible items", () => {
    const keys = sections(true, [
      { label: navGroup("media"), entities: [entity("media")] },
    ]).map(({ key }) => key);

    expect(keys).toEqual(["content", "media"]);
  });

  it("tags Administration for Super Admins and hides it from everyone else", () => {
    expect(sections(true).at(-1)).toMatchObject({
      key: "admin",
      superAdminOnly: true,
    });
    expect(sections(false).map(({ key }) => key)).not.toContain("admin");
  });

  it("keeps a group missing from NAV_GROUPS at the end rather than losing it", () => {
    const keys = sections(true, [
      { label: "Plugins", entities: [entity("payload-folders")] },
      { label: navGroup("media"), entities: [entity("media")] },
    ]).map(({ key }) => key);

    expect(keys).toEqual(["content", "media", "Plugins"]);
  });
});

describe("active item (FR-UI-19)", () => {
  const href = "/admin/collections/header";

  it("matches list, edit, versions and custom views of the collection", () => {
    for (const path of [
      href,
      `${href}/3`,
      `${href}/3/versions`,
      `${href}/grid`,
    ]) {
      expect(isActiveHref(path, href)).toBe(true);
    }
  });

  it("doesn't match a collection whose slug only starts the same", () => {
    expect(isActiveHref("/admin/collections/header-links", href)).toBe(false);
  });

  it("marks the dashboard only on the admin root", () => {
    expect(isDashboard("/admin", "/admin")).toBe(true);
    expect(isDashboard("/admin/", "/admin")).toBe(true);
    expect(isDashboard("/admin/account", "/admin")).toBe(false);
  });
});
