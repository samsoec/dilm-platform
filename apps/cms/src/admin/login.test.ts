import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { TENANT_SLUGS } from "@dilm/shared-types";
import { describe, expect, it } from "vitest";

import { TENANT_BRAND_COLORS } from "../seed/tenants";
import {
  LOCKED_ACCOUNT_MESSAGE,
  LOGIN_COMPONENTS,
  LOGIN_TENANTS,
  LOGIN_TRANSLATIONS,
} from "./login";

const loginDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "components/login",
);

describe("login screen (TRD-UI §6.1)", () => {
  it("wraps the native login view instead of replacing authentication", () => {
    expect(LOGIN_COMPONENTS.views.login.Component).toMatch(/LoginScreen$/);
    const screen = readFileSync(path.join(loginDir, "LoginScreen.tsx"), "utf8");
    expect(screen).toMatch(/from "@payloadcms\/next\/views"/);
    expect(screen).toMatch(/<LoginView\b/);
  });

  it("shows the lock notice through Payload's own locked error (FR-UI-30)", () => {
    expect(LOGIN_TRANSLATIONS.en.error.userLocked).toBe(
      "Too many attempts. This account is locked for up to 10 minutes, or ask a Super Admin to unlock it.",
    );
  });

  it("never tells anyone how many attempts are left (§10 #1)", () => {
    expect(LOCKED_ACCOUNT_MESSAGE).not.toMatch(
      /\b\d+ (more )?(tries|attempts)\b/i,
    );
    expect(LOGIN_TRANSLATIONS.en.error).not.toHaveProperty(
      "emailOrPasswordIncorrect",
    );
  });

  it("draws the tenant row from static data, with no tenant query (FR-UI-31)", () => {
    expect(LOGIN_TENANTS.map(({ slug }) => slug)).toEqual([...TENANT_SLUGS]);
    expect(LOGIN_TENANTS.map(({ color }) => color)).toEqual(
      TENANT_SLUGS.map((slug) => TENANT_BRAND_COLORS[slug]),
    );
    for (const file of ["LoginScreen.tsx", "BrandPanel.tsx"]) {
      expect(readFileSync(path.join(loginDir, file), "utf8")).not.toMatch(
        /payload\.(find|count|findByID)\(/,
      );
    }
  });
});
