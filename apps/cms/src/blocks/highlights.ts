import type { GroupField } from "payload";
import { MAX_HIGHLIGHTS } from "@dilm/shared-types";

import { withSameAsEnTag } from "../fields/layoutEditor";
import { pickerScope, validateManyPicks } from "../fields/recordPicks";
import { unscopedRelationship } from "../tenancy";
import { LIMIT_REACHED_NOTE } from "../admin/components/publication/publication";
import { RECORD_PICKS_FIELD } from "./factories";

export function highlightsField(description: string): GroupField {
  return {
    name: "highlights",
    label: "Highlighted Updates",
    type: "group",
    admin: { description },
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
          components: {
            Field: {
              path: RECORD_PICKS_FIELD,
              clientProps: {
                addLabel: "Add post",
                limitNote: LIMIT_REACHED_NOTE,
                showCount: true,
              },
            },
          },
          description: `Up to ${MAX_HIGHLIGHTS} published posts of this company.`,
        },
      }),
    ],
  };
}
