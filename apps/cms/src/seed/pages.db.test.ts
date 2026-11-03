import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";

import { TENANT_SLUGS, type TenantSlug } from "@dilm/shared-types";
import type { CollectionSlug, Payload } from "payload";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { isConsentEmpty } from "../blocks/consentForm";
import { linkedPageIds } from "../siteMessages";
import { placeholderFilename, seedPages, type SeedPagesResult } from "./pages";
import { seedTenants } from "./tenants";

const database = process.env.SEED_TEST_DATABASE;

type Block = {
  blockType: string;
  source?: unknown;
  limit?: unknown;
  layout?: unknown;
  categories?: unknown;
  backgroundImage?: unknown;
  points?: unknown[];
  form?: { consentText?: unknown };
};

type Doc = {
  id: number;
  title: string;
  slug: string;
  path?: string;
  name?: string;
  filename?: string;
  parent?: number;
  recordType?: string;
  deletedAt?: string | null;
  updatedAt?: string;
  _status: string;
  layout: Block[];
  redirectTo: { reference?: unknown };
  routing: { careerPage?: number; publicationPage?: number };
  notFound: { title?: string };
  cookieBanner: { body?: unknown };
};

const TENANT_PAGES = [
  "/about-us",
  "/about-us/overview",
  "/about-us/our-journey",
  "/about-us/awards-and-certifications",
  "/about-us/management-system",
  "/sustainability",
  "/investor-relations",
  "/career",
  "/contact-us",
  "/publication",
  "/terms-and-conditions",
  "/privacy-policy",
  "/cookie-policy",
];

const DRAFT_PATHS = ["/privacy-policy"];

