import { describe, expect, it } from "vitest";

import {
  editorAccess,
  forwardNote,
  linkEntries,
  placement,
  publishingLines,
  sectionCountText,
  sectionsKeptNote,
  trashBody,
  translationLine,
  viewerNotice,
} from "./editor";

describe("forwardNote (PG-08)", () => {
  it("matches the design text with the real URL, target and child count", () => {
    expect(
      forwardNote({ url: "/about-us", target: "Overview", children: 4 }),
    ).toBe(
      "Visitors to /about-us go straight to Overview. The page keeps its URL, so its 4 child pages stay under /about-us. Its sections are hidden and kept, in case you switch back.",
    );
  });

  it("handles one child and none", () => {
    expect(forwardNote({ url: "/a", target: "B", children: 1 })).toContain(
      "its 1 child page stays under /a.",
    );
    expect(forwardNote({ url: "/a", target: "B", children: 0 })).toBe(
      "Visitors to /a go straight to B. The page keeps its URL. Its sections are hidden and kept, in case you switch back.",
    );
  });

  it("asks for a target until one is picked", () => {
    expect(
      forwardNote({ url: "/a", target: undefined, children: 0 }),
    ).toContain("go straight to the page you pick.");
  });

  it("tells the editor how many sections are kept", () => {
    expect(sectionsKeptNote(7)).toContain("7 sections are hidden and kept");
    expect(sectionsKeptNote(1)).toContain("1 section is hidden and kept");
    expect(sectionsKeptNote(0)).toContain("no sections");
  });
});

describe("editorAccess", () => {
  it("is read-only only when Payload withholds save permission", () => {
    expect(editorAccess({ hasSavePermission: false })).toEqual({
      canEdit: false,
      readOnly: true,
    });
    expect(editorAccess({ hasSavePermission: true }).readOnly).toBe(false);
    expect(editorAccess({ hasSavePermission: undefined }).readOnly).toBe(false);
  });

  it("uses the same viewer sentence as the Pages list", () => {
    expect(viewerNotice("DKU")).toBe(
      "You can view this page. Editors of DKU can change it.",
    );
  });
});

describe("publishingLines", () => {
  const now = new Date("2026-11-05T09:00:00Z");

  it("shows the live date and the unpublished draft changes", () => {
    const lines = publishingLines({
      status: "changed",
      liveSince: "2026-09-28T03:00:00Z",
      savedAt: "2026-11-05T07:05:00Z",
      savedBy: "Dimas Pratama",
      now,
    });
    expect(lines.live).toBe("Live since 28 Sep 2026");
    expect(lines.state).toEqual({
      tone: "changed",
      text: "Draft changes not live yet",
    });
    expect(lines.saved).toBe(
      "Saved today 14:05 by Dimas Pratama. Visitors still see the published version.",
    );
  });

  it("says nothing is live for a draft", () => {
    const lines = publishingLines({
      status: "draft",
      liveSince: null,
      savedAt: null,
      savedBy: null,
      now,
    });
    expect(lines.live).toBe("Not live yet");
    expect(lines.state.tone).toBe("draft");
    expect(lines.saved).toBeUndefined();
  });

  it("does not claim pending changes when published", () => {
    const lines = publishingLines({
      status: "published",
      liveSince: "2026-09-28T03:00:00Z",
      savedAt: "2026-10-01T07:05:00Z",
      savedBy: null,
      now,
    });
    expect(lines.state.tone).toBe("ok");
    expect(lines.saved).toBe("Saved 1 Oct 2026.");
  });
});

describe("translationLine", () => {
  it("reports the share of texts that differ from English", () => {
    expect(translationLine({ translated: 23, total: 28 })).toMatchObject({
      percent: 82,
      untranslated: 5,
      complete: false,
      text: 'ID 82% · 5 texts still "Same as EN"',
    });
  });

  it("is complete when nothing is left", () => {
    expect(translationLine({ translated: 3, total: 3 }).complete).toBe(true);
    expect(translationLine({ translated: 0, total: 0 }).percent).toBe(100);
    expect(translationLine({ translated: 2, total: 3 }).text).toContain(
      "1 text still",
    );
  });
});

describe("linkEntries (Links to this page)", () => {
  const titles = new Map([
    ["shared-pages:1", "Home"],
    ["pages:9", "About Us"],
    ["pages:2", "Overview"],
    ["pages:7", "Other company page"],
  ]);
  const referrer = (
    collection: "pages" | "shared-pages",
    id: string,
    tenant: string | null,
  ) => ({
    collection,
    id,
    tenant,
    paths: { en: "/x" },
  });

  it("lists routes whose refs hold the page, then the pages that forward to it", () => {
    const entries = linkEntries({
      self: { collection: "pages", id: "2" },
      tenant: "2",
      referrers: [referrer("shared-pages", "1", null)],
      forwarders: [{ collection: "pages", id: "9" }],
      titles,
    });
    expect(entries.map(({ title, kind }) => [title, kind])).toEqual([
      ["Home", "section"],
      ["About Us", "forward"],
    ]);
    expect(entries[1].note).toBe("forwards here");
  });

  it("drops the page itself and other companies' pages", () => {
    const entries = linkEntries({
      self: { collection: "pages", id: "2" },
      tenant: "2",
      referrers: [
        referrer("pages", "2", "2"),
        referrer("pages", "7", "3"),
        referrer("shared-pages", "1", null),
      ],
      forwarders: [],
      titles,
    });
    expect(entries.map(({ title }) => title)).toEqual(["Home"]);
  });

  it("counts a page once when it both links and forwards", () => {
    const entries = linkEntries({
      self: { collection: "pages", id: "2" },
      tenant: "2",
      referrers: [referrer("pages", "9", "2")],
      forwarders: [{ collection: "pages", id: "9" }],
      titles,
    });
    expect(entries).toHaveLength(1);
    expect(entries[0].kind).toBe("forward");
  });
});

describe("placement and trash copy", () => {
  it("reuses the header derivation result", () => {
    expect(placement({ inMenu: true, forwards: false }).text).toBe(
      "In the header or footer menu.",
    );
    expect(placement({ inMenu: false, forwards: true }).text).toContain(
      "Visitors are forwarded.",
    );
  });

  it("explains what trashing does to children and the live site", () => {
    expect(trashBody({ live: true, children: 4, where: "the website" })).toBe(
      "It's published, so it will be removed from the website. Its 4 child pages stay as they are but are listed at the top level until it's restored. You can restore it from Trash.",
    );
    expect(trashBody({ live: false, children: 0, where: "x" })).toBe(
      "It isn't on the website. You can restore it from Trash.",
    );
  });

  it("formats the section counter", () => {
    expect(sectionCountText(7, 30)).toBe("7 of 30 sections");
  });
});
