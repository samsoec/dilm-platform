import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_hero_slides_btn_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_pages_hero_slides_btn_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_pages_phero_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_pages_media_buttons_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_pages_media_buttons_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_pages_media_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_pages_media_image_layout" AS ENUM('single', 'staggered');
  CREATE TYPE "public"."enum_pages_media_image_position" AS ENUM('right', 'left');
  CREATE TYPE "public"."enum_pages_media_points_layout" AS ENUM('inline', 'grid');
  CREATE TYPE "public"."enum_pages_media_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum_pages_grid_head_btn_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_pages_grid_head_btn_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_pages_grid_foot_btn_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_pages_grid_foot_btn_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_pages_grid_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_pages_grid_marker_style" AS ENUM('icon', 'number', 'letter', 'none');
  CREATE TYPE "public"."enum_pages_grid_card_style" AS ENUM('card', 'plain');
  CREATE TYPE "public"."enum_pages_grid_columns" AS ENUM('3', '4');
  CREATE TYPE "public"."enum_pages_grid_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum_pages_vm_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_pages_tl_buttons_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_pages_tl_buttons_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_pages_tl_variant" AS ENUM('summary', 'detailed');
  CREATE TYPE "public"."enum_pages_tl_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum____pages_v_hero_v_slides_btn_v_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum____pages_v_hero_v_slides_btn_v_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___pages_v_phero_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___pages_v_media_v_buttons_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___pages_v_media_v_buttons_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___pages_v_media_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___pages_v_media_v_image_layout" AS ENUM('single', 'staggered');
  CREATE TYPE "public"."enum___pages_v_media_v_image_position" AS ENUM('right', 'left');
  CREATE TYPE "public"."enum___pages_v_media_v_points_layout" AS ENUM('inline', 'grid');
  CREATE TYPE "public"."enum___pages_v_media_v_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum____pages_v_grid_v_head_btn_v_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum____pages_v_grid_v_head_btn_v_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum____pages_v_grid_v_foot_btn_v_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum____pages_v_grid_v_foot_btn_v_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___pages_v_grid_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___pages_v_grid_v_marker_style" AS ENUM('icon', 'number', 'letter', 'none');
  CREATE TYPE "public"."enum___pages_v_grid_v_card_style" AS ENUM('card', 'plain');
  CREATE TYPE "public"."enum___pages_v_grid_v_columns" AS ENUM('3', '4');
  CREATE TYPE "public"."enum___pages_v_grid_v_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum___pages_v_vm_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___pages_v_tl_v_buttons_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___pages_v_tl_v_buttons_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___pages_v_tl_v_variant" AS ENUM('summary', 'detailed');
  CREATE TYPE "public"."enum___pages_v_tl_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_pages_hero_slides_btn_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_pages_hero_slides_btn_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_shared_pages_phero_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_pages_media_buttons_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_pages_media_buttons_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_shared_pages_media_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_pages_media_image_layout" AS ENUM('single', 'staggered');
  CREATE TYPE "public"."enum_shared_pages_media_image_position" AS ENUM('right', 'left');
  CREATE TYPE "public"."enum_shared_pages_media_points_layout" AS ENUM('inline', 'grid');
  CREATE TYPE "public"."enum_shared_pages_media_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum_shared_pages_grid_head_btn_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_pages_grid_head_btn_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_shared_pages_grid_foot_btn_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_pages_grid_foot_btn_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_shared_pages_grid_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_pages_grid_marker_style" AS ENUM('icon', 'number', 'letter', 'none');
  CREATE TYPE "public"."enum_shared_pages_grid_card_style" AS ENUM('card', 'plain');
  CREATE TYPE "public"."enum_shared_pages_grid_columns" AS ENUM('3', '4');
  CREATE TYPE "public"."enum_shared_pages_grid_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum_shared_pages_vm_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_pages_tl_buttons_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_pages_tl_buttons_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_shared_pages_tl_variant" AS ENUM('summary', 'detailed');
  CREATE TYPE "public"."enum_shared_pages_tl_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum____shared_pages_v_hero_v_slides_btn_v_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum____shared_pages_v_hero_v_slides_btn_v_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___shared_pages_v_phero_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___shared_pages_v_media_v_buttons_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___shared_pages_v_media_v_buttons_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___shared_pages_v_media_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___shared_pages_v_media_v_image_layout" AS ENUM('single', 'staggered');
  CREATE TYPE "public"."enum___shared_pages_v_media_v_image_position" AS ENUM('right', 'left');
  CREATE TYPE "public"."enum___shared_pages_v_media_v_points_layout" AS ENUM('inline', 'grid');
  CREATE TYPE "public"."enum___shared_pages_v_media_v_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum____shared_pages_v_grid_v_head_btn_v_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum____shared_pages_v_grid_v_head_btn_v_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum____shared_pages_v_grid_v_foot_btn_v_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum____shared_pages_v_grid_v_foot_btn_v_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___shared_pages_v_grid_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___shared_pages_v_grid_v_marker_style" AS ENUM('icon', 'number', 'letter', 'none');
  CREATE TYPE "public"."enum___shared_pages_v_grid_v_card_style" AS ENUM('card', 'plain');
  CREATE TYPE "public"."enum___shared_pages_v_grid_v_columns" AS ENUM('3', '4');
  CREATE TYPE "public"."enum___shared_pages_v_grid_v_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum___shared_pages_v_vm_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___shared_pages_v_tl_v_buttons_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___shared_pages_v_tl_v_buttons_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___shared_pages_v_tl_v_variant" AS ENUM('summary', 'detailed');
  CREATE TYPE "public"."enum___shared_pages_v_tl_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_detail_templates_hero_slides_btn_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_detail_templates_hero_slides_btn_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_detail_templates_phero_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_detail_templates_media_buttons_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_detail_templates_media_buttons_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_detail_templates_media_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_detail_templates_media_image_layout" AS ENUM('single', 'staggered');
  CREATE TYPE "public"."enum_detail_templates_media_image_position" AS ENUM('right', 'left');
  CREATE TYPE "public"."enum_detail_templates_media_points_layout" AS ENUM('inline', 'grid');
  CREATE TYPE "public"."enum_detail_templates_media_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum_detail_templates_grid_head_btn_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_detail_templates_grid_head_btn_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_detail_templates_grid_foot_btn_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_detail_templates_grid_foot_btn_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_detail_templates_grid_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_detail_templates_grid_marker_style" AS ENUM('icon', 'number', 'letter', 'none');
  CREATE TYPE "public"."enum_detail_templates_grid_card_style" AS ENUM('card', 'plain');
  CREATE TYPE "public"."enum_detail_templates_grid_columns" AS ENUM('3', '4');
  CREATE TYPE "public"."enum_detail_templates_grid_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum_detail_templates_vm_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_detail_templates_tl_buttons_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_detail_templates_tl_buttons_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_detail_templates_tl_variant" AS ENUM('summary', 'detailed');
  CREATE TYPE "public"."enum_detail_templates_tl_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum____detail_templates_v_hero_v_slides_btn_v_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum____detail_templates_v_hero_v_slides_btn_v_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___detail_templates_v_phero_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___detail_templates_v_media_v_buttons_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___detail_templates_v_media_v_buttons_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___detail_templates_v_media_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___detail_templates_v_media_v_image_layout" AS ENUM('single', 'staggered');
  CREATE TYPE "public"."enum___detail_templates_v_media_v_image_position" AS ENUM('right', 'left');
  CREATE TYPE "public"."enum___detail_templates_v_media_v_points_layout" AS ENUM('inline', 'grid');
  CREATE TYPE "public"."enum___detail_templates_v_media_v_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum____detail_templates_v_grid_v_head_btn_v_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum____detail_templates_v_grid_v_head_btn_v_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum____detail_templates_v_grid_v_foot_btn_v_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum____detail_templates_v_grid_v_foot_btn_v_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___detail_templates_v_grid_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___detail_templates_v_grid_v_marker_style" AS ENUM('icon', 'number', 'letter', 'none');
  CREATE TYPE "public"."enum___detail_templates_v_grid_v_card_style" AS ENUM('card', 'plain');
  CREATE TYPE "public"."enum___detail_templates_v_grid_v_columns" AS ENUM('3', '4');
  CREATE TYPE "public"."enum___detail_templates_v_grid_v_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum___detail_templates_v_vm_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___detail_templates_v_tl_v_buttons_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___detail_templates_v_tl_v_buttons_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___detail_templates_v_tl_v_variant" AS ENUM('summary', 'detailed');
  CREATE TYPE "public"."enum___detail_templates_v_tl_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_detail_templates_hero_slides_btn_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_detail_templates_hero_slides_btn_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_shared_detail_templates_phero_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_detail_templates_media_buttons_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_detail_templates_media_buttons_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_shared_detail_templates_media_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_detail_templates_media_image_layout" AS ENUM('single', 'staggered');
  CREATE TYPE "public"."enum_shared_detail_templates_media_image_position" AS ENUM('right', 'left');
  CREATE TYPE "public"."enum_shared_detail_templates_media_points_layout" AS ENUM('inline', 'grid');
  CREATE TYPE "public"."enum_shared_detail_templates_media_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum_shared_detail_templates_grid_head_btn_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_detail_templates_grid_head_btn_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_shared_detail_templates_grid_foot_btn_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_detail_templates_grid_foot_btn_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_shared_detail_templates_grid_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_detail_templates_grid_marker_style" AS ENUM('icon', 'number', 'letter', 'none');
  CREATE TYPE "public"."enum_shared_detail_templates_grid_card_style" AS ENUM('card', 'plain');
  CREATE TYPE "public"."enum_shared_detail_templates_grid_columns" AS ENUM('3', '4');
  CREATE TYPE "public"."enum_shared_detail_templates_grid_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum_shared_detail_templates_vm_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_detail_templates_tl_buttons_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_detail_templates_tl_buttons_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_shared_detail_templates_tl_variant" AS ENUM('summary', 'detailed');
  CREATE TYPE "public"."enum_shared_detail_templates_tl_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum____shared_detail_templates_v_hero_v_slides_btn_v_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum____shared_detail_templates_v_hero_v_slides_btn_v_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___shared_detail_templates_v_phero_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___shared_detail_templates_v_media_v_buttons_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___shared_detail_templates_v_media_v_buttons_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___shared_detail_templates_v_media_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___shared_detail_templates_v_media_v_image_layout" AS ENUM('single', 'staggered');
  CREATE TYPE "public"."enum___shared_detail_templates_v_media_v_image_position" AS ENUM('right', 'left');
  CREATE TYPE "public"."enum___shared_detail_templates_v_media_v_points_layout" AS ENUM('inline', 'grid');
  CREATE TYPE "public"."enum___shared_detail_templates_v_media_v_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum____shared_detail_templates_v_grid_v_head_btn_v_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum____shared_detail_templates_v_grid_v_head_btn_v_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum____shared_detail_templates_v_grid_v_foot_btn_v_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum____shared_detail_templates_v_grid_v_foot_btn_v_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___shared_detail_templates_v_grid_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___shared_detail_templates_v_grid_v_marker_style" AS ENUM('icon', 'number', 'letter', 'none');
  CREATE TYPE "public"."enum___shared_detail_templates_v_grid_v_card_style" AS ENUM('card', 'plain');
  CREATE TYPE "public"."enum___shared_detail_templates_v_grid_v_columns" AS ENUM('3', '4');
  CREATE TYPE "public"."enum___shared_detail_templates_v_grid_v_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum___shared_detail_templates_v_vm_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___shared_detail_templates_v_tl_v_buttons_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___shared_detail_templates_v_tl_v_buttons_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___shared_detail_templates_v_tl_v_variant" AS ENUM('summary', 'detailed');
  CREATE TYPE "public"."enum___shared_detail_templates_v_tl_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TABLE "pages_hero_slides_btn" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_hero_slides_btn_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_pages_hero_slides_btn_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "pages_hero_slides_btn_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_hero_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"background_image_id" integer
  );
  
  CREATE TABLE "pages_hero_slides_locales" (
  	"eyebrow" varchar,
  	"title" jsonb,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_hero_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "pages_hero_stats_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"autoplay_seconds" numeric DEFAULT 6,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_phero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"background_image_id" integer,
  	"heading_align" "enum_pages_phero_heading_align" DEFAULT 'center',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_phero_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_media_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_media_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "pages_media_stats_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_media_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer
  );
  
  CREATE TABLE "pages_media_points_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_media_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_media_buttons_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_pages_media_buttons_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "pages_media_buttons_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_pages_media_heading_align" DEFAULT 'left',
  	"image_layout" "enum_pages_media_image_layout" DEFAULT 'single',
  	"image_position" "enum_pages_media_image_position" DEFAULT 'right',
  	"points_layout" "enum_pages_media_points_layout" DEFAULT 'inline',
  	"appearance_background" "enum_pages_media_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_media_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_grid_head_btn" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_grid_head_btn_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_pages_grid_head_btn_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "pages_grid_head_btn_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer
  );
  
  CREATE TABLE "pages_grid_items_locales" (
  	"marker" varchar,
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_grid_foot_btn" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_grid_foot_btn_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_pages_grid_foot_btn_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "pages_grid_foot_btn_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_pages_grid_heading_align" DEFAULT 'center',
  	"top_image_id" integer,
  	"marker_style" "enum_pages_grid_marker_style" DEFAULT 'icon',
  	"card_style" "enum_pages_grid_card_style" DEFAULT 'card',
  	"columns" "enum_pages_grid_columns" DEFAULT '3',
  	"bottom_image_id" integer,
  	"appearance_background" "enum_pages_grid_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_grid_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"quote" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_vm_mission_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_vm_mission_items_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_vm" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_pages_vm_heading_align" DEFAULT 'center',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_vm_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"vision_title" varchar,
  	"vision_statement" jsonb,
  	"mission_title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_tl_entries_evt" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_tl_entries_evt_locales" (
  	"date_label" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_tl_entries" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" varchar
  );
  
  CREATE TABLE "pages_tl_entries_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_tl_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_tl_buttons_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_pages_tl_buttons_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "pages_tl_buttons_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_tl" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_tl_variant" DEFAULT 'summary',
  	"heading_align" "enum_pages_tl_heading_align" DEFAULT 'center',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_tl_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"banner_eyebrow" varchar,
  	"banner_title" varchar,
  	"banner_description" varchar,
  	"banner_period_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "___pages_v_hero_v_slides_btn_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum____pages_v_hero_v_slides_btn_v_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum____pages_v_hero_v_slides_btn_v_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "___pages_v_hero_v_slides_btn_v_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__pages_v_hero_v_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"background_image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__pages_v_hero_v_slides_locales" (
  	"eyebrow" varchar,
  	"title" jsonb,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__pages_v_hero_v_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__pages_v_hero_v_stats_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__pages_v_hero_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"autoplay_seconds" numeric DEFAULT 6,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__pages_v_phero_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"background_image_id" integer,
  	"heading_align" "enum___pages_v_phero_v_heading_align" DEFAULT 'center',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__pages_v_phero_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__pages_v_media_v_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__pages_v_media_v_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__pages_v_media_v_stats_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__pages_v_media_v_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__pages_v_media_v_points_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__pages_v_media_v_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum___pages_v_media_v_buttons_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum___pages_v_media_v_buttons_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "__pages_v_media_v_buttons_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__pages_v_media_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___pages_v_media_v_heading_align" DEFAULT 'left',
  	"image_layout" "enum___pages_v_media_v_image_layout" DEFAULT 'single',
  	"image_position" "enum___pages_v_media_v_image_position" DEFAULT 'right',
  	"points_layout" "enum___pages_v_media_v_points_layout" DEFAULT 'inline',
  	"appearance_background" "enum___pages_v_media_v_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__pages_v_media_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "___pages_v_grid_v_head_btn_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum____pages_v_grid_v_head_btn_v_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum____pages_v_grid_v_head_btn_v_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "___pages_v_grid_v_head_btn_v_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__pages_v_grid_v_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__pages_v_grid_v_items_locales" (
  	"marker" varchar,
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "___pages_v_grid_v_foot_btn_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum____pages_v_grid_v_foot_btn_v_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum____pages_v_grid_v_foot_btn_v_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "___pages_v_grid_v_foot_btn_v_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__pages_v_grid_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___pages_v_grid_v_heading_align" DEFAULT 'center',
  	"top_image_id" integer,
  	"marker_style" "enum___pages_v_grid_v_marker_style" DEFAULT 'icon',
  	"card_style" "enum___pages_v_grid_v_card_style" DEFAULT 'card',
  	"columns" "enum___pages_v_grid_v_columns" DEFAULT '3',
  	"bottom_image_id" integer,
  	"appearance_background" "enum___pages_v_grid_v_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__pages_v_grid_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"quote" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__pages_v_vm_v_mission_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__pages_v_vm_v_mission_items_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__pages_v_vm_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___pages_v_vm_v_heading_align" DEFAULT 'center',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__pages_v_vm_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"vision_title" varchar,
  	"vision_statement" jsonb,
  	"mission_title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "___pages_v_tl_v_entries_evt_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "___pages_v_tl_v_entries_evt_v_locales" (
  	"date_label" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__pages_v_tl_v_entries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"year" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__pages_v_tl_v_entries_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__pages_v_tl_v_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum___pages_v_tl_v_buttons_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum___pages_v_tl_v_buttons_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "__pages_v_tl_v_buttons_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__pages_v_tl_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum___pages_v_tl_v_variant" DEFAULT 'summary',
  	"heading_align" "enum___pages_v_tl_v_heading_align" DEFAULT 'center',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__pages_v_tl_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"banner_eyebrow" varchar,
  	"banner_title" varchar,
  	"banner_description" varchar,
  	"banner_period_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "shared_pages_hero_slides_btn" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_shared_pages_hero_slides_btn_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_shared_pages_hero_slides_btn_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "shared_pages_hero_slides_btn_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_hero_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"background_image_id" integer
  );
  
  CREATE TABLE "shared_pages_hero_slides_locales" (
  	"eyebrow" varchar,
  	"title" jsonb,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_hero_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "shared_pages_hero_stats_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"autoplay_seconds" numeric DEFAULT 6,
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_pages_phero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"background_image_id" integer,
  	"heading_align" "enum_shared_pages_phero_heading_align" DEFAULT 'center',
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_pages_phero_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_media_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "shared_pages_media_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "shared_pages_media_stats_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_media_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer
  );
  
  CREATE TABLE "shared_pages_media_points_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_media_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_shared_pages_media_buttons_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_shared_pages_media_buttons_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "shared_pages_media_buttons_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_pages_media_heading_align" DEFAULT 'left',
  	"image_layout" "enum_shared_pages_media_image_layout" DEFAULT 'single',
  	"image_position" "enum_shared_pages_media_image_position" DEFAULT 'right',
  	"points_layout" "enum_shared_pages_media_points_layout" DEFAULT 'inline',
  	"appearance_background" "enum_shared_pages_media_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_pages_media_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_grid_head_btn" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_shared_pages_grid_head_btn_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_shared_pages_grid_head_btn_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "shared_pages_grid_head_btn_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer
  );
  
  CREATE TABLE "shared_pages_grid_items_locales" (
  	"marker" varchar,
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_grid_foot_btn" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_shared_pages_grid_foot_btn_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_shared_pages_grid_foot_btn_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "shared_pages_grid_foot_btn_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_pages_grid_heading_align" DEFAULT 'center',
  	"top_image_id" integer,
  	"marker_style" "enum_shared_pages_grid_marker_style" DEFAULT 'icon',
  	"card_style" "enum_shared_pages_grid_card_style" DEFAULT 'card',
  	"columns" "enum_shared_pages_grid_columns" DEFAULT '3',
  	"bottom_image_id" integer,
  	"appearance_background" "enum_shared_pages_grid_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_pages_grid_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"quote" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_vm_mission_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "shared_pages_vm_mission_items_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_vm" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_pages_vm_heading_align" DEFAULT 'center',
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_pages_vm_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"vision_title" varchar,
  	"vision_statement" jsonb,
  	"mission_title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_tl_entries_evt" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "shared_pages_tl_entries_evt_locales" (
  	"date_label" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_tl_entries" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" varchar
  );
  
  CREATE TABLE "shared_pages_tl_entries_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_tl_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_shared_pages_tl_buttons_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_shared_pages_tl_buttons_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "shared_pages_tl_buttons_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_tl" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_shared_pages_tl_variant" DEFAULT 'summary',
  	"heading_align" "enum_shared_pages_tl_heading_align" DEFAULT 'center',
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_pages_tl_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"banner_eyebrow" varchar,
  	"banner_title" varchar,
  	"banner_description" varchar,
  	"banner_period_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "___shared_pages_v_hero_v_slides_btn_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum____shared_pages_v_hero_v_slides_btn_v_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum____shared_pages_v_hero_v_slides_btn_v_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "___shared_pages_v_hero_v_slides_btn_v_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_hero_v_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"background_image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__shared_pages_v_hero_v_slides_locales" (
  	"eyebrow" varchar,
  	"title" jsonb,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_hero_v_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__shared_pages_v_hero_v_stats_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_hero_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"autoplay_seconds" numeric DEFAULT 6,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_pages_v_phero_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"background_image_id" integer,
  	"heading_align" "enum___shared_pages_v_phero_v_heading_align" DEFAULT 'center',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_pages_v_phero_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_media_v_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__shared_pages_v_media_v_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__shared_pages_v_media_v_stats_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_media_v_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__shared_pages_v_media_v_points_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_media_v_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum___shared_pages_v_media_v_buttons_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum___shared_pages_v_media_v_buttons_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "__shared_pages_v_media_v_buttons_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_media_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_pages_v_media_v_heading_align" DEFAULT 'left',
  	"image_layout" "enum___shared_pages_v_media_v_image_layout" DEFAULT 'single',
  	"image_position" "enum___shared_pages_v_media_v_image_position" DEFAULT 'right',
  	"points_layout" "enum___shared_pages_v_media_v_points_layout" DEFAULT 'inline',
  	"appearance_background" "enum___shared_pages_v_media_v_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_pages_v_media_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "___shared_pages_v_grid_v_head_btn_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum____shared_pages_v_grid_v_head_btn_v_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum____shared_pages_v_grid_v_head_btn_v_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "___shared_pages_v_grid_v_head_btn_v_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_grid_v_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__shared_pages_v_grid_v_items_locales" (
  	"marker" varchar,
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "___shared_pages_v_grid_v_foot_btn_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum____shared_pages_v_grid_v_foot_btn_v_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum____shared_pages_v_grid_v_foot_btn_v_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "___shared_pages_v_grid_v_foot_btn_v_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_grid_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_pages_v_grid_v_heading_align" DEFAULT 'center',
  	"top_image_id" integer,
  	"marker_style" "enum___shared_pages_v_grid_v_marker_style" DEFAULT 'icon',
  	"card_style" "enum___shared_pages_v_grid_v_card_style" DEFAULT 'card',
  	"columns" "enum___shared_pages_v_grid_v_columns" DEFAULT '3',
  	"bottom_image_id" integer,
  	"appearance_background" "enum___shared_pages_v_grid_v_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_pages_v_grid_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"quote" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_vm_v_mission_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__shared_pages_v_vm_v_mission_items_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_vm_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_pages_v_vm_v_heading_align" DEFAULT 'center',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_pages_v_vm_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"vision_title" varchar,
  	"vision_statement" jsonb,
  	"mission_title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "___shared_pages_v_tl_v_entries_evt_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "___shared_pages_v_tl_v_entries_evt_v_locales" (
  	"date_label" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_tl_v_entries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"year" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__shared_pages_v_tl_v_entries_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_tl_v_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum___shared_pages_v_tl_v_buttons_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum___shared_pages_v_tl_v_buttons_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "__shared_pages_v_tl_v_buttons_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_tl_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum___shared_pages_v_tl_v_variant" DEFAULT 'summary',
  	"heading_align" "enum___shared_pages_v_tl_v_heading_align" DEFAULT 'center',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_pages_v_tl_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"banner_eyebrow" varchar,
  	"banner_title" varchar,
  	"banner_description" varchar,
  	"banner_period_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "detail_templates_hero_slides_btn" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_detail_templates_hero_slides_btn_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_detail_templates_hero_slides_btn_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "detail_templates_hero_slides_btn_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_hero_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"background_image_id" integer
  );
  
  CREATE TABLE "detail_templates_hero_slides_locales" (
  	"eyebrow" varchar,
  	"title" jsonb,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_hero_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "detail_templates_hero_stats_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"autoplay_seconds" numeric DEFAULT 6,
  	"block_name" varchar
  );
  
  CREATE TABLE "detail_templates_phero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"background_image_id" integer,
  	"heading_align" "enum_detail_templates_phero_heading_align" DEFAULT 'center',
  	"block_name" varchar
  );
  
  CREATE TABLE "detail_templates_phero_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_media_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "detail_templates_media_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "detail_templates_media_stats_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_media_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer
  );
  
  CREATE TABLE "detail_templates_media_points_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_media_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_detail_templates_media_buttons_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_detail_templates_media_buttons_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "detail_templates_media_buttons_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_detail_templates_media_heading_align" DEFAULT 'left',
  	"image_layout" "enum_detail_templates_media_image_layout" DEFAULT 'single',
  	"image_position" "enum_detail_templates_media_image_position" DEFAULT 'right',
  	"points_layout" "enum_detail_templates_media_points_layout" DEFAULT 'inline',
  	"appearance_background" "enum_detail_templates_media_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "detail_templates_media_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_grid_head_btn" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_detail_templates_grid_head_btn_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_detail_templates_grid_head_btn_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "detail_templates_grid_head_btn_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer
  );
  
  CREATE TABLE "detail_templates_grid_items_locales" (
  	"marker" varchar,
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_grid_foot_btn" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_detail_templates_grid_foot_btn_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_detail_templates_grid_foot_btn_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "detail_templates_grid_foot_btn_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_detail_templates_grid_heading_align" DEFAULT 'center',
  	"top_image_id" integer,
  	"marker_style" "enum_detail_templates_grid_marker_style" DEFAULT 'icon',
  	"card_style" "enum_detail_templates_grid_card_style" DEFAULT 'card',
  	"columns" "enum_detail_templates_grid_columns" DEFAULT '3',
  	"bottom_image_id" integer,
  	"appearance_background" "enum_detail_templates_grid_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "detail_templates_grid_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"quote" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_vm_mission_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "detail_templates_vm_mission_items_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_vm" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_detail_templates_vm_heading_align" DEFAULT 'center',
  	"block_name" varchar
  );
  
  CREATE TABLE "detail_templates_vm_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"vision_title" varchar,
  	"vision_statement" jsonb,
  	"mission_title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_tl_entries_evt" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "detail_templates_tl_entries_evt_locales" (
  	"date_label" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_tl_entries" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" varchar
  );
  
  CREATE TABLE "detail_templates_tl_entries_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_tl_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_detail_templates_tl_buttons_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_detail_templates_tl_buttons_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "detail_templates_tl_buttons_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_tl" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_detail_templates_tl_variant" DEFAULT 'summary',
  	"heading_align" "enum_detail_templates_tl_heading_align" DEFAULT 'center',
  	"block_name" varchar
  );
  
  CREATE TABLE "detail_templates_tl_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"banner_eyebrow" varchar,
  	"banner_title" varchar,
  	"banner_description" varchar,
  	"banner_period_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_rels" (
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
  
  CREATE TABLE "___detail_templates_v_hero_v_slides_btn_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum____detail_templates_v_hero_v_slides_btn_v_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum____detail_templates_v_hero_v_slides_btn_v_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "___detail_templates_v_hero_v_slides_btn_v_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_hero_v_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"background_image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__detail_templates_v_hero_v_slides_locales" (
  	"eyebrow" varchar,
  	"title" jsonb,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_hero_v_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__detail_templates_v_hero_v_stats_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_hero_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"autoplay_seconds" numeric DEFAULT 6,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__detail_templates_v_phero_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"background_image_id" integer,
  	"heading_align" "enum___detail_templates_v_phero_v_heading_align" DEFAULT 'center',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__detail_templates_v_phero_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_media_v_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__detail_templates_v_media_v_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__detail_templates_v_media_v_stats_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_media_v_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__detail_templates_v_media_v_points_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_media_v_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum___detail_templates_v_media_v_buttons_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum___detail_templates_v_media_v_buttons_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "__detail_templates_v_media_v_buttons_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_media_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___detail_templates_v_media_v_heading_align" DEFAULT 'left',
  	"image_layout" "enum___detail_templates_v_media_v_image_layout" DEFAULT 'single',
  	"image_position" "enum___detail_templates_v_media_v_image_position" DEFAULT 'right',
  	"points_layout" "enum___detail_templates_v_media_v_points_layout" DEFAULT 'inline',
  	"appearance_background" "enum___detail_templates_v_media_v_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__detail_templates_v_media_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "___detail_templates_v_grid_v_head_btn_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum____detail_templates_v_grid_v_head_btn_v_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum____detail_templates_v_grid_v_head_btn_v_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "___detail_templates_v_grid_v_head_btn_v_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_grid_v_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__detail_templates_v_grid_v_items_locales" (
  	"marker" varchar,
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "___detail_templates_v_grid_v_foot_btn_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum____detail_templates_v_grid_v_foot_btn_v_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum____detail_templates_v_grid_v_foot_btn_v_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "___detail_templates_v_grid_v_foot_btn_v_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_grid_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___detail_templates_v_grid_v_heading_align" DEFAULT 'center',
  	"top_image_id" integer,
  	"marker_style" "enum___detail_templates_v_grid_v_marker_style" DEFAULT 'icon',
  	"card_style" "enum___detail_templates_v_grid_v_card_style" DEFAULT 'card',
  	"columns" "enum___detail_templates_v_grid_v_columns" DEFAULT '3',
  	"bottom_image_id" integer,
  	"appearance_background" "enum___detail_templates_v_grid_v_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__detail_templates_v_grid_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"quote" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_vm_v_mission_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__detail_templates_v_vm_v_mission_items_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_vm_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___detail_templates_v_vm_v_heading_align" DEFAULT 'center',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__detail_templates_v_vm_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"vision_title" varchar,
  	"vision_statement" jsonb,
  	"mission_title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "___detail_templates_v_tl_v_entries_evt_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "___detail_templates_v_tl_v_entries_evt_v_locales" (
  	"date_label" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_tl_v_entries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"year" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__detail_templates_v_tl_v_entries_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_tl_v_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum___detail_templates_v_tl_v_buttons_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum___detail_templates_v_tl_v_buttons_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "__detail_templates_v_tl_v_buttons_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_tl_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum___detail_templates_v_tl_v_variant" DEFAULT 'summary',
  	"heading_align" "enum___detail_templates_v_tl_v_heading_align" DEFAULT 'center',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__detail_templates_v_tl_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"banner_eyebrow" varchar,
  	"banner_title" varchar,
  	"banner_description" varchar,
  	"banner_period_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_detail_templates_v_rels" (
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
  
  CREATE TABLE "shared_detail_templates_hero_slides_btn" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_shared_detail_templates_hero_slides_btn_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_shared_detail_templates_hero_slides_btn_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "shared_detail_templates_hero_slides_btn_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_hero_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"background_image_id" integer
  );
  
  CREATE TABLE "shared_detail_templates_hero_slides_locales" (
  	"eyebrow" varchar,
  	"title" jsonb,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_hero_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "shared_detail_templates_hero_stats_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"autoplay_seconds" numeric DEFAULT 6,
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_detail_templates_phero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"background_image_id" integer,
  	"heading_align" "enum_shared_detail_templates_phero_heading_align" DEFAULT 'center',
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_detail_templates_phero_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_media_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "shared_detail_templates_media_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "shared_detail_templates_media_stats_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_media_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer
  );
  
  CREATE TABLE "shared_detail_templates_media_points_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_media_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_shared_detail_templates_media_buttons_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_shared_detail_templates_media_buttons_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "shared_detail_templates_media_buttons_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_detail_templates_media_heading_align" DEFAULT 'left',
  	"image_layout" "enum_shared_detail_templates_media_image_layout" DEFAULT 'single',
  	"image_position" "enum_shared_detail_templates_media_image_position" DEFAULT 'right',
  	"points_layout" "enum_shared_detail_templates_media_points_layout" DEFAULT 'inline',
  	"appearance_background" "enum_shared_detail_templates_media_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_detail_templates_media_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_grid_head_btn" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_shared_detail_templates_grid_head_btn_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_shared_detail_templates_grid_head_btn_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "shared_detail_templates_grid_head_btn_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer
  );
  
  CREATE TABLE "shared_detail_templates_grid_items_locales" (
  	"marker" varchar,
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_grid_foot_btn" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_shared_detail_templates_grid_foot_btn_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_shared_detail_templates_grid_foot_btn_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "shared_detail_templates_grid_foot_btn_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_detail_templates_grid_heading_align" DEFAULT 'center',
  	"top_image_id" integer,
  	"marker_style" "enum_shared_detail_templates_grid_marker_style" DEFAULT 'icon',
  	"card_style" "enum_shared_detail_templates_grid_card_style" DEFAULT 'card',
  	"columns" "enum_shared_detail_templates_grid_columns" DEFAULT '3',
  	"bottom_image_id" integer,
  	"appearance_background" "enum_shared_detail_templates_grid_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_detail_templates_grid_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"quote" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_vm_mission_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_vm_mission_items_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_vm" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_detail_templates_vm_heading_align" DEFAULT 'center',
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_detail_templates_vm_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"vision_title" varchar,
  	"vision_statement" jsonb,
  	"mission_title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_tl_entries_evt" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_tl_entries_evt_locales" (
  	"date_label" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_tl_entries" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" varchar
  );
  
  CREATE TABLE "shared_detail_templates_tl_entries_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_tl_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_shared_detail_templates_tl_buttons_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_shared_detail_templates_tl_buttons_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "shared_detail_templates_tl_buttons_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_tl" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_shared_detail_templates_tl_variant" DEFAULT 'summary',
  	"heading_align" "enum_shared_detail_templates_tl_heading_align" DEFAULT 'center',
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_detail_templates_tl_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"banner_eyebrow" varchar,
  	"banner_title" varchar,
  	"banner_description" varchar,
  	"banner_period_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_rels" (
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
  
  CREATE TABLE "___shared_detail_templates_v_hero_v_slides_btn_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum____shared_detail_templates_v_hero_v_slides_btn_v_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum____shared_detail_templates_v_hero_v_slides_btn_v_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "___shared_detail_templates_v_hero_v_slides_btn_v_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_hero_v_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"background_image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_hero_v_slides_locales" (
  	"eyebrow" varchar,
  	"title" jsonb,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_hero_v_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_hero_v_stats_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_hero_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"autoplay_seconds" numeric DEFAULT 6,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_phero_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"background_image_id" integer,
  	"heading_align" "enum___shared_detail_templates_v_phero_v_heading_align" DEFAULT 'center',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_phero_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_media_v_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_media_v_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_media_v_stats_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_media_v_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_media_v_points_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_media_v_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum___shared_detail_templates_v_media_v_buttons_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum___shared_detail_templates_v_media_v_buttons_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_media_v_buttons_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_media_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_detail_templates_v_media_v_heading_align" DEFAULT 'left',
  	"image_layout" "enum___shared_detail_templates_v_media_v_image_layout" DEFAULT 'single',
  	"image_position" "enum___shared_detail_templates_v_media_v_image_position" DEFAULT 'right',
  	"points_layout" "enum___shared_detail_templates_v_media_v_points_layout" DEFAULT 'inline',
  	"appearance_background" "enum___shared_detail_templates_v_media_v_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_media_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "___shared_detail_templates_v_grid_v_head_btn_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum____shared_detail_templates_v_grid_v_head_btn_v_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum____shared_detail_templates_v_grid_v_head_btn_v_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "___shared_detail_templates_v_grid_v_head_btn_v_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_grid_v_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_grid_v_items_locales" (
  	"marker" varchar,
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "___shared_detail_templates_v_grid_v_foot_btn_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum____shared_detail_templates_v_grid_v_foot_btn_v_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum____shared_detail_templates_v_grid_v_foot_btn_v_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "___shared_detail_templates_v_grid_v_foot_btn_v_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_grid_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_detail_templates_v_grid_v_heading_align" DEFAULT 'center',
  	"top_image_id" integer,
  	"marker_style" "enum___shared_detail_templates_v_grid_v_marker_style" DEFAULT 'icon',
  	"card_style" "enum___shared_detail_templates_v_grid_v_card_style" DEFAULT 'card',
  	"columns" "enum___shared_detail_templates_v_grid_v_columns" DEFAULT '3',
  	"bottom_image_id" integer,
  	"appearance_background" "enum___shared_detail_templates_v_grid_v_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_grid_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"quote" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_vm_v_mission_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_vm_v_mission_items_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_vm_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_detail_templates_v_vm_v_heading_align" DEFAULT 'center',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_vm_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"vision_title" varchar,
  	"vision_statement" jsonb,
  	"mission_title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "___shared_detail_templates_v_tl_v_entries_evt_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "___shared_detail_templates_v_tl_v_entries_evt_v_locales" (
  	"date_label" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_tl_v_entries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"year" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_tl_v_entries_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_tl_v_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum___shared_detail_templates_v_tl_v_buttons_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum___shared_detail_templates_v_tl_v_buttons_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_tl_v_buttons_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_tl_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum___shared_detail_templates_v_tl_v_variant" DEFAULT 'summary',
  	"heading_align" "enum___shared_detail_templates_v_tl_v_heading_align" DEFAULT 'center',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_tl_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"banner_eyebrow" varchar,
  	"banner_title" varchar,
  	"banner_description" varchar,
  	"banner_period_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_shared_detail_templates_v_rels" (
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
  
  ALTER TABLE "pages_hero_slides_btn" ADD CONSTRAINT "pages_hero_slides_btn_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_hero_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_hero_slides_btn_locales" ADD CONSTRAINT "pages_hero_slides_btn_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_hero_slides_btn"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_hero_slides" ADD CONSTRAINT "pages_hero_slides_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_hero_slides" ADD CONSTRAINT "pages_hero_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_hero_slides_locales" ADD CONSTRAINT "pages_hero_slides_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_hero_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_hero_stats" ADD CONSTRAINT "pages_hero_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_hero_stats_locales" ADD CONSTRAINT "pages_hero_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_hero_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_hero" ADD CONSTRAINT "pages_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_phero" ADD CONSTRAINT "pages_phero_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_phero" ADD CONSTRAINT "pages_phero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_phero_locales" ADD CONSTRAINT "pages_phero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_phero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_media_images" ADD CONSTRAINT "pages_media_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_media_images" ADD CONSTRAINT "pages_media_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_media_stats" ADD CONSTRAINT "pages_media_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_media_stats_locales" ADD CONSTRAINT "pages_media_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_media_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_media_points" ADD CONSTRAINT "pages_media_points_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_media_points" ADD CONSTRAINT "pages_media_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_media_points_locales" ADD CONSTRAINT "pages_media_points_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_media_points"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_media_buttons" ADD CONSTRAINT "pages_media_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_media_buttons_locales" ADD CONSTRAINT "pages_media_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_media_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_media" ADD CONSTRAINT "pages_media_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_media" ADD CONSTRAINT "pages_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_media_locales" ADD CONSTRAINT "pages_media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_grid_head_btn" ADD CONSTRAINT "pages_grid_head_btn_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_grid_head_btn_locales" ADD CONSTRAINT "pages_grid_head_btn_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_grid_head_btn"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_grid_items" ADD CONSTRAINT "pages_grid_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_grid_items" ADD CONSTRAINT "pages_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_grid_items_locales" ADD CONSTRAINT "pages_grid_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_grid_foot_btn" ADD CONSTRAINT "pages_grid_foot_btn_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_grid_foot_btn_locales" ADD CONSTRAINT "pages_grid_foot_btn_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_grid_foot_btn"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_grid" ADD CONSTRAINT "pages_grid_top_image_id_media_id_fk" FOREIGN KEY ("top_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_grid" ADD CONSTRAINT "pages_grid_bottom_image_id_media_id_fk" FOREIGN KEY ("bottom_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_grid" ADD CONSTRAINT "pages_grid_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_grid" ADD CONSTRAINT "pages_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_grid_locales" ADD CONSTRAINT "pages_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_vm_mission_items" ADD CONSTRAINT "pages_vm_mission_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_vm"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_vm_mission_items_locales" ADD CONSTRAINT "pages_vm_mission_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_vm_mission_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_vm" ADD CONSTRAINT "pages_vm_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_vm_locales" ADD CONSTRAINT "pages_vm_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_vm"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_tl_entries_evt" ADD CONSTRAINT "pages_tl_entries_evt_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_tl_entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_tl_entries_evt_locales" ADD CONSTRAINT "pages_tl_entries_evt_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_tl_entries_evt"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_tl_entries" ADD CONSTRAINT "pages_tl_entries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_tl"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_tl_entries_locales" ADD CONSTRAINT "pages_tl_entries_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_tl_entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_tl_buttons" ADD CONSTRAINT "pages_tl_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_tl"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_tl_buttons_locales" ADD CONSTRAINT "pages_tl_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_tl_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_tl" ADD CONSTRAINT "pages_tl_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_tl_locales" ADD CONSTRAINT "pages_tl_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_tl"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___pages_v_hero_v_slides_btn_v" ADD CONSTRAINT "___pages_v_hero_v_slides_btn_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_hero_v_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___pages_v_hero_v_slides_btn_v_locales" ADD CONSTRAINT "___pages_v_hero_v_slides_btn_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___pages_v_hero_v_slides_btn_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_hero_v_slides" ADD CONSTRAINT "__pages_v_hero_v_slides_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__pages_v_hero_v_slides" ADD CONSTRAINT "__pages_v_hero_v_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_hero_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_hero_v_slides_locales" ADD CONSTRAINT "__pages_v_hero_v_slides_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_hero_v_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_hero_v_stats" ADD CONSTRAINT "__pages_v_hero_v_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_hero_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_hero_v_stats_locales" ADD CONSTRAINT "__pages_v_hero_v_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_hero_v_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_hero_v" ADD CONSTRAINT "__pages_v_hero_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_phero_v" ADD CONSTRAINT "__pages_v_phero_v_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__pages_v_phero_v" ADD CONSTRAINT "__pages_v_phero_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_phero_v_locales" ADD CONSTRAINT "__pages_v_phero_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_phero_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_media_v_images" ADD CONSTRAINT "__pages_v_media_v_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__pages_v_media_v_images" ADD CONSTRAINT "__pages_v_media_v_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_media_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_media_v_stats" ADD CONSTRAINT "__pages_v_media_v_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_media_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_media_v_stats_locales" ADD CONSTRAINT "__pages_v_media_v_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_media_v_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_media_v_points" ADD CONSTRAINT "__pages_v_media_v_points_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__pages_v_media_v_points" ADD CONSTRAINT "__pages_v_media_v_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_media_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_media_v_points_locales" ADD CONSTRAINT "__pages_v_media_v_points_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_media_v_points"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_media_v_buttons" ADD CONSTRAINT "__pages_v_media_v_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_media_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_media_v_buttons_locales" ADD CONSTRAINT "__pages_v_media_v_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_media_v_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_media_v" ADD CONSTRAINT "__pages_v_media_v_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__pages_v_media_v" ADD CONSTRAINT "__pages_v_media_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_media_v_locales" ADD CONSTRAINT "__pages_v_media_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_media_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___pages_v_grid_v_head_btn_v" ADD CONSTRAINT "___pages_v_grid_v_head_btn_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_grid_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___pages_v_grid_v_head_btn_v_locales" ADD CONSTRAINT "___pages_v_grid_v_head_btn_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___pages_v_grid_v_head_btn_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_grid_v_items" ADD CONSTRAINT "__pages_v_grid_v_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__pages_v_grid_v_items" ADD CONSTRAINT "__pages_v_grid_v_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_grid_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_grid_v_items_locales" ADD CONSTRAINT "__pages_v_grid_v_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_grid_v_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___pages_v_grid_v_foot_btn_v" ADD CONSTRAINT "___pages_v_grid_v_foot_btn_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_grid_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___pages_v_grid_v_foot_btn_v_locales" ADD CONSTRAINT "___pages_v_grid_v_foot_btn_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___pages_v_grid_v_foot_btn_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_grid_v" ADD CONSTRAINT "__pages_v_grid_v_top_image_id_media_id_fk" FOREIGN KEY ("top_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__pages_v_grid_v" ADD CONSTRAINT "__pages_v_grid_v_bottom_image_id_media_id_fk" FOREIGN KEY ("bottom_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__pages_v_grid_v" ADD CONSTRAINT "__pages_v_grid_v_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__pages_v_grid_v" ADD CONSTRAINT "__pages_v_grid_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_grid_v_locales" ADD CONSTRAINT "__pages_v_grid_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_grid_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_vm_v_mission_items" ADD CONSTRAINT "__pages_v_vm_v_mission_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_vm_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_vm_v_mission_items_locales" ADD CONSTRAINT "__pages_v_vm_v_mission_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_vm_v_mission_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_vm_v" ADD CONSTRAINT "__pages_v_vm_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_vm_v_locales" ADD CONSTRAINT "__pages_v_vm_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_vm_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___pages_v_tl_v_entries_evt_v" ADD CONSTRAINT "___pages_v_tl_v_entries_evt_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_tl_v_entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___pages_v_tl_v_entries_evt_v_locales" ADD CONSTRAINT "___pages_v_tl_v_entries_evt_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___pages_v_tl_v_entries_evt_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_tl_v_entries" ADD CONSTRAINT "__pages_v_tl_v_entries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_tl_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_tl_v_entries_locales" ADD CONSTRAINT "__pages_v_tl_v_entries_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_tl_v_entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_tl_v_buttons" ADD CONSTRAINT "__pages_v_tl_v_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_tl_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_tl_v_buttons_locales" ADD CONSTRAINT "__pages_v_tl_v_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_tl_v_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_tl_v" ADD CONSTRAINT "__pages_v_tl_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_tl_v_locales" ADD CONSTRAINT "__pages_v_tl_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_tl_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_hero_slides_btn" ADD CONSTRAINT "shared_pages_hero_slides_btn_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_hero_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_hero_slides_btn_locales" ADD CONSTRAINT "shared_pages_hero_slides_btn_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_hero_slides_btn"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_hero_slides" ADD CONSTRAINT "shared_pages_hero_slides_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_pages_hero_slides" ADD CONSTRAINT "shared_pages_hero_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_hero_slides_locales" ADD CONSTRAINT "shared_pages_hero_slides_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_hero_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_hero_stats" ADD CONSTRAINT "shared_pages_hero_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_hero_stats_locales" ADD CONSTRAINT "shared_pages_hero_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_hero_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_hero" ADD CONSTRAINT "shared_pages_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_phero" ADD CONSTRAINT "shared_pages_phero_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_pages_phero" ADD CONSTRAINT "shared_pages_phero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_phero_locales" ADD CONSTRAINT "shared_pages_phero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_phero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_media_images" ADD CONSTRAINT "shared_pages_media_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_pages_media_images" ADD CONSTRAINT "shared_pages_media_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_media_stats" ADD CONSTRAINT "shared_pages_media_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_media_stats_locales" ADD CONSTRAINT "shared_pages_media_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_media_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_media_points" ADD CONSTRAINT "shared_pages_media_points_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_pages_media_points" ADD CONSTRAINT "shared_pages_media_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_media_points_locales" ADD CONSTRAINT "shared_pages_media_points_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_media_points"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_media_buttons" ADD CONSTRAINT "shared_pages_media_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_media_buttons_locales" ADD CONSTRAINT "shared_pages_media_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_media_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_media" ADD CONSTRAINT "shared_pages_media_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_pages_media" ADD CONSTRAINT "shared_pages_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_media_locales" ADD CONSTRAINT "shared_pages_media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_grid_head_btn" ADD CONSTRAINT "shared_pages_grid_head_btn_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_grid_head_btn_locales" ADD CONSTRAINT "shared_pages_grid_head_btn_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_grid_head_btn"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_grid_items" ADD CONSTRAINT "shared_pages_grid_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_pages_grid_items" ADD CONSTRAINT "shared_pages_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_grid_items_locales" ADD CONSTRAINT "shared_pages_grid_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_grid_foot_btn" ADD CONSTRAINT "shared_pages_grid_foot_btn_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_grid_foot_btn_locales" ADD CONSTRAINT "shared_pages_grid_foot_btn_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_grid_foot_btn"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_grid" ADD CONSTRAINT "shared_pages_grid_top_image_id_media_id_fk" FOREIGN KEY ("top_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_pages_grid" ADD CONSTRAINT "shared_pages_grid_bottom_image_id_media_id_fk" FOREIGN KEY ("bottom_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_pages_grid" ADD CONSTRAINT "shared_pages_grid_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_pages_grid" ADD CONSTRAINT "shared_pages_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_grid_locales" ADD CONSTRAINT "shared_pages_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_vm_mission_items" ADD CONSTRAINT "shared_pages_vm_mission_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_vm"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_vm_mission_items_locales" ADD CONSTRAINT "shared_pages_vm_mission_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_vm_mission_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_vm" ADD CONSTRAINT "shared_pages_vm_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_vm_locales" ADD CONSTRAINT "shared_pages_vm_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_vm"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_tl_entries_evt" ADD CONSTRAINT "shared_pages_tl_entries_evt_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_tl_entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_tl_entries_evt_locales" ADD CONSTRAINT "shared_pages_tl_entries_evt_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_tl_entries_evt"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_tl_entries" ADD CONSTRAINT "shared_pages_tl_entries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_tl"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_tl_entries_locales" ADD CONSTRAINT "shared_pages_tl_entries_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_tl_entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_tl_buttons" ADD CONSTRAINT "shared_pages_tl_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_tl"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_tl_buttons_locales" ADD CONSTRAINT "shared_pages_tl_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_tl_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_tl" ADD CONSTRAINT "shared_pages_tl_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_tl_locales" ADD CONSTRAINT "shared_pages_tl_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_tl"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_pages_v_hero_v_slides_btn_v" ADD CONSTRAINT "___shared_pages_v_hero_v_slides_btn_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_hero_v_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_pages_v_hero_v_slides_btn_v_locales" ADD CONSTRAINT "___shared_pages_v_hero_v_slides_btn_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___shared_pages_v_hero_v_slides_btn_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_hero_v_slides" ADD CONSTRAINT "__shared_pages_v_hero_v_slides_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_hero_v_slides" ADD CONSTRAINT "__shared_pages_v_hero_v_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_hero_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_hero_v_slides_locales" ADD CONSTRAINT "__shared_pages_v_hero_v_slides_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_hero_v_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_hero_v_stats" ADD CONSTRAINT "__shared_pages_v_hero_v_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_hero_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_hero_v_stats_locales" ADD CONSTRAINT "__shared_pages_v_hero_v_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_hero_v_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_hero_v" ADD CONSTRAINT "__shared_pages_v_hero_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_phero_v" ADD CONSTRAINT "__shared_pages_v_phero_v_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_phero_v" ADD CONSTRAINT "__shared_pages_v_phero_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_phero_v_locales" ADD CONSTRAINT "__shared_pages_v_phero_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_phero_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_media_v_images" ADD CONSTRAINT "__shared_pages_v_media_v_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_media_v_images" ADD CONSTRAINT "__shared_pages_v_media_v_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_media_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_media_v_stats" ADD CONSTRAINT "__shared_pages_v_media_v_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_media_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_media_v_stats_locales" ADD CONSTRAINT "__shared_pages_v_media_v_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_media_v_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_media_v_points" ADD CONSTRAINT "__shared_pages_v_media_v_points_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_media_v_points" ADD CONSTRAINT "__shared_pages_v_media_v_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_media_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_media_v_points_locales" ADD CONSTRAINT "__shared_pages_v_media_v_points_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_media_v_points"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_media_v_buttons" ADD CONSTRAINT "__shared_pages_v_media_v_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_media_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_media_v_buttons_locales" ADD CONSTRAINT "__shared_pages_v_media_v_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_media_v_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_media_v" ADD CONSTRAINT "__shared_pages_v_media_v_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_media_v" ADD CONSTRAINT "__shared_pages_v_media_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_media_v_locales" ADD CONSTRAINT "__shared_pages_v_media_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_media_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_pages_v_grid_v_head_btn_v" ADD CONSTRAINT "___shared_pages_v_grid_v_head_btn_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_grid_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_pages_v_grid_v_head_btn_v_locales" ADD CONSTRAINT "___shared_pages_v_grid_v_head_btn_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___shared_pages_v_grid_v_head_btn_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_grid_v_items" ADD CONSTRAINT "__shared_pages_v_grid_v_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_grid_v_items" ADD CONSTRAINT "__shared_pages_v_grid_v_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_grid_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_grid_v_items_locales" ADD CONSTRAINT "__shared_pages_v_grid_v_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_grid_v_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_pages_v_grid_v_foot_btn_v" ADD CONSTRAINT "___shared_pages_v_grid_v_foot_btn_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_grid_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_pages_v_grid_v_foot_btn_v_locales" ADD CONSTRAINT "___shared_pages_v_grid_v_foot_btn_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___shared_pages_v_grid_v_foot_btn_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_grid_v" ADD CONSTRAINT "__shared_pages_v_grid_v_top_image_id_media_id_fk" FOREIGN KEY ("top_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_grid_v" ADD CONSTRAINT "__shared_pages_v_grid_v_bottom_image_id_media_id_fk" FOREIGN KEY ("bottom_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_grid_v" ADD CONSTRAINT "__shared_pages_v_grid_v_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_grid_v" ADD CONSTRAINT "__shared_pages_v_grid_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_grid_v_locales" ADD CONSTRAINT "__shared_pages_v_grid_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_grid_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_vm_v_mission_items" ADD CONSTRAINT "__shared_pages_v_vm_v_mission_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_vm_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_vm_v_mission_items_locales" ADD CONSTRAINT "__shared_pages_v_vm_v_mission_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_vm_v_mission_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_vm_v" ADD CONSTRAINT "__shared_pages_v_vm_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_vm_v_locales" ADD CONSTRAINT "__shared_pages_v_vm_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_vm_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_pages_v_tl_v_entries_evt_v" ADD CONSTRAINT "___shared_pages_v_tl_v_entries_evt_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_tl_v_entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_pages_v_tl_v_entries_evt_v_locales" ADD CONSTRAINT "___shared_pages_v_tl_v_entries_evt_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___shared_pages_v_tl_v_entries_evt_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_tl_v_entries" ADD CONSTRAINT "__shared_pages_v_tl_v_entries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_tl_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_tl_v_entries_locales" ADD CONSTRAINT "__shared_pages_v_tl_v_entries_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_tl_v_entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_tl_v_buttons" ADD CONSTRAINT "__shared_pages_v_tl_v_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_tl_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_tl_v_buttons_locales" ADD CONSTRAINT "__shared_pages_v_tl_v_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_tl_v_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_tl_v" ADD CONSTRAINT "__shared_pages_v_tl_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_tl_v_locales" ADD CONSTRAINT "__shared_pages_v_tl_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_tl_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_hero_slides_btn" ADD CONSTRAINT "detail_templates_hero_slides_btn_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_hero_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_hero_slides_btn_locales" ADD CONSTRAINT "detail_templates_hero_slides_btn_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_hero_slides_btn"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_hero_slides" ADD CONSTRAINT "detail_templates_hero_slides_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "detail_templates_hero_slides" ADD CONSTRAINT "detail_templates_hero_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_hero_slides_locales" ADD CONSTRAINT "detail_templates_hero_slides_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_hero_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_hero_stats" ADD CONSTRAINT "detail_templates_hero_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_hero_stats_locales" ADD CONSTRAINT "detail_templates_hero_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_hero_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_hero" ADD CONSTRAINT "detail_templates_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_phero" ADD CONSTRAINT "detail_templates_phero_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "detail_templates_phero" ADD CONSTRAINT "detail_templates_phero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_phero_locales" ADD CONSTRAINT "detail_templates_phero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_phero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_media_images" ADD CONSTRAINT "detail_templates_media_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "detail_templates_media_images" ADD CONSTRAINT "detail_templates_media_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_media_stats" ADD CONSTRAINT "detail_templates_media_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_media_stats_locales" ADD CONSTRAINT "detail_templates_media_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_media_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_media_points" ADD CONSTRAINT "detail_templates_media_points_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "detail_templates_media_points" ADD CONSTRAINT "detail_templates_media_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_media_points_locales" ADD CONSTRAINT "detail_templates_media_points_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_media_points"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_media_buttons" ADD CONSTRAINT "detail_templates_media_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_media_buttons_locales" ADD CONSTRAINT "detail_templates_media_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_media_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_media" ADD CONSTRAINT "detail_templates_media_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "detail_templates_media" ADD CONSTRAINT "detail_templates_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_media_locales" ADD CONSTRAINT "detail_templates_media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_grid_head_btn" ADD CONSTRAINT "detail_templates_grid_head_btn_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_grid_head_btn_locales" ADD CONSTRAINT "detail_templates_grid_head_btn_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_grid_head_btn"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_grid_items" ADD CONSTRAINT "detail_templates_grid_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "detail_templates_grid_items" ADD CONSTRAINT "detail_templates_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_grid_items_locales" ADD CONSTRAINT "detail_templates_grid_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_grid_foot_btn" ADD CONSTRAINT "detail_templates_grid_foot_btn_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_grid_foot_btn_locales" ADD CONSTRAINT "detail_templates_grid_foot_btn_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_grid_foot_btn"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_grid" ADD CONSTRAINT "detail_templates_grid_top_image_id_media_id_fk" FOREIGN KEY ("top_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "detail_templates_grid" ADD CONSTRAINT "detail_templates_grid_bottom_image_id_media_id_fk" FOREIGN KEY ("bottom_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "detail_templates_grid" ADD CONSTRAINT "detail_templates_grid_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "detail_templates_grid" ADD CONSTRAINT "detail_templates_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_grid_locales" ADD CONSTRAINT "detail_templates_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_vm_mission_items" ADD CONSTRAINT "detail_templates_vm_mission_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_vm"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_vm_mission_items_locales" ADD CONSTRAINT "detail_templates_vm_mission_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_vm_mission_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_vm" ADD CONSTRAINT "detail_templates_vm_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_vm_locales" ADD CONSTRAINT "detail_templates_vm_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_vm"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_tl_entries_evt" ADD CONSTRAINT "detail_templates_tl_entries_evt_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_tl_entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_tl_entries_evt_locales" ADD CONSTRAINT "detail_templates_tl_entries_evt_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_tl_entries_evt"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_tl_entries" ADD CONSTRAINT "detail_templates_tl_entries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_tl"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_tl_entries_locales" ADD CONSTRAINT "detail_templates_tl_entries_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_tl_entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_tl_buttons" ADD CONSTRAINT "detail_templates_tl_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_tl"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_tl_buttons_locales" ADD CONSTRAINT "detail_templates_tl_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_tl_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_tl" ADD CONSTRAINT "detail_templates_tl_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_tl_locales" ADD CONSTRAINT "detail_templates_tl_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_tl"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_rels" ADD CONSTRAINT "detail_templates_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_rels" ADD CONSTRAINT "detail_templates_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_rels" ADD CONSTRAINT "detail_templates_rels_shared_pages_fk" FOREIGN KEY ("shared_pages_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_rels" ADD CONSTRAINT "detail_templates_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_rels" ADD CONSTRAINT "detail_templates_rels_solutions_fk" FOREIGN KEY ("solutions_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_rels" ADD CONSTRAINT "detail_templates_rels_jobs_fk" FOREIGN KEY ("jobs_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_rels" ADD CONSTRAINT "detail_templates_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_rels" ADD CONSTRAINT "detail_templates_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___detail_templates_v_hero_v_slides_btn_v" ADD CONSTRAINT "___detail_templates_v_hero_v_slides_btn_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_hero_v_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___detail_templates_v_hero_v_slides_btn_v_locales" ADD CONSTRAINT "___detail_templates_v_hero_v_slides_btn_v_locales_parent__fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___detail_templates_v_hero_v_slides_btn_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_hero_v_slides" ADD CONSTRAINT "__detail_templates_v_hero_v_slides_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_hero_v_slides" ADD CONSTRAINT "__detail_templates_v_hero_v_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_hero_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_hero_v_slides_locales" ADD CONSTRAINT "__detail_templates_v_hero_v_slides_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_hero_v_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_hero_v_stats" ADD CONSTRAINT "__detail_templates_v_hero_v_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_hero_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_hero_v_stats_locales" ADD CONSTRAINT "__detail_templates_v_hero_v_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_hero_v_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_hero_v" ADD CONSTRAINT "__detail_templates_v_hero_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_phero_v" ADD CONSTRAINT "__detail_templates_v_phero_v_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_phero_v" ADD CONSTRAINT "__detail_templates_v_phero_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_phero_v_locales" ADD CONSTRAINT "__detail_templates_v_phero_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_phero_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_media_v_images" ADD CONSTRAINT "__detail_templates_v_media_v_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_media_v_images" ADD CONSTRAINT "__detail_templates_v_media_v_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_media_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_media_v_stats" ADD CONSTRAINT "__detail_templates_v_media_v_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_media_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_media_v_stats_locales" ADD CONSTRAINT "__detail_templates_v_media_v_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_media_v_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_media_v_points" ADD CONSTRAINT "__detail_templates_v_media_v_points_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_media_v_points" ADD CONSTRAINT "__detail_templates_v_media_v_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_media_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_media_v_points_locales" ADD CONSTRAINT "__detail_templates_v_media_v_points_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_media_v_points"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_media_v_buttons" ADD CONSTRAINT "__detail_templates_v_media_v_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_media_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_media_v_buttons_locales" ADD CONSTRAINT "__detail_templates_v_media_v_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_media_v_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_media_v" ADD CONSTRAINT "__detail_templates_v_media_v_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_media_v" ADD CONSTRAINT "__detail_templates_v_media_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_media_v_locales" ADD CONSTRAINT "__detail_templates_v_media_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_media_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___detail_templates_v_grid_v_head_btn_v" ADD CONSTRAINT "___detail_templates_v_grid_v_head_btn_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_grid_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___detail_templates_v_grid_v_head_btn_v_locales" ADD CONSTRAINT "___detail_templates_v_grid_v_head_btn_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___detail_templates_v_grid_v_head_btn_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_grid_v_items" ADD CONSTRAINT "__detail_templates_v_grid_v_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_grid_v_items" ADD CONSTRAINT "__detail_templates_v_grid_v_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_grid_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_grid_v_items_locales" ADD CONSTRAINT "__detail_templates_v_grid_v_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_grid_v_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___detail_templates_v_grid_v_foot_btn_v" ADD CONSTRAINT "___detail_templates_v_grid_v_foot_btn_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_grid_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___detail_templates_v_grid_v_foot_btn_v_locales" ADD CONSTRAINT "___detail_templates_v_grid_v_foot_btn_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___detail_templates_v_grid_v_foot_btn_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_grid_v" ADD CONSTRAINT "__detail_templates_v_grid_v_top_image_id_media_id_fk" FOREIGN KEY ("top_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_grid_v" ADD CONSTRAINT "__detail_templates_v_grid_v_bottom_image_id_media_id_fk" FOREIGN KEY ("bottom_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_grid_v" ADD CONSTRAINT "__detail_templates_v_grid_v_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_grid_v" ADD CONSTRAINT "__detail_templates_v_grid_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_grid_v_locales" ADD CONSTRAINT "__detail_templates_v_grid_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_grid_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_vm_v_mission_items" ADD CONSTRAINT "__detail_templates_v_vm_v_mission_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_vm_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_vm_v_mission_items_locales" ADD CONSTRAINT "__detail_templates_v_vm_v_mission_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_vm_v_mission_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_vm_v" ADD CONSTRAINT "__detail_templates_v_vm_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_vm_v_locales" ADD CONSTRAINT "__detail_templates_v_vm_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_vm_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___detail_templates_v_tl_v_entries_evt_v" ADD CONSTRAINT "___detail_templates_v_tl_v_entries_evt_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_tl_v_entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___detail_templates_v_tl_v_entries_evt_v_locales" ADD CONSTRAINT "___detail_templates_v_tl_v_entries_evt_v_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___detail_templates_v_tl_v_entries_evt_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_tl_v_entries" ADD CONSTRAINT "__detail_templates_v_tl_v_entries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_tl_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_tl_v_entries_locales" ADD CONSTRAINT "__detail_templates_v_tl_v_entries_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_tl_v_entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_tl_v_buttons" ADD CONSTRAINT "__detail_templates_v_tl_v_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_tl_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_tl_v_buttons_locales" ADD CONSTRAINT "__detail_templates_v_tl_v_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_tl_v_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_tl_v" ADD CONSTRAINT "__detail_templates_v_tl_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_tl_v_locales" ADD CONSTRAINT "__detail_templates_v_tl_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_tl_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_detail_templates_v_rels" ADD CONSTRAINT "_detail_templates_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_detail_templates_v_rels" ADD CONSTRAINT "_detail_templates_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_detail_templates_v_rels" ADD CONSTRAINT "_detail_templates_v_rels_shared_pages_fk" FOREIGN KEY ("shared_pages_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_detail_templates_v_rels" ADD CONSTRAINT "_detail_templates_v_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_detail_templates_v_rels" ADD CONSTRAINT "_detail_templates_v_rels_solutions_fk" FOREIGN KEY ("solutions_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_detail_templates_v_rels" ADD CONSTRAINT "_detail_templates_v_rels_jobs_fk" FOREIGN KEY ("jobs_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_detail_templates_v_rels" ADD CONSTRAINT "_detail_templates_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_detail_templates_v_rels" ADD CONSTRAINT "_detail_templates_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_hero_slides_btn" ADD CONSTRAINT "shared_detail_templates_hero_slides_btn_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_hero_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_hero_slides_btn_locales" ADD CONSTRAINT "shared_detail_templates_hero_slides_btn_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_hero_slides_btn"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_hero_slides" ADD CONSTRAINT "shared_detail_templates_hero_slides_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_hero_slides" ADD CONSTRAINT "shared_detail_templates_hero_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_hero_slides_locales" ADD CONSTRAINT "shared_detail_templates_hero_slides_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_hero_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_hero_stats" ADD CONSTRAINT "shared_detail_templates_hero_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_hero_stats_locales" ADD CONSTRAINT "shared_detail_templates_hero_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_hero_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_hero" ADD CONSTRAINT "shared_detail_templates_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_phero" ADD CONSTRAINT "shared_detail_templates_phero_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_phero" ADD CONSTRAINT "shared_detail_templates_phero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_phero_locales" ADD CONSTRAINT "shared_detail_templates_phero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_phero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_media_images" ADD CONSTRAINT "shared_detail_templates_media_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_media_images" ADD CONSTRAINT "shared_detail_templates_media_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_media_stats" ADD CONSTRAINT "shared_detail_templates_media_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_media_stats_locales" ADD CONSTRAINT "shared_detail_templates_media_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_media_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_media_points" ADD CONSTRAINT "shared_detail_templates_media_points_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_media_points" ADD CONSTRAINT "shared_detail_templates_media_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_media_points_locales" ADD CONSTRAINT "shared_detail_templates_media_points_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_media_points"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_media_buttons" ADD CONSTRAINT "shared_detail_templates_media_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_media_buttons_locales" ADD CONSTRAINT "shared_detail_templates_media_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_media_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_media" ADD CONSTRAINT "shared_detail_templates_media_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_media" ADD CONSTRAINT "shared_detail_templates_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_media_locales" ADD CONSTRAINT "shared_detail_templates_media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_grid_head_btn" ADD CONSTRAINT "shared_detail_templates_grid_head_btn_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_grid_head_btn_locales" ADD CONSTRAINT "shared_detail_templates_grid_head_btn_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_grid_head_btn"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_grid_items" ADD CONSTRAINT "shared_detail_templates_grid_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_grid_items" ADD CONSTRAINT "shared_detail_templates_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_grid_items_locales" ADD CONSTRAINT "shared_detail_templates_grid_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_grid_foot_btn" ADD CONSTRAINT "shared_detail_templates_grid_foot_btn_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_grid_foot_btn_locales" ADD CONSTRAINT "shared_detail_templates_grid_foot_btn_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_grid_foot_btn"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_grid" ADD CONSTRAINT "shared_detail_templates_grid_top_image_id_media_id_fk" FOREIGN KEY ("top_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_grid" ADD CONSTRAINT "shared_detail_templates_grid_bottom_image_id_media_id_fk" FOREIGN KEY ("bottom_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_grid" ADD CONSTRAINT "shared_detail_templates_grid_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_grid" ADD CONSTRAINT "shared_detail_templates_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_grid_locales" ADD CONSTRAINT "shared_detail_templates_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_vm_mission_items" ADD CONSTRAINT "shared_detail_templates_vm_mission_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_vm"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_vm_mission_items_locales" ADD CONSTRAINT "shared_detail_templates_vm_mission_items_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_vm_mission_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_vm" ADD CONSTRAINT "shared_detail_templates_vm_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_vm_locales" ADD CONSTRAINT "shared_detail_templates_vm_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_vm"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_tl_entries_evt" ADD CONSTRAINT "shared_detail_templates_tl_entries_evt_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_tl_entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_tl_entries_evt_locales" ADD CONSTRAINT "shared_detail_templates_tl_entries_evt_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_tl_entries_evt"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_tl_entries" ADD CONSTRAINT "shared_detail_templates_tl_entries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_tl"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_tl_entries_locales" ADD CONSTRAINT "shared_detail_templates_tl_entries_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_tl_entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_tl_buttons" ADD CONSTRAINT "shared_detail_templates_tl_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_tl"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_tl_buttons_locales" ADD CONSTRAINT "shared_detail_templates_tl_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_tl_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_tl" ADD CONSTRAINT "shared_detail_templates_tl_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_tl_locales" ADD CONSTRAINT "shared_detail_templates_tl_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_tl"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_rels" ADD CONSTRAINT "shared_detail_templates_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."shared_detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_rels" ADD CONSTRAINT "shared_detail_templates_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_rels" ADD CONSTRAINT "shared_detail_templates_rels_shared_pages_fk" FOREIGN KEY ("shared_pages_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_rels" ADD CONSTRAINT "shared_detail_templates_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_rels" ADD CONSTRAINT "shared_detail_templates_rels_solutions_fk" FOREIGN KEY ("solutions_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_rels" ADD CONSTRAINT "shared_detail_templates_rels_jobs_fk" FOREIGN KEY ("jobs_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_rels" ADD CONSTRAINT "shared_detail_templates_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_rels" ADD CONSTRAINT "shared_detail_templates_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_detail_templates_v_hero_v_slides_btn_v" ADD CONSTRAINT "___shared_detail_templates_v_hero_v_slides_btn_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_hero_v_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_detail_templates_v_hero_v_slides_btn_v_locales" ADD CONSTRAINT "___shared_detail_templates_v_hero_v_slides_btn_v_locales__fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___shared_detail_templates_v_hero_v_slides_btn_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_hero_v_slides" ADD CONSTRAINT "__shared_detail_templates_v_hero_v_slides_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_hero_v_slides" ADD CONSTRAINT "__shared_detail_templates_v_hero_v_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_hero_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_hero_v_slides_locales" ADD CONSTRAINT "__shared_detail_templates_v_hero_v_slides_locales_parent__fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_hero_v_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_hero_v_stats" ADD CONSTRAINT "__shared_detail_templates_v_hero_v_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_hero_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_hero_v_stats_locales" ADD CONSTRAINT "__shared_detail_templates_v_hero_v_stats_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_hero_v_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_hero_v" ADD CONSTRAINT "__shared_detail_templates_v_hero_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_phero_v" ADD CONSTRAINT "__shared_detail_templates_v_phero_v_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_phero_v" ADD CONSTRAINT "__shared_detail_templates_v_phero_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_phero_v_locales" ADD CONSTRAINT "__shared_detail_templates_v_phero_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_phero_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_media_v_images" ADD CONSTRAINT "__shared_detail_templates_v_media_v_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_media_v_images" ADD CONSTRAINT "__shared_detail_templates_v_media_v_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_media_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_media_v_stats" ADD CONSTRAINT "__shared_detail_templates_v_media_v_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_media_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_media_v_stats_locales" ADD CONSTRAINT "__shared_detail_templates_v_media_v_stats_locales_parent__fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_media_v_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_media_v_points" ADD CONSTRAINT "__shared_detail_templates_v_media_v_points_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_media_v_points" ADD CONSTRAINT "__shared_detail_templates_v_media_v_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_media_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_media_v_points_locales" ADD CONSTRAINT "__shared_detail_templates_v_media_v_points_locales_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_media_v_points"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_media_v_buttons" ADD CONSTRAINT "__shared_detail_templates_v_media_v_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_media_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_media_v_buttons_locales" ADD CONSTRAINT "__shared_detail_templates_v_media_v_buttons_locales_paren_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_media_v_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_media_v" ADD CONSTRAINT "__shared_detail_templates_v_media_v_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_media_v" ADD CONSTRAINT "__shared_detail_templates_v_media_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_media_v_locales" ADD CONSTRAINT "__shared_detail_templates_v_media_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_media_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_detail_templates_v_grid_v_head_btn_v" ADD CONSTRAINT "___shared_detail_templates_v_grid_v_head_btn_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_grid_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_detail_templates_v_grid_v_head_btn_v_locales" ADD CONSTRAINT "___shared_detail_templates_v_grid_v_head_btn_v_locales_pa_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___shared_detail_templates_v_grid_v_head_btn_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_grid_v_items" ADD CONSTRAINT "__shared_detail_templates_v_grid_v_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_grid_v_items" ADD CONSTRAINT "__shared_detail_templates_v_grid_v_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_grid_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_grid_v_items_locales" ADD CONSTRAINT "__shared_detail_templates_v_grid_v_items_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_grid_v_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_detail_templates_v_grid_v_foot_btn_v" ADD CONSTRAINT "___shared_detail_templates_v_grid_v_foot_btn_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_grid_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_detail_templates_v_grid_v_foot_btn_v_locales" ADD CONSTRAINT "___shared_detail_templates_v_grid_v_foot_btn_v_locales_pa_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___shared_detail_templates_v_grid_v_foot_btn_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_grid_v" ADD CONSTRAINT "__shared_detail_templates_v_grid_v_top_image_id_media_id_fk" FOREIGN KEY ("top_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_grid_v" ADD CONSTRAINT "__shared_detail_templates_v_grid_v_bottom_image_id_media_id_fk" FOREIGN KEY ("bottom_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_grid_v" ADD CONSTRAINT "__shared_detail_templates_v_grid_v_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_grid_v" ADD CONSTRAINT "__shared_detail_templates_v_grid_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_grid_v_locales" ADD CONSTRAINT "__shared_detail_templates_v_grid_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_grid_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_vm_v_mission_items" ADD CONSTRAINT "__shared_detail_templates_v_vm_v_mission_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_vm_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_vm_v_mission_items_locales" ADD CONSTRAINT "__shared_detail_templates_v_vm_v_mission_items_locales_pa_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_vm_v_mission_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_vm_v" ADD CONSTRAINT "__shared_detail_templates_v_vm_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_vm_v_locales" ADD CONSTRAINT "__shared_detail_templates_v_vm_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_vm_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_detail_templates_v_tl_v_entries_evt_v" ADD CONSTRAINT "___shared_detail_templates_v_tl_v_entries_evt_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_tl_v_entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_detail_templates_v_tl_v_entries_evt_v_locales" ADD CONSTRAINT "___shared_detail_templates_v_tl_v_entries_evt_v_locales_p_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___shared_detail_templates_v_tl_v_entries_evt_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_tl_v_entries" ADD CONSTRAINT "__shared_detail_templates_v_tl_v_entries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_tl_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_tl_v_entries_locales" ADD CONSTRAINT "__shared_detail_templates_v_tl_v_entries_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_tl_v_entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_tl_v_buttons" ADD CONSTRAINT "__shared_detail_templates_v_tl_v_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_tl_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_tl_v_buttons_locales" ADD CONSTRAINT "__shared_detail_templates_v_tl_v_buttons_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_tl_v_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_tl_v" ADD CONSTRAINT "__shared_detail_templates_v_tl_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_tl_v_locales" ADD CONSTRAINT "__shared_detail_templates_v_tl_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_tl_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_shared_detail_templates_v_rels" ADD CONSTRAINT "_shared_detail_templates_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_shared_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_shared_detail_templates_v_rels" ADD CONSTRAINT "_shared_detail_templates_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_shared_detail_templates_v_rels" ADD CONSTRAINT "_shared_detail_templates_v_rels_shared_pages_fk" FOREIGN KEY ("shared_pages_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_shared_detail_templates_v_rels" ADD CONSTRAINT "_shared_detail_templates_v_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_shared_detail_templates_v_rels" ADD CONSTRAINT "_shared_detail_templates_v_rels_solutions_fk" FOREIGN KEY ("solutions_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_shared_detail_templates_v_rels" ADD CONSTRAINT "_shared_detail_templates_v_rels_jobs_fk" FOREIGN KEY ("jobs_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_shared_detail_templates_v_rels" ADD CONSTRAINT "_shared_detail_templates_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_shared_detail_templates_v_rels" ADD CONSTRAINT "_shared_detail_templates_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_hero_slides_btn_order_idx" ON "pages_hero_slides_btn" USING btree ("_order");
  CREATE INDEX "pages_hero_slides_btn_parent_id_idx" ON "pages_hero_slides_btn" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_hero_slides_btn_locales_locale_parent_id_unique" ON "pages_hero_slides_btn_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_hero_slides_order_idx" ON "pages_hero_slides" USING btree ("_order");
  CREATE INDEX "pages_hero_slides_parent_id_idx" ON "pages_hero_slides" USING btree ("_parent_id");
  CREATE INDEX "pages_hero_slides_background_image_idx" ON "pages_hero_slides" USING btree ("background_image_id");
  CREATE UNIQUE INDEX "pages_hero_slides_locales_locale_parent_id_unique" ON "pages_hero_slides_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_hero_stats_order_idx" ON "pages_hero_stats" USING btree ("_order");
  CREATE INDEX "pages_hero_stats_parent_id_idx" ON "pages_hero_stats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_hero_stats_locales_locale_parent_id_unique" ON "pages_hero_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_hero_order_idx" ON "pages_hero" USING btree ("_order");
  CREATE INDEX "pages_hero_parent_id_idx" ON "pages_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_hero_path_idx" ON "pages_hero" USING btree ("_path");
  CREATE INDEX "pages_phero_order_idx" ON "pages_phero" USING btree ("_order");
  CREATE INDEX "pages_phero_parent_id_idx" ON "pages_phero" USING btree ("_parent_id");
  CREATE INDEX "pages_phero_path_idx" ON "pages_phero" USING btree ("_path");
  CREATE INDEX "pages_phero_background_image_idx" ON "pages_phero" USING btree ("background_image_id");
  CREATE UNIQUE INDEX "pages_phero_locales_locale_parent_id_unique" ON "pages_phero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_media_images_order_idx" ON "pages_media_images" USING btree ("_order");
  CREATE INDEX "pages_media_images_parent_id_idx" ON "pages_media_images" USING btree ("_parent_id");
  CREATE INDEX "pages_media_images_image_idx" ON "pages_media_images" USING btree ("image_id");
  CREATE INDEX "pages_media_stats_order_idx" ON "pages_media_stats" USING btree ("_order");
  CREATE INDEX "pages_media_stats_parent_id_idx" ON "pages_media_stats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_media_stats_locales_locale_parent_id_unique" ON "pages_media_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_media_points_order_idx" ON "pages_media_points" USING btree ("_order");
  CREATE INDEX "pages_media_points_parent_id_idx" ON "pages_media_points" USING btree ("_parent_id");
  CREATE INDEX "pages_media_points_icon_idx" ON "pages_media_points" USING btree ("icon_id");
  CREATE UNIQUE INDEX "pages_media_points_locales_locale_parent_id_unique" ON "pages_media_points_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_media_buttons_order_idx" ON "pages_media_buttons" USING btree ("_order");
  CREATE INDEX "pages_media_buttons_parent_id_idx" ON "pages_media_buttons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_media_buttons_locales_locale_parent_id_unique" ON "pages_media_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_media_order_idx" ON "pages_media" USING btree ("_order");
  CREATE INDEX "pages_media_parent_id_idx" ON "pages_media" USING btree ("_parent_id");
  CREATE INDEX "pages_media_path_idx" ON "pages_media" USING btree ("_path");
  CREATE INDEX "pages_media_appearance_appearance_background_image_idx" ON "pages_media" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "pages_media_locales_locale_parent_id_unique" ON "pages_media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_grid_head_btn_order_idx" ON "pages_grid_head_btn" USING btree ("_order");
  CREATE INDEX "pages_grid_head_btn_parent_id_idx" ON "pages_grid_head_btn" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_grid_head_btn_locales_locale_parent_id_unique" ON "pages_grid_head_btn_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_grid_items_order_idx" ON "pages_grid_items" USING btree ("_order");
  CREATE INDEX "pages_grid_items_parent_id_idx" ON "pages_grid_items" USING btree ("_parent_id");
  CREATE INDEX "pages_grid_items_icon_idx" ON "pages_grid_items" USING btree ("icon_id");
  CREATE UNIQUE INDEX "pages_grid_items_locales_locale_parent_id_unique" ON "pages_grid_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_grid_foot_btn_order_idx" ON "pages_grid_foot_btn" USING btree ("_order");
  CREATE INDEX "pages_grid_foot_btn_parent_id_idx" ON "pages_grid_foot_btn" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_grid_foot_btn_locales_locale_parent_id_unique" ON "pages_grid_foot_btn_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_grid_order_idx" ON "pages_grid" USING btree ("_order");
  CREATE INDEX "pages_grid_parent_id_idx" ON "pages_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_grid_path_idx" ON "pages_grid" USING btree ("_path");
  CREATE INDEX "pages_grid_top_image_idx" ON "pages_grid" USING btree ("top_image_id");
  CREATE INDEX "pages_grid_bottom_image_idx" ON "pages_grid" USING btree ("bottom_image_id");
  CREATE INDEX "pages_grid_appearance_appearance_background_image_idx" ON "pages_grid" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "pages_grid_locales_locale_parent_id_unique" ON "pages_grid_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_vm_mission_items_order_idx" ON "pages_vm_mission_items" USING btree ("_order");
  CREATE INDEX "pages_vm_mission_items_parent_id_idx" ON "pages_vm_mission_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_vm_mission_items_locales_locale_parent_id_unique" ON "pages_vm_mission_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_vm_order_idx" ON "pages_vm" USING btree ("_order");
  CREATE INDEX "pages_vm_parent_id_idx" ON "pages_vm" USING btree ("_parent_id");
  CREATE INDEX "pages_vm_path_idx" ON "pages_vm" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_vm_locales_locale_parent_id_unique" ON "pages_vm_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_tl_entries_evt_order_idx" ON "pages_tl_entries_evt" USING btree ("_order");
  CREATE INDEX "pages_tl_entries_evt_parent_id_idx" ON "pages_tl_entries_evt" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_tl_entries_evt_locales_locale_parent_id_unique" ON "pages_tl_entries_evt_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_tl_entries_order_idx" ON "pages_tl_entries" USING btree ("_order");
  CREATE INDEX "pages_tl_entries_parent_id_idx" ON "pages_tl_entries" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_tl_entries_locales_locale_parent_id_unique" ON "pages_tl_entries_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_tl_buttons_order_idx" ON "pages_tl_buttons" USING btree ("_order");
  CREATE INDEX "pages_tl_buttons_parent_id_idx" ON "pages_tl_buttons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_tl_buttons_locales_locale_parent_id_unique" ON "pages_tl_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_tl_order_idx" ON "pages_tl" USING btree ("_order");
  CREATE INDEX "pages_tl_parent_id_idx" ON "pages_tl" USING btree ("_parent_id");
  CREATE INDEX "pages_tl_path_idx" ON "pages_tl" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_tl_locales_locale_parent_id_unique" ON "pages_tl_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___pages_v_hero_v_slides_btn_v_order_idx" ON "___pages_v_hero_v_slides_btn_v" USING btree ("_order");
  CREATE INDEX "___pages_v_hero_v_slides_btn_v_parent_id_idx" ON "___pages_v_hero_v_slides_btn_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "___pages_v_hero_v_slides_btn_v_locales_locale_parent_id_uniq" ON "___pages_v_hero_v_slides_btn_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__pages_v_hero_v_slides_order_idx" ON "__pages_v_hero_v_slides" USING btree ("_order");
  CREATE INDEX "__pages_v_hero_v_slides_parent_id_idx" ON "__pages_v_hero_v_slides" USING btree ("_parent_id");
  CREATE INDEX "__pages_v_hero_v_slides_background_image_idx" ON "__pages_v_hero_v_slides" USING btree ("background_image_id");
  CREATE UNIQUE INDEX "__pages_v_hero_v_slides_locales_locale_parent_id_unique" ON "__pages_v_hero_v_slides_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__pages_v_hero_v_stats_order_idx" ON "__pages_v_hero_v_stats" USING btree ("_order");
  CREATE INDEX "__pages_v_hero_v_stats_parent_id_idx" ON "__pages_v_hero_v_stats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "__pages_v_hero_v_stats_locales_locale_parent_id_unique" ON "__pages_v_hero_v_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__pages_v_hero_v_order_idx" ON "__pages_v_hero_v" USING btree ("_order");
  CREATE INDEX "__pages_v_hero_v_parent_id_idx" ON "__pages_v_hero_v" USING btree ("_parent_id");
  CREATE INDEX "__pages_v_hero_v_path_idx" ON "__pages_v_hero_v" USING btree ("_path");
  CREATE INDEX "__pages_v_phero_v_order_idx" ON "__pages_v_phero_v" USING btree ("_order");
  CREATE INDEX "__pages_v_phero_v_parent_id_idx" ON "__pages_v_phero_v" USING btree ("_parent_id");
  CREATE INDEX "__pages_v_phero_v_path_idx" ON "__pages_v_phero_v" USING btree ("_path");
  CREATE INDEX "__pages_v_phero_v_background_image_idx" ON "__pages_v_phero_v" USING btree ("background_image_id");
  CREATE UNIQUE INDEX "__pages_v_phero_v_locales_locale_parent_id_unique" ON "__pages_v_phero_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__pages_v_media_v_images_order_idx" ON "__pages_v_media_v_images" USING btree ("_order");
  CREATE INDEX "__pages_v_media_v_images_parent_id_idx" ON "__pages_v_media_v_images" USING btree ("_parent_id");
  CREATE INDEX "__pages_v_media_v_images_image_idx" ON "__pages_v_media_v_images" USING btree ("image_id");
  CREATE INDEX "__pages_v_media_v_stats_order_idx" ON "__pages_v_media_v_stats" USING btree ("_order");
  CREATE INDEX "__pages_v_media_v_stats_parent_id_idx" ON "__pages_v_media_v_stats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "__pages_v_media_v_stats_locales_locale_parent_id_unique" ON "__pages_v_media_v_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__pages_v_media_v_points_order_idx" ON "__pages_v_media_v_points" USING btree ("_order");
  CREATE INDEX "__pages_v_media_v_points_parent_id_idx" ON "__pages_v_media_v_points" USING btree ("_parent_id");
  CREATE INDEX "__pages_v_media_v_points_icon_idx" ON "__pages_v_media_v_points" USING btree ("icon_id");
  CREATE UNIQUE INDEX "__pages_v_media_v_points_locales_locale_parent_id_unique" ON "__pages_v_media_v_points_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__pages_v_media_v_buttons_order_idx" ON "__pages_v_media_v_buttons" USING btree ("_order");
  CREATE INDEX "__pages_v_media_v_buttons_parent_id_idx" ON "__pages_v_media_v_buttons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "__pages_v_media_v_buttons_locales_locale_parent_id_unique" ON "__pages_v_media_v_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__pages_v_media_v_order_idx" ON "__pages_v_media_v" USING btree ("_order");
  CREATE INDEX "__pages_v_media_v_parent_id_idx" ON "__pages_v_media_v" USING btree ("_parent_id");
  CREATE INDEX "__pages_v_media_v_path_idx" ON "__pages_v_media_v" USING btree ("_path");
  CREATE INDEX "__pages_v_media_v_appearance_appearance_background_image_idx" ON "__pages_v_media_v" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "__pages_v_media_v_locales_locale_parent_id_unique" ON "__pages_v_media_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___pages_v_grid_v_head_btn_v_order_idx" ON "___pages_v_grid_v_head_btn_v" USING btree ("_order");
  CREATE INDEX "___pages_v_grid_v_head_btn_v_parent_id_idx" ON "___pages_v_grid_v_head_btn_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "___pages_v_grid_v_head_btn_v_locales_locale_parent_id_unique" ON "___pages_v_grid_v_head_btn_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__pages_v_grid_v_items_order_idx" ON "__pages_v_grid_v_items" USING btree ("_order");
  CREATE INDEX "__pages_v_grid_v_items_parent_id_idx" ON "__pages_v_grid_v_items" USING btree ("_parent_id");
  CREATE INDEX "__pages_v_grid_v_items_icon_idx" ON "__pages_v_grid_v_items" USING btree ("icon_id");
  CREATE UNIQUE INDEX "__pages_v_grid_v_items_locales_locale_parent_id_unique" ON "__pages_v_grid_v_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___pages_v_grid_v_foot_btn_v_order_idx" ON "___pages_v_grid_v_foot_btn_v" USING btree ("_order");
  CREATE INDEX "___pages_v_grid_v_foot_btn_v_parent_id_idx" ON "___pages_v_grid_v_foot_btn_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "___pages_v_grid_v_foot_btn_v_locales_locale_parent_id_unique" ON "___pages_v_grid_v_foot_btn_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__pages_v_grid_v_order_idx" ON "__pages_v_grid_v" USING btree ("_order");
  CREATE INDEX "__pages_v_grid_v_parent_id_idx" ON "__pages_v_grid_v" USING btree ("_parent_id");
  CREATE INDEX "__pages_v_grid_v_path_idx" ON "__pages_v_grid_v" USING btree ("_path");
  CREATE INDEX "__pages_v_grid_v_top_image_idx" ON "__pages_v_grid_v" USING btree ("top_image_id");
  CREATE INDEX "__pages_v_grid_v_bottom_image_idx" ON "__pages_v_grid_v" USING btree ("bottom_image_id");
  CREATE INDEX "__pages_v_grid_v_appearance_appearance_background_image_idx" ON "__pages_v_grid_v" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "__pages_v_grid_v_locales_locale_parent_id_unique" ON "__pages_v_grid_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__pages_v_vm_v_mission_items_order_idx" ON "__pages_v_vm_v_mission_items" USING btree ("_order");
  CREATE INDEX "__pages_v_vm_v_mission_items_parent_id_idx" ON "__pages_v_vm_v_mission_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "__pages_v_vm_v_mission_items_locales_locale_parent_id_unique" ON "__pages_v_vm_v_mission_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__pages_v_vm_v_order_idx" ON "__pages_v_vm_v" USING btree ("_order");
  CREATE INDEX "__pages_v_vm_v_parent_id_idx" ON "__pages_v_vm_v" USING btree ("_parent_id");
  CREATE INDEX "__pages_v_vm_v_path_idx" ON "__pages_v_vm_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__pages_v_vm_v_locales_locale_parent_id_unique" ON "__pages_v_vm_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___pages_v_tl_v_entries_evt_v_order_idx" ON "___pages_v_tl_v_entries_evt_v" USING btree ("_order");
  CREATE INDEX "___pages_v_tl_v_entries_evt_v_parent_id_idx" ON "___pages_v_tl_v_entries_evt_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "___pages_v_tl_v_entries_evt_v_locales_locale_parent_id_uniqu" ON "___pages_v_tl_v_entries_evt_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__pages_v_tl_v_entries_order_idx" ON "__pages_v_tl_v_entries" USING btree ("_order");
  CREATE INDEX "__pages_v_tl_v_entries_parent_id_idx" ON "__pages_v_tl_v_entries" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "__pages_v_tl_v_entries_locales_locale_parent_id_unique" ON "__pages_v_tl_v_entries_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__pages_v_tl_v_buttons_order_idx" ON "__pages_v_tl_v_buttons" USING btree ("_order");
  CREATE INDEX "__pages_v_tl_v_buttons_parent_id_idx" ON "__pages_v_tl_v_buttons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "__pages_v_tl_v_buttons_locales_locale_parent_id_unique" ON "__pages_v_tl_v_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__pages_v_tl_v_order_idx" ON "__pages_v_tl_v" USING btree ("_order");
  CREATE INDEX "__pages_v_tl_v_parent_id_idx" ON "__pages_v_tl_v" USING btree ("_parent_id");
  CREATE INDEX "__pages_v_tl_v_path_idx" ON "__pages_v_tl_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__pages_v_tl_v_locales_locale_parent_id_unique" ON "__pages_v_tl_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_hero_slides_btn_order_idx" ON "shared_pages_hero_slides_btn" USING btree ("_order");
  CREATE INDEX "shared_pages_hero_slides_btn_parent_id_idx" ON "shared_pages_hero_slides_btn" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shared_pages_hero_slides_btn_locales_locale_parent_id_unique" ON "shared_pages_hero_slides_btn_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_hero_slides_order_idx" ON "shared_pages_hero_slides" USING btree ("_order");
  CREATE INDEX "shared_pages_hero_slides_parent_id_idx" ON "shared_pages_hero_slides" USING btree ("_parent_id");
  CREATE INDEX "shared_pages_hero_slides_background_image_idx" ON "shared_pages_hero_slides" USING btree ("background_image_id");
  CREATE UNIQUE INDEX "shared_pages_hero_slides_locales_locale_parent_id_unique" ON "shared_pages_hero_slides_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_hero_stats_order_idx" ON "shared_pages_hero_stats" USING btree ("_order");
  CREATE INDEX "shared_pages_hero_stats_parent_id_idx" ON "shared_pages_hero_stats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shared_pages_hero_stats_locales_locale_parent_id_unique" ON "shared_pages_hero_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_hero_order_idx" ON "shared_pages_hero" USING btree ("_order");
  CREATE INDEX "shared_pages_hero_parent_id_idx" ON "shared_pages_hero" USING btree ("_parent_id");
  CREATE INDEX "shared_pages_hero_path_idx" ON "shared_pages_hero" USING btree ("_path");
  CREATE INDEX "shared_pages_phero_order_idx" ON "shared_pages_phero" USING btree ("_order");
  CREATE INDEX "shared_pages_phero_parent_id_idx" ON "shared_pages_phero" USING btree ("_parent_id");
  CREATE INDEX "shared_pages_phero_path_idx" ON "shared_pages_phero" USING btree ("_path");
  CREATE INDEX "shared_pages_phero_background_image_idx" ON "shared_pages_phero" USING btree ("background_image_id");
  CREATE UNIQUE INDEX "shared_pages_phero_locales_locale_parent_id_unique" ON "shared_pages_phero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_media_images_order_idx" ON "shared_pages_media_images" USING btree ("_order");
  CREATE INDEX "shared_pages_media_images_parent_id_idx" ON "shared_pages_media_images" USING btree ("_parent_id");
  CREATE INDEX "shared_pages_media_images_image_idx" ON "shared_pages_media_images" USING btree ("image_id");
  CREATE INDEX "shared_pages_media_stats_order_idx" ON "shared_pages_media_stats" USING btree ("_order");
  CREATE INDEX "shared_pages_media_stats_parent_id_idx" ON "shared_pages_media_stats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shared_pages_media_stats_locales_locale_parent_id_unique" ON "shared_pages_media_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_media_points_order_idx" ON "shared_pages_media_points" USING btree ("_order");
  CREATE INDEX "shared_pages_media_points_parent_id_idx" ON "shared_pages_media_points" USING btree ("_parent_id");
  CREATE INDEX "shared_pages_media_points_icon_idx" ON "shared_pages_media_points" USING btree ("icon_id");
  CREATE UNIQUE INDEX "shared_pages_media_points_locales_locale_parent_id_unique" ON "shared_pages_media_points_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_media_buttons_order_idx" ON "shared_pages_media_buttons" USING btree ("_order");
  CREATE INDEX "shared_pages_media_buttons_parent_id_idx" ON "shared_pages_media_buttons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shared_pages_media_buttons_locales_locale_parent_id_unique" ON "shared_pages_media_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_media_order_idx" ON "shared_pages_media" USING btree ("_order");
  CREATE INDEX "shared_pages_media_parent_id_idx" ON "shared_pages_media" USING btree ("_parent_id");
  CREATE INDEX "shared_pages_media_path_idx" ON "shared_pages_media" USING btree ("_path");
  CREATE INDEX "shared_pages_media_appearance_appearance_background_imag_idx" ON "shared_pages_media" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "shared_pages_media_locales_locale_parent_id_unique" ON "shared_pages_media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_grid_head_btn_order_idx" ON "shared_pages_grid_head_btn" USING btree ("_order");
  CREATE INDEX "shared_pages_grid_head_btn_parent_id_idx" ON "shared_pages_grid_head_btn" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shared_pages_grid_head_btn_locales_locale_parent_id_unique" ON "shared_pages_grid_head_btn_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_grid_items_order_idx" ON "shared_pages_grid_items" USING btree ("_order");
  CREATE INDEX "shared_pages_grid_items_parent_id_idx" ON "shared_pages_grid_items" USING btree ("_parent_id");
  CREATE INDEX "shared_pages_grid_items_icon_idx" ON "shared_pages_grid_items" USING btree ("icon_id");
  CREATE UNIQUE INDEX "shared_pages_grid_items_locales_locale_parent_id_unique" ON "shared_pages_grid_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_grid_foot_btn_order_idx" ON "shared_pages_grid_foot_btn" USING btree ("_order");
  CREATE INDEX "shared_pages_grid_foot_btn_parent_id_idx" ON "shared_pages_grid_foot_btn" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shared_pages_grid_foot_btn_locales_locale_parent_id_unique" ON "shared_pages_grid_foot_btn_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_grid_order_idx" ON "shared_pages_grid" USING btree ("_order");
  CREATE INDEX "shared_pages_grid_parent_id_idx" ON "shared_pages_grid" USING btree ("_parent_id");
  CREATE INDEX "shared_pages_grid_path_idx" ON "shared_pages_grid" USING btree ("_path");
  CREATE INDEX "shared_pages_grid_top_image_idx" ON "shared_pages_grid" USING btree ("top_image_id");
  CREATE INDEX "shared_pages_grid_bottom_image_idx" ON "shared_pages_grid" USING btree ("bottom_image_id");
  CREATE INDEX "shared_pages_grid_appearance_appearance_background_image_idx" ON "shared_pages_grid" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "shared_pages_grid_locales_locale_parent_id_unique" ON "shared_pages_grid_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_vm_mission_items_order_idx" ON "shared_pages_vm_mission_items" USING btree ("_order");
  CREATE INDEX "shared_pages_vm_mission_items_parent_id_idx" ON "shared_pages_vm_mission_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shared_pages_vm_mission_items_locales_locale_parent_id_uniqu" ON "shared_pages_vm_mission_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_vm_order_idx" ON "shared_pages_vm" USING btree ("_order");
  CREATE INDEX "shared_pages_vm_parent_id_idx" ON "shared_pages_vm" USING btree ("_parent_id");
  CREATE INDEX "shared_pages_vm_path_idx" ON "shared_pages_vm" USING btree ("_path");
  CREATE UNIQUE INDEX "shared_pages_vm_locales_locale_parent_id_unique" ON "shared_pages_vm_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_tl_entries_evt_order_idx" ON "shared_pages_tl_entries_evt" USING btree ("_order");
  CREATE INDEX "shared_pages_tl_entries_evt_parent_id_idx" ON "shared_pages_tl_entries_evt" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shared_pages_tl_entries_evt_locales_locale_parent_id_unique" ON "shared_pages_tl_entries_evt_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_tl_entries_order_idx" ON "shared_pages_tl_entries" USING btree ("_order");
  CREATE INDEX "shared_pages_tl_entries_parent_id_idx" ON "shared_pages_tl_entries" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shared_pages_tl_entries_locales_locale_parent_id_unique" ON "shared_pages_tl_entries_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_tl_buttons_order_idx" ON "shared_pages_tl_buttons" USING btree ("_order");
  CREATE INDEX "shared_pages_tl_buttons_parent_id_idx" ON "shared_pages_tl_buttons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shared_pages_tl_buttons_locales_locale_parent_id_unique" ON "shared_pages_tl_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_tl_order_idx" ON "shared_pages_tl" USING btree ("_order");
  CREATE INDEX "shared_pages_tl_parent_id_idx" ON "shared_pages_tl" USING btree ("_parent_id");
  CREATE INDEX "shared_pages_tl_path_idx" ON "shared_pages_tl" USING btree ("_path");
  CREATE UNIQUE INDEX "shared_pages_tl_locales_locale_parent_id_unique" ON "shared_pages_tl_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___shared_pages_v_hero_v_slides_btn_v_order_idx" ON "___shared_pages_v_hero_v_slides_btn_v" USING btree ("_order");
  CREATE INDEX "___shared_pages_v_hero_v_slides_btn_v_parent_id_idx" ON "___shared_pages_v_hero_v_slides_btn_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "___shared_pages_v_hero_v_slides_btn_v_locales_locale_parent_" ON "___shared_pages_v_hero_v_slides_btn_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_pages_v_hero_v_slides_order_idx" ON "__shared_pages_v_hero_v_slides" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_hero_v_slides_parent_id_idx" ON "__shared_pages_v_hero_v_slides" USING btree ("_parent_id");
  CREATE INDEX "__shared_pages_v_hero_v_slides_background_image_idx" ON "__shared_pages_v_hero_v_slides" USING btree ("background_image_id");
  CREATE UNIQUE INDEX "__shared_pages_v_hero_v_slides_locales_locale_parent_id_uniq" ON "__shared_pages_v_hero_v_slides_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_pages_v_hero_v_stats_order_idx" ON "__shared_pages_v_hero_v_stats" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_hero_v_stats_parent_id_idx" ON "__shared_pages_v_hero_v_stats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "__shared_pages_v_hero_v_stats_locales_locale_parent_id_uniqu" ON "__shared_pages_v_hero_v_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_pages_v_hero_v_order_idx" ON "__shared_pages_v_hero_v" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_hero_v_parent_id_idx" ON "__shared_pages_v_hero_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_pages_v_hero_v_path_idx" ON "__shared_pages_v_hero_v" USING btree ("_path");
  CREATE INDEX "__shared_pages_v_phero_v_order_idx" ON "__shared_pages_v_phero_v" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_phero_v_parent_id_idx" ON "__shared_pages_v_phero_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_pages_v_phero_v_path_idx" ON "__shared_pages_v_phero_v" USING btree ("_path");
  CREATE INDEX "__shared_pages_v_phero_v_background_image_idx" ON "__shared_pages_v_phero_v" USING btree ("background_image_id");
  CREATE UNIQUE INDEX "__shared_pages_v_phero_v_locales_locale_parent_id_unique" ON "__shared_pages_v_phero_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_pages_v_media_v_images_order_idx" ON "__shared_pages_v_media_v_images" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_media_v_images_parent_id_idx" ON "__shared_pages_v_media_v_images" USING btree ("_parent_id");
  CREATE INDEX "__shared_pages_v_media_v_images_image_idx" ON "__shared_pages_v_media_v_images" USING btree ("image_id");
  CREATE INDEX "__shared_pages_v_media_v_stats_order_idx" ON "__shared_pages_v_media_v_stats" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_media_v_stats_parent_id_idx" ON "__shared_pages_v_media_v_stats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "__shared_pages_v_media_v_stats_locales_locale_parent_id_uniq" ON "__shared_pages_v_media_v_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_pages_v_media_v_points_order_idx" ON "__shared_pages_v_media_v_points" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_media_v_points_parent_id_idx" ON "__shared_pages_v_media_v_points" USING btree ("_parent_id");
  CREATE INDEX "__shared_pages_v_media_v_points_icon_idx" ON "__shared_pages_v_media_v_points" USING btree ("icon_id");
  CREATE UNIQUE INDEX "__shared_pages_v_media_v_points_locales_locale_parent_id_uni" ON "__shared_pages_v_media_v_points_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_pages_v_media_v_buttons_order_idx" ON "__shared_pages_v_media_v_buttons" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_media_v_buttons_parent_id_idx" ON "__shared_pages_v_media_v_buttons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "__shared_pages_v_media_v_buttons_locales_locale_parent_id_un" ON "__shared_pages_v_media_v_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_pages_v_media_v_order_idx" ON "__shared_pages_v_media_v" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_media_v_parent_id_idx" ON "__shared_pages_v_media_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_pages_v_media_v_path_idx" ON "__shared_pages_v_media_v" USING btree ("_path");
  CREATE INDEX "__shared_pages_v_media_v_appearance_appearance_backgroun_idx" ON "__shared_pages_v_media_v" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "__shared_pages_v_media_v_locales_locale_parent_id_unique" ON "__shared_pages_v_media_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___shared_pages_v_grid_v_head_btn_v_order_idx" ON "___shared_pages_v_grid_v_head_btn_v" USING btree ("_order");
  CREATE INDEX "___shared_pages_v_grid_v_head_btn_v_parent_id_idx" ON "___shared_pages_v_grid_v_head_btn_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "___shared_pages_v_grid_v_head_btn_v_locales_locale_parent_id" ON "___shared_pages_v_grid_v_head_btn_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_pages_v_grid_v_items_order_idx" ON "__shared_pages_v_grid_v_items" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_grid_v_items_parent_id_idx" ON "__shared_pages_v_grid_v_items" USING btree ("_parent_id");
  CREATE INDEX "__shared_pages_v_grid_v_items_icon_idx" ON "__shared_pages_v_grid_v_items" USING btree ("icon_id");
  CREATE UNIQUE INDEX "__shared_pages_v_grid_v_items_locales_locale_parent_id_uniqu" ON "__shared_pages_v_grid_v_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___shared_pages_v_grid_v_foot_btn_v_order_idx" ON "___shared_pages_v_grid_v_foot_btn_v" USING btree ("_order");
  CREATE INDEX "___shared_pages_v_grid_v_foot_btn_v_parent_id_idx" ON "___shared_pages_v_grid_v_foot_btn_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "___shared_pages_v_grid_v_foot_btn_v_locales_locale_parent_id" ON "___shared_pages_v_grid_v_foot_btn_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_pages_v_grid_v_order_idx" ON "__shared_pages_v_grid_v" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_grid_v_parent_id_idx" ON "__shared_pages_v_grid_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_pages_v_grid_v_path_idx" ON "__shared_pages_v_grid_v" USING btree ("_path");
  CREATE INDEX "__shared_pages_v_grid_v_top_image_idx" ON "__shared_pages_v_grid_v" USING btree ("top_image_id");
  CREATE INDEX "__shared_pages_v_grid_v_bottom_image_idx" ON "__shared_pages_v_grid_v" USING btree ("bottom_image_id");
  CREATE INDEX "__shared_pages_v_grid_v_appearance_appearance_background_idx" ON "__shared_pages_v_grid_v" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "__shared_pages_v_grid_v_locales_locale_parent_id_unique" ON "__shared_pages_v_grid_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_pages_v_vm_v_mission_items_order_idx" ON "__shared_pages_v_vm_v_mission_items" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_vm_v_mission_items_parent_id_idx" ON "__shared_pages_v_vm_v_mission_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "__shared_pages_v_vm_v_mission_items_locales_locale_parent_id" ON "__shared_pages_v_vm_v_mission_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_pages_v_vm_v_order_idx" ON "__shared_pages_v_vm_v" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_vm_v_parent_id_idx" ON "__shared_pages_v_vm_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_pages_v_vm_v_path_idx" ON "__shared_pages_v_vm_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__shared_pages_v_vm_v_locales_locale_parent_id_unique" ON "__shared_pages_v_vm_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___shared_pages_v_tl_v_entries_evt_v_order_idx" ON "___shared_pages_v_tl_v_entries_evt_v" USING btree ("_order");
  CREATE INDEX "___shared_pages_v_tl_v_entries_evt_v_parent_id_idx" ON "___shared_pages_v_tl_v_entries_evt_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "___shared_pages_v_tl_v_entries_evt_v_locales_locale_parent_i" ON "___shared_pages_v_tl_v_entries_evt_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_pages_v_tl_v_entries_order_idx" ON "__shared_pages_v_tl_v_entries" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_tl_v_entries_parent_id_idx" ON "__shared_pages_v_tl_v_entries" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "__shared_pages_v_tl_v_entries_locales_locale_parent_id_uniqu" ON "__shared_pages_v_tl_v_entries_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_pages_v_tl_v_buttons_order_idx" ON "__shared_pages_v_tl_v_buttons" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_tl_v_buttons_parent_id_idx" ON "__shared_pages_v_tl_v_buttons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "__shared_pages_v_tl_v_buttons_locales_locale_parent_id_uniqu" ON "__shared_pages_v_tl_v_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_pages_v_tl_v_order_idx" ON "__shared_pages_v_tl_v" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_tl_v_parent_id_idx" ON "__shared_pages_v_tl_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_pages_v_tl_v_path_idx" ON "__shared_pages_v_tl_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__shared_pages_v_tl_v_locales_locale_parent_id_unique" ON "__shared_pages_v_tl_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_hero_slides_btn_order_idx" ON "detail_templates_hero_slides_btn" USING btree ("_order");
  CREATE INDEX "detail_templates_hero_slides_btn_parent_id_idx" ON "detail_templates_hero_slides_btn" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "detail_templates_hero_slides_btn_locales_locale_parent_id_un" ON "detail_templates_hero_slides_btn_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_hero_slides_order_idx" ON "detail_templates_hero_slides" USING btree ("_order");
  CREATE INDEX "detail_templates_hero_slides_parent_id_idx" ON "detail_templates_hero_slides" USING btree ("_parent_id");
  CREATE INDEX "detail_templates_hero_slides_background_image_idx" ON "detail_templates_hero_slides" USING btree ("background_image_id");
  CREATE UNIQUE INDEX "detail_templates_hero_slides_locales_locale_parent_id_unique" ON "detail_templates_hero_slides_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_hero_stats_order_idx" ON "detail_templates_hero_stats" USING btree ("_order");
  CREATE INDEX "detail_templates_hero_stats_parent_id_idx" ON "detail_templates_hero_stats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "detail_templates_hero_stats_locales_locale_parent_id_unique" ON "detail_templates_hero_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_hero_order_idx" ON "detail_templates_hero" USING btree ("_order");
  CREATE INDEX "detail_templates_hero_parent_id_idx" ON "detail_templates_hero" USING btree ("_parent_id");
  CREATE INDEX "detail_templates_hero_path_idx" ON "detail_templates_hero" USING btree ("_path");
  CREATE INDEX "detail_templates_phero_order_idx" ON "detail_templates_phero" USING btree ("_order");
  CREATE INDEX "detail_templates_phero_parent_id_idx" ON "detail_templates_phero" USING btree ("_parent_id");
  CREATE INDEX "detail_templates_phero_path_idx" ON "detail_templates_phero" USING btree ("_path");
  CREATE INDEX "detail_templates_phero_background_image_idx" ON "detail_templates_phero" USING btree ("background_image_id");
  CREATE UNIQUE INDEX "detail_templates_phero_locales_locale_parent_id_unique" ON "detail_templates_phero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_media_images_order_idx" ON "detail_templates_media_images" USING btree ("_order");
  CREATE INDEX "detail_templates_media_images_parent_id_idx" ON "detail_templates_media_images" USING btree ("_parent_id");
  CREATE INDEX "detail_templates_media_images_image_idx" ON "detail_templates_media_images" USING btree ("image_id");
  CREATE INDEX "detail_templates_media_stats_order_idx" ON "detail_templates_media_stats" USING btree ("_order");
  CREATE INDEX "detail_templates_media_stats_parent_id_idx" ON "detail_templates_media_stats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "detail_templates_media_stats_locales_locale_parent_id_unique" ON "detail_templates_media_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_media_points_order_idx" ON "detail_templates_media_points" USING btree ("_order");
  CREATE INDEX "detail_templates_media_points_parent_id_idx" ON "detail_templates_media_points" USING btree ("_parent_id");
  CREATE INDEX "detail_templates_media_points_icon_idx" ON "detail_templates_media_points" USING btree ("icon_id");
  CREATE UNIQUE INDEX "detail_templates_media_points_locales_locale_parent_id_uniqu" ON "detail_templates_media_points_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_media_buttons_order_idx" ON "detail_templates_media_buttons" USING btree ("_order");
  CREATE INDEX "detail_templates_media_buttons_parent_id_idx" ON "detail_templates_media_buttons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "detail_templates_media_buttons_locales_locale_parent_id_uniq" ON "detail_templates_media_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_media_order_idx" ON "detail_templates_media" USING btree ("_order");
  CREATE INDEX "detail_templates_media_parent_id_idx" ON "detail_templates_media" USING btree ("_parent_id");
  CREATE INDEX "detail_templates_media_path_idx" ON "detail_templates_media" USING btree ("_path");
  CREATE INDEX "detail_templates_media_appearance_appearance_background__idx" ON "detail_templates_media" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "detail_templates_media_locales_locale_parent_id_unique" ON "detail_templates_media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_grid_head_btn_order_idx" ON "detail_templates_grid_head_btn" USING btree ("_order");
  CREATE INDEX "detail_templates_grid_head_btn_parent_id_idx" ON "detail_templates_grid_head_btn" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "detail_templates_grid_head_btn_locales_locale_parent_id_uniq" ON "detail_templates_grid_head_btn_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_grid_items_order_idx" ON "detail_templates_grid_items" USING btree ("_order");
  CREATE INDEX "detail_templates_grid_items_parent_id_idx" ON "detail_templates_grid_items" USING btree ("_parent_id");
  CREATE INDEX "detail_templates_grid_items_icon_idx" ON "detail_templates_grid_items" USING btree ("icon_id");
  CREATE UNIQUE INDEX "detail_templates_grid_items_locales_locale_parent_id_unique" ON "detail_templates_grid_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_grid_foot_btn_order_idx" ON "detail_templates_grid_foot_btn" USING btree ("_order");
  CREATE INDEX "detail_templates_grid_foot_btn_parent_id_idx" ON "detail_templates_grid_foot_btn" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "detail_templates_grid_foot_btn_locales_locale_parent_id_uniq" ON "detail_templates_grid_foot_btn_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_grid_order_idx" ON "detail_templates_grid" USING btree ("_order");
  CREATE INDEX "detail_templates_grid_parent_id_idx" ON "detail_templates_grid" USING btree ("_parent_id");
  CREATE INDEX "detail_templates_grid_path_idx" ON "detail_templates_grid" USING btree ("_path");
  CREATE INDEX "detail_templates_grid_top_image_idx" ON "detail_templates_grid" USING btree ("top_image_id");
  CREATE INDEX "detail_templates_grid_bottom_image_idx" ON "detail_templates_grid" USING btree ("bottom_image_id");
  CREATE INDEX "detail_templates_grid_appearance_appearance_background_i_idx" ON "detail_templates_grid" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "detail_templates_grid_locales_locale_parent_id_unique" ON "detail_templates_grid_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_vm_mission_items_order_idx" ON "detail_templates_vm_mission_items" USING btree ("_order");
  CREATE INDEX "detail_templates_vm_mission_items_parent_id_idx" ON "detail_templates_vm_mission_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "detail_templates_vm_mission_items_locales_locale_parent_id_u" ON "detail_templates_vm_mission_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_vm_order_idx" ON "detail_templates_vm" USING btree ("_order");
  CREATE INDEX "detail_templates_vm_parent_id_idx" ON "detail_templates_vm" USING btree ("_parent_id");
  CREATE INDEX "detail_templates_vm_path_idx" ON "detail_templates_vm" USING btree ("_path");
  CREATE UNIQUE INDEX "detail_templates_vm_locales_locale_parent_id_unique" ON "detail_templates_vm_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_tl_entries_evt_order_idx" ON "detail_templates_tl_entries_evt" USING btree ("_order");
  CREATE INDEX "detail_templates_tl_entries_evt_parent_id_idx" ON "detail_templates_tl_entries_evt" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "detail_templates_tl_entries_evt_locales_locale_parent_id_uni" ON "detail_templates_tl_entries_evt_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_tl_entries_order_idx" ON "detail_templates_tl_entries" USING btree ("_order");
  CREATE INDEX "detail_templates_tl_entries_parent_id_idx" ON "detail_templates_tl_entries" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "detail_templates_tl_entries_locales_locale_parent_id_unique" ON "detail_templates_tl_entries_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_tl_buttons_order_idx" ON "detail_templates_tl_buttons" USING btree ("_order");
  CREATE INDEX "detail_templates_tl_buttons_parent_id_idx" ON "detail_templates_tl_buttons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "detail_templates_tl_buttons_locales_locale_parent_id_unique" ON "detail_templates_tl_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_tl_order_idx" ON "detail_templates_tl" USING btree ("_order");
  CREATE INDEX "detail_templates_tl_parent_id_idx" ON "detail_templates_tl" USING btree ("_parent_id");
  CREATE INDEX "detail_templates_tl_path_idx" ON "detail_templates_tl" USING btree ("_path");
  CREATE UNIQUE INDEX "detail_templates_tl_locales_locale_parent_id_unique" ON "detail_templates_tl_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_rels_order_idx" ON "detail_templates_rels" USING btree ("order");
  CREATE INDEX "detail_templates_rels_parent_idx" ON "detail_templates_rels" USING btree ("parent_id");
  CREATE INDEX "detail_templates_rels_path_idx" ON "detail_templates_rels" USING btree ("path");
  CREATE INDEX "detail_templates_rels_pages_id_idx" ON "detail_templates_rels" USING btree ("pages_id");
  CREATE INDEX "detail_templates_rels_shared_pages_id_idx" ON "detail_templates_rels" USING btree ("shared_pages_id");
  CREATE INDEX "detail_templates_rels_products_id_idx" ON "detail_templates_rels" USING btree ("products_id");
  CREATE INDEX "detail_templates_rels_solutions_id_idx" ON "detail_templates_rels" USING btree ("solutions_id");
  CREATE INDEX "detail_templates_rels_jobs_id_idx" ON "detail_templates_rels" USING btree ("jobs_id");
  CREATE INDEX "detail_templates_rels_posts_id_idx" ON "detail_templates_rels" USING btree ("posts_id");
  CREATE INDEX "detail_templates_rels_categories_id_idx" ON "detail_templates_rels" USING btree ("categories_id");
  CREATE INDEX "___detail_templates_v_hero_v_slides_btn_v_order_idx" ON "___detail_templates_v_hero_v_slides_btn_v" USING btree ("_order");
  CREATE INDEX "___detail_templates_v_hero_v_slides_btn_v_parent_id_idx" ON "___detail_templates_v_hero_v_slides_btn_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "___detail_templates_v_hero_v_slides_btn_v_locales_locale_par" ON "___detail_templates_v_hero_v_slides_btn_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__detail_templates_v_hero_v_slides_order_idx" ON "__detail_templates_v_hero_v_slides" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_hero_v_slides_parent_id_idx" ON "__detail_templates_v_hero_v_slides" USING btree ("_parent_id");
  CREATE INDEX "__detail_templates_v_hero_v_slides_background_image_idx" ON "__detail_templates_v_hero_v_slides" USING btree ("background_image_id");
  CREATE UNIQUE INDEX "__detail_templates_v_hero_v_slides_locales_locale_parent_id_" ON "__detail_templates_v_hero_v_slides_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__detail_templates_v_hero_v_stats_order_idx" ON "__detail_templates_v_hero_v_stats" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_hero_v_stats_parent_id_idx" ON "__detail_templates_v_hero_v_stats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "__detail_templates_v_hero_v_stats_locales_locale_parent_id_u" ON "__detail_templates_v_hero_v_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__detail_templates_v_hero_v_order_idx" ON "__detail_templates_v_hero_v" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_hero_v_parent_id_idx" ON "__detail_templates_v_hero_v" USING btree ("_parent_id");
  CREATE INDEX "__detail_templates_v_hero_v_path_idx" ON "__detail_templates_v_hero_v" USING btree ("_path");
  CREATE INDEX "__detail_templates_v_phero_v_order_idx" ON "__detail_templates_v_phero_v" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_phero_v_parent_id_idx" ON "__detail_templates_v_phero_v" USING btree ("_parent_id");
  CREATE INDEX "__detail_templates_v_phero_v_path_idx" ON "__detail_templates_v_phero_v" USING btree ("_path");
  CREATE INDEX "__detail_templates_v_phero_v_background_image_idx" ON "__detail_templates_v_phero_v" USING btree ("background_image_id");
  CREATE UNIQUE INDEX "__detail_templates_v_phero_v_locales_locale_parent_id_unique" ON "__detail_templates_v_phero_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__detail_templates_v_media_v_images_order_idx" ON "__detail_templates_v_media_v_images" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_media_v_images_parent_id_idx" ON "__detail_templates_v_media_v_images" USING btree ("_parent_id");
  CREATE INDEX "__detail_templates_v_media_v_images_image_idx" ON "__detail_templates_v_media_v_images" USING btree ("image_id");
  CREATE INDEX "__detail_templates_v_media_v_stats_order_idx" ON "__detail_templates_v_media_v_stats" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_media_v_stats_parent_id_idx" ON "__detail_templates_v_media_v_stats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "__detail_templates_v_media_v_stats_locales_locale_parent_id_" ON "__detail_templates_v_media_v_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__detail_templates_v_media_v_points_order_idx" ON "__detail_templates_v_media_v_points" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_media_v_points_parent_id_idx" ON "__detail_templates_v_media_v_points" USING btree ("_parent_id");
  CREATE INDEX "__detail_templates_v_media_v_points_icon_idx" ON "__detail_templates_v_media_v_points" USING btree ("icon_id");
  CREATE UNIQUE INDEX "__detail_templates_v_media_v_points_locales_locale_parent_id" ON "__detail_templates_v_media_v_points_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__detail_templates_v_media_v_buttons_order_idx" ON "__detail_templates_v_media_v_buttons" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_media_v_buttons_parent_id_idx" ON "__detail_templates_v_media_v_buttons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "__detail_templates_v_media_v_buttons_locales_locale_parent_i" ON "__detail_templates_v_media_v_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__detail_templates_v_media_v_order_idx" ON "__detail_templates_v_media_v" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_media_v_parent_id_idx" ON "__detail_templates_v_media_v" USING btree ("_parent_id");
  CREATE INDEX "__detail_templates_v_media_v_path_idx" ON "__detail_templates_v_media_v" USING btree ("_path");
  CREATE INDEX "__detail_templates_v_media_v_appearance_appearance_backg_idx" ON "__detail_templates_v_media_v" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "__detail_templates_v_media_v_locales_locale_parent_id_unique" ON "__detail_templates_v_media_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___detail_templates_v_grid_v_head_btn_v_order_idx" ON "___detail_templates_v_grid_v_head_btn_v" USING btree ("_order");
  CREATE INDEX "___detail_templates_v_grid_v_head_btn_v_parent_id_idx" ON "___detail_templates_v_grid_v_head_btn_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "___detail_templates_v_grid_v_head_btn_v_locales_locale_paren" ON "___detail_templates_v_grid_v_head_btn_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__detail_templates_v_grid_v_items_order_idx" ON "__detail_templates_v_grid_v_items" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_grid_v_items_parent_id_idx" ON "__detail_templates_v_grid_v_items" USING btree ("_parent_id");
  CREATE INDEX "__detail_templates_v_grid_v_items_icon_idx" ON "__detail_templates_v_grid_v_items" USING btree ("icon_id");
  CREATE UNIQUE INDEX "__detail_templates_v_grid_v_items_locales_locale_parent_id_u" ON "__detail_templates_v_grid_v_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___detail_templates_v_grid_v_foot_btn_v_order_idx" ON "___detail_templates_v_grid_v_foot_btn_v" USING btree ("_order");
  CREATE INDEX "___detail_templates_v_grid_v_foot_btn_v_parent_id_idx" ON "___detail_templates_v_grid_v_foot_btn_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "___detail_templates_v_grid_v_foot_btn_v_locales_locale_paren" ON "___detail_templates_v_grid_v_foot_btn_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__detail_templates_v_grid_v_order_idx" ON "__detail_templates_v_grid_v" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_grid_v_parent_id_idx" ON "__detail_templates_v_grid_v" USING btree ("_parent_id");
  CREATE INDEX "__detail_templates_v_grid_v_path_idx" ON "__detail_templates_v_grid_v" USING btree ("_path");
  CREATE INDEX "__detail_templates_v_grid_v_top_image_idx" ON "__detail_templates_v_grid_v" USING btree ("top_image_id");
  CREATE INDEX "__detail_templates_v_grid_v_bottom_image_idx" ON "__detail_templates_v_grid_v" USING btree ("bottom_image_id");
  CREATE INDEX "__detail_templates_v_grid_v_appearance_appearance_backgr_idx" ON "__detail_templates_v_grid_v" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "__detail_templates_v_grid_v_locales_locale_parent_id_unique" ON "__detail_templates_v_grid_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__detail_templates_v_vm_v_mission_items_order_idx" ON "__detail_templates_v_vm_v_mission_items" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_vm_v_mission_items_parent_id_idx" ON "__detail_templates_v_vm_v_mission_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "__detail_templates_v_vm_v_mission_items_locales_locale_paren" ON "__detail_templates_v_vm_v_mission_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__detail_templates_v_vm_v_order_idx" ON "__detail_templates_v_vm_v" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_vm_v_parent_id_idx" ON "__detail_templates_v_vm_v" USING btree ("_parent_id");
  CREATE INDEX "__detail_templates_v_vm_v_path_idx" ON "__detail_templates_v_vm_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__detail_templates_v_vm_v_locales_locale_parent_id_unique" ON "__detail_templates_v_vm_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___detail_templates_v_tl_v_entries_evt_v_order_idx" ON "___detail_templates_v_tl_v_entries_evt_v" USING btree ("_order");
  CREATE INDEX "___detail_templates_v_tl_v_entries_evt_v_parent_id_idx" ON "___detail_templates_v_tl_v_entries_evt_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "___detail_templates_v_tl_v_entries_evt_v_locales_locale_pare" ON "___detail_templates_v_tl_v_entries_evt_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__detail_templates_v_tl_v_entries_order_idx" ON "__detail_templates_v_tl_v_entries" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_tl_v_entries_parent_id_idx" ON "__detail_templates_v_tl_v_entries" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "__detail_templates_v_tl_v_entries_locales_locale_parent_id_u" ON "__detail_templates_v_tl_v_entries_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__detail_templates_v_tl_v_buttons_order_idx" ON "__detail_templates_v_tl_v_buttons" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_tl_v_buttons_parent_id_idx" ON "__detail_templates_v_tl_v_buttons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "__detail_templates_v_tl_v_buttons_locales_locale_parent_id_u" ON "__detail_templates_v_tl_v_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__detail_templates_v_tl_v_order_idx" ON "__detail_templates_v_tl_v" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_tl_v_parent_id_idx" ON "__detail_templates_v_tl_v" USING btree ("_parent_id");
  CREATE INDEX "__detail_templates_v_tl_v_path_idx" ON "__detail_templates_v_tl_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__detail_templates_v_tl_v_locales_locale_parent_id_unique" ON "__detail_templates_v_tl_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_detail_templates_v_rels_order_idx" ON "_detail_templates_v_rels" USING btree ("order");
  CREATE INDEX "_detail_templates_v_rels_parent_idx" ON "_detail_templates_v_rels" USING btree ("parent_id");
  CREATE INDEX "_detail_templates_v_rels_path_idx" ON "_detail_templates_v_rels" USING btree ("path");
  CREATE INDEX "_detail_templates_v_rels_pages_id_idx" ON "_detail_templates_v_rels" USING btree ("pages_id");
  CREATE INDEX "_detail_templates_v_rels_shared_pages_id_idx" ON "_detail_templates_v_rels" USING btree ("shared_pages_id");
  CREATE INDEX "_detail_templates_v_rels_products_id_idx" ON "_detail_templates_v_rels" USING btree ("products_id");
  CREATE INDEX "_detail_templates_v_rels_solutions_id_idx" ON "_detail_templates_v_rels" USING btree ("solutions_id");
  CREATE INDEX "_detail_templates_v_rels_jobs_id_idx" ON "_detail_templates_v_rels" USING btree ("jobs_id");
  CREATE INDEX "_detail_templates_v_rels_posts_id_idx" ON "_detail_templates_v_rels" USING btree ("posts_id");
  CREATE INDEX "_detail_templates_v_rels_categories_id_idx" ON "_detail_templates_v_rels" USING btree ("categories_id");
  CREATE INDEX "shared_detail_templates_hero_slides_btn_order_idx" ON "shared_detail_templates_hero_slides_btn" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_hero_slides_btn_parent_id_idx" ON "shared_detail_templates_hero_slides_btn" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shared_detail_templates_hero_slides_btn_locales_locale_paren" ON "shared_detail_templates_hero_slides_btn_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_hero_slides_order_idx" ON "shared_detail_templates_hero_slides" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_hero_slides_parent_id_idx" ON "shared_detail_templates_hero_slides" USING btree ("_parent_id");
  CREATE INDEX "shared_detail_templates_hero_slides_background_image_idx" ON "shared_detail_templates_hero_slides" USING btree ("background_image_id");
  CREATE UNIQUE INDEX "shared_detail_templates_hero_slides_locales_locale_parent_id" ON "shared_detail_templates_hero_slides_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_hero_stats_order_idx" ON "shared_detail_templates_hero_stats" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_hero_stats_parent_id_idx" ON "shared_detail_templates_hero_stats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shared_detail_templates_hero_stats_locales_locale_parent_id_" ON "shared_detail_templates_hero_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_hero_order_idx" ON "shared_detail_templates_hero" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_hero_parent_id_idx" ON "shared_detail_templates_hero" USING btree ("_parent_id");
  CREATE INDEX "shared_detail_templates_hero_path_idx" ON "shared_detail_templates_hero" USING btree ("_path");
  CREATE INDEX "shared_detail_templates_phero_order_idx" ON "shared_detail_templates_phero" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_phero_parent_id_idx" ON "shared_detail_templates_phero" USING btree ("_parent_id");
  CREATE INDEX "shared_detail_templates_phero_path_idx" ON "shared_detail_templates_phero" USING btree ("_path");
  CREATE INDEX "shared_detail_templates_phero_background_image_idx" ON "shared_detail_templates_phero" USING btree ("background_image_id");
  CREATE UNIQUE INDEX "shared_detail_templates_phero_locales_locale_parent_id_uniqu" ON "shared_detail_templates_phero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_media_images_order_idx" ON "shared_detail_templates_media_images" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_media_images_parent_id_idx" ON "shared_detail_templates_media_images" USING btree ("_parent_id");
  CREATE INDEX "shared_detail_templates_media_images_image_idx" ON "shared_detail_templates_media_images" USING btree ("image_id");
  CREATE INDEX "shared_detail_templates_media_stats_order_idx" ON "shared_detail_templates_media_stats" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_media_stats_parent_id_idx" ON "shared_detail_templates_media_stats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shared_detail_templates_media_stats_locales_locale_parent_id" ON "shared_detail_templates_media_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_media_points_order_idx" ON "shared_detail_templates_media_points" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_media_points_parent_id_idx" ON "shared_detail_templates_media_points" USING btree ("_parent_id");
  CREATE INDEX "shared_detail_templates_media_points_icon_idx" ON "shared_detail_templates_media_points" USING btree ("icon_id");
  CREATE UNIQUE INDEX "shared_detail_templates_media_points_locales_locale_parent_i" ON "shared_detail_templates_media_points_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_media_buttons_order_idx" ON "shared_detail_templates_media_buttons" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_media_buttons_parent_id_idx" ON "shared_detail_templates_media_buttons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shared_detail_templates_media_buttons_locales_locale_parent_" ON "shared_detail_templates_media_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_media_order_idx" ON "shared_detail_templates_media" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_media_parent_id_idx" ON "shared_detail_templates_media" USING btree ("_parent_id");
  CREATE INDEX "shared_detail_templates_media_path_idx" ON "shared_detail_templates_media" USING btree ("_path");
  CREATE INDEX "shared_detail_templates_media_appearance_appearance_back_idx" ON "shared_detail_templates_media" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "shared_detail_templates_media_locales_locale_parent_id_uniqu" ON "shared_detail_templates_media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_grid_head_btn_order_idx" ON "shared_detail_templates_grid_head_btn" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_grid_head_btn_parent_id_idx" ON "shared_detail_templates_grid_head_btn" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shared_detail_templates_grid_head_btn_locales_locale_parent_" ON "shared_detail_templates_grid_head_btn_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_grid_items_order_idx" ON "shared_detail_templates_grid_items" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_grid_items_parent_id_idx" ON "shared_detail_templates_grid_items" USING btree ("_parent_id");
  CREATE INDEX "shared_detail_templates_grid_items_icon_idx" ON "shared_detail_templates_grid_items" USING btree ("icon_id");
  CREATE UNIQUE INDEX "shared_detail_templates_grid_items_locales_locale_parent_id_" ON "shared_detail_templates_grid_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_grid_foot_btn_order_idx" ON "shared_detail_templates_grid_foot_btn" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_grid_foot_btn_parent_id_idx" ON "shared_detail_templates_grid_foot_btn" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shared_detail_templates_grid_foot_btn_locales_locale_parent_" ON "shared_detail_templates_grid_foot_btn_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_grid_order_idx" ON "shared_detail_templates_grid" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_grid_parent_id_idx" ON "shared_detail_templates_grid" USING btree ("_parent_id");
  CREATE INDEX "shared_detail_templates_grid_path_idx" ON "shared_detail_templates_grid" USING btree ("_path");
  CREATE INDEX "shared_detail_templates_grid_top_image_idx" ON "shared_detail_templates_grid" USING btree ("top_image_id");
  CREATE INDEX "shared_detail_templates_grid_bottom_image_idx" ON "shared_detail_templates_grid" USING btree ("bottom_image_id");
  CREATE INDEX "shared_detail_templates_grid_appearance_appearance_backg_idx" ON "shared_detail_templates_grid" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "shared_detail_templates_grid_locales_locale_parent_id_unique" ON "shared_detail_templates_grid_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_vm_mission_items_order_idx" ON "shared_detail_templates_vm_mission_items" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_vm_mission_items_parent_id_idx" ON "shared_detail_templates_vm_mission_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shared_detail_templates_vm_mission_items_locales_locale_pare" ON "shared_detail_templates_vm_mission_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_vm_order_idx" ON "shared_detail_templates_vm" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_vm_parent_id_idx" ON "shared_detail_templates_vm" USING btree ("_parent_id");
  CREATE INDEX "shared_detail_templates_vm_path_idx" ON "shared_detail_templates_vm" USING btree ("_path");
  CREATE UNIQUE INDEX "shared_detail_templates_vm_locales_locale_parent_id_unique" ON "shared_detail_templates_vm_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_tl_entries_evt_order_idx" ON "shared_detail_templates_tl_entries_evt" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_tl_entries_evt_parent_id_idx" ON "shared_detail_templates_tl_entries_evt" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shared_detail_templates_tl_entries_evt_locales_locale_parent" ON "shared_detail_templates_tl_entries_evt_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_tl_entries_order_idx" ON "shared_detail_templates_tl_entries" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_tl_entries_parent_id_idx" ON "shared_detail_templates_tl_entries" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shared_detail_templates_tl_entries_locales_locale_parent_id_" ON "shared_detail_templates_tl_entries_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_tl_buttons_order_idx" ON "shared_detail_templates_tl_buttons" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_tl_buttons_parent_id_idx" ON "shared_detail_templates_tl_buttons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shared_detail_templates_tl_buttons_locales_locale_parent_id_" ON "shared_detail_templates_tl_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_tl_order_idx" ON "shared_detail_templates_tl" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_tl_parent_id_idx" ON "shared_detail_templates_tl" USING btree ("_parent_id");
  CREATE INDEX "shared_detail_templates_tl_path_idx" ON "shared_detail_templates_tl" USING btree ("_path");
  CREATE UNIQUE INDEX "shared_detail_templates_tl_locales_locale_parent_id_unique" ON "shared_detail_templates_tl_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_rels_order_idx" ON "shared_detail_templates_rels" USING btree ("order");
  CREATE INDEX "shared_detail_templates_rels_parent_idx" ON "shared_detail_templates_rels" USING btree ("parent_id");
  CREATE INDEX "shared_detail_templates_rels_path_idx" ON "shared_detail_templates_rels" USING btree ("path");
  CREATE INDEX "shared_detail_templates_rels_pages_id_idx" ON "shared_detail_templates_rels" USING btree ("pages_id");
  CREATE INDEX "shared_detail_templates_rels_shared_pages_id_idx" ON "shared_detail_templates_rels" USING btree ("shared_pages_id");
  CREATE INDEX "shared_detail_templates_rels_products_id_idx" ON "shared_detail_templates_rels" USING btree ("products_id");
  CREATE INDEX "shared_detail_templates_rels_solutions_id_idx" ON "shared_detail_templates_rels" USING btree ("solutions_id");
  CREATE INDEX "shared_detail_templates_rels_jobs_id_idx" ON "shared_detail_templates_rels" USING btree ("jobs_id");
  CREATE INDEX "shared_detail_templates_rels_posts_id_idx" ON "shared_detail_templates_rels" USING btree ("posts_id");
  CREATE INDEX "shared_detail_templates_rels_categories_id_idx" ON "shared_detail_templates_rels" USING btree ("categories_id");
  CREATE INDEX "___shared_detail_templates_v_hero_v_slides_btn_v_order_idx" ON "___shared_detail_templates_v_hero_v_slides_btn_v" USING btree ("_order");
  CREATE INDEX "___shared_detail_templates_v_hero_v_slides_btn_v_parent_id_idx" ON "___shared_detail_templates_v_hero_v_slides_btn_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "___shared_detail_templates_v_hero_v_slides_btn_v_locales_loc" ON "___shared_detail_templates_v_hero_v_slides_btn_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_hero_v_slides_order_idx" ON "__shared_detail_templates_v_hero_v_slides" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_hero_v_slides_parent_id_idx" ON "__shared_detail_templates_v_hero_v_slides" USING btree ("_parent_id");
  CREATE INDEX "__shared_detail_templates_v_hero_v_slides_background_ima_idx" ON "__shared_detail_templates_v_hero_v_slides" USING btree ("background_image_id");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_hero_v_slides_locales_locale_par" ON "__shared_detail_templates_v_hero_v_slides_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_hero_v_stats_order_idx" ON "__shared_detail_templates_v_hero_v_stats" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_hero_v_stats_parent_id_idx" ON "__shared_detail_templates_v_hero_v_stats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_hero_v_stats_locales_locale_pare" ON "__shared_detail_templates_v_hero_v_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_hero_v_order_idx" ON "__shared_detail_templates_v_hero_v" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_hero_v_parent_id_idx" ON "__shared_detail_templates_v_hero_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_detail_templates_v_hero_v_path_idx" ON "__shared_detail_templates_v_hero_v" USING btree ("_path");
  CREATE INDEX "__shared_detail_templates_v_phero_v_order_idx" ON "__shared_detail_templates_v_phero_v" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_phero_v_parent_id_idx" ON "__shared_detail_templates_v_phero_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_detail_templates_v_phero_v_path_idx" ON "__shared_detail_templates_v_phero_v" USING btree ("_path");
  CREATE INDEX "__shared_detail_templates_v_phero_v_background_image_idx" ON "__shared_detail_templates_v_phero_v" USING btree ("background_image_id");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_phero_v_locales_locale_parent_id" ON "__shared_detail_templates_v_phero_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_media_v_images_order_idx" ON "__shared_detail_templates_v_media_v_images" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_media_v_images_parent_id_idx" ON "__shared_detail_templates_v_media_v_images" USING btree ("_parent_id");
  CREATE INDEX "__shared_detail_templates_v_media_v_images_image_idx" ON "__shared_detail_templates_v_media_v_images" USING btree ("image_id");
  CREATE INDEX "__shared_detail_templates_v_media_v_stats_order_idx" ON "__shared_detail_templates_v_media_v_stats" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_media_v_stats_parent_id_idx" ON "__shared_detail_templates_v_media_v_stats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_media_v_stats_locales_locale_par" ON "__shared_detail_templates_v_media_v_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_media_v_points_order_idx" ON "__shared_detail_templates_v_media_v_points" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_media_v_points_parent_id_idx" ON "__shared_detail_templates_v_media_v_points" USING btree ("_parent_id");
  CREATE INDEX "__shared_detail_templates_v_media_v_points_icon_idx" ON "__shared_detail_templates_v_media_v_points" USING btree ("icon_id");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_media_v_points_locales_locale_pa" ON "__shared_detail_templates_v_media_v_points_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_media_v_buttons_order_idx" ON "__shared_detail_templates_v_media_v_buttons" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_media_v_buttons_parent_id_idx" ON "__shared_detail_templates_v_media_v_buttons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_media_v_buttons_locales_locale_p" ON "__shared_detail_templates_v_media_v_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_media_v_order_idx" ON "__shared_detail_templates_v_media_v" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_media_v_parent_id_idx" ON "__shared_detail_templates_v_media_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_detail_templates_v_media_v_path_idx" ON "__shared_detail_templates_v_media_v" USING btree ("_path");
  CREATE INDEX "__shared_detail_templates_v_media_v_appearance_appearanc_idx" ON "__shared_detail_templates_v_media_v" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_media_v_locales_locale_parent_id" ON "__shared_detail_templates_v_media_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___shared_detail_templates_v_grid_v_head_btn_v_order_idx" ON "___shared_detail_templates_v_grid_v_head_btn_v" USING btree ("_order");
  CREATE INDEX "___shared_detail_templates_v_grid_v_head_btn_v_parent_id_idx" ON "___shared_detail_templates_v_grid_v_head_btn_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "___shared_detail_templates_v_grid_v_head_btn_v_locales_local" ON "___shared_detail_templates_v_grid_v_head_btn_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_grid_v_items_order_idx" ON "__shared_detail_templates_v_grid_v_items" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_grid_v_items_parent_id_idx" ON "__shared_detail_templates_v_grid_v_items" USING btree ("_parent_id");
  CREATE INDEX "__shared_detail_templates_v_grid_v_items_icon_idx" ON "__shared_detail_templates_v_grid_v_items" USING btree ("icon_id");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_grid_v_items_locales_locale_pare" ON "__shared_detail_templates_v_grid_v_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___shared_detail_templates_v_grid_v_foot_btn_v_order_idx" ON "___shared_detail_templates_v_grid_v_foot_btn_v" USING btree ("_order");
  CREATE INDEX "___shared_detail_templates_v_grid_v_foot_btn_v_parent_id_idx" ON "___shared_detail_templates_v_grid_v_foot_btn_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "___shared_detail_templates_v_grid_v_foot_btn_v_locales_local" ON "___shared_detail_templates_v_grid_v_foot_btn_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_grid_v_order_idx" ON "__shared_detail_templates_v_grid_v" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_grid_v_parent_id_idx" ON "__shared_detail_templates_v_grid_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_detail_templates_v_grid_v_path_idx" ON "__shared_detail_templates_v_grid_v" USING btree ("_path");
  CREATE INDEX "__shared_detail_templates_v_grid_v_top_image_idx" ON "__shared_detail_templates_v_grid_v" USING btree ("top_image_id");
  CREATE INDEX "__shared_detail_templates_v_grid_v_bottom_image_idx" ON "__shared_detail_templates_v_grid_v" USING btree ("bottom_image_id");
  CREATE INDEX "__shared_detail_templates_v_grid_v_appearance_appearance_idx" ON "__shared_detail_templates_v_grid_v" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_grid_v_locales_locale_parent_id_" ON "__shared_detail_templates_v_grid_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_vm_v_mission_items_order_idx" ON "__shared_detail_templates_v_vm_v_mission_items" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_vm_v_mission_items_parent_id_idx" ON "__shared_detail_templates_v_vm_v_mission_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_vm_v_mission_items_locales_local" ON "__shared_detail_templates_v_vm_v_mission_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_vm_v_order_idx" ON "__shared_detail_templates_v_vm_v" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_vm_v_parent_id_idx" ON "__shared_detail_templates_v_vm_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_detail_templates_v_vm_v_path_idx" ON "__shared_detail_templates_v_vm_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_vm_v_locales_locale_parent_id_un" ON "__shared_detail_templates_v_vm_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___shared_detail_templates_v_tl_v_entries_evt_v_order_idx" ON "___shared_detail_templates_v_tl_v_entries_evt_v" USING btree ("_order");
  CREATE INDEX "___shared_detail_templates_v_tl_v_entries_evt_v_parent_id_idx" ON "___shared_detail_templates_v_tl_v_entries_evt_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "___shared_detail_templates_v_tl_v_entries_evt_v_locales_loca" ON "___shared_detail_templates_v_tl_v_entries_evt_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_tl_v_entries_order_idx" ON "__shared_detail_templates_v_tl_v_entries" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_tl_v_entries_parent_id_idx" ON "__shared_detail_templates_v_tl_v_entries" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_tl_v_entries_locales_locale_pare" ON "__shared_detail_templates_v_tl_v_entries_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_tl_v_buttons_order_idx" ON "__shared_detail_templates_v_tl_v_buttons" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_tl_v_buttons_parent_id_idx" ON "__shared_detail_templates_v_tl_v_buttons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_tl_v_buttons_locales_locale_pare" ON "__shared_detail_templates_v_tl_v_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_tl_v_order_idx" ON "__shared_detail_templates_v_tl_v" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_tl_v_parent_id_idx" ON "__shared_detail_templates_v_tl_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_detail_templates_v_tl_v_path_idx" ON "__shared_detail_templates_v_tl_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_tl_v_locales_locale_parent_id_un" ON "__shared_detail_templates_v_tl_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_shared_detail_templates_v_rels_order_idx" ON "_shared_detail_templates_v_rels" USING btree ("order");
  CREATE INDEX "_shared_detail_templates_v_rels_parent_idx" ON "_shared_detail_templates_v_rels" USING btree ("parent_id");
  CREATE INDEX "_shared_detail_templates_v_rels_path_idx" ON "_shared_detail_templates_v_rels" USING btree ("path");
  CREATE INDEX "_shared_detail_templates_v_rels_pages_id_idx" ON "_shared_detail_templates_v_rels" USING btree ("pages_id");
  CREATE INDEX "_shared_detail_templates_v_rels_shared_pages_id_idx" ON "_shared_detail_templates_v_rels" USING btree ("shared_pages_id");
  CREATE INDEX "_shared_detail_templates_v_rels_products_id_idx" ON "_shared_detail_templates_v_rels" USING btree ("products_id");
  CREATE INDEX "_shared_detail_templates_v_rels_solutions_id_idx" ON "_shared_detail_templates_v_rels" USING btree ("solutions_id");
  CREATE INDEX "_shared_detail_templates_v_rels_jobs_id_idx" ON "_shared_detail_templates_v_rels" USING btree ("jobs_id");
  CREATE INDEX "_shared_detail_templates_v_rels_posts_id_idx" ON "_shared_detail_templates_v_rels" USING btree ("posts_id");
  CREATE INDEX "_shared_detail_templates_v_rels_categories_id_idx" ON "_shared_detail_templates_v_rels" USING btree ("categories_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_hero_slides_btn" CASCADE;
  DROP TABLE "pages_hero_slides_btn_locales" CASCADE;
  DROP TABLE "pages_hero_slides" CASCADE;
  DROP TABLE "pages_hero_slides_locales" CASCADE;
  DROP TABLE "pages_hero_stats" CASCADE;
  DROP TABLE "pages_hero_stats_locales" CASCADE;
  DROP TABLE "pages_hero" CASCADE;
  DROP TABLE "pages_phero" CASCADE;
  DROP TABLE "pages_phero_locales" CASCADE;
  DROP TABLE "pages_media_images" CASCADE;
  DROP TABLE "pages_media_stats" CASCADE;
  DROP TABLE "pages_media_stats_locales" CASCADE;
  DROP TABLE "pages_media_points" CASCADE;
  DROP TABLE "pages_media_points_locales" CASCADE;
  DROP TABLE "pages_media_buttons" CASCADE;
  DROP TABLE "pages_media_buttons_locales" CASCADE;
  DROP TABLE "pages_media" CASCADE;
  DROP TABLE "pages_media_locales" CASCADE;
  DROP TABLE "pages_grid_head_btn" CASCADE;
  DROP TABLE "pages_grid_head_btn_locales" CASCADE;
  DROP TABLE "pages_grid_items" CASCADE;
  DROP TABLE "pages_grid_items_locales" CASCADE;
  DROP TABLE "pages_grid_foot_btn" CASCADE;
  DROP TABLE "pages_grid_foot_btn_locales" CASCADE;
  DROP TABLE "pages_grid" CASCADE;
  DROP TABLE "pages_grid_locales" CASCADE;
  DROP TABLE "pages_vm_mission_items" CASCADE;
  DROP TABLE "pages_vm_mission_items_locales" CASCADE;
  DROP TABLE "pages_vm" CASCADE;
  DROP TABLE "pages_vm_locales" CASCADE;
  DROP TABLE "pages_tl_entries_evt" CASCADE;
  DROP TABLE "pages_tl_entries_evt_locales" CASCADE;
  DROP TABLE "pages_tl_entries" CASCADE;
  DROP TABLE "pages_tl_entries_locales" CASCADE;
  DROP TABLE "pages_tl_buttons" CASCADE;
  DROP TABLE "pages_tl_buttons_locales" CASCADE;
  DROP TABLE "pages_tl" CASCADE;
  DROP TABLE "pages_tl_locales" CASCADE;
  DROP TABLE "___pages_v_hero_v_slides_btn_v" CASCADE;
  DROP TABLE "___pages_v_hero_v_slides_btn_v_locales" CASCADE;
  DROP TABLE "__pages_v_hero_v_slides" CASCADE;
  DROP TABLE "__pages_v_hero_v_slides_locales" CASCADE;
  DROP TABLE "__pages_v_hero_v_stats" CASCADE;
  DROP TABLE "__pages_v_hero_v_stats_locales" CASCADE;
  DROP TABLE "__pages_v_hero_v" CASCADE;
  DROP TABLE "__pages_v_phero_v" CASCADE;
  DROP TABLE "__pages_v_phero_v_locales" CASCADE;
  DROP TABLE "__pages_v_media_v_images" CASCADE;
  DROP TABLE "__pages_v_media_v_stats" CASCADE;
  DROP TABLE "__pages_v_media_v_stats_locales" CASCADE;
  DROP TABLE "__pages_v_media_v_points" CASCADE;
  DROP TABLE "__pages_v_media_v_points_locales" CASCADE;
  DROP TABLE "__pages_v_media_v_buttons" CASCADE;
  DROP TABLE "__pages_v_media_v_buttons_locales" CASCADE;
  DROP TABLE "__pages_v_media_v" CASCADE;
  DROP TABLE "__pages_v_media_v_locales" CASCADE;
  DROP TABLE "___pages_v_grid_v_head_btn_v" CASCADE;
  DROP TABLE "___pages_v_grid_v_head_btn_v_locales" CASCADE;
  DROP TABLE "__pages_v_grid_v_items" CASCADE;
  DROP TABLE "__pages_v_grid_v_items_locales" CASCADE;
  DROP TABLE "___pages_v_grid_v_foot_btn_v" CASCADE;
  DROP TABLE "___pages_v_grid_v_foot_btn_v_locales" CASCADE;
  DROP TABLE "__pages_v_grid_v" CASCADE;
  DROP TABLE "__pages_v_grid_v_locales" CASCADE;
  DROP TABLE "__pages_v_vm_v_mission_items" CASCADE;
  DROP TABLE "__pages_v_vm_v_mission_items_locales" CASCADE;
  DROP TABLE "__pages_v_vm_v" CASCADE;
  DROP TABLE "__pages_v_vm_v_locales" CASCADE;
  DROP TABLE "___pages_v_tl_v_entries_evt_v" CASCADE;
  DROP TABLE "___pages_v_tl_v_entries_evt_v_locales" CASCADE;
  DROP TABLE "__pages_v_tl_v_entries" CASCADE;
  DROP TABLE "__pages_v_tl_v_entries_locales" CASCADE;
  DROP TABLE "__pages_v_tl_v_buttons" CASCADE;
  DROP TABLE "__pages_v_tl_v_buttons_locales" CASCADE;
  DROP TABLE "__pages_v_tl_v" CASCADE;
  DROP TABLE "__pages_v_tl_v_locales" CASCADE;
  DROP TABLE "shared_pages_hero_slides_btn" CASCADE;
  DROP TABLE "shared_pages_hero_slides_btn_locales" CASCADE;
  DROP TABLE "shared_pages_hero_slides" CASCADE;
  DROP TABLE "shared_pages_hero_slides_locales" CASCADE;
  DROP TABLE "shared_pages_hero_stats" CASCADE;
  DROP TABLE "shared_pages_hero_stats_locales" CASCADE;
  DROP TABLE "shared_pages_hero" CASCADE;
  DROP TABLE "shared_pages_phero" CASCADE;
  DROP TABLE "shared_pages_phero_locales" CASCADE;
  DROP TABLE "shared_pages_media_images" CASCADE;
  DROP TABLE "shared_pages_media_stats" CASCADE;
  DROP TABLE "shared_pages_media_stats_locales" CASCADE;
  DROP TABLE "shared_pages_media_points" CASCADE;
  DROP TABLE "shared_pages_media_points_locales" CASCADE;
  DROP TABLE "shared_pages_media_buttons" CASCADE;
  DROP TABLE "shared_pages_media_buttons_locales" CASCADE;
  DROP TABLE "shared_pages_media" CASCADE;
  DROP TABLE "shared_pages_media_locales" CASCADE;
  DROP TABLE "shared_pages_grid_head_btn" CASCADE;
  DROP TABLE "shared_pages_grid_head_btn_locales" CASCADE;
  DROP TABLE "shared_pages_grid_items" CASCADE;
  DROP TABLE "shared_pages_grid_items_locales" CASCADE;
  DROP TABLE "shared_pages_grid_foot_btn" CASCADE;
  DROP TABLE "shared_pages_grid_foot_btn_locales" CASCADE;
  DROP TABLE "shared_pages_grid" CASCADE;
  DROP TABLE "shared_pages_grid_locales" CASCADE;
  DROP TABLE "shared_pages_vm_mission_items" CASCADE;
  DROP TABLE "shared_pages_vm_mission_items_locales" CASCADE;
  DROP TABLE "shared_pages_vm" CASCADE;
  DROP TABLE "shared_pages_vm_locales" CASCADE;
  DROP TABLE "shared_pages_tl_entries_evt" CASCADE;
  DROP TABLE "shared_pages_tl_entries_evt_locales" CASCADE;
  DROP TABLE "shared_pages_tl_entries" CASCADE;
  DROP TABLE "shared_pages_tl_entries_locales" CASCADE;
  DROP TABLE "shared_pages_tl_buttons" CASCADE;
  DROP TABLE "shared_pages_tl_buttons_locales" CASCADE;
  DROP TABLE "shared_pages_tl" CASCADE;
  DROP TABLE "shared_pages_tl_locales" CASCADE;
  DROP TABLE "___shared_pages_v_hero_v_slides_btn_v" CASCADE;
  DROP TABLE "___shared_pages_v_hero_v_slides_btn_v_locales" CASCADE;
  DROP TABLE "__shared_pages_v_hero_v_slides" CASCADE;
  DROP TABLE "__shared_pages_v_hero_v_slides_locales" CASCADE;
  DROP TABLE "__shared_pages_v_hero_v_stats" CASCADE;
  DROP TABLE "__shared_pages_v_hero_v_stats_locales" CASCADE;
  DROP TABLE "__shared_pages_v_hero_v" CASCADE;
  DROP TABLE "__shared_pages_v_phero_v" CASCADE;
  DROP TABLE "__shared_pages_v_phero_v_locales" CASCADE;
  DROP TABLE "__shared_pages_v_media_v_images" CASCADE;
  DROP TABLE "__shared_pages_v_media_v_stats" CASCADE;
  DROP TABLE "__shared_pages_v_media_v_stats_locales" CASCADE;
  DROP TABLE "__shared_pages_v_media_v_points" CASCADE;
  DROP TABLE "__shared_pages_v_media_v_points_locales" CASCADE;
  DROP TABLE "__shared_pages_v_media_v_buttons" CASCADE;
  DROP TABLE "__shared_pages_v_media_v_buttons_locales" CASCADE;
  DROP TABLE "__shared_pages_v_media_v" CASCADE;
  DROP TABLE "__shared_pages_v_media_v_locales" CASCADE;
  DROP TABLE "___shared_pages_v_grid_v_head_btn_v" CASCADE;
  DROP TABLE "___shared_pages_v_grid_v_head_btn_v_locales" CASCADE;
  DROP TABLE "__shared_pages_v_grid_v_items" CASCADE;
  DROP TABLE "__shared_pages_v_grid_v_items_locales" CASCADE;
  DROP TABLE "___shared_pages_v_grid_v_foot_btn_v" CASCADE;
  DROP TABLE "___shared_pages_v_grid_v_foot_btn_v_locales" CASCADE;
  DROP TABLE "__shared_pages_v_grid_v" CASCADE;
  DROP TABLE "__shared_pages_v_grid_v_locales" CASCADE;
  DROP TABLE "__shared_pages_v_vm_v_mission_items" CASCADE;
  DROP TABLE "__shared_pages_v_vm_v_mission_items_locales" CASCADE;
  DROP TABLE "__shared_pages_v_vm_v" CASCADE;
  DROP TABLE "__shared_pages_v_vm_v_locales" CASCADE;
  DROP TABLE "___shared_pages_v_tl_v_entries_evt_v" CASCADE;
  DROP TABLE "___shared_pages_v_tl_v_entries_evt_v_locales" CASCADE;
  DROP TABLE "__shared_pages_v_tl_v_entries" CASCADE;
  DROP TABLE "__shared_pages_v_tl_v_entries_locales" CASCADE;
  DROP TABLE "__shared_pages_v_tl_v_buttons" CASCADE;
  DROP TABLE "__shared_pages_v_tl_v_buttons_locales" CASCADE;
  DROP TABLE "__shared_pages_v_tl_v" CASCADE;
  DROP TABLE "__shared_pages_v_tl_v_locales" CASCADE;
  DROP TABLE "detail_templates_hero_slides_btn" CASCADE;
  DROP TABLE "detail_templates_hero_slides_btn_locales" CASCADE;
  DROP TABLE "detail_templates_hero_slides" CASCADE;
  DROP TABLE "detail_templates_hero_slides_locales" CASCADE;
  DROP TABLE "detail_templates_hero_stats" CASCADE;
  DROP TABLE "detail_templates_hero_stats_locales" CASCADE;
  DROP TABLE "detail_templates_hero" CASCADE;
  DROP TABLE "detail_templates_phero" CASCADE;
  DROP TABLE "detail_templates_phero_locales" CASCADE;
  DROP TABLE "detail_templates_media_images" CASCADE;
  DROP TABLE "detail_templates_media_stats" CASCADE;
  DROP TABLE "detail_templates_media_stats_locales" CASCADE;
  DROP TABLE "detail_templates_media_points" CASCADE;
  DROP TABLE "detail_templates_media_points_locales" CASCADE;
  DROP TABLE "detail_templates_media_buttons" CASCADE;
  DROP TABLE "detail_templates_media_buttons_locales" CASCADE;
  DROP TABLE "detail_templates_media" CASCADE;
  DROP TABLE "detail_templates_media_locales" CASCADE;
  DROP TABLE "detail_templates_grid_head_btn" CASCADE;
  DROP TABLE "detail_templates_grid_head_btn_locales" CASCADE;
  DROP TABLE "detail_templates_grid_items" CASCADE;
  DROP TABLE "detail_templates_grid_items_locales" CASCADE;
  DROP TABLE "detail_templates_grid_foot_btn" CASCADE;
  DROP TABLE "detail_templates_grid_foot_btn_locales" CASCADE;
  DROP TABLE "detail_templates_grid" CASCADE;
  DROP TABLE "detail_templates_grid_locales" CASCADE;
  DROP TABLE "detail_templates_vm_mission_items" CASCADE;
  DROP TABLE "detail_templates_vm_mission_items_locales" CASCADE;
  DROP TABLE "detail_templates_vm" CASCADE;
  DROP TABLE "detail_templates_vm_locales" CASCADE;
  DROP TABLE "detail_templates_tl_entries_evt" CASCADE;
  DROP TABLE "detail_templates_tl_entries_evt_locales" CASCADE;
  DROP TABLE "detail_templates_tl_entries" CASCADE;
  DROP TABLE "detail_templates_tl_entries_locales" CASCADE;
  DROP TABLE "detail_templates_tl_buttons" CASCADE;
  DROP TABLE "detail_templates_tl_buttons_locales" CASCADE;
  DROP TABLE "detail_templates_tl" CASCADE;
  DROP TABLE "detail_templates_tl_locales" CASCADE;
  DROP TABLE "detail_templates_rels" CASCADE;
  DROP TABLE "___detail_templates_v_hero_v_slides_btn_v" CASCADE;
  DROP TABLE "___detail_templates_v_hero_v_slides_btn_v_locales" CASCADE;
  DROP TABLE "__detail_templates_v_hero_v_slides" CASCADE;
  DROP TABLE "__detail_templates_v_hero_v_slides_locales" CASCADE;
  DROP TABLE "__detail_templates_v_hero_v_stats" CASCADE;
  DROP TABLE "__detail_templates_v_hero_v_stats_locales" CASCADE;
  DROP TABLE "__detail_templates_v_hero_v" CASCADE;
  DROP TABLE "__detail_templates_v_phero_v" CASCADE;
  DROP TABLE "__detail_templates_v_phero_v_locales" CASCADE;
  DROP TABLE "__detail_templates_v_media_v_images" CASCADE;
  DROP TABLE "__detail_templates_v_media_v_stats" CASCADE;
  DROP TABLE "__detail_templates_v_media_v_stats_locales" CASCADE;
  DROP TABLE "__detail_templates_v_media_v_points" CASCADE;
  DROP TABLE "__detail_templates_v_media_v_points_locales" CASCADE;
  DROP TABLE "__detail_templates_v_media_v_buttons" CASCADE;
  DROP TABLE "__detail_templates_v_media_v_buttons_locales" CASCADE;
  DROP TABLE "__detail_templates_v_media_v" CASCADE;
  DROP TABLE "__detail_templates_v_media_v_locales" CASCADE;
  DROP TABLE "___detail_templates_v_grid_v_head_btn_v" CASCADE;
  DROP TABLE "___detail_templates_v_grid_v_head_btn_v_locales" CASCADE;
  DROP TABLE "__detail_templates_v_grid_v_items" CASCADE;
  DROP TABLE "__detail_templates_v_grid_v_items_locales" CASCADE;
  DROP TABLE "___detail_templates_v_grid_v_foot_btn_v" CASCADE;
  DROP TABLE "___detail_templates_v_grid_v_foot_btn_v_locales" CASCADE;
  DROP TABLE "__detail_templates_v_grid_v" CASCADE;
  DROP TABLE "__detail_templates_v_grid_v_locales" CASCADE;
  DROP TABLE "__detail_templates_v_vm_v_mission_items" CASCADE;
  DROP TABLE "__detail_templates_v_vm_v_mission_items_locales" CASCADE;
  DROP TABLE "__detail_templates_v_vm_v" CASCADE;
  DROP TABLE "__detail_templates_v_vm_v_locales" CASCADE;
  DROP TABLE "___detail_templates_v_tl_v_entries_evt_v" CASCADE;
  DROP TABLE "___detail_templates_v_tl_v_entries_evt_v_locales" CASCADE;
  DROP TABLE "__detail_templates_v_tl_v_entries" CASCADE;
  DROP TABLE "__detail_templates_v_tl_v_entries_locales" CASCADE;
  DROP TABLE "__detail_templates_v_tl_v_buttons" CASCADE;
  DROP TABLE "__detail_templates_v_tl_v_buttons_locales" CASCADE;
  DROP TABLE "__detail_templates_v_tl_v" CASCADE;
  DROP TABLE "__detail_templates_v_tl_v_locales" CASCADE;
  DROP TABLE "_detail_templates_v_rels" CASCADE;
  DROP TABLE "shared_detail_templates_hero_slides_btn" CASCADE;
  DROP TABLE "shared_detail_templates_hero_slides_btn_locales" CASCADE;
  DROP TABLE "shared_detail_templates_hero_slides" CASCADE;
  DROP TABLE "shared_detail_templates_hero_slides_locales" CASCADE;
  DROP TABLE "shared_detail_templates_hero_stats" CASCADE;
  DROP TABLE "shared_detail_templates_hero_stats_locales" CASCADE;
  DROP TABLE "shared_detail_templates_hero" CASCADE;
  DROP TABLE "shared_detail_templates_phero" CASCADE;
  DROP TABLE "shared_detail_templates_phero_locales" CASCADE;
  DROP TABLE "shared_detail_templates_media_images" CASCADE;
  DROP TABLE "shared_detail_templates_media_stats" CASCADE;
  DROP TABLE "shared_detail_templates_media_stats_locales" CASCADE;
  DROP TABLE "shared_detail_templates_media_points" CASCADE;
  DROP TABLE "shared_detail_templates_media_points_locales" CASCADE;
  DROP TABLE "shared_detail_templates_media_buttons" CASCADE;
  DROP TABLE "shared_detail_templates_media_buttons_locales" CASCADE;
  DROP TABLE "shared_detail_templates_media" CASCADE;
  DROP TABLE "shared_detail_templates_media_locales" CASCADE;
  DROP TABLE "shared_detail_templates_grid_head_btn" CASCADE;
  DROP TABLE "shared_detail_templates_grid_head_btn_locales" CASCADE;
  DROP TABLE "shared_detail_templates_grid_items" CASCADE;
  DROP TABLE "shared_detail_templates_grid_items_locales" CASCADE;
  DROP TABLE "shared_detail_templates_grid_foot_btn" CASCADE;
  DROP TABLE "shared_detail_templates_grid_foot_btn_locales" CASCADE;
  DROP TABLE "shared_detail_templates_grid" CASCADE;
  DROP TABLE "shared_detail_templates_grid_locales" CASCADE;
  DROP TABLE "shared_detail_templates_vm_mission_items" CASCADE;
  DROP TABLE "shared_detail_templates_vm_mission_items_locales" CASCADE;
  DROP TABLE "shared_detail_templates_vm" CASCADE;
  DROP TABLE "shared_detail_templates_vm_locales" CASCADE;
  DROP TABLE "shared_detail_templates_tl_entries_evt" CASCADE;
  DROP TABLE "shared_detail_templates_tl_entries_evt_locales" CASCADE;
  DROP TABLE "shared_detail_templates_tl_entries" CASCADE;
  DROP TABLE "shared_detail_templates_tl_entries_locales" CASCADE;
  DROP TABLE "shared_detail_templates_tl_buttons" CASCADE;
  DROP TABLE "shared_detail_templates_tl_buttons_locales" CASCADE;
  DROP TABLE "shared_detail_templates_tl" CASCADE;
  DROP TABLE "shared_detail_templates_tl_locales" CASCADE;
  DROP TABLE "shared_detail_templates_rels" CASCADE;
  DROP TABLE "___shared_detail_templates_v_hero_v_slides_btn_v" CASCADE;
  DROP TABLE "___shared_detail_templates_v_hero_v_slides_btn_v_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_hero_v_slides" CASCADE;
  DROP TABLE "__shared_detail_templates_v_hero_v_slides_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_hero_v_stats" CASCADE;
  DROP TABLE "__shared_detail_templates_v_hero_v_stats_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_hero_v" CASCADE;
  DROP TABLE "__shared_detail_templates_v_phero_v" CASCADE;
  DROP TABLE "__shared_detail_templates_v_phero_v_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_media_v_images" CASCADE;
  DROP TABLE "__shared_detail_templates_v_media_v_stats" CASCADE;
  DROP TABLE "__shared_detail_templates_v_media_v_stats_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_media_v_points" CASCADE;
  DROP TABLE "__shared_detail_templates_v_media_v_points_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_media_v_buttons" CASCADE;
  DROP TABLE "__shared_detail_templates_v_media_v_buttons_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_media_v" CASCADE;
  DROP TABLE "__shared_detail_templates_v_media_v_locales" CASCADE;
  DROP TABLE "___shared_detail_templates_v_grid_v_head_btn_v" CASCADE;
  DROP TABLE "___shared_detail_templates_v_grid_v_head_btn_v_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_grid_v_items" CASCADE;
  DROP TABLE "__shared_detail_templates_v_grid_v_items_locales" CASCADE;
  DROP TABLE "___shared_detail_templates_v_grid_v_foot_btn_v" CASCADE;
  DROP TABLE "___shared_detail_templates_v_grid_v_foot_btn_v_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_grid_v" CASCADE;
  DROP TABLE "__shared_detail_templates_v_grid_v_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_vm_v_mission_items" CASCADE;
  DROP TABLE "__shared_detail_templates_v_vm_v_mission_items_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_vm_v" CASCADE;
  DROP TABLE "__shared_detail_templates_v_vm_v_locales" CASCADE;
  DROP TABLE "___shared_detail_templates_v_tl_v_entries_evt_v" CASCADE;
  DROP TABLE "___shared_detail_templates_v_tl_v_entries_evt_v_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_tl_v_entries" CASCADE;
  DROP TABLE "__shared_detail_templates_v_tl_v_entries_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_tl_v_buttons" CASCADE;
  DROP TABLE "__shared_detail_templates_v_tl_v_buttons_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_tl_v" CASCADE;
  DROP TABLE "__shared_detail_templates_v_tl_v_locales" CASCADE;
  DROP TABLE "_shared_detail_templates_v_rels" CASCADE;
  DROP TYPE "public"."enum_pages_hero_slides_btn_link_type";
  DROP TYPE "public"."enum_pages_hero_slides_btn_style";
  DROP TYPE "public"."enum_pages_phero_heading_align";
  DROP TYPE "public"."enum_pages_media_buttons_link_type";
  DROP TYPE "public"."enum_pages_media_buttons_style";
  DROP TYPE "public"."enum_pages_media_heading_align";
  DROP TYPE "public"."enum_pages_media_image_layout";
  DROP TYPE "public"."enum_pages_media_image_position";
  DROP TYPE "public"."enum_pages_media_points_layout";
  DROP TYPE "public"."enum_pages_media_appearance_background";
  DROP TYPE "public"."enum_pages_grid_head_btn_link_type";
  DROP TYPE "public"."enum_pages_grid_head_btn_style";
  DROP TYPE "public"."enum_pages_grid_foot_btn_link_type";
  DROP TYPE "public"."enum_pages_grid_foot_btn_style";
  DROP TYPE "public"."enum_pages_grid_heading_align";
  DROP TYPE "public"."enum_pages_grid_marker_style";
  DROP TYPE "public"."enum_pages_grid_card_style";
  DROP TYPE "public"."enum_pages_grid_columns";
  DROP TYPE "public"."enum_pages_grid_appearance_background";
  DROP TYPE "public"."enum_pages_vm_heading_align";
  DROP TYPE "public"."enum_pages_tl_buttons_link_type";
  DROP TYPE "public"."enum_pages_tl_buttons_style";
  DROP TYPE "public"."enum_pages_tl_variant";
  DROP TYPE "public"."enum_pages_tl_heading_align";
  DROP TYPE "public"."enum____pages_v_hero_v_slides_btn_v_link_type";
  DROP TYPE "public"."enum____pages_v_hero_v_slides_btn_v_style";
  DROP TYPE "public"."enum___pages_v_phero_v_heading_align";
  DROP TYPE "public"."enum___pages_v_media_v_buttons_link_type";
  DROP TYPE "public"."enum___pages_v_media_v_buttons_style";
  DROP TYPE "public"."enum___pages_v_media_v_heading_align";
  DROP TYPE "public"."enum___pages_v_media_v_image_layout";
  DROP TYPE "public"."enum___pages_v_media_v_image_position";
  DROP TYPE "public"."enum___pages_v_media_v_points_layout";
  DROP TYPE "public"."enum___pages_v_media_v_appearance_background";
  DROP TYPE "public"."enum____pages_v_grid_v_head_btn_v_link_type";
  DROP TYPE "public"."enum____pages_v_grid_v_head_btn_v_style";
  DROP TYPE "public"."enum____pages_v_grid_v_foot_btn_v_link_type";
  DROP TYPE "public"."enum____pages_v_grid_v_foot_btn_v_style";
  DROP TYPE "public"."enum___pages_v_grid_v_heading_align";
  DROP TYPE "public"."enum___pages_v_grid_v_marker_style";
  DROP TYPE "public"."enum___pages_v_grid_v_card_style";
  DROP TYPE "public"."enum___pages_v_grid_v_columns";
  DROP TYPE "public"."enum___pages_v_grid_v_appearance_background";
  DROP TYPE "public"."enum___pages_v_vm_v_heading_align";
  DROP TYPE "public"."enum___pages_v_tl_v_buttons_link_type";
  DROP TYPE "public"."enum___pages_v_tl_v_buttons_style";
  DROP TYPE "public"."enum___pages_v_tl_v_variant";
  DROP TYPE "public"."enum___pages_v_tl_v_heading_align";
  DROP TYPE "public"."enum_shared_pages_hero_slides_btn_link_type";
  DROP TYPE "public"."enum_shared_pages_hero_slides_btn_style";
  DROP TYPE "public"."enum_shared_pages_phero_heading_align";
  DROP TYPE "public"."enum_shared_pages_media_buttons_link_type";
  DROP TYPE "public"."enum_shared_pages_media_buttons_style";
  DROP TYPE "public"."enum_shared_pages_media_heading_align";
  DROP TYPE "public"."enum_shared_pages_media_image_layout";
  DROP TYPE "public"."enum_shared_pages_media_image_position";
  DROP TYPE "public"."enum_shared_pages_media_points_layout";
  DROP TYPE "public"."enum_shared_pages_media_appearance_background";
  DROP TYPE "public"."enum_shared_pages_grid_head_btn_link_type";
  DROP TYPE "public"."enum_shared_pages_grid_head_btn_style";
  DROP TYPE "public"."enum_shared_pages_grid_foot_btn_link_type";
  DROP TYPE "public"."enum_shared_pages_grid_foot_btn_style";
  DROP TYPE "public"."enum_shared_pages_grid_heading_align";
  DROP TYPE "public"."enum_shared_pages_grid_marker_style";
  DROP TYPE "public"."enum_shared_pages_grid_card_style";
  DROP TYPE "public"."enum_shared_pages_grid_columns";
  DROP TYPE "public"."enum_shared_pages_grid_appearance_background";
  DROP TYPE "public"."enum_shared_pages_vm_heading_align";
  DROP TYPE "public"."enum_shared_pages_tl_buttons_link_type";
  DROP TYPE "public"."enum_shared_pages_tl_buttons_style";
  DROP TYPE "public"."enum_shared_pages_tl_variant";
  DROP TYPE "public"."enum_shared_pages_tl_heading_align";
  DROP TYPE "public"."enum____shared_pages_v_hero_v_slides_btn_v_link_type";
  DROP TYPE "public"."enum____shared_pages_v_hero_v_slides_btn_v_style";
  DROP TYPE "public"."enum___shared_pages_v_phero_v_heading_align";
  DROP TYPE "public"."enum___shared_pages_v_media_v_buttons_link_type";
  DROP TYPE "public"."enum___shared_pages_v_media_v_buttons_style";
  DROP TYPE "public"."enum___shared_pages_v_media_v_heading_align";
  DROP TYPE "public"."enum___shared_pages_v_media_v_image_layout";
  DROP TYPE "public"."enum___shared_pages_v_media_v_image_position";
  DROP TYPE "public"."enum___shared_pages_v_media_v_points_layout";
  DROP TYPE "public"."enum___shared_pages_v_media_v_appearance_background";
  DROP TYPE "public"."enum____shared_pages_v_grid_v_head_btn_v_link_type";
  DROP TYPE "public"."enum____shared_pages_v_grid_v_head_btn_v_style";
  DROP TYPE "public"."enum____shared_pages_v_grid_v_foot_btn_v_link_type";
  DROP TYPE "public"."enum____shared_pages_v_grid_v_foot_btn_v_style";
  DROP TYPE "public"."enum___shared_pages_v_grid_v_heading_align";
  DROP TYPE "public"."enum___shared_pages_v_grid_v_marker_style";
  DROP TYPE "public"."enum___shared_pages_v_grid_v_card_style";
  DROP TYPE "public"."enum___shared_pages_v_grid_v_columns";
  DROP TYPE "public"."enum___shared_pages_v_grid_v_appearance_background";
  DROP TYPE "public"."enum___shared_pages_v_vm_v_heading_align";
  DROP TYPE "public"."enum___shared_pages_v_tl_v_buttons_link_type";
  DROP TYPE "public"."enum___shared_pages_v_tl_v_buttons_style";
  DROP TYPE "public"."enum___shared_pages_v_tl_v_variant";
  DROP TYPE "public"."enum___shared_pages_v_tl_v_heading_align";
  DROP TYPE "public"."enum_detail_templates_hero_slides_btn_link_type";
  DROP TYPE "public"."enum_detail_templates_hero_slides_btn_style";
  DROP TYPE "public"."enum_detail_templates_phero_heading_align";
  DROP TYPE "public"."enum_detail_templates_media_buttons_link_type";
  DROP TYPE "public"."enum_detail_templates_media_buttons_style";
  DROP TYPE "public"."enum_detail_templates_media_heading_align";
  DROP TYPE "public"."enum_detail_templates_media_image_layout";
  DROP TYPE "public"."enum_detail_templates_media_image_position";
  DROP TYPE "public"."enum_detail_templates_media_points_layout";
  DROP TYPE "public"."enum_detail_templates_media_appearance_background";
  DROP TYPE "public"."enum_detail_templates_grid_head_btn_link_type";
  DROP TYPE "public"."enum_detail_templates_grid_head_btn_style";
  DROP TYPE "public"."enum_detail_templates_grid_foot_btn_link_type";
  DROP TYPE "public"."enum_detail_templates_grid_foot_btn_style";
  DROP TYPE "public"."enum_detail_templates_grid_heading_align";
  DROP TYPE "public"."enum_detail_templates_grid_marker_style";
  DROP TYPE "public"."enum_detail_templates_grid_card_style";
  DROP TYPE "public"."enum_detail_templates_grid_columns";
  DROP TYPE "public"."enum_detail_templates_grid_appearance_background";
  DROP TYPE "public"."enum_detail_templates_vm_heading_align";
  DROP TYPE "public"."enum_detail_templates_tl_buttons_link_type";
  DROP TYPE "public"."enum_detail_templates_tl_buttons_style";
  DROP TYPE "public"."enum_detail_templates_tl_variant";
  DROP TYPE "public"."enum_detail_templates_tl_heading_align";
  DROP TYPE "public"."enum____detail_templates_v_hero_v_slides_btn_v_link_type";
  DROP TYPE "public"."enum____detail_templates_v_hero_v_slides_btn_v_style";
  DROP TYPE "public"."enum___detail_templates_v_phero_v_heading_align";
  DROP TYPE "public"."enum___detail_templates_v_media_v_buttons_link_type";
  DROP TYPE "public"."enum___detail_templates_v_media_v_buttons_style";
  DROP TYPE "public"."enum___detail_templates_v_media_v_heading_align";
  DROP TYPE "public"."enum___detail_templates_v_media_v_image_layout";
  DROP TYPE "public"."enum___detail_templates_v_media_v_image_position";
  DROP TYPE "public"."enum___detail_templates_v_media_v_points_layout";
  DROP TYPE "public"."enum___detail_templates_v_media_v_appearance_background";
  DROP TYPE "public"."enum____detail_templates_v_grid_v_head_btn_v_link_type";
  DROP TYPE "public"."enum____detail_templates_v_grid_v_head_btn_v_style";
  DROP TYPE "public"."enum____detail_templates_v_grid_v_foot_btn_v_link_type";
  DROP TYPE "public"."enum____detail_templates_v_grid_v_foot_btn_v_style";
  DROP TYPE "public"."enum___detail_templates_v_grid_v_heading_align";
  DROP TYPE "public"."enum___detail_templates_v_grid_v_marker_style";
  DROP TYPE "public"."enum___detail_templates_v_grid_v_card_style";
  DROP TYPE "public"."enum___detail_templates_v_grid_v_columns";
  DROP TYPE "public"."enum___detail_templates_v_grid_v_appearance_background";
  DROP TYPE "public"."enum___detail_templates_v_vm_v_heading_align";
  DROP TYPE "public"."enum___detail_templates_v_tl_v_buttons_link_type";
  DROP TYPE "public"."enum___detail_templates_v_tl_v_buttons_style";
  DROP TYPE "public"."enum___detail_templates_v_tl_v_variant";
  DROP TYPE "public"."enum___detail_templates_v_tl_v_heading_align";
  DROP TYPE "public"."enum_shared_detail_templates_hero_slides_btn_link_type";
  DROP TYPE "public"."enum_shared_detail_templates_hero_slides_btn_style";
  DROP TYPE "public"."enum_shared_detail_templates_phero_heading_align";
  DROP TYPE "public"."enum_shared_detail_templates_media_buttons_link_type";
  DROP TYPE "public"."enum_shared_detail_templates_media_buttons_style";
  DROP TYPE "public"."enum_shared_detail_templates_media_heading_align";
  DROP TYPE "public"."enum_shared_detail_templates_media_image_layout";
  DROP TYPE "public"."enum_shared_detail_templates_media_image_position";
  DROP TYPE "public"."enum_shared_detail_templates_media_points_layout";
  DROP TYPE "public"."enum_shared_detail_templates_media_appearance_background";
  DROP TYPE "public"."enum_shared_detail_templates_grid_head_btn_link_type";
  DROP TYPE "public"."enum_shared_detail_templates_grid_head_btn_style";
  DROP TYPE "public"."enum_shared_detail_templates_grid_foot_btn_link_type";
  DROP TYPE "public"."enum_shared_detail_templates_grid_foot_btn_style";
  DROP TYPE "public"."enum_shared_detail_templates_grid_heading_align";
  DROP TYPE "public"."enum_shared_detail_templates_grid_marker_style";
  DROP TYPE "public"."enum_shared_detail_templates_grid_card_style";
  DROP TYPE "public"."enum_shared_detail_templates_grid_columns";
  DROP TYPE "public"."enum_shared_detail_templates_grid_appearance_background";
  DROP TYPE "public"."enum_shared_detail_templates_vm_heading_align";
  DROP TYPE "public"."enum_shared_detail_templates_tl_buttons_link_type";
  DROP TYPE "public"."enum_shared_detail_templates_tl_buttons_style";
  DROP TYPE "public"."enum_shared_detail_templates_tl_variant";
  DROP TYPE "public"."enum_shared_detail_templates_tl_heading_align";
  DROP TYPE "public"."enum____shared_detail_templates_v_hero_v_slides_btn_v_link_type";
  DROP TYPE "public"."enum____shared_detail_templates_v_hero_v_slides_btn_v_style";
  DROP TYPE "public"."enum___shared_detail_templates_v_phero_v_heading_align";
  DROP TYPE "public"."enum___shared_detail_templates_v_media_v_buttons_link_type";
  DROP TYPE "public"."enum___shared_detail_templates_v_media_v_buttons_style";
  DROP TYPE "public"."enum___shared_detail_templates_v_media_v_heading_align";
  DROP TYPE "public"."enum___shared_detail_templates_v_media_v_image_layout";
  DROP TYPE "public"."enum___shared_detail_templates_v_media_v_image_position";
  DROP TYPE "public"."enum___shared_detail_templates_v_media_v_points_layout";
  DROP TYPE "public"."enum___shared_detail_templates_v_media_v_appearance_background";
  DROP TYPE "public"."enum____shared_detail_templates_v_grid_v_head_btn_v_link_type";
  DROP TYPE "public"."enum____shared_detail_templates_v_grid_v_head_btn_v_style";
  DROP TYPE "public"."enum____shared_detail_templates_v_grid_v_foot_btn_v_link_type";
  DROP TYPE "public"."enum____shared_detail_templates_v_grid_v_foot_btn_v_style";
  DROP TYPE "public"."enum___shared_detail_templates_v_grid_v_heading_align";
  DROP TYPE "public"."enum___shared_detail_templates_v_grid_v_marker_style";
  DROP TYPE "public"."enum___shared_detail_templates_v_grid_v_card_style";
  DROP TYPE "public"."enum___shared_detail_templates_v_grid_v_columns";
  DROP TYPE "public"."enum___shared_detail_templates_v_grid_v_appearance_background";
  DROP TYPE "public"."enum___shared_detail_templates_v_vm_v_heading_align";
  DROP TYPE "public"."enum___shared_detail_templates_v_tl_v_buttons_link_type";
  DROP TYPE "public"."enum___shared_detail_templates_v_tl_v_buttons_style";
  DROP TYPE "public"."enum___shared_detail_templates_v_tl_v_variant";
  DROP TYPE "public"."enum___shared_detail_templates_v_tl_v_heading_align";`)
}
