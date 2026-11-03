import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_povw_btn_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_pages_povw_btn_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_pages_pspec_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_pages_pspec_contact_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_pages_pspec_contact_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_pages_papp_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_pages_simp_btn_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_pages_simp_btn_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_pages_sapp_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_pages_jdet_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum____pages_v_povw_v_btn_v_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum____pages_v_povw_v_btn_v_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___pages_v_pspec_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___pages_v_pspec_v_contact_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___pages_v_pspec_v_contact_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___pages_v_papp_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum____pages_v_simp_v_btn_v_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum____pages_v_simp_v_btn_v_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___pages_v_sapp_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___pages_v_jdet_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_pages_povw_btn_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_pages_povw_btn_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_shared_pages_pspec_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_pages_pspec_contact_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_pages_pspec_contact_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_shared_pages_papp_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_pages_simp_btn_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_pages_simp_btn_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_shared_pages_sapp_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_pages_jdet_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum____shared_pages_v_povw_v_btn_v_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum____shared_pages_v_povw_v_btn_v_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___shared_pages_v_pspec_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___shared_pages_v_pspec_v_contact_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___shared_pages_v_pspec_v_contact_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___shared_pages_v_papp_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum____shared_pages_v_simp_v_btn_v_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum____shared_pages_v_simp_v_btn_v_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___shared_pages_v_sapp_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___shared_pages_v_jdet_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_detail_templates_povw_btn_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_detail_templates_povw_btn_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_detail_templates_pspec_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_detail_templates_pspec_contact_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_detail_templates_pspec_contact_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_detail_templates_papp_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_detail_templates_simp_btn_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_detail_templates_simp_btn_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_detail_templates_sapp_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_detail_templates_jdet_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum____detail_templates_v_povw_v_btn_v_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum____detail_templates_v_povw_v_btn_v_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___detail_templates_v_pspec_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___detail_templates_v_pspec_v_contact_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___detail_templates_v_pspec_v_contact_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___detail_templates_v_papp_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum____detail_templates_v_simp_v_btn_v_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum____detail_templates_v_simp_v_btn_v_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___detail_templates_v_sapp_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___detail_templates_v_jdet_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_detail_templates_povw_btn_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_detail_templates_povw_btn_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_shared_detail_templates_pspec_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_detail_templates_pspec_contact_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_detail_templates_pspec_contact_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_shared_detail_templates_papp_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_detail_templates_simp_btn_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_detail_templates_simp_btn_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_shared_detail_templates_sapp_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_detail_templates_jdet_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum____shared_detail_templates_v_povw_v_btn_v_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum____shared_detail_templates_v_povw_v_btn_v_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___shared_detail_templates_v_pspec_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___shared_detail_templates_v_pspec_v_contact_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___shared_detail_templates_v_pspec_v_contact_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___shared_detail_templates_v_papp_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum____shared_detail_templates_v_simp_v_btn_v_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum____shared_detail_templates_v_simp_v_btn_v_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___shared_detail_templates_v_sapp_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___shared_detail_templates_v_jdet_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TABLE "pages_rhero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_rhero_locales" (
  	"current_label" varchar,
  	"meta_labels_formula" varchar,
  	"meta_labels_cas_number" varchar,
  	"meta_labels_total_variants" varchar,
  	"meta_labels_classification" varchar,
  	"meta_labels_key_applications" varchar,
  	"meta_labels_supporting_products" varchar,
  	"meta_labels_industries_served" varchar,
  	"meta_labels_department" varchar,
  	"meta_labels_experience" varchar,
  	"meta_labels_job_type" varchar,
  	"meta_labels_location" varchar,
  	"meta_labels_posted_date" varchar,
  	"meta_labels_category" varchar,
  	"meta_labels_published_date" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_povw_btn" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_povw_btn_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_pages_povw_btn_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "pages_povw_btn_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_povw" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_povw_locales" (
  	"eyebrow" varchar,
  	"pds_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_pspec" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_pages_pspec_heading_align" DEFAULT 'center',
  	"contact_link_type" "enum_pages_pspec_contact_link_type" DEFAULT 'internal',
  	"contact_link_new_tab" boolean DEFAULT false,
  	"contact_link_internal_path" varchar,
  	"contact_link_external_url" varchar,
  	"contact_style" "enum_pages_pspec_contact_style" DEFAULT 'primary',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_pspec_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"column_labels_parameter" varchar,
  	"column_labels_method" varchar,
  	"column_labels_value" varchar,
  	"side_labels_formula" varchar,
  	"side_labels_cas_number" varchar,
  	"side_labels_classification" varchar,
  	"side_labels_packaging" varchar,
  	"contact_link_label" varchar,
  	"pds_label" varchar,
  	"sds_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_papp" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_pages_papp_heading_align" DEFAULT 'center',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_papp_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_simp_btn" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_simp_btn_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_pages_simp_btn_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "pages_simp_btn_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_simp" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_simp_locales" (
  	"eyebrow" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_sapp" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_pages_sapp_heading_align" DEFAULT 'center',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_sapp_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"products_heading_title" varchar,
  	"products_heading_description" varchar,
  	"featured_labels_product_name" varchar,
  	"featured_labels_formula" varchar,
  	"featured_labels_cas_number" varchar,
  	"featured_labels_variants" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_jdet" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_pages_jdet_heading_align" DEFAULT 'left',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_jdet_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"form_eyebrow" varchar,
  	"form_title" varchar,
  	"form_description" varchar,
  	"form_fields_full_name_label" varchar,
  	"form_fields_full_name_placeholder" varchar,
  	"form_fields_email_label" varchar,
  	"form_fields_email_placeholder" varchar,
  	"form_fields_phone_label" varchar,
  	"form_fields_phone_placeholder" varchar,
  	"form_fields_cover_letter_label" varchar,
  	"form_fields_cover_letter_placeholder" varchar,
  	"form_fields_resume_label" varchar,
  	"form_fields_resume_placeholder" varchar,
  	"form_consent_text" jsonb,
  	"form_submit_label" varchar,
  	"form_success_message" varchar,
  	"form_error_message" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_part" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_part_locales" (
  	"highlights_title" varchar,
  	"previous_label" varchar,
  	"next_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "__pages_v_rhero_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__pages_v_rhero_v_locales" (
  	"current_label" varchar,
  	"meta_labels_formula" varchar,
  	"meta_labels_cas_number" varchar,
  	"meta_labels_total_variants" varchar,
  	"meta_labels_classification" varchar,
  	"meta_labels_key_applications" varchar,
  	"meta_labels_supporting_products" varchar,
  	"meta_labels_industries_served" varchar,
  	"meta_labels_department" varchar,
  	"meta_labels_experience" varchar,
  	"meta_labels_job_type" varchar,
  	"meta_labels_location" varchar,
  	"meta_labels_posted_date" varchar,
  	"meta_labels_category" varchar,
  	"meta_labels_published_date" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "___pages_v_povw_v_btn_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum____pages_v_povw_v_btn_v_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum____pages_v_povw_v_btn_v_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "___pages_v_povw_v_btn_v_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__pages_v_povw_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__pages_v_povw_v_locales" (
  	"eyebrow" varchar,
  	"pds_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__pages_v_pspec_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___pages_v_pspec_v_heading_align" DEFAULT 'center',
  	"contact_link_type" "enum___pages_v_pspec_v_contact_link_type" DEFAULT 'internal',
  	"contact_link_new_tab" boolean DEFAULT false,
  	"contact_link_internal_path" varchar,
  	"contact_link_external_url" varchar,
  	"contact_style" "enum___pages_v_pspec_v_contact_style" DEFAULT 'primary',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__pages_v_pspec_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"column_labels_parameter" varchar,
  	"column_labels_method" varchar,
  	"column_labels_value" varchar,
  	"side_labels_formula" varchar,
  	"side_labels_cas_number" varchar,
  	"side_labels_classification" varchar,
  	"side_labels_packaging" varchar,
  	"contact_link_label" varchar,
  	"pds_label" varchar,
  	"sds_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__pages_v_papp_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___pages_v_papp_v_heading_align" DEFAULT 'center',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__pages_v_papp_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "___pages_v_simp_v_btn_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum____pages_v_simp_v_btn_v_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum____pages_v_simp_v_btn_v_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "___pages_v_simp_v_btn_v_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__pages_v_simp_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__pages_v_simp_v_locales" (
  	"eyebrow" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__pages_v_sapp_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___pages_v_sapp_v_heading_align" DEFAULT 'center',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__pages_v_sapp_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"products_heading_title" varchar,
  	"products_heading_description" varchar,
  	"featured_labels_product_name" varchar,
  	"featured_labels_formula" varchar,
  	"featured_labels_cas_number" varchar,
  	"featured_labels_variants" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__pages_v_jdet_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___pages_v_jdet_v_heading_align" DEFAULT 'left',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__pages_v_jdet_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"form_eyebrow" varchar,
  	"form_title" varchar,
  	"form_description" varchar,
  	"form_fields_full_name_label" varchar,
  	"form_fields_full_name_placeholder" varchar,
  	"form_fields_email_label" varchar,
  	"form_fields_email_placeholder" varchar,
  	"form_fields_phone_label" varchar,
  	"form_fields_phone_placeholder" varchar,
  	"form_fields_cover_letter_label" varchar,
  	"form_fields_cover_letter_placeholder" varchar,
  	"form_fields_resume_label" varchar,
  	"form_fields_resume_placeholder" varchar,
  	"form_consent_text" jsonb,
  	"form_submit_label" varchar,
  	"form_success_message" varchar,
  	"form_error_message" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__pages_v_part_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__pages_v_part_v_locales" (
  	"highlights_title" varchar,
  	"previous_label" varchar,
  	"next_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "shared_pages_rhero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_pages_rhero_locales" (
  	"current_label" varchar,
  	"meta_labels_formula" varchar,
  	"meta_labels_cas_number" varchar,
  	"meta_labels_total_variants" varchar,
  	"meta_labels_classification" varchar,
  	"meta_labels_key_applications" varchar,
  	"meta_labels_supporting_products" varchar,
  	"meta_labels_industries_served" varchar,
  	"meta_labels_department" varchar,
  	"meta_labels_experience" varchar,
  	"meta_labels_job_type" varchar,
  	"meta_labels_location" varchar,
  	"meta_labels_posted_date" varchar,
  	"meta_labels_category" varchar,
  	"meta_labels_published_date" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_povw_btn" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_shared_pages_povw_btn_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_shared_pages_povw_btn_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "shared_pages_povw_btn_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_povw" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_pages_povw_locales" (
  	"eyebrow" varchar,
  	"pds_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_pspec" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_pages_pspec_heading_align" DEFAULT 'center',
  	"contact_link_type" "enum_shared_pages_pspec_contact_link_type" DEFAULT 'internal',
  	"contact_link_new_tab" boolean DEFAULT false,
  	"contact_link_internal_path" varchar,
  	"contact_link_external_url" varchar,
  	"contact_style" "enum_shared_pages_pspec_contact_style" DEFAULT 'primary',
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_pages_pspec_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"column_labels_parameter" varchar,
  	"column_labels_method" varchar,
  	"column_labels_value" varchar,
  	"side_labels_formula" varchar,
  	"side_labels_cas_number" varchar,
  	"side_labels_classification" varchar,
  	"side_labels_packaging" varchar,
  	"contact_link_label" varchar,
  	"pds_label" varchar,
  	"sds_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_papp" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_pages_papp_heading_align" DEFAULT 'center',
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_pages_papp_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_simp_btn" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_shared_pages_simp_btn_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_shared_pages_simp_btn_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "shared_pages_simp_btn_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_simp" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_pages_simp_locales" (
  	"eyebrow" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_sapp" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_pages_sapp_heading_align" DEFAULT 'center',
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_pages_sapp_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"products_heading_title" varchar,
  	"products_heading_description" varchar,
  	"featured_labels_product_name" varchar,
  	"featured_labels_formula" varchar,
  	"featured_labels_cas_number" varchar,
  	"featured_labels_variants" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_jdet" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_pages_jdet_heading_align" DEFAULT 'left',
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_pages_jdet_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"form_eyebrow" varchar,
  	"form_title" varchar,
  	"form_description" varchar,
  	"form_fields_full_name_label" varchar,
  	"form_fields_full_name_placeholder" varchar,
  	"form_fields_email_label" varchar,
  	"form_fields_email_placeholder" varchar,
  	"form_fields_phone_label" varchar,
  	"form_fields_phone_placeholder" varchar,
  	"form_fields_cover_letter_label" varchar,
  	"form_fields_cover_letter_placeholder" varchar,
  	"form_fields_resume_label" varchar,
  	"form_fields_resume_placeholder" varchar,
  	"form_consent_text" jsonb,
  	"form_submit_label" varchar,
  	"form_success_message" varchar,
  	"form_error_message" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_part" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_pages_part_locales" (
  	"highlights_title" varchar,
  	"previous_label" varchar,
  	"next_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_rhero_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_pages_v_rhero_v_locales" (
  	"current_label" varchar,
  	"meta_labels_formula" varchar,
  	"meta_labels_cas_number" varchar,
  	"meta_labels_total_variants" varchar,
  	"meta_labels_classification" varchar,
  	"meta_labels_key_applications" varchar,
  	"meta_labels_supporting_products" varchar,
  	"meta_labels_industries_served" varchar,
  	"meta_labels_department" varchar,
  	"meta_labels_experience" varchar,
  	"meta_labels_job_type" varchar,
  	"meta_labels_location" varchar,
  	"meta_labels_posted_date" varchar,
  	"meta_labels_category" varchar,
  	"meta_labels_published_date" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "___shared_pages_v_povw_v_btn_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum____shared_pages_v_povw_v_btn_v_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum____shared_pages_v_povw_v_btn_v_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "___shared_pages_v_povw_v_btn_v_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_povw_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_pages_v_povw_v_locales" (
  	"eyebrow" varchar,
  	"pds_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_pspec_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_pages_v_pspec_v_heading_align" DEFAULT 'center',
  	"contact_link_type" "enum___shared_pages_v_pspec_v_contact_link_type" DEFAULT 'internal',
  	"contact_link_new_tab" boolean DEFAULT false,
  	"contact_link_internal_path" varchar,
  	"contact_link_external_url" varchar,
  	"contact_style" "enum___shared_pages_v_pspec_v_contact_style" DEFAULT 'primary',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_pages_v_pspec_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"column_labels_parameter" varchar,
  	"column_labels_method" varchar,
  	"column_labels_value" varchar,
  	"side_labels_formula" varchar,
  	"side_labels_cas_number" varchar,
  	"side_labels_classification" varchar,
  	"side_labels_packaging" varchar,
  	"contact_link_label" varchar,
  	"pds_label" varchar,
  	"sds_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_papp_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_pages_v_papp_v_heading_align" DEFAULT 'center',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_pages_v_papp_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "___shared_pages_v_simp_v_btn_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum____shared_pages_v_simp_v_btn_v_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum____shared_pages_v_simp_v_btn_v_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "___shared_pages_v_simp_v_btn_v_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_simp_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_pages_v_simp_v_locales" (
  	"eyebrow" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_sapp_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_pages_v_sapp_v_heading_align" DEFAULT 'center',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_pages_v_sapp_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"products_heading_title" varchar,
  	"products_heading_description" varchar,
  	"featured_labels_product_name" varchar,
  	"featured_labels_formula" varchar,
  	"featured_labels_cas_number" varchar,
  	"featured_labels_variants" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_jdet_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_pages_v_jdet_v_heading_align" DEFAULT 'left',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_pages_v_jdet_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"form_eyebrow" varchar,
  	"form_title" varchar,
  	"form_description" varchar,
  	"form_fields_full_name_label" varchar,
  	"form_fields_full_name_placeholder" varchar,
  	"form_fields_email_label" varchar,
  	"form_fields_email_placeholder" varchar,
  	"form_fields_phone_label" varchar,
  	"form_fields_phone_placeholder" varchar,
  	"form_fields_cover_letter_label" varchar,
  	"form_fields_cover_letter_placeholder" varchar,
  	"form_fields_resume_label" varchar,
  	"form_fields_resume_placeholder" varchar,
  	"form_consent_text" jsonb,
  	"form_submit_label" varchar,
  	"form_success_message" varchar,
  	"form_error_message" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_part_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_pages_v_part_v_locales" (
  	"highlights_title" varchar,
  	"previous_label" varchar,
  	"next_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "detail_templates_rhero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "detail_templates_rhero_locales" (
  	"current_label" varchar,
  	"meta_labels_formula" varchar,
  	"meta_labels_cas_number" varchar,
  	"meta_labels_total_variants" varchar,
  	"meta_labels_classification" varchar,
  	"meta_labels_key_applications" varchar,
  	"meta_labels_supporting_products" varchar,
  	"meta_labels_industries_served" varchar,
  	"meta_labels_department" varchar,
  	"meta_labels_experience" varchar,
  	"meta_labels_job_type" varchar,
  	"meta_labels_location" varchar,
  	"meta_labels_posted_date" varchar,
  	"meta_labels_category" varchar,
  	"meta_labels_published_date" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_povw_btn" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_detail_templates_povw_btn_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_detail_templates_povw_btn_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "detail_templates_povw_btn_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_povw" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "detail_templates_povw_locales" (
  	"eyebrow" varchar,
  	"pds_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_pspec" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_detail_templates_pspec_heading_align" DEFAULT 'center',
  	"contact_link_type" "enum_detail_templates_pspec_contact_link_type" DEFAULT 'internal',
  	"contact_link_new_tab" boolean DEFAULT false,
  	"contact_link_internal_path" varchar,
  	"contact_link_external_url" varchar,
  	"contact_style" "enum_detail_templates_pspec_contact_style" DEFAULT 'primary',
  	"block_name" varchar
  );
  
  CREATE TABLE "detail_templates_pspec_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"column_labels_parameter" varchar,
  	"column_labels_method" varchar,
  	"column_labels_value" varchar,
  	"side_labels_formula" varchar,
  	"side_labels_cas_number" varchar,
  	"side_labels_classification" varchar,
  	"side_labels_packaging" varchar,
  	"contact_link_label" varchar,
  	"pds_label" varchar,
  	"sds_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_papp" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_detail_templates_papp_heading_align" DEFAULT 'center',
  	"block_name" varchar
  );
  
  CREATE TABLE "detail_templates_papp_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_simp_btn" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_detail_templates_simp_btn_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_detail_templates_simp_btn_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "detail_templates_simp_btn_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_simp" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "detail_templates_simp_locales" (
  	"eyebrow" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_sapp" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_detail_templates_sapp_heading_align" DEFAULT 'center',
  	"block_name" varchar
  );
  
  CREATE TABLE "detail_templates_sapp_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"products_heading_title" varchar,
  	"products_heading_description" varchar,
  	"featured_labels_product_name" varchar,
  	"featured_labels_formula" varchar,
  	"featured_labels_cas_number" varchar,
  	"featured_labels_variants" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_jdet" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_detail_templates_jdet_heading_align" DEFAULT 'left',
  	"block_name" varchar
  );
  
  CREATE TABLE "detail_templates_jdet_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"form_eyebrow" varchar,
  	"form_title" varchar,
  	"form_description" varchar,
  	"form_fields_full_name_label" varchar,
  	"form_fields_full_name_placeholder" varchar,
  	"form_fields_email_label" varchar,
  	"form_fields_email_placeholder" varchar,
  	"form_fields_phone_label" varchar,
  	"form_fields_phone_placeholder" varchar,
  	"form_fields_cover_letter_label" varchar,
  	"form_fields_cover_letter_placeholder" varchar,
  	"form_fields_resume_label" varchar,
  	"form_fields_resume_placeholder" varchar,
  	"form_consent_text" jsonb,
  	"form_submit_label" varchar,
  	"form_success_message" varchar,
  	"form_error_message" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_part" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "detail_templates_part_locales" (
  	"highlights_title" varchar,
  	"previous_label" varchar,
  	"next_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_rhero_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__detail_templates_v_rhero_v_locales" (
  	"current_label" varchar,
  	"meta_labels_formula" varchar,
  	"meta_labels_cas_number" varchar,
  	"meta_labels_total_variants" varchar,
  	"meta_labels_classification" varchar,
  	"meta_labels_key_applications" varchar,
  	"meta_labels_supporting_products" varchar,
  	"meta_labels_industries_served" varchar,
  	"meta_labels_department" varchar,
  	"meta_labels_experience" varchar,
  	"meta_labels_job_type" varchar,
  	"meta_labels_location" varchar,
  	"meta_labels_posted_date" varchar,
  	"meta_labels_category" varchar,
  	"meta_labels_published_date" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "___detail_templates_v_povw_v_btn_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum____detail_templates_v_povw_v_btn_v_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum____detail_templates_v_povw_v_btn_v_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "___detail_templates_v_povw_v_btn_v_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_povw_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__detail_templates_v_povw_v_locales" (
  	"eyebrow" varchar,
  	"pds_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_pspec_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___detail_templates_v_pspec_v_heading_align" DEFAULT 'center',
  	"contact_link_type" "enum___detail_templates_v_pspec_v_contact_link_type" DEFAULT 'internal',
  	"contact_link_new_tab" boolean DEFAULT false,
  	"contact_link_internal_path" varchar,
  	"contact_link_external_url" varchar,
  	"contact_style" "enum___detail_templates_v_pspec_v_contact_style" DEFAULT 'primary',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__detail_templates_v_pspec_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"column_labels_parameter" varchar,
  	"column_labels_method" varchar,
  	"column_labels_value" varchar,
  	"side_labels_formula" varchar,
  	"side_labels_cas_number" varchar,
  	"side_labels_classification" varchar,
  	"side_labels_packaging" varchar,
  	"contact_link_label" varchar,
  	"pds_label" varchar,
  	"sds_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_papp_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___detail_templates_v_papp_v_heading_align" DEFAULT 'center',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__detail_templates_v_papp_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "___detail_templates_v_simp_v_btn_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum____detail_templates_v_simp_v_btn_v_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum____detail_templates_v_simp_v_btn_v_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "___detail_templates_v_simp_v_btn_v_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_simp_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__detail_templates_v_simp_v_locales" (
  	"eyebrow" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_sapp_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___detail_templates_v_sapp_v_heading_align" DEFAULT 'center',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__detail_templates_v_sapp_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"products_heading_title" varchar,
  	"products_heading_description" varchar,
  	"featured_labels_product_name" varchar,
  	"featured_labels_formula" varchar,
  	"featured_labels_cas_number" varchar,
  	"featured_labels_variants" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_jdet_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___detail_templates_v_jdet_v_heading_align" DEFAULT 'left',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__detail_templates_v_jdet_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"form_eyebrow" varchar,
  	"form_title" varchar,
  	"form_description" varchar,
  	"form_fields_full_name_label" varchar,
  	"form_fields_full_name_placeholder" varchar,
  	"form_fields_email_label" varchar,
  	"form_fields_email_placeholder" varchar,
  	"form_fields_phone_label" varchar,
  	"form_fields_phone_placeholder" varchar,
  	"form_fields_cover_letter_label" varchar,
  	"form_fields_cover_letter_placeholder" varchar,
  	"form_fields_resume_label" varchar,
  	"form_fields_resume_placeholder" varchar,
  	"form_consent_text" jsonb,
  	"form_submit_label" varchar,
  	"form_success_message" varchar,
  	"form_error_message" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_part_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__detail_templates_v_part_v_locales" (
  	"highlights_title" varchar,
  	"previous_label" varchar,
  	"next_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_rhero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_detail_templates_rhero_locales" (
  	"current_label" varchar,
  	"meta_labels_formula" varchar,
  	"meta_labels_cas_number" varchar,
  	"meta_labels_total_variants" varchar,
  	"meta_labels_classification" varchar,
  	"meta_labels_key_applications" varchar,
  	"meta_labels_supporting_products" varchar,
  	"meta_labels_industries_served" varchar,
  	"meta_labels_department" varchar,
  	"meta_labels_experience" varchar,
  	"meta_labels_job_type" varchar,
  	"meta_labels_location" varchar,
  	"meta_labels_posted_date" varchar,
  	"meta_labels_category" varchar,
  	"meta_labels_published_date" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_povw_btn" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_shared_detail_templates_povw_btn_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_shared_detail_templates_povw_btn_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "shared_detail_templates_povw_btn_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_povw" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_detail_templates_povw_locales" (
  	"eyebrow" varchar,
  	"pds_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_pspec" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_detail_templates_pspec_heading_align" DEFAULT 'center',
  	"contact_link_type" "enum_shared_detail_templates_pspec_contact_link_type" DEFAULT 'internal',
  	"contact_link_new_tab" boolean DEFAULT false,
  	"contact_link_internal_path" varchar,
  	"contact_link_external_url" varchar,
  	"contact_style" "enum_shared_detail_templates_pspec_contact_style" DEFAULT 'primary',
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_detail_templates_pspec_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"column_labels_parameter" varchar,
  	"column_labels_method" varchar,
  	"column_labels_value" varchar,
  	"side_labels_formula" varchar,
  	"side_labels_cas_number" varchar,
  	"side_labels_classification" varchar,
  	"side_labels_packaging" varchar,
  	"contact_link_label" varchar,
  	"pds_label" varchar,
  	"sds_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_papp" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_detail_templates_papp_heading_align" DEFAULT 'center',
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_detail_templates_papp_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_simp_btn" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_shared_detail_templates_simp_btn_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_shared_detail_templates_simp_btn_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "shared_detail_templates_simp_btn_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_simp" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_detail_templates_simp_locales" (
  	"eyebrow" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_sapp" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_detail_templates_sapp_heading_align" DEFAULT 'center',
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_detail_templates_sapp_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"products_heading_title" varchar,
  	"products_heading_description" varchar,
  	"featured_labels_product_name" varchar,
  	"featured_labels_formula" varchar,
  	"featured_labels_cas_number" varchar,
  	"featured_labels_variants" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_jdet" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_detail_templates_jdet_heading_align" DEFAULT 'left',
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_detail_templates_jdet_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"form_eyebrow" varchar,
  	"form_title" varchar,
  	"form_description" varchar,
  	"form_fields_full_name_label" varchar,
  	"form_fields_full_name_placeholder" varchar,
  	"form_fields_email_label" varchar,
  	"form_fields_email_placeholder" varchar,
  	"form_fields_phone_label" varchar,
  	"form_fields_phone_placeholder" varchar,
  	"form_fields_cover_letter_label" varchar,
  	"form_fields_cover_letter_placeholder" varchar,
  	"form_fields_resume_label" varchar,
  	"form_fields_resume_placeholder" varchar,
  	"form_consent_text" jsonb,
  	"form_submit_label" varchar,
  	"form_success_message" varchar,
  	"form_error_message" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_part" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_detail_templates_part_locales" (
  	"highlights_title" varchar,
  	"previous_label" varchar,
  	"next_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_rhero_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_rhero_v_locales" (
  	"current_label" varchar,
  	"meta_labels_formula" varchar,
  	"meta_labels_cas_number" varchar,
  	"meta_labels_total_variants" varchar,
  	"meta_labels_classification" varchar,
  	"meta_labels_key_applications" varchar,
  	"meta_labels_supporting_products" varchar,
  	"meta_labels_industries_served" varchar,
  	"meta_labels_department" varchar,
  	"meta_labels_experience" varchar,
  	"meta_labels_job_type" varchar,
  	"meta_labels_location" varchar,
  	"meta_labels_posted_date" varchar,
  	"meta_labels_category" varchar,
  	"meta_labels_published_date" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "___shared_detail_templates_v_povw_v_btn_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum____shared_detail_templates_v_povw_v_btn_v_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum____shared_detail_templates_v_povw_v_btn_v_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "___shared_detail_templates_v_povw_v_btn_v_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_povw_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_povw_v_locales" (
  	"eyebrow" varchar,
  	"pds_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_pspec_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_detail_templates_v_pspec_v_heading_align" DEFAULT 'center',
  	"contact_link_type" "enum___shared_detail_templates_v_pspec_v_contact_link_type" DEFAULT 'internal',
  	"contact_link_new_tab" boolean DEFAULT false,
  	"contact_link_internal_path" varchar,
  	"contact_link_external_url" varchar,
  	"contact_style" "enum___shared_detail_templates_v_pspec_v_contact_style" DEFAULT 'primary',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_pspec_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"column_labels_parameter" varchar,
  	"column_labels_method" varchar,
  	"column_labels_value" varchar,
  	"side_labels_formula" varchar,
  	"side_labels_cas_number" varchar,
  	"side_labels_classification" varchar,
  	"side_labels_packaging" varchar,
  	"contact_link_label" varchar,
  	"pds_label" varchar,
  	"sds_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_papp_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_detail_templates_v_papp_v_heading_align" DEFAULT 'center',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_papp_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "___shared_detail_templates_v_simp_v_btn_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum____shared_detail_templates_v_simp_v_btn_v_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum____shared_detail_templates_v_simp_v_btn_v_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "___shared_detail_templates_v_simp_v_btn_v_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_simp_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_simp_v_locales" (
  	"eyebrow" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_sapp_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_detail_templates_v_sapp_v_heading_align" DEFAULT 'center',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_sapp_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"products_heading_title" varchar,
  	"products_heading_description" varchar,
  	"featured_labels_product_name" varchar,
  	"featured_labels_formula" varchar,
  	"featured_labels_cas_number" varchar,
  	"featured_labels_variants" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_jdet_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_detail_templates_v_jdet_v_heading_align" DEFAULT 'left',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_jdet_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"form_eyebrow" varchar,
  	"form_title" varchar,
  	"form_description" varchar,
  	"form_fields_full_name_label" varchar,
  	"form_fields_full_name_placeholder" varchar,
  	"form_fields_email_label" varchar,
  	"form_fields_email_placeholder" varchar,
  	"form_fields_phone_label" varchar,
  	"form_fields_phone_placeholder" varchar,
  	"form_fields_cover_letter_label" varchar,
  	"form_fields_cover_letter_placeholder" varchar,
  	"form_fields_resume_label" varchar,
  	"form_fields_resume_placeholder" varchar,
  	"form_consent_text" jsonb,
  	"form_submit_label" varchar,
  	"form_success_message" varchar,
  	"form_error_message" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_part_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_part_v_locales" (
  	"highlights_title" varchar,
  	"previous_label" varchar,
  	"next_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages_rhero" ADD CONSTRAINT "pages_rhero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rhero_locales" ADD CONSTRAINT "pages_rhero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_rhero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_povw_btn" ADD CONSTRAINT "pages_povw_btn_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_povw"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_povw_btn_locales" ADD CONSTRAINT "pages_povw_btn_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_povw_btn"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_povw" ADD CONSTRAINT "pages_povw_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_povw_locales" ADD CONSTRAINT "pages_povw_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_povw"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_pspec" ADD CONSTRAINT "pages_pspec_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_pspec_locales" ADD CONSTRAINT "pages_pspec_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_pspec"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_papp" ADD CONSTRAINT "pages_papp_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_papp_locales" ADD CONSTRAINT "pages_papp_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_papp"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_simp_btn" ADD CONSTRAINT "pages_simp_btn_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_simp"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_simp_btn_locales" ADD CONSTRAINT "pages_simp_btn_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_simp_btn"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_simp" ADD CONSTRAINT "pages_simp_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_simp_locales" ADD CONSTRAINT "pages_simp_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_simp"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_sapp" ADD CONSTRAINT "pages_sapp_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_sapp_locales" ADD CONSTRAINT "pages_sapp_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_sapp"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_jdet" ADD CONSTRAINT "pages_jdet_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_jdet_locales" ADD CONSTRAINT "pages_jdet_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_jdet"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_part" ADD CONSTRAINT "pages_part_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_part_locales" ADD CONSTRAINT "pages_part_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_part"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_rhero_v" ADD CONSTRAINT "__pages_v_rhero_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_rhero_v_locales" ADD CONSTRAINT "__pages_v_rhero_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_rhero_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___pages_v_povw_v_btn_v" ADD CONSTRAINT "___pages_v_povw_v_btn_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_povw_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___pages_v_povw_v_btn_v_locales" ADD CONSTRAINT "___pages_v_povw_v_btn_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___pages_v_povw_v_btn_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_povw_v" ADD CONSTRAINT "__pages_v_povw_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_povw_v_locales" ADD CONSTRAINT "__pages_v_povw_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_povw_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_pspec_v" ADD CONSTRAINT "__pages_v_pspec_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_pspec_v_locales" ADD CONSTRAINT "__pages_v_pspec_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_pspec_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_papp_v" ADD CONSTRAINT "__pages_v_papp_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_papp_v_locales" ADD CONSTRAINT "__pages_v_papp_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_papp_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___pages_v_simp_v_btn_v" ADD CONSTRAINT "___pages_v_simp_v_btn_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_simp_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___pages_v_simp_v_btn_v_locales" ADD CONSTRAINT "___pages_v_simp_v_btn_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___pages_v_simp_v_btn_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_simp_v" ADD CONSTRAINT "__pages_v_simp_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_simp_v_locales" ADD CONSTRAINT "__pages_v_simp_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_simp_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_sapp_v" ADD CONSTRAINT "__pages_v_sapp_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_sapp_v_locales" ADD CONSTRAINT "__pages_v_sapp_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_sapp_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_jdet_v" ADD CONSTRAINT "__pages_v_jdet_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_jdet_v_locales" ADD CONSTRAINT "__pages_v_jdet_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_jdet_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_part_v" ADD CONSTRAINT "__pages_v_part_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_part_v_locales" ADD CONSTRAINT "__pages_v_part_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_part_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_rhero" ADD CONSTRAINT "shared_pages_rhero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_rhero_locales" ADD CONSTRAINT "shared_pages_rhero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_rhero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_povw_btn" ADD CONSTRAINT "shared_pages_povw_btn_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_povw"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_povw_btn_locales" ADD CONSTRAINT "shared_pages_povw_btn_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_povw_btn"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_povw" ADD CONSTRAINT "shared_pages_povw_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_povw_locales" ADD CONSTRAINT "shared_pages_povw_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_povw"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_pspec" ADD CONSTRAINT "shared_pages_pspec_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_pspec_locales" ADD CONSTRAINT "shared_pages_pspec_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_pspec"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_papp" ADD CONSTRAINT "shared_pages_papp_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_papp_locales" ADD CONSTRAINT "shared_pages_papp_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_papp"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_simp_btn" ADD CONSTRAINT "shared_pages_simp_btn_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_simp"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_simp_btn_locales" ADD CONSTRAINT "shared_pages_simp_btn_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_simp_btn"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_simp" ADD CONSTRAINT "shared_pages_simp_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_simp_locales" ADD CONSTRAINT "shared_pages_simp_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_simp"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_sapp" ADD CONSTRAINT "shared_pages_sapp_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_sapp_locales" ADD CONSTRAINT "shared_pages_sapp_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_sapp"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_jdet" ADD CONSTRAINT "shared_pages_jdet_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_jdet_locales" ADD CONSTRAINT "shared_pages_jdet_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_jdet"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_part" ADD CONSTRAINT "shared_pages_part_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_part_locales" ADD CONSTRAINT "shared_pages_part_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_part"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_rhero_v" ADD CONSTRAINT "__shared_pages_v_rhero_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_rhero_v_locales" ADD CONSTRAINT "__shared_pages_v_rhero_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_rhero_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_pages_v_povw_v_btn_v" ADD CONSTRAINT "___shared_pages_v_povw_v_btn_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_povw_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_pages_v_povw_v_btn_v_locales" ADD CONSTRAINT "___shared_pages_v_povw_v_btn_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___shared_pages_v_povw_v_btn_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_povw_v" ADD CONSTRAINT "__shared_pages_v_povw_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_povw_v_locales" ADD CONSTRAINT "__shared_pages_v_povw_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_povw_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_pspec_v" ADD CONSTRAINT "__shared_pages_v_pspec_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_pspec_v_locales" ADD CONSTRAINT "__shared_pages_v_pspec_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_pspec_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_papp_v" ADD CONSTRAINT "__shared_pages_v_papp_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_papp_v_locales" ADD CONSTRAINT "__shared_pages_v_papp_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_papp_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_pages_v_simp_v_btn_v" ADD CONSTRAINT "___shared_pages_v_simp_v_btn_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_simp_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_pages_v_simp_v_btn_v_locales" ADD CONSTRAINT "___shared_pages_v_simp_v_btn_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___shared_pages_v_simp_v_btn_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_simp_v" ADD CONSTRAINT "__shared_pages_v_simp_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_simp_v_locales" ADD CONSTRAINT "__shared_pages_v_simp_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_simp_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_sapp_v" ADD CONSTRAINT "__shared_pages_v_sapp_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_sapp_v_locales" ADD CONSTRAINT "__shared_pages_v_sapp_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_sapp_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_jdet_v" ADD CONSTRAINT "__shared_pages_v_jdet_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_jdet_v_locales" ADD CONSTRAINT "__shared_pages_v_jdet_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_jdet_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_part_v" ADD CONSTRAINT "__shared_pages_v_part_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_part_v_locales" ADD CONSTRAINT "__shared_pages_v_part_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_part_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_rhero" ADD CONSTRAINT "detail_templates_rhero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_rhero_locales" ADD CONSTRAINT "detail_templates_rhero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_rhero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_povw_btn" ADD CONSTRAINT "detail_templates_povw_btn_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_povw"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_povw_btn_locales" ADD CONSTRAINT "detail_templates_povw_btn_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_povw_btn"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_povw" ADD CONSTRAINT "detail_templates_povw_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_povw_locales" ADD CONSTRAINT "detail_templates_povw_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_povw"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_pspec" ADD CONSTRAINT "detail_templates_pspec_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_pspec_locales" ADD CONSTRAINT "detail_templates_pspec_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_pspec"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_papp" ADD CONSTRAINT "detail_templates_papp_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_papp_locales" ADD CONSTRAINT "detail_templates_papp_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_papp"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_simp_btn" ADD CONSTRAINT "detail_templates_simp_btn_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_simp"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_simp_btn_locales" ADD CONSTRAINT "detail_templates_simp_btn_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_simp_btn"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_simp" ADD CONSTRAINT "detail_templates_simp_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_simp_locales" ADD CONSTRAINT "detail_templates_simp_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_simp"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_sapp" ADD CONSTRAINT "detail_templates_sapp_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_sapp_locales" ADD CONSTRAINT "detail_templates_sapp_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_sapp"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_jdet" ADD CONSTRAINT "detail_templates_jdet_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_jdet_locales" ADD CONSTRAINT "detail_templates_jdet_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_jdet"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_part" ADD CONSTRAINT "detail_templates_part_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_part_locales" ADD CONSTRAINT "detail_templates_part_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_part"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_rhero_v" ADD CONSTRAINT "__detail_templates_v_rhero_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_rhero_v_locales" ADD CONSTRAINT "__detail_templates_v_rhero_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_rhero_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___detail_templates_v_povw_v_btn_v" ADD CONSTRAINT "___detail_templates_v_povw_v_btn_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_povw_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___detail_templates_v_povw_v_btn_v_locales" ADD CONSTRAINT "___detail_templates_v_povw_v_btn_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___detail_templates_v_povw_v_btn_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_povw_v" ADD CONSTRAINT "__detail_templates_v_povw_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_povw_v_locales" ADD CONSTRAINT "__detail_templates_v_povw_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_povw_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_pspec_v" ADD CONSTRAINT "__detail_templates_v_pspec_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_pspec_v_locales" ADD CONSTRAINT "__detail_templates_v_pspec_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_pspec_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_papp_v" ADD CONSTRAINT "__detail_templates_v_papp_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_papp_v_locales" ADD CONSTRAINT "__detail_templates_v_papp_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_papp_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___detail_templates_v_simp_v_btn_v" ADD CONSTRAINT "___detail_templates_v_simp_v_btn_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_simp_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___detail_templates_v_simp_v_btn_v_locales" ADD CONSTRAINT "___detail_templates_v_simp_v_btn_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___detail_templates_v_simp_v_btn_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_simp_v" ADD CONSTRAINT "__detail_templates_v_simp_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_simp_v_locales" ADD CONSTRAINT "__detail_templates_v_simp_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_simp_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_sapp_v" ADD CONSTRAINT "__detail_templates_v_sapp_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_sapp_v_locales" ADD CONSTRAINT "__detail_templates_v_sapp_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_sapp_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_jdet_v" ADD CONSTRAINT "__detail_templates_v_jdet_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_jdet_v_locales" ADD CONSTRAINT "__detail_templates_v_jdet_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_jdet_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_part_v" ADD CONSTRAINT "__detail_templates_v_part_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_part_v_locales" ADD CONSTRAINT "__detail_templates_v_part_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_part_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_rhero" ADD CONSTRAINT "shared_detail_templates_rhero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_rhero_locales" ADD CONSTRAINT "shared_detail_templates_rhero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_rhero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_povw_btn" ADD CONSTRAINT "shared_detail_templates_povw_btn_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_povw"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_povw_btn_locales" ADD CONSTRAINT "shared_detail_templates_povw_btn_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_povw_btn"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_povw" ADD CONSTRAINT "shared_detail_templates_povw_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_povw_locales" ADD CONSTRAINT "shared_detail_templates_povw_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_povw"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_pspec" ADD CONSTRAINT "shared_detail_templates_pspec_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_pspec_locales" ADD CONSTRAINT "shared_detail_templates_pspec_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_pspec"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_papp" ADD CONSTRAINT "shared_detail_templates_papp_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_papp_locales" ADD CONSTRAINT "shared_detail_templates_papp_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_papp"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_simp_btn" ADD CONSTRAINT "shared_detail_templates_simp_btn_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_simp"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_simp_btn_locales" ADD CONSTRAINT "shared_detail_templates_simp_btn_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_simp_btn"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_simp" ADD CONSTRAINT "shared_detail_templates_simp_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_simp_locales" ADD CONSTRAINT "shared_detail_templates_simp_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_simp"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_sapp" ADD CONSTRAINT "shared_detail_templates_sapp_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_sapp_locales" ADD CONSTRAINT "shared_detail_templates_sapp_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_sapp"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_jdet" ADD CONSTRAINT "shared_detail_templates_jdet_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_jdet_locales" ADD CONSTRAINT "shared_detail_templates_jdet_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_jdet"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_part" ADD CONSTRAINT "shared_detail_templates_part_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_part_locales" ADD CONSTRAINT "shared_detail_templates_part_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_part"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_rhero_v" ADD CONSTRAINT "__shared_detail_templates_v_rhero_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_rhero_v_locales" ADD CONSTRAINT "__shared_detail_templates_v_rhero_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_rhero_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_detail_templates_v_povw_v_btn_v" ADD CONSTRAINT "___shared_detail_templates_v_povw_v_btn_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_povw_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_detail_templates_v_povw_v_btn_v_locales" ADD CONSTRAINT "___shared_detail_templates_v_povw_v_btn_v_locales_parent__fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___shared_detail_templates_v_povw_v_btn_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_povw_v" ADD CONSTRAINT "__shared_detail_templates_v_povw_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_povw_v_locales" ADD CONSTRAINT "__shared_detail_templates_v_povw_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_povw_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_pspec_v" ADD CONSTRAINT "__shared_detail_templates_v_pspec_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_pspec_v_locales" ADD CONSTRAINT "__shared_detail_templates_v_pspec_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_pspec_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_papp_v" ADD CONSTRAINT "__shared_detail_templates_v_papp_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_papp_v_locales" ADD CONSTRAINT "__shared_detail_templates_v_papp_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_papp_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_detail_templates_v_simp_v_btn_v" ADD CONSTRAINT "___shared_detail_templates_v_simp_v_btn_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_simp_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_detail_templates_v_simp_v_btn_v_locales" ADD CONSTRAINT "___shared_detail_templates_v_simp_v_btn_v_locales_parent__fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___shared_detail_templates_v_simp_v_btn_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_simp_v" ADD CONSTRAINT "__shared_detail_templates_v_simp_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_simp_v_locales" ADD CONSTRAINT "__shared_detail_templates_v_simp_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_simp_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_sapp_v" ADD CONSTRAINT "__shared_detail_templates_v_sapp_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_sapp_v_locales" ADD CONSTRAINT "__shared_detail_templates_v_sapp_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_sapp_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_jdet_v" ADD CONSTRAINT "__shared_detail_templates_v_jdet_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_jdet_v_locales" ADD CONSTRAINT "__shared_detail_templates_v_jdet_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_jdet_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_part_v" ADD CONSTRAINT "__shared_detail_templates_v_part_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_part_v_locales" ADD CONSTRAINT "__shared_detail_templates_v_part_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_part_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_rhero_order_idx" ON "pages_rhero" USING btree ("_order");
  CREATE INDEX "pages_rhero_parent_id_idx" ON "pages_rhero" USING btree ("_parent_id");
  CREATE INDEX "pages_rhero_path_idx" ON "pages_rhero" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_rhero_locales_locale_parent_id_unique" ON "pages_rhero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_povw_btn_order_idx" ON "pages_povw_btn" USING btree ("_order");
  CREATE INDEX "pages_povw_btn_parent_id_idx" ON "pages_povw_btn" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_povw_btn_locales_locale_parent_id_unique" ON "pages_povw_btn_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_povw_order_idx" ON "pages_povw" USING btree ("_order");
  CREATE INDEX "pages_povw_parent_id_idx" ON "pages_povw" USING btree ("_parent_id");
  CREATE INDEX "pages_povw_path_idx" ON "pages_povw" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_povw_locales_locale_parent_id_unique" ON "pages_povw_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_pspec_order_idx" ON "pages_pspec" USING btree ("_order");
  CREATE INDEX "pages_pspec_parent_id_idx" ON "pages_pspec" USING btree ("_parent_id");
  CREATE INDEX "pages_pspec_path_idx" ON "pages_pspec" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_pspec_locales_locale_parent_id_unique" ON "pages_pspec_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_papp_order_idx" ON "pages_papp" USING btree ("_order");
  CREATE INDEX "pages_papp_parent_id_idx" ON "pages_papp" USING btree ("_parent_id");
  CREATE INDEX "pages_papp_path_idx" ON "pages_papp" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_papp_locales_locale_parent_id_unique" ON "pages_papp_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_simp_btn_order_idx" ON "pages_simp_btn" USING btree ("_order");
  CREATE INDEX "pages_simp_btn_parent_id_idx" ON "pages_simp_btn" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_simp_btn_locales_locale_parent_id_unique" ON "pages_simp_btn_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_simp_order_idx" ON "pages_simp" USING btree ("_order");
  CREATE INDEX "pages_simp_parent_id_idx" ON "pages_simp" USING btree ("_parent_id");
  CREATE INDEX "pages_simp_path_idx" ON "pages_simp" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_simp_locales_locale_parent_id_unique" ON "pages_simp_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_sapp_order_idx" ON "pages_sapp" USING btree ("_order");
  CREATE INDEX "pages_sapp_parent_id_idx" ON "pages_sapp" USING btree ("_parent_id");
  CREATE INDEX "pages_sapp_path_idx" ON "pages_sapp" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_sapp_locales_locale_parent_id_unique" ON "pages_sapp_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_jdet_order_idx" ON "pages_jdet" USING btree ("_order");
  CREATE INDEX "pages_jdet_parent_id_idx" ON "pages_jdet" USING btree ("_parent_id");
  CREATE INDEX "pages_jdet_path_idx" ON "pages_jdet" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_jdet_locales_locale_parent_id_unique" ON "pages_jdet_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_part_order_idx" ON "pages_part" USING btree ("_order");
  CREATE INDEX "pages_part_parent_id_idx" ON "pages_part" USING btree ("_parent_id");
  CREATE INDEX "pages_part_path_idx" ON "pages_part" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_part_locales_locale_parent_id_unique" ON "pages_part_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__pages_v_rhero_v_order_idx" ON "__pages_v_rhero_v" USING btree ("_order");
  CREATE INDEX "__pages_v_rhero_v_parent_id_idx" ON "__pages_v_rhero_v" USING btree ("_parent_id");
  CREATE INDEX "__pages_v_rhero_v_path_idx" ON "__pages_v_rhero_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__pages_v_rhero_v_locales_locale_parent_id_unique" ON "__pages_v_rhero_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___pages_v_povw_v_btn_v_order_idx" ON "___pages_v_povw_v_btn_v" USING btree ("_order");
  CREATE INDEX "___pages_v_povw_v_btn_v_parent_id_idx" ON "___pages_v_povw_v_btn_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "___pages_v_povw_v_btn_v_locales_locale_parent_id_unique" ON "___pages_v_povw_v_btn_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__pages_v_povw_v_order_idx" ON "__pages_v_povw_v" USING btree ("_order");
  CREATE INDEX "__pages_v_povw_v_parent_id_idx" ON "__pages_v_povw_v" USING btree ("_parent_id");
  CREATE INDEX "__pages_v_povw_v_path_idx" ON "__pages_v_povw_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__pages_v_povw_v_locales_locale_parent_id_unique" ON "__pages_v_povw_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__pages_v_pspec_v_order_idx" ON "__pages_v_pspec_v" USING btree ("_order");
  CREATE INDEX "__pages_v_pspec_v_parent_id_idx" ON "__pages_v_pspec_v" USING btree ("_parent_id");
  CREATE INDEX "__pages_v_pspec_v_path_idx" ON "__pages_v_pspec_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__pages_v_pspec_v_locales_locale_parent_id_unique" ON "__pages_v_pspec_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__pages_v_papp_v_order_idx" ON "__pages_v_papp_v" USING btree ("_order");
  CREATE INDEX "__pages_v_papp_v_parent_id_idx" ON "__pages_v_papp_v" USING btree ("_parent_id");
  CREATE INDEX "__pages_v_papp_v_path_idx" ON "__pages_v_papp_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__pages_v_papp_v_locales_locale_parent_id_unique" ON "__pages_v_papp_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___pages_v_simp_v_btn_v_order_idx" ON "___pages_v_simp_v_btn_v" USING btree ("_order");
  CREATE INDEX "___pages_v_simp_v_btn_v_parent_id_idx" ON "___pages_v_simp_v_btn_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "___pages_v_simp_v_btn_v_locales_locale_parent_id_unique" ON "___pages_v_simp_v_btn_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__pages_v_simp_v_order_idx" ON "__pages_v_simp_v" USING btree ("_order");
  CREATE INDEX "__pages_v_simp_v_parent_id_idx" ON "__pages_v_simp_v" USING btree ("_parent_id");
  CREATE INDEX "__pages_v_simp_v_path_idx" ON "__pages_v_simp_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__pages_v_simp_v_locales_locale_parent_id_unique" ON "__pages_v_simp_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__pages_v_sapp_v_order_idx" ON "__pages_v_sapp_v" USING btree ("_order");
  CREATE INDEX "__pages_v_sapp_v_parent_id_idx" ON "__pages_v_sapp_v" USING btree ("_parent_id");
  CREATE INDEX "__pages_v_sapp_v_path_idx" ON "__pages_v_sapp_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__pages_v_sapp_v_locales_locale_parent_id_unique" ON "__pages_v_sapp_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__pages_v_jdet_v_order_idx" ON "__pages_v_jdet_v" USING btree ("_order");
  CREATE INDEX "__pages_v_jdet_v_parent_id_idx" ON "__pages_v_jdet_v" USING btree ("_parent_id");
  CREATE INDEX "__pages_v_jdet_v_path_idx" ON "__pages_v_jdet_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__pages_v_jdet_v_locales_locale_parent_id_unique" ON "__pages_v_jdet_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__pages_v_part_v_order_idx" ON "__pages_v_part_v" USING btree ("_order");
  CREATE INDEX "__pages_v_part_v_parent_id_idx" ON "__pages_v_part_v" USING btree ("_parent_id");
  CREATE INDEX "__pages_v_part_v_path_idx" ON "__pages_v_part_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__pages_v_part_v_locales_locale_parent_id_unique" ON "__pages_v_part_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_rhero_order_idx" ON "shared_pages_rhero" USING btree ("_order");
  CREATE INDEX "shared_pages_rhero_parent_id_idx" ON "shared_pages_rhero" USING btree ("_parent_id");
  CREATE INDEX "shared_pages_rhero_path_idx" ON "shared_pages_rhero" USING btree ("_path");
  CREATE UNIQUE INDEX "shared_pages_rhero_locales_locale_parent_id_unique" ON "shared_pages_rhero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_povw_btn_order_idx" ON "shared_pages_povw_btn" USING btree ("_order");
  CREATE INDEX "shared_pages_povw_btn_parent_id_idx" ON "shared_pages_povw_btn" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shared_pages_povw_btn_locales_locale_parent_id_unique" ON "shared_pages_povw_btn_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_povw_order_idx" ON "shared_pages_povw" USING btree ("_order");
  CREATE INDEX "shared_pages_povw_parent_id_idx" ON "shared_pages_povw" USING btree ("_parent_id");
  CREATE INDEX "shared_pages_povw_path_idx" ON "shared_pages_povw" USING btree ("_path");
  CREATE UNIQUE INDEX "shared_pages_povw_locales_locale_parent_id_unique" ON "shared_pages_povw_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_pspec_order_idx" ON "shared_pages_pspec" USING btree ("_order");
  CREATE INDEX "shared_pages_pspec_parent_id_idx" ON "shared_pages_pspec" USING btree ("_parent_id");
  CREATE INDEX "shared_pages_pspec_path_idx" ON "shared_pages_pspec" USING btree ("_path");
  CREATE UNIQUE INDEX "shared_pages_pspec_locales_locale_parent_id_unique" ON "shared_pages_pspec_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_papp_order_idx" ON "shared_pages_papp" USING btree ("_order");
  CREATE INDEX "shared_pages_papp_parent_id_idx" ON "shared_pages_papp" USING btree ("_parent_id");
  CREATE INDEX "shared_pages_papp_path_idx" ON "shared_pages_papp" USING btree ("_path");
  CREATE UNIQUE INDEX "shared_pages_papp_locales_locale_parent_id_unique" ON "shared_pages_papp_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_simp_btn_order_idx" ON "shared_pages_simp_btn" USING btree ("_order");
  CREATE INDEX "shared_pages_simp_btn_parent_id_idx" ON "shared_pages_simp_btn" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shared_pages_simp_btn_locales_locale_parent_id_unique" ON "shared_pages_simp_btn_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_simp_order_idx" ON "shared_pages_simp" USING btree ("_order");
  CREATE INDEX "shared_pages_simp_parent_id_idx" ON "shared_pages_simp" USING btree ("_parent_id");
  CREATE INDEX "shared_pages_simp_path_idx" ON "shared_pages_simp" USING btree ("_path");
  CREATE UNIQUE INDEX "shared_pages_simp_locales_locale_parent_id_unique" ON "shared_pages_simp_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_sapp_order_idx" ON "shared_pages_sapp" USING btree ("_order");
  CREATE INDEX "shared_pages_sapp_parent_id_idx" ON "shared_pages_sapp" USING btree ("_parent_id");
  CREATE INDEX "shared_pages_sapp_path_idx" ON "shared_pages_sapp" USING btree ("_path");
  CREATE UNIQUE INDEX "shared_pages_sapp_locales_locale_parent_id_unique" ON "shared_pages_sapp_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_jdet_order_idx" ON "shared_pages_jdet" USING btree ("_order");
  CREATE INDEX "shared_pages_jdet_parent_id_idx" ON "shared_pages_jdet" USING btree ("_parent_id");
  CREATE INDEX "shared_pages_jdet_path_idx" ON "shared_pages_jdet" USING btree ("_path");
  CREATE UNIQUE INDEX "shared_pages_jdet_locales_locale_parent_id_unique" ON "shared_pages_jdet_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_part_order_idx" ON "shared_pages_part" USING btree ("_order");
  CREATE INDEX "shared_pages_part_parent_id_idx" ON "shared_pages_part" USING btree ("_parent_id");
  CREATE INDEX "shared_pages_part_path_idx" ON "shared_pages_part" USING btree ("_path");
  CREATE UNIQUE INDEX "shared_pages_part_locales_locale_parent_id_unique" ON "shared_pages_part_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_pages_v_rhero_v_order_idx" ON "__shared_pages_v_rhero_v" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_rhero_v_parent_id_idx" ON "__shared_pages_v_rhero_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_pages_v_rhero_v_path_idx" ON "__shared_pages_v_rhero_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__shared_pages_v_rhero_v_locales_locale_parent_id_unique" ON "__shared_pages_v_rhero_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___shared_pages_v_povw_v_btn_v_order_idx" ON "___shared_pages_v_povw_v_btn_v" USING btree ("_order");
  CREATE INDEX "___shared_pages_v_povw_v_btn_v_parent_id_idx" ON "___shared_pages_v_povw_v_btn_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "___shared_pages_v_povw_v_btn_v_locales_locale_parent_id_uniq" ON "___shared_pages_v_povw_v_btn_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_pages_v_povw_v_order_idx" ON "__shared_pages_v_povw_v" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_povw_v_parent_id_idx" ON "__shared_pages_v_povw_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_pages_v_povw_v_path_idx" ON "__shared_pages_v_povw_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__shared_pages_v_povw_v_locales_locale_parent_id_unique" ON "__shared_pages_v_povw_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_pages_v_pspec_v_order_idx" ON "__shared_pages_v_pspec_v" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_pspec_v_parent_id_idx" ON "__shared_pages_v_pspec_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_pages_v_pspec_v_path_idx" ON "__shared_pages_v_pspec_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__shared_pages_v_pspec_v_locales_locale_parent_id_unique" ON "__shared_pages_v_pspec_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_pages_v_papp_v_order_idx" ON "__shared_pages_v_papp_v" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_papp_v_parent_id_idx" ON "__shared_pages_v_papp_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_pages_v_papp_v_path_idx" ON "__shared_pages_v_papp_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__shared_pages_v_papp_v_locales_locale_parent_id_unique" ON "__shared_pages_v_papp_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___shared_pages_v_simp_v_btn_v_order_idx" ON "___shared_pages_v_simp_v_btn_v" USING btree ("_order");
  CREATE INDEX "___shared_pages_v_simp_v_btn_v_parent_id_idx" ON "___shared_pages_v_simp_v_btn_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "___shared_pages_v_simp_v_btn_v_locales_locale_parent_id_uniq" ON "___shared_pages_v_simp_v_btn_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_pages_v_simp_v_order_idx" ON "__shared_pages_v_simp_v" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_simp_v_parent_id_idx" ON "__shared_pages_v_simp_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_pages_v_simp_v_path_idx" ON "__shared_pages_v_simp_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__shared_pages_v_simp_v_locales_locale_parent_id_unique" ON "__shared_pages_v_simp_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_pages_v_sapp_v_order_idx" ON "__shared_pages_v_sapp_v" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_sapp_v_parent_id_idx" ON "__shared_pages_v_sapp_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_pages_v_sapp_v_path_idx" ON "__shared_pages_v_sapp_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__shared_pages_v_sapp_v_locales_locale_parent_id_unique" ON "__shared_pages_v_sapp_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_pages_v_jdet_v_order_idx" ON "__shared_pages_v_jdet_v" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_jdet_v_parent_id_idx" ON "__shared_pages_v_jdet_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_pages_v_jdet_v_path_idx" ON "__shared_pages_v_jdet_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__shared_pages_v_jdet_v_locales_locale_parent_id_unique" ON "__shared_pages_v_jdet_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_pages_v_part_v_order_idx" ON "__shared_pages_v_part_v" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_part_v_parent_id_idx" ON "__shared_pages_v_part_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_pages_v_part_v_path_idx" ON "__shared_pages_v_part_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__shared_pages_v_part_v_locales_locale_parent_id_unique" ON "__shared_pages_v_part_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_rhero_order_idx" ON "detail_templates_rhero" USING btree ("_order");
  CREATE INDEX "detail_templates_rhero_parent_id_idx" ON "detail_templates_rhero" USING btree ("_parent_id");
  CREATE INDEX "detail_templates_rhero_path_idx" ON "detail_templates_rhero" USING btree ("_path");
  CREATE UNIQUE INDEX "detail_templates_rhero_locales_locale_parent_id_unique" ON "detail_templates_rhero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_povw_btn_order_idx" ON "detail_templates_povw_btn" USING btree ("_order");
  CREATE INDEX "detail_templates_povw_btn_parent_id_idx" ON "detail_templates_povw_btn" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "detail_templates_povw_btn_locales_locale_parent_id_unique" ON "detail_templates_povw_btn_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_povw_order_idx" ON "detail_templates_povw" USING btree ("_order");
  CREATE INDEX "detail_templates_povw_parent_id_idx" ON "detail_templates_povw" USING btree ("_parent_id");
  CREATE INDEX "detail_templates_povw_path_idx" ON "detail_templates_povw" USING btree ("_path");
  CREATE UNIQUE INDEX "detail_templates_povw_locales_locale_parent_id_unique" ON "detail_templates_povw_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_pspec_order_idx" ON "detail_templates_pspec" USING btree ("_order");
  CREATE INDEX "detail_templates_pspec_parent_id_idx" ON "detail_templates_pspec" USING btree ("_parent_id");
  CREATE INDEX "detail_templates_pspec_path_idx" ON "detail_templates_pspec" USING btree ("_path");
  CREATE UNIQUE INDEX "detail_templates_pspec_locales_locale_parent_id_unique" ON "detail_templates_pspec_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_papp_order_idx" ON "detail_templates_papp" USING btree ("_order");
  CREATE INDEX "detail_templates_papp_parent_id_idx" ON "detail_templates_papp" USING btree ("_parent_id");
  CREATE INDEX "detail_templates_papp_path_idx" ON "detail_templates_papp" USING btree ("_path");
  CREATE UNIQUE INDEX "detail_templates_papp_locales_locale_parent_id_unique" ON "detail_templates_papp_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_simp_btn_order_idx" ON "detail_templates_simp_btn" USING btree ("_order");
  CREATE INDEX "detail_templates_simp_btn_parent_id_idx" ON "detail_templates_simp_btn" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "detail_templates_simp_btn_locales_locale_parent_id_unique" ON "detail_templates_simp_btn_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_simp_order_idx" ON "detail_templates_simp" USING btree ("_order");
  CREATE INDEX "detail_templates_simp_parent_id_idx" ON "detail_templates_simp" USING btree ("_parent_id");
  CREATE INDEX "detail_templates_simp_path_idx" ON "detail_templates_simp" USING btree ("_path");
  CREATE UNIQUE INDEX "detail_templates_simp_locales_locale_parent_id_unique" ON "detail_templates_simp_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_sapp_order_idx" ON "detail_templates_sapp" USING btree ("_order");
  CREATE INDEX "detail_templates_sapp_parent_id_idx" ON "detail_templates_sapp" USING btree ("_parent_id");
  CREATE INDEX "detail_templates_sapp_path_idx" ON "detail_templates_sapp" USING btree ("_path");
  CREATE UNIQUE INDEX "detail_templates_sapp_locales_locale_parent_id_unique" ON "detail_templates_sapp_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_jdet_order_idx" ON "detail_templates_jdet" USING btree ("_order");
  CREATE INDEX "detail_templates_jdet_parent_id_idx" ON "detail_templates_jdet" USING btree ("_parent_id");
  CREATE INDEX "detail_templates_jdet_path_idx" ON "detail_templates_jdet" USING btree ("_path");
  CREATE UNIQUE INDEX "detail_templates_jdet_locales_locale_parent_id_unique" ON "detail_templates_jdet_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_part_order_idx" ON "detail_templates_part" USING btree ("_order");
  CREATE INDEX "detail_templates_part_parent_id_idx" ON "detail_templates_part" USING btree ("_parent_id");
  CREATE INDEX "detail_templates_part_path_idx" ON "detail_templates_part" USING btree ("_path");
  CREATE UNIQUE INDEX "detail_templates_part_locales_locale_parent_id_unique" ON "detail_templates_part_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__detail_templates_v_rhero_v_order_idx" ON "__detail_templates_v_rhero_v" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_rhero_v_parent_id_idx" ON "__detail_templates_v_rhero_v" USING btree ("_parent_id");
  CREATE INDEX "__detail_templates_v_rhero_v_path_idx" ON "__detail_templates_v_rhero_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__detail_templates_v_rhero_v_locales_locale_parent_id_unique" ON "__detail_templates_v_rhero_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___detail_templates_v_povw_v_btn_v_order_idx" ON "___detail_templates_v_povw_v_btn_v" USING btree ("_order");
  CREATE INDEX "___detail_templates_v_povw_v_btn_v_parent_id_idx" ON "___detail_templates_v_povw_v_btn_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "___detail_templates_v_povw_v_btn_v_locales_locale_parent_id_" ON "___detail_templates_v_povw_v_btn_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__detail_templates_v_povw_v_order_idx" ON "__detail_templates_v_povw_v" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_povw_v_parent_id_idx" ON "__detail_templates_v_povw_v" USING btree ("_parent_id");
  CREATE INDEX "__detail_templates_v_povw_v_path_idx" ON "__detail_templates_v_povw_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__detail_templates_v_povw_v_locales_locale_parent_id_unique" ON "__detail_templates_v_povw_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__detail_templates_v_pspec_v_order_idx" ON "__detail_templates_v_pspec_v" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_pspec_v_parent_id_idx" ON "__detail_templates_v_pspec_v" USING btree ("_parent_id");
  CREATE INDEX "__detail_templates_v_pspec_v_path_idx" ON "__detail_templates_v_pspec_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__detail_templates_v_pspec_v_locales_locale_parent_id_unique" ON "__detail_templates_v_pspec_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__detail_templates_v_papp_v_order_idx" ON "__detail_templates_v_papp_v" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_papp_v_parent_id_idx" ON "__detail_templates_v_papp_v" USING btree ("_parent_id");
  CREATE INDEX "__detail_templates_v_papp_v_path_idx" ON "__detail_templates_v_papp_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__detail_templates_v_papp_v_locales_locale_parent_id_unique" ON "__detail_templates_v_papp_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___detail_templates_v_simp_v_btn_v_order_idx" ON "___detail_templates_v_simp_v_btn_v" USING btree ("_order");
  CREATE INDEX "___detail_templates_v_simp_v_btn_v_parent_id_idx" ON "___detail_templates_v_simp_v_btn_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "___detail_templates_v_simp_v_btn_v_locales_locale_parent_id_" ON "___detail_templates_v_simp_v_btn_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__detail_templates_v_simp_v_order_idx" ON "__detail_templates_v_simp_v" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_simp_v_parent_id_idx" ON "__detail_templates_v_simp_v" USING btree ("_parent_id");
  CREATE INDEX "__detail_templates_v_simp_v_path_idx" ON "__detail_templates_v_simp_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__detail_templates_v_simp_v_locales_locale_parent_id_unique" ON "__detail_templates_v_simp_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__detail_templates_v_sapp_v_order_idx" ON "__detail_templates_v_sapp_v" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_sapp_v_parent_id_idx" ON "__detail_templates_v_sapp_v" USING btree ("_parent_id");
  CREATE INDEX "__detail_templates_v_sapp_v_path_idx" ON "__detail_templates_v_sapp_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__detail_templates_v_sapp_v_locales_locale_parent_id_unique" ON "__detail_templates_v_sapp_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__detail_templates_v_jdet_v_order_idx" ON "__detail_templates_v_jdet_v" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_jdet_v_parent_id_idx" ON "__detail_templates_v_jdet_v" USING btree ("_parent_id");
  CREATE INDEX "__detail_templates_v_jdet_v_path_idx" ON "__detail_templates_v_jdet_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__detail_templates_v_jdet_v_locales_locale_parent_id_unique" ON "__detail_templates_v_jdet_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__detail_templates_v_part_v_order_idx" ON "__detail_templates_v_part_v" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_part_v_parent_id_idx" ON "__detail_templates_v_part_v" USING btree ("_parent_id");
  CREATE INDEX "__detail_templates_v_part_v_path_idx" ON "__detail_templates_v_part_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__detail_templates_v_part_v_locales_locale_parent_id_unique" ON "__detail_templates_v_part_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_rhero_order_idx" ON "shared_detail_templates_rhero" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_rhero_parent_id_idx" ON "shared_detail_templates_rhero" USING btree ("_parent_id");
  CREATE INDEX "shared_detail_templates_rhero_path_idx" ON "shared_detail_templates_rhero" USING btree ("_path");
  CREATE UNIQUE INDEX "shared_detail_templates_rhero_locales_locale_parent_id_uniqu" ON "shared_detail_templates_rhero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_povw_btn_order_idx" ON "shared_detail_templates_povw_btn" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_povw_btn_parent_id_idx" ON "shared_detail_templates_povw_btn" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shared_detail_templates_povw_btn_locales_locale_parent_id_un" ON "shared_detail_templates_povw_btn_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_povw_order_idx" ON "shared_detail_templates_povw" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_povw_parent_id_idx" ON "shared_detail_templates_povw" USING btree ("_parent_id");
  CREATE INDEX "shared_detail_templates_povw_path_idx" ON "shared_detail_templates_povw" USING btree ("_path");
  CREATE UNIQUE INDEX "shared_detail_templates_povw_locales_locale_parent_id_unique" ON "shared_detail_templates_povw_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_pspec_order_idx" ON "shared_detail_templates_pspec" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_pspec_parent_id_idx" ON "shared_detail_templates_pspec" USING btree ("_parent_id");
  CREATE INDEX "shared_detail_templates_pspec_path_idx" ON "shared_detail_templates_pspec" USING btree ("_path");
  CREATE UNIQUE INDEX "shared_detail_templates_pspec_locales_locale_parent_id_uniqu" ON "shared_detail_templates_pspec_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_papp_order_idx" ON "shared_detail_templates_papp" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_papp_parent_id_idx" ON "shared_detail_templates_papp" USING btree ("_parent_id");
  CREATE INDEX "shared_detail_templates_papp_path_idx" ON "shared_detail_templates_papp" USING btree ("_path");
  CREATE UNIQUE INDEX "shared_detail_templates_papp_locales_locale_parent_id_unique" ON "shared_detail_templates_papp_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_simp_btn_order_idx" ON "shared_detail_templates_simp_btn" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_simp_btn_parent_id_idx" ON "shared_detail_templates_simp_btn" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shared_detail_templates_simp_btn_locales_locale_parent_id_un" ON "shared_detail_templates_simp_btn_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_simp_order_idx" ON "shared_detail_templates_simp" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_simp_parent_id_idx" ON "shared_detail_templates_simp" USING btree ("_parent_id");
  CREATE INDEX "shared_detail_templates_simp_path_idx" ON "shared_detail_templates_simp" USING btree ("_path");
  CREATE UNIQUE INDEX "shared_detail_templates_simp_locales_locale_parent_id_unique" ON "shared_detail_templates_simp_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_sapp_order_idx" ON "shared_detail_templates_sapp" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_sapp_parent_id_idx" ON "shared_detail_templates_sapp" USING btree ("_parent_id");
  CREATE INDEX "shared_detail_templates_sapp_path_idx" ON "shared_detail_templates_sapp" USING btree ("_path");
  CREATE UNIQUE INDEX "shared_detail_templates_sapp_locales_locale_parent_id_unique" ON "shared_detail_templates_sapp_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_jdet_order_idx" ON "shared_detail_templates_jdet" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_jdet_parent_id_idx" ON "shared_detail_templates_jdet" USING btree ("_parent_id");
  CREATE INDEX "shared_detail_templates_jdet_path_idx" ON "shared_detail_templates_jdet" USING btree ("_path");
  CREATE UNIQUE INDEX "shared_detail_templates_jdet_locales_locale_parent_id_unique" ON "shared_detail_templates_jdet_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_part_order_idx" ON "shared_detail_templates_part" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_part_parent_id_idx" ON "shared_detail_templates_part" USING btree ("_parent_id");
  CREATE INDEX "shared_detail_templates_part_path_idx" ON "shared_detail_templates_part" USING btree ("_path");
  CREATE UNIQUE INDEX "shared_detail_templates_part_locales_locale_parent_id_unique" ON "shared_detail_templates_part_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_rhero_v_order_idx" ON "__shared_detail_templates_v_rhero_v" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_rhero_v_parent_id_idx" ON "__shared_detail_templates_v_rhero_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_detail_templates_v_rhero_v_path_idx" ON "__shared_detail_templates_v_rhero_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_rhero_v_locales_locale_parent_id" ON "__shared_detail_templates_v_rhero_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___shared_detail_templates_v_povw_v_btn_v_order_idx" ON "___shared_detail_templates_v_povw_v_btn_v" USING btree ("_order");
  CREATE INDEX "___shared_detail_templates_v_povw_v_btn_v_parent_id_idx" ON "___shared_detail_templates_v_povw_v_btn_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "___shared_detail_templates_v_povw_v_btn_v_locales_locale_par" ON "___shared_detail_templates_v_povw_v_btn_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_povw_v_order_idx" ON "__shared_detail_templates_v_povw_v" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_povw_v_parent_id_idx" ON "__shared_detail_templates_v_povw_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_detail_templates_v_povw_v_path_idx" ON "__shared_detail_templates_v_povw_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_povw_v_locales_locale_parent_id_" ON "__shared_detail_templates_v_povw_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_pspec_v_order_idx" ON "__shared_detail_templates_v_pspec_v" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_pspec_v_parent_id_idx" ON "__shared_detail_templates_v_pspec_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_detail_templates_v_pspec_v_path_idx" ON "__shared_detail_templates_v_pspec_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_pspec_v_locales_locale_parent_id" ON "__shared_detail_templates_v_pspec_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_papp_v_order_idx" ON "__shared_detail_templates_v_papp_v" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_papp_v_parent_id_idx" ON "__shared_detail_templates_v_papp_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_detail_templates_v_papp_v_path_idx" ON "__shared_detail_templates_v_papp_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_papp_v_locales_locale_parent_id_" ON "__shared_detail_templates_v_papp_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___shared_detail_templates_v_simp_v_btn_v_order_idx" ON "___shared_detail_templates_v_simp_v_btn_v" USING btree ("_order");
  CREATE INDEX "___shared_detail_templates_v_simp_v_btn_v_parent_id_idx" ON "___shared_detail_templates_v_simp_v_btn_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "___shared_detail_templates_v_simp_v_btn_v_locales_locale_par" ON "___shared_detail_templates_v_simp_v_btn_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_simp_v_order_idx" ON "__shared_detail_templates_v_simp_v" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_simp_v_parent_id_idx" ON "__shared_detail_templates_v_simp_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_detail_templates_v_simp_v_path_idx" ON "__shared_detail_templates_v_simp_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_simp_v_locales_locale_parent_id_" ON "__shared_detail_templates_v_simp_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_sapp_v_order_idx" ON "__shared_detail_templates_v_sapp_v" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_sapp_v_parent_id_idx" ON "__shared_detail_templates_v_sapp_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_detail_templates_v_sapp_v_path_idx" ON "__shared_detail_templates_v_sapp_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_sapp_v_locales_locale_parent_id_" ON "__shared_detail_templates_v_sapp_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_jdet_v_order_idx" ON "__shared_detail_templates_v_jdet_v" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_jdet_v_parent_id_idx" ON "__shared_detail_templates_v_jdet_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_detail_templates_v_jdet_v_path_idx" ON "__shared_detail_templates_v_jdet_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_jdet_v_locales_locale_parent_id_" ON "__shared_detail_templates_v_jdet_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_part_v_order_idx" ON "__shared_detail_templates_v_part_v" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_part_v_parent_id_idx" ON "__shared_detail_templates_v_part_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_detail_templates_v_part_v_path_idx" ON "__shared_detail_templates_v_part_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_part_v_locales_locale_parent_id_" ON "__shared_detail_templates_v_part_v_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_rhero" CASCADE;
  DROP TABLE "pages_rhero_locales" CASCADE;
  DROP TABLE "pages_povw_btn" CASCADE;
  DROP TABLE "pages_povw_btn_locales" CASCADE;
  DROP TABLE "pages_povw" CASCADE;
  DROP TABLE "pages_povw_locales" CASCADE;
  DROP TABLE "pages_pspec" CASCADE;
  DROP TABLE "pages_pspec_locales" CASCADE;
  DROP TABLE "pages_papp" CASCADE;
  DROP TABLE "pages_papp_locales" CASCADE;
  DROP TABLE "pages_simp_btn" CASCADE;
  DROP TABLE "pages_simp_btn_locales" CASCADE;
  DROP TABLE "pages_simp" CASCADE;
  DROP TABLE "pages_simp_locales" CASCADE;
  DROP TABLE "pages_sapp" CASCADE;
  DROP TABLE "pages_sapp_locales" CASCADE;
  DROP TABLE "pages_jdet" CASCADE;
  DROP TABLE "pages_jdet_locales" CASCADE;
  DROP TABLE "pages_part" CASCADE;
  DROP TABLE "pages_part_locales" CASCADE;
  DROP TABLE "__pages_v_rhero_v" CASCADE;
  DROP TABLE "__pages_v_rhero_v_locales" CASCADE;
  DROP TABLE "___pages_v_povw_v_btn_v" CASCADE;
  DROP TABLE "___pages_v_povw_v_btn_v_locales" CASCADE;
  DROP TABLE "__pages_v_povw_v" CASCADE;
  DROP TABLE "__pages_v_povw_v_locales" CASCADE;
  DROP TABLE "__pages_v_pspec_v" CASCADE;
  DROP TABLE "__pages_v_pspec_v_locales" CASCADE;
  DROP TABLE "__pages_v_papp_v" CASCADE;
  DROP TABLE "__pages_v_papp_v_locales" CASCADE;
  DROP TABLE "___pages_v_simp_v_btn_v" CASCADE;
  DROP TABLE "___pages_v_simp_v_btn_v_locales" CASCADE;
  DROP TABLE "__pages_v_simp_v" CASCADE;
  DROP TABLE "__pages_v_simp_v_locales" CASCADE;
  DROP TABLE "__pages_v_sapp_v" CASCADE;
  DROP TABLE "__pages_v_sapp_v_locales" CASCADE;
  DROP TABLE "__pages_v_jdet_v" CASCADE;
  DROP TABLE "__pages_v_jdet_v_locales" CASCADE;
  DROP TABLE "__pages_v_part_v" CASCADE;
  DROP TABLE "__pages_v_part_v_locales" CASCADE;
  DROP TABLE "shared_pages_rhero" CASCADE;
  DROP TABLE "shared_pages_rhero_locales" CASCADE;
  DROP TABLE "shared_pages_povw_btn" CASCADE;
  DROP TABLE "shared_pages_povw_btn_locales" CASCADE;
  DROP TABLE "shared_pages_povw" CASCADE;
  DROP TABLE "shared_pages_povw_locales" CASCADE;
  DROP TABLE "shared_pages_pspec" CASCADE;
  DROP TABLE "shared_pages_pspec_locales" CASCADE;
  DROP TABLE "shared_pages_papp" CASCADE;
  DROP TABLE "shared_pages_papp_locales" CASCADE;
  DROP TABLE "shared_pages_simp_btn" CASCADE;
  DROP TABLE "shared_pages_simp_btn_locales" CASCADE;
  DROP TABLE "shared_pages_simp" CASCADE;
  DROP TABLE "shared_pages_simp_locales" CASCADE;
  DROP TABLE "shared_pages_sapp" CASCADE;
  DROP TABLE "shared_pages_sapp_locales" CASCADE;
  DROP TABLE "shared_pages_jdet" CASCADE;
  DROP TABLE "shared_pages_jdet_locales" CASCADE;
  DROP TABLE "shared_pages_part" CASCADE;
  DROP TABLE "shared_pages_part_locales" CASCADE;
  DROP TABLE "__shared_pages_v_rhero_v" CASCADE;
  DROP TABLE "__shared_pages_v_rhero_v_locales" CASCADE;
  DROP TABLE "___shared_pages_v_povw_v_btn_v" CASCADE;
  DROP TABLE "___shared_pages_v_povw_v_btn_v_locales" CASCADE;
  DROP TABLE "__shared_pages_v_povw_v" CASCADE;
  DROP TABLE "__shared_pages_v_povw_v_locales" CASCADE;
  DROP TABLE "__shared_pages_v_pspec_v" CASCADE;
  DROP TABLE "__shared_pages_v_pspec_v_locales" CASCADE;
  DROP TABLE "__shared_pages_v_papp_v" CASCADE;
  DROP TABLE "__shared_pages_v_papp_v_locales" CASCADE;
  DROP TABLE "___shared_pages_v_simp_v_btn_v" CASCADE;
  DROP TABLE "___shared_pages_v_simp_v_btn_v_locales" CASCADE;
  DROP TABLE "__shared_pages_v_simp_v" CASCADE;
  DROP TABLE "__shared_pages_v_simp_v_locales" CASCADE;
  DROP TABLE "__shared_pages_v_sapp_v" CASCADE;
  DROP TABLE "__shared_pages_v_sapp_v_locales" CASCADE;
  DROP TABLE "__shared_pages_v_jdet_v" CASCADE;
  DROP TABLE "__shared_pages_v_jdet_v_locales" CASCADE;
  DROP TABLE "__shared_pages_v_part_v" CASCADE;
  DROP TABLE "__shared_pages_v_part_v_locales" CASCADE;
  DROP TABLE "detail_templates_rhero" CASCADE;
  DROP TABLE "detail_templates_rhero_locales" CASCADE;
  DROP TABLE "detail_templates_povw_btn" CASCADE;
  DROP TABLE "detail_templates_povw_btn_locales" CASCADE;
  DROP TABLE "detail_templates_povw" CASCADE;
  DROP TABLE "detail_templates_povw_locales" CASCADE;
  DROP TABLE "detail_templates_pspec" CASCADE;
  DROP TABLE "detail_templates_pspec_locales" CASCADE;
  DROP TABLE "detail_templates_papp" CASCADE;
  DROP TABLE "detail_templates_papp_locales" CASCADE;
  DROP TABLE "detail_templates_simp_btn" CASCADE;
  DROP TABLE "detail_templates_simp_btn_locales" CASCADE;
  DROP TABLE "detail_templates_simp" CASCADE;
  DROP TABLE "detail_templates_simp_locales" CASCADE;
  DROP TABLE "detail_templates_sapp" CASCADE;
  DROP TABLE "detail_templates_sapp_locales" CASCADE;
  DROP TABLE "detail_templates_jdet" CASCADE;
  DROP TABLE "detail_templates_jdet_locales" CASCADE;
  DROP TABLE "detail_templates_part" CASCADE;
  DROP TABLE "detail_templates_part_locales" CASCADE;
  DROP TABLE "__detail_templates_v_rhero_v" CASCADE;
  DROP TABLE "__detail_templates_v_rhero_v_locales" CASCADE;
  DROP TABLE "___detail_templates_v_povw_v_btn_v" CASCADE;
  DROP TABLE "___detail_templates_v_povw_v_btn_v_locales" CASCADE;
  DROP TABLE "__detail_templates_v_povw_v" CASCADE;
  DROP TABLE "__detail_templates_v_povw_v_locales" CASCADE;
  DROP TABLE "__detail_templates_v_pspec_v" CASCADE;
  DROP TABLE "__detail_templates_v_pspec_v_locales" CASCADE;
  DROP TABLE "__detail_templates_v_papp_v" CASCADE;
  DROP TABLE "__detail_templates_v_papp_v_locales" CASCADE;
  DROP TABLE "___detail_templates_v_simp_v_btn_v" CASCADE;
  DROP TABLE "___detail_templates_v_simp_v_btn_v_locales" CASCADE;
  DROP TABLE "__detail_templates_v_simp_v" CASCADE;
  DROP TABLE "__detail_templates_v_simp_v_locales" CASCADE;
  DROP TABLE "__detail_templates_v_sapp_v" CASCADE;
  DROP TABLE "__detail_templates_v_sapp_v_locales" CASCADE;
  DROP TABLE "__detail_templates_v_jdet_v" CASCADE;
  DROP TABLE "__detail_templates_v_jdet_v_locales" CASCADE;
  DROP TABLE "__detail_templates_v_part_v" CASCADE;
  DROP TABLE "__detail_templates_v_part_v_locales" CASCADE;
  DROP TABLE "shared_detail_templates_rhero" CASCADE;
  DROP TABLE "shared_detail_templates_rhero_locales" CASCADE;
  DROP TABLE "shared_detail_templates_povw_btn" CASCADE;
  DROP TABLE "shared_detail_templates_povw_btn_locales" CASCADE;
  DROP TABLE "shared_detail_templates_povw" CASCADE;
  DROP TABLE "shared_detail_templates_povw_locales" CASCADE;
  DROP TABLE "shared_detail_templates_pspec" CASCADE;
  DROP TABLE "shared_detail_templates_pspec_locales" CASCADE;
  DROP TABLE "shared_detail_templates_papp" CASCADE;
  DROP TABLE "shared_detail_templates_papp_locales" CASCADE;
  DROP TABLE "shared_detail_templates_simp_btn" CASCADE;
  DROP TABLE "shared_detail_templates_simp_btn_locales" CASCADE;
  DROP TABLE "shared_detail_templates_simp" CASCADE;
  DROP TABLE "shared_detail_templates_simp_locales" CASCADE;
  DROP TABLE "shared_detail_templates_sapp" CASCADE;
  DROP TABLE "shared_detail_templates_sapp_locales" CASCADE;
  DROP TABLE "shared_detail_templates_jdet" CASCADE;
  DROP TABLE "shared_detail_templates_jdet_locales" CASCADE;
  DROP TABLE "shared_detail_templates_part" CASCADE;
  DROP TABLE "shared_detail_templates_part_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_rhero_v" CASCADE;
  DROP TABLE "__shared_detail_templates_v_rhero_v_locales" CASCADE;
  DROP TABLE "___shared_detail_templates_v_povw_v_btn_v" CASCADE;
  DROP TABLE "___shared_detail_templates_v_povw_v_btn_v_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_povw_v" CASCADE;
  DROP TABLE "__shared_detail_templates_v_povw_v_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_pspec_v" CASCADE;
  DROP TABLE "__shared_detail_templates_v_pspec_v_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_papp_v" CASCADE;
  DROP TABLE "__shared_detail_templates_v_papp_v_locales" CASCADE;
  DROP TABLE "___shared_detail_templates_v_simp_v_btn_v" CASCADE;
  DROP TABLE "___shared_detail_templates_v_simp_v_btn_v_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_simp_v" CASCADE;
  DROP TABLE "__shared_detail_templates_v_simp_v_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_sapp_v" CASCADE;
  DROP TABLE "__shared_detail_templates_v_sapp_v_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_jdet_v" CASCADE;
  DROP TABLE "__shared_detail_templates_v_jdet_v_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_part_v" CASCADE;
  DROP TABLE "__shared_detail_templates_v_part_v_locales" CASCADE;
  DROP TYPE "public"."enum_pages_povw_btn_link_type";
  DROP TYPE "public"."enum_pages_povw_btn_style";
  DROP TYPE "public"."enum_pages_pspec_heading_align";
  DROP TYPE "public"."enum_pages_pspec_contact_link_type";
  DROP TYPE "public"."enum_pages_pspec_contact_style";
  DROP TYPE "public"."enum_pages_papp_heading_align";
  DROP TYPE "public"."enum_pages_simp_btn_link_type";
  DROP TYPE "public"."enum_pages_simp_btn_style";
  DROP TYPE "public"."enum_pages_sapp_heading_align";
  DROP TYPE "public"."enum_pages_jdet_heading_align";
  DROP TYPE "public"."enum____pages_v_povw_v_btn_v_link_type";
  DROP TYPE "public"."enum____pages_v_povw_v_btn_v_style";
  DROP TYPE "public"."enum___pages_v_pspec_v_heading_align";
  DROP TYPE "public"."enum___pages_v_pspec_v_contact_link_type";
  DROP TYPE "public"."enum___pages_v_pspec_v_contact_style";
  DROP TYPE "public"."enum___pages_v_papp_v_heading_align";
  DROP TYPE "public"."enum____pages_v_simp_v_btn_v_link_type";
  DROP TYPE "public"."enum____pages_v_simp_v_btn_v_style";
  DROP TYPE "public"."enum___pages_v_sapp_v_heading_align";
  DROP TYPE "public"."enum___pages_v_jdet_v_heading_align";
  DROP TYPE "public"."enum_shared_pages_povw_btn_link_type";
  DROP TYPE "public"."enum_shared_pages_povw_btn_style";
  DROP TYPE "public"."enum_shared_pages_pspec_heading_align";
  DROP TYPE "public"."enum_shared_pages_pspec_contact_link_type";
  DROP TYPE "public"."enum_shared_pages_pspec_contact_style";
  DROP TYPE "public"."enum_shared_pages_papp_heading_align";
  DROP TYPE "public"."enum_shared_pages_simp_btn_link_type";
  DROP TYPE "public"."enum_shared_pages_simp_btn_style";
  DROP TYPE "public"."enum_shared_pages_sapp_heading_align";
  DROP TYPE "public"."enum_shared_pages_jdet_heading_align";
  DROP TYPE "public"."enum____shared_pages_v_povw_v_btn_v_link_type";
  DROP TYPE "public"."enum____shared_pages_v_povw_v_btn_v_style";
  DROP TYPE "public"."enum___shared_pages_v_pspec_v_heading_align";
  DROP TYPE "public"."enum___shared_pages_v_pspec_v_contact_link_type";
  DROP TYPE "public"."enum___shared_pages_v_pspec_v_contact_style";
  DROP TYPE "public"."enum___shared_pages_v_papp_v_heading_align";
  DROP TYPE "public"."enum____shared_pages_v_simp_v_btn_v_link_type";
  DROP TYPE "public"."enum____shared_pages_v_simp_v_btn_v_style";
  DROP TYPE "public"."enum___shared_pages_v_sapp_v_heading_align";
  DROP TYPE "public"."enum___shared_pages_v_jdet_v_heading_align";
  DROP TYPE "public"."enum_detail_templates_povw_btn_link_type";
  DROP TYPE "public"."enum_detail_templates_povw_btn_style";
  DROP TYPE "public"."enum_detail_templates_pspec_heading_align";
  DROP TYPE "public"."enum_detail_templates_pspec_contact_link_type";
  DROP TYPE "public"."enum_detail_templates_pspec_contact_style";
  DROP TYPE "public"."enum_detail_templates_papp_heading_align";
  DROP TYPE "public"."enum_detail_templates_simp_btn_link_type";
  DROP TYPE "public"."enum_detail_templates_simp_btn_style";
  DROP TYPE "public"."enum_detail_templates_sapp_heading_align";
  DROP TYPE "public"."enum_detail_templates_jdet_heading_align";
  DROP TYPE "public"."enum____detail_templates_v_povw_v_btn_v_link_type";
  DROP TYPE "public"."enum____detail_templates_v_povw_v_btn_v_style";
  DROP TYPE "public"."enum___detail_templates_v_pspec_v_heading_align";
  DROP TYPE "public"."enum___detail_templates_v_pspec_v_contact_link_type";
  DROP TYPE "public"."enum___detail_templates_v_pspec_v_contact_style";
  DROP TYPE "public"."enum___detail_templates_v_papp_v_heading_align";
  DROP TYPE "public"."enum____detail_templates_v_simp_v_btn_v_link_type";
  DROP TYPE "public"."enum____detail_templates_v_simp_v_btn_v_style";
  DROP TYPE "public"."enum___detail_templates_v_sapp_v_heading_align";
  DROP TYPE "public"."enum___detail_templates_v_jdet_v_heading_align";
  DROP TYPE "public"."enum_shared_detail_templates_povw_btn_link_type";
  DROP TYPE "public"."enum_shared_detail_templates_povw_btn_style";
  DROP TYPE "public"."enum_shared_detail_templates_pspec_heading_align";
  DROP TYPE "public"."enum_shared_detail_templates_pspec_contact_link_type";
  DROP TYPE "public"."enum_shared_detail_templates_pspec_contact_style";
  DROP TYPE "public"."enum_shared_detail_templates_papp_heading_align";
  DROP TYPE "public"."enum_shared_detail_templates_simp_btn_link_type";
  DROP TYPE "public"."enum_shared_detail_templates_simp_btn_style";
  DROP TYPE "public"."enum_shared_detail_templates_sapp_heading_align";
  DROP TYPE "public"."enum_shared_detail_templates_jdet_heading_align";
  DROP TYPE "public"."enum____shared_detail_templates_v_povw_v_btn_v_link_type";
  DROP TYPE "public"."enum____shared_detail_templates_v_povw_v_btn_v_style";
  DROP TYPE "public"."enum___shared_detail_templates_v_pspec_v_heading_align";
  DROP TYPE "public"."enum___shared_detail_templates_v_pspec_v_contact_link_type";
  DROP TYPE "public"."enum___shared_detail_templates_v_pspec_v_contact_style";
  DROP TYPE "public"."enum___shared_detail_templates_v_papp_v_heading_align";
  DROP TYPE "public"."enum____shared_detail_templates_v_simp_v_btn_v_link_type";
  DROP TYPE "public"."enum____shared_detail_templates_v_simp_v_btn_v_style";
  DROP TYPE "public"."enum___shared_detail_templates_v_sapp_v_heading_align";
  DROP TYPE "public"."enum___shared_detail_templates_v_jdet_v_heading_align";`)
}
