import { describe, expect, it } from "vitest";

import {
  backLabel,
  deliveryCells,
  listContext,
  momentText,
  recordId,
  retainedUntil,
  savedToast,
  submittedText,
} from "./application";

describe("dates in WIB (3a)", () => {
  it("shows submitted times in Jakarta time", () => {
    expect(submittedText("2026-10-09T01:12:00.000Z")).toBe(
      "9 Oct 2026, 08:12 WIB",
    );
    expect(momentText("2026-10-09T01:14:00.000Z")).toBe("9 Oct, 08:14");
    expect(submittedText(null)).toBeUndefined();
  });

  it("counts the retention period from the submission date", () => {
    expect(retainedUntil("2026-10-09T01:12:00.000Z", 12)).toBe("9 Oct 2027");
    expect(retainedUntil("2026-10-09T01:12:00.000Z", 6)).toBe("9 Apr 2027");
  });

  it("formats the record ID from the year and the record number", () => {
    expect(recordId(142, "2026-10-09T01:12:00.000Z")).toBe("CV-2026-0142");
  });
});

describe("deliveryCells (R-01, FR-UI-93)", () => {
  const titles = (record: Parameters<typeof deliveryCells>[0]) =>
    deliveryCells(record, "hr@duniakimia.com").map(
      ({ title, detail, tone }) => [title, detail, tone],
    );

  it("says what happened in plain words when everything went out", () => {
    expect(
      titles({
        applicantNotifiedAt: "2026-10-09T01:14:00.000Z",
        recruiterNotifiedAt: "2026-10-09T01:14:00.000Z",
        externalSyncStatus: "synced",
        externalSyncAttempts: 1,
        externalSyncTriedAt: "2026-10-09T01:15:00.000Z",
      }),
    ).toEqual([
      ["Sent", "Applicant was emailed a confirmation on 9 Oct, 08:14.", "ok"],
      ["Sent", "hr@duniakimia.com was notified on 9 Oct, 08:14.", "ok"],
      ["Synced", "Reached the job platform on 9 Oct, 08:15.", "ok"],
    ]);
  });

  it("shows queued and failed states without a retry", () => {
    expect(
      titles({
        externalSyncStatus: "failed",
        externalSyncAttempts: 3,
        externalSyncTriedAt: "2026-10-09T02:40:00.000Z",
      }),
    ).toEqual([
      ["Pending", "Confirmation is queued and hasn't been sent yet.", "warn"],
      ["Pending", "Notification is queued and hasn't been sent yet.", "warn"],
      ["Failed · 3 tries", "Last try 9 Oct, 09:40.", "danger"],
    ]);
    expect(
      titles({ externalSyncStatus: "pending", externalSyncAttempts: 1 })[2],
    ).toEqual(["Pending · 1 try", "Will try again automatically.", "warn"]);
  });

  it("explains a missing recruiter email instead of a queue", () => {
    expect(deliveryCells({}, undefined)[1]?.detail).toBe(
      "No recruiter email is set in Company settings, so nobody is notified yet.",
    );
  });
});

describe("savedToast (R-05)", () => {
  it("names the new status, the tab it left and its new count", () => {
    expect(savedToast("reviewed", "received", 5)).toEqual({
      title: "Marked Reviewed.",
      body: "Received now has 5. The applicant wasn't emailed.",
    });
  });
});

describe("listContext (FR-UI-93)", () => {
  it("rebuilds the list's filter, search and sort", () => {
    const context = listContext(
      "where[status][equals]=received&where[position][in][0]=Lab Analyst&search=budi&sort=-submittedAt&page=2",
    );
    expect(context.status).toBe("received");
    expect(context.sort).toBe("-submittedAt");
    expect(context.where).toEqual({
      and: [
        {
          status: { equals: "received" },
          position: { in: ["Lab Analyst"] },
        },
        {
          or: [
            { applicantName: { like: "budi" } },
            { email: { like: "budi" } },
          ],
        },
      ],
    });
  });

  it("falls back to the whole list", () => {
    expect(listContext(undefined)).toEqual({
      query: "",
      where: {},
      sort: "",
      status: undefined,
    });
    expect(backLabel(undefined, 12)).toBe("Career applications (12)");
    expect(backLabel("received", 6)).toBe("Received (6)");
  });
});
