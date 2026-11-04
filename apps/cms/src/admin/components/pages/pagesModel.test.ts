import { describe, expect, it } from "vitest";

import {
  addChildPath,
  buildTree,
  filterCounts,
  firstName,
  footerText,
  forwardsTarget,
  headerLinks,
  isInHeader,
  localized,
  matchesQuery,
  normalizePath,
  pageKey,
  type PageRecord,
  parentKeys,
  restoreData,
  rowActions,
  savedText,
  toRows,
  toTrashRows,
  trashActions,
  visibleRows,
  type RowContext,
  type Viewer,
} from "./pagesModel";

let nextId = 1;

function page(
  overrides: Omit<Partial<PageRecord>, "title" | "id"> & {
    title?: string;
    en?: string;
    id?: string;
  } = {},
): PageRecord {
  const id = overrides.id ?? String(nextId++);
  const collection = overrides.collection ?? "pages";
  const { title, en, ...rest } = overrides;
  return {
    key: pageKey(collection, id),
    id,
    collection,
    title: { en: title ?? `Page ${id}` },
    path: { en: en ?? `/page-${id}` },
    parentKey: null,
    tenant: collection === "pages" ? 2 : null,
    status: "published",
    updatedAt: "2026-10-02T03:00:00.000Z",
    savedBy: "Dimas Pratama",
    deletedAt: null,
    trashedBy: null,
    redirectTo: null,
    ...rest,
  } as PageRecord;
}

const NO_HEADER = { keys: new Set<string>(), paths: new Set<string>() };

const CONTEXT: RowContext = {
  locale: "en",
  defaultLocale: "en",
  header: NO_HEADER,
  tenants: [{ id: 2, domain: "duniakimia.com" }],
  now: new Date("2026-11-05T05:00:00.000Z"),
};

function rowsOf(records: PageRecord[], context: Partial<RowContext> = {}) {
  return toRows(buildTree(records), { ...CONTEXT, ...context });
}

describe("buildTree", () => {
  it("nests pages under their parent in creation order", () => {
    const about = page({ id: "10", title: "About Us" });
    const second = page({
      id: "12",
      title: "Journey",
      parentKey: about.key,
    });
    const first = page({
      id: "11",
      title: "Overview",
      parentKey: about.key,
    });
    const tree = buildTree([second, about, first]);
    expect(tree).toHaveLength(1);
    expect(tree[0]!.children.map(({ record }) => record.title.en)).toEqual([
      "Overview",
      "Journey",
    ]);
    expect(tree[0]!.children[0]!.depth).toBe(1);
  });

  it("lists shared pages before the company's own", () => {
    const own = page({ id: "1", title: "Own" });
    const shared = page({ id: "9", collection: "shared-pages", title: "Home" });
    expect(
      buildTree([own, shared]).map(({ record }) => record.title.en),
    ).toEqual(["Home", "Own"]);
  });

  it("keeps a page whose parent isn't in the list at the top level", () => {
    const orphan = page({ parentKey: "pages:999", title: "Orphan" });
    expect(buildTree([orphan])[0]!.depth).toBe(0);
  });

  it("does not loop on a parent cycle", () => {
    const a = page({ id: "1", parentKey: "pages:2" });
    const b = page({ id: "2", parentKey: "pages:1" });
    expect(buildTree([a, b]).length).toBeGreaterThan(0);
    expect(rowsOf([a, b])).toHaveLength(2);
  });

  it("never mixes shared and own pages through a parent link", () => {
    const shared = page({ id: "1", collection: "shared-pages" });
    const own = page({ id: "1", parentKey: "pages:7" });
    expect(buildTree([shared, own])).toHaveLength(2);
  });
});

describe("URL per content language", () => {
  const record = page({
    title: "Overview",
    en: "/about-us/overview",
  });
  record.title = { en: "Overview", id: "Ikhtisar" };
  record.path = { en: "/about-us/overview", id: "/tentang-kami/ikhtisar" };

  it("reads path[locale]", () => {
    expect(rowsOf([record], { locale: "id" })[0]).toMatchObject({
      title: "Ikhtisar",
      url: "/tentang-kami/ikhtisar",
    });
    expect(rowsOf([record], { locale: "en" })[0]!.url).toBe(
      "/about-us/overview",
    );
  });

  it("falls back to the default language when a locale is empty", () => {
    const partial = page({ en: "/career" });
    partial.path = { en: "/career", id: null };
    expect(rowsOf([partial], { locale: "id" })[0]!.url).toBe("/career");
    expect(localized({ en: " ", id: "" }, "id", "en")).toBe("");
  });
});

