import { MAX_HIGHLIGHTS } from "@dilm/shared-types";

import { withSameAsEnTag } from "../fields/layoutEditor";
import { pickerScope, validateManyPicks } from "../fields/recordPicks";
import { unscopedRelationship } from "../tenancy";
import { sectionBlock } from "./sectionBlock";

export const postArticle = sectionBlock({
  slug: "postArticle",
  interfaceName: "PostArticleBlock",
  group: "Template",
  tableName: "part",
  recordTypes: ["post"],
  catalog: {
    name: "Post article",
    purpose:
      "The post's cover and body, a side list of highlighted posts, and links to the posts before and after it. You set the side list and the labels.",
    figma: ["section/detail-article"],
    summary: "The highlights title",
  },
  fields: [
    {
      name: "highlights",
      type: "group",
      admin: {
        description:
          "The same list shows on every post of the company. The post being read is left out of it.",
      },
      fields: [
        withSameAsEnTag({ name: "title", type: "text", localized: true }),
        unscopedRelationship({
          name: "items",
          label: "Highlighted posts",
          type: "relationship",
          relationTo: "posts",
          hasMany: true,
          minRows: 0,
          maxRows: MAX_HIGHLIGHTS,
          maxDepth: 1,
          filterOptions: pickerScope,
          validate: validateManyPicks,
          admin: {
            description: `Up to ${MAX_HIGHLIGHTS} published posts of this company.`,
          },
        }),
      ],
    },
    withSameAsEnTag({ name: "previousLabel", type: "text", localized: true }),
    withSameAsEnTag({ name: "nextLabel", type: "text", localized: true }),
  ],
});
