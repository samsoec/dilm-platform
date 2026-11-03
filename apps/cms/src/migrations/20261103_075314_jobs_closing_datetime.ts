import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_jobs_closingdate_tz" AS ENUM('Asia/Jakarta', 'Asia/Makassar', 'Asia/Jayapura');
  CREATE TYPE "public"."enum__jobs_v_version_closingdate_tz" AS ENUM('Asia/Jakarta', 'Asia/Makassar', 'Asia/Jayapura');
  ALTER TABLE "jobs" ADD COLUMN "closingdate_tz" "enum_jobs_closingdate_tz" DEFAULT 'Asia/Jakarta';
  ALTER TABLE "_jobs_v" ADD COLUMN "version_closingdate_tz" "enum__jobs_v_version_closingdate_tz" DEFAULT 'Asia/Jakarta';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "jobs" DROP COLUMN "closingdate_tz";
  ALTER TABLE "_jobs_v" DROP COLUMN "version_closingdate_tz";
  DROP TYPE "public"."enum_jobs_closingdate_tz";
  DROP TYPE "public"."enum__jobs_v_version_closingdate_tz";`)
}
