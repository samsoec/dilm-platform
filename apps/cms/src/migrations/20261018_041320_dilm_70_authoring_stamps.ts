import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" ADD COLUMN "uploaded_by_id" integer;
  ALTER TABLE "ir_documents" ADD COLUMN "updated_by_id" integer;
  ALTER TABLE "cv_submissions" ADD COLUMN "status_changed_by_id" integer;
  ALTER TABLE "cv_submissions" ADD COLUMN "status_changed_at" timestamp(3) with time zone;
  ALTER TABLE "media" ADD CONSTRAINT "media_uploaded_by_id_users_id_fk" FOREIGN KEY ("uploaded_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ir_documents" ADD CONSTRAINT "ir_documents_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cv_submissions" ADD CONSTRAINT "cv_submissions_status_changed_by_id_users_id_fk" FOREIGN KEY ("status_changed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "media_uploaded_by_idx" ON "media" USING btree ("uploaded_by_id");
  CREATE INDEX "ir_documents_updated_by_idx" ON "ir_documents" USING btree ("updated_by_id");
  CREATE INDEX "cv_submissions_status_changed_by_idx" ON "cv_submissions" USING btree ("status_changed_by_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" DROP CONSTRAINT "media_uploaded_by_id_users_id_fk";
  
  ALTER TABLE "ir_documents" DROP CONSTRAINT "ir_documents_updated_by_id_users_id_fk";
  
  ALTER TABLE "cv_submissions" DROP CONSTRAINT "cv_submissions_status_changed_by_id_users_id_fk";
  
  DROP INDEX "media_uploaded_by_idx";
  DROP INDEX "ir_documents_updated_by_idx";
  DROP INDEX "cv_submissions_status_changed_by_idx";
  ALTER TABLE "media" DROP COLUMN "uploaded_by_id";
  ALTER TABLE "ir_documents" DROP COLUMN "updated_by_id";
  ALTER TABLE "cv_submissions" DROP COLUMN "status_changed_by_id";
  ALTER TABLE "cv_submissions" DROP COLUMN "status_changed_at";`)
}