describe.skipIf(!database)(
  "seed:pages against a scratch database",
  { timeout: 600_000 },
  () => {
    let payload: Payload;
    let storage: Server;
    let first: SeedPagesResult;
    const tenantId = {} as Record<TenantSlug, number>;

    const find = async (
      collection: CollectionSlug,
      where: Record<string, unknown> = {},
      locale = "en",
    ): Promise<Doc[]> =>
      (
        await payload.find({
          collection,
          where: where as never,
          locale: locale as "en",
          draft: true,
          fallbackLocale: false,
          depth: 0,
          pagination: false,
          trash: true,
        })
      ).docs as unknown as Doc[];

    const page = async (tenant: TenantSlug, path: string, locale = "en") =>
      (
        await find(
          "pages",
          { tenant: { equals: tenantId[tenant] }, path: { equals: path } },
          locale,
        )
      )[0]!;

    const shared = async (path: string, locale = "en") =>
      (await find("shared-pages", { path: { equals: path } }, locale))[0]!;

    const blockTypes = (doc: Doc) =>
      (doc.layout as { blockType: string }[]).map(({ blockType }) => blockType);

    async function stamps() {
      const out: Record<string, unknown> = {};
      for (const collection of [
        "pages",
        "shared-pages",
        "detail-templates",
        "shared-detail-templates",
        "site-messages",
        "tenant-settings",
        "categories",
        "media",
      ] as CollectionSlug[]) {
        const docs = await find(collection);
        out[collection] = docs.map(({ id, updatedAt }) => [id, updatedAt]);
      }
      for (const collection of [
        "pages",
        "shared-pages",
        "detail-templates",
        "shared-detail-templates",
      ] as CollectionSlug[]) {
        out[`${collection} versions`] = (
          await payload.countVersions({ collection })
        ).totalDocs;
      }
      out["site-routing"] = (
        await payload.findGlobal({ slug: "site-routing", depth: 0 })
      ).updatedAt;
      return out;
    }

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
      const { default: config } = await import("../payload.config");
      payload = await getPayload({ config });
      await seedTenants(payload);
      const { docs } = await payload.find({
        collection: "tenants",
        pagination: false,
      });
      for (const tenant of docs)
        tenantId[tenant.slug as TenantSlug] = tenant.id;
      first = await seedPages(payload);
    }, 600_000);

    afterAll(async () => {
      await payload?.destroy();
      await new Promise((resolve) => storage?.close(resolve));
    });

    it("creates everything on the first run", () => {
      expect(first.missingTenants).toEqual([]);
      expect(Object.values(first.outcomes)).not.toContain(undefined);
      expect(
        Object.entries(first.outcomes).filter(
          ([, outcome]) => outcome !== "created",
        ),
      ).toEqual([]);
    });

    it("creates the shared pages, categories and base routing", async () => {
      const pages = await find("shared-pages");
      expect(pages.map(({ path }) => path).sort()).toEqual([
        "/",
        "/products-and-solutions",
        "/products-and-solutions/products",
        "/products-and-solutions/solutions",
      ]);
      const home = await shared("/");
      expect(home.title).toBe("Home");
      expect(home._status).toBe("draft");
      for (const path of [
        "/products-and-solutions",
        "/products-and-solutions/products",
        "/products-and-solutions/solutions",
      ]) {
        expect((await shared(path))._status).toBe("published");
      }
      expect(
        blockTypes(await shared("/products-and-solutions/products")),
      ).toEqual([
        "pageHero",
        "productShowcase",
        "productShowcase",
        "certifications",
        "solutionShowcase",
      ]);
      const container = await shared("/products-and-solutions");
      expect(container.redirectTo.reference).toEqual({
        relationTo: "shared-pages",
        value: (await shared("/products-and-solutions/products")).id,
      });
      const routing = await payload.findGlobal({
        slug: "site-routing",
        depth: 0,
      });
      expect(routing.productsPage).toBe(
        (await shared("/products-and-solutions/products")).id,
      );
      expect(routing.solutionsPage).toBe(
        (await shared("/products-and-solutions/solutions")).id,
      );
      expect((await find("categories")).map(({ name }) => name).sort()).toEqual(
        ["Company News", "Events & Activities", "Sustainability"],
      );
      expect(
        (await find("categories", {}, "id")).map(({ name }) => name).sort(),
      ).toEqual(["Company News", "Events & Activities", "Sustainability"]);
    });

    it("creates the shared product and solution templates in the FR-PM-47 order", async () => {
      const templates = await find("shared-detail-templates");
      const byType = Object.fromEntries(
        templates.map((doc) => [doc.recordType, doc]),
      );
      expect(Object.keys(byType).sort()).toEqual(["product", "solution"]);
      expect(blockTypes(byType.product!)).toEqual([
        "recordHero",
        "productOverview",
        "productSpecifications",
        "productApplications",
        "entityMap",
        "testimonials",
      ]);
      expect(blockTypes(byType.solution!)).toEqual([
        "recordHero",
        "solutionImpact",
        "solutionApplications",
        "entityMap",
        "testimonials",
      ]);
      expect(templates.every(({ _status }) => _status === "published")).toBe(
        true,
      );
    });

    it.each(TENANT_SLUGS)(
      "seeds %s with its pages, templates, settings and messages",
      async (slug) => {
        const own = { tenant: { equals: tenantId[slug] } };
        const pages = await find("pages", own);
        expect(pages.map(({ path }) => path).sort()).toEqual(
          [...TENANT_PAGES].sort(),
        );
        for (const doc of pages) {
          expect(doc._status).toBe(
            DRAFT_PATHS.includes(doc.path!) ? "draft" : "published",
          );
        }
        expect(blockTypes(await page(slug, "/publication"))).toEqual([
          "publicationHero",
          "postListing",
        ]);
        expect(blockTypes(await page(slug, "/terms-and-conditions"))).toEqual([
          "articleHeader",
          "richText",
        ]);
        expect(blockTypes(await page(slug, "/career"))).toEqual([
          "pageHero",
          "featureGrid",
          "jobListing",
        ]);

        const about = await page(slug, "/about-us");
        expect(about.redirectTo.reference).toEqual({
          relationTo: "pages",
          value: (await page(slug, "/about-us/overview")).id,
        });
        expect((await page(slug, "/about-us/overview")).parent).toBe(about.id);

        const templates = await find("detail-templates", own);
        expect(
          Object.fromEntries(
            templates.map((doc) => [doc.recordType, blockTypes(doc)]),
          ),
        ).toEqual({
          job: ["recordHero", "jobDetail", "jobShowcase"],
          post: ["recordHero", "postArticle"],
          category: ["publicationHero", "postListing"],
        });

        const [settings] = await find("tenant-settings", own);
        expect(settings!.routing.careerPage).toBe(
          (await page(slug, "/career")).id,
        );
        expect(settings!.routing.publicationPage).toBe(
          (await page(slug, "/publication")).id,
        );

        const messages = await find("site-messages", own);
        expect(messages).toHaveLength(1);
        const cookie = (await page(slug, "/cookie-policy")).id;
        for (const locale of ["en", "id"]) {
          const [doc] = await find("site-messages", own, locale);
          expect(doc!.notFound.title).toBe("Looks Like This Page Is Missing");
          expect(linkedPageIds(doc!.cookieBanner.body)).toEqual([
            String(cookie),
          ]);
        }
      },
    );

    it("copies the English text to Indonesian", async () => {
      for (const slug of TENANT_SLUGS) {
        for (const path of TENANT_PAGES) {
          const en = await page(slug, path);
          const id = await page(slug, path, "id");
          expect(id.title).toBe(en.title);
          expect(id.slug).toBe(en.slug);
          expect(id.layout ?? []).toEqual(en.layout ?? []);
        }
      }
      const [en] = await find("shared-pages", { path: { equals: "/" } });
      const [id] = await find("shared-pages", { path: { equals: "/" } }, "id");
      expect(id!.layout).toEqual(en!.layout);
    });

    it("gives every consent form its text in both languages", async () => {
      const contact = async (locale: string) =>
        (await page("duniakimia", "/contact-us", locale)).layout.find(
          (block: { blockType: string }) =>
            block.blockType === "contactInquiry",
        );
      const job = async (locale: string) =>
        (
          await find(
            "detail-templates",
            { recordType: { equals: "job" } },
            locale,
          )
        )[0]!.layout.find(
          (block: { blockType: string }) => block.blockType === "jobDetail",
        );
      for (const locale of ["en", "id"]) {
        expect(isConsentEmpty((await contact(locale))!.form!.consentText)).toBe(
          false,
        );
        expect(isConsentEmpty((await job(locale))!.form!.consentText)).toBe(
          false,
        );
      }
    });

    it("lists the latest Sustainability stories on the Sustainability page", async () => {
      const [sustainability] = await find("categories", {
        slug: { equals: "sustainability" },
      });
      const showcases = (
        await page("likutelaga", "/sustainability")
      ).layout.filter(
        (block: { blockType: string }) => block.blockType === "postShowcase",
      );
      expect(
        showcases.map((block: Block) => [
          block.source,
          block.limit,
          block.layout,
        ]),
      ).toEqual([
        ["latest", 3, "overlay"],
        ["latest", 4, "featured"],
      ]);
      for (const block of showcases) {
        expect(block.categories).toEqual([sustainability!.id]);
      }
    });

    it("uses a placeholder photo only where the schema demands one", async () => {
      const media = await find("media");
      expect(media.map(({ filename }) => filename).sort()).toEqual(
        TENANT_SLUGS.map(placeholderFilename).sort(),
      );
      const heroes = (await page("duniakimia", "/career")).layout[0];
      expect(heroes.backgroundImage).toBeTypeOf("number");
      const overview = (await page("duniakimia", "/about-us/overview")).layout;
      const mediaText = overview.find(
        (block: { blockType: string }) => block.blockType === "mediaText",
      );
      expect(mediaText!.points ?? []).toEqual([]);
    });

    it("changes nothing when run again", async () => {
      const before = await stamps();
      const second = await seedPages(payload);
      expect(
        Object.entries(second.outcomes).filter(
          ([, outcome]) => outcome !== "skipped",
        ),
      ).toEqual([]);
      expect(Object.keys(second.outcomes).sort()).toEqual(
        Object.keys(first.outcomes).sort(),
      );
      expect(await stamps()).toEqual(before);
    });

    it("never overwrites a document an editor has changed", async () => {
      const overview = await page("indoacid", "/about-us/overview");
      await payload.update({
        collection: "pages",
        id: overview.id,
        locale: "en",
        depth: 0,
        draft: false,
        data: { title: "Who we are" },
      });
      const privacy = await page("indoacid", "/privacy-policy");
      await payload.update({
        collection: "pages",
        id: privacy.id,
        depth: 0,
        draft: true,
        data: { deletedAt: new Date().toISOString() },
      });
      const before = await stamps();

      const again = await seedPages(payload);

      expect((await page("indoacid", "/about-us/overview")).title).toBe(
        "Who we are",
      );
      expect(again.outcomes["pages:indoacid:/privacy-policy"]).toBe("skipped");
      expect(
        (await page("indoacid", "/privacy-policy")).deletedAt,
      ).toBeTruthy();
      expect(await stamps()).toEqual(before);
    });
  },
);
