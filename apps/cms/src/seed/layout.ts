import {
  TENANT_DOMAINS,
  TENANT_SLUGS,
  type TenantSlug,
} from "@dilm/shared-types";
import type { Payload } from "payload";

import type { Footer, Header } from "../payload-types";

export type LayoutGlobal = "header" | "footer";

type Link = NonNullable<NonNullable<Header["cta"]>["link"]>;

type HeaderSeed = Omit<Header, "id" | "tenant" | "createdAt" | "updatedAt">;

type FooterSeed = Omit<Footer, "id" | "tenant" | "createdAt" | "updatedAt">;

export type LayoutSeed = { header: HeaderSeed; footer: FooterSeed };

export const BETTERING_YOUR_WORLD_PATH = "/bettering-your-world";

export const BETTERING_YOUR_WORLD_OWNER: TenantSlug = "likutelaga";

function internal(label: string, internalPath: string): Link {
  return { type: "internal", newTab: false, internalPath, label };
}

function external(label: string, externalUrl: string): Link {
  return { type: "external", newTab: false, externalUrl, label };
}

function betteringYourWorld(tenant: TenantSlug): Link {
  const label = "#BetteringYourWorld";
  return tenant === BETTERING_YOUR_WORLD_OWNER
    ? internal(label, BETTERING_YOUR_WORLD_PATH)
    : external(
        label,
        `https://${TENANT_DOMAINS[BETTERING_YOUR_WORLD_OWNER]}${BETTERING_YOUR_WORLD_PATH}`,
      );
}

function linkItem(link: Link) {
  return { type: "link" as const, link };
}

function dropdown(label: string, children: Link[]) {
  return {
    type: "dropdown" as const,
    label,
    children: children.map((link) => ({ link })),
  };
}

function text(value: string, format = 0) {
  return {
    type: "text",
    version: 1,
    text: value,
    format,
    style: "",
    mode: "normal",
    detail: 0,
  };
}

const ITALIC = 2;

const CTA_HEADING: NonNullable<FooterSeed["ctaBand"]["heading"]> = {
  root: {
    type: "root",
    version: 1,
    direction: "ltr",
    format: "",
    indent: 0,
    children: [
      {
        type: "paragraph",
        version: 1,
        direction: "ltr",
        format: "",
        indent: 0,
        textFormat: 0,
        textStyle: "",
        children: [
          text("Let's Find the Right Solution "),
          text("Together", ITALIC),
        ],
      },
    ],
  },
};

export function layoutSeed(tenant: TenantSlug): LayoutSeed {
  const contactUs = internal("Contact Us", "/contact-us");

  return {
    header: {
      navItems: [
        dropdown("Product & Solutions", [
          internal("Our Products", "/products-and-solutions/products"),
          internal("Our Solutions", "/products-and-solutions/solutions"),
        ]),
        dropdown("About Us", [
          internal("Overview", "/about-us/overview"),
          internal("Our Journey", "/about-us/our-journey"),
          internal(
            "Awards & Certifications",
            "/about-us/awards-and-certifications",
          ),
          internal("Management System", "/about-us/management-system"),
        ]),
        linkItem(internal("Investor", "/investor-relations")),
        dropdown("Sustainability", [
          internal(
            "Environmental, Social, and Governance (ESG)",
            "/sustainability/esg",
          ),
          internal(
            "Corporate Social Responsibility (CSR)",
            "/sustainability/csr",
          ),
          internal(
            "Health, Safety, and Environment (HSE)",
            "/sustainability/hse",
          ),
        ]),
        linkItem(internal("Publication", "/publication")),
        linkItem(internal("Career", "/career")),
        linkItem(betteringYourWorld(tenant)),
      ],
      showSearch: false,
      showLanguageSwitcher: true,
      cta: { enabled: true, link: contactUs },
    },
    footer: {
      ctaBand: {
        eyebrow: "Contact Us",
        heading: CTA_HEADING,
        primaryButton: contactUs,
        secondaryButton: internal(
          "Explore Our Products",
          "/products-and-solutions/products",
        ),
      },
      linkColumns: [
        {
          title: "Company",
          links: [
            internal(
              "Products & Solutions",
              "/products-and-solutions/products",
            ),
            internal("About Us", "/about-us/overview"),
            internal("Contact US", "/contact-us"),
            internal("Career", "/career"),
          ].map((link) => ({ link })),
        },
        {
          title: "Sustainability",
          links: [
            internal("News & Event", "/publication"),
            internal("ESG, CSR, and HSE", "/sustainability/esg"),
            betteringYourWorld(tenant),
          ].map((link) => ({ link })),
        },
        {
          title: "Other",
          links: [
            internal("Terms & Conditions", "/terms-and-conditions"),
            internal("Privacy Policy", "/privacy-policy"),
          ].map((link) => ({ link })),
        },
      ],
      partOf: { enabled: false, label: "Part of" },
      copyright: "Copyright © {year} {legalName}. All Right Reserved",
    },
  };
}

export const LAYOUT_GLOBALS: LayoutGlobal[] = ["header", "footer"];

export type LayoutOutcome = "created" | "skipped";

export type SeedLayoutResult = {
  outcomes: Partial<Record<TenantSlug, Record<LayoutGlobal, LayoutOutcome>>>;
  missingTenants: TenantSlug[];
};

export async function seedLayout(payload: Payload): Promise<SeedLayoutResult> {
  const { docs: tenants } = await payload.find({
    collection: "tenants",
    where: { slug: { in: [...TENANT_SLUGS] } },
    pagination: false,
    depth: 0,
  });

  const result: SeedLayoutResult = { outcomes: {}, missingTenants: [] };

  for (const slug of TENANT_SLUGS) {
    const tenant = tenants.find((doc) => doc.slug === slug);
    if (!tenant) {
      result.missingTenants.push(slug);
      continue;
    }

    const seed = layoutSeed(slug);
    const outcomes = {} as Record<LayoutGlobal, LayoutOutcome>;

    for (const collection of LAYOUT_GLOBALS) {
      const { totalDocs } = await payload.count({
        collection,
        where: { tenant: { equals: tenant.id } },
      });
      if (totalDocs > 0) {
        outcomes[collection] = "skipped";
        continue;
      }

      const created = await payload.create({
        collection,
        locale: "en",
        depth: 0,
        data: { ...seed[collection], tenant: tenant.id },
      });
      const content = Object.fromEntries(
        Object.keys(seed[collection]).map((field) => [
          field,
          created[field as keyof typeof created],
        ]),
      );
      await payload.update({
        collection,
        id: created.id,
        locale: "id",
        depth: 0,
        data: content,
      });
      outcomes[collection] = "created";
    }

    result.outcomes[slug] = outcomes;
  }

  return result;
}
