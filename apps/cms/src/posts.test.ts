import type { Payload, PayloadRequest, Where } from "payload";
import { describe, expect, it } from "vitest";

import { Categories } from "./collections/Categories";
import { Documents } from "./collections/Documents";
import { Posts } from "./collections/Posts";
import { Tenants } from "./collections/Tenants";
import { Users } from "./collections/Users";
import {
  documentInUseMessage,
  keepLinkedDocuments,
  keepLinkedDocumentsOnDelete,
  publishedPostsAttaching,
} from "./catalog";
import {
  POST_BODY_BLOCKS,
  DOCUMENT_OTHER_COMPANY,
  attachmentBlock,
  imageBlock,
  postBodyField,
  validateSameCompanyDocument,
  validateVideoUrl,
  videoBlock,
} from "./fields/postBody";
import { attachedDocumentIds } from "./postAttachments";
import { validatePageSlug } from "./paths";
import { ROUTABLE_COLLECTIONS, routeRows, writeRouteRows } from "./routeIndex";
import { accessAs, applyMultiTenant, findField, testUser } from "./testing";

const state = (children: unknown[]) => ({
  root: { type: "root", children, direction: "ltr", format: "", indent: 0 },
});

const block = (fields: Record<string, unknown>) => ({
  type: "block",
  version: 2,
  format: "",
  fields: { id: "x", blockName: "", ...fields },
});

describe("the posts collection (§4.6.5)", () => {
  it("has every field of the table", () => {
    for (const name of [
      "title",
      "primaryCategory",
      "publishedAt",
      "coverImage",
      "excerpt",
      "body",
      "slug",
      "path",
    ]) {
      expect(findField(Posts.fields, name), name).toBeDefined();
    }
  });

  it("localizes the fields marked L only", () => {
    for (const name of ["title", "excerpt", "body", "slug", "path"]) {
      expect(findField(Posts.fields, name)).toMatchObject({ localized: true });
    }
    for (const name of ["primaryCategory", "publishedAt", "coverImage"]) {
      expect(findField(Posts.fields, name)).not.toMatchObject({
        localized: true,
      });
    }
  });

  it("requires a primary category from the categories collection", () => {
    expect(findField(Posts.fields, "primaryCategory")).toMatchObject({
      type: "relationship",
      relationTo: "categories",
      required: true,
    });
  });

  it("keeps drafts, versions and trash on", () => {
    expect(Posts.versions).toMatchObject({ drafts: true });
    expect(Posts.trash).toBe(true);
  });

  it("scopes every operation to the company of the user", async () => {
    const collection = (
      await applyMultiTenant([Users, Tenants, Documents, Categories, Posts])
    )("posts");
    expect(findField(collection.fields, "tenant")).toMatchObject({
      relationTo: "tenants",
    });
    expect(
      await accessAs(collection, "update", testUser(["tenant-editor"], [1])),
    ).toEqual({ tenant: { in: [1] } });
    expect(
      await accessAs(collection, "update", testUser(["tenant-viewer"], [1])),
    ).toBe(false);
  });
});

describe("the post body (FR-PM-64)", () => {
  it("is a localized rich text field", () => {
    expect(postBodyField({ name: "body", label: "Body" })).toMatchObject({
      type: "richText",
      localized: true,
    });
  });

  it("offers an image, a video and an attachment block", () => {
    expect(POST_BODY_BLOCKS.map((entry) => entry.slug)).toEqual([
      "image",
      "video",
      "attachment",
    ]);
  });

  it("gives the image block a required picture and an optional caption", () => {
    expect(findField(imageBlock.fields, "image")).toMatchObject({
      type: "upload",
      relationTo: "media",
      required: true,
    });
    expect(findField(imageBlock.fields, "caption")).toMatchObject({
      type: "text",
    });
    expect(findField(imageBlock.fields, "caption")).not.toMatchObject({
      required: true,
    });
  });

  it("takes a video as a plain text link, stored as given", () => {
    expect(findField(videoBlock.fields, "url")).toMatchObject({
      type: "text",
      required: true,
      validate: validateVideoUrl,
    });
  });

  it("points the attachment block at the documents collection, same company", () => {
    const field = findField(attachmentBlock.fields, "document") as {
      relationTo: string;
      required: boolean;
      filterOptions: (args: unknown) => unknown;
    };
    expect(field).toMatchObject({ relationTo: "documents", required: true });
    expect(field.filterOptions({ data: { tenant: 2 } })).toEqual({
      tenant: { equals: "2" },
    });
  });

  it.each([
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://youtu.be/dQw4w9WgXcQ",
    "https://vimeo.com/76979871",
  ])("accepts %s", (url) => {
    expect(
      (validateVideoUrl as (value: string, options: unknown) => unknown)(
        url,
        {},
      ),
    ).toBe(true);
  });

  it.each(["https://example.com/video.mp4", "not a link", ""])(
    "refuses %j with the design's message (PS-04)",
    (url) => {
      expect(
        (validateVideoUrl as (value: string, options: unknown) => unknown)(
          url,
          {},
        ),
      ).toBe("Use a YouTube or Vimeo link.");
    },
  );
});

