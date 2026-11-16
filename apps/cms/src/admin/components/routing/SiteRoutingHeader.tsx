import type { UIFieldServerProps } from "payload";

import { isSuperAdmin } from "../../../access";
import { ReachBadge } from "../kit/ReachBadge";
import { ReadOnlyHint } from "../kit/ReadOnlyHint";
import { getReach } from "../kit/reach";
import { SITE_ROUTING_READ_ONLY } from "./routing";

export function SiteRoutingHeader({ user }: UIFieldServerProps) {
  return (
    <div className="dil-routing-header">
      <ReachBadge reach={getReach(undefined, { collection: "products" })} />
      {!isSuperAdmin(user as Parameters<typeof isSuperAdmin>[0]) && (
        <ReadOnlyHint>{SITE_ROUTING_READ_ONLY}</ReadOnlyHint>
      )}
    </div>
  );
}
