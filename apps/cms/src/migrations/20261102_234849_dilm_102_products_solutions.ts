import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_products_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__products_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__products_v_published_locale" AS ENUM('en', 'id');
  CREATE TYPE "public"."enum_solutions_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__solutions_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__solutions_v_published_locale" AS ENUM('en', 'id');
  CREATE TABLE "products_variants_specs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"method" varchar,
  	"emphasized" boolean DEFAULT false
  );
  
  CREATE TABLE "products_variants_specs_locales" (
  	"parameter" varchar,
  	"value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_variants" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"formula" jsonb,
  	"cas_number" varchar,
  	"pds_file_id" integer,
  	"sds_file_id" integer
  );
  
  CREATE TABLE "products_variants_locales" (
  	"classification" varchar,
  	"packaging" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_applications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer
  );
  
  CREATE TABLE "products_applications_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"is_this_product" boolean DEFAULT false
  );
  
  CREATE TABLE "products_process_steps_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"slug_fallback" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"image_id" integer,
  	"formula" jsonb,
  	"cas_number" varchar,
  	"pds_file_id" integer,
  	"overview_image_id" integer,
  	"updated_by_id" integer,
  	"trashed_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_products_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "products_locales" (
  	"slug" varchar,
  	"path" varchar,
  	"name" varchar,
  	"product_group" varchar,
  	"short_description" varchar,
  	"classification" varchar,
  	"overview_title" jsonb,
  	"overview_body" jsonb,
  	"process_title" jsonb,
  	"process_description" varchar,
  	"process_stat_value" varchar,
  	"process_stat_label" varchar,
  	"process_stat_description" varchar,
  	"process_stat_note" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v_version_variants_specs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"method" varchar,
  	"emphasized" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_variants_specs_locales" (
  	"parameter" varchar,
  	"value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v_version_variants" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"formula" jsonb,
  	"cas_number" varchar,
  	"pds_file_id" integer,
  	"sds_file_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_variants_locales" (
  	"classification" varchar,
  	"packaging" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v_version_applications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_applications_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v_version_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"is_this_product" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_process_steps_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_tenant_id" integer,
  	"version_slug_fallback" boolean DEFAULT false,
  	"version_order" numeric DEFAULT 0,
  	"version_image_id" integer,
  	"version_formula" jsonb,
  	"version_cas_number" varchar,
  	"version_pds_file_id" integer,
  	"version_overview_image_id" integer,
  	"version_updated_by_id" integer,
  	"version_trashed_by_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__products_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__products_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_products_v_locales" (
  	"version_slug" varchar,
  	"version_path" varchar,
  	"version_name" varchar,
  	"version_product_group" varchar,
  	"version_short_description" varchar,
  	"version_classification" varchar,
  	"version_overview_title" jsonb,
  	"version_overview_body" jsonb,
  	"version_process_title" jsonb,
  	"version_process_description" varchar,
  	"version_process_stat_value" varchar,
  	"version_process_stat_label" varchar,
  	"version_process_stat_description" varchar,
  	"version_process_stat_note" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "solutions_key_applications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "solutions_key_applications_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_industries_served" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "solutions_industries_served_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_impact_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer
  );
  
  CREATE TABLE "solutions_impact_points_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_applications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "solutions_applications_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"slug_fallback" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"image_id" integer,
  	"featured_product_id" integer,
  	"impact_image_id" integer,
  	"updated_by_id" integer,
  	"trashed_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_solutions_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "solutions_locales" (
  	"slug" varchar,
  	"path" varchar,
  	"name" varchar,
  	"hero_title" jsonb,
  	"industry_label" varchar,
  	"short_description" varchar,
  	"impact_title" jsonb,
  	"impact_body" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "solutions_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer
  );
  
  CREATE TABLE "_solutions_v_version_key_applications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solutions_v_version_key_applications_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_version_industries_served" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solutions_v_version_industries_served_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_version_impact_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solutions_v_version_impact_points_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_version_applications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solutions_v_version_applications_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_tenant_id" integer,
  	"version_slug_fallback" boolean DEFAULT false,
  	"version_order" numeric DEFAULT 0,
  	"version_image_id" integer,
  	"version_featured_product_id" integer,
  	"version_impact_image_id" integer,
  	"version_updated_by_id" integer,
  	"version_trashed_by_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__solutions_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__solutions_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_solutions_v_locales" (
  	"version_slug" varchar,
  	"version_path" varchar,
  	"version_name" varchar,
  	"version_hero_title" jsonb,
  	"version_industry_label" varchar,
  	"version_short_description" varchar,
  	"version_impact_title" jsonb,
  	"version_impact_body" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solutions_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer
  );
  
  ALTER TABLE "routes_rels" ADD COLUMN "products_id" integer;
  ALTER TABLE "routes_rels" ADD COLUMN "solutions_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "products_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "solutions_id" integer;
  ALTER TABLE "products_variants_specs" ADD CONSTRAINT "products_variants_specs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_variants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_variants_specs_locales" ADD CONSTRAINT "products_variants_specs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_variants_specs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_variants" ADD CONSTRAINT "products_variants_pds_file_id_documents_id_fk" FOREIGN KEY ("pds_file_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_variants" ADD CONSTRAINT "products_variants_sds_file_id_documents_id_fk" FOREIGN KEY ("sds_file_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_variants" ADD CONSTRAINT "products_variants_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_variants_locales" ADD CONSTRAINT "products_variants_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_variants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_applications" ADD CONSTRAINT "products_applications_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_applications" ADD CONSTRAINT "products_applications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_applications_locales" ADD CONSTRAINT "products_applications_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_process_steps" ADD CONSTRAINT "products_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_process_steps_locales" ADD CONSTRAINT "products_process_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_process_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_pds_file_id_documents_id_fk" FOREIGN KEY ("pds_file_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_overview_image_id_media_id_fk" FOREIGN KEY ("overview_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_trashed_by_id_users_id_fk" FOREIGN KEY ("trashed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_locales" ADD CONSTRAINT "products_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_locales" ADD CONSTRAINT "products_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_variants_specs" ADD CONSTRAINT "_products_v_version_variants_specs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_version_variants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_variants_specs_locales" ADD CONSTRAINT "_products_v_version_variants_specs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_version_variants_specs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_variants" ADD CONSTRAINT "_products_v_version_variants_pds_file_id_documents_id_fk" FOREIGN KEY ("pds_file_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_version_variants" ADD CONSTRAINT "_products_v_version_variants_sds_file_id_documents_id_fk" FOREIGN KEY ("sds_file_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_version_variants" ADD CONSTRAINT "_products_v_version_variants_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_variants_locales" ADD CONSTRAINT "_products_v_version_variants_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_version_variants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_applications" ADD CONSTRAINT "_products_v_version_applications_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_version_applications" ADD CONSTRAINT "_products_v_version_applications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_applications_locales" ADD CONSTRAINT "_products_v_version_applications_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_version_applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_process_steps" ADD CONSTRAINT "_products_v_version_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_process_steps_locales" ADD CONSTRAINT "_products_v_version_process_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_version_process_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_parent_id_products_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_tenant_id_tenants_id_fk" FOREIGN KEY ("version_tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_pds_file_id_documents_id_fk" FOREIGN KEY ("version_pds_file_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_overview_image_id_media_id_fk" FOREIGN KEY ("version_overview_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_trashed_by_id_users_id_fk" FOREIGN KEY ("version_trashed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_locales" ADD CONSTRAINT "_products_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_locales" ADD CONSTRAINT "_products_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_key_applications" ADD CONSTRAINT "solutions_key_applications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_key_applications_locales" ADD CONSTRAINT "solutions_key_applications_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_key_applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_industries_served" ADD CONSTRAINT "solutions_industries_served_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_industries_served_locales" ADD CONSTRAINT "solutions_industries_served_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_industries_served"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_impact_points" ADD CONSTRAINT "solutions_impact_points_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solutions_impact_points" ADD CONSTRAINT "solutions_impact_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_impact_points_locales" ADD CONSTRAINT "solutions_impact_points_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_impact_points"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_applications" ADD CONSTRAINT "solutions_applications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_applications_locales" ADD CONSTRAINT "solutions_applications_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions" ADD CONSTRAINT "solutions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solutions" ADD CONSTRAINT "solutions_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solutions" ADD CONSTRAINT "solutions_featured_product_id_products_id_fk" FOREIGN KEY ("featured_product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solutions" ADD CONSTRAINT "solutions_impact_image_id_media_id_fk" FOREIGN KEY ("impact_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solutions" ADD CONSTRAINT "solutions_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solutions" ADD CONSTRAINT "solutions_trashed_by_id_users_id_fk" FOREIGN KEY ("trashed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solutions_locales" ADD CONSTRAINT "solutions_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solutions_locales" ADD CONSTRAINT "solutions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_rels" ADD CONSTRAINT "solutions_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_rels" ADD CONSTRAINT "solutions_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_version_key_applications" ADD CONSTRAINT "_solutions_v_version_key_applications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_version_key_applications_locales" ADD CONSTRAINT "_solutions_v_version_key_applications_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_version_key_applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_version_industries_served" ADD CONSTRAINT "_solutions_v_version_industries_served_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_version_industries_served_locales" ADD CONSTRAINT "_solutions_v_version_industries_served_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_version_industries_served"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_version_impact_points" ADD CONSTRAINT "_solutions_v_version_impact_points_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solutions_v_version_impact_points" ADD CONSTRAINT "_solutions_v_version_impact_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_version_impact_points_locales" ADD CONSTRAINT "_solutions_v_version_impact_points_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_version_impact_points"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_version_applications" ADD CONSTRAINT "_solutions_v_version_applications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_version_applications_locales" ADD CONSTRAINT "_solutions_v_version_applications_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v_version_applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v" ADD CONSTRAINT "_solutions_v_parent_id_solutions_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."solutions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solutions_v" ADD CONSTRAINT "_solutions_v_version_tenant_id_tenants_id_fk" FOREIGN KEY ("version_tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solutions_v" ADD CONSTRAINT "_solutions_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solutions_v" ADD CONSTRAINT "_solutions_v_version_featured_product_id_products_id_fk" FOREIGN KEY ("version_featured_product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solutions_v" ADD CONSTRAINT "_solutions_v_version_impact_image_id_media_id_fk" FOREIGN KEY ("version_impact_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solutions_v" ADD CONSTRAINT "_solutions_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solutions_v" ADD CONSTRAINT "_solutions_v_version_trashed_by_id_users_id_fk" FOREIGN KEY ("version_trashed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solutions_v_locales" ADD CONSTRAINT "_solutions_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solutions_v_locales" ADD CONSTRAINT "_solutions_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_rels" ADD CONSTRAINT "_solutions_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_rels" ADD CONSTRAINT "_solutions_v_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "products_variants_specs_order_idx" ON "products_variants_specs" USING btree ("_order");
  CREATE INDEX "products_variants_specs_parent_id_idx" ON "products_variants_specs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "products_variants_specs_locales_locale_parent_id_unique" ON "products_variants_specs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_variants_order_idx" ON "products_variants" USING btree ("_order");
  CREATE INDEX "products_variants_parent_id_idx" ON "products_variants" USING btree ("_parent_id");
  CREATE INDEX "products_variants_pds_file_idx" ON "products_variants" USING btree ("pds_file_id");
  CREATE INDEX "products_variants_sds_file_idx" ON "products_variants" USING btree ("sds_file_id");
  CREATE UNIQUE INDEX "products_variants_locales_locale_parent_id_unique" ON "products_variants_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_applications_order_idx" ON "products_applications" USING btree ("_order");
  CREATE INDEX "products_applications_parent_id_idx" ON "products_applications" USING btree ("_parent_id");
  CREATE INDEX "products_applications_icon_idx" ON "products_applications" USING btree ("icon_id");
  CREATE UNIQUE INDEX "products_applications_locales_locale_parent_id_unique" ON "products_applications_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_process_steps_order_idx" ON "products_process_steps" USING btree ("_order");
  CREATE INDEX "products_process_steps_parent_id_idx" ON "products_process_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "products_process_steps_locales_locale_parent_id_unique" ON "products_process_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_tenant_idx" ON "products" USING btree ("tenant_id");
  CREATE INDEX "products_image_idx" ON "products" USING btree ("image_id");
  CREATE INDEX "products_pds_file_idx" ON "products" USING btree ("pds_file_id");
  CREATE INDEX "products_overview_overview_image_idx" ON "products" USING btree ("overview_image_id");
  CREATE INDEX "products_updated_by_idx" ON "products" USING btree ("updated_by_id");
  CREATE INDEX "products_trashed_by_idx" ON "products" USING btree ("trashed_by_id");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE INDEX "products_deleted_at_idx" ON "products" USING btree ("deleted_at");
  CREATE INDEX "products__status_idx" ON "products" USING btree ("_status");
  CREATE INDEX "products_meta_meta_image_idx" ON "products_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "products_locales_locale_parent_id_unique" ON "products_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_version_variants_specs_order_idx" ON "_products_v_version_variants_specs" USING btree ("_order");
  CREATE INDEX "_products_v_version_variants_specs_parent_id_idx" ON "_products_v_version_variants_specs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_products_v_version_variants_specs_locales_locale_parent_id_" ON "_products_v_version_variants_specs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_version_variants_order_idx" ON "_products_v_version_variants" USING btree ("_order");
  CREATE INDEX "_products_v_version_variants_parent_id_idx" ON "_products_v_version_variants" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_variants_pds_file_idx" ON "_products_v_version_variants" USING btree ("pds_file_id");
  CREATE INDEX "_products_v_version_variants_sds_file_idx" ON "_products_v_version_variants" USING btree ("sds_file_id");
  CREATE UNIQUE INDEX "_products_v_version_variants_locales_locale_parent_id_unique" ON "_products_v_version_variants_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_version_applications_order_idx" ON "_products_v_version_applications" USING btree ("_order");
  CREATE INDEX "_products_v_version_applications_parent_id_idx" ON "_products_v_version_applications" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_applications_icon_idx" ON "_products_v_version_applications" USING btree ("icon_id");
  CREATE UNIQUE INDEX "_products_v_version_applications_locales_locale_parent_id_un" ON "_products_v_version_applications_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_version_process_steps_order_idx" ON "_products_v_version_process_steps" USING btree ("_order");
  CREATE INDEX "_products_v_version_process_steps_parent_id_idx" ON "_products_v_version_process_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_products_v_version_process_steps_locales_locale_parent_id_u" ON "_products_v_version_process_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_parent_idx" ON "_products_v" USING btree ("parent_id");
  CREATE INDEX "_products_v_version_version_tenant_idx" ON "_products_v" USING btree ("version_tenant_id");
  CREATE INDEX "_products_v_version_version_image_idx" ON "_products_v" USING btree ("version_image_id");
  CREATE INDEX "_products_v_version_version_pds_file_idx" ON "_products_v" USING btree ("version_pds_file_id");
  CREATE INDEX "_products_v_version_overview_version_overview_image_idx" ON "_products_v" USING btree ("version_overview_image_id");
  CREATE INDEX "_products_v_version_version_updated_by_idx" ON "_products_v" USING btree ("version_updated_by_id");
  CREATE INDEX "_products_v_version_version_trashed_by_idx" ON "_products_v" USING btree ("version_trashed_by_id");
  CREATE INDEX "_products_v_version_version_updated_at_idx" ON "_products_v" USING btree ("version_updated_at");
  CREATE INDEX "_products_v_version_version_created_at_idx" ON "_products_v" USING btree ("version_created_at");
  CREATE INDEX "_products_v_version_version_deleted_at_idx" ON "_products_v" USING btree ("version_deleted_at");
  CREATE INDEX "_products_v_version_version__status_idx" ON "_products_v" USING btree ("version__status");
  CREATE INDEX "_products_v_created_at_idx" ON "_products_v" USING btree ("created_at");
  CREATE INDEX "_products_v_updated_at_idx" ON "_products_v" USING btree ("updated_at");
  CREATE INDEX "_products_v_snapshot_idx" ON "_products_v" USING btree ("snapshot");
  CREATE INDEX "_products_v_published_locale_idx" ON "_products_v" USING btree ("published_locale");
  CREATE INDEX "_products_v_latest_idx" ON "_products_v" USING btree ("latest");
  CREATE INDEX "_products_v_version_meta_version_meta_image_idx" ON "_products_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_products_v_locales_locale_parent_id_unique" ON "_products_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_key_applications_order_idx" ON "solutions_key_applications" USING btree ("_order");
  CREATE INDEX "solutions_key_applications_parent_id_idx" ON "solutions_key_applications" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "solutions_key_applications_locales_locale_parent_id_unique" ON "solutions_key_applications_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_industries_served_order_idx" ON "solutions_industries_served" USING btree ("_order");
  CREATE INDEX "solutions_industries_served_parent_id_idx" ON "solutions_industries_served" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "solutions_industries_served_locales_locale_parent_id_unique" ON "solutions_industries_served_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_impact_points_order_idx" ON "solutions_impact_points" USING btree ("_order");
  CREATE INDEX "solutions_impact_points_parent_id_idx" ON "solutions_impact_points" USING btree ("_parent_id");
  CREATE INDEX "solutions_impact_points_icon_idx" ON "solutions_impact_points" USING btree ("icon_id");
  CREATE UNIQUE INDEX "solutions_impact_points_locales_locale_parent_id_unique" ON "solutions_impact_points_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_applications_order_idx" ON "solutions_applications" USING btree ("_order");
  CREATE INDEX "solutions_applications_parent_id_idx" ON "solutions_applications" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "solutions_applications_locales_locale_parent_id_unique" ON "solutions_applications_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_tenant_idx" ON "solutions" USING btree ("tenant_id");
  CREATE INDEX "solutions_image_idx" ON "solutions" USING btree ("image_id");
  CREATE INDEX "solutions_featured_product_idx" ON "solutions" USING btree ("featured_product_id");
  CREATE INDEX "solutions_impact_impact_image_idx" ON "solutions" USING btree ("impact_image_id");
  CREATE INDEX "solutions_updated_by_idx" ON "solutions" USING btree ("updated_by_id");
  CREATE INDEX "solutions_trashed_by_idx" ON "solutions" USING btree ("trashed_by_id");
  CREATE INDEX "solutions_updated_at_idx" ON "solutions" USING btree ("updated_at");
  CREATE INDEX "solutions_created_at_idx" ON "solutions" USING btree ("created_at");
  CREATE INDEX "solutions_deleted_at_idx" ON "solutions" USING btree ("deleted_at");
  CREATE INDEX "solutions__status_idx" ON "solutions" USING btree ("_status");
  CREATE INDEX "solutions_meta_meta_image_idx" ON "solutions_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "solutions_locales_locale_parent_id_unique" ON "solutions_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_rels_order_idx" ON "solutions_rels" USING btree ("order");
  CREATE INDEX "solutions_rels_parent_idx" ON "solutions_rels" USING btree ("parent_id");
  CREATE INDEX "solutions_rels_path_idx" ON "solutions_rels" USING btree ("path");
  CREATE INDEX "solutions_rels_products_id_idx" ON "solutions_rels" USING btree ("products_id");
  CREATE INDEX "_solutions_v_version_key_applications_order_idx" ON "_solutions_v_version_key_applications" USING btree ("_order");
  CREATE INDEX "_solutions_v_version_key_applications_parent_id_idx" ON "_solutions_v_version_key_applications" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_solutions_v_version_key_applications_locales_locale_parent_" ON "_solutions_v_version_key_applications_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_version_industries_served_order_idx" ON "_solutions_v_version_industries_served" USING btree ("_order");
  CREATE INDEX "_solutions_v_version_industries_served_parent_id_idx" ON "_solutions_v_version_industries_served" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_solutions_v_version_industries_served_locales_locale_parent" ON "_solutions_v_version_industries_served_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_version_impact_points_order_idx" ON "_solutions_v_version_impact_points" USING btree ("_order");
  CREATE INDEX "_solutions_v_version_impact_points_parent_id_idx" ON "_solutions_v_version_impact_points" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_version_impact_points_icon_idx" ON "_solutions_v_version_impact_points" USING btree ("icon_id");
  CREATE UNIQUE INDEX "_solutions_v_version_impact_points_locales_locale_parent_id_" ON "_solutions_v_version_impact_points_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_version_applications_order_idx" ON "_solutions_v_version_applications" USING btree ("_order");
  CREATE INDEX "_solutions_v_version_applications_parent_id_idx" ON "_solutions_v_version_applications" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_solutions_v_version_applications_locales_locale_parent_id_u" ON "_solutions_v_version_applications_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_parent_idx" ON "_solutions_v" USING btree ("parent_id");
  CREATE INDEX "_solutions_v_version_version_tenant_idx" ON "_solutions_v" USING btree ("version_tenant_id");
  CREATE INDEX "_solutions_v_version_version_image_idx" ON "_solutions_v" USING btree ("version_image_id");
  CREATE INDEX "_solutions_v_version_version_featured_product_idx" ON "_solutions_v" USING btree ("version_featured_product_id");
  CREATE INDEX "_solutions_v_version_impact_version_impact_image_idx" ON "_solutions_v" USING btree ("version_impact_image_id");
  CREATE INDEX "_solutions_v_version_version_updated_by_idx" ON "_solutions_v" USING btree ("version_updated_by_id");
  CREATE INDEX "_solutions_v_version_version_trashed_by_idx" ON "_solutions_v" USING btree ("version_trashed_by_id");
  CREATE INDEX "_solutions_v_version_version_updated_at_idx" ON "_solutions_v" USING btree ("version_updated_at");
  CREATE INDEX "_solutions_v_version_version_created_at_idx" ON "_solutions_v" USING btree ("version_created_at");
  CREATE INDEX "_solutions_v_version_version_deleted_at_idx" ON "_solutions_v" USING btree ("version_deleted_at");
  CREATE INDEX "_solutions_v_version_version__status_idx" ON "_solutions_v" USING btree ("version__status");
  CREATE INDEX "_solutions_v_created_at_idx" ON "_solutions_v" USING btree ("created_at");
  CREATE INDEX "_solutions_v_updated_at_idx" ON "_solutions_v" USING btree ("updated_at");
  CREATE INDEX "_solutions_v_snapshot_idx" ON "_solutions_v" USING btree ("snapshot");
  CREATE INDEX "_solutions_v_published_locale_idx" ON "_solutions_v" USING btree ("published_locale");
  CREATE INDEX "_solutions_v_latest_idx" ON "_solutions_v" USING btree ("latest");
  CREATE INDEX "_solutions_v_version_meta_version_meta_image_idx" ON "_solutions_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_solutions_v_locales_locale_parent_id_unique" ON "_solutions_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solutions_v_rels_order_idx" ON "_solutions_v_rels" USING btree ("order");
  CREATE INDEX "_solutions_v_rels_parent_idx" ON "_solutions_v_rels" USING btree ("parent_id");
  CREATE INDEX "_solutions_v_rels_path_idx" ON "_solutions_v_rels" USING btree ("path");
  CREATE INDEX "_solutions_v_rels_products_id_idx" ON "_solutions_v_rels" USING btree ("products_id");
  ALTER TABLE "routes_rels" ADD CONSTRAINT "routes_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "routes_rels" ADD CONSTRAINT "routes_rels_solutions_fk" FOREIGN KEY ("solutions_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_solutions_fk" FOREIGN KEY ("solutions_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "routes_rels_products_id_idx" ON "routes_rels" USING btree ("products_id");
  CREATE INDEX "routes_rels_solutions_id_idx" ON "routes_rels" USING btree ("solutions_id");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_solutions_id_idx" ON "payload_locked_documents_rels" USING btree ("solutions_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "products_variants_specs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_variants_specs_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_variants" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_variants_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_applications" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_applications_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_process_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_process_steps_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_products_v_version_variants_specs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_products_v_version_variants_specs_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_products_v_version_variants" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_products_v_version_variants_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_products_v_version_applications" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_products_v_version_applications_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_products_v_version_process_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_products_v_version_process_steps_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_products_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_products_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_key_applications" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_key_applications_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_industries_served" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_industries_served_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_impact_points" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_impact_points_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_applications" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_applications_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_version_key_applications" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_version_key_applications_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_version_industries_served" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_version_industries_served_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_version_impact_points" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_version_impact_points_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_version_applications" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_version_applications_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "products_variants_specs" CASCADE;
  DROP TABLE "products_variants_specs_locales" CASCADE;
  DROP TABLE "products_variants" CASCADE;
  DROP TABLE "products_variants_locales" CASCADE;
  DROP TABLE "products_applications" CASCADE;
  DROP TABLE "products_applications_locales" CASCADE;
  DROP TABLE "products_process_steps" CASCADE;
  DROP TABLE "products_process_steps_locales" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "products_locales" CASCADE;
  DROP TABLE "_products_v_version_variants_specs" CASCADE;
  DROP TABLE "_products_v_version_variants_specs_locales" CASCADE;
  DROP TABLE "_products_v_version_variants" CASCADE;
  DROP TABLE "_products_v_version_variants_locales" CASCADE;
  DROP TABLE "_products_v_version_applications" CASCADE;
  DROP TABLE "_products_v_version_applications_locales" CASCADE;
  DROP TABLE "_products_v_version_process_steps" CASCADE;
  DROP TABLE "_products_v_version_process_steps_locales" CASCADE;
  DROP TABLE "_products_v" CASCADE;
  DROP TABLE "_products_v_locales" CASCADE;
  DROP TABLE "solutions_key_applications" CASCADE;
  DROP TABLE "solutions_key_applications_locales" CASCADE;
  DROP TABLE "solutions_industries_served" CASCADE;
  DROP TABLE "solutions_industries_served_locales" CASCADE;
  DROP TABLE "solutions_impact_points" CASCADE;
  DROP TABLE "solutions_impact_points_locales" CASCADE;
  DROP TABLE "solutions_applications" CASCADE;
  DROP TABLE "solutions_applications_locales" CASCADE;
  DROP TABLE "solutions" CASCADE;
  DROP TABLE "solutions_locales" CASCADE;
  DROP TABLE "solutions_rels" CASCADE;
  DROP TABLE "_solutions_v_version_key_applications" CASCADE;
  DROP TABLE "_solutions_v_version_key_applications_locales" CASCADE;
  DROP TABLE "_solutions_v_version_industries_served" CASCADE;
  DROP TABLE "_solutions_v_version_industries_served_locales" CASCADE;
  DROP TABLE "_solutions_v_version_impact_points" CASCADE;
  DROP TABLE "_solutions_v_version_impact_points_locales" CASCADE;
  DROP TABLE "_solutions_v_version_applications" CASCADE;
  DROP TABLE "_solutions_v_version_applications_locales" CASCADE;
  DROP TABLE "_solutions_v" CASCADE;
  DROP TABLE "_solutions_v_locales" CASCADE;
  DROP TABLE "_solutions_v_rels" CASCADE;
  ALTER TABLE "routes_rels" DROP CONSTRAINT "routes_rels_products_fk";
  
  ALTER TABLE "routes_rels" DROP CONSTRAINT "routes_rels_solutions_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_products_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_solutions_fk";
  
  DROP INDEX "routes_rels_products_id_idx";
  DROP INDEX "routes_rels_solutions_id_idx";
  DROP INDEX "payload_locked_documents_rels_products_id_idx";
  DROP INDEX "payload_locked_documents_rels_solutions_id_idx";
  ALTER TABLE "routes_rels" DROP COLUMN "products_id";
  ALTER TABLE "routes_rels" DROP COLUMN "solutions_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "products_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "solutions_id";
  DROP TYPE "public"."enum_products_status";
  DROP TYPE "public"."enum__products_v_version_status";
  DROP TYPE "public"."enum__products_v_published_locale";
  DROP TYPE "public"."enum_solutions_status";
  DROP TYPE "public"."enum__solutions_v_version_status";
  DROP TYPE "public"."enum__solutions_v_published_locale";`)
}
