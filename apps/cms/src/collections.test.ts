import type {
  AccessArgs,
  CollectionConfig,
  Field,
  FieldAccess,
  RelationshipField,
} from "payload";
import { describe, expect, it } from "vitest";

import type { Role } from "./access";
import { ConsentLogs } from "./collections/ConsentLogs";
import { CvSubmissions } from "./collections/CvSubmissions";
import { IrDocuments } from "./collections/IrDocuments";
import { Media } from "./collections/Media";
import { TenantSettings } from "./collections/TenantSettings";
import { Tenants } from "./collections/Tenants";
import { Users } from "./collections/Users";
import { applyMultiTenant, fieldNames } from "./testing";

const ALL = [
  Users,
  Tenants,
  TenantSettings,
  Media,
  ConsentLogs,
  IrDocuments,
  CvSubmissions,
];

const TENANT_SCOPED = [
  "tenant-settings",
  "media",
  "consent-logs",
  "ir-documents",
  "cv-submissions",
];

const IP_ADDRESS_PATTERN =
  /^ip$|^ip[A-Z_]|Ip$|ip_?address|remoteAddr|forwarded/i;

const SYSTEM_MANAGED = [
  "applicantNotifiedAt",
  "recruiterNotifiedAt",
  "externalSyncStatus",
  "externalSyncAttempts",
];

function user(roles: Role[], tenantIds: number[] = []) {
  return {
    id: 99,
    collection: "users",
    roles,
    tenants: tenantIds.map((tenant) => ({ tenant })),
  };
}

const superAdmin = user(["super-admin"]);
const editor = user(["tenant-editor"], [1]);
const viewer = user(["tenant-viewer"], [1]);

function configured() {
  return applyMultiTenant(ALL);
}

function call(
  collection: CollectionConfig,
  key: "read" | "create" | "update" | "delete",
  as: object | null,
) {
  return collection.access![key]!({ req: { user: as } } as AccessArgs);
}

function field(collection: CollectionConfig, name: string): Field {
  const found = collection.fields.find(
    (candidate) => "name" in candidate && candidate.name === name,
  );
  if (!found) throw new Error(`${collection.slug} has no ${name} field`);
  return found;
}

function fieldAllows(
  collection: CollectionConfig,
  name: string,
  key: "create" | "update",
  as: object,
) {
  const access = (
    field(collection, name) as { access?: Record<string, FieldAccess> }
  ).access?.[key];
  if (!access) return true;
  return access({ req: { user: as } } as Parameters<FieldAccess>[0]);
}

describe("the seven collections", () => {
  it("are all registered", async () => {
    const collection = await configured();

    for (const { slug } of ALL) {
      expect(collection(slug).slug).toBe(slug);
    }
    expect(ALL).toHaveLength(7);
  });

  it("put every content collection under a required tenant", async () => {
    const collection = await configured();

    for (const slug of TENANT_SCOPED) {
      expect(field(collection(slug), "tenant")).toMatchObject({
        type: "relationship",
        relationTo: "tenants",
        validate: expect.any(Function),
      });
    }
  });

  it("scope every content collection's reads to the user's tenants", async () => {
    const collection = await configured();

    for (const slug of TENANT_SCOPED) {
      expect(await call(collection(slug), "read", viewer)).toEqual({
        tenant: { in: [1] },
      });
      expect(await call(collection(slug), "read", superAdmin)).toBe(true);
    }
  });

  it("store no IP address anywhere (FR-CMS-15, NFR-CMS-08)", async () => {
    const collection = await configured();

    for (const { slug } of ALL) {
      expect(
        fieldNames(collection(slug).fields).filter((name) =>
          IP_ADDRESS_PATTERN.test(name),
        ),
      ).toEqual([]);
    }
  });
});

describe("users", () => {
  it("carries roles and a list of tenants", async () => {
    const users = (await configured())("users");
    const tenants = field(users, "tenants") as { fields: Field[] };

    expect(field(users, "roles")).toMatchObject({
      type: "select",
      hasMany: true,
    });
    expect(field({ ...users, fields: tenants.fields }, "tenant")).toMatchObject(
      { type: "relationship", relationTo: "tenants" },
    );
  });
});

