import { getPayload } from "payload";

import config from "../payload.config";

const email = process.argv[2];

if (!email) {
  console.error(
    "usage: pnpm --filter @dilm/cms grant:super-admin <email>\n\n" +
      "Adds the super-admin role to an existing user, for users created " +
      "before roles existed or a CMS where no Super Admin can log in.",
  );
  process.exit(2);
}

const payload = await getPayload({ config });
const {
  docs: [user],
} = await payload.find({
  collection: "users",
  where: { email: { equals: email } },
  limit: 1,
  depth: 0,
});

if (!user) {
  payload.logger.error(`no user with email ${email}`);
} else if (user.roles?.includes("super-admin")) {
  payload.logger.info(`${email} is already a Super Admin`);
} else {
  await payload.update({
    collection: "users",
    id: user.id,
    data: { roles: [...(user.roles ?? []), "super-admin"] },
  });
  payload.logger.info(`${email} is now a Super Admin`);
}

await payload.destroy();
process.exit(user ? 0 : 1);
