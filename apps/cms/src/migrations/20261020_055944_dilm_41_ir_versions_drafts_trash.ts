import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_ir_documents_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__ir_documents_v_version_document_type" AS ENUM('annual-report', 'financial-statement', 'sustainability-report', 'public-disclosure', 'shareholder-meeting', 'prospectus');
  CREATE TYPE "public"."enum__ir_documents_v_version_locale" AS ENUM('en', 'id');
  CREATE TYPE "public"."enum__ir_documents_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__ir_documents_v_published_locale" AS ENUM('en', 'id');
  CREATE TABLE "_ir_documents_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_tenant_id" integer,
  	"version_title" varchar,
  	"version_document_type" "enum__ir_documents_v_version_document_type",
  	"version_published_date" timestamp(3) with time zone,
  	"version_first_published_at" timestamp(3) with time zone,
  	"version_locale" "enum__ir_documents_v_version_locale" DEFAULT 'en',
  	"version_updated_by_id" integer,
  	"version_prefix" varchar DEFAULT 'ir-documents',
  	"version__objectkey" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__ir_documents_v_version_status" DEFAULT 'draft',
  	"version_url" varchar,
  	"version_thumbnail_u_r_l" varchar,
  	"version_filename" varchar,
  	"version_mime_type" varchar,
  	"version_filesize" numeric,
  	"version_width" numeric,
  	"version_height" numeric,
  	"version_focal_x" numeric,
  	"version_focal_y" numeric,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__ir_documents_v_published_locale",
  	"latest" boolean
  );
  
  ALTER TABLE "ir_documents" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "ir_documents" ALTER COLUMN "document_type" DROP NOT NULL;
  ALTER TABLE "ir_documents" ALTER COLUMN "published_date" DROP NOT NULL;
  ALTER TABLE "ir_documents" ALTER COLUMN "locale" DROP NOT NULL;
  ALTER TABLE "media" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "ir_documents" ADD COLUMN "first_published_at" timestamp(3) with time zone;
  ALTER TABLE "ir_documents" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "ir_documents" ADD COLUMN "_status" "enum_ir_documents_status" DEFAULT 'draft';
  ALTER TABLE "_ir_documents_v" ADD CONSTRAINT "_ir_documents_v_parent_id_ir_documents_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."ir_documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_ir_documents_v" ADD CONSTRAINT "_ir_documents_v_version_tenant_id_tenants_id_fk" FOREIGN KEY ("version_tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_ir_documents_v" ADD CONSTRAINT "_ir_documents_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "_ir_documents_v_parent_idx" ON "_ir_documents_v" USING btree ("parent_id");
  CREATE INDEX "_ir_documents_v_version_version_tenant_idx" ON "_ir_documents_v" USING btree ("version_tenant_id");
  CREATE INDEX "_ir_documents_v_version_version_updated_by_idx" ON "_ir_documents_v" USING btree ("version_updated_by_id");
  CREATE INDEX "_ir_documents_v_version_version_updated_at_idx" ON "_ir_documents_v" USING btree ("version_updated_at");
  CREATE INDEX "_ir_documents_v_version_version_created_at_idx" ON "_ir_documents_v" USING btree ("version_created_at");
  CREATE INDEX "_ir_documents_v_version_version_deleted_at_idx" ON "_ir_documents_v" USING btree ("version_deleted_at");
  CREATE INDEX "_ir_documents_v_version_version__status_idx" ON "_ir_documents_v" USING btree ("version__status");
  CREATE INDEX "_ir_documents_v_version_version_filename_idx" ON "_ir_documents_v" USING btree ("version_filename");
  CREATE INDEX "_ir_documents_v_created_at_idx" ON "_ir_documents_v" USING btree ("created_at");
  CREATE INDEX "_ir_documents_v_updated_at_idx" ON "_ir_documents_v" USING btree ("updated_at");
  CREATE INDEX "_ir_documents_v_snapshot_idx" ON "_ir_documents_v" USING btree ("snapshot");
  CREATE INDEX "_ir_documents_v_published_locale_idx" ON "_ir_documents_v" USING btree ("published_locale");
  CREATE INDEX "_ir_documents_v_latest_idx" ON "_ir_documents_v" USING btree ("latest");
  CREATE INDEX "media_deleted_at_idx" ON "media" USING btree ("deleted_at");
  CREATE INDEX "ir_documents_deleted_at_idx" ON "ir_documents" USING btree ("deleted_at");
  CREATE INDEX "ir_documents__status_idx" ON "ir_documents" USING btree ("_status");
  UPDATE "ir_documents" SET "_status" = 'published', "first_published_at" = COALESCE("published_date", "created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "_ir_documents_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "_ir_documents_v" CASCADE;
  DROP INDEX "media_deleted_at_idx";
  DROP INDEX "ir_documents_deleted_at_idx";
  DROP INDEX "ir_documents__status_idx";
  ALTER TABLE "ir_documents" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "ir_documents" ALTER COLUMN "document_type" SET NOT NULL;
  ALTER TABLE "ir_documents" ALTER COLUMN "published_date" SET NOT NULL;
  ALTER TABLE "ir_documents" ALTER COLUMN "locale" SET NOT NULL;
  ALTER TABLE "media" DROP COLUMN "deleted_at";
  ALTER TABLE "ir_documents" DROP COLUMN "first_published_at";
  ALTER TABLE "ir_documents" DROP COLUMN "deleted_at";
  ALTER TABLE "ir_documents" DROP COLUMN "_status";
  DROP TYPE "public"."enum_ir_documents_status";
  DROP TYPE "public"."enum__ir_documents_v_version_document_type";
  DROP TYPE "public"."enum__ir_documents_v_version_locale";
  DROP TYPE "public"."enum__ir_documents_v_version_status";
  DROP TYPE "public"."enum__ir_documents_v_published_locale";`)
}
