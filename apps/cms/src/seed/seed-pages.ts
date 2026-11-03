import { getPayload } from "payload";

import config from "../payload.config";
import { seedPages } from "./pages";

const payload = await getPayload({ config });
const { outcomes, missingTenants } = await seedPages(payload);

for (const [key, outcome] of Object.entries(outcomes)) {
  payload.logger.info(`${key}: ${outcome}`);
}

if (missingTenants.length > 0) {
  payload.logger.error(
    `no tenant found for ${missingTenants.join(", ")}. ` +
      "Run pnpm --filter cms seed:tenants first, then re-run this.",
  );
}

await payload.destroy();
process.exit(missingTenants.length > 0 ? 1 : 0);
