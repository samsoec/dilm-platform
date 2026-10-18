import { describe, expect, it } from "vitest";

import { LIVE_DOCUMENT_CONTROLS } from "../../shell";
import { Footer } from "../../../collections/Footer";
import { Header } from "../../../collections/Header";
import { TenantSettings } from "../../../collections/TenantSettings";
import { savedAgo, savedToast, viewerNotice } from "./liveSave";

describe("save-goes-live controls (H-11, FR-UI-75)", () => {
  it.each([Header, Footer, TenantSettings])(
    "replace the save control on $slug and keep versions",
    (collection) => {
      expect(collection.admin?.components?.edit).toMatchObject(
        LIVE_DOCUMENT_CONTROLS,
      );
      expect(collection.versions).toBeTruthy();
    },
  );

  it("says when a layout save shows on the site", () => {
    expect(savedToast("header", 13, "duniakimia.com")).toEqual({
      title: "Header saved · version 13.",
      body: "duniakimia.com will show it within minutes.",
    });
  });

  it("says the header and footer refresh after a settings save (T-07)", () => {
    expect(savedToast("tenant-settings", 9, "duniakimia.com")).toEqual({
      title: "Company settings saved · v9.",
      body: "The header and footer on duniakimia.com refresh too.",
    });
  });

  it("tells a Viewer why there is no Save", () => {
    expect(viewerNotice("header")).toBe(
      "You can view the header as a Tenant Viewer. Save and Restore aren't shown.",
    );
  });

  it("dates the last save", () => {
    const now = Date.parse("2026-10-18T10:00:00Z");
    expect(savedAgo(now - 20_000, now)).toBe("just now");
    expect(savedAgo(now - 5 * 60_000, now)).toBe("5 min ago");
    expect(savedAgo(now - 3 * 3_600_000, now)).toBe("3 h ago");
  });
});
