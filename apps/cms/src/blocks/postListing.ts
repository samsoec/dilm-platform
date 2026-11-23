import type {
  FieldHook,
  RelationshipFieldManyValidation,
  TextFieldSingleValidation,
} from "payload";
import { relationship } from "payload/shared";
import {
  CURRENT_CATEGORY_WARNING,
  DEFAULT_POST_PAGE_SIZE,
  EMPTY_TITLE_TOKENS,
  MAX_POST_PAGE_SIZE,
  POST_LISTING_SOURCES,
  POST_LISTING_SOURCE_LABELS,
  RESULTS_LABEL_TOKENS,
  scopedTokenProblem,
  unknownEmptyTitleTokenMessage,
  unknownResultsTokenMessage,
} from "@dilm/shared-types";

import {
  SOURCE_HINT,
  FEATURED_FALLBACK_NOTE,
} from "../admin/components/publication/publication";
import { withSameAsEnTag } from "../fields/layoutEditor";
import { buttonStyleField } from "../fields/buttonStyle";
import { link } from "../fields/link";
import { pickerScope, validateOnePick } from "../fields/recordPicks";
import { unscopedRelationship } from "../tenancy";
import { SOURCE_FIELD_COMPONENT, whenBlock } from "./factories";
import { highlightsField } from "./highlights";
import { sectionBlock } from "./sectionBlock";

type ListingData = { source?: string | null };

const sourceOf = (data: unknown) =>
  (data as ListingData | undefined)?.source ?? "all";

const clearUnlessCategories: FieldHook = ({ value, siblingData }) =>
  sourceOf(siblingData) === "categories" ? value : null;

export const CATEGORIES_REQUIRED = "Choose at least one category.";

export const validateListingCategories: RelationshipFieldManyValidation =
  async (value, args) => {
    const wanted = sourceOf(args.siblingData) === "categories";
    const structural = await relationship(
      value as never,
      {
        ...args,
        required: false,
      } as never,
    );
    if (structural !== true) return structural;
    const empty = !Array.isArray(value) || value.length === 0;
    return wanted && empty ? CATEGORIES_REQUIRED : true;
  };

const tokenValidator =
  (
    allowed: readonly string[],
    message: (name: string) => string,
  ): TextFieldSingleValidation =>
  (value) =>
    scopedTokenProblem(value, { allowed, message }) ?? true;

export const validateResultsLabel = tokenValidator(
  RESULTS_LABEL_TOKENS,
  unknownResultsTokenMessage,
);

export const validateEmptyTitle = tokenValidator(
  EMPTY_TITLE_TOKENS,
  unknownEmptyTitleTokenMessage,
);

const FEATURED_NEWEST =
  "/admin/components/publication/FeaturedNewest#FeaturedNewest";

const TOKEN_CHIPS = "/admin/components/publication/TokenChips#TokenChips";

export const postListing = sectionBlock({
  slug: "postListing",
  interfaceName: "PostListingBlock",
  group: "Records",
  tableName: "pl",
  catalog: {
    name: "Post listing",
    purpose:
      "A featured story, the list of posts with page buttons, a results line when someone searches, a no-results message and a side list of highlighted posts.",
    figma: ["section/our-commitment"],
    summary: "The source, with the page size",
  },
  fields: [
    {
      name: "source",
      label: "Which posts",
      type: "select",
      required: true,
      defaultValue: "all",
      options: POST_LISTING_SOURCES.map((value) => ({
        value,
        label: POST_LISTING_SOURCE_LABELS[value],
      })),
      admin: {
        components: {
          Field: {
            path: SOURCE_FIELD_COMPONENT,
            clientProps: {
              order: ["all", "categories", "currentCategory"],
              hint: SOURCE_HINT,
            },
          },
        },
        description: `Which posts the list is drawn from. ${CURRENT_CATEGORY_WARNING} Anywhere else it shows nothing; it does not stop you saving or publishing.`,
      },
    },
    {
      name: "categories",
      type: "relationship",
      relationTo: "categories",
      hasMany: true,
      maxDepth: 0,
      validate: validateListingCategories,
      hooks: { beforeChange: [clearUnlessCategories] },
      admin: { condition: whenBlock("source", "all", "categories") },
    },
    unscopedRelationship({
      name: "featured",
      label: "Featured story",
      type: "relationship",
      relationTo: "posts",
      maxDepth: 1,
      filterOptions: pickerScope,
      validate: validateOnePick,
      admin: {
        components: { afterInput: [FEATURED_NEWEST] },
        description: `${FEATURED_FALLBACK_NOTE} Hidden while searching.`,
      },
    }),
    {
      name: "pageSize",
      label: "Per page",
      type: "number",
      required: true,
      defaultValue: DEFAULT_POST_PAGE_SIZE,
      min: 1,
      max: MAX_POST_PAGE_SIZE,
      admin: { step: 1, description: "How many posts show per page." },
    },
    withSameAsEnTag({
      name: "resultsLabel",
      label: "Results line",
      type: "text",
      localized: true,
      validate: validateResultsLabel,
      admin: {
        components: { afterInput: [TOKEN_CHIPS] },
        description:
          '{count} = number of matching posts, {query} = what the visitor typed. Sample: Showing 12 results for "alum".',
      },
    }),
    {
      name: "emptyState",
      label: "No results",
      type: "group",
      fields: [
        withSameAsEnTag({
          name: "title",
          label: "Title",
          type: "text",
          localized: true,
          validate: validateEmptyTitle,
          admin: {
            components: { afterInput: [TOKEN_CHIPS] },
            description:
              "{query} = what the visitor typed. No other placeholder works here.",
          },
        }),
        withSameAsEnTag({
          name: "description",
          label: "Description",
          type: "textarea",
          localized: true,
        }),
        link({ name: "button" }),
        buttonStyleField({ name: "buttonStyle" }),
      ],
    },
    highlightsField(
      "An optional title and up to 5 hand-picked posts, shown as a numbered side list. It stays while a visitor searches.",
    ),
  ],
});
