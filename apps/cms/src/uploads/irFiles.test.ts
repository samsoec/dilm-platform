import { describe, expect, it } from "vitest";

import { trashByEditorsDeleteBySuperAdmins } from "../access";
import { ConsentLogs } from "../collections/ConsentLogs";
import { CvSubmissions } from "../collections/CvSubmissions";
import { IrDocuments } from "../collections/IrDocuments";
import { Media } from "../collections/Media";
import { TenantSettings } from "../collections/TenantSettings";
import {
  IR_MAX_UPLOAD_BYTES,
  keepPublishedFile,
  PDF_TOO_LARGE,
  PUBLISHED_FILE_LOCKED,
  randomiseUploadName,
  stampFirstPublished,
  unguessableName,
} from "./irFiles";

const superAdmin = { id: 1, roles: ["super-admin"] };
const editor = { id: 2, roles: ["tenant-editor"], tenants: [{ tenant: 2 }] };
const viewer = { id: 3, roles: ["tenant-viewer"], tenants: [{ tenant: 2 }] };

describe("trash and delete access (Backend Spec §7.8)", () => {
  const run = (user: object, data?: object) =>
    trashByEditorsDeleteBySuperAdmins({ req: { user }, data } as never);

  it("lets a Tenant Editor trash but not permanently delete", () => {
    expect(run(editor, { deletedAt: "2026-10-20T00:00:00.000Z" })).toBe(true);
    expect(run(editor)).toBe(false);
  });

  it("lets only a Super Admin permanently delete", () => {
    expect(run(superAdmin)).toBe(true);
    expect(run(viewer, { deletedAt: "2026-10-20T00:00:00.000Z" })).toBe(false);
  });
});

describe("collection setup", () => {
  it("gives IR documents drafts, capped versions and trash", () => {
    expect(IrDocuments.versions).toMatchObject({ drafts: true, maxPerDoc: 50 });
    expect(IrDocuments.trash).toBe(true);
    expect(IrDocuments.access?.delete).toBe(trashByEditorsDeleteBySuperAdmins);
  });

  it("trashes media too, but never applications or consent (UU PDP erasure)", () => {
    expect(Media.trash).toBe(true);
    expect(Media.access?.delete).toBe(trashByEditorsDeleteBySuperAdmins);
    expect(CvSubmissions.trash).toBeFalsy();
    expect(ConsentLogs.trash).toBeFalsy();
  });

  it("keeps company settings to versions without drafts", () => {
    expect(TenantSettings.versions).toMatchObject({ drafts: false });
    expect(TenantSettings.trash).toBeFalsy();
  });
});

describe("unguessableName", () => {
  it("keeps a readable stem and adds a random suffix", () => {
    expect(unguessableName("Laporan Tahunan 2025.PDF", "abc123")).toBe(
      "laporan-tahunan-2025-abc123.pdf",
    );
  });

  it("gives every upload of the same file a different name", () => {
    expect(unguessableName("a.pdf")).not.toBe(unguessableName("a.pdf"));
    expect(unguessableName("a.pdf")).toMatch(/^a-[0-9a-f]{24}\.pdf$/);
  });
});

describe("published file guard", () => {
  type Args = Parameters<typeof keepPublishedFile>[0];
  const run = (args: Partial<Args>) =>
    keepPublishedFile({
      operation: "update",
      req: {},
      data: {},
      ...args,
    } as Args);

  it("refuses a new PDF once the document has been published", () => {
    expect(() =>
      run({
        originalDoc: { firstPublishedAt: "2026-10-01", filename: "a.pdf" },
        req: { file: {} } as never,
      }),
    ).toThrow(PUBLISHED_FILE_LOCKED);
    expect(() =>
      run({
        originalDoc: { firstPublishedAt: "2026-10-01", filename: "a.pdf" },
        data: { filename: "b.pdf" },
      }),
    ).toThrow(PUBLISHED_FILE_LOCKED);
  });

  it("allows replacing a draft's file and editing a published document's details", () => {
    expect(
      run({ originalDoc: { filename: "a.pdf" }, req: { file: {} } as never }),
    ).toEqual({});
    expect(
      run({
        originalDoc: { firstPublishedAt: "2026-10-01", filename: "a.pdf" },
        data: { title: "New" },
      }),
    ).toEqual({ title: "New" });
  });

  it("stamps the first publication once", () => {
    const stamp = (data: object, originalDoc: object) =>
      stampFirstPublished({ data, originalDoc } as never) as Record<
        string,
        unknown
      >;
    expect(stamp({ _status: "published" }, {}).firstPublishedAt).toBeTruthy();
    expect(
      stamp({ _status: "published" }, { firstPublishedAt: "x" })
        .firstPublishedAt,
    ).toBeUndefined();
    expect(stamp({ _status: "draft" }, {}).firstPublishedAt).toBeUndefined();
  });
});

describe("randomiseUploadName (DILM-92)", () => {
  const upload = (size: number) => {
    const req = { file: { name: "Laporan Tahunan.pdf", size } };
    const args = { data: {} };
    const result = randomiseUploadName({
      args,
      operation: "create",
      req,
    } as never);
    return { req, result, args };
  };

  it("renames PDFs up to 50 MB", () => {
    const { req, result, args } = upload(IR_MAX_UPLOAD_BYTES);
    expect(result).toBe(args);
    expect(req.file.name).toMatch(/^laporan-tahunan-[0-9a-f]{24}\.pdf$/);
  });

  it("refuses anything over 50 MB on the server too", () => {
    expect(() => upload(IR_MAX_UPLOAD_BYTES + 1)).toThrow(PDF_TOO_LARGE);
  });
});
