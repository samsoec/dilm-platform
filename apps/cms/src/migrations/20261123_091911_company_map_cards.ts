import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

const FAMILIES = [
  "pages",
  "shared_pages",
  "detail_templates",
  "shared_detail_templates",
]

const plainCopy = (p: string) => `
  INSERT INTO "${p}_emp_cd" ("_order", "_parent_id", "id", "image_id", "position")
    SELECT "_order", "_parent_id", "id", "image_id", 'left' FROM "${p}_emp_it";
  INSERT INTO "${p}_emp_cd_locales" ("eyebrow", "title", "description", "_locale", "_parent_id")
    SELECT "label", "title", "description", "_locale", "_parent_id" FROM "${p}_emp_it_locales";
  INSERT INTO "${p}_emp_cd_cbt" ("_order", "_parent_id", "id", "link_type", "link_new_tab", "link_internal_path", "link_external_url", "style")
    SELECT "_order", "_parent_id", "id", "link_type"::text::"public"."enum_${p}_emp_cd_cbt_link_type", "link_new_tab", "link_internal_path", "link_external_url", "style"::text::"public"."enum_${p}_emp_cd_cbt_style" FROM "${p}_emp_it_btn";
  INSERT INTO "${p}_emp_cd_cbt_locales" ("link_label", "_locale", "_parent_id")
    SELECT "link_label", "_locale", "_parent_id" FROM "${p}_emp_it_btn_locales";
  INSERT INTO "${p}_emp_cd_bg" ("_order", "_parent_id", "id")
    SELECT "_order", "_parent_id", "id" FROM "${p}_emp_it_rg";
  INSERT INTO "${p}_emp_cd_bg_locales" ("text", "_locale", "_parent_id")
    SELECT "name", "_locale", "_parent_id" FROM "${p}_emp_it_rg_locales";
`

