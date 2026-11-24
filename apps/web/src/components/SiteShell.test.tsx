import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import NotFound, { metadata } from "@/app/[tenant]/[locale]/not-found";

import { SiteShell } from "./SiteShell";

describe("SiteShell", () => {
  it("renders header, main target and the contact band", () => {
    const { container } = render(<SiteShell>x</SiteShell>);
    expect(container.querySelector("main#main-content")).not.toBeNull();
    expect(container.querySelector("header")).not.toBeNull();
    expect(container.querySelector("[data-slot=contact-band]")).not.toBeNull();
  });

  it("drops the contact band on request", () => {
    const { container } = render(
      <SiteShell showContactBand={false}>x</SiteShell>,
    );
    expect(container.querySelector("footer")).not.toBeNull();
    expect(container.querySelector("[data-slot=contact-band]")).toBeNull();
  });
});

describe("not found page", () => {
  it("renders statically in the default locale, has no contact band and is noindex", () => {
    const { container, getByText } = render(<NotFound />);
    expect(getByText("Page not found", { exact: false })).toBeTruthy();
    expect(container.querySelector("[data-slot=contact-band]")).toBeNull();
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });
});
