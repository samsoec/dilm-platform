import type { Payload, TypedUser } from "payload";

import { hasTenantAccess } from "../../access";
import { categoryInUseMessage, type PostCount } from "../../categories";
import { localization } from "../../localization";
import {
  COMPANY_COLUMNS,
  slugText,
  type CompanySlug,
} from "../components/categories/categories";

export type CategoryCount = {
  slug: CompanySlug;
  label: string;
  name: string;
  count: number | undefined;
};

export type CategoryRow = {
  id: string;
  name: string;
  description: string;
  slugEn: string;
  slugId: string;
  counts: CategoryCount[];
  inUseMessage: string | undefined;
};

type Localized = Record<string, string | null | undefined> | string | null;

export async function loadCategories(
  payload: Payload,
  user: TypedUser,
  locale: string,
): Promise<CategoryRow[]> {
  const fallback = localization.defaultLocale;
  const [categories, tenants] = await Promise.all([
    payload.find({
      collection: "categories",
      locale: "all",
      fallbackLocale: false,
      select: { name: true, description: true, slug: true },
      sort: "id",
      pagination: false,
      depth: 0,
      overrideAccess: false,
      user,
    }),
    payload.find({
      collection: "tenants",
      select: { name: true, slug: true },
      pagination: false,
      depth: 0,
      overrideAccess: false,
      user,
    }),
  ]);
  const known = new Map(
    tenants.docs.map((tenant) => [
      tenant.slug as string,
      { id: tenant.id, name: tenant.name as string },
    ]),
  );
  return Promise.all(
    categories.docs.map(async (category): Promise<CategoryRow> => {
      const counts = await Promise.all(
        COMPANY_COLUMNS.map(async ({ slug, label }): Promise<CategoryCount> => {
          const tenant = known.get(slug);
          const name = tenant?.name ?? label;
          if (!tenant || !hasTenantAccess(user, tenant.id)) {
            return { slug, label, name, count: undefined };
          }
          const { totalDocs } = await payload.count({
            collection: "posts",
            where: {
              and: [
                { primaryCategory: { equals: category.id } },
                { tenant: { equals: tenant.id } },
              ],
            },
            trash: true,
            overrideAccess: false,
            user,
          });
          return { slug, label, name, count: totalDocs };
        }),
      );
      const name = slugText(category.name as Localized, locale, fallback);
      const used: PostCount[] = counts.flatMap(({ name: company, count }) =>
        count ? [{ company, count }] : [],
      );
      return {
        id: String(category.id),
        name,
        description: slugText(
          category.description as Localized,
          locale,
          fallback,
        ),
        slugEn: slugText(category.slug as Localized, "en", fallback),
        slugId: slugText(category.slug as Localized, "id", fallback),
        counts,
        inUseMessage:
          used.length > 0 ? categoryInUseMessage(name, used) : undefined,
      };
    }),
  );
}
