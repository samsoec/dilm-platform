// @vitest-environment jsdom
import { ModalContainer, ModalProvider } from "@faceless-ui/modal";
import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { PagesTree, type PagesTreeProps } from "./PagesTree";
import {
  buildTree,
  pageKey,
  type PageRecord,
  toRows,
  toTrashRows,
} from "./pagesModel";

const { toastCustom } = vi.hoisted(() => ({ toastCustom: vi.fn() }));

vi.mock("@payloadcms/ui", async () => {
  const modal = await import("@faceless-ui/modal");
  return {
    Modal: modal.Modal,
    useModal: modal.useModal,
    toast: { custom: toastCustom, dismiss: vi.fn() },
    useConfig: () => ({
      config: { routes: { admin: "/admin", api: "/api" }, serverURL: "" },
    }),
    Button: ({
      children,
      className,
      disabled,
      onClick,
      url,
    }: {
      children: ReactNode;
      className?: string;
      disabled?: boolean;
      onClick?: () => void;
      url?: string;
    }) =>
      url ? (
        <a className={className} href={url}>
          {children}
        </a>
      ) : (
        <button className={className} disabled={disabled} onClick={onClick}>
          {children}
        </button>
      ),
  };
});

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    className,
    title,
    tabIndex,
    role,
    onClick,
    ...data
  }: {
    children: ReactNode;
    href: string;
    className?: string;
    title?: string;
    tabIndex?: number;
    role?: string;
    onClick?: () => void;
    prefetch?: boolean;
  }) => (
    <a
      className={className}
      href={href}
      onClick={onClick}
      role={role}
      tabIndex={tabIndex}
      title={title}
      {...(Object.fromEntries(
        Object.entries(data).filter(([key]) => key.startsWith("data-")),
      ) as object)}
    >
      {children}
    </a>
  ),
}));

function record(
  id: number,
  title: string,
  overrides: Partial<PageRecord> = {},
): PageRecord {
  const collection = overrides.collection ?? "pages";
  return {
    key: pageKey(collection, id),
    id,
    collection,
    title: { en: title },
    path: { en: `/${title.toLowerCase().replace(/\W+/g, "-")}` },
    parentKey: null,
    tenant: collection === "pages" ? 2 : null,
    status: "published",
    updatedAt: "2026-10-02T03:00:00.000Z",
    savedBy: "Dimas Pratama",
    deletedAt: null,
    trashedBy: null,
    redirectTo: null,
    ...overrides,
  };
}

const home = record(1, "Home", {
  collection: "shared-pages",
  path: { en: "/" },
});
const about = record(2, "About Us");
const overview = record(3, "Overview", { parentKey: about.key });
const journey = record(4, "Our Journey", {
  parentKey: about.key,
  status: "draft",
});
const career = record(5, "Career", { status: "changed" });
const leadership = record(6, "Leadership", {
  deletedAt: "2026-10-20T03:00:00.000Z",
  trashedBy: "Dimas Pratama",
});

const context = {
  locale: "en",
  defaultLocale: "en",
  header: { keys: new Set<string>(), paths: new Set<string>() },
  tenants: [{ id: 2, domain: "duniakimia.com" }],
  now: new Date("2026-11-05T05:00:00.000Z"),
};

function props(overrides: Partial<PagesTreeProps> = {}): PagesTreeProps {
  const records = [home, about, overview, journey, career];
  return {
    rows: toRows(buildTree(records), context),
    trash: toTrashRows(
      [leadership],
      context,
      new Set(records.map(({ key }) => key)),
    ),
    company: { name: "Dunia Kimia Utama", initials: "DKU" },
    locale: "en",
    viewer: { superAdmin: false, canEdit: true },
    initialFilter: "all",
    noCompany: false,
    ...overrides,
  };
}

function mount(overrides: Partial<PagesTreeProps> = {}) {
  return render(
    <ModalProvider transTime={0}>
      <PagesTree {...props(overrides)} />
      <ModalContainer />
    </ModalProvider>,
  );
}

const items = () => screen.getAllByRole("treeitem");
const titles = () =>
  items().map((item) => within(item).getAllByRole("link")[0]!.textContent);

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  toastCustom.mockClear();
});

type ToastProps = {
  tone: string;
  title: string;
  body?: string;
  action?: { label: string; onClick: () => Promise<void> | void };
};

function lastToast(): ToastProps {
  const render = toastCustom.mock.calls.at(-1)![0] as (id: string) => {
    props: ToastProps;
  };
  return render("t").props;
}

