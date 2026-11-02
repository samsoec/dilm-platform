import { describe, expect, it } from "vitest";

import { trashByEditorsDeleteBySuperAdmins } from "../access";
import { Documents } from "../collections/Documents";
import { fieldNames } from "../testing";
import {
  checkDocumentUpload,
  downloadFileName,
  notAPdfMessage,
} from "./documentFiles";
import { IR_MAX_UPLOAD_BYTES } from "./irFiles";

const upload = (name: string, size: number, mimetype: string) => {
  const req = { file: { name, size, mimetype } };
  const args = { data: {} };
  const run = () =>
    checkDocumentUpload({ args, operation: "create", req } as never);
  return { req, args, run };
};

describe("documents collection", () => {
  it("is a tenant-scoped PDF-only upload with trash", () => {
    expect(Documents.slug).toBe("documents");
    expect(Documents.upload).toMatchObject({ mimeTypes: ["application/pdf"] });
    expect(Documents.trash).toBe(true);
    expect(Documents.access?.delete).toBe(trashByEditorsDeleteBySuperAdmins);
    expect(Documents.versions).toBeFalsy();
    expect(fieldNames(Documents.fields)).toEqual(
      expect.arrayContaining(["title", "downloadName", "uploadedBy"]),
    );
  });
});

describe("document upload type check (DC-01)", () => {
  it("refuses an image with the Media library message", () => {
    expect(() => upload("alum-drum.jpg", 1000, "image/jpeg").run()).toThrow(
      "alum-drum.jpg is an image. Documents takes PDFs only. Add images in the Media library.",
    );
  });

  it("refuses other non-PDF files", () => {
    expect(() => upload("a.docx", 1000, "application/msword").run()).toThrow(
      "a.docx is not a PDF. Documents takes PDFs only.",
    );
    expect(notAPdfMessage("x.png")).toContain("is an image");
  });

  it("refuses a PDF mime type on a file that is not named .pdf", () => {
    expect(() => upload("a.jpg", 1000, "application/pdf").run()).toThrow(
      "Documents takes PDFs only",
    );
  });
});

describe("document upload size check (DC-01)", () => {
  const MB = 1024 * 1024;

  it("refuses a PDF over 50 MB with the verbatim message", () => {
    expect(() =>
      upload("SDS-bundle.pdf", 64 * MB, "application/pdf").run(),
    ).toThrow(
      "SDS-bundle.pdf is 64 MB. The limit is 50 MB. Compress it or split it.",
    );
    expect(() =>
      upload("a.pdf", IR_MAX_UPLOAD_BYTES + 1, "application/pdf").run(),
    ).toThrow("The limit is 50 MB");
  });

  it("accepts a PDF of exactly 50 MB and gives it an unguessable name", () => {
    const { req, args, run } = upload(
      "SDS Aluminium.pdf",
      IR_MAX_UPLOAD_BYTES,
      "application/pdf",
    );
    expect(run()).toBe(args);
    expect(req.file.name).toMatch(/^sds-aluminium-[0-9a-f]{24}\.pdf$/);
  });
});

describe("downloadFileName (DC-02)", () => {
  it("is the title plus .pdf", () => {
    expect(downloadFileName("SDS – Aluminium Sulfate (all grades)")).toBe(
      "SDS – Aluminium Sulfate (all grades).pdf",
    );
  });

  it("strips characters that are unsafe in file names", () => {
    expect(downloadFileName('PDS: "Alum"/Grade A.pdf')).toBe(
      "PDS Alum Grade A.pdf",
    );
  });

  it("is null without a usable title", () => {
    expect(downloadFileName("  ")).toBeNull();
    expect(downloadFileName(undefined)).toBeNull();
  });
});
