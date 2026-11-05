// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { ParentOption } from "./newPage";
import { ParentPicker } from "./ParentPicker";

const OPTIONS: ParentOption[] = [
  {
    id: "5",
    collection: "pages",
    title: "Sustainability",
    shared: false,
    paths: { en: "/sustainability", id: "/keberlanjutan" },
  },
  {
    id: "1",
    collection: "pages",
    title: "About Us",
    shared: false,
    paths: { en: "/about-us", id: "/tentang-kami" },
  },
  {
    id: "2",
    collection: "pages",
    title: "Overview",
    shared: false,
    paths: { en: "/about-us/overview", id: "/tentang-kami/ikhtisar" },
  },
  {
    id: "9",
    collection: "shared-pages",
    title: "Products & Solutions",
    shared: true,
    paths: { en: "/products-solutions", id: "/produk-solusi" },
  },
];

function Harness({
  initial = null,
  onKeyDown,
  onPick,
}: {
  initial?: string | null;
  onKeyDown?: () => void;
  onPick?: (id: string | null) => void;
}) {
  const [value, setValue] = useState<string | null>(initial);
  return (
    <div onKeyDown={onKeyDown}>
      <ParentPicker
        label="Parent page"
        onChange={(id) => {
          setValue(id);
          onPick?.(id);
        }}
        options={OPTIONS}
        value={value}
      />
    </div>
  );
}

const trigger = () => screen.getByRole("button", { name: /Parent page/ });
const names = () =>
  screen
    .getAllByRole("option")
    .map(
      (option) => option.querySelector(".dil-picker__text")?.textContent ?? "",
    );

afterEach(cleanup);

describe("ParentPicker (PG-03)", () => {
  it("starts on No parent (top level) with the list closed", () => {
    render(<Harness />);
    expect(trigger().textContent).toContain("No parent (top level)");
    expect(trigger().getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("opens with a search box, No parent first, paths, then shared pages", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(trigger());
    expect(document.activeElement).toBe(
      screen.getByRole("combobox", { name: "Search pages" }),
    );
    expect(names()).toEqual([
      "No parent (top level)",
      "About Us/about-us",
      "Overview/about-us/overview",
      "Sustainability/sustainability",
      "Products & SolutionsShared, can't be a parent",
    ]);
  });

  it("lists shared pages but disabled, and ignores clicks on them", async () => {
    const user = userEvent.setup();
    const onPick = vi.fn();
    render(<Harness onPick={onPick} />);
    await user.click(trigger());
    const shared = screen.getByRole("option", { name: /Products & Solutions/ });
    expect(shared.getAttribute("aria-disabled")).toBe("true");
    expect(within(shared).getByText("Shared, can't be a parent")).toBeTruthy();
    await user.click(shared);
    expect(onPick).not.toHaveBeenCalled();
    expect(screen.getByRole("listbox")).toBeTruthy();
  });

  it("picks a page and shows it on the button", async () => {
    const user = userEvent.setup();
    const onPick = vi.fn();
    render(<Harness onPick={onPick} />);
    await user.click(trigger());
    await user.click(screen.getByRole("option", { name: /Overview/ }));
    expect(onPick).toHaveBeenCalledWith("2");
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(trigger().textContent).toContain("Overview");
    expect(document.activeElement).toBe(trigger());
  });

  it("goes back to top level with No parent (top level)", async () => {
    const user = userEvent.setup();
    const onPick = vi.fn();
    render(<Harness initial="1" onPick={onPick} />);
    await user.click(trigger());
    expect(
      screen
        .getByRole("option", { name: /About Us/ })
        .getAttribute("aria-selected"),
    ).toBe("true");
    await user.click(
      screen.getByRole("option", { name: "No parent (top level)" }),
    );
    expect(onPick).toHaveBeenCalledWith(null);
    expect(trigger().textContent).toContain("No parent (top level)");
  });

  it("searches titles and paths", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(trigger());
    await user.type(screen.getByRole("combobox"), "about");
    expect(names()).toEqual([
      "About Us/about-us",
      "Overview/about-us/overview",
    ]);
    await user.clear(screen.getByRole("combobox"));
    await user.type(screen.getByRole("combobox"), "solutions");
    expect(names()).toEqual(["Products & SolutionsShared, can't be a parent"]);
    await user.clear(screen.getByRole("combobox"));
    await user.type(screen.getByRole("combobox"), "zzz");
    expect(screen.queryAllByRole("option")).toHaveLength(0);
    expect(screen.getByText("No pages match.")).toBeTruthy();
  });

  it("moves with the arrow keys over enabled entries only and picks with Enter", async () => {
    const user = userEvent.setup();
    const onPick = vi.fn();
    render(<Harness onPick={onPick} />);
    await user.click(trigger());
    const search = screen.getByRole("combobox");
    const active = () =>
      document.getElementById(search.getAttribute("aria-activedescendant")!)
        ?.textContent;
    expect(active()).toContain("No parent");
    await user.keyboard("{ArrowDown}");
    expect(active()).toContain("About Us");
    await user.keyboard("{ArrowDown}{ArrowDown}");
    expect(active()).toContain("Sustainability");
    await user.keyboard("{ArrowDown}");
    expect(active()).toContain("No parent");
    await user.keyboard("{ArrowUp}");
    expect(active()).toContain("Sustainability");
    await user.keyboard("{Enter}");
    expect(onPick).toHaveBeenCalledWith("5");
  });

  it("closes on Escape without letting the dialog around it see the key", async () => {
    const user = userEvent.setup();
    const outer = vi.fn();
    render(<Harness onKeyDown={outer} />);
    await user.click(trigger());
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(outer).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(trigger());
  });

  it("closes when focus leaves it", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Harness />
        <button type="button">Elsewhere</button>
      </>,
    );
    await user.click(trigger());
    await user.click(screen.getByRole("button", { name: "Elsewhere" }));
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("can be disabled", () => {
    render(
      <ParentPicker
        disabled
        label="Parent page"
        onChange={() => undefined}
        options={[]}
        value={null}
      />,
    );
    expect((trigger() as HTMLButtonElement).disabled).toBe(true);
  });
});
