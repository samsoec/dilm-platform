import type { ArrayField, Field, UIField } from "payload";

import type { FooterSection } from "../admin/layoutEditor";

const FIELDS = "/admin/components/fields";

export const SAME_AS_EN_TAG = `${FIELDS}/SameAsEnTag#SameAsEnTag`;

export const ROW_LABELS = {
  navItem: `${FIELDS}/RowLabels#NavItemRowLabel`,
  link: `${FIELDS}/RowLabels#LinkRowLabel`,
  column: `${FIELDS}/RowLabels#ColumnRowLabel`,
};

function uiField(
  name: string,
  component: string,
  position?: "sidebar",
): UIField {
  return {
    name,
    type: "ui",
    admin: {
      ...(position ? { position } : {}),
      components: { Field: `${FIELDS}/${component}` },
    },
  };
}

export const localeBanner = uiField(
  "localeBanner",
  "LocaleBanner#LocaleBanner",
);

export const validationSummary = uiField(
  "validationSummary",
  "ValidationSummary#ValidationSummary",
);

export const versionInfo = uiField(
  "versionInfo",
  "VersionInfo#VersionInfo",
  "sidebar",
);

export const sourcedFrom = uiField(
  "sourcedFrom",
  "SourcedFromPanel#SourcedFromPanel",
  "sidebar",
);

export const sectionAnchors = uiField(
  "sectionAnchors",
  "SectionAnchors#SectionAnchors",
);

export function countedArray<T extends ArrayField>(field: T): T {
  return {
    ...field,
    admin: {
      ...field.admin,
      components: {
        ...field.admin?.components,
        Label: `${FIELDS}/ArrayCountLabel#ArrayCountLabel`,
      },
    },
  };
}

export function section(
  anchor: FooterSection["anchor"],
  fields: Field[],
): Field[] {
  return [
    {
      name: `section_${anchor.replaceAll("-", "_")}`,
      type: "ui",
      admin: {
        components: {
          Field: {
            path: `${FIELDS}/SectionLabel#SectionLabel`,
            clientProps: { section: anchor },
          },
        },
      },
    },
    ...fields,
  ];
}

export function withSameAsEnTag<T extends Field>(field: T): T {
  return {
    ...field,
    admin: {
      ...field.admin,
      components: {
        ...(field.admin as { components?: object } | undefined)?.components,
        afterInput: [SAME_AS_EN_TAG],
      },
    },
  } as T;
}
