import type {
  CollectionSlug,
  FieldHook,
  PayloadRequest,
  FilterOptions,
  NamedGroupField,
  RelationshipField,
  RelationshipFieldSingleValidation,
  TextField,
  TextFieldSingleValidation,
  Where,
} from "payload";
import { relationship } from "payload/shared";

import { unscopedRelationship } from "../tenancy";
import { isHttpsUrl, isInternalPath } from "../validation";
import { withSameAsEnTag } from "./layoutEditor";

export const LINK_TYPES = ["internal", "external", "reference"] as const;

export const REFERENCE_COLLECTIONS = [
  "pages",
  "shared-pages",
  "products",
  "solutions",
  "jobs",
  "posts",
  "categories",
] as const;

export type ReferenceCollection = (typeof REFERENCE_COLLECTIONS)[number];

export const TENANT_OWNED: readonly string[] = ["pages", "jobs", "posts"];

const ALWAYS_LIVE: readonly string[] = ["categories"];

export const SELF_REFERENCE = "A page can't link to itself.";

export const REFERENCE_MISSING = "Pick the page or record this link goes to.";

export type LinkType = (typeof LINK_TYPES)[number];

export const LINK_TYPE_LABELS: Record<LinkType, string> = {
  internal: "This site",
  external: "Other site",
  reference: "Page or record",
};

export type LinkFieldOptions = {
  name?: string;
  label?: string;
  required?: boolean;
  withLabel?: boolean;
};

export type LinkReference = {
  relationTo: string;
  value?: number | string | { id: number | string } | null;
};

export type LinkData = {
  type?: LinkType | null;
  internalPath?: string | null;
  externalUrl?: string | null;
  reference?: LinkReference | null;
};

type Ref = number | string | { id: number | string } | null | undefined;

function idOf(value: Ref): string | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  return String(typeof value === "object" ? value.id : value);
}

export type SelfDocument = { collection: string; id: Ref };

export function referenceFilter(
  relationTo: string,
  owner: Ref,
  self?: SelfDocument,
): Where | boolean {
  const clauses: Where[] = [];
  const own =
    self && self.collection === relationTo ? idOf(self.id) : undefined;
  if (own) clauses.push({ id: { not_equals: own } });
  if (!ALWAYS_LIVE.includes(relationTo)) {
    clauses.push({ _status: { equals: "published" } });
  }
  const tenant = idOf(owner);
  if (tenant && TENANT_OWNED.includes(relationTo)) {
    clauses.push({ tenant: { equals: tenant } });
  }
  if (clauses.length === 0) return true;
  return clauses.length === 1 ? clauses[0] : { and: clauses };
}

const referenceOptions: FilterOptions = ({ relationTo, data, id }) => {
  if (!relationTo) return true;
  const doc = data as { tenant?: Ref; redirectTo?: unknown } | undefined;
  const self =
    doc && "redirectTo" in doc
      ? { collection: idOf(doc.tenant) ? "pages" : "shared-pages", id }
      : undefined;
  return referenceFilter(relationTo, doc?.tenant, self);
};

type ValidateContext = {
  collectionSlug?: string;
  id?: Ref;
};

async function storedPick(
  context: ValidateContext,
  args: { req: PayloadRequest; path?: (string | number)[] | string[] },
): Promise<LinkReference | null | undefined> {
  if (!context.collectionSlug || context.id === undefined || !args.path) {
    return undefined;
  }
  try {
    const stored = await args.req.payload.findByID({
      collection: context.collectionSlug as CollectionSlug,
      id: context.id as number | string,
      depth: 0,
      draft: false,
      fallbackLocale: false,
      overrideAccess: true,
      req: args.req,
    });
    const status = (stored as { _status?: string | null })._status;
    if (status !== undefined && status !== "published") return undefined;
    return args.path.reduce<unknown>(
      (node, key) => (node as Record<string, unknown> | undefined)?.[key],
      stored,
    ) as LinkReference | undefined;
  } catch {
    return undefined;
  }
}

function samePick(a: LinkReference | null | undefined, b: LinkReference) {
  return (
    Boolean(a) &&
    a!.relationTo === b.relationTo &&
    idOf(a!.value) === idOf(b.value)
  );
}

const PATH_PREFIX = "/admin/components/fields/PathPrefix#PathPrefix";

