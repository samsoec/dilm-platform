import { describe, expect, it } from "vitest";

import { schemaShape } from "../schemaShape";
import { applyMultiTenant } from "../testing";
import { Tenants } from "./Tenants";
import { TenantSettings } from "./TenantSettings";
import { Users } from "./Users";

describe("tenant-settings data shape (FR-UI-44)", () => {
  it("keeps every data path, so the admin layout needs no migration", async () => {
    const settings = (await applyMultiTenant([Users, Tenants, TenantSettings]))(
      "tenant-settings",
    );
    expect(schemaShape(settings.fields).sort()).toMatchSnapshot();
  });
});
