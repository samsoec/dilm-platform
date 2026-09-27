import { SendEmailCommand } from "@aws-sdk/client-sesv2";
import type { EmailAdapter, Payload, SendEmailOptions } from "payload";
import { describe, expect, it } from "vitest";

import {
  emailTransport,
  FALLBACK_SENDER_TENANT,
  tenantOfSender,
  tenantSender,
  UNRESOLVED_SENDER,
  withTenantSender,
} from "./email";

type FakeUser = { email: string; tenants: { tenant: { slug: string } }[] };

const PAYLOAD_DEFAULT_FROM = `"${UNRESOLVED_SENDER.name}" <${UNRESOLVED_SENDER.address}>`;

function fakePayload(users: FakeUser[]) {
  const lookups: string[] = [];
  const payload = {
    find: async ({ where }: { where: { email: { equals: string } } }) => {
      lookups.push(where.email.equals);
      return {
        docs: users.filter((user) => user.email === where.email.equals),
      };
    },
  };
  return { payload: payload as unknown as Payload, lookups };
}

function capturingAdapter() {
  const sent: SendEmailOptions[] = [];
  const adapter: EmailAdapter = () => ({
    name: "capture",
    defaultFromName: UNRESOLVED_SENDER.name,
    defaultFromAddress: UNRESOLVED_SENDER.address,
    sendEmail: async (message) => {
      sent.push(message);
    },
  });
  return { adapter, sent };
}

async function send(users: FakeUser[], message: SendEmailOptions) {
  const { adapter, sent } = capturingAdapter();
  const { payload, lookups } = fakePayload(users);
  await withTenantSender(adapter)({ payload }).sendEmail(message);
  return { from: sent[0]!.from, lookups };
}

const editor = (slug: string): FakeUser => ({
  email: `editor@${slug}.test`,
  tenants: [{ tenant: { slug } }],
});

describe("withTenantSender", () => {
  it("sends Payload's password reset from the recipient's tenant", async () => {
    for (const slug of ["indoacid", "duniakimia", "likutelaga"] as const) {
      const { from } = await send([editor(slug)], {
        from: PAYLOAD_DEFAULT_FROM,
        to: `editor@${slug}.test`,
      });
      expect(from).toEqual(tenantSender(slug));
    }
  });

  it("uses the user's first tenant when they belong to several", async () => {
    const { from } = await send(
      [
        {
          email: "both@example.test",
          tenants: [
            { tenant: { slug: "likutelaga" } },
            { tenant: { slug: "duniakimia" } },
          ],
        },
      ],
      { from: PAYLOAD_DEFAULT_FROM, to: "Both <BOTH@example.test>" },
    );
    expect(from).toEqual(tenantSender("likutelaga"));
  });

  it("falls back to a tenant sender, never the unresolved default, for users without a tenant", async () => {
    for (const users of [[], [{ email: "admin@x.test", tenants: [] }]]) {
      const { from } = await send(users, {
        from: PAYLOAD_DEFAULT_FROM,
        to: "admin@x.test",
      });
      expect(from).toEqual(tenantSender(FALLBACK_SENDER_TENANT));
    }
  });

  it("keeps an explicit tenant sender without looking the recipient up", async () => {
    const { from, lookups } = await send([editor("indoacid")], {
      from: "noreply@duniakimia.com",
      to: "editor@indoacid.test",
    });
    expect(from).toEqual(tenantSender("duniakimia"));
    expect(lookups).toEqual([]);
  });

  it("replaces any other sender, including tenant subdomains", async () => {
    for (const from of [
      "noreply@mail.duniakimia.com",
      "info@duniakimia.com",
      { name: "Shared", address: "noreply@dilgroup.com" },
    ]) {
      const result = await send([editor("indoacid")], {
        from,
        to: "editor@indoacid.test",
      });
      expect(result.from).toEqual(tenantSender("indoacid"));
    }
  });
});

describe("tenantSender", () => {
  it("is noreply at the tenant's root domain under the tenant's name", () => {
    expect(tenantSender("indoacid")).toEqual({
      name: "Indonesian Acids Industry",
      address: "noreply@indonesianacids.com",
    });
    expect(tenantOfSender(tenantSender("likutelaga"))).toBe("likutelaga");
  });

  it("never resolves the unresolved default to a tenant", () => {
    expect(tenantOfSender(PAYLOAD_DEFAULT_FROM)).toBeUndefined();
    expect(UNRESOLVED_SENDER.address.endsWith(".invalid")).toBe(true);
  });
});

describe("emailTransport", () => {
  it("sends through SES v2 in Jakarta from the tenant address", async () => {
    const transport = emailTransport({
      transport: "ses",
      region: "ap-southeast-3",
    });
    const ses = (
      transport.transporter as unknown as {
        ses: {
          sesClient: {
            config: { region: () => Promise<string> };
            send: (command: unknown) => Promise<unknown>;
          };
        };
      }
    ).ses;
    const commands: unknown[] = [];
    ses.sesClient.send = async (command) => {
      commands.push(command);
      return { MessageId: "test" };
    };

    await transport.sendMail({
      from: tenantSender("duniakimia"),
      to: "someone@example.test",
      subject: "Reset",
      text: "Reset",
    });

    expect(await ses.sesClient.config.region()).toBe("ap-southeast-3");
    expect(commands[0]).toBeInstanceOf(SendEmailCommand);
    expect((commands[0] as SendEmailCommand).input.FromEmailAddress).toContain(
      "<noreply@duniakimia.com>",
    );
  });

  it("talks plain SMTP to Mailpit locally", () => {
    const transport = emailTransport({
      transport: "smtp",
      host: "localhost",
      port: 1025,
    });
    expect(transport.transporter.name).toBe("SMTP");
  });
});
