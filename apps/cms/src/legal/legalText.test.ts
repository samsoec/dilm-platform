import { describe, expect, it } from "vitest";

import { articleHeader } from "../blocks/articleHeader";
import { richText } from "../blocks/richText";
import {
  checkLastUpdated,
  layoutFingerprint,
  LEGAL_DATE_INVALID,
  LEGAL_DATE_REQUIRED,
  nextStamp,
  textChangedSince,
  tocEntries,
  tocSummary,
} from "./legalText";
import { stampTextHook, tocAnchorsHook } from "./legalFields";

const heading = (tag: string, text: string) => ({
  type: "heading",
  tag,
  children: [{ type: "text", text }],
});
const body = (...children: unknown[]) => ({ root: { type: "root", children } });
const hook = (fn: unknown, args: object) =>
  (fn as (a: object) => unknown)(args);

describe("table of contents", () => {
  it("lists only H2s with unique anchors", () => {
    const value = body(
      heading("h2", "1. Scope"),
      heading("h3", "Detail"),
      heading("h2", "Scope"),
      heading("h2", "Scope"),
      heading("h2", "  "),
    );
    expect(tocEntries(value)).toEqual([
      { text: "1. Scope", anchor: "1-scope" },
      { text: "Scope", anchor: "scope" },
      { text: "Scope", anchor: "scope-2" },
    ]);
    expect(tocSummary(1)).toBe("On this page · 1 heading");
    expect(tocSummary(0)).toBe("On this page · 0 headings");
  });

  it("derives the anchors on the server and clears them when off", () => {
    const value = body(heading("h2", "Cookies"));
    expect(
      hook(tocAnchorsHook, {
        siblingData: { body: value, showTableOfContents: true },
      }),
    ).toEqual([{ text: "Cookies", anchor: "cookies" }]);
    expect(
      hook(tocAnchorsHook, {
        siblingData: { body: value, showTableOfContents: false },
      }),
    ).toEqual([]);
  });
});

describe("last updated", () => {
  const now = new Date("2026-11-16T10:00:00Z");
  it("is required and cannot be in the future", () => {
    expect(checkLastUpdated(undefined, now)).toBe(LEGAL_DATE_REQUIRED);
    expect(checkLastUpdated("nope", now)).toBe(LEGAL_DATE_INVALID);
    expect(checkLastUpdated("2027-01-01T00:00:00Z", now)).toBe(
      LEGAL_DATE_INVALID,
    );
    expect(checkLastUpdated("2026-11-01T00:00:00Z", now)).toBe(true);
  });

  it("is a required, validated field on the block", () => {
    const field = articleHeader.fields.find(
      (entry) => "name" in entry && entry.name === "lastUpdated",
    );
    expect(field).toMatchObject({ required: true });
    expect(
      richText.fields.some(
        (entry) => "name" in entry && entry.name === "tocAnchors",
      ),
    ).toBe(true);
  });

  it("keeps the stamp until the date changes", () => {
    const layout = [{ blockType: "richText", body: body(heading("h2", "A")) }];
    const current = layoutFingerprint(layout);
    const changed = layoutFingerprint([
      { blockType: "richText", body: body(heading("h2", "B")) },
    ]);
    expect(current).not.toBe(changed);
    expect(
      nextStamp({
        previousStamp: current,
        previousDate: "2026-11-01",
        date: "2026-11-01",
        current: changed,
      }),
    ).toBe(current);
    expect(
      nextStamp({
        previousStamp: current,
        previousDate: "2026-11-01",
        date: "2026-11-16",
        current: changed,
      }),
    ).toBe(changed);
    expect(
      hook(stampTextHook, {
        data: { layout },
        siblingData: { lastUpdated: "2026-11-01" },
        previousSiblingDoc: undefined,
        previousValue: undefined,
      }),
    ).toBe(current);
    expect(textChangedSince(current, changed, "2026-11-01")).toBe(true);
    expect(textChangedSince(current, current, "2026-11-01")).toBe(false);
    expect(textChangedSince(undefined, changed, "2026-11-01")).toBe(false);
    expect(textChangedSince(current, changed, undefined)).toBe(false);
  });
});
