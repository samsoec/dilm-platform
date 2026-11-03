import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_pubhero_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_pages_pl_source" AS ENUM('all', 'currentCategory', 'categories');
  CREATE TYPE "public"."enum_pages_pl_empty_state_button_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___pages_v_pubhero_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___pages_v_pl_v_source" AS ENUM('all', 'currentCategory', 'categories');
  CREATE TYPE "public"."enum___pages_v_pl_v_empty_state_button_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_pages_pubhero_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_pages_pl_source" AS ENUM('all', 'currentCategory', 'categories');
  CREATE TYPE "public"."enum_shared_pages_pl_empty_state_button_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___shared_pages_v_pubhero_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___shared_pages_v_pl_v_source" AS ENUM('all', 'currentCategory', 'categories');
  CREATE TYPE "public"."enum___shared_pages_v_pl_v_empty_state_button_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_detail_templates_pubhero_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_detail_templates_pl_source" AS ENUM('all', 'currentCategory', 'categories');
  CREATE TYPE "public"."enum_detail_templates_pl_empty_state_button_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___detail_templates_v_pubhero_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___detail_templates_v_pl_v_source" AS ENUM('all', 'currentCategory', 'categories');
  CREATE TYPE "public"."enum___detail_templates_v_pl_v_empty_state_button_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_detail_templates_pubhero_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_detail_templates_pl_source" AS ENUM('all', 'currentCategory', 'categories');
  CREATE TYPE "public"."enum_shared_detail_templates_pl_empty_state_button_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___shared_detail_templates_v_pubhero_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___shared_detail_templates_v_pl_v_source" AS ENUM('all', 'currentCategory', 'categories');
  CREATE TYPE "public"."enum___shared_detail_templates_v_pl_v_empty_state_button_type" AS ENUM('internal', 'external', 'reference');
  CREATE TABLE "pages_pubhero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"background_image_id" integer,
  	"heading_align" "enum_pages_pubhero_heading_align" DEFAULT 'center',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_pubhero_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"search_placeholder" varchar,
  	"search_label" varchar,
  	"all_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_pl" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_pages_pl_source" DEFAULT 'all',
  	"featured_id" integer,
  	"page_size" numeric DEFAULT 10,
  	"empty_state_button_type" "enum_pages_pl_empty_state_button_type" DEFAULT 'internal',
  	"empty_state_button_new_tab" boolean DEFAULT false,
  	"empty_state_button_internal_path" varchar,
  	"empty_state_button_external_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_pl_locales" (
  	"results_label" varchar,
  	"empty_state_title" varchar,
  	"empty_state_description" varchar,
  	"empty_state_button_label" varchar,
  	"highlights_title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "__pages_v_pubhero_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"background_image_id" integer,
  	"heading_align" "enum___pages_v_pubhero_v_heading_align" DEFAULT 'center',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__pages_v_pubhero_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"search_placeholder" varchar,
  	"search_label" varchar,
  	"all_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__pages_v_pl_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"source" "enum___pages_v_pl_v_source" DEFAULT 'all',
  	"featured_id" integer,
  	"page_size" numeric DEFAULT 10,
  	"empty_state_button_type" "enum___pages_v_pl_v_empty_state_button_type" DEFAULT 'internal',
  	"empty_state_button_new_tab" boolean DEFAULT false,
  	"empty_state_button_internal_path" varchar,
  	"empty_state_button_external_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__pages_v_pl_v_locales" (
  	"results_label" varchar,
  	"empty_state_title" varchar,
  	"empty_state_description" varchar,
  	"empty_state_button_label" varchar,
  	"highlights_title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "shared_pages_pubhero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"background_image_id" integer,
  	"heading_align" "enum_shared_pages_pubhero_heading_align" DEFAULT 'center',
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_pages_pubhero_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"search_placeholder" varchar,
  	"search_label" varchar,
  	"all_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_pl" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_shared_pages_pl_source" DEFAULT 'all',
  	"featured_id" integer,
  	"page_size" numeric DEFAULT 10,
  	"empty_state_button_type" "enum_shared_pages_pl_empty_state_button_type" DEFAULT 'internal',
  	"empty_state_button_new_tab" boolean DEFAULT false,
  	"empty_state_button_internal_path" varchar,
  	"empty_state_button_external_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_pages_pl_locales" (
  	"results_label" varchar,
  	"empty_state_title" varchar,
  	"empty_state_description" varchar,
  	"empty_state_button_label" varchar,
  	"highlights_title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_pubhero_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"background_image_id" integer,
  	"heading_align" "enum___shared_pages_v_pubhero_v_heading_align" DEFAULT 'center',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_pages_v_pubhero_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"search_placeholder" varchar,
  	"search_label" varchar,
  	"all_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_pl_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"source" "enum___shared_pages_v_pl_v_source" DEFAULT 'all',
  	"featured_id" integer,
  	"page_size" numeric DEFAULT 10,
  	"empty_state_button_type" "enum___shared_pages_v_pl_v_empty_state_button_type" DEFAULT 'internal',
  	"empty_state_button_new_tab" boolean DEFAULT false,
  	"empty_state_button_internal_path" varchar,
  	"empty_state_button_external_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_pages_v_pl_v_locales" (
  	"results_label" varchar,
  	"empty_state_title" varchar,
  	"empty_state_description" varchar,
  	"empty_state_button_label" varchar,
  	"highlights_title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "detail_templates_pubhero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"background_image_id" integer,
  	"heading_align" "enum_detail_templates_pubhero_heading_align" DEFAULT 'center',
  	"block_name" varchar
  );
  
  CREATE TABLE "detail_templates_pubhero_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"search_placeholder" varchar,
  	"search_label" varchar,
  	"all_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_pl" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_detail_templates_pl_source" DEFAULT 'all',
  	"featured_id" integer,
  	"page_size" numeric DEFAULT 10,
  	"empty_state_button_type" "enum_detail_templates_pl_empty_state_button_type" DEFAULT 'internal',
  	"empty_state_button_new_tab" boolean DEFAULT false,
  	"empty_state_button_internal_path" varchar,
  	"empty_state_button_external_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "detail_templates_pl_locales" (
  	"results_label" varchar,
  	"empty_state_title" varchar,
  	"empty_state_description" varchar,
  	"empty_state_button_label" varchar,
  	"highlights_title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_pubhero_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"background_image_id" integer,
  	"heading_align" "enum___detail_templates_v_pubhero_v_heading_align" DEFAULT 'center',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__detail_templates_v_pubhero_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"search_placeholder" varchar,
  	"search_label" varchar,
  	"all_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_pl_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"source" "enum___detail_templates_v_pl_v_source" DEFAULT 'all',
  	"featured_id" integer,
  	"page_size" numeric DEFAULT 10,
  	"empty_state_button_type" "enum___detail_templates_v_pl_v_empty_state_button_type" DEFAULT 'internal',
  	"empty_state_button_new_tab" boolean DEFAULT false,
  	"empty_state_button_internal_path" varchar,
  	"empty_state_button_external_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__detail_templates_v_pl_v_locales" (
  	"results_label" varchar,
  	"empty_state_title" varchar,
  	"empty_state_description" varchar,
  	"empty_state_button_label" varchar,
  	"highlights_title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_pubhero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"background_image_id" integer,
  	"heading_align" "enum_shared_detail_templates_pubhero_heading_align" DEFAULT 'center',
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_detail_templates_pubhero_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"search_placeholder" varchar,
  	"search_label" varchar,
  	"all_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_pl" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_shared_detail_templates_pl_source" DEFAULT 'all',
  	"featured_id" integer,
  	"page_size" numeric DEFAULT 10,
  	"empty_state_button_type" "enum_shared_detail_templates_pl_empty_state_button_type" DEFAULT 'internal',
  	"empty_state_button_new_tab" boolean DEFAULT false,
  	"empty_state_button_internal_path" varchar,
  	"empty_state_button_external_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_detail_templates_pl_locales" (
  	"results_label" varchar,
  	"empty_state_title" varchar,
  	"empty_state_description" varchar,
  	"empty_state_button_label" varchar,
  	"highlights_title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_pubhero_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"background_image_id" integer,
  	"heading_align" "enum___shared_detail_templates_v_pubhero_v_heading_align" DEFAULT 'center',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_pubhero_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"search_placeholder" varchar,
  	"search_label" varchar,
  	"all_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_pl_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"source" "enum___shared_detail_templates_v_pl_v_source" DEFAULT 'all',
  	"featured_id" integer,
  	"page_size" numeric DEFAULT 10,
  	"empty_state_button_type" "enum___shared_detail_templates_v_pl_v_empty_state_button_type" DEFAULT 'internal',
  	"empty_state_button_new_tab" boolean DEFAULT false,
  	"empty_state_button_internal_path" varchar,
  	"empty_state_button_external_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_pl_v_locales" (
  	"results_label" varchar,
  	"empty_state_title" varchar,
  	"empty_state_description" varchar,
  	"empty_state_button_label" varchar,
  	"highlights_title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages_pubhero" ADD CONSTRAINT "pages_pubhero_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_pubhero" ADD CONSTRAINT "pages_pubhero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_pubhero_locales" ADD CONSTRAINT "pages_pubhero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_pubhero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_pl" ADD CONSTRAINT "pages_pl_featured_id_posts_id_fk" FOREIGN KEY ("featured_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_pl" ADD CONSTRAINT "pages_pl_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_pl_locales" ADD CONSTRAINT "pages_pl_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_pl"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_pubhero_v" ADD CONSTRAINT "__pages_v_pubhero_v_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__pages_v_pubhero_v" ADD CONSTRAINT "__pages_v_pubhero_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_pubhero_v_locales" ADD CONSTRAINT "__pages_v_pubhero_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_pubhero_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_pl_v" ADD CONSTRAINT "__pages_v_pl_v_featured_id_posts_id_fk" FOREIGN KEY ("featured_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__pages_v_pl_v" ADD CONSTRAINT "__pages_v_pl_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_pl_v_locales" ADD CONSTRAINT "__pages_v_pl_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_pl_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_pubhero" ADD CONSTRAINT "shared_pages_pubhero_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_pages_pubhero" ADD CONSTRAINT "shared_pages_pubhero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_pubhero_locales" ADD CONSTRAINT "shared_pages_pubhero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_pubhero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_pl" ADD CONSTRAINT "shared_pages_pl_featured_id_posts_id_fk" FOREIGN KEY ("featured_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_pages_pl" ADD CONSTRAINT "shared_pages_pl_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_pl_locales" ADD CONSTRAINT "shared_pages_pl_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_pl"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_pubhero_v" ADD CONSTRAINT "__shared_pages_v_pubhero_v_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_pubhero_v" ADD CONSTRAINT "__shared_pages_v_pubhero_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_pubhero_v_locales" ADD CONSTRAINT "__shared_pages_v_pubhero_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_pubhero_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_pl_v" ADD CONSTRAINT "__shared_pages_v_pl_v_featured_id_posts_id_fk" FOREIGN KEY ("featured_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_pl_v" ADD CONSTRAINT "__shared_pages_v_pl_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_pl_v_locales" ADD CONSTRAINT "__shared_pages_v_pl_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_pl_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_pubhero" ADD CONSTRAINT "detail_templates_pubhero_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "detail_templates_pubhero" ADD CONSTRAINT "detail_templates_pubhero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_pubhero_locales" ADD CONSTRAINT "detail_templates_pubhero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_pubhero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_pl" ADD CONSTRAINT "detail_templates_pl_featured_id_posts_id_fk" FOREIGN KEY ("featured_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "detail_templates_pl" ADD CONSTRAINT "detail_templates_pl_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_pl_locales" ADD CONSTRAINT "detail_templates_pl_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_pl"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_pubhero_v" ADD CONSTRAINT "__detail_templates_v_pubhero_v_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_pubhero_v" ADD CONSTRAINT "__detail_templates_v_pubhero_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_pubhero_v_locales" ADD CONSTRAINT "__detail_templates_v_pubhero_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_pubhero_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_pl_v" ADD CONSTRAINT "__detail_templates_v_pl_v_featured_id_posts_id_fk" FOREIGN KEY ("featured_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_pl_v" ADD CONSTRAINT "__detail_templates_v_pl_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_pl_v_locales" ADD CONSTRAINT "__detail_templates_v_pl_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_pl_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_pubhero" ADD CONSTRAINT "shared_detail_templates_pubhero_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_pubhero" ADD CONSTRAINT "shared_detail_templates_pubhero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_pubhero_locales" ADD CONSTRAINT "shared_detail_templates_pubhero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_pubhero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_pl" ADD CONSTRAINT "shared_detail_templates_pl_featured_id_posts_id_fk" FOREIGN KEY ("featured_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_pl" ADD CONSTRAINT "shared_detail_templates_pl_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_pl_locales" ADD CONSTRAINT "shared_detail_templates_pl_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_pl"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_pubhero_v" ADD CONSTRAINT "__shared_detail_templates_v_pubhero_v_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_pubhero_v" ADD CONSTRAINT "__shared_detail_templates_v_pubhero_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_pubhero_v_locales" ADD CONSTRAINT "__shared_detail_templates_v_pubhero_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_pubhero_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_pl_v" ADD CONSTRAINT "__shared_detail_templates_v_pl_v_featured_id_posts_id_fk" FOREIGN KEY ("featured_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_pl_v" ADD CONSTRAINT "__shared_detail_templates_v_pl_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_pl_v_locales" ADD CONSTRAINT "__shared_detail_templates_v_pl_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_pl_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_pubhero_order_idx" ON "pages_pubhero" USING btree ("_order");
  CREATE INDEX "pages_pubhero_parent_id_idx" ON "pages_pubhero" USING btree ("_parent_id");
  CREATE INDEX "pages_pubhero_path_idx" ON "pages_pubhero" USING btree ("_path");
  CREATE INDEX "pages_pubhero_background_image_idx" ON "pages_pubhero" USING btree ("background_image_id");
  CREATE UNIQUE INDEX "pages_pubhero_locales_locale_parent_id_unique" ON "pages_pubhero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_pl_order_idx" ON "pages_pl" USING btree ("_order");
  CREATE INDEX "pages_pl_parent_id_idx" ON "pages_pl" USING btree ("_parent_id");
  CREATE INDEX "pages_pl_path_idx" ON "pages_pl" USING btree ("_path");
  CREATE INDEX "pages_pl_featured_idx" ON "pages_pl" USING btree ("featured_id");
  CREATE UNIQUE INDEX "pages_pl_locales_locale_parent_id_unique" ON "pages_pl_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__pages_v_pubhero_v_order_idx" ON "__pages_v_pubhero_v" USING btree ("_order");
  CREATE INDEX "__pages_v_pubhero_v_parent_id_idx" ON "__pages_v_pubhero_v" USING btree ("_parent_id");
  CREATE INDEX "__pages_v_pubhero_v_path_idx" ON "__pages_v_pubhero_v" USING btree ("_path");
  CREATE INDEX "__pages_v_pubhero_v_background_image_idx" ON "__pages_v_pubhero_v" USING btree ("background_image_id");
  CREATE UNIQUE INDEX "__pages_v_pubhero_v_locales_locale_parent_id_unique" ON "__pages_v_pubhero_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__pages_v_pl_v_order_idx" ON "__pages_v_pl_v" USING btree ("_order");
  CREATE INDEX "__pages_v_pl_v_parent_id_idx" ON "__pages_v_pl_v" USING btree ("_parent_id");
  CREATE INDEX "__pages_v_pl_v_path_idx" ON "__pages_v_pl_v" USING btree ("_path");
  CREATE INDEX "__pages_v_pl_v_featured_idx" ON "__pages_v_pl_v" USING btree ("featured_id");
  CREATE UNIQUE INDEX "__pages_v_pl_v_locales_locale_parent_id_unique" ON "__pages_v_pl_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_pubhero_order_idx" ON "shared_pages_pubhero" USING btree ("_order");
  CREATE INDEX "shared_pages_pubhero_parent_id_idx" ON "shared_pages_pubhero" USING btree ("_parent_id");
  CREATE INDEX "shared_pages_pubhero_path_idx" ON "shared_pages_pubhero" USING btree ("_path");
  CREATE INDEX "shared_pages_pubhero_background_image_idx" ON "shared_pages_pubhero" USING btree ("background_image_id");
  CREATE UNIQUE INDEX "shared_pages_pubhero_locales_locale_parent_id_unique" ON "shared_pages_pubhero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_pl_order_idx" ON "shared_pages_pl" USING btree ("_order");
  CREATE INDEX "shared_pages_pl_parent_id_idx" ON "shared_pages_pl" USING btree ("_parent_id");
  CREATE INDEX "shared_pages_pl_path_idx" ON "shared_pages_pl" USING btree ("_path");
  CREATE INDEX "shared_pages_pl_featured_idx" ON "shared_pages_pl" USING btree ("featured_id");
  CREATE UNIQUE INDEX "shared_pages_pl_locales_locale_parent_id_unique" ON "shared_pages_pl_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_pages_v_pubhero_v_order_idx" ON "__shared_pages_v_pubhero_v" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_pubhero_v_parent_id_idx" ON "__shared_pages_v_pubhero_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_pages_v_pubhero_v_path_idx" ON "__shared_pages_v_pubhero_v" USING btree ("_path");
  CREATE INDEX "__shared_pages_v_pubhero_v_background_image_idx" ON "__shared_pages_v_pubhero_v" USING btree ("background_image_id");
  CREATE UNIQUE INDEX "__shared_pages_v_pubhero_v_locales_locale_parent_id_unique" ON "__shared_pages_v_pubhero_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_pages_v_pl_v_order_idx" ON "__shared_pages_v_pl_v" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_pl_v_parent_id_idx" ON "__shared_pages_v_pl_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_pages_v_pl_v_path_idx" ON "__shared_pages_v_pl_v" USING btree ("_path");
  CREATE INDEX "__shared_pages_v_pl_v_featured_idx" ON "__shared_pages_v_pl_v" USING btree ("featured_id");
  CREATE UNIQUE INDEX "__shared_pages_v_pl_v_locales_locale_parent_id_unique" ON "__shared_pages_v_pl_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_pubhero_order_idx" ON "detail_templates_pubhero" USING btree ("_order");
  CREATE INDEX "detail_templates_pubhero_parent_id_idx" ON "detail_templates_pubhero" USING btree ("_parent_id");
  CREATE INDEX "detail_templates_pubhero_path_idx" ON "detail_templates_pubhero" USING btree ("_path");
  CREATE INDEX "detail_templates_pubhero_background_image_idx" ON "detail_templates_pubhero" USING btree ("background_image_id");
  CREATE UNIQUE INDEX "detail_templates_pubhero_locales_locale_parent_id_unique" ON "detail_templates_pubhero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_pl_order_idx" ON "detail_templates_pl" USING btree ("_order");
  CREATE INDEX "detail_templates_pl_parent_id_idx" ON "detail_templates_pl" USING btree ("_parent_id");
  CREATE INDEX "detail_templates_pl_path_idx" ON "detail_templates_pl" USING btree ("_path");
  CREATE INDEX "detail_templates_pl_featured_idx" ON "detail_templates_pl" USING btree ("featured_id");
  CREATE UNIQUE INDEX "detail_templates_pl_locales_locale_parent_id_unique" ON "detail_templates_pl_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__detail_templates_v_pubhero_v_order_idx" ON "__detail_templates_v_pubhero_v" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_pubhero_v_parent_id_idx" ON "__detail_templates_v_pubhero_v" USING btree ("_parent_id");
  CREATE INDEX "__detail_templates_v_pubhero_v_path_idx" ON "__detail_templates_v_pubhero_v" USING btree ("_path");
  CREATE INDEX "__detail_templates_v_pubhero_v_background_image_idx" ON "__detail_templates_v_pubhero_v" USING btree ("background_image_id");
  CREATE UNIQUE INDEX "__detail_templates_v_pubhero_v_locales_locale_parent_id_uniq" ON "__detail_templates_v_pubhero_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__detail_templates_v_pl_v_order_idx" ON "__detail_templates_v_pl_v" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_pl_v_parent_id_idx" ON "__detail_templates_v_pl_v" USING btree ("_parent_id");
  CREATE INDEX "__detail_templates_v_pl_v_path_idx" ON "__detail_templates_v_pl_v" USING btree ("_path");
  CREATE INDEX "__detail_templates_v_pl_v_featured_idx" ON "__detail_templates_v_pl_v" USING btree ("featured_id");
  CREATE UNIQUE INDEX "__detail_templates_v_pl_v_locales_locale_parent_id_unique" ON "__detail_templates_v_pl_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_pubhero_order_idx" ON "shared_detail_templates_pubhero" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_pubhero_parent_id_idx" ON "shared_detail_templates_pubhero" USING btree ("_parent_id");
  CREATE INDEX "shared_detail_templates_pubhero_path_idx" ON "shared_detail_templates_pubhero" USING btree ("_path");
  CREATE INDEX "shared_detail_templates_pubhero_background_image_idx" ON "shared_detail_templates_pubhero" USING btree ("background_image_id");
  CREATE UNIQUE INDEX "shared_detail_templates_pubhero_locales_locale_parent_id_uni" ON "shared_detail_templates_pubhero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_pl_order_idx" ON "shared_detail_templates_pl" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_pl_parent_id_idx" ON "shared_detail_templates_pl" USING btree ("_parent_id");
  CREATE INDEX "shared_detail_templates_pl_path_idx" ON "shared_detail_templates_pl" USING btree ("_path");
  CREATE INDEX "shared_detail_templates_pl_featured_idx" ON "shared_detail_templates_pl" USING btree ("featured_id");
  CREATE UNIQUE INDEX "shared_detail_templates_pl_locales_locale_parent_id_unique" ON "shared_detail_templates_pl_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_pubhero_v_order_idx" ON "__shared_detail_templates_v_pubhero_v" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_pubhero_v_parent_id_idx" ON "__shared_detail_templates_v_pubhero_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_detail_templates_v_pubhero_v_path_idx" ON "__shared_detail_templates_v_pubhero_v" USING btree ("_path");
  CREATE INDEX "__shared_detail_templates_v_pubhero_v_background_image_idx" ON "__shared_detail_templates_v_pubhero_v" USING btree ("background_image_id");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_pubhero_v_locales_locale_parent_" ON "__shared_detail_templates_v_pubhero_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_pl_v_order_idx" ON "__shared_detail_templates_v_pl_v" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_pl_v_parent_id_idx" ON "__shared_detail_templates_v_pl_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_detail_templates_v_pl_v_path_idx" ON "__shared_detail_templates_v_pl_v" USING btree ("_path");
  CREATE INDEX "__shared_detail_templates_v_pl_v_featured_idx" ON "__shared_detail_templates_v_pl_v" USING btree ("featured_id");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_pl_v_locales_locale_parent_id_un" ON "__shared_detail_templates_v_pl_v_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_pubhero" CASCADE;
  DROP TABLE "pages_pubhero_locales" CASCADE;
  DROP TABLE "pages_pl" CASCADE;
  DROP TABLE "pages_pl_locales" CASCADE;
  DROP TABLE "__pages_v_pubhero_v" CASCADE;
  DROP TABLE "__pages_v_pubhero_v_locales" CASCADE;
  DROP TABLE "__pages_v_pl_v" CASCADE;
  DROP TABLE "__pages_v_pl_v_locales" CASCADE;
  DROP TABLE "shared_pages_pubhero" CASCADE;
  DROP TABLE "shared_pages_pubhero_locales" CASCADE;
  DROP TABLE "shared_pages_pl" CASCADE;
  DROP TABLE "shared_pages_pl_locales" CASCADE;
  DROP TABLE "__shared_pages_v_pubhero_v" CASCADE;
  DROP TABLE "__shared_pages_v_pubhero_v_locales" CASCADE;
  DROP TABLE "__shared_pages_v_pl_v" CASCADE;
  DROP TABLE "__shared_pages_v_pl_v_locales" CASCADE;
  DROP TABLE "detail_templates_pubhero" CASCADE;
  DROP TABLE "detail_templates_pubhero_locales" CASCADE;
  DROP TABLE "detail_templates_pl" CASCADE;
  DROP TABLE "detail_templates_pl_locales" CASCADE;
  DROP TABLE "__detail_templates_v_pubhero_v" CASCADE;
  DROP TABLE "__detail_templates_v_pubhero_v_locales" CASCADE;
  DROP TABLE "__detail_templates_v_pl_v" CASCADE;
  DROP TABLE "__detail_templates_v_pl_v_locales" CASCADE;
  DROP TABLE "shared_detail_templates_pubhero" CASCADE;
  DROP TABLE "shared_detail_templates_pubhero_locales" CASCADE;
  DROP TABLE "shared_detail_templates_pl" CASCADE;
  DROP TABLE "shared_detail_templates_pl_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_pubhero_v" CASCADE;
  DROP TABLE "__shared_detail_templates_v_pubhero_v_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_pl_v" CASCADE;
  DROP TABLE "__shared_detail_templates_v_pl_v_locales" CASCADE;
  DROP TYPE "public"."enum_pages_pubhero_heading_align";
  DROP TYPE "public"."enum_pages_pl_source";
  DROP TYPE "public"."enum_pages_pl_empty_state_button_type";
  DROP TYPE "public"."enum___pages_v_pubhero_v_heading_align";
  DROP TYPE "public"."enum___pages_v_pl_v_source";
  DROP TYPE "public"."enum___pages_v_pl_v_empty_state_button_type";
  DROP TYPE "public"."enum_shared_pages_pubhero_heading_align";
  DROP TYPE "public"."enum_shared_pages_pl_source";
  DROP TYPE "public"."enum_shared_pages_pl_empty_state_button_type";
  DROP TYPE "public"."enum___shared_pages_v_pubhero_v_heading_align";
  DROP TYPE "public"."enum___shared_pages_v_pl_v_source";
  DROP TYPE "public"."enum___shared_pages_v_pl_v_empty_state_button_type";
  DROP TYPE "public"."enum_detail_templates_pubhero_heading_align";
  DROP TYPE "public"."enum_detail_templates_pl_source";
  DROP TYPE "public"."enum_detail_templates_pl_empty_state_button_type";
  DROP TYPE "public"."enum___detail_templates_v_pubhero_v_heading_align";
  DROP TYPE "public"."enum___detail_templates_v_pl_v_source";
  DROP TYPE "public"."enum___detail_templates_v_pl_v_empty_state_button_type";
  DROP TYPE "public"."enum_shared_detail_templates_pubhero_heading_align";
  DROP TYPE "public"."enum_shared_detail_templates_pl_source";
  DROP TYPE "public"."enum_shared_detail_templates_pl_empty_state_button_type";
  DROP TYPE "public"."enum___shared_detail_templates_v_pubhero_v_heading_align";
  DROP TYPE "public"."enum___shared_detail_templates_v_pl_v_source";
  DROP TYPE "public"."enum___shared_detail_templates_v_pl_v_empty_state_button_type";`)
}
