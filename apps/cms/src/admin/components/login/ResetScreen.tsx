import type { AdminViewServerProps } from "payload";
import { formatAdminURL } from "payload/shared";

import { lookupInvite, lookupResetToken } from "../../../account/resetToken";
import { BrandPanel } from "./BrandPanel";
import { LinkProblem, ResetForm } from "./ResetForm";

export async function ResetScreen({
  initPageResult,
  params,
  searchParams,
}: AdminViewServerProps) {
  const { payload } = initPageResult.req;
  const adminRoute = payload.config.routes.admin;
  const segments = (params?.segments ?? []) as string[];
  const token = segments[1];
  const invite = searchParams?.invite === "1";
  const links = {
    home: formatAdminURL({ adminRoute, path: "" }) || "/",
    signIn: formatAdminURL({ adminRoute, path: "/login" }),
    forgot: formatAdminURL({ adminRoute, path: "/forgot" }),
  };

  let body;
  if (invite) {
    const found = await lookupInvite(payload, token);
    body =
      found.state === "valid" ? (
        <ResetForm info={found.info} links={links} token={token} />
      ) : (
        <LinkProblem
          invite
          inviterName={
            found.state === "expired" ? found.inviterName : undefined
          }
          links={links}
        />
      );
  } else {
    const found = await lookupResetToken(payload, token);
    body =
      found.state === "valid" ? (
        <ResetForm links={links} token={token} />
      ) : (
        <LinkProblem links={links} />
      );
  }

  return (
    <div className="dil-login">
      <BrandPanel />
      <main className="dil-login__pane">
        <div className="dil-login__form">{body}</div>
      </main>
    </div>
  );
}
