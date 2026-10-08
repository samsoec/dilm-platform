import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_header_nav_items_children_link_type" AS ENUM('internal', 'external');
  CREATE TYPE "public"."enum_header_nav_items_type" AS ENUM('link', 'dropdown');
  CREATE TYPE "public"."enum_header_nav_items_link_type" AS ENUM('internal', 'external');
  CREATE TYPE "public"."enum_header_cta_link_type" AS ENUM('internal', 'external');
  CREATE TYPE "public"."enum__header_v_version_nav_items_children_link_type" AS ENUM('internal', 'external');
  CREATE TYPE "public"."enum__header_v_version_nav_items_type" AS ENUM('link', 'dropdown');
  CREATE TYPE "public"."enum__header_v_version_nav_items_link_type" AS ENUM('internal', 'external');
  CREATE TYPE "public"."enum__header_v_version_cta_link_type" AS ENUM('internal', 'external');
  CREATE TABLE "header_nav_items_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_header_nav_items_children_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar
  );
  
  CREATE TABLE "header_nav_items_children_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "header_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_header_nav_items_type" DEFAULT 'link' NOT NULL,
  	"link_type" "enum_header_nav_items_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar
  );
  
  CREATE TABLE "header_nav_items_locales" (
  	"link_label" varchar,
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "header" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"show_search" boolean DEFAULT false,
  	"show_language_switcher" boolean DEFAULT true,
  	"cta_enabled" boolean DEFAULT false,
  	"cta_link_type" "enum_header_cta_link_type" DEFAULT 'internal',
  	"cta_link_new_tab" boolean DEFAULT false,
  	"cta_link_internal_path" varchar,
  	"cta_link_external_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "header_locales" (
  	"cta_link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_header_v_version_nav_items_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__header_v_version_nav_items_children_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_header_v_version_nav_items_children_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_header_v_version_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum__header_v_version_nav_items_type" DEFAULT 'link' NOT NULL,
  	"link_type" "enum__header_v_version_nav_items_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_header_v_version_nav_items_locales" (
  	"link_label" varchar,
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_header_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_tenant_id" integer,
  	"version_show_search" boolean DEFAULT false,
  	"version_show_language_switcher" boolean DEFAULT true,
  	"version_cta_enabled" boolean DEFAULT false,
  	"version_cta_link_type" "enum__header_v_version_cta_link_type" DEFAULT 'internal',
  	"version_cta_link_new_tab" boolean DEFAULT false,
  	"version_cta_link_internal_path" varchar,
  	"version_cta_link_external_url" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_header_v_locales" (
  	"version_cta_link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "header_id" integer;
  ALTER TABLE "header_nav_items_children" ADD CONSTRAINT "header_nav_items_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_nav_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_items_children_locales" ADD CONSTRAINT "header_nav_items_children_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_nav_items_children"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_items" ADD CONSTRAINT "header_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_items_locales" ADD CONSTRAINT "header_nav_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_nav_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header" ADD CONSTRAINT "header_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "header_locales" ADD CONSTRAINT "header_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_header_v_version_nav_items_children" ADD CONSTRAINT "_header_v_version_nav_items_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_header_v_version_nav_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_header_v_version_nav_items_children_locales" ADD CONSTRAINT "_header_v_version_nav_items_children_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_header_v_version_nav_items_children"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_header_v_version_nav_items" ADD CONSTRAINT "_header_v_version_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_header_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_header_v_version_nav_items_locales" ADD CONSTRAINT "_header_v_version_nav_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_header_v_version_nav_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_header_v" ADD CONSTRAINT "_header_v_parent_id_header_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."header"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_header_v" ADD CONSTRAINT "_header_v_version_tenant_id_tenants_id_fk" FOREIGN KEY ("version_tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_header_v_locales" ADD CONSTRAINT "_header_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_header_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "header_nav_items_children_order_idx" ON "header_nav_items_children" USING btree ("_order");
  CREATE INDEX "header_nav_items_children_parent_id_idx" ON "header_nav_items_children" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "header_nav_items_children_locales_locale_parent_id_unique" ON "header_nav_items_children_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "header_nav_items_order_idx" ON "header_nav_items" USING btree ("_order");
  CREATE INDEX "header_nav_items_parent_id_idx" ON "header_nav_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "header_nav_items_locales_locale_parent_id_unique" ON "header_nav_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "header_tenant_idx" ON "header" USING btree ("tenant_id");
  CREATE INDEX "header_updated_at_idx" ON "header" USING btree ("updated_at");
  CREATE INDEX "header_created_at_idx" ON "header" USING btree ("created_at");
  CREATE UNIQUE INDEX "header_locales_locale_parent_id_unique" ON "header_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_header_v_version_nav_items_children_order_idx" ON "_header_v_version_nav_items_children" USING btree ("_order");
  CREATE INDEX "_header_v_version_nav_items_children_parent_id_idx" ON "_header_v_version_nav_items_children" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_header_v_version_nav_items_children_locales_locale_parent_i" ON "_header_v_version_nav_items_children_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_header_v_version_nav_items_order_idx" ON "_header_v_version_nav_items" USING btree ("_order");
  CREATE INDEX "_header_v_version_nav_items_parent_id_idx" ON "_header_v_version_nav_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_header_v_version_nav_items_locales_locale_parent_id_unique" ON "_header_v_version_nav_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_header_v_parent_idx" ON "_header_v" USING btree ("parent_id");
  CREATE INDEX "_header_v_version_version_tenant_idx" ON "_header_v" USING btree ("version_tenant_id");
  CREATE INDEX "_header_v_version_version_updated_at_idx" ON "_header_v" USING btree ("version_updated_at");
  CREATE INDEX "_header_v_version_version_created_at_idx" ON "_header_v" USING btree ("version_created_at");
  CREATE INDEX "_header_v_created_at_idx" ON "_header_v" USING btree ("created_at");
  CREATE INDEX "_header_v_updated_at_idx" ON "_header_v" USING btree ("updated_at");
  CREATE UNIQUE INDEX "_header_v_locales_locale_parent_id_unique" ON "_header_v_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_header_fk" FOREIGN KEY ("header_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_header_id_idx" ON "payload_locked_documents_rels" USING btree ("header_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "header_nav_items_children" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "header_nav_items_children_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "header_nav_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "header_nav_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "header" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "header_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_header_v_version_nav_items_children" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_header_v_version_nav_items_children_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_header_v_version_nav_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_header_v_version_nav_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_header_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_header_v_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "header_nav_items_children" CASCADE;
  DROP TABLE "header_nav_items_children_locales" CASCADE;
  DROP TABLE "header_nav_items" CASCADE;
  DROP TABLE "header_nav_items_locales" CASCADE;
  DROP TABLE "header" CASCADE;
  DROP TABLE "header_locales" CASCADE;
  DROP TABLE "_header_v_version_nav_items_children" CASCADE;
  DROP TABLE "_header_v_version_nav_items_children_locales" CASCADE;
  DROP TABLE "_header_v_version_nav_items" CASCADE;
  DROP TABLE "_header_v_version_nav_items_locales" CASCADE;
  DROP TABLE "_header_v" CASCADE;
  DROP TABLE "_header_v_locales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_header_fk";
  
  DROP INDEX "payload_locked_documents_rels_header_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "header_id";
  DROP TYPE "public"."enum_header_nav_items_children_link_type";
  DROP TYPE "public"."enum_header_nav_items_type";
  DROP TYPE "public"."enum_header_nav_items_link_type";
  DROP TYPE "public"."enum_header_cta_link_type";
  DROP TYPE "public"."enum__header_v_version_nav_items_children_link_type";
  DROP TYPE "public"."enum__header_v_version_nav_items_type";
  DROP TYPE "public"."enum__header_v_version_nav_items_link_type";
  DROP TYPE "public"."enum__header_v_version_cta_link_type";`)
}
