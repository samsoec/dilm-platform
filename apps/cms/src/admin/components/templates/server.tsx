import { cookies } from "next/headers";
import type { UIFieldServerProps } from "payload";

import { selectedTenantID, TENANT_COOKIE } from "../../data/sidebar";
import {
  loadTemplateEditor,
  type TemplateEditorData,
} from "../../data/templateEditor";
import type { RoleHolder } from "../../../access";
import { Banner } from "../kit/Banner";
import { EditorActions } from "../editor/EditorChrome";
import { companyInitials } from "../ir/irEditor";
import { TemplateHeader } from "./TemplateHeader";
import { TemplateSidebar } from "./TemplateSidebar";
import { TemplateStrip } from "./TemplateStrip";
import { templateTitle } from "./templates";

async function load(props: UIFieldServerProps): Promise<{
  data: TemplateEditorData | null;
  failed: boolean;
}> {
  const { payload, req, id, collectionSlug } = props;
  if (!req.user || id === undefined) return { data: null, failed: false };
  try {
    const selected = selectedTenantID(
      req.user as RoleHolder,
      (await cookies()).get(TENANT_COOKIE)?.value,
    );
    return {
      data: await loadTemplateEditor(
        payload,
        req.user,
        collectionSlug as TemplateEditorData["collection"],
        String(id),
        selected === undefined ? undefined : String(selected),
      ),
      failed: false,
    };
  } catch (error) {
    payload.logger.error({ err: error, msg: "Couldn't load the template" });
    return { data: null, failed: true };
  }
}

const NOT_LOADED = "Couldn't load the template details. You can still edit it.";

export async function TemplateHeaderField(props: UIFieldServerProps) {
  const { data, failed } = await load(props);
  const shared = props.collectionSlug === "shared-detail-templates";
  const type = data?.recordType ?? (props.data?.recordType as never);
  return (
    <TemplateHeader
      domain={data?.sites[0]}
      shared={shared}
      status={data?.status ?? "draft"}
      title={templateTitle(type)}
    >
      {failed && (
        <Banner className="dil-editor-banner" icon="cloud_off" tone="error">
          {NOT_LOADED}
        </Banner>
      )}
      {data && <TemplateStrip items={data.strip} />}
    </TemplateHeader>
  );
}

export async function TemplateActionsField(props: UIFieldServerProps) {
  const { data } = await load(props);
  const type = (data?.recordType ?? props.data?.recordType) as never;
  return (
    <EditorActions
      ancestors={[]}
      home
      initials={companyInitials(data?.companyName)}
      label={`the ${templateTitle(type).toLowerCase()}`}
      seed={{ collection: "pages", parentPaths: {}, slugs: {}, domains: [] }}
      shared={props.collectionSlug === "shared-detail-templates"}
    />
  );
}

export async function TemplateSidebarField(props: UIFieldServerProps) {
  const { data } = await load(props);
  if (!data) return null;
  return (
    <TemplateSidebar
      categoryPaths={data.categoryPaths}
      governed={data.governed}
      isCategory={data.recordType === "category"}
      sites={data.sites}
    />
  );
}