describe("row badges and tags", () => {
  it("shows Shared, All 3 sites and the lock source for shared pages", () => {
    const [row] = rowsOf([
      page({ collection: "shared-pages", title: "Home", en: "/" }),
    ]);
    expect(row).toMatchObject({ shared: true, icon: "home" });
    expect(row!.reach).toMatchObject({ scope: "all", label: "All 3 sites" });
    expect(row!.tags).toContainEqual({ kind: "shared", label: "Shared" });
  });

  it("shows the company's own pages as This site only", () => {
    const [row] = rowsOf([page()]);
    expect(row!.reach).toMatchObject({
      scope: "tenant",
      label: "This site only (duniakimia.com)",
    });
  });

  it("passes the real status through to the row", () => {
    const rows = rowsOf([
      page({ status: "draft" }),
      page({ status: "changed" }),
    ]);
    expect(rows.map(({ status }) => status)).toEqual(["draft", "changed"]);
  });

  describe("Forwards", () => {
    const target = page({
      id: "5",
      title: "Overview",
      en: "/about-us/overview",
    });
    const container = (redirectTo: PageRecord["redirectTo"]) =>
      page({ id: "6", title: "About Us", en: "/about-us", redirectTo });

    it("names the page a reference points to", () => {
      const rows = rowsOf([
        target,
        container({
          type: "reference",
          reference: { relationTo: "pages", value: 5 },
        }),
      ]);
      expect(
        rows.find(({ title }) => title === "About Us")!.tags,
      ).toContainEqual({ kind: "forwards", label: "Forwards → Overview" });
    });

    it("names the shared page in the current language", () => {
      const shared = page({
        id: "2",
        collection: "shared-pages",
        title: "Our Products",
      });
      shared.title = { en: "Our Products", id: "Produk Kami" };
      const rows = rowsOf(
        [
          shared,
          container({
            type: "reference",
            reference: { relationTo: "shared-pages", value: { id: 2 } },
          }),
        ],
        { locale: "id" },
      );
      expect(rows.at(-1)!.tags[0]!.label).toBe("Forwards → Produk Kami");
    });

    it("resolves records of other kinds from the extra lookup", () => {
      const [row] = rowsOf(
        [
          container({
            type: "reference",
            reference: { relationTo: "products", value: 3 },
          }),
        ],
        { otherTargets: { "products:3": "Sulfuric Acid" } },
      );
      expect(row!.tags[0]!.label).toBe("Forwards → Sulfuric Acid");
    });

    it("shows the host of an external target and the path of an internal one", () => {
      expect(
        forwardsTarget(
          { type: "external", externalUrl: "https://example.com/a" },
          new Map(),
        ),
      ).toBe("example.com");
      expect(
        forwardsTarget(
          { type: "internal", internalPath: "/contact-us/" },
          new Map(),
        ),
      ).toBe("/contact-us");
    });

    it("shows nothing for an empty redirect", () => {
      expect(
        forwardsTarget({ type: "internal", internalPath: "" }, new Map()),
      ).toBeUndefined();
      expect(
        forwardsTarget({ type: "reference", reference: null }, new Map()),
      ).toBeUndefined();
      expect(forwardsTarget(null, new Map())).toBeUndefined();
      expect(
        forwardsTarget(
          { type: "reference", reference: { relationTo: "pages", value: 99 } },
          new Map(),
        ),
      ).toBeUndefined();
    });

    it("shows a container as a folder", () => {
      const [row] = rowsOf([
        container({ type: "internal", internalPath: "/overview" }),
      ]);
      expect(row!.icon).toBe("folder");
    });
  });

  describe("Jobs live here and Posts & search", () => {
    it("tags the career base page from tenant settings", () => {
      const career = page({ id: "8", title: "Career", en: "/career" });
      const other = page({ id: "9", title: "Contact", en: "/contact-us" });
      const rows = rowsOf([career, other], { careerKey: career.key });
      expect(rows[0]!.tags.map(({ label }) => label)).toContain(
        "Jobs live here",
      );
      expect(rows[1]!.tags.map(({ label }) => label)).not.toContain(
        "Jobs live here",
      );
    });

    it("tags the publication page and gives it the newspaper icon", () => {
      const publication = page({ id: "8", title: "Publication" });
      const [row] = rowsOf([publication], { publicationKey: publication.key });
      expect(row!.tags.map(({ label }) => label)).toContain("Posts & search");
      expect(row!.icon).toBe("newspaper");
    });
  });

  describe("Not in header", () => {
    const header = headerLinks({
      navItems: [
        {
          type: "link",
          link: { type: "internal", internalPath: "/investor-relations/" },
        },
        {
          type: "link",
          link: {
            type: "reference",
            reference: { relationTo: "pages", value: 7 },
          },
        },
        {
          type: "dropdown",
          children: [
            { link: { type: "internal", internalPath: "/about-us/overview" } },
            { link: { type: "external", externalUrl: "https://x.test/a" } },
          ],
        },
      ],
      cta: {
        enabled: true,
        link: { type: "internal", internalPath: "/contact-us" },
      },
    });

    const labels = (record: PageRecord) =>
      rowsOf([record], { header })[0]!.tags.map(({ label }) => label);

    it("counts a navigation link by reference", () => {
      expect(labels(page({ id: "7", en: "/whatever" }))).toEqual([]);
    });

    it("counts a navigation link by internal path, ignoring a trailing slash", () => {
      expect(labels(page({ id: "20", en: "/investor-relations" }))).toEqual([]);
    });

    it("counts dropdown children and the call-to-action button", () => {
      expect(labels(page({ id: "21", en: "/about-us/overview" }))).toEqual([]);
      expect(labels(page({ id: "22", en: "/contact-us" }))).toEqual([]);
    });

    it("matches the path of any language", () => {
      const localizedPage = page({ id: "23" });
      localizedPage.path = { en: "/en-only", id: "/investor-relations" };
      expect(labels(localizedPage)).toEqual([]);
    });

    it("tags a page nothing in the header links to", () => {
      expect(labels(page({ id: "30", en: "/sustainability" }))).toEqual([
        "Not in header",
      ]);
    });

    it("ignores external links and a disabled button", () => {
      const links = headerLinks({
        navItems: [
          {
            type: "link",
            link: { type: "external", externalUrl: "https://a.b" },
          },
        ],
        cta: {
          enabled: false,
          link: { type: "internal", internalPath: "/contact-us" },
        },
      });
      expect(links.paths.size).toBe(0);
      expect(
        isInHeader({ key: "pages:1", path: { en: "/contact-us" } }, links),
      ).toBe(false);
    });

    it("does not flag Home or forwarding containers", () => {
      expect(
        rowsOf([page({ collection: "shared-pages", en: "/" })], {
          header,
        })[0]!.tags.map(({ label }) => label),
      ).toEqual(["Shared"]);
      const [container] = rowsOf(
        [
          page({
            en: "/about-us",
            redirectTo: {
              type: "internal",
              internalPath: "/about-us/overview",
            },
          }),
        ],
        { header },
      );
      expect(container!.tags.map(({ label }) => label)).toEqual([
        "Forwards → /about-us/overview",
      ]);
    });

    it("copes with a missing header", () => {
      const links = headerLinks(undefined);
      expect(links.keys.size + links.paths.size).toBe(0);
    });
  });
});

