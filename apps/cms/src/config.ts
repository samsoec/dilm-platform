import path from "node:path";
import { fileURLToPath } from "node:url";

import { getRuntimeConfig, runtimeConfigSource } from "@dilm/runtime-config";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { s3Storage } from "@payloadcms/storage-s3";
import { en } from "@payloadcms/translations/languages/en";
import { id } from "@payloadcms/translations/languages/id";
import { buildConfig } from "payload";
import sharp from "sharp";

import { PRODUCT_NAME } from "./admin/brand";
import { BEFORE_DASHBOARD, DASHBOARD } from "./admin/dashboard";
import {
  LOGIN_COMPONENTS,
  LOGIN_TRANSLATIONS,
  NATIVE_RESET_ROUTE,
} from "./admin/login";
import {
  ADMIN_TOAST,
  appendAdminProviders,
  guardEveryDocument,
  PROVIDERS_INSIDE_TENANT_SELECTION,
  TOP_BAR_ACTIONS,
} from "./admin/shell";
import { TRASH_TRANSLATIONS } from "./admin/components/trash/trash";
import { collections, globals } from "./collections";
import { Users } from "./collections/Users";
import { cmsDatabaseAdapter, type PayloadClient } from "./database";
import { cmsEmailAdapter } from "./email";
import { localization } from "./localization";
import { publicBucketStorage } from "./storage";
import { multiTenant } from "./tenancy";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export async function cmsConfig(client: PayloadClient) {
  const runtimeConfig = await getRuntimeConfig();
  return buildConfig({
    admin: {
      user: Users.slug,
      importMap: {
        baseDir: dirname,
      },
      theme: "all",
      routes: { reset: NATIVE_RESET_ROUTE },
      avatar: { Component: "/admin/graphics/Avatar#Avatar" },
      dashboard: DASHBOARD,
      components: {
        Nav: "/admin/components/nav/AdminNav#AdminNav",
        beforeDashboard: BEFORE_DASHBOARD,
        actions: TOP_BAR_ACTIONS,
        ...LOGIN_COMPONENTS,
        views: {
          ...LOGIN_COMPONENTS.views,
          account: {
            Component: "/admin/components/account/AccountView#AccountView",
          },
        },
        graphics: {
          Icon: "/admin/graphics/Icon#Icon",
          Logo: "/admin/graphics/Logo#Logo",
        },
      },
      toast: ADMIN_TOAST,
      meta: {
        titleSuffix: `— ${PRODUCT_NAME}`,
        icons: [{ rel: "icon", type: "image/svg+xml", url: "/favicon.svg" }],
      },
    },
    collections,
    globals,
    custom: { cvRetentionMonths: runtimeConfig.cvRetentionMonths },
    i18n: {
      supportedLanguages: { en, id },
      fallbackLanguage: "en",
      translations: {
        en: { ...LOGIN_TRANSLATIONS.en, ...TRASH_TRANSLATIONS.en },
        id: { ...LOGIN_TRANSLATIONS.id, ...TRASH_TRANSLATIONS.id },
      },
    },
    localization,
    secret: runtimeConfig.payloadSecret,
    typescript: {
      outputFile: path.resolve(dirname, "payload-types.ts"),
    },
    db: postgresAdapter(
      await cmsDatabaseAdapter(
        runtimeConfig.database,
        runtimeConfigSource(process.env),
        path.resolve(dirname, "migrations"),
        client,
      ),
    ),
    email: cmsEmailAdapter(runtimeConfig.email),
    sharp,
    plugins: [
      multiTenant(collections),
      s3Storage(publicBucketStorage(runtimeConfig.storage)),
      appendAdminProviders(PROVIDERS_INSIDE_TENANT_SELECTION),
      guardEveryDocument,
    ],
  });
}
