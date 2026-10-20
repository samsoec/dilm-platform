import { describe, expect, it, vi } from "vitest";

import { IrDocuments } from "../collections/IrDocuments";
import {
  captureLiveRow,
  irTransition,
  type LiveRow,
  purgeOnLiveChange,
  purgeRequest,
  SKIP_IR_PURGE,
} from "./irPurge";

const T0 = "2026-10-20T01:00:00.000Z";
const T1 = "2026-10-20T02:00:00.000Z";

const row = (overrides: Partial<LiveRow> = {}): LiveRow => ({
  id: 7,
  _status: "draft",
  deletedAt: null,
  updatedAt: T0,
  locale: "id",
  filename: "laporan-abc.pdf",
  tenant: 2,
  ...overrides,
});

describe("irTransition (Backend Spec §12.2)", () => {
  it("purges on publish, live edit, unpublish and trash", () => {
    expect(
      irTransition(row(), row({ _status: "published", updatedAt: T1 })),
    ).toBe("publish");
    expect(
      irTransition(
        row({ _status: "published" }),
        row({ _status: "published", updatedAt: T1 }),
      ),
    ).toBe("update");
    expect(
      irTransition(row({ _status: "published" }), row({ updatedAt: T1 })),
    ).toBe("unpublish");
    expect(
      irTransition(
        row({ _status: "published" }),
        row({ _status: "published", deletedAt: T1, updatedAt: T1 }),
      ),
    ).toBe("trash");
  });

  it("purges a document created as published", () => {
    expect(irTransition(undefined, row({ _status: "published" }))).toBe(
      "publish",
    );
  });

  it("never purges a draft save over a published document", () => {
    const published = row({ _status: "published" });
    expect(irTransition(published, { ...published })).toBeUndefined();
  });

  it("never purges draft-only saves, restores or creates", () => {
    expect(irTransition(row(), row({ updatedAt: T1 }))).toBeUndefined();
    expect(irTransition(undefined, row())).toBeUndefined();
    expect(
      irTransition(row({ deletedAt: T0 }), row({ updatedAt: T1 })),
    ).toBeUndefined();
  });

  it("ignores a document that no longer exists", () => {
    expect(irTransition(row(), null)).toBeUndefined();
  });
});

describe("purgeRequest", () => {
  it("covers both languages and both files when a live edit changes them", () => {
    expect(
      purgeRequest({
        transition: "update",
        before: row({
          _status: "published",
          locale: "id",
          filename: "old.pdf",
        }),
        after: row({ _status: "published", locale: "en", filename: "new.pdf" }),
        host: "duniakimia.com",
      }),
    ).toEqual({
      transition: "update",
      documentId: 7,
      tenant: 2,
      host: "duniakimia.com",
      paths: ["/id/investor", "/en/investor"],
      files: ["old.pdf", "new.pdf"],
      tags: ["ir-documents", "ir-documents:tenant:2"],
    });
  });

  it("is scoped to one tenant and skips rows without one", () => {
    expect(
      purgeRequest({
        transition: "publish",
        before: undefined,
        after: row({ tenant: { id: 3 } }),
      })?.tags,
    ).toEqual(["ir-documents", "ir-documents:tenant:3"]);
    expect(
      purgeRequest({
        transition: "publish",
        before: undefined,
        after: row({ tenant: null }),
      }),
    ).toBeUndefined();
  });
});

function fakeReq(
  rows: (LiveRow | null)[],
  context: Record<string, unknown> = {},
) {
  const findOne = vi.fn();
  rows.forEach((value) => findOne.mockResolvedValueOnce(value));
  return {
    context,
    payload: {
      db: { findOne },
      findByID: vi.fn().mockResolvedValue({ domain: "duniakimia.com" }),
      logger: { info: vi.fn(), error: vi.fn() },
    },
  };
}

async function save(
  before: LiveRow | null,
  after: LiveRow | null,
  purger = vi.fn().mockResolvedValue(undefined),
  context: Record<string, unknown> = {},
) {
  const req = fakeReq([before, after], context);
  const doc = { id: 7, title: "Laporan" };
  await captureLiveRow({
    data: {},
    operation: "update",
    originalDoc: doc,
    req,
  } as never);
  const result = await purgeOnLiveChange(purger)({
    doc,
    operation: "update",
    req,
  } as never);
  return { purger, req, result, doc };
}

describe("purge hooks", () => {
  it("purges once when a published document is unpublished", async () => {
    const { purger, req } = await save(
      row({ _status: "published" }),
      row({ updatedAt: T1 }),
    );
    expect(purger).toHaveBeenCalledTimes(1);
    expect(purger.mock.calls[0]![0]).toMatchObject({
      transition: "unpublish",
      host: "duniakimia.com",
      paths: ["/id/investor"],
    });
    expect(Object.keys(req.context)).toEqual([]);
  });

  it("does not purge when a draft is saved over a published document", async () => {
    const published = row({ _status: "published" });
    const { purger } = await save(published, { ...published });
    expect(purger).not.toHaveBeenCalled();
  });

  it("logs a failed purge and keeps the save", async () => {
    const failing = vi.fn().mockRejectedValue(new Error("Cloudflare 503"));
    const { req, result, doc } = await save(
      row(),
      row({ _status: "published", updatedAt: T1 }),
      failing,
    );
    expect(result).toBe(doc);
    expect(req.payload.logger.error).toHaveBeenCalledTimes(1);
  });

  it("skips system writes that ask not to purge", async () => {
    const { purger } = await save(
      row({ _status: "published" }),
      row({ _status: "published", updatedAt: T1 }),
      undefined,
      { [SKIP_IR_PURGE]: true },
    );
    expect(purger).not.toHaveBeenCalled();
  });

  it("is wired into IR documents", () => {
    expect(IrDocuments.hooks?.beforeChange).toContain(captureLiveRow);
    expect(IrDocuments.hooks?.afterChange).toHaveLength(1);
  });
});
