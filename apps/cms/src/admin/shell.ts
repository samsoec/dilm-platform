import type { Plugin } from "payload";

export const TOP_BAR_ACTIONS = [
  "/admin/components/topbar/TopBarActions#TopBarActions",
];

export const PROVIDERS_INSIDE_TENANT_SELECTION = [
  "/admin/components/topbar/ShellCrumbs#ShellCrumbs",
];

export function appendAdminProviders(providers: string[]): Plugin {
  return (config) => ({
    ...config,
    admin: {
      ...config.admin,
      components: {
        ...config.admin?.components,
        providers: [
          ...(config.admin?.components?.providers ?? []),
          ...providers,
        ],
      },
    },
  });
}
