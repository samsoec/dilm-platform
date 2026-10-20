import { describe, expect, it } from "vitest";

import {
  checkPdf,
  companyInitials,
  disclosureText,
  fileStateText,
  investorURL,
  fileMetaText,
  IR_MAX_BYTES,
  progressText,
  publishChecklist,
  requiredToPublish,
  titleFromFilename,
} from "./irEditor";

const MB = 1024 * 1024;

describe("PDF checks (I-03)", () => {
  it("accepts PDFs up to 50 MB", () => {
    expect(
      checkPdf({ name: "a.pdf", type: "application/pdf", size: IR_MAX_BYTES }),
    ).toEqual({
      ok: true,
    });
  });

  it("rejects oversize PDFs with the exact copy", () => {
    expect(
      checkPdf({
        name: "Laporan-Lengkap-2025.pdf",
        type: "application/pdf",
        size: 63 * MB,
      }),
    ).toEqual({
      ok: false,
      title: "Laporan-Lengkap-2025.pdf is 63 MB",
      hint: "The limit is 50 MB. Compress the PDF and try again.",
      retry: "Choose another",
    });
  });

  it("rejects other file types", () => {
    expect(
      checkPdf({
        name: "summary.docx",
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        size: 1000,
      }),
    ).toEqual({
      ok: false,
      title: "summary.docx isn't a PDF",
      hint: "Save it as PDF first.",
    });
  });

  it("reports progress in megabytes", () => {
    expect(progressText(12.1 * MB, 18.4 * MB)).toBe("12.1 of 18.4 MB");
  });
});

describe("editor text", () => {
  it("turns a file name into a draft title", () => {
    expect(titleFromFilename("DKU_Laporan-Tahunan_2025_ID.pdf")).toBe(
      "DKU Laporan Tahunan 2025 ID",
    );
    expect(titleFromFilename(".pdf")).toBe("Untitled document");
  });

  it("describes the uploaded file", () => {
    expect(
      fileMetaText({
        filesize: 18.4 * MB,
        uploadedAt: "2026-10-14T03:02:00.000Z",
        uploader: "Dimas Pratama",
      }),
    ).toBe("18.4 MB · uploaded 14 Oct, 10:02 by Dimas Pratama");
    expect(fileMetaText({ filesize: 420 * 1024, uploadedAt: undefined })).toBe(
      "420 KB",
    );
  });
});

describe("ready to publish (3b)", () => {
  it("lists what is still needed", () => {
    expect(
      publishChecklist({
        filename: "a.pdf",
        title: "Laporan Tahunan 2025",
        documentType: "annual-report",
        locale: "id",
        publishedDate: null,
      }).map(({ label, done }) => [label, done]),
    ).toEqual([
      ["PDF uploaded", true],
      ["Title", true],
      ["Document type", true],
      ["Language", true],
      ["Published date missing", false],
    ]);
  });

  it("validates required-to-publish fields with their own message", () => {
    const validate = requiredToPublish("Add the disclosure date to publish.");
    expect(validate(undefined)).toBe("Add the disclosure date to publish.");
    expect(validate("  ")).toBe("Add the disclosure date to publish.");
    expect(validate("2026-10-14T00:00:00.000Z")).toBe(true);
  });
});

describe("publish copy (I-04 to I-06)", () => {
  it("abbreviates the company like the design", () => {
    expect(companyInitials("Dunia Kimia Utama")).toBe("DKU");
    expect(companyInitials("Indonesian Acids Industry")).toBe("IAI");
    expect(companyInitials(undefined)).toBe("company");
  });

  it("names the live Investor page", () => {
    expect(investorURL("duniakimia.com", "id")).toBe(
      "duniakimia.com/id/investor",
    );
  });

  it("shows the disclosure date", () => {
    expect(disclosureText("2026-10-14T00:00:00.000Z")).toBe("14 Oct 2026");
    expect(disclosureText(null)).toBe("Not set");
  });

  it("says when a locked file was published", () => {
    expect(
      fileStateText({
        filesize: 18.4 * MB,
        createdAt: "2026-10-01T01:00:00.000Z",
        firstPublishedAt: "2026-10-14T03:30:00.000Z",
        uploader: "Dimas",
      }),
    ).toBe("18.4 MB · published 14 Oct, 10:30");
  });
});
