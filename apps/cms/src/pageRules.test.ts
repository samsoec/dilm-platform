import type { AccessArgs, BlocksField, Config, Field, Where } from "payload";
import { describe, expect, it, vi } from "vitest";

import { PAGE_COLLECTIONS, pageModelPlugins } from "./pageModel";
import { multiTenant } from "./tenancy";
import { Pages } from "./collections/Pages";
import { SharedPages } from "./collections/SharedPages";
import { slugValidator } from "./fields/pageFields";
import {
  hasRedirect,
  keepParentInTenant,
  keepSingleHome,
  parentTenantProblem,
  protectHome,
  servesLayout,
} from "./pageRules";
import { accessAs, fieldNames, findField, testUser } from "./testing";
import { Tenants } from "./collections/Tenants";
import { Users } from "./collections/Users";

const superAdmin = testUser(["super-admin"]);
const editor = testUser(["tenant-editor"], [1]);
const viewer = testUser(["tenant-viewer"], [1]);

async function configured() {
  const copies = [Users, Tenants, Pages, SharedPages].map((collection) => ({
    ...collection,
    access: { ...collection.access },
    admin: { ...collection.admin },
    fields: [...collection.fields],
  }));
  let config = await multiTenant(copies)({
    admin: { user: "users" },
    collections: [...copies, { slug: "media", upload: true, fields: [] }],
  } as unknown as Config);
  for (const plugin of pageModelPlugins) config = await plugin(config);
  const find = (slug: string) =>
    config.collections!.find((collection) => collection.slug === slug)!;
  return { pages: find("pages"), shared: find("shared-pages") };
}

type Home = { id: number; slug: string | null };

function fakeReq(
  options: { docs?: Record<string, object>; others?: number } = {},
) {
  const find = vi.fn(async (args: { where: Where }) => ({
    totalDocs: options.others ?? 0,
    args,
  }));
  const findByID = vi.fn(async ({ id }: { id: string | number }) => {
    const doc = options.docs?.[String(id)];
    if (!doc) throw new Error(`no doc ${id}`);
    return doc;
  });
  return { req: { payload: { find, findByID }, locale: "en" }, find, findByID };
}

function validate(hook: unknown, args: Record<string, unknown>, req: object) {
  return (hook as (a: Record<string, unknown>) => Promise<unknown>)({
    req,
    collection: { slug: "pages" },
    ...args,
  });
}

describe("the page collections (FR-PM-01, FR-PM-02, FR-PM-03)", () => {
  it("are the ones the page-model plugins extend", () => {
    expect(PAGE_COLLECTIONS).toEqual(["pages", "shared-pages"]);
  });

  it("carry the same fields, the same layout, and a plugin-managed breadcrumb trail", async () => {
    const { pages, shared } = await configured();
    const wanted = [
      "title",
      "slug",
      "parent",
      "path",
      "layout",
      "redirectTo",
      "breadcrumbs",
      "meta",
    ];
    for (const collection of [pages, shared]) {
      expect(fieldNames(collection.fields)).toEqual(
        expect.arrayContaining(wanted),
      );
    }
    expect(findField(pages.fields, "layout")).toMatchObject({
      type: "blocks",
      maxRows: 30,
    });
    expect(
      JSON.stringify(
        (findField(shared.fields, "layout") as BlocksField).blocks,
      ),
    ).toBe(
      JSON.stringify((findField(pages.fields, "layout") as BlocksField).blocks),
    );
  });

  it("localizes title and slug, and keeps the path read-only", async () => {
    const { pages } = await configured();
    for (const name of ["title", "slug", "path"]) {
      expect(findField(pages.fields, name)).toMatchObject({ localized: true });
    }
    expect(findField(pages.fields, "path")).toMatchObject({
      admin: { readOnly: true },
    });
    expect(
      (
        findField(pages.fields, "path") as {
          access: Record<string, () => boolean>;
        }
      ).access.update(),
    ).toBe(false);
  });

  it("puts pages under a required tenant and shared pages under none", async () => {
    const { pages, shared } = await configured();
    expect(findField(pages.fields, "tenant")).toMatchObject({
      relationTo: "tenants",
    });
    expect(fieldNames(shared.fields)).not.toContain("tenant");
  });

  it("enable drafts, versions and the trash on both", async () => {
    const { pages, shared } = await configured();
    for (const collection of [pages, shared]) {
      expect(collection.versions).toMatchObject({ drafts: true });
      expect(collection.trash).toBe(true);
    }
  });

  it("point each parent at its own collection, so the two trees never mix (FR-PM-06)", async () => {
    const { pages, shared } = await configured();
    expect(findField(pages.fields, "parent")).toMatchObject({
      relationTo: "pages",
    });
    expect(findField(shared.fields, "parent")).toMatchObject({
      relationTo: "shared-pages",
    });
  });

  it("offer only same-company parents, never the page itself", async () => {
    const filter = (
      findField(Pages.fields, "parent") as {
        filterOptions: (a: unknown) => Where | boolean;
      }
    ).filterOptions({ id: 5, data: { tenant: 2 } });
    expect(JSON.stringify(filter)).toContain('"tenant":{"equals":"2"}');
    expect(JSON.stringify(filter)).toContain('"id":{"not_equals":"5"}');
  });
});