const TARGET_FIELD: Record<
  LinkType,
  "internalPath" | "externalUrl" | "reference"
> = {
  internal: "internalPath",
  external: "externalUrl",
  reference: "reference",
};

export function hasTarget(link: LinkData | undefined) {
  const type = link?.type ?? "internal";
  if (type === "reference") return Boolean(idOf(link?.reference?.value));
  return Boolean(link?.[TARGET_FIELD[type]]);
}

function referenceTarget(required: boolean): RelationshipField {
  const isActive = (link: LinkData | undefined) => link?.type === "reference";

  const validate: RelationshipFieldSingleValidation = async (value, args) => {
    if (!isActive(args.siblingData as LinkData)) return true;
    const picked = value as LinkReference | null | undefined;
    if (!picked || !idOf(picked.value)) {
      return required ? REFERENCE_MISSING : true;
    }
    const context = args as unknown as ValidateContext;
    if (
      String(args.path?.[0]) === "redirectTo" &&
      context.collectionSlug === picked.relationTo &&
      context.id !== undefined &&
      idOf(context.id) === idOf(picked.value)
    ) {
      return SELF_REFERENCE;
    }
    if (samePick(await storedPick(context, args), picked)) return true;
    return relationship(value, args);
  };

  const clearWhenInactive: FieldHook = ({ value, siblingData }) =>
    isActive(siblingData as LinkData) ? value : null;

  return unscopedRelationship({
    name: "reference",
    label: "Page or record",
    type: "relationship",
    relationTo: [...REFERENCE_COLLECTIONS],
    maxDepth: 1,
    filterOptions: referenceOptions,
    validate,
    hooks: { beforeChange: [clearWhenInactive] },
    admin: {
      condition: (_, siblingData) => isActive(siblingData as LinkData),
      description:
        "Follows the page or record if it is renamed or moved. Only published ones are offered.",
    },
  });
}

function target(
  type: "internal" | "external",
  format: TextFieldSingleValidation,
  required: boolean,
): TextField {
  const isActive = (link: LinkData | undefined) =>
    (link?.type ?? "internal") === type;

  const validate: TextFieldSingleValidation = (value, args) => {
    if (!isActive(args.siblingData as LinkData)) return true;
    if (!value) return required ? "Add where this link goes." : true;
    return format(value, args);
  };

  const clearWhenInactive: FieldHook = ({ value, siblingData }) =>
    isActive(siblingData as LinkData) ? value : null;

  return {
    name: TARGET_FIELD[type],
    label: type === "internal" ? "Page path" : "Web address",
    type: "text",
    validate,
    hooks: { beforeChange: [clearWhenInactive] },
    admin: {
      condition: (_, siblingData) => isActive(siblingData as LinkData),
      description:
        type === "internal"
          ? "Start with /. The site adds the language."
          : "A full address starting with https://",
      ...(type === "internal"
        ? {
            className: "dil-path-field",
            components: { beforeInput: [PATH_PREFIX] },
          }
        : {}),
    },
  };
}

export function link({
  name = "link",
  label,
  required = false,
  withLabel = true,
}: LinkFieldOptions = {}): NamedGroupField {
  const validateLabel: TextFieldSingleValidation = (value, { siblingData }) =>
    !value && (required || hasTarget(siblingData as LinkData))
      ? "Add the link text."
      : true;

  return {
    name,
    ...(label ? { label } : {}),
    type: "group",
    fields: [
      {
        type: "row",
        fields: [
          {
            name: "type",
            label: "Goes to",
            type: "radio",
            required: true,
            defaultValue: "internal",
            options: LINK_TYPES.map((value) => ({
              value,
              label: LINK_TYPE_LABELS[value],
            })),
            admin: { layout: "horizontal", className: "dil-segmented" },
          },
          {
            name: "newTab",
            label: "Open in a new tab",
            type: "checkbox",
            defaultValue: false,
          },
        ],
      },
      target("internal", isInternalPath, required),
      target("external", isHttpsUrl, required),
      referenceTarget(required),
      ...(withLabel
        ? [
            withSameAsEnTag({
              name: "label",
              type: "text",
              localized: true,
              validate: validateLabel,
            } satisfies TextField),
          ]
        : []),
    ],
  };
}
