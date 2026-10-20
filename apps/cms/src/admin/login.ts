export const LOCKED_ACCOUNT_MESSAGE =
  "Too many sign-in attempts. Your account is locked for up to 10 minutes. You can wait and try again, reset your password, or ask a Super Admin to unlock it now.";

export const LOGIN_TRANSLATIONS = {
  en: { error: { userLocked: LOCKED_ACCOUNT_MESSAGE } },
  id: { error: { userLocked: LOCKED_ACCOUNT_MESSAGE } },
};

export const LOGIN_COMPONENTS = {
  views: {
    login: { Component: "/admin/components/login/LoginScreen#LoginScreen" },
    logout: {
      Component: "/admin/components/login/SignOutScreen#SignOutScreen",
    },
    inactivity: {
      Component: "/admin/components/login/SignOutScreen#SessionExpiredScreen",
    },
    forgot: { Component: "/admin/components/login/ForgotScreen#ForgotScreen" },
    resetPassword: {
      path: "/reset" as const,
      Component: "/admin/components/login/ResetScreen#ResetScreen",
    },
  },
};

export const NATIVE_RESET_ROUTE = "/payload-reset";

export const GROUP_ENTITIES_LOGO = {
  src: "/brand/dil-group-entities.png",
  alt: "Dunia Kimia Utama, Indonesian Acids Industry and Liku Telaga",
  width: 482,
  height: 80,
};

export const LOGIN_NOTICES = {
  expired: {
    tone: "warning",
    icon: "timer_off",
    title: "You were signed out.",
    body: "Sign in again to continue.",
  },
  "signed-out": {
    tone: "success",
    icon: "check_circle",
    title: "You've signed out.",
    body: "See you next time.",
  },
  "password-updated": {
    tone: "success",
    icon: "key",
    title: "Password updated.",
    body: "Sign in with your new password.",
  },
} as const;

export type LoginNotice = keyof typeof LOGIN_NOTICES;

export function loginNotice(value: unknown): LoginNotice | undefined {
  return typeof value === "string" && value in LOGIN_NOTICES
    ? (value as LoginNotice)
    : undefined;
}

export const WRONG_CREDENTIALS = "Email or password is incorrect.";

export type LoginOutcome = "signed-in" | "locked" | "rejected";

export function loginOutcome(
  status: number,
  body: { errors?: { message?: string }[] } | undefined,
): LoginOutcome {
  if (status < 400) return "signed-in";
  const messages = body?.errors?.map(({ message }) => message) ?? [];
  return messages.includes(LOCKED_ACCOUNT_MESSAGE) ? "locked" : "rejected";
}

export function safeRedirect(value: unknown, fallback: string): string {
  if (typeof value !== "string" || !value.startsWith("/")) return fallback;
  if (value.startsWith("//") || value.startsWith("/\\")) return fallback;
  return value;
}
