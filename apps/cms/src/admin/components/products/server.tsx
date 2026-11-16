import type { UIFieldServerProps } from "payload";

import { localization } from "../../../localization";
import {
  blankProductEditor,
  loadProductEditor,
  type ProductEditorData,
} from "../../data/productEditor";
import type { UsedInData } from "../kit/usedIn";
import { loadUsedIn } from "../../data/usedIn";
import { EditorActions } from "../editor/EditorChrome";
import {
  ProductHeader,
  ProductSidebar,
  ProductTabMarks,
} from "./ProductEditorParts";

export async function usedInFor(
  { payload, req, id }: Pick<UIFieldServerProps, "payload" | "req" | "id">,
  collection: string,
): Promise<UsedInData> {
  const empty: UsedInData = { rows: [], hidden: 0, unit: "places" };
  if (!req.user || id === undefined) return empty;
  try {
    return await loadUsedIn(
      payload,
      req.user,
      collection,
      String(id),
      String(req.locale ?? localization.defaultLocale),
    );
  } catch (error) {
    payload.logger.error({ err: error, msg: "Couldn't load Used in" });
    return empty;
  }
}

async function loadFor({
  payload,
  req,
  id,
}: Pick<
  UIFieldServerProps,
  "payload" | "req" | "id"
>): Promise<ProductEditorData> {
  const user = req.user;
  if (!user) return blankProductEditor();
  try {
    return await loadProductEditor(
      payload,
      user,
      id === undefined ? undefined : String(id),
      String(req.locale ?? localization.defaultLocale),
    );
  } catch (error) {
    payload.logger.error({
      err: error,
      msg: "Couldn't load the product editor",
    });
    return blankProductEditor();
  }
}

export async function ProductHeaderField(props: UIFieldServerProps) {
  const data = await loadFor(props);
  return (
    <ProductHeader
      domains={data.domains}
      path={data.path}
      status={data.status}
    />
  );
}

export function ProductActionsField() {
  return (
    <EditorActions
      ancestors={[]}
      initials=""
      readOnlyNotice={false}
      seed={{ collection: "products", parentPaths: {}, slugs: {} }}
      shared
    />
  );
}

export function ProductTabMarksField() {
  return <ProductTabMarks />;
}

export async function ProductSidebarField(props: UIFieldServerProps) {
  const data = await loadFor(props);
  const usedIn = await usedInFor(props, "products");
  return (
    <ProductSidebar
      canEdit={data.canEdit}
      liveSince={data.liveSince}
      owner={data.owner}
      savedAt={data.savedAt}
      savedBy={data.savedBy}
      status={data.status}
      usedIn={usedIn}
      versions={data.versions}
    />
  );
}
