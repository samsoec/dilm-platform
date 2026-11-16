import { localization } from "../../localization";
import type { AdminQueryContext } from "./badges";
import {
  catalogWhere,
  matchesStatus,
  SOLUTION_SEARCH_FIELDS,
  type CatalogQuery,
} from "../components/products/catalog";
import {
  getPublishStatus,
  type PublishStatus,
} from "../components/kit/publication";
import { CATALOG_LIMIT, ownerID, publishedIDs } from "./productsCatalog";

export type SolutionRow = {
  id: string;
  name: string;
  industry: string;
  owner: string;
  status: PublishStatus;
  updatedAt: string;
};

export type SolutionsData = {
  rows: SolutionRow[];
  truncated: boolean;
  otherCount: number;
};

export async function loadSolutions(
  context: AdminQueryContext,
  query: CatalogQuery,
  selected: string | undefined,
  locale: "en" | "id" = localization.defaultLocale,
): Promise<SolutionsData> {
  const { payload, user } = context;
  const { docs } = await payload.find({
    collection: "solutions",
    where: catalogWhere(query, SOLUTION_SEARCH_FIELDS),
    draft: true,
    sort: "name",
    limit: CATALOG_LIMIT,
    depth: 0,
    locale,
    select: {
      name: true,
      industryLabel: true,
      tenant: true,
      _status: true,
      updatedAt: true,
    },
    overrideAccess: false,
    user,
  });
  const published = await publishedIDs(
    context,
    docs.map(({ id }) => id),
    "solutions",
  );
  const rows = docs
    .map((solution): SolutionRow => ({
      id: String(solution.id),
      name: solution.name ?? "",
      industry: solution.industryLabel ?? "",
      owner: ownerID(solution.tenant),
      status: getPublishStatus(
        { _status: solution._status },
        { hasPublishedVersion: published.has(String(solution.id)) },
      ),
      updatedAt: solution.updatedAt,
    }))
    .filter(({ status }) => matchesStatus(status, query.status));
  const otherCount =
    selected === undefined
      ? 0
      : (
          await payload.count({
            collection: "solutions",
            where: { tenant: { not_equals: selected } },
            overrideAccess: false,
            user,
          })
        ).totalDocs;
  return { rows, truncated: docs.length >= CATALOG_LIMIT, otherCount };
}
