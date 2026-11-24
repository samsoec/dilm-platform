import { TENANT_SLUGS } from "@dilm/shared-types";

import { robotsTxt } from "@/seo/site";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ tenant: string }> },
) {
  const { tenant } = await params;
  const slug = TENANT_SLUGS.find((candidate) => candidate === tenant);
  if (slug === undefined) return new Response("Not Found", { status: 404 });
  return new Response(robotsTxt(process.env), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
