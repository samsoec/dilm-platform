import { cookies } from "next/headers";
import type { UIFieldServerProps } from "payload";

import { isSuperAdmin, type RoleHolder } from "../../../access";
import { selectedTenantID, TENANT_COOKIE } from "../../data/sidebar";
import { Banner } from "../kit/Banner";
import { ownerBannerText } from "./catalog";

export async function ProductOwnerBanner({
  data,
  payload,
  req,
}: UIFieldServerProps) {
  const user = req.user;
  const tenant = data?.tenant as
    number | string | { id: number | string } | undefined;
  if (!user || tenant === undefined || tenant === null) return null;
  const owner = String(typeof tenant === "object" ? tenant.id : tenant);
  const selected = selectedTenantID(
    user as RoleHolder,
    (await cookies()).get(TENANT_COOKIE)?.value,
  );
  if (isSuperAdmin(user as RoleHolder) || owner === String(selected)) {
    return null;
  }
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
        {ownerBannerText(docs[0]?.name ?? "another company")}
      </Banner>
    );
  } catch (error) {
    payload.logger.error({ err: error, msg: "Couldn't name the owner" });
    return (
      <Banner icon="lock" tone="readonly">
        {ownerBannerText("another company")}
      </Banner>
    );
  }
}
