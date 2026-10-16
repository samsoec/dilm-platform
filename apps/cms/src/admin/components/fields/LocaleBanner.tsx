import type { UIFieldServerProps } from "payload";

import { isDefaultLocale } from "../../../fields/structure";
import { MaterialIcon } from "../MaterialIcon";

const languageNames = new Intl.DisplayNames(["en"], { type: "language" });

export function LocaleBanner({ req }: UIFieldServerProps) {
  if (isDefaultLocale(req.locale)) return null;
  const language = languageNames.of(req.locale!) ?? req.locale;
  return (
    <div className="dil-locale-banner" role="note">
      <MaterialIcon name="translate" />
      <div>
        <p className="dil-locale-banner__title">
          You&apos;re editing the {language} labels.
        </p>
        <p className="dil-locale-banner__text">
          Menu structure, link targets, toggles and images are shared by both
          languages, so they&apos;re locked here. Switch the content language to
          EN to change them. Labels tagged “Same as EN” still show the English
          text.
        </p>
      </div>
    </div>
  );
}
