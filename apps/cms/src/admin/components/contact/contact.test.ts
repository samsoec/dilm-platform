import { describe, expect, it } from "vitest";

import * as ContactSubmissionsModule from "../../../collections/ContactSubmissions";
import { relatedCollection } from "../consent/consent";
import {
  emptyCopy,
  isEmptyStateSlug,
  noMatchesTitle,
} from "../lists/emptyCopy";
import { deliveryMarks, eraseCopy } from "./contact";

describe("deliveryMarks", () => {
  it("shows both emails as pending before anything is sent", () => {
    expect(deliveryMarks({}).map((m) => [m.who, m.sent, m.text])).toEqual([
      ["Team", false, "Team not notified yet"],
      ["Sender", false, "Sender not notified yet"],
    ]);
  });

  it("tells the sent emails apart and times them in Jakarta", () => {
    const marks = deliveryMarks({
      teamNotifiedAt: "2026-10-17T02:41:00.000Z",
    });
    expect(marks[0]).toMatchObject({
      sent: true,
      text: "Team notified 17 Oct 09:41",
    });
    expect(marks[1]?.sent).toBe(false);
  });
});

describe("eraseCopy", () => {
  it("names the sender in the dialog", () => {
    const copy = eraseCopy("Dewi Lestari", "PT Maju");
    expect(copy.title).toContain("Dewi Lestari");
    expect(copy.body).toContain("PT Maju");
  });
});

describe("related consent records", () => {
  it("points contact-form rows at contact messages", () => {
    expect(relatedCollection("contact-form")).toBe("contact-submissions");
    expect(relatedCollection("career-application")).toBe("cv-submissions");
    expect(relatedCollection("other")).toBeUndefined();
  });
});

describe("empty states", () => {
  it("covers contact messages", () => {
    expect(isEmptyStateSlug("contact-submissions")).toBe(true);
    expect(
      emptyCopy("contact-submissions", { domain: "duniakimia.com" }).lines[0],
    ).toContain("Contact page of duniakimia.com");
    expect(noMatchesTitle("contact-submissions")).toBe(
      "No contact messages match these filters",
    );
  });
});

describe("contact messages list", () => {
  const { ContactSubmissions } = ContactSubmissionsModule as never as {
    ContactSubmissions: {
      admin: Record<string, unknown>;
      defaultSort: string;
    };
  };

  it("searches name and work email, newest first, 20/50/100", () => {
    expect(ContactSubmissions.admin.listSearchableFields).toEqual([
      "fullName",
      "workEmail",
    ]);
    expect(ContactSubmissions.defaultSort).toBe("-submittedAt");
    expect(ContactSubmissions.admin.pagination).toEqual({
      defaultLimit: 20,
      limits: [20, 50, 100],
    });
  });
});
