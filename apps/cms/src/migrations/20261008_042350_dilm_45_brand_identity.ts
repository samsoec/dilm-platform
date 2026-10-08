import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DO $$
   BEGIN
     IF EXISTS (SELECT 1 FROM "tenant_settings_social_links" WHERE "platform"::text IN ('x', 'tiktok')) THEN
       RAISE EXCEPTION 'tenant-settings still has x or tiktok social links; remove them in the admin before migrating';
     END IF;
   END $$;
  ALTER TABLE "tenant_settings_social_links" ALTER COLUMN "platform" SET DATA TYPE text;
  DROP TYPE "public"."enum_tenant_settings_social_links_platform";
  CREATE TYPE "public"."enum_tenant_settings_social_links_platform" AS ENUM('linkedin', 'instagram', 'facebook', 'youtube');
  ALTER TABLE "tenant_settings_social_links" ALTER COLUMN "platform" SET DATA TYPE "public"."enum_tenant_settings_social_links_platform" USING "platform"::"public"."enum_tenant_settings_social_links_platform";
  ALTER TABLE "tenant_settings" ADD COLUMN "brand_logo_on_dark_id" integer;
  ALTER TABLE "tenant_settings" ADD COLUMN "brand_logo_on_light_id" integer;
  ALTER TABLE "tenant_settings" ADD COLUMN "brand_legal_name" varchar;
  ALTER TABLE "tenant_settings_locales" ADD COLUMN "brand_tagline" varchar;
  ALTER TABLE "tenant_settings_locales" ADD COLUMN "brand_address" varchar;
  ALTER TABLE "tenant_settings" ADD CONSTRAINT "tenant_settings_brand_logo_on_dark_id_media_id_fk" FOREIGN KEY ("brand_logo_on_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tenant_settings" ADD CONSTRAINT "tenant_settings_brand_logo_on_light_id_media_id_fk" FOREIGN KEY ("brand_logo_on_light_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "tenant_settings_brand_brand_logo_on_dark_idx" ON "tenant_settings" USING btree ("brand_logo_on_dark_id");
  CREATE INDEX "tenant_settings_brand_brand_logo_on_light_idx" ON "tenant_settings" USING btree ("brand_logo_on_light_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "tenant_settings" DROP CONSTRAINT "tenant_settings_brand_logo_on_dark_id_media_id_fk";
  
  ALTER TABLE "tenant_settings" DROP CONSTRAINT "tenant_settings_brand_logo_on_light_id_media_id_fk";
  
  ALTER TABLE "tenant_settings_social_links" ALTER COLUMN "platform" SET DATA TYPE text;
  DROP TYPE "public"."enum_tenant_settings_social_links_platform";
  CREATE TYPE "public"."enum_tenant_settings_social_links_platform" AS ENUM('facebook', 'instagram', 'linkedin', 'x', 'youtube', 'tiktok');
  ALTER TABLE "tenant_settings_social_links" ALTER COLUMN "platform" SET DATA TYPE "public"."enum_tenant_settings_social_links_platform" USING "platform"::"public"."enum_tenant_settings_social_links_platform";
  DROP INDEX "tenant_settings_brand_brand_logo_on_dark_idx";
  DROP INDEX "tenant_settings_brand_brand_logo_on_light_idx";
  ALTER TABLE "tenant_settings" DROP COLUMN "brand_logo_on_dark_id";
  ALTER TABLE "tenant_settings" DROP COLUMN "brand_logo_on_light_id";
  ALTER TABLE "tenant_settings" DROP COLUMN "brand_legal_name";
  ALTER TABLE "tenant_settings_locales" DROP COLUMN "brand_tagline";
  ALTER TABLE "tenant_settings_locales" DROP COLUMN "brand_address";`)
}
