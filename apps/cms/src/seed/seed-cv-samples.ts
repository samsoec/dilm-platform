import { runtimeConfigSource } from "@dilm/runtime-config";
import { TENANT_SLUGS } from "@dilm/shared-types";
import { getPayload } from "payload";

import config from "../payload.config";
import { CV_SAMPLE_PREFIX, cvSamples } from "./cvSamples";

if (process.argv.includes("--help")) {
  console.error(
    "usage: pnpm --filter cms seed:cv-samples [-- --remove]\n\n" +
      "Replaces every CV submission whose submissionId starts with " +
      `"${CV_SAMPLE_PREFIX}" with a fresh, fixed set of sample applications ` +
      "for all three tenants: every status, sync state and notification " +
      "combination, plus edge cases such as long, accented and one-word " +
      "names, a twelve-times failed sync and a year-old application. Real " +
      "submissions are never touched. --remove deletes the samples only. " +
      "Local stack only (RUNTIME_CONFIG_SOURCE=env); the résumé keys point " +
      "at no real file.",
  );
  process.exit(2);
}

if (runtimeConfigSource(process.env) !== "env") {
  console.error(
    "seed:cv-samples only runs against the local stack (RUNTIME_CONFIG_SOURCE=env).",
  );
  process.exit(2);
}

const payload = await getPayload({ config });

const { docs: removed } = await payload.delete({
  collection: "cv-submissions",
  where: { submissionId: { like: CV_SAMPLE_PREFIX } },
});
payload.logger.info(`removed ${removed.length} earlier samples`);

let exitCode = 0;

if (!process.argv.includes("--remove")) {
  const { docs: tenants } = await payload.find({
    collection: "tenants",
    where: { slug: { in: [...TENANT_SLUGS] } },
    limit: TENANT_SLUGS.length,
    depth: 0,
  });
  const tenantIDs = new Map(tenants.map((tenant) => [tenant.slug, tenant.id]));
  const missing = TENANT_SLUGS.filter((slug) => !tenantIDs.has(slug));
  if (missing.length > 0) {
    payload.logger.error(
      `no tenant found for ${missing.join(", ")}; their samples are skipped. ` +
        "Run pnpm --filter cms seed:tenants first, then re-run this.",
    );
    exitCode = 1;
  }

  const counts = new Map<string, number>();
  for (const { tenantSlug, ...data } of cvSamples()) {
    const tenant = tenantIDs.get(tenantSlug);
    if (tenant === undefined) continue;
    await payload.create({
      collection: "cv-submissions",
      data: { ...data, tenant },
    });
    counts.set(tenantSlug, (counts.get(tenantSlug) ?? 0) + 1);
  }
  for (const [slug, count] of counts) {
    payload.logger.info(`created ${count} samples for ${slug}`);
  }
}

await payload.destroy();
process.exit(exitCode);
