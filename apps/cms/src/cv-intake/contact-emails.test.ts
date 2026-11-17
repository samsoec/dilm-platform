import { describe, expect, it } from "vitest";

import { senderConfirmation, teamNotification } from "./contact-emails";

const inquiry = {
  submissionId: "sub-9",
  fullName: "Budi\r\nBcc: attacker@example.com",
  company: "PT <b>Maju</b>",
  workEmail: "budi@maju.example",
  phone: "+62 811 000 111",
  message: "Quote <script>alert(1)</script> & more",
  locale: "en" as const,
  submittedAt: "2026-09-27T03:00:00.000Z",
};

describe("teamNotification", () => {
  it("contains the five fields and the Jakarta submission time", () => {
    const { text } = teamNotification(inquiry, "duniakimia");
    expect(text).toContain("Company: PT <b>Maju</b>");
    expect(text).toContain("Work email: budi@maju.example");
    expect(text).toContain("Phone: +62 811 000 111");
    expect(text).toContain("Quote <script>");
    expect(text).toContain("Submitted: 27 Sept 2026, 10:00 WIB");
  });

  it("keeps the subject on one line so input cannot add headers", () => {
    const { subject } = teamNotification(inquiry, "duniakimia");
    expect(subject).not.toMatch(/[\r\n]/);
  });

  it("escapes user text in the HTML body", () => {
    const { html } = teamNotification(inquiry, "duniakimia");
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<b>");
    expect(html).toContain("&lt;script&gt;alert(1)&lt;/script&gt; &amp; more");
  });
});

describe("senderConfirmation", () => {
  it("is written in English or Indonesian by the message locale", () => {
    expect(senderConfirmation(inquiry, "likutelaga").subject).toBe(
      "We received your message",
    );
    expect(
      senderConfirmation({ ...inquiry, locale: "id" }, "likutelaga").subject,
    ).toBe("Pesan Anda telah kami terima");
  });

  it("repeats only the sender's own message, not company or phone", () => {
    const { text } = senderConfirmation(inquiry, "duniakimia");
    expect(text).toContain("Quote <script>");
    expect(text).not.toContain("+62 811");
    expect(text).not.toContain("PT <b>Maju");
  });

  it("escapes user text in the HTML body", () => {
    const { html } = senderConfirmation(inquiry, "duniakimia");
    expect(html).not.toContain("<script>");
  });
});
