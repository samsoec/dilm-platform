import type { Endpoint, Payload, PayloadRequest } from "payload";

import { ROLE_LABELS, type Role, ROLES } from "../access";

type TokenUser = {
  id: number;
  name?: string | null;
  email: string;
  roles?: Role[] | null;
  tenants?: { tenant: number | { id: number } }[] | null;
  invitedBy?: number | { id: number } | null;
  resetPasswordExpiration?: string | null;
};

export type TokenLookup =
  | { state: "valid"; user: TokenUser }
  | { state: "expired"; user: TokenUser }
  | { state: "unknown" };

export async function lookupResetToken(
  payload: Payload,
  token: unknown,
  now = new Date(),
): Promise<TokenLookup> {
  if (typeof token !== "string" || !/^[A-Za-z0-9]{20,}$/.test(token)) {
    return { state: "unknown" };
  }
  const {
    docs: [user],
  } = await payload.find({
    collection: "users",
    where: { resetPasswordToken: { equals: token } },
    showHiddenFields: true,
    limit: 1,
    depth: 0,
  });
  if (!user) return { state: "unknown" };
  const doc = user as unknown as TokenUser;
  const expires = doc.resetPasswordExpiration
    ? new Date(doc.resetPasswordExpiration)
    : undefined;
  return expires && expires.getTime() > now.getTime()
    ? { state: "valid", user: doc }
    : { state: "expired", user: doc };
}

function relationID(value: number | { id: number } | null | undefined) {
  if (value === null || value === undefined) return undefined;
  return typeof value === "object" ? value.id : value;
}

async function personName(payload: Payload, id: number | undefined) {
  if (id === undefined) return undefined;
  const {
    docs: [person],
  } = await payload.find({
    collection: "users",
    where: { id: { equals: id } },
    select: { name: true, email: true },
    limit: 1,
    depth: 0,
  });
  return person ? person.name || person.email : undefined;
}

export type InviteInfo = {
  firstName: string;
  inviterName?: string;
  role: string;
  companies: string[];
  expiresAt: string;
};

export type InviteLookup =
  | { state: "valid"; info: InviteInfo }
  | { state: "expired"; inviterName?: string }
  | { state: "unknown" };

export async function lookupInvite(
  payload: Payload,
  token: unknown,
  now = new Date(),
): Promise<InviteLookup> {
  const found = await lookupResetToken(payload, token, now);
  if (found.state === "unknown") return found;
  const inviter = relationID(found.user.invitedBy);
  if (inviter === undefined) return { state: "unknown" };
  const inviterName = await personName(payload, inviter);
  if (found.state === "expired") return { state: "expired", inviterName };

  const { user } = found;
  const role = ROLES.find((candidate) => user.roles?.includes(candidate));
  const ids = (user.tenants ?? []).map(({ tenant }) => relationID(tenant));
  const { docs } =
    role === "super-admin" || ids.length === 0
      ? { docs: [] }
      : await payload.find({
          collection: "tenants",
          where: { id: { in: ids } },
          select: { name: true },
          pagination: false,
          depth: 0,
        });
  const names = new Map(docs.map((doc) => [doc.id, doc.name]));
  return {
    state: "valid",
    info: {
      firstName: (user.name || user.email).trim().split(/\s+/)[0],
      inviterName,
      role: role ? ROLE_LABELS[role] : ROLE_LABELS["tenant-viewer"],
      companies:
        role === "super-admin"
          ? ["All companies"]
          : ids.flatMap((id) => {
              const name = id === undefined ? undefined : names.get(id);
              return name ? [name] : [];
            }),
      expiresAt: user.resetPasswordExpiration as string,
    },
  };
}

export async function inviteInfo(req: PayloadRequest): Promise<Response> {
  const token = req.searchParams?.get("token");
  const found = await lookupInvite(req.payload, token);
  if (found.state === "valid") return Response.json(found.info);
  return Response.json(
    found.state === "expired" && found.inviterName
      ? { expired: true, inviterName: found.inviterName }
      : {},
    { status: 404 },
  );
}

export const inviteInfoEndpoint: Endpoint = {
  path: "/invite-info",
  method: "get",
  handler: inviteInfo,
};

function escape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function resetEmailHTML({
  req,
  token,
}: {
  req?: PayloadRequest;
  token?: string;
}): string {
  const base = req?.payload.config.serverURL || req?.origin || "";
  const link = `${base}${req?.payload.config.routes.admin ?? "/admin"}/reset/${token}`;
  return `<p>Someone asked to reset the password for your DIL Group CMS account.</p><p><a href="${escape(link)}">Set a new password</a>. The link works once and expires in an hour.</p><p>If it wasn't you, you can ignore this email. Your password stays the same.</p>`;
}

export async function tenantDomains(payload: Payload): Promise<string[]> {
  const { docs } = await payload.find({
    collection: "tenants",
    select: { domain: true },
    pagination: false,
    depth: 0,
  });
  return docs.map(({ domain }) => domain);
}
