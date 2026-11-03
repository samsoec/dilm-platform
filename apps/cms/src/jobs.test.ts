import type { Payload, PayloadRequest, Where } from "payload";
import { afterEach, describe, expect, it } from "vitest";

import { Jobs, JOB_TYPES, EXPERIENCE_LEVELS } from "./collections/Jobs";
import {
  countSuggestions,
  isListed,
  jobSuggestionsHandler,
  listedWhere,
} from "./jobs";
import { validatePageSlug, computePaths } from "./paths";
import { jobBaseSources } from "./recordBases";
import { ROUTABLE_COLLECTIONS, routeRows } from "./routeIndex";
import { accessAs, applyMultiTenant, findField, testUser } from "./testing";
import { Documents } from "./collections/Documents";
import { Tenants } from "./collections/Tenants";
import { Users } from "./collections/Users";

const NOW = new Date("2026-11-03T08:00:00.000Z");
const PAST = "2026-11-01T12:00:00.000Z";
const FUTURE = "2026-11-20T12:00:00.000Z";

describe("which jobs are listed (FR-PM-41)", () => {
  const open = { _status: "published", status: "open" };

  it("lists a published open job with no closing date", () => {
    expect(isListed(open, NOW)).toBe(true);
    expect(isListed({ ...open, closingDate: null }, NOW)).toBe(true);
  });

  it("lists a published open job that closes in the future", () => {
    expect(isListed({ ...open, closingDate: FUTURE }, NOW)).toBe(true);
  });

  it("stops listing once the closing date has passed", () => {
    expect(isListed({ ...open, closingDate: PAST }, NOW)).toBe(false);
  });

  it("does not list a closed job, even with a future closing date", () => {
    expect(
      isListed({ ...open, status: "closed", closingDate: FUTURE }, NOW),
    ).toBe(false);
  });

  it("does not list a draft, however open it is", () => {
    expect(isListed({ ...open, _status: "draft" }, NOW)).toBe(false);
  });

  it("builds the same rule as a query", () => {
    expect(listedWhere(NOW)).toEqual({
      and: [
        { _status: { equals: "published" } },
        { status: { equals: "open" } },
        {
          or: [
            { closingDate: { exists: false } },
            { closingDate: { greater_than: NOW.toISOString() } },
          ],
        },
      ],
    });
  });

  it("keeps a closed or expired job's page indexed so shared links work", () => {
    expect(
      routeRows("jobs", {
        id: 1,
        _status: "published",
        tenant: 2,
        path: { en: "/careers/data-analyst", id: "/karier/analis-data" },
      }),
    ).toEqual([
      { tenant: "2", locale: "en", path: "/careers/data-analyst", refs: [] },
      { tenant: "2", locale: "id", path: "/karier/analis-data", refs: [] },
    ]);
    expect(ROUTABLE_COLLECTIONS).toContain("jobs");
  });
});

