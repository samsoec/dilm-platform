import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "tenant_settings" ADD COLUMN "privacy_policy_version" varchar;
  ALTER TABLE "_tenant_settings_v" ADD COLUMN "version_privacy_policy_version" varchar;
  UPDATE "tenant_settings" SET "privacy_policy_version" = '2026-11' WHERE "privacy_policy_version" IS NULL;
  UPDATE "_tenant_settings_v" SET "version_privacy_policy_version" = '2026-11' WHERE "version_privacy_policy_version" IS NULL;
  ALTER TABLE "tenant_settings" ALTER COLUMN "privacy_policy_version" SET NOT NULL;
  ALTER TABLE "_tenant_settings_v" ALTER COLUMN "version_privacy_policy_version" SET NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "tenant_settings" DROP COLUMN "privacy_policy_version";
  ALTER TABLE "_tenant_settings_v" DROP COLUMN "version_privacy_policy_version";`)
}
