// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { slugField } from "../../../fields/pageFields";
import { SLUG_PATTERN } from "../../../slugRules";
import { GENERATE_SLUG_LABEL, GenerateSlugButton } from "./GenerateSlugButton";

const world = vi.hoisted(() => ({
  fields: {} as Record<string, { value: unknown }>,
  setValue: vi.fn(),
}));

vi.mock("@payloadcms/ui", () => ({
  useFormFields: (select: (state: [unknown, unknown]) => unknown) =>
    select([world.fields, vi.fn()]),
  useField: () => ({ setValue: world.setValue }),
}));

afterEach(() => {
  cleanup();
  world.setValue.mockReset();
});

function show() {
  const Button = GenerateSlugButton as (props: {
    path: string;
  }) => React.ReactElement;
  render(<Button path="slug" />);
  return screen.getByRole("button", {
    name: GENERATE_SLUG_LABEL,
  }) as HTMLButtonElement;
}

describe("GenerateSlugButton", () => {
  it("is disabled while the name is empty", () => {
    world.fields = { title: { value: "  " } };
    const button = show();
    expect(button.disabled).toBe(true);
    fireEvent.click(button);
    expect(world.setValue).not.toHaveBeenCalled();
  });

  it("fills a valid kebab-case slug from the title on click only", () => {
    world.fields = { title: { value: "Pabrik Baru Kimia & Asam!" } };
    const button = show();
    expect(world.setValue).not.toHaveBeenCalled();
    fireEvent.click(button);
    const value = world.setValue.mock.calls[0]?.[0] as string;
    expect(value).toBe("pabrik-baru-kimia-asam");
    expect(SLUG_PATTERN.test(value)).toBe(true);
  });

  it("reads the name field for categories", () => {
    world.fields = { name: { value: "Berita Terbaru" } };
    fireEvent.click(show());
    expect(world.setValue).toHaveBeenCalledWith("berita-terbaru");
  });
});

describe("slugField", () => {
  it("carries the generate button", () => {
    expect(slugField(true).admin?.components?.afterInput).toHaveLength(1);
  });
});