describe("attachments in the body (FR-PM-50)", () => {
  const body = {
    en: state([
      { type: "paragraph", children: [] },
      block({ blockType: "attachment", document: 7 }),
      block({ blockType: "video", url: "https://youtu.be/dQw4w9WgXcQ" }),
      block({ blockType: "attachment", document: { id: 9 } }),
    ]),
    id: state([block({ blockType: "attachment", document: "7" })]),
  };

  it("finds every attached document once, in any language", () => {
    expect(attachedDocumentIds(body).sort()).toEqual(["7", "9"]);
  });

  it("finds none in a body without attachments, or in nothing", () => {
    expect(
      attachedDocumentIds(state([block({ blockType: "image", image: 3 })])),
    ).toEqual([]);
    expect(attachedDocumentIds(null)).toEqual([]);
    expect(attachedDocumentIds(undefined)).toEqual([]);
  });

  it("writes them to routes.refs so the document's Used in lists the post", () => {
    expect(
      routeRows("posts", {
        id: 10,
        _status: "published",
        tenant: 2,
        body,
        path: {
          en: "/category/sustainability/al-falah",
          id: "/kategori/keberlanjutan/al-falah",
        },
      }),
    ).toEqual([
      {
        tenant: "2",
        locale: "en",
        path: "/category/sustainability/al-falah",
        refs: ["documents:7", "documents:9"],
      },
      {
        tenant: "2",
        locale: "id",
        path: "/kategori/keberlanjutan/al-falah",
        refs: ["documents:7", "documents:9"],
      },
    ]);
  });

  it("indexes only a published post that is not in the trash", () => {
    const path = { en: "/category/sustainability/x" };
    expect(routeRows("posts", { id: 1, _status: "draft", path, body })).toEqual(
      [],
    );
    expect(
      routeRows("posts", {
        id: 1,
        _status: "published",
        deletedAt: "2026-11-03",
        path,
        body,
      }),
    ).toEqual([]);
  });

  it("routes posts and categories through the index", () => {
    expect(ROUTABLE_COLLECTIONS).toContain("posts");
    expect(ROUTABLE_COLLECTIONS).toContain("categories");
  });
});

describe("a document used by a published post (FR-PM-40)", () => {
  function fakePayload(
    referrers: { doc: { relationTo: string; value: number }; refs: string[] }[],
  ) {
    return {
      find: async (args: { collection: string }) => {
        if (args.collection === "routes") {
          return {
            docs: referrers.map((row, index) => ({
              id: index,
              tenant: 2,
              locale: "en",
              path: `/p/${index}`,
              ...row,
            })),
          };
        }
        if (args.collection === "posts") {
          return { docs: [{ id: 10, title: "Al Falah Kindergarten" }] };
        }
        return { docs: [] };
      },
      findByID: async () => ({ title: "Annual brochure" }),
    } as unknown as Payload;
  }

  const posted = [
    { doc: { relationTo: "posts", value: 10 }, refs: ["documents:9"] },
    { doc: { relationTo: "pages", value: 3 }, refs: ["documents:9"] },
    { doc: { relationTo: "posts", value: 11 }, refs: ["documents:77"] },
  ];

  it("lists the published posts that attach the document", async () => {
    expect(
      await publishedPostsAttaching(fakePayload(posted), undefined, 9),
    ).toEqual([
      {
        product: "Al Falah Kindergarten",
        places: ["attachment"],
        kind: "post",
      },
    ]);
  });

  it("refuses to trash it, naming the post", async () => {
    await expect(
      keepLinkedDocuments({
        data: { deletedAt: "2026-11-03" },
        originalDoc: { id: 9, title: "Annual brochure" },
        req: { payload: fakePayload(posted) } as unknown as PayloadRequest,
      } as never),
    ).rejects.toThrow(
      'Can\'t trash "Annual brochure". Published posts link it: Al Falah Kindergarten (attachment). Unlink it or replace the file instead.',
    );
  });

  it("refuses a permanent delete as well", async () => {
    await expect(
      keepLinkedDocumentsOnDelete({
        id: 9,
        req: { payload: fakePayload(posted) } as unknown as PayloadRequest,
      } as never),
    ).rejects.toThrow("Can't delete");
  });

  it("allows the trash once no published post uses it", async () => {
    const data = { deletedAt: "2026-11-03" };
    expect(
      await keepLinkedDocuments({
        data,
        originalDoc: { id: 9, title: "Annual brochure" },
        req: {
          payload: fakePayload([posted[2]]),
        } as unknown as PayloadRequest,
      } as never),
    ).toBe(data);
  });

  it("names products and posts together when both use it", () => {
    expect(
      documentInUseMessage("trash", "Brochure", [
        { product: "Alum", places: ["product PDS"] },
        { product: "A post", places: ["attachment"], kind: "post" },
      ]),
    ).toBe(
      'Can\'t trash "Brochure". Published products and posts link it: Alum (product PDS); A post (attachment). Unlink it or replace the file instead.',
    );
  });
});