describe("page access (FR-PM-02, TRD-PM §4.12)", () => {
  it("lets a Super Admin do everything on both", async () => {
    const { pages, shared } = await configured();
    for (const collection of [pages, shared]) {
      for (const key of ["create", "update", "delete", "read"] as const) {
        expect(await accessAs(collection, key, superAdmin)).toBe(true);
      }
    }
  });

  it("lets a Tenant Editor write only their own company's pages", async () => {
    const { pages } = await configured();
    expect(await accessAs(pages, "create", editor)).toBeTruthy();
    expect(await accessAs(pages, "update", editor)).toBeTruthy();
    expect(JSON.stringify(await accessAs(pages, "read", editor))).toContain(
      '"tenant":{"in":[1]}',
    );
  });

  it("lets a Tenant Viewer only read", async () => {
    const { pages, shared } = await configured();
    expect(await accessAs(pages, "create", viewer)).toBe(false);
    expect(await accessAs(pages, "update", viewer)).toBe(false);
    expect(await accessAs(pages, "delete", viewer)).toBe(false);
    expect(await accessAs(shared, "create", viewer)).toBe(false);
    expect(await accessAs(shared, "read", viewer)).toBe(true);
  });

  it("makes shared pages read-only for editors and viewers", async () => {
    const { shared } = await configured();
    for (const as of [editor, viewer]) {
      expect(await accessAs(shared, "read", as)).toBe(true);
      expect(await accessAs(shared, "create", as)).toBe(false);
      expect(await accessAs(shared, "update", as)).toBe(false);
      expect(await accessAs(shared, "delete", as)).toBe(false);
    }
  });

  it("shows the public published documents only", async () => {
    const { pages, shared } = await configured();
    expect(await accessAs(shared, "read", null)).toEqual({
      _status: { equals: "published" },
    });
    expect(JSON.stringify(await accessAs(pages, "read", null))).toContain(
      '"_status":{"equals":"published"}',
    );
    expect(await accessAs(shared, "create", null)).toBe(false);
  });

  it("lets editors trash a page but only a Super Admin delete it", async () => {
    const { pages } = await configured();
    const call = (user: object, data: object) =>
      pages.access!.delete!({ req: { user }, data } as unknown as AccessArgs);
    expect(await call(editor, { deletedAt: "2026-11-02" })).toBeTruthy();
    expect(await call(editor, {})).toBe(false);
    expect(await call(superAdmin, {})).toBe(true);
  });
});

describe("slug rules (FR-PM-01, FR-PM-07)", () => {
  const options = {} as Parameters<ReturnType<typeof slugValidator>>[1];

  it("requires a slug on tenant pages, so none can take the root", () => {
    expect(slugValidator(true)("", options)).not.toBe(true);
    expect(slugValidator(true)(null, options)).not.toBe(true);
  });

  it("allows an empty slug on shared pages", () => {
    expect(slugValidator(false)("", options)).toBe(true);
  });

  it.each(["about-us", "p2", "2026"])("accepts %s", (slug) => {
    expect(slugValidator(true)(slug, options)).toBe(true);
  });

  it.each(["About", "a b", "a/b", "kerja_sama", "é"])("rejects %s", (slug) => {
    expect(slugValidator(true)(slug, options)).not.toBe(true);
    expect(slugValidator(false)(slug, options)).not.toBe(true);
  });
});

