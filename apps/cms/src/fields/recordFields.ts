import type {
  Field,
  NumberField,
  TextField,
  TextFieldSingleValidation,
} from "payload";

import { localization } from "../localization";
import {
  slugField,
  pathField,
  slugFallbackField,
  slugValidator,
  SLUG_REQUIRED_MESSAGE,
} from "./pageFields";

const defaultLocale = localization.defaultLocale;

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

export function jobAddressFields(): Field[] {
  const slug = slugField(true);
  return [
    {
      ...slug,
      admin: {
        ...slug.admin,
        description:
          "The last part of the address, under the career page. Unique within this company.",
      },
    },
    {
      ...pathField,
      admin: {
        ...pathField.admin,
        description:
          "Worked out from the career page in Site routing and the slug.",
      },
    },
    slugFallbackField,
    orderField,
  ];
}

export function postAddressFields(): Field[] {
  const slug = slugField(true);
  return [
    {
      ...slug,
      admin: {
        ...slug.admin,
        description:
          "The last part of the address, after the category. Unique within this company.",
      },
    },
    {
      ...pathField,
      admin: {
        ...pathField.admin,
        description:
          "Worked out from the primary category and the slug. It changes when either changes.",
      },
    },
    slugFallbackField,
    orderField,
  ];
}

export const CATEGORY_NAME_REQUIRED = "Add the category's name.";

function requiredInDefaultLocale(
  message: string,
  then?: TextFieldSingleValidation,
) {
  const validate: TextFieldSingleValidation = (value, options) => {
    const locale = options.req?.locale;
    const other = locale && locale !== "all" && locale !== defaultLocale;
    if (!value) return other ? true : message;
    return then ? then(value, options) : true;
  };
  return validate;
}

export const categoryNameField: TextField = {
  name: "name",
  label: "Name",
  type: "text",
  localized: true,
  validate: requiredInDefaultLocale(CATEGORY_NAME_REQUIRED),
};

export function categoryAddressFields(): Field[] {
  const slug = slugField(false);
  const categorySlug: TextField = {
    ...slug,
    validate: requiredInDefaultLocale(
      SLUG_REQUIRED_MESSAGE,
      slugValidator(true),
    ),
    admin: {
      ...slug.admin,
      description:
        "The last part of the address, after the category prefix. Unique across categories.",
    },
  } as TextField;
  return [
    categorySlug,
    {
      ...pathField,
      admin: {
        ...pathField.admin,
        description:
          "The category prefix and the slug. The same on every company's website.",
      },
    },
    slugFallbackField,
  ];
}
