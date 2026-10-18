import type { Field, TabsField } from "payload";
import { describe, expect, it } from "vitest";

import { SETTINGS_TABS } from "../admin/data/completeness";
import { schemaShape } from "../schemaShape";
import { applyMultiTenant } from "../testing";
import { Tenants } from "./Tenants";
import { TenantSettings } from "./TenantSettings";
import { Users } from "./Users";

const tabs = TenantSettings.fields.find(
  (field): field is TabsField => field.type === "tabs",
)!;

function topLevelNames(fields: Field[]): string[] {
  return fields.flatMap((field) => {
    if (field.type === "ui") return [];
    if ("name" in field) return [field.name];
    return "fields" in field ? topLevelNames(field.fields) : [];
  });
}

describe("tenant-settings data shape (FR-UI-44)", () => {
  it("keeps every data path, so the admin layout needs no migration", async () => {
    const settings = (await applyMultiTenant([Users, Tenants, TenantSettings]))(
      "tenant-settings",
    );
    expect(schemaShape(settings.fields).sort()).toMatchSnapshot();
  });

  it("lays the fields out in six unnamed tabs (TRD-UI §6.6)", () => {
    expect(
      tabs.tabs.map((tab) => ("name" in tab ? tab.name : undefined)),
    ).toEqual(SETTINGS_TABS.map(() => undefined));
    expect(
      Object.fromEntries(
        tabs.tabs.map((tab) => [tab.label, topLevelNames(tab.fields)]),
      ),
    ).toEqual({
      General: ["siteName"],
      Brand: ["brand"],
      Contact: ["contactEmail", "contactPhone", "waLink"],
      Careers: ["recruiterEmail"],
      "Social · optional": ["socialLinks"],
      "SEO & analytics": ["defaultSeo", "analyticsId"],
    });
  });

  it("puts the completeness panel in the sidebar", () => {
    expect(TenantSettings.fields[0]).toMatchObject({
      name: "completeness",
      type: "ui",
      admin: { position: "sidebar" },
    });
  });
});
