import { CommandPaletteTrigger } from "./CommandPaletteTrigger";
import type { TopBarProps } from "./entity";
import { LanguageSwitch } from "./LanguageSwitch";
import { ViewSiteLink } from "./ViewSiteLink";

export function TopBarActions(props: TopBarProps) {
  return (
    <div className="dil-topbar">
      <CommandPaletteTrigger />
      <LanguageSwitch {...props} />
      <ViewSiteLink {...props} />
    </div>
  );
}
