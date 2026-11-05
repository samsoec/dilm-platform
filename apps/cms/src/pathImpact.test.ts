import type { PayloadRequest } from "payload";
import { describe, expect, it, vi } from "vitest";

import { Pages } from "./collections/Pages";
import { pathImpactHandler } from "./pathImpact";

const editor = {
  id: 5,
  collection: "users",
  roles: ["tenant-editor"],
  tenants: [{ tenant: 2 }],
};

function request(user: unknown, id: unknown, body: unknown) {
  const payload = {
    findByID: vi.fn(async () => {
      throw new Error("Not found");
    }),
    find: vi.fn(),
    logger: { error: vi.fn() },
  };
  return {
    payload,
    req: {
      payload,
      user,
      query: {},
      routeParams: { id },
      json: async () => body,
    } as unknown as PayloadRequest,
  };
}

async function run(user: unknown, id: unknown, body: unknown) {
  const { req, payload } = request(user, id, body);
  const response = await pathImpactHandler(req);
  return { status: response.status, payload };
}

describe("pathImpactHandler gating", () => {
  it("is registered on the pages collection", () => {
    expect(Pages.endpoints).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: "/:id/path-impact",
          method: "post",
          handler: pathImpactHandler,
        }),
      ]),
    );
  });

  it("refuses anonymous callers before touching the data", async () => {
    const { status, payload } = await run(undefined, "1", {});
    expect(status).toBe(401);
    expect(payload.findByID).not.toHaveBeenCalled();
  });

  it("refuses viewers before touching the data", async () => {
    const viewer = { ...editor, roles: ["tenant-viewer"] };
    const { status, payload } = await run(viewer, "1", {});
    expect(status).toBe(403);
    expect(payload.findByID).not.toHaveBeenCalled();
  });

  it.each(["abc", "1.5", "-1", "1 OR 1=1", undefined, ""])(
    "refuses the id %j",
    async (id) => {
      const { status, payload } = await run(editor, id, {});
      expect(status).toBe(400);
      expect(payload.findByID).not.toHaveBeenCalled();
    },
  );

  it.each([
    [undefined, 400],
    [{ slugs: [] }, 400],
    [{ slugs: { xx: "a" } }, 400],
    [{ slugs: { en: 1 } }, 400],
    [{ slugs: { en: "a".repeat(101) } }, 422],
    [{ parent: "x" }, 400],
    [{ parent: true }, 400],
  ])(
    "rejects the body %j with %i before reading the page",
    async (body, code) => {
      const { status, payload } = await run(editor, "1", body);
      expect(status).toBe(code);
      expect(payload.findByID).not.toHaveBeenCalled();
    },
  );

  it("answers 404 when the page can't be read as the user", async () => {
    const { status, payload } = await run(editor, "1", { slugs: { en: "a" } });
    expect(status).toBe(404);
    expect(payload.findByID).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: "pages",
        id: "1",
        overrideAccess: false,
        user: editor,
      }),
    );
  });
});