describe("expand, search and filters", () => {
  const about = page({ id: "1", title: "About Us", en: "/about-us" });
  const overview = page({
    id: "2",
    title: "Overview",
    en: "/about-us/overview",
    parentKey: about.key,
    status: "changed",
  });
  const journey = page({
    id: "3",
    title: "Our Journey",
    en: "/about-us/our-journey",
    parentKey: about.key,
    status: "draft",
  });
  const career = page({ id: "4", title: "Career", en: "/career" });
  const rows = rowsOf([about, overview, journey, career]);
  const none = new Set<string>();

  it("shows only the top level while everything is collapsed", () => {
    const { rows: shown } = visibleRows(rows, {
      expanded: none,
      filter: "all",
      query: "",
    });
    expect(shown.map(({ title }) => title)).toEqual(["About Us", "Career"]);
  });

  it("shows children of expanded parents, in tree order", () => {
    const { rows: shown } = visibleRows(rows, {
      expanded: new Set([about.key]),
      filter: "all",
      query: "",
    });
    expect(shown.map(({ title }) => title)).toEqual([
      "About Us",
      "Overview",
      "Our Journey",
      "Career",
    ]);
    expect(shown.map(({ depth }) => depth)).toEqual([0, 1, 1, 0]);
  });

  it("expands everything for Expand all", () => {
    const all = new Set(parentKeys(rows));
    expect(all).toEqual(new Set([about.key]));
    expect(
      visibleRows(rows, { expanded: all, filter: "all", query: "" }).rows,
    ).toHaveLength(4);
  });

  it("hides a grandchild while its parent is collapsed", () => {
    const deep = page({ id: "5", parentKey: overview.key, title: "Deep" });
    const deepRows = rowsOf([about, overview, deep]);
    const { rows: shown } = visibleRows(deepRows, {
      expanded: new Set([about.key]),
      filter: "all",
      query: "",
    });
    expect(shown.map(({ title }) => title)).toEqual(["About Us", "Overview"]);
  });

  it("searches by title and by URL, ignoring case", () => {
    expect(matchesQuery(rows[1]!, "OVERVIEW")).toBe(true);
    expect(matchesQuery(rows[1]!, "about-us/over")).toBe(true);
    expect(matchesQuery(rows[1]!, "career")).toBe(false);
    expect(matchesQuery(rows[1]!, "   ")).toBe(true);
  });

  it("keeps the ancestors of a match as context and opens them", () => {
    const { rows: shown, context } = visibleRows(rows, {
      expanded: none,
      filter: "all",
      query: "journey",
    });
    expect(shown.map(({ title }) => title)).toEqual([
      "About Us",
      "Our Journey",
    ]);
    expect([...context]).toEqual([about.key]);
  });

  it("filters by status the same way the chips count it", () => {
    const draft = visibleRows(rows, {
      expanded: none,
      filter: "draft",
      query: "",
    });
    expect(draft.rows.map(({ title }) => title)).toEqual([
      "About Us",
      "Our Journey",
    ]);
    const changed = visibleRows(rows, {
      expanded: none,
      filter: "changed",
      query: "",
    });
    expect(changed.rows.map(({ title }) => title)).toEqual([
      "About Us",
      "Overview",
    ]);
  });

  it("combines a filter with a search", () => {
    const { rows: shown } = visibleRows(rows, {
      expanded: none,
      filter: "published",
      query: "car",
    });
    expect(shown.map(({ title }) => title)).toEqual(["Career"]);
  });

  it("counts each chip from the same rows, with trash counted apart", () => {
    expect(filterCounts(rows, 3)).toEqual({
      all: 4,
      draft: 1,
      published: 2,
      changed: 1,
      trash: 3,
    });
  });

  it("words the footer like the design", () => {
    const withShared = [
      ...rowsOf([
        page({ collection: "shared-pages", id: "1" }),
        page({ collection: "shared-pages", id: "2" }),
      ]),
      ...rows,
    ];
    expect(footerText(withShared, "Dunia Kimia Utama")).toBe(
      "6 pages · 4 Dunia Kimia Utama, 2 shared",
    );
    expect(footerText([rows[0]!], undefined)).toBe(
      "1 page · 1 this company, 0 shared",
    );
  });
});

