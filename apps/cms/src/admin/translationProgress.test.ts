import type { Field } from "payload";
import { describe, expect, it } from "vitest";

import {
  buildRow,
  slugState,
  slugsText,
  sourceByKey,
} from "./translationProgress";

const fields: Field[] = [
  { name: "title", type: "text", localized: true },
  { name: "slug", type: "text", localized: true },
];
const source = sourceByKey("pages")!;

describe("translation progress", () => {
  it("classifies slugs", () => {
    expect(slugState({ en: "about", id: "tentang" })).toBe("own");
    expect(slugState({ en: "about", id: "about" })).toBe("same");
    expect(slugState({ en: "about", id: "" })).toBe("uses-en");
    expect(slugState({ en: "", id: "" })).toBeNull();
  });

  it("counts texts and slugs and lists what is left", () => {
    const row = buildRow(
      source,
      fields,
      [
        {
          id: 1,
          title: { en: "About", id: "Tentang" },
          slug: { en: "about", id: "tentang" },
        },
        {
          id: 2,
          title: { en: "Jobs", id: "Jobs" },
          slug: { en: "jobs", id: "" },
        },
        { id: 3, title: { en: "Home", id: "Beranda" }, slug: {} },
      ],
      "title",
    );
    expect(row.slugs).toEqual({ set: 1, total: 2 });
    expect(slugsText(row.slugs)).toBe("1 of 2 slugs");
    expect(row.items).toEqual([
      { id: 2, title: "Jobs", left: 2, slug: "uses-en" },
    ]);
  });
});
