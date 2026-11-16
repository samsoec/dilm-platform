import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "redirects" ADD COLUMN "created_by_id" integer;
  ALTER TABLE "redirects" ADD CONSTRAINT "redirects_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "redirects_created_by_idx" ON "redirects" USING btree ("created_by_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "redirects" DROP CONSTRAINT "redirects_created_by_id_users_id_fk";
  
  DROP INDEX "redirects_created_by_idx";
  ALTER TABLE "redirects" DROP COLUMN "created_by_id";`)
}