describe("parent rules (FR-PM-06)", () => {
  it("compares tenants by id however they are populated", () => {
    expect(parentTenantProblem(1, 1)).toBeUndefined();
    expect(parentTenantProblem({ id: 1 }, "1")).toBeUndefined();
    expect(parentTenantProblem(2, 1)).toMatch(/another company/);
    expect(parentTenantProblem(null, 1)).toMatch(/another company/);
  });

  it("rejects a parent from another company", async () => {
    const { req } = fakeReq({ docs: { "8": { id: 8, tenant: 2 } } });
    await expect(
      validate(keepParentInTenant, { data: { parent: 8, tenant: 1 } }, req),
    ).rejects.toThrow(/another company/);
  });

  it("rejects a tenant page with a parent that has no company, which is what a shared page looks like", async () => {
    const { req } = fakeReq({ docs: { "8": { id: 8 } } });
    await expect(
      validate(keepParentInTenant, { data: { parent: 8, tenant: 1 } }, req),
    ).rejects.toThrow(/another company/);
  });

  it("accepts a parent of the same company and a top-level page", async () => {
    const { req, findByID } = fakeReq({ docs: { "8": { id: 8, tenant: 1 } } });
    const data = { parent: 8, tenant: 1 };
    await expect(validate(keepParentInTenant, { data }, req)).resolves.toBe(
      data,
    );
    const top = { parent: null, tenant: 1 };
    await expect(
      validate(keepParentInTenant, { data: top }, req),
    ).resolves.toBe(top);
    expect(findByID).toHaveBeenCalledTimes(1);
  });

  it("checks the stored company when the save leaves it out", async () => {
    const { req } = fakeReq({ docs: { "8": { id: 8, tenant: 2 } } });
    await expect(
      validate(
        keepParentInTenant,
        {
          data: { title: "x" },
          originalDoc: { id: 3, parent: 8, tenant: 1 },
        },
        req,
      ),
    ).rejects.toThrow(/another company/);
  });

  it("rejects a page as its own parent", async () => {
    const { req } = fakeReq();
    await expect(
      validate(
        keepParentInTenant,
        { data: { parent: 3 }, originalDoc: { id: 3 } },
        req,
      ),
    ).rejects.toThrow(/own parent/);
  });
});

