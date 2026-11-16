import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_rich_locales" ADD COLUMN "toc_anchors" jsonb;
  ALTER TABLE "pages_ahead_locales" ADD COLUMN "text_stamp" varchar;
  ALTER TABLE "__pages_v_rich_v_locales" ADD COLUMN "toc_anchors" jsonb;
  ALTER TABLE "__pages_v_ahead_v_locales" ADD COLUMN "text_stamp" varchar;
  ALTER TABLE "shared_pages_rich_locales" ADD COLUMN "toc_anchors" jsonb;
  ALTER TABLE "shared_pages_ahead_locales" ADD COLUMN "text_stamp" varchar;
  ALTER TABLE "__shared_pages_v_rich_v_locales" ADD COLUMN "toc_anchors" jsonb;
  ALTER TABLE "__shared_pages_v_ahead_v_locales" ADD COLUMN "text_stamp" varchar;
  ALTER TABLE "detail_templates_rich_locales" ADD COLUMN "toc_anchors" jsonb;
  ALTER TABLE "detail_templates_ahead_locales" ADD COLUMN "text_stamp" varchar;
  ALTER TABLE "__detail_templates_v_rich_v_locales" ADD COLUMN "toc_anchors" jsonb;
  ALTER TABLE "__detail_templates_v_ahead_v_locales" ADD COLUMN "text_stamp" varchar;
  ALTER TABLE "shared_detail_templates_rich_locales" ADD COLUMN "toc_anchors" jsonb;
  ALTER TABLE "shared_detail_templates_ahead_locales" ADD COLUMN "text_stamp" varchar;
  ALTER TABLE "__shared_detail_templates_v_rich_v_locales" ADD COLUMN "toc_anchors" jsonb;
  ALTER TABLE "__shared_detail_templates_v_ahead_v_locales" ADD COLUMN "text_stamp" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_rich_locales" DROP COLUMN "toc_anchors";
  ALTER TABLE "pages_ahead_locales" DROP COLUMN "text_stamp";
  ALTER TABLE "__pages_v_rich_v_locales" DROP COLUMN "toc_anchors";
  ALTER TABLE "__pages_v_ahead_v_locales" DROP COLUMN "text_stamp";
  ALTER TABLE "shared_pages_rich_locales" DROP COLUMN "toc_anchors";
  ALTER TABLE "shared_pages_ahead_locales" DROP COLUMN "text_stamp";
  ALTER TABLE "__shared_pages_v_rich_v_locales" DROP COLUMN "toc_anchors";
  ALTER TABLE "__shared_pages_v_ahead_v_locales" DROP COLUMN "text_stamp";
  ALTER TABLE "detail_templates_rich_locales" DROP COLUMN "toc_anchors";
  ALTER TABLE "detail_templates_ahead_locales" DROP COLUMN "text_stamp";
  ALTER TABLE "__detail_templates_v_rich_v_locales" DROP COLUMN "toc_anchors";
  ALTER TABLE "__detail_templates_v_ahead_v_locales" DROP COLUMN "text_stamp";
  ALTER TABLE "shared_detail_templates_rich_locales" DROP COLUMN "toc_anchors";
  ALTER TABLE "shared_detail_templates_ahead_locales" DROP COLUMN "text_stamp";
  ALTER TABLE "__shared_detail_templates_v_rich_v_locales" DROP COLUMN "toc_anchors";
  ALTER TABLE "__shared_detail_templates_v_ahead_v_locales" DROP COLUMN "text_stamp";`)
}
