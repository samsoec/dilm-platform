import {
  TENANT_NAMES,
  TENANT_SLUGS,
  type TenantSlug,
} from "@dilm/shared-types";
import type { CollectionSlug, Payload, Where } from "payload";
import sharp from "sharp";

import {
  awardsLayout,
  careerLayout,
  CATEGORY_SEED,
  categoryTemplate,
  contactLayout,
  homeLayout,
  investorLayout,
  jobTemplate,
  journeyLayout,
  legalLayout,
  LEGAL_TITLES,
  managementLayout,
  overviewLayout,
  postTemplate,
  productsLayout,
  productTemplate,
  publicationLayout,
  siteMessages,
  solutionsLayout,
  solutionTemplate,
  sustainabilityLayout,
  type CategorySlug,
  type LegalPage,
  type SeedContext,
} from "./pageContent";

export const placeholderFilename = (slug: TenantSlug) =>
  `seed-placeholder-${slug}.png`;

export type SeedOutcome = "created" | "skipped";

export type SeedPagesResult = {
  outcomes: Record<string, SeedOutcome>;
  missingTenants: TenantSlug[];
};

type Ref = number;

type Doc = { id: Ref } & Record<string, unknown>;

type PageDefinition = {
  slug: string;
  title: string;
  parent?: Ref;
  layout?: unknown[];
  publish?: boolean;
};

type Outcomes = Record<string, SeedOutcome>;

const EN = "en";

const ID = "id";

async function placeholderImage(
  payload: Payload,
  tenant: Ref,
  outcomes: Outcomes,
  slug: TenantSlug,
): Promise<Ref> {
  const label = slug;
  const filename = placeholderFilename(slug);
  const { docs } = await payload.find({
    collection: "media",
    where: {
      and: [{ filename: { equals: filename } }, { tenant: { equals: tenant } }],
    },
    limit: 1,
    depth: 0,
    pagination: false,
  });
  if (docs[0]) {
    outcomes[`media:${label}`] = "skipped";
    return docs[0].id;
  }
  const data = await sharp({
    create: {
      width: 1600,
      height: 900,
      channels: 3,
      background: { r: 217, g: 221, b: 227 },
    },
  })
    .png()
    .toBuffer();
  const created = await payload.create({
    collection: "media",
    depth: 0,
    data: { alt: "Placeholder image, replace before launch", tenant },
    file: {
      data,
      mimetype: "image/png",
      name: filename,
      size: data.length,
    },
  });
  outcomes[`media:${label}`] = "created";
  return created.id;
}

async function ensureCategories(
  payload: Payload,
  outcomes: Outcomes,
): Promise<Record<CategorySlug, number>> {
  const ids = {} as Record<CategorySlug, number>;
  for (const { slug, name } of CATEGORY_SEED) {
    const {
      docs: [existing],
    } = await payload.find({
      collection: "categories",
      where: { slug: { equals: slug } },
      locale: EN,
      fallbackLocale: false,
      limit: 1,
      depth: 0,
    });
    if (existing) {
      ids[slug] = existing.id;
      outcomes[`categories:${slug}`] = "skipped";
      continue;
    }
    const created = await payload.create({
      collection: "categories",
      locale: EN,
      depth: 0,
      data: { name, slug },
    });
    await payload.update({
      collection: "categories",
      id: created.id,
      locale: ID,
      depth: 0,
      data: { name, slug },
    });
    ids[slug] = created.id;
    outcomes[`categories:${slug}`] = "created";
  }
  return ids;
}

async function findPage(
  payload: Payload,
  collection: "pages" | "shared-pages",
  path: string,
  tenant?: Ref,
): Promise<Doc | undefined> {
  const where: Where = tenant
    ? { and: [{ path: { equals: path } }, { tenant: { equals: tenant } }] }
    : { path: { equals: path } };
  const {
    docs: [found],
  } = await payload.find({
    collection,
    where,
    locale: EN,
    fallbackLocale: false,
    limit: 1,
    depth: 0,
    trash: true,
  });
  return found as unknown as Doc | undefined;
}

async function publishDraft(
  payload: Payload,
  collection: CollectionSlug,
  id: Ref,
): Promise<void> {
  await payload.update({
    collection,
    id,
    locale: EN,
    depth: 0,
    draft: false,
    data: { _status: "published" } as never,
  });
}

