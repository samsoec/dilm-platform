import type { TextFieldSingleValidation } from "payload";

import { localization } from "./localization";

type Rule = (value: string) => string | true;

function optional(rule: Rule): TextFieldSingleValidation {
  return (value) => (value ? rule(value) : true);
}

export const HTTPS_MESSAGE = "Use a full address starting with https://";

export const PATH_MESSAGE =
  "Start the path with / and leave out the language, the site adds it.";

export const isHttpsUrl = optional((value) => {
  try {
    return new URL(value).protocol === "https:" ? true : HTTPS_MESSAGE;
  } catch {
    return HTTPS_MESSAGE;
  }
});

const LOCALE_PREFIX = new RegExp(
  `^/(${localization.locales.join("|")})(/|\\?|#|$)`,
  "i",
);

export const isInternalPath = optional((value) => {
  if (!/^\/(?!\/)\S*$/.test(value)) return PATH_MESSAGE;
  return LOCALE_PREFIX.test(value) ? PATH_MESSAGE : true;
});

export const isGa4MeasurementId = optional((value) =>
  /^G-[A-Z0-9]{4,}$/.test(value) ? true : "Use the G-XXXXXXXXXX format",
);

export const isWhatsAppLink = optional((value) => {
  if (!value.startsWith("https://")) return "Start with https://";
  return /^https:\/\/wa\.me\/\d{8,15}(\?.*)?$/.test(value)
    ? true
    : "Use a wa.me link with the full number, like https://wa.me/6281234567890";
});

export const isPhoneNumber = optional((value) =>
  /^\+?[\d\s()-]{6,20}$/.test(value)
    ? true
    : "Use digits, spaces, dashes or brackets, optionally starting with +.",
);
