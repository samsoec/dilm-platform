import type { PayloadRequest } from "payload";
import { describe, expect, it } from "vitest";

import { senderFor, validUntil } from "../admin/components/login/reset";
import { inviteInfo } from "./resetToken";

const TOKEN = "a".repeat(40);
const now = Date.now();

const sari = {
  id: 5,
  name: "Sari Wulandari",
  email: "sari@x.co",
  roles: ["tenant-viewer"],
  tenants: [{ tenant: 2 }, { tenant: 1 }],
  invitedBy: 9,
  hash: "secret-hash",
  resetPasswordToken: TOKEN,
  resetPasswordExpiration: new Date(now + 3_600_000).toISOString(),
};

function request(user: object | undefined, token: string | null = TOKEN) {
  const find = async ({
    collection,
    where,
  }: {
    collection: string;
    where: Record<string, { equals?: unknown }>;
  }) => {
    if (collection === "tenants") {
      return {
        docs: [
          { id: 1, name: "Indo Acidatama" },
          { id: 2, name: "Dunia Kimia Utama" },
        ],
      };
    }
    if (where.resetPasswordToken) {
      return {
        docs: user && where.resetPasswordToken.equals === TOKEN ? [user] : [],
      };
    }
    return { docs: [{ id: 9, name: "Rani Saputra", email: "rani@x.co" }] };
  };
  return {
    payload: { find },
    searchParams: new URLSearchParams(token ? { token } : {}),
  } as unknown as PayloadRequest;
}

describe("GET /api/users/invite-info (FR-UI-84)", () => {
  it("returns only first name, inviter, role, companies and expiry for a valid invite", async () => {
    const response = await inviteInfo(request(sari));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      firstName: "Sari",
      inviterName: "Rani Saputra",
      role: "Tenant Viewer",
      companies: ["Dunia Kimia Utama", "Indo Acidatama"],
      expiresAt: sari.resetPasswordExpiration,
    });
  });

  it("is 404 for an expired or already-used invite, naming only the inviter", async () => {
    const expired = {
      ...sari,
      resetPasswordExpiration: new Date(now - 1000).toISOString(),
    };

    const response = await inviteInfo(request(expired));

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({
      expired: true,
      inviterName: "Rani Saputra",
    });
  });

  it("is an empty 404 for a random, malformed or missing token", async () => {
    for (const req of [
      request(undefined),
      request(sari, "not-a-token"),
      request(sari, null),
    ]) {
      const response = await inviteInfo(req);
      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({});
    }
  });

  it("is an empty 404 for a plain password-reset token (no inviter)", async () => {
    const response = await inviteInfo(request({ ...sari, invitedBy: null }));

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({});
  });
});

describe("reset screen copy", () => {
  it("names the noreply sender only when the email's domain is a company domain", () => {
    expect(senderFor("Dimas@DuniaKimia.com", ["duniakimia.com"])).toBe(
      "noreply@duniakimia.com",
    );
    expect(senderFor("dimas@gmail.com", ["duniakimia.com"])).toBeUndefined();
  });

  it("shows the invite expiry in WIB", () => {
    expect(validUntil("2026-10-20T02:30:00.000Z")).toBe("20 Oct, 09:30 WIB");
  });
});