const versionedCopy = (p: string) => {
  const cd = `___${p}_v_emp_v_cd_v`
  const kids = `____${p}_v_emp_v_cd_v`
  const it = `___${p}_v_emp_v_it_v`
  const old = `____${p}_v_emp_v_it_v`
  return `
  INSERT INTO "${cd}" ("_order", "_parent_id", "id", "image_id", "position", "_uuid")
    SELECT "_order", "_parent_id", "id", "image_id", 'left', "_uuid" FROM "${it}";
  INSERT INTO "${cd}_locales" ("eyebrow", "title", "description", "_locale", "_parent_id")
    SELECT "label", "title", "description", "_locale", "_parent_id" FROM "${it}_locales";
  INSERT INTO "${kids}_cbt_v" ("_order", "_parent_id", "id", "link_type", "link_new_tab", "link_internal_path", "link_external_url", "style", "_uuid")
    SELECT "_order", "_parent_id", "id", "link_type"::text::"public"."enum_____${p}_v_emp_v_cd_v_cbt_v_link_type", "link_new_tab", "link_internal_path", "link_external_url", "style"::text::"public"."enum_____${p}_v_emp_v_cd_v_cbt_v_style", "_uuid" FROM "${old}_btn_v";
  INSERT INTO "${kids}_cbt_v_locales" ("link_label", "_locale", "_parent_id")
    SELECT "link_label", "_locale", "_parent_id" FROM "${old}_btn_v_locales";
  INSERT INTO "${kids}_bg_v" ("_order", "_parent_id", "id", "_uuid")
    SELECT "_order", "_parent_id", "id", "_uuid" FROM "${old}_rg_v";
  INSERT INTO "${kids}_bg_v_locales" ("text", "_locale", "_parent_id")
    SELECT "name", "_locale", "_parent_id" FROM "${old}_rg_v_locales";
  SELECT setval(pg_get_serial_sequence('"${cd}"', 'id'), GREATEST(COALESCE((SELECT MAX("id") FROM "${cd}"), 0), 1));
  SELECT setval(pg_get_serial_sequence('"${kids}_cbt_v"', 'id'), GREATEST(COALESCE((SELECT MAX("id") FROM "${kids}_cbt_v"), 0), 1));
  SELECT setval(pg_get_serial_sequence('"${kids}_bg_v"', 'id'), GREATEST(COALESCE((SELECT MAX("id") FROM "${kids}_bg_v"), 0), 1));
`
}

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_emp_cd_cbt_link_type" AS ENUM('reference', 'internal', 'external');
  CREATE TYPE "public"."enum_pages_emp_cd_cbt_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_pages_emp_cd_areas" AS ENUM('ID-AC', 'ID-SU', 'ID-SB', 'ID-RI', 'ID-KR', 'ID-JA', 'ID-SS', 'ID-BB', 'ID-BE', 'ID-LA', 'ID-JK', 'ID-JB', 'ID-BT', 'ID-JT', 'ID-YO', 'ID-JI', 'ID-BA', 'ID-NB', 'ID-NT', 'ID-KB', 'ID-KT', 'ID-KS', 'ID-KI', 'ID-KU', 'ID-SA', 'ID-GO', 'ID-ST', 'ID-SR', 'ID-SN', 'ID-SG', 'ID-MA', 'ID-MU', 'ID-PB', 'ID-PD', 'ID-PA', 'ID-PT', 'ID-PE', 'ID-PS');
  CREATE TYPE "public"."enum_pages_emp_cd_position" AS ENUM('left', 'right', 'bottom');
  CREATE TYPE "public"."enum_____pages_v_emp_v_cd_v_cbt_v_link_type" AS ENUM('reference', 'internal', 'external');
  CREATE TYPE "public"."enum_____pages_v_emp_v_cd_v_cbt_v_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum____pages_v_emp_v_cd_v_areas" AS ENUM('ID-AC', 'ID-SU', 'ID-SB', 'ID-RI', 'ID-KR', 'ID-JA', 'ID-SS', 'ID-BB', 'ID-BE', 'ID-LA', 'ID-JK', 'ID-JB', 'ID-BT', 'ID-JT', 'ID-YO', 'ID-JI', 'ID-BA', 'ID-NB', 'ID-NT', 'ID-KB', 'ID-KT', 'ID-KS', 'ID-KI', 'ID-KU', 'ID-SA', 'ID-GO', 'ID-ST', 'ID-SR', 'ID-SN', 'ID-SG', 'ID-MA', 'ID-MU', 'ID-PB', 'ID-PD', 'ID-PA', 'ID-PT', 'ID-PE', 'ID-PS');
  CREATE TYPE "public"."enum____pages_v_emp_v_cd_v_position" AS ENUM('left', 'right', 'bottom');
  CREATE TYPE "public"."enum_shared_pages_emp_cd_cbt_link_type" AS ENUM('reference', 'internal', 'external');
  CREATE TYPE "public"."enum_shared_pages_emp_cd_cbt_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_shared_pages_emp_cd_areas" AS ENUM('ID-AC', 'ID-SU', 'ID-SB', 'ID-RI', 'ID-KR', 'ID-JA', 'ID-SS', 'ID-BB', 'ID-BE', 'ID-LA', 'ID-JK', 'ID-JB', 'ID-BT', 'ID-JT', 'ID-YO', 'ID-JI', 'ID-BA', 'ID-NB', 'ID-NT', 'ID-KB', 'ID-KT', 'ID-KS', 'ID-KI', 'ID-KU', 'ID-SA', 'ID-GO', 'ID-ST', 'ID-SR', 'ID-SN', 'ID-SG', 'ID-MA', 'ID-MU', 'ID-PB', 'ID-PD', 'ID-PA', 'ID-PT', 'ID-PE', 'ID-PS');
  CREATE TYPE "public"."enum_shared_pages_emp_cd_position" AS ENUM('left', 'right', 'bottom');
  CREATE TYPE "public"."enum_____shared_pages_v_emp_v_cd_v_cbt_v_link_type" AS ENUM('reference', 'internal', 'external');
  CREATE TYPE "public"."enum_____shared_pages_v_emp_v_cd_v_cbt_v_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum____shared_pages_v_emp_v_cd_v_areas" AS ENUM('ID-AC', 'ID-SU', 'ID-SB', 'ID-RI', 'ID-KR', 'ID-JA', 'ID-SS', 'ID-BB', 'ID-BE', 'ID-LA', 'ID-JK', 'ID-JB', 'ID-BT', 'ID-JT', 'ID-YO', 'ID-JI', 'ID-BA', 'ID-NB', 'ID-NT', 'ID-KB', 'ID-KT', 'ID-KS', 'ID-KI', 'ID-KU', 'ID-SA', 'ID-GO', 'ID-ST', 'ID-SR', 'ID-SN', 'ID-SG', 'ID-MA', 'ID-MU', 'ID-PB', 'ID-PD', 'ID-PA', 'ID-PT', 'ID-PE', 'ID-PS');
  CREATE TYPE "public"."enum____shared_pages_v_emp_v_cd_v_position" AS ENUM('left', 'right', 'bottom');
  CREATE TYPE "public"."enum_detail_templates_emp_cd_cbt_link_type" AS ENUM('reference', 'internal', 'external');
  CREATE TYPE "public"."enum_detail_templates_emp_cd_cbt_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_detail_templates_emp_cd_areas" AS ENUM('ID-AC', 'ID-SU', 'ID-SB', 'ID-RI', 'ID-KR', 'ID-JA', 'ID-SS', 'ID-BB', 'ID-BE', 'ID-LA', 'ID-JK', 'ID-JB', 'ID-BT', 'ID-JT', 'ID-YO', 'ID-JI', 'ID-BA', 'ID-NB', 'ID-NT', 'ID-KB', 'ID-KT', 'ID-KS', 'ID-KI', 'ID-KU', 'ID-SA', 'ID-GO', 'ID-ST', 'ID-SR', 'ID-SN', 'ID-SG', 'ID-MA', 'ID-MU', 'ID-PB', 'ID-PD', 'ID-PA', 'ID-PT', 'ID-PE', 'ID-PS');
  CREATE TYPE "public"."enum_detail_templates_emp_cd_position" AS ENUM('left', 'right', 'bottom');
  CREATE TYPE "public"."enum_____detail_templates_v_emp_v_cd_v_cbt_v_link_type" AS ENUM('reference', 'internal', 'external');
  CREATE TYPE "public"."enum_____detail_templates_v_emp_v_cd_v_cbt_v_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum____detail_templates_v_emp_v_cd_v_areas" AS ENUM('ID-AC', 'ID-SU', 'ID-SB', 'ID-RI', 'ID-KR', 'ID-JA', 'ID-SS', 'ID-BB', 'ID-BE', 'ID-LA', 'ID-JK', 'ID-JB', 'ID-BT', 'ID-JT', 'ID-YO', 'ID-JI', 'ID-BA', 'ID-NB', 'ID-NT', 'ID-KB', 'ID-KT', 'ID-KS', 'ID-KI', 'ID-KU', 'ID-SA', 'ID-GO', 'ID-ST', 'ID-SR', 'ID-SN', 'ID-SG', 'ID-MA', 'ID-MU', 'ID-PB', 'ID-PD', 'ID-PA', 'ID-PT', 'ID-PE', 'ID-PS');
  CREATE TYPE "public"."enum____detail_templates_v_emp_v_cd_v_position" AS ENUM('left', 'right', 'bottom');
  CREATE TYPE "public"."enum_shared_detail_templates_emp_cd_cbt_link_type" AS ENUM('reference', 'internal', 'external');
  CREATE TYPE "public"."enum_shared_detail_templates_emp_cd_cbt_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_shared_detail_templates_emp_cd_areas" AS ENUM('ID-AC', 'ID-SU', 'ID-SB', 'ID-RI', 'ID-KR', 'ID-JA', 'ID-SS', 'ID-BB', 'ID-BE', 'ID-LA', 'ID-JK', 'ID-JB', 'ID-BT', 'ID-JT', 'ID-YO', 'ID-JI', 'ID-BA', 'ID-NB', 'ID-NT', 'ID-KB', 'ID-KT', 'ID-KS', 'ID-KI', 'ID-KU', 'ID-SA', 'ID-GO', 'ID-ST', 'ID-SR', 'ID-SN', 'ID-SG', 'ID-MA', 'ID-MU', 'ID-PB', 'ID-PD', 'ID-PA', 'ID-PT', 'ID-PE', 'ID-PS');
  CREATE TYPE "public"."enum_shared_detail_templates_emp_cd_position" AS ENUM('left', 'right', 'bottom');
  CREATE TYPE "public"."enum_____shared_detail_templates_v_emp_v_cd_v_cbt_v_link_type" AS ENUM('reference', 'internal', 'external');
  CREATE TYPE "public"."enum_____shared_detail_templates_v_emp_v_cd_v_cbt_v_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum____shared_detail_templates_v_emp_v_cd_v_areas" AS ENUM('ID-AC', 'ID-SU', 'ID-SB', 'ID-RI', 'ID-KR', 'ID-JA', 'ID-SS', 'ID-BB', 'ID-BE', 'ID-LA', 'ID-JK', 'ID-JB', 'ID-BT', 'ID-JT', 'ID-YO', 'ID-JI', 'ID-BA', 'ID-NB', 'ID-NT', 'ID-KB', 'ID-KT', 'ID-KS', 'ID-KI', 'ID-KU', 'ID-SA', 'ID-GO', 'ID-ST', 'ID-SR', 'ID-SN', 'ID-SG', 'ID-MA', 'ID-MU', 'ID-PB', 'ID-PD', 'ID-PA', 'ID-PT', 'ID-PE', 'ID-PS');
  CREATE TYPE "public"."enum____shared_detail_templates_v_emp_v_cd_v_position" AS ENUM('left', 'right', 'bottom');
  CREATE TABLE "pages_emp_cd_bg" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_emp_cd_bg_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_emp_cd_cbt" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_emp_cd_cbt_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_pages_emp_cd_cbt_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "pages_emp_cd_cbt_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_emp_cd_areas" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_pages_emp_cd_areas",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_emp_cd" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"position" "enum_pages_emp_cd_position" DEFAULT 'left'
  );
  
  CREATE TABLE "pages_emp_cd_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "____pages_v_emp_v_cd_v_bg_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "____pages_v_emp_v_cd_v_bg_v_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "____pages_v_emp_v_cd_v_cbt_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum_____pages_v_emp_v_cd_v_cbt_v_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_____pages_v_emp_v_cd_v_cbt_v_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "____pages_v_emp_v_cd_v_cbt_v_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "___pages_v_emp_v_cd_v_areas" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum____pages_v_emp_v_cd_v_areas",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "___pages_v_emp_v_cd_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"position" "enum____pages_v_emp_v_cd_v_position" DEFAULT 'left',
  	"_uuid" varchar
  );
  
  CREATE TABLE "___pages_v_emp_v_cd_v_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "shared_pages_emp_cd_bg" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "shared_pages_emp_cd_bg_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_emp_cd_cbt" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_shared_pages_emp_cd_cbt_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_shared_pages_emp_cd_cbt_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "shared_pages_emp_cd_cbt_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_emp_cd_areas" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_shared_pages_emp_cd_areas",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "shared_pages_emp_cd" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"position" "enum_shared_pages_emp_cd_position" DEFAULT 'left'
  );
  
  CREATE TABLE "shared_pages_emp_cd_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "____shared_pages_v_emp_v_cd_v_bg_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "____shared_pages_v_emp_v_cd_v_bg_v_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "____shared_pages_v_emp_v_cd_v_cbt_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum_____shared_pages_v_emp_v_cd_v_cbt_v_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_____shared_pages_v_emp_v_cd_v_cbt_v_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "____shared_pages_v_emp_v_cd_v_cbt_v_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "___shared_pages_v_emp_v_cd_v_areas" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum____shared_pages_v_emp_v_cd_v_areas",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "___shared_pages_v_emp_v_cd_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"position" "enum____shared_pages_v_emp_v_cd_v_position" DEFAULT 'left',
  	"_uuid" varchar
  );
  
  CREATE TABLE "___shared_pages_v_emp_v_cd_v_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "detail_templates_emp_cd_bg" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "detail_templates_emp_cd_bg_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_emp_cd_cbt" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_detail_templates_emp_cd_cbt_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_detail_templates_emp_cd_cbt_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "detail_templates_emp_cd_cbt_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_emp_cd_areas" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_detail_templates_emp_cd_areas",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "detail_templates_emp_cd" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"position" "enum_detail_templates_emp_cd_position" DEFAULT 'left'
  );
  
  CREATE TABLE "detail_templates_emp_cd_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "____detail_templates_v_emp_v_cd_v_bg_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "____detail_templates_v_emp_v_cd_v_bg_v_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "____detail_templates_v_emp_v_cd_v_cbt_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum_____detail_templates_v_emp_v_cd_v_cbt_v_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_____detail_templates_v_emp_v_cd_v_cbt_v_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "____detail_templates_v_emp_v_cd_v_cbt_v_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "___detail_templates_v_emp_v_cd_v_areas" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum____detail_templates_v_emp_v_cd_v_areas",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "___detail_templates_v_emp_v_cd_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"position" "enum____detail_templates_v_emp_v_cd_v_position" DEFAULT 'left',
  	"_uuid" varchar
  );
  
  CREATE TABLE "___detail_templates_v_emp_v_cd_v_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_emp_cd_bg" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_emp_cd_bg_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_emp_cd_cbt" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_shared_detail_templates_emp_cd_cbt_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_shared_detail_templates_emp_cd_cbt_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "shared_detail_templates_emp_cd_cbt_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_emp_cd_areas" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_shared_detail_templates_emp_cd_areas",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_emp_cd" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"position" "enum_shared_detail_templates_emp_cd_position" DEFAULT 'left'
  );
  
  CREATE TABLE "shared_detail_templates_emp_cd_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "____shared_detail_templates_v_emp_v_cd_v_bg_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "____shared_detail_templates_v_emp_v_cd_v_bg_v_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "____shared_detail_templates_v_emp_v_cd_v_cbt_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum_____shared_detail_templates_v_emp_v_cd_v_cbt_v_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_____shared_detail_templates_v_emp_v_cd_v_cbt_v_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "____shared_detail_templates_v_emp_v_cd_v_cbt_v_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "___shared_detail_templates_v_emp_v_cd_v_areas" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum____shared_detail_templates_v_emp_v_cd_v_areas",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "___shared_detail_templates_v_emp_v_cd_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"position" "enum____shared_detail_templates_v_emp_v_cd_v_position" DEFAULT 'left',
  	"_uuid" varchar
  );
  
  CREATE TABLE "___shared_detail_templates_v_emp_v_cd_v_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages_emp_cd_bg" ADD CONSTRAINT "pages_emp_cd_bg_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_emp_cd"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_emp_cd_bg_locales" ADD CONSTRAINT "pages_emp_cd_bg_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_emp_cd_bg"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_emp_cd_cbt" ADD CONSTRAINT "pages_emp_cd_cbt_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_emp_cd"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_emp_cd_cbt_locales" ADD CONSTRAINT "pages_emp_cd_cbt_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_emp_cd_cbt"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_emp_cd_areas" ADD CONSTRAINT "pages_emp_cd_areas_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages_emp_cd"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_emp_cd" ADD CONSTRAINT "pages_emp_cd_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_emp_cd" ADD CONSTRAINT "pages_emp_cd_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_emp"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_emp_cd_locales" ADD CONSTRAINT "pages_emp_cd_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_emp_cd"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "____pages_v_emp_v_cd_v_bg_v" ADD CONSTRAINT "____pages_v_emp_v_cd_v_bg_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___pages_v_emp_v_cd_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "____pages_v_emp_v_cd_v_bg_v_locales" ADD CONSTRAINT "____pages_v_emp_v_cd_v_bg_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."____pages_v_emp_v_cd_v_bg_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "____pages_v_emp_v_cd_v_cbt_v" ADD CONSTRAINT "____pages_v_emp_v_cd_v_cbt_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___pages_v_emp_v_cd_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "____pages_v_emp_v_cd_v_cbt_v_locales" ADD CONSTRAINT "____pages_v_emp_v_cd_v_cbt_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."____pages_v_emp_v_cd_v_cbt_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___pages_v_emp_v_cd_v_areas" ADD CONSTRAINT "___pages_v_emp_v_cd_v_areas_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."___pages_v_emp_v_cd_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___pages_v_emp_v_cd_v" ADD CONSTRAINT "___pages_v_emp_v_cd_v_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "___pages_v_emp_v_cd_v" ADD CONSTRAINT "___pages_v_emp_v_cd_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_emp_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___pages_v_emp_v_cd_v_locales" ADD CONSTRAINT "___pages_v_emp_v_cd_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___pages_v_emp_v_cd_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_emp_cd_bg" ADD CONSTRAINT "shared_pages_emp_cd_bg_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_emp_cd"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_emp_cd_bg_locales" ADD CONSTRAINT "shared_pages_emp_cd_bg_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_emp_cd_bg"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_emp_cd_cbt" ADD CONSTRAINT "shared_pages_emp_cd_cbt_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_emp_cd"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_emp_cd_cbt_locales" ADD CONSTRAINT "shared_pages_emp_cd_cbt_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_emp_cd_cbt"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_emp_cd_areas" ADD CONSTRAINT "shared_pages_emp_cd_areas_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."shared_pages_emp_cd"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_emp_cd" ADD CONSTRAINT "shared_pages_emp_cd_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_pages_emp_cd" ADD CONSTRAINT "shared_pages_emp_cd_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_emp"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_emp_cd_locales" ADD CONSTRAINT "shared_pages_emp_cd_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_emp_cd"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "____shared_pages_v_emp_v_cd_v_bg_v" ADD CONSTRAINT "____shared_pages_v_emp_v_cd_v_bg_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___shared_pages_v_emp_v_cd_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "____shared_pages_v_emp_v_cd_v_bg_v_locales" ADD CONSTRAINT "____shared_pages_v_emp_v_cd_v_bg_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."____shared_pages_v_emp_v_cd_v_bg_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "____shared_pages_v_emp_v_cd_v_cbt_v" ADD CONSTRAINT "____shared_pages_v_emp_v_cd_v_cbt_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___shared_pages_v_emp_v_cd_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "____shared_pages_v_emp_v_cd_v_cbt_v_locales" ADD CONSTRAINT "____shared_pages_v_emp_v_cd_v_cbt_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."____shared_pages_v_emp_v_cd_v_cbt_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_pages_v_emp_v_cd_v_areas" ADD CONSTRAINT "___shared_pages_v_emp_v_cd_v_areas_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."___shared_pages_v_emp_v_cd_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_pages_v_emp_v_cd_v" ADD CONSTRAINT "___shared_pages_v_emp_v_cd_v_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "___shared_pages_v_emp_v_cd_v" ADD CONSTRAINT "___shared_pages_v_emp_v_cd_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_emp_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_pages_v_emp_v_cd_v_locales" ADD CONSTRAINT "___shared_pages_v_emp_v_cd_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___shared_pages_v_emp_v_cd_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_emp_cd_bg" ADD CONSTRAINT "detail_templates_emp_cd_bg_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_emp_cd"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_emp_cd_bg_locales" ADD CONSTRAINT "detail_templates_emp_cd_bg_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_emp_cd_bg"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_emp_cd_cbt" ADD CONSTRAINT "detail_templates_emp_cd_cbt_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_emp_cd"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_emp_cd_cbt_locales" ADD CONSTRAINT "detail_templates_emp_cd_cbt_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_emp_cd_cbt"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_emp_cd_areas" ADD CONSTRAINT "detail_templates_emp_cd_areas_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."detail_templates_emp_cd"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_emp_cd" ADD CONSTRAINT "detail_templates_emp_cd_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "detail_templates_emp_cd" ADD CONSTRAINT "detail_templates_emp_cd_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_emp"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_emp_cd_locales" ADD CONSTRAINT "detail_templates_emp_cd_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_emp_cd"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "____detail_templates_v_emp_v_cd_v_bg_v" ADD CONSTRAINT "____detail_templates_v_emp_v_cd_v_bg_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___detail_templates_v_emp_v_cd_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "____detail_templates_v_emp_v_cd_v_bg_v_locales" ADD CONSTRAINT "____detail_templates_v_emp_v_cd_v_bg_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."____detail_templates_v_emp_v_cd_v_bg_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "____detail_templates_v_emp_v_cd_v_cbt_v" ADD CONSTRAINT "____detail_templates_v_emp_v_cd_v_cbt_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___detail_templates_v_emp_v_cd_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "____detail_templates_v_emp_v_cd_v_cbt_v_locales" ADD CONSTRAINT "____detail_templates_v_emp_v_cd_v_cbt_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."____detail_templates_v_emp_v_cd_v_cbt_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___detail_templates_v_emp_v_cd_v_areas" ADD CONSTRAINT "___detail_templates_v_emp_v_cd_v_areas_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."___detail_templates_v_emp_v_cd_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___detail_templates_v_emp_v_cd_v" ADD CONSTRAINT "___detail_templates_v_emp_v_cd_v_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "___detail_templates_v_emp_v_cd_v" ADD CONSTRAINT "___detail_templates_v_emp_v_cd_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_emp_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___detail_templates_v_emp_v_cd_v_locales" ADD CONSTRAINT "___detail_templates_v_emp_v_cd_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___detail_templates_v_emp_v_cd_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_emp_cd_bg" ADD CONSTRAINT "shared_detail_templates_emp_cd_bg_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_emp_cd"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_emp_cd_bg_locales" ADD CONSTRAINT "shared_detail_templates_emp_cd_bg_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_emp_cd_bg"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_emp_cd_cbt" ADD CONSTRAINT "shared_detail_templates_emp_cd_cbt_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_emp_cd"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_emp_cd_cbt_locales" ADD CONSTRAINT "shared_detail_templates_emp_cd_cbt_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_emp_cd_cbt"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_emp_cd_areas" ADD CONSTRAINT "shared_detail_templates_emp_cd_areas_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."shared_detail_templates_emp_cd"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_emp_cd" ADD CONSTRAINT "shared_detail_templates_emp_cd_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_emp_cd" ADD CONSTRAINT "shared_detail_templates_emp_cd_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_emp"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_emp_cd_locales" ADD CONSTRAINT "shared_detail_templates_emp_cd_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_emp_cd"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "____shared_detail_templates_v_emp_v_cd_v_bg_v" ADD CONSTRAINT "____shared_detail_templates_v_emp_v_cd_v_bg_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___shared_detail_templates_v_emp_v_cd_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "____shared_detail_templates_v_emp_v_cd_v_bg_v_locales" ADD CONSTRAINT "____shared_detail_templates_v_emp_v_cd_v_bg_v_locales_par_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."____shared_detail_templates_v_emp_v_cd_v_bg_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "____shared_detail_templates_v_emp_v_cd_v_cbt_v" ADD CONSTRAINT "____shared_detail_templates_v_emp_v_cd_v_cbt_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___shared_detail_templates_v_emp_v_cd_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "____shared_detail_templates_v_emp_v_cd_v_cbt_v_locales" ADD CONSTRAINT "____shared_detail_templates_v_emp_v_cd_v_cbt_v_locales_pa_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."____shared_detail_templates_v_emp_v_cd_v_cbt_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_detail_templates_v_emp_v_cd_v_areas" ADD CONSTRAINT "___shared_detail_templates_v_emp_v_cd_v_areas_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."___shared_detail_templates_v_emp_v_cd_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_detail_templates_v_emp_v_cd_v" ADD CONSTRAINT "___shared_detail_templates_v_emp_v_cd_v_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "___shared_detail_templates_v_emp_v_cd_v" ADD CONSTRAINT "___shared_detail_templates_v_emp_v_cd_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_emp_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_detail_templates_v_emp_v_cd_v_locales" ADD CONSTRAINT "___shared_detail_templates_v_emp_v_cd_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___shared_detail_templates_v_emp_v_cd_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_emp_cd_bg_order_idx" ON "pages_emp_cd_bg" USING btree ("_order");
  CREATE INDEX "pages_emp_cd_bg_parent_id_idx" ON "pages_emp_cd_bg" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_emp_cd_bg_locales_locale_parent_id_unique" ON "pages_emp_cd_bg_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_emp_cd_cbt_order_idx" ON "pages_emp_cd_cbt" USING btree ("_order");
  CREATE INDEX "pages_emp_cd_cbt_parent_id_idx" ON "pages_emp_cd_cbt" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_emp_cd_cbt_locales_locale_parent_id_unique" ON "pages_emp_cd_cbt_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_emp_cd_areas_order_idx" ON "pages_emp_cd_areas" USING btree ("order");
  CREATE INDEX "pages_emp_cd_areas_parent_idx" ON "pages_emp_cd_areas" USING btree ("parent_id");
  CREATE INDEX "pages_emp_cd_order_idx" ON "pages_emp_cd" USING btree ("_order");
  CREATE INDEX "pages_emp_cd_parent_id_idx" ON "pages_emp_cd" USING btree ("_parent_id");
  CREATE INDEX "pages_emp_cd_image_idx" ON "pages_emp_cd" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_emp_cd_locales_locale_parent_id_unique" ON "pages_emp_cd_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "____pages_v_emp_v_cd_v_bg_v_order_idx" ON "____pages_v_emp_v_cd_v_bg_v" USING btree ("_order");
  CREATE INDEX "____pages_v_emp_v_cd_v_bg_v_parent_id_idx" ON "____pages_v_emp_v_cd_v_bg_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "____pages_v_emp_v_cd_v_bg_v_locales_locale_parent_id_unique" ON "____pages_v_emp_v_cd_v_bg_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "____pages_v_emp_v_cd_v_cbt_v_order_idx" ON "____pages_v_emp_v_cd_v_cbt_v" USING btree ("_order");
  CREATE INDEX "____pages_v_emp_v_cd_v_cbt_v_parent_id_idx" ON "____pages_v_emp_v_cd_v_cbt_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "____pages_v_emp_v_cd_v_cbt_v_locales_locale_parent_id_unique" ON "____pages_v_emp_v_cd_v_cbt_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___pages_v_emp_v_cd_v_areas_order_idx" ON "___pages_v_emp_v_cd_v_areas" USING btree ("order");
  CREATE INDEX "___pages_v_emp_v_cd_v_areas_parent_idx" ON "___pages_v_emp_v_cd_v_areas" USING btree ("parent_id");
  CREATE INDEX "___pages_v_emp_v_cd_v_order_idx" ON "___pages_v_emp_v_cd_v" USING btree ("_order");
  CREATE INDEX "___pages_v_emp_v_cd_v_parent_id_idx" ON "___pages_v_emp_v_cd_v" USING btree ("_parent_id");
  CREATE INDEX "___pages_v_emp_v_cd_v_image_idx" ON "___pages_v_emp_v_cd_v" USING btree ("image_id");
  CREATE UNIQUE INDEX "___pages_v_emp_v_cd_v_locales_locale_parent_id_unique" ON "___pages_v_emp_v_cd_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_emp_cd_bg_order_idx" ON "shared_pages_emp_cd_bg" USING btree ("_order");
  CREATE INDEX "shared_pages_emp_cd_bg_parent_id_idx" ON "shared_pages_emp_cd_bg" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shared_pages_emp_cd_bg_locales_locale_parent_id_unique" ON "shared_pages_emp_cd_bg_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_emp_cd_cbt_order_idx" ON "shared_pages_emp_cd_cbt" USING btree ("_order");
  CREATE INDEX "shared_pages_emp_cd_cbt_parent_id_idx" ON "shared_pages_emp_cd_cbt" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shared_pages_emp_cd_cbt_locales_locale_parent_id_unique" ON "shared_pages_emp_cd_cbt_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_emp_cd_areas_order_idx" ON "shared_pages_emp_cd_areas" USING btree ("order");
  CREATE INDEX "shared_pages_emp_cd_areas_parent_idx" ON "shared_pages_emp_cd_areas" USING btree ("parent_id");
  CREATE INDEX "shared_pages_emp_cd_order_idx" ON "shared_pages_emp_cd" USING btree ("_order");
  CREATE INDEX "shared_pages_emp_cd_parent_id_idx" ON "shared_pages_emp_cd" USING btree ("_parent_id");
  CREATE INDEX "shared_pages_emp_cd_image_idx" ON "shared_pages_emp_cd" USING btree ("image_id");
  CREATE UNIQUE INDEX "shared_pages_emp_cd_locales_locale_parent_id_unique" ON "shared_pages_emp_cd_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "____shared_pages_v_emp_v_cd_v_bg_v_order_idx" ON "____shared_pages_v_emp_v_cd_v_bg_v" USING btree ("_order");
  CREATE INDEX "____shared_pages_v_emp_v_cd_v_bg_v_parent_id_idx" ON "____shared_pages_v_emp_v_cd_v_bg_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "____shared_pages_v_emp_v_cd_v_bg_v_locales_locale_parent_id_" ON "____shared_pages_v_emp_v_cd_v_bg_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "____shared_pages_v_emp_v_cd_v_cbt_v_order_idx" ON "____shared_pages_v_emp_v_cd_v_cbt_v" USING btree ("_order");
  CREATE INDEX "____shared_pages_v_emp_v_cd_v_cbt_v_parent_id_idx" ON "____shared_pages_v_emp_v_cd_v_cbt_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "____shared_pages_v_emp_v_cd_v_cbt_v_locales_locale_parent_id" ON "____shared_pages_v_emp_v_cd_v_cbt_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___shared_pages_v_emp_v_cd_v_areas_order_idx" ON "___shared_pages_v_emp_v_cd_v_areas" USING btree ("order");
  CREATE INDEX "___shared_pages_v_emp_v_cd_v_areas_parent_idx" ON "___shared_pages_v_emp_v_cd_v_areas" USING btree ("parent_id");
  CREATE INDEX "___shared_pages_v_emp_v_cd_v_order_idx" ON "___shared_pages_v_emp_v_cd_v" USING btree ("_order");
  CREATE INDEX "___shared_pages_v_emp_v_cd_v_parent_id_idx" ON "___shared_pages_v_emp_v_cd_v" USING btree ("_parent_id");
  CREATE INDEX "___shared_pages_v_emp_v_cd_v_image_idx" ON "___shared_pages_v_emp_v_cd_v" USING btree ("image_id");
  CREATE UNIQUE INDEX "___shared_pages_v_emp_v_cd_v_locales_locale_parent_id_unique" ON "___shared_pages_v_emp_v_cd_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_emp_cd_bg_order_idx" ON "detail_templates_emp_cd_bg" USING btree ("_order");
  CREATE INDEX "detail_templates_emp_cd_bg_parent_id_idx" ON "detail_templates_emp_cd_bg" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "detail_templates_emp_cd_bg_locales_locale_parent_id_unique" ON "detail_templates_emp_cd_bg_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_emp_cd_cbt_order_idx" ON "detail_templates_emp_cd_cbt" USING btree ("_order");
  CREATE INDEX "detail_templates_emp_cd_cbt_parent_id_idx" ON "detail_templates_emp_cd_cbt" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "detail_templates_emp_cd_cbt_locales_locale_parent_id_unique" ON "detail_templates_emp_cd_cbt_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_emp_cd_areas_order_idx" ON "detail_templates_emp_cd_areas" USING btree ("order");
  CREATE INDEX "detail_templates_emp_cd_areas_parent_idx" ON "detail_templates_emp_cd_areas" USING btree ("parent_id");
  CREATE INDEX "detail_templates_emp_cd_order_idx" ON "detail_templates_emp_cd" USING btree ("_order");
  CREATE INDEX "detail_templates_emp_cd_parent_id_idx" ON "detail_templates_emp_cd" USING btree ("_parent_id");
  CREATE INDEX "detail_templates_emp_cd_image_idx" ON "detail_templates_emp_cd" USING btree ("image_id");
  CREATE UNIQUE INDEX "detail_templates_emp_cd_locales_locale_parent_id_unique" ON "detail_templates_emp_cd_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "____detail_templates_v_emp_v_cd_v_bg_v_order_idx" ON "____detail_templates_v_emp_v_cd_v_bg_v" USING btree ("_order");
  CREATE INDEX "____detail_templates_v_emp_v_cd_v_bg_v_parent_id_idx" ON "____detail_templates_v_emp_v_cd_v_bg_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "____detail_templates_v_emp_v_cd_v_bg_v_locales_locale_parent" ON "____detail_templates_v_emp_v_cd_v_bg_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "____detail_templates_v_emp_v_cd_v_cbt_v_order_idx" ON "____detail_templates_v_emp_v_cd_v_cbt_v" USING btree ("_order");
  CREATE INDEX "____detail_templates_v_emp_v_cd_v_cbt_v_parent_id_idx" ON "____detail_templates_v_emp_v_cd_v_cbt_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "____detail_templates_v_emp_v_cd_v_cbt_v_locales_locale_paren" ON "____detail_templates_v_emp_v_cd_v_cbt_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___detail_templates_v_emp_v_cd_v_areas_order_idx" ON "___detail_templates_v_emp_v_cd_v_areas" USING btree ("order");
  CREATE INDEX "___detail_templates_v_emp_v_cd_v_areas_parent_idx" ON "___detail_templates_v_emp_v_cd_v_areas" USING btree ("parent_id");
  CREATE INDEX "___detail_templates_v_emp_v_cd_v_order_idx" ON "___detail_templates_v_emp_v_cd_v" USING btree ("_order");
  CREATE INDEX "___detail_templates_v_emp_v_cd_v_parent_id_idx" ON "___detail_templates_v_emp_v_cd_v" USING btree ("_parent_id");
  CREATE INDEX "___detail_templates_v_emp_v_cd_v_image_idx" ON "___detail_templates_v_emp_v_cd_v" USING btree ("image_id");
  CREATE UNIQUE INDEX "___detail_templates_v_emp_v_cd_v_locales_locale_parent_id_un" ON "___detail_templates_v_emp_v_cd_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_emp_cd_bg_order_idx" ON "shared_detail_templates_emp_cd_bg" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_emp_cd_bg_parent_id_idx" ON "shared_detail_templates_emp_cd_bg" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shared_detail_templates_emp_cd_bg_locales_locale_parent_id_u" ON "shared_detail_templates_emp_cd_bg_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_emp_cd_cbt_order_idx" ON "shared_detail_templates_emp_cd_cbt" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_emp_cd_cbt_parent_id_idx" ON "shared_detail_templates_emp_cd_cbt" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shared_detail_templates_emp_cd_cbt_locales_locale_parent_id_" ON "shared_detail_templates_emp_cd_cbt_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_emp_cd_areas_order_idx" ON "shared_detail_templates_emp_cd_areas" USING btree ("order");
  CREATE INDEX "shared_detail_templates_emp_cd_areas_parent_idx" ON "shared_detail_templates_emp_cd_areas" USING btree ("parent_id");
  CREATE INDEX "shared_detail_templates_emp_cd_order_idx" ON "shared_detail_templates_emp_cd" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_emp_cd_parent_id_idx" ON "shared_detail_templates_emp_cd" USING btree ("_parent_id");
  CREATE INDEX "shared_detail_templates_emp_cd_image_idx" ON "shared_detail_templates_emp_cd" USING btree ("image_id");
  CREATE UNIQUE INDEX "shared_detail_templates_emp_cd_locales_locale_parent_id_uniq" ON "shared_detail_templates_emp_cd_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "____shared_detail_templates_v_emp_v_cd_v_bg_v_order_idx" ON "____shared_detail_templates_v_emp_v_cd_v_bg_v" USING btree ("_order");
  CREATE INDEX "____shared_detail_templates_v_emp_v_cd_v_bg_v_parent_id_idx" ON "____shared_detail_templates_v_emp_v_cd_v_bg_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "____shared_detail_templates_v_emp_v_cd_v_bg_v_locales_locale" ON "____shared_detail_templates_v_emp_v_cd_v_bg_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "____shared_detail_templates_v_emp_v_cd_v_cbt_v_order_idx" ON "____shared_detail_templates_v_emp_v_cd_v_cbt_v" USING btree ("_order");
  CREATE INDEX "____shared_detail_templates_v_emp_v_cd_v_cbt_v_parent_id_idx" ON "____shared_detail_templates_v_emp_v_cd_v_cbt_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "____shared_detail_templates_v_emp_v_cd_v_cbt_v_locales_local" ON "____shared_detail_templates_v_emp_v_cd_v_cbt_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___shared_detail_templates_v_emp_v_cd_v_areas_order_idx" ON "___shared_detail_templates_v_emp_v_cd_v_areas" USING btree ("order");
  CREATE INDEX "___shared_detail_templates_v_emp_v_cd_v_areas_parent_idx" ON "___shared_detail_templates_v_emp_v_cd_v_areas" USING btree ("parent_id");
  CREATE INDEX "___shared_detail_templates_v_emp_v_cd_v_order_idx" ON "___shared_detail_templates_v_emp_v_cd_v" USING btree ("_order");
  CREATE INDEX "___shared_detail_templates_v_emp_v_cd_v_parent_id_idx" ON "___shared_detail_templates_v_emp_v_cd_v" USING btree ("_parent_id");
  CREATE INDEX "___shared_detail_templates_v_emp_v_cd_v_image_idx" ON "___shared_detail_templates_v_emp_v_cd_v" USING btree ("image_id");
  CREATE UNIQUE INDEX "___shared_detail_templates_v_emp_v_cd_v_locales_locale_paren" ON "___shared_detail_templates_v_emp_v_cd_v_locales" USING btree ("_locale","_parent_id");`)

  for (const p of FAMILIES) {
    await db.execute(sql.raw(plainCopy(p)))
    await db.execute(sql.raw(versionedCopy(p)))
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_emp_cd_bg" CASCADE;
  DROP TABLE "pages_emp_cd_bg_locales" CASCADE;
  DROP TABLE "pages_emp_cd_cbt" CASCADE;
  DROP TABLE "pages_emp_cd_cbt_locales" CASCADE;
  DROP TABLE "pages_emp_cd_areas" CASCADE;
  DROP TABLE "pages_emp_cd" CASCADE;
  DROP TABLE "pages_emp_cd_locales" CASCADE;
  DROP TABLE "____pages_v_emp_v_cd_v_bg_v" CASCADE;
  DROP TABLE "____pages_v_emp_v_cd_v_bg_v_locales" CASCADE;
  DROP TABLE "____pages_v_emp_v_cd_v_cbt_v" CASCADE;
  DROP TABLE "____pages_v_emp_v_cd_v_cbt_v_locales" CASCADE;
  DROP TABLE "___pages_v_emp_v_cd_v_areas" CASCADE;
  DROP TABLE "___pages_v_emp_v_cd_v" CASCADE;
  DROP TABLE "___pages_v_emp_v_cd_v_locales" CASCADE;
  DROP TABLE "shared_pages_emp_cd_bg" CASCADE;
  DROP TABLE "shared_pages_emp_cd_bg_locales" CASCADE;
  DROP TABLE "shared_pages_emp_cd_cbt" CASCADE;
  DROP TABLE "shared_pages_emp_cd_cbt_locales" CASCADE;
  DROP TABLE "shared_pages_emp_cd_areas" CASCADE;
  DROP TABLE "shared_pages_emp_cd" CASCADE;
  DROP TABLE "shared_pages_emp_cd_locales" CASCADE;
  DROP TABLE "____shared_pages_v_emp_v_cd_v_bg_v" CASCADE;
  DROP TABLE "____shared_pages_v_emp_v_cd_v_bg_v_locales" CASCADE;
  DROP TABLE "____shared_pages_v_emp_v_cd_v_cbt_v" CASCADE;
  DROP TABLE "____shared_pages_v_emp_v_cd_v_cbt_v_locales" CASCADE;
  DROP TABLE "___shared_pages_v_emp_v_cd_v_areas" CASCADE;
  DROP TABLE "___shared_pages_v_emp_v_cd_v" CASCADE;
  DROP TABLE "___shared_pages_v_emp_v_cd_v_locales" CASCADE;
  DROP TABLE "detail_templates_emp_cd_bg" CASCADE;
  DROP TABLE "detail_templates_emp_cd_bg_locales" CASCADE;
  DROP TABLE "detail_templates_emp_cd_cbt" CASCADE;
  DROP TABLE "detail_templates_emp_cd_cbt_locales" CASCADE;
  DROP TABLE "detail_templates_emp_cd_areas" CASCADE;
  DROP TABLE "detail_templates_emp_cd" CASCADE;
  DROP TABLE "detail_templates_emp_cd_locales" CASCADE;
  DROP TABLE "____detail_templates_v_emp_v_cd_v_bg_v" CASCADE;
  DROP TABLE "____detail_templates_v_emp_v_cd_v_bg_v_locales" CASCADE;
  DROP TABLE "____detail_templates_v_emp_v_cd_v_cbt_v" CASCADE;
  DROP TABLE "____detail_templates_v_emp_v_cd_v_cbt_v_locales" CASCADE;
  DROP TABLE "___detail_templates_v_emp_v_cd_v_areas" CASCADE;
  DROP TABLE "___detail_templates_v_emp_v_cd_v" CASCADE;
  DROP TABLE "___detail_templates_v_emp_v_cd_v_locales" CASCADE;
  DROP TABLE "shared_detail_templates_emp_cd_bg" CASCADE;
  DROP TABLE "shared_detail_templates_emp_cd_bg_locales" CASCADE;
  DROP TABLE "shared_detail_templates_emp_cd_cbt" CASCADE;
  DROP TABLE "shared_detail_templates_emp_cd_cbt_locales" CASCADE;
  DROP TABLE "shared_detail_templates_emp_cd_areas" CASCADE;
  DROP TABLE "shared_detail_templates_emp_cd" CASCADE;
  DROP TABLE "shared_detail_templates_emp_cd_locales" CASCADE;
  DROP TABLE "____shared_detail_templates_v_emp_v_cd_v_bg_v" CASCADE;
  DROP TABLE "____shared_detail_templates_v_emp_v_cd_v_bg_v_locales" CASCADE;
  DROP TABLE "____shared_detail_templates_v_emp_v_cd_v_cbt_v" CASCADE;
  DROP TABLE "____shared_detail_templates_v_emp_v_cd_v_cbt_v_locales" CASCADE;
  DROP TABLE "___shared_detail_templates_v_emp_v_cd_v_areas" CASCADE;
  DROP TABLE "___shared_detail_templates_v_emp_v_cd_v" CASCADE;
  DROP TABLE "___shared_detail_templates_v_emp_v_cd_v_locales" CASCADE;
  DROP TYPE "public"."enum_pages_emp_cd_cbt_link_type";
  DROP TYPE "public"."enum_pages_emp_cd_cbt_style";
  DROP TYPE "public"."enum_pages_emp_cd_areas";
  DROP TYPE "public"."enum_pages_emp_cd_position";
  DROP TYPE "public"."enum_____pages_v_emp_v_cd_v_cbt_v_link_type";
  DROP TYPE "public"."enum_____pages_v_emp_v_cd_v_cbt_v_style";
  DROP TYPE "public"."enum____pages_v_emp_v_cd_v_areas";
  DROP TYPE "public"."enum____pages_v_emp_v_cd_v_position";
  DROP TYPE "public"."enum_shared_pages_emp_cd_cbt_link_type";
  DROP TYPE "public"."enum_shared_pages_emp_cd_cbt_style";
  DROP TYPE "public"."enum_shared_pages_emp_cd_areas";
  DROP TYPE "public"."enum_shared_pages_emp_cd_position";
  DROP TYPE "public"."enum_____shared_pages_v_emp_v_cd_v_cbt_v_link_type";
  DROP TYPE "public"."enum_____shared_pages_v_emp_v_cd_v_cbt_v_style";
  DROP TYPE "public"."enum____shared_pages_v_emp_v_cd_v_areas";
  DROP TYPE "public"."enum____shared_pages_v_emp_v_cd_v_position";
  DROP TYPE "public"."enum_detail_templates_emp_cd_cbt_link_type";
  DROP TYPE "public"."enum_detail_templates_emp_cd_cbt_style";
  DROP TYPE "public"."enum_detail_templates_emp_cd_areas";
  DROP TYPE "public"."enum_detail_templates_emp_cd_position";
  DROP TYPE "public"."enum_____detail_templates_v_emp_v_cd_v_cbt_v_link_type";
  DROP TYPE "public"."enum_____detail_templates_v_emp_v_cd_v_cbt_v_style";
  DROP TYPE "public"."enum____detail_templates_v_emp_v_cd_v_areas";
  DROP TYPE "public"."enum____detail_templates_v_emp_v_cd_v_position";
  DROP TYPE "public"."enum_shared_detail_templates_emp_cd_cbt_link_type";
  DROP TYPE "public"."enum_shared_detail_templates_emp_cd_cbt_style";
  DROP TYPE "public"."enum_shared_detail_templates_emp_cd_areas";
  DROP TYPE "public"."enum_shared_detail_templates_emp_cd_position";
  DROP TYPE "public"."enum_____shared_detail_templates_v_emp_v_cd_v_cbt_v_link_type";
  DROP TYPE "public"."enum_____shared_detail_templates_v_emp_v_cd_v_cbt_v_style";
  DROP TYPE "public"."enum____shared_detail_templates_v_emp_v_cd_v_areas";
  DROP TYPE "public"."enum____shared_detail_templates_v_emp_v_cd_v_position";`)
}
