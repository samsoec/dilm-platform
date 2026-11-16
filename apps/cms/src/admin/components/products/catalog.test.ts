import { describe, expect, it } from "vitest";

import {
  canEditProduct,
  catalogHref,
  catalogWhere,
  emptyCatalogText,
  matchesStatus,
  ownerBannerText,
  ownerLabel,
  parseCatalogQuery,
  savedText,
  variantCount,
} from "./catalog";

const ids = ["1", "2", "3"];

describe("parseCatalogQuery", () => {
  it("defaults to the selected company", () => {
    expect(parseCatalogQuery({}, "2", ids)).toEqual({
      owner: "2",
      status: undefined,
      search: "",
    });
  });

  it("shows every company when none is selected", () => {
    expect(parseCatalogQuery({}, undefined, ids).owner).toBe("all");
  });

  it("accepts another company, All companies, a status and a search", () => {
    expect(parseCatalogQuery({ owner: "3" }, "2", ids).owner).toBe("3");
    expect(parseCatalogQuery({ owner: "all" }, "2", ids).owner).toBe("all");
    const query = parseCatalogQuery(
      { status: "changed", q: "  acid " },
      "2",
      ids,
    );
    expect([query.status, query.search]).toEqual(["changed", "acid"]);
  });

  it("ignores unknown owners and statuses", () => {
    const query = parseCatalogQuery({ owner: "9", status: "x" }, "2", ids);
    expect([query.owner, query.status]).toEqual(["2", undefined]);
  });
});

describe("catalogWhere", () => {
  it("is empty for all companies without a search", () => {
    expect(
      catalogWhere({ owner: "all", status: undefined, search: "" }),
    ).toEqual({});
  });

  it("scopes to an owner and searches name and CAS number", () => {
    const where = catalogWhere({ owner: "2", status: undefined, search: "64" });
    expect(JSON.stringify(where)).toContain('"tenant":{"equals":"2"}');
    for (const field of ["name", "formulaText", "casNumber"]) {
      expect(JSON.stringify(where)).toContain(`"${field}":{"like":"64"}`);
    }
  });
});

describe("catalogHref", () => {
  it("leaves out the defaults", () => {
    expect(catalogHref("/p", { owner: "2" }, "2")).toBe("/p");
    expect(catalogHref("/p", { owner: "all" }, "2")).toBe("/p?owner=all");
    expect(catalogHref("/p", { owner: "2", status: "draft" }, "2")).toBe(
      "/p?status=draft",
    );
  });
});

describe("row text", () => {
  it("says Yours for the selected company and names the others", () => {
    expect(ownerLabel("2", "2", "IndoAcid")).toBe("Yours");
    expect(ownerLabel("1", "2", "IndoAcid")).toBe("IndoAcid");
  });

  it("counts variants and filters by status", () => {
    expect(variantCount([{}, {}])).toBe(2);
    expect(variantCount(undefined)).toBe(0);
    expect(matchesStatus("changed", undefined)).toBe(true);
    expect(matchesStatus("draft", "published")).toBe(false);
  });

  it("formats the saved date", () => {
    expect(savedText("2026-11-16T10:00:00Z")).toBe("16 Nov 2026");
    expect(savedText(undefined)).toBe("");
  });
});

describe("PR-02 and PR-08 copy", () => {
  it("matches the banner", () => {
    expect(ownerBannerText("IndoAcid")).toBe(
      "Owned by IndoAcid. Only IndoAcid editors or a Super Admin can change it. You can view it and pick it into your pages.",
    );
  });

  it("matches the empty catalog text", () => {
    expect(
      emptyCatalogText(
        "Liku Telaga",
        17,
        ["Dunia Kimia Utama", "IndoAcid"],
        "likutelaga.com",
      ),
    ).toBe(
      "Liku Telaga has no products yet. 17 products from Dunia Kimia Utama and IndoAcid are already shown on likutelaga.com.",
    );
    expect(emptyCatalogText("Liku Telaga", 0, [], undefined)).toBe(
      "Liku Telaga has no products yet.",
    );
  });
});

describe("canEditProduct", () => {
  const editorAB = {
    roles: ["tenant-editor"],
    tenants: [{ tenant: 1 }, { tenant: 2 }],
  } as never;
  const viewerA = {
    roles: ["tenant-viewer"],
    tenants: [{ tenant: 1 }],
  } as never;
  const superAdmin = { roles: ["super-admin"] } as never;

  it("lets an editor of two companies edit both", () => {
    expect(canEditProduct(editorAB, 1)).toBe(true);
    expect(canEditProduct(editorAB, "2")).toBe(true);
    expect(canEditProduct(editorAB, 3)).toBe(false);
  });

  it("keeps a viewer read-only even on their own company", () => {
    expect(canEditProduct(viewerA, 1)).toBe(false);
  });

  it("lets a Super Admin edit everything", () => {
    expect(canEditProduct(superAdmin, 3)).toBe(true);
  });
});

describe("status in the query", () => {
  it("filters published and not-published in the query", () => {
    const base = { owner: "all", search: "" };
    expect(
      JSON.stringify(catalogWhere({ ...base, status: "published" })),
    ).toContain('"_status":{"equals":"published"}');
    expect(
      JSON.stringify(catalogWhere({ ...base, status: "draft" })),
    ).toContain('"_status":{"not_equals":"published"}');
  });

  it("searches the plain-text formula", () => {
    expect(
      JSON.stringify(
        catalogWhere({ owner: "all", status: undefined, search: "H2SO4" }),
      ),
    ).toContain('"formulaText":{"like":"H2SO4"}');
  });
});
