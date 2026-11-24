import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { Analytics } from "./Analytics";

function resetGlobals() {
  const w = window as unknown as Record<string, unknown>;
  delete w.gtag;
  delete w.dataLayer;
}

beforeEach(resetGlobals);

afterEach(() => {
  resetGlobals();
  document.head.innerHTML = "";
  document.cookie = "dilm_consent=; max-age=0";
});

describe("Analytics", () => {
  it("loads gtag by default", () => {
    render(<Analytics measurementId="G-ABC1234" />);
    const script = document.querySelector("script[data-ga4]");
    expect(script?.getAttribute("src")).toContain("id=G-ABC1234");
    const layer = (window as unknown as { dataLayer: unknown[] }).dataLayer;
    expect(layer).toHaveLength(2);
    for (const entry of layer) {
      expect(Object.prototype.toString.call(entry)).toBe("[object Arguments]");
    }
  });

  it("does nothing once consent is denied", () => {
    document.cookie = "dilm_consent=denied";
    render(<Analytics measurementId="G-ABC1234" />);
    expect(document.querySelector("script[data-ga4]")).toBeNull();
  });
});
