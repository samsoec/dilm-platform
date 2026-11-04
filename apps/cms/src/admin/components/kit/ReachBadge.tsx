import { MaterialIcon } from "../MaterialIcon";
import type { Reach } from "./reach";

export function ReachBadge({
  reach,
  compact,
}: {
  reach: Reach;
  compact?: boolean;
}) {
  const short = compact && reach.scope === "tenant";
  return (
    <span
      className={`dil-reach dil-reach--${reach.scope}`}
      title={short ? reach.label : undefined}
    >
      <MaterialIcon name={reach.scope === "all" ? "hub" : "language"} />
      {short ? (
        <>
          <span aria-hidden="true">This site</span>
          <span className="dil-sr-only">{reach.label}</span>
        </>
      ) : (
        reach.label
      )}
    </span>
  );
}
