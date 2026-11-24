import type { UIFieldServerProps } from "payload";

import { localization } from "../../../localization";
import {
  blankProductEditor,
  loadProductEditor,
  type ProductEditorData,
} from "../../data/productEditor";
import type { UsedInData } from "../kit/usedIn";
import { loadUsedIn } from "../../data/usedIn";
import { baseNote } from "../../../siteRouting";
import { EditorActions } from "../editor/EditorChrome";
import {
  ProductHeader,
  ProductSidebar,
  ProductTabMarks,
} from "./ProductEditorParts";
import { SolutionTabMarks } from "../solutions/SolutionEditorParts";

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

async function loadFor(
  { payload, req, id }: Pick<UIFieldServerProps, "payload" | "req" | "id">,
  collection: "products" | "solutions" = "products",
): Promise<ProductEditorData> {
  const user = req.user;
  if (!user) return blankProductEditor();
  try {
    return await loadProductEditor(
      payload,
      user,
      id === undefined ? undefined : String(id),
      String(req.locale ?? localization.defaultLocale),
      collection,
    );
  } catch (error) {
    payload.logger.error({
      err: error,
      msg: `Couldn't load the ${collection} editor`,
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

async function actions(
  { payload, req }: Pick<UIFieldServerProps, "payload" | "req">,
  collection: "products" | "solutions",
) {
  const note = req.user
    ? await baseNote(
        payload,
        { user: req.user },
        collection === "products" ? "productsPage" : "solutionsPage",
      ).catch(() => null)
    : null;
  return (
    <EditorActions
      ancestors={[]}
      baseNote={note ?? undefined}
      initials=""
      readOnlyNotice={false}
      seed={{ collection, parentPaths: {}, slugs: {} }}
      shared
    />
  );
}

export function ProductActionsField(props: UIFieldServerProps) {
  return actions(props, "products");
}

export function SolutionActionsField(props: UIFieldServerProps) {
  return actions(props, "solutions");
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

export async function SolutionHeaderField(props: UIFieldServerProps) {
  const data = await loadFor(props, "solutions");
  return (
    <ProductHeader
      domains={data.domains}
      noun="solution"
      path={data.path}
      status={data.status}
    />
  );
}

export function SolutionTabMarksField() {
  return <SolutionTabMarks />;
}

export async function SolutionSidebarField(props: UIFieldServerProps) {
  const data = await loadFor(props, "solutions");
  const usedIn = await usedInFor(props, "solutions");
  return (
    <ProductSidebar
      canEdit={data.canEdit}
      liveSince={data.liveSince}
      noun="solution"
      owner={data.owner}
      savedAt={data.savedAt}
      savedBy={data.savedBy}
      status={data.status}
      usedIn={usedIn}
      versions={data.versions}
    />
  );
}
