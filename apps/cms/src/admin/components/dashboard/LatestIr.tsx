import Link from "next/link";
import type { WidgetServerProps } from "payload";
import { formatAdminURL } from "payload/shared";
import { Suspense } from "react";

import { dashboardScope } from "../../data/dashboard";
import { StatusChip } from "../kit/StatusChip";
import { MaterialIcon } from "../MaterialIcon";
import { Frame } from "./Frame";
import { WidgetError, WidgetLoading } from "./WidgetStates";

const TITLE = "Latest IR documents";

const DATE = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

function typeLabel(value: unknown): string {
  const text = typeof value === "string" ? value.replace(/-/g, " ") : "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function LatestIrWidget(props: WidgetServerProps) {
  return (
    <Suspense fallback={<WidgetLoading title={TITLE} />}>
      <LatestIr {...props} />
    </Suspense>
  );
}

async function LatestIr({
  cookies,
  permissions,
  req,
  user,
}: WidgetServerProps) {
  const { payload } = req;
  if (!user) return null;
  const admin = payload.config.routes.admin;
  const canUpload = Boolean(permissions?.collections?.["ir-documents"]?.create);
  const uploadHref = formatAdminURL({
    adminRoute: admin,
    path: "/collections/ir-documents/create",
  });
  try {
    const scope = await dashboardScope(payload, user, cookies);
    if (!scope)
      return (
        <Frame title={TITLE}>
          <p className="dil-widget__note">Pick a company in the sidebar.</p>
        </Frame>
      );
    const { docs } = await payload.find({
      collection: "ir-documents",
      where: { tenant: { equals: scope.tenant } },
      sort: "-publishedDate",
      limit: 3,
      depth: 0,
      draft: true,
      select: {
        title: true,
        documentType: true,
        publishedDate: true,
        locale: true,
        _status: true,
      },
      overrideAccess: false,
      user,
    });
    return (
      <Frame
        aside={
          canUpload && docs.length > 0 ? (
            <Link
              className="dil-widget__link"
              href={uploadHref}
              prefetch={false}
            >
              Upload PDF
            </Link>
          ) : undefined
        }
        title={TITLE}
      >
        {docs.length === 0 ? (
          <div className="dil-widget__state">
            <MaterialIcon
              className="dil-widget__state-icon"
              name="description"
            />
            <span>No IR documents for this site yet.</span>
            {canUpload && (
              <Link
                className="dil-attention__action dil-attention__action--primary"
                href={uploadHref}
                prefetch={false}
              >
                Upload the first PDF
              </Link>
            )}
          </div>
        ) : (
          <ul className="dil-ir-list">
            {docs.map((doc) => (
              <li key={doc.id}>
                <Link
                  className="dil-ir-list__item"
                  href={formatAdminURL({
                    adminRoute: admin,
                    path: `/collections/ir-documents/${doc.id}`,
                  })}
                  prefetch={false}
                >
                  <MaterialIcon
                    className="dil-ir-list__icon"
                    name="picture_as_pdf"
                  />
                  <span className="dil-ir-list__text">
                    <b>{doc.title}</b>
                    <span>
                      {typeLabel(doc.documentType)}
                      {doc.publishedDate &&
                        ` · ${DATE.format(new Date(doc.publishedDate)).replace("Sept", "Sep")}`}
                    </span>
                  </span>
                  <StatusChip
                    set="document"
                    status={doc._status ?? "published"}
                  />
                  <span className="dil-ir-list__locale">
                    {String(doc.locale ?? "").toUpperCase()}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Frame>
    );
  } catch (error) {
    payload.logger.error({ err: error, msg: "dashboard: latest IR failed" });
    return <WidgetError title={TITLE} what="IR documents" />;
  }
}
