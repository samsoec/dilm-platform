// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { collections } from "../../../collections";
import { useCommandPalette } from "./context";
import { PaletteController } from "./PaletteController";
import { type PaletteEntry, SEARCH_DEBOUNCE_MS, searchSources } from "./search";

const JUMPS: PaletteEntry[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    href: "/admin",
    icon: "space_dashboard",
  },
  {
    key: "cv-submissions",
    label: "Career applications",
    href: "/admin/collections/cv-submissions",
    icon: "badge",
  },
  {
    key: "users",
    label: "Users",
    href: "/admin/collections/users",
    icon: "group",
    superAdmin: true,
  },
  {
    key: "account",
    label: "My account",
    href: "/admin/account",
    icon: "person",
  },
];

function Trigger() {
  const palette = useCommandPalette();
  return (
    <button onClick={palette?.open} type="button">
      Search
    </button>
  );
}

function setup({
  canRead = (() => true) as (slug: string) => boolean,
  tenant = 1 as number | null,
} = {}) {
  const navigate = vi.fn();
  const user = userEvent.setup();
  render(
    <PaletteController
      adminRoute="/admin"
      apiURL="/api"
      company={
        tenant === null ? undefined : { name: "Dunia Kimia Utama", code: "DKU" }
      }
      jumps={JUMPS}
      locale="en"
      navigate={navigate}
      sources={searchSources(collections, canRead, "en")}
      tenant={tenant ?? undefined}
    >
      <Trigger />
    </PaletteController>,
  );
  return { navigate, user };
}

const fetchMock = vi.fn();
const queried = () =>
  fetchMock.mock.calls.map(
    ([url]) => new URL(String(url), "http://cms").pathname,
  );
const combobox = () => screen.getByRole("combobox");
const activeOption = () =>
  document.getElementById(combobox().getAttribute("aria-activedescendant")!);

beforeEach(() => {
  fetchMock.mockImplementation(async (url: string) => ({
    ok: true,
    json: async () => ({
      docs: url.includes("/cv-submissions")
        ? [{ id: 9, applicantName: "Rani Saputra" }]
        : [],
    }),
  }));
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  cleanup();
  fetchMock.mockReset();
  vi.unstubAllGlobals();
});

describe("opening and closing (FR-UI-24, FR-UI-27)", () => {
  it.each(["{Meta>}k{/Meta}", "{Control>}k{/Control}"])(
    "opens on %s with focus in the search field",
    async (keys) => {
      const { user } = setup();
      await user.keyboard(keys);
      expect(screen.getByRole("dialog").getAttribute("aria-modal")).toBe(
        "true",
      );
      expect(document.activeElement).toBe(combobox());
    },
  );

  it("opens from the trigger and returns focus to it on Esc", async () => {
    const { user } = setup();
    await user.click(screen.getByRole("button", { name: "Search" }));
    expect(document.activeElement).toBe(combobox());

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "Search" }),
    );
  });

  it("closes on a second ⌘K", async () => {
    const { user } = setup();
    await user.keyboard("{Meta>}k{/Meta}");
    await user.keyboard("{Meta>}k{/Meta}");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("keeps Tab and Shift+Tab inside the dialog", async () => {
    const { user } = setup();
    await user.keyboard("{Meta>}k{/Meta}");
    await user.tab();
    expect(document.activeElement).toBe(combobox());
    await user.tab({ shift: true });
    expect(document.activeElement).toBe(combobox());
  });
});