async function createPage(
  payload: Payload,
  collection: "pages" | "shared-pages",
  tenant: Ref | undefined,
  definition: PageDefinition,
  redirectTo?: { collection: string; id: Ref },
): Promise<Doc> {
  const publish = definition.publish !== false;
  const data = {
    title: definition.title,
    slug: definition.slug || undefined,
    parent: definition.parent,
    ...(tenant ? { tenant } : {}),
    ...(definition.layout ? { layout: definition.layout } : {}),
    ...(redirectTo
      ? {
          redirectTo: {
            type: "reference",
            newTab: false,
            reference: {
              relationTo: redirectTo.collection,
              value: redirectTo.id,
            },
          },
        }
      : {}),
  };
  const created = (await payload.create({
    collection,
    locale: EN,
    depth: 0,
    draft: true,
    data: data as never,
  })) as unknown as Doc;
  await payload.update({
    collection,
    id: created.id,
    locale: ID,
    depth: 0,
    draft: true,
    data: {
      title: created.title,
      slug: created.slug,
      layout: created.layout,
    } as never,
  });
  if (publish) await publishDraft(payload, collection, created.id);
  return created;
}

async function ensurePage(
  payload: Payload,
  collection: "pages" | "shared-pages",
  tenant: Ref | undefined,
  path: string,
  definition: PageDefinition,
  outcomes: Outcomes,
  label: string,
): Promise<Doc> {
  const existing = await findPage(payload, collection, path, tenant);
  if (existing) {
    outcomes[label] = "skipped";
    return existing;
  }
  const created = await createPage(payload, collection, tenant, definition);
  outcomes[label] = "created";
  return created;
}

async function completeContainer(
  payload: Payload,
  collection: "pages" | "shared-pages",
  container: Doc,
  target: Doc,
): Promise<void> {
  const redirect = container.redirectTo as { reference?: unknown } | undefined;
  const layout = container.layout as unknown[] | undefined;
  if (redirect?.reference || (layout && layout.length > 0)) return;
  for (const locale of [EN, ID] as const) {
    await payload.update({
      collection,
      id: container.id,
      locale,
      depth: 0,
      draft: false,
      data: {
        redirectTo: {
          type: "reference",
          newTab: false,
          reference: { relationTo: collection, value: target.id },
        },
        _status: "published",
      } as never,
    });
  }
}

async function ensureSharedPages(
  payload: Payload,
  ctx: SeedContext,
  outcomes: Outcomes,
): Promise<{ products: Doc; solutions: Doc }> {
  await ensurePage(
    payload,
    "shared-pages",
    undefined,
    "/",
    { slug: "", title: "Home", layout: homeLayout(ctx), publish: false },
    outcomes,
    "shared-pages:/",
  );
  const container = await ensurePage(
    payload,
    "shared-pages",
    undefined,
    "/products-and-solutions",
    { slug: "products-and-solutions", title: "Products & Solutions" },
    outcomes,
    "shared-pages:/products-and-solutions",
  );
  const products = await ensurePage(
    payload,
    "shared-pages",
    undefined,
    "/products-and-solutions/products",
    {
      slug: "products",
      title: "Our Products",
      parent: container.id,
      layout: productsLayout(ctx),
    },
    outcomes,
    "shared-pages:/products-and-solutions/products",
  );
  const solutions = await ensurePage(
    payload,
    "shared-pages",
    undefined,
    "/products-and-solutions/solutions",
    {
      slug: "solutions",
      title: "Our Solutions",
      parent: container.id,
      layout: solutionsLayout(ctx),
    },
    outcomes,
    "shared-pages:/products-and-solutions/solutions",
  );
  await completeContainer(payload, "shared-pages", container, products);
  return { products, solutions };
}

async function ensureSiteRouting(
  payload: Payload,
  shared: { products: Doc; solutions: Doc },
  outcomes: Outcomes,
): Promise<void> {
  const routing = (await payload.findGlobal({
    slug: "site-routing",
    depth: 0,
  })) as { productsPage?: unknown; solutionsPage?: unknown };
  const data = {
    ...(routing.productsPage ? {} : { productsPage: shared.products.id }),
    ...(routing.solutionsPage ? {} : { solutionsPage: shared.solutions.id }),
  };
  if (Object.keys(data).length === 0) {
    outcomes["site-routing"] = "skipped";
    return;
  }
  await payload.updateGlobal({ slug: "site-routing", depth: 0, data });
  outcomes["site-routing"] = "created";
}

