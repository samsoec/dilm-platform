// @vitest-environment jsdom
import { ModalContainer, ModalProvider, useModal } from "@faceless-ui/modal";
import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode, Ref } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { NewPageDialog, type NewPageTenant } from "./NewPageDialog";
import { NEW_PAGE_MODAL, type ParentOption } from "./newPage";

const { push, notify } = vi.hoisted(() => ({
  push: vi.fn(),
  notify: vi.fn(),
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
      extraButtonProps,
      onClick,
      ref,
      type,
    }: {
      children: ReactNode;
      className?: string;
      disabled?: boolean;
      extraButtonProps?: Record<string, unknown>;
      onClick?: () => void;
      ref?: Ref<HTMLButtonElement>;
      type?: "button" | "submit";
    }) => (
      <button
        className={className}
        disabled={disabled}
        onClick={onClick}
        ref={ref}
        type={type}
        {...extraButtonProps}
      >
        {children}
      </button>
    ),
  };
});

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, refresh: vi.fn(), replace: vi.fn() }),
}));

vi.mock("../kit/Toast", () => ({ notify }));

const TENANT: NewPageTenant = {
  id: 2,
  name: "Dunia Kimia Utama",
  domain: "duniakimia.com",
};

const OPTIONS: ParentOption[] = [
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

type Reply = { status?: number; body: unknown };

function json({ status = 200, body }: Reply) {
  return Promise.resolve(
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    }),
  );
}

type Body = Record<string, unknown>;

type Routes = {
  options?: Reply | (() => Promise<Response>);
  check?: (body: Body) => Reply;
  create?: (body: Body) => Reply;
};

function install(routes: Routes = {}) {
  const calls = { check: [] as Body[], create: [] as Body[], options: 0 };
  const fetchMock = vi.fn(
    async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.startsWith("/api/pages/parent-options")) {
        calls.options += 1;
        if (typeof routes.options === "function") return routes.options();
        return json(routes.options ?? { body: { options: OPTIONS } });
      }
      const body = init?.body ? JSON.parse(String(init.body)) : undefined;
      if (url === "/api/pages/check-slug") {
        calls.check.push(body);
        return json(
          routes.check?.(body) ?? {
            body: { ok: true, problems: [], paths: {} },
          },
        );
      }
      if (url === "/api/pages/create-draft") {
        calls.create.push(body);
        return json(
          routes.create?.(body) ?? { status: 201, body: { ok: true, id: 41 } },
        );
      }
      throw new Error(`Unexpected request ${url}`);
    },
  );
  vi.stubGlobal("fetch", fetchMock);
  return { calls, fetchMock };
}

function Trigger() {
  const { openModal } = useModal();
  return (
    <button onClick={() => openModal(NEW_PAGE_MODAL)} type="button">
      New page…
    </button>
  );
}

async function open(parentId?: string) {
  const user = userEvent.setup();
  render(
    <ModalProvider transTime={0}>
      <Trigger />
      <NewPageDialog parentId={parentId} tenant={TENANT} />
      <ModalContainer />
    </ModalProvider>,
  );
  const trigger = screen.getByRole("button", { name: "New page…" });
  await user.click(trigger);
  const dialog = await screen.findByRole("dialog", { name: "New page" });
  return { user, dialog, trigger };
}

const field = (name: string) => screen.getByRole("textbox", { name });
const create = () =>
  screen.getByRole("button", { name: "Create draft" }) as HTMLButtonElement;
const urls = (dialog: HTMLElement) =>
  within(within(dialog).getByRole("region", { name: "Full URL" }))
    .getAllByRole("listitem")
    .map((item) => item.textContent);

