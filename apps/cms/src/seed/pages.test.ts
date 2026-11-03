import {
  MAX_LAYOUT_BLOCKS,
  TENANT_SLUGS,
  tokenProblem,
  type TenantSlug,
} from "@dilm/shared-types";
import { describe, expect, it } from "vitest";

import { isPlainOrItalic } from "../admin/footerSections";
import { isConsentEmpty } from "../blocks/consentForm";
import { pageBlocks } from "../blocks";
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
  type SeedContext,
} from "./pageContent";
import { linkedPageIds } from "../siteMessages";

const ctx = (tenant?: TenantSlug): SeedContext => ({
  image: 1,
  tenants: { indoacid: 1, duniakimia: 2, likutelaga: 3 },
  categories: {
    "company-news": 10,
    "events-and-activities": 11,
    sustainability: 12,
  },
  tenant,
});

const types = (blocks: { blockType: string }[]) =>
  blocks.map(({ blockType }) => blockType);

const registered = new Set(pageBlocks.map(({ slug }) => slug));

describe("seeded layouts follow the Figma section order", () => {
  it("Home", () => {
    expect(types(homeLayout(ctx()))).toEqual([
      "heroCarousel",
      "mediaText",
      "entityMap",
      "productsSolutionsTabs",
      "certifications",
      "imageCarousel",
      "groupShowcase",
      "postShowcase",
      "mediaText",
      "postShowcase",
    ]);
  });

  it("Our Products and Our Solutions", () => {
    expect(types(productsLayout(ctx()))).toEqual([
      "pageHero",
      "productShowcase",
      "productShowcase",
      "certifications",
      "solutionShowcase",
    ]);
    expect(types(solutionsLayout(ctx()))).toEqual([
      "pageHero",
      "featureGrid",
      "solutionShowcase",
      "productShowcase",
    ]);
  });

  it("the company pages", () => {
    const c = ctx("duniakimia");
    expect(types(overviewLayout(c))).toEqual([
      "pageHero",
      "mediaText",
      "featureGrid",
      "visionMission",
      "timeline",
      "certifications",
      "groupShowcase",
    ]);
    expect(types(journeyLayout(c))).toEqual(["pageHero", "timeline"]);
    expect(types(awardsLayout(c))).toEqual([
      "pageHero",
      "certifications",
      "certificateGallery",
      "awards",
    ]);
    expect(types(managementLayout(c))).toEqual([
      "pageHero",
      "featureGrid",
      "featureGrid",
      "featureGrid",
      "featureGrid",
    ]);
    expect(types(sustainabilityLayout(c))).toEqual([
      "pageHero",
      "mediaText",
      "postShowcase",
      "postShowcase",
      "hotspotIllustration",
      "mediaText",
    ]);
    expect(types(investorLayout(c))).toEqual(["pageHero", "irDocuments"]);
    expect(types(careerLayout(c))).toEqual([
      "pageHero",
      "featureGrid",
      "jobListing",
    ]);
    expect(types(contactLayout(c))).toEqual([
      "pageHero",
      "contactInquiry",
      "locationMap",
      "entityContacts",
    ]);
  });

  it("Publication is the publication hero and the all-posts listing", () => {
    const layout = publicationLayout(ctx("indoacid"));
    expect(types(layout)).toEqual(["publicationHero", "postListing"]);
    expect(layout[1]).toMatchObject({ source: "all" });
    expect(layout[0]).toMatchObject({ categories: [10, 11, 12] });
  });

  it("the legal pages share the Terms structure", () => {
    for (const kind of ["terms", "privacy", "cookie"] as const) {
      const layout = legalLayout(ctx("likutelaga"), kind);
      expect(types(layout)).toEqual(["articleHeader", "richText"]);
      expect(layout[1]).toMatchObject({
        showTableOfContents: true,
        tocTitle: "On This Page",
      });
    }
  });

  it("every layout block is a registered page block and fits the cap", () => {
    const c = ctx("duniakimia");
    const layouts = [
      homeLayout(c),
      productsLayout(c),
      solutionsLayout(c),
      overviewLayout(c),
      journeyLayout(c),
      awardsLayout(c),
      managementLayout(c),
      sustainabilityLayout(c),
      investorLayout(c),
      careerLayout(c),
      contactLayout(c),
      publicationLayout(c),
      legalLayout(c, "terms"),
    ];
    for (const layout of layouts) {
      expect(layout.length).toBeLessThanOrEqual(MAX_LAYOUT_BLOCKS);
      for (const { blockType } of layout) {
        expect(registered.has(blockType)).toBe(true);
      }
    }
  });
});

