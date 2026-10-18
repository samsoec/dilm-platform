import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  GROUP_ENTITIES_LOGO,
  LOCKED_ACCOUNT_MESSAGE,
  LOGIN_COMPONENTS,
  LOGIN_NOTICES,
  LOGIN_TRANSLATIONS,
  loginNotice,
  loginOutcome,
  safeRedirect,
  WRONG_CREDENTIALS,
} from "./login";

const loginDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "components/login",
);

describe("login screen (TRD-UI §6.1)", () => {
  it("signs in through Payload's own login endpoint (FR-UI-29)", () => {
    expect(LOGIN_COMPONENTS.views.login.Component).toMatch(/LoginScreen$/);
    const form = readFileSync(path.join(loginDir, "SignInForm.tsx"), "utf8");
    expect(form).toMatch(/\/\$\{admin\.user\}\/login/);
    expect(form).not.toMatch(/\/api\/(?!.*login)/);
  });

  it("uses the A-03 lock copy for Payload's locked error (FR-UI-30)", () => {
    expect(LOGIN_TRANSLATIONS.en.error.userLocked).toBe(
      "Too many sign-in attempts. Your account is locked for up to 10 minutes. You can wait and try again, reset your password, or ask a Super Admin to unlock it now.",
    );
    expect(LOGIN_TRANSLATIONS.id.error.userLocked).toBe(LOCKED_ACCOUNT_MESSAGE);
  });

  it("never tells anyone how many attempts are left (§10 #1)", () => {
    expect(LOCKED_ACCOUNT_MESSAGE).not.toMatch(
      /\b\d+ (more )?(tries|attempts)\b/i,
    );
    expect(WRONG_CREDENTIALS).toBe("Email or password is incorrect.");
    expect(WRONG_CREDENTIALS).not.toMatch(/\d/);
  });

  it("reads Payload's answer as signed in, locked or rejected", () => {
    expect(loginOutcome(200, {})).toBe("signed-in");
    expect(
      loginOutcome(401, { errors: [{ message: LOCKED_ACCOUNT_MESSAGE }] }),
    ).toBe("locked");
    expect(
      loginOutcome(401, {
        errors: [{ message: "The email or password provided is incorrect." }],
      }),
    ).toBe("rejected");
    expect(loginOutcome(500, undefined)).toBe("rejected");
  });

  it("only knows the three A-04 notices", () => {
    expect(loginNotice("expired")).toBe("expired");
    expect(loginNotice("signed-out")).toBe("signed-out");
    expect(loginNotice("password-updated")).toBe("password-updated");
    expect(loginNotice("hacked")).toBeUndefined();
    expect(LOGIN_NOTICES.expired.title).toBe("You were signed out.");
    expect(LOGIN_NOTICES["signed-out"].body).toBe("See you next time.");
  });

  it("only redirects within the admin after sign-in", () => {
    expect(safeRedirect("/admin/collections/header", "/admin")).toBe(
      "/admin/collections/header",
    );
    expect(safeRedirect("https://evil.test", "/admin")).toBe("/admin");
    expect(safeRedirect("//evil.test", "/admin")).toBe("/admin");
    expect(safeRedirect(undefined, "/admin")).toBe("/admin");
  });

  it("sends sign-out and session expiry to the sign-in card with a notice", () => {
    expect(LOGIN_COMPONENTS.views.logout.Component).toMatch(/#SignOutScreen$/);
    expect(LOGIN_COMPONENTS.views.inactivity.Component).toMatch(
      /#SessionExpiredScreen$/,
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
