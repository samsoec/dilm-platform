import { cookies } from "next/headers";
import type { ServerProps } from "payload";

import { dashboardScope } from "../../data/dashboard";
import { greeting } from "./model";

export async function DashboardIntro({ payload, user }: ServerProps) {
  if (!user) return null;
  const jar = await cookies();
  const scope = await dashboardScope(
    payload,
    user,
    new Map(jar.getAll().map(({ name, value }) => [name, value])),
  ).catch(() => undefined);
  return (
    <header className="dil-dashboard-intro">
      <div>
        <h1>{greeting((user as { name?: string }).name, new Date())}</h1>
        <p>
          {scope ? (
            <>
              Here&apos;s what needs attention on <code>{scope.domain}</code>.
            </>
          ) : (
            "Pick a company in the sidebar to see its dashboard."
          )}
        </p>
      </div>
      {scope && (
        <p className="dil-dashboard-intro__scope">
          Showing {scope.name} only · switch company in the sidebar
        </p>
      )}
    </header>
  );
}
