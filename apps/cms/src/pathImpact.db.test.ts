import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";

import type { Payload, PayloadRequest } from "payload";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { pathImpactHandler } from "./pathImpact";
import {
  CASCADE_LIMIT,
  previewPathChange,
  recordMoveSources,
  type RecordMove,
  type RecordMoveSource,
} from "./pathCascade";
import { seedPages } from "./seed/pages";
import { seedTenants } from "./seed/tenants";

const database = process.env.SEED_TEST_DATABASE;

type Reply = {
  ok: boolean;
  message: string;
  published: boolean;
  urls: { locale: string; from: string; to: string }[];
  childPages: number;
  records: number;
  redirects: number;
  overLimit: boolean;
  linkCount: number;
  links: { collection: string; id: string }[];
};

type Doc = Record<string, unknown> & { id: number };

describe.skipIf(!database)(
  "path impact endpoint against a scratch database",
  { timeout: 600_000 },
  () => {
    let payload: Payload;
    let storage: Server;
    const tenantId: Record<string, number> = {};
    const users: Record<string, unknown> = {};

    const call = async (
      as: string,
      id: string,
      body: unknown,
    ): Promise<{ status: number; body: Reply }> => {
      const req = {
        payload,
        user: users[as],
        query: {},
        routeParams: { id },
        json: async () => body,
        t: (key: string) => key,
        locale: "en",
      } as unknown as PayloadRequest;
      const response = await pathImpactHandler(req);
      return {
        status: response.status,
        body: (await response.json()) as Reply,
      };
    };

    const findPage = async (slug: string, tenant = tenantId.duniakimia) =>
      (
        (
          await payload.find({
            collection: "pages",
            where: {
              slug: { equals: slug },
              tenant: { equals: tenant },
            } as never,
            draft: true,
            depth: 0,
            trash: true,
            limit: 1,
          })
        ).docs as unknown as Doc[]
      )[0];

    const makePage = async (
      tenant: number,
      slug: string,
      publish: boolean,
      parent?: number,
    ): Promise<Doc> => {
      const created = (await payload.create({
        collection: "pages",
        locale: "en",
        depth: 0,
        draft: true,
        data: {
          tenant,
          title: slug,
          slug,
          ...(parent ? { parent } : {}),
        } as never,
      })) as unknown as Doc;
      if (publish) {
        await payload.update({
          collection: "pages",
          id: created.id,
          locale: "en",
          depth: 0,
          draft: false,
          data: { _status: "published" } as never,
        });
      }
      return created;
    };

    beforeAll(async () => {
      if (database === "dilm") {
        throw new Error("Refusing to use the shared dev database.");
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
      const make = async (key: string, roles: string[], tenants: number[]) => {
        users[key] = await payload.create({
          collection: "users",
          data: {
            email: `${key}@example.test`,
            password: "Passw0rd!-test-123",
            name: key,
            roles,
            tenants: tenants.map((tenant) => ({ tenant })),
          } as never,
          overrideAccess: true,
        });
      };
      await make("editor", ["tenant-editor"], [tenantId.duniakimia]);
      await make("viewer", ["tenant-viewer"], [tenantId.duniakimia]);
      await make("outsider", ["tenant-editor"], [tenantId.indoacid]);
      await make("super", ["super-admin"], []);
    }, 600_000);

    afterAll(async () => {
      await payload?.destroy();
      await new Promise((resolve) => storage?.close(resolve));
    });

    it("refuses anonymous callers, viewers and other companies", async () => {
      const about = String((await findPage("about-us")).id);
      const body = { slugs: { en: "about" } };
      expect((await call("nobody", about, body)).status).toBe(401);
      expect((await call("viewer", about, body)).status).toBe(403);
      expect([403, 404]).toContain(
        (await call("outsider", about, body)).status,
      );
      expect((await call("editor", about, body)).status).toBe(200);
      expect((await call("super", about, body)).status).toBe(200);
    });

    it("rejects an invalid id, body, slug or parent", async () => {
      const about = String((await findPage("about-us")).id);
      expect((await call("editor", "abc", {})).status).toBe(400);
      expect((await call("editor", "999999", {})).status).toBe(404);
      expect((await call("editor", about, undefined)).status).toBe(400);
      expect((await call("editor", about, { slugs: "x" })).status).toBe(400);
      expect((await call("editor", about, { slugs: { fr: "x" } })).status).toBe(
        400,
      );
      expect((await call("editor", about, { slugs: { en: 7 } })).status).toBe(
        400,
      );
      expect(
        (await call("editor", about, { slugs: { en: "x".repeat(101) } }))
          .status,
      ).toBe(422);
      expect((await call("editor", about, { parent: "1; drop" })).status).toBe(
        400,
      );
      expect((await call("editor", about, { parent: { id: 1 } })).status).toBe(
        400,
      );
    });

    it("refuses a parent from another company", async () => {
      const about = String((await findPage("about-us")).id);
      const foreign = await findPage("about-us", tenantId.indoacid);
      const { status } = await call("editor", about, {
        parent: String(foreign.id),
      });
      expect(status).toBe(422);
    });

    it("returns exactly the counters the cascade would use", async () => {
      const about = await findPage("about-us");
      const { body } = await call("editor", String(about.id), {
        slugs: { en: "about" },
      });
      const direct = await previewPathChange(
        payload,
        { collection: "pages", id: about.id },
        { slugs: { en: "about" } },
      );
      expect(body.published).toBe(true);
      expect(body.childPages).toBe(4);
      expect(body.childPages).toBe(direct.childPages);
      expect(body.records).toBe(direct.records);
      expect(body.redirects).toBe(direct.redirects);
      expect(body.overLimit).toBe(false);
      expect(body.urls).toEqual(direct.urls);
      expect(body.urls.find((url) => url.locale === "en")).toEqual({
        locale: "en",
        from: "/about-us",
        to: "/about",
      });
      expect(body.redirects).toBeGreaterThanOrEqual(5);
      expect(body.linkCount).toBe(
        direct.links.filter(
          (link) =>
            link.tenant === null || link.tenant === String(tenantId.duniakimia),
        ).length,
      );
    });

    it("counts a move to a new parent", async () => {
      const about = await findPage("about-us");
      const sustainability = await findPage("sustainability");
      const { body } = await call("editor", String(sustainability.id), {
        parent: String(about.id),
      });
      const direct = await previewPathChange(
        payload,
        { collection: "pages", id: sustainability.id },
        { parent: about.id },
      );
      expect(body.urls.find((url) => url.locale === "en")?.to).toBe(
        "/about-us/sustainability",
      );
      expect(body.redirects).toBe(direct.redirects);
      expect(body.childPages).toBe(0);
    });

    it("counts the records and refuses over the limit exactly as the cascade does", async () => {
      const page = await makePage(tenantId.duniakimia, "impact-records", true);
      const recordMove = (index: number): RecordMove => ({
        collection: "jobs",
        id: `job-${index}`,
        tenant: String(tenantId.duniakimia),
        published: true,
        moves: [{ locale: "en", from: "/a", to: "/b" }],
        apply: async () => undefined,
      });
      let count = 3;
      const source: RecordMoveSource = async () =>
        Array.from({ length: count }, (_, index) => recordMove(index));
      recordMoveSources.push(source);
      try {
        const small = await call("editor", String(page.id), {
          slugs: { en: "impact-records-new" },
        });
        const direct = await previewPathChange(
          payload,
          { collection: "pages", id: page.id },
          { slugs: { en: "impact-records-new" } },
        );
        expect(small.body.records).toBe(3);
        expect(small.body.redirects).toBe(direct.redirects);
        expect(small.body.overLimit).toBe(false);
        count = CASCADE_LIMIT + 1;
        const big = await call("editor", String(page.id), {
          slugs: { en: "impact-records-new" },
        });
        expect(big.body.overLimit).toBe(true);
        expect(big.body.message).toBe(
          `This change would move ${CASCADE_LIMIT + 1} pages and records. One change can move up to ${CASCADE_LIMIT}. Move some child pages first, then try again.`,
        );
      } finally {
        recordMoveSources.splice(recordMoveSources.indexOf(source), 1);
      }
    });

    it("says a never-published draft is not live", async () => {
      const draft = await makePage(tenantId.duniakimia, "impact-draft", false);
      const { body } = await call("editor", String(draft.id), {
        slugs: { en: "impact-draft-new" },
      });
      expect(body.published).toBe(false);
      expect(body.redirects).toBe(0);
    });

    it("decides on the published page, not the newer draft", async () => {
      const page = await makePage(tenantId.duniakimia, "impact-live", true);
      await payload.update({
        collection: "pages",
        id: page.id,
        locale: "en",
        depth: 0,
        draft: true,
        data: { slug: "impact-live-draft" } as never,
      });
      const { body } = await call("editor", String(page.id), {
        slugs: { en: "impact-live-next" },
      });
      expect(body.published).toBe(true);
      expect(body.urls.find((url) => url.locale === "en")).toEqual({
        locale: "en",
        from: "/impact-live",
        to: "/impact-live-next",
      });
      expect(body.redirects).toBeGreaterThan(0);
    });

    it("says a page unpublished back to draft is not live", async () => {
      const page = await makePage(tenantId.duniakimia, "impact-unpub", true);
      await payload.update({
        collection: "pages",
        id: page.id,
        locale: "en",
        depth: 0,
        draft: false,
        data: { _status: "draft" } as never,
      });
      const { body } = await call("editor", String(page.id), {
        slugs: { en: "impact-unpub-next" },
      });
      expect(body.published).toBe(false);
    });

    it("says a trashed page is not live", async () => {
      const page = await makePage(tenantId.duniakimia, "impact-trashed", true);
      await payload.update({
        collection: "pages",
        id: page.id,
        depth: 0,
        trash: true,
        data: { deletedAt: new Date().toISOString() } as never,
      });
      const { status, body } = await call("editor", String(page.id), {
        slugs: { en: "impact-trashed-next" },
      });
      expect(status).toBe(200);
      expect(body.published).toBe(false);
    });
  },
);
