import { getPayload } from "payload";

import config from "../payload.config";
import { seedTenants } from "./tenants";

const payload = await getPayload({ config });
const { outcomes, unexpectedSlugs } = await seedTenants(payload);

for (const [slug, outcome] of Object.entries(outcomes)) {
  payload.logger.info(`tenant ${slug}: ${outcome}`);
}

if (unexpectedSlugs.length > 0) {
  payload.logger.error(
    `found tenants outside the seeded three: ${unexpectedSlugs.join(", ")}. ` +
      "Remove them by hand after checking nothing depends on them.",
  );
}

await payload.destroy();
process.exit(unexpectedSlugs.length > 0 ? 1 : 0);
