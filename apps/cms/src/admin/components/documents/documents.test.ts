import { describe, expect, it } from "vitest";

import { Documents } from "../../../collections/Documents";
import { productUses } from "../../data/documentUsage";
import { emptyCopy } from "../lists/emptyCopy";
import { replaceAllText } from "../kit/usedIn";
import {
  checkDocumentFile,
  DOCUMENT_EMPTY_TEXT,
  nextQueued,
  percentDone,
  replaceConfirmTitle,
  stoppedText,
  usageStatus,
} from "./documents";

const MB = 1024 * 1024;

describe("checkDocumentFile", () => {
  it("accepts a small PDF", () => {
    expect(
      checkDocumentFile({ name: "a.pdf", type: "application/pdf", size: MB }),
    ).toEqual({ ok: true });
  });

  it("sends images to the Media library", () => {
    const check = checkDocumentFile({
      name: "photo.png",
      type: "image/png",
      size: MB,
    });
    expect(check).toMatchObject({ ok: false, kind: "image" });
  });

  it("names a file over the limit", () => {
    expect(
      checkDocumentFile({
        name: "big.pdf",
        type: "application/pdf",
        size: 60 * MB,
      }),
    ).toMatchObject({
      kind: "size",
      message: "big.pdf is 60 MB. The limit is 50 MB. Compress it or split it.",
    });
  });

  it("refuses other file types", () => {
    expect(
      checkDocumentFile({ name: "a.docx", type: "application/zip", size: 1 }),
    ).toMatchObject({ kind: "type" });
  });
});

describe("upload copy", () => {
  it("states the stopped percentage", () => {
    expect(`${stoppedText(72)} Retry`).toBe(
      "Upload stopped at 72%: connection lost. Retry",
    );
    expect(percentDone(36, 50)).toBe(72);
    expect(percentDone(1, 0)).toBe(0);
  });

  it("keeps the verbatim empty state and replace text", () => {
    expect(emptyCopy("documents", {}).title).toBe(DOCUMENT_EMPTY_TEXT);
    expect(DOCUMENT_EMPTY_TEXT).toBe(
      "No data sheets yet. Upload PDS and SDS files once, then link them from product variants.",
    );
    expect(replaceAllText(3)).toBe("Replace PDF · updates all 3");
    expect(replaceConfirmTitle(1)).toContain("1 place?");
  });
});

describe("usageStatus", () => {
  it("separates unused, draft-only and live", () => {
    expect(usageStatus(0, 0)).toBe("unused");
    expect(usageStatus(2, 0)).toBe("draft");
    expect(usageStatus(2, 1)).toBe("live");
  });
});

describe("productUses", () => {
  it("counts variants and the product PDS once per document", () => {
    const usage = productUses(
      [
        {
          id: 1,
          _status: "published",
          pdsFile: 7,
          variants: [
            { pdsFile: 7, sdsFile: 7 },
            { pdsFile: 8, sdsFile: 7 },
            { pdsFile: 9 },
          ],
        },
        { id: 2, _status: "draft", variants: [{ sdsFile: { id: 7 } }] },
      ],
      ["7", "8"],
    );
    expect(usage.get("7")).toEqual({ count: 4, live: 3 });
    expect(usage.get("8")).toEqual({ count: 1, live: 1 });
  });
});

describe("documents list", () => {
  it("has the columns and the server-side hooks", () => {
    expect(Documents.admin?.defaultColumns).toEqual([
      "title",
      "filesize",
      "usedInCount",
      "createdAt",
      "linkStatus",
    ]);
    expect(Documents.hooks?.afterOperation).toHaveLength(1);
  });
});

describe("nextQueued", () => {
  const list = (...states: string[]) =>
    states.map((state, key) => ({ key, state }));

  it("starts at most three and queues the rest", () => {
    expect(
      nextQueued(list("queued", "queued", "queued", "queued", "queued")),
    ).toHaveLength(3);
  });

  it("fills only the free slots", () => {
    expect(
      nextQueued(list("uploading", "uploading", "queued", "queued")).map(
        (e) => e.key,
      ),
    ).toEqual([2]);
    expect(nextQueued(list("uploading", "stopped", "rejected"))).toEqual([]);
  });
});
