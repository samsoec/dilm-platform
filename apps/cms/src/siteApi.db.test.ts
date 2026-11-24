import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";

import type { Payload } from "payload";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { PRIVACY_POLICY_VERSION_START } from "./consent/privacyPolicyVersion";
import { findPublished, readSiteTenant } from "./siteApi";
import { seedTenants } from "./seed/tenants";

const PDF = Buffer.from(
  "%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 10 10] >>\nendobj\nxref\n0 1\n0000000000 65535 f \ntrailer\n<< /Root 1 0 R >>\n%%EOF\n",
);

const database = process.env.SEED_TEST_DATABASE;

describe.skipIf(!database)(
  "site API reads against a scratch database",
  { timeout: 600_000 },
  () => {
    let payload: Payload;
    let storage: Server;
    const tenantId: Record<string, number> = {};

    const createIr = (
      tenant: string,
      title: string,
      status: "draft" | "published",
      locale = "en",
    ) =>
      payload.create({
        collection: "ir-documents",
        data: {
          tenant: tenantId[tenant],
          title,
          documentType: "annual-report",
          locale,
          publishedDate: "2025-01-01T00:00:00.000Z",
          _status: status,
        } as never,
        file: {
          data: PDF,
          mimetype: "application/pdf",
          name: `${title}.pdf`,
          size: PDF.length,
        },
        draft: status === "draft",
        overrideAccess: true,
      });

    beforeAll(async () => {
      if (database === "dilm") {
        throw new Error("Refusing to seed the shared dev database.");
      }
      storage = createServer((request, response) => {
        request.resume();
        request.on("end", () => {
          response.statusCode = 200;
          response.setHeader("ETag", '"site-api-test"');
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
      for (const slug of ["likutelaga", "duniakimia"]) {
        await payload.create({
          collection: "tenant-settings",
          data: {
            tenant: tenantId[slug],
            siteName: `${slug} site`,
            privacyPolicyVersion: PRIVACY_POLICY_VERSION_START,
            analyticsId:
              slug === "likutelaga" ? "G-LIKU123456" : "G-DUNIA12345",
            defaultSeo: {
              title: `${slug} title`,
              description: `${slug} blurb`,
            },
          } as never,
          overrideAccess: true,
        });
      }
    }, 600_000);

    afterAll(async () => {
      await payload?.destroy();
      await new Promise((resolve) => storage?.close(resolve));
    });

    it("returns the SEO defaults and analytics ID of one tenant", async () => {
      const tenant = await readSiteTenant(payload, {
        tenant: "likutelaga",
        locale: "en",
      });
      expect(tenant).toEqual({
        tenant: "likutelaga",
        locale: "en",
        seo: {
          title: "likutelaga title",
          description: "likutelaga blurb",
          ogImageUrl: null,
        },
        analyticsId: "G-LIKU123456",
      });
    });

    it("never returns another tenant's settings", async () => {
      const tenant = await readSiteTenant(payload, {
        tenant: "duniakimia",
        locale: "en",
      });
      expect(tenant?.analyticsId).toBe("G-DUNIA12345");
      expect(tenant?.seo.title).toBe("duniakimia title");
    });

    it("answers null for a tenant with no settings", async () => {
      expect(
        await readSiteTenant(payload, { tenant: "indoacid", locale: "en" }),
      ).toBeNull();
    });

    it("lists only published, non-trashed IR documents of the tenant and locale", async () => {
      await createIr("likutelaga", "Live", "published");
      await createIr("likutelaga", "Draft only", "draft");
      const trashed = await createIr("likutelaga", "Trashed", "published");
      await payload.update({
        collection: "ir-documents",
        id: trashed.id,
        data: { deletedAt: new Date().toISOString() },
        trash: true,
        overrideAccess: true,
      });
      await createIr("likutelaga", "Indonesian", "published", "id");
      await createIr("duniakimia", "Other tenant", "published");

      const { docs } = await findPublished(payload, "ir-documents", {
        tenant: "likutelaga",
        locale: "en",
      });
      expect(docs.map((doc) => doc.title)).toEqual(["Live"]);
    });
  },
);
