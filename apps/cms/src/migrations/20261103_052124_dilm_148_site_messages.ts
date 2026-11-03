import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_messages_not_found_buttons_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum__site_messages_v_version_not_found_buttons_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TABLE "site_messages_not_found_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_site_messages_not_found_buttons_link_type" DEFAULT 'internal' NOT NULL,
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar
  );
  
  CREATE TABLE "site_messages_not_found_buttons_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "site_messages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"not_found_code" varchar DEFAULT '404',
  	"cookie_banner_policy_version" varchar,
  	"updated_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_messages_locales" (
  	"not_found_title" varchar NOT NULL,
  	"not_found_description" varchar,
  	"cookie_banner_title" varchar NOT NULL,
  	"cookie_banner_body" jsonb,
  	"cookie_banner_accept_label" varchar NOT NULL,
  	"cookie_banner_reject_label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "site_messages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"shared_pages_id" integer,
  	"products_id" integer,
  	"solutions_id" integer,
  	"jobs_id" integer,
  	"posts_id" integer,
  	"categories_id" integer
  );
  
  CREATE TABLE "_site_messages_v_version_not_found_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__site_messages_v_version_not_found_buttons_link_type" DEFAULT 'internal' NOT NULL,
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_messages_v_version_not_found_buttons_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_site_messages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_tenant_id" integer,
  	"version_not_found_code" varchar DEFAULT '404',
  	"version_cookie_banner_policy_version" varchar,
  	"version_updated_by_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_site_messages_v_locales" (
  	"version_not_found_title" varchar NOT NULL,
  	"version_not_found_description" varchar,
  	"version_cookie_banner_title" varchar NOT NULL,
  	"version_cookie_banner_body" jsonb,
  	"version_cookie_banner_accept_label" varchar NOT NULL,
  	"version_cookie_banner_reject_label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_site_messages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"shared_pages_id" integer,
  	"products_id" integer,
  	"solutions_id" integer,
  	"jobs_id" integer,
  	"posts_id" integer,
  	"categories_id" integer
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "site_messages_id" integer;
  ALTER TABLE "site_messages_not_found_buttons" ADD CONSTRAINT "site_messages_not_found_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_messages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_messages_not_found_buttons_locales" ADD CONSTRAINT "site_messages_not_found_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_messages_not_found_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_messages" ADD CONSTRAINT "site_messages_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_messages" ADD CONSTRAINT "site_messages_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_messages_locales" ADD CONSTRAINT "site_messages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_messages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_messages_rels" ADD CONSTRAINT "site_messages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_messages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_messages_rels" ADD CONSTRAINT "site_messages_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_messages_rels" ADD CONSTRAINT "site_messages_rels_shared_pages_fk" FOREIGN KEY ("shared_pages_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_messages_rels" ADD CONSTRAINT "site_messages_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_messages_rels" ADD CONSTRAINT "site_messages_rels_solutions_fk" FOREIGN KEY ("solutions_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_messages_rels" ADD CONSTRAINT "site_messages_rels_jobs_fk" FOREIGN KEY ("jobs_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_messages_rels" ADD CONSTRAINT "site_messages_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_messages_rels" ADD CONSTRAINT "site_messages_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_messages_v_version_not_found_buttons" ADD CONSTRAINT "_site_messages_v_version_not_found_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_messages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_messages_v_version_not_found_buttons_locales" ADD CONSTRAINT "_site_messages_v_version_not_found_buttons_locales_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_messages_v_version_not_found_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_messages_v" ADD CONSTRAINT "_site_messages_v_parent_id_site_messages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_messages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_messages_v" ADD CONSTRAINT "_site_messages_v_version_tenant_id_tenants_id_fk" FOREIGN KEY ("version_tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_messages_v" ADD CONSTRAINT "_site_messages_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_messages_v_locales" ADD CONSTRAINT "_site_messages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_messages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_messages_v_rels" ADD CONSTRAINT "_site_messages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_site_messages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_messages_v_rels" ADD CONSTRAINT "_site_messages_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_messages_v_rels" ADD CONSTRAINT "_site_messages_v_rels_shared_pages_fk" FOREIGN KEY ("shared_pages_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_messages_v_rels" ADD CONSTRAINT "_site_messages_v_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_messages_v_rels" ADD CONSTRAINT "_site_messages_v_rels_solutions_fk" FOREIGN KEY ("solutions_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_messages_v_rels" ADD CONSTRAINT "_site_messages_v_rels_jobs_fk" FOREIGN KEY ("jobs_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_messages_v_rels" ADD CONSTRAINT "_site_messages_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_messages_v_rels" ADD CONSTRAINT "_site_messages_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_messages_not_found_buttons_order_idx" ON "site_messages_not_found_buttons" USING btree ("_order");
  CREATE INDEX "site_messages_not_found_buttons_parent_id_idx" ON "site_messages_not_found_buttons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_messages_not_found_buttons_locales_locale_parent_id_uni" ON "site_messages_not_found_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "site_messages_tenant_idx" ON "site_messages" USING btree ("tenant_id");
  CREATE INDEX "site_messages_updated_by_idx" ON "site_messages" USING btree ("updated_by_id");
  CREATE INDEX "site_messages_updated_at_idx" ON "site_messages" USING btree ("updated_at");
  CREATE INDEX "site_messages_created_at_idx" ON "site_messages" USING btree ("created_at");
  CREATE UNIQUE INDEX "site_messages_locales_locale_parent_id_unique" ON "site_messages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_messages_rels_order_idx" ON "site_messages_rels" USING btree ("order");
  CREATE INDEX "site_messages_rels_parent_idx" ON "site_messages_rels" USING btree ("parent_id");
  CREATE INDEX "site_messages_rels_path_idx" ON "site_messages_rels" USING btree ("path");
  CREATE INDEX "site_messages_rels_pages_id_idx" ON "site_messages_rels" USING btree ("pages_id");
  CREATE INDEX "site_messages_rels_shared_pages_id_idx" ON "site_messages_rels" USING btree ("shared_pages_id");
  CREATE INDEX "site_messages_rels_products_id_idx" ON "site_messages_rels" USING btree ("products_id");
  CREATE INDEX "site_messages_rels_solutions_id_idx" ON "site_messages_rels" USING btree ("solutions_id");
  CREATE INDEX "site_messages_rels_jobs_id_idx" ON "site_messages_rels" USING btree ("jobs_id");
  CREATE INDEX "site_messages_rels_posts_id_idx" ON "site_messages_rels" USING btree ("posts_id");
  CREATE INDEX "site_messages_rels_categories_id_idx" ON "site_messages_rels" USING btree ("categories_id");
  CREATE INDEX "_site_messages_v_version_not_found_buttons_order_idx" ON "_site_messages_v_version_not_found_buttons" USING btree ("_order");
  CREATE INDEX "_site_messages_v_version_not_found_buttons_parent_id_idx" ON "_site_messages_v_version_not_found_buttons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_site_messages_v_version_not_found_buttons_locales_locale_pa" ON "_site_messages_v_version_not_found_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_site_messages_v_parent_idx" ON "_site_messages_v" USING btree ("parent_id");
  CREATE INDEX "_site_messages_v_version_version_tenant_idx" ON "_site_messages_v" USING btree ("version_tenant_id");
  CREATE INDEX "_site_messages_v_version_version_updated_by_idx" ON "_site_messages_v" USING btree ("version_updated_by_id");
  CREATE INDEX "_site_messages_v_version_version_updated_at_idx" ON "_site_messages_v" USING btree ("version_updated_at");
  CREATE INDEX "_site_messages_v_version_version_created_at_idx" ON "_site_messages_v" USING btree ("version_created_at");
  CREATE INDEX "_site_messages_v_created_at_idx" ON "_site_messages_v" USING btree ("created_at");
  CREATE INDEX "_site_messages_v_updated_at_idx" ON "_site_messages_v" USING btree ("updated_at");
  CREATE UNIQUE INDEX "_site_messages_v_locales_locale_parent_id_unique" ON "_site_messages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_site_messages_v_rels_order_idx" ON "_site_messages_v_rels" USING btree ("order");
  CREATE INDEX "_site_messages_v_rels_parent_idx" ON "_site_messages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_site_messages_v_rels_path_idx" ON "_site_messages_v_rels" USING btree ("path");
  CREATE INDEX "_site_messages_v_rels_pages_id_idx" ON "_site_messages_v_rels" USING btree ("pages_id");
  CREATE INDEX "_site_messages_v_rels_shared_pages_id_idx" ON "_site_messages_v_rels" USING btree ("shared_pages_id");
  CREATE INDEX "_site_messages_v_rels_products_id_idx" ON "_site_messages_v_rels" USING btree ("products_id");
  CREATE INDEX "_site_messages_v_rels_solutions_id_idx" ON "_site_messages_v_rels" USING btree ("solutions_id");
  CREATE INDEX "_site_messages_v_rels_jobs_id_idx" ON "_site_messages_v_rels" USING btree ("jobs_id");
  CREATE INDEX "_site_messages_v_rels_posts_id_idx" ON "_site_messages_v_rels" USING btree ("posts_id");
  CREATE INDEX "_site_messages_v_rels_categories_id_idx" ON "_site_messages_v_rels" USING btree ("categories_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_site_messages_fk" FOREIGN KEY ("site_messages_id") REFERENCES "public"."site_messages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_site_messages_id_idx" ON "payload_locked_documents_rels" USING btree ("site_messages_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_messages_not_found_buttons" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_messages_not_found_buttons_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_messages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_messages_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_messages_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_messages_v_version_not_found_buttons" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_messages_v_version_not_found_buttons_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_messages_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_messages_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_messages_v_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "site_messages_not_found_buttons" CASCADE;
  DROP TABLE "site_messages_not_found_buttons_locales" CASCADE;
  DROP TABLE "site_messages" CASCADE;
  DROP TABLE "site_messages_locales" CASCADE;
  DROP TABLE "site_messages_rels" CASCADE;
  DROP TABLE "_site_messages_v_version_not_found_buttons" CASCADE;
  DROP TABLE "_site_messages_v_version_not_found_buttons_locales" CASCADE;
  DROP TABLE "_site_messages_v" CASCADE;
  DROP TABLE "_site_messages_v_locales" CASCADE;
  DROP TABLE "_site_messages_v_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_site_messages_fk";
  
  DROP INDEX "payload_locked_documents_rels_site_messages_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "site_messages_id";
  DROP TYPE "public"."enum_site_messages_not_found_buttons_link_type";
  DROP TYPE "public"."enum__site_messages_v_version_not_found_buttons_link_type";`)
}
