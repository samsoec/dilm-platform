import {
  MAX_SHOWCASE_ITEMS,
  SOLUTION_CARD_STYLES,
  type SolutionCardStyle,
} from "@dilm/shared-types";

import {
  ctaCardField,
  pickerScope,
  validateManyPicks,
} from "../fields/recordPicks";
import { bottomCtaField } from "./ctaBanner";
import {
  appearanceField,
  buttonsField,
  headingField,
  recordPickerFields,
} from "./factories";
import { sectionBlock } from "./sectionBlock";

export const SOLUTION_CARD_STYLE_LABELS: Record<SolutionCardStyle, string> = {
  imageCard: "Photo, industry, title, description and product tags",
  textCard: "Same as above, without the photo",
  imageTitle: "Photo with the title",
};

export const solutionShowcase = sectionBlock({
  slug: "solutionShowcase",
  interfaceName: "SolutionShowcaseBlock",
  group: "Records",
  tableName: "ss",
  catalog: {
    name: "Solution showcase",
    purpose:
      "A grid of solution cards, hand-picked or every published solution, with an optional last card and bottom bar.",
    figma: ["section/bridging-solution", "section/solutions-industries"],
    summary: "The heading's title, with the source and card count",
  },
  fields: [
    headingField({ align: "center" }),
    buttonsField({ tableName: "btn" }),
    ...recordPickerFields({
      collection: "solutions",
      sources: ["manual", "all"],
      minItems: 1,
      maxItems: MAX_SHOWCASE_ITEMS,
      filterOptions: pickerScope,
      validate: validateManyPicks,
    }),
    {
      name: "cardStyle",
      type: "select",
      required: true,
      defaultValue: "imageCard",
      options: SOLUTION_CARD_STYLES.map((value) => ({
        value,
        label: SOLUTION_CARD_STYLE_LABELS[value],
      })),
    },
    ctaCardField(),
    bottomCtaField(),
    appearanceField(),
  ],
});
