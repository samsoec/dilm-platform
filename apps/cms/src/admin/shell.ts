import type { Plugin } from "payload";

export const ADMIN_TOAST = {
  duration: 6000,
  position: "bottom-right",
} as const;

export const TOP_BAR_ACTIONS = [
  "/admin/components/topbar/TopBarActions#TopBarActions",
];

export const PROVIDERS_INSIDE_TENANT_SELECTION = [
  "/admin/components/topbar/ShellCrumbs#ShellCrumbs",
  "/admin/components/guard/UnsavedChangesProvider#UnsavedChangesProvider",
];

export const UNSAVED_CHANGES_REPORTER =
  "/admin/components/guard/UnsavedChangesReporter#UnsavedChangesReporter";

type EditComponents = { beforeDocumentControls?: unknown[] };

function withReporter<T extends { admin?: object }>(entity: T): T {
  const admin = (entity.admin ?? {}) as {
    components?: { edit?: EditComponents };
  };
  const edit = admin.components?.edit ?? {};
  return {
    ...entity,
    admin: {
      ...admin,
      components: {
        ...admin.components,
        edit: {
          ...edit,
          beforeDocumentControls: [
            ...(edit.beforeDocumentControls ?? []),
            UNSAVED_CHANGES_REPORTER,
          ],
        },
      },
    },
  };
}

export const guardEveryDocument: Plugin = (config) => ({
  ...config,
  collections: config.collections?.map(withReporter),
  globals: config.globals?.map(withReporter),
});

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
