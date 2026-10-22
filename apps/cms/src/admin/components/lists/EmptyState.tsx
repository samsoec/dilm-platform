import { cookies } from "next/headers";
import Link from "next/link";
import type { BeforeListTableServerProps } from "payload";
import { formatAdminURL } from "payload/shared";

import type { RoleHolder } from "../../../access";
import { selectedTenantID, TENANT_COOKIE } from "../../data/sidebar";
import { MaterialIcon } from "../MaterialIcon";
import { ActionButton } from "../kit/ActionButton";
import { Banner } from "../kit/Banner";
import { Tag } from "../kit/Tag";
import { GRID_PATH, isGridView } from "../media/media";
import { isTrashView } from "../trash/trash";
import { UploadPdfButton } from "../ir/IrToolbarClient";
import {
  emptyCopy,
  type EmptyStateSlug,
  hasActiveQuery,
  isEmptyStateSlug,
  noMatchesTitle,
  RECRUITER_BANNER,
} from "./emptyCopy";
import { EmptyUploadImages } from "./EmptyUploadImages";
import type { SearchParams } from "./statusQuery";

async function tenantContext({
  payload,
  slug,
  user,
}: Pick<BeforeListTableServerProps, "payload" | "user"> & {
  slug: EmptyStateSlug;
}) {
  const tenant = user
    ? selectedTenantID(
        user as RoleHolder,
        (await cookies()).get(TENANT_COOKIE)?.value,
      )
    : undefined;
  if (tenant === undefined) return {};
  const { docs } = await payload.find({
    collection: "tenants",
    where: { id: { equals: tenant } },
    select: { name: true, domain: true },
    limit: 1,
    depth: 0,
    overrideAccess: false,
    user,
  });
  const careers =
    slug === "cv-submissions"
      ? await payload
          .find({
            collection: "tenant-settings",
            where: { tenant: { equals: tenant } },
            select: { recruiterEmail: true },
            limit: 1,
            depth: 0,
            overrideAccess: false,
            user,
          })
          .then(({ docs: found }) => ({
            recruiterMissing: !found[0]?.recruiterEmail?.trim(),
            settingsID: found[0]?.id,
          }))
      : undefined;
  return {
    company: docs[0]?.name || undefined,
    domain: docs[0]?.domain || undefined,
    careers,
  };
}

export async function EmptyState(props: BeforeListTableServerProps) {
  const { collectionSlug, data, params, payload, searchParams, user } = props;
  if (!user || !isEmptyStateSlug(collectionSlug) || isTrashView(params)) {
    return null;
  }
  const docs = (data as { docs?: unknown[] } | undefined)?.docs;
  if (!Array.isArray(docs) || docs.length > 0) return null;

  const adminRoute = payload.config.routes.admin;
  const listPath: `/${string}` = `/collections/${collectionSlug}${isGridView(params) ? GRID_PATH : ""}`;

  if (hasActiveQuery(searchParams as SearchParams | undefined)) {
    return (
      <section className="dil-empty dil-empty--filtered">
        <span aria-hidden className="dil-empty__icon">
          <MaterialIcon name="search_off" />
        </span>
        <h3 className="dil-empty__title">{noMatchesTitle(collectionSlug)}</h3>
        <ActionButton
          el="link"
          icon="filter_alt_off"
          url={formatAdminURL({ adminRoute, path: listPath })}
          variant="secondary"
        >
          Clear filters
        </ActionButton>
      </section>
    );
  }

  const { company, domain, careers } = await tenantContext({
    payload,
    slug: collectionSlug,
    user,
  });
  const copy = emptyCopy(collectionSlug, { company, domain });
  return (
    <>
      {careers?.recruiterMissing && (
        <Banner
          action={
            <Link
              href={formatAdminURL({
                adminRoute,
                path: careers.settingsID
                  ? `/collections/tenant-settings/${careers.settingsID}?tab=careers`
                  : "/collections/tenant-settings",
              })}
            >
              Company settings › Careers
            </Link>
          }
          className="dil-empty__banner"
          icon="mail"
          tone="warning"
        >
          {RECRUITER_BANNER}
        </Banner>
      )}
      <section
        className={`dil-empty${collectionSlug === "media" ? " dil-empty--dropzone" : ""}`}
      >
        <span aria-hidden className="dil-empty__icon">
          <MaterialIcon name={copy.icon} />
        </span>
        <h3 className="dil-empty__title">{copy.title}</h3>
        {copy.lines.map((line) => (
          <p className="dil-empty__text" key={line}>
            {line}
          </p>
        ))}
        {collectionSlug === "ir-documents" && <UploadPdfButton />}
        {collectionSlug === "media" && <EmptyUploadImages />}
        {collectionSlug === "consent-logs" && (
          <Tag icon="lock">Read-only · UU PDP audit trail</Tag>
        )}
      </section>
    </>
  );
}
