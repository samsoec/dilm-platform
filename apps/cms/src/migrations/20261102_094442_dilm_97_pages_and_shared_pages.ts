import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_redirect_to_type" AS ENUM('internal', 'external');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_version_redirect_to_type" AS ENUM('internal', 'external');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('en', 'id');
  CREATE TYPE "public"."enum_shared_pages_redirect_to_type" AS ENUM('internal', 'external');
  CREATE TYPE "public"."enum_shared_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__shared_pages_v_version_redirect_to_type" AS ENUM('internal', 'external');
  CREATE TYPE "public"."enum__shared_pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__shared_pages_v_published_locale" AS ENUM('en', 'id');
  CREATE TABLE "pages_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"parent_id" integer,
  	"redirect_to_type" "enum_pages_redirect_to_type" DEFAULT 'internal',
  	"redirect_to_new_tab" boolean DEFAULT false,
  	"redirect_to_internal_path" varchar,
  	"redirect_to_external_url" varchar,
  	"updated_by_id" integer,
  	"trashed_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_locales" (
  	"title" varchar,
  	"slug" varchar,
  	"path" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_version_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_tenant_id" integer,
  	"version_parent_id" integer,
  	"version_redirect_to_type" "enum__pages_v_version_redirect_to_type" DEFAULT 'internal',
  	"version_redirect_to_new_tab" boolean DEFAULT false,
  	"version_redirect_to_internal_path" varchar,
  	"version_redirect_to_external_url" varchar,
  	"version_updated_by_id" integer,
  	"version_trashed_by_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__pages_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_pages_v_locales" (
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_path" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "shared_pages_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "shared_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"redirect_to_type" "enum_shared_pages_redirect_to_type" DEFAULT 'internal',
  	"redirect_to_new_tab" boolean DEFAULT false,
  	"redirect_to_internal_path" varchar,
  	"redirect_to_external_url" varchar,
  	"updated_by_id" integer,
  	"trashed_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_shared_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "shared_pages_locales" (
  	"title" varchar,
  	"slug" varchar,
  	"path" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_shared_pages_v_version_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_shared_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_parent_id" integer,
  	"version_redirect_to_type" "enum__shared_pages_v_version_redirect_to_type" DEFAULT 'internal',
  	"version_redirect_to_new_tab" boolean DEFAULT false,
  	"version_redirect_to_internal_path" varchar,
  	"version_redirect_to_external_url" varchar,
  	"version_updated_by_id" integer,
  	"version_trashed_by_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__shared_pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__shared_pages_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_shared_pages_v_locales" (
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_path" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "pages_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "shared_pages_id" integer;
  ALTER TABLE "pages_breadcrumbs" ADD CONSTRAINT "pages_breadcrumbs_doc_id_pages_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_breadcrumbs" ADD CONSTRAINT "pages_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_trashed_by_id_users_id_fk" FOREIGN KEY ("trashed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_breadcrumbs" ADD CONSTRAINT "_pages_v_version_breadcrumbs_doc_id_pages_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_version_breadcrumbs" ADD CONSTRAINT "_pages_v_version_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_tenant_id_tenants_id_fk" FOREIGN KEY ("version_tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_parent_id_pages_id_fk" FOREIGN KEY ("version_parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_trashed_by_id_users_id_fk" FOREIGN KEY ("version_trashed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_breadcrumbs" ADD CONSTRAINT "shared_pages_breadcrumbs_doc_id_shared_pages_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."shared_pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_pages_breadcrumbs" ADD CONSTRAINT "shared_pages_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages" ADD CONSTRAINT "shared_pages_parent_id_shared_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."shared_pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_pages" ADD CONSTRAINT "shared_pages_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_pages" ADD CONSTRAINT "shared_pages_trashed_by_id_users_id_fk" FOREIGN KEY ("trashed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_pages_locales" ADD CONSTRAINT "shared_pages_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_pages_locales" ADD CONSTRAINT "shared_pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_shared_pages_v_version_breadcrumbs" ADD CONSTRAINT "_shared_pages_v_version_breadcrumbs_doc_id_shared_pages_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."shared_pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_shared_pages_v_version_breadcrumbs" ADD CONSTRAINT "_shared_pages_v_version_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_shared_pages_v" ADD CONSTRAINT "_shared_pages_v_parent_id_shared_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."shared_pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_shared_pages_v" ADD CONSTRAINT "_shared_pages_v_version_parent_id_shared_pages_id_fk" FOREIGN KEY ("version_parent_id") REFERENCES "public"."shared_pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_shared_pages_v" ADD CONSTRAINT "_shared_pages_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_shared_pages_v" ADD CONSTRAINT "_shared_pages_v_version_trashed_by_id_users_id_fk" FOREIGN KEY ("version_trashed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_shared_pages_v_locales" ADD CONSTRAINT "_shared_pages_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_shared_pages_v_locales" ADD CONSTRAINT "_shared_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_breadcrumbs_order_idx" ON "pages_breadcrumbs" USING btree ("_order");
  CREATE INDEX "pages_breadcrumbs_parent_id_idx" ON "pages_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "pages_breadcrumbs_locale_idx" ON "pages_breadcrumbs" USING btree ("_locale");
  CREATE INDEX "pages_breadcrumbs_doc_idx" ON "pages_breadcrumbs" USING btree ("doc_id");
  CREATE INDEX "pages_tenant_idx" ON "pages" USING btree ("tenant_id");
  CREATE INDEX "pages_parent_idx" ON "pages" USING btree ("parent_id");
  CREATE INDEX "pages_updated_by_idx" ON "pages" USING btree ("updated_by_id");
  CREATE INDEX "pages_trashed_by_idx" ON "pages" USING btree ("trashed_by_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages_deleted_at_idx" ON "pages" USING btree ("deleted_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_version_breadcrumbs_order_idx" ON "_pages_v_version_breadcrumbs" USING btree ("_order");
  CREATE INDEX "_pages_v_version_breadcrumbs_parent_id_idx" ON "_pages_v_version_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_breadcrumbs_locale_idx" ON "_pages_v_version_breadcrumbs" USING btree ("_locale");
  CREATE INDEX "_pages_v_version_breadcrumbs_doc_idx" ON "_pages_v_version_breadcrumbs" USING btree ("doc_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_tenant_idx" ON "_pages_v" USING btree ("version_tenant_id");
  CREATE INDEX "_pages_v_version_version_parent_idx" ON "_pages_v" USING btree ("version_parent_id");
  CREATE INDEX "_pages_v_version_version_updated_by_idx" ON "_pages_v" USING btree ("version_updated_by_id");
  CREATE INDEX "_pages_v_version_version_trashed_by_idx" ON "_pages_v" USING btree ("version_trashed_by_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version_deleted_at_idx" ON "_pages_v" USING btree ("version_deleted_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_snapshot_idx" ON "_pages_v" USING btree ("snapshot");
  CREATE INDEX "_pages_v_published_locale_idx" ON "_pages_v" USING btree ("published_locale");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_pages_v_locales_locale_parent_id_unique" ON "_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_breadcrumbs_order_idx" ON "shared_pages_breadcrumbs" USING btree ("_order");
  CREATE INDEX "shared_pages_breadcrumbs_parent_id_idx" ON "shared_pages_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "shared_pages_breadcrumbs_locale_idx" ON "shared_pages_breadcrumbs" USING btree ("_locale");
  CREATE INDEX "shared_pages_breadcrumbs_doc_idx" ON "shared_pages_breadcrumbs" USING btree ("doc_id");
  CREATE INDEX "shared_pages_parent_idx" ON "shared_pages" USING btree ("parent_id");
  CREATE INDEX "shared_pages_updated_by_idx" ON "shared_pages" USING btree ("updated_by_id");
  CREATE INDEX "shared_pages_trashed_by_idx" ON "shared_pages" USING btree ("trashed_by_id");
  CREATE INDEX "shared_pages_updated_at_idx" ON "shared_pages" USING btree ("updated_at");
  CREATE INDEX "shared_pages_created_at_idx" ON "shared_pages" USING btree ("created_at");
  CREATE INDEX "shared_pages_deleted_at_idx" ON "shared_pages" USING btree ("deleted_at");
  CREATE INDEX "shared_pages__status_idx" ON "shared_pages" USING btree ("_status");
  CREATE INDEX "shared_pages_meta_meta_image_idx" ON "shared_pages_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "shared_pages_locales_locale_parent_id_unique" ON "shared_pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_shared_pages_v_version_breadcrumbs_order_idx" ON "_shared_pages_v_version_breadcrumbs" USING btree ("_order");
  CREATE INDEX "_shared_pages_v_version_breadcrumbs_parent_id_idx" ON "_shared_pages_v_version_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "_shared_pages_v_version_breadcrumbs_locale_idx" ON "_shared_pages_v_version_breadcrumbs" USING btree ("_locale");
  CREATE INDEX "_shared_pages_v_version_breadcrumbs_doc_idx" ON "_shared_pages_v_version_breadcrumbs" USING btree ("doc_id");
  CREATE INDEX "_shared_pages_v_parent_idx" ON "_shared_pages_v" USING btree ("parent_id");
  CREATE INDEX "_shared_pages_v_version_version_parent_idx" ON "_shared_pages_v" USING btree ("version_parent_id");
  CREATE INDEX "_shared_pages_v_version_version_updated_by_idx" ON "_shared_pages_v" USING btree ("version_updated_by_id");
  CREATE INDEX "_shared_pages_v_version_version_trashed_by_idx" ON "_shared_pages_v" USING btree ("version_trashed_by_id");
  CREATE INDEX "_shared_pages_v_version_version_updated_at_idx" ON "_shared_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_shared_pages_v_version_version_created_at_idx" ON "_shared_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_shared_pages_v_version_version_deleted_at_idx" ON "_shared_pages_v" USING btree ("version_deleted_at");
  CREATE INDEX "_shared_pages_v_version_version__status_idx" ON "_shared_pages_v" USING btree ("version__status");
  CREATE INDEX "_shared_pages_v_created_at_idx" ON "_shared_pages_v" USING btree ("created_at");
  CREATE INDEX "_shared_pages_v_updated_at_idx" ON "_shared_pages_v" USING btree ("updated_at");
  CREATE INDEX "_shared_pages_v_snapshot_idx" ON "_shared_pages_v" USING btree ("snapshot");
  CREATE INDEX "_shared_pages_v_published_locale_idx" ON "_shared_pages_v" USING btree ("published_locale");
  CREATE INDEX "_shared_pages_v_latest_idx" ON "_shared_pages_v" USING btree ("latest");
  CREATE INDEX "_shared_pages_v_version_meta_version_meta_image_idx" ON "_shared_pages_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_shared_pages_v_locales_locale_parent_id_unique" ON "_shared_pages_v_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_shared_pages_fk" FOREIGN KEY ("shared_pages_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_shared_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("shared_pages_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_breadcrumbs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_version_breadcrumbs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "shared_pages_breadcrumbs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "shared_pages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "shared_pages_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_shared_pages_v_version_breadcrumbs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_shared_pages_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_shared_pages_v_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_breadcrumbs" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "_pages_v_version_breadcrumbs" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_locales" CASCADE;
  DROP TABLE "shared_pages_breadcrumbs" CASCADE;
  DROP TABLE "shared_pages" CASCADE;
  DROP TABLE "shared_pages_locales" CASCADE;
  DROP TABLE "_shared_pages_v_version_breadcrumbs" CASCADE;
  DROP TABLE "_shared_pages_v" CASCADE;
  DROP TABLE "_shared_pages_v_locales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_pages_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_shared_pages_fk";
  
  DROP INDEX "payload_locked_documents_rels_pages_id_idx";
  DROP INDEX "payload_locked_documents_rels_shared_pages_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "pages_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "shared_pages_id";
  DROP TYPE "public"."enum_pages_redirect_to_type";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_version_redirect_to_type";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum__pages_v_published_locale";
  DROP TYPE "public"."enum_shared_pages_redirect_to_type";
  DROP TYPE "public"."enum_shared_pages_status";
  DROP TYPE "public"."enum__shared_pages_v_version_redirect_to_type";
  DROP TYPE "public"."enum__shared_pages_v_version_status";
  DROP TYPE "public"."enum__shared_pages_v_published_locale";`)
}
