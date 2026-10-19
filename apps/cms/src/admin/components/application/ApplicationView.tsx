import { DEFAULT_CV_RETENTION_MONTHS } from "@dilm/runtime-config";
import { SetDocumentStepNav } from "@payloadcms/ui";
import type { DocumentViewServerProps, Where } from "payload";
import { formatAdminURL } from "payload/shared";

import { authorName } from "../../authors";
import { initials } from "../../initials";
import { ActionButton } from "../kit/ActionButton";
import { Banner } from "../kit/Banner";
import { StatusChip } from "../kit/StatusChip";
import { MaterialIcon } from "../MaterialIcon";
import {
  backLabel,
  deliveryCells,
  LIST_PARAM,
  listContext,
  momentText,
  recordId,
  retainedUntil,
  submittedText,
} from "./application";
import { ApplicationForm } from "./ApplicationForm";
import { StatusPanel } from "./StatusPanel";

type Relation = number | string | { id: number | string } | null | undefined;

function relationID(value: Relation): number | string | undefined {
  if (value === null || value === undefined) return undefined;
  return typeof value === "object" ? value.id : value;
}

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export async function ApplicationView({
  doc,
  initPageResult,
  payload,
  permissions,
  searchParams,
}: DocumentViewServerProps) {
  const user = initPageResult.req.user;
  const id = doc.id as number | string;
  const tenant = relationID(doc.tenant as Relation);
  const adminRoute = payload.config.routes.admin;
  const listPath = formatAdminURL({
    adminRoute,
    path: "/collections/cv-submissions",
  });
  const rawList = searchParams?.[LIST_PARAM];
  const list = listContext(typeof rawList === "string" ? rawList : undefined);
  const canEdit = Boolean(permissions?.collections?.["cv-submissions"]?.update);
  const retentionMonths =
    (payload.config.custom?.cvRetentionMonths as number | undefined) ??
    DEFAULT_CV_RETENTION_MONTHS;

  const inList: Where[] = [
    ...(Object.keys(list.where).length > 0 ? [list.where] : []),
    ...(tenant === undefined ? [] : [{ tenant: { equals: tenant } }]),
  ];
  const statusSetBy = relationID(doc.statusChangedBy as Relation);
  const [siblings, setter, settings] = await Promise.all([
    payload.find({
      collection: "cv-submissions",
      where: inList.length > 0 ? { and: inList } : {},
      sort: list.sort || undefined,
      pagination: false,
      depth: 0,
      select: { submissionId: true },
      overrideAccess: false,
      user,
    }),
    statusSetBy === undefined
      ? Promise.resolve(undefined)
      : payload
          .find({
            collection: "users",
            where: { id: { equals: statusSetBy } },
            limit: 1,
            depth: 0,
            overrideAccess: false,
            user,
          })
          .then(({ docs }) => docs[0]),
    tenant === undefined
      ? Promise.resolve(undefined)
      : payload
          .find({
            collection: "tenant-settings",
            where: { tenant: { equals: tenant } },
            limit: 1,
            depth: 0,
            select: { recruiterEmail: true },
            overrideAccess: false,
            user,
          })
          .then(({ docs }) => docs[0]),
  ]);

  const ids = siblings.docs.map((sibling) => sibling.id);
  const position = ids.findIndex((sibling) => String(sibling) === String(id));
  const hrefFor = (target: number | string | undefined) =>
    target === undefined
      ? undefined
      : `${listPath}/${target}${list.query ? `?${LIST_PARAM}=${encodeURIComponent(list.query)}` : ""}`;
  const previousHref = position > 0 ? hrefFor(ids[position - 1]) : undefined;
  const nextHref =
    position >= 0 && position < ids.length - 1
      ? hrefFor(ids[position + 1])
      : undefined;

  const name = text(doc.applicantName);
  const email = text(doc.email);
  const recruiterEmail = settings?.recruiterEmail || undefined;
  const cells = deliveryCells(doc, recruiterEmail);
  const failed = doc.externalSyncStatus === "failed";
  const setBy = authorName(setter ?? statusSetBy, statusSetBy !== undefined);
  const setAt = momentText(doc.statusChangedAt);

  const sidebar = canEdit ? (
    <StatusPanel nextHref={nextHref} tenant={tenant} />
  ) : (
    <section className="dil-app-panel">
      <h2 className="dil-app-panel__title">Status</h2>
      <StatusChip set="application" status={doc.status} />
      {(setBy || setAt) && (
        <p className="dil-app-panel__note">
          Set by {[setBy, setAt].filter(Boolean).join(", ")}
        </p>
      )}
      <p className="dil-app-readonly">
        <MaterialIcon name="lock" />
        Read-only for Tenant Viewers.
      </p>
    </section>
  );

  const collection = payload.collections["cv-submissions"].config;
  const body = (
    <div className="dil-app">
      <SetDocumentStepNav
        collectionSlug={collection.slug}
        id={id}
        pluralLabel={collection.labels.plural}
        useAsTitle={collection.admin.useAsTitle}
      />
      <div className="dil-app__main">
        <nav aria-label="Application list" className="dil-app__nav">
          <a
            className="dil-app__back"
            href={`${listPath}${list.query ? `?${list.query}` : ""}`}
          >
            <MaterialIcon name="arrow_back" />
            {backLabel(list.status, siblings.totalDocs)}
          </a>
          {position >= 0 && (
            <span className="dil-app__pager">
              <span>
                {position + 1} of {ids.length}
              </span>
              <a
                aria-disabled={!previousHref}
                aria-label="Previous application"
                className="dil-app__step"
                href={previousHref}
              >
                <MaterialIcon name="chevron_left" />
              </a>
              <a
                aria-disabled={!nextHref}
                aria-label="Next application"
                className="dil-app__step"
                href={nextHref}
              >
                <MaterialIcon name="chevron_right" />
              </a>
            </span>
          )}
        </nav>

        <header className="dil-app__header">
          <span aria-hidden className="dil-app__avatar">
            {initials({ name })}
          </span>
          <div>
            <h1 className="dil-app__name">
              {name}
              <StatusChip set="application" status={doc.status} />
            </h1>
            <p className="dil-app__applied">
              Applied for <b>{text(doc.position)}</b> ·{" "}
              {submittedText(doc.submittedAt)}
            </p>
          </div>
        </header>

        <div className="dil-app__cards">
          <section className="dil-app-card">
            <header className="dil-app-card__header">
              <h2>Applicant</h2>
              <span className="dil-app-card__tag">
                <MaterialIcon name="lock" />
                As submitted
              </span>
            </header>
            <dl className="dil-app-card__list">
              <dt>Name</dt>
              <dd>{name}</dd>
              <dt>Email</dt>
              <dd>{email && <a href={`mailto:${email}`}>{email}</a>}</dd>
              <dt>Phone</dt>
              <dd>{text(doc.phone)}</dd>
            </dl>
          </section>
          <section className="dil-app-card">
            <header className="dil-app-card__header">
              <h2>Application</h2>
              <span className="dil-app-card__tag">
                <MaterialIcon name="lock" />
                As submitted
              </span>
            </header>
            <dl className="dil-app-card__list">
              <dt>Position</dt>
              <dd>{text(doc.position)}</dd>
              <dt>Submitted</dt>
              <dd>{submittedText(doc.submittedAt)}</dd>
              {canEdit && (
                <>
                  <dt>Résumé</dt>
                  <dd className="dil-app-card__resume">
                    {/* TODO(DILM-86): request a fresh signed link from GET /api/cv-submissions/:id/resume. */}
                    <ActionButton
                      icon="picture_as_pdf"
                      type="button"
                      unavailableReason="Résumé download isn't available yet."
                      variant="secondary"
                    >
                      View résumé
                    </ActionButton>
                    <span>Private file · each open is logged</span>
                  </dd>
                </>
              )}
            </dl>
          </section>
        </div>

        <section className="dil-app-card">
          <header className="dil-app-card__header">
            <h2>Delivery</h2>
            <span className="dil-app-card__tag">
              <MaterialIcon name="settings" />
              Managed by the system
            </span>
          </header>
          <div className="dil-app-delivery">
            {cells.map((cell) => (
              <div className="dil-app-delivery__cell" key={cell.key}>
                <span className="dil-app-delivery__heading">
                  {cell.heading}
                </span>
                <span
                  className={`dil-app-delivery__state dil-app-delivery__state--${cell.tone}`}
                >
                  <MaterialIcon name={cell.icon} />
                  {cell.title}
                </span>
                <span className="dil-app-delivery__detail">{cell.detail}</span>
              </div>
            ))}
          </div>
          {failed && (
            <Banner className="dil-app-delivery__banner" tone="error">
              The system retries automatically. If retries run out, the platform
              administrator is alerted. There&apos;s nothing you need to do
              here, and the application is safe in the CMS.
            </Banner>
          )}
        </section>
      </div>

      <aside className="dil-app__side">
        {sidebar}
        <section className="dil-app-panel dil-app-panel--record">
          <h2 className="dil-app-panel__title">Record</h2>
          <p className="dil-app-record__id">
            ID <code>{recordId(id, doc.submittedAt)}</code>
          </p>
          <p>
            Résumé kept until {retainedUntil(doc.submittedAt, retentionMonths)}{" "}
            ({retentionMonths} months)
          </p>
        </section>
      </aside>
    </div>
  );

  return canEdit ? <ApplicationForm>{body}</ApplicationForm> : body;
}
