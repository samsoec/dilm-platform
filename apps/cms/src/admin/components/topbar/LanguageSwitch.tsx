import { entityConfig, openEntity, type TopBarProps } from "./entity";
import { LanguageSwitchControl } from "./LanguageSwitchControl";
import { hasLocalizedFields } from "./topbar";

const LOCALIZED_VIEWS = new Set(["document"]);

export function LanguageSwitch(props: TopBarProps) {
  const { payload, viewType } = props;
  const { localization } = payload.config;
  if (!localization || !viewType || !LOCALIZED_VIEWS.has(viewType)) {
    return null;
  }
  // TODO(DILM-59): also show the switch next to the dashboard's translation widget.
  const entity = entityConfig(payload.config, openEntity(props));
  if (!entity || !hasLocalizedFields(entity.fields)) return null;

  return <LanguageSwitchControl locales={localization.localeCodes} />;
}
