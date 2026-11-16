import { cookies } from "next/headers";
import type { UIFieldServerProps } from "payload";

import type { RoleHolder } from "../../../access";
import {
  blankJobEditor,
  loadJobEditor,
  type JobEditorData,
} from "../../data/jobEditor";
import { selectedTenantID, TENANT_COOKIE } from "../../data/sidebar";
import { EditorActions } from "../editor/EditorChrome";
import { JobHeader } from "./JobEditorParts";

async function loadFor({
  payload,
  req,
  id,
}: Pick<UIFieldServerProps, "payload" | "req" | "id">): Promise<JobEditorData> {
  const user = req.user;
  if (!user) return blankJobEditor;
  try {
    const selected = selectedTenantID(
      user as RoleHolder,
      (await cookies()).get(TENANT_COOKIE)?.value,
    );
    return await loadJobEditor(
      payload,
      user,
      id === undefined ? undefined : String(id),
      selected,
    );
  } catch (error) {
    payload.logger.error({ err: error, msg: "Couldn't load the job editor" });
    return blankJobEditor;
  }
}

export async function JobHeaderField(props: UIFieldServerProps) {
  const data = await loadFor(props);
  return (
    <JobHeader
      careerPaths={data.careerPaths}
      domain={data.domain}
      slugs={{}}
      status={data.status}
    />
  );
}

export async function JobActionsField(props: UIFieldServerProps) {
  const data = await loadFor(props);
  return (
    <EditorActions
      ancestors={[]}
      initials=""
      publishBlock={data.publishBlock}
      seed={{ collection: "jobs", parentPaths: {}, slugs: {} }}
    />
  );
}
