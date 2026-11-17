"use client";

import { Link, useConfig } from "@payloadcms/ui";
import type { DefaultCellComponentProps } from "payload";
import { formatAdminURL } from "payload/shared";

import { timestampText } from "../consent/consent";
import { MaterialIcon } from "../MaterialIcon";
import { deliveryMarks } from "./contact";

export function SenderCell({
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
  const name = typeof cellData === "string" ? cellData : "";
  const email =
    typeof rowData.workEmail === "string" ? rowData.workEmail : undefined;
  const docURL =
    linkURL ??
    (rowData.id === undefined
      ? undefined
      : formatAdminURL({
          adminRoute,
          path: `/collections/${collectionSlug}/${encodeURIComponent(String(rowData.id))}`,
        }));
  const content = (
    <>
      <span className="dil-applicant__name">{name}</span>
      {email && <span className="dil-applicant__email">{email}</span>}
    </>
  );
  return link && docURL ? (
    <Link className="dil-applicant" href={docURL} prefetch={false}>
      {content}
    </Link>
  ) : (
    <span className="dil-applicant">{content}</span>
  );
}

export function SubmittedCell({ cellData }: DefaultCellComponentProps) {
  return (
    <span className="dil-consent__time">
      {timestampText(cellData)} <span className="dil-sr-only">WIB</span>
    </span>
  );
}

export function DeliveryCell({ rowData }: DefaultCellComponentProps) {
  return (
    <span className="dil-emails">
      {deliveryMarks(rowData).map(({ who, sent, icon, text }) => (
        <span
          className={`dil-emails__mark dil-tone--${sent ? "ok" : "muted"}`}
          key={who}
          title={text}
        >
          <MaterialIcon name={icon} />
          <span className="dil-sr-only">{text}</span>
        </span>
      ))}
    </span>
  );
}