describe("tenant-settings", () => {
  it("holds one document per tenant", async () => {
    const settings = (await configured())("tenant-settings");

    expect(field(settings, "tenant")).toMatchObject({ unique: true });
  });

  it("has the settings fields", () => {
    expect(fieldNames(TenantSettings.fields)).toEqual(
      expect.arrayContaining([
        "siteName",
        "contactEmail",
        "contactPhone",
        "recruiterEmail",
        "socialLinks",
        "defaultSeo",
        "title",
        "description",
        "ogImage",
        "analyticsId",
        "waLink",
      ]),
    );
  });

  it("lets editors edit their tenant's settings but only Super Admins delete them", async () => {
    const settings = (await configured())("tenant-settings");

    expect(await call(settings, "update", editor)).toEqual({
      tenant: { in: [1] },
    });
    expect(await call(settings, "update", viewer)).toBe(false);
    expect(await call(settings, "delete", editor)).toBe(false);
    expect(await call(settings, "delete", superAdmin)).toBe(true);
  });
});

describe("media", () => {
  it("stays publicly readable for the website", async () => {
    const media = (await configured())("media");

    expect(await call(media, "read", null)).toBe(true);
  });
});

describe("consent-logs", () => {
  it("records only timestamp, policy version, related record, tenant and type", async () => {
    const logs = (await configured())("consent-logs");

    expect(fieldNames(logs.fields).sort()).toEqual(
      [
        "consentType",
        "policyVersion",
        "relatedRecordId",
        "tenant",
        "timestamp",
      ].sort(),
    );
  });

  it("can't be written or edited through the admin, only deleted by Super Admins", async () => {
    const logs = (await configured())("consent-logs");

    for (const as of [superAdmin, editor]) {
      expect(await call(logs, "create", as)).toBe(false);
      expect(await call(logs, "update", as)).toBe(false);
    }
    expect(await call(logs, "delete", editor)).toBe(false);
    expect(await call(logs, "delete", superAdmin)).toBe(true);
  });
});

describe("ir-documents", () => {
  it("is a PDF upload with the IR fields", () => {
    expect(IrDocuments.upload).toMatchObject({
      mimeTypes: ["application/pdf"],
    });
    expect(fieldNames(IrDocuments.fields)).toEqual([
      "title",
      "documentType",
      "publishedDate",
      "locale",
    ]);
  });

  it("is editable by Tenant Editors, read-only for Tenant Viewers", async () => {
    const documents = (await configured())("ir-documents");

    expect(await call(documents, "create", editor)).toEqual({
      tenant: { in: [1] },
    });
    expect(await call(documents, "create", viewer)).toBe(false);
  });
});

describe("cv-submissions", () => {
  it("has the application, notification and sync fields", () => {
    expect(fieldNames(CvSubmissions.fields)).toEqual([
      "submissionId",
      "applicantName",
      "email",
      "phone",
      "position",
      "resumeFileKey",
      "submittedAt",
      "status",
      ...SYSTEM_MANAGED,
    ]);
  });

  it("keys submissions on a unique submissionId", () => {
    expect(field(CvSubmissions, "submissionId")).toMatchObject({
      type: "text",
      unique: true,
      required: true,
    });
  });

  it("references the résumé by storage key, not an upload field (FR-CMS-16)", () => {
    expect(field(CvSubmissions, "resumeFileKey")).toMatchObject({
      type: "text",
    });
    expect(
      CvSubmissions.fields.filter(
        (candidate) =>
          candidate.type === "upload" ||
          (candidate.type === "relationship" &&
            (candidate as RelationshipField).relationTo === "media"),
      ),
    ).toEqual([]);
    expect(CvSubmissions.upload).toBeUndefined();
  });

  it("keeps system-managed fields read-only for every role", async () => {
    const submissions = (await configured())("cv-submissions");

    for (const name of SYSTEM_MANAGED) {
      expect(field(submissions, name)).toMatchObject({
        admin: { readOnly: true },
      });
      for (const as of [superAdmin, editor, viewer]) {
        expect(fieldAllows(submissions, name, "create", as)).toBe(false);
        expect(fieldAllows(submissions, name, "update", as)).toBe(false);
      }
    }
  });

  it("lets Tenant Editors move an application's status", async () => {
    const submissions = (await configured())("cv-submissions");

    expect(fieldAllows(submissions, "status", "update", editor)).toBe(true);
    expect(await call(submissions, "update", editor)).toEqual({
      tenant: { in: [1] },
    });
    expect(await call(submissions, "update", viewer)).toBe(false);
  });

  it("is only ever created by the CV consumer", async () => {
    const submissions = (await configured())("cv-submissions");

    for (const as of [superAdmin, editor]) {
      expect(await call(submissions, "create", as)).toBe(false);
    }
    expect(await call(submissions, "delete", editor)).toBe(false);
    expect(await call(submissions, "delete", superAdmin)).toBe(true);
  });
});
