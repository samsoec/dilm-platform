import {
  TENANT_NAMES,
  TENANT_SLUGS,
  type TenantSlug,
} from "@dilm/shared-types";

import { TENANT_BRAND_COLORS } from "../seed/tenants";

export const LOCKED_ACCOUNT_MESSAGE =
  "Too many attempts. This account is locked for up to 10 minutes, or ask a Super Admin to unlock it.";

export const LOGIN_TRANSLATIONS = {
  en: { error: { userLocked: LOCKED_ACCOUNT_MESSAGE } },
};

export const LOGIN_COMPONENTS = {
  beforeLogin: ["/admin/components/login/LoginIntro#LoginIntro"],
  afterLogin: ["/admin/components/login/LoginFootnote#LoginFootnote"],
  views: {
    login: { Component: "/admin/components/login/LoginScreen#LoginScreen" },
  },
};

const TENANT_MONOGRAMS: Record<TenantSlug, string> = {
  indoacid: "IAI",
  duniakimia: "DKU",
  likutelaga: "LT",
};

export type LoginTenant = {
  slug: TenantSlug;
  name: string;
  monogram: string;
  color: string;
};

// TODO(DILM-67): swap the monograms for the white tenant logos once the design partner supplies them (TRD-UI §13 #1).
export const LOGIN_TENANTS: LoginTenant[] = TENANT_SLUGS.map((slug) => ({
  slug,
  name: TENANT_NAMES[slug],
  monogram: TENANT_MONOGRAMS[slug],
  color: TENANT_BRAND_COLORS[slug],
}));
