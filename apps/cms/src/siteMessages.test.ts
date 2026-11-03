import type { Payload, PayloadRequest } from "payload";
import { describe, expect, it, vi } from "vitest";

import {
  COOKIE_POLICY_REQUIRED,
  findCookiePolicyLinks,
  layoutTag,
  type LayoutRevalidator,
  linkedPageIds,
  requireCookiePolicyLink,
  revalidateLayout,
} from "./siteMessages";

function text(value: string) {
  return { type: "text", text: value, format: 0, version: 1 };
}

function pageLink(value: unknown, relationTo = "pages") {
  return {
    type: "link",
    version: 3,
    fields: { linkType: "internal", newTab: false, doc: { relationTo, value } },
    children: [text("Cookie Policy")],
  };
}

function customLink(url: string) {
  return {
    type: "link",
    version: 3,
    fields: { linkType: "custom", newTab: false, url },
    children: [text("elsewhere")],
  };
}

function body(...inline: object[]) {
  return {
    root: {
      type: "root",
      version: 1,
      children: [
        {
          type: "paragraph",
          version: 1,
          children: [text("Read our "), ...inline],
        },
      ],
    },
  };
}

type PageRow = {
  tenant: number;
  _status: string;
  deletedAt?: string | null;
};

function fakeReq(pages: Record<string, PageRow>, locale = "en", stored = {}) {
  const findByID = vi.fn(
    async (args: { collection: string; id: number | string }) => {
      if (args.collection === "site-messages") return stored;
      const row = pages[String(args.id)];
      if (!row) throw new Error("Not found");
      return row;
    },
  );
  return { findByID, req: { locale, payload: { findByID } } as never };
}

async function check(
  value: unknown,
  req: unknown,
  data: object = { tenant: 1 },
  id?: number,
) {
  return requireCookiePolicyLink(
    value as never,
    {
      req,
      data,
      id,
      editor: { validate: () => true },
    } as never,
  );
}

describe("linkedPageIds", () => {
  it("collects the pages a body links to, from ids or populated documents", () => {
    expect(
      linkedPageIds(body(pageLink(4), pageLink({ id: 5 }), pageLink(4))),
    ).toEqual(["4", "5"]);
  });

  it("ignores web addresses and links to other collections", () => {
    expect(
      linkedPageIds(
        body(customLink("https://example.com"), pageLink(9, "posts")),
      ),
    ).toEqual([]);
    expect(linkedPageIds(null)).toEqual([]);
  });
});

describe("cookie banner body rule (MS-01, FR-PM-63)", () => {
  const live: Record<string, PageRow> = {
    "4": { tenant: 1, _status: "published" },
    "5": { tenant: 2, _status: "published" },
    "6": { tenant: 1, _status: "draft" },
    "7": { tenant: 1, _status: "published", deletedAt: "2026-11-01" },
  };

  it("accepts a link to a published page of the same company", async () => {
    const { req } = fakeReq(live);
    expect(await check(body(pageLink(4)), req)).toBe(true);
  });

  it("refuses a body with no link or only a web address", async () => {
    const { req } = fakeReq(live);
    expect(await check(body(), req)).toBe(COOKIE_POLICY_REQUIRED);
    expect(await check(body(customLink("https://example.com")), req)).toBe(
      COOKIE_POLICY_REQUIRED,
    );
    expect(await check(null, req)).toBe(COOKIE_POLICY_REQUIRED);
  });

  it("uses the MS-01 wording", () => {
    expect(COOKIE_POLICY_REQUIRED).toBe(
      "Link to your Cookie Policy page so visitors can read it before choosing. Can't save without it.",
    );
  });

  it.each([
    ["another company's page", 5],
    ["a draft page", 6],
    ["a trashed page", 7],
    ["a page that does not exist", 99],
  ])("refuses a link to %s", async (_, pageId) => {
    const { req } = fakeReq(live);
    expect(await check(body(pageLink(pageId)), req)).toBe(
      COOKIE_POLICY_REQUIRED,
    );
  });

  it("accepts the body when any one of its links qualifies", async () => {
    const { req } = fakeReq(live);
    expect(await check(body(pageLink(5), pageLink(4)), req)).toBe(true);
  });

  it("reads the company from the stored document when the data omits it", async () => {
    const { req } = fakeReq(live, "en", { tenant: 1 });
    expect(await check(body(pageLink(4)), req, {}, 12)).toBe(true);
    const other = fakeReq(live, "en", { tenant: 2 });
    expect(await check(body(pageLink(4)), other.req, {}, 12)).toBe(
      COOKIE_POLICY_REQUIRED,
    );
  });

  it("looks the page up as published, ignoring access rules", async () => {
    const { req, findByID } = fakeReq(live);
    await check(body(pageLink(4)), req);
    expect(findByID).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: "pages",
        draft: false,
        trash: true,
        overrideAccess: true,
      }),
    );
  });

  it("lets a translation stay empty so it falls back to English, but not an unlinked one", async () => {
    const { req } = fakeReq(live, "id");
    const blank = {
      root: {
        type: "root",
        version: 1,
        children: [{ type: "paragraph", version: 1, children: [] }],
      },
    };
    expect(await check(blank, req)).toBe(true);
    expect(
      await check(
        {
          root: {
            type: "root",
            version: 1,
            children: [
              { type: "paragraph", version: 1, children: [text("Baca")] },
            ],
          },
        },
        req,
      ),
    ).toBe(COOKIE_POLICY_REQUIRED);
  });

  describe("saving all languages at once (locale all)", () => {
    const blank = {
      root: {
        type: "root",
        version: 1,
        children: [{ type: "paragraph", version: 1, children: [] }],
      },
    };

    it("refuses an empty English body, however the value arrives", async () => {
      const { req } = fakeReq(live, "all");
      expect(await check(blank, req)).toBe(COOKIE_POLICY_REQUIRED);
      expect(await check({ en: blank, id: blank }, req)).toBe(
        COOKIE_POLICY_REQUIRED,
      );
      expect(await check({ en: blank }, req)).toBe(COOKIE_POLICY_REQUIRED);
      expect(await check({ en: null, id: body(pageLink(4)) }, req)).toBe(
        COOKIE_POLICY_REQUIRED,
      );
    });

    it("refuses English text without the link even when the translation links", async () => {
      const { req } = fakeReq(live, "all");
      expect(
        await check({ en: body(text("Policy")), id: body(pageLink(4)) }, req),
      ).toBe(COOKIE_POLICY_REQUIRED);
    });

    it("still lets the translation stay empty", async () => {
      const { req } = fakeReq(live, "all");
      expect(await check({ en: body(pageLink(4)), id: blank }, req)).toBe(true);
      expect(await check(body(pageLink(4)), req)).toBe(true);
    });

    it("refuses a translation with text but no link", async () => {
      const { req } = fakeReq(live, "all");
      expect(
        await check({ en: body(pageLink(4)), id: body(text("Baca")) }, req),
      ).toBe(COOKIE_POLICY_REQUIRED);
    });
  });
});

