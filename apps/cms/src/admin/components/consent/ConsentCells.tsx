"use client";

import { Link, useConfig } from "@payloadcms/ui";
import type { DefaultCellComponentProps } from "payload";
import { formatAdminURL } from "payload/shared";

import { MaterialIcon } from "../MaterialIcon";
import {
  CONSENT_TYPE_ICONS,
  CONSENT_TYPE_LABELS,
  timestampText,
} from "./consent";

export function TimestampCell({
  cellData,
  collectionSlug,
  link,
  linkURL,
  rowData,
}: DefaultCellComponentProps) {
  const {
    config: {
      routes: { admin: adminRoute },
    },
  } = useConfig();
  const text = timestampText(cellData);
  const docURL =
    linkURL ??
    (rowData.id === undefined
      ? undefined
      : formatAdminURL({
          adminRoute,
          path: `/collections/${collectionSlug}/${encodeURIComponent(String(rowData.id))}`,
        }));
  return link && docURL ? (
    <Link className="dil-consent__time" href={docURL} prefetch={false}>
      {text}
    </Link>
  ) : (
    <span className="dil-consent__time">{text}</span>
  );
}

export function ConsentTypeCell({ cellData }: DefaultCellComponentProps) {
  const value = typeof cellData === "string" ? cellData : "";
  return (
    <span className="dil-consent__type">
      <MaterialIcon name={CONSENT_TYPE_ICONS[value] ?? "verified_user"} />
      {CONSENT_TYPE_LABELS[value] ?? value}
    </span>
  );
}

export function MonoCell({ cellData }: DefaultCellComponentProps) {
  return (
    <code className="dil-consent__mono">
      {typeof cellData === "string" ? cellData : ""}
    </code>
  );
}
