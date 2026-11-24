import { describe, expect, it, vi } from "vitest";

vi.mock("@/content/client", () => ({
  readTenant: vi.fn(async () => ({ analyticsId: "G-ABC1234" })),
}));

import { analyticsAllowed, parseConsent } from "./consent";
import { readMeasurementId, usableMeasurementId } from "./measurementId";

describe("consent", () => {
  it("defaults to allowed", () => {
    expect(analyticsAllowed("")).toBe(true);
    expect(analyticsAllowed("a=b")).toBe(true);
  });
  it("reads the cookie", () => {
    expect(parseConsent("a=b; dilm_consent=denied")).toBe("denied");
    expect(parseConsent("dilm_consent=junk")).toBe("allowed");
  });
});

describe("measurement id", () => {
  it("rejects empty and malformed ids", () => {
    expect(usableMeasurementId(null)).toBeNull();
    expect(usableMeasurementId("  ")).toBeNull();
    expect(usableMeasurementId('x"><script>')).toBeNull();
    expect(usableMeasurementId(" G-ABC1234 ")).toBe("G-ABC1234");
  });
  it("is null outside production", async () => {
    expect(
      await readMeasurementId("indoacid", "id", {
        SITE_STAGE: "staging",
      }),
    ).toBeNull();
    expect(await readMeasurementId("indoacid", "id", {})).toBeNull();
  });
  it("returns the id in production", async () => {
    expect(
      await readMeasurementId("indoacid", "id", {
        SITE_STAGE: "production",
      }),
    ).toBe("G-ABC1234");
  });
});
