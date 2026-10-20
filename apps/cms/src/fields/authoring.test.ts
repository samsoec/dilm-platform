import type { CollectionBeforeChangeHook, JsonObject } from "payload";
import { describe, expect, it } from "vitest";

import { authorName, REMOVED_USER } from "../admin/authors";
import { CvSubmissions } from "../collections/CvSubmissions";
import { IrDocuments } from "../collections/IrDocuments";
import { Media } from "../collections/Media";
import { Tenants } from "../collections/Tenants";
import { Users } from "../collections/Users";
import { applyMultiTenant, findField, testUser } from "../testing";
import {
  stampStatusChange,
  stampUploadedBy,
  statusChangedAtField,
  statusChangedByField,
  uploadedByField,
} from "./authoring";
import { SYSTEM_WRITE } from "./systemWrite";
import { stampUpdatedBy, updatedByField } from "./updatedBy";

const editor = testUser(["tenant-editor"], [1]);

type HookArgs = Parameters<CollectionBeforeChangeHook>[0];

function run(
  hook: CollectionBeforeChangeHook,
  {
    data,
    operation = "update",
    originalDoc,
    user = editor,
    context = {},
  }: {
    data: JsonObject;
    operation?: "create" | "update";
    originalDoc?: JsonObject;
    user?: object | null;
    context?: object;
  },
) {
  return hook({
    data,
    operation,
    originalDoc,
    req: { user, context },
  } as unknown as HookArgs);
}

describe("media.uploadedBy (FR-UI-62)", () => {
  it("stamps the uploader on create", () => {
    expect(
      run(stampUploadedBy, { data: { alt: "Plant" }, operation: "create" }),
    ).toEqual({ alt: "Plant", uploadedBy: editor.id });
  });

  it("never changes on later saves without a new file", () => {
    expect(
      run(stampUploadedBy, { data: { alt: "New alt", uploadedBy: 99 } }),
    ).toEqual({ alt: "New alt", uploadedBy: 99 });
  });

  it("re-stamps whoever uploads a replacement file (DILM-92)", () => {
    expect(
      stampUploadedBy({
        data: { title: "Laporan", uploadedBy: 99 },
        operation: "update",
        req: { user: editor, context: {}, file: { name: "new.pdf" } },
      } as unknown as HookArgs),
    ).toEqual({ title: "Laporan", uploadedBy: editor.id });
  });
});

describe("cv-submissions status stamp (FR-UI-62)", () => {
  it("stamps who and when only when the status changes", () => {
    const stamped = run(stampStatusChange, {
      data: { status: "shortlisted" },
      originalDoc: { status: "received" },
    });
    expect(stamped).toMatchObject({
      status: "shortlisted",
      statusChangedBy: editor.id,
      statusChangedAt: expect.stringMatching(/^\d{4}-\d\d-\d\dT/),
    });
  });

  it("leaves other saves alone", () => {
    expect(
      run(stampStatusChange, {
        data: { status: "received", applicantNotifiedAt: "x" },
        originalDoc: { status: "received" },
      }),
    ).toEqual({ status: "received", applicantNotifiedAt: "x" });
    expect(
      run(stampStatusChange, { data: { applicantNotifiedAt: "x" } }),
    ).toEqual({ applicantNotifiedAt: "x" });
  });

  it("doesn't stamp the intake's create", () => {
    expect(
      run(stampStatusChange, {
        data: { status: "received" },
        operation: "create",
      }),
    ).toEqual({ status: "received" });
  });
});

describe("system writes", () => {
  it.each([
    ["updatedBy", stampUpdatedBy, "update"],
    ["uploadedBy", stampUploadedBy, "create"],
    ["statusChangedBy", stampStatusChange, "update"],
  ] as const)(
    "skip the %s stamp when the request carries SYSTEM_WRITE",
    (_, hook, operation) => {
      const data = { status: "reviewed" };
      expect(
        run(hook, {
          data,
          operation,
          originalDoc: { status: "received" },
          context: SYSTEM_WRITE,
        }),
      ).toEqual(data);
    },
  );

  it("skip every stamp when there is no signed-in user", () => {
    const data = { status: "reviewed" };
    expect(
      run(stampStatusChange, {
        data,
        originalDoc: { status: "received" },
        user: null,
      }),
    ).toEqual(data);
  });
});

describe("the stamp fields", () => {
  it.each([uploadedByField, statusChangedByField, statusChangedAtField])(
    "$name is read-only and can't be set by anyone",
    async (field) => {
      const args = { req: { user: editor } } as never;
      expect(field.admin).toMatchObject({ readOnly: true });
      expect(await field.access!.create!(args)).toBe(false);
      expect(await field.access!.update!(args)).toBe(false);
    },
  );

  it("are on their collections after the multi-tenant plugin", async () => {
    const collection = await applyMultiTenant([
      Users,
      Tenants,
      Media,
      IrDocuments,
      CvSubmissions,
    ]);

    expect(findField(collection("media").fields, "uploadedBy")).toEqual(
      uploadedByField,
    );
    expect(collection("media").hooks?.beforeChange).toContain(stampUploadedBy);
    expect(findField(collection("ir-documents").fields, "updatedBy")).toEqual(
      updatedByField,
    );
    expect(collection("ir-documents").hooks?.beforeChange).toContain(
      stampUpdatedBy,
    );
    expect(
      findField(collection("cv-submissions").fields, "statusChangedBy"),
    ).toEqual(statusChangedByField);
    expect(
      findField(collection("cv-submissions").fields, "statusChangedAt"),
    ).toEqual(statusChangedAtField);
    expect(collection("cv-submissions").hooks?.beforeChange).toContain(
      stampStatusChange,
    );
  });
});

describe("authorName", () => {
  it("names a readable author", () => {
    expect(authorName({ id: 1, name: "Dimas Pratama" }, true)).toBe(
      "Dimas Pratama",
    );
    expect(authorName({ id: 1, name: "", email: "d@x.id" }, true)).toBe(
      "d@x.id",
    );
  });

  it("says Removed user when a stamped author was deleted", () => {
    expect(authorName(null, true)).toBe(REMOVED_USER);
    expect(authorName(undefined, true)).toBe("Removed user");
  });

  it("says nothing when no stamp was ever made", () => {
    expect(authorName(null, false)).toBeUndefined();
  });

  it("says nothing for an author the viewer may not read", () => {
    expect(authorName(7, true)).toBeUndefined();
    expect(authorName({ id: 7 }, true)).toBeUndefined();
  });
});
