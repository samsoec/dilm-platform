import type { UIFieldServerProps } from "payload";

import { isDefaultLocale } from "../../../fields/structure";
import { Banner } from "../kit/Banner";

const languageNames = new Intl.DisplayNames(["en"], { type: "language" });

export function LocaleBanner({ req }: UIFieldServerProps) {
  if (isDefaultLocale(req.locale)) return null;
  const language = languageNames.of(req.locale!) ?? req.locale;
  return (
    <Banner className="dil-locale-banner" icon="translate" tone="info">
      You&apos;re editing the {language} text. Menu structure and links are
      shared with English; change them in EN.
    </Banner>
  );
}
