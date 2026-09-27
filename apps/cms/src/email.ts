import { SendEmailCommand, SESv2Client } from "@aws-sdk/client-sesv2";
import type { EmailConfig } from "@dilm/runtime-config";
import {
  TENANT_NAMES,
  TENANT_SLUGS,
  tenantSenderAddress,
  type TenantSlug,
} from "@dilm/shared-types";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import nodemailer, { type Transporter } from "nodemailer";
import type { EmailAdapter, Payload, SendEmailOptions } from "payload";

export type Sender = { name: string; address: string };

export const UNRESOLVED_SENDER: Sender = {
  name: "DIL Group",
  address: "noreply@unresolved-tenant.invalid",
};

export const FALLBACK_SENDER_TENANT: TenantSlug = "indoacid";

type AddressLike = string | { address: string } | undefined;

export function tenantSender(slug: TenantSlug): Sender {
  return { name: TENANT_NAMES[slug], address: tenantSenderAddress(slug) };
}

function addressOf(value: AddressLike | AddressLike[]): string | undefined {
  const first = Array.isArray(value) ? value[0] : value;
  if (first === undefined) return undefined;
  const raw = typeof first === "string" ? first : first.address;
  const bracketed = /<([^>]+)>/.exec(raw)?.[1] ?? raw;
  return bracketed.trim().toLowerCase();
}

export function tenantOfSender(
  from: SendEmailOptions["from"],
): TenantSlug | undefined {
  const address = addressOf(from as AddressLike);
  return TENANT_SLUGS.find((slug) => tenantSenderAddress(slug) === address);
}

function isTenantSlug(value: unknown): value is TenantSlug {
  return TENANT_SLUGS.includes(value as TenantSlug);
}

export async function recipientTenant(
  payload: Payload,
  to: SendEmailOptions["to"],
): Promise<TenantSlug> {
  const email = addressOf(to as AddressLike | AddressLike[]);
  if (email === undefined) return FALLBACK_SENDER_TENANT;
  const {
    docs: [user],
  } = await payload.find({
    collection: "users",
    where: { email: { equals: email } },
    limit: 1,
    depth: 1,
  });
  const slug = (user?.tenants ?? [])
    .map(({ tenant }) => (typeof tenant === "object" ? tenant.slug : null))
    .find(isTenantSlug);
  return slug ?? FALLBACK_SENDER_TENANT;
}

export function withTenantSender(adapter: EmailAdapter): EmailAdapter {
  return ({ payload }) => {
    const inner = adapter({ payload });
    return {
      ...inner,
      sendEmail: async (message) => {
        const slug =
          tenantOfSender(message.from) ??
          (await recipientTenant(payload, message.to));
        return inner.sendEmail({ ...message, from: tenantSender(slug) });
      },
    };
  };
}

export function emailTransport(config: EmailConfig): Transporter {
  if (config.transport === "smtp") {
    return nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: false,
    });
  }
  return nodemailer.createTransport({
    SES: {
      sesClient: new SESv2Client({ region: config.region }),
      SendEmailCommand,
    },
  });
}

export async function cmsEmailAdapter(
  config: EmailConfig,
): Promise<EmailAdapter> {
  return withTenantSender(
    await nodemailerAdapter({
      defaultFromName: UNRESOLVED_SENDER.name,
      defaultFromAddress: UNRESOLVED_SENDER.address,
      transport: emailTransport(config),
      skipVerify: true,
    }),
  );
}
