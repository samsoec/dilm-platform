import { redirect } from "next/navigation";
import type { AdminViewServerProps } from "payload";
import { formatAdminURL } from "payload/shared";

import { loginNotice, safeRedirect } from "../../login";
import { BrandPanel } from "./BrandPanel";
import { SignInForm } from "./SignInForm";

export function LoginScreen({
  initPageResult,
  searchParams,
}: AdminViewServerProps) {
  const { req } = initPageResult;
  const adminRoute = req.payload.config.routes.admin;
  const home = formatAdminURL({ adminRoute, path: "" }) || "/";
  const redirectTo = safeRedirect(searchParams?.redirect, home);
  if (req.user) redirect(redirectTo);

  return (
    <div className="dil-login">
      <BrandPanel />
      <main className="dil-login__pane">
        <div className="dil-login__form">
          <SignInForm
            forgotHref={formatAdminURL({ adminRoute, path: "/forgot" })}
            notice={loginNotice(searchParams?.notice)}
            redirectTo={redirectTo}
          />
        </div>
      </main>
    </div>
  );
}
