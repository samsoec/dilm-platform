"use client";

import { useConfig } from "@payloadcms/ui";
import { useRouter } from "next/navigation";
import { formatAdminURL } from "payload/shared";
import { useEffect } from "react";

export function newPageListPath(parent: string | undefined): `/${string}` {
  return `/collections/pages?newPage=1${parent ? `&parent=${encodeURIComponent(parent)}` : ""}`;
}

export function NewPageRedirect({ parent }: { parent?: string }) {
  const router = useRouter();
  const {
    config: { routes },
  } = useConfig();
  useEffect(() => {
    if (!window.location.pathname.endsWith("/collections/pages/create")) return;
    router.replace(
      formatAdminURL({
        adminRoute: routes.admin,
        path: newPageListPath(parent),
      }),
    );
  }, [parent, router, routes.admin]);
  return (
    <p className="dil-sr-only" role="status">
      Opening the new page dialog…
    </p>
  );
}
