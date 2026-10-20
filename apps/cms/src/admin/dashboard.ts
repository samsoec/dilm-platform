import type { DashboardConfig } from "payload";

const WIDGETS = "/admin/components/dashboard";

export const DASHBOARD_WIDGETS = [
  {
    slug: "needs-attention",
    file: "NeedsAttention#NeedsAttentionWidget",
    label: "Needs attention",
  },
  {
    slug: "translation-progress",
    file: "Translation#TranslationWidget",
    label: "Indonesian translation",
  },
  {
    slug: "site-layout",
    file: "SiteLayout#SiteLayoutWidget",
    label: "Site layout",
  },
  {
    slug: "latest-ir",
    file: "LatestIr#LatestIrWidget",
    label: "Latest IR documents",
  },
] as const;

export const DASHBOARD: DashboardConfig = {
  widgets: DASHBOARD_WIDGETS.map(({ slug, file, label }) => ({
    slug,
    label,
    Component: `${WIDGETS}/${file}`,
    minWidth: "medium",
    maxWidth: "medium",
  })),
  defaultLayout: DASHBOARD_WIDGETS.map(({ slug }) => ({
    widgetSlug: slug,
    width: "medium",
  })),
};

export const BEFORE_DASHBOARD = [`${WIDGETS}/DashboardIntro#DashboardIntro`];
