import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_emp_it_btn_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_pages_emp_it_btn_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_pages_emp_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_pages_gsh_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_pages_gsh_main_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_pages_eco_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_pages_eco_source" AS ENUM('others', 'manual');
  CREATE TYPE "public"."enum_pages_cin_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_____pages_v_emp_v_it_v_btn_v_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_____pages_v_emp_v_it_v_btn_v_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___pages_v_emp_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___pages_v_gsh_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___pages_v_gsh_v_main_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___pages_v_eco_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___pages_v_eco_v_source" AS ENUM('others', 'manual');
  CREATE TYPE "public"."enum___pages_v_cin_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_pages_emp_it_btn_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_pages_emp_it_btn_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_shared_pages_emp_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_pages_gsh_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_pages_gsh_main_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_pages_eco_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_pages_eco_source" AS ENUM('others', 'manual');
  CREATE TYPE "public"."enum_shared_pages_cin_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_____shared_pages_v_emp_v_it_v_btn_v_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_____shared_pages_v_emp_v_it_v_btn_v_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___shared_pages_v_emp_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___shared_pages_v_gsh_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___shared_pages_v_gsh_v_main_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___shared_pages_v_eco_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___shared_pages_v_eco_v_source" AS ENUM('others', 'manual');
  CREATE TYPE "public"."enum___shared_pages_v_cin_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_detail_templates_emp_it_btn_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_detail_templates_emp_it_btn_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_detail_templates_emp_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_detail_templates_gsh_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_detail_templates_gsh_main_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_detail_templates_eco_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_detail_templates_eco_source" AS ENUM('others', 'manual');
  CREATE TYPE "public"."enum_detail_templates_cin_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_____detail_templates_v_emp_v_it_v_btn_v_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_____detail_templates_v_emp_v_it_v_btn_v_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___detail_templates_v_emp_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___detail_templates_v_gsh_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___detail_templates_v_gsh_v_main_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___detail_templates_v_eco_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___detail_templates_v_eco_v_source" AS ENUM('others', 'manual');
  CREATE TYPE "public"."enum___detail_templates_v_cin_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_detail_templates_emp_it_btn_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_detail_templates_emp_it_btn_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_shared_detail_templates_emp_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_detail_templates_gsh_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_detail_templates_gsh_main_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_detail_templates_eco_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_detail_templates_eco_source" AS ENUM('others', 'manual');
  CREATE TYPE "public"."enum_shared_detail_templates_cin_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_____shared_detail_templates_v_emp_v_it_v_btn_v_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_____shared_detail_templates_v_emp_v_it_v_btn_v_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___shared_detail_templates_v_emp_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___shared_detail_templates_v_gsh_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___shared_detail_templates_v_gsh_v_main_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___shared_detail_templates_v_eco_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___shared_detail_templates_v_eco_v_source" AS ENUM('others', 'manual');
  CREATE TYPE "public"."enum___shared_detail_templates_v_cin_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TABLE "pages_emp_it_rg" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_emp_it_rg_locales" (
  	"name" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_emp_it_btn" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_emp_it_btn_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_pages_emp_it_btn_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "pages_emp_it_btn_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_emp_it" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"entity_id" integer,
  	"image_id" integer,
  	"pin_x" numeric,
  	"pin_y" numeric
  );
  
  CREATE TABLE "pages_emp_it_locales" (
  	"label" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_emp" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_pages_emp_heading_align" DEFAULT 'center',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_emp_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_gsh" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_pages_gsh_heading_align" DEFAULT 'left',
  	"main_image_id" integer,
  	"main_logo_id" integer,
  	"main_link_type" "enum_pages_gsh_main_link_type" DEFAULT 'internal',
  	"main_link_new_tab" boolean DEFAULT false,
  	"main_link_internal_path" varchar,
  	"main_link_external_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_gsh_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"main_link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_eco" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_pages_eco_heading_align" DEFAULT 'center',
  	"source" "enum_pages_eco_source" DEFAULT 'others',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_eco_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_cin" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_pages_cin_heading_align" DEFAULT 'left',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_cin_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"form_eyebrow" varchar,
  	"form_title" varchar,
  	"form_description" varchar,
  	"form_fields_full_name_label" varchar,
  	"form_fields_full_name_placeholder" varchar,
  	"form_fields_company_label" varchar,
  	"form_fields_company_placeholder" varchar,
  	"form_fields_work_email_label" varchar,
  	"form_fields_work_email_placeholder" varchar,
  	"form_fields_phone_label" varchar,
  	"form_fields_phone_placeholder" varchar,
  	"form_fields_message_label" varchar,
  	"form_fields_message_placeholder" varchar,
  	"form_consent_text" jsonb,
  	"form_submit_label" varchar,
  	"form_success_message" varchar,
  	"form_error_message" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_lmp" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"entity_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_lmp_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "____pages_v_emp_v_it_v_rg_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "____pages_v_emp_v_it_v_rg_v_locales" (
  	"name" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "____pages_v_emp_v_it_v_btn_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum_____pages_v_emp_v_it_v_btn_v_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_____pages_v_emp_v_it_v_btn_v_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "____pages_v_emp_v_it_v_btn_v_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "___pages_v_emp_v_it_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"entity_id" integer,
  	"image_id" integer,
  	"pin_x" numeric,
  	"pin_y" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "___pages_v_emp_v_it_v_locales" (
  	"label" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__pages_v_emp_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___pages_v_emp_v_heading_align" DEFAULT 'center',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__pages_v_emp_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__pages_v_gsh_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___pages_v_gsh_v_heading_align" DEFAULT 'left',
  	"main_image_id" integer,
  	"main_logo_id" integer,
  	"main_link_type" "enum___pages_v_gsh_v_main_link_type" DEFAULT 'internal',
  	"main_link_new_tab" boolean DEFAULT false,
  	"main_link_internal_path" varchar,
  	"main_link_external_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__pages_v_gsh_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"main_link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__pages_v_eco_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___pages_v_eco_v_heading_align" DEFAULT 'center',
  	"source" "enum___pages_v_eco_v_source" DEFAULT 'others',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__pages_v_eco_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__pages_v_cin_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___pages_v_cin_v_heading_align" DEFAULT 'left',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__pages_v_cin_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"form_eyebrow" varchar,
  	"form_title" varchar,
  	"form_description" varchar,
  	"form_fields_full_name_label" varchar,
  	"form_fields_full_name_placeholder" varchar,
  	"form_fields_company_label" varchar,
  	"form_fields_company_placeholder" varchar,
  	"form_fields_work_email_label" varchar,
  	"form_fields_work_email_placeholder" varchar,
  	"form_fields_phone_label" varchar,
  	"form_fields_phone_placeholder" varchar,
  	"form_fields_message_label" varchar,
  	"form_fields_message_placeholder" varchar,
  	"form_consent_text" jsonb,
  	"form_submit_label" varchar,
  	"form_success_message" varchar,
  	"form_error_message" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__pages_v_lmp_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"entity_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__pages_v_lmp_v_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "shared_pages_emp_it_rg" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "shared_pages_emp_it_rg_locales" (
  	"name" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_emp_it_btn" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_shared_pages_emp_it_btn_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_shared_pages_emp_it_btn_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "shared_pages_emp_it_btn_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_emp_it" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"entity_id" integer,
  	"image_id" integer,
  	"pin_x" numeric,
  	"pin_y" numeric
  );
  
  CREATE TABLE "shared_pages_emp_it_locales" (
  	"label" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_emp" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_pages_emp_heading_align" DEFAULT 'center',
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_pages_emp_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_gsh" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_pages_gsh_heading_align" DEFAULT 'left',
  	"main_image_id" integer,
  	"main_logo_id" integer,
  	"main_link_type" "enum_shared_pages_gsh_main_link_type" DEFAULT 'internal',
  	"main_link_new_tab" boolean DEFAULT false,
  	"main_link_internal_path" varchar,
  	"main_link_external_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_pages_gsh_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"main_link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_eco" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_pages_eco_heading_align" DEFAULT 'center',
  	"source" "enum_shared_pages_eco_source" DEFAULT 'others',
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_pages_eco_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_cin" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_pages_cin_heading_align" DEFAULT 'left',
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_pages_cin_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"form_eyebrow" varchar,
  	"form_title" varchar,
  	"form_description" varchar,
  	"form_fields_full_name_label" varchar,
  	"form_fields_full_name_placeholder" varchar,
  	"form_fields_company_label" varchar,
  	"form_fields_company_placeholder" varchar,
  	"form_fields_work_email_label" varchar,
  	"form_fields_work_email_placeholder" varchar,
  	"form_fields_phone_label" varchar,
  	"form_fields_phone_placeholder" varchar,
  	"form_fields_message_label" varchar,
  	"form_fields_message_placeholder" varchar,
  	"form_consent_text" jsonb,
  	"form_submit_label" varchar,
  	"form_success_message" varchar,
  	"form_error_message" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_lmp" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"entity_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_pages_lmp_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "____shared_pages_v_emp_v_it_v_rg_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "____shared_pages_v_emp_v_it_v_rg_v_locales" (
  	"name" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "____shared_pages_v_emp_v_it_v_btn_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum_____shared_pages_v_emp_v_it_v_btn_v_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_____shared_pages_v_emp_v_it_v_btn_v_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "____shared_pages_v_emp_v_it_v_btn_v_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "___shared_pages_v_emp_v_it_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"entity_id" integer,
  	"image_id" integer,
  	"pin_x" numeric,
  	"pin_y" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "___shared_pages_v_emp_v_it_v_locales" (
  	"label" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_emp_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_pages_v_emp_v_heading_align" DEFAULT 'center',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_pages_v_emp_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_gsh_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_pages_v_gsh_v_heading_align" DEFAULT 'left',
  	"main_image_id" integer,
  	"main_logo_id" integer,
  	"main_link_type" "enum___shared_pages_v_gsh_v_main_link_type" DEFAULT 'internal',
  	"main_link_new_tab" boolean DEFAULT false,
  	"main_link_internal_path" varchar,
  	"main_link_external_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_pages_v_gsh_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"main_link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_eco_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_pages_v_eco_v_heading_align" DEFAULT 'center',
  	"source" "enum___shared_pages_v_eco_v_source" DEFAULT 'others',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_pages_v_eco_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_cin_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_pages_v_cin_v_heading_align" DEFAULT 'left',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_pages_v_cin_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"form_eyebrow" varchar,
  	"form_title" varchar,
  	"form_description" varchar,
  	"form_fields_full_name_label" varchar,
  	"form_fields_full_name_placeholder" varchar,
  	"form_fields_company_label" varchar,
  	"form_fields_company_placeholder" varchar,
  	"form_fields_work_email_label" varchar,
  	"form_fields_work_email_placeholder" varchar,
  	"form_fields_phone_label" varchar,
  	"form_fields_phone_placeholder" varchar,
  	"form_fields_message_label" varchar,
  	"form_fields_message_placeholder" varchar,
  	"form_consent_text" jsonb,
  	"form_submit_label" varchar,
  	"form_success_message" varchar,
  	"form_error_message" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_lmp_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"entity_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_pages_v_lmp_v_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "detail_templates_emp_it_rg" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "detail_templates_emp_it_rg_locales" (
  	"name" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_emp_it_btn" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_detail_templates_emp_it_btn_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_detail_templates_emp_it_btn_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "detail_templates_emp_it_btn_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_emp_it" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"entity_id" integer,
  	"image_id" integer,
  	"pin_x" numeric,
  	"pin_y" numeric
  );
  
  CREATE TABLE "detail_templates_emp_it_locales" (
  	"label" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_emp" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_detail_templates_emp_heading_align" DEFAULT 'center',
  	"block_name" varchar
  );
  
  CREATE TABLE "detail_templates_emp_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_gsh" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_detail_templates_gsh_heading_align" DEFAULT 'left',
  	"main_image_id" integer,
  	"main_logo_id" integer,
  	"main_link_type" "enum_detail_templates_gsh_main_link_type" DEFAULT 'internal',
  	"main_link_new_tab" boolean DEFAULT false,
  	"main_link_internal_path" varchar,
  	"main_link_external_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "detail_templates_gsh_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"main_link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_eco" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_detail_templates_eco_heading_align" DEFAULT 'center',
  	"source" "enum_detail_templates_eco_source" DEFAULT 'others',
  	"block_name" varchar
  );
  
  CREATE TABLE "detail_templates_eco_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_cin" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_detail_templates_cin_heading_align" DEFAULT 'left',
  	"block_name" varchar
  );
  
  CREATE TABLE "detail_templates_cin_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"form_eyebrow" varchar,
  	"form_title" varchar,
  	"form_description" varchar,
  	"form_fields_full_name_label" varchar,
  	"form_fields_full_name_placeholder" varchar,
  	"form_fields_company_label" varchar,
  	"form_fields_company_placeholder" varchar,
  	"form_fields_work_email_label" varchar,
  	"form_fields_work_email_placeholder" varchar,
  	"form_fields_phone_label" varchar,
  	"form_fields_phone_placeholder" varchar,
  	"form_fields_message_label" varchar,
  	"form_fields_message_placeholder" varchar,
  	"form_consent_text" jsonb,
  	"form_submit_label" varchar,
  	"form_success_message" varchar,
  	"form_error_message" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_lmp" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"entity_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "detail_templates_lmp_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "____detail_templates_v_emp_v_it_v_rg_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "____detail_templates_v_emp_v_it_v_rg_v_locales" (
  	"name" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "____detail_templates_v_emp_v_it_v_btn_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum_____detail_templates_v_emp_v_it_v_btn_v_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_____detail_templates_v_emp_v_it_v_btn_v_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "____detail_templates_v_emp_v_it_v_btn_v_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "___detail_templates_v_emp_v_it_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"entity_id" integer,
  	"image_id" integer,
  	"pin_x" numeric,
  	"pin_y" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "___detail_templates_v_emp_v_it_v_locales" (
  	"label" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_emp_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___detail_templates_v_emp_v_heading_align" DEFAULT 'center',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__detail_templates_v_emp_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_gsh_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___detail_templates_v_gsh_v_heading_align" DEFAULT 'left',
  	"main_image_id" integer,
  	"main_logo_id" integer,
  	"main_link_type" "enum___detail_templates_v_gsh_v_main_link_type" DEFAULT 'internal',
  	"main_link_new_tab" boolean DEFAULT false,
  	"main_link_internal_path" varchar,
  	"main_link_external_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__detail_templates_v_gsh_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"main_link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_eco_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___detail_templates_v_eco_v_heading_align" DEFAULT 'center',
  	"source" "enum___detail_templates_v_eco_v_source" DEFAULT 'others',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__detail_templates_v_eco_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_cin_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___detail_templates_v_cin_v_heading_align" DEFAULT 'left',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__detail_templates_v_cin_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"form_eyebrow" varchar,
  	"form_title" varchar,
  	"form_description" varchar,
  	"form_fields_full_name_label" varchar,
  	"form_fields_full_name_placeholder" varchar,
  	"form_fields_company_label" varchar,
  	"form_fields_company_placeholder" varchar,
  	"form_fields_work_email_label" varchar,
  	"form_fields_work_email_placeholder" varchar,
  	"form_fields_phone_label" varchar,
  	"form_fields_phone_placeholder" varchar,
  	"form_fields_message_label" varchar,
  	"form_fields_message_placeholder" varchar,
  	"form_consent_text" jsonb,
  	"form_submit_label" varchar,
  	"form_success_message" varchar,
  	"form_error_message" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_lmp_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"entity_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__detail_templates_v_lmp_v_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_emp_it_rg" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_emp_it_rg_locales" (
  	"name" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_emp_it_btn" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_shared_detail_templates_emp_it_btn_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_shared_detail_templates_emp_it_btn_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "shared_detail_templates_emp_it_btn_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_emp_it" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"entity_id" integer,
  	"image_id" integer,
  	"pin_x" numeric,
  	"pin_y" numeric
  );
  
  CREATE TABLE "shared_detail_templates_emp_it_locales" (
  	"label" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_emp" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_detail_templates_emp_heading_align" DEFAULT 'center',
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_detail_templates_emp_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_gsh" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_detail_templates_gsh_heading_align" DEFAULT 'left',
  	"main_image_id" integer,
  	"main_logo_id" integer,
  	"main_link_type" "enum_shared_detail_templates_gsh_main_link_type" DEFAULT 'internal',
  	"main_link_new_tab" boolean DEFAULT false,
  	"main_link_internal_path" varchar,
  	"main_link_external_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_detail_templates_gsh_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"main_link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_eco" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_detail_templates_eco_heading_align" DEFAULT 'center',
  	"source" "enum_shared_detail_templates_eco_source" DEFAULT 'others',
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_detail_templates_eco_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_cin" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_detail_templates_cin_heading_align" DEFAULT 'left',
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_detail_templates_cin_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"form_eyebrow" varchar,
  	"form_title" varchar,
  	"form_description" varchar,
  	"form_fields_full_name_label" varchar,
  	"form_fields_full_name_placeholder" varchar,
  	"form_fields_company_label" varchar,
  	"form_fields_company_placeholder" varchar,
  	"form_fields_work_email_label" varchar,
  	"form_fields_work_email_placeholder" varchar,
  	"form_fields_phone_label" varchar,
  	"form_fields_phone_placeholder" varchar,
  	"form_fields_message_label" varchar,
  	"form_fields_message_placeholder" varchar,
  	"form_consent_text" jsonb,
  	"form_submit_label" varchar,
  	"form_success_message" varchar,
  	"form_error_message" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_lmp" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"entity_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_detail_templates_lmp_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "____shared_detail_templates_v_emp_v_it_v_rg_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "____shared_detail_templates_v_emp_v_it_v_rg_v_locales" (
  	"name" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "____shared_detail_templates_v_emp_v_it_v_btn_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum_____shared_detail_templates_v_emp_v_it_v_btn_v_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_____shared_detail_templates_v_emp_v_it_v_btn_v_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "____shared_detail_templates_v_emp_v_it_v_btn_v_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "___shared_detail_templates_v_emp_v_it_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"entity_id" integer,
  	"image_id" integer,
  	"pin_x" numeric,
  	"pin_y" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "___shared_detail_templates_v_emp_v_it_v_locales" (
  	"label" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_emp_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_detail_templates_v_emp_v_heading_align" DEFAULT 'center',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_emp_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_gsh_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_detail_templates_v_gsh_v_heading_align" DEFAULT 'left',
  	"main_image_id" integer,
  	"main_logo_id" integer,
  	"main_link_type" "enum___shared_detail_templates_v_gsh_v_main_link_type" DEFAULT 'internal',
  	"main_link_new_tab" boolean DEFAULT false,
  	"main_link_internal_path" varchar,
  	"main_link_external_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_gsh_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"main_link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_eco_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_detail_templates_v_eco_v_heading_align" DEFAULT 'center',
  	"source" "enum___shared_detail_templates_v_eco_v_source" DEFAULT 'others',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_eco_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_cin_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_detail_templates_v_cin_v_heading_align" DEFAULT 'left',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_cin_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"form_eyebrow" varchar,
  	"form_title" varchar,
  	"form_description" varchar,
  	"form_fields_full_name_label" varchar,
  	"form_fields_full_name_placeholder" varchar,
  	"form_fields_company_label" varchar,
  	"form_fields_company_placeholder" varchar,
  	"form_fields_work_email_label" varchar,
  	"form_fields_work_email_placeholder" varchar,
  	"form_fields_phone_label" varchar,
  	"form_fields_phone_placeholder" varchar,
  	"form_fields_message_label" varchar,
  	"form_fields_message_placeholder" varchar,
  	"form_consent_text" jsonb,
  	"form_submit_label" varchar,
  	"form_success_message" varchar,
  	"form_error_message" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_lmp_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"entity_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_lmp_v_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages_rels" ADD COLUMN "tenants_id" integer;
  ALTER TABLE "_pages_v_rels" ADD COLUMN "tenants_id" integer;
  ALTER TABLE "shared_pages_rels" ADD COLUMN "tenants_id" integer;
  ALTER TABLE "_shared_pages_v_rels" ADD COLUMN "tenants_id" integer;
  ALTER TABLE "detail_templates_rels" ADD COLUMN "tenants_id" integer;
  ALTER TABLE "_detail_templates_v_rels" ADD COLUMN "tenants_id" integer;
  ALTER TABLE "shared_detail_templates_rels" ADD COLUMN "tenants_id" integer;
  ALTER TABLE "_shared_detail_templates_v_rels" ADD COLUMN "tenants_id" integer;
  ALTER TABLE "pages_emp_it_rg" ADD CONSTRAINT "pages_emp_it_rg_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_emp_it"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_emp_it_rg_locales" ADD CONSTRAINT "pages_emp_it_rg_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_emp_it_rg"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_emp_it_btn" ADD CONSTRAINT "pages_emp_it_btn_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_emp_it"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_emp_it_btn_locales" ADD CONSTRAINT "pages_emp_it_btn_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_emp_it_btn"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_emp_it" ADD CONSTRAINT "pages_emp_it_entity_id_tenants_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_emp_it" ADD CONSTRAINT "pages_emp_it_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_emp_it" ADD CONSTRAINT "pages_emp_it_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_emp"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_emp_it_locales" ADD CONSTRAINT "pages_emp_it_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_emp_it"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_emp" ADD CONSTRAINT "pages_emp_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_emp_locales" ADD CONSTRAINT "pages_emp_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_emp"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_gsh" ADD CONSTRAINT "pages_gsh_main_image_id_media_id_fk" FOREIGN KEY ("main_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_gsh" ADD CONSTRAINT "pages_gsh_main_logo_id_media_id_fk" FOREIGN KEY ("main_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_gsh" ADD CONSTRAINT "pages_gsh_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_gsh_locales" ADD CONSTRAINT "pages_gsh_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_gsh"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_eco" ADD CONSTRAINT "pages_eco_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_eco_locales" ADD CONSTRAINT "pages_eco_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_eco"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_cin" ADD CONSTRAINT "pages_cin_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_cin_locales" ADD CONSTRAINT "pages_cin_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_cin"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_lmp" ADD CONSTRAINT "pages_lmp_entity_id_tenants_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_lmp" ADD CONSTRAINT "pages_lmp_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_lmp_locales" ADD CONSTRAINT "pages_lmp_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_lmp"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "____pages_v_emp_v_it_v_rg_v" ADD CONSTRAINT "____pages_v_emp_v_it_v_rg_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___pages_v_emp_v_it_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "____pages_v_emp_v_it_v_rg_v_locales" ADD CONSTRAINT "____pages_v_emp_v_it_v_rg_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."____pages_v_emp_v_it_v_rg_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "____pages_v_emp_v_it_v_btn_v" ADD CONSTRAINT "____pages_v_emp_v_it_v_btn_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___pages_v_emp_v_it_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "____pages_v_emp_v_it_v_btn_v_locales" ADD CONSTRAINT "____pages_v_emp_v_it_v_btn_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."____pages_v_emp_v_it_v_btn_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___pages_v_emp_v_it_v" ADD CONSTRAINT "___pages_v_emp_v_it_v_entity_id_tenants_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "___pages_v_emp_v_it_v" ADD CONSTRAINT "___pages_v_emp_v_it_v_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "___pages_v_emp_v_it_v" ADD CONSTRAINT "___pages_v_emp_v_it_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_emp_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___pages_v_emp_v_it_v_locales" ADD CONSTRAINT "___pages_v_emp_v_it_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___pages_v_emp_v_it_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_emp_v" ADD CONSTRAINT "__pages_v_emp_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_emp_v_locales" ADD CONSTRAINT "__pages_v_emp_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_emp_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_gsh_v" ADD CONSTRAINT "__pages_v_gsh_v_main_image_id_media_id_fk" FOREIGN KEY ("main_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__pages_v_gsh_v" ADD CONSTRAINT "__pages_v_gsh_v_main_logo_id_media_id_fk" FOREIGN KEY ("main_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__pages_v_gsh_v" ADD CONSTRAINT "__pages_v_gsh_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_gsh_v_locales" ADD CONSTRAINT "__pages_v_gsh_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_gsh_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_eco_v" ADD CONSTRAINT "__pages_v_eco_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_eco_v_locales" ADD CONSTRAINT "__pages_v_eco_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_eco_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_cin_v" ADD CONSTRAINT "__pages_v_cin_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_cin_v_locales" ADD CONSTRAINT "__pages_v_cin_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_cin_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_lmp_v" ADD CONSTRAINT "__pages_v_lmp_v_entity_id_tenants_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__pages_v_lmp_v" ADD CONSTRAINT "__pages_v_lmp_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_lmp_v_locales" ADD CONSTRAINT "__pages_v_lmp_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_lmp_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_emp_it_rg" ADD CONSTRAINT "shared_pages_emp_it_rg_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_emp_it"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_emp_it_rg_locales" ADD CONSTRAINT "shared_pages_emp_it_rg_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_emp_it_rg"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_emp_it_btn" ADD CONSTRAINT "shared_pages_emp_it_btn_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_emp_it"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_emp_it_btn_locales" ADD CONSTRAINT "shared_pages_emp_it_btn_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_emp_it_btn"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_emp_it" ADD CONSTRAINT "shared_pages_emp_it_entity_id_tenants_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_pages_emp_it" ADD CONSTRAINT "shared_pages_emp_it_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_pages_emp_it" ADD CONSTRAINT "shared_pages_emp_it_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_emp"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_emp_it_locales" ADD CONSTRAINT "shared_pages_emp_it_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_emp_it"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_emp" ADD CONSTRAINT "shared_pages_emp_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_emp_locales" ADD CONSTRAINT "shared_pages_emp_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_emp"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_gsh" ADD CONSTRAINT "shared_pages_gsh_main_image_id_media_id_fk" FOREIGN KEY ("main_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_pages_gsh" ADD CONSTRAINT "shared_pages_gsh_main_logo_id_media_id_fk" FOREIGN KEY ("main_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_pages_gsh" ADD CONSTRAINT "shared_pages_gsh_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_gsh_locales" ADD CONSTRAINT "shared_pages_gsh_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_gsh"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_eco" ADD CONSTRAINT "shared_pages_eco_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_eco_locales" ADD CONSTRAINT "shared_pages_eco_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_eco"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_cin" ADD CONSTRAINT "shared_pages_cin_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_cin_locales" ADD CONSTRAINT "shared_pages_cin_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_cin"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_lmp" ADD CONSTRAINT "shared_pages_lmp_entity_id_tenants_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_pages_lmp" ADD CONSTRAINT "shared_pages_lmp_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_lmp_locales" ADD CONSTRAINT "shared_pages_lmp_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_lmp"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "____shared_pages_v_emp_v_it_v_rg_v" ADD CONSTRAINT "____shared_pages_v_emp_v_it_v_rg_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___shared_pages_v_emp_v_it_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "____shared_pages_v_emp_v_it_v_rg_v_locales" ADD CONSTRAINT "____shared_pages_v_emp_v_it_v_rg_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."____shared_pages_v_emp_v_it_v_rg_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "____shared_pages_v_emp_v_it_v_btn_v" ADD CONSTRAINT "____shared_pages_v_emp_v_it_v_btn_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___shared_pages_v_emp_v_it_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "____shared_pages_v_emp_v_it_v_btn_v_locales" ADD CONSTRAINT "____shared_pages_v_emp_v_it_v_btn_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."____shared_pages_v_emp_v_it_v_btn_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_pages_v_emp_v_it_v" ADD CONSTRAINT "___shared_pages_v_emp_v_it_v_entity_id_tenants_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "___shared_pages_v_emp_v_it_v" ADD CONSTRAINT "___shared_pages_v_emp_v_it_v_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "___shared_pages_v_emp_v_it_v" ADD CONSTRAINT "___shared_pages_v_emp_v_it_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_emp_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_pages_v_emp_v_it_v_locales" ADD CONSTRAINT "___shared_pages_v_emp_v_it_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___shared_pages_v_emp_v_it_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_emp_v" ADD CONSTRAINT "__shared_pages_v_emp_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_emp_v_locales" ADD CONSTRAINT "__shared_pages_v_emp_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_emp_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_gsh_v" ADD CONSTRAINT "__shared_pages_v_gsh_v_main_image_id_media_id_fk" FOREIGN KEY ("main_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_gsh_v" ADD CONSTRAINT "__shared_pages_v_gsh_v_main_logo_id_media_id_fk" FOREIGN KEY ("main_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_gsh_v" ADD CONSTRAINT "__shared_pages_v_gsh_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_gsh_v_locales" ADD CONSTRAINT "__shared_pages_v_gsh_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_gsh_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_eco_v" ADD CONSTRAINT "__shared_pages_v_eco_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_eco_v_locales" ADD CONSTRAINT "__shared_pages_v_eco_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_eco_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_cin_v" ADD CONSTRAINT "__shared_pages_v_cin_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_cin_v_locales" ADD CONSTRAINT "__shared_pages_v_cin_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_cin_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_lmp_v" ADD CONSTRAINT "__shared_pages_v_lmp_v_entity_id_tenants_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_lmp_v" ADD CONSTRAINT "__shared_pages_v_lmp_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_lmp_v_locales" ADD CONSTRAINT "__shared_pages_v_lmp_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_lmp_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_emp_it_rg" ADD CONSTRAINT "detail_templates_emp_it_rg_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_emp_it"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_emp_it_rg_locales" ADD CONSTRAINT "detail_templates_emp_it_rg_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_emp_it_rg"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_emp_it_btn" ADD CONSTRAINT "detail_templates_emp_it_btn_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_emp_it"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_emp_it_btn_locales" ADD CONSTRAINT "detail_templates_emp_it_btn_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_emp_it_btn"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_emp_it" ADD CONSTRAINT "detail_templates_emp_it_entity_id_tenants_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "detail_templates_emp_it" ADD CONSTRAINT "detail_templates_emp_it_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "detail_templates_emp_it" ADD CONSTRAINT "detail_templates_emp_it_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_emp"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_emp_it_locales" ADD CONSTRAINT "detail_templates_emp_it_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_emp_it"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_emp" ADD CONSTRAINT "detail_templates_emp_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_emp_locales" ADD CONSTRAINT "detail_templates_emp_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_emp"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_gsh" ADD CONSTRAINT "detail_templates_gsh_main_image_id_media_id_fk" FOREIGN KEY ("main_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "detail_templates_gsh" ADD CONSTRAINT "detail_templates_gsh_main_logo_id_media_id_fk" FOREIGN KEY ("main_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "detail_templates_gsh" ADD CONSTRAINT "detail_templates_gsh_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_gsh_locales" ADD CONSTRAINT "detail_templates_gsh_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_gsh"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_eco" ADD CONSTRAINT "detail_templates_eco_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_eco_locales" ADD CONSTRAINT "detail_templates_eco_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_eco"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_cin" ADD CONSTRAINT "detail_templates_cin_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_cin_locales" ADD CONSTRAINT "detail_templates_cin_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_cin"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_lmp" ADD CONSTRAINT "detail_templates_lmp_entity_id_tenants_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "detail_templates_lmp" ADD CONSTRAINT "detail_templates_lmp_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_lmp_locales" ADD CONSTRAINT "detail_templates_lmp_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_lmp"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "____detail_templates_v_emp_v_it_v_rg_v" ADD CONSTRAINT "____detail_templates_v_emp_v_it_v_rg_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___detail_templates_v_emp_v_it_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "____detail_templates_v_emp_v_it_v_rg_v_locales" ADD CONSTRAINT "____detail_templates_v_emp_v_it_v_rg_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."____detail_templates_v_emp_v_it_v_rg_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "____detail_templates_v_emp_v_it_v_btn_v" ADD CONSTRAINT "____detail_templates_v_emp_v_it_v_btn_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___detail_templates_v_emp_v_it_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "____detail_templates_v_emp_v_it_v_btn_v_locales" ADD CONSTRAINT "____detail_templates_v_emp_v_it_v_btn_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."____detail_templates_v_emp_v_it_v_btn_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___detail_templates_v_emp_v_it_v" ADD CONSTRAINT "___detail_templates_v_emp_v_it_v_entity_id_tenants_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "___detail_templates_v_emp_v_it_v" ADD CONSTRAINT "___detail_templates_v_emp_v_it_v_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "___detail_templates_v_emp_v_it_v" ADD CONSTRAINT "___detail_templates_v_emp_v_it_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_emp_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___detail_templates_v_emp_v_it_v_locales" ADD CONSTRAINT "___detail_templates_v_emp_v_it_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___detail_templates_v_emp_v_it_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_emp_v" ADD CONSTRAINT "__detail_templates_v_emp_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_emp_v_locales" ADD CONSTRAINT "__detail_templates_v_emp_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_emp_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_gsh_v" ADD CONSTRAINT "__detail_templates_v_gsh_v_main_image_id_media_id_fk" FOREIGN KEY ("main_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_gsh_v" ADD CONSTRAINT "__detail_templates_v_gsh_v_main_logo_id_media_id_fk" FOREIGN KEY ("main_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_gsh_v" ADD CONSTRAINT "__detail_templates_v_gsh_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_gsh_v_locales" ADD CONSTRAINT "__detail_templates_v_gsh_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_gsh_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_eco_v" ADD CONSTRAINT "__detail_templates_v_eco_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_eco_v_locales" ADD CONSTRAINT "__detail_templates_v_eco_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_eco_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_cin_v" ADD CONSTRAINT "__detail_templates_v_cin_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_cin_v_locales" ADD CONSTRAINT "__detail_templates_v_cin_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_cin_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_lmp_v" ADD CONSTRAINT "__detail_templates_v_lmp_v_entity_id_tenants_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_lmp_v" ADD CONSTRAINT "__detail_templates_v_lmp_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_lmp_v_locales" ADD CONSTRAINT "__detail_templates_v_lmp_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_lmp_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_emp_it_rg" ADD CONSTRAINT "shared_detail_templates_emp_it_rg_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_emp_it"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_emp_it_rg_locales" ADD CONSTRAINT "shared_detail_templates_emp_it_rg_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_emp_it_rg"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_emp_it_btn" ADD CONSTRAINT "shared_detail_templates_emp_it_btn_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_emp_it"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_emp_it_btn_locales" ADD CONSTRAINT "shared_detail_templates_emp_it_btn_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_emp_it_btn"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_emp_it" ADD CONSTRAINT "shared_detail_templates_emp_it_entity_id_tenants_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_emp_it" ADD CONSTRAINT "shared_detail_templates_emp_it_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_emp_it" ADD CONSTRAINT "shared_detail_templates_emp_it_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_emp"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_emp_it_locales" ADD CONSTRAINT "shared_detail_templates_emp_it_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_emp_it"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_emp" ADD CONSTRAINT "shared_detail_templates_emp_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_emp_locales" ADD CONSTRAINT "shared_detail_templates_emp_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_emp"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_gsh" ADD CONSTRAINT "shared_detail_templates_gsh_main_image_id_media_id_fk" FOREIGN KEY ("main_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_gsh" ADD CONSTRAINT "shared_detail_templates_gsh_main_logo_id_media_id_fk" FOREIGN KEY ("main_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_gsh" ADD CONSTRAINT "shared_detail_templates_gsh_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_gsh_locales" ADD CONSTRAINT "shared_detail_templates_gsh_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_gsh"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_eco" ADD CONSTRAINT "shared_detail_templates_eco_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_eco_locales" ADD CONSTRAINT "shared_detail_templates_eco_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_eco"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_cin" ADD CONSTRAINT "shared_detail_templates_cin_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_cin_locales" ADD CONSTRAINT "shared_detail_templates_cin_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_cin"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_lmp" ADD CONSTRAINT "shared_detail_templates_lmp_entity_id_tenants_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_lmp" ADD CONSTRAINT "shared_detail_templates_lmp_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_lmp_locales" ADD CONSTRAINT "shared_detail_templates_lmp_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_lmp"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "____shared_detail_templates_v_emp_v_it_v_rg_v" ADD CONSTRAINT "____shared_detail_templates_v_emp_v_it_v_rg_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___shared_detail_templates_v_emp_v_it_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "____shared_detail_templates_v_emp_v_it_v_rg_v_locales" ADD CONSTRAINT "____shared_detail_templates_v_emp_v_it_v_rg_v_locales_par_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."____shared_detail_templates_v_emp_v_it_v_rg_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "____shared_detail_templates_v_emp_v_it_v_btn_v" ADD CONSTRAINT "____shared_detail_templates_v_emp_v_it_v_btn_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___shared_detail_templates_v_emp_v_it_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "____shared_detail_templates_v_emp_v_it_v_btn_v_locales" ADD CONSTRAINT "____shared_detail_templates_v_emp_v_it_v_btn_v_locales_pa_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."____shared_detail_templates_v_emp_v_it_v_btn_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_detail_templates_v_emp_v_it_v" ADD CONSTRAINT "___shared_detail_templates_v_emp_v_it_v_entity_id_tenants_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "___shared_detail_templates_v_emp_v_it_v" ADD CONSTRAINT "___shared_detail_templates_v_emp_v_it_v_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "___shared_detail_templates_v_emp_v_it_v" ADD CONSTRAINT "___shared_detail_templates_v_emp_v_it_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_emp_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_detail_templates_v_emp_v_it_v_locales" ADD CONSTRAINT "___shared_detail_templates_v_emp_v_it_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___shared_detail_templates_v_emp_v_it_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_emp_v" ADD CONSTRAINT "__shared_detail_templates_v_emp_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_emp_v_locales" ADD CONSTRAINT "__shared_detail_templates_v_emp_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_emp_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_gsh_v" ADD CONSTRAINT "__shared_detail_templates_v_gsh_v_main_image_id_media_id_fk" FOREIGN KEY ("main_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_gsh_v" ADD CONSTRAINT "__shared_detail_templates_v_gsh_v_main_logo_id_media_id_fk" FOREIGN KEY ("main_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_gsh_v" ADD CONSTRAINT "__shared_detail_templates_v_gsh_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_gsh_v_locales" ADD CONSTRAINT "__shared_detail_templates_v_gsh_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_gsh_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_eco_v" ADD CONSTRAINT "__shared_detail_templates_v_eco_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_eco_v_locales" ADD CONSTRAINT "__shared_detail_templates_v_eco_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_eco_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_cin_v" ADD CONSTRAINT "__shared_detail_templates_v_cin_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_cin_v_locales" ADD CONSTRAINT "__shared_detail_templates_v_cin_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_cin_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_lmp_v" ADD CONSTRAINT "__shared_detail_templates_v_lmp_v_entity_id_tenants_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_lmp_v" ADD CONSTRAINT "__shared_detail_templates_v_lmp_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_lmp_v_locales" ADD CONSTRAINT "__shared_detail_templates_v_lmp_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_lmp_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_emp_it_rg_order_idx" ON "pages_emp_it_rg" USING btree ("_order");
  CREATE INDEX "pages_emp_it_rg_parent_id_idx" ON "pages_emp_it_rg" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_emp_it_rg_locales_locale_parent_id_unique" ON "pages_emp_it_rg_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_emp_it_btn_order_idx" ON "pages_emp_it_btn" USING btree ("_order");
  CREATE INDEX "pages_emp_it_btn_parent_id_idx" ON "pages_emp_it_btn" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_emp_it_btn_locales_locale_parent_id_unique" ON "pages_emp_it_btn_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_emp_it_order_idx" ON "pages_emp_it" USING btree ("_order");
  CREATE INDEX "pages_emp_it_parent_id_idx" ON "pages_emp_it" USING btree ("_parent_id");
  CREATE INDEX "pages_emp_it_entity_idx" ON "pages_emp_it" USING btree ("entity_id");
  CREATE INDEX "pages_emp_it_image_idx" ON "pages_emp_it" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_emp_it_locales_locale_parent_id_unique" ON "pages_emp_it_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_emp_order_idx" ON "pages_emp" USING btree ("_order");
  CREATE INDEX "pages_emp_parent_id_idx" ON "pages_emp" USING btree ("_parent_id");
  CREATE INDEX "pages_emp_path_idx" ON "pages_emp" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_emp_locales_locale_parent_id_unique" ON "pages_emp_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_gsh_order_idx" ON "pages_gsh" USING btree ("_order");
  CREATE INDEX "pages_gsh_parent_id_idx" ON "pages_gsh" USING btree ("_parent_id");
  CREATE INDEX "pages_gsh_path_idx" ON "pages_gsh" USING btree ("_path");
  CREATE INDEX "pages_gsh_main_image_idx" ON "pages_gsh" USING btree ("main_image_id");
  CREATE INDEX "pages_gsh_main_logo_idx" ON "pages_gsh" USING btree ("main_logo_id");
  CREATE UNIQUE INDEX "pages_gsh_locales_locale_parent_id_unique" ON "pages_gsh_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_eco_order_idx" ON "pages_eco" USING btree ("_order");
  CREATE INDEX "pages_eco_parent_id_idx" ON "pages_eco" USING btree ("_parent_id");
  CREATE INDEX "pages_eco_path_idx" ON "pages_eco" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_eco_locales_locale_parent_id_unique" ON "pages_eco_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_cin_order_idx" ON "pages_cin" USING btree ("_order");
  CREATE INDEX "pages_cin_parent_id_idx" ON "pages_cin" USING btree ("_parent_id");
  CREATE INDEX "pages_cin_path_idx" ON "pages_cin" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_cin_locales_locale_parent_id_unique" ON "pages_cin_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_lmp_order_idx" ON "pages_lmp" USING btree ("_order");
  CREATE INDEX "pages_lmp_parent_id_idx" ON "pages_lmp" USING btree ("_parent_id");
  CREATE INDEX "pages_lmp_path_idx" ON "pages_lmp" USING btree ("_path");
  CREATE INDEX "pages_lmp_entity_idx" ON "pages_lmp" USING btree ("entity_id");
  CREATE UNIQUE INDEX "pages_lmp_locales_locale_parent_id_unique" ON "pages_lmp_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "____pages_v_emp_v_it_v_rg_v_order_idx" ON "____pages_v_emp_v_it_v_rg_v" USING btree ("_order");
  CREATE INDEX "____pages_v_emp_v_it_v_rg_v_parent_id_idx" ON "____pages_v_emp_v_it_v_rg_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "____pages_v_emp_v_it_v_rg_v_locales_locale_parent_id_unique" ON "____pages_v_emp_v_it_v_rg_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "____pages_v_emp_v_it_v_btn_v_order_idx" ON "____pages_v_emp_v_it_v_btn_v" USING btree ("_order");
  CREATE INDEX "____pages_v_emp_v_it_v_btn_v_parent_id_idx" ON "____pages_v_emp_v_it_v_btn_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "____pages_v_emp_v_it_v_btn_v_locales_locale_parent_id_unique" ON "____pages_v_emp_v_it_v_btn_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___pages_v_emp_v_it_v_order_idx" ON "___pages_v_emp_v_it_v" USING btree ("_order");
  CREATE INDEX "___pages_v_emp_v_it_v_parent_id_idx" ON "___pages_v_emp_v_it_v" USING btree ("_parent_id");
  CREATE INDEX "___pages_v_emp_v_it_v_entity_idx" ON "___pages_v_emp_v_it_v" USING btree ("entity_id");
  CREATE INDEX "___pages_v_emp_v_it_v_image_idx" ON "___pages_v_emp_v_it_v" USING btree ("image_id");
  CREATE UNIQUE INDEX "___pages_v_emp_v_it_v_locales_locale_parent_id_unique" ON "___pages_v_emp_v_it_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__pages_v_emp_v_order_idx" ON "__pages_v_emp_v" USING btree ("_order");
  CREATE INDEX "__pages_v_emp_v_parent_id_idx" ON "__pages_v_emp_v" USING btree ("_parent_id");
  CREATE INDEX "__pages_v_emp_v_path_idx" ON "__pages_v_emp_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__pages_v_emp_v_locales_locale_parent_id_unique" ON "__pages_v_emp_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__pages_v_gsh_v_order_idx" ON "__pages_v_gsh_v" USING btree ("_order");
  CREATE INDEX "__pages_v_gsh_v_parent_id_idx" ON "__pages_v_gsh_v" USING btree ("_parent_id");
  CREATE INDEX "__pages_v_gsh_v_path_idx" ON "__pages_v_gsh_v" USING btree ("_path");
  CREATE INDEX "__pages_v_gsh_v_main_image_idx" ON "__pages_v_gsh_v" USING btree ("main_image_id");
  CREATE INDEX "__pages_v_gsh_v_main_logo_idx" ON "__pages_v_gsh_v" USING btree ("main_logo_id");
  CREATE UNIQUE INDEX "__pages_v_gsh_v_locales_locale_parent_id_unique" ON "__pages_v_gsh_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__pages_v_eco_v_order_idx" ON "__pages_v_eco_v" USING btree ("_order");
  CREATE INDEX "__pages_v_eco_v_parent_id_idx" ON "__pages_v_eco_v" USING btree ("_parent_id");
  CREATE INDEX "__pages_v_eco_v_path_idx" ON "__pages_v_eco_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__pages_v_eco_v_locales_locale_parent_id_unique" ON "__pages_v_eco_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__pages_v_cin_v_order_idx" ON "__pages_v_cin_v" USING btree ("_order");
  CREATE INDEX "__pages_v_cin_v_parent_id_idx" ON "__pages_v_cin_v" USING btree ("_parent_id");
  CREATE INDEX "__pages_v_cin_v_path_idx" ON "__pages_v_cin_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__pages_v_cin_v_locales_locale_parent_id_unique" ON "__pages_v_cin_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__pages_v_lmp_v_order_idx" ON "__pages_v_lmp_v" USING btree ("_order");
  CREATE INDEX "__pages_v_lmp_v_parent_id_idx" ON "__pages_v_lmp_v" USING btree ("_parent_id");
  CREATE INDEX "__pages_v_lmp_v_path_idx" ON "__pages_v_lmp_v" USING btree ("_path");
  CREATE INDEX "__pages_v_lmp_v_entity_idx" ON "__pages_v_lmp_v" USING btree ("entity_id");
  CREATE UNIQUE INDEX "__pages_v_lmp_v_locales_locale_parent_id_unique" ON "__pages_v_lmp_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_emp_it_rg_order_idx" ON "shared_pages_emp_it_rg" USING btree ("_order");
  CREATE INDEX "shared_pages_emp_it_rg_parent_id_idx" ON "shared_pages_emp_it_rg" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shared_pages_emp_it_rg_locales_locale_parent_id_unique" ON "shared_pages_emp_it_rg_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_emp_it_btn_order_idx" ON "shared_pages_emp_it_btn" USING btree ("_order");
  CREATE INDEX "shared_pages_emp_it_btn_parent_id_idx" ON "shared_pages_emp_it_btn" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shared_pages_emp_it_btn_locales_locale_parent_id_unique" ON "shared_pages_emp_it_btn_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_emp_it_order_idx" ON "shared_pages_emp_it" USING btree ("_order");
  CREATE INDEX "shared_pages_emp_it_parent_id_idx" ON "shared_pages_emp_it" USING btree ("_parent_id");
  CREATE INDEX "shared_pages_emp_it_entity_idx" ON "shared_pages_emp_it" USING btree ("entity_id");
  CREATE INDEX "shared_pages_emp_it_image_idx" ON "shared_pages_emp_it" USING btree ("image_id");
  CREATE UNIQUE INDEX "shared_pages_emp_it_locales_locale_parent_id_unique" ON "shared_pages_emp_it_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_emp_order_idx" ON "shared_pages_emp" USING btree ("_order");
  CREATE INDEX "shared_pages_emp_parent_id_idx" ON "shared_pages_emp" USING btree ("_parent_id");
  CREATE INDEX "shared_pages_emp_path_idx" ON "shared_pages_emp" USING btree ("_path");
  CREATE UNIQUE INDEX "shared_pages_emp_locales_locale_parent_id_unique" ON "shared_pages_emp_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_gsh_order_idx" ON "shared_pages_gsh" USING btree ("_order");
  CREATE INDEX "shared_pages_gsh_parent_id_idx" ON "shared_pages_gsh" USING btree ("_parent_id");
  CREATE INDEX "shared_pages_gsh_path_idx" ON "shared_pages_gsh" USING btree ("_path");
  CREATE INDEX "shared_pages_gsh_main_image_idx" ON "shared_pages_gsh" USING btree ("main_image_id");
  CREATE INDEX "shared_pages_gsh_main_logo_idx" ON "shared_pages_gsh" USING btree ("main_logo_id");
  CREATE UNIQUE INDEX "shared_pages_gsh_locales_locale_parent_id_unique" ON "shared_pages_gsh_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_eco_order_idx" ON "shared_pages_eco" USING btree ("_order");
  CREATE INDEX "shared_pages_eco_parent_id_idx" ON "shared_pages_eco" USING btree ("_parent_id");
  CREATE INDEX "shared_pages_eco_path_idx" ON "shared_pages_eco" USING btree ("_path");
  CREATE UNIQUE INDEX "shared_pages_eco_locales_locale_parent_id_unique" ON "shared_pages_eco_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_cin_order_idx" ON "shared_pages_cin" USING btree ("_order");
  CREATE INDEX "shared_pages_cin_parent_id_idx" ON "shared_pages_cin" USING btree ("_parent_id");
  CREATE INDEX "shared_pages_cin_path_idx" ON "shared_pages_cin" USING btree ("_path");
  CREATE UNIQUE INDEX "shared_pages_cin_locales_locale_parent_id_unique" ON "shared_pages_cin_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_lmp_order_idx" ON "shared_pages_lmp" USING btree ("_order");
  CREATE INDEX "shared_pages_lmp_parent_id_idx" ON "shared_pages_lmp" USING btree ("_parent_id");
  CREATE INDEX "shared_pages_lmp_path_idx" ON "shared_pages_lmp" USING btree ("_path");
  CREATE INDEX "shared_pages_lmp_entity_idx" ON "shared_pages_lmp" USING btree ("entity_id");
  CREATE UNIQUE INDEX "shared_pages_lmp_locales_locale_parent_id_unique" ON "shared_pages_lmp_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "____shared_pages_v_emp_v_it_v_rg_v_order_idx" ON "____shared_pages_v_emp_v_it_v_rg_v" USING btree ("_order");
  CREATE INDEX "____shared_pages_v_emp_v_it_v_rg_v_parent_id_idx" ON "____shared_pages_v_emp_v_it_v_rg_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "____shared_pages_v_emp_v_it_v_rg_v_locales_locale_parent_id_" ON "____shared_pages_v_emp_v_it_v_rg_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "____shared_pages_v_emp_v_it_v_btn_v_order_idx" ON "____shared_pages_v_emp_v_it_v_btn_v" USING btree ("_order");
  CREATE INDEX "____shared_pages_v_emp_v_it_v_btn_v_parent_id_idx" ON "____shared_pages_v_emp_v_it_v_btn_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "____shared_pages_v_emp_v_it_v_btn_v_locales_locale_parent_id" ON "____shared_pages_v_emp_v_it_v_btn_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___shared_pages_v_emp_v_it_v_order_idx" ON "___shared_pages_v_emp_v_it_v" USING btree ("_order");
  CREATE INDEX "___shared_pages_v_emp_v_it_v_parent_id_idx" ON "___shared_pages_v_emp_v_it_v" USING btree ("_parent_id");
  CREATE INDEX "___shared_pages_v_emp_v_it_v_entity_idx" ON "___shared_pages_v_emp_v_it_v" USING btree ("entity_id");
  CREATE INDEX "___shared_pages_v_emp_v_it_v_image_idx" ON "___shared_pages_v_emp_v_it_v" USING btree ("image_id");
  CREATE UNIQUE INDEX "___shared_pages_v_emp_v_it_v_locales_locale_parent_id_unique" ON "___shared_pages_v_emp_v_it_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_pages_v_emp_v_order_idx" ON "__shared_pages_v_emp_v" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_emp_v_parent_id_idx" ON "__shared_pages_v_emp_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_pages_v_emp_v_path_idx" ON "__shared_pages_v_emp_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__shared_pages_v_emp_v_locales_locale_parent_id_unique" ON "__shared_pages_v_emp_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_pages_v_gsh_v_order_idx" ON "__shared_pages_v_gsh_v" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_gsh_v_parent_id_idx" ON "__shared_pages_v_gsh_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_pages_v_gsh_v_path_idx" ON "__shared_pages_v_gsh_v" USING btree ("_path");
  CREATE INDEX "__shared_pages_v_gsh_v_main_image_idx" ON "__shared_pages_v_gsh_v" USING btree ("main_image_id");
  CREATE INDEX "__shared_pages_v_gsh_v_main_logo_idx" ON "__shared_pages_v_gsh_v" USING btree ("main_logo_id");
  CREATE UNIQUE INDEX "__shared_pages_v_gsh_v_locales_locale_parent_id_unique" ON "__shared_pages_v_gsh_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_pages_v_eco_v_order_idx" ON "__shared_pages_v_eco_v" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_eco_v_parent_id_idx" ON "__shared_pages_v_eco_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_pages_v_eco_v_path_idx" ON "__shared_pages_v_eco_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__shared_pages_v_eco_v_locales_locale_parent_id_unique" ON "__shared_pages_v_eco_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_pages_v_cin_v_order_idx" ON "__shared_pages_v_cin_v" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_cin_v_parent_id_idx" ON "__shared_pages_v_cin_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_pages_v_cin_v_path_idx" ON "__shared_pages_v_cin_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__shared_pages_v_cin_v_locales_locale_parent_id_unique" ON "__shared_pages_v_cin_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_pages_v_lmp_v_order_idx" ON "__shared_pages_v_lmp_v" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_lmp_v_parent_id_idx" ON "__shared_pages_v_lmp_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_pages_v_lmp_v_path_idx" ON "__shared_pages_v_lmp_v" USING btree ("_path");
  CREATE INDEX "__shared_pages_v_lmp_v_entity_idx" ON "__shared_pages_v_lmp_v" USING btree ("entity_id");
  CREATE UNIQUE INDEX "__shared_pages_v_lmp_v_locales_locale_parent_id_unique" ON "__shared_pages_v_lmp_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_emp_it_rg_order_idx" ON "detail_templates_emp_it_rg" USING btree ("_order");
  CREATE INDEX "detail_templates_emp_it_rg_parent_id_idx" ON "detail_templates_emp_it_rg" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "detail_templates_emp_it_rg_locales_locale_parent_id_unique" ON "detail_templates_emp_it_rg_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_emp_it_btn_order_idx" ON "detail_templates_emp_it_btn" USING btree ("_order");
  CREATE INDEX "detail_templates_emp_it_btn_parent_id_idx" ON "detail_templates_emp_it_btn" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "detail_templates_emp_it_btn_locales_locale_parent_id_unique" ON "detail_templates_emp_it_btn_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_emp_it_order_idx" ON "detail_templates_emp_it" USING btree ("_order");
  CREATE INDEX "detail_templates_emp_it_parent_id_idx" ON "detail_templates_emp_it" USING btree ("_parent_id");
  CREATE INDEX "detail_templates_emp_it_entity_idx" ON "detail_templates_emp_it" USING btree ("entity_id");
  CREATE INDEX "detail_templates_emp_it_image_idx" ON "detail_templates_emp_it" USING btree ("image_id");
  CREATE UNIQUE INDEX "detail_templates_emp_it_locales_locale_parent_id_unique" ON "detail_templates_emp_it_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_emp_order_idx" ON "detail_templates_emp" USING btree ("_order");
  CREATE INDEX "detail_templates_emp_parent_id_idx" ON "detail_templates_emp" USING btree ("_parent_id");
  CREATE INDEX "detail_templates_emp_path_idx" ON "detail_templates_emp" USING btree ("_path");
  CREATE UNIQUE INDEX "detail_templates_emp_locales_locale_parent_id_unique" ON "detail_templates_emp_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_gsh_order_idx" ON "detail_templates_gsh" USING btree ("_order");
  CREATE INDEX "detail_templates_gsh_parent_id_idx" ON "detail_templates_gsh" USING btree ("_parent_id");
  CREATE INDEX "detail_templates_gsh_path_idx" ON "detail_templates_gsh" USING btree ("_path");
  CREATE INDEX "detail_templates_gsh_main_image_idx" ON "detail_templates_gsh" USING btree ("main_image_id");
  CREATE INDEX "detail_templates_gsh_main_logo_idx" ON "detail_templates_gsh" USING btree ("main_logo_id");
  CREATE UNIQUE INDEX "detail_templates_gsh_locales_locale_parent_id_unique" ON "detail_templates_gsh_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_eco_order_idx" ON "detail_templates_eco" USING btree ("_order");
  CREATE INDEX "detail_templates_eco_parent_id_idx" ON "detail_templates_eco" USING btree ("_parent_id");
  CREATE INDEX "detail_templates_eco_path_idx" ON "detail_templates_eco" USING btree ("_path");
  CREATE UNIQUE INDEX "detail_templates_eco_locales_locale_parent_id_unique" ON "detail_templates_eco_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_cin_order_idx" ON "detail_templates_cin" USING btree ("_order");
  CREATE INDEX "detail_templates_cin_parent_id_idx" ON "detail_templates_cin" USING btree ("_parent_id");
  CREATE INDEX "detail_templates_cin_path_idx" ON "detail_templates_cin" USING btree ("_path");
  CREATE UNIQUE INDEX "detail_templates_cin_locales_locale_parent_id_unique" ON "detail_templates_cin_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_lmp_order_idx" ON "detail_templates_lmp" USING btree ("_order");
  CREATE INDEX "detail_templates_lmp_parent_id_idx" ON "detail_templates_lmp" USING btree ("_parent_id");
  CREATE INDEX "detail_templates_lmp_path_idx" ON "detail_templates_lmp" USING btree ("_path");
  CREATE INDEX "detail_templates_lmp_entity_idx" ON "detail_templates_lmp" USING btree ("entity_id");
  CREATE UNIQUE INDEX "detail_templates_lmp_locales_locale_parent_id_unique" ON "detail_templates_lmp_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "____detail_templates_v_emp_v_it_v_rg_v_order_idx" ON "____detail_templates_v_emp_v_it_v_rg_v" USING btree ("_order");
  CREATE INDEX "____detail_templates_v_emp_v_it_v_rg_v_parent_id_idx" ON "____detail_templates_v_emp_v_it_v_rg_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "____detail_templates_v_emp_v_it_v_rg_v_locales_locale_parent" ON "____detail_templates_v_emp_v_it_v_rg_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "____detail_templates_v_emp_v_it_v_btn_v_order_idx" ON "____detail_templates_v_emp_v_it_v_btn_v" USING btree ("_order");
  CREATE INDEX "____detail_templates_v_emp_v_it_v_btn_v_parent_id_idx" ON "____detail_templates_v_emp_v_it_v_btn_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "____detail_templates_v_emp_v_it_v_btn_v_locales_locale_paren" ON "____detail_templates_v_emp_v_it_v_btn_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___detail_templates_v_emp_v_it_v_order_idx" ON "___detail_templates_v_emp_v_it_v" USING btree ("_order");
  CREATE INDEX "___detail_templates_v_emp_v_it_v_parent_id_idx" ON "___detail_templates_v_emp_v_it_v" USING btree ("_parent_id");
  CREATE INDEX "___detail_templates_v_emp_v_it_v_entity_idx" ON "___detail_templates_v_emp_v_it_v" USING btree ("entity_id");
  CREATE INDEX "___detail_templates_v_emp_v_it_v_image_idx" ON "___detail_templates_v_emp_v_it_v" USING btree ("image_id");
  CREATE UNIQUE INDEX "___detail_templates_v_emp_v_it_v_locales_locale_parent_id_un" ON "___detail_templates_v_emp_v_it_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__detail_templates_v_emp_v_order_idx" ON "__detail_templates_v_emp_v" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_emp_v_parent_id_idx" ON "__detail_templates_v_emp_v" USING btree ("_parent_id");
  CREATE INDEX "__detail_templates_v_emp_v_path_idx" ON "__detail_templates_v_emp_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__detail_templates_v_emp_v_locales_locale_parent_id_unique" ON "__detail_templates_v_emp_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__detail_templates_v_gsh_v_order_idx" ON "__detail_templates_v_gsh_v" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_gsh_v_parent_id_idx" ON "__detail_templates_v_gsh_v" USING btree ("_parent_id");
  CREATE INDEX "__detail_templates_v_gsh_v_path_idx" ON "__detail_templates_v_gsh_v" USING btree ("_path");
  CREATE INDEX "__detail_templates_v_gsh_v_main_image_idx" ON "__detail_templates_v_gsh_v" USING btree ("main_image_id");
  CREATE INDEX "__detail_templates_v_gsh_v_main_logo_idx" ON "__detail_templates_v_gsh_v" USING btree ("main_logo_id");
  CREATE UNIQUE INDEX "__detail_templates_v_gsh_v_locales_locale_parent_id_unique" ON "__detail_templates_v_gsh_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__detail_templates_v_eco_v_order_idx" ON "__detail_templates_v_eco_v" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_eco_v_parent_id_idx" ON "__detail_templates_v_eco_v" USING btree ("_parent_id");
  CREATE INDEX "__detail_templates_v_eco_v_path_idx" ON "__detail_templates_v_eco_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__detail_templates_v_eco_v_locales_locale_parent_id_unique" ON "__detail_templates_v_eco_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__detail_templates_v_cin_v_order_idx" ON "__detail_templates_v_cin_v" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_cin_v_parent_id_idx" ON "__detail_templates_v_cin_v" USING btree ("_parent_id");
  CREATE INDEX "__detail_templates_v_cin_v_path_idx" ON "__detail_templates_v_cin_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__detail_templates_v_cin_v_locales_locale_parent_id_unique" ON "__detail_templates_v_cin_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__detail_templates_v_lmp_v_order_idx" ON "__detail_templates_v_lmp_v" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_lmp_v_parent_id_idx" ON "__detail_templates_v_lmp_v" USING btree ("_parent_id");
  CREATE INDEX "__detail_templates_v_lmp_v_path_idx" ON "__detail_templates_v_lmp_v" USING btree ("_path");
  CREATE INDEX "__detail_templates_v_lmp_v_entity_idx" ON "__detail_templates_v_lmp_v" USING btree ("entity_id");
  CREATE UNIQUE INDEX "__detail_templates_v_lmp_v_locales_locale_parent_id_unique" ON "__detail_templates_v_lmp_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_emp_it_rg_order_idx" ON "shared_detail_templates_emp_it_rg" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_emp_it_rg_parent_id_idx" ON "shared_detail_templates_emp_it_rg" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shared_detail_templates_emp_it_rg_locales_locale_parent_id_u" ON "shared_detail_templates_emp_it_rg_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_emp_it_btn_order_idx" ON "shared_detail_templates_emp_it_btn" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_emp_it_btn_parent_id_idx" ON "shared_detail_templates_emp_it_btn" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shared_detail_templates_emp_it_btn_locales_locale_parent_id_" ON "shared_detail_templates_emp_it_btn_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_emp_it_order_idx" ON "shared_detail_templates_emp_it" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_emp_it_parent_id_idx" ON "shared_detail_templates_emp_it" USING btree ("_parent_id");
  CREATE INDEX "shared_detail_templates_emp_it_entity_idx" ON "shared_detail_templates_emp_it" USING btree ("entity_id");
  CREATE INDEX "shared_detail_templates_emp_it_image_idx" ON "shared_detail_templates_emp_it" USING btree ("image_id");
  CREATE UNIQUE INDEX "shared_detail_templates_emp_it_locales_locale_parent_id_uniq" ON "shared_detail_templates_emp_it_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_emp_order_idx" ON "shared_detail_templates_emp" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_emp_parent_id_idx" ON "shared_detail_templates_emp" USING btree ("_parent_id");
  CREATE INDEX "shared_detail_templates_emp_path_idx" ON "shared_detail_templates_emp" USING btree ("_path");
  CREATE UNIQUE INDEX "shared_detail_templates_emp_locales_locale_parent_id_unique" ON "shared_detail_templates_emp_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_gsh_order_idx" ON "shared_detail_templates_gsh" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_gsh_parent_id_idx" ON "shared_detail_templates_gsh" USING btree ("_parent_id");
  CREATE INDEX "shared_detail_templates_gsh_path_idx" ON "shared_detail_templates_gsh" USING btree ("_path");
  CREATE INDEX "shared_detail_templates_gsh_main_image_idx" ON "shared_detail_templates_gsh" USING btree ("main_image_id");
  CREATE INDEX "shared_detail_templates_gsh_main_logo_idx" ON "shared_detail_templates_gsh" USING btree ("main_logo_id");
  CREATE UNIQUE INDEX "shared_detail_templates_gsh_locales_locale_parent_id_unique" ON "shared_detail_templates_gsh_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_eco_order_idx" ON "shared_detail_templates_eco" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_eco_parent_id_idx" ON "shared_detail_templates_eco" USING btree ("_parent_id");
  CREATE INDEX "shared_detail_templates_eco_path_idx" ON "shared_detail_templates_eco" USING btree ("_path");
  CREATE UNIQUE INDEX "shared_detail_templates_eco_locales_locale_parent_id_unique" ON "shared_detail_templates_eco_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_cin_order_idx" ON "shared_detail_templates_cin" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_cin_parent_id_idx" ON "shared_detail_templates_cin" USING btree ("_parent_id");
  CREATE INDEX "shared_detail_templates_cin_path_idx" ON "shared_detail_templates_cin" USING btree ("_path");
  CREATE UNIQUE INDEX "shared_detail_templates_cin_locales_locale_parent_id_unique" ON "shared_detail_templates_cin_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_lmp_order_idx" ON "shared_detail_templates_lmp" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_lmp_parent_id_idx" ON "shared_detail_templates_lmp" USING btree ("_parent_id");
  CREATE INDEX "shared_detail_templates_lmp_path_idx" ON "shared_detail_templates_lmp" USING btree ("_path");
  CREATE INDEX "shared_detail_templates_lmp_entity_idx" ON "shared_detail_templates_lmp" USING btree ("entity_id");
  CREATE UNIQUE INDEX "shared_detail_templates_lmp_locales_locale_parent_id_unique" ON "shared_detail_templates_lmp_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "____shared_detail_templates_v_emp_v_it_v_rg_v_order_idx" ON "____shared_detail_templates_v_emp_v_it_v_rg_v" USING btree ("_order");
  CREATE INDEX "____shared_detail_templates_v_emp_v_it_v_rg_v_parent_id_idx" ON "____shared_detail_templates_v_emp_v_it_v_rg_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "____shared_detail_templates_v_emp_v_it_v_rg_v_locales_locale" ON "____shared_detail_templates_v_emp_v_it_v_rg_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "____shared_detail_templates_v_emp_v_it_v_btn_v_order_idx" ON "____shared_detail_templates_v_emp_v_it_v_btn_v" USING btree ("_order");
  CREATE INDEX "____shared_detail_templates_v_emp_v_it_v_btn_v_parent_id_idx" ON "____shared_detail_templates_v_emp_v_it_v_btn_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "____shared_detail_templates_v_emp_v_it_v_btn_v_locales_local" ON "____shared_detail_templates_v_emp_v_it_v_btn_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___shared_detail_templates_v_emp_v_it_v_order_idx" ON "___shared_detail_templates_v_emp_v_it_v" USING btree ("_order");
  CREATE INDEX "___shared_detail_templates_v_emp_v_it_v_parent_id_idx" ON "___shared_detail_templates_v_emp_v_it_v" USING btree ("_parent_id");
  CREATE INDEX "___shared_detail_templates_v_emp_v_it_v_entity_idx" ON "___shared_detail_templates_v_emp_v_it_v" USING btree ("entity_id");
  CREATE INDEX "___shared_detail_templates_v_emp_v_it_v_image_idx" ON "___shared_detail_templates_v_emp_v_it_v" USING btree ("image_id");
  CREATE UNIQUE INDEX "___shared_detail_templates_v_emp_v_it_v_locales_locale_paren" ON "___shared_detail_templates_v_emp_v_it_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_emp_v_order_idx" ON "__shared_detail_templates_v_emp_v" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_emp_v_parent_id_idx" ON "__shared_detail_templates_v_emp_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_detail_templates_v_emp_v_path_idx" ON "__shared_detail_templates_v_emp_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_emp_v_locales_locale_parent_id_u" ON "__shared_detail_templates_v_emp_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_gsh_v_order_idx" ON "__shared_detail_templates_v_gsh_v" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_gsh_v_parent_id_idx" ON "__shared_detail_templates_v_gsh_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_detail_templates_v_gsh_v_path_idx" ON "__shared_detail_templates_v_gsh_v" USING btree ("_path");
  CREATE INDEX "__shared_detail_templates_v_gsh_v_main_image_idx" ON "__shared_detail_templates_v_gsh_v" USING btree ("main_image_id");
  CREATE INDEX "__shared_detail_templates_v_gsh_v_main_logo_idx" ON "__shared_detail_templates_v_gsh_v" USING btree ("main_logo_id");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_gsh_v_locales_locale_parent_id_u" ON "__shared_detail_templates_v_gsh_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_eco_v_order_idx" ON "__shared_detail_templates_v_eco_v" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_eco_v_parent_id_idx" ON "__shared_detail_templates_v_eco_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_detail_templates_v_eco_v_path_idx" ON "__shared_detail_templates_v_eco_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_eco_v_locales_locale_parent_id_u" ON "__shared_detail_templates_v_eco_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_cin_v_order_idx" ON "__shared_detail_templates_v_cin_v" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_cin_v_parent_id_idx" ON "__shared_detail_templates_v_cin_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_detail_templates_v_cin_v_path_idx" ON "__shared_detail_templates_v_cin_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_cin_v_locales_locale_parent_id_u" ON "__shared_detail_templates_v_cin_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_lmp_v_order_idx" ON "__shared_detail_templates_v_lmp_v" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_lmp_v_parent_id_idx" ON "__shared_detail_templates_v_lmp_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_detail_templates_v_lmp_v_path_idx" ON "__shared_detail_templates_v_lmp_v" USING btree ("_path");
  CREATE INDEX "__shared_detail_templates_v_lmp_v_entity_idx" ON "__shared_detail_templates_v_lmp_v" USING btree ("entity_id");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_lmp_v_locales_locale_parent_id_u" ON "__shared_detail_templates_v_lmp_v_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_tenants_fk" FOREIGN KEY ("tenants_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_tenants_fk" FOREIGN KEY ("tenants_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_rels" ADD CONSTRAINT "shared_pages_rels_tenants_fk" FOREIGN KEY ("tenants_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_shared_pages_v_rels" ADD CONSTRAINT "_shared_pages_v_rels_tenants_fk" FOREIGN KEY ("tenants_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_rels" ADD CONSTRAINT "detail_templates_rels_tenants_fk" FOREIGN KEY ("tenants_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_detail_templates_v_rels" ADD CONSTRAINT "_detail_templates_v_rels_tenants_fk" FOREIGN KEY ("tenants_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_rels" ADD CONSTRAINT "shared_detail_templates_rels_tenants_fk" FOREIGN KEY ("tenants_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_shared_detail_templates_v_rels" ADD CONSTRAINT "_shared_detail_templates_v_rels_tenants_fk" FOREIGN KEY ("tenants_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_rels_tenants_id_idx" ON "pages_rels" USING btree ("tenants_id");
  CREATE INDEX "_pages_v_rels_tenants_id_idx" ON "_pages_v_rels" USING btree ("tenants_id");
  CREATE INDEX "shared_pages_rels_tenants_id_idx" ON "shared_pages_rels" USING btree ("tenants_id");
  CREATE INDEX "_shared_pages_v_rels_tenants_id_idx" ON "_shared_pages_v_rels" USING btree ("tenants_id");
  CREATE INDEX "detail_templates_rels_tenants_id_idx" ON "detail_templates_rels" USING btree ("tenants_id");
  CREATE INDEX "_detail_templates_v_rels_tenants_id_idx" ON "_detail_templates_v_rels" USING btree ("tenants_id");
  CREATE INDEX "shared_detail_templates_rels_tenants_id_idx" ON "shared_detail_templates_rels" USING btree ("tenants_id");
  CREATE INDEX "_shared_detail_templates_v_rels_tenants_id_idx" ON "_shared_detail_templates_v_rels" USING btree ("tenants_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_emp_it_rg" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_emp_it_rg_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_emp_it_btn" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_emp_it_btn_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_emp_it" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_emp_it_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_emp" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_emp_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_gsh" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_gsh_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_eco" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_eco_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_cin" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_cin_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_lmp" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_lmp_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "____pages_v_emp_v_it_v_rg_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "____pages_v_emp_v_it_v_rg_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "____pages_v_emp_v_it_v_btn_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "____pages_v_emp_v_it_v_btn_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "___pages_v_emp_v_it_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "___pages_v_emp_v_it_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "__pages_v_emp_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "__pages_v_emp_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "__pages_v_gsh_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "__pages_v_gsh_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "__pages_v_eco_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "__pages_v_eco_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "__pages_v_cin_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "__pages_v_cin_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "__pages_v_lmp_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "__pages_v_lmp_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "shared_pages_emp_it_rg" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "shared_pages_emp_it_rg_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "shared_pages_emp_it_btn" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "shared_pages_emp_it_btn_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "shared_pages_emp_it" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "shared_pages_emp_it_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "shared_pages_emp" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "shared_pages_emp_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "shared_pages_gsh" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "shared_pages_gsh_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "shared_pages_eco" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "shared_pages_eco_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "shared_pages_cin" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "shared_pages_cin_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "shared_pages_lmp" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "shared_pages_lmp_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "____shared_pages_v_emp_v_it_v_rg_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "____shared_pages_v_emp_v_it_v_rg_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "____shared_pages_v_emp_v_it_v_btn_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "____shared_pages_v_emp_v_it_v_btn_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "___shared_pages_v_emp_v_it_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "___shared_pages_v_emp_v_it_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "__shared_pages_v_emp_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "__shared_pages_v_emp_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "__shared_pages_v_gsh_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "__shared_pages_v_gsh_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "__shared_pages_v_eco_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "__shared_pages_v_eco_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "__shared_pages_v_cin_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "__shared_pages_v_cin_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "__shared_pages_v_lmp_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "__shared_pages_v_lmp_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "detail_templates_emp_it_rg" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "detail_templates_emp_it_rg_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "detail_templates_emp_it_btn" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "detail_templates_emp_it_btn_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "detail_templates_emp_it" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "detail_templates_emp_it_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "detail_templates_emp" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "detail_templates_emp_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "detail_templates_gsh" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "detail_templates_gsh_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "detail_templates_eco" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "detail_templates_eco_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "detail_templates_cin" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "detail_templates_cin_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "detail_templates_lmp" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "detail_templates_lmp_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "____detail_templates_v_emp_v_it_v_rg_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "____detail_templates_v_emp_v_it_v_rg_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "____detail_templates_v_emp_v_it_v_btn_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "____detail_templates_v_emp_v_it_v_btn_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "___detail_templates_v_emp_v_it_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "___detail_templates_v_emp_v_it_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "__detail_templates_v_emp_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "__detail_templates_v_emp_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "__detail_templates_v_gsh_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "__detail_templates_v_gsh_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "__detail_templates_v_eco_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "__detail_templates_v_eco_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "__detail_templates_v_cin_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "__detail_templates_v_cin_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "__detail_templates_v_lmp_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "__detail_templates_v_lmp_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "shared_detail_templates_emp_it_rg" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "shared_detail_templates_emp_it_rg_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "shared_detail_templates_emp_it_btn" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "shared_detail_templates_emp_it_btn_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "shared_detail_templates_emp_it" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "shared_detail_templates_emp_it_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "shared_detail_templates_emp" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "shared_detail_templates_emp_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "shared_detail_templates_gsh" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "shared_detail_templates_gsh_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "shared_detail_templates_eco" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "shared_detail_templates_eco_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "shared_detail_templates_cin" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "shared_detail_templates_cin_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "shared_detail_templates_lmp" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "shared_detail_templates_lmp_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "____shared_detail_templates_v_emp_v_it_v_rg_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "____shared_detail_templates_v_emp_v_it_v_rg_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "____shared_detail_templates_v_emp_v_it_v_btn_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "____shared_detail_templates_v_emp_v_it_v_btn_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "___shared_detail_templates_v_emp_v_it_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "___shared_detail_templates_v_emp_v_it_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "__shared_detail_templates_v_emp_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "__shared_detail_templates_v_emp_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "__shared_detail_templates_v_gsh_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "__shared_detail_templates_v_gsh_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "__shared_detail_templates_v_eco_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "__shared_detail_templates_v_eco_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "__shared_detail_templates_v_cin_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "__shared_detail_templates_v_cin_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "__shared_detail_templates_v_lmp_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "__shared_detail_templates_v_lmp_v_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_emp_it_rg" CASCADE;
  DROP TABLE "pages_emp_it_rg_locales" CASCADE;
  DROP TABLE "pages_emp_it_btn" CASCADE;
  DROP TABLE "pages_emp_it_btn_locales" CASCADE;
  DROP TABLE "pages_emp_it" CASCADE;
  DROP TABLE "pages_emp_it_locales" CASCADE;
  DROP TABLE "pages_emp" CASCADE;
  DROP TABLE "pages_emp_locales" CASCADE;
  DROP TABLE "pages_gsh" CASCADE;
  DROP TABLE "pages_gsh_locales" CASCADE;
  DROP TABLE "pages_eco" CASCADE;
  DROP TABLE "pages_eco_locales" CASCADE;
  DROP TABLE "pages_cin" CASCADE;
  DROP TABLE "pages_cin_locales" CASCADE;
  DROP TABLE "pages_lmp" CASCADE;
  DROP TABLE "pages_lmp_locales" CASCADE;
  DROP TABLE "____pages_v_emp_v_it_v_rg_v" CASCADE;
  DROP TABLE "____pages_v_emp_v_it_v_rg_v_locales" CASCADE;
  DROP TABLE "____pages_v_emp_v_it_v_btn_v" CASCADE;
  DROP TABLE "____pages_v_emp_v_it_v_btn_v_locales" CASCADE;
  DROP TABLE "___pages_v_emp_v_it_v" CASCADE;
  DROP TABLE "___pages_v_emp_v_it_v_locales" CASCADE;
  DROP TABLE "__pages_v_emp_v" CASCADE;
  DROP TABLE "__pages_v_emp_v_locales" CASCADE;
  DROP TABLE "__pages_v_gsh_v" CASCADE;
  DROP TABLE "__pages_v_gsh_v_locales" CASCADE;
  DROP TABLE "__pages_v_eco_v" CASCADE;
  DROP TABLE "__pages_v_eco_v_locales" CASCADE;
  DROP TABLE "__pages_v_cin_v" CASCADE;
  DROP TABLE "__pages_v_cin_v_locales" CASCADE;
  DROP TABLE "__pages_v_lmp_v" CASCADE;
  DROP TABLE "__pages_v_lmp_v_locales" CASCADE;
  DROP TABLE "shared_pages_emp_it_rg" CASCADE;
  DROP TABLE "shared_pages_emp_it_rg_locales" CASCADE;
  DROP TABLE "shared_pages_emp_it_btn" CASCADE;
  DROP TABLE "shared_pages_emp_it_btn_locales" CASCADE;
  DROP TABLE "shared_pages_emp_it" CASCADE;
  DROP TABLE "shared_pages_emp_it_locales" CASCADE;
  DROP TABLE "shared_pages_emp" CASCADE;
  DROP TABLE "shared_pages_emp_locales" CASCADE;
  DROP TABLE "shared_pages_gsh" CASCADE;
  DROP TABLE "shared_pages_gsh_locales" CASCADE;
  DROP TABLE "shared_pages_eco" CASCADE;
  DROP TABLE "shared_pages_eco_locales" CASCADE;
  DROP TABLE "shared_pages_cin" CASCADE;
  DROP TABLE "shared_pages_cin_locales" CASCADE;
  DROP TABLE "shared_pages_lmp" CASCADE;
  DROP TABLE "shared_pages_lmp_locales" CASCADE;
  DROP TABLE "____shared_pages_v_emp_v_it_v_rg_v" CASCADE;
  DROP TABLE "____shared_pages_v_emp_v_it_v_rg_v_locales" CASCADE;
  DROP TABLE "____shared_pages_v_emp_v_it_v_btn_v" CASCADE;
  DROP TABLE "____shared_pages_v_emp_v_it_v_btn_v_locales" CASCADE;
  DROP TABLE "___shared_pages_v_emp_v_it_v" CASCADE;
  DROP TABLE "___shared_pages_v_emp_v_it_v_locales" CASCADE;
  DROP TABLE "__shared_pages_v_emp_v" CASCADE;
  DROP TABLE "__shared_pages_v_emp_v_locales" CASCADE;
  DROP TABLE "__shared_pages_v_gsh_v" CASCADE;
  DROP TABLE "__shared_pages_v_gsh_v_locales" CASCADE;
  DROP TABLE "__shared_pages_v_eco_v" CASCADE;
  DROP TABLE "__shared_pages_v_eco_v_locales" CASCADE;
  DROP TABLE "__shared_pages_v_cin_v" CASCADE;
  DROP TABLE "__shared_pages_v_cin_v_locales" CASCADE;
  DROP TABLE "__shared_pages_v_lmp_v" CASCADE;
  DROP TABLE "__shared_pages_v_lmp_v_locales" CASCADE;
  DROP TABLE "detail_templates_emp_it_rg" CASCADE;
  DROP TABLE "detail_templates_emp_it_rg_locales" CASCADE;
  DROP TABLE "detail_templates_emp_it_btn" CASCADE;
  DROP TABLE "detail_templates_emp_it_btn_locales" CASCADE;
  DROP TABLE "detail_templates_emp_it" CASCADE;
  DROP TABLE "detail_templates_emp_it_locales" CASCADE;
  DROP TABLE "detail_templates_emp" CASCADE;
  DROP TABLE "detail_templates_emp_locales" CASCADE;
  DROP TABLE "detail_templates_gsh" CASCADE;
  DROP TABLE "detail_templates_gsh_locales" CASCADE;
  DROP TABLE "detail_templates_eco" CASCADE;
  DROP TABLE "detail_templates_eco_locales" CASCADE;
  DROP TABLE "detail_templates_cin" CASCADE;
  DROP TABLE "detail_templates_cin_locales" CASCADE;
  DROP TABLE "detail_templates_lmp" CASCADE;
  DROP TABLE "detail_templates_lmp_locales" CASCADE;
  DROP TABLE "____detail_templates_v_emp_v_it_v_rg_v" CASCADE;
  DROP TABLE "____detail_templates_v_emp_v_it_v_rg_v_locales" CASCADE;
  DROP TABLE "____detail_templates_v_emp_v_it_v_btn_v" CASCADE;
  DROP TABLE "____detail_templates_v_emp_v_it_v_btn_v_locales" CASCADE;
  DROP TABLE "___detail_templates_v_emp_v_it_v" CASCADE;
  DROP TABLE "___detail_templates_v_emp_v_it_v_locales" CASCADE;
  DROP TABLE "__detail_templates_v_emp_v" CASCADE;
  DROP TABLE "__detail_templates_v_emp_v_locales" CASCADE;
  DROP TABLE "__detail_templates_v_gsh_v" CASCADE;
  DROP TABLE "__detail_templates_v_gsh_v_locales" CASCADE;
  DROP TABLE "__detail_templates_v_eco_v" CASCADE;
  DROP TABLE "__detail_templates_v_eco_v_locales" CASCADE;
  DROP TABLE "__detail_templates_v_cin_v" CASCADE;
  DROP TABLE "__detail_templates_v_cin_v_locales" CASCADE;
  DROP TABLE "__detail_templates_v_lmp_v" CASCADE;
  DROP TABLE "__detail_templates_v_lmp_v_locales" CASCADE;
  DROP TABLE "shared_detail_templates_emp_it_rg" CASCADE;
  DROP TABLE "shared_detail_templates_emp_it_rg_locales" CASCADE;
  DROP TABLE "shared_detail_templates_emp_it_btn" CASCADE;
  DROP TABLE "shared_detail_templates_emp_it_btn_locales" CASCADE;
  DROP TABLE "shared_detail_templates_emp_it" CASCADE;
  DROP TABLE "shared_detail_templates_emp_it_locales" CASCADE;
  DROP TABLE "shared_detail_templates_emp" CASCADE;
  DROP TABLE "shared_detail_templates_emp_locales" CASCADE;
  DROP TABLE "shared_detail_templates_gsh" CASCADE;
  DROP TABLE "shared_detail_templates_gsh_locales" CASCADE;
  DROP TABLE "shared_detail_templates_eco" CASCADE;
  DROP TABLE "shared_detail_templates_eco_locales" CASCADE;
  DROP TABLE "shared_detail_templates_cin" CASCADE;
  DROP TABLE "shared_detail_templates_cin_locales" CASCADE;
  DROP TABLE "shared_detail_templates_lmp" CASCADE;
  DROP TABLE "shared_detail_templates_lmp_locales" CASCADE;
  DROP TABLE "____shared_detail_templates_v_emp_v_it_v_rg_v" CASCADE;
  DROP TABLE "____shared_detail_templates_v_emp_v_it_v_rg_v_locales" CASCADE;
  DROP TABLE "____shared_detail_templates_v_emp_v_it_v_btn_v" CASCADE;
  DROP TABLE "____shared_detail_templates_v_emp_v_it_v_btn_v_locales" CASCADE;
  DROP TABLE "___shared_detail_templates_v_emp_v_it_v" CASCADE;
  DROP TABLE "___shared_detail_templates_v_emp_v_it_v_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_emp_v" CASCADE;
  DROP TABLE "__shared_detail_templates_v_emp_v_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_gsh_v" CASCADE;
  DROP TABLE "__shared_detail_templates_v_gsh_v_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_eco_v" CASCADE;
  DROP TABLE "__shared_detail_templates_v_eco_v_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_cin_v" CASCADE;
  DROP TABLE "__shared_detail_templates_v_cin_v_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_lmp_v" CASCADE;
  DROP TABLE "__shared_detail_templates_v_lmp_v_locales" CASCADE;
  ALTER TABLE "pages_rels" DROP CONSTRAINT "pages_rels_tenants_fk";
  
  ALTER TABLE "_pages_v_rels" DROP CONSTRAINT "_pages_v_rels_tenants_fk";
  
  ALTER TABLE "shared_pages_rels" DROP CONSTRAINT "shared_pages_rels_tenants_fk";
  
  ALTER TABLE "_shared_pages_v_rels" DROP CONSTRAINT "_shared_pages_v_rels_tenants_fk";
  
  ALTER TABLE "detail_templates_rels" DROP CONSTRAINT "detail_templates_rels_tenants_fk";
  
  ALTER TABLE "_detail_templates_v_rels" DROP CONSTRAINT "_detail_templates_v_rels_tenants_fk";
  
  ALTER TABLE "shared_detail_templates_rels" DROP CONSTRAINT "shared_detail_templates_rels_tenants_fk";
  
  ALTER TABLE "_shared_detail_templates_v_rels" DROP CONSTRAINT "_shared_detail_templates_v_rels_tenants_fk";
  
  DROP INDEX "pages_rels_tenants_id_idx";
  DROP INDEX "_pages_v_rels_tenants_id_idx";
  DROP INDEX "shared_pages_rels_tenants_id_idx";
  DROP INDEX "_shared_pages_v_rels_tenants_id_idx";
  DROP INDEX "detail_templates_rels_tenants_id_idx";
  DROP INDEX "_detail_templates_v_rels_tenants_id_idx";
  DROP INDEX "shared_detail_templates_rels_tenants_id_idx";
  DROP INDEX "_shared_detail_templates_v_rels_tenants_id_idx";
  ALTER TABLE "pages_rels" DROP COLUMN "tenants_id";
  ALTER TABLE "_pages_v_rels" DROP COLUMN "tenants_id";
  ALTER TABLE "shared_pages_rels" DROP COLUMN "tenants_id";
  ALTER TABLE "_shared_pages_v_rels" DROP COLUMN "tenants_id";
  ALTER TABLE "detail_templates_rels" DROP COLUMN "tenants_id";
  ALTER TABLE "_detail_templates_v_rels" DROP COLUMN "tenants_id";
  ALTER TABLE "shared_detail_templates_rels" DROP COLUMN "tenants_id";
  ALTER TABLE "_shared_detail_templates_v_rels" DROP COLUMN "tenants_id";
  DROP TYPE "public"."enum_pages_emp_it_btn_link_type";
  DROP TYPE "public"."enum_pages_emp_it_btn_style";
  DROP TYPE "public"."enum_pages_emp_heading_align";
  DROP TYPE "public"."enum_pages_gsh_heading_align";
  DROP TYPE "public"."enum_pages_gsh_main_link_type";
  DROP TYPE "public"."enum_pages_eco_heading_align";
  DROP TYPE "public"."enum_pages_eco_source";
  DROP TYPE "public"."enum_pages_cin_heading_align";
  DROP TYPE "public"."enum_____pages_v_emp_v_it_v_btn_v_link_type";
  DROP TYPE "public"."enum_____pages_v_emp_v_it_v_btn_v_style";
  DROP TYPE "public"."enum___pages_v_emp_v_heading_align";
  DROP TYPE "public"."enum___pages_v_gsh_v_heading_align";
  DROP TYPE "public"."enum___pages_v_gsh_v_main_link_type";
  DROP TYPE "public"."enum___pages_v_eco_v_heading_align";
  DROP TYPE "public"."enum___pages_v_eco_v_source";
  DROP TYPE "public"."enum___pages_v_cin_v_heading_align";
  DROP TYPE "public"."enum_shared_pages_emp_it_btn_link_type";
  DROP TYPE "public"."enum_shared_pages_emp_it_btn_style";
  DROP TYPE "public"."enum_shared_pages_emp_heading_align";
  DROP TYPE "public"."enum_shared_pages_gsh_heading_align";
  DROP TYPE "public"."enum_shared_pages_gsh_main_link_type";
  DROP TYPE "public"."enum_shared_pages_eco_heading_align";
  DROP TYPE "public"."enum_shared_pages_eco_source";
  DROP TYPE "public"."enum_shared_pages_cin_heading_align";
  DROP TYPE "public"."enum_____shared_pages_v_emp_v_it_v_btn_v_link_type";
  DROP TYPE "public"."enum_____shared_pages_v_emp_v_it_v_btn_v_style";
  DROP TYPE "public"."enum___shared_pages_v_emp_v_heading_align";
  DROP TYPE "public"."enum___shared_pages_v_gsh_v_heading_align";
  DROP TYPE "public"."enum___shared_pages_v_gsh_v_main_link_type";
  DROP TYPE "public"."enum___shared_pages_v_eco_v_heading_align";
  DROP TYPE "public"."enum___shared_pages_v_eco_v_source";
  DROP TYPE "public"."enum___shared_pages_v_cin_v_heading_align";
  DROP TYPE "public"."enum_detail_templates_emp_it_btn_link_type";
  DROP TYPE "public"."enum_detail_templates_emp_it_btn_style";
  DROP TYPE "public"."enum_detail_templates_emp_heading_align";
  DROP TYPE "public"."enum_detail_templates_gsh_heading_align";
  DROP TYPE "public"."enum_detail_templates_gsh_main_link_type";
  DROP TYPE "public"."enum_detail_templates_eco_heading_align";
  DROP TYPE "public"."enum_detail_templates_eco_source";
  DROP TYPE "public"."enum_detail_templates_cin_heading_align";
  DROP TYPE "public"."enum_____detail_templates_v_emp_v_it_v_btn_v_link_type";
  DROP TYPE "public"."enum_____detail_templates_v_emp_v_it_v_btn_v_style";
  DROP TYPE "public"."enum___detail_templates_v_emp_v_heading_align";
  DROP TYPE "public"."enum___detail_templates_v_gsh_v_heading_align";
  DROP TYPE "public"."enum___detail_templates_v_gsh_v_main_link_type";
  DROP TYPE "public"."enum___detail_templates_v_eco_v_heading_align";
  DROP TYPE "public"."enum___detail_templates_v_eco_v_source";
  DROP TYPE "public"."enum___detail_templates_v_cin_v_heading_align";
  DROP TYPE "public"."enum_shared_detail_templates_emp_it_btn_link_type";
  DROP TYPE "public"."enum_shared_detail_templates_emp_it_btn_style";
  DROP TYPE "public"."enum_shared_detail_templates_emp_heading_align";
  DROP TYPE "public"."enum_shared_detail_templates_gsh_heading_align";
  DROP TYPE "public"."enum_shared_detail_templates_gsh_main_link_type";
  DROP TYPE "public"."enum_shared_detail_templates_eco_heading_align";
  DROP TYPE "public"."enum_shared_detail_templates_eco_source";
  DROP TYPE "public"."enum_shared_detail_templates_cin_heading_align";
  DROP TYPE "public"."enum_____shared_detail_templates_v_emp_v_it_v_btn_v_link_type";
  DROP TYPE "public"."enum_____shared_detail_templates_v_emp_v_it_v_btn_v_style";
  DROP TYPE "public"."enum___shared_detail_templates_v_emp_v_heading_align";
  DROP TYPE "public"."enum___shared_detail_templates_v_gsh_v_heading_align";
  DROP TYPE "public"."enum___shared_detail_templates_v_gsh_v_main_link_type";
  DROP TYPE "public"."enum___shared_detail_templates_v_eco_v_heading_align";
  DROP TYPE "public"."enum___shared_detail_templates_v_eco_v_source";
  DROP TYPE "public"."enum___shared_detail_templates_v_cin_v_heading_align";`)
}
