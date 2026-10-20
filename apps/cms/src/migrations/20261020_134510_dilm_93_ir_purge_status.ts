import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_ir_documents_last_purge_status" AS ENUM('ok', 'failed');
  CREATE TYPE "public"."enum__ir_documents_v_version_last_purge_status" AS ENUM('ok', 'failed');
  ALTER TABLE "ir_documents" ADD COLUMN "last_purge_status" "enum_ir_documents_last_purge_status";
  ALTER TABLE "ir_documents" ADD COLUMN "last_purge_at" timestamp(3) with time zone;
  ALTER TABLE "_ir_documents_v" ADD COLUMN "version_last_purge_status" "enum__ir_documents_v_version_last_purge_status";
  ALTER TABLE "_ir_documents_v" ADD COLUMN "version_last_purge_at" timestamp(3) with time zone;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "ir_documents" DROP COLUMN "last_purge_status";
  ALTER TABLE "ir_documents" DROP COLUMN "last_purge_at";
  ALTER TABLE "_ir_documents_v" DROP COLUMN "version_last_purge_status";
  ALTER TABLE "_ir_documents_v" DROP COLUMN "version_last_purge_at";
  DROP TYPE "public"."enum_ir_documents_last_purge_status";
  DROP TYPE "public"."enum__ir_documents_v_version_last_purge_status";`)
}
