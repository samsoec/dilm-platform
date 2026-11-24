import { Gutter } from "@payloadcms/ui";
import type { ListViewServerProps } from "payload";
import { formatAdminURL } from "payload/shared";
import { Suspense } from "react";

import { isSuperAdmin, type RoleHolder } from "../../../access";
import { localization } from "../../../localization";
import { loadSharedPagesTree } from "../../data/pagesTree";
import { ActionButton } from "../kit/ActionButton";
import { Banner } from "../kit/Banner";
import { Skeleton } from "../kit/Loading";
import { isTrashView } from "../trash/trash";
import { PagesRetry } from "./PagesRetry";
import { ListStepNav } from "../topbar/ListStepNav";
import { PagesTree } from "./PagesTree";
import { buildTree, toRows, toTrashRows, type Viewer } from "./pagesModel";

function Heading({
  createHref,
  viewer,
}: {
  createHref: string;
  viewer: Viewer;
}) {
  return (
    <div className="dil-pages__heading">
      <div>
        <h1 className="dil-pages__title">Shared pages</h1>
        <p className="dil-pages__intro">
          Pages that appear on all 3 sites, nested by parent.
        </p>
      </div>
      {viewer.canEdit && (
        <ActionButton el="link" icon="add" url={createHref}>
          New shared page
        </ActionButton>
      )}
    </div>
  );
}

async function SharedPagesData(
  props: ListViewServerProps & { viewer: Viewer },
) {
  const { payload, user, params, locale, viewer } = props;
  if (!user) return null;
  const code = String(locale?.code ?? localization.defaultLocale);
  const createHref = formatAdminURL({
    adminRoute: payload.config.routes.admin,
    path: "/collections/shared-pages/create",
  });
  try {
    const data = await loadSharedPagesTree({ payload, user }, code);
    const context = {
      locale: code,
      defaultLocale: localization.defaultLocale,
      header: { keys: new Set<string>(), paths: new Set<string>() },
      otherTargets: data.otherTargets,
      tenants: data.sites.map(({ id, domain }) => ({ id, domain })),
      skipHeaderTag: true,
      now: new Date(),
    };
    const rows = toRows(buildTree(data.records), context);
    const liveKeys = new Set(data.records.map(({ key }) => key));
    return (
      <>
        <Heading createHref={createHref} viewer={viewer} />
        <PagesTree
          company={{ name: "all sites", initials: "all sites" }}
          initialFilter={isTrashView(params) ? "trash" : "all"}
          locale={code}
          noCompany={false}
          rows={rows}
          scope="shared"
          trash={toTrashRows(data.trashed, context, liveKeys)}
          viewer={viewer}
        />
      </>
    );
  } catch (error) {
    payload.logger.error({
      err: error,
      msg: "Couldn't load the Shared pages tree",
    });
    return (
      <>
        <Heading createHref={createHref} viewer={viewer} />
        <Banner
          action={<PagesRetry />}
          className="dil-pages__banner"
          icon="cloud_off"
          tone="error"
        >
          Couldn&apos;t load shared pages.
        </Banner>
      </>
    );
  }
}

export function SharedPagesView(props: ListViewServerProps) {
  const superAdmin = isSuperAdmin(props.user as RoleHolder);
  const viewer: Viewer = {
    superAdmin,
    canEdit:
      superAdmin &&
      Boolean(props.permissions?.collections?.["shared-pages"]?.create),
  };
  return (
    <div className="collection-list dil-pages-view">
      <ListStepNav label="Shared pages" />
      <Gutter>
        <Suspense
          fallback={
            <div aria-busy="true" className="dil-pages__loading" role="status">
              <span className="dil-sr-only">Loading shared pages</span>
              <div className="dil-pages__card">
                <Skeleton lines={3} />
              </div>
            </div>
          }
        >
          <SharedPagesData {...props} viewer={viewer} />
        </Suspense>
      </Gutter>
    </div>
  );
}
