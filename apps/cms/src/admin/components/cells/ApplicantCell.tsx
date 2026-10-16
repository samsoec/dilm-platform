"use client";

import { Link } from "@payloadcms/ui";
import type { DefaultCellComponentProps } from "payload";

export function ApplicantCell({
  cellData,
  link,
  linkURL,
  rowData,
}: DefaultCellComponentProps) {
  const name = typeof cellData === "string" ? cellData : "";
  const email = typeof rowData.email === "string" ? rowData.email : undefined;
  const content = (
    <>
      <span className="dil-applicant__name">{name}</span>
      {email && <span className="dil-applicant__email">{email}</span>}
    </>
  );
  return link && linkURL ? (
    <Link className="dil-applicant" href={linkURL} prefetch={false}>
      {content}
    </Link>
  ) : (
    <span className="dil-applicant">{content}</span>
  );
}
