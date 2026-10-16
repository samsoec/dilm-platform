import type { CollectionSlug, UIFieldServerProps } from "payload";

import { savedAtText } from "../../layoutEditor";
import { MaterialIcon } from "../MaterialIcon";

function relationID(value: unknown): number | string | undefined {
  if (typeof value === "number" || typeof value === "string") return value;
  if (value && typeof value === "object" && "id" in value) {
    return (value as { id: number | string }).id;
  }
  return undefined;
}

export async function VersionInfo({
  collectionSlug,
  data,
  id,
  payload,
  req,
}: UIFieldServerProps) {
  if (id === undefined || !req.user) return null;
  const savedBy = relationID(data?.updatedBy);
  const [{ totalDocs: versions }, editors] = await Promise.all([
    payload.countVersions({
      collection: collectionSlug as CollectionSlug,
      where: { parent: { equals: id } },
      overrideAccess: false,
      user: req.user,
    }),
    savedBy === undefined
      ? Promise.resolve({ docs: [] })
      : payload.find({
          collection: "users",
          where: { id: { equals: savedBy } },
          limit: 1,
          pagination: false,
          depth: 0,
          select: { name: true, email: true },
          overrideAccess: false,
          user: req.user,
        }),
  ]);
  const editor = editors.docs[0] as
    { name?: string | null; email?: string | null } | undefined;
  const savedAt = savedAtText(data?.updatedAt);
  const by = editor?.name || editor?.email;

  return (
    <section className="dil-side-panel dil-version-info">
      <h3 className="dil-side-panel__title">
        <MaterialIcon name="history" />
        Version {Math.max(versions, 1)}
      </h3>
      {savedAt && (
        <p className="dil-version-info__saved">
          Saved {savedAt}
          {by && <> by {by}</>}
        </p>
      )}
    </section>
  );
}
