import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_jobs_experience_level" AS ENUM('entry', 'mid', 'senior', 'lead');
  CREATE TYPE "public"."enum_jobs_job_type" AS ENUM('full-time', 'part-time', 'contract', 'internship');
  CREATE TYPE "public"."jobs_listing_status" AS ENUM('open', 'closed');
  CREATE TYPE "public"."enum_jobs_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__jobs_v_version_experience_level" AS ENUM('entry', 'mid', 'senior', 'lead');
  CREATE TYPE "public"."enum__jobs_v_version_job_type" AS ENUM('full-time', 'part-time', 'contract', 'internship');
  CREATE TYPE "public"."enum__jobs_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__jobs_v_published_locale" AS ENUM('en', 'id');
  CREATE TABLE "jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"slug_fallback" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"experience_level" "enum_jobs_experience_level",
  	"job_type" "enum_jobs_job_type",
  	"posted_date" timestamp(3) with time zone,
  	"closing_date" timestamp(3) with time zone,
  	"status" "jobs_listing_status" DEFAULT 'open',
  	"updated_by_id" integer,
  	"trashed_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_jobs_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "jobs_locales" (
  	"slug" varchar,
  	"path" varchar,
  	"title" varchar,
  	"summary" varchar,
  	"department" varchar,
  	"location" varchar,
  	"body" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_jobs_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_tenant_id" integer,
  	"version_slug_fallback" boolean DEFAULT false,
  	"version_order" numeric DEFAULT 0,
  	"version_experience_level" "enum__jobs_v_version_experience_level",
  	"version_job_type" "enum__jobs_v_version_job_type",
  	"version_posted_date" timestamp(3) with time zone,
  	"version_closing_date" timestamp(3) with time zone,
  	"version_status" "jobs_listing_status" DEFAULT 'open',
  	"version_updated_by_id" integer,
  	"version_trashed_by_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__jobs_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__jobs_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_jobs_v_locales" (
  	"version_slug" varchar,
  	"version_path" varchar,
  	"version_title" varchar,
  	"version_summary" varchar,
  	"version_department" varchar,
  	"version_location" varchar,
  	"version_body" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "routes_rels" ADD COLUMN "jobs_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "jobs_id" integer;
  ALTER TABLE "jobs" ADD CONSTRAINT "jobs_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "jobs" ADD CONSTRAINT "jobs_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "jobs" ADD CONSTRAINT "jobs_trashed_by_id_users_id_fk" FOREIGN KEY ("trashed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "jobs_locales" ADD CONSTRAINT "jobs_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "jobs_locales" ADD CONSTRAINT "jobs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_jobs_v" ADD CONSTRAINT "_jobs_v_parent_id_jobs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."jobs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_jobs_v" ADD CONSTRAINT "_jobs_v_version_tenant_id_tenants_id_fk" FOREIGN KEY ("version_tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_jobs_v" ADD CONSTRAINT "_jobs_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_jobs_v" ADD CONSTRAINT "_jobs_v_version_trashed_by_id_users_id_fk" FOREIGN KEY ("version_trashed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_jobs_v_locales" ADD CONSTRAINT "_jobs_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_jobs_v_locales" ADD CONSTRAINT "_jobs_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_jobs_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "jobs_tenant_idx" ON "jobs" USING btree ("tenant_id");
  CREATE INDEX "jobs_updated_by_idx" ON "jobs" USING btree ("updated_by_id");
  CREATE INDEX "jobs_trashed_by_idx" ON "jobs" USING btree ("trashed_by_id");
  CREATE INDEX "jobs_updated_at_idx" ON "jobs" USING btree ("updated_at");
  CREATE INDEX "jobs_created_at_idx" ON "jobs" USING btree ("created_at");
  CREATE INDEX "jobs_deleted_at_idx" ON "jobs" USING btree ("deleted_at");
  CREATE INDEX "jobs__status_idx" ON "jobs" USING btree ("_status");
  CREATE INDEX "jobs_meta_meta_image_idx" ON "jobs_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "jobs_locales_locale_parent_id_unique" ON "jobs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_jobs_v_parent_idx" ON "_jobs_v" USING btree ("parent_id");
  CREATE INDEX "_jobs_v_version_version_tenant_idx" ON "_jobs_v" USING btree ("version_tenant_id");
  CREATE INDEX "_jobs_v_version_version_updated_by_idx" ON "_jobs_v" USING btree ("version_updated_by_id");
  CREATE INDEX "_jobs_v_version_version_trashed_by_idx" ON "_jobs_v" USING btree ("version_trashed_by_id");
  CREATE INDEX "_jobs_v_version_version_updated_at_idx" ON "_jobs_v" USING btree ("version_updated_at");
  CREATE INDEX "_jobs_v_version_version_created_at_idx" ON "_jobs_v" USING btree ("version_created_at");
  CREATE INDEX "_jobs_v_version_version_deleted_at_idx" ON "_jobs_v" USING btree ("version_deleted_at");
  CREATE INDEX "_jobs_v_version_version__status_idx" ON "_jobs_v" USING btree ("version__status");
  CREATE INDEX "_jobs_v_created_at_idx" ON "_jobs_v" USING btree ("created_at");
  CREATE INDEX "_jobs_v_updated_at_idx" ON "_jobs_v" USING btree ("updated_at");
  CREATE INDEX "_jobs_v_snapshot_idx" ON "_jobs_v" USING btree ("snapshot");
  CREATE INDEX "_jobs_v_published_locale_idx" ON "_jobs_v" USING btree ("published_locale");
  CREATE INDEX "_jobs_v_latest_idx" ON "_jobs_v" USING btree ("latest");
  CREATE INDEX "_jobs_v_version_meta_version_meta_image_idx" ON "_jobs_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_jobs_v_locales_locale_parent_id_unique" ON "_jobs_v_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "routes_rels" ADD CONSTRAINT "routes_rels_jobs_fk" FOREIGN KEY ("jobs_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_jobs_fk" FOREIGN KEY ("jobs_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "routes_rels_jobs_id_idx" ON "routes_rels" USING btree ("jobs_id");
  CREATE INDEX "payload_locked_documents_rels_jobs_id_idx" ON "payload_locked_documents_rels" USING btree ("jobs_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "jobs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "jobs_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_jobs_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_jobs_v_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "jobs" CASCADE;
  DROP TABLE "jobs_locales" CASCADE;
  DROP TABLE "_jobs_v" CASCADE;
  DROP TABLE "_jobs_v_locales" CASCADE;
  ALTER TABLE "routes_rels" DROP CONSTRAINT IF EXISTS "routes_rels_jobs_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_jobs_fk";
  
  DROP INDEX IF EXISTS "routes_rels_jobs_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_jobs_id_idx";
  ALTER TABLE "routes_rels" DROP COLUMN IF EXISTS "jobs_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "jobs_id";
  DROP TYPE IF EXISTS "public"."enum_jobs_experience_level";
  DROP TYPE IF EXISTS "public"."enum_jobs_job_type";
  DROP TYPE IF EXISTS "public"."jobs_listing_status";
  DROP TYPE IF EXISTS "public"."enum_jobs_status";
  DROP TYPE IF EXISTS "public"."enum__jobs_v_version_experience_level";
  DROP TYPE IF EXISTS "public"."enum__jobs_v_version_job_type";
  DROP TYPE IF EXISTS "public"."enum__jobs_v_version_status";
  DROP TYPE IF EXISTS "public"."enum__jobs_v_published_locale";`)
}
