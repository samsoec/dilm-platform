// @vitest-environment jsdom
import { ModalContainer, ModalProvider } from "@faceless-ui/modal";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode, Ref } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { NewPageButton, NewPageHost, useNewPage } from "./NewPageHost";
import { newPageListPath } from "./NewPageRedirect";

const { replace, search } = vi.hoisted(() => ({
  replace: vi.fn(),
  search: { current: "" },
}));

vi.mock("@payloadcms/ui", async () => {
  const modal = await import("@faceless-ui/modal");
  return {
    Modal: modal.Modal,
    useModal: modal.useModal,
    useConfig: () => ({
      config: {
        routes: { admin: "/admin", api: "/api" },
        serverURL: "",
        localization: { localeCodes: ["en", "id"], defaultLocale: "en" },
      },
    }),
    Button: ({
      children,
      className,
      disabled,
      onClick,
      ref,
      type,
      url,
    }: {
      children: ReactNode;
      className?: string;
      disabled?: boolean;
      onClick?: () => void;
      ref?: Ref<HTMLButtonElement>;
      type?: "button" | "submit";
      url?: string;
    }) =>
      url ? (
        <a className={className} href={url}>
          {children}
        </a>
      ) : (
        <button
          className={className}
          disabled={disabled}
          onClick={onClick}
          ref={ref}
          type={type}
        >
          {children}
        </button>
      ),
  };
});

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn(), replace }),
  usePathname: () => "/admin/collections/pages",
  useSearchParams: () => new URLSearchParams(search.current),
}));

const TENANT = { id: 2, name: "Dunia Kimia Utama", domain: "duniakimia.com" };

function AddChild() {
  const open = useNewPage();
  return (
    <button onClick={() => open?.("1")} type="button">
      Add child
    </button>
  );
}

function mount() {
  render(
    <ModalProvider transTime={0}>
      <NewPageHost tenant={TENANT}>
        <NewPageButton fallbackHref="/admin/collections/pages/create" />
        <AddChild />
      </NewPageHost>
      <ModalContainer />
    </ModalProvider>,
  );
}

beforeEach(() => {
  replace.mockReset();
  search.current = "";
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL) =>
      String(input).startsWith("/api/pages/parent-options")
        ? Response.json({
            options: [
              {
                id: "1",
                collection: "pages",
                title: "About Us",
                shared: false,
                paths: { en: "/about-us", id: "/tentang-kami" },
              },
            ],
          })
        : Response.json({ ok: true, problems: [], paths: {} }),
    ),
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("NewPageHost", () => {
  it("opens the dialog from the New page button instead of navigating", async () => {
    const user = userEvent.setup();
    mount();
    expect(screen.queryByRole("link", { name: "New page" })).toBeNull();
    await user.click(screen.getByRole("button", { name: "New page" }));
    expect(
      await screen.findByRole("dialog", { name: "New page" }),
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: /Parent page/ }).textContent,
    ).toContain("No parent (top level)");
  });

  it("opens with the parent for Add child page", async () => {
    const user = userEvent.setup();
    mount();
    await user.click(screen.getByRole("button", { name: "Add child" }));
    await screen.findByRole("dialog", { name: "New page" });
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /Parent page/ }).textContent,
      ).toContain("About Us"),
    );
  });

  it("falls back to the create link outside a host", () => {
    render(<NewPageButton fallbackHref="/admin/collections/pages/create" />);
    expect(
      screen.getByRole("link", { name: "New page" }).getAttribute("href"),
    ).toBe("/admin/collections/pages/create");
  });

  it("opens by itself for ?newPage=1&parent= and cleans the address", async () => {
    search.current = "newPage=1&parent=1";
    mount();
    await screen.findByRole("dialog", { name: "New page" });
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /Parent page/ }).textContent,
      ).toContain("About Us"),
    );
    expect(replace).toHaveBeenCalledWith("/admin/collections/pages");
  });

  it("ignores a parent that is not a number in the address", async () => {
    search.current = "newPage=1&parent=abc";
    mount();
    await screen.findByRole("dialog", { name: "New page" });
    await waitFor(() =>
      expect(
        (
          screen.getByRole("button", {
            name: /Parent page/,
          }) as HTMLButtonElement
        ).disabled,
      ).toBe(false),
    );
    expect(
      screen.getByRole("button", { name: /Parent page/ }).textContent,
    ).toContain("No parent (top level)");
  });

  it("does not open without the newPage flag", () => {
    search.current = "parent=1";
    mount();
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

describe("the blank create view", () => {
  it("is sent to the list with the dialog flag and the requested parent", () => {
    expect(newPageListPath(undefined)).toBe("/collections/pages?newPage=1");
    expect(newPageListPath("5")).toBe("/collections/pages?newPage=1&parent=5");
  });
});
