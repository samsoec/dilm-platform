import { TENANT_SLUGS, type TenantSlug } from "@dilm/shared-types";
import type { Payload, TextFieldSingleValidation } from "payload";
import { describe, expect, it } from "vitest";

import {
  isCopyrightTemplate,
  isItalicOnlyHeading,
  MAX_COLUMN_LINKS,
  MAX_LINK_COLUMNS,
} from "../collections/Footer";
import { MAX_DROPDOWN_LINKS, MAX_NAV_ITEMS } from "../collections/Header";
import { isHttpsUrl, isInternalPath } from "../validation";
import { layoutSeed, seedLayout, type LayoutSeed } from "./layout";

type Link = {
  type: "internal" | "external";
  internalPath?: string | null;
  externalUrl?: string | null;
  label?: string | null;
};

function headerLinks({ header }: LayoutSeed): Link[] {
  return [
    ...(header.navItems ?? []).flatMap((item) =>
      item.type === "link"
        ? [item.link as Link]
        : (item.children ?? []).map(({ link }) => link),
    ),
    header.cta!.link as Link,
  ];
}

function footerLinks({ footer }: LayoutSeed): Link[] {
  return [
    footer.ctaBand.primaryButton,
    footer.ctaBand.secondaryButton,
    ...(footer.linkColumns ?? []).flatMap((column) =>
      (column.links ?? []).map(({ link }) => link),
    ),
  ];
}

const noArgs = {} as Parameters<TextFieldSingleValidation>[1];

describe("layoutSeed", () => {
  const seeds = TENANT_SLUGS.map((slug) => [slug, layoutSeed(slug)] as const);

  it("seeds the Figma navbar labels verbatim", () => {
    expect(
      layoutSeed("indoacid").header.navItems!.map((item) =>
        item.type === "link"
          ? item.link!.label
          : [item.label, item.children!.map(({ link }) => link.label)],
      ),
    ).toEqual([
      ["Product & Solutions", ["Our Products", "Our Solutions"]],
      [
        "About Us",
        [
          "Overview",
          "Our Journey",
          "Awards & Certifications",
          "Management System",
        ],
      ],
      "Investor",
      [
        "Sustainability",
        [
          "Environmental, Social, and Governance (ESG)",
          "Corporate Social Responsibility (CSR)",
          "Health, Safety, and Environment (HSE)",
        ],
      ],
      "Publication",
      "Career",
      "#BetteringYourWorld",
    ]);
  });

  it("seeds the header toggles and the Contact Us button", () => {
    const { header } = layoutSeed("indoacid");

    expect(header.showSearch).toBe(false);
    expect(header.showLanguageSwitcher).toBe(true);
    expect(header.cta).toMatchObject({
      enabled: true,
      link: { label: "Contact Us", internalPath: "/contact-us" },
    });
  });

  it("seeds the Figma footer labels verbatim", () => {
    const { footer } = layoutSeed("indoacid");

    expect(footer.ctaBand.eyebrow).toBe("Contact Us");
    expect(footer.ctaBand.primaryButton.label).toBe("Contact Us");
    expect(footer.ctaBand.secondaryButton.label).toBe("Explore Our Products");
    expect(
      footer.linkColumns!.map(({ title, links }) => [
        title,
        links!.map(({ link }) => link.label),
      ]),
    ).toEqual([
      ["Company", ["Products & Solutions", "About Us", "Contact US", "Career"]],
      [
        "Sustainability",
        ["News & Event", "ESG, CSR, and HSE", "#BetteringYourWorld"],
      ],
      ["Other", ["Terms & Conditions", "Privacy Policy"]],
    ]);
    expect(footer.partOf).toEqual({ enabled: false, label: "Part of" });
    expect(footer.copyright).toBe(
      "Copyright © {year} {legalName}. All Right Reserved",
    );
  });

  it("italicises only the word Together in the contact band heading", () => {
    const [paragraph] = layoutSeed("indoacid").footer.ctaBand.heading!.root
      .children as unknown as {
      children: { text: string; format: number }[];
    }[];

    expect(
      paragraph!.children.map(({ text, format }) => [text, format]),
    ).toEqual([
      ["Let's Find the Right Solution ", 0],
      ["Together", 2],
    ]);
  });

  it.each(seeds)(
    "passes every header and footer rule for %s",
    async (_, seed) => {
      const { header, footer } = seed;

      expect(header.navItems!.length).toBeLessThanOrEqual(MAX_NAV_ITEMS);
      for (const item of header.navItems!) {
        expect(item.children?.length ?? 0).toBeLessThanOrEqual(
          MAX_DROPDOWN_LINKS,
        );
      }
      expect(footer.linkColumns!.length).toBeLessThanOrEqual(MAX_LINK_COLUMNS);
      for (const column of footer.linkColumns!) {
        expect(column.links!.length).toBeLessThanOrEqual(MAX_COLUMN_LINKS);
      }

      for (const link of [...headerLinks(seed), ...footerLinks(seed)]) {
        expect(link.label).toBeTruthy();
        expect(
          link.type === "internal"
            ? isInternalPath(link.internalPath!, noArgs)
            : isHttpsUrl(link.externalUrl!, noArgs),
        ).toBe(true);
      }

      expect(isCopyrightTemplate(footer.copyright!, noArgs)).toBe(true);
      expect(
        await isItalicOnlyHeading(footer.ctaBand.heading, {
          editor: { validate: () => true },
        } as unknown as Parameters<typeof isItalicOnlyHeading>[1]),
      ).toBe(true);
    },
  );

  it("links #BetteringYourWorld to the one Liku Telaga page", () => {
    const target = (slug: TenantSlug) =>
      headerLinks(layoutSeed(slug)).find(
        ({ label }) => label === "#BetteringYourWorld",
      );

    expect(target("likutelaga")).toMatchObject({
      type: "internal",
      internalPath: "/bettering-your-world",
    });
    for (const slug of ["indoacid", "duniakimia"] as const) {
      expect(target(slug)).toMatchObject({
        type: "external",
        externalUrl: "https://likutelaga.com/bettering-your-world",
      });
    }
  });

  it("leaves brand, contact and social details to tenant-settings", () => {
    const { header, footer } = layoutSeed("indoacid");

    expect(Object.keys(header).sort()).toEqual([
      "cta",
      "navItems",
      "showLanguageSwitcher",
      "showSearch",
    ]);
    expect(Object.keys(footer).sort()).toEqual([
      "copyright",
      "ctaBand",
      "linkColumns",
      "partOf",
    ]);
  });
});

