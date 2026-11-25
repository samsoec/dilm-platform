import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const params = vi.hoisted(() => ({ value: {} as { locale?: string } }));
vi.mock("next/navigation", () => ({ useParams: () => params.value }));

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
  it("uses the locale from the route, has no contact band and is noindex", () => {
    params.value = { locale: "id" };
    const { container, getByText } = render(<NotFound />);
    expect(getByText("Halaman tidak ditemukan", { exact: false })).toBeTruthy();
    expect(container.querySelector("[data-slot=contact-band]")).toBeNull();
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });

  it("falls back to the default locale for an unknown or missing locale", () => {
    params.value = { locale: "xx" };
    expect(
      render(<NotFound />).getByText("Page not found", { exact: false }),
    ).toBeTruthy();
    params.value = {};
    expect(
      render(<NotFound />).getAllByText("Page not found", { exact: false })
        .length,
    ).toBeGreaterThan(0);
  });
});
