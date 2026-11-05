// @vitest-environment jsdom
import { ModalContainer, ModalProvider } from "@faceless-ui/modal";
import {
  act,
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useEffect, useState, type ReactNode, type Ref } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { UrlChangeGuard } from "./UrlChangeGuard";
import type { PathImpactReply } from "./urlChange";

type FieldState = { value: unknown; initialValue: unknown };

const world = vi.hoisted(() => ({
  fields: {} as Record<string, FieldState>,
  doc: {} as Record<string, unknown>,
  dispatch: vi.fn(),
  bump: () => undefined as void,
}));

vi.mock("@payloadcms/ui", async () => {
  const modal = await import("@faceless-ui/modal");
  return {
    Modal: modal.Modal,
    useModal: modal.useModal,
    useConfig: () => ({
      config: { routes: { admin: "/admin", api: "/api" }, serverURL: "" },
    }),
    useLocale: () => ({ code: "en" }),
    useDocumentInfo: () => world.doc,
    useForm: () => ({ dispatchFields: world.dispatch }),
    useFormFields: (select: (state: [unknown, unknown]) => unknown) =>
      select([world.fields, vi.fn()]),
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

const IMPACT: PathImpactReply = {
  ok: true,
  published: true,
  urls: [
    { locale: "en", from: "/about-us", to: "/about" },
    { locale: "id", from: "/tentang-kami", to: "/tentang-kami" },
  ],
  childPages: 4,
  records: 2,
  redirects: 7,
  overLimit: false,
  linkCount: 7,
  links: [1, 2, 3, 4, 5, 6, 7].map((n) => ({
    collection: "pages",
    id: String(n),
    paths: { en: `/page-${n}`, id: `/halaman-${n}` },
  })),
};

type Reply = { status?: number; body: unknown } | Error;

function install(reply: () => Reply) {
  const calls: { url: string; body: Record<string, unknown> }[] = [];
  const signals: AbortSignal[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      calls.push({
        url: String(input),
        body: JSON.parse(String(init?.body ?? "{}")),
      });
      if (init?.signal) signals.push(init.signal);
      const next = reply();
      if (next instanceof Error) throw next;
      return new Response(JSON.stringify(next.body), {
        status: next.status ?? 200,
        headers: { "Content-Type": "application/json" },
      });
    }),
  );
  return { calls, signals };
}

function Host() {
  const [, setTick] = useState(0);
  useEffect(() => {
    world.bump = () => setTick((tick) => tick + 1);
  }, []);
  return (
    <ModalProvider transTime={0}>
      <input aria-label="Slug" id="field-slug" readOnly value="" />
      <div id="field-parent">
        <input aria-label="Parent" />
      </div>
      <UrlChangeGuard domain="duniakimia.com" />
      <ModalContainer />
    </ModalProvider>
  );
}

function setField(name: string, value: unknown) {
  act(() => {
    world.fields[name].value = value;
    world.bump();
  });
}

beforeEach(() => {
  world.fields = {
    slug: { value: "about-us", initialValue: "about-us" },
    parent: { value: null, initialValue: null },
  };
  world.doc = { id: 5, collectionSlug: "pages", hasSavePermission: true };
  world.dispatch.mockReset();
  world.dispatch.mockImplementation(
    (action: { path: string; value: unknown }) => {
      world.fields[action.path].value = action.value;
      world.bump();
    },
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const wait = { timeout: 3000 };

async function opened() {
  return screen.findByRole("alertdialog", undefined, wait);
}

describe("Change URL confirmation (PG-04)", () => {
  it("opens for a live page whose slug changes and shows what moves", async () => {
    const { calls } = install(() => ({ body: IMPACT }));
    render(<Host />);
    setField("slug", "about");
    const dialog = await opened();
    expect(within(dialog).getByRole("heading").textContent).toBe(
      "Change this page's URL?",
    );
    expect(dialog.textContent).toContain(
      "It's live on duniakimia.com. Nothing breaks: old URLs forward to the new ones.",
    );
    const struck = dialog.querySelector("s");
    expect(struck?.textContent).toContain("duniakimia.com/en/about-us");
    expect(dialog.querySelector("strong")?.textContent).toContain(
      "duniakimia.com/en/about",
    );
    expect(dialog.textContent).not.toContain("tentang-kami");
    const counts = dialog.querySelector("dl")?.textContent;
    expect(counts).toContain("Child pages4");
    expect(counts).toContain("Records2");
    expect(counts).toContain("Redirects7");
    expect(dialog.textContent).toContain(
      "7 pages or records that link here will follow the new address.",
    );
    expect(within(dialog).getAllByRole("listitem").length).toBeGreaterThan(5);
    expect(dialog.textContent).toContain("and 2 more");
    expect(dialog.textContent).toContain(
      "The change goes live, with its redirects, when the page is next published.",
    );
    expect(
      within(dialog).getByRole("button", { name: "Keep old URL" }),
    ).toBeTruthy();
    expect(
      within(dialog).getByRole("button", { name: "Change URL" }),
    ).toBeTruthy();
    expect(calls).toHaveLength(1);
    expect(calls[0].url).toBe("/api/pages/5/path-impact");
    expect(calls[0].body).toEqual({ slugs: { en: "about" }, parent: null });
  });

  it("starts with focus on Keep old URL and is labelled", async () => {
    install(() => ({ body: IMPACT }));
    render(<Host />);
    setField("slug", "about");
    const dialog = await opened();
    await waitFor(() =>
      expect(document.activeElement).toBe(
        within(dialog).getByRole("button", { name: "Keep old URL" }),
      ),
    );
    expect(dialog.getAttribute("aria-labelledby")).toBeTruthy();
    expect(dialog.getAttribute("aria-describedby")).toBeTruthy();
  });

  it("does not open for a page that was never published (PG-06)", async () => {
    const { calls } = install(() => ({
      body: { ...IMPACT, published: false, redirects: 0 },
    }));
    render(<Host />);
    setField("slug", "about");
    await waitFor(() => expect(calls).toHaveLength(1), wait);
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(screen.queryByRole("alertdialog")).toBeNull();
    expect(screen.queryByRole("alert")).toBeNull();
    expect(world.dispatch).not.toHaveBeenCalled();
  });

  it("does not open when no address moves", async () => {
    const { calls } = install(() => ({
      body: {
        ...IMPACT,
        urls: [{ locale: "en", from: "/about-us", to: "/about-us" }],
      },
    }));
    render(<Host />);
    setField("slug", "about-us ");
    await waitFor(() => expect(calls).toHaveLength(1), wait);
    expect(screen.queryByRole("alertdialog")).toBeNull();
  });

  it("keeps the old URL: the fields go back and focus returns to the slug", async () => {
    install(() => ({ body: IMPACT }));
    const user = userEvent.setup();
    render(<Host />);
    setField("slug", "about");
    const dialog = await opened();
    await user.click(
      within(dialog).getByRole("button", { name: "Keep old URL" }),
    );
    expect(world.dispatch).toHaveBeenCalledWith({
      type: "UPDATE",
      path: "slug",
      value: "about-us",
    });
    expect(world.dispatch).toHaveBeenCalledWith({
      type: "UPDATE",
      path: "parent",
      value: null,
    });
    expect(world.fields.slug.value).toBe("about-us");
    await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull());
    expect(document.activeElement).toBe(screen.getByLabelText("Slug"));
  });

  it("Esc keeps the old URL", async () => {
    install(() => ({ body: IMPACT }));
    const user = userEvent.setup();
    render(<Host />);
    setField("slug", "about");
    await opened();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull());
    expect(world.fields.slug.value).toBe("about-us");
  });

  it("changes the URL: the new value stays and it isn't asked again", async () => {
    const { calls } = install(() => ({ body: IMPACT }));
    const user = userEvent.setup();
    render(<Host />);
    setField("slug", "about");
    const dialog = await opened();
    await user.click(
      within(dialog).getByRole("button", { name: "Change URL" }),
    );
    await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull());
    expect(world.dispatch).not.toHaveBeenCalled();
    expect(world.fields.slug.value).toBe("about");
    await new Promise((resolve) => setTimeout(resolve, 600));
    expect(calls).toHaveLength(1);
    expect(screen.queryByRole("alertdialog")).toBeNull();
  });

  it("after Change URL, a further edit is asked again and Keep reverts to the accepted value", async () => {
    const { calls } = install(() => ({ body: IMPACT }));
    const user = userEvent.setup();
    render(<Host />);
    setField("slug", "about");
    await user.click(
      within(await opened()).getByRole("button", { name: "Change URL" }),
    );
    await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull());
    setField("slug", "about-company");
    const dialog = await opened();
    expect(calls).toHaveLength(2);
    await user.click(
      within(dialog).getByRole("button", { name: "Keep old URL" }),
    );
    expect(world.fields.slug.value).toBe("about");
  });

  it("asks about a parent change and returns focus to the parent field", async () => {
    const { calls } = install(() => ({ body: IMPACT }));
    const user = userEvent.setup();
    render(<Host />);
    setField("parent", 9);
    const dialog = await opened();
    expect(calls[0].body).toEqual({ slugs: { en: "about-us" }, parent: "9" });
    await user.click(
      within(dialog).getByRole("button", { name: "Keep old URL" }),
    );
    expect(world.fields.parent.value).toBe(null);
    await waitFor(() =>
      expect(document.activeElement).toBe(screen.getByLabelText("Parent")),
    );
  });

  it("clearing the parent sends null", async () => {
    world.fields.parent = { value: 3, initialValue: 3 };
    const { calls } = install(() => ({ body: IMPACT }));
    render(<Host />);
    setField("parent", null);
    await opened();
    expect(calls[0].body.parent).toBeNull();
  });

  it("waits until the slug field is left before asking", async () => {
    const { calls } = install(() => ({ body: IMPACT }));
    render(<Host />);
    const slug = screen.getByLabelText("Slug");
    act(() => slug.focus());
    setField("slug", "abo");
    setField("slug", "about");
    await new Promise((resolve) => setTimeout(resolve, 600));
    expect(calls).toHaveLength(0);
    act(() => slug.blur());
    await opened();
    expect(calls).toHaveLength(1);
    expect(calls[0].body.slugs).toEqual({ en: "about" });
  });

  it("only the latest edit is asked about", async () => {
    const { calls } = install(() => ({ body: IMPACT }));
    render(<Host />);
    setField("slug", "abo");
    setField("slug", "about");
    await opened();
    expect(calls).toHaveLength(1);
    expect(calls[0].body.slugs).toEqual({ en: "about" });
  });

  it("aborts a stale check when the value changes while it is running", async () => {
    let release: (() => void) | undefined;
    const signals: AbortSignal[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
        signals.push(init!.signal!);
        if (signals.length === 1) {
          await new Promise<void>((resolve) => {
            release = resolve;
          });
        }
        return new Response(JSON.stringify(IMPACT), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }),
    );
    render(<Host />);
    setField("slug", "first");
    await waitFor(() => expect(signals).toHaveLength(1), wait);
    setField("slug", "second");
    expect(signals[0].aborted).toBe(true);
    release?.();
    await opened();
    expect(signals).toHaveLength(2);
    expect(screen.getAllByRole("alertdialog")).toHaveLength(1);
  });

  it("announces the check to screen readers", async () => {
    let release: (() => void) | undefined;
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        await new Promise<void>((resolve) => {
          release = resolve;
        });
        return new Response(JSON.stringify(IMPACT), { status: 200 });
      }),
    );
    render(<Host />);
    setField("slug", "about");
    const live = await screen.findByText(
      "Checking what this change affects…",
      undefined,
      wait,
    );
    expect(live.closest("[aria-live='polite']")).toBeTruthy();
    release?.();
    await opened();
    expect(screen.getByTestId("url-change-live").textContent).toBe("");
  });
});

