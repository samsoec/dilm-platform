import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_cf_buttons_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_pages_cf_buttons_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_pages_cf_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_pages_cf_variant" AS ENUM('logos', 'cards');
  CREATE TYPE "public"."enum_pages_cf_layout" AS ENUM('grid', 'carousel');
  CREATE TYPE "public"."enum_pages_cf_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum_pages_cgal_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_pages_awd_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_pages_icar_items_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_pages_icar_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_pages_testi_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_pages_hot_hotspots_tone" AS ENUM('green', 'orange', 'navy');
  CREATE TYPE "public"."enum_pages_hot_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_pages_cta_buttons_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_pages_cta_buttons_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_pages_rich_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_pages_ahead_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___pages_v_cf_v_buttons_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___pages_v_cf_v_buttons_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___pages_v_cf_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___pages_v_cf_v_variant" AS ENUM('logos', 'cards');
  CREATE TYPE "public"."enum___pages_v_cf_v_layout" AS ENUM('grid', 'carousel');
  CREATE TYPE "public"."enum___pages_v_cf_v_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum___pages_v_cgal_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___pages_v_awd_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___pages_v_icar_v_items_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___pages_v_icar_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___pages_v_testi_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___pages_v_hot_v_hotspots_tone" AS ENUM('green', 'orange', 'navy');
  CREATE TYPE "public"."enum___pages_v_hot_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___pages_v_cta_v_buttons_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___pages_v_cta_v_buttons_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___pages_v_rich_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___pages_v_ahead_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_pages_cf_buttons_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_pages_cf_buttons_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_shared_pages_cf_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_pages_cf_variant" AS ENUM('logos', 'cards');
  CREATE TYPE "public"."enum_shared_pages_cf_layout" AS ENUM('grid', 'carousel');
  CREATE TYPE "public"."enum_shared_pages_cf_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum_shared_pages_cgal_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_pages_awd_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_pages_icar_items_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_pages_icar_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_pages_testi_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_pages_hot_hotspots_tone" AS ENUM('green', 'orange', 'navy');
  CREATE TYPE "public"."enum_shared_pages_hot_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_pages_cta_buttons_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_pages_cta_buttons_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_shared_pages_rich_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_pages_ahead_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___shared_pages_v_cf_v_buttons_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___shared_pages_v_cf_v_buttons_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___shared_pages_v_cf_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___shared_pages_v_cf_v_variant" AS ENUM('logos', 'cards');
  CREATE TYPE "public"."enum___shared_pages_v_cf_v_layout" AS ENUM('grid', 'carousel');
  CREATE TYPE "public"."enum___shared_pages_v_cf_v_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum___shared_pages_v_cgal_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___shared_pages_v_awd_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___shared_pages_v_icar_v_items_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___shared_pages_v_icar_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___shared_pages_v_testi_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___shared_pages_v_hot_v_hotspots_tone" AS ENUM('green', 'orange', 'navy');
  CREATE TYPE "public"."enum___shared_pages_v_hot_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___shared_pages_v_cta_v_buttons_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___shared_pages_v_cta_v_buttons_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___shared_pages_v_rich_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___shared_pages_v_ahead_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_detail_templates_cf_buttons_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_detail_templates_cf_buttons_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_detail_templates_cf_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_detail_templates_cf_variant" AS ENUM('logos', 'cards');
  CREATE TYPE "public"."enum_detail_templates_cf_layout" AS ENUM('grid', 'carousel');
  CREATE TYPE "public"."enum_detail_templates_cf_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum_detail_templates_cgal_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_detail_templates_awd_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_detail_templates_icar_items_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_detail_templates_icar_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_detail_templates_testi_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_detail_templates_hot_hotspots_tone" AS ENUM('green', 'orange', 'navy');
  CREATE TYPE "public"."enum_detail_templates_hot_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_detail_templates_cta_buttons_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_detail_templates_cta_buttons_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_detail_templates_rich_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_detail_templates_ahead_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___detail_templates_v_cf_v_buttons_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___detail_templates_v_cf_v_buttons_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___detail_templates_v_cf_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___detail_templates_v_cf_v_variant" AS ENUM('logos', 'cards');
  CREATE TYPE "public"."enum___detail_templates_v_cf_v_layout" AS ENUM('grid', 'carousel');
  CREATE TYPE "public"."enum___detail_templates_v_cf_v_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum___detail_templates_v_cgal_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___detail_templates_v_awd_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___detail_templates_v_icar_v_items_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___detail_templates_v_icar_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___detail_templates_v_testi_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___detail_templates_v_hot_v_hotspots_tone" AS ENUM('green', 'orange', 'navy');
  CREATE TYPE "public"."enum___detail_templates_v_hot_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___detail_templates_v_cta_v_buttons_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___detail_templates_v_cta_v_buttons_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___detail_templates_v_rich_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___detail_templates_v_ahead_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_detail_templates_cf_buttons_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_detail_templates_cf_buttons_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_shared_detail_templates_cf_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_detail_templates_cf_variant" AS ENUM('logos', 'cards');
  CREATE TYPE "public"."enum_shared_detail_templates_cf_layout" AS ENUM('grid', 'carousel');
  CREATE TYPE "public"."enum_shared_detail_templates_cf_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum_shared_detail_templates_cgal_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_detail_templates_awd_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_detail_templates_icar_items_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_detail_templates_icar_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_detail_templates_testi_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_detail_templates_hot_hotspots_tone" AS ENUM('green', 'orange', 'navy');
  CREATE TYPE "public"."enum_shared_detail_templates_hot_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_detail_templates_cta_buttons_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_detail_templates_cta_buttons_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_shared_detail_templates_rich_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_detail_templates_ahead_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___shared_detail_templates_v_cf_v_buttons_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___shared_detail_templates_v_cf_v_buttons_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___shared_detail_templates_v_cf_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___shared_detail_templates_v_cf_v_variant" AS ENUM('logos', 'cards');
  CREATE TYPE "public"."enum___shared_detail_templates_v_cf_v_layout" AS ENUM('grid', 'carousel');
  CREATE TYPE "public"."enum___shared_detail_templates_v_cf_v_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum___shared_detail_templates_v_cgal_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___shared_detail_templates_v_awd_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___shared_detail_templates_v_icar_v_items_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___shared_detail_templates_v_icar_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___shared_detail_templates_v_testi_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___shared_detail_templates_v_hot_v_hotspots_tone" AS ENUM('green', 'orange', 'navy');
  CREATE TYPE "public"."enum___shared_detail_templates_v_hot_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___shared_detail_templates_v_cta_v_buttons_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___shared_detail_templates_v_cta_v_buttons_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___shared_detail_templates_v_rich_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___shared_detail_templates_v_ahead_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TABLE "pages_cf_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_cf_buttons_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_pages_cf_buttons_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "pages_cf_buttons_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_cf_c_p" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_cf_c" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"code" varchar
  );
  
  CREATE TABLE "pages_cf_c_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_cf" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_pages_cf_heading_align" DEFAULT 'center',
  	"variant" "enum_pages_cf_variant" DEFAULT 'logos',
  	"layout" "enum_pages_cf_layout" DEFAULT 'grid',
  	"appearance_background" "enum_pages_cf_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_cf_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_cgal_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_cgal_items_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_cgal" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_pages_cgal_heading_align" DEFAULT 'left',
  	"badge_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_cgal_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_awd_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"year" varchar
  );
  
  CREATE TABLE "pages_awd_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"issuer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_awd" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_pages_awd_heading_align" DEFAULT 'center',
  	"page_size" numeric DEFAULT 8,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_awd_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_icar_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"link_type" "enum_pages_icar_items_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar
  );
  
  CREATE TABLE "pages_icar_items_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_icar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_pages_icar_heading_align" DEFAULT 'split',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_icar_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_testi_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"name" varchar
  );
  
  CREATE TABLE "pages_testi_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"avatar_id" integer
  );
  
  CREATE TABLE "pages_testi_items_locales" (
  	"quote" varchar,
  	"role" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_testi" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_pages_testi_heading_align" DEFAULT 'center',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_testi_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_hot_hotspots" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tone" "enum_pages_hot_hotspots_tone" DEFAULT 'green',
  	"x" numeric,
  	"y" numeric
  );
  
  CREATE TABLE "pages_hot_hotspots_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_hot" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_pages_hot_heading_align" DEFAULT 'left',
  	"image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_hot_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_cta_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_cta_buttons_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_pages_cta_buttons_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "pages_cta_buttons_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_cta_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_rich" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_pages_rich_heading_align" DEFAULT 'left',
  	"show_table_of_contents" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_rich_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"body" jsonb,
  	"toc_title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_ahead" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_pages_ahead_heading_align" DEFAULT 'left',
  	"last_updated" timestamp(3) with time zone,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_ahead_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"meta_label" varchar,
  	"last_updated_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "__pages_v_cf_v_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum___pages_v_cf_v_buttons_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum___pages_v_cf_v_buttons_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "__pages_v_cf_v_buttons_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "____pages_v_cf_v_c_v_p_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "___pages_v_cf_v_c_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"code" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "___pages_v_cf_v_c_v_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__pages_v_cf_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___pages_v_cf_v_heading_align" DEFAULT 'center',
  	"variant" "enum___pages_v_cf_v_variant" DEFAULT 'logos',
  	"layout" "enum___pages_v_cf_v_layout" DEFAULT 'grid',
  	"appearance_background" "enum___pages_v_cf_v_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__pages_v_cf_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__pages_v_cgal_v_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__pages_v_cgal_v_items_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__pages_v_cgal_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___pages_v_cgal_v_heading_align" DEFAULT 'left',
  	"badge_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__pages_v_cgal_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__pages_v_awd_v_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"year" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__pages_v_awd_v_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"issuer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__pages_v_awd_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___pages_v_awd_v_heading_align" DEFAULT 'center',
  	"page_size" numeric DEFAULT 8,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__pages_v_awd_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__pages_v_icar_v_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"link_type" "enum___pages_v_icar_v_items_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__pages_v_icar_v_items_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__pages_v_icar_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___pages_v_icar_v_heading_align" DEFAULT 'split',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__pages_v_icar_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__pages_v_testi_v_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__pages_v_testi_v_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"avatar_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__pages_v_testi_v_items_locales" (
  	"quote" varchar,
  	"role" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__pages_v_testi_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___pages_v_testi_v_heading_align" DEFAULT 'center',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__pages_v_testi_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__pages_v_hot_v_hotspots" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tone" "enum___pages_v_hot_v_hotspots_tone" DEFAULT 'green',
  	"x" numeric,
  	"y" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__pages_v_hot_v_hotspots_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__pages_v_hot_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___pages_v_hot_v_heading_align" DEFAULT 'left',
  	"image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__pages_v_hot_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__pages_v_cta_v_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum___pages_v_cta_v_buttons_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum___pages_v_cta_v_buttons_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "__pages_v_cta_v_buttons_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__pages_v_cta_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__pages_v_cta_v_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__pages_v_rich_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___pages_v_rich_v_heading_align" DEFAULT 'left',
  	"show_table_of_contents" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__pages_v_rich_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"body" jsonb,
  	"toc_title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__pages_v_ahead_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___pages_v_ahead_v_heading_align" DEFAULT 'left',
  	"last_updated" timestamp(3) with time zone,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__pages_v_ahead_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"meta_label" varchar,
  	"last_updated_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "shared_pages_cf_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_shared_pages_cf_buttons_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_shared_pages_cf_buttons_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "shared_pages_cf_buttons_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_cf_c_p" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "shared_pages_cf_c" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"code" varchar
  );
  
  CREATE TABLE "shared_pages_cf_c_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_cf" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_pages_cf_heading_align" DEFAULT 'center',
  	"variant" "enum_shared_pages_cf_variant" DEFAULT 'logos',
  	"layout" "enum_shared_pages_cf_layout" DEFAULT 'grid',
  	"appearance_background" "enum_shared_pages_cf_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_pages_cf_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_cgal_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "shared_pages_cgal_items_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_cgal" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_pages_cgal_heading_align" DEFAULT 'left',
  	"badge_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_pages_cgal_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_awd_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"year" varchar
  );
  
  CREATE TABLE "shared_pages_awd_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"issuer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_awd" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_pages_awd_heading_align" DEFAULT 'center',
  	"page_size" numeric DEFAULT 8,
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_pages_awd_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_icar_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"link_type" "enum_shared_pages_icar_items_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar
  );
  
  CREATE TABLE "shared_pages_icar_items_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_icar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_pages_icar_heading_align" DEFAULT 'split',
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_pages_icar_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_testi_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"name" varchar
  );
  
  CREATE TABLE "shared_pages_testi_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"avatar_id" integer
  );
  
  CREATE TABLE "shared_pages_testi_items_locales" (
  	"quote" varchar,
  	"role" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_testi" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_pages_testi_heading_align" DEFAULT 'center',
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_pages_testi_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_hot_hotspots" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tone" "enum_shared_pages_hot_hotspots_tone" DEFAULT 'green',
  	"x" numeric,
  	"y" numeric
  );
  
  CREATE TABLE "shared_pages_hot_hotspots_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_hot" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_pages_hot_heading_align" DEFAULT 'left',
  	"image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_pages_hot_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_cta_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_shared_pages_cta_buttons_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_shared_pages_cta_buttons_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "shared_pages_cta_buttons_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_pages_cta_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_rich" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_pages_rich_heading_align" DEFAULT 'left',
  	"show_table_of_contents" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_pages_rich_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"body" jsonb,
  	"toc_title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_ahead" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_pages_ahead_heading_align" DEFAULT 'left',
  	"last_updated" timestamp(3) with time zone,
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_pages_ahead_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"meta_label" varchar,
  	"last_updated_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_cf_v_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum___shared_pages_v_cf_v_buttons_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum___shared_pages_v_cf_v_buttons_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "__shared_pages_v_cf_v_buttons_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "____shared_pages_v_cf_v_c_v_p_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "___shared_pages_v_cf_v_c_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"code" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "___shared_pages_v_cf_v_c_v_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_cf_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_pages_v_cf_v_heading_align" DEFAULT 'center',
  	"variant" "enum___shared_pages_v_cf_v_variant" DEFAULT 'logos',
  	"layout" "enum___shared_pages_v_cf_v_layout" DEFAULT 'grid',
  	"appearance_background" "enum___shared_pages_v_cf_v_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_pages_v_cf_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_cgal_v_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__shared_pages_v_cgal_v_items_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_cgal_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_pages_v_cgal_v_heading_align" DEFAULT 'left',
  	"badge_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_pages_v_cgal_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_awd_v_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"year" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__shared_pages_v_awd_v_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"issuer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_awd_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_pages_v_awd_v_heading_align" DEFAULT 'center',
  	"page_size" numeric DEFAULT 8,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_pages_v_awd_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_icar_v_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"link_type" "enum___shared_pages_v_icar_v_items_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__shared_pages_v_icar_v_items_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_icar_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_pages_v_icar_v_heading_align" DEFAULT 'split',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_pages_v_icar_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_testi_v_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__shared_pages_v_testi_v_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"avatar_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__shared_pages_v_testi_v_items_locales" (
  	"quote" varchar,
  	"role" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_testi_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_pages_v_testi_v_heading_align" DEFAULT 'center',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_pages_v_testi_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_hot_v_hotspots" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tone" "enum___shared_pages_v_hot_v_hotspots_tone" DEFAULT 'green',
  	"x" numeric,
  	"y" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__shared_pages_v_hot_v_hotspots_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_hot_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_pages_v_hot_v_heading_align" DEFAULT 'left',
  	"image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_pages_v_hot_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_cta_v_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum___shared_pages_v_cta_v_buttons_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum___shared_pages_v_cta_v_buttons_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "__shared_pages_v_cta_v_buttons_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_cta_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_pages_v_cta_v_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_rich_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_pages_v_rich_v_heading_align" DEFAULT 'left',
  	"show_table_of_contents" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_pages_v_rich_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"body" jsonb,
  	"toc_title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_ahead_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_pages_v_ahead_v_heading_align" DEFAULT 'left',
  	"last_updated" timestamp(3) with time zone,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_pages_v_ahead_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"meta_label" varchar,
  	"last_updated_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "detail_templates_cf_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_detail_templates_cf_buttons_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_detail_templates_cf_buttons_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "detail_templates_cf_buttons_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_cf_c_p" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "detail_templates_cf_c" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"code" varchar
  );
  
  CREATE TABLE "detail_templates_cf_c_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_cf" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_detail_templates_cf_heading_align" DEFAULT 'center',
  	"variant" "enum_detail_templates_cf_variant" DEFAULT 'logos',
  	"layout" "enum_detail_templates_cf_layout" DEFAULT 'grid',
  	"appearance_background" "enum_detail_templates_cf_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "detail_templates_cf_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_cgal_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "detail_templates_cgal_items_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_cgal" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_detail_templates_cgal_heading_align" DEFAULT 'left',
  	"badge_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "detail_templates_cgal_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_awd_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"year" varchar
  );
  
  CREATE TABLE "detail_templates_awd_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"issuer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_awd" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_detail_templates_awd_heading_align" DEFAULT 'center',
  	"page_size" numeric DEFAULT 8,
  	"block_name" varchar
  );
  
  CREATE TABLE "detail_templates_awd_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_icar_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"link_type" "enum_detail_templates_icar_items_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar
  );
  
  CREATE TABLE "detail_templates_icar_items_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_icar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_detail_templates_icar_heading_align" DEFAULT 'split',
  	"block_name" varchar
  );
  
  CREATE TABLE "detail_templates_icar_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_testi_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"name" varchar
  );
  
  CREATE TABLE "detail_templates_testi_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"avatar_id" integer
  );
  
  CREATE TABLE "detail_templates_testi_items_locales" (
  	"quote" varchar,
  	"role" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_testi" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_detail_templates_testi_heading_align" DEFAULT 'center',
  	"block_name" varchar
  );
  
  CREATE TABLE "detail_templates_testi_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_hot_hotspots" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tone" "enum_detail_templates_hot_hotspots_tone" DEFAULT 'green',
  	"x" numeric,
  	"y" numeric
  );
  
  CREATE TABLE "detail_templates_hot_hotspots_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_hot" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_detail_templates_hot_heading_align" DEFAULT 'left',
  	"image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "detail_templates_hot_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_cta_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_detail_templates_cta_buttons_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_detail_templates_cta_buttons_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "detail_templates_cta_buttons_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "detail_templates_cta_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_rich" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_detail_templates_rich_heading_align" DEFAULT 'left',
  	"show_table_of_contents" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "detail_templates_rich_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"body" jsonb,
  	"toc_title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_ahead" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_detail_templates_ahead_heading_align" DEFAULT 'left',
  	"last_updated" timestamp(3) with time zone,
  	"block_name" varchar
  );
  
  CREATE TABLE "detail_templates_ahead_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"meta_label" varchar,
  	"last_updated_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_cf_v_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum___detail_templates_v_cf_v_buttons_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum___detail_templates_v_cf_v_buttons_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "__detail_templates_v_cf_v_buttons_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "____detail_templates_v_cf_v_c_v_p_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "___detail_templates_v_cf_v_c_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"code" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "___detail_templates_v_cf_v_c_v_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_cf_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___detail_templates_v_cf_v_heading_align" DEFAULT 'center',
  	"variant" "enum___detail_templates_v_cf_v_variant" DEFAULT 'logos',
  	"layout" "enum___detail_templates_v_cf_v_layout" DEFAULT 'grid',
  	"appearance_background" "enum___detail_templates_v_cf_v_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__detail_templates_v_cf_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_cgal_v_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__detail_templates_v_cgal_v_items_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_cgal_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___detail_templates_v_cgal_v_heading_align" DEFAULT 'left',
  	"badge_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__detail_templates_v_cgal_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_awd_v_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"year" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__detail_templates_v_awd_v_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"issuer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_awd_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___detail_templates_v_awd_v_heading_align" DEFAULT 'center',
  	"page_size" numeric DEFAULT 8,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__detail_templates_v_awd_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_icar_v_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"link_type" "enum___detail_templates_v_icar_v_items_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__detail_templates_v_icar_v_items_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_icar_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___detail_templates_v_icar_v_heading_align" DEFAULT 'split',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__detail_templates_v_icar_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_testi_v_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__detail_templates_v_testi_v_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"avatar_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__detail_templates_v_testi_v_items_locales" (
  	"quote" varchar,
  	"role" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_testi_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___detail_templates_v_testi_v_heading_align" DEFAULT 'center',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__detail_templates_v_testi_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_hot_v_hotspots" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tone" "enum___detail_templates_v_hot_v_hotspots_tone" DEFAULT 'green',
  	"x" numeric,
  	"y" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__detail_templates_v_hot_v_hotspots_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_hot_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___detail_templates_v_hot_v_heading_align" DEFAULT 'left',
  	"image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__detail_templates_v_hot_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_cta_v_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum___detail_templates_v_cta_v_buttons_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum___detail_templates_v_cta_v_buttons_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "__detail_templates_v_cta_v_buttons_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_cta_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__detail_templates_v_cta_v_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_rich_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___detail_templates_v_rich_v_heading_align" DEFAULT 'left',
  	"show_table_of_contents" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__detail_templates_v_rich_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"body" jsonb,
  	"toc_title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_ahead_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___detail_templates_v_ahead_v_heading_align" DEFAULT 'left',
  	"last_updated" timestamp(3) with time zone,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__detail_templates_v_ahead_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"meta_label" varchar,
  	"last_updated_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_cf_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_shared_detail_templates_cf_buttons_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_shared_detail_templates_cf_buttons_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "shared_detail_templates_cf_buttons_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_cf_c_p" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "shared_detail_templates_cf_c" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"code" varchar
  );
  
  CREATE TABLE "shared_detail_templates_cf_c_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_cf" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_detail_templates_cf_heading_align" DEFAULT 'center',
  	"variant" "enum_shared_detail_templates_cf_variant" DEFAULT 'logos',
  	"layout" "enum_shared_detail_templates_cf_layout" DEFAULT 'grid',
  	"appearance_background" "enum_shared_detail_templates_cf_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_detail_templates_cf_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_cgal_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "shared_detail_templates_cgal_items_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_cgal" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_detail_templates_cgal_heading_align" DEFAULT 'left',
  	"badge_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_detail_templates_cgal_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_awd_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"year" varchar
  );
  
  CREATE TABLE "shared_detail_templates_awd_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"issuer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_awd" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_detail_templates_awd_heading_align" DEFAULT 'center',
  	"page_size" numeric DEFAULT 8,
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_detail_templates_awd_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_icar_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"link_type" "enum_shared_detail_templates_icar_items_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar
  );
  
  CREATE TABLE "shared_detail_templates_icar_items_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_icar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_detail_templates_icar_heading_align" DEFAULT 'split',
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_detail_templates_icar_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_testi_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"name" varchar
  );
  
  CREATE TABLE "shared_detail_templates_testi_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"avatar_id" integer
  );
  
  CREATE TABLE "shared_detail_templates_testi_items_locales" (
  	"quote" varchar,
  	"role" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_testi" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_detail_templates_testi_heading_align" DEFAULT 'center',
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_detail_templates_testi_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_hot_hotspots" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tone" "enum_shared_detail_templates_hot_hotspots_tone" DEFAULT 'green',
  	"x" numeric,
  	"y" numeric
  );
  
  CREATE TABLE "shared_detail_templates_hot_hotspots_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_hot" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_detail_templates_hot_heading_align" DEFAULT 'left',
  	"image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_detail_templates_hot_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_cta_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_shared_detail_templates_cta_buttons_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_shared_detail_templates_cta_buttons_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "shared_detail_templates_cta_buttons_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_detail_templates_cta_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_rich" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_detail_templates_rich_heading_align" DEFAULT 'left',
  	"show_table_of_contents" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_detail_templates_rich_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"body" jsonb,
  	"toc_title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_ahead" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_detail_templates_ahead_heading_align" DEFAULT 'left',
  	"last_updated" timestamp(3) with time zone,
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_detail_templates_ahead_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"meta_label" varchar,
  	"last_updated_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_cf_v_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum___shared_detail_templates_v_cf_v_buttons_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum___shared_detail_templates_v_cf_v_buttons_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_cf_v_buttons_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "____shared_detail_templates_v_cf_v_c_v_p_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "___shared_detail_templates_v_cf_v_c_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"code" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "___shared_detail_templates_v_cf_v_c_v_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_cf_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_detail_templates_v_cf_v_heading_align" DEFAULT 'center',
  	"variant" "enum___shared_detail_templates_v_cf_v_variant" DEFAULT 'logos',
  	"layout" "enum___shared_detail_templates_v_cf_v_layout" DEFAULT 'grid',
  	"appearance_background" "enum___shared_detail_templates_v_cf_v_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_cf_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_cgal_v_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_cgal_v_items_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_cgal_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_detail_templates_v_cgal_v_heading_align" DEFAULT 'left',
  	"badge_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_cgal_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_awd_v_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"year" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_awd_v_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"issuer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_awd_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_detail_templates_v_awd_v_heading_align" DEFAULT 'center',
  	"page_size" numeric DEFAULT 8,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_awd_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_icar_v_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"link_type" "enum___shared_detail_templates_v_icar_v_items_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_icar_v_items_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_icar_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_detail_templates_v_icar_v_heading_align" DEFAULT 'split',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_icar_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_testi_v_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_testi_v_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"avatar_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_testi_v_items_locales" (
  	"quote" varchar,
  	"role" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_testi_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_detail_templates_v_testi_v_heading_align" DEFAULT 'center',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_testi_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_hot_v_hotspots" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tone" "enum___shared_detail_templates_v_hot_v_hotspots_tone" DEFAULT 'green',
  	"x" numeric,
  	"y" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_hot_v_hotspots_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_hot_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_detail_templates_v_hot_v_heading_align" DEFAULT 'left',
  	"image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_hot_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_cta_v_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum___shared_detail_templates_v_cta_v_buttons_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum___shared_detail_templates_v_cta_v_buttons_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_cta_v_buttons_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_cta_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_cta_v_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_rich_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_detail_templates_v_rich_v_heading_align" DEFAULT 'left',
  	"show_table_of_contents" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_rich_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"body" jsonb,
  	"toc_title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_ahead_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_detail_templates_v_ahead_v_heading_align" DEFAULT 'left',
  	"last_updated" timestamp(3) with time zone,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_ahead_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"meta_label" varchar,
  	"last_updated_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages_cf_buttons" ADD CONSTRAINT "pages_cf_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_cf"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_cf_buttons_locales" ADD CONSTRAINT "pages_cf_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_cf_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_cf_c_p" ADD CONSTRAINT "pages_cf_c_p_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_cf_c_p" ADD CONSTRAINT "pages_cf_c_p_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_cf_c"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_cf_c" ADD CONSTRAINT "pages_cf_c_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_cf_c" ADD CONSTRAINT "pages_cf_c_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_cf"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_cf_c_locales" ADD CONSTRAINT "pages_cf_c_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_cf_c"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_cf" ADD CONSTRAINT "pages_cf_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_cf" ADD CONSTRAINT "pages_cf_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_cf_locales" ADD CONSTRAINT "pages_cf_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_cf"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_cgal_items" ADD CONSTRAINT "pages_cgal_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_cgal_items" ADD CONSTRAINT "pages_cgal_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_cgal"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_cgal_items_locales" ADD CONSTRAINT "pages_cgal_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_cgal_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_cgal" ADD CONSTRAINT "pages_cgal_badge_id_media_id_fk" FOREIGN KEY ("badge_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_cgal" ADD CONSTRAINT "pages_cgal_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_cgal_locales" ADD CONSTRAINT "pages_cgal_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_cgal"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_awd_items" ADD CONSTRAINT "pages_awd_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_awd_items" ADD CONSTRAINT "pages_awd_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_awd"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_awd_items_locales" ADD CONSTRAINT "pages_awd_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_awd_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_awd" ADD CONSTRAINT "pages_awd_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_awd_locales" ADD CONSTRAINT "pages_awd_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_awd"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_icar_items" ADD CONSTRAINT "pages_icar_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_icar_items" ADD CONSTRAINT "pages_icar_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_icar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_icar_items_locales" ADD CONSTRAINT "pages_icar_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_icar_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_icar" ADD CONSTRAINT "pages_icar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_icar_locales" ADD CONSTRAINT "pages_icar_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_icar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_testi_logos" ADD CONSTRAINT "pages_testi_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_testi_logos" ADD CONSTRAINT "pages_testi_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_testi"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_testi_items" ADD CONSTRAINT "pages_testi_items_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_testi_items" ADD CONSTRAINT "pages_testi_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_testi"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_testi_items_locales" ADD CONSTRAINT "pages_testi_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_testi_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_testi" ADD CONSTRAINT "pages_testi_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_testi_locales" ADD CONSTRAINT "pages_testi_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_testi"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_hot_hotspots" ADD CONSTRAINT "pages_hot_hotspots_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_hot"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_hot_hotspots_locales" ADD CONSTRAINT "pages_hot_hotspots_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_hot_hotspots"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_hot" ADD CONSTRAINT "pages_hot_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_hot" ADD CONSTRAINT "pages_hot_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_hot_locales" ADD CONSTRAINT "pages_hot_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_hot"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_cta_buttons" ADD CONSTRAINT "pages_cta_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_cta_buttons_locales" ADD CONSTRAINT "pages_cta_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_cta_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_cta" ADD CONSTRAINT "pages_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_cta_locales" ADD CONSTRAINT "pages_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rich" ADD CONSTRAINT "pages_rich_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rich_locales" ADD CONSTRAINT "pages_rich_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_rich"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_ahead" ADD CONSTRAINT "pages_ahead_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_ahead_locales" ADD CONSTRAINT "pages_ahead_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_ahead"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_cf_v_buttons" ADD CONSTRAINT "__pages_v_cf_v_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_cf_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_cf_v_buttons_locales" ADD CONSTRAINT "__pages_v_cf_v_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_cf_v_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "____pages_v_cf_v_c_v_p_v" ADD CONSTRAINT "____pages_v_cf_v_c_v_p_v_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "____pages_v_cf_v_c_v_p_v" ADD CONSTRAINT "____pages_v_cf_v_c_v_p_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___pages_v_cf_v_c_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___pages_v_cf_v_c_v" ADD CONSTRAINT "___pages_v_cf_v_c_v_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "___pages_v_cf_v_c_v" ADD CONSTRAINT "___pages_v_cf_v_c_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_cf_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___pages_v_cf_v_c_v_locales" ADD CONSTRAINT "___pages_v_cf_v_c_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___pages_v_cf_v_c_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_cf_v" ADD CONSTRAINT "__pages_v_cf_v_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__pages_v_cf_v" ADD CONSTRAINT "__pages_v_cf_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_cf_v_locales" ADD CONSTRAINT "__pages_v_cf_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_cf_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_cgal_v_items" ADD CONSTRAINT "__pages_v_cgal_v_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__pages_v_cgal_v_items" ADD CONSTRAINT "__pages_v_cgal_v_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_cgal_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_cgal_v_items_locales" ADD CONSTRAINT "__pages_v_cgal_v_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_cgal_v_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_cgal_v" ADD CONSTRAINT "__pages_v_cgal_v_badge_id_media_id_fk" FOREIGN KEY ("badge_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__pages_v_cgal_v" ADD CONSTRAINT "__pages_v_cgal_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_cgal_v_locales" ADD CONSTRAINT "__pages_v_cgal_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_cgal_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_awd_v_items" ADD CONSTRAINT "__pages_v_awd_v_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__pages_v_awd_v_items" ADD CONSTRAINT "__pages_v_awd_v_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_awd_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_awd_v_items_locales" ADD CONSTRAINT "__pages_v_awd_v_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_awd_v_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_awd_v" ADD CONSTRAINT "__pages_v_awd_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_awd_v_locales" ADD CONSTRAINT "__pages_v_awd_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_awd_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_icar_v_items" ADD CONSTRAINT "__pages_v_icar_v_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__pages_v_icar_v_items" ADD CONSTRAINT "__pages_v_icar_v_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_icar_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_icar_v_items_locales" ADD CONSTRAINT "__pages_v_icar_v_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_icar_v_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_icar_v" ADD CONSTRAINT "__pages_v_icar_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_icar_v_locales" ADD CONSTRAINT "__pages_v_icar_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_icar_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_testi_v_logos" ADD CONSTRAINT "__pages_v_testi_v_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__pages_v_testi_v_logos" ADD CONSTRAINT "__pages_v_testi_v_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_testi_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_testi_v_items" ADD CONSTRAINT "__pages_v_testi_v_items_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__pages_v_testi_v_items" ADD CONSTRAINT "__pages_v_testi_v_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_testi_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_testi_v_items_locales" ADD CONSTRAINT "__pages_v_testi_v_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_testi_v_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_testi_v" ADD CONSTRAINT "__pages_v_testi_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_testi_v_locales" ADD CONSTRAINT "__pages_v_testi_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_testi_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_hot_v_hotspots" ADD CONSTRAINT "__pages_v_hot_v_hotspots_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_hot_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_hot_v_hotspots_locales" ADD CONSTRAINT "__pages_v_hot_v_hotspots_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_hot_v_hotspots"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_hot_v" ADD CONSTRAINT "__pages_v_hot_v_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__pages_v_hot_v" ADD CONSTRAINT "__pages_v_hot_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_hot_v_locales" ADD CONSTRAINT "__pages_v_hot_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_hot_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_cta_v_buttons" ADD CONSTRAINT "__pages_v_cta_v_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_cta_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_cta_v_buttons_locales" ADD CONSTRAINT "__pages_v_cta_v_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_cta_v_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_cta_v" ADD CONSTRAINT "__pages_v_cta_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_cta_v_locales" ADD CONSTRAINT "__pages_v_cta_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_cta_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_rich_v" ADD CONSTRAINT "__pages_v_rich_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_rich_v_locales" ADD CONSTRAINT "__pages_v_rich_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_rich_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_ahead_v" ADD CONSTRAINT "__pages_v_ahead_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_ahead_v_locales" ADD CONSTRAINT "__pages_v_ahead_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_ahead_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_cf_buttons" ADD CONSTRAINT "shared_pages_cf_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_cf"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_cf_buttons_locales" ADD CONSTRAINT "shared_pages_cf_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_cf_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_cf_c_p" ADD CONSTRAINT "shared_pages_cf_c_p_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_pages_cf_c_p" ADD CONSTRAINT "shared_pages_cf_c_p_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_cf_c"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_cf_c" ADD CONSTRAINT "shared_pages_cf_c_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_pages_cf_c" ADD CONSTRAINT "shared_pages_cf_c_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_cf"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_cf_c_locales" ADD CONSTRAINT "shared_pages_cf_c_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_cf_c"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_cf" ADD CONSTRAINT "shared_pages_cf_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_pages_cf" ADD CONSTRAINT "shared_pages_cf_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_cf_locales" ADD CONSTRAINT "shared_pages_cf_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_cf"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_cgal_items" ADD CONSTRAINT "shared_pages_cgal_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_pages_cgal_items" ADD CONSTRAINT "shared_pages_cgal_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_cgal"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_cgal_items_locales" ADD CONSTRAINT "shared_pages_cgal_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_cgal_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_cgal" ADD CONSTRAINT "shared_pages_cgal_badge_id_media_id_fk" FOREIGN KEY ("badge_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_pages_cgal" ADD CONSTRAINT "shared_pages_cgal_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_cgal_locales" ADD CONSTRAINT "shared_pages_cgal_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_cgal"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_awd_items" ADD CONSTRAINT "shared_pages_awd_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_pages_awd_items" ADD CONSTRAINT "shared_pages_awd_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_awd"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_awd_items_locales" ADD CONSTRAINT "shared_pages_awd_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_awd_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_awd" ADD CONSTRAINT "shared_pages_awd_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_awd_locales" ADD CONSTRAINT "shared_pages_awd_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_awd"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_icar_items" ADD CONSTRAINT "shared_pages_icar_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_pages_icar_items" ADD CONSTRAINT "shared_pages_icar_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_icar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_icar_items_locales" ADD CONSTRAINT "shared_pages_icar_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_icar_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_icar" ADD CONSTRAINT "shared_pages_icar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_icar_locales" ADD CONSTRAINT "shared_pages_icar_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_icar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_testi_logos" ADD CONSTRAINT "shared_pages_testi_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_pages_testi_logos" ADD CONSTRAINT "shared_pages_testi_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_testi"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_testi_items" ADD CONSTRAINT "shared_pages_testi_items_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_pages_testi_items" ADD CONSTRAINT "shared_pages_testi_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_testi"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_testi_items_locales" ADD CONSTRAINT "shared_pages_testi_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_testi_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_testi" ADD CONSTRAINT "shared_pages_testi_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_testi_locales" ADD CONSTRAINT "shared_pages_testi_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_testi"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_hot_hotspots" ADD CONSTRAINT "shared_pages_hot_hotspots_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_hot"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_hot_hotspots_locales" ADD CONSTRAINT "shared_pages_hot_hotspots_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_hot_hotspots"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_hot" ADD CONSTRAINT "shared_pages_hot_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_pages_hot" ADD CONSTRAINT "shared_pages_hot_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_hot_locales" ADD CONSTRAINT "shared_pages_hot_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_hot"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_cta_buttons" ADD CONSTRAINT "shared_pages_cta_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_cta_buttons_locales" ADD CONSTRAINT "shared_pages_cta_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_cta_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_cta" ADD CONSTRAINT "shared_pages_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_cta_locales" ADD CONSTRAINT "shared_pages_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_rich" ADD CONSTRAINT "shared_pages_rich_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_rich_locales" ADD CONSTRAINT "shared_pages_rich_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_rich"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_ahead" ADD CONSTRAINT "shared_pages_ahead_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_ahead_locales" ADD CONSTRAINT "shared_pages_ahead_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_ahead"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_cf_v_buttons" ADD CONSTRAINT "__shared_pages_v_cf_v_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_cf_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_cf_v_buttons_locales" ADD CONSTRAINT "__shared_pages_v_cf_v_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_cf_v_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "____shared_pages_v_cf_v_c_v_p_v" ADD CONSTRAINT "____shared_pages_v_cf_v_c_v_p_v_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "____shared_pages_v_cf_v_c_v_p_v" ADD CONSTRAINT "____shared_pages_v_cf_v_c_v_p_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___shared_pages_v_cf_v_c_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_pages_v_cf_v_c_v" ADD CONSTRAINT "___shared_pages_v_cf_v_c_v_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "___shared_pages_v_cf_v_c_v" ADD CONSTRAINT "___shared_pages_v_cf_v_c_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_cf_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_pages_v_cf_v_c_v_locales" ADD CONSTRAINT "___shared_pages_v_cf_v_c_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___shared_pages_v_cf_v_c_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_cf_v" ADD CONSTRAINT "__shared_pages_v_cf_v_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_cf_v" ADD CONSTRAINT "__shared_pages_v_cf_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_cf_v_locales" ADD CONSTRAINT "__shared_pages_v_cf_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_cf_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_cgal_v_items" ADD CONSTRAINT "__shared_pages_v_cgal_v_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_cgal_v_items" ADD CONSTRAINT "__shared_pages_v_cgal_v_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_cgal_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_cgal_v_items_locales" ADD CONSTRAINT "__shared_pages_v_cgal_v_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_cgal_v_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_cgal_v" ADD CONSTRAINT "__shared_pages_v_cgal_v_badge_id_media_id_fk" FOREIGN KEY ("badge_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_cgal_v" ADD CONSTRAINT "__shared_pages_v_cgal_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_cgal_v_locales" ADD CONSTRAINT "__shared_pages_v_cgal_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_cgal_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_awd_v_items" ADD CONSTRAINT "__shared_pages_v_awd_v_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_awd_v_items" ADD CONSTRAINT "__shared_pages_v_awd_v_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_awd_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_awd_v_items_locales" ADD CONSTRAINT "__shared_pages_v_awd_v_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_awd_v_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_awd_v" ADD CONSTRAINT "__shared_pages_v_awd_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_awd_v_locales" ADD CONSTRAINT "__shared_pages_v_awd_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_awd_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_icar_v_items" ADD CONSTRAINT "__shared_pages_v_icar_v_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_icar_v_items" ADD CONSTRAINT "__shared_pages_v_icar_v_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_icar_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_icar_v_items_locales" ADD CONSTRAINT "__shared_pages_v_icar_v_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_icar_v_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_icar_v" ADD CONSTRAINT "__shared_pages_v_icar_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_icar_v_locales" ADD CONSTRAINT "__shared_pages_v_icar_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_icar_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_testi_v_logos" ADD CONSTRAINT "__shared_pages_v_testi_v_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_testi_v_logos" ADD CONSTRAINT "__shared_pages_v_testi_v_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_testi_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_testi_v_items" ADD CONSTRAINT "__shared_pages_v_testi_v_items_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_testi_v_items" ADD CONSTRAINT "__shared_pages_v_testi_v_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_testi_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_testi_v_items_locales" ADD CONSTRAINT "__shared_pages_v_testi_v_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_testi_v_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_testi_v" ADD CONSTRAINT "__shared_pages_v_testi_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_testi_v_locales" ADD CONSTRAINT "__shared_pages_v_testi_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_testi_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_hot_v_hotspots" ADD CONSTRAINT "__shared_pages_v_hot_v_hotspots_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_hot_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_hot_v_hotspots_locales" ADD CONSTRAINT "__shared_pages_v_hot_v_hotspots_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_hot_v_hotspots"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_hot_v" ADD CONSTRAINT "__shared_pages_v_hot_v_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_hot_v" ADD CONSTRAINT "__shared_pages_v_hot_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_hot_v_locales" ADD CONSTRAINT "__shared_pages_v_hot_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_hot_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_cta_v_buttons" ADD CONSTRAINT "__shared_pages_v_cta_v_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_cta_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_cta_v_buttons_locales" ADD CONSTRAINT "__shared_pages_v_cta_v_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_cta_v_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_cta_v" ADD CONSTRAINT "__shared_pages_v_cta_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_cta_v_locales" ADD CONSTRAINT "__shared_pages_v_cta_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_cta_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_rich_v" ADD CONSTRAINT "__shared_pages_v_rich_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_rich_v_locales" ADD CONSTRAINT "__shared_pages_v_rich_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_rich_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_ahead_v" ADD CONSTRAINT "__shared_pages_v_ahead_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_ahead_v_locales" ADD CONSTRAINT "__shared_pages_v_ahead_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_ahead_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_cf_buttons" ADD CONSTRAINT "detail_templates_cf_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_cf"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_cf_buttons_locales" ADD CONSTRAINT "detail_templates_cf_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_cf_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_cf_c_p" ADD CONSTRAINT "detail_templates_cf_c_p_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "detail_templates_cf_c_p" ADD CONSTRAINT "detail_templates_cf_c_p_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_cf_c"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_cf_c" ADD CONSTRAINT "detail_templates_cf_c_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "detail_templates_cf_c" ADD CONSTRAINT "detail_templates_cf_c_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_cf"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_cf_c_locales" ADD CONSTRAINT "detail_templates_cf_c_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_cf_c"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_cf" ADD CONSTRAINT "detail_templates_cf_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "detail_templates_cf" ADD CONSTRAINT "detail_templates_cf_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_cf_locales" ADD CONSTRAINT "detail_templates_cf_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_cf"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_cgal_items" ADD CONSTRAINT "detail_templates_cgal_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "detail_templates_cgal_items" ADD CONSTRAINT "detail_templates_cgal_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_cgal"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_cgal_items_locales" ADD CONSTRAINT "detail_templates_cgal_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_cgal_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_cgal" ADD CONSTRAINT "detail_templates_cgal_badge_id_media_id_fk" FOREIGN KEY ("badge_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "detail_templates_cgal" ADD CONSTRAINT "detail_templates_cgal_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_cgal_locales" ADD CONSTRAINT "detail_templates_cgal_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_cgal"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_awd_items" ADD CONSTRAINT "detail_templates_awd_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "detail_templates_awd_items" ADD CONSTRAINT "detail_templates_awd_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_awd"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_awd_items_locales" ADD CONSTRAINT "detail_templates_awd_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_awd_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_awd" ADD CONSTRAINT "detail_templates_awd_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_awd_locales" ADD CONSTRAINT "detail_templates_awd_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_awd"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_icar_items" ADD CONSTRAINT "detail_templates_icar_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "detail_templates_icar_items" ADD CONSTRAINT "detail_templates_icar_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_icar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_icar_items_locales" ADD CONSTRAINT "detail_templates_icar_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_icar_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_icar" ADD CONSTRAINT "detail_templates_icar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_icar_locales" ADD CONSTRAINT "detail_templates_icar_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_icar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_testi_logos" ADD CONSTRAINT "detail_templates_testi_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "detail_templates_testi_logos" ADD CONSTRAINT "detail_templates_testi_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_testi"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_testi_items" ADD CONSTRAINT "detail_templates_testi_items_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "detail_templates_testi_items" ADD CONSTRAINT "detail_templates_testi_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_testi"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_testi_items_locales" ADD CONSTRAINT "detail_templates_testi_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_testi_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_testi" ADD CONSTRAINT "detail_templates_testi_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_testi_locales" ADD CONSTRAINT "detail_templates_testi_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_testi"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_hot_hotspots" ADD CONSTRAINT "detail_templates_hot_hotspots_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_hot"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_hot_hotspots_locales" ADD CONSTRAINT "detail_templates_hot_hotspots_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_hot_hotspots"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_hot" ADD CONSTRAINT "detail_templates_hot_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "detail_templates_hot" ADD CONSTRAINT "detail_templates_hot_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_hot_locales" ADD CONSTRAINT "detail_templates_hot_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_hot"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_cta_buttons" ADD CONSTRAINT "detail_templates_cta_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_cta_buttons_locales" ADD CONSTRAINT "detail_templates_cta_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_cta_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_cta" ADD CONSTRAINT "detail_templates_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_cta_locales" ADD CONSTRAINT "detail_templates_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_rich" ADD CONSTRAINT "detail_templates_rich_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_rich_locales" ADD CONSTRAINT "detail_templates_rich_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_rich"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_ahead" ADD CONSTRAINT "detail_templates_ahead_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_ahead_locales" ADD CONSTRAINT "detail_templates_ahead_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_ahead"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_cf_v_buttons" ADD CONSTRAINT "__detail_templates_v_cf_v_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_cf_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_cf_v_buttons_locales" ADD CONSTRAINT "__detail_templates_v_cf_v_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_cf_v_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "____detail_templates_v_cf_v_c_v_p_v" ADD CONSTRAINT "____detail_templates_v_cf_v_c_v_p_v_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "____detail_templates_v_cf_v_c_v_p_v" ADD CONSTRAINT "____detail_templates_v_cf_v_c_v_p_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___detail_templates_v_cf_v_c_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___detail_templates_v_cf_v_c_v" ADD CONSTRAINT "___detail_templates_v_cf_v_c_v_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "___detail_templates_v_cf_v_c_v" ADD CONSTRAINT "___detail_templates_v_cf_v_c_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_cf_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___detail_templates_v_cf_v_c_v_locales" ADD CONSTRAINT "___detail_templates_v_cf_v_c_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___detail_templates_v_cf_v_c_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_cf_v" ADD CONSTRAINT "__detail_templates_v_cf_v_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_cf_v" ADD CONSTRAINT "__detail_templates_v_cf_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_cf_v_locales" ADD CONSTRAINT "__detail_templates_v_cf_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_cf_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_cgal_v_items" ADD CONSTRAINT "__detail_templates_v_cgal_v_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_cgal_v_items" ADD CONSTRAINT "__detail_templates_v_cgal_v_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_cgal_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_cgal_v_items_locales" ADD CONSTRAINT "__detail_templates_v_cgal_v_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_cgal_v_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_cgal_v" ADD CONSTRAINT "__detail_templates_v_cgal_v_badge_id_media_id_fk" FOREIGN KEY ("badge_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_cgal_v" ADD CONSTRAINT "__detail_templates_v_cgal_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_cgal_v_locales" ADD CONSTRAINT "__detail_templates_v_cgal_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_cgal_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_awd_v_items" ADD CONSTRAINT "__detail_templates_v_awd_v_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_awd_v_items" ADD CONSTRAINT "__detail_templates_v_awd_v_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_awd_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_awd_v_items_locales" ADD CONSTRAINT "__detail_templates_v_awd_v_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_awd_v_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_awd_v" ADD CONSTRAINT "__detail_templates_v_awd_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_awd_v_locales" ADD CONSTRAINT "__detail_templates_v_awd_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_awd_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_icar_v_items" ADD CONSTRAINT "__detail_templates_v_icar_v_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_icar_v_items" ADD CONSTRAINT "__detail_templates_v_icar_v_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_icar_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_icar_v_items_locales" ADD CONSTRAINT "__detail_templates_v_icar_v_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_icar_v_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_icar_v" ADD CONSTRAINT "__detail_templates_v_icar_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_icar_v_locales" ADD CONSTRAINT "__detail_templates_v_icar_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_icar_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_testi_v_logos" ADD CONSTRAINT "__detail_templates_v_testi_v_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_testi_v_logos" ADD CONSTRAINT "__detail_templates_v_testi_v_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_testi_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_testi_v_items" ADD CONSTRAINT "__detail_templates_v_testi_v_items_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_testi_v_items" ADD CONSTRAINT "__detail_templates_v_testi_v_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_testi_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_testi_v_items_locales" ADD CONSTRAINT "__detail_templates_v_testi_v_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_testi_v_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_testi_v" ADD CONSTRAINT "__detail_templates_v_testi_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_testi_v_locales" ADD CONSTRAINT "__detail_templates_v_testi_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_testi_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_hot_v_hotspots" ADD CONSTRAINT "__detail_templates_v_hot_v_hotspots_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_hot_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_hot_v_hotspots_locales" ADD CONSTRAINT "__detail_templates_v_hot_v_hotspots_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_hot_v_hotspots"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_hot_v" ADD CONSTRAINT "__detail_templates_v_hot_v_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_hot_v" ADD CONSTRAINT "__detail_templates_v_hot_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_hot_v_locales" ADD CONSTRAINT "__detail_templates_v_hot_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_hot_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_cta_v_buttons" ADD CONSTRAINT "__detail_templates_v_cta_v_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_cta_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_cta_v_buttons_locales" ADD CONSTRAINT "__detail_templates_v_cta_v_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_cta_v_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_cta_v" ADD CONSTRAINT "__detail_templates_v_cta_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_cta_v_locales" ADD CONSTRAINT "__detail_templates_v_cta_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_cta_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_rich_v" ADD CONSTRAINT "__detail_templates_v_rich_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_rich_v_locales" ADD CONSTRAINT "__detail_templates_v_rich_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_rich_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_ahead_v" ADD CONSTRAINT "__detail_templates_v_ahead_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_ahead_v_locales" ADD CONSTRAINT "__detail_templates_v_ahead_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_ahead_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_cf_buttons" ADD CONSTRAINT "shared_detail_templates_cf_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_cf"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_cf_buttons_locales" ADD CONSTRAINT "shared_detail_templates_cf_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_cf_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_cf_c_p" ADD CONSTRAINT "shared_detail_templates_cf_c_p_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_cf_c_p" ADD CONSTRAINT "shared_detail_templates_cf_c_p_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_cf_c"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_cf_c" ADD CONSTRAINT "shared_detail_templates_cf_c_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_cf_c" ADD CONSTRAINT "shared_detail_templates_cf_c_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_cf"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_cf_c_locales" ADD CONSTRAINT "shared_detail_templates_cf_c_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_cf_c"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_cf" ADD CONSTRAINT "shared_detail_templates_cf_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_cf" ADD CONSTRAINT "shared_detail_templates_cf_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_cf_locales" ADD CONSTRAINT "shared_detail_templates_cf_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_cf"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_cgal_items" ADD CONSTRAINT "shared_detail_templates_cgal_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_cgal_items" ADD CONSTRAINT "shared_detail_templates_cgal_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_cgal"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_cgal_items_locales" ADD CONSTRAINT "shared_detail_templates_cgal_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_cgal_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_cgal" ADD CONSTRAINT "shared_detail_templates_cgal_badge_id_media_id_fk" FOREIGN KEY ("badge_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_cgal" ADD CONSTRAINT "shared_detail_templates_cgal_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_cgal_locales" ADD CONSTRAINT "shared_detail_templates_cgal_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_cgal"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_awd_items" ADD CONSTRAINT "shared_detail_templates_awd_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_awd_items" ADD CONSTRAINT "shared_detail_templates_awd_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_awd"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_awd_items_locales" ADD CONSTRAINT "shared_detail_templates_awd_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_awd_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_awd" ADD CONSTRAINT "shared_detail_templates_awd_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_awd_locales" ADD CONSTRAINT "shared_detail_templates_awd_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_awd"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_icar_items" ADD CONSTRAINT "shared_detail_templates_icar_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_icar_items" ADD CONSTRAINT "shared_detail_templates_icar_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_icar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_icar_items_locales" ADD CONSTRAINT "shared_detail_templates_icar_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_icar_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_icar" ADD CONSTRAINT "shared_detail_templates_icar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_icar_locales" ADD CONSTRAINT "shared_detail_templates_icar_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_icar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_testi_logos" ADD CONSTRAINT "shared_detail_templates_testi_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_testi_logos" ADD CONSTRAINT "shared_detail_templates_testi_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_testi"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_testi_items" ADD CONSTRAINT "shared_detail_templates_testi_items_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_testi_items" ADD CONSTRAINT "shared_detail_templates_testi_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_testi"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_testi_items_locales" ADD CONSTRAINT "shared_detail_templates_testi_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_testi_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_testi" ADD CONSTRAINT "shared_detail_templates_testi_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_testi_locales" ADD CONSTRAINT "shared_detail_templates_testi_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_testi"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_hot_hotspots" ADD CONSTRAINT "shared_detail_templates_hot_hotspots_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_hot"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_hot_hotspots_locales" ADD CONSTRAINT "shared_detail_templates_hot_hotspots_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_hot_hotspots"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_hot" ADD CONSTRAINT "shared_detail_templates_hot_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_hot" ADD CONSTRAINT "shared_detail_templates_hot_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_hot_locales" ADD CONSTRAINT "shared_detail_templates_hot_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_hot"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_cta_buttons" ADD CONSTRAINT "shared_detail_templates_cta_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_cta_buttons_locales" ADD CONSTRAINT "shared_detail_templates_cta_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_cta_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_cta" ADD CONSTRAINT "shared_detail_templates_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_cta_locales" ADD CONSTRAINT "shared_detail_templates_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_rich" ADD CONSTRAINT "shared_detail_templates_rich_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_rich_locales" ADD CONSTRAINT "shared_detail_templates_rich_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_rich"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_ahead" ADD CONSTRAINT "shared_detail_templates_ahead_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_ahead_locales" ADD CONSTRAINT "shared_detail_templates_ahead_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_ahead"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_cf_v_buttons" ADD CONSTRAINT "__shared_detail_templates_v_cf_v_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_cf_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_cf_v_buttons_locales" ADD CONSTRAINT "__shared_detail_templates_v_cf_v_buttons_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_cf_v_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "____shared_detail_templates_v_cf_v_c_v_p_v" ADD CONSTRAINT "____shared_detail_templates_v_cf_v_c_v_p_v_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "____shared_detail_templates_v_cf_v_c_v_p_v" ADD CONSTRAINT "____shared_detail_templates_v_cf_v_c_v_p_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___shared_detail_templates_v_cf_v_c_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_detail_templates_v_cf_v_c_v" ADD CONSTRAINT "___shared_detail_templates_v_cf_v_c_v_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "___shared_detail_templates_v_cf_v_c_v" ADD CONSTRAINT "___shared_detail_templates_v_cf_v_c_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_cf_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_detail_templates_v_cf_v_c_v_locales" ADD CONSTRAINT "___shared_detail_templates_v_cf_v_c_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___shared_detail_templates_v_cf_v_c_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_cf_v" ADD CONSTRAINT "__shared_detail_templates_v_cf_v_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_cf_v" ADD CONSTRAINT "__shared_detail_templates_v_cf_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_cf_v_locales" ADD CONSTRAINT "__shared_detail_templates_v_cf_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_cf_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_cgal_v_items" ADD CONSTRAINT "__shared_detail_templates_v_cgal_v_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_cgal_v_items" ADD CONSTRAINT "__shared_detail_templates_v_cgal_v_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_cgal_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_cgal_v_items_locales" ADD CONSTRAINT "__shared_detail_templates_v_cgal_v_items_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_cgal_v_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_cgal_v" ADD CONSTRAINT "__shared_detail_templates_v_cgal_v_badge_id_media_id_fk" FOREIGN KEY ("badge_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_cgal_v" ADD CONSTRAINT "__shared_detail_templates_v_cgal_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_cgal_v_locales" ADD CONSTRAINT "__shared_detail_templates_v_cgal_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_cgal_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_awd_v_items" ADD CONSTRAINT "__shared_detail_templates_v_awd_v_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_awd_v_items" ADD CONSTRAINT "__shared_detail_templates_v_awd_v_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_awd_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_awd_v_items_locales" ADD CONSTRAINT "__shared_detail_templates_v_awd_v_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_awd_v_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_awd_v" ADD CONSTRAINT "__shared_detail_templates_v_awd_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_awd_v_locales" ADD CONSTRAINT "__shared_detail_templates_v_awd_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_awd_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_icar_v_items" ADD CONSTRAINT "__shared_detail_templates_v_icar_v_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_icar_v_items" ADD CONSTRAINT "__shared_detail_templates_v_icar_v_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_icar_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_icar_v_items_locales" ADD CONSTRAINT "__shared_detail_templates_v_icar_v_items_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_icar_v_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_icar_v" ADD CONSTRAINT "__shared_detail_templates_v_icar_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_icar_v_locales" ADD CONSTRAINT "__shared_detail_templates_v_icar_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_icar_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_testi_v_logos" ADD CONSTRAINT "__shared_detail_templates_v_testi_v_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_testi_v_logos" ADD CONSTRAINT "__shared_detail_templates_v_testi_v_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_testi_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_testi_v_items" ADD CONSTRAINT "__shared_detail_templates_v_testi_v_items_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_testi_v_items" ADD CONSTRAINT "__shared_detail_templates_v_testi_v_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_testi_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_testi_v_items_locales" ADD CONSTRAINT "__shared_detail_templates_v_testi_v_items_locales_parent__fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_testi_v_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_testi_v" ADD CONSTRAINT "__shared_detail_templates_v_testi_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_testi_v_locales" ADD CONSTRAINT "__shared_detail_templates_v_testi_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_testi_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_hot_v_hotspots" ADD CONSTRAINT "__shared_detail_templates_v_hot_v_hotspots_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_hot_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_hot_v_hotspots_locales" ADD CONSTRAINT "__shared_detail_templates_v_hot_v_hotspots_locales_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_hot_v_hotspots"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_hot_v" ADD CONSTRAINT "__shared_detail_templates_v_hot_v_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_hot_v" ADD CONSTRAINT "__shared_detail_templates_v_hot_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_hot_v_locales" ADD CONSTRAINT "__shared_detail_templates_v_hot_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_hot_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_cta_v_buttons" ADD CONSTRAINT "__shared_detail_templates_v_cta_v_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_cta_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_cta_v_buttons_locales" ADD CONSTRAINT "__shared_detail_templates_v_cta_v_buttons_locales_parent__fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_cta_v_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_cta_v" ADD CONSTRAINT "__shared_detail_templates_v_cta_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_cta_v_locales" ADD CONSTRAINT "__shared_detail_templates_v_cta_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_cta_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_rich_v" ADD CONSTRAINT "__shared_detail_templates_v_rich_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_rich_v_locales" ADD CONSTRAINT "__shared_detail_templates_v_rich_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_rich_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_ahead_v" ADD CONSTRAINT "__shared_detail_templates_v_ahead_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_ahead_v_locales" ADD CONSTRAINT "__shared_detail_templates_v_ahead_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_ahead_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_cf_buttons_order_idx" ON "pages_cf_buttons" USING btree ("_order");
  CREATE INDEX "pages_cf_buttons_parent_id_idx" ON "pages_cf_buttons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_cf_buttons_locales_locale_parent_id_unique" ON "pages_cf_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_cf_c_p_order_idx" ON "pages_cf_c_p" USING btree ("_order");
  CREATE INDEX "pages_cf_c_p_parent_id_idx" ON "pages_cf_c_p" USING btree ("_parent_id");
  CREATE INDEX "pages_cf_c_p_image_idx" ON "pages_cf_c_p" USING btree ("image_id");
  CREATE INDEX "pages_cf_c_order_idx" ON "pages_cf_c" USING btree ("_order");
  CREATE INDEX "pages_cf_c_parent_id_idx" ON "pages_cf_c" USING btree ("_parent_id");
  CREATE INDEX "pages_cf_c_logo_idx" ON "pages_cf_c" USING btree ("logo_id");
  CREATE UNIQUE INDEX "pages_cf_c_locales_locale_parent_id_unique" ON "pages_cf_c_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_cf_order_idx" ON "pages_cf" USING btree ("_order");
  CREATE INDEX "pages_cf_parent_id_idx" ON "pages_cf" USING btree ("_parent_id");
  CREATE INDEX "pages_cf_path_idx" ON "pages_cf" USING btree ("_path");
  CREATE INDEX "pages_cf_appearance_appearance_background_image_idx" ON "pages_cf" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "pages_cf_locales_locale_parent_id_unique" ON "pages_cf_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_cgal_items_order_idx" ON "pages_cgal_items" USING btree ("_order");
  CREATE INDEX "pages_cgal_items_parent_id_idx" ON "pages_cgal_items" USING btree ("_parent_id");
  CREATE INDEX "pages_cgal_items_image_idx" ON "pages_cgal_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_cgal_items_locales_locale_parent_id_unique" ON "pages_cgal_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_cgal_order_idx" ON "pages_cgal" USING btree ("_order");
  CREATE INDEX "pages_cgal_parent_id_idx" ON "pages_cgal" USING btree ("_parent_id");
  CREATE INDEX "pages_cgal_path_idx" ON "pages_cgal" USING btree ("_path");
  CREATE INDEX "pages_cgal_badge_idx" ON "pages_cgal" USING btree ("badge_id");
  CREATE UNIQUE INDEX "pages_cgal_locales_locale_parent_id_unique" ON "pages_cgal_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_awd_items_order_idx" ON "pages_awd_items" USING btree ("_order");
  CREATE INDEX "pages_awd_items_parent_id_idx" ON "pages_awd_items" USING btree ("_parent_id");
  CREATE INDEX "pages_awd_items_image_idx" ON "pages_awd_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_awd_items_locales_locale_parent_id_unique" ON "pages_awd_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_awd_order_idx" ON "pages_awd" USING btree ("_order");
  CREATE INDEX "pages_awd_parent_id_idx" ON "pages_awd" USING btree ("_parent_id");
  CREATE INDEX "pages_awd_path_idx" ON "pages_awd" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_awd_locales_locale_parent_id_unique" ON "pages_awd_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_icar_items_order_idx" ON "pages_icar_items" USING btree ("_order");
  CREATE INDEX "pages_icar_items_parent_id_idx" ON "pages_icar_items" USING btree ("_parent_id");
  CREATE INDEX "pages_icar_items_image_idx" ON "pages_icar_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_icar_items_locales_locale_parent_id_unique" ON "pages_icar_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_icar_order_idx" ON "pages_icar" USING btree ("_order");
  CREATE INDEX "pages_icar_parent_id_idx" ON "pages_icar" USING btree ("_parent_id");
  CREATE INDEX "pages_icar_path_idx" ON "pages_icar" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_icar_locales_locale_parent_id_unique" ON "pages_icar_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_testi_logos_order_idx" ON "pages_testi_logos" USING btree ("_order");
  CREATE INDEX "pages_testi_logos_parent_id_idx" ON "pages_testi_logos" USING btree ("_parent_id");
  CREATE INDEX "pages_testi_logos_image_idx" ON "pages_testi_logos" USING btree ("image_id");
  CREATE INDEX "pages_testi_items_order_idx" ON "pages_testi_items" USING btree ("_order");
  CREATE INDEX "pages_testi_items_parent_id_idx" ON "pages_testi_items" USING btree ("_parent_id");
  CREATE INDEX "pages_testi_items_avatar_idx" ON "pages_testi_items" USING btree ("avatar_id");
  CREATE UNIQUE INDEX "pages_testi_items_locales_locale_parent_id_unique" ON "pages_testi_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_testi_order_idx" ON "pages_testi" USING btree ("_order");
  CREATE INDEX "pages_testi_parent_id_idx" ON "pages_testi" USING btree ("_parent_id");
  CREATE INDEX "pages_testi_path_idx" ON "pages_testi" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_testi_locales_locale_parent_id_unique" ON "pages_testi_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_hot_hotspots_order_idx" ON "pages_hot_hotspots" USING btree ("_order");
  CREATE INDEX "pages_hot_hotspots_parent_id_idx" ON "pages_hot_hotspots" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_hot_hotspots_locales_locale_parent_id_unique" ON "pages_hot_hotspots_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_hot_order_idx" ON "pages_hot" USING btree ("_order");
  CREATE INDEX "pages_hot_parent_id_idx" ON "pages_hot" USING btree ("_parent_id");
  CREATE INDEX "pages_hot_path_idx" ON "pages_hot" USING btree ("_path");
  CREATE INDEX "pages_hot_image_idx" ON "pages_hot" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_hot_locales_locale_parent_id_unique" ON "pages_hot_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_cta_buttons_order_idx" ON "pages_cta_buttons" USING btree ("_order");
  CREATE INDEX "pages_cta_buttons_parent_id_idx" ON "pages_cta_buttons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_cta_buttons_locales_locale_parent_id_unique" ON "pages_cta_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_cta_order_idx" ON "pages_cta" USING btree ("_order");
  CREATE INDEX "pages_cta_parent_id_idx" ON "pages_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_cta_path_idx" ON "pages_cta" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_cta_locales_locale_parent_id_unique" ON "pages_cta_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_rich_order_idx" ON "pages_rich" USING btree ("_order");
  CREATE INDEX "pages_rich_parent_id_idx" ON "pages_rich" USING btree ("_parent_id");
  CREATE INDEX "pages_rich_path_idx" ON "pages_rich" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_rich_locales_locale_parent_id_unique" ON "pages_rich_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_ahead_order_idx" ON "pages_ahead" USING btree ("_order");
  CREATE INDEX "pages_ahead_parent_id_idx" ON "pages_ahead" USING btree ("_parent_id");
  CREATE INDEX "pages_ahead_path_idx" ON "pages_ahead" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_ahead_locales_locale_parent_id_unique" ON "pages_ahead_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__pages_v_cf_v_buttons_order_idx" ON "__pages_v_cf_v_buttons" USING btree ("_order");
  CREATE INDEX "__pages_v_cf_v_buttons_parent_id_idx" ON "__pages_v_cf_v_buttons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "__pages_v_cf_v_buttons_locales_locale_parent_id_unique" ON "__pages_v_cf_v_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "____pages_v_cf_v_c_v_p_v_order_idx" ON "____pages_v_cf_v_c_v_p_v" USING btree ("_order");
  CREATE INDEX "____pages_v_cf_v_c_v_p_v_parent_id_idx" ON "____pages_v_cf_v_c_v_p_v" USING btree ("_parent_id");
  CREATE INDEX "____pages_v_cf_v_c_v_p_v_image_idx" ON "____pages_v_cf_v_c_v_p_v" USING btree ("image_id");
  CREATE INDEX "___pages_v_cf_v_c_v_order_idx" ON "___pages_v_cf_v_c_v" USING btree ("_order");
  CREATE INDEX "___pages_v_cf_v_c_v_parent_id_idx" ON "___pages_v_cf_v_c_v" USING btree ("_parent_id");
  CREATE INDEX "___pages_v_cf_v_c_v_logo_idx" ON "___pages_v_cf_v_c_v" USING btree ("logo_id");
  CREATE UNIQUE INDEX "___pages_v_cf_v_c_v_locales_locale_parent_id_unique" ON "___pages_v_cf_v_c_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__pages_v_cf_v_order_idx" ON "__pages_v_cf_v" USING btree ("_order");
  CREATE INDEX "__pages_v_cf_v_parent_id_idx" ON "__pages_v_cf_v" USING btree ("_parent_id");
  CREATE INDEX "__pages_v_cf_v_path_idx" ON "__pages_v_cf_v" USING btree ("_path");
  CREATE INDEX "__pages_v_cf_v_appearance_appearance_background_image_idx" ON "__pages_v_cf_v" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "__pages_v_cf_v_locales_locale_parent_id_unique" ON "__pages_v_cf_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__pages_v_cgal_v_items_order_idx" ON "__pages_v_cgal_v_items" USING btree ("_order");
  CREATE INDEX "__pages_v_cgal_v_items_parent_id_idx" ON "__pages_v_cgal_v_items" USING btree ("_parent_id");
  CREATE INDEX "__pages_v_cgal_v_items_image_idx" ON "__pages_v_cgal_v_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "__pages_v_cgal_v_items_locales_locale_parent_id_unique" ON "__pages_v_cgal_v_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__pages_v_cgal_v_order_idx" ON "__pages_v_cgal_v" USING btree ("_order");
  CREATE INDEX "__pages_v_cgal_v_parent_id_idx" ON "__pages_v_cgal_v" USING btree ("_parent_id");
  CREATE INDEX "__pages_v_cgal_v_path_idx" ON "__pages_v_cgal_v" USING btree ("_path");
  CREATE INDEX "__pages_v_cgal_v_badge_idx" ON "__pages_v_cgal_v" USING btree ("badge_id");
  CREATE UNIQUE INDEX "__pages_v_cgal_v_locales_locale_parent_id_unique" ON "__pages_v_cgal_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__pages_v_awd_v_items_order_idx" ON "__pages_v_awd_v_items" USING btree ("_order");
  CREATE INDEX "__pages_v_awd_v_items_parent_id_idx" ON "__pages_v_awd_v_items" USING btree ("_parent_id");
  CREATE INDEX "__pages_v_awd_v_items_image_idx" ON "__pages_v_awd_v_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "__pages_v_awd_v_items_locales_locale_parent_id_unique" ON "__pages_v_awd_v_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__pages_v_awd_v_order_idx" ON "__pages_v_awd_v" USING btree ("_order");
  CREATE INDEX "__pages_v_awd_v_parent_id_idx" ON "__pages_v_awd_v" USING btree ("_parent_id");
  CREATE INDEX "__pages_v_awd_v_path_idx" ON "__pages_v_awd_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__pages_v_awd_v_locales_locale_parent_id_unique" ON "__pages_v_awd_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__pages_v_icar_v_items_order_idx" ON "__pages_v_icar_v_items" USING btree ("_order");
  CREATE INDEX "__pages_v_icar_v_items_parent_id_idx" ON "__pages_v_icar_v_items" USING btree ("_parent_id");
  CREATE INDEX "__pages_v_icar_v_items_image_idx" ON "__pages_v_icar_v_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "__pages_v_icar_v_items_locales_locale_parent_id_unique" ON "__pages_v_icar_v_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__pages_v_icar_v_order_idx" ON "__pages_v_icar_v" USING btree ("_order");
  CREATE INDEX "__pages_v_icar_v_parent_id_idx" ON "__pages_v_icar_v" USING btree ("_parent_id");
  CREATE INDEX "__pages_v_icar_v_path_idx" ON "__pages_v_icar_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__pages_v_icar_v_locales_locale_parent_id_unique" ON "__pages_v_icar_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__pages_v_testi_v_logos_order_idx" ON "__pages_v_testi_v_logos" USING btree ("_order");
  CREATE INDEX "__pages_v_testi_v_logos_parent_id_idx" ON "__pages_v_testi_v_logos" USING btree ("_parent_id");
  CREATE INDEX "__pages_v_testi_v_logos_image_idx" ON "__pages_v_testi_v_logos" USING btree ("image_id");
  CREATE INDEX "__pages_v_testi_v_items_order_idx" ON "__pages_v_testi_v_items" USING btree ("_order");
  CREATE INDEX "__pages_v_testi_v_items_parent_id_idx" ON "__pages_v_testi_v_items" USING btree ("_parent_id");
  CREATE INDEX "__pages_v_testi_v_items_avatar_idx" ON "__pages_v_testi_v_items" USING btree ("avatar_id");
  CREATE UNIQUE INDEX "__pages_v_testi_v_items_locales_locale_parent_id_unique" ON "__pages_v_testi_v_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__pages_v_testi_v_order_idx" ON "__pages_v_testi_v" USING btree ("_order");
  CREATE INDEX "__pages_v_testi_v_parent_id_idx" ON "__pages_v_testi_v" USING btree ("_parent_id");
  CREATE INDEX "__pages_v_testi_v_path_idx" ON "__pages_v_testi_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__pages_v_testi_v_locales_locale_parent_id_unique" ON "__pages_v_testi_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__pages_v_hot_v_hotspots_order_idx" ON "__pages_v_hot_v_hotspots" USING btree ("_order");
  CREATE INDEX "__pages_v_hot_v_hotspots_parent_id_idx" ON "__pages_v_hot_v_hotspots" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "__pages_v_hot_v_hotspots_locales_locale_parent_id_unique" ON "__pages_v_hot_v_hotspots_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__pages_v_hot_v_order_idx" ON "__pages_v_hot_v" USING btree ("_order");
  CREATE INDEX "__pages_v_hot_v_parent_id_idx" ON "__pages_v_hot_v" USING btree ("_parent_id");
  CREATE INDEX "__pages_v_hot_v_path_idx" ON "__pages_v_hot_v" USING btree ("_path");
  CREATE INDEX "__pages_v_hot_v_image_idx" ON "__pages_v_hot_v" USING btree ("image_id");
  CREATE UNIQUE INDEX "__pages_v_hot_v_locales_locale_parent_id_unique" ON "__pages_v_hot_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__pages_v_cta_v_buttons_order_idx" ON "__pages_v_cta_v_buttons" USING btree ("_order");
  CREATE INDEX "__pages_v_cta_v_buttons_parent_id_idx" ON "__pages_v_cta_v_buttons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "__pages_v_cta_v_buttons_locales_locale_parent_id_unique" ON "__pages_v_cta_v_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__pages_v_cta_v_order_idx" ON "__pages_v_cta_v" USING btree ("_order");
  CREATE INDEX "__pages_v_cta_v_parent_id_idx" ON "__pages_v_cta_v" USING btree ("_parent_id");
  CREATE INDEX "__pages_v_cta_v_path_idx" ON "__pages_v_cta_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__pages_v_cta_v_locales_locale_parent_id_unique" ON "__pages_v_cta_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__pages_v_rich_v_order_idx" ON "__pages_v_rich_v" USING btree ("_order");
  CREATE INDEX "__pages_v_rich_v_parent_id_idx" ON "__pages_v_rich_v" USING btree ("_parent_id");
  CREATE INDEX "__pages_v_rich_v_path_idx" ON "__pages_v_rich_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__pages_v_rich_v_locales_locale_parent_id_unique" ON "__pages_v_rich_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__pages_v_ahead_v_order_idx" ON "__pages_v_ahead_v" USING btree ("_order");
  CREATE INDEX "__pages_v_ahead_v_parent_id_idx" ON "__pages_v_ahead_v" USING btree ("_parent_id");
  CREATE INDEX "__pages_v_ahead_v_path_idx" ON "__pages_v_ahead_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__pages_v_ahead_v_locales_locale_parent_id_unique" ON "__pages_v_ahead_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_cf_buttons_order_idx" ON "shared_pages_cf_buttons" USING btree ("_order");
  CREATE INDEX "shared_pages_cf_buttons_parent_id_idx" ON "shared_pages_cf_buttons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shared_pages_cf_buttons_locales_locale_parent_id_unique" ON "shared_pages_cf_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_cf_c_p_order_idx" ON "shared_pages_cf_c_p" USING btree ("_order");
  CREATE INDEX "shared_pages_cf_c_p_parent_id_idx" ON "shared_pages_cf_c_p" USING btree ("_parent_id");
  CREATE INDEX "shared_pages_cf_c_p_image_idx" ON "shared_pages_cf_c_p" USING btree ("image_id");
  CREATE INDEX "shared_pages_cf_c_order_idx" ON "shared_pages_cf_c" USING btree ("_order");
  CREATE INDEX "shared_pages_cf_c_parent_id_idx" ON "shared_pages_cf_c" USING btree ("_parent_id");
  CREATE INDEX "shared_pages_cf_c_logo_idx" ON "shared_pages_cf_c" USING btree ("logo_id");
  CREATE UNIQUE INDEX "shared_pages_cf_c_locales_locale_parent_id_unique" ON "shared_pages_cf_c_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_cf_order_idx" ON "shared_pages_cf" USING btree ("_order");
  CREATE INDEX "shared_pages_cf_parent_id_idx" ON "shared_pages_cf" USING btree ("_parent_id");
  CREATE INDEX "shared_pages_cf_path_idx" ON "shared_pages_cf" USING btree ("_path");
  CREATE INDEX "shared_pages_cf_appearance_appearance_background_image_idx" ON "shared_pages_cf" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "shared_pages_cf_locales_locale_parent_id_unique" ON "shared_pages_cf_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_cgal_items_order_idx" ON "shared_pages_cgal_items" USING btree ("_order");
  CREATE INDEX "shared_pages_cgal_items_parent_id_idx" ON "shared_pages_cgal_items" USING btree ("_parent_id");
  CREATE INDEX "shared_pages_cgal_items_image_idx" ON "shared_pages_cgal_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "shared_pages_cgal_items_locales_locale_parent_id_unique" ON "shared_pages_cgal_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_cgal_order_idx" ON "shared_pages_cgal" USING btree ("_order");
  CREATE INDEX "shared_pages_cgal_parent_id_idx" ON "shared_pages_cgal" USING btree ("_parent_id");
  CREATE INDEX "shared_pages_cgal_path_idx" ON "shared_pages_cgal" USING btree ("_path");
  CREATE INDEX "shared_pages_cgal_badge_idx" ON "shared_pages_cgal" USING btree ("badge_id");
  CREATE UNIQUE INDEX "shared_pages_cgal_locales_locale_parent_id_unique" ON "shared_pages_cgal_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_awd_items_order_idx" ON "shared_pages_awd_items" USING btree ("_order");
  CREATE INDEX "shared_pages_awd_items_parent_id_idx" ON "shared_pages_awd_items" USING btree ("_parent_id");
  CREATE INDEX "shared_pages_awd_items_image_idx" ON "shared_pages_awd_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "shared_pages_awd_items_locales_locale_parent_id_unique" ON "shared_pages_awd_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_awd_order_idx" ON "shared_pages_awd" USING btree ("_order");
  CREATE INDEX "shared_pages_awd_parent_id_idx" ON "shared_pages_awd" USING btree ("_parent_id");
  CREATE INDEX "shared_pages_awd_path_idx" ON "shared_pages_awd" USING btree ("_path");
  CREATE UNIQUE INDEX "shared_pages_awd_locales_locale_parent_id_unique" ON "shared_pages_awd_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_icar_items_order_idx" ON "shared_pages_icar_items" USING btree ("_order");
  CREATE INDEX "shared_pages_icar_items_parent_id_idx" ON "shared_pages_icar_items" USING btree ("_parent_id");
  CREATE INDEX "shared_pages_icar_items_image_idx" ON "shared_pages_icar_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "shared_pages_icar_items_locales_locale_parent_id_unique" ON "shared_pages_icar_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_icar_order_idx" ON "shared_pages_icar" USING btree ("_order");
  CREATE INDEX "shared_pages_icar_parent_id_idx" ON "shared_pages_icar" USING btree ("_parent_id");
  CREATE INDEX "shared_pages_icar_path_idx" ON "shared_pages_icar" USING btree ("_path");
  CREATE UNIQUE INDEX "shared_pages_icar_locales_locale_parent_id_unique" ON "shared_pages_icar_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_testi_logos_order_idx" ON "shared_pages_testi_logos" USING btree ("_order");
  CREATE INDEX "shared_pages_testi_logos_parent_id_idx" ON "shared_pages_testi_logos" USING btree ("_parent_id");
  CREATE INDEX "shared_pages_testi_logos_image_idx" ON "shared_pages_testi_logos" USING btree ("image_id");
  CREATE INDEX "shared_pages_testi_items_order_idx" ON "shared_pages_testi_items" USING btree ("_order");
  CREATE INDEX "shared_pages_testi_items_parent_id_idx" ON "shared_pages_testi_items" USING btree ("_parent_id");
  CREATE INDEX "shared_pages_testi_items_avatar_idx" ON "shared_pages_testi_items" USING btree ("avatar_id");
  CREATE UNIQUE INDEX "shared_pages_testi_items_locales_locale_parent_id_unique" ON "shared_pages_testi_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_testi_order_idx" ON "shared_pages_testi" USING btree ("_order");
  CREATE INDEX "shared_pages_testi_parent_id_idx" ON "shared_pages_testi" USING btree ("_parent_id");
  CREATE INDEX "shared_pages_testi_path_idx" ON "shared_pages_testi" USING btree ("_path");
  CREATE UNIQUE INDEX "shared_pages_testi_locales_locale_parent_id_unique" ON "shared_pages_testi_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_hot_hotspots_order_idx" ON "shared_pages_hot_hotspots" USING btree ("_order");
  CREATE INDEX "shared_pages_hot_hotspots_parent_id_idx" ON "shared_pages_hot_hotspots" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shared_pages_hot_hotspots_locales_locale_parent_id_unique" ON "shared_pages_hot_hotspots_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_hot_order_idx" ON "shared_pages_hot" USING btree ("_order");
  CREATE INDEX "shared_pages_hot_parent_id_idx" ON "shared_pages_hot" USING btree ("_parent_id");
  CREATE INDEX "shared_pages_hot_path_idx" ON "shared_pages_hot" USING btree ("_path");
  CREATE INDEX "shared_pages_hot_image_idx" ON "shared_pages_hot" USING btree ("image_id");
  CREATE UNIQUE INDEX "shared_pages_hot_locales_locale_parent_id_unique" ON "shared_pages_hot_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_cta_buttons_order_idx" ON "shared_pages_cta_buttons" USING btree ("_order");
  CREATE INDEX "shared_pages_cta_buttons_parent_id_idx" ON "shared_pages_cta_buttons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shared_pages_cta_buttons_locales_locale_parent_id_unique" ON "shared_pages_cta_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_cta_order_idx" ON "shared_pages_cta" USING btree ("_order");
  CREATE INDEX "shared_pages_cta_parent_id_idx" ON "shared_pages_cta" USING btree ("_parent_id");
  CREATE INDEX "shared_pages_cta_path_idx" ON "shared_pages_cta" USING btree ("_path");
  CREATE UNIQUE INDEX "shared_pages_cta_locales_locale_parent_id_unique" ON "shared_pages_cta_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_rich_order_idx" ON "shared_pages_rich" USING btree ("_order");
  CREATE INDEX "shared_pages_rich_parent_id_idx" ON "shared_pages_rich" USING btree ("_parent_id");
  CREATE INDEX "shared_pages_rich_path_idx" ON "shared_pages_rich" USING btree ("_path");
  CREATE UNIQUE INDEX "shared_pages_rich_locales_locale_parent_id_unique" ON "shared_pages_rich_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_ahead_order_idx" ON "shared_pages_ahead" USING btree ("_order");
  CREATE INDEX "shared_pages_ahead_parent_id_idx" ON "shared_pages_ahead" USING btree ("_parent_id");
  CREATE INDEX "shared_pages_ahead_path_idx" ON "shared_pages_ahead" USING btree ("_path");
  CREATE UNIQUE INDEX "shared_pages_ahead_locales_locale_parent_id_unique" ON "shared_pages_ahead_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_pages_v_cf_v_buttons_order_idx" ON "__shared_pages_v_cf_v_buttons" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_cf_v_buttons_parent_id_idx" ON "__shared_pages_v_cf_v_buttons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "__shared_pages_v_cf_v_buttons_locales_locale_parent_id_uniqu" ON "__shared_pages_v_cf_v_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "____shared_pages_v_cf_v_c_v_p_v_order_idx" ON "____shared_pages_v_cf_v_c_v_p_v" USING btree ("_order");
  CREATE INDEX "____shared_pages_v_cf_v_c_v_p_v_parent_id_idx" ON "____shared_pages_v_cf_v_c_v_p_v" USING btree ("_parent_id");
  CREATE INDEX "____shared_pages_v_cf_v_c_v_p_v_image_idx" ON "____shared_pages_v_cf_v_c_v_p_v" USING btree ("image_id");
  CREATE INDEX "___shared_pages_v_cf_v_c_v_order_idx" ON "___shared_pages_v_cf_v_c_v" USING btree ("_order");
  CREATE INDEX "___shared_pages_v_cf_v_c_v_parent_id_idx" ON "___shared_pages_v_cf_v_c_v" USING btree ("_parent_id");
  CREATE INDEX "___shared_pages_v_cf_v_c_v_logo_idx" ON "___shared_pages_v_cf_v_c_v" USING btree ("logo_id");
  CREATE UNIQUE INDEX "___shared_pages_v_cf_v_c_v_locales_locale_parent_id_unique" ON "___shared_pages_v_cf_v_c_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_pages_v_cf_v_order_idx" ON "__shared_pages_v_cf_v" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_cf_v_parent_id_idx" ON "__shared_pages_v_cf_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_pages_v_cf_v_path_idx" ON "__shared_pages_v_cf_v" USING btree ("_path");
  CREATE INDEX "__shared_pages_v_cf_v_appearance_appearance_background_i_idx" ON "__shared_pages_v_cf_v" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "__shared_pages_v_cf_v_locales_locale_parent_id_unique" ON "__shared_pages_v_cf_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_pages_v_cgal_v_items_order_idx" ON "__shared_pages_v_cgal_v_items" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_cgal_v_items_parent_id_idx" ON "__shared_pages_v_cgal_v_items" USING btree ("_parent_id");
  CREATE INDEX "__shared_pages_v_cgal_v_items_image_idx" ON "__shared_pages_v_cgal_v_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "__shared_pages_v_cgal_v_items_locales_locale_parent_id_uniqu" ON "__shared_pages_v_cgal_v_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_pages_v_cgal_v_order_idx" ON "__shared_pages_v_cgal_v" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_cgal_v_parent_id_idx" ON "__shared_pages_v_cgal_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_pages_v_cgal_v_path_idx" ON "__shared_pages_v_cgal_v" USING btree ("_path");
  CREATE INDEX "__shared_pages_v_cgal_v_badge_idx" ON "__shared_pages_v_cgal_v" USING btree ("badge_id");
  CREATE UNIQUE INDEX "__shared_pages_v_cgal_v_locales_locale_parent_id_unique" ON "__shared_pages_v_cgal_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_pages_v_awd_v_items_order_idx" ON "__shared_pages_v_awd_v_items" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_awd_v_items_parent_id_idx" ON "__shared_pages_v_awd_v_items" USING btree ("_parent_id");
  CREATE INDEX "__shared_pages_v_awd_v_items_image_idx" ON "__shared_pages_v_awd_v_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "__shared_pages_v_awd_v_items_locales_locale_parent_id_unique" ON "__shared_pages_v_awd_v_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_pages_v_awd_v_order_idx" ON "__shared_pages_v_awd_v" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_awd_v_parent_id_idx" ON "__shared_pages_v_awd_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_pages_v_awd_v_path_idx" ON "__shared_pages_v_awd_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__shared_pages_v_awd_v_locales_locale_parent_id_unique" ON "__shared_pages_v_awd_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_pages_v_icar_v_items_order_idx" ON "__shared_pages_v_icar_v_items" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_icar_v_items_parent_id_idx" ON "__shared_pages_v_icar_v_items" USING btree ("_parent_id");
  CREATE INDEX "__shared_pages_v_icar_v_items_image_idx" ON "__shared_pages_v_icar_v_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "__shared_pages_v_icar_v_items_locales_locale_parent_id_uniqu" ON "__shared_pages_v_icar_v_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_pages_v_icar_v_order_idx" ON "__shared_pages_v_icar_v" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_icar_v_parent_id_idx" ON "__shared_pages_v_icar_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_pages_v_icar_v_path_idx" ON "__shared_pages_v_icar_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__shared_pages_v_icar_v_locales_locale_parent_id_unique" ON "__shared_pages_v_icar_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_pages_v_testi_v_logos_order_idx" ON "__shared_pages_v_testi_v_logos" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_testi_v_logos_parent_id_idx" ON "__shared_pages_v_testi_v_logos" USING btree ("_parent_id");
  CREATE INDEX "__shared_pages_v_testi_v_logos_image_idx" ON "__shared_pages_v_testi_v_logos" USING btree ("image_id");
  CREATE INDEX "__shared_pages_v_testi_v_items_order_idx" ON "__shared_pages_v_testi_v_items" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_testi_v_items_parent_id_idx" ON "__shared_pages_v_testi_v_items" USING btree ("_parent_id");
  CREATE INDEX "__shared_pages_v_testi_v_items_avatar_idx" ON "__shared_pages_v_testi_v_items" USING btree ("avatar_id");
  CREATE UNIQUE INDEX "__shared_pages_v_testi_v_items_locales_locale_parent_id_uniq" ON "__shared_pages_v_testi_v_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_pages_v_testi_v_order_idx" ON "__shared_pages_v_testi_v" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_testi_v_parent_id_idx" ON "__shared_pages_v_testi_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_pages_v_testi_v_path_idx" ON "__shared_pages_v_testi_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__shared_pages_v_testi_v_locales_locale_parent_id_unique" ON "__shared_pages_v_testi_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_pages_v_hot_v_hotspots_order_idx" ON "__shared_pages_v_hot_v_hotspots" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_hot_v_hotspots_parent_id_idx" ON "__shared_pages_v_hot_v_hotspots" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "__shared_pages_v_hot_v_hotspots_locales_locale_parent_id_uni" ON "__shared_pages_v_hot_v_hotspots_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_pages_v_hot_v_order_idx" ON "__shared_pages_v_hot_v" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_hot_v_parent_id_idx" ON "__shared_pages_v_hot_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_pages_v_hot_v_path_idx" ON "__shared_pages_v_hot_v" USING btree ("_path");
  CREATE INDEX "__shared_pages_v_hot_v_image_idx" ON "__shared_pages_v_hot_v" USING btree ("image_id");
  CREATE UNIQUE INDEX "__shared_pages_v_hot_v_locales_locale_parent_id_unique" ON "__shared_pages_v_hot_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_pages_v_cta_v_buttons_order_idx" ON "__shared_pages_v_cta_v_buttons" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_cta_v_buttons_parent_id_idx" ON "__shared_pages_v_cta_v_buttons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "__shared_pages_v_cta_v_buttons_locales_locale_parent_id_uniq" ON "__shared_pages_v_cta_v_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_pages_v_cta_v_order_idx" ON "__shared_pages_v_cta_v" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_cta_v_parent_id_idx" ON "__shared_pages_v_cta_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_pages_v_cta_v_path_idx" ON "__shared_pages_v_cta_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__shared_pages_v_cta_v_locales_locale_parent_id_unique" ON "__shared_pages_v_cta_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_pages_v_rich_v_order_idx" ON "__shared_pages_v_rich_v" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_rich_v_parent_id_idx" ON "__shared_pages_v_rich_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_pages_v_rich_v_path_idx" ON "__shared_pages_v_rich_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__shared_pages_v_rich_v_locales_locale_parent_id_unique" ON "__shared_pages_v_rich_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_pages_v_ahead_v_order_idx" ON "__shared_pages_v_ahead_v" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_ahead_v_parent_id_idx" ON "__shared_pages_v_ahead_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_pages_v_ahead_v_path_idx" ON "__shared_pages_v_ahead_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__shared_pages_v_ahead_v_locales_locale_parent_id_unique" ON "__shared_pages_v_ahead_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_cf_buttons_order_idx" ON "detail_templates_cf_buttons" USING btree ("_order");
  CREATE INDEX "detail_templates_cf_buttons_parent_id_idx" ON "detail_templates_cf_buttons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "detail_templates_cf_buttons_locales_locale_parent_id_unique" ON "detail_templates_cf_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_cf_c_p_order_idx" ON "detail_templates_cf_c_p" USING btree ("_order");
  CREATE INDEX "detail_templates_cf_c_p_parent_id_idx" ON "detail_templates_cf_c_p" USING btree ("_parent_id");
  CREATE INDEX "detail_templates_cf_c_p_image_idx" ON "detail_templates_cf_c_p" USING btree ("image_id");
  CREATE INDEX "detail_templates_cf_c_order_idx" ON "detail_templates_cf_c" USING btree ("_order");
  CREATE INDEX "detail_templates_cf_c_parent_id_idx" ON "detail_templates_cf_c" USING btree ("_parent_id");
  CREATE INDEX "detail_templates_cf_c_logo_idx" ON "detail_templates_cf_c" USING btree ("logo_id");
  CREATE UNIQUE INDEX "detail_templates_cf_c_locales_locale_parent_id_unique" ON "detail_templates_cf_c_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_cf_order_idx" ON "detail_templates_cf" USING btree ("_order");
  CREATE INDEX "detail_templates_cf_parent_id_idx" ON "detail_templates_cf" USING btree ("_parent_id");
  CREATE INDEX "detail_templates_cf_path_idx" ON "detail_templates_cf" USING btree ("_path");
  CREATE INDEX "detail_templates_cf_appearance_appearance_background_ima_idx" ON "detail_templates_cf" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "detail_templates_cf_locales_locale_parent_id_unique" ON "detail_templates_cf_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_cgal_items_order_idx" ON "detail_templates_cgal_items" USING btree ("_order");
  CREATE INDEX "detail_templates_cgal_items_parent_id_idx" ON "detail_templates_cgal_items" USING btree ("_parent_id");
  CREATE INDEX "detail_templates_cgal_items_image_idx" ON "detail_templates_cgal_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "detail_templates_cgal_items_locales_locale_parent_id_unique" ON "detail_templates_cgal_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_cgal_order_idx" ON "detail_templates_cgal" USING btree ("_order");
  CREATE INDEX "detail_templates_cgal_parent_id_idx" ON "detail_templates_cgal" USING btree ("_parent_id");
  CREATE INDEX "detail_templates_cgal_path_idx" ON "detail_templates_cgal" USING btree ("_path");
  CREATE INDEX "detail_templates_cgal_badge_idx" ON "detail_templates_cgal" USING btree ("badge_id");
  CREATE UNIQUE INDEX "detail_templates_cgal_locales_locale_parent_id_unique" ON "detail_templates_cgal_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_awd_items_order_idx" ON "detail_templates_awd_items" USING btree ("_order");
  CREATE INDEX "detail_templates_awd_items_parent_id_idx" ON "detail_templates_awd_items" USING btree ("_parent_id");
  CREATE INDEX "detail_templates_awd_items_image_idx" ON "detail_templates_awd_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "detail_templates_awd_items_locales_locale_parent_id_unique" ON "detail_templates_awd_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_awd_order_idx" ON "detail_templates_awd" USING btree ("_order");
  CREATE INDEX "detail_templates_awd_parent_id_idx" ON "detail_templates_awd" USING btree ("_parent_id");
  CREATE INDEX "detail_templates_awd_path_idx" ON "detail_templates_awd" USING btree ("_path");
  CREATE UNIQUE INDEX "detail_templates_awd_locales_locale_parent_id_unique" ON "detail_templates_awd_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_icar_items_order_idx" ON "detail_templates_icar_items" USING btree ("_order");
  CREATE INDEX "detail_templates_icar_items_parent_id_idx" ON "detail_templates_icar_items" USING btree ("_parent_id");
  CREATE INDEX "detail_templates_icar_items_image_idx" ON "detail_templates_icar_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "detail_templates_icar_items_locales_locale_parent_id_unique" ON "detail_templates_icar_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_icar_order_idx" ON "detail_templates_icar" USING btree ("_order");
  CREATE INDEX "detail_templates_icar_parent_id_idx" ON "detail_templates_icar" USING btree ("_parent_id");
  CREATE INDEX "detail_templates_icar_path_idx" ON "detail_templates_icar" USING btree ("_path");
  CREATE UNIQUE INDEX "detail_templates_icar_locales_locale_parent_id_unique" ON "detail_templates_icar_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_testi_logos_order_idx" ON "detail_templates_testi_logos" USING btree ("_order");
  CREATE INDEX "detail_templates_testi_logos_parent_id_idx" ON "detail_templates_testi_logos" USING btree ("_parent_id");
  CREATE INDEX "detail_templates_testi_logos_image_idx" ON "detail_templates_testi_logos" USING btree ("image_id");
  CREATE INDEX "detail_templates_testi_items_order_idx" ON "detail_templates_testi_items" USING btree ("_order");
  CREATE INDEX "detail_templates_testi_items_parent_id_idx" ON "detail_templates_testi_items" USING btree ("_parent_id");
  CREATE INDEX "detail_templates_testi_items_avatar_idx" ON "detail_templates_testi_items" USING btree ("avatar_id");
  CREATE UNIQUE INDEX "detail_templates_testi_items_locales_locale_parent_id_unique" ON "detail_templates_testi_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_testi_order_idx" ON "detail_templates_testi" USING btree ("_order");
  CREATE INDEX "detail_templates_testi_parent_id_idx" ON "detail_templates_testi" USING btree ("_parent_id");
  CREATE INDEX "detail_templates_testi_path_idx" ON "detail_templates_testi" USING btree ("_path");
  CREATE UNIQUE INDEX "detail_templates_testi_locales_locale_parent_id_unique" ON "detail_templates_testi_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_hot_hotspots_order_idx" ON "detail_templates_hot_hotspots" USING btree ("_order");
  CREATE INDEX "detail_templates_hot_hotspots_parent_id_idx" ON "detail_templates_hot_hotspots" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "detail_templates_hot_hotspots_locales_locale_parent_id_uniqu" ON "detail_templates_hot_hotspots_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_hot_order_idx" ON "detail_templates_hot" USING btree ("_order");
  CREATE INDEX "detail_templates_hot_parent_id_idx" ON "detail_templates_hot" USING btree ("_parent_id");
  CREATE INDEX "detail_templates_hot_path_idx" ON "detail_templates_hot" USING btree ("_path");
  CREATE INDEX "detail_templates_hot_image_idx" ON "detail_templates_hot" USING btree ("image_id");
  CREATE UNIQUE INDEX "detail_templates_hot_locales_locale_parent_id_unique" ON "detail_templates_hot_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_cta_buttons_order_idx" ON "detail_templates_cta_buttons" USING btree ("_order");
  CREATE INDEX "detail_templates_cta_buttons_parent_id_idx" ON "detail_templates_cta_buttons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "detail_templates_cta_buttons_locales_locale_parent_id_unique" ON "detail_templates_cta_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_cta_order_idx" ON "detail_templates_cta" USING btree ("_order");
  CREATE INDEX "detail_templates_cta_parent_id_idx" ON "detail_templates_cta" USING btree ("_parent_id");
  CREATE INDEX "detail_templates_cta_path_idx" ON "detail_templates_cta" USING btree ("_path");
  CREATE UNIQUE INDEX "detail_templates_cta_locales_locale_parent_id_unique" ON "detail_templates_cta_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_rich_order_idx" ON "detail_templates_rich" USING btree ("_order");
  CREATE INDEX "detail_templates_rich_parent_id_idx" ON "detail_templates_rich" USING btree ("_parent_id");
  CREATE INDEX "detail_templates_rich_path_idx" ON "detail_templates_rich" USING btree ("_path");
  CREATE UNIQUE INDEX "detail_templates_rich_locales_locale_parent_id_unique" ON "detail_templates_rich_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_ahead_order_idx" ON "detail_templates_ahead" USING btree ("_order");
  CREATE INDEX "detail_templates_ahead_parent_id_idx" ON "detail_templates_ahead" USING btree ("_parent_id");
  CREATE INDEX "detail_templates_ahead_path_idx" ON "detail_templates_ahead" USING btree ("_path");
  CREATE UNIQUE INDEX "detail_templates_ahead_locales_locale_parent_id_unique" ON "detail_templates_ahead_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__detail_templates_v_cf_v_buttons_order_idx" ON "__detail_templates_v_cf_v_buttons" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_cf_v_buttons_parent_id_idx" ON "__detail_templates_v_cf_v_buttons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "__detail_templates_v_cf_v_buttons_locales_locale_parent_id_u" ON "__detail_templates_v_cf_v_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "____detail_templates_v_cf_v_c_v_p_v_order_idx" ON "____detail_templates_v_cf_v_c_v_p_v" USING btree ("_order");
  CREATE INDEX "____detail_templates_v_cf_v_c_v_p_v_parent_id_idx" ON "____detail_templates_v_cf_v_c_v_p_v" USING btree ("_parent_id");
  CREATE INDEX "____detail_templates_v_cf_v_c_v_p_v_image_idx" ON "____detail_templates_v_cf_v_c_v_p_v" USING btree ("image_id");
  CREATE INDEX "___detail_templates_v_cf_v_c_v_order_idx" ON "___detail_templates_v_cf_v_c_v" USING btree ("_order");
  CREATE INDEX "___detail_templates_v_cf_v_c_v_parent_id_idx" ON "___detail_templates_v_cf_v_c_v" USING btree ("_parent_id");
  CREATE INDEX "___detail_templates_v_cf_v_c_v_logo_idx" ON "___detail_templates_v_cf_v_c_v" USING btree ("logo_id");
  CREATE UNIQUE INDEX "___detail_templates_v_cf_v_c_v_locales_locale_parent_id_uniq" ON "___detail_templates_v_cf_v_c_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__detail_templates_v_cf_v_order_idx" ON "__detail_templates_v_cf_v" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_cf_v_parent_id_idx" ON "__detail_templates_v_cf_v" USING btree ("_parent_id");
  CREATE INDEX "__detail_templates_v_cf_v_path_idx" ON "__detail_templates_v_cf_v" USING btree ("_path");
  CREATE INDEX "__detail_templates_v_cf_v_appearance_appearance_backgrou_idx" ON "__detail_templates_v_cf_v" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "__detail_templates_v_cf_v_locales_locale_parent_id_unique" ON "__detail_templates_v_cf_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__detail_templates_v_cgal_v_items_order_idx" ON "__detail_templates_v_cgal_v_items" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_cgal_v_items_parent_id_idx" ON "__detail_templates_v_cgal_v_items" USING btree ("_parent_id");
  CREATE INDEX "__detail_templates_v_cgal_v_items_image_idx" ON "__detail_templates_v_cgal_v_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "__detail_templates_v_cgal_v_items_locales_locale_parent_id_u" ON "__detail_templates_v_cgal_v_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__detail_templates_v_cgal_v_order_idx" ON "__detail_templates_v_cgal_v" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_cgal_v_parent_id_idx" ON "__detail_templates_v_cgal_v" USING btree ("_parent_id");
  CREATE INDEX "__detail_templates_v_cgal_v_path_idx" ON "__detail_templates_v_cgal_v" USING btree ("_path");
  CREATE INDEX "__detail_templates_v_cgal_v_badge_idx" ON "__detail_templates_v_cgal_v" USING btree ("badge_id");
  CREATE UNIQUE INDEX "__detail_templates_v_cgal_v_locales_locale_parent_id_unique" ON "__detail_templates_v_cgal_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__detail_templates_v_awd_v_items_order_idx" ON "__detail_templates_v_awd_v_items" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_awd_v_items_parent_id_idx" ON "__detail_templates_v_awd_v_items" USING btree ("_parent_id");
  CREATE INDEX "__detail_templates_v_awd_v_items_image_idx" ON "__detail_templates_v_awd_v_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "__detail_templates_v_awd_v_items_locales_locale_parent_id_un" ON "__detail_templates_v_awd_v_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__detail_templates_v_awd_v_order_idx" ON "__detail_templates_v_awd_v" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_awd_v_parent_id_idx" ON "__detail_templates_v_awd_v" USING btree ("_parent_id");
  CREATE INDEX "__detail_templates_v_awd_v_path_idx" ON "__detail_templates_v_awd_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__detail_templates_v_awd_v_locales_locale_parent_id_unique" ON "__detail_templates_v_awd_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__detail_templates_v_icar_v_items_order_idx" ON "__detail_templates_v_icar_v_items" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_icar_v_items_parent_id_idx" ON "__detail_templates_v_icar_v_items" USING btree ("_parent_id");
  CREATE INDEX "__detail_templates_v_icar_v_items_image_idx" ON "__detail_templates_v_icar_v_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "__detail_templates_v_icar_v_items_locales_locale_parent_id_u" ON "__detail_templates_v_icar_v_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__detail_templates_v_icar_v_order_idx" ON "__detail_templates_v_icar_v" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_icar_v_parent_id_idx" ON "__detail_templates_v_icar_v" USING btree ("_parent_id");
  CREATE INDEX "__detail_templates_v_icar_v_path_idx" ON "__detail_templates_v_icar_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__detail_templates_v_icar_v_locales_locale_parent_id_unique" ON "__detail_templates_v_icar_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__detail_templates_v_testi_v_logos_order_idx" ON "__detail_templates_v_testi_v_logos" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_testi_v_logos_parent_id_idx" ON "__detail_templates_v_testi_v_logos" USING btree ("_parent_id");
  CREATE INDEX "__detail_templates_v_testi_v_logos_image_idx" ON "__detail_templates_v_testi_v_logos" USING btree ("image_id");
  CREATE INDEX "__detail_templates_v_testi_v_items_order_idx" ON "__detail_templates_v_testi_v_items" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_testi_v_items_parent_id_idx" ON "__detail_templates_v_testi_v_items" USING btree ("_parent_id");
  CREATE INDEX "__detail_templates_v_testi_v_items_avatar_idx" ON "__detail_templates_v_testi_v_items" USING btree ("avatar_id");
  CREATE UNIQUE INDEX "__detail_templates_v_testi_v_items_locales_locale_parent_id_" ON "__detail_templates_v_testi_v_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__detail_templates_v_testi_v_order_idx" ON "__detail_templates_v_testi_v" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_testi_v_parent_id_idx" ON "__detail_templates_v_testi_v" USING btree ("_parent_id");
  CREATE INDEX "__detail_templates_v_testi_v_path_idx" ON "__detail_templates_v_testi_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__detail_templates_v_testi_v_locales_locale_parent_id_unique" ON "__detail_templates_v_testi_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__detail_templates_v_hot_v_hotspots_order_idx" ON "__detail_templates_v_hot_v_hotspots" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_hot_v_hotspots_parent_id_idx" ON "__detail_templates_v_hot_v_hotspots" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "__detail_templates_v_hot_v_hotspots_locales_locale_parent_id" ON "__detail_templates_v_hot_v_hotspots_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__detail_templates_v_hot_v_order_idx" ON "__detail_templates_v_hot_v" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_hot_v_parent_id_idx" ON "__detail_templates_v_hot_v" USING btree ("_parent_id");
  CREATE INDEX "__detail_templates_v_hot_v_path_idx" ON "__detail_templates_v_hot_v" USING btree ("_path");
  CREATE INDEX "__detail_templates_v_hot_v_image_idx" ON "__detail_templates_v_hot_v" USING btree ("image_id");
  CREATE UNIQUE INDEX "__detail_templates_v_hot_v_locales_locale_parent_id_unique" ON "__detail_templates_v_hot_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__detail_templates_v_cta_v_buttons_order_idx" ON "__detail_templates_v_cta_v_buttons" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_cta_v_buttons_parent_id_idx" ON "__detail_templates_v_cta_v_buttons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "__detail_templates_v_cta_v_buttons_locales_locale_parent_id_" ON "__detail_templates_v_cta_v_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__detail_templates_v_cta_v_order_idx" ON "__detail_templates_v_cta_v" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_cta_v_parent_id_idx" ON "__detail_templates_v_cta_v" USING btree ("_parent_id");
  CREATE INDEX "__detail_templates_v_cta_v_path_idx" ON "__detail_templates_v_cta_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__detail_templates_v_cta_v_locales_locale_parent_id_unique" ON "__detail_templates_v_cta_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__detail_templates_v_rich_v_order_idx" ON "__detail_templates_v_rich_v" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_rich_v_parent_id_idx" ON "__detail_templates_v_rich_v" USING btree ("_parent_id");
  CREATE INDEX "__detail_templates_v_rich_v_path_idx" ON "__detail_templates_v_rich_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__detail_templates_v_rich_v_locales_locale_parent_id_unique" ON "__detail_templates_v_rich_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__detail_templates_v_ahead_v_order_idx" ON "__detail_templates_v_ahead_v" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_ahead_v_parent_id_idx" ON "__detail_templates_v_ahead_v" USING btree ("_parent_id");
  CREATE INDEX "__detail_templates_v_ahead_v_path_idx" ON "__detail_templates_v_ahead_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__detail_templates_v_ahead_v_locales_locale_parent_id_unique" ON "__detail_templates_v_ahead_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_cf_buttons_order_idx" ON "shared_detail_templates_cf_buttons" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_cf_buttons_parent_id_idx" ON "shared_detail_templates_cf_buttons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shared_detail_templates_cf_buttons_locales_locale_parent_id_" ON "shared_detail_templates_cf_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_cf_c_p_order_idx" ON "shared_detail_templates_cf_c_p" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_cf_c_p_parent_id_idx" ON "shared_detail_templates_cf_c_p" USING btree ("_parent_id");
  CREATE INDEX "shared_detail_templates_cf_c_p_image_idx" ON "shared_detail_templates_cf_c_p" USING btree ("image_id");
  CREATE INDEX "shared_detail_templates_cf_c_order_idx" ON "shared_detail_templates_cf_c" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_cf_c_parent_id_idx" ON "shared_detail_templates_cf_c" USING btree ("_parent_id");
  CREATE INDEX "shared_detail_templates_cf_c_logo_idx" ON "shared_detail_templates_cf_c" USING btree ("logo_id");
  CREATE UNIQUE INDEX "shared_detail_templates_cf_c_locales_locale_parent_id_unique" ON "shared_detail_templates_cf_c_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_cf_order_idx" ON "shared_detail_templates_cf" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_cf_parent_id_idx" ON "shared_detail_templates_cf" USING btree ("_parent_id");
  CREATE INDEX "shared_detail_templates_cf_path_idx" ON "shared_detail_templates_cf" USING btree ("_path");
  CREATE INDEX "shared_detail_templates_cf_appearance_appearance_backgro_idx" ON "shared_detail_templates_cf" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "shared_detail_templates_cf_locales_locale_parent_id_unique" ON "shared_detail_templates_cf_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_cgal_items_order_idx" ON "shared_detail_templates_cgal_items" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_cgal_items_parent_id_idx" ON "shared_detail_templates_cgal_items" USING btree ("_parent_id");
  CREATE INDEX "shared_detail_templates_cgal_items_image_idx" ON "shared_detail_templates_cgal_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "shared_detail_templates_cgal_items_locales_locale_parent_id_" ON "shared_detail_templates_cgal_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_cgal_order_idx" ON "shared_detail_templates_cgal" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_cgal_parent_id_idx" ON "shared_detail_templates_cgal" USING btree ("_parent_id");
  CREATE INDEX "shared_detail_templates_cgal_path_idx" ON "shared_detail_templates_cgal" USING btree ("_path");
  CREATE INDEX "shared_detail_templates_cgal_badge_idx" ON "shared_detail_templates_cgal" USING btree ("badge_id");
  CREATE UNIQUE INDEX "shared_detail_templates_cgal_locales_locale_parent_id_unique" ON "shared_detail_templates_cgal_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_awd_items_order_idx" ON "shared_detail_templates_awd_items" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_awd_items_parent_id_idx" ON "shared_detail_templates_awd_items" USING btree ("_parent_id");
  CREATE INDEX "shared_detail_templates_awd_items_image_idx" ON "shared_detail_templates_awd_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "shared_detail_templates_awd_items_locales_locale_parent_id_u" ON "shared_detail_templates_awd_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_awd_order_idx" ON "shared_detail_templates_awd" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_awd_parent_id_idx" ON "shared_detail_templates_awd" USING btree ("_parent_id");
  CREATE INDEX "shared_detail_templates_awd_path_idx" ON "shared_detail_templates_awd" USING btree ("_path");
  CREATE UNIQUE INDEX "shared_detail_templates_awd_locales_locale_parent_id_unique" ON "shared_detail_templates_awd_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_icar_items_order_idx" ON "shared_detail_templates_icar_items" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_icar_items_parent_id_idx" ON "shared_detail_templates_icar_items" USING btree ("_parent_id");
  CREATE INDEX "shared_detail_templates_icar_items_image_idx" ON "shared_detail_templates_icar_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "shared_detail_templates_icar_items_locales_locale_parent_id_" ON "shared_detail_templates_icar_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_icar_order_idx" ON "shared_detail_templates_icar" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_icar_parent_id_idx" ON "shared_detail_templates_icar" USING btree ("_parent_id");
  CREATE INDEX "shared_detail_templates_icar_path_idx" ON "shared_detail_templates_icar" USING btree ("_path");
  CREATE UNIQUE INDEX "shared_detail_templates_icar_locales_locale_parent_id_unique" ON "shared_detail_templates_icar_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_testi_logos_order_idx" ON "shared_detail_templates_testi_logos" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_testi_logos_parent_id_idx" ON "shared_detail_templates_testi_logos" USING btree ("_parent_id");
  CREATE INDEX "shared_detail_templates_testi_logos_image_idx" ON "shared_detail_templates_testi_logos" USING btree ("image_id");
  CREATE INDEX "shared_detail_templates_testi_items_order_idx" ON "shared_detail_templates_testi_items" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_testi_items_parent_id_idx" ON "shared_detail_templates_testi_items" USING btree ("_parent_id");
  CREATE INDEX "shared_detail_templates_testi_items_avatar_idx" ON "shared_detail_templates_testi_items" USING btree ("avatar_id");
  CREATE UNIQUE INDEX "shared_detail_templates_testi_items_locales_locale_parent_id" ON "shared_detail_templates_testi_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_testi_order_idx" ON "shared_detail_templates_testi" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_testi_parent_id_idx" ON "shared_detail_templates_testi" USING btree ("_parent_id");
  CREATE INDEX "shared_detail_templates_testi_path_idx" ON "shared_detail_templates_testi" USING btree ("_path");
  CREATE UNIQUE INDEX "shared_detail_templates_testi_locales_locale_parent_id_uniqu" ON "shared_detail_templates_testi_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_hot_hotspots_order_idx" ON "shared_detail_templates_hot_hotspots" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_hot_hotspots_parent_id_idx" ON "shared_detail_templates_hot_hotspots" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shared_detail_templates_hot_hotspots_locales_locale_parent_i" ON "shared_detail_templates_hot_hotspots_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_hot_order_idx" ON "shared_detail_templates_hot" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_hot_parent_id_idx" ON "shared_detail_templates_hot" USING btree ("_parent_id");
  CREATE INDEX "shared_detail_templates_hot_path_idx" ON "shared_detail_templates_hot" USING btree ("_path");
  CREATE INDEX "shared_detail_templates_hot_image_idx" ON "shared_detail_templates_hot" USING btree ("image_id");
  CREATE UNIQUE INDEX "shared_detail_templates_hot_locales_locale_parent_id_unique" ON "shared_detail_templates_hot_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_cta_buttons_order_idx" ON "shared_detail_templates_cta_buttons" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_cta_buttons_parent_id_idx" ON "shared_detail_templates_cta_buttons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shared_detail_templates_cta_buttons_locales_locale_parent_id" ON "shared_detail_templates_cta_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_cta_order_idx" ON "shared_detail_templates_cta" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_cta_parent_id_idx" ON "shared_detail_templates_cta" USING btree ("_parent_id");
  CREATE INDEX "shared_detail_templates_cta_path_idx" ON "shared_detail_templates_cta" USING btree ("_path");
  CREATE UNIQUE INDEX "shared_detail_templates_cta_locales_locale_parent_id_unique" ON "shared_detail_templates_cta_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_rich_order_idx" ON "shared_detail_templates_rich" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_rich_parent_id_idx" ON "shared_detail_templates_rich" USING btree ("_parent_id");
  CREATE INDEX "shared_detail_templates_rich_path_idx" ON "shared_detail_templates_rich" USING btree ("_path");
  CREATE UNIQUE INDEX "shared_detail_templates_rich_locales_locale_parent_id_unique" ON "shared_detail_templates_rich_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_ahead_order_idx" ON "shared_detail_templates_ahead" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_ahead_parent_id_idx" ON "shared_detail_templates_ahead" USING btree ("_parent_id");
  CREATE INDEX "shared_detail_templates_ahead_path_idx" ON "shared_detail_templates_ahead" USING btree ("_path");
  CREATE UNIQUE INDEX "shared_detail_templates_ahead_locales_locale_parent_id_uniqu" ON "shared_detail_templates_ahead_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_cf_v_buttons_order_idx" ON "__shared_detail_templates_v_cf_v_buttons" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_cf_v_buttons_parent_id_idx" ON "__shared_detail_templates_v_cf_v_buttons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_cf_v_buttons_locales_locale_pare" ON "__shared_detail_templates_v_cf_v_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "____shared_detail_templates_v_cf_v_c_v_p_v_order_idx" ON "____shared_detail_templates_v_cf_v_c_v_p_v" USING btree ("_order");
  CREATE INDEX "____shared_detail_templates_v_cf_v_c_v_p_v_parent_id_idx" ON "____shared_detail_templates_v_cf_v_c_v_p_v" USING btree ("_parent_id");
  CREATE INDEX "____shared_detail_templates_v_cf_v_c_v_p_v_image_idx" ON "____shared_detail_templates_v_cf_v_c_v_p_v" USING btree ("image_id");
  CREATE INDEX "___shared_detail_templates_v_cf_v_c_v_order_idx" ON "___shared_detail_templates_v_cf_v_c_v" USING btree ("_order");
  CREATE INDEX "___shared_detail_templates_v_cf_v_c_v_parent_id_idx" ON "___shared_detail_templates_v_cf_v_c_v" USING btree ("_parent_id");
  CREATE INDEX "___shared_detail_templates_v_cf_v_c_v_logo_idx" ON "___shared_detail_templates_v_cf_v_c_v" USING btree ("logo_id");
  CREATE UNIQUE INDEX "___shared_detail_templates_v_cf_v_c_v_locales_locale_parent_" ON "___shared_detail_templates_v_cf_v_c_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_cf_v_order_idx" ON "__shared_detail_templates_v_cf_v" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_cf_v_parent_id_idx" ON "__shared_detail_templates_v_cf_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_detail_templates_v_cf_v_path_idx" ON "__shared_detail_templates_v_cf_v" USING btree ("_path");
  CREATE INDEX "__shared_detail_templates_v_cf_v_appearance_appearance_b_idx" ON "__shared_detail_templates_v_cf_v" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_cf_v_locales_locale_parent_id_un" ON "__shared_detail_templates_v_cf_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_cgal_v_items_order_idx" ON "__shared_detail_templates_v_cgal_v_items" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_cgal_v_items_parent_id_idx" ON "__shared_detail_templates_v_cgal_v_items" USING btree ("_parent_id");
  CREATE INDEX "__shared_detail_templates_v_cgal_v_items_image_idx" ON "__shared_detail_templates_v_cgal_v_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_cgal_v_items_locales_locale_pare" ON "__shared_detail_templates_v_cgal_v_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_cgal_v_order_idx" ON "__shared_detail_templates_v_cgal_v" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_cgal_v_parent_id_idx" ON "__shared_detail_templates_v_cgal_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_detail_templates_v_cgal_v_path_idx" ON "__shared_detail_templates_v_cgal_v" USING btree ("_path");
  CREATE INDEX "__shared_detail_templates_v_cgal_v_badge_idx" ON "__shared_detail_templates_v_cgal_v" USING btree ("badge_id");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_cgal_v_locales_locale_parent_id_" ON "__shared_detail_templates_v_cgal_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_awd_v_items_order_idx" ON "__shared_detail_templates_v_awd_v_items" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_awd_v_items_parent_id_idx" ON "__shared_detail_templates_v_awd_v_items" USING btree ("_parent_id");
  CREATE INDEX "__shared_detail_templates_v_awd_v_items_image_idx" ON "__shared_detail_templates_v_awd_v_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_awd_v_items_locales_locale_paren" ON "__shared_detail_templates_v_awd_v_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_awd_v_order_idx" ON "__shared_detail_templates_v_awd_v" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_awd_v_parent_id_idx" ON "__shared_detail_templates_v_awd_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_detail_templates_v_awd_v_path_idx" ON "__shared_detail_templates_v_awd_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_awd_v_locales_locale_parent_id_u" ON "__shared_detail_templates_v_awd_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_icar_v_items_order_idx" ON "__shared_detail_templates_v_icar_v_items" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_icar_v_items_parent_id_idx" ON "__shared_detail_templates_v_icar_v_items" USING btree ("_parent_id");
  CREATE INDEX "__shared_detail_templates_v_icar_v_items_image_idx" ON "__shared_detail_templates_v_icar_v_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_icar_v_items_locales_locale_pare" ON "__shared_detail_templates_v_icar_v_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_icar_v_order_idx" ON "__shared_detail_templates_v_icar_v" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_icar_v_parent_id_idx" ON "__shared_detail_templates_v_icar_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_detail_templates_v_icar_v_path_idx" ON "__shared_detail_templates_v_icar_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_icar_v_locales_locale_parent_id_" ON "__shared_detail_templates_v_icar_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_testi_v_logos_order_idx" ON "__shared_detail_templates_v_testi_v_logos" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_testi_v_logos_parent_id_idx" ON "__shared_detail_templates_v_testi_v_logos" USING btree ("_parent_id");
  CREATE INDEX "__shared_detail_templates_v_testi_v_logos_image_idx" ON "__shared_detail_templates_v_testi_v_logos" USING btree ("image_id");
  CREATE INDEX "__shared_detail_templates_v_testi_v_items_order_idx" ON "__shared_detail_templates_v_testi_v_items" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_testi_v_items_parent_id_idx" ON "__shared_detail_templates_v_testi_v_items" USING btree ("_parent_id");
  CREATE INDEX "__shared_detail_templates_v_testi_v_items_avatar_idx" ON "__shared_detail_templates_v_testi_v_items" USING btree ("avatar_id");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_testi_v_items_locales_locale_par" ON "__shared_detail_templates_v_testi_v_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_testi_v_order_idx" ON "__shared_detail_templates_v_testi_v" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_testi_v_parent_id_idx" ON "__shared_detail_templates_v_testi_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_detail_templates_v_testi_v_path_idx" ON "__shared_detail_templates_v_testi_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_testi_v_locales_locale_parent_id" ON "__shared_detail_templates_v_testi_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_hot_v_hotspots_order_idx" ON "__shared_detail_templates_v_hot_v_hotspots" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_hot_v_hotspots_parent_id_idx" ON "__shared_detail_templates_v_hot_v_hotspots" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_hot_v_hotspots_locales_locale_pa" ON "__shared_detail_templates_v_hot_v_hotspots_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_hot_v_order_idx" ON "__shared_detail_templates_v_hot_v" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_hot_v_parent_id_idx" ON "__shared_detail_templates_v_hot_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_detail_templates_v_hot_v_path_idx" ON "__shared_detail_templates_v_hot_v" USING btree ("_path");
  CREATE INDEX "__shared_detail_templates_v_hot_v_image_idx" ON "__shared_detail_templates_v_hot_v" USING btree ("image_id");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_hot_v_locales_locale_parent_id_u" ON "__shared_detail_templates_v_hot_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_cta_v_buttons_order_idx" ON "__shared_detail_templates_v_cta_v_buttons" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_cta_v_buttons_parent_id_idx" ON "__shared_detail_templates_v_cta_v_buttons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_cta_v_buttons_locales_locale_par" ON "__shared_detail_templates_v_cta_v_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_cta_v_order_idx" ON "__shared_detail_templates_v_cta_v" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_cta_v_parent_id_idx" ON "__shared_detail_templates_v_cta_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_detail_templates_v_cta_v_path_idx" ON "__shared_detail_templates_v_cta_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_cta_v_locales_locale_parent_id_u" ON "__shared_detail_templates_v_cta_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_rich_v_order_idx" ON "__shared_detail_templates_v_rich_v" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_rich_v_parent_id_idx" ON "__shared_detail_templates_v_rich_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_detail_templates_v_rich_v_path_idx" ON "__shared_detail_templates_v_rich_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_rich_v_locales_locale_parent_id_" ON "__shared_detail_templates_v_rich_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_ahead_v_order_idx" ON "__shared_detail_templates_v_ahead_v" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_ahead_v_parent_id_idx" ON "__shared_detail_templates_v_ahead_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_detail_templates_v_ahead_v_path_idx" ON "__shared_detail_templates_v_ahead_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_ahead_v_locales_locale_parent_id" ON "__shared_detail_templates_v_ahead_v_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_cf_buttons" CASCADE;
  DROP TABLE "pages_cf_buttons_locales" CASCADE;
  DROP TABLE "pages_cf_c_p" CASCADE;
  DROP TABLE "pages_cf_c" CASCADE;
  DROP TABLE "pages_cf_c_locales" CASCADE;
  DROP TABLE "pages_cf" CASCADE;
  DROP TABLE "pages_cf_locales" CASCADE;
  DROP TABLE "pages_cgal_items" CASCADE;
  DROP TABLE "pages_cgal_items_locales" CASCADE;
  DROP TABLE "pages_cgal" CASCADE;
  DROP TABLE "pages_cgal_locales" CASCADE;
  DROP TABLE "pages_awd_items" CASCADE;
  DROP TABLE "pages_awd_items_locales" CASCADE;
  DROP TABLE "pages_awd" CASCADE;
  DROP TABLE "pages_awd_locales" CASCADE;
  DROP TABLE "pages_icar_items" CASCADE;
  DROP TABLE "pages_icar_items_locales" CASCADE;
  DROP TABLE "pages_icar" CASCADE;
  DROP TABLE "pages_icar_locales" CASCADE;
  DROP TABLE "pages_testi_logos" CASCADE;
  DROP TABLE "pages_testi_items" CASCADE;
  DROP TABLE "pages_testi_items_locales" CASCADE;
  DROP TABLE "pages_testi" CASCADE;
  DROP TABLE "pages_testi_locales" CASCADE;
  DROP TABLE "pages_hot_hotspots" CASCADE;
  DROP TABLE "pages_hot_hotspots_locales" CASCADE;
  DROP TABLE "pages_hot" CASCADE;
  DROP TABLE "pages_hot_locales" CASCADE;
  DROP TABLE "pages_cta_buttons" CASCADE;
  DROP TABLE "pages_cta_buttons_locales" CASCADE;
  DROP TABLE "pages_cta" CASCADE;
  DROP TABLE "pages_cta_locales" CASCADE;
  DROP TABLE "pages_rich" CASCADE;
  DROP TABLE "pages_rich_locales" CASCADE;
  DROP TABLE "pages_ahead" CASCADE;
  DROP TABLE "pages_ahead_locales" CASCADE;
  DROP TABLE "__pages_v_cf_v_buttons" CASCADE;
  DROP TABLE "__pages_v_cf_v_buttons_locales" CASCADE;
  DROP TABLE "____pages_v_cf_v_c_v_p_v" CASCADE;
  DROP TABLE "___pages_v_cf_v_c_v" CASCADE;
  DROP TABLE "___pages_v_cf_v_c_v_locales" CASCADE;
  DROP TABLE "__pages_v_cf_v" CASCADE;
  DROP TABLE "__pages_v_cf_v_locales" CASCADE;
  DROP TABLE "__pages_v_cgal_v_items" CASCADE;
  DROP TABLE "__pages_v_cgal_v_items_locales" CASCADE;
  DROP TABLE "__pages_v_cgal_v" CASCADE;
  DROP TABLE "__pages_v_cgal_v_locales" CASCADE;
  DROP TABLE "__pages_v_awd_v_items" CASCADE;
  DROP TABLE "__pages_v_awd_v_items_locales" CASCADE;
  DROP TABLE "__pages_v_awd_v" CASCADE;
  DROP TABLE "__pages_v_awd_v_locales" CASCADE;
  DROP TABLE "__pages_v_icar_v_items" CASCADE;
  DROP TABLE "__pages_v_icar_v_items_locales" CASCADE;
  DROP TABLE "__pages_v_icar_v" CASCADE;
  DROP TABLE "__pages_v_icar_v_locales" CASCADE;
  DROP TABLE "__pages_v_testi_v_logos" CASCADE;
  DROP TABLE "__pages_v_testi_v_items" CASCADE;
  DROP TABLE "__pages_v_testi_v_items_locales" CASCADE;
  DROP TABLE "__pages_v_testi_v" CASCADE;
  DROP TABLE "__pages_v_testi_v_locales" CASCADE;
  DROP TABLE "__pages_v_hot_v_hotspots" CASCADE;
  DROP TABLE "__pages_v_hot_v_hotspots_locales" CASCADE;
  DROP TABLE "__pages_v_hot_v" CASCADE;
  DROP TABLE "__pages_v_hot_v_locales" CASCADE;
  DROP TABLE "__pages_v_cta_v_buttons" CASCADE;
  DROP TABLE "__pages_v_cta_v_buttons_locales" CASCADE;
  DROP TABLE "__pages_v_cta_v" CASCADE;
  DROP TABLE "__pages_v_cta_v_locales" CASCADE;
  DROP TABLE "__pages_v_rich_v" CASCADE;
  DROP TABLE "__pages_v_rich_v_locales" CASCADE;
  DROP TABLE "__pages_v_ahead_v" CASCADE;
  DROP TABLE "__pages_v_ahead_v_locales" CASCADE;
  DROP TABLE "shared_pages_cf_buttons" CASCADE;
  DROP TABLE "shared_pages_cf_buttons_locales" CASCADE;
  DROP TABLE "shared_pages_cf_c_p" CASCADE;
  DROP TABLE "shared_pages_cf_c" CASCADE;
  DROP TABLE "shared_pages_cf_c_locales" CASCADE;
  DROP TABLE "shared_pages_cf" CASCADE;
  DROP TABLE "shared_pages_cf_locales" CASCADE;
  DROP TABLE "shared_pages_cgal_items" CASCADE;
  DROP TABLE "shared_pages_cgal_items_locales" CASCADE;
  DROP TABLE "shared_pages_cgal" CASCADE;
  DROP TABLE "shared_pages_cgal_locales" CASCADE;
  DROP TABLE "shared_pages_awd_items" CASCADE;
  DROP TABLE "shared_pages_awd_items_locales" CASCADE;
  DROP TABLE "shared_pages_awd" CASCADE;
  DROP TABLE "shared_pages_awd_locales" CASCADE;
  DROP TABLE "shared_pages_icar_items" CASCADE;
  DROP TABLE "shared_pages_icar_items_locales" CASCADE;
  DROP TABLE "shared_pages_icar" CASCADE;
  DROP TABLE "shared_pages_icar_locales" CASCADE;
  DROP TABLE "shared_pages_testi_logos" CASCADE;
  DROP TABLE "shared_pages_testi_items" CASCADE;
  DROP TABLE "shared_pages_testi_items_locales" CASCADE;
  DROP TABLE "shared_pages_testi" CASCADE;
  DROP TABLE "shared_pages_testi_locales" CASCADE;
  DROP TABLE "shared_pages_hot_hotspots" CASCADE;
  DROP TABLE "shared_pages_hot_hotspots_locales" CASCADE;
  DROP TABLE "shared_pages_hot" CASCADE;
  DROP TABLE "shared_pages_hot_locales" CASCADE;
  DROP TABLE "shared_pages_cta_buttons" CASCADE;
  DROP TABLE "shared_pages_cta_buttons_locales" CASCADE;
  DROP TABLE "shared_pages_cta" CASCADE;
  DROP TABLE "shared_pages_cta_locales" CASCADE;
  DROP TABLE "shared_pages_rich" CASCADE;
  DROP TABLE "shared_pages_rich_locales" CASCADE;
  DROP TABLE "shared_pages_ahead" CASCADE;
  DROP TABLE "shared_pages_ahead_locales" CASCADE;
  DROP TABLE "__shared_pages_v_cf_v_buttons" CASCADE;
  DROP TABLE "__shared_pages_v_cf_v_buttons_locales" CASCADE;
  DROP TABLE "____shared_pages_v_cf_v_c_v_p_v" CASCADE;
  DROP TABLE "___shared_pages_v_cf_v_c_v" CASCADE;
  DROP TABLE "___shared_pages_v_cf_v_c_v_locales" CASCADE;
  DROP TABLE "__shared_pages_v_cf_v" CASCADE;
  DROP TABLE "__shared_pages_v_cf_v_locales" CASCADE;
  DROP TABLE "__shared_pages_v_cgal_v_items" CASCADE;
  DROP TABLE "__shared_pages_v_cgal_v_items_locales" CASCADE;
  DROP TABLE "__shared_pages_v_cgal_v" CASCADE;
  DROP TABLE "__shared_pages_v_cgal_v_locales" CASCADE;
  DROP TABLE "__shared_pages_v_awd_v_items" CASCADE;
  DROP TABLE "__shared_pages_v_awd_v_items_locales" CASCADE;
  DROP TABLE "__shared_pages_v_awd_v" CASCADE;
  DROP TABLE "__shared_pages_v_awd_v_locales" CASCADE;
  DROP TABLE "__shared_pages_v_icar_v_items" CASCADE;
  DROP TABLE "__shared_pages_v_icar_v_items_locales" CASCADE;
  DROP TABLE "__shared_pages_v_icar_v" CASCADE;
  DROP TABLE "__shared_pages_v_icar_v_locales" CASCADE;
  DROP TABLE "__shared_pages_v_testi_v_logos" CASCADE;
  DROP TABLE "__shared_pages_v_testi_v_items" CASCADE;
  DROP TABLE "__shared_pages_v_testi_v_items_locales" CASCADE;
  DROP TABLE "__shared_pages_v_testi_v" CASCADE;
  DROP TABLE "__shared_pages_v_testi_v_locales" CASCADE;
  DROP TABLE "__shared_pages_v_hot_v_hotspots" CASCADE;
  DROP TABLE "__shared_pages_v_hot_v_hotspots_locales" CASCADE;
  DROP TABLE "__shared_pages_v_hot_v" CASCADE;
  DROP TABLE "__shared_pages_v_hot_v_locales" CASCADE;
  DROP TABLE "__shared_pages_v_cta_v_buttons" CASCADE;
  DROP TABLE "__shared_pages_v_cta_v_buttons_locales" CASCADE;
  DROP TABLE "__shared_pages_v_cta_v" CASCADE;
  DROP TABLE "__shared_pages_v_cta_v_locales" CASCADE;
  DROP TABLE "__shared_pages_v_rich_v" CASCADE;
  DROP TABLE "__shared_pages_v_rich_v_locales" CASCADE;
  DROP TABLE "__shared_pages_v_ahead_v" CASCADE;
  DROP TABLE "__shared_pages_v_ahead_v_locales" CASCADE;
  DROP TABLE "detail_templates_cf_buttons" CASCADE;
  DROP TABLE "detail_templates_cf_buttons_locales" CASCADE;
  DROP TABLE "detail_templates_cf_c_p" CASCADE;
  DROP TABLE "detail_templates_cf_c" CASCADE;
  DROP TABLE "detail_templates_cf_c_locales" CASCADE;
  DROP TABLE "detail_templates_cf" CASCADE;
  DROP TABLE "detail_templates_cf_locales" CASCADE;
  DROP TABLE "detail_templates_cgal_items" CASCADE;
  DROP TABLE "detail_templates_cgal_items_locales" CASCADE;
  DROP TABLE "detail_templates_cgal" CASCADE;
  DROP TABLE "detail_templates_cgal_locales" CASCADE;
  DROP TABLE "detail_templates_awd_items" CASCADE;
  DROP TABLE "detail_templates_awd_items_locales" CASCADE;
  DROP TABLE "detail_templates_awd" CASCADE;
  DROP TABLE "detail_templates_awd_locales" CASCADE;
  DROP TABLE "detail_templates_icar_items" CASCADE;
  DROP TABLE "detail_templates_icar_items_locales" CASCADE;
  DROP TABLE "detail_templates_icar" CASCADE;
  DROP TABLE "detail_templates_icar_locales" CASCADE;
  DROP TABLE "detail_templates_testi_logos" CASCADE;
  DROP TABLE "detail_templates_testi_items" CASCADE;
  DROP TABLE "detail_templates_testi_items_locales" CASCADE;
  DROP TABLE "detail_templates_testi" CASCADE;
  DROP TABLE "detail_templates_testi_locales" CASCADE;
  DROP TABLE "detail_templates_hot_hotspots" CASCADE;
  DROP TABLE "detail_templates_hot_hotspots_locales" CASCADE;
  DROP TABLE "detail_templates_hot" CASCADE;
  DROP TABLE "detail_templates_hot_locales" CASCADE;
  DROP TABLE "detail_templates_cta_buttons" CASCADE;
  DROP TABLE "detail_templates_cta_buttons_locales" CASCADE;
  DROP TABLE "detail_templates_cta" CASCADE;
  DROP TABLE "detail_templates_cta_locales" CASCADE;
  DROP TABLE "detail_templates_rich" CASCADE;
  DROP TABLE "detail_templates_rich_locales" CASCADE;
  DROP TABLE "detail_templates_ahead" CASCADE;
  DROP TABLE "detail_templates_ahead_locales" CASCADE;
  DROP TABLE "__detail_templates_v_cf_v_buttons" CASCADE;
  DROP TABLE "__detail_templates_v_cf_v_buttons_locales" CASCADE;
  DROP TABLE "____detail_templates_v_cf_v_c_v_p_v" CASCADE;
  DROP TABLE "___detail_templates_v_cf_v_c_v" CASCADE;
  DROP TABLE "___detail_templates_v_cf_v_c_v_locales" CASCADE;
  DROP TABLE "__detail_templates_v_cf_v" CASCADE;
  DROP TABLE "__detail_templates_v_cf_v_locales" CASCADE;
  DROP TABLE "__detail_templates_v_cgal_v_items" CASCADE;
  DROP TABLE "__detail_templates_v_cgal_v_items_locales" CASCADE;
  DROP TABLE "__detail_templates_v_cgal_v" CASCADE;
  DROP TABLE "__detail_templates_v_cgal_v_locales" CASCADE;
  DROP TABLE "__detail_templates_v_awd_v_items" CASCADE;
  DROP TABLE "__detail_templates_v_awd_v_items_locales" CASCADE;
  DROP TABLE "__detail_templates_v_awd_v" CASCADE;
  DROP TABLE "__detail_templates_v_awd_v_locales" CASCADE;
  DROP TABLE "__detail_templates_v_icar_v_items" CASCADE;
  DROP TABLE "__detail_templates_v_icar_v_items_locales" CASCADE;
  DROP TABLE "__detail_templates_v_icar_v" CASCADE;
  DROP TABLE "__detail_templates_v_icar_v_locales" CASCADE;
  DROP TABLE "__detail_templates_v_testi_v_logos" CASCADE;
  DROP TABLE "__detail_templates_v_testi_v_items" CASCADE;
  DROP TABLE "__detail_templates_v_testi_v_items_locales" CASCADE;
  DROP TABLE "__detail_templates_v_testi_v" CASCADE;
  DROP TABLE "__detail_templates_v_testi_v_locales" CASCADE;
  DROP TABLE "__detail_templates_v_hot_v_hotspots" CASCADE;
  DROP TABLE "__detail_templates_v_hot_v_hotspots_locales" CASCADE;
  DROP TABLE "__detail_templates_v_hot_v" CASCADE;
  DROP TABLE "__detail_templates_v_hot_v_locales" CASCADE;
  DROP TABLE "__detail_templates_v_cta_v_buttons" CASCADE;
  DROP TABLE "__detail_templates_v_cta_v_buttons_locales" CASCADE;
  DROP TABLE "__detail_templates_v_cta_v" CASCADE;
  DROP TABLE "__detail_templates_v_cta_v_locales" CASCADE;
  DROP TABLE "__detail_templates_v_rich_v" CASCADE;
  DROP TABLE "__detail_templates_v_rich_v_locales" CASCADE;
  DROP TABLE "__detail_templates_v_ahead_v" CASCADE;
  DROP TABLE "__detail_templates_v_ahead_v_locales" CASCADE;
  DROP TABLE "shared_detail_templates_cf_buttons" CASCADE;
  DROP TABLE "shared_detail_templates_cf_buttons_locales" CASCADE;
  DROP TABLE "shared_detail_templates_cf_c_p" CASCADE;
  DROP TABLE "shared_detail_templates_cf_c" CASCADE;
  DROP TABLE "shared_detail_templates_cf_c_locales" CASCADE;
  DROP TABLE "shared_detail_templates_cf" CASCADE;
  DROP TABLE "shared_detail_templates_cf_locales" CASCADE;
  DROP TABLE "shared_detail_templates_cgal_items" CASCADE;
  DROP TABLE "shared_detail_templates_cgal_items_locales" CASCADE;
  DROP TABLE "shared_detail_templates_cgal" CASCADE;
  DROP TABLE "shared_detail_templates_cgal_locales" CASCADE;
  DROP TABLE "shared_detail_templates_awd_items" CASCADE;
  DROP TABLE "shared_detail_templates_awd_items_locales" CASCADE;
  DROP TABLE "shared_detail_templates_awd" CASCADE;
  DROP TABLE "shared_detail_templates_awd_locales" CASCADE;
  DROP TABLE "shared_detail_templates_icar_items" CASCADE;
  DROP TABLE "shared_detail_templates_icar_items_locales" CASCADE;
  DROP TABLE "shared_detail_templates_icar" CASCADE;
  DROP TABLE "shared_detail_templates_icar_locales" CASCADE;
  DROP TABLE "shared_detail_templates_testi_logos" CASCADE;
  DROP TABLE "shared_detail_templates_testi_items" CASCADE;
  DROP TABLE "shared_detail_templates_testi_items_locales" CASCADE;
  DROP TABLE "shared_detail_templates_testi" CASCADE;
  DROP TABLE "shared_detail_templates_testi_locales" CASCADE;
  DROP TABLE "shared_detail_templates_hot_hotspots" CASCADE;
  DROP TABLE "shared_detail_templates_hot_hotspots_locales" CASCADE;
  DROP TABLE "shared_detail_templates_hot" CASCADE;
  DROP TABLE "shared_detail_templates_hot_locales" CASCADE;
  DROP TABLE "shared_detail_templates_cta_buttons" CASCADE;
  DROP TABLE "shared_detail_templates_cta_buttons_locales" CASCADE;
  DROP TABLE "shared_detail_templates_cta" CASCADE;
  DROP TABLE "shared_detail_templates_cta_locales" CASCADE;
  DROP TABLE "shared_detail_templates_rich" CASCADE;
  DROP TABLE "shared_detail_templates_rich_locales" CASCADE;
  DROP TABLE "shared_detail_templates_ahead" CASCADE;
  DROP TABLE "shared_detail_templates_ahead_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_cf_v_buttons" CASCADE;
  DROP TABLE "__shared_detail_templates_v_cf_v_buttons_locales" CASCADE;
  DROP TABLE "____shared_detail_templates_v_cf_v_c_v_p_v" CASCADE;
  DROP TABLE "___shared_detail_templates_v_cf_v_c_v" CASCADE;
  DROP TABLE "___shared_detail_templates_v_cf_v_c_v_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_cf_v" CASCADE;
  DROP TABLE "__shared_detail_templates_v_cf_v_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_cgal_v_items" CASCADE;
  DROP TABLE "__shared_detail_templates_v_cgal_v_items_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_cgal_v" CASCADE;
  DROP TABLE "__shared_detail_templates_v_cgal_v_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_awd_v_items" CASCADE;
  DROP TABLE "__shared_detail_templates_v_awd_v_items_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_awd_v" CASCADE;
  DROP TABLE "__shared_detail_templates_v_awd_v_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_icar_v_items" CASCADE;
  DROP TABLE "__shared_detail_templates_v_icar_v_items_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_icar_v" CASCADE;
  DROP TABLE "__shared_detail_templates_v_icar_v_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_testi_v_logos" CASCADE;
  DROP TABLE "__shared_detail_templates_v_testi_v_items" CASCADE;
  DROP TABLE "__shared_detail_templates_v_testi_v_items_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_testi_v" CASCADE;
  DROP TABLE "__shared_detail_templates_v_testi_v_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_hot_v_hotspots" CASCADE;
  DROP TABLE "__shared_detail_templates_v_hot_v_hotspots_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_hot_v" CASCADE;
  DROP TABLE "__shared_detail_templates_v_hot_v_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_cta_v_buttons" CASCADE;
  DROP TABLE "__shared_detail_templates_v_cta_v_buttons_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_cta_v" CASCADE;
  DROP TABLE "__shared_detail_templates_v_cta_v_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_rich_v" CASCADE;
  DROP TABLE "__shared_detail_templates_v_rich_v_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_ahead_v" CASCADE;
  DROP TABLE "__shared_detail_templates_v_ahead_v_locales" CASCADE;
  DROP TYPE "public"."enum_pages_cf_buttons_link_type";
  DROP TYPE "public"."enum_pages_cf_buttons_style";
  DROP TYPE "public"."enum_pages_cf_heading_align";
  DROP TYPE "public"."enum_pages_cf_variant";
  DROP TYPE "public"."enum_pages_cf_layout";
  DROP TYPE "public"."enum_pages_cf_appearance_background";
  DROP TYPE "public"."enum_pages_cgal_heading_align";
  DROP TYPE "public"."enum_pages_awd_heading_align";
  DROP TYPE "public"."enum_pages_icar_items_link_type";
  DROP TYPE "public"."enum_pages_icar_heading_align";
  DROP TYPE "public"."enum_pages_testi_heading_align";
  DROP TYPE "public"."enum_pages_hot_hotspots_tone";
  DROP TYPE "public"."enum_pages_hot_heading_align";
  DROP TYPE "public"."enum_pages_cta_buttons_link_type";
  DROP TYPE "public"."enum_pages_cta_buttons_style";
  DROP TYPE "public"."enum_pages_rich_heading_align";
  DROP TYPE "public"."enum_pages_ahead_heading_align";
  DROP TYPE "public"."enum___pages_v_cf_v_buttons_link_type";
  DROP TYPE "public"."enum___pages_v_cf_v_buttons_style";
  DROP TYPE "public"."enum___pages_v_cf_v_heading_align";
  DROP TYPE "public"."enum___pages_v_cf_v_variant";
  DROP TYPE "public"."enum___pages_v_cf_v_layout";
  DROP TYPE "public"."enum___pages_v_cf_v_appearance_background";
  DROP TYPE "public"."enum___pages_v_cgal_v_heading_align";
  DROP TYPE "public"."enum___pages_v_awd_v_heading_align";
  DROP TYPE "public"."enum___pages_v_icar_v_items_link_type";
  DROP TYPE "public"."enum___pages_v_icar_v_heading_align";
  DROP TYPE "public"."enum___pages_v_testi_v_heading_align";
  DROP TYPE "public"."enum___pages_v_hot_v_hotspots_tone";
  DROP TYPE "public"."enum___pages_v_hot_v_heading_align";
  DROP TYPE "public"."enum___pages_v_cta_v_buttons_link_type";
  DROP TYPE "public"."enum___pages_v_cta_v_buttons_style";
  DROP TYPE "public"."enum___pages_v_rich_v_heading_align";
  DROP TYPE "public"."enum___pages_v_ahead_v_heading_align";
  DROP TYPE "public"."enum_shared_pages_cf_buttons_link_type";
  DROP TYPE "public"."enum_shared_pages_cf_buttons_style";
  DROP TYPE "public"."enum_shared_pages_cf_heading_align";
  DROP TYPE "public"."enum_shared_pages_cf_variant";
  DROP TYPE "public"."enum_shared_pages_cf_layout";
  DROP TYPE "public"."enum_shared_pages_cf_appearance_background";
  DROP TYPE "public"."enum_shared_pages_cgal_heading_align";
  DROP TYPE "public"."enum_shared_pages_awd_heading_align";
  DROP TYPE "public"."enum_shared_pages_icar_items_link_type";
  DROP TYPE "public"."enum_shared_pages_icar_heading_align";
  DROP TYPE "public"."enum_shared_pages_testi_heading_align";
  DROP TYPE "public"."enum_shared_pages_hot_hotspots_tone";
  DROP TYPE "public"."enum_shared_pages_hot_heading_align";
  DROP TYPE "public"."enum_shared_pages_cta_buttons_link_type";
  DROP TYPE "public"."enum_shared_pages_cta_buttons_style";
  DROP TYPE "public"."enum_shared_pages_rich_heading_align";
  DROP TYPE "public"."enum_shared_pages_ahead_heading_align";
  DROP TYPE "public"."enum___shared_pages_v_cf_v_buttons_link_type";
  DROP TYPE "public"."enum___shared_pages_v_cf_v_buttons_style";
  DROP TYPE "public"."enum___shared_pages_v_cf_v_heading_align";
  DROP TYPE "public"."enum___shared_pages_v_cf_v_variant";
  DROP TYPE "public"."enum___shared_pages_v_cf_v_layout";
  DROP TYPE "public"."enum___shared_pages_v_cf_v_appearance_background";
  DROP TYPE "public"."enum___shared_pages_v_cgal_v_heading_align";
  DROP TYPE "public"."enum___shared_pages_v_awd_v_heading_align";
  DROP TYPE "public"."enum___shared_pages_v_icar_v_items_link_type";
  DROP TYPE "public"."enum___shared_pages_v_icar_v_heading_align";
  DROP TYPE "public"."enum___shared_pages_v_testi_v_heading_align";
  DROP TYPE "public"."enum___shared_pages_v_hot_v_hotspots_tone";
  DROP TYPE "public"."enum___shared_pages_v_hot_v_heading_align";
  DROP TYPE "public"."enum___shared_pages_v_cta_v_buttons_link_type";
  DROP TYPE "public"."enum___shared_pages_v_cta_v_buttons_style";
  DROP TYPE "public"."enum___shared_pages_v_rich_v_heading_align";
  DROP TYPE "public"."enum___shared_pages_v_ahead_v_heading_align";
  DROP TYPE "public"."enum_detail_templates_cf_buttons_link_type";
  DROP TYPE "public"."enum_detail_templates_cf_buttons_style";
  DROP TYPE "public"."enum_detail_templates_cf_heading_align";
  DROP TYPE "public"."enum_detail_templates_cf_variant";
  DROP TYPE "public"."enum_detail_templates_cf_layout";
  DROP TYPE "public"."enum_detail_templates_cf_appearance_background";
  DROP TYPE "public"."enum_detail_templates_cgal_heading_align";
  DROP TYPE "public"."enum_detail_templates_awd_heading_align";
  DROP TYPE "public"."enum_detail_templates_icar_items_link_type";
  DROP TYPE "public"."enum_detail_templates_icar_heading_align";
  DROP TYPE "public"."enum_detail_templates_testi_heading_align";
  DROP TYPE "public"."enum_detail_templates_hot_hotspots_tone";
  DROP TYPE "public"."enum_detail_templates_hot_heading_align";
  DROP TYPE "public"."enum_detail_templates_cta_buttons_link_type";
  DROP TYPE "public"."enum_detail_templates_cta_buttons_style";
  DROP TYPE "public"."enum_detail_templates_rich_heading_align";
  DROP TYPE "public"."enum_detail_templates_ahead_heading_align";
  DROP TYPE "public"."enum___detail_templates_v_cf_v_buttons_link_type";
  DROP TYPE "public"."enum___detail_templates_v_cf_v_buttons_style";
  DROP TYPE "public"."enum___detail_templates_v_cf_v_heading_align";
  DROP TYPE "public"."enum___detail_templates_v_cf_v_variant";
  DROP TYPE "public"."enum___detail_templates_v_cf_v_layout";
  DROP TYPE "public"."enum___detail_templates_v_cf_v_appearance_background";
  DROP TYPE "public"."enum___detail_templates_v_cgal_v_heading_align";
  DROP TYPE "public"."enum___detail_templates_v_awd_v_heading_align";
  DROP TYPE "public"."enum___detail_templates_v_icar_v_items_link_type";
  DROP TYPE "public"."enum___detail_templates_v_icar_v_heading_align";
  DROP TYPE "public"."enum___detail_templates_v_testi_v_heading_align";
  DROP TYPE "public"."enum___detail_templates_v_hot_v_hotspots_tone";
  DROP TYPE "public"."enum___detail_templates_v_hot_v_heading_align";
  DROP TYPE "public"."enum___detail_templates_v_cta_v_buttons_link_type";
  DROP TYPE "public"."enum___detail_templates_v_cta_v_buttons_style";
  DROP TYPE "public"."enum___detail_templates_v_rich_v_heading_align";
  DROP TYPE "public"."enum___detail_templates_v_ahead_v_heading_align";
  DROP TYPE "public"."enum_shared_detail_templates_cf_buttons_link_type";
  DROP TYPE "public"."enum_shared_detail_templates_cf_buttons_style";
  DROP TYPE "public"."enum_shared_detail_templates_cf_heading_align";
  DROP TYPE "public"."enum_shared_detail_templates_cf_variant";
  DROP TYPE "public"."enum_shared_detail_templates_cf_layout";
  DROP TYPE "public"."enum_shared_detail_templates_cf_appearance_background";
  DROP TYPE "public"."enum_shared_detail_templates_cgal_heading_align";
  DROP TYPE "public"."enum_shared_detail_templates_awd_heading_align";
  DROP TYPE "public"."enum_shared_detail_templates_icar_items_link_type";
  DROP TYPE "public"."enum_shared_detail_templates_icar_heading_align";
  DROP TYPE "public"."enum_shared_detail_templates_testi_heading_align";
  DROP TYPE "public"."enum_shared_detail_templates_hot_hotspots_tone";
  DROP TYPE "public"."enum_shared_detail_templates_hot_heading_align";
  DROP TYPE "public"."enum_shared_detail_templates_cta_buttons_link_type";
  DROP TYPE "public"."enum_shared_detail_templates_cta_buttons_style";
  DROP TYPE "public"."enum_shared_detail_templates_rich_heading_align";
  DROP TYPE "public"."enum_shared_detail_templates_ahead_heading_align";
  DROP TYPE "public"."enum___shared_detail_templates_v_cf_v_buttons_link_type";
  DROP TYPE "public"."enum___shared_detail_templates_v_cf_v_buttons_style";
  DROP TYPE "public"."enum___shared_detail_templates_v_cf_v_heading_align";
  DROP TYPE "public"."enum___shared_detail_templates_v_cf_v_variant";
  DROP TYPE "public"."enum___shared_detail_templates_v_cf_v_layout";
  DROP TYPE "public"."enum___shared_detail_templates_v_cf_v_appearance_background";
  DROP TYPE "public"."enum___shared_detail_templates_v_cgal_v_heading_align";
  DROP TYPE "public"."enum___shared_detail_templates_v_awd_v_heading_align";
  DROP TYPE "public"."enum___shared_detail_templates_v_icar_v_items_link_type";
  DROP TYPE "public"."enum___shared_detail_templates_v_icar_v_heading_align";
  DROP TYPE "public"."enum___shared_detail_templates_v_testi_v_heading_align";
  DROP TYPE "public"."enum___shared_detail_templates_v_hot_v_hotspots_tone";
  DROP TYPE "public"."enum___shared_detail_templates_v_hot_v_heading_align";
  DROP TYPE "public"."enum___shared_detail_templates_v_cta_v_buttons_link_type";
  DROP TYPE "public"."enum___shared_detail_templates_v_cta_v_buttons_style";
  DROP TYPE "public"."enum___shared_detail_templates_v_rich_v_heading_align";
  DROP TYPE "public"."enum___shared_detail_templates_v_ahead_v_heading_align";`)
}
