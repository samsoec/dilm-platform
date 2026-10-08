import { getPayload } from "payload";

import config from "../payload.config";
import { seedLayout } from "./layout";

const payload = await getPayload({ config });
const { outcomes, missingTenants } = await seedLayout(payload);

for (const [slug, globals] of Object.entries(outcomes)) {
  for (const [global, outcome] of Object.entries(globals)) {
    payload.logger.info(`${global} for ${slug}: ${outcome}`);
  }
}

if (missingTenants.length > 0) {
  payload.logger.error(
    `no tenant found for ${missingTenants.join(", ")}. ` +
      "Run pnpm --filter cms seed:tenants first, then re-run this.",
  );
}

await payload.destroy();
process.exit(missingTenants.length > 0 ? 1 : 0);
