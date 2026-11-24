"use client";

import { useConfig } from "@payloadcms/ui";
import Link from "next/link";
import { formatAdminURL } from "payload/shared";

import { Banner } from "./Banner";

export function BaseNoteBanner({
  note,
  className,
}: {
  note: { message: string; path: `/${string}` };
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
          Go to the setting
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