describe("seeded templates follow FR-PM-47", () => {
  it("product, solution, job, post and category", () => {
    const c = ctx("indoacid");
    expect(types(productTemplate(c))).toEqual([
      "recordHero",
      "productOverview",
      "productSpecifications",
      "productApplications",
      "entityMap",
      "testimonials",
    ]);
    expect(types(solutionTemplate(c))).toEqual([
      "recordHero",
      "solutionImpact",
      "solutionApplications",
      "entityMap",
      "testimonials",
    ]);
    expect(types(jobTemplate())).toEqual([
      "recordHero",
      "jobDetail",
      "jobShowcase",
    ]);
    expect(types(postTemplate())).toEqual(["recordHero", "postArticle"]);
    const category = categoryTemplate(c);
    expect(types(category)).toEqual(["publicationHero", "postListing"]);
    expect(category[1]).toMatchObject({ source: "currentCategory" });
  });
});

describe("seeded text rules", () => {
  it("keeps the {title} token to templates", () => {
    const c = ctx("duniakimia");
    const pages = [
      homeLayout(c),
      productsLayout(c),
      solutionsLayout(c),
      overviewLayout(c),
      sustainabilityLayout(c),
      publicationLayout(c),
      legalLayout(c, "terms"),
    ];
    for (const layout of pages) {
      expect(tokenProblem(layout, false)).toBeUndefined();
    }
    const templates = [productTemplate(c), solutionTemplate(c), jobTemplate()];
    for (const layout of templates) {
      expect(tokenProblem(layout, true)).toBeUndefined();
    }
    expect(JSON.stringify(productTemplate(c))).toContain("{title}");
  });

  it("writes headings the heading editor accepts", () => {
    const hero = homeLayout(ctx())[0] as unknown as {
      slides: { title: { root: Parameters<typeof isPlainOrItalic>[0] } }[];
    };
    expect(isPlainOrItalic(hero.slides[0]!.title.root)).toBe(true);
  });

  it("gives every consent form its consent text", () => {
    const contact = contactLayout(ctx("duniakimia"))[1] as unknown as {
      form: { consentText: unknown };
    };
    const job = jobTemplate()[1] as unknown as {
      form: { consentText: unknown };
    };
    expect(isConsentEmpty(contact.form.consentText)).toBe(false);
    expect(isConsentEmpty(job.form.consentText)).toBe(false);
  });

  it("states the company's own name and contacts in its Terms", () => {
    const body = (tenant: TenantSlug) =>
      JSON.stringify(legalLayout(ctx(tenant), "terms"));
    expect(body("duniakimia")).toContain("PT Dunia Kimia Utama");
    expect(body("duniakimia")).toContain("product-area.dku@dilmgroup.com");
    expect(body("indoacid")).toContain("PT Indonesian Acids Industry");
    expect(body("indoacid")).toContain("product-area.iai@dilmgroup.com");
    expect(body("likutelaga")).not.toContain("Dunia Kimia");
  });

  it("links the cookie banner to the given Cookie Policy page", () => {
    const { cookieBanner, notFound } = siteMessages(77);
    expect(linkedPageIds(cookieBanner.body)).toEqual(["77"]);
    expect(notFound.code).toBe("404");
    expect(notFound.buttons).toHaveLength(1);
  });

  it("seeds the three categories", () => {
    expect(CATEGORY_SEED.map(({ name }) => name)).toEqual([
      "Company News",
      "Events & Activities",
      "Sustainability",
    ]);
    expect(TENANT_SLUGS).toHaveLength(3);
  });
});
