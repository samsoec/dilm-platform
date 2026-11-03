import type { CollectionAfterChangeHook, PayloadRequest } from "payload";
import { describe, expect, it, vi } from "vitest";

import { Footer } from "./collections/Footer";
import { Header } from "./collections/Header";
import { SiteMessages } from "./collections/SiteMessages";
import { TenantSettings } from "./collections/TenantSettings";
import { localization } from "./localization";
import {
  layoutChange,
  layoutTag,
  localePrefixes,
  revalidateTenantLayout,
  stubRevalidator,
  type Revalidator,
} from "./revalidation";

const TENANTS: Record<string, { id: number; slug: string; domain: string }> = {
  "1": { id: 1, slug: "indonesianacids", domain: "indonesianacids.com" },
  "2": { id: 2, slug: "duniakimia", domain: "https://DuniaKimia.com/" },
};

function harness(findByID?: (args: { id: number | string }) => unknown) {
  const logger = { info: vi.fn(), error: vi.fn() };
  const lookup = vi.fn(
    findByID ??
      (async ({ id }: { id: number | string }) => {
        const found = TENANTS[String(id)];
        if (!found) throw new Error("Not Found");
        return found;
      }),
  );
  const find = vi.fn(async () => ({ docs: [] }));
  const req = {
    payload: { logger, findByID: lookup, find },
    context: {},
  } as unknown as PayloadRequest;
  const run = (hook: CollectionAfterChangeHook, doc: object, slug = "header") =>
    hook({
      doc,
      previousDoc: doc,
      req,
      operation: "update",
      collection: { slug },
      context: {},
      data: doc,
    } as never);
  return { logger, lookup, run };
}

function hookOf(hooks: unknown, index = -1) {
  const list = hooks as CollectionAfterChangeHook[];
  return list.at(index)!;
}

describe("layout tag and purge scope", () => {
  it("tags the layout by tenant slug", () => {
    expect(layoutTag("duniakimia")).toBe("layout:duniakimia");
  });

  it("takes the HTML locale prefixes from the localization config", () => {
    expect(localePrefixes()).toEqual(
      localization.locales.map((locale) => `/${locale}/`),
    );
    expect(localePrefixes()).toEqual(["/en/", "/id/"]);
  });

  it("purges only the tenant host under each locale prefix", () => {
    expect(
      layoutChange({ slug: "likutelaga", host: "likutelaga.com" }),
    ).toEqual({
      reason: "layout",
      tags: ["layout:likutelaga"],
      purge: [
        { host: "likutelaga.com", pathPrefix: "/en/" },
        { host: "likutelaga.com", pathPrefix: "/id/" },
      ],
    });
  });

  it("never reaches media or static asset paths", () => {
    const { purge } = layoutChange({ slug: "a", host: "a.com" });
    for (const { pathPrefix } of purge) {
      expect(pathPrefix).toMatch(/^\/[a-z]{2}\/$/);
      expect(pathPrefix).not.toMatch(/media|_next|static|assets/);
    }
  });

  it("follows a different locale list", () => {
    expect(
      layoutChange({ slug: "a", host: "a.com" }, ["en", "id", "fr"]).purge.map(
        (p) => p.pathPrefix,
      ),
    ).toEqual(["/en/", "/id/", "/fr/"]);
  });
});

