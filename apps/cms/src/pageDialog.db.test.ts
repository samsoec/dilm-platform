import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";

import type { Payload, PayloadRequest } from "payload";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
  checkSlugHandler,
  createDraftHandler,
  parentOptionsHandler,
} from "./pageDialog";
import { seedPages } from "./seed/pages";
import { seedTenants } from "./seed/tenants";

const database = process.env.SEED_TEST_DATABASE;

type ApiBody = {
  ok: boolean;
  id: number;
  message: string;
  indonesianSlug: string;
  paths: Record<string, string>;
  problems: {
    field: string;
    kind: string;
    message: string;
    open?: { collection: string; id: string };
  }[];
  options: {
    id: string;
    title: string;
    shared: boolean;
    collection: string;
    paths: Record<string, string>;
  }[];
};

type Doc = Record<string, unknown> & { id: number };

describe.skipIf(!database)(
  "new page dialog endpoints against a scratch database",
  { timeout: 600_000 },
  () => {
    let payload: Payload;
    let storage: Server;
    const tenantId: Record<string, number> = {};
    const users: Record<string, unknown> = {};

    const call = async (
      handler: (req: PayloadRequest) => Promise<Response> | Response,
      as: string,
      options: { body?: unknown; query?: Record<string, string> } = {},
    ) => {
      const req = {
        payload,
        user: users[as],
        query: options.query ?? {},
        json: async () => options.body,
        t: (key: string) => key,
        locale: "en",
      } as unknown as PayloadRequest;
      const response = await handler(req);
      return {
        status: response.status,
        body: (await response.json()) as ApiBody,
      };
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

    const dunia = () => String(tenantId.duniakimia);
    const find = async (where: Record<string, unknown>) =>
      (
        await payload.find({
          collection: "pages",
          where: where as never,
          draft: true,
          depth: 0,
          trash: true,
          pagination: false,
          limit: 0,
        })
      ).docs as unknown as Doc[];

    it("lists this company's pages and the shared ones as shared", async () => {
      const { status, body } = await call(parentOptionsHandler, "editor", {
        query: { tenant: dunia() },
      });
      expect(status).toBe(200);
      const options = body.options as {
        title: string;
        shared: boolean;
        collection: string;
        paths: Record<string, string>;
      }[];
      expect(options.some((option) => !option.shared)).toBe(true);
      expect(options.filter((option) => option.shared).length).toBeGreaterThan(
        0,
      );
      expect(
        options
          .filter((option) => option.shared)
          .every((option) => option.collection === "shared-pages"),
      ).toBe(true);
      expect(options.find((option) => option.shared)?.paths.en).toBeTruthy();
    });

    it("refuses viewers, outsiders and anonymous callers", async () => {
      const query = { tenant: dunia() };
      expect(
        (await call(parentOptionsHandler, "viewer", { query })).status,
      ).toBe(403);
      expect(
        (await call(parentOptionsHandler, "outsider", { query })).status,
      ).toBe(403);
      expect(
        (await call(parentOptionsHandler, "nobody", { query })).status,
      ).toBe(401);
      const body = { tenant: dunia(), slugs: { en: "fresh" } };
      expect((await call(checkSlugHandler, "viewer", { body })).status).toBe(
        403,
      );
      expect(
        (
          await call(createDraftHandler, "viewer", {
            body: { ...body, title: "X" },
          })
        ).status,
      ).toBe(403);
      expect(
        (
          await call(createDraftHandler, "outsider", {
            body: { ...body, title: "X" },
          })
        ).status,
      ).toBe(403);
      expect(await find({ slug: { equals: "fresh" } })).toHaveLength(0);
    });

    it("reports the four PG-02 problems", async () => {
      const root = await call(checkSlugHandler, "editor", {
        body: { tenant: dunia(), slugs: { en: "", id: "" } },
      });
      expect(root.body.problems).toEqual([
        expect.objectContaining({
          kind: "root",
          field: "slug-en",
          message: "The root URL / is the shared Home. Give this page a slug.",
        }),
      ]);

      const reserved = await call(checkSlugHandler, "editor", {
        body: { tenant: dunia(), slugs: { en: "media", id: "" } },
      });
      expect(reserved.body.ok).toBe(false);
      expect(reserved.body.problems[0]).toMatchObject({
        kind: "reserved",
        message:
          "URLs can't start with a reserved word: category, kategori, api, admin, _next, media.",
      });

      const options = (
        await call(parentOptionsHandler, "editor", {
          query: { tenant: dunia() },
        })
      ).body.options as {
        title: string;
        shared: boolean;
        paths: Record<string, string>;
      }[];
      const sharedPage = options.find(
        (option) => option.shared && /^\/[a-z0-9-]+$/.test(option.paths.en),
      )!;
      const shared = await call(checkSlugHandler, "editor", {
        body: {
          tenant: dunia(),
          slugs: { en: sharedPage.paths.en.slice(1), id: "" },
        },
      });
      expect(shared.body.problems[0]).toMatchObject({
        kind: "shared",
        message: `${sharedPage.paths.en} is the shared page "${sharedPage.title}", on all 3 sites. Pick another slug.`,
      });

      const taken = await call(checkSlugHandler, "editor", {
        body: { tenant: dunia(), slugs: { en: "about-us", id: "" } },
      });
      expect(taken.body.problems[0]).toMatchObject({
        kind: "same-site",
        field: "slug-en",
        open: { collection: "pages" },
      });
      expect(taken.body.problems[0].message).toMatch(
        /^".+" already uses \/about-us in English\.$/,
      );
    });

    it("lets the same slug through on another company's site", async () => {
      const mine = await call(checkSlugHandler, "outsider", {
        body: { tenant: String(tenantId.indoacid), slugs: { en: "about-us" } },
      });
      expect(mine.body.problems[0]?.kind).toBe("same-site");
      const free = await call(checkSlugHandler, "editor", {
        body: { tenant: dunia(), slugs: { en: "history-of-us", id: "" } },
      });
      expect(free.body).toMatchObject({ ok: true, problems: [] });
      expect(free.body.paths).toEqual({
        en: "/history-of-us",
        id: "/history-of-us",
      });
    });

    it("rejects a parent that belongs to another company", async () => {
      const [foreign] = await find({
        tenant: { equals: tenantId.indoacid },
      });
      const body = {
        tenant: dunia(),
        parent: String(foreign.id),
        slugs: { en: "crafted" },
      };
      expect((await call(checkSlugHandler, "editor", { body })).status).toBe(
        422,
      );
      expect(
        (
          await call(createDraftHandler, "editor", {
            body: { ...body, title: "Crafted" },
          })
        ).status,
      ).toBe(422);
      expect(await find({ slug: { equals: "crafted" } })).toHaveLength(0);
      const junk = await call(checkSlugHandler, "editor", {
        body: { tenant: dunia(), parent: "1 or 1=1", slugs: { en: "x" } },
      });
      expect(junk.status).toBe(400);
    });

    it("creates a draft with both slugs under the chosen parent", async () => {
      const options = (
        await call(parentOptionsHandler, "editor", {
          query: { tenant: dunia() },
        })
      ).body.options as {
        id: string;
        title: string;
        shared: boolean;
        paths: Record<string, string>;
      }[];
      const parent = options.find(
        (option) => !option.shared && option.paths.en === "/about-us",
      )!;
      const created = await call(createDraftHandler, "editor", {
        body: {
          tenant: dunia(),
          parent: parent.id,
          title: "History",
          slugs: { en: "history", id: "sejarah" },
        },
      });
      expect(created.status).toBe(201);
      const page = (await payload.findByID({
        collection: "pages",
        id: created.body.id,
        locale: "all",
        draft: true,
        depth: 0,
      })) as unknown as Doc;
      expect(page._status).toBe("draft");
      expect(page.slug).toEqual({ en: "history", id: "sejarah" });
      expect((page.title as Record<string, string>).en).toBe("History");
      expect(page.path).toEqual({
        en: `${parent.paths.en}/history`,
        id: `${parent.paths.id}/sejarah`,
      });
      expect(String(page.tenant)).toBe(dunia());
      const published = await payload.find({
        collection: "pages",
        where: {
          id: { equals: created.body.id },
          _status: { equals: "published" },
        },
        pagination: false,
      });
      expect(published.docs).toHaveLength(0);

      const again = await call(createDraftHandler, "editor", {
        body: {
          tenant: dunia(),
          parent: parent.id,
          title: "History 2",
          slugs: { en: "history" },
        },
      });
      expect(again.status).toBe(422);
      expect(again.body.problems[0].kind).toBe("same-site");
    });

    it("creates a top-level draft with an English-only slug", async () => {
      const created = await call(createDraftHandler, "editor", {
        body: {
          tenant: dunia(),
          title: "Awards",
          slugs: { en: "awards", id: "" },
        },
      });
      expect(created.status).toBe(201);
      const page = (await payload.findByID({
        collection: "pages",
        id: created.body.id,
        locale: "all",
        draft: true,
        depth: 0,
      })) as unknown as Doc;
      expect(page.path).toEqual({ en: "/awards", id: "/awards" });
      expect(page.slugFallback).toBe(true);
    });
  },
);
