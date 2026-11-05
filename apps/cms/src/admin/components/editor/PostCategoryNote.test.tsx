// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CategoryChangeNote, PostCategoryNote } from "./PostCategoryNote";

const world = vi.hoisted(() => ({
  fields: {} as Record<string, { value: unknown; initialValue?: unknown }>,
  doc: {} as Record<string, unknown>,
}));

vi.mock("@payloadcms/ui", () => ({
  useConfig: () => ({
    config: {
      routes: { api: "/api" },
      serverURL: "",
      localization: { localeCodes: ["en", "id"], defaultLocale: "en" },
    },
  }),
  useLocale: () => ({ code: "en" }),
  useDocumentInfo: () => world.doc,
  useFormFields: (select: (state: [unknown, unknown]) => unknown) =>
    select([world.fields, vi.fn()]),
}));

const POST = {
  _status: "published",
  slug: { en: "new-plant", id: "pabrik-baru" },
  path: {
    en: "/category/news/new-plant",
    id: "/kategori/berita/pabrik-baru",
  },
};

const CATEGORY = { path: { en: "/category/csr", id: "/kategori/csr" } };

function install(
  post: unknown = POST,
  category: unknown = CATEGORY,
  failing?: "post" | "category",
) {
  const urls: string[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      urls.push(url);
      const isPost = url.startsWith("/api/posts/");
      if (failing === (isPost ? "post" : "category")) {
        return new Response("{}", { status: 500 });
      }
      return new Response(JSON.stringify(isPost ? post : category), {
        status: 200,
      });
    }),
  );
  return urls;
}

beforeEach(() => {
  world.doc = { id: 12, collectionSlug: "posts" };
  world.fields = {
    primaryCategory: { value: 2, initialValue: 1 },
    slug: { value: "new-plant" },
  };
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("CategoryChangeNote", () => {
  it("renders nothing without a move", () => {
    const { container } = render(<CategoryChangeNote moves={[]} />);
    expect(container.textContent).toBe("");
  });

  it("shows from and to for each language", () => {
    render(
      <CategoryChangeNote
        moves={[
          { locale: "en", from: "/en/a/x", to: "/en/b/x" },
          { locale: "id", from: "/id/a/x", to: "/id/b/x" },
        ]}
      />,
    );
    expect(screen.getByRole("status").textContent).toContain(
      "A redirect from the old address is created in English and Indonesian",
    );
    expect(screen.getAllByText("/en/a/x")[0].closest("s")).toBeTruthy();
    expect(screen.getByText("/id/b/x").closest("strong")).toBeTruthy();
  });

  it("raises an alert when the lookup failed", () => {
    render(<CategoryChangeNote failed moves={[]} />);
    expect(screen.getByRole("alert").textContent).toContain(
      "couldn't be worked out",
    );
  });
});

describe("PostCategoryNote (PS-02)", () => {
  it("shows the move for a published post whose category changes", async () => {
    const urls = install();
    render(<PostCategoryNote />);
    const note = await screen.findByRole("status");
    expect(note.textContent).toContain("/en/category/news/new-plant");
    expect(note.textContent).toContain("/en/category/csr/new-plant");
    expect(note.textContent).toContain("/id/kategori/csr/pabrik-baru");
    expect(urls[0]).toContain("/api/posts/12?draft=false");
    expect(urls[1]).toContain("/api/categories/2?");
  });

  it("uses the slug being edited for the current language", async () => {
    world.fields.slug = { value: "fresh-plant" };
    install();
    render(<PostCategoryNote />);
    const note = await screen.findByRole("status");
    expect(note.textContent).toContain("/en/category/csr/fresh-plant");
  });

  it("stays quiet for a post that isn't published", async () => {
    const urls = install({ ...POST, _status: "draft" });
    render(<PostCategoryNote />);
    await vi.waitFor(() => expect(urls).toHaveLength(2));
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("stays quiet for a trashed post", async () => {
    const urls = install({ ...POST, deletedAt: "2026-01-01T00:00:00Z" });
    render(<PostCategoryNote />);
    await vi.waitFor(() => expect(urls).toHaveLength(2));
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("does not ask when the category is unchanged or the post is new", async () => {
    const urls = install();
    world.fields.primaryCategory = { value: 1, initialValue: 1 };
    const { rerender } = render(<PostCategoryNote />);
    world.fields.primaryCategory = { value: 2, initialValue: 1 };
    world.doc = { id: undefined, collectionSlug: "posts" };
    rerender(<PostCategoryNote />);
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(urls).toHaveLength(0);
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("only works on posts", async () => {
    world.doc = { id: 12, collectionSlug: "jobs" };
    const urls = install();
    render(<PostCategoryNote />);
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(urls).toHaveLength(0);
  });

  it.each(["post", "category"] as const)(
    "raises an alert when the %s lookup fails",
    async (failing) => {
      install(POST, CATEGORY, failing);
      render(<PostCategoryNote />);
      expect((await screen.findByRole("alert")).textContent).toContain(
        "couldn't be worked out",
      );
    },
  );
});
