import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" ADD COLUMN "trashed_by_id" integer;
  ALTER TABLE "ir_documents" ADD COLUMN "trashed_by_id" integer;
  ALTER TABLE "_ir_documents_v" ADD COLUMN "version_trashed_by_id" integer;
  ALTER TABLE "media" ADD CONSTRAINT "media_trashed_by_id_users_id_fk" FOREIGN KEY ("trashed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ir_documents" ADD CONSTRAINT "ir_documents_trashed_by_id_users_id_fk" FOREIGN KEY ("trashed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_ir_documents_v" ADD CONSTRAINT "_ir_documents_v_version_trashed_by_id_users_id_fk" FOREIGN KEY ("version_trashed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "media_trashed_by_idx" ON "media" USING btree ("trashed_by_id");
  CREATE INDEX "ir_documents_trashed_by_idx" ON "ir_documents" USING btree ("trashed_by_id");
  CREATE INDEX "_ir_documents_v_version_version_trashed_by_idx" ON "_ir_documents_v" USING btree ("version_trashed_by_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" DROP CONSTRAINT "media_trashed_by_id_users_id_fk";
  
  ALTER TABLE "ir_documents" DROP CONSTRAINT "ir_documents_trashed_by_id_users_id_fk";
  
  ALTER TABLE "_ir_documents_v" DROP CONSTRAINT "_ir_documents_v_version_trashed_by_id_users_id_fk";
  
  DROP INDEX "media_trashed_by_idx";
  DROP INDEX "ir_documents_trashed_by_idx";
  DROP INDEX "_ir_documents_v_version_version_trashed_by_idx";
  ALTER TABLE "media" DROP COLUMN "trashed_by_id";
  ALTER TABLE "ir_documents" DROP COLUMN "trashed_by_id";
  ALTER TABLE "_ir_documents_v" DROP COLUMN "version_trashed_by_id";`)
}