describe("row actions by role", () => {
  const superAdmin: Viewer = { superAdmin: true, canEdit: true };
  const editor: Viewer = { superAdmin: false, canEdit: true };
  const viewer: Viewer = { superAdmin: false, canEdit: false };
  const own = { shared: false, status: "published" } as const;
  const shared = { shared: true, status: "published" } as const;

  it("gives an editor the full menu on the company's pages", () => {
    expect(rowActions(own, editor)).toEqual({
      menu: true,
      locked: false,
      addChild: true,
      preview: false,
      unpublish: true,
      trash: true,
    });
  });

  it("gives a viewer no menu and no lock on the company's pages", () => {
    expect(rowActions(own, viewer)).toMatchObject({
      menu: false,
      locked: false,
      addChild: false,
      trash: false,
    });
  });

  it("locks shared pages for editors and viewers, not Super Admins", () => {
    expect(rowActions(shared, editor)).toMatchObject({
      menu: false,
      locked: true,
    });
    expect(rowActions(shared, viewer)).toMatchObject({
      menu: false,
      locked: true,
    });
    expect(rowActions(shared, superAdmin)).toMatchObject({
      menu: true,
      locked: false,
    });
  });

  it("only offers Unpublish for pages that are live", () => {
    expect(
      rowActions({ shared: false, status: "draft" }, editor).unpublish,
    ).toBe(false);
    expect(
      rowActions({ shared: false, status: "changed" }, editor).unpublish,
    ).toBe(true);
  });

  it("offers Preview to nobody until the preview feature exists", () => {
    expect(rowActions(own, superAdmin).preview).toBe(false);
  });

  it("limits Delete permanently to Super Admins and Restore to people who can edit", () => {
    expect(trashActions({ shared: false }, superAdmin)).toEqual({
      restore: true,
      remove: true,
    });
    expect(trashActions({ shared: false }, editor)).toEqual({
      restore: true,
      remove: false,
    });
    expect(trashActions({ shared: true }, editor).restore).toBe(false);
    expect(trashActions({ shared: false }, viewer)).toEqual({
      restore: false,
      remove: false,
    });
  });

  it("links Add child page to the create view with the parent preselected", () => {
    expect(addChildPath({ collection: "pages", id: 12 })).toBe(
      "/collections/pages/create?parent=12",
    );
    expect(addChildPath({ collection: "shared-pages", id: "3" })).toBe(
      "/collections/shared-pages/create?parent=3",
    );
  });
});

