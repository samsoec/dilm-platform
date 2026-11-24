import { redirect } from "next/navigation";
import type { AdminViewServerProps } from "payload";
import { formatAdminURL } from "payload/shared";

import { BrandPanel } from "./BrandPanel";
import { ForgotForm } from "./ForgotForm";

export async function ForgotScreen({ initPageResult }: AdminViewServerProps) {
  const { req } = initPageResult;
  const adminRoute = req.payload.config.routes.admin;
  if (req.user) redirect(formatAdminURL({ adminRoute, path: "" }) || "/");
  return (
    <div className="dil-login">
      <BrandPanel />
      <main className="dil-login__pane">
        <div className="dil-login__form">
          <ForgotForm
            signInHref={formatAdminURL({ adminRoute, path: "/login" })}
          />
        </div>
      </main>
    </div>
  );
}
