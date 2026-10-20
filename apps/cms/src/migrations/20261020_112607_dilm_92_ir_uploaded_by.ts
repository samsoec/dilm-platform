import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "ir_documents" ADD COLUMN "uploaded_by_id" integer;
  ALTER TABLE "_ir_documents_v" ADD COLUMN "version_uploaded_by_id" integer;
  ALTER TABLE "ir_documents" ADD CONSTRAINT "ir_documents_uploaded_by_id_users_id_fk" FOREIGN KEY ("uploaded_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_ir_documents_v" ADD CONSTRAINT "_ir_documents_v_version_uploaded_by_id_users_id_fk" FOREIGN KEY ("version_uploaded_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "ir_documents_uploaded_by_idx" ON "ir_documents" USING btree ("uploaded_by_id");
  CREATE INDEX "_ir_documents_v_version_version_uploaded_by_idx" ON "_ir_documents_v" USING btree ("version_uploaded_by_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "ir_documents" DROP CONSTRAINT "ir_documents_uploaded_by_id_users_id_fk";
  
  ALTER TABLE "_ir_documents_v" DROP CONSTRAINT "_ir_documents_v_version_uploaded_by_id_users_id_fk";
  
  DROP INDEX "ir_documents_uploaded_by_idx";
  DROP INDEX "_ir_documents_v_version_version_uploaded_by_idx";
  ALTER TABLE "ir_documents" DROP COLUMN "uploaded_by_id";
  ALTER TABLE "_ir_documents_v" DROP COLUMN "version_uploaded_by_id";`)
}
