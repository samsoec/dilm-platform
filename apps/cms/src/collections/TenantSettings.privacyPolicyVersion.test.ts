import type { Payload, TabsField, TextField } from "payload";
import { describe, expect, it, vi } from "vitest";

import { contactInquiry } from "../blocks/contactInquiry";
import { jobDetail } from "../blocks/jobDetail";
import {
  attachPrivacyPolicyVersion,
  PRIVACY_POLICY_VERSION_HINT,
  privacyPolicyVersionWarning,
} from "../consent/privacyPolicyVersion";
import { accessAs, applyMultiTenant, findField, testUser } from "../testing";
import { policyVersionChanged } from "../admin/siteMessages";
import { Tenants } from "./Tenants";
import { TenantSettings } from "./TenantSettings";
import { Users } from "./Users";

const superAdmin = testUser(["super-admin"]);
const editor = testUser(["tenant-editor"], [1]);
const viewer = testUser(["tenant-viewer"], [1]);

const tabs = TenantSettings.fields.find(
  (field): field is TabsField => field.type === "tabs",
)!;
const field = tabs.tabs
  .flatMap((tab) => tab.fields)
  .find(
    (candidate): candidate is TextField =>
      "name" in candidate && candidate.name === "privacyPolicyVersion",
  )!;

async function configured() {
  return (await applyMultiTenant([Users, Tenants, TenantSettings]))(
    "tenant-settings",
  );
}

describe("tenant-settings.privacyPolicyVersion", () => {
  it("is required, not localized, and described for editors", () => {
    expect(field.type).toBe("text");
    expect(field.required).toBe(true);
    expect(field.localized).toBeFalsy();
    expect(field.admin?.description).toBe(PRIVACY_POLICY_VERSION_HINT);
    expect(PRIVACY_POLICY_VERSION_HINT).toMatch(/every form consent/);
    expect(PRIVACY_POLICY_VERSION_HINT).toMatch(/Privacy Policy changes/);
  });

  it("rejects an empty value and accepts a version", async () => {
    const { text } = await import("payload/shared");
    const args = {
      required: true,
      req: {
        t: (key: string) => key,
        payload: { config: { localization: false } },
      },
    } as never;
    expect(await text("", args)).not.toBe(true);
    expect(await text(undefined, args)).not.toBe(true);
    expect(await text("2026-11", args)).toBe(true);
  });

  it("can be changed by Super Admins and Tenant Editors, not Viewers", async () => {
    const settings = await configured();
    expect(await accessAs(settings, "update", superAdmin)).toBe(true);
    expect(await accessAs(settings, "update", editor)).toEqual(
      expect.objectContaining({}),
    );
    expect(await accessAs(settings, "update", editor)).not.toBe(false);
    expect(await accessAs(settings, "update", viewer)).toBe(false);
    expect(await accessAs(settings, "read", viewer)).not.toBe(false);
  });

  it("keeps a version on every save, without drafts", () => {
    expect(TenantSettings.versions).toEqual({ drafts: false });
  });

  it("warns before a change and stays quiet otherwise", () => {
    expect(policyVersionChanged("2026-11", "2026-11").changed).toBe(false);
    expect(policyVersionChanged("2026-11", "2027-02").changed).toBe(true);
    expect(
      privacyPolicyVersionWarning("2026-11", "duniakimiautama.com"),
    ).toContain("Was 2026-11.");
    expect(privacyPolicyVersionWarning(undefined, undefined)).toContain(
      "Was not set.",
    );
  });

  it("is backfilled by the migration before it becomes required", async () => {
    const { readFileSync } = await import("node:fs");
    const sql = readFileSync(
      new URL(
        "../migrations/20261117_064501_privacy_policy_version.ts",
        import.meta.url,
      ),
      "utf8",
    );
    expect(sql.indexOf("UPDATE")).toBeLessThan(sql.indexOf("SET NOT NULL"));
  });
});

describe("the content read of form sections", () => {
  function request(version: string | undefined) {
    const find = vi.fn(async () => ({
      docs: version === undefined ? [] : [{ privacyPolicyVersion: version }],
    }));
    return {
      find,
      req: { payload: { find } as unknown as Payload, context: {} },
    };
  }

  it("puts the form group's version field on both form blocks", () => {
    for (const block of [contactInquiry, jobDetail]) {
      const form = findField(block.fields, "form") as {
        fields: { name?: string }[];
      };
      expect(form.fields.map((f) => f.name)).toContain("privacyPolicyVersion");
    }
  });

  it("returns the company's current value", async () => {
    const { find, req } = request("2026-11");
    const value = await attachPrivacyPolicyVersion({
      data: { tenant: 7 },
      req,
    } as never);
    expect(value).toBe("2026-11");
    expect(find).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: "tenant-settings",
        where: { tenant: { equals: 7 } },
      }),
    );
  });

  it("reads each company once per request", async () => {
    const { find, req } = request("2026-11");
    const run = () =>
      attachPrivacyPolicyVersion({ data: { tenant: { id: 7 } }, req } as never);
    await Promise.all([run(), run()]);
    expect(find).toHaveBeenCalledTimes(1);
  });

  it("returns null when the company or its setting is missing", async () => {
    const none = request(undefined);
    expect(
      await attachPrivacyPolicyVersion({
        data: { tenant: 7 },
        req: none.req,
      } as never),
    ).toBeNull();
    expect(
      await attachPrivacyPolicyVersion({
        data: {},
        req: request("x").req,
      } as never),
    ).toBeNull();
  });
});
