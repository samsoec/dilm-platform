import { withSameAsEnTag } from "../fields/layoutEditor";
import { highlightsField } from "./highlights";
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
    highlightsField(
      "The same list shows on every post of the company. The post being read is left out of it.",
    ),
    withSameAsEnTag({ name: "previousLabel", type: "text", localized: true }),
    withSameAsEnTag({ name: "nextLabel", type: "text", localized: true }),
  ],
});
