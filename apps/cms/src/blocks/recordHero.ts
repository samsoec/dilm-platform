import { HERO_ATTRIBUTE_KEYS, type HeroRecordType } from "@dilm/shared-types";
import type { Field } from "payload";

import { withSameAsEnTag } from "../fields/layoutEditor";
import { sectionBlock } from "./sectionBlock";

export const HERO_ATTRIBUTE_LABELS: Record<
  (typeof HERO_ATTRIBUTE_KEYS)[number],
  string
> = {
  formula: "Chemical formula",
  casNumber: "CAS number",
  totalVariants: "Total variants",
  classification: "Classification",
  keyApplications: "Key applications",
  supportingProducts: "Supporting products",
  industriesServed: "Industries served",
  department: "Department",
  experience: "Experience",
  jobType: "Job type",
  location: "Location",
  postedDate: "Posted date",
  category: "Category",
  publishedDate: "Published date",
};

export const HERO_ATTRIBUTE_OWNERS: Record<
  (typeof HERO_ATTRIBUTE_KEYS)[number],
  HeroRecordType
> = {
  formula: "product",
  casNumber: "product",
  totalVariants: "product",
  classification: "product",
  keyApplications: "solution",
  supportingProducts: "solution",
  industriesServed: "solution",
  department: "job",
  experience: "job",
  jobType: "job",
  location: "job",
  postedDate: "job",
  category: "post",
  publishedDate: "post",
};

const metaLabelFields: Field[] = HERO_ATTRIBUTE_KEYS.map((key) =>
  withSameAsEnTag({
    name: key,
    label: `${HERO_ATTRIBUTE_LABELS[key]} (${HERO_ATTRIBUTE_OWNERS[key]} pages)`,
    type: "text",
    localized: true,
  }),
);

export const recordHero = sectionBlock({
  slug: "recordHero",
  interfaceName: "RecordHeroBlock",
  group: "Template",
  tableName: "rhero",
  recordTypes: ["product", "solution", "job", "post"],
  catalog: {
    name: "Record hero",
    purpose:
      "The top of a product, solution, job or post page: breadcrumb, title, subtitle and a row of facts, all read from the record. You set only the labels.",
    figma: [
      "section/hero-products",
      "section/hero-detail-solution",
      "section/hero-detail-career",
      "section/hero-detail-article",
    ],
    summary: "The breadcrumb's last label",
  },
  fields: [
    withSameAsEnTag({
      name: "currentLabel",
      label: "Last breadcrumb",
      type: "text",
      localized: true,
      admin: {
        description:
          "The last crumb, for example Detail Product. The first crumb is the record's list page; on posts it is the Publication page.",
      },
    }),
    {
      name: "metaLabels",
      label: "Fact labels",
      type: "group",
      admin: {
        description:
          "One label for each fact in the row. Each record type shows its own facts; the facts themselves come from the record.",
      },
      fields: metaLabelFields,
    },
  ],
});