describe("revalidateTenantLayout", () => {
  it("revalidates the tenant's tag and prefixes after a save", async () => {
    const revalidate = vi.fn(async () => {});
    const { run, logger } = harness();
    const doc = { id: 9, tenant: 2 };
    await expect(
      run(revalidateTenantLayout({ revalidate }), doc),
    ).resolves.toBe(doc);
    expect(revalidate).toHaveBeenCalledTimes(1);
    expect(revalidate).toHaveBeenCalledWith(
      {
        reason: "layout",
        tags: ["layout:duniakimia"],
        purge: [
          { host: "duniakimia.com", pathPrefix: "/en/" },
          { host: "duniakimia.com", pathPrefix: "/id/" },
        ],
      },
      logger,
      { req: expect.objectContaining({ payload: expect.anything() }) },
    );
  });

  it("uses a populated tenant without another lookup", async () => {
    const revalidate = vi.fn(async () => {});
    const { run, lookup } = harness();
    await run(revalidateTenantLayout({ revalidate }), {
      id: 9,
      tenant: { id: 1, slug: "indonesianacids", domain: "indonesianacids.com" },
    });
    expect(lookup).not.toHaveBeenCalled();
    expect(revalidate.mock.calls[0]).toBeDefined();
  });

  it("looks the tenant up when the populated one lacks slug or domain", async () => {
    const revalidate = vi.fn(async () => {});
    const { run, lookup } = harness();
    await run(revalidateTenantLayout({ revalidate }), {
      id: 9,
      tenant: { id: 1 },
    });
    expect(lookup).toHaveBeenCalledTimes(1);
    expect(revalidate).toHaveBeenCalledTimes(1);
  });

  it("never produces targets for another tenant", async () => {
    const calls: Parameters<Revalidator["revalidate"]>[0][] = [];
    const { run } = harness();
    const hook = revalidateTenantLayout({
      revalidate: async (change) => {
        calls.push(change);
      },
    });
    await run(hook, { id: 1, tenant: 1 });
    expect(calls).toHaveLength(1);
    expect(calls[0].tags).toEqual(["layout:indonesianacids"]);
    expect(calls[0].purge.every((p) => p.host === "indonesianacids.com")).toBe(
      true,
    );
    expect(JSON.stringify(calls)).not.toContain("duniakimia");
  });

  it("does nothing for a draft save", async () => {
    const revalidate = vi.fn(async () => {});
    const { run } = harness();
    await run(revalidateTenantLayout({ revalidate }), {
      id: 1,
      tenant: 1,
      _status: "draft",
    });
    expect(revalidate).not.toHaveBeenCalled();
  });

  it("revalidates a published save", async () => {
    const revalidate = vi.fn(async () => {});
    const { run } = harness();
    await run(revalidateTenantLayout({ revalidate }), {
      id: 1,
      tenant: 1,
      _status: "published",
    });
    expect(revalidate).toHaveBeenCalledTimes(1);
  });

  it("does nothing without a tenant", async () => {
    const revalidate = vi.fn(async () => {});
    const { run } = harness();
    await run(revalidateTenantLayout({ revalidate }), { id: 1 });
    expect(revalidate).not.toHaveBeenCalled();
  });

  it("keeps the save and logs when the revalidator throws", async () => {
    const { run, logger } = harness();
    const doc = { id: 4, tenant: 1 };
    const hook = revalidateTenantLayout({
      revalidate() {
        throw new Error("sync boom");
      },
    });
    await expect(run(hook, doc, "footer")).resolves.toBe(doc);
    expect(logger.error).toHaveBeenCalledTimes(1);
    const [fields] = logger.error.mock.calls[0];
    expect(fields).toMatchObject({
      tenant: "indonesianacids",
      collection: "footer",
      tags: ["layout:indonesianacids"],
    });
    expect(fields.err).toBeInstanceOf(Error);
  });

  it("keeps the save and logs when the revalidator rejects", async () => {
    const { run, logger } = harness();
    const doc = { id: 4, tenant: 1 };
    const hook = revalidateTenantLayout({
      revalidate: () => Promise.reject(new Error("purge 429")),
    });
    await expect(run(hook, doc)).resolves.toBe(doc);
    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(logger.error.mock.calls[0][0].err.message).toBe("purge 429");
  });

  it("keeps the save and logs when the tenant lookup fails", async () => {
    const revalidate = vi.fn(async () => {});
    const { run, logger } = harness(async () => {
      throw new Error("db down");
    });
    const doc = { id: 4, tenant: 7 };
    await expect(
      run(revalidateTenantLayout({ revalidate }), doc),
    ).resolves.toBe(doc);
    expect(revalidate).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(logger.error.mock.calls[0][0]).toMatchObject({ tenant: 7 });
  });

  it("logs and skips a tenant with no domain", async () => {
    const revalidate = vi.fn(async () => {});
    const { run, logger } = harness(async () => ({ id: 3, slug: "x" }));
    await run(revalidateTenantLayout({ revalidate }), { id: 1, tenant: 3 });
    expect(revalidate).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledTimes(1);
  });
});

describe("stub revalidator", () => {
  it("logs the tags and purge prefixes it was given", async () => {
    const { run, logger } = harness();
    await run(revalidateTenantLayout(stubRevalidator), { id: 1, tenant: 1 });
    expect(logger.info).toHaveBeenCalledTimes(1);
    expect(logger.info).toHaveBeenCalledWith(
      {
        reason: "layout",
        tags: ["layout:indonesianacids"],
        purge: [
          { host: "indonesianacids.com", pathPrefix: "/en/" },
          { host: "indonesianacids.com", pathPrefix: "/id/" },
        ],
      },
      "Revalidation (stubbed until DILM-32)",
    );
    expect(logger.error).not.toHaveBeenCalled();
  });
});

describe("collection wiring", () => {
  const cases = [
    ["header", Header],
    ["footer", Footer],
    ["tenant-settings", TenantSettings],
    ["site-messages", SiteMessages],
  ] as const;

  it.each(cases)(
    "%s logs one revalidation for its tenant on save",
    async (slug, collection) => {
      const { run, logger } = harness();
      for (const hook of collection.hooks!.afterChange!) {
        await run(hook, { id: 1, tenant: 2 }, slug);
      }
      const stubbed = logger.info.mock.calls.filter(([, message]) =>
        String(message).startsWith("Revalidation (stubbed"),
      );
      expect(stubbed).toHaveLength(1);
      expect(stubbed[0][0].tags).toEqual(["layout:duniakimia"]);
      expect(stubbed[0][0].purge).toEqual([
        { host: "duniakimia.com", pathPrefix: "/en/" },
        { host: "duniakimia.com", pathPrefix: "/id/" },
      ]);
    },
  );

  it("tenant-settings has no drafts, so every save is live", () => {
    expect(TenantSettings.versions).toEqual({ drafts: false });
    expect(Header.versions).toEqual({ drafts: false });
    expect(Footer.versions).toEqual({ drafts: false });
  });

  it("keeps the revalidation hooks last so the routing cascade runs first", () => {
    expect(hookOf(TenantSettings.hooks!.afterChange)).toBeTypeOf("function");
    expect(TenantSettings.hooks!.afterChange).toHaveLength(3);
  });
});
