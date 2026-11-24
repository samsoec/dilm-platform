"use client";

import type { BaseNote } from "../../../siteRouting";
import { useConfig } from "@payloadcms/ui";
import Link from "next/link";
import { formatAdminURL } from "payload/shared";

import { Banner } from "./Banner";

export function BaseNoteBanner({
  note,
  className,
}: {
  note: BaseNote;
  className?: string;
}) {
  const {
    config: {
      routes: { admin },
    },
  } = useConfig();
  return (
    <Banner
      action={
        <Link href={formatAdminURL({ adminRoute: admin, path: note.path })}>
          {note.action}{" "}
        </Link>
      }
      className={className}
      icon="route"
      tone="warning"
    >
      {note.message}
    </Banner>
  );
}
