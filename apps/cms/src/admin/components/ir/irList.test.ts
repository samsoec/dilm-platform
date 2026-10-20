import { describe, expect, it } from "vitest";

import { IR_DOCUMENT_TYPES, irTypeLabel } from "../../../irDocumentTypes";
import { irFilters, irFooterText, irWhere, liveStatus } from "./irList";

describe("IR list filters", () => {
  it("combines type and language with AND", () => {
    expect(irWhere({ type: "annual-report", locale: "id" })).toEqual({
      and: [
        { documentType: { equals: "annual-report" } },
        { locale: { equals: "id" } },
      ],
    });
    expect(irWhere({})).toEqual({});
  });

  it("reads the filters back from the URL's where", () => {
    expect(irFilters(irWhere({ type: "prospectus", locale: "en" }))).toEqual({
      type: "prospectus",
      locale: "en",
    });
    expect(
      irFilters({ or: [{ and: [{ locale: { equals: "id" } }] }] }),
    ).toEqual({
      type: undefined,
      locale: "id",
    });
    expect(irFilters(undefined)).toEqual({
      type: undefined,
      locale: undefined,
    });
  });
});

describe("IR list text", () => {
  it("counts documents for the selected company", () => {
    expect(irFooterText(7, "Dunia Kimia Utama")).toBe(
      "7 documents · Dunia Kimia Utama only",
    );
    expect(irFooterText(1)).toBe("1 document");
  });

  it("labels every document type", () => {
    expect(IR_DOCUMENT_TYPES.map(irTypeLabel)).toEqual([
      "Annual report",
      "Financial statement",
      "Sustainability report",
      "Public disclosure",
      "Shareholder meeting",
      "Prospectus",
    ]);
    expect(irTypeLabel("public-expose")).toBe("Public expose");
  });
});

describe("liveStatus (K-02)", () => {
  it("shows what is public, not Payload's combined 'changed' status", () => {
    expect(liveStatus("changed", null, "published")).toEqual({
      status: "published",
      pendingDraft: true,
    });
    expect(liveStatus("changed", null, "draft")).toEqual({
      status: "draft",
      pendingDraft: false,
    });
  });

  it("passes plain statuses through and marks trashed rows", () => {
    expect(liveStatus("published", null).status).toBe("published");
    expect(liveStatus("draft", undefined).status).toBe("draft");
    expect(liveStatus(undefined, undefined).status).toBe("draft");
    expect(liveStatus("published", "2026-10-20T00:00:00.000Z").status).toBe(
      "trashed",
    );
  });
});