describe("department and location suggestions (JB-01)", () => {
  it("counts the distinct values and sorts by use", () => {
    expect(
      countSuggestions([
        { department: "Engineering", location: "Jakarta" },
        { department: "Engineering", location: "Surabaya" },
        { department: "Engineering", location: "Jakarta" },
        { department: "Finance", location: "Jakarta" },
      ]),
    ).toEqual({
      department: [
        { value: "Engineering", count: 3 },
        { value: "Finance", count: 1 },
      ],
      location: [
        { value: "Jakarta", count: 3 },
        { value: "Surabaya", count: 1 },
      ],
    });
  });

  it("merges spellings that differ only in case or spacing, and skips blanks", () => {
    expect(
      countSuggestions([
        { department: "Engineering" },
        { department: " engineering " },
        { department: "" },
        { department: null },
        {},
      ]).department,
    ).toEqual([{ value: "Engineering", count: 2 }]);
  });

  type Doc = { tenant: number; department: string; location: string };

  function request(
    user: object | null,
    query: Record<string, string>,
    docs: Doc[],
  ) {
    const calls: Where[] = [];
    const payload = {
      find: async (args: { where: { tenant: { equals: string } } }) => {
        calls.push(args.where);
        return {
          docs: docs.filter(
            (doc) => String(doc.tenant) === args.where.tenant.equals,
          ),
        };
      },
    } as unknown as Payload;
    return {
      req: { user, query, payload } as unknown as PayloadRequest,
      calls,
    };
  }

  const docs: Doc[] = [
    { tenant: 1, department: "Engineering", location: "Jakarta" },
    { tenant: 1, department: "Engineering", location: "Bandung" },
    { tenant: 2, department: "Engineering", location: "Surabaya" },
    { tenant: 2, department: "Laboratory", location: "Surabaya" },
  ];

  it("returns only the values the asked-for company uses", async () => {
    const { req } = request(
      testUser(["tenant-editor"], [1]),
      { tenant: "1" },
      docs,
    );
    const response = await jobSuggestionsHandler(req);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      department: [{ value: "Engineering", count: 2 }],
      location: [
        { value: "Bandung", count: 1 },
        { value: "Jakarta", count: 1 },
      ],
    });
  });

  it("never mixes in another company's values", async () => {
    const { req } = request(
      testUser(["tenant-viewer"], [2]),
      { tenant: "2" },
      docs,
    );
    const body = await (await jobSuggestionsHandler(req)).json();
    expect(body.department).toEqual([
      { value: "Engineering", count: 1 },
      { value: "Laboratory", count: 1 },
    ]);
    expect(JSON.stringify(body)).not.toContain("Jakarta");
  });

  it("refuses a company the user does not belong to", async () => {
    const { req, calls } = request(
      testUser(["tenant-editor"], [1]),
      { tenant: "2" },
      docs,
    );
    expect((await jobSuggestionsHandler(req)).status).toBe(403);
    expect(calls).toEqual([]);
  });

  it("lets a Super Admin ask for any company", async () => {
    const { req } = request(testUser(["super-admin"]), { tenant: "2" }, docs);
    expect((await jobSuggestionsHandler(req)).status).toBe(200);
  });

  it("refuses a visitor and a request with no company", async () => {
    expect(
      (await jobSuggestionsHandler(request(null, { tenant: "1" }, docs).req))
        .status,
    ).toBe(401);
    expect(
      (
        await jobSuggestionsHandler(
          request(testUser(["super-admin"]), {}, docs).req,
        )
      ).status,
    ).toBe(400);
  });
});

describe("the jobs collection (§4.6.3)", () => {
  it("has every field of the table", () => {
    for (const name of [
      "title",
      "summary",
      "department",
      "experienceLevel",
      "jobType",
      "location",
      "postedDate",
      "closingDate",
      "status",
      "body",
      "slug",
      "path",
      "order",
    ]) {
      expect(findField(Jobs.fields, name), name).toBeDefined();
    }
  });

  it("localizes the fields marked L only", () => {
    for (const name of [
      "title",
      "summary",
      "department",
      "location",
      "body",
      "slug",
      "path",
    ]) {
      expect(findField(Jobs.fields, name)).toMatchObject({ localized: true });
    }
    for (const name of [
      "experienceLevel",
      "jobType",
      "postedDate",
      "closingDate",
      "status",
    ]) {
      expect(findField(Jobs.fields, name)).not.toMatchObject({
        localized: true,
      });
    }
  });

  it("offers the listed levels and types", () => {
    expect(EXPERIENCE_LEVELS.map((option) => option.value)).toEqual([
      "entry",
      "mid",
      "senior",
      "lead",
    ]);
    expect(JOB_TYPES.map((option) => option.value)).toEqual([
      "full-time",
      "part-time",
      "contract",
      "internship",
    ]);
    expect(findField(Jobs.fields, "status")).toMatchObject({
      defaultValue: "open",
      required: true,
    });
  });

  it("defaults the posted date to today", () => {
    const field = findField(Jobs.fields, "postedDate") as {
      defaultValue: () => string;
    };
    expect(field.defaultValue().slice(0, 10)).toBe(
      new Date().toISOString().slice(0, 10),
    );
  });

  it("keeps drafts, versions and trash on", () => {
    expect(Jobs.versions).toMatchObject({ drafts: true });
    expect(Jobs.trash).toBe(true);
  });

  it("scopes every operation to the company of the user", async () => {
    const collection = (
      await applyMultiTenant([Users, Tenants, Documents, Jobs])
    )("jobs");
    expect(findField(collection.fields, "tenant")).toMatchObject({
      relationTo: "tenants",
    });
    expect(
      await accessAs(collection, "read", testUser(["tenant-viewer"], [1])),
    ).toEqual({ tenant: { in: [1] } });
    expect(
      await accessAs(collection, "update", testUser(["tenant-editor"], [1])),
    ).toEqual({ tenant: { in: [1] } });
    expect(
      await accessAs(collection, "update", testUser(["tenant-viewer"], [1])),
    ).toBe(false);
  });
});