describe("Change URL refusal (PG-05)", () => {
  it("explains the limit and only offers Keep old URL", async () => {
    install(() => ({
      body: {
        ...IMPACT,
        overLimit: true,
        childPages: 501,
        message:
          "This change would move 501 pages and records. One change can move up to 500. Move some child pages first, then try again.",
      },
    }));
    const user = userEvent.setup();
    render(<Host />);
    setField("slug", "about");
    const dialog = await opened();
    expect(within(dialog).getByRole("heading").textContent).toBe(
      "This change moves too many pages",
    );
    expect(dialog.textContent).toContain("One change can move up to 500.");
    expect(within(dialog).queryByRole("button", { name: "Change URL" })).toBe(
      null,
    );
    expect(within(dialog).getAllByRole("button")).toHaveLength(1);
    expect(dialog.textContent).not.toContain("goes live, with its redirects");
    await user.click(
      within(dialog).getByRole("button", { name: "Keep old URL" }),
    );
    expect(world.fields.slug.value).toBe("about-us");
  });
});

describe("Change URL errors", () => {
  it("surfaces a server error and lets the editor try again", async () => {
    let fail = true;
    const { calls } = install(() =>
      fail ? { status: 403, body: { message: "Forbidden" } } : { body: IMPACT },
    );
    const user = userEvent.setup();
    render(<Host />);
    setField("slug", "about");
    const alert = await screen.findByRole("alert", undefined, wait);
    expect(alert.textContent).toContain("Forbidden");
    expect(screen.queryByRole("alertdialog")).toBeNull();
    expect(world.fields.slug.value).toBe("about");
    fail = false;
    await user.click(screen.getByRole("button", { name: "Try again" }));
    await opened();
    expect(calls).toHaveLength(2);
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("surfaces a network failure", async () => {
    install(() => new Error("offline"));
    render(<Host />);
    setField("slug", "about");
    const alert = await screen.findByRole("alert", undefined, wait);
    expect(alert.textContent).toContain("offline");
  });

  it("treats an unexpected reply as an error", async () => {
    install(() => ({ body: { ok: true } }));
    render(<Host />);
    setField("slug", "about");
    const alert = await screen.findByRole("alert", undefined, wait);
    expect(alert.textContent).toContain(
      "Couldn't check what this URL change affects.",
    );
  });

  it("falls back to the default message when the error has no JSON", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("boom", { status: 500 })),
    );
    render(<Host />);
    setField("slug", "about");
    const alert = await screen.findByRole("alert", undefined, wait);
    expect(alert.textContent).toContain(
      "Couldn't check what this URL change affects.",
    );
  });
});

