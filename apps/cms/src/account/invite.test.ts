import type { PayloadRequest } from "payload";
import { describe, expect, it, vi } from "vitest";

import { onlyWhileNoUsers } from "../collections/Users";
import {
  DUPLICATE_EMAIL,
  INVITE_TTL_MS,
  inviteUser,
  parseInvite,
  resendInvitation,
  senderSlug,
} from "./invite";

const TENANTS = [
  { id: 1, slug: "indoacid", name: "Indo Acidatama" },
  { id: 2, slug: "duniakimia", name: "Dunia Kimia Utama" },
  { id: 3, slug: "likutelaga", name: "Likutelaga" },
];

const superAdmin = { id: 9, name: "Rani Saputra", roles: ["super-admin"] };
const editor = { id: 8, name: "Dimas", roles: ["tenant-editor"] };

describe("parseInvite (FR-UI-54)", () => {
  const ids = TENANTS.map(({ id }) => id);

  it("keeps the picked companies in the order they were ticked", () => {
    expect(
      parseInvite(
        {
          name: " Sari ",
          email: "Sari@DILgroup.co.id",
          role: "tenant-editor",
          tenants: [2, 1],
        },
        ids,
      ),
    ).toEqual({
      name: "Sari",
      email: "sari@dilgroup.co.id",
      role: "tenant-editor",
      tenants: [2, 1],
    });
  });

  it("gives Super Admins no company list", () => {
    expect(
      parseInvite(
        { name: "Rani", email: "r@x.co", role: "super-admin", tenants: [1] },
        ids,
      ),
    ).toMatchObject({ tenants: [] });
  });

  it("rejects unknown roles, missing companies and unknown companies", () => {
    expect(
      parseInvite({ name: "A", email: "a@x.co", role: "owner" }, ids),
    ).toMatchObject({ field: "role" });
    expect(
      parseInvite(
        { name: "A", email: "a@x.co", role: "tenant-viewer", tenants: [] },
        ids,
      ),
    ).toMatchObject({ field: "tenants" });
    expect(
      parseInvite(
        { name: "A", email: "a@x.co", role: "tenant-viewer", tenants: [99] },
        ids,
      ),
    ).toMatchObject({ field: "tenants" });
    expect(
      parseInvite(
        { name: "", email: "a@x.co", role: "tenant-viewer", tenants: [1] },
        ids,
      ),
    ).toMatchObject({ field: "name" });
    expect(
      parseInvite(
        { name: "A", email: "nope", role: "tenant-viewer", tenants: [1] },
        ids,
      ),
    ).toMatchObject({ field: "email" });
  });
});

describe("senderSlug", () => {
  it("uses the first assigned company, else the selected one", () => {
    expect(senderSlug([2, 1], "3", TENANTS)).toBe("duniakimia");
    expect(senderSlug([], "3", TENANTS)).toBe("likutelaga");
    expect(senderSlug([], undefined, TENANTS)).toBe("indoacid");
  });
});

function request(user: object | null, body: object, existing = 0) {
  const payload = {
    config: {
      serverURL: "https://cms.example.test",
      routes: { admin: "/admin" },
    },
    find: vi.fn(async ({ collection }: { collection: string }) =>
      collection === "tenants"
        ? { docs: TENANTS }
        : {
            docs: [
              {
                id: 5,
                email: "sari@x.co",
                name: "Sari",
                roles: ["tenant-viewer"],
                tenants: [{ tenant: 3 }],
                lastLoginAt: null,
              },
            ],
          },
    ),
    count: vi.fn(async () => ({ totalDocs: existing })),
    create: vi.fn(async () => ({ id: 5 })),
    forgotPassword: vi.fn(async () => "token-123"),
    sendEmail: vi.fn(async () => undefined),
    logger: { error: vi.fn() },
  };
  const req = {
    user,
    payload,
    origin: "https://spoofed.example",
    headers: new Headers({ cookie: "payload-tenant=2" }),
    json: async () => body,
  } as unknown as PayloadRequest;
  return { req, payload };
}

const invite = {
  name: "Sari Wulandari",
  email: "sari@x.co",
  role: "tenant-viewer",
  tenants: [3],
};

describe("inviteUser", () => {
  it("checks Super Admin before anything else", async () => {
    const { req, payload } = request(editor, invite);

    expect((await inviteUser(req)).status).toBe(403);
    expect(payload.find).not.toHaveBeenCalled();
    expect((await inviteUser(request(null, invite).req)).status).toBe(401);
  });

  it("reports a duplicate email on the email field", async () => {
    const { req, payload } = request(superAdmin, invite, 1);

    const response = await inviteUser(req);

    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({
      field: "email",
      message: DUPLICATE_EMAIL,
    });
    expect(payload.create).not.toHaveBeenCalled();
  });

  it("creates the user with a random password, records the inviter and mails a 72-hour link", async () => {
    const { req, payload } = request(superAdmin, invite);

    const response = await inviteUser(req);

    expect(response.status).toBe(201);
    const created = (payload.create.mock.calls as unknown[][])[0][0] as {
      data: Record<string, unknown>;
    };
    expect(created.data).toMatchObject({
      email: "sari@x.co",
      roles: ["tenant-viewer"],
      tenants: [{ tenant: 3 }],
      invitedBy: 9,
    });
    expect(String(created.data.password).length).toBeGreaterThan(30);
    expect(payload.forgotPassword).toHaveBeenCalledWith(
      expect.objectContaining({
        disableEmail: true,
        expiration: INVITE_TTL_MS,
      }),
    );
    const mail = (payload.sendEmail.mock.calls as unknown[][])[0][0] as {
      from: { address: string };
      text: string;
    };
    expect(mail.from.address).toBe("noreply@likutelaga.com");
    expect(mail.text).toContain(
      "https://cms.example.test/admin/reset/token-123?invite=1",
    );
    expect(mail.text).not.toContain("spoofed");
  });
});

describe("resendInvitation", () => {
  it("sends a fresh link for someone who never signed in", async () => {
    const { req, payload } = request(superAdmin, { id: 5 });

    expect((await resendInvitation(req)).status).toBe(200);
    expect(payload.forgotPassword).toHaveBeenCalledTimes(1);
  });

  it("is Super Admin only", async () => {
    expect(
      (await resendInvitation(request(editor, { id: 5 }).req)).status,
    ).toBe(403);
  });
});

describe("users.access.create", () => {
  const run = (totalDocs: number) =>
    onlyWhileNoUsers({
      req: { payload: { count: async () => ({ totalDocs }) } },
    } as never);

  it("only allows creating the very first user; everyone else is invited", async () => {
    expect(await run(0)).toBe(true);
    expect(await run(3)).toBe(false);
  });
});
