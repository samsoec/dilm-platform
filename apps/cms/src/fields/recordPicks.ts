import type {
  FilterOptions,
  NamedGroupField,
  RelationshipFieldManyValidation,
  RelationshipFieldSingleValidation,
} from "payload";
import { relationship } from "payload/shared";

import { withSameAsEnTag } from "./layoutEditor";
import {
  idOf,
  link,
  referenceFilter,
  storedPick,
  type Ref,
  type ValidateContext,
} from "./link";

export const PICK_NOT_OFFERED =
  "One of the picked records can't be used here. Pick published records only; jobs and posts must belong to this page's company.";

export const ENTITY_NOT_OFFERED =
  "One of the picked companies can't be used here. Pick companies that have a website address.";

export const entityScope: FilterOptions = () => ({
  and: [{ domain: { exists: true } }, { domain: { not_equals: "" } }],
});

export const pickerScope: FilterOptions = ({ relationTo, data }) => {
  if (!relationTo) return true;
  const doc = data as { tenant?: Ref } | undefined;
  return referenceFilter(relationTo, doc?.tenant);
};

function keyOf(value: unknown, collection?: string): string | undefined {
  if (value && typeof value === "object" && "relationTo" in value) {
    const pick = value as { relationTo: string; value: Ref };
    const id = idOf(pick.value);
    return id ? `${pick.relationTo}:${id}` : undefined;
  }
  const id = idOf(value as Ref);
  return id && collection ? `${collection}:${id}` : undefined;
}

type PickArgs = Parameters<RelationshipFieldManyValidation>[1];

const picksValidator =
  (notOffered: string) =>
  async (value: unknown, args: PickArgs): Promise<string | true> => {
    const structural = await relationship(
      value as never,
      {
        ...args,
        filterOptions: undefined,
      } as never,
    );
    if (structural !== true) return structural;
    const picks = (Array.isArray(value) ? value : [value]).filter(
      (pick) => pick !== null && pick !== undefined,
    );
    if (picks.length === 0) return true;
    const collection =
      typeof args.relationTo === "string" ? args.relationTo : undefined;
    const stored = await storedPick(args as unknown as ValidateContext, {
      req: args.req,
      path: args.path,
    });
    const kept = new Set(
      (Array.isArray(stored) ? stored : [stored]).map((pick) =>
        keyOf(pick, collection),
      ),
    );
    const fresh = picks.filter((pick) => !kept.has(keyOf(pick, collection)));
    if (fresh.length === 0) return true;
    const checked = await relationship(
      (Array.isArray(value) ? fresh : fresh[0]) as never,
      {
        ...args,
        required: false,
        minRows: undefined,
        maxRows: undefined,
      } as never,
    );
    return checked === true ? true : notOffered;
  };

export const validatePicks = picksValidator(PICK_NOT_OFFERED);

const entityPicksValidator = picksValidator(ENTITY_NOT_OFFERED);

export const validateManyPicks =
  validatePicks as unknown as RelationshipFieldManyValidation;

export const validateOnePick =
  validatePicks as unknown as RelationshipFieldSingleValidation;

export function ctaCardField(): NamedGroupField {
  return {
    name: "ctaCard",
    type: "group",
    fields: [
      withSameAsEnTag({ name: "text", type: "textarea", localized: true }),
      link({ name: "link" }),
    ],
  };
}

export const validateEntityPicks =
  entityPicksValidator as unknown as RelationshipFieldManyValidation;

export const validateOneEntity =
  entityPicksValidator as unknown as RelationshipFieldSingleValidation;
