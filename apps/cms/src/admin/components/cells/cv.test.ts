import { describe, expect, it } from "vitest";

import { CV_STATUSES } from "../../../collections/CvSubmissions";
import { ICON_NAMES } from "../../icons";
import {
  emailMarks,
  formatJakarta,
  STATUS_BADGES,
  statusBadge,
  syncBadge,
} from "./cv";

describe("CV list cells (FR-UI-39)", () => {
  it("labels every status with text and an icon", () => {
    expect(Object.keys(STATUS_BADGES)).toEqual([...CV_STATUSES]);
    for (const status of CV_STATUSES) {
      expect(statusBadge(status)?.label).toMatch(/^[A-Z]/);
      expect(ICON_NAMES).toContain(statusBadge(status)?.icon);
    }
    expect(statusBadge("unknown")).toBeUndefined();
  });

  it("shows times in Asia/Jakarta", () => {
    expect(formatJakarta("2026-10-09T01:14:00.000Z")).toBe("9 Oct 08:14");
    expect(formatJakarta(null)).toBeUndefined();
    expect(formatJakarta("not a date")).toBeUndefined();
  });

  it("spells out both notification emails for screen readers", () => {
    expect(
      emailMarks({
        applicantNotifiedAt: "2026-10-09T01:14:00.000Z",
        recruiterNotifiedAt: null,
      }),
    ).toEqual([
      {
        who: "Applicant",
        sent: true,
        icon: "mark_email_read",
        text: "Applicant notified 9 Oct 08:14",
      },
      {
        who: "Recruiter",
        sent: false,
        icon: "remove",
        text: "Recruiter not notified yet",
      },
    ]);
  });

  it("tells sync states apart by icon and text, with the try count on failure", () => {
    expect(syncBadge("synced", 1)).toMatchObject({ label: "Synced" });
    expect(syncBadge("failed", 3)).toMatchObject({ label: "Failed · 3 tries" });
    expect(syncBadge("failed", 1)).toMatchObject({ label: "Failed · 1 try" });
    expect(syncBadge("pending", 0)).toMatchObject({ label: "Pending" });
    const icons = ["synced", "failed", "pending"].map(
      (status) => syncBadge(status, 0).icon,
    );
    expect(new Set(icons).size).toBe(3);
    for (const icon of icons) expect(ICON_NAMES).toContain(icon);
  });
});
