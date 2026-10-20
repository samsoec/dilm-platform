import type { PayloadRequest } from "payload";
import { describe, expect, it, vi } from "vitest";

import { updateAccess } from "./invite";
import {
  keepOwnSuperAdminRole,
  OWN_SUPER_ADMIN_ROLE,
  superAdminsExceptSelf,
} from "./selfGuard";

const rani = { id: 1, roles: ["super-admin"] };
const budi = { id: 2, roles: ["super-admin"] };

describe("superAdminsExceptSelf (FR-UI-92)", () => {
  it("lets a Super Admin delete anyone but themself", () => {
    expect(superAdminsExceptSelf({ req: { user: rani } } as never)).toEqual({
      id: { not_equals: 1 },
    });
  });

  it("refuses everyone else", () => {
    expect(
      superAdminsExceptSelf({
        req: { user: { id: 3, roles: ["tenant-editor"] } },
      } as never),
    ).toBe(false);
    expect(superAdminsExceptSelf({ req: { user: null } } as never)).toBe(false);
  });
});

describe("keepOwnSuperAdminRole", () => {
  type Args = Parameters<typeof keepOwnSuperAdminRole>[0];
  const run = (user: object, originalDoc: object, roles: string[]) =>
    keepOwnSuperAdminRole({
      data: { roles },
      operation: "update",
      originalDoc,
      req: { user },
    } as unknown as Args);

  it("stops a Super Admin dropping their own Super Admin role", () => {
    expect(() => run(rani, rani, ["tenant-editor"])).toThrow(
      OWN_SUPER_ADMIN_ROLE,
    );
  });

  it("allows changing another Super Admin, or keeping your own role", () => {
    expect(run(rani, budi, ["tenant-editor"])).toEqual({
      roles: ["tenant-editor"],
    });
    expect(run(rani, rani, ["super-admin"])).toEqual({
      roles: ["super-admin"],
    });
  });
});

function request(user: object, body: object, update = vi.fn(async () => ({}))) {
  const req = {
    user,
    json: async () => body,
    payload: {
      find: vi.fn(async ({ collection }: { collection: string }) =>
        collection === "tenants"
          ? { docs: [{ id: 2, slug: "duniakimia", name: "Dunia Kimia Utama" }] }
          : { docs: [{ id: 7, name: "Sari", email: "sari@x.co" }] },
      ),
      update,
    },
  } as unknown as PayloadRequest;
  return { req, update };
}

describe("updateAccess", () => {
  it("saves a valid role and company change as the signed-in Super Admin", async () => {
    const { req, update } = request(rani, {
      id: 7,
      role: "tenant-viewer",
      tenants: [2],
    });

    expect((await updateAccess(req)).status).toBe(200);
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 7,
        data: { roles: ["tenant-viewer"], tenants: [{ tenant: 2 }] },
        overrideAccess: false,
      }),
    );
  });

  it("uses the invite rules, so an editor needs a company", async () => {
    const { req, update } = request(rani, {
      id: 7,
      role: "tenant-editor",
      tenants: [],
    });

    const response = await updateAccess(req);

    expect(response.status).toBe(400);
    expect((await response.json()).field).toBe("tenants");
    expect(update).not.toHaveBeenCalled();
  });

  it("passes the self-demotion refusal back on the role field", async () => {
    const refusal = Object.assign(new Error(OWN_SUPER_ADMIN_ROLE), {
      status: 403,
    });
    const { req } = request(
      rani,
      { id: 1, role: "tenant-editor", tenants: [2] },
      vi.fn(async () => {
        throw refusal;
      }),
    );

    const response = await updateAccess(req);

    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({
      field: "role",
      message: OWN_SUPER_ADMIN_ROLE,
    });
  });

  it("is Super Admin only", async () => {
    const { req } = request({ id: 3, roles: ["tenant-editor"] }, { id: 7 });
    expect((await updateAccess(req)).status).toBe(403);
  });
});
