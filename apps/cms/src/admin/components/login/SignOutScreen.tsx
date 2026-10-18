"use client";

import { useAuth, useConfig } from "@payloadcms/ui";
import { formatAdminURL } from "payload/shared";
import { useEffect, useRef } from "react";

import type { LoginNotice } from "../../login";
import { LoadingBlock } from "../kit/Loading";

function useLeaveTo(notice: LoginNotice, signOutFirst: boolean) {
  const { logOut } = useAuth();
  const {
    config: { routes },
  } = useConfig();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const login = formatAdminURL({
      adminRoute: routes.admin,
      path: `/login?notice=${notice}`,
    });
    void (signOutFirst ? logOut() : Promise.resolve())
      .catch(() => undefined)
      .finally(() => window.location.replace(login));
  }, [logOut, notice, routes.admin, signOutFirst]);
}

export function SignOutScreen() {
  useLeaveTo("signed-out", true);
  return (
    <main className="dil-login__pane dil-signout">
      <LoadingBlock label="Signing out" lines={2} />
    </main>
  );
}

export function SessionExpiredScreen() {
  useLeaveTo("expired", false);
  return (
    <main className="dil-login__pane dil-signout">
      <LoadingBlock label="Your session ended" lines={2} />
    </main>
  );
}