describe("the single Home (FR-PM-07)", () => {
  const run = (
    args: Record<string, unknown>,
    req: ReturnType<typeof fakeReq>["req"],
  ) => validate(keepSingleHome, args, req);

  const home: Home = { id: 1, slug: null };

  it("lets the first empty-slug shared page become Home", async () => {
    const { req } = fakeReq({ others: 0 });
    const data = { title: "Home", slug: "" };
    await expect(run({ data, operation: "create" }, req)).resolves.toBe(data);
  });

  it("rejects a second empty-slug shared page", async () => {
    const { req } = fakeReq({ others: 1 });
    await expect(
      run({ data: { slug: "" }, operation: "create" }, req),
    ).rejects.toThrow(/Home already exists/);
    await expect(
      run({ data: { title: "No slug yet" }, operation: "create" }, req),
    ).rejects.toThrow(/Home already exists/);
  });

  it("looks for the other Home among every shared page but this one, trash included", async () => {
    const { req, find } = fakeReq({
      docs: { "4": { id: 4, slug: "products" } },
      others: 0,
    });
    await run(
      {
        data: { slug: "" },
        operation: "update",
        originalDoc: { id: 4 },
      },
      req,
    );
    const call = find.mock.calls[0][0] as unknown as {
      where: Where;
      trash: boolean;
      locale: string;
    };
    expect(call.trash).toBe(true);
    expect(call.locale).toBe("en");
    expect(JSON.stringify(call.where)).toContain('"id":{"not_equals":"4"}');
  });

  it("lets pages with a slug be created freely", async () => {
    const { req, find } = fakeReq({ others: 1 });
    const data = { slug: "products-and-solutions" };
    await expect(run({ data, operation: "create" }, req)).resolves.toBe(data);
    expect(find).not.toHaveBeenCalled();
  });

  it("keeps Home's slug empty in every language", async () => {
    const { req } = fakeReq({ docs: { "1": home } });
    await expect(
      run(
        { data: { slug: "beranda" }, operation: "update", originalDoc: home },
        { ...req, locale: "id" },
      ),
    ).rejects.toThrow(/stays at the root/);
    await expect(
      run(
        { data: { slug: "home" }, operation: "update", originalDoc: home },
        req,
      ),
    ).rejects.toThrow(/stays at the root/);
    await expect(
      run(
        {
          data: { slug: { en: "", id: "beranda" } },
          operation: "update",
          originalDoc: home,
        },
        { ...req, locale: "all" },
      ),
    ).rejects.toThrow(/stays at the root/);
  });

  it("lets Home change its content", async () => {
    const { req } = fakeReq({ docs: { "1": home } });
    const data = { title: "Welcome", slug: "" };
    await expect(
      run({ data, operation: "update", originalDoc: home }, req),
    ).resolves.toBe(data);
  });

  it("can't trash Home", async () => {
    const { req } = fakeReq({ docs: { "1": home } });
    await expect(
      run(
        {
          data: { deletedAt: "2026-11-02T00:00:00Z" },
          operation: "update",
          originalDoc: home,
        },
        req,
      ),
    ).rejects.toThrow(/trash or deleted/);
  });

  it("can trash any other shared page", async () => {
    const { req } = fakeReq({ docs: { "4": { id: 4, slug: "products" } } });
    const data = { deletedAt: "2026-11-02T00:00:00Z" };
    await expect(
      run({ data, operation: "update", originalDoc: { id: 4 } }, req),
    ).resolves.toBe(data);
  });

  it("can't delete Home but can delete another shared page", async () => {
    const { req } = fakeReq({
      docs: { "1": home, "4": { id: 4, slug: "products" } },
    });
    await expect(validate(protectHome, { id: 1 }, req)).rejects.toThrow(
      /trash or deleted/,
    );
    await expect(
      validate(protectHome, { id: 4 }, req),
    ).resolves.toBeUndefined();
  });

  it("registers the Home hooks on shared pages only", () => {
    expect(SharedPages.hooks?.beforeValidate).toContain(keepSingleHome);
    expect(SharedPages.hooks?.beforeDelete).toContain(protectHome);
    expect(Pages.hooks?.beforeValidate).not.toContain(keepSingleHome);
    expect(Pages.hooks?.beforeValidate).toContain(keepParentInTenant);
  });
});

describe("redirectTo (FR-PM-07)", () => {
  it("serves a layout until a target is set", () => {
    expect(servesLayout({})).toBe(true);
    expect(servesLayout({ redirectTo: null })).toBe(true);
    expect(servesLayout({ redirectTo: { type: "internal" } })).toBe(true);
  });

  it("serves no layout once an internal or external target is set", () => {
    const internal = { type: "internal", internalPath: "/about/team" } as const;
    const external = {
      type: "external",
      externalUrl: "https://x.test",
    } as const;
    expect(hasRedirect({ redirectTo: internal })).toBe(true);
    expect(servesLayout({ redirectTo: external })).toBe(false);
  });

  it("hides the layout editor while a redirect is set", async () => {
    const { pages, shared } = await configured();
    for (const collection of [pages, shared]) {
      const condition = (
        findField(collection.fields, "layout") as {
          admin: { condition: (data: object) => boolean };
        }
      ).admin.condition;
      expect(condition({})).toBe(true);
      expect(
        condition({ redirectTo: { type: "internal", internalPath: "/a" } }),
      ).toBe(false);
    }
  });

  it("is an optional link on both collections", async () => {
    const { pages, shared } = await configured();
    for (const collection of [pages, shared]) {
      const field = findField(collection.fields, "redirectTo") as Field & {
        required?: boolean;
      };
      expect(field).toMatchObject({ type: "group" });
      expect(field.required).toBeFalsy();
    }
  });
});
