import { render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Analytics } from "./Analytics";

afterEach(() => {
  document.head.innerHTML = "";
  document.cookie = "dilm_consent=; max-age=0";
});

describe("Analytics", () => {
  it("loads gtag by default", () => {
    render(<Analytics measurementId="G-ABC1234" />);
    const script = document.querySelector("script[data-ga4]");
    expect(script?.getAttribute("src")).toContain("id=G-ABC1234");
  });

  it("does nothing once consent is denied", () => {
    document.cookie = "dilm_consent=denied";
    render(<Analytics measurementId="G-ABC1234" />);
    expect(document.querySelector("script[data-ga4]")).toBeNull();
  });
});