beforeEach(() => {
  push.mockReset();
  notify.mockReset();
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("New page dialog (PG-01)", () => {
  it("shows the labelled fields, the reach badge and the draft note", async () => {
    install();
    const { dialog } = await open();
    expect(field("Title EN")).toBeTruthy();
    expect(field("Slug EN")).toBeTruthy();
    expect(field("Slug ID")).toBeTruthy();
    expect(screen.getByRole("button", { name: /Parent page/ })).toBeTruthy();
    expect(dialog.textContent).toContain("This site only (duniakimia.com)");
    expect(dialog.textContent).toContain(
      "Created as a draft. Nothing is public until you publish.",
    );
    expect(dialog.textContent).toContain(
      "Suggested from the title. a–z, 0–9 and hyphens.",
    );
    expect(dialog.textContent).toContain(
      "Checked as you type and again on save. The same slug on another company's site is fine: each site shows its own page.",
    );
  });

  it("starts with focus on the title and Create draft unavailable", async () => {
    install();
    await open();
    await waitFor(() => expect(document.activeElement).toBe(field("Title EN")));
    expect(create().disabled).toBe(true);
    expect(screen.getByText("Add a title.")).toBeTruthy();
  });

  it("suggests the English slug from the title until it is edited by hand", async () => {
    install();
    const { user } = await open();
    await user.type(field("Title EN"), "Our History");
    expect((field("Slug EN") as HTMLInputElement).value).toBe("our-history");
    await user.clear(field("Slug EN"));
    await user.type(field("Slug EN"), "story");
    await user.type(field("Title EN"), " 2");
    expect((field("Slug EN") as HTMLInputElement).value).toBe("story");
  });

  it("resumes suggesting when the slug is cleared", async () => {
    install();
    const { user } = await open();
    await user.type(field("Title EN"), "Awards");
    await user.clear(field("Slug EN"));
    await user.type(field("Title EN"), "!");
    expect((field("Slug EN") as HTMLInputElement).value).toBe("awards");
  });

  it("updates the full URLs for both languages as you type", async () => {
    install();
    const { user, dialog } = await open();
    await user.type(field("Title EN"), "History");
    expect(urls(dialog)).toEqual([
      "ENduniakimia.com/en/history",
      "IDduniakimia.com/id/history",
    ]);
    await user.type(field("Slug ID"), "sejarah");
    expect(urls(dialog)).toEqual([
      "ENduniakimia.com/en/history",
      "IDduniakimia.com/id/sejarah",
    ]);
  });

  it("says the English slug is used while the Indonesian slug is empty", async () => {
    install();
    const { user, dialog } = await open();
    await user.type(field("Title EN"), "History");
    expect(dialog.textContent).toContain(
      "Empty: the Indonesian address uses the English slug (history).",
    );
    await user.type(field("Slug ID"), "sejarah");
    expect(dialog.textContent).toContain(
      "Optional. Empty uses the English slug.",
    );
  });

  it("puts the chosen parent's paths in front of each URL", async () => {
    install();
    const { user, dialog } = await open();
    await user.click(screen.getByRole("button", { name: /Parent page/ }));
    await user.click(await screen.findByRole("option", { name: /About Us/ }));
    await user.type(field("Title EN"), "History");
    await user.type(field("Slug ID"), "sejarah");
    expect(urls(dialog)).toEqual([
      "ENduniakimia.com/en/about-us/history",
      "IDduniakimia.com/id/tentang-kami/sejarah",
    ]);
  });

  it("preselects the parent it was opened for", async () => {
    install();
    const { user, dialog } = await open("1");
    await user.type(field("Title EN"), "History");
    await waitFor(() =>
      expect(urls(dialog)[0]).toBe("ENduniakimia.com/en/about-us/history"),
    );
    expect(
      screen.getByRole("button", { name: /Parent page/ }).textContent,
    ).toContain("About Us");
  });

  it("ignores a starting parent that is shared, unknown or not an id", async () => {
    for (const wanted of ["9", "404", "1 or 1=1"]) {
      install();
      const { user, dialog } = await open(wanted);
      await user.type(field("Title EN"), "History");
      await waitFor(() =>
        expect(
          screen.getByRole("button", { name: /Parent page/ }),
        ).toHaveProperty("disabled", false),
      );
      expect(urls(dialog)[0]).toBe("ENduniakimia.com/en/history");
      cleanup();
    }
  });
});

describe("slug checks", () => {
  it("waits until typing pauses and sends one request with both slugs", async () => {
    const { calls } = install();
    const { user } = await open();
    await user.type(field("Title EN"), "History");
    expect(calls.check).toHaveLength(0);
    await waitFor(() => expect(calls.check).toHaveLength(1), { timeout: 3000 });
    expect(calls.check[0]).toEqual({
      tenant: "2",
      slugs: { en: "history", id: "" },
    });
  });

  it("sends the chosen parent and re-checks when it changes", async () => {
    const { calls } = install();
    const { user } = await open();
    await user.type(field("Title EN"), "History");
    await waitFor(() => expect(calls.check).toHaveLength(1), { timeout: 3000 });
    await user.click(screen.getByRole("button", { name: /Parent page/ }));
    await user.click(await screen.findByRole("option", { name: /About Us/ }));
    await waitFor(() => expect(calls.check).toHaveLength(2), { timeout: 3000 });
    expect(calls.check[1]).toMatchObject({ parent: "1" });
  });

  it("enables Create draft once the check passes", async () => {
    install();
    const { user } = await open();
    await user.type(field("Title EN"), "History");
    expect(create().disabled).toBe(true);
    expect(screen.getAllByText("Checking the slug…")).toHaveLength(2);
    await waitFor(() => expect(create().disabled).toBe(false), {
      timeout: 3000,
    });
  });

  it("shows the root message for an empty slug without asking the server", async () => {
    const { calls } = install();
    const { user } = await open();
    await user.type(field("Title EN"), "!!!");
    expect(
      screen.getAllByText(
        "The root URL / is the shared Home. Give this page a slug.",
      ).length,
    ).toBeGreaterThan(0);
    expect(field("Slug EN").getAttribute("aria-invalid")).toBe("true");
    expect(create().disabled).toBe(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    expect(calls.check).toHaveLength(0);
  });

  it("shows invalid characters on the field that has them", async () => {
    install();
    const { user } = await open();
    await user.type(field("Title EN"), "History");
    await user.type(field("Slug ID"), "Bad Slug");
    expect(
      within(
        document.getElementById(
          field("Slug ID").getAttribute("aria-describedby")!.split(" ")[0],
        )!,
      ).getByText(
        "Use lowercase letters, numbers and hyphens only (a-z, 0-9, -).",
      ).textContent,
    ).toBeTruthy();
    expect(field("Slug EN").getAttribute("aria-invalid")).toBeNull();
    expect(create().disabled).toBe(true);
  });

  it("shows a reserved word problem and blocks Create draft", async () => {
    install({
      check: () => ({
        body: {
          ok: false,
          problems: [
            {
              field: "slug-en",
              locale: "en",
              kind: "reserved",
              message:
                "URLs can't start with a reserved word: category, kategori, api, admin, _next, media.",
            },
          ],
        },
      }),
    });
    const { user } = await open();
    await user.type(field("Title EN"), "Media");
    expect(
      await screen.findAllByText(
        /URLs can't start with a reserved word/,
        {},
        { timeout: 3000 },
      ),
    ).not.toHaveLength(0);
    expect(create().disabled).toBe(true);
    expect(screen.getByText("Fix the slug to continue.")).toBeTruthy();
  });

  it("shows a shared page clash", async () => {
    const message =
      '/privacy-policy is the shared page "Privacy Policy", on all 3 sites. Pick another slug.';
    install({
      check: () => ({
        body: {
          ok: false,
          problems: [
            { field: "slug-en", locale: "en", kind: "shared", message },
          ],
        },
      }),
    });
    const { user } = await open();
    await user.type(field("Title EN"), "Privacy Policy");
    expect(
      (await screen.findAllByText(message, {}, { timeout: 3000 })).length,
    ).toBeGreaterThan(0);
    expect(screen.queryByRole("link", { name: "Open it" })).toBeNull();
  });

  it("links to the existing page on a same-site clash", async () => {
    install({
      check: () => ({
        body: {
          ok: false,
          problems: [
            {
              field: "slug-en",
              locale: "en",
              kind: "same-site",
              message:
                '"Our Journey" already uses /about-us/our-journey in English.',
              open: { collection: "pages", id: "7" },
            },
          ],
        },
      }),
    });
    const { user } = await open();
    await user.type(field("Title EN"), "Our Journey");
    const link = await screen.findByRole(
      "link",
      { name: "Open it" },
      { timeout: 3000 },
    );
    expect(link.getAttribute("href")).toBe("/admin/collections/pages/7");
    expect(
      screen.getAllByText(
        /"Our Journey" already uses \/about-us\/our-journey in English\./,
      ).length,
    ).toBeGreaterThan(0);
  });

  it("puts an Indonesian clash under the Indonesian slug", async () => {
    install({
      check: () => ({
        body: {
          ok: false,
          problems: [
            {
              field: "slug-id",
              locale: "id",
              kind: "same-site",
              message: '"Tentang" already uses /tentang in Indonesian.',
              open: { collection: "pages", id: "3" },
            },
          ],
        },
      }),
    });
    const { user } = await open();
    await user.type(field("Title EN"), "Story");
    await user.type(field("Slug ID"), "tentang");
    await screen.findByRole("link", { name: "Open it" }, { timeout: 3000 });
    expect(field("Slug ID").getAttribute("aria-invalid")).toBe("true");
    expect(field("Slug EN").getAttribute("aria-invalid")).toBeNull();
  });

  it("announces checks and problems in a polite live region", async () => {
    install({
      check: () => ({
        body: {
          ok: false,
          problems: [
            {
              field: "slug-en",
              locale: "en",
              kind: "reserved",
              message: "Reserved.",
            },
          ],
        },
      }),
    });
    const { user } = await open();
    const live = screen.getByTestId("new-page-live");
    expect(live.getAttribute("aria-live")).toBe("polite");
    expect(live.getAttribute("role")).toBe("status");
    await user.type(field("Title EN"), "Media");
    await waitFor(() => expect(live.textContent).toBe("Reserved."), {
      timeout: 3000,
    });
  });

  it("keeps working, saying so, when the check cannot be reached", async () => {
    install({ check: () => ({ status: 500, body: { message: "down" } }) });
    const { user } = await open();
    await user.type(field("Title EN"), "History");
    await waitFor(
      () =>
        expect(
          screen.getAllByText(/The slug couldn't be checked/).length,
        ).toBeGreaterThan(0),
      { timeout: 3000 },
    );
    expect(create().disabled).toBe(false);
  });
});

describe("parent list", () => {
  it("says so when the pages cannot be loaded and offers a retry", async () => {
    let attempts = 0;
    const { calls } = install({
      options: () => {
        attempts += 1;
        return attempts === 1
          ? json({ status: 500, body: { message: "down" } })
          : json({ body: { options: OPTIONS } });
      },
    });
    const { user } = await open();
    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toContain("Couldn't load the pages");
    expect(
      (screen.getByRole("button", { name: /Parent page/ }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
    await user.click(screen.getByRole("button", { name: "Try again" }));
    await waitFor(() =>
      expect(
        (
          screen.getByRole("button", {
            name: /Parent page/,
          }) as HTMLButtonElement
        ).disabled,
      ).toBe(false),
    );
    expect(calls.options).toBe(2);
  });
});

describe("creating the draft", () => {
  it("posts the title, parent and slugs, closes and opens the editor", async () => {
    const { calls } = install();
    const { user } = await open("1");
    await user.type(field("Title EN"), "History");
    await user.type(field("Slug ID"), "sejarah");
    await waitFor(() => expect(create().disabled).toBe(false), {
      timeout: 3000,
    });
    await user.click(create());
    await waitFor(() =>
      expect(push).toHaveBeenCalledWith("/admin/collections/pages/41"),
    );
    expect(calls.create).toEqual([
      {
        tenant: "2",
        parent: "1",
        title: "History",
        slugs: { en: "history", id: "sejarah" },
      },
    ]);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("submits with Enter from the title once valid", async () => {
    const { calls } = install();
    const { user } = await open();
    await user.type(field("Title EN"), "History");
    await waitFor(() => expect(create().disabled).toBe(false), {
      timeout: 3000,
    });
    await user.type(field("Title EN"), "{Enter}");
    await waitFor(() => expect(calls.create).toHaveLength(1));
  });

  it("does not submit while the slug is invalid", async () => {
    const { calls } = install();
    const { user } = await open();
    await user.type(field("Title EN"), "!!!");
    await user.type(field("Title EN"), "{Enter}");
    expect(calls.create).toHaveLength(0);
  });

  it("shows the problems the server finds when saving, and stays open", async () => {
    install({
      create: () => ({
        status: 422,
        body: {
          ok: false,
          problems: [
            {
              field: "slug-en",
              locale: "en",
              kind: "same-site",
              message: '"Taken" already uses /history in English.',
              open: { collection: "pages", id: "4" },
            },
          ],
        },
      }),
    });
    const { user } = await open();
    await user.type(field("Title EN"), "History");
    await waitFor(() => expect(create().disabled).toBe(false), {
      timeout: 3000,
    });
    await user.click(create());
    expect(await screen.findByRole("link", { name: "Open it" })).toBeTruthy();
    expect(push).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog", { name: "New page" })).toBeTruthy();
  });

  it("shows an error from the server and lets you try again", async () => {
    install({
      create: () => ({ status: 500, body: { message: "Database is down." } }),
    });
    const { user } = await open();
    await user.type(field("Title EN"), "History");
    await waitFor(() => expect(create().disabled).toBe(false), {
      timeout: 3000,
    });
    await user.click(create());
    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toContain("Database is down.");
    expect(push).not.toHaveBeenCalled();
    expect(create().disabled).toBe(false);
  });

  it("reports an unreachable CMS", async () => {
    const { fetchMock } = install();
    const { user } = await open();
    await user.type(field("Title EN"), "History");
    await waitFor(() => expect(create().disabled).toBe(false), {
      timeout: 3000,
    });
    const real = fetchMock.getMockImplementation()!;
    fetchMock.mockImplementation(async (input, init) => {
      if (String(input).endsWith("/create-draft"))
        throw new TypeError("offline");
      return real(input, init);
    });
    await user.click(create());
    expect((await screen.findByRole("alert")).textContent).toContain(
      "The CMS can't be reached.",
    );
  });

  it("tells the editor when only the Indonesian slug was not saved", async () => {
    install({
      create: () => ({
        status: 201,
        body: { ok: true, id: 41, indonesianSlug: "Slug already used." },
      }),
    });
    const { user } = await open();
    await user.type(field("Title EN"), "History");
    await user.type(field("Slug ID"), "sejarah");
    await waitFor(() => expect(create().disabled).toBe(false), {
      timeout: 3000,
    });
    await user.click(create());
    await waitFor(() => expect(push).toHaveBeenCalled());
    expect(notify).toHaveBeenCalledWith(
      expect.objectContaining({ tone: "error", body: "Slug already used." }),
    );
  });
});

describe("dialog behaviour (PR-UX-10)", () => {
  it("closes on Escape and returns focus to the opener", async () => {
    install();
    const { user, trigger } = await open();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(document.activeElement).toBe(trigger);
  });

  it("closes with Cancel without creating anything", async () => {
    const { calls } = install();
    const { user } = await open();
    await user.type(field("Title EN"), "History");
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(calls.create).toHaveLength(0);
  });

  it("starts empty every time it is opened", async () => {
    install();
    const { user, trigger } = await open();
    await user.type(field("Title EN"), "History");
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    await user.click(trigger);
    await screen.findByRole("dialog", { name: "New page" });
    expect((field("Title EN") as HTMLInputElement).value).toBe("");
  });

  it("keeps Tab inside the dialog", async () => {
    install();
    const { user, dialog } = await open();
    await waitFor(() => expect(document.activeElement).toBe(field("Title EN")));
    for (let step = 0; step < 14; step += 1) {
      await user.tab();
      expect(dialog.contains(document.activeElement)).toBe(true);
    }
    for (let step = 0; step < 14; step += 1) {
      await user.tab({ shift: true });
      expect(dialog.contains(document.activeElement)).toBe(true);
    }
  });

  it("is a modal dialog named New page", async () => {
    install();
    const { dialog } = await open();
    expect(dialog.getAttribute("aria-modal")).toBe("true");
    expect(dialog.getAttribute("aria-labelledby")).toBeTruthy();
  });
});