describe("post routes belong to one company (FR-PM-23)", () => {
  type Row = {
    id: number;
    tenant: number | null;
    locale: string;
    path: string;
    doc: { relationTo: string; value: number };
  };

  function store() {
    const rows: Row[] = [];
    let next = 1;
    const payload = {
      find: async (args: { where: Where }) => {
        const clauses = (args.where as { and?: Where[] }).and ?? [args.where];
        return {
          docs: rows.filter((row) =>
            (clauses as Record<string, { equals: unknown }>[]).every((clause) =>
              Object.entries(clause).every(([key, condition]) => {
                if (key === "doc") {
                  const wanted = condition.equals as Row["doc"];
                  return (
                    row.doc.relationTo === wanted.relationTo &&
                    row.doc.value === wanted.value
                  );
                }
                return (
                  (row as unknown as Record<string, unknown>)[key] ===
                  condition.equals
                );
              }),
            ),
          ),
        };
      },
      create: async (args: { data: Omit<Row, "id"> }) => {
        rows.push({ id: next++, ...args.data });
      },
      update: async () => ({}),
      delete: async () => ({}),
    } as unknown as Payload;
    return { payload, rows };
  }

  const row = (tenant: string | null) => ({
    tenant,
    locale: "en",
    path: "/category/sustainability/al-falah",
    refs: [],
  });

  it("lets two companies publish the same post address", async () => {
    const { payload, rows } = store();
    await writeRouteRows(payload, "posts", 1, [row("1")]);
    await writeRouteRows(payload, "posts", 2, [row("2")]);
    expect(rows.map((entry) => entry.tenant)).toEqual([1, 2]);
  });

  it("rejects a second post of the same company at the address", async () => {
    const { payload } = store();
    await writeRouteRows(payload, "posts", 1, [row("1")]);
    await expect(
      writeRouteRows(payload, "posts", 3, [row("1")]),
    ).rejects.toThrow("is already used by another published page");
  });

  it("rejects a company-less route at an address a company's post uses", async () => {
    const { payload } = store();
    await writeRouteRows(payload, "posts", 1, [row("1")]);
    await expect(
      writeRouteRows(payload, "categories", 4, [row(null)]),
    ).rejects.toThrow("is already used by another published page");
  });

  it("rejects a post slug that the same company's other post uses", async () => {
    const payload = {
      find: async (args: { collection: string }) => ({
        docs:
          args.collection === "posts"
            ? [{ id: 5, title: "Al Falah", tenant: 1 }]
            : args.collection === "tenants"
              ? [{ id: 1, name: "DKU" }]
              : [],
      }),
      findByID: async () => ({
        path: {
          en: "/category/sustainability",
          id: "/kategori/sustainability",
        },
      }),
      count: async () => ({ totalDocs: 3 }),
    } as unknown as Payload;
    const { problems } = await validatePageSlug(payload, {
      collection: "posts",
      id: 6,
      tenant: 1,
      category: 4,
      slugs: { en: "al-falah" },
    });
    expect(problems[0].message).toBe(
      '/category/sustainability/al-falah is already used by "Al Falah" on DKU. Pick another slug.',
    );
  });
});

describe("an attachment from another company", () => {
  const run = (documentTenant: number, postTenant: number | undefined) =>
    (
      validateSameCompanyDocument as (
        value: unknown,
        options: unknown,
      ) => Promise<unknown>
    )(7, {
      event: "submit",
      required: true,
      data: { tenant: postTenant },
      relationTo: "documents",
      req: {
        t: (key: string) => key,
        payload: {
          collections: { documents: { config: { slug: "documents" } } },
          db: { defaultIDType: "number" },
          findByID: async () => ({ id: 7, tenant: documentTenant }),
        },
      },
    });

  it("is refused on the server with a clear message", async () => {
    expect(await run(1, 2)).toBe(DOCUMENT_OTHER_COMPANY);
  });

  it("is accepted from the post's own company", async () => {
    expect(await run(2, 2)).toBe(true);
  });

  it("is not checked until the post has a company", async () => {
    expect(await run(1, undefined)).toBe(true);
  });
});
