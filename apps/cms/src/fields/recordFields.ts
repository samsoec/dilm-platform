import type { Field, NumberField, TextField } from "payload";

import { slugField, pathField, slugFallbackField } from "./pageFields";

export const recordPathField: TextField = {
  ...pathField,
  admin: {
    ...pathField.admin,
    description:
      "Worked out from the listing page in Site routing and the slug. The same on every company's website.",
  },
};

export const orderField: NumberField = {
  name: "order",
  label: "Order",
  type: "number",
  defaultValue: 0,
  admin: {
    position: "sidebar",
    step: 1,
    description: "Lower numbers come first in lists you sort by hand.",
  },
};

export function recordAddressFields(): Field[] {
  const slug = slugField(true);
  return [
    {
      ...slug,
      admin: {
        ...slug.admin,
        description:
          "The last part of the address. Unique across every company's catalog.",
      },
    },
    recordPathField,
    slugFallbackField,
    orderField,
  ];
}
