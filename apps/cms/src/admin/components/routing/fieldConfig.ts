import type { RoutingSetting } from "./routing";

export function routingNote(setting: RoutingSetting) {
  return {
    path: "/admin/components/routing/RoutingNote#RoutingNote",
    clientProps: { setting },
  };
}
