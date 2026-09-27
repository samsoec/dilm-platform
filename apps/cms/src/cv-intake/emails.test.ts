import { describe, expect, it } from "vitest";

import { applicantConfirmation, recruiterNotification } from "./emails";

const submission = {
  submissionId: "sub-1",
  applicantName: "Siti\r\nBcc: attacker@example.com",
  email: "siti@example.com",
  phone: "+62 812 3456 7890",
  position: "Process Engineer",
  submittedAt: "2026-09-27T03:00:00.000Z",
};

describe("applicantConfirmation", () => {
  it("is written in the tenant's default locale", () => {
    expect(applicantConfirmation(submission, "indoacid", "en").subject).toBe(
      "We received your application for Process Engineer",
    );
    expect(applicantConfirmation(submission, "indoacid", "id").subject).toBe(
      "Lamaran Anda untuk posisi Process Engineer telah kami terima",
    );
  });

  it("names the tenant and the reference number", () => {
    const { text } = applicantConfirmation(submission, "likutelaga", "en");
    expect(text).toContain("Liku Telaga");
    expect(text).toContain("sub-1");
  });
});

describe("recruiterNotification", () => {
  it("keeps applicant input on one line so it cannot add headers", () => {
    const { subject } = recruiterNotification(submission, "duniakimia");
    expect(subject).not.toMatch(/[\r\n]/);
    expect(subject).toBe(
      "New application: Process Engineer — Siti Bcc: attacker@example.com",
    );
  });

  it("shows the submission time in Jakarta time", () => {
    const { text } = recruiterNotification(submission, "duniakimia");
    expect(text).toContain("Submitted: 27 Sept 2026, 10:00 WIB");
  });
});
