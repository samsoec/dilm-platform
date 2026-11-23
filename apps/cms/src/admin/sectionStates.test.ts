import { describe, expect, it } from "vitest";
import { withSameAsEnTag } from "../fields/layoutEditor";

import {
  formFieldRows,
  pickedCount,
  sectionNotes,
  templateOnlyWarning,
} from "./sectionStates";

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

describe("picks", () => {
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

describe("withSameAsEnTag", () => {
  it("keeps an existing afterInput component", () => {
    const field = withSameAsEnTag({
      name: "label",
      type: "text",
      admin: { components: { afterInput: ["/x#Mine"] } },
    });
    const list = (field.admin as { components: { afterInput: unknown[] } })
      .components.afterInput;
    expect(list).toHaveLength(2);
    expect(list[0]).toBe("/x#Mine");
  });
});
