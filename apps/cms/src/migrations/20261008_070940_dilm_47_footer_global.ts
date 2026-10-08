import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_footer_link_columns_links_link_type" AS ENUM('internal', 'external');
  CREATE TYPE "public"."enum_footer_cta_band_primary_button_type" AS ENUM('internal', 'external');
  CREATE TYPE "public"."enum_footer_cta_band_secondary_button_type" AS ENUM('internal', 'external');
  CREATE TYPE "public"."enum_footer_part_of_link_type" AS ENUM('internal', 'external');
  CREATE TYPE "public"."enum__footer_v_version_link_columns_links_link_type" AS ENUM('internal', 'external');
  CREATE TYPE "public"."enum__footer_v_version_cta_band_primary_button_type" AS ENUM('internal', 'external');
  CREATE TYPE "public"."enum__footer_v_version_cta_band_secondary_button_type" AS ENUM('internal', 'external');
  CREATE TYPE "public"."enum__footer_v_version_part_of_link_type" AS ENUM('internal', 'external');
  CREATE TABLE "footer_link_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_footer_link_columns_links_link_type" DEFAULT 'internal' NOT NULL,
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar
  );
  
  CREATE TABLE "footer_link_columns_links_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_link_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "footer_link_columns_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"cta_band_primary_button_type" "enum_footer_cta_band_primary_button_type" DEFAULT 'internal' NOT NULL,
  	"cta_band_primary_button_new_tab" boolean DEFAULT false,
  	"cta_band_primary_button_internal_path" varchar,
  	"cta_band_primary_button_external_url" varchar,
  	"cta_band_secondary_button_type" "enum_footer_cta_band_secondary_button_type" DEFAULT 'internal' NOT NULL,
  	"cta_band_secondary_button_new_tab" boolean DEFAULT false,
  	"cta_band_secondary_button_internal_path" varchar,
  	"cta_band_secondary_button_external_url" varchar,
  	"part_of_enabled" boolean DEFAULT false,
  	"part_of_logo_id" integer,
  	"part_of_link_type" "enum_footer_part_of_link_type" DEFAULT 'internal',
  	"part_of_link_new_tab" boolean DEFAULT false,
  	"part_of_link_internal_path" varchar,
  	"part_of_link_external_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "footer_locales" (
  	"cta_band_eyebrow" varchar,
  	"cta_band_heading" jsonb,
  	"cta_band_primary_button_label" varchar,
  	"cta_band_secondary_button_label" varchar,
  	"part_of_label" varchar,
  	"part_of_link_label" varchar,
  	"copyright" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_footer_v_version_link_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__footer_v_version_link_columns_links_link_type" DEFAULT 'internal' NOT NULL,
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_footer_v_version_link_columns_links_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_footer_v_version_link_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_footer_v_version_link_columns_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_footer_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_tenant_id" integer,
  	"version_cta_band_primary_button_type" "enum__footer_v_version_cta_band_primary_button_type" DEFAULT 'internal' NOT NULL,
  	"version_cta_band_primary_button_new_tab" boolean DEFAULT false,
  	"version_cta_band_primary_button_internal_path" varchar,
  	"version_cta_band_primary_button_external_url" varchar,
  	"version_cta_band_secondary_button_type" "enum__footer_v_version_cta_band_secondary_button_type" DEFAULT 'internal' NOT NULL,
  	"version_cta_band_secondary_button_new_tab" boolean DEFAULT false,
  	"version_cta_band_secondary_button_internal_path" varchar,
  	"version_cta_band_secondary_button_external_url" varchar,
  	"version_part_of_enabled" boolean DEFAULT false,
  	"version_part_of_logo_id" integer,
  	"version_part_of_link_type" "enum__footer_v_version_part_of_link_type" DEFAULT 'internal',
  	"version_part_of_link_new_tab" boolean DEFAULT false,
  	"version_part_of_link_internal_path" varchar,
  	"version_part_of_link_external_url" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_footer_v_locales" (
  	"version_cta_band_eyebrow" varchar,
  	"version_cta_band_heading" jsonb,
  	"version_cta_band_primary_button_label" varchar,
  	"version_cta_band_secondary_button_label" varchar,
  	"version_part_of_label" varchar,
  	"version_part_of_link_label" varchar,
  	"version_copyright" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "footer_id" integer;
  ALTER TABLE "footer_link_columns_links" ADD CONSTRAINT "footer_link_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_link_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_link_columns_links_locales" ADD CONSTRAINT "footer_link_columns_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_link_columns_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_link_columns" ADD CONSTRAINT "footer_link_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_link_columns_locales" ADD CONSTRAINT "footer_link_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_link_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer" ADD CONSTRAINT "footer_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer" ADD CONSTRAINT "footer_part_of_logo_id_media_id_fk" FOREIGN KEY ("part_of_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_locales" ADD CONSTRAINT "footer_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_version_link_columns_links" ADD CONSTRAINT "_footer_v_version_link_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_v_version_link_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_version_link_columns_links_locales" ADD CONSTRAINT "_footer_v_version_link_columns_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_v_version_link_columns_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_version_link_columns" ADD CONSTRAINT "_footer_v_version_link_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_version_link_columns_locales" ADD CONSTRAINT "_footer_v_version_link_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_v_version_link_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v" ADD CONSTRAINT "_footer_v_parent_id_footer_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."footer"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_footer_v" ADD CONSTRAINT "_footer_v_version_tenant_id_tenants_id_fk" FOREIGN KEY ("version_tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_footer_v" ADD CONSTRAINT "_footer_v_version_part_of_logo_id_media_id_fk" FOREIGN KEY ("version_part_of_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_footer_v_locales" ADD CONSTRAINT "_footer_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "footer_link_columns_links_order_idx" ON "footer_link_columns_links" USING btree ("_order");
  CREATE INDEX "footer_link_columns_links_parent_id_idx" ON "footer_link_columns_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_link_columns_links_locales_locale_parent_id_unique" ON "footer_link_columns_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_link_columns_order_idx" ON "footer_link_columns" USING btree ("_order");
  CREATE INDEX "footer_link_columns_parent_id_idx" ON "footer_link_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_link_columns_locales_locale_parent_id_unique" ON "footer_link_columns_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "footer_tenant_idx" ON "footer" USING btree ("tenant_id");
  CREATE INDEX "footer_part_of_part_of_logo_idx" ON "footer" USING btree ("part_of_logo_id");
  CREATE INDEX "footer_updated_at_idx" ON "footer" USING btree ("updated_at");
  CREATE INDEX "footer_created_at_idx" ON "footer" USING btree ("created_at");
  CREATE UNIQUE INDEX "footer_locales_locale_parent_id_unique" ON "footer_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_footer_v_version_link_columns_links_order_idx" ON "_footer_v_version_link_columns_links" USING btree ("_order");
  CREATE INDEX "_footer_v_version_link_columns_links_parent_id_idx" ON "_footer_v_version_link_columns_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_footer_v_version_link_columns_links_locales_locale_parent_i" ON "_footer_v_version_link_columns_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_footer_v_version_link_columns_order_idx" ON "_footer_v_version_link_columns" USING btree ("_order");
  CREATE INDEX "_footer_v_version_link_columns_parent_id_idx" ON "_footer_v_version_link_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_footer_v_version_link_columns_locales_locale_parent_id_uniq" ON "_footer_v_version_link_columns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_footer_v_parent_idx" ON "_footer_v" USING btree ("parent_id");
  CREATE INDEX "_footer_v_version_version_tenant_idx" ON "_footer_v" USING btree ("version_tenant_id");
  CREATE INDEX "_footer_v_version_part_of_version_part_of_logo_idx" ON "_footer_v" USING btree ("version_part_of_logo_id");
  CREATE INDEX "_footer_v_version_version_updated_at_idx" ON "_footer_v" USING btree ("version_updated_at");
  CREATE INDEX "_footer_v_version_version_created_at_idx" ON "_footer_v" USING btree ("version_created_at");
  CREATE INDEX "_footer_v_created_at_idx" ON "_footer_v" USING btree ("created_at");
  CREATE INDEX "_footer_v_updated_at_idx" ON "_footer_v" USING btree ("updated_at");
  CREATE UNIQUE INDEX "_footer_v_locales_locale_parent_id_unique" ON "_footer_v_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_footer_fk" FOREIGN KEY ("footer_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_footer_id_idx" ON "payload_locked_documents_rels" USING btree ("footer_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "footer_link_columns_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_link_columns_links_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_link_columns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_link_columns_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_footer_v_version_link_columns_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_footer_v_version_link_columns_links_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_footer_v_version_link_columns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_footer_v_version_link_columns_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_footer_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_footer_v_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "footer_link_columns_links" CASCADE;
  DROP TABLE "footer_link_columns_links_locales" CASCADE;
  DROP TABLE "footer_link_columns" CASCADE;
  DROP TABLE "footer_link_columns_locales" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "footer_locales" CASCADE;
  DROP TABLE "_footer_v_version_link_columns_links" CASCADE;
  DROP TABLE "_footer_v_version_link_columns_links_locales" CASCADE;
  DROP TABLE "_footer_v_version_link_columns" CASCADE;
  DROP TABLE "_footer_v_version_link_columns_locales" CASCADE;
  DROP TABLE "_footer_v" CASCADE;
  DROP TABLE "_footer_v_locales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_footer_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_footer_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "footer_id";
  DROP TYPE "public"."enum_footer_link_columns_links_link_type";
  DROP TYPE "public"."enum_footer_cta_band_primary_button_type";
  DROP TYPE "public"."enum_footer_cta_band_secondary_button_type";
  DROP TYPE "public"."enum_footer_part_of_link_type";
  DROP TYPE "public"."enum__footer_v_version_link_columns_links_link_type";
  DROP TYPE "public"."enum__footer_v_version_cta_band_primary_button_type";
  DROP TYPE "public"."enum__footer_v_version_cta_band_secondary_button_type";
  DROP TYPE "public"."enum__footer_v_version_part_of_link_type";`)
}
