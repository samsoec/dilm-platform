import type { UIFieldServerProps } from "payload";

import type { RoleHolder } from "../../../access";
import { Banner } from "../kit/Banner";
import { canEditProduct, ownerBannerText } from "./catalog";

async function ownerBanner(
  { data, payload, req }: UIFieldServerProps,
  noun?: string,
) {
  const user = req.user;
  const tenant = data?.tenant as
    number | string | { id: number | string } | undefined;
  if (!user || tenant === undefined || tenant === null) return null;
  const owner = String(typeof tenant === "object" ? tenant.id : tenant);
  if (canEditProduct(user as RoleHolder, owner)) return null;
  try {
    const { docs } = await payload.find({
      collection: "tenants",
      where: { id: { equals: owner } },
      select: { name: true },
      limit: 1,
      depth: 0,
      overrideAccess: false,
      user,
    });
    return (
      <Banner icon="lock" tone="readonly">
        {ownerBannerText(docs[0]?.name ?? "another company", noun)}
      </Banner>
    );
  } catch (error) {
    payload.logger.error({ err: error, msg: "Couldn't name the owner" });
    return (
      <Banner icon="lock" tone="readonly">
        {ownerBannerText("another company", noun)}
      </Banner>
    );
  }
}

export function ProductOwnerBanner(props: UIFieldServerProps) {
  return ownerBanner(props);
}

export function SolutionOwnerBanner(props: UIFieldServerProps) {
  return ownerBanner(props, "solution");
}
