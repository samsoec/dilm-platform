import type { UIFieldServerProps } from "payload";

import { CategorySlugWarning } from "./CategorySlugWarning";

export async function CategorySlugImpactField({
  payload,
  req,
  id,
  data,
}: Pick<UIFieldServerProps, "payload" | "req" | "id" | "data">) {
  const user = req.user;
  if (!user || !id) return null;
  const { totalDocs } = await payload.count({
    collection: "posts",
    where: { primaryCategory: { equals: id } },
    trash: true,
    overrideAccess: false,
    user,
  });
  const slug = (data as { slug?: string | null } | undefined)?.slug ?? "";
  return <CategorySlugWarning initial={slug} posts={totalDocs} />;
}
