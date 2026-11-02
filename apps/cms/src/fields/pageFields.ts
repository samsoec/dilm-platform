import type {
  BlocksField,
  Field,
  RelationshipField,
  TextField,
  TextFieldSingleValidation,
  Where,
} from "payload";

import { systemManagedField } from "../access";
import { layoutField } from "./layout";
import { link } from "./link";
import { hasRedirect, refId } from "../pageRules";

export const SLUG_PATTERN = /^[a-z0-9-]+$/;

export const SLUG_MESSAGE =
  "Use lowercase letters, numbers and hyphens only (a-z, 0-9, -).";

export const SLUG_REQUIRED_MESSAGE = "Add the page's slug.";

export function slugValidator(required: boolean): TextFieldSingleValidation {
  return (value) => {
    if (!value) return required ? SLUG_REQUIRED_MESSAGE : true;
    return SLUG_PATTERN.test(value) ? true : SLUG_MESSAGE;
  };
}

export function slugField(required: boolean): TextField {
  return {
    name: "slug",
    label: "Slug",
    type: "text",
    localized: true,
    required,
    validate: slugValidator(required),
    admin: {
      className: "dil-mono-input",
      position: "sidebar",
      description: required
        ? "The last part of the address. It can't be empty."
        : "The last part of the address. Leave it empty only for Home.",
    },
  };
}

export const pathField: TextField = {
  name: "path",
  label: "Path",
  type: "text",
  localized: true,
  access: systemManagedField,
  admin: {
    readOnly: true,
    position: "sidebar",
    className: "dil-mono-input",
    description: "Worked out from the parent pages and the slug.",
  },
};

export function parentField(
  relationTo: "pages" | "shared-pages",
  sameTenant: boolean,
): RelationshipField {
  return {
    name: "parent",
    label: "Parent page",
    type: "relationship",
    relationTo,
    maxDepth: 1,
    filterOptions: ({ id, data }) => {
      const clauses: Where[] = [];
      const own = refId(id as string | number | undefined);
      if (own) {
        clauses.push(
          { id: { not_equals: own } },
          { "breadcrumbs.doc": { not_equals: own } },
        );
      }
      const tenant = sameTenant
        ? refId((data as { tenant?: string | number })?.tenant)
        : undefined;
      if (tenant) clauses.push({ tenant: { equals: tenant } });
      return clauses.length > 0 ? { and: clauses } : true;
    },
    admin: {
      position: "sidebar",
      description: sameTenant
        ? "Leave empty for a top-level page. Only pages of this company are offered."
        : "Leave empty for a top-level page.",
    },
  };
}

export function pageLayout(): BlocksField {
  const field = layoutField();
  return {
    ...field,
    admin: {
      ...field.admin,
      condition: (data) => !hasRedirect(data),
    },
  };
}

export function pageFields(
  parent: RelationshipField,
  slugRequired: boolean,
): Field[] {
  return [
    {
      name: "title",
      label: "Title",
      type: "text",
      localized: true,
      required: true,
    },
    slugField(slugRequired),
    parent,
    pathField,
    link({
      name: "redirectTo",
      label: "Redirect to",
      required: false,
      withLabel: false,
    }),
    pageLayout(),
  ];
}
