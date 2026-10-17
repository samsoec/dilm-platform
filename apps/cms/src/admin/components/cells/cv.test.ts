import { describe, expect, it } from "vitest";

import { emailMarks, formatJakarta } from "./cv";

describe("CV list cells (FR-UI-39)", () => {
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
});
