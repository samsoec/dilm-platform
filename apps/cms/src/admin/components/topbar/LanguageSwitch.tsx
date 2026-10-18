import { entityConfig, openEntity, type TopBarProps } from "./entity";
import { LanguageSwitchControl } from "./LanguageSwitchControl";
import { hasLocalizedFields } from "./topbar";

const LOCALIZED_VIEWS = new Set(["document", "dashboard"]);

export function LanguageSwitch(props: TopBarProps) {
  const { payload, viewType } = props;
  const { localization } = payload.config;
  if (!localization || !viewType || !LOCALIZED_VIEWS.has(viewType)) {
    return null;
  }
  if (viewType === "dashboard") {
    return <LanguageSwitchControl locales={localization.localeCodes} />;
  }
  const entity = entityConfig(payload.config, openEntity(props));
  if (!entity || !hasLocalizedFields(entity.fields)) return null;

  return <LanguageSwitchControl locales={localization.localeCodes} />;
}
