import type { Payload, TypedUser } from "payload";

import { baseNote, baseState, type BaseNote } from "../../siteRouting";
import { relationId } from "../components/editor/urls";
import {
  getPublishStatus,
  type PublishStatus,
} from "../components/kit/publication";
import { loadCompany } from "./jobsList";

export type JobEditorData = {
  status: PublishStatus;
  domain: string;
  careerPaths: Record<string, string | null | undefined> | undefined;
  baseNote: BaseNote | null;
};

export const blankJobEditor: JobEditorData = {
  status: "draft",
  domain: "",
  careerPaths: undefined,
  baseNote: null,
};

export async function loadJobEditor(
  payload: Payload,
  user: TypedUser,
  id: string | undefined,
  selected: number | string | undefined,
): Promise<JobEditorData> {
  let tenant: number | string | undefined = selected;
  let status: PublishStatus = "draft";
  if (id !== undefined) {
    const doc = await payload.findByID({
      collection: "jobs",
      id,
      draft: true,
      depth: 0,
      trash: true,
      overrideAccess: false,
      user,
    });
    tenant = relationId(doc.tenant as never) ?? tenant;
    const live = await payload.findVersions({
      collection: "jobs",
      where: {
        and: [
          { parent: { equals: id } },
          { "version._status": { equals: "published" } },
        ],
      },
      limit: 1,
      depth: 0,
      overrideAccess: false,
      user,
    });
    status = getPublishStatus(
      { _status: doc._status, deletedAt: doc.deletedAt },
      { hasPublishedVersion: live.totalDocs > 0 },
    );
  }
  if (tenant === undefined) return { ...blankJobEditor, status };
  const company = await loadCompany(payload, user, tenant);
  const state = await baseState(
    payload,
    { user },
    "careerPage",
    String(tenant),
  );
  return {
    status,
    domain: company.domain,
    careerPaths:
      state.state === "unset" ? undefined : (state.page.paths as never),
    baseNote: await baseNote(payload, { user }, "careerPage", String(tenant)),
  };
}
