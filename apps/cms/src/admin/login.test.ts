import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  LOCKED_ACCOUNT_MESSAGE,
  LOGIN_COMPONENTS,
  GROUP_ENTITIES_LOGO,
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

  it("shows the group's entity logos from a static file, with no tenant query (FR-UI-31)", () => {
    const file = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      "../../public",
      GROUP_ENTITIES_LOGO.src,
    );
    expect(existsSync(file)).toBe(true);
    expect(GROUP_ENTITIES_LOGO.alt).toMatch(/Dunia Kimia Utama/);
    for (const file of ["LoginScreen.tsx", "BrandPanel.tsx"]) {
      expect(readFileSync(path.join(loginDir, file), "utf8")).not.toMatch(
        /payload\.(find|count|findByID)\(/,
      );
    }
  });
});