type TenantPages = { career: Doc; publication: Doc; cookie: Doc };

async function ensureTenantPages(
  payload: Payload,
  ctx: SeedContext,
  slug: TenantSlug,
  outcomes: Outcomes,
): Promise<TenantPages> {
  const tenant = ctx.tenants[slug];
  const make = (path: string, definition: PageDefinition): Promise<Doc> =>
    ensurePage(
      payload,
      "pages",
      tenant,
      path,
      definition,
      outcomes,
      `pages:${slug}:${path}`,
    );

  const about = await make("/about-us", {
    slug: "about-us",
    title: "About Us",
  });
  const overview = await make("/about-us/overview", {
    slug: "overview",
    title: "Overview",
    parent: about.id,
    layout: overviewLayout(ctx),
  });
  await make("/about-us/our-journey", {
    slug: "our-journey",
    title: "Our Journey",
    parent: about.id,
    layout: journeyLayout(ctx),
  });
  await make("/about-us/awards-and-certifications", {
    slug: "awards-and-certifications",
    title: "Awards & Certifications",
    parent: about.id,
    layout: awardsLayout(ctx),
  });
  await make("/about-us/management-system", {
    slug: "management-system",
    title: "Management System",
    parent: about.id,
    layout: managementLayout(ctx),
  });
  await completeContainer(payload, "pages", about, overview);

  await make("/sustainability", {
    slug: "sustainability",
    title: "Sustainability",
    layout: sustainabilityLayout(ctx),
  });
  await make("/investor-relations", {
    slug: "investor-relations",
    title: "Investor",
    layout: investorLayout(ctx),
  });
  const career = await make("/career", {
    slug: "career",
    title: "Career",
    layout: careerLayout(ctx),
  });
  await make("/contact-us", {
    slug: "contact-us",
    title: "Contact Us",
    layout: contactLayout(ctx),
  });
  const publication = await make("/publication", {
    slug: "publication",
    title: "Publication",
    layout: publicationLayout(ctx),
  });
  const legal: [LegalPage, string][] = [
    ["terms", "terms-and-conditions"],
    ["privacy", "privacy-policy"],
    ["cookie", "cookie-policy"],
  ];
  const docs = {} as Record<LegalPage, Doc>;
  for (const [kind, pageSlug] of legal) {
    docs[kind] = await make(`/${pageSlug}`, {
      slug: pageSlug,
      title: LEGAL_TITLES[kind],
      layout: legalLayout(ctx, kind),
      publish: kind !== "privacy",
    });
  }
  return { career, publication, cookie: docs.cookie };
}

async function ensureTenantSettings(
  payload: Payload,
  slug: TenantSlug,
  tenant: Ref,
  pages: TenantPages,
  outcomes: Outcomes,
): Promise<void> {
  const label = `tenant-settings:${slug}`;
  const {
    docs: [existing],
  } = await payload.find({
    collection: "tenant-settings",
    where: { tenant: { equals: tenant } },
    limit: 1,
    depth: 0,
  });
  const routing = {
    careerPage: pages.career.id,
    publicationPage: pages.publication.id,
  };
  if (!existing) {
    const created = await payload.create({
      collection: "tenant-settings",
      locale: EN,
      depth: 0,
      data: { tenant, siteName: TENANT_NAMES[slug], routing } as never,
    });
    await payload.update({
      collection: "tenant-settings",
      id: created.id,
      locale: ID,
      depth: 0,
      data: { siteName: created.siteName } as never,
    });
    outcomes[label] = "created";
    return;
  }
  const current = (existing as { routing?: Record<string, unknown> | null })
    .routing;
  const missing = {
    ...(current?.careerPage ? {} : { careerPage: routing.careerPage }),
    ...(current?.publicationPage
      ? {}
      : { publicationPage: routing.publicationPage }),
  };
  if (Object.keys(missing).length === 0) {
    outcomes[label] = "skipped";
    return;
  }
  await payload.update({
    collection: "tenant-settings",
    id: existing.id,
    depth: 0,
    data: { routing: missing } as never,
  });
  outcomes[label] = "created";
}

