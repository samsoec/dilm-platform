import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" ADD COLUMN "name" varchar;
  UPDATE "users" SET "name" = split_part("email", '@', 1) WHERE "name" IS NULL;
  ALTER TABLE "tenant_settings" ADD COLUMN "updated_by_id" integer;
  ALTER TABLE "header" ADD COLUMN "updated_by_id" integer;
  ALTER TABLE "_header_v" ADD COLUMN "version_updated_by_id" integer;
  ALTER TABLE "footer" ADD COLUMN "updated_by_id" integer;
  ALTER TABLE "_footer_v" ADD COLUMN "version_updated_by_id" integer;
  ALTER TABLE "tenant_settings" ADD CONSTRAINT "tenant_settings_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "header" ADD CONSTRAINT "header_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_header_v" ADD CONSTRAINT "_header_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer" ADD CONSTRAINT "footer_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_footer_v" ADD CONSTRAINT "_footer_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "tenant_settings_updated_by_idx" ON "tenant_settings" USING btree ("updated_by_id");
  CREATE INDEX "header_updated_by_idx" ON "header" USING btree ("updated_by_id");
  CREATE INDEX "_header_v_version_version_updated_by_idx" ON "_header_v" USING btree ("version_updated_by_id");
  CREATE INDEX "footer_updated_by_idx" ON "footer" USING btree ("updated_by_id");
  CREATE INDEX "_footer_v_version_version_updated_by_idx" ON "_footer_v" USING btree ("version_updated_by_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "tenant_settings" DROP CONSTRAINT "tenant_settings_updated_by_id_users_id_fk";
  
  ALTER TABLE "header" DROP CONSTRAINT "header_updated_by_id_users_id_fk";
  
  ALTER TABLE "_header_v" DROP CONSTRAINT "_header_v_version_updated_by_id_users_id_fk";
  
  ALTER TABLE "footer" DROP CONSTRAINT "footer_updated_by_id_users_id_fk";
  
  ALTER TABLE "_footer_v" DROP CONSTRAINT "_footer_v_version_updated_by_id_users_id_fk";
  
  DROP INDEX "tenant_settings_updated_by_idx";
  DROP INDEX "header_updated_by_idx";
  DROP INDEX "_header_v_version_version_updated_by_idx";
  DROP INDEX "footer_updated_by_idx";
  DROP INDEX "_footer_v_version_version_updated_by_idx";
  ALTER TABLE "users" DROP COLUMN "name";
  ALTER TABLE "tenant_settings" DROP COLUMN "updated_by_id";
  ALTER TABLE "header" DROP COLUMN "updated_by_id";
  ALTER TABLE "_header_v" DROP COLUMN "version_updated_by_id";
  ALTER TABLE "footer" DROP COLUMN "updated_by_id";
  ALTER TABLE "_footer_v" DROP COLUMN "version_updated_by_id";`)
}
