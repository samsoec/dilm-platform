import { CommandPaletteTrigger } from "./CommandPaletteTrigger";
import type { TopBarProps } from "./entity";
import { LanguageSwitch } from "./LanguageSwitch";
import { DOCUMENT_ACTIONS_ID } from "../editor/editor";
import { ViewSiteLink } from "./ViewSiteLink";

export function TopBarActions(props: TopBarProps) {
  return (
    <div className="dil-topbar">
      <CommandPaletteTrigger />
      <LanguageSwitch {...props} />
      <div className="dil-topbar__document" id={DOCUMENT_ACTIONS_ID} />
      <ViewSiteLink {...props} />
    </div>
  );
}
