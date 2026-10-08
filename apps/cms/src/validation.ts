import type { TextFieldSingleValidation } from "payload";

import { localization } from "./localization";

type Rule = (value: string) => string | true;

function optional(rule: Rule): TextFieldSingleValidation {
  return (value) => (value ? rule(value) : true);
}

export const isHttpsUrl = optional((value) => {
  try {
    return new URL(value).protocol === "https:"
      ? true
      : "Use a full https:// link.";
  } catch {
    return "Use a full https:// link.";
  }
});

const LOCALE_PREFIX = new RegExp(
  `^/(${localization.locales.join("|")})(/|\\?|#|$)`,
  "i",
);

export const isInternalPath = optional((value) => {
  if (!/^\/(?!\/)\S*$/.test(value)) {
    return "Use a site path starting with a single /, e.g. /about.";
  }
  return LOCALE_PREFIX.test(value)
    ? "Leave out the language prefix; the site adds /en or /id itself."
    : true;
});

export const isGa4MeasurementId = optional((value) =>
  /^G-[A-Z0-9]{4,}$/.test(value)
    ? true
    : "Use the GA4 measurement ID, e.g. G-XXXXXXXXXX.",
);

export const isWhatsAppLink = optional((value) =>
  /^https:\/\/wa\.me\/\d{8,15}(\?.*)?$/.test(value)
    ? true
    : "Use a wa.me link with the full number, e.g. https://wa.me/6281234567890.",
);

export const isPhoneNumber = optional((value) =>
  /^\+?[\d\s()-]{6,20}$/.test(value)
    ? true
    : "Use digits, spaces, dashes or brackets, optionally starting with +.",
);
