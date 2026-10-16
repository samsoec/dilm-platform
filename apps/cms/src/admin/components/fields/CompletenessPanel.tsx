import type { UIFieldServerProps } from "payload";

import { localization } from "../../../localization";
import type { LocalizedCompletenessValues } from "../../data/completeness";
import { CompletenessPanelClient } from "./CompletenessPanelClient";

async function defaultLocaleValues({
  id,
  payload,
  req,
}: UIFieldServerProps): Promise<LocalizedCompletenessValues | undefined> {
  if (id === undefined || !req.locale) return undefined;
  if (req.locale === localization.defaultLocale) return undefined;
  const settings = await payload.findByID({
    collection: "tenant-settings",
    id,
    depth: 0,
    locale: localization.defaultLocale,
    select: { siteName: true, defaultSeo: { title: true } },
    overrideAccess: false,
    user: req.user,
  });
  return {
    siteName: settings.siteName ?? null,
    "defaultSeo.title": settings.defaultSeo?.title ?? null,
  };
}

export async function CompletenessPanel(props: UIFieldServerProps) {
  return (
    <CompletenessPanelClient
      defaultLocaleValues={await defaultLocaleValues(props)}
    />
  );
}
