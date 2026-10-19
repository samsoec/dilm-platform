"use client";

import { Link, useConfig } from "@payloadcms/ui";
import { useSearchParams } from "next/navigation";
import type { DefaultCellComponentProps } from "payload";
import { formatAdminURL } from "payload/shared";

import { LIST_PARAM } from "../application/application";

export function ApplicantCell({
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
  const listQuery = useSearchParams().toString();
  const name = typeof cellData === "string" ? cellData : "";
  const email = typeof rowData.email === "string" ? rowData.email : undefined;
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
    <Link
      className="dil-applicant"
      href={
        listQuery
          ? `${docURL}?${LIST_PARAM}=${encodeURIComponent(listQuery)}`
          : docURL
      }
      prefetch={false}
    >
      {content}
    </Link>
  ) : (
    <span className="dil-applicant">{content}</span>
  );
}
