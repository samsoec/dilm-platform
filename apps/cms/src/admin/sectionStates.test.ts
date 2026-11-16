import { describe, expect, it } from "vitest";

import {
  formFieldRows,
  overrideState,
  pickedCount,
  pinNote,
  sectionNotes,
  templateOnlyWarning,
} from "./sectionStates";

const company = {
  id: 1,
  name: "Indonesian Acids",
  profile: { hubLabel: "Chemical hub", mapPin: { x: 22, y: 34 } },
};

describe("sectionNotes", () => {
  it("warns when a template-only section is on the wrong page", () => {
    const text = templateOnlyWarning("productOverview", {
      collection: "pages",
    });
    expect(text).toContain("only shows on");
    expect(
      sectionNotes("productOverview", "Template", { collection: "pages" })[0]
        ?.tone,
    ).toBe("warning");
  });

  it("stays quiet in the right template", () => {
    expect(
      sectionNotes("productOverview", "Template", {
        collection: "detail-templates",
        recordType: "product",
      }),
    ).toEqual([]);
  });

  it("uses the shared-page wording for current-company sections", () => {
    const own = sectionNotes("locationMap", "Current company", {
      collection: "pages",
    });
    const shared = sectionNotes("locationMap", "Current company", {
      collection: "shared-pages",
    });
    expect(own[0]?.text).not.toBe(shared[0]?.text);
    expect(shared[0]?.text).toContain("shared");
  });

  it("links group sections to company settings", () => {
    expect(
      sectionNotes("groupShowcase", "Company sections", {})[0]?.link,
    ).toBeTruthy();
  });
});

describe("company overrides", () => {
  it("shows the profile value while empty and offers reset when overridden", () => {
    expect(overrideState("label", "", company)).toEqual({
      kind: "profile",
      placeholder: "Chemical hub",
    });
    expect(overrideState("label", "Mine", company)).toEqual({
      kind: "overridden",
    });
    expect(overrideState("label", "", null)).toEqual({ kind: "none" });
  });

  it("describes the pin", () => {
    expect(pinNote({}, company).text).toBe(
      "From profile · x 22% y 34% · Place differently below",
    );
    expect(pinNote({ x: 1, y: 2 }, company).canReset).toBe(true);
  });

  it("counts picks", () => {
    expect(pickedCount([1, 2, 3], 6)).toBe("3 of 6");
    expect(pickedCount(null, 6)).toBe("0 of 6");
  });
});

describe("formFieldRows", () => {
  it("lists every fixed field", () => {
    const rows = formFieldRows(["a", "b"], { a: "A" }, { a: { label: "L" } });
    expect(rows).toEqual([
      { name: "a", field: "A", label: "L", placeholder: "" },
      { name: "b", field: "b", label: "", placeholder: "" },
    ]);
  });
});
