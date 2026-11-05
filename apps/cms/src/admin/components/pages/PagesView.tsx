import { cookies } from "next/headers";
import { Gutter } from "@payloadcms/ui";
import type { ListViewServerProps } from "payload";
import { formatAdminURL } from "payload/shared";
import { Suspense } from "react";

import {
  isSuperAdmin,
  isTenantEditorOrAbove,
  type RoleHolder,
} from "../../../access";
import { localization } from "../../../localization";
import { loadPagesTree } from "../../data/pagesTree";
import { selectedTenantID, TENANT_COOKIE } from "../../data/sidebar";
import { Banner } from "../kit/Banner";
import { Skeleton } from "../kit/Loading";
import { companyInitials } from "../ir/irEditor";
import { isTrashView } from "../trash/trash";
import { NewPageButton, NewPageHost } from "./NewPageHost";
import { PagesRetry } from "./PagesRetry";
import { PagesStepNav } from "./PagesStepNav";
import { PagesTree } from "./PagesTree";
import {
  buildTree,
  canCreatePage,
  toRows,
  toTrashRows,
  type Viewer,
} from "./pagesModel";

function Heading({
  domain,
  viewer,
  createHref,
}: {
  domain?: string;
  viewer: Viewer;
  createHref?: string;
}) {
  return (
    <div className="dil-pages__heading">
      <div>
        <h1 className="dil-pages__title">Pages</h1>
        <p className="dil-pages__intro">
          Every page on {domain ?? "the company website"}, nested by parent.
          Shared pages are listed too, so you can see which URLs are taken.
        </p>
      </div>
      {canCreatePage(viewer) && createHref && (
        <NewPageButton fallbackHref={createHref} />
      )}
    </div>
  );
}

async function PagesData(props: ListViewServerProps & { viewer: Viewer }) {
  const { payload, user, params, locale, viewer } = props;
  if (!user) return null;
  const code = String(locale?.code ?? localization.defaultLocale);
  const tenant = selectedTenantID(
    user as RoleHolder,
    (await cookies()).get(TENANT_COOKIE)?.value,
  );
  const createHref = formatAdminURL({
    adminRoute: payload.config.routes.admin,
    path: "/collections/pages/create",
  });
  try {
    const data = await loadPagesTree({ payload, user }, tenant, code);
    const now = new Date();
    const context = {
      locale: code,
      defaultLocale: localization.defaultLocale,
      careerKey: data.careerKey,
      publicationKey: data.publicationKey,
      header: {
        keys: new Set(data.header.keys),
        paths: new Set(data.header.paths),
      },
      otherTargets: data.otherTargets,
      tenants: data.company
        ? [{ id: data.company.id, domain: data.company.domain }]
        : [],
      now,
    };
    const rows = toRows(buildTree(data.records), context);
    const liveKeys = new Set(data.records.map(({ key }) => key));
    const trash = toTrashRows(data.trashed, context, liveKeys);
    const content = (
      <>
        <Heading
          createHref={tenant === undefined ? undefined : createHref}
          domain={data.company?.domain}
          viewer={viewer}
        />
        <PagesTree
          company={{
            name: data.company?.name ?? "this company",
            initials: companyInitials(data.company?.name),
          }}
          initialFilter={isTrashView(params) ? "trash" : "all"}
          locale={code}
          noCompany={tenant === undefined}
          rows={rows}
          trash={trash}
          viewer={viewer}
        />
      </>
    );
    return data.company && canCreatePage(viewer) ? (
      <NewPageHost tenant={data.company}>{content}</NewPageHost>
    ) : (
      content
    );
  } catch (error) {
    payload.logger.error({ err: error, msg: "Couldn't load the Pages tree" });
    return (
      <>
        <Heading createHref={createHref} viewer={viewer} />
        <Banner
          action={<PagesRetry />}
          className="dil-pages__banner"
          icon="cloud_off"
          tone="error"
        >
          Couldn&apos;t load pages.
        </Banner>
      </>
    );
  }
}

export function PagesView(props: ListViewServerProps) {
  const viewer: Viewer = {
    superAdmin: isSuperAdmin(props.user as RoleHolder),
    canEdit:
      isTenantEditorOrAbove(props.user as RoleHolder) &&
      Boolean(props.permissions?.collections?.pages?.create),
  };
  return (
    <div className="collection-list dil-pages-view">
      <PagesStepNav />
      <Gutter>
        <Suspense
          fallback={
            <div aria-busy="true" className="dil-pages__loading" role="status">
              <span className="dil-sr-only">Loading pages</span>
              <div className="dil-pages__card">
                <Skeleton lines={3} />
              </div>
            </div>
          }
        >
          <PagesData {...props} viewer={viewer} />
        </Suspense>
      </Gutter>
    </div>
  );
}
