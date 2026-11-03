import type { Field, TabsField } from "payload";
import { describe, expect, it } from "vitest";

import { SETTINGS_TABS } from "../admin/data/completeness";
import { schemaShape } from "../schemaShape";
import { applyMultiTenant } from "../testing";
import { Tenants } from "./Tenants";
import { TenantSettings } from "./TenantSettings";
import { IrDocuments } from "./IrDocuments";
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

  it("lays the fields out in seven unnamed tabs (TRD-UI §6.6)", () => {
    expect(
      tabs.tabs.map((tab) => ("name" in tab ? tab.name : undefined)),
    ).toEqual(SETTINGS_TABS.map(() => undefined));
    expect(
      Object.fromEntries(
        tabs.tabs.map((tab) => [tab.label, topLevelNames(tab.fields)]),
      ),
    ).toEqual({
      General: ["siteName", "routing"],
      Brand: ["brand"],
      Contact: ["contactEmail", "contactPhone", "waLink"],
      Careers: ["recruiterEmail"],
      "Profile · optional": ["profile"],
      "Social · optional": ["socialLinks"],
      "SEO & analytics": ["defaultSeo", "analyticsId"],
    });
  });

  it("adds the optional company profile group (FR-PM-43)", async () => {
    const settings = (await applyMultiTenant([Users, Tenants, TenantSettings]))(
      "tenant-settings",
    );
    expect(
      schemaShape(settings.fields).filter((line) => line.startsWith("profile")),
    ).toEqual([
      "profile: group",
      "profile.hubLabel: text localized=true",
      "profile.shortDescription: textarea localized=true",
      "profile.coverImage: upload relationTo=media",
      "profile.regions: array maxRows=10",
      "profile.regions.name: text localized=true required=true",
      "profile.mapPin: group",
      "profile.mapPin.x: number min=0 max=100",
      "profile.mapPin.y: number min=0 max=100",
      "profile.mapLocation: group",
      "profile.mapLocation.latitude: number min=-90 max=90",
      "profile.mapLocation.longitude: number min=-180 max=180",
      "profile.googleMapsUrl: text",
    ]);
  });

  it("adds an optional cover and summary to IR documents (FR-PM-44)", async () => {
    const ir = (await applyMultiTenant([Users, Tenants, IrDocuments]))(
      "ir-documents",
    );
    expect(
      schemaShape(ir.fields).filter((line) =>
        /^(coverImage|summary):/.test(line),
      ),
    ).toEqual(["coverImage: upload relationTo=media", "summary: textarea"]);
  });

  it("puts the completeness panel in the sidebar", () => {
    expect(TenantSettings.fields[0]).toMatchObject({
      name: "completeness",
      type: "ui",
      admin: { position: "sidebar" },
    });
  });
});
