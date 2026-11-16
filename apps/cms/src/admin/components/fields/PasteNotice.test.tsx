// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@payloadcms/ui", () => ({
  FieldLabel: () => null,
  useField: () => ({}),
  useFormFields: () => undefined,
  useRowLabel: () => ({}),
}));

import { PasteNotice } from "./SectionKit";

afterEach(cleanup);

function paste(target: Element, html: string) {
  fireEvent.paste(target, {
    clipboardData: {
      getData: (type: string) => (type === "text/html" ? html : ""),
    },
  });
}

describe("PasteNotice", () => {
  it("tells the editor what a paste carried, at the moment of the paste", () => {
    render(
      <div className="field-type">
        <div data-testid="editor" />
        <PasteNotice />
      </div>,
    );
    expect(screen.queryByRole("status")).toBeNull();
    paste(
      screen.getByTestId("editor"),
      '<p><strong>Big</strong> <a href="/x">news</a></p>',
    );
    expect(screen.getByRole("status").textContent).toContain(
      "Pasted bold and a link were removed from the title.",
    );
    paste(screen.getByTestId("editor"), "<i>plain</i>");
    expect(screen.queryByRole("status")).toBeNull();
  });
});