describe("job paths", () => {
  type Row = {
    collection: string;
    id: number;
    title: string;
    tenant: number;
    path: Record<string, string>;
  };

  function fakePayload(rows: Row[]) {
    return {
      find: async (args: {
        collection: string;
        locale: string;
        where: Where;
      }) => {
        if (args.collection === "tenants") {
          return {
            docs: [
              { id: 1, name: "DKU" },
              { id: 2, name: "IndoAcid" },
            ],
          };
        }
        const clauses = (
          args.where as { and: Record<string, Record<string, unknown>>[] }
        ).and;
        let docs = rows.filter((row) => row.collection === args.collection);
        for (const clause of clauses) {
          if (clause.path) {
            docs = docs.filter(
              (row) => row.path[args.locale] === clause.path.equals,
            );
          }
          if (clause.tenant) {
            docs = docs.filter(
              (row) => String(row.tenant) === String(clause.tenant.equals),
            );
          }
          if (clause.id) {
            docs = docs.filter(
              (row) => String(row.id) !== clause.id.not_equals,
            );
          }
        }
        return { docs };
      },
      count: async () => ({ totalDocs: 2 }),
    } as unknown as Payload;
  }

  afterEach(() => {
    delete jobBaseSources.career;
  });

  function careerBase() {
    jobBaseSources.career = async ({ tenant }) =>
      tenant === "1"
        ? { en: "/careers", id: "/karier" }
        : { en: "/join-us", id: "/bergabung" };
  }

  it("is the career page path of the job's company plus the slug", async () => {
    careerBase();
    expect(
      await computePaths(fakePayload([]), {
        collection: "jobs",
        tenant: 1,
        slugs: { en: "data-analyst", id: "analis-data" },
      }),
    ).toEqual({ en: "/careers/data-analyst", id: "/karier/analis-data" });
    expect(
      await computePaths(fakePayload([]), {
        collection: "jobs",
        tenant: 2,
        slugs: { en: "data-analyst" },
      }),
    ).toEqual({
      en: "/join-us/data-analyst",
      id: "/bergabung/data-analyst",
    });
  });

  it("leaves the path empty while a draft has no slug", async () => {
    careerBase();
    expect(
      await computePaths(fakePayload([]), {
        collection: "jobs",
        tenant: 1,
        slugs: {},
      }),
    ).toEqual({ en: "", id: "" });
  });

  it("rejects a slug the same company's other job uses", async () => {
    careerBase();
    const payload = fakePayload([
      {
        collection: "jobs",
        id: 5,
        title: "Data Analyst",
        tenant: 1,
        path: { en: "/careers/data-analyst", id: "/karier/data-analyst" },
      },
    ]);
    const { problems } = await validatePageSlug(payload, {
      collection: "jobs",
      id: 6,
      tenant: 1,
      slugs: { en: "data-analyst" },
    });
    expect(problems.map((problem) => problem.message)).toEqual([
      '/careers/data-analyst is already used by "Data Analyst" on DKU. Pick another slug.',
      '/karier/data-analyst is already used by "Data Analyst" on DKU. Pick another slug.',
    ]);
  });

  it("lets another company reuse the slug and the job keep its own", async () => {
    careerBase();
    const payload = fakePayload([
      {
        collection: "jobs",
        id: 5,
        title: "Data Analyst",
        tenant: 2,
        path: { en: "/careers/data-analyst", id: "/karier/data-analyst" },
      },
    ]);
    expect(
      (
        await validatePageSlug(payload, {
          collection: "jobs",
          tenant: 1,
          slugs: { en: "data-analyst" },
        })
      ).problems,
    ).toEqual([]);
    expect(
      (
        await validatePageSlug(payload, {
          collection: "jobs",
          id: 5,
          tenant: 2,
          slugs: { en: "data-analyst" },
        })
      ).problems,
    ).toEqual([]);
  });
});
