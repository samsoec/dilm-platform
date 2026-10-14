import type { Payload, TypedUser } from "payload";
import { describe, expect, it } from "vitest";

import { collections } from "../../collections";
import type { CollectionNav } from "../navGroups";
import type { NavBadgeKey } from "./badges";
import { loadSidebar, selectedTenantID } from "./sidebar";

const BADGES = collections.flatMap(({ custom }) => {
  const badge = (custom?.nav as CollectionNav | undefined)?.badge;
  return badge ? [badge] : [];
}) satisfies NavBadgeKey[];

const DKU = {
  id: 2,
  name: "Dunia Kimia Utama",
  domain: "duniakimia.com",
  brandColor: "#2a2d7e",
};

function fakePayload(settings: object[]) {
  const queries: string[] = [];
  const payload = {
    find: async ({
      collection,
      overrideAccess,
    }: {
      collection: string;
      overrideAccess?: boolean;
    }) => {
      queries.push(`find ${collection} overrideAccess=${overrideAccess}`);
      return { docs: collection === "tenant-settings" ? settings : [] };
    },
    findByID: async ({ collection }: { collection: string }) => {
      queries.push(`findByID ${collection}`);
      return DKU;
    },
    count: async ({
      collection,
      overrideAccess,
    }: {
      collection: string;
      overrideAccess?: boolean;
    }) => {
      queries.push(`count ${collection} overrideAccess=${overrideAccess}`);
      return { totalDocs: 6 };
    },
  };
  return { payload: payload as unknown as Payload, queries };
}

const user = {
  id: 1,
  collection: "users",
  roles: ["super-admin"],
} as unknown as TypedUser;

describe("loadSidebar (FR-UI-18, NFR-UI-03)", () => {
  it("fills the card, badge and dot with two access-checked queries", async () => {
    const { payload, queries } = fakePayload([
      { tenant: DKU, siteName: "DKU", brand: {} },
    ]);

    const data = await loadSidebar({ payload, user }, 2, BADGES, true);

    expect(queries).toEqual([
      "find tenant-settings overrideAccess=false",
      "count cv-submissions overrideAccess=false",
    ]);
    expect(data).toMatchObject({
      tenant: { id: 2, name: "Dunia Kimia Utama", domain: "duniakimia.com" },
      attention: true,
      badges: { "cv-received": 6 },
    });
    expect(data.tenant?.colors.light).toBe("#2a2d7e");
  });

  it("stays at two queries when the tenant has no settings document yet", async () => {
    const { payload, queries } = fakePayload([]);

    const data = await loadSidebar({ payload, user }, 2, BADGES, true);

    expect(queries).toHaveLength(2);
    expect(data).toMatchObject({ tenant: undefined, attention: true });
  });

  it("queries nothing until a tenant is selected", async () => {
    const { payload, queries } = fakePayload([]);

    expect(
      await loadSidebar({ payload, user }, undefined, BADGES, true),
    ).toEqual({
      attention: false,
      badges: {},
    });
    expect(queries).toEqual([]);
  });

  it("keeps today's badges within the two-query budget", () => {
    expect(1 + new Set(BADGES).size).toBeLessThanOrEqual(2);
  });
});

describe("selectedTenantID", () => {
  const editor = { roles: ["tenant-editor"], tenants: [{ tenant: 2 }] };
  const multi = {
    roles: ["tenant-editor"],
    tenants: [{ tenant: 1 }, { tenant: 2 }],
  };
  const superAdmin = { roles: ["super-admin"] };

  it("uses the cookie when the user may see that tenant", () => {
    expect(selectedTenantID(editor, "2")).toBe(2);
    expect(selectedTenantID(superAdmin, "3")).toBe(3);
  });

  it("ignores a cookie for another tenant and falls back to the user's only one", () => {
    expect(selectedTenantID(editor, "3")).toBe(2);
    expect(selectedTenantID(editor, undefined)).toBe(2);
  });

  it("selects nothing for multi-tenant users without a valid cookie", () => {
    expect(selectedTenantID(multi, "3")).toBeUndefined();
    expect(selectedTenantID(superAdmin, undefined)).toBeUndefined();
  });
});
