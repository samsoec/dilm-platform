import { LoginView } from "@payloadcms/next/views";
import type { AdminViewServerProps } from "payload";

import { BrandPanel } from "./BrandPanel";

export function LoginScreen(props: AdminViewServerProps) {
  return (
    <div className="dil-login">
      <BrandPanel />
      <main className="dil-login__pane">
        <div className="dil-login__form">
          <LoginView {...props} />
        </div>
      </main>
    </div>
  );
}
