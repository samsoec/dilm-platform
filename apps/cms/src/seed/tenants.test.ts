import { TENANT_DOMAINS, TENANT_SLUGS } from "@dilm/shared-types";
import type { Payload } from "payload";
import { describe, expect, it } from "vitest";

import { seedTenants, TENANT_SEED } from "./tenants";

type TenantData = { slug: string } & Record<string, unknown>;
type StoredTenant = TenantData & { id: number };

function fakePayload(initial: StoredTenant[] = []) {
  const docs = [...initial];
  let nextId = docs.length + 1;
  const writes: string[] = [];

  const payload = {
    find: async ({
      where,
    }: {
      where: { slug: { equals?: string; not_in?: string[] } };
    }) => ({
      docs: docs.filter(({ slug }) =>
        where.slug.equals !== undefined
          ? slug === where.slug.equals
          : !where.slug.not_in!.includes(slug),
      ),
    }),
    create: async ({ data }: { data: TenantData }) => {
      writes.push(`create ${data.slug}`);
      docs.push({ ...data, id: nextId++ });
    },
    update: async ({ id, data }: { id: number; data: TenantData }) => {
      writes.push(`update ${data.slug}`);
      Object.assign(
        docs.find((doc) => doc.id === id)!,
        data,
      );
    },
  };

  return { payload: payload as unknown as Payload, docs, writes };
}

describe("TENANT_SEED", () => {
  it("holds exactly the three tenants the web app routes to", () => {
    expect(TENANT_SEED).toEqual([
      {
        name: "Indonesian Acids Industry",
        slug: "indoacid",
        domain: TENANT_DOMAINS.indoacid,
        defaultLocale: "en",
      },
      {
        name: "Dunia Kimia Utama",
        slug: "duniakimia",
        domain: "duniakimia.com",
        defaultLocale: "en",
      },
      {
        name: "Liku Telaga",
        slug: "likutelaga",
        domain: "likutelaga.com",
        defaultLocale: "en",
      },
    ]);
    expect(TENANT_SEED.map(({ slug }) => slug)).toEqual([...TENANT_SLUGS]);
  });
});

describe("seedTenants", () => {
  it("creates all three tenants on an empty database", async () => {
    const { payload, docs } = fakePayload();

    const result = await seedTenants(payload);

    expect(result).toEqual({
      outcomes: {
        indoacid: "created",
        duniakimia: "created",
        likutelaga: "created",
      },
      unexpectedSlugs: [],
    });
    expect(docs).toHaveLength(3);
  });

  it("writes nothing when run a second time", async () => {
    const { payload, writes } = fakePayload();
    await seedTenants(payload);
    writes.length = 0;

    const result = await seedTenants(payload);

    expect(writes).toEqual([]);
    expect(Object.values(result.outcomes)).toEqual([
      "unchanged",
      "unchanged",
      "unchanged",
    ]);
  });

  it("puts a drifted tenant back to the seeded values", async () => {
    const { payload, docs } = fakePayload([
      {
        id: 1,
        name: "Indo Acid",
        slug: "indoacid",
        domain: "indoacid.com",
        defaultLocale: "id",
      },
    ]);

    const result = await seedTenants(payload);

    expect(result.outcomes.indoacid).toBe("updated");
    expect(docs[0]).toEqual({ id: 1, ...TENANT_SEED[0] });
  });

  it("reports tenants it did not seed and leaves them alone", async () => {
    const stray = {
      id: 1,
      name: "Stray",
      slug: "stray",
      domain: "stray.example",
      defaultLocale: "en",
    };
    const { payload, docs } = fakePayload([stray]);

    const result = await seedTenants(payload);

    expect(result.unexpectedSlugs).toEqual(["stray"]);
    expect(docs).toContainEqual(stray);
  });
});
