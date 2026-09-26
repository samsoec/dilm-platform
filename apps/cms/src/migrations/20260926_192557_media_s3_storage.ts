import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" ADD COLUMN "prefix" varchar DEFAULT 'media';
  ALTER TABLE "media" ADD COLUMN "_objectkey" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_social_share_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_social_share_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_social_share_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_social_share_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_social_share_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_social_share_filename" varchar;
  CREATE INDEX "media_sizes_social_share_sizes_social_share_filename_idx" ON "media" USING btree ("sizes_social_share_filename");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "media_sizes_social_share_sizes_social_share_filename_idx";
  ALTER TABLE "media" DROP COLUMN "prefix";
  ALTER TABLE "media" DROP COLUMN "_objectkey";
  ALTER TABLE "media" DROP COLUMN "sizes_social_share_url";
  ALTER TABLE "media" DROP COLUMN "sizes_social_share_width";
  ALTER TABLE "media" DROP COLUMN "sizes_social_share_height";
  ALTER TABLE "media" DROP COLUMN "sizes_social_share_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_social_share_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_social_share_filename";`)
}
