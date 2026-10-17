import type { UIFieldServerProps } from "payload";

import { isDefaultLocale } from "../../../fields/structure";
import { Banner } from "../kit/Banner";

const languageNames = new Intl.DisplayNames(["en"], { type: "language" });

export function LocaleBanner({ req }: UIFieldServerProps) {
  if (isDefaultLocale(req.locale)) return null;
  const language = languageNames.of(req.locale!) ?? req.locale;
  return (
    <Banner
      className="dil-locale-banner"
      title={`You're editing the ${language} labels.`}
      tone="info"
    >
      Menu structure, link targets, toggles and images are shared by both
      languages, so they&apos;re locked here. Switch the content language to EN
      to change them. Labels tagged “Same as EN” still show the English text.
    </Banner>
  );
}
