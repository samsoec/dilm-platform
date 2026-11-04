import type { AccessArgs, SanitizedPermissions } from "payload";
import { describe, expect, it } from "vitest";

import { type Role } from "../../../access";
import { collections, globals } from "../../../collections";
import { redirectsOverrides } from "../../../redirects";
import { testUser } from "../../../testing";
import { ICON_NAMES } from "../../icons";
import { type CollectionNav, navGroup } from "../../navGroups";
import { buildNavSections, type NavEntityGroup } from "./sections";

type Entity = {
  slug: string;
  type: "collections" | "globals";
  label: string;
  access?: Record<string, ((args: AccessArgs) => unknown) | undefined>;
  admin?: { hidden?: boolean | unknown; group?: unknown };
  custom?: Record<string, unknown>;
};

const LABELS: Record<string, string> = {
  "site-routing": "Site routing",
  "site-messages": "Site messages",
  redirects: "Redirects",
  "tenant-settings": "Company settings",
  "detail-templates": "Detail templates",
  "shared-pages": "Shared pages",
  pages: "Pages",
  products: "Products",
  solutions: "Solutions",
  jobs: "Jobs",
  posts: "Posts",
  categories: "Categories",
  documents: "Documents",
};

const entities: Entity[] = [
  ...collections
    .filter(
      ({ slug }) =>
        slug in LABELS ||
        ["shared-detail-templates", "header", "footer"].includes(slug),
    )
    .map((collection) => ({
      ...(collection as unknown as Entity),
      type: "collections" as const,
      label: LABELS[collection.slug] ?? collection.slug,
    })),
  {
    ...(redirectsOverrides as unknown as Entity),
    type: "collections",
    label: LABELS.redirects,
  },
  ...globals.map((global) => ({
    ...(global as unknown as Entity),
    type: "globals" as const,
    label: LABELS[global.slug] ?? global.slug,
  })),
];

const user = (role: Role) => testUser([role], [1]);

function allowed(entity: Entity, key: "create" | "update", role: Role) {
  const rule = entity.access?.[key];
  if (!rule) return true;
  return Boolean(rule({ req: { user: user(role) } } as AccessArgs));
}

function permissionsFor(role: Role): SanitizedPermissions {
  const build = (type: Entity["type"]) =>
    Object.fromEntries(
      entities
        .filter((entity) => entity.type === type)
        .map((entity) => [
          entity.slug,
          {
            read: true,
            create:
              type === "globals" ? undefined : allowed(entity, "create", role),
            update: allowed(entity, "update", role),
            fields: {},
          },
        ]),
    );
  return {
    canAccessAdmin: true,
    collections: build("collections"),
    globals: build("globals"),
  } as unknown as SanitizedPermissions;
}

function sectionsFor(role: Role) {
  const visible = entities.filter(
    (entity) => entity.admin?.hidden !== true && entity.admin?.group,
  );
  const byGroup = new Map<string, NavEntityGroup>();
  for (const { slug, type, label, admin } of visible) {
    const key = admin!.group as string;
    const group = byGroup.get(key) ?? { label: key, entities: [] };
    group.entities.push({ slug, type, label });
    byGroup.set(key, group);
  }
  return buildNavSections({
    groups: [...byGroup.values()],
    navConfig: (slug) =>
      entities.find((entity) => entity.slug === slug)?.custom?.nav as
        CollectionNav | undefined,
    permissions: permissionsFor(role),
    adminRoute: "/admin",
    superAdmin: role === "super-admin",
  });
}

function section(role: Role, key: string) {
  return sectionsFor(role).find((candidate) => candidate.key === key)!;
}

const summary = (role: Role, key: string) =>
  section(role, key).items.map(({ label, icon, locked }) => [
    label,
    icon,
    locked,
  ]);

describe("Website content group (4a)", () => {
  it("lists the nine modules in design order with the 4a icons", () => {
    expect(
      section("super-admin", "content").items.map(({ label, icon }) => [
        label,
        icon,
      ]),
    ).toEqual([
      ["Pages", "account_tree"],
      ["Shared pages", "public"],
      ["Detail templates", "dashboard_customize"],
      ["Products", "science"],
      ["Solutions", "lightbulb"],
      ["Jobs", "work"],
      ["Posts", "newspaper"],
      ["Categories", "sell"],
      ["Documents", "picture_as_pdf"],
    ]);
  });

  it("locks Shared pages and Categories below Super Admin only", () => {
    const locked = (role: Role) =>
      section(role, "content")
        .items.filter((item) => item.locked)
        .map(({ label }) => label);

    expect(locked("super-admin")).toEqual([]);
    expect(locked("tenant-editor")).toEqual(["Shared pages", "Categories"]);
  });

  it("locks every item for a Tenant Viewer", () => {
    expect(
      section("tenant-viewer", "content").items.every(({ locked }) => locked),
    ).toBe(true);
  });

  it("reaches shared detail templates through Detail templates, not a second entry", () => {
    const labels = sectionsFor("super-admin").flatMap(({ items }) =>
      items.map(({ slug }) => slug),
    );

    expect(labels).toContain("detail-templates");
    expect(labels).not.toContain("shared-detail-templates");
  });

  it("has no hint line", () => {
    expect(section("super-admin", "content")).not.toHaveProperty("hint");
  });
});

describe("Settings group", () => {
  it("adds Site messages, Site routing and Redirects after Company settings", () => {
    expect(summary("super-admin", "settings")).toEqual([
      ["Company settings", "tune", false],
      ["Site messages", "campaign", false],
      ["Site routing", "route", false],
      ["Redirects", "alt_route", false],
    ]);
  });

  it("locks Site routing for an editor but not Site messages or Redirects", () => {
    expect(summary("tenant-editor", "settings")).toEqual([
      ["Company settings", "tune", false],
      ["Site messages", "campaign", false],
      ["Site routing", "route", true],
      ["Redirects", "alt_route", false],
    ]);
  });

  it("no longer files Site messages under Layout", () => {
    expect(
      section("super-admin", "layout").items.map(({ slug }) => slug),
    ).toEqual(["header", "footer"]);
  });

  it("links the global to /globals/", () => {
    const routing = section("super-admin", "settings").items.find(
      ({ slug }) => slug === "site-routing",
    );

    expect(routing?.href).toBe("/admin/globals/site-routing");
  });
});

describe("nav registry icons", () => {
  it("only uses icons from the bundled subset", () => {
    for (const entity of entities) {
      const nav = entity.custom?.nav as CollectionNav | undefined;
      if (nav) expect(ICON_NAMES).toContain(nav.icon);
    }
  });

  it("keeps the labels under their NAV_GROUPS names", () => {
    expect(navGroup("content")).toBe("Website content");
    expect(navGroup("settings")).toBe("Settings");
  });
});
