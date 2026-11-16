import type { ArrayField, Field } from "payload";
import { describe, expect, it } from "vitest";

import { withSectionCounters } from "./sectionBlock";

const inner: ArrayField = {
  name: "events",
  type: "array",
  maxRows: 6,
  fields: [{ name: "x", type: "text" }],
};

describe("section list counters (SE-05)", () => {
  it("labels capped arrays, including nested ones", () => {
    const [outer] = withSectionCounters([
      { name: "entries", type: "array", maxRows: 8, fields: [inner] },
    ] as Field[]) as ArrayField[];
    const label = (field: ArrayField) => field.admin?.components?.Label;
    expect(label(outer)).toMatchObject({ clientProps: { inSection: true } });
    expect(label(outer.fields[0] as ArrayField)).toMatchObject({
      clientProps: { inSection: true },
    });
  });

  it("leaves uncapped arrays and other fields alone", () => {
    const fields: Field[] = [
      { name: "a", type: "array", fields: [] },
      { name: "t", type: "text" },
    ];
    expect(withSectionCounters(fields)).toEqual(fields);
  });
});
