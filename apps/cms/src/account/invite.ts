import { randomBytes } from "node:crypto";

import { TENANT_SLUGS, type TenantSlug } from "@dilm/shared-types";
import type { Endpoint, Payload, PayloadRequest } from "payload";

import {
  isSuperAdmin,
  type RoleHolder,
  type Role,
  ROLE_LABELS,
  ROLES,
} from "../access";
import { TENANT_COOKIE } from "../admin/data/sidebar";
import { FALLBACK_SENDER_TENANT, tenantSender } from "../email";

export const INVITE_TTL_MS = 72 * 60 * 60 * 1000;

export const DUPLICATE_EMAIL = "This email already has an account.";

type TenantID = number | string;

export type InviteInput = {
  name?: unknown;
  email?: unknown;
  role?: unknown;
  tenants?: unknown;
};

export type InviteField = "name" | "email" | "role" | "tenants";

export type Invite = {
  name: string;
  email: string;
  role: Role;
  tenants: TenantID[];
};

export type InviteProblem = { field: InviteField; message: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseInvite(
  input: InviteInput,
  knownTenants: TenantID[],
): Invite | InviteProblem {
  const name = typeof input.name === "string" ? input.name.trim() : "";
  if (!name) return { field: "name", message: "Enter their name." };
  const email =
    typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  if (!EMAIL.test(email)) {
    return {
      field: "email",
      message: "Enter a work email, like sari@dilgroup.co.id.",
    };
  }
  if (!ROLES.includes(input.role as Role)) {
    return { field: "role", message: "Pick a role." };
  }
  const role = input.role as Role;
  if (role === "super-admin") return { name, email, role, tenants: [] };
  const known = new Set(knownTenants.map(String));
  const picked = Array.isArray(input.tenants)
    ? [...new Set(input.tenants.map(String))]
    : [];
  if (picked.length === 0 || picked.some((id) => !known.has(id))) {
    return { field: "tenants", message: "Pick at least one company." };
  }
  const tenants = knownTenants.filter((id) => picked.includes(String(id)));
  tenants.sort((a, b) => picked.indexOf(String(a)) - picked.indexOf(String(b)));
  return { name, email, role, tenants };
}

export function isProblem(
  value: Invite | InviteProblem,
): value is InviteProblem {
  return "field" in value;
}

function respond(status: number, body: object): Response {
  return Response.json(body, { status });
}

type TenantRow = { id: TenantID; slug: string; name: string };

async function loadTenants(payload: Payload): Promise<TenantRow[]> {
  const { docs } = await payload.find({
    collection: "tenants",
    select: { slug: true, name: true },
    sort: "name",
    pagination: false,
    depth: 0,
  });
  return docs as TenantRow[];
}

function isTenantSlug(value: unknown): value is TenantSlug {
  return TENANT_SLUGS.includes(value as TenantSlug);
}

function selectedTenant(req: PayloadRequest): string | undefined {
  const cookie = req.headers.get("cookie") ?? "";
  return new RegExp(`(?:^|;\\s*)${TENANT_COOKIE}=([^;]+)`).exec(cookie)?.[1];
}

export function senderSlug(
  assigned: TenantID[],
  selected: string | undefined,
  tenants: TenantRow[],
): TenantSlug {
  const first = assigned[0] ?? selected;
  const slug = tenants.find(({ id }) => String(id) === String(first))?.slug;
  return isTenantSlug(slug) ? slug : FALLBACK_SENDER_TENANT;
}

function linkBase(req: PayloadRequest): string {
  return req.payload.config.serverURL || req.origin || "";
}

export function inviteEmail({
  name,
  inviter,
  role,
  link,
}: {
  name: string;
  inviter: string;
  role: Role;
  link: string;
}) {
  const first = name.split(/\s+/)[0];
  const text = [
    `Hi ${first},`,
    "",
    `${inviter} invited you to the DIL Group CMS as a ${ROLE_LABELS[role]}.`,
    "Set your own password with this link. It's valid for 72 hours:",
    link,
    "",
    "If you weren't expecting this, you can ignore this email.",
  ].join("\n");
  const html = `<p>Hi ${escape(first)},</p><p>${escape(inviter)} invited you to the DIL Group CMS as a ${ROLE_LABELS[role]}.</p><p><a href="${escape(link)}">Set your password</a>. The link is valid for 72 hours.</p><p>If you weren't expecting this, you can ignore this email.</p>`;
  return { subject: "You're invited to the DIL Group CMS", text, html };
}

function escape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function sendInvitation(
  req: PayloadRequest,
  invitee: { email: string; name: string; role: Role; tenants: TenantID[] },
  tenants: TenantRow[],
): Promise<void> {
  const { payload } = req;
  const token = await payload.forgotPassword({
    collection: "users",
    data: { email: invitee.email },
    disableEmail: true,
    expiration: INVITE_TTL_MS,
  });
  const inviter = req.user as { name?: string | null; email?: string } | null;
  const link = `${linkBase(req)}${payload.config.routes.admin}/reset/${token}?invite=1`;
  await payload.sendEmail({
    from: tenantSender(
      senderSlug(invitee.tenants, selectedTenant(req), tenants),
    ),
    to: invitee.email,
    ...inviteEmail({
      name: invitee.name,
      inviter: inviter?.name || inviter?.email || "A Super Admin",
      role: invitee.role,
      link,
    }),
  });
}

function superAdminOnly(req: PayloadRequest): Response | undefined {
  if (!req.user) return respond(401, { message: "Sign in first." });
  if (!isSuperAdmin(req.user as RoleHolder)) {
    return respond(403, { message: "Only Super Admins can invite people." });
  }
  return undefined;
}

export async function inviteUser(req: PayloadRequest): Promise<Response> {
  const refused = superAdminOnly(req);
  if (refused) return refused;
  const { payload } = req;
  const tenants = await loadTenants(payload);
  const body = ((await req.json?.().catch(() => undefined)) ??
    {}) as InviteInput;
  const invite = parseInvite(
    body,
    tenants.map(({ id }) => id),
  );
  if (isProblem(invite)) return respond(400, invite);

  const { totalDocs } = await payload.count({
    collection: "users",
    where: { email: { equals: invite.email } },
  });
  if (totalDocs > 0) {
    return respond(409, { field: "email", message: DUPLICATE_EMAIL });
  }

  const user = await payload.create({
    collection: "users",
    data: {
      name: invite.name,
      email: invite.email,
      password: randomBytes(32).toString("base64url"),
      roles: [invite.role],
      tenants: invite.tenants.map((tenant) => ({ tenant: tenant as number })),
      invitedBy: (req.user as { id: number }).id,
    },
    overrideAccess: true,
  });

  try {
    await sendInvitation(req, invite, tenants);
  } catch (error) {
    payload.logger.error({ err: error, msg: "invitation email failed" });
    return respond(502, {
      id: user.id,
      message: `${invite.name} was added, but the email didn't send. Use Resend invitation.`,
    });
  }
  return respond(201, { id: user.id, name: invite.name });
}

export async function resendInvitation(req: PayloadRequest): Promise<Response> {
  const refused = superAdminOnly(req);
  if (refused) return refused;
  const { payload } = req;
  const body = ((await req.json?.().catch(() => undefined)) ?? {}) as {
    id?: unknown;
  };
  if (typeof body.id !== "number" && typeof body.id !== "string") {
    return respond(400, { message: "Which user?" });
  }
  const {
    docs: [user],
  } = await payload.find({
    collection: "users",
    where: { id: { equals: body.id } },
    limit: 1,
    depth: 0,
  });
  if (!user) return respond(404, { message: "That user no longer exists." });
  if (user.lastLoginAt) {
    return respond(409, {
      message: `${user.name ?? user.email} has already signed in.`,
    });
  }
  const tenants = await loadTenants(payload);
  const role =
    ROLES.find((candidate) => user.roles?.includes(candidate)) ??
    "tenant-viewer";
  try {
    await sendInvitation(
      req,
      {
        email: user.email,
        name: user.name ?? user.email,
        role,
        tenants: (user.tenants ?? []).map(({ tenant }) =>
          typeof tenant === "object" ? tenant.id : tenant,
        ),
      },
      tenants,
    );
  } catch (error) {
    payload.logger.error({ err: error, msg: "invitation email failed" });
    return respond(502, { message: "The email didn't send. Try again." });
  }
  return respond(200, { name: user.name ?? user.email });
}

export const inviteEndpoints: Endpoint[] = [
  { path: "/invite", method: "post", handler: inviteUser },
  { path: "/invite/resend", method: "post", handler: resendInvitation },
];
