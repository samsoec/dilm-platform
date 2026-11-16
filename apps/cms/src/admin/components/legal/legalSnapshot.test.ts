import { describe, expect, it } from "vitest";

import { layoutFingerprint } from "../../../legal/legalText";
import { legalSnapshot } from "./legalSnapshot";

const text = (value: string) => ({
  root: {
    children: [
      { type: "heading", tag: "h2", children: [{ type: "text", text: value }] },
    ],
  },
});

const fields = (stamp: string, heading: string) => ({
  "layout.0.blockType": { value: "articleHeader" },
  "layout.0.lastUpdated": {
    value: "2026-11-01T00:00:00.000Z",
    initialValue: "2026-11-01T00:00:00.000Z",
  },
  "layout.0.textStamp": { value: stamp },
  "layout.1.blockType": { value: "richText" },
  "layout.1.showTableOfContents": { value: true },
  "layout.1.tocTitle": { value: "" },
  "layout.1.body": { value: text(heading) },
});

describe("legalSnapshot", () => {
  it("flags changed text and counts headings", () => {
    const stamp = layoutFingerprint([
      { blockType: "richText", body: text("Old") },
    ]);
    const same = legalSnapshot(fields(stamp, "Old"));
    expect(same.changed).toBe(false);
    expect(same.headings).toBe(1);
    const edited = legalSnapshot(fields(stamp, "New"));
    expect(edited.changed).toBe(true);
    expect(edited.toc?.entries[0]?.anchor).toBe("new");
    expect(edited.toc?.title).toBe("On this page");
  });

  it("does not flag text when the date was edited or there is no saved date", () => {
    const stamp = layoutFingerprint([
      { blockType: "richText", body: text("Old") },
    ]);
    const base = fields(stamp, "New");
    const saved = (initial: unknown, value: unknown) => ({
      ...base,
      "layout.0.lastUpdated": { value, initialValue: initial },
    });
    expect(
      legalSnapshot(
        saved("2026-11-01T00:00:00.000Z", "2026-11-01T00:00:00.000Z"),
      ).changed,
    ).toBe(true);
    expect(
      legalSnapshot(
        saved("2026-11-01T00:00:00.000Z", "2026-11-16T00:00:00.000Z"),
      ).changed,
    ).toBe(false);
    expect(
      legalSnapshot(saved(undefined, "2026-11-16T00:00:00.000Z")).changed,
    ).toBe(false);
    const same = fields(stamp, "Old");
    expect(
      legalSnapshot({
        ...same,
        "layout.0.lastUpdated": {
          value: "2026-11-01T00:00:00.000Z",
          initialValue: "2026-11-01T00:00:00.000Z",
        },
      }).changed,
    ).toBe(false);
  });

  it("skips non-legal documents", () => {
    expect(
      legalSnapshot({
        "layout.0.blockType": { value: "richText" },
        "layout.0.body": { value: text("A") },
      }).toc,
    ).toBeNull();
  });

  it("reports an empty list when no H2 exists", () => {
    const empty = legalSnapshot(
      {
        "layout.0.blockType": { value: "richText" },
        "layout.0.showTableOfContents": { value: true },
        "layout.0.body": { value: { root: { children: [] } } },
      },
      0,
    );
    expect(empty.headings).toBe(0);
    expect(empty.toc?.on).toBe(true);
  });
});
