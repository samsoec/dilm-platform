import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_header_cta_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum__header_v_version_cta_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_site_messages_not_found_buttons_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum__site_messages_v_version_not_found_buttons_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_pages_pl_empty_state_button_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___pages_v_pl_v_empty_state_button_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_shared_pages_pl_empty_state_button_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___shared_pages_v_pl_v_empty_state_button_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_detail_templates_pl_empty_state_button_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___detail_templates_v_pl_v_empty_state_button_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_shared_detail_templates_pl_empty_state_button_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___shared_detail_templates_v_pl_v_empty_state_button_style" AS ENUM('primary', 'light', 'text');
  ALTER TABLE "header" ADD COLUMN "cta_style" "enum_header_cta_style" DEFAULT 'primary';
  ALTER TABLE "_header_v" ADD COLUMN "version_cta_style" "enum__header_v_version_cta_style" DEFAULT 'primary';
  ALTER TABLE "site_messages_not_found_buttons" ADD COLUMN "style" "enum_site_messages_not_found_buttons_style" DEFAULT 'primary' NOT NULL;
  ALTER TABLE "_site_messages_v_version_not_found_buttons" ADD COLUMN "style" "enum__site_messages_v_version_not_found_buttons_style" DEFAULT 'primary' NOT NULL;
  ALTER TABLE "pages_pl" ADD COLUMN "empty_state_button_style" "enum_pages_pl_empty_state_button_style" DEFAULT 'primary';
  ALTER TABLE "__pages_v_pl_v" ADD COLUMN "empty_state_button_style" "enum___pages_v_pl_v_empty_state_button_style" DEFAULT 'primary';
  ALTER TABLE "shared_pages_pl" ADD COLUMN "empty_state_button_style" "enum_shared_pages_pl_empty_state_button_style" DEFAULT 'primary';
  ALTER TABLE "__shared_pages_v_pl_v" ADD COLUMN "empty_state_button_style" "enum___shared_pages_v_pl_v_empty_state_button_style" DEFAULT 'primary';
  ALTER TABLE "detail_templates_pl" ADD COLUMN "empty_state_button_style" "enum_detail_templates_pl_empty_state_button_style" DEFAULT 'primary';
  ALTER TABLE "__detail_templates_v_pl_v" ADD COLUMN "empty_state_button_style" "enum___detail_templates_v_pl_v_empty_state_button_style" DEFAULT 'primary';
  ALTER TABLE "shared_detail_templates_pl" ADD COLUMN "empty_state_button_style" "enum_shared_detail_templates_pl_empty_state_button_style" DEFAULT 'primary';
  ALTER TABLE "__shared_detail_templates_v_pl_v" ADD COLUMN "empty_state_button_style" "enum___shared_detail_templates_v_pl_v_empty_state_button_style" DEFAULT 'primary';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "header" DROP COLUMN "cta_style";
  ALTER TABLE "_header_v" DROP COLUMN "version_cta_style";
  ALTER TABLE "site_messages_not_found_buttons" DROP COLUMN "style";
  ALTER TABLE "_site_messages_v_version_not_found_buttons" DROP COLUMN "style";
  ALTER TABLE "pages_pl" DROP COLUMN "empty_state_button_style";
  ALTER TABLE "__pages_v_pl_v" DROP COLUMN "empty_state_button_style";
  ALTER TABLE "shared_pages_pl" DROP COLUMN "empty_state_button_style";
  ALTER TABLE "__shared_pages_v_pl_v" DROP COLUMN "empty_state_button_style";
  ALTER TABLE "detail_templates_pl" DROP COLUMN "empty_state_button_style";
  ALTER TABLE "__detail_templates_v_pl_v" DROP COLUMN "empty_state_button_style";
  ALTER TABLE "shared_detail_templates_pl" DROP COLUMN "empty_state_button_style";
  ALTER TABLE "__shared_detail_templates_v_pl_v" DROP COLUMN "empty_state_button_style";
  DROP TYPE "public"."enum_header_cta_style";
  DROP TYPE "public"."enum__header_v_version_cta_style";
  DROP TYPE "public"."enum_site_messages_not_found_buttons_style";
  DROP TYPE "public"."enum__site_messages_v_version_not_found_buttons_style";
  DROP TYPE "public"."enum_pages_pl_empty_state_button_style";
  DROP TYPE "public"."enum___pages_v_pl_v_empty_state_button_style";
  DROP TYPE "public"."enum_shared_pages_pl_empty_state_button_style";
  DROP TYPE "public"."enum___shared_pages_v_pl_v_empty_state_button_style";
  DROP TYPE "public"."enum_detail_templates_pl_empty_state_button_style";
  DROP TYPE "public"."enum___detail_templates_v_pl_v_empty_state_button_style";
  DROP TYPE "public"."enum_shared_detail_templates_pl_empty_state_button_style";
  DROP TYPE "public"."enum___shared_detail_templates_v_pl_v_empty_state_button_style";`)
}