describe("findCookiePolicyLinks", () => {
  function payloadWith(docs: object[]) {
    const find = vi.fn(async () => ({ docs }));
    return { find, payload: { find } as unknown as Payload };
  }

  it("returns the companies whose banner links to the page, with the languages", async () => {
    const { payload, find } = payloadWith([
      {
        id: 1,
        tenant: 1,
        cookieBanner: {
          body: { en: body(pageLink(4)), id: body(pageLink(4)) },
        },
      },
      { id: 2, tenant: 2, cookieBanner: { body: { en: body(pageLink(5)) } } },
      { id: 3, tenant: 3, cookieBanner: { body: null } },
    ]);

    expect(await findCookiePolicyLinks(4, { payload })).toEqual([
      { id: 1, tenant: "1", locales: ["en", "id"] },
    ]);
    expect(await findCookiePolicyLinks("5", { payload })).toEqual([
      { id: 2, tenant: "2", locales: ["en"] },
    ]);
    expect(find).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: "site-messages",
        locale: "all",
        fallbackLocale: false,
        overrideAccess: true,
      }),
    );
  });

  it("returns nothing for a page no banner links to", async () => {
    const { payload } = payloadWith([
      { id: 1, tenant: 1, cookieBanner: { body: { en: body(pageLink(4)) } } },
    ]);
    expect(await findCookiePolicyLinks(8, { payload })).toEqual([]);
    expect(await findCookiePolicyLinks(undefined, { payload })).toEqual([]);
  });
});

describe("layout revalidation (FR-CS-26)", () => {
  function run(revalidate: LayoutRevalidator) {
    const logger = { info: vi.fn(), error: vi.fn() };
    const req = { payload: { logger } } as unknown as PayloadRequest;
    const hook = revalidateLayout(revalidate);
    return {
      logger,
      done: (doc: object) => hook({ doc, req, operation: "update" } as never),
    };
  }

  it("names the layout tag after the company", () => {
    expect(layoutTag(2)).toBe("layout:2");
    expect(layoutTag({ id: 7 })).toBe("layout:7");
  });

  it("revalidates layout:<tenant> after a save", async () => {
    const revalidate = vi.fn(async () => {});
    const { done } = run(revalidate);
    await done({ id: 1, tenant: 3 });
    expect(revalidate).toHaveBeenCalledWith("layout:3", expect.anything());
  });

  it("keeps the save when revalidation fails", async () => {
    const { done, logger } = run(async () => {
      throw new Error("down");
    });
    await expect(done({ id: 1, tenant: 3 })).resolves.toEqual({
      id: 1,
      tenant: 3,
    });
    expect(logger.error).toHaveBeenCalled();
  });
});