describe("Jump to list (FR-UI-25, FR-UI-27)", () => {
  it("lists every jump entry for an empty query", async () => {
    const { user } = setup();
    await user.keyboard("{Meta>}k{/Meta}");
    expect(combobox().getAttribute("placeholder")).toBe(
      "Search Dunia Kimia Utama or jump to…",
    );
    expect(screen.getByText("Go to")).toBeTruthy();
    expect(
      screen.getAllByRole("option").map((option) => option.textContent),
    ).toEqual([
      "space_dashboardDashboard↵",
      "badgeCareer applications",
      "groupUsersSuper Admin",
      "personMy account",
    ]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("moves with the arrow keys, wrapping at either end", async () => {
    const { user } = setup();
    await user.keyboard("{Meta>}k{/Meta}");
    expect(activeOption()?.getAttribute("aria-selected")).toBe("true");
    expect(activeOption()?.textContent).toContain("Dashboard");

    await user.keyboard("{ArrowDown}");
    expect(activeOption()?.textContent).toContain("Career applications");
    await user.keyboard("{ArrowUp}{ArrowUp}");
    expect(activeOption()?.textContent).toContain("My account");
    await user.keyboard("{ArrowDown}");
    expect(activeOption()?.textContent).toContain("Dashboard");
  });

  it("opens the active entry on Enter and closes", async () => {
    const { navigate, user } = setup();
    await user.keyboard("{Meta>}k{/Meta}{ArrowUp}{Enter}");
    expect(navigate).toHaveBeenCalledWith("/admin/account");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("opens an entry on click", async () => {
    const { navigate, user } = setup();
    await user.keyboard("{Meta>}k{/Meta}");
    await user.click(screen.getByRole("option", { name: /Dashboard/ }));
    expect(navigate).toHaveBeenCalledWith("/admin");
  });
});

describe("document search (FR-UI-26, FR-UI-28)", () => {
  it("waits for typing to pause, then queries each readable collection once", async () => {
    const { user } = setup();
    await user.keyboard("{Meta>}k{/Meta}");
    await user.type(combobox(), "rani");
    expect(fetchMock).not.toHaveBeenCalled();

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(4), {
      timeout: SEARCH_DEBOUNCE_MS * 4,
    });
    expect(queried()).toEqual([
      "/api/cv-submissions",
      "/api/ir-documents",
      "/api/media",
      "/api/tenant-settings",
    ]);
    const cv = new URL(String(fetchMock.mock.calls[0][0]), "http://cms");
    expect(cv.searchParams.get("where[and][0][tenant][equals]")).toBe("1");
    expect(
      cv.searchParams.get("where[and][1][or][0][applicantName][like]"),
    ).toBe("rani");

    const hit = await screen.findByRole("option", { name: /Rani Saputra/ });
    expect(hit.closest("[role=group]")?.textContent).toContain(
      "Career applications · 1",
    );
    expect(hit.querySelector("b")?.textContent).toBe("Rani");
    expect(screen.getByText("in DKU")).toBeTruthy();
  });

  it("opens a found document on Enter", async () => {
    const { navigate, user } = setup();
    await user.keyboard("{Meta>}k{/Meta}");
    await user.type(combobox(), "rani");
    await screen.findByRole("option", { name: /Rani Saputra/ });
    await user.keyboard("{Enter}");
    expect(navigate).toHaveBeenCalledWith(
      "/admin/collections/cv-submissions/9",
    );
  });

  it("never queries a collection the user can't read", async () => {
    const { user } = setup({
      canRead: (slug) => slug !== "cv-submissions" && slug !== "media",
    });
    await user.keyboard("{Meta>}k{/Meta}");
    await user.type(combobox(), "rani");

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2), {
      timeout: SEARCH_DEBOUNCE_MS * 4,
    });
    expect(queried()).toEqual(["/api/ir-documents", "/api/tenant-settings"]);
    expect(
      await screen.findByText("No matches in Dunia Kimia Utama"),
    ).toBeTruthy();
    expect(
      screen.getByText(
        "Other companies aren't searched. Switch company to look there.",
      ),
    ).toBeTruthy();
  });

  it("doesn't search documents until a tenant is selected", async () => {
    const { user } = setup({ tenant: null });
    await user.keyboard("{Meta>}k{/Meta}");
    await user.type(combobox(), "cv");

    expect(
      screen.getByText(
        "Choose a company in the sidebar to search its records.",
      ),
    ).toBeTruthy();
    expect(screen.queryAllByRole("option")).toHaveLength(0);
    await new Promise((resolve) => setTimeout(resolve, SEARCH_DEBOUNCE_MS * 2));
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("shows searching, then offers Try again when search fails", async () => {
    let fail = true;
    fetchMock.mockImplementation(async (url: string) =>
      fail
        ? { ok: false, json: async () => ({}) }
        : {
            ok: true,
            json: async () => ({
              docs: url.includes("/cv-submissions")
                ? [{ id: 9, applicantName: "Rani Saputra" }]
                : [],
            }),
          },
    );
    const { user } = setup();
    await user.keyboard("{Meta>}k{/Meta}");
    await user.type(combobox(), "rani");
    expect(screen.getByText("Searching Dunia Kimia Utama…")).toBeTruthy();

    expect(await screen.findByText("Search isn't responding.")).toBeTruthy();
    fail = false;
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(
      await screen.findByRole("option", { name: /Rani Saputra/ }),
    ).toBeTruthy();
    expect(screen.queryByText("Search isn't responding.")).toBeNull();
  });
});
