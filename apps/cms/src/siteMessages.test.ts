import { describe, expect, it } from "vitest";

import { linkedPageIds } from "./siteMessages";

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