describe("trash rows", () => {
  const live = page({ id: "1", title: "About Us" });
  const withParent = page({
    id: "2",
    title: "Leadership",
    en: "/about-us/leadership",
    parentKey: live.key,
    deletedAt: "2026-10-20T03:00:00.000Z",
    trashedBy: "Dimas Pratama",
  });
  const orphan = page({
    id: "3",
    title: "Old",
    parentKey: "pages:99",
    deletedAt: "2026-10-21T03:00:00.000Z",
  });

  it("lists the newest first with the old URL, date and first name", () => {
    const rows = toTrashRows(
      [withParent, orphan],
      CONTEXT,
      new Set([live.key]),
    );
    expect(rows.map(({ title }) => title)).toEqual(["Old", "Leadership"]);
    expect(rows[1]).toMatchObject({
      url: "/about-us/leadership",
      trashedLabel: "20 Oct 2026",
      trashedBy: "Dimas",
    });
    expect(rows[0]!.trashedBy).toBe("—");
  });

  it("restores as a draft under the old parent while it is still there", () => {
    expect(restoreData(withParent, new Set([live.key]))).toEqual({
      deletedAt: null,
      _status: "draft",
    });
  });

  it("restores to the top level when the parent is gone or trashed", () => {
    expect(restoreData(orphan, new Set([live.key]))).toEqual({
      deletedAt: null,
      _status: "draft",
      parent: null,
    });
    expect(restoreData(withParent, new Set())).toMatchObject({ parent: null });
    expect(restoreData(live, new Set())).toEqual({
      deletedAt: null,
      _status: "draft",
    });
  });
});

describe("helpers", () => {
  it("normalizes paths for comparison", () => {
    expect(normalizePath("/a/b/")).toBe("/a/b");
    expect(normalizePath("a")).toBe("/a");
    expect(normalizePath("/a?x=1#y")).toBe("/a");
    expect(normalizePath("/")).toBe("/");
    expect(normalizePath(null)).toBe("");
  });

  it("takes a first name", () => {
    expect(firstName(" Rani  Saputra ")).toBe("Rani");
    expect(firstName(null)).toBe("—");
  });

  it("words the last-saved time like the design, in Jakarta time", () => {
    const now = new Date("2026-11-05T09:00:00.000Z");
    expect(savedText("2026-11-05T07:05:00.000Z", now)).toBe("Today, 14:05");
    expect(savedText("2026-11-04T09:40:00.000Z", now)).toBe("Yesterday, 16:40");
    expect(savedText("2026-09-28T03:00:00.000Z", now)).toBe("28 Sep 2026");
    expect(savedText(null, now)).toBe("—");
    expect(savedText("not a date", now)).toBe("—");
  });
});
