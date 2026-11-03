import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";

import type { CollectionSlug, Payload } from "payload";
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { seedPages } from "./seed/pages";
import { seedTenants } from "./seed/tenants";
import { readRefreshStatus, REFRESH_FAILED_MESSAGE } from "./refreshStatus";
import { stubRevalidator, type RevalidationChange } from "./revalidation";

const database = process.env.SEED_TEST_DATABASE;

const HOSTS = ["duniakimia.com", "indonesianacids.com", "likutelaga.com"];

type Doc = {
  id: number;
  path?: string;
  slug?: string;
  _status?: string;
  tenant?: number;
  recordType?: string;
};

describe.skipIf(!database)(
  "publish revalidation against a scratch database",
  { timeout: 600_000 },
  () => {
    let payload: Payload;
    let storage: Server;
    let info: ReturnType<typeof vi.spyOn>;
    const tenantId: Record<string, number> = {};

    const find = async (
      collection: CollectionSlug,
      where: Record<string, unknown> = {},
    ): Promise<Doc[]> =>
      (
        await payload.find({
          collection,
          where: where as never,
          draft: true,
          depth: 0,
          pagination: false,
          trash: true,
          limit: 0,
        })
      ).docs as unknown as Doc[];

    const changes = (): RevalidationChange[] =>
      info.mock.calls
        .filter(([, message]) =>
          String(message).startsWith("Revalidation (stubbed"),
        )
        .map(([fields]) => fields as RevalidationChange);

    const reset = () => info.mockClear();

    beforeAll(async () => {
      if (database === "dilm") {
        throw new Error("Refusing to seed the shared dev database.");
      }
      storage = createServer((request, response) => {
        request.resume();
        request.on("end", () => {
          response.statusCode = 200;
          response.setHeader("ETag", '"seed-test"');
          response.end();
        });
      });
      await new Promise<void>((resolve) =>
        storage.listen(0, "127.0.0.1", resolve),
      );
      process.env.DATABASE_NAME = database;
      process.env.S3_ENDPOINT = `http://127.0.0.1:${(storage.address() as AddressInfo).port}`;
      process.env.S3_ACCESS_KEY_ID = "test";
      process.env.S3_SECRET_ACCESS_KEY = "test";
      const { getPayload } = await import("payload");
      const { default: config } = await import("./payload.config");
      payload = await getPayload({ config });
      await seedTenants(payload);
      const { docs } = await payload.find({
        collection: "tenants",
        pagination: false,
      });
      for (const tenant of docs) tenantId[tenant.slug] = tenant.id;
      await seedPages(payload);
      info = vi.spyOn(payload.logger, "info");
    }, 600_000);

    afterEach(() => {
      vi.restoreAllMocks();
      info = vi.spyOn(payload.logger, "info");
    });

    afterAll(async () => {
      await payload?.destroy();
      await new Promise((resolve) => storage?.close(resolve));
    });

    const dunia = () => tenantId.duniakimia;

    it("stays silent for a draft and a draft save of a live page", async () => {
      reset();
      const page = await payload.create({
        collection: "pages",
        data: {
          tenant: dunia(),
          title: "Press kit",
          slug: "press-kit",
          _status: "draft",
        } as never,
        draft: true,
      });
      expect(changes()).toEqual([]);
      await payload.update({
        collection: "pages",
        id: page.id,
        data: { title: "Press kit 2" } as never,
        draft: true,
      });
      expect(changes()).toEqual([]);
    });

    it("revalidates a page once on publish, with its own tag and host", async () => {
      const [page] = await find("pages", { slug: { equals: "press-kit" } });
      reset();
      await payload.update({
        collection: "pages",
        id: page!.id,
        data: { _status: "published" } as never,
      });
      expect(changes()).toHaveLength(1);
      expect(changes()[0]).toMatchObject({
        collection: "pages",
        reason: "publish",
        tags: [
          "route:duniakimia:en:/press-kit",
          "route:duniakimia:id:/press-kit",
        ],
        purge: [
          { host: "duniakimia.com", pathPrefix: "/en/press-kit", exact: true },
          { host: "duniakimia.com", pathPrefix: "/id/press-kit", exact: true },
        ],
      });
      expect(
        await readRefreshStatus(payload, {
          collection: "pages",
          docId: String(page!.id),
        }),
      ).toMatchObject({
        status: "ok",
        hosts: ["duniakimia.com"],
      });
    });

    it("ignores a draft save over the live page", async () => {
      const [page] = await find("pages", { slug: { equals: "press-kit" } });
      reset();
      await payload.update({
        collection: "pages",
        id: page!.id,
        data: { title: "Draft only" } as never,
        draft: true,
      });
      expect(changes()).toEqual([]);
    });

    it("revalidates the old and new path once when a page is renamed", async () => {
      const [page] = await find("pages", { slug: { equals: "press-kit" } });
      reset();
      await payload.update({
        collection: "pages",
        id: page!.id,
        data: { slug: "media-kit", _status: "published" } as never,
      });
      expect(changes()).toHaveLength(1);
      expect(changes()[0].reason).toBe("move");
      expect(changes()[0].tags).toEqual(
        expect.arrayContaining([
          "route:duniakimia:en:/press-kit",
          "route:duniakimia:en:/media-kit",
        ]),
      );
    });

    it("revalidates once for a parent move that also moves its children", async () => {
      const [about] = await find("pages", {
        tenant: { equals: dunia() },
        path: { equals: "/about-us" },
      });
      reset();
      await payload.update({
        collection: "pages",
        id: about!.id,
        data: { slug: "about", _status: "published" } as never,
      });
      expect(changes()).toHaveLength(1);
      const [change] = changes();
      expect(change.tags).toEqual(
        expect.arrayContaining([
          "route:duniakimia:en:/about-us",
          "route:duniakimia:en:/about",
          "route:duniakimia:en:/about-us/overview",
          "route:duniakimia:en:/about/overview",
        ]),
      );
      expect(new Set(change.tags).size).toBe(change.tags.length);
      expect(
        change.purge.every((purge) => purge.host === "duniakimia.com"),
      ).toBe(true);
    });

    it("revalidates the old path when a page is unpublished and trashed", async () => {
      const [page] = await find("pages", { slug: { equals: "media-kit" } });
      reset();
      await payload.update({
        collection: "pages",
        id: page!.id,
        data: { _status: "draft" } as never,
      });
      expect(changes()).toHaveLength(1);
      expect(changes()[0]).toMatchObject({
        reason: "unpublish",
        tags: [
          "route:duniakimia:en:/media-kit",
          "route:duniakimia:id:/media-kit",
        ],
      });
      await payload.update({
        collection: "pages",
        id: page!.id,
        data: { _status: "published" } as never,
      });
      reset();
      await payload.update({
        collection: "pages",
        id: page!.id,
        data: { deletedAt: new Date().toISOString() } as never,
      });
      expect(changes()).toHaveLength(1);
      expect(changes()[0].reason).toBe("trash");
      reset();
      await payload.delete({
        collection: "pages",
        id: page!.id,
        trash: true,
      } as never);
      expect(changes()).toEqual([]);
    });

    it("purges a shared page on every host", async () => {
      const [shared] = await find("shared-pages", {
        path: { equals: "/products-and-solutions" },
      });
      reset();
      await payload.update({
        collection: "shared-pages",
        id: shared!.id,
        data: {
          _status: "published",
          title: "Products and solutions",
        } as never,
      });
      expect(changes()).toHaveLength(1);
      expect(changes()[0].tags).toEqual([
        "route:shared:en:/products-and-solutions",
        "route:shared:id:/products-and-solutions",
      ]);
      expect(
        [...new Set(changes()[0].purge.map((purge) => purge.host))].sort(),
      ).toEqual(HOSTS);
    });

    it("purges a product on every host with its list tags", async () => {
      reset();
      const product = await payload.create({
        collection: "products",
        data: {
          tenant: dunia(),
          name: "Bleach",
          slug: "bleach",
          _status: "published",
        } as never,
      });
      expect(changes()).toHaveLength(1);
      const [change] = changes();
      expect(change.collection).toBe("products");
      expect(change.tags).toEqual(
        expect.arrayContaining([
          "list:all:products",
          "list:duniakimia:products",
          "list:indoacid:products",
          "list:likutelaga:products",
          "route:shared:en:/products-and-solutions/products/bleach",
        ]),
      );
      expect(
        [...new Set(change.purge.map((purge) => purge.host))].sort(),
      ).toEqual(HOSTS);
      reset();
      await payload.update({
        collection: "products",
        id: product.id,
        data: { _status: "draft" } as never,
      });
      expect(changes()).toHaveLength(1);
      expect(changes()[0].reason).toBe("unpublish");
    });

    it("keeps a job on its own tenant host", async () => {
      reset();
      await payload.create({
        collection: "jobs",
        data: {
          tenant: dunia(),
          title: "Chemist",
          slug: "chemist",
          department: "Lab",
          closingDate: "2027-01-01T00:00:00.000Z",
          status: "open",
          _status: "published",
        } as never,
      });
      expect(changes()).toHaveLength(1);
      const [change] = changes();
      expect(change.tags).toEqual(
        expect.arrayContaining(["list:all:jobs", "list:duniakimia:jobs"]),
      );
      expect(change.tags).not.toContain("list:likutelaga:jobs");
      expect(
        change.purge.every((purge) => purge.host === "duniakimia.com"),
      ).toBe(true);
    });

    it("revalidates a published template across what it governs", async () => {
      const [product] = await find("products", { slug: { equals: "bleach" } });
      await payload.update({
        collection: "products",
        id: product!.id,
        data: { _status: "published" } as never,
      });
      const [template] = await find("shared-detail-templates", {
        recordType: { equals: "product" },
      });
      reset();
      await payload.update({
        collection: "shared-detail-templates",
        id: template!.id,
        data: { _status: "published" } as never,
      });
      expect(changes()).toHaveLength(1);
      expect(changes()[0]).toMatchObject({
        collection: "products",
        reason: "template",
      });
      expect(changes()[0].tags).toContain(
        "route:shared:en:/products-and-solutions/products/bleach",
      );
      expect(
        changes()[0]
          .purge.map((purge) => purge.host)
          .sort(),
      ).toEqual(HOSTS.flatMap((host) => [host, host]));
    });

    it("revalidates the tenant's job pages when its template publishes", async () => {
      const [template] = await find("detail-templates", {
        tenant: { equals: dunia() },
        recordType: { equals: "job" },
      });
      reset();
      await payload.update({
        collection: "detail-templates",
        id: template!.id,
        data: { _status: "published" } as never,
      });
      expect(changes()).toHaveLength(1);
      expect(changes()[0].tags).toContain(
        "route:duniakimia:en:/career/chemist",
      );
      expect(
        changes()[0].purge.every((purge) => purge.host === "duniakimia.com"),
      ).toBe(true);
    });

    it("ignores a draft save of a live template and revalidates when it is unpublished", async () => {
      const [template] = await find("detail-templates", {
        tenant: { equals: dunia() },
        recordType: { equals: "job" },
      });
      reset();
      await payload.update({
        collection: "detail-templates",
        id: template!.id,
        data: {} as never,
        draft: true,
      });
      expect(changes()).toEqual([]);
      await payload.update({
        collection: "detail-templates",
        id: template!.id,
        data: { _status: "draft" } as never,
      });
      expect(changes()).toHaveLength(1);
      expect(changes()[0]).toMatchObject({
        collection: "jobs",
        reason: "template",
      });
      await payload.update({
        collection: "detail-templates",
        id: template!.id,
        data: { _status: "published" } as never,
      });
    });

    it("moves the jobs with their career page in one revalidation", async () => {
      const [career] = await find("pages", {
        tenant: { equals: dunia() },
        path: { equals: "/career" },
      });
      reset();
      await payload.update({
        collection: "pages",
        id: career!.id,
        data: { slug: "careers", _status: "published" } as never,
      });
      expect(changes()).toHaveLength(1);
      expect(changes()[0].tags).toEqual(
        expect.arrayContaining([
          "route:duniakimia:en:/career",
          "route:duniakimia:en:/careers",
          "route:duniakimia:en:/career/chemist",
          "route:duniakimia:en:/careers/chemist",
          "list:duniakimia:jobs",
        ]),
      );
    });

    it("revalidates the layout and the routes that reference the company on a tenant-settings save", async () => {
      const [settings] = await find("tenant-settings", {
        tenant: { equals: dunia() },
      });
      reset();
      await payload.update({
        collection: "tenant-settings",
        id: settings!.id,
        data: {} as never,
      });
      const [layout, referencing] = changes();
      expect(changes()).toHaveLength(2);
      expect(layout).toMatchObject({
        reason: "layout",
        tags: ["layout:duniakimia"],
      });
      expect(referencing).toMatchObject({
        collection: "tenant-settings",
        reason: "settings",
      });
      expect(referencing.tags).toEqual(
        expect.arrayContaining([
          "route:likutelaga:en:/about-us/overview",
          "route:indoacid:en:/about-us/overview",
        ]),
      );
      expect(referencing.tags.every((tag) => tag.startsWith("route:"))).toBe(
        true,
      );
    });

    it("tags a published post and its lists, then moves it with its category once", async () => {
      const [category] = await find("categories", {
        slug: { equals: "company-news" },
      });
      reset();
      await payload.create({
        collection: "posts",
        data: {
          tenant: dunia(),
          title: "Plant opens",
          slug: "plant-opens",
          primaryCategory: category!.id,
          _status: "published",
        } as never,
      });
      expect(changes()).toHaveLength(1);
      expect(changes()[0].tags).toEqual(
        expect.arrayContaining([
          "list:all:posts",
          "list:duniakimia:posts",
          "route:duniakimia:en:/category/company-news/plant-opens",
        ]),
      );
      expect(changes()[0].tags).not.toContain("list:likutelaga:posts");
      reset();
      await payload.update({
        collection: "categories",
        id: category!.id,
        data: { slug: "news" } as never,
      });
      expect(changes()).toHaveLength(1);
      expect(changes()[0].tags).toEqual(
        expect.arrayContaining([
          "route:shared:en:/category/company-news",
          "route:shared:en:/category/news",
          "route:duniakimia:en:/category/company-news/plant-opens",
          "route:duniakimia:en:/category/news/plant-opens",
          "list:all:categories",
        ]),
      );
    });

    it("keeps the save and records a failed refresh when the revalidator throws", async () => {
      const [page] = await find("pages", {
        tenant: { equals: dunia() },
        path: { equals: "/contact-us" },
      });
      vi.spyOn(stubRevalidator, "revalidate").mockRejectedValue(
        new Error("purge 429"),
      );
      const error = vi.spyOn(payload.logger, "error");
      const saved = await payload.update({
        collection: "pages",
        id: page!.id,
        data: { slug: "contact-us-2", _status: "published" } as never,
      });
      expect(saved.path).toBe("/contact-us-2");
      expect(error).toHaveBeenCalled();
      const status = await readRefreshStatus(payload, {
        collection: "pages",
        docId: String(page!.id),
      });
      expect(status).toMatchObject({
        status: "failed",
        message: REFRESH_FAILED_MESSAGE,
      });
    });
  },
);
