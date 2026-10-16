import { MaterialIcon } from "../MaterialIcon";
import type { CellBadge } from "./cv";

export function Badge({
  badge,
  srText,
}: {
  badge: CellBadge;
  srText?: string;
}) {
  return (
    <span className={`dil-badge dil-tone--${badge.tone}`}>
      <MaterialIcon name={badge.icon} />
      {badge.label}
      {srText && <span className="dil-sr-only">{srText}</span>}
    </span>
  );
}