async function ensureSiteMessages(
  payload: Payload,
  slug: TenantSlug,
  tenant: Ref,
  cookie: Doc,
  outcomes: Outcomes,
): Promise<void> {
  const label = `site-messages:${slug}`;
  const { totalDocs } = await payload.count({
    collection: "site-messages",
    where: { tenant: { equals: tenant } },
  });
  if (totalDocs > 0) {
    outcomes[label] = "skipped";
    return;
  }
  const content = siteMessages(cookie.id as number);
  const created = await payload.create({
    collection: "site-messages",
    locale: EN,
    depth: 0,
    data: { ...content, tenant } as never,
  });
  await payload.update({
    collection: "site-messages",
    id: created.id,
    locale: ID,
    depth: 0,
    data: {
      notFound: created.notFound,
      cookieBanner: created.cookieBanner,
    } as never,
  });
  outcomes[label] = "created";
}

async function ensureTemplate(
  payload: Payload,
  collection: "shared-detail-templates" | "detail-templates",
  tenant: Ref | undefined,
  recordType: string,
  layout: unknown[],
  outcomes: Outcomes,
  label: string,
): Promise<void> {
  const where = tenant
    ? {
        and: [
          { recordType: { equals: recordType } },
          { tenant: { equals: tenant } },
        ],
      }
    : { recordType: { equals: recordType } };
  const { totalDocs } = await payload.count({
    collection: collection as CollectionSlug,
    where: where as never,
  });
  if (totalDocs > 0) {
    outcomes[label] = "skipped";
    return;
  }
  const created = (await payload.create({
    collection: collection as CollectionSlug,
    locale: EN,
    depth: 0,
    draft: true,
    data: { recordType, layout, ...(tenant ? { tenant } : {}) } as never,
  })) as unknown as Doc;
  await payload.update({
    collection: collection as CollectionSlug,
    id: created.id,
    locale: ID,
    depth: 0,
    draft: true,
    data: { layout: created.layout } as never,
  });
  await publishDraft(payload, collection as CollectionSlug, created.id);
  outcomes[label] = "created";
}

export async function seedPages(payload: Payload): Promise<SeedPagesResult> {
  const { docs: tenantDocs } = await payload.find({
    collection: "tenants",
    where: { slug: { in: [...TENANT_SLUGS] } },
    pagination: false,
    depth: 0,
  });
  const outcomes: Outcomes = {};
  const missingTenants = TENANT_SLUGS.filter(
    (slug) => !tenantDocs.some((doc) => doc.slug === slug),
  );
  if (missingTenants.length > 0) return { outcomes, missingTenants };

  const tenants = Object.fromEntries(
    TENANT_SLUGS.map((slug) => [
      slug,
      tenantDocs.find((doc) => doc.slug === slug)!.id,
    ]),
  ) as Record<TenantSlug, number>;

  const categories = await ensureCategories(payload, outcomes);

  const images = {} as Record<TenantSlug, number>;
  for (const slug of TENANT_SLUGS) {
    images[slug] = (await placeholderImage(
      payload,
      tenants[slug],
      outcomes,
      slug,
    )) as number;
  }

  const base = { tenants, categories };
  const sharedCtx: SeedContext = { ...base, image: images[TENANT_SLUGS[0]] };

  const shared = await ensureSharedPages(payload, sharedCtx, outcomes);
  await ensureSiteRouting(payload, shared, outcomes);
  await ensureTemplate(
    payload,
    "shared-detail-templates",
    undefined,
    "product",
    productTemplate(sharedCtx),
    outcomes,
    "shared-detail-templates:product",
  );
  await ensureTemplate(
    payload,
    "shared-detail-templates",
    undefined,
    "solution",
    solutionTemplate(sharedCtx),
    outcomes,
    "shared-detail-templates:solution",
  );

  for (const slug of TENANT_SLUGS) {
    const ctx: SeedContext = { ...base, image: images[slug], tenant: slug };
    const pages = await ensureTenantPages(payload, ctx, slug, outcomes);
    await ensureTenantSettings(payload, slug, tenants[slug], pages, outcomes);
    await ensureSiteMessages(
      payload,
      slug,
      tenants[slug],
      pages.cookie,
      outcomes,
    );
    const templates: [string, unknown[]][] = [
      ["job", jobTemplate()],
      ["post", postTemplate()],
      ["category", categoryTemplate(ctx)],
    ];
    for (const [recordType, layout] of templates) {
      await ensureTemplate(
        payload,
        "detail-templates",
        tenants[slug],
        recordType,
        layout,
        outcomes,
        `detail-templates:${slug}:${recordType}`,
      );
    }
  }

  return { outcomes, missingTenants: [] };
}
