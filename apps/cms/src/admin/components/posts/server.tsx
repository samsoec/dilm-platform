import { cookies } from "next/headers";
import type { UIFieldServerProps } from "payload";

import type { RoleHolder } from "../../../access";
import { localization } from "../../../localization";
import {
  blankPostEditor,
  loadPostEditor,
  type PostEditorData,
} from "../../data/postEditor";
import { selectedTenantID, TENANT_COOKIE } from "../../data/sidebar";
import { EditorActions } from "../editor/EditorChrome";
import {
  CategoryDescription,
  PostHeader,
  PostSidebar,
} from "./PostEditorParts";

type Props = Pick<UIFieldServerProps, "payload" | "req" | "id">;

const loaded = new WeakMap<object, Promise<PostEditorData>>();

function loadFor(props: Props): Promise<PostEditorData> {
  const known = loaded.get(props.req);
  if (known) return known;
  const next = load(props);
  loaded.set(props.req, next);
  return next;
}

async function load({ payload, req, id }: Props): Promise<PostEditorData> {
  const user = req.user;
  if (!user) return blankPostEditor;
  try {
    const selected = selectedTenantID(
      user as RoleHolder,
      (await cookies()).get(TENANT_COOKIE)?.value,
    );
    return await loadPostEditor(
      payload,
      user,
      id === undefined ? undefined : String(id),
      selected,
      String(req.locale ?? localization.defaultLocale),
    );
  } catch (error) {
    payload.logger.error({ err: error, msg: "Couldn't load the post editor" });
    return blankPostEditor;
  }
}

export async function PostHeaderField(props: UIFieldServerProps) {
  const data = await loadFor(props);
  return (
    <PostHeader
      categoryPaths={data.categoryPaths}
      domain={data.domain}
      slugs={data.slugs}
      status={data.status}
    />
  );
}

export function PostActionsField() {
  return (
    <EditorActions
      ancestors={[]}
      initials=""
      seed={{ collection: "posts", parentPaths: {}, slugs: {} }}
    />
  );
}

export async function PostSidebarField(props: UIFieldServerProps) {
  const data = await loadFor(props);
  return (
    <PostSidebar
      categoryNames={data.categoryNames}
      liveSince={data.liveSince}
      publicationSet={data.publicationSet}
      savedAt={data.savedAt}
      savedBy={data.savedBy}
      sections={data.sections}
      status={data.status}
      versions={data.versions}
    />
  );
}

export async function CategoryDescriptionField(props: UIFieldServerProps) {
  const data = await loadFor(props);
  return <CategoryDescription descriptions={data.categoryDescriptions} />;
}