describe("Change URL guard scope", () => {
  it.each([
    ["a new page", { id: undefined, collectionSlug: "pages" }],
    ["another collection", { id: 5, collectionSlug: "shared-pages" }],
    ["a viewer", { id: 5, collectionSlug: "pages", hasSavePermission: false }],
  ])("stays quiet for %s", async (_name, doc) => {
    world.doc = { hasSavePermission: true, ...doc };
    const { calls } = install(() => ({ body: IMPACT }));
    render(<Host />);
    setField("slug", "about");
    await new Promise((resolve) => setTimeout(resolve, 600));
    expect(calls).toHaveLength(0);
    expect(screen.queryByRole("alertdialog")).toBeNull();
  });

  it("stays quiet when nothing differs from the stored value", async () => {
    const { calls } = install(() => ({ body: IMPACT }));
    render(<Host />);
    setField("slug", "about");
    await opened();
    setField("slug", "about-us");
    await new Promise((resolve) => setTimeout(resolve, 600));
    expect(calls).toHaveLength(1);
  });

  it("starts fresh after a save moves the stored value", async () => {
    const { calls } = install(() => ({ body: IMPACT }));
    const user = userEvent.setup();
    render(<Host />);
    setField("slug", "about");
    await user.click(
      within(await opened()).getByRole("button", { name: "Change URL" }),
    );
    act(() => {
      world.fields.slug.initialValue = "about";
      world.bump();
    });
    setField("slug", "company");
    const dialog = await opened();
    await user.click(
      within(dialog).getByRole("button", { name: "Keep old URL" }),
    );
    expect(world.fields.slug.value).toBe("about");
    expect(calls).toHaveLength(2);
  });
});
