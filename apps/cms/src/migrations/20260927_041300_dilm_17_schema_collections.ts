import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_tenant_settings_social_links_platform" AS ENUM('facebook', 'instagram', 'linkedin', 'x', 'youtube', 'tiktok');
  CREATE TYPE "public"."enum_consent_logs_consent_type" AS ENUM('career-application', 'contact-form');
  CREATE TYPE "public"."enum_ir_documents_document_type" AS ENUM('annual-report', 'financial-statement', 'sustainability-report', 'public-disclosure', 'shareholder-meeting', 'prospectus');
  CREATE TYPE "public"."enum_ir_documents_locale" AS ENUM('en', 'id');
  CREATE TYPE "public"."enum_cv_submissions_status" AS ENUM('received', 'reviewed', 'shortlisted', 'rejected');
  CREATE TYPE "public"."enum_cv_submissions_external_sync_status" AS ENUM('pending', 'synced', 'failed');
  CREATE TABLE "tenant_settings_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_tenant_settings_social_links_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "tenant_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"contact_email" varchar,
  	"contact_phone" varchar,
  	"recruiter_email" varchar,
  	"default_seo_og_image_id" integer,
  	"analytics_id" varchar,
  	"wa_link" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "tenant_settings_locales" (
  	"site_name" varchar NOT NULL,
  	"default_seo_title" varchar,
  	"default_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "consent_logs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"timestamp" timestamp(3) with time zone NOT NULL,
  	"policy_version" varchar NOT NULL,
  	"related_record_id" varchar NOT NULL,
  	"consent_type" "enum_consent_logs_consent_type" NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "ir_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"title" varchar NOT NULL,
  	"document_type" "enum_ir_documents_document_type" NOT NULL,
  	"published_date" timestamp(3) with time zone NOT NULL,
  	"locale" "enum_ir_documents_locale" DEFAULT 'en' NOT NULL,
  	"prefix" varchar DEFAULT 'ir-documents',
  	"_objectkey" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "cv_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"submission_id" varchar NOT NULL,
  	"applicant_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"position" varchar NOT NULL,
  	"resume_file_key" varchar NOT NULL,
  	"submitted_at" timestamp(3) with time zone NOT NULL,
  	"status" "enum_cv_submissions_status" DEFAULT 'received' NOT NULL,
  	"applicant_notified_at" timestamp(3) with time zone,
  	"recruiter_notified_at" timestamp(3) with time zone,
  	"external_sync_status" "enum_cv_submissions_external_sync_status" DEFAULT 'pending' NOT NULL,
  	"external_sync_attempts" numeric DEFAULT 0 NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "media" ADD COLUMN "tenant_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "tenant_settings_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "consent_logs_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "ir_documents_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "cv_submissions_id" integer;
  ALTER TABLE "tenant_settings_social_links" ADD CONSTRAINT "tenant_settings_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tenant_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tenant_settings" ADD CONSTRAINT "tenant_settings_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tenant_settings" ADD CONSTRAINT "tenant_settings_default_seo_og_image_id_media_id_fk" FOREIGN KEY ("default_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tenant_settings_locales" ADD CONSTRAINT "tenant_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tenant_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "consent_logs" ADD CONSTRAINT "consent_logs_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ir_documents" ADD CONSTRAINT "ir_documents_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cv_submissions" ADD CONSTRAINT "cv_submissions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "tenant_settings_social_links_order_idx" ON "tenant_settings_social_links" USING btree ("_order");
  CREATE INDEX "tenant_settings_social_links_parent_id_idx" ON "tenant_settings_social_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "tenant_settings_tenant_idx" ON "tenant_settings" USING btree ("tenant_id");
  CREATE INDEX "tenant_settings_default_seo_default_seo_og_image_idx" ON "tenant_settings" USING btree ("default_seo_og_image_id");
  CREATE INDEX "tenant_settings_updated_at_idx" ON "tenant_settings" USING btree ("updated_at");
  CREATE INDEX "tenant_settings_created_at_idx" ON "tenant_settings" USING btree ("created_at");
  CREATE UNIQUE INDEX "tenant_settings_locales_locale_parent_id_unique" ON "tenant_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "consent_logs_tenant_idx" ON "consent_logs" USING btree ("tenant_id");
  CREATE INDEX "consent_logs_updated_at_idx" ON "consent_logs" USING btree ("updated_at");
  CREATE INDEX "consent_logs_created_at_idx" ON "consent_logs" USING btree ("created_at");
  CREATE INDEX "ir_documents_tenant_idx" ON "ir_documents" USING btree ("tenant_id");
  CREATE INDEX "ir_documents_updated_at_idx" ON "ir_documents" USING btree ("updated_at");
  CREATE INDEX "ir_documents_created_at_idx" ON "ir_documents" USING btree ("created_at");
  CREATE UNIQUE INDEX "ir_documents_filename_idx" ON "ir_documents" USING btree ("filename");
  CREATE INDEX "cv_submissions_tenant_idx" ON "cv_submissions" USING btree ("tenant_id");
  CREATE UNIQUE INDEX "cv_submissions_submission_id_idx" ON "cv_submissions" USING btree ("submission_id");
  CREATE INDEX "cv_submissions_updated_at_idx" ON "cv_submissions" USING btree ("updated_at");
  CREATE INDEX "cv_submissions_created_at_idx" ON "cv_submissions" USING btree ("created_at");
  ALTER TABLE "media" ADD CONSTRAINT "media_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tenant_settings_fk" FOREIGN KEY ("tenant_settings_id") REFERENCES "public"."tenant_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_consent_logs_fk" FOREIGN KEY ("consent_logs_id") REFERENCES "public"."consent_logs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ir_documents_fk" FOREIGN KEY ("ir_documents_id") REFERENCES "public"."ir_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cv_submissions_fk" FOREIGN KEY ("cv_submissions_id") REFERENCES "public"."cv_submissions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "media_tenant_idx" ON "media" USING btree ("tenant_id");
  CREATE INDEX "payload_locked_documents_rels_tenant_settings_id_idx" ON "payload_locked_documents_rels" USING btree ("tenant_settings_id");
  CREATE INDEX "payload_locked_documents_rels_consent_logs_id_idx" ON "payload_locked_documents_rels" USING btree ("consent_logs_id");
  CREATE INDEX "payload_locked_documents_rels_ir_documents_id_idx" ON "payload_locked_documents_rels" USING btree ("ir_documents_id");
  CREATE INDEX "payload_locked_documents_rels_cv_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("cv_submissions_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "tenant_settings_social_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tenant_settings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tenant_settings_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "consent_logs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "ir_documents" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cv_submissions" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "tenant_settings_social_links" CASCADE;
  DROP TABLE "tenant_settings" CASCADE;
  DROP TABLE "tenant_settings_locales" CASCADE;
  DROP TABLE "consent_logs" CASCADE;
  DROP TABLE "ir_documents" CASCADE;
  DROP TABLE "cv_submissions" CASCADE;
  ALTER TABLE "media" DROP CONSTRAINT "media_tenant_id_tenants_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_tenant_settings_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_consent_logs_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_ir_documents_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_cv_submissions_fk";
  
  DROP INDEX "media_tenant_idx";
  DROP INDEX "payload_locked_documents_rels_tenant_settings_id_idx";
  DROP INDEX "payload_locked_documents_rels_consent_logs_id_idx";
  DROP INDEX "payload_locked_documents_rels_ir_documents_id_idx";
  DROP INDEX "payload_locked_documents_rels_cv_submissions_id_idx";
  ALTER TABLE "media" DROP COLUMN "tenant_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "tenant_settings_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "consent_logs_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "ir_documents_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "cv_submissions_id";
  DROP TYPE "public"."enum_tenant_settings_social_links_platform";
  DROP TYPE "public"."enum_consent_logs_consent_type";
  DROP TYPE "public"."enum_ir_documents_document_type";
  DROP TYPE "public"."enum_ir_documents_locale";
  DROP TYPE "public"."enum_cv_submissions_status";
  DROP TYPE "public"."enum_cv_submissions_external_sync_status";`)
}
