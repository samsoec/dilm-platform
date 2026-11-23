import { Gutter } from "@payloadcms/ui";
import { ListStepNav } from "../topbar/ListStepNav";
import { cookies } from "next/headers";
import type { ListViewServerProps } from "payload";

import type { RoleHolder } from "../../../access";
import { selectedTenantID, TENANT_COOKIE } from "../../data/sidebar";
import { loadStrip } from "../../data/templateEditor";
import { Banner } from "../kit/Banner";
import { TemplateStrip } from "./TemplateStrip";

export async function TemplatesView({ payload, user }: ListViewServerProps) {
  if (!user) return null;
  const selected = selectedTenantID(
    user as RoleHolder,
    (await cookies()).get(TENANT_COOKIE)?.value,
  );
  try {
    const items = await loadStrip({
      payload,
      user,
      tenant: selected === undefined ? undefined : String(selected),
    });
    return (
      <Gutter>
        <ListStepNav label="Detail templates" />
        <div className="dil-pages__heading">
          <div>
            <h1 className="dil-pages__title">Detail templates</h1>
            <p className="dil-pages__intro">
              One layout for every product, solution, job, post and category
              page. Pick a template to edit it.
            </p>
          </div>
        </div>
        <TemplateStrip items={items} />
      </Gutter>
    );
  } catch (error) {
    payload.logger.error({ err: error, msg: "Couldn't load the templates" });
    return (
      <Gutter>
        <ListStepNav label="Detail templates" />
        <Banner icon="cloud_off" tone="error">
          Couldn&apos;t load the templates. Reload the page to try again.
        </Banner>
      </Gutter>
    );
  }
}