type Stored = { id: number; tenant: number } & Record<string, unknown>;

function fakePayload(
  tenants: TenantSlug[] = [...TENANT_SLUGS],
  existing: Partial<Record<"header" | "footer", number[]>> = {},
) {
  const tenantDocs = tenants.map((slug, index) => ({ id: index + 1, slug }));
  const docs: Record<"header" | "footer", Stored[]> = {
    header: (existing.header ?? []).map((tenant) => ({
      id: 100 + tenant,
      tenant,
      edited: true,
    })),
    footer: (existing.footer ?? []).map((tenant) => ({
      id: 200 + tenant,
      tenant,
      edited: true,
    })),
  };
  const writes: string[] = [];
  let nextId = 1;

  const payload = {
    find: async () => ({ docs: tenantDocs }),
    count: async ({
      collection,
      where,
    }: {
      collection: "header" | "footer";
      where: { tenant: { equals: number } };
    }) => ({
      totalDocs: docs[collection].filter(
        ({ tenant }) => tenant === where.tenant.equals,
      ).length,
    }),
    create: async ({
      collection,
      locale,
      data,
    }: {
      collection: "header" | "footer";
      locale: string;
      data: Stored;
    }) => {
      const doc = {
        ...data,
        id: nextId++,
        createdAt: "now",
        updatedAt: "now",
      };
      writes.push(`create ${collection} ${data.tenant} ${locale}`);
      docs[collection].push(doc);
      return doc;
    },
    update: async ({
      collection,
      id,
      locale,
      data,
    }: {
      collection: "header" | "footer";
      id: number;
      locale: string;
      data: Record<string, unknown>;
    }) => {
      const doc = docs[collection].find((candidate) => candidate.id === id)!;
      writes.push(`update ${collection} ${doc.tenant} ${locale}`);
      doc[`${locale}Copy`] = data;
    },
  };

  return { payload: payload as unknown as Payload, docs, writes };
}

describe("seedLayout", () => {
  it("creates a header and footer for every tenant", async () => {
    const { payload, docs } = fakePayload();

    const result = await seedLayout(payload);

    expect(result).toEqual({
      outcomes: {
        indoacid: { header: "created", footer: "created" },
        duniakimia: { header: "created", footer: "created" },
        likutelaga: { header: "created", footer: "created" },
      },
      missingTenants: [],
    });
    expect(docs.header.map(({ tenant }) => tenant)).toEqual([1, 2, 3]);
    expect(docs.footer.map(({ tenant }) => tenant)).toEqual([1, 2, 3]);
  });

  it("writes English first, then copies it to Indonesian", async () => {
    const { payload, docs, writes } = fakePayload(["likutelaga"]);

    await seedLayout(payload);

    expect(writes).toEqual([
      "create header 1 en",
      "update header 1 id",
      "create footer 1 en",
      "update footer 1 id",
    ]);
    expect(docs.header[0]!.idCopy).toEqual(layoutSeed("likutelaga").header);
    expect(docs.footer[0]!.idCopy).toEqual(layoutSeed("likutelaga").footer);
  });

  it("never touches a header or footer that already exists", async () => {
    const { payload, docs, writes } = fakePayload(undefined, {
      header: [1],
      footer: [1, 2],
    });

    const result = await seedLayout(payload);

    expect(result.outcomes).toEqual({
      indoacid: { header: "skipped", footer: "skipped" },
      duniakimia: { header: "created", footer: "skipped" },
      likutelaga: { header: "created", footer: "created" },
    });
    expect(writes.some((write) => / 1 /.test(write))).toBe(false);
    expect(docs.header[0]).toEqual({ id: 101, tenant: 1, edited: true });
  });

  it("writes nothing when run a second time", async () => {
    const { payload, writes } = fakePayload();
    await seedLayout(payload);
    writes.length = 0;

    await seedLayout(payload);

    expect(writes).toEqual([]);
  });

  it("reports tenants that have not been seeded yet", async () => {
    const { payload } = fakePayload(["indoacid"]);

    const result = await seedLayout(payload);

    expect(result.missingTenants).toEqual(["duniakimia", "likutelaga"]);
    expect(Object.keys(result.outcomes)).toEqual(["indoacid"]);
  });
});