function stubFetch(
  ...responses: { ok: boolean; status?: number; body?: object }[]
) {
  const fetchMock = vi.fn();
  for (const { ok, status = ok ? 200 : 404, body = {} } of responses) {
    fetchMock.mockResolvedValueOnce({ ok, status, json: async () => body });
  }
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

async function trashCareer() {
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: "Actions for Career" }));
  await user.click(screen.getByRole("menuitem", { name: "Move to trash…" }));
  const dialog = await screen.findByRole("alertdialog");
  await user.click(
    within(dialog).getByRole("button", { name: "Move to trash" }),
  );
}

describe("PagesTree", () => {
  it("lists the company's pages with shared ones inline, own containers open", () => {
    mount();
    expect(titles()).toEqual([
      "Home",
      "About Us",
      "Overview",
      "Our Journey",
      "Career",
    ]);
    expect(
      screen.getByRole("treeitem", { name: /Home/ }).getAttribute("aria-level"),
    ).toBe("1");
    expect(screen.getByText("All 3 sites")).toBeTruthy();
  });

  it("shows the chip counts and the footer legends", () => {
    mount();
    for (const name of [
      "All · 5",
      "Draft · 1",
      "Published · 3",
      "Changed since publish · 1",
      "Trash · 1",
    ]) {
      expect(screen.getByRole("button", { name })).toBeTruthy();
    }
    expect(
      screen.getByText("5 pages · 4 Dunia Kimia Utama, 1 shared"),
    ).toBeTruthy();
    expect(
      screen.getByText("Shared pages: only a Super Admin can change them."),
    ).toBeTruthy();
    expect(
      screen.getByText("Forwards = container page, visitors go to its target."),
    ).toBeTruthy();
  });

  it("collapses everything with Collapse all and opens it again with Expand all", async () => {
    mount();
    const user = userEvent.setup();
    expect(
      screen
        .getByRole("treeitem", { name: /Overview/ })
        .getAttribute("aria-level"),
    ).toBe("2");
    await user.click(screen.getByRole("button", { name: "Collapse all" }));
    expect(titles()).toEqual(["Home", "About Us", "Career"]);
    await user.click(screen.getByRole("button", { name: "Expand all" }));
    expect(titles()).toEqual([
      "Home",
      "About Us",
      "Overview",
      "Our Journey",
      "Career",
    ]);
  });

  it("searches by title or URL", async () => {
    mount();
    const user = userEvent.setup();
    await user.type(screen.getByRole("searchbox"), "journey");
    expect(titles()).toEqual(["About Us", "Our Journey"]);
    await user.clear(screen.getByRole("searchbox"));
    await user.type(screen.getByRole("searchbox"), "/career");
    expect(titles()).toEqual(["Career"]);
    await user.clear(screen.getByRole("searchbox"));
    await user.type(screen.getByRole("searchbox"), "zzz");
    expect(screen.getByText("No pages match these filters.")).toBeTruthy();
  });

  it("filters by each status chip", async () => {
    mount();
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /^Draft/ }));
    expect(titles()).toEqual(["About Us", "Our Journey"]);
    await user.click(screen.getByRole("button", { name: /^Changed/ }));
    expect(titles()).toEqual(["Career"]);
    await user.click(screen.getByRole("button", { name: /^Published/ }));
    expect(titles()).toEqual(["Home", "About Us", "Overview"]);
  });

  describe("keyboard", () => {
    it("keeps exactly one row in the tab order", () => {
      mount();
      const tabbable = items().filter((item) => item.tabIndex === 0);
      expect(tabbable).toHaveLength(1);
      expect(tabbable[0]).toBe(items()[0]);
    });

    it("moves with the arrow keys, Home and End", async () => {
      mount();
      const user = userEvent.setup();
      items()[0]!.focus();
      await user.keyboard("{ArrowDown}");
      expect(document.activeElement).toBe(items()[1]);
      expect(items()[1]!.tabIndex).toBe(0);
      expect(items()[0]!.tabIndex).toBe(-1);
      await user.keyboard("{End}");
      expect(document.activeElement).toBe(items().at(-1));
      await user.keyboard("{Home}");
      expect(document.activeElement).toBe(items()[0]);
      await user.keyboard("{ArrowUp}");
      expect(document.activeElement).toBe(items()[0]);
    });

    it("closes with ArrowLeft, opens with ArrowRight, steps into the children and back to the parent", async () => {
      mount();
      const user = userEvent.setup();
      const aboutRow = () => screen.getByRole("treeitem", { name: /About Us/ });
      aboutRow().focus();
      expect(aboutRow().getAttribute("aria-expanded")).toBe("true");
      await user.keyboard("{ArrowLeft}");
      expect(aboutRow().getAttribute("aria-expanded")).toBe("false");
      expect(titles()).not.toContain("Overview");
      await user.keyboard("{ArrowRight}");
      expect(aboutRow().getAttribute("aria-expanded")).toBe("true");
      expect(titles()).toContain("Overview");
      await user.keyboard("{ArrowRight}");
      expect(document.activeElement).toBe(
        screen.getByRole("treeitem", { name: /Overview/ }),
      );
      await user.keyboard("{ArrowLeft}");
      expect(document.activeElement).toBe(aboutRow());
    });

    it("does nothing for ArrowRight on a page without children", async () => {
      mount();
      const user = userEvent.setup();
      const careerRow = screen.getByRole("treeitem", { name: /Career/ });
      careerRow.focus();
      await user.keyboard("{ArrowRight}");
      expect(careerRow.hasAttribute("aria-expanded")).toBe(false);
      expect(document.activeElement).toBe(careerRow);
    });
  });

  describe("roles", () => {
    it("gives an editor a menu on own pages and a lock on shared ones", () => {
      mount();
      const aboutRow = screen.getByRole("treeitem", { name: /About Us/ });
      expect(
        within(aboutRow).getByRole("button", { name: "Actions for About Us" }),
      ).toBeTruthy();
      const homeRow = screen.getByRole("treeitem", { name: /Home/ });
      expect(within(homeRow).queryByRole("button")).toBeNull();
      expect(within(homeRow).getByText(/Locked/)).toBeTruthy();
    });

    it("gives a Super Admin a menu on shared pages too", () => {
      mount({ viewer: { superAdmin: true, canEdit: true } });
      const homeRow = screen.getByRole("treeitem", { name: /Home/ });
      expect(
        within(homeRow).getByRole("button", { name: "Actions for Home" }),
      ).toBeTruthy();
    });

    it("gives a viewer no menu, no lock-free actions and the read-only banner", () => {
      mount({ viewer: { superAdmin: false, canEdit: false } });
      expect(screen.queryByRole("button", { name: /Actions for/ })).toBeNull();
      expect(
        screen.getByText(
          "You can view this page. Editors of DKU can change it.",
        ),
      ).toBeTruthy();
    });

    it("lists the four menu items for an editor", async () => {
      mount();
      const user = userEvent.setup();
      await user.click(
        screen.getByRole("button", { name: "Actions for Career" }),
      );
      const menu = screen.getByRole("menu", { name: "Actions for Career" });
      expect(within(menu).getAllByRole("menuitem")).toHaveLength(4);
      for (const name of [
        "Add child page",
        /^Preview/,
        "Unpublish…",
        "Move to trash…",
      ]) {
        expect(within(menu).getByRole("menuitem", { name })).toBeTruthy();
      }
      expect(
        within(menu)
          .getByRole("menuitem", { name: "Add child page" })
          .getAttribute("href"),
      ).toBe("/admin/collections/pages/create?parent=5");
      expect(
        within(menu)
          .getByRole("menuitem", { name: /Preview/ })
          .getAttribute("aria-disabled"),
      ).toBe("true");
    });

    it("asks before moving a page to the trash", async () => {
      mount();
      const user = userEvent.setup();
      await user.click(
        screen.getByRole("button", { name: "Actions for Career" }),
      );
      await user.click(
        screen.getByRole("menuitem", { name: "Move to trash…" }),
      );
      expect(
        await screen.findByRole("alertdialog", {
          name: 'Move "Career" to trash?',
        }),
      ).toBeTruthy();
    });
  });

  describe("Undo after moving to the trash", () => {
    it("restores as a draft through the trashed-documents request", async () => {
      const fetchMock = stubFetch({ ok: true }, { ok: true });
      mount();
      await trashCareer();
      await waitFor(() => expect(toastCustom).toHaveBeenCalled());
      const trashed = lastToast();
      expect(trashed.tone).toBe("undo");
      expect(fetchMock.mock.calls[0]![0]).toBe("/api/pages/5");
      await trashed.action!.onClick();
      const [url, init] = fetchMock.mock.calls[1]!;
      expect(url).toBe("/api/pages/5?trash=true");
      expect(init.method).toBe("PATCH");
      expect(JSON.parse(init.body)).toEqual({
        deletedAt: null,
        _status: "draft",
      });
      expect(lastToast()).toMatchObject({
        tone: "success",
        title: 'Restored "Career".',
      });
    });

    it("restores to the top level when the page's parent is not live", async () => {
      const fetchMock = stubFetch({ ok: true }, { ok: true });
      const orphan = record(9, "Orphan", { parentKey: "pages:404" });
      mount({ rows: toRows(buildTree([orphan]), context) });
      const user = userEvent.setup();
      await user.click(
        screen.getByRole("button", { name: "Actions for Orphan" }),
      );
      await user.click(
        screen.getByRole("menuitem", { name: "Move to trash…" }),
      );
      const dialog = await screen.findByRole("alertdialog");
      await user.click(
        within(dialog).getByRole("button", { name: "Move to trash" }),
      );
      await waitFor(() => expect(toastCustom).toHaveBeenCalled());
      await lastToast().action!.onClick();
      expect(JSON.parse(fetchMock.mock.calls[1]![1].body)).toEqual({
        deletedAt: null,
        _status: "draft",
        parent: null,
      });
    });

    it("shows the server's error and does not claim success when Undo fails", async () => {
      stubFetch(
        { ok: true },
        {
          ok: false,
          status: 404,
          body: { errors: [{ message: "Not Found" }] },
        },
      );
      mount();
      await trashCareer();
      await waitFor(() => expect(toastCustom).toHaveBeenCalled());
      await lastToast().action!.onClick();
      expect(lastToast()).toMatchObject({
        tone: "error",
        title: 'Couldn\'t restore "Career".',
        body: "Not Found",
      });
    });

    it("shows an error when the request cannot be sent", async () => {
      const fetchMock = vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({}),
        })
        .mockRejectedValueOnce(new Error("offline"));
      vi.stubGlobal("fetch", fetchMock);
      mount();
      await trashCareer();
      await waitFor(() => expect(toastCustom).toHaveBeenCalled());
      await lastToast().action!.onClick();
      expect(lastToast()).toMatchObject({
        tone: "error",
        body: "The CMS can't be reached.",
      });
    });

    it("shows the error instead of success when the trash request fails", async () => {
      stubFetch({
        ok: false,
        status: 403,
        body: { errors: [{ message: "You are not allowed." }] },
      });
      mount();
      await trashCareer();
      await waitFor(() => expect(toastCustom).toHaveBeenCalled());
      expect(lastToast()).toMatchObject({
        tone: "error",
        title: 'Couldn\'t move "Career" to trash.',
        body: "You are not allowed.",
      });
    });
  });

  describe("trash", () => {
    it("shows Restore to editors and Delete permanently only to Super Admins", async () => {
      const first = mount({ initialFilter: "trash" });
      expect(screen.getByText("was /leadership")).toBeTruthy();
      expect(screen.getByRole("button", { name: /Restore/ })).toBeTruthy();
      expect(
        screen.queryByRole("button", { name: "Delete permanently" }),
      ).toBeNull();
      first.unmount();
      cleanup();
      mount({
        initialFilter: "trash",
        viewer: { superAdmin: true, canEdit: true },
      });
      expect(
        screen.getByRole("button", { name: "Delete permanently" }),
      ).toBeTruthy();
    });

    it("shows a viewer the list without actions", () => {
      mount({
        initialFilter: "trash",
        viewer: { superAdmin: false, canEdit: false },
      });
      expect(screen.getByText("Leadership")).toBeTruthy();
      expect(screen.queryByRole("button", { name: /Restore/ })).toBeNull();
    });

    it("switches to the trash with the Trash chip and says when it is empty", async () => {
      mount({ trash: [] });
      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: /^Trash/ }));
      expect(screen.getByText("Nothing in the trash.")).toBeTruthy();
    });
  });

  describe("empty state", () => {
    it("shows PG-11 when the company has no pages of its own", () => {
      mount({
        rows: toRows(buildTree([home]), context),
        trash: [],
        company: { name: "Liku Telaga", initials: "LT" },
      });
      expect(screen.getByText("No pages for Liku Telaga yet")).toBeTruthy();
      expect(
        screen.getByText(
          "Home and Products & Solutions are shared and already live here.",
        ),
      ).toBeTruthy();
      expect(screen.getByRole("link", { name: "New page" })).toBeTruthy();
      expect(screen.queryByRole("tree")).toBeNull();
    });

    it("hides New page from a viewer", () => {
      mount({
        rows: [],
        trash: [],
        viewer: { superAdmin: false, canEdit: false },
      });
      expect(screen.queryByRole("link", { name: "New page" })).toBeNull();
    });
  });
});
