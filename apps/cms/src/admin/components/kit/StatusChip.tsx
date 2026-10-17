import { MaterialIcon } from "../MaterialIcon";
import { type StatusSet, statusChip } from "./status";

export function StatusChip({
  set,
  status,
  detail,
  srText,
}: {
  set: StatusSet;
  status: unknown;
  detail?: number;
  srText?: string;
}) {
  const chip = statusChip(set, status, detail);
  if (!chip) return null;
  return (
    <span
      className={[
        "dil-status-chip",
        `dil-status-chip--${chip.tone}`,
        chip.plain && "dil-status-chip--plain",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <MaterialIcon name={chip.icon} />
      {chip.label}
      {srText && <span className="dil-sr-only">{srText}</span>}
    </span>
  );
}
