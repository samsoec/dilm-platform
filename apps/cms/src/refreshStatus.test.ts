import type { Payload } from "payload";
import { describe, expect, it, vi } from "vitest";

import { RefreshStatus } from "./collections/RefreshStatus";
import {
  REFRESH_FAILED_MESSAGE,
  readRefreshStatus,
  recordRefreshStatus,
  refreshMessage,
  refreshingMessage,
  removeRefreshStatus,
} from "./refreshStatus";

const KEY = { collection: "pages", docId: "4" };

function store(initial?: object) {
  const logger = { error: vi.fn(), info: vi.fn() };
  const find = vi.fn(async () => ({ docs: initial ? [initial] : [] }));
  const create = vi.fn<(args: object) => Promise<object>>(async () => ({}));
  const update = vi.fn<(args: object) => Promise<object>>(async () => ({}));
  const del = vi.fn(async () => ({}));
  const payload = {
    logger,
    find,
    create,
    update,
    delete: del,
  } as unknown as Payload;
  return { payload, logger, find, create, update, del };
}

describe("refresh messages", () => {
  it("says the PB-05 wording for a failed refresh", () => {
    expect(refreshMessage("failed")).toBe(
      "Published, but the site hasn't refreshed yet. It will retry; the administrator has been told. You don't need to publish again.",
    );
    expect(REFRESH_FAILED_MESSAGE).toBe(refreshMessage("failed", ["a.com"]));
  });

  it("says the SP-05 wording with the hosts of the tenants", () => {
    expect(
      refreshMessage("ok", [
        "duniakimia.com",
        "indoacid.com",
        "likutelaga.com",
      ]),
    ).toBe(
      "duniakimia.com, indoacid.com and likutelaga.com are refreshing; the change shows within minutes.",
    );
  });

  it("uses is for one host and has a generic line without hosts", () => {
    expect(refreshingMessage(["duniakimia.com"])).toBe(
      "duniakimia.com is refreshing; the change shows within minutes.",
    );
    expect(refreshingMessage([])).toBe(
      "The site is refreshing; the change shows within minutes.",
    );
    expect(refreshMessage("ok")).toBe(refreshingMessage([]));
  });

  it("has no message when nothing was recorded", () => {
    expect(refreshMessage(undefined)).toBeUndefined();
    expect(refreshMessage(null)).toBeUndefined();
  });
});

describe("recording the status", () => {
  it("creates a row the first time", async () => {
    const { payload, create, update } = store();
    await recordRefreshStatus(payload, KEY, "ok", ["a.com"]);
    expect(update).not.toHaveBeenCalled();
    expect(create).toHaveBeenCalledTimes(1);
    expect(create.mock.calls[0][0]).toMatchObject({
      collection: "refresh-status",
      overrideAccess: true,
      data: { ...KEY, status: "ok", hosts: ["a.com"] },
    });
  });

  it("updates the one row per document afterwards", async () => {
    const { payload, create, update } = store({ id: 12 });
    await recordRefreshStatus(payload, KEY, "failed", []);
    expect(create).not.toHaveBeenCalled();
    expect(update.mock.calls[0][0]).toMatchObject({
      id: 12,
      data: { status: "failed" },
    });
  });

  it("never throws when the write fails", async () => {
    const { payload, create, logger } = store();
    create.mockRejectedValue(new Error("db down"));
    await expect(
      recordRefreshStatus(payload, KEY, "ok", []),
    ).resolves.toBeUndefined();
    expect(logger.error).toHaveBeenCalledTimes(1);
  });

  it("reads back the status with its message", async () => {
    const { payload } = store({
      id: 1,
      status: "failed",
      at: "2026-11-03T00:00:00.000Z",
      hosts: ["a.com", 5],
    });
    await expect(readRefreshStatus(payload, KEY)).resolves.toEqual({
      status: "failed",
      at: "2026-11-03T00:00:00.000Z",
      hosts: ["a.com"],
      message: REFRESH_FAILED_MESSAGE,
    });
  });

  it("reads nothing for a document never published", async () => {
    const { payload } = store();
    await expect(readRefreshStatus(payload, KEY)).resolves.toBeUndefined();
  });

  it("clears the row of a deleted document and swallows errors", async () => {
    const { payload, del, logger } = store();
    await removeRefreshStatus(payload, KEY);
    expect(del).toHaveBeenCalledTimes(1);
    del.mockRejectedValue(new Error("nope"));
    await expect(removeRefreshStatus(payload, KEY)).resolves.toBeUndefined();
    expect(logger.error).toHaveBeenCalledTimes(1);
  });
});

describe("the refresh-status collection", () => {
  it("is written only by the system and read by members", () => {
    const { access } = RefreshStatus;
    expect(
      [access!.create, access!.update, access!.delete].map((rule) =>
        (rule as () => boolean)(),
      ),
    ).toEqual([false, false, false]);
    expect(RefreshStatus.admin?.hidden).toBe(true);
  });

  it("keeps one row per document", () => {
    expect(RefreshStatus.indexes).toEqual([
      { fields: ["collection", "docId"], unique: true },
    ]);
  });
});
