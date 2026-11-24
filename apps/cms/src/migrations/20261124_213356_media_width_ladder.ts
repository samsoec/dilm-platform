import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" ADD COLUMN "sizes_w640_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_w640_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_w640_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_w640_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_w640_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_w640_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_w960_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_w960_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_w960_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_w960_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_w960_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_w960_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_w1280_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_w1280_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_w1280_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_w1280_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_w1280_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_w1280_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_w1920_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_w1920_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_w1920_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_w1920_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_w1920_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_w1920_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_w2560_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_w2560_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_w2560_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_w2560_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_w2560_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_w2560_filename" varchar;
  CREATE INDEX "media_sizes_w640_sizes_w640_filename_idx" ON "media" USING btree ("sizes_w640_filename");
  CREATE INDEX "media_sizes_w960_sizes_w960_filename_idx" ON "media" USING btree ("sizes_w960_filename");
  CREATE INDEX "media_sizes_w1280_sizes_w1280_filename_idx" ON "media" USING btree ("sizes_w1280_filename");
  CREATE INDEX "media_sizes_w1920_sizes_w1920_filename_idx" ON "media" USING btree ("sizes_w1920_filename");
  CREATE INDEX "media_sizes_w2560_sizes_w2560_filename_idx" ON "media" USING btree ("sizes_w2560_filename");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "media_sizes_w640_sizes_w640_filename_idx";
  DROP INDEX "media_sizes_w960_sizes_w960_filename_idx";
  DROP INDEX "media_sizes_w1280_sizes_w1280_filename_idx";
  DROP INDEX "media_sizes_w1920_sizes_w1920_filename_idx";
  DROP INDEX "media_sizes_w2560_sizes_w2560_filename_idx";
  ALTER TABLE "media" DROP COLUMN "sizes_w640_url";
  ALTER TABLE "media" DROP COLUMN "sizes_w640_width";
  ALTER TABLE "media" DROP COLUMN "sizes_w640_height";
  ALTER TABLE "media" DROP COLUMN "sizes_w640_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_w640_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_w640_filename";
  ALTER TABLE "media" DROP COLUMN "sizes_w960_url";
  ALTER TABLE "media" DROP COLUMN "sizes_w960_width";
  ALTER TABLE "media" DROP COLUMN "sizes_w960_height";
  ALTER TABLE "media" DROP COLUMN "sizes_w960_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_w960_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_w960_filename";
  ALTER TABLE "media" DROP COLUMN "sizes_w1280_url";
  ALTER TABLE "media" DROP COLUMN "sizes_w1280_width";
  ALTER TABLE "media" DROP COLUMN "sizes_w1280_height";
  ALTER TABLE "media" DROP COLUMN "sizes_w1280_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_w1280_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_w1280_filename";
  ALTER TABLE "media" DROP COLUMN "sizes_w1920_url";
  ALTER TABLE "media" DROP COLUMN "sizes_w1920_width";
  ALTER TABLE "media" DROP COLUMN "sizes_w1920_height";
  ALTER TABLE "media" DROP COLUMN "sizes_w1920_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_w1920_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_w1920_filename";
  ALTER TABLE "media" DROP COLUMN "sizes_w2560_url";
  ALTER TABLE "media" DROP COLUMN "sizes_w2560_width";
  ALTER TABLE "media" DROP COLUMN "sizes_w2560_height";
  ALTER TABLE "media" DROP COLUMN "sizes_w2560_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_w2560_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_w2560_filename";`)
}
