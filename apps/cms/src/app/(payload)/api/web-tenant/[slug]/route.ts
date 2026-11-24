import config from "@payload-config";
import { getPayload } from "payload";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const payload = await getPayload({ config });
  const found = await payload.find({
    collection: "tenants",
    where: { slug: { equals: slug } },
    select: { name: true, slug: true },
    depth: 0,
    limit: 1,
    overrideAccess: true,
  });
  const tenant = found.docs[0];
  if (tenant === undefined) {
    return Response.json({ error: "Unknown tenant" }, { status: 404 });
  }
  return Response.json({ slug: tenant.slug, name: tenant.name });
}
