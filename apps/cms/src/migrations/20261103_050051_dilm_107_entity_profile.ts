import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "tenant_settings_profile_regions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "tenant_settings_profile_regions_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_tenant_settings_v_version_profile_regions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tenant_settings_v_version_profile_regions_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "tenant_settings" ADD COLUMN "profile_cover_image_id" integer;
  ALTER TABLE "tenant_settings" ADD COLUMN "profile_map_pin_x" numeric;
  ALTER TABLE "tenant_settings" ADD COLUMN "profile_map_pin_y" numeric;
  ALTER TABLE "tenant_settings" ADD COLUMN "profile_map_location_latitude" numeric;
  ALTER TABLE "tenant_settings" ADD COLUMN "profile_map_location_longitude" numeric;
  ALTER TABLE "tenant_settings" ADD COLUMN "profile_google_maps_url" varchar;
  ALTER TABLE "tenant_settings_locales" ADD COLUMN "profile_hub_label" varchar;
  ALTER TABLE "tenant_settings_locales" ADD COLUMN "profile_short_description" varchar;
  ALTER TABLE "_tenant_settings_v" ADD COLUMN "version_profile_cover_image_id" integer;
  ALTER TABLE "_tenant_settings_v" ADD COLUMN "version_profile_map_pin_x" numeric;
  ALTER TABLE "_tenant_settings_v" ADD COLUMN "version_profile_map_pin_y" numeric;
  ALTER TABLE "_tenant_settings_v" ADD COLUMN "version_profile_map_location_latitude" numeric;
  ALTER TABLE "_tenant_settings_v" ADD COLUMN "version_profile_map_location_longitude" numeric;
  ALTER TABLE "_tenant_settings_v" ADD COLUMN "version_profile_google_maps_url" varchar;
  ALTER TABLE "_tenant_settings_v_locales" ADD COLUMN "version_profile_hub_label" varchar;
  ALTER TABLE "_tenant_settings_v_locales" ADD COLUMN "version_profile_short_description" varchar;
  ALTER TABLE "ir_documents" ADD COLUMN "cover_image_id" integer;
  ALTER TABLE "ir_documents" ADD COLUMN "summary" varchar;
  ALTER TABLE "_ir_documents_v" ADD COLUMN "version_cover_image_id" integer;
  ALTER TABLE "_ir_documents_v" ADD COLUMN "version_summary" varchar;
  ALTER TABLE "tenant_settings_profile_regions" ADD CONSTRAINT "tenant_settings_profile_regions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tenant_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tenant_settings_profile_regions_locales" ADD CONSTRAINT "tenant_settings_profile_regions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tenant_settings_profile_regions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tenant_settings_v_version_profile_regions" ADD CONSTRAINT "_tenant_settings_v_version_profile_regions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tenant_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tenant_settings_v_version_profile_regions_locales" ADD CONSTRAINT "_tenant_settings_v_version_profile_regions_locales_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tenant_settings_v_version_profile_regions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "tenant_settings_profile_regions_order_idx" ON "tenant_settings_profile_regions" USING btree ("_order");
  CREATE INDEX "tenant_settings_profile_regions_parent_id_idx" ON "tenant_settings_profile_regions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "tenant_settings_profile_regions_locales_locale_parent_id_uni" ON "tenant_settings_profile_regions_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_tenant_settings_v_version_profile_regions_order_idx" ON "_tenant_settings_v_version_profile_regions" USING btree ("_order");
  CREATE INDEX "_tenant_settings_v_version_profile_regions_parent_id_idx" ON "_tenant_settings_v_version_profile_regions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_tenant_settings_v_version_profile_regions_locales_locale_pa" ON "_tenant_settings_v_version_profile_regions_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "tenant_settings" ADD CONSTRAINT "tenant_settings_profile_cover_image_id_media_id_fk" FOREIGN KEY ("profile_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tenant_settings_v" ADD CONSTRAINT "_tenant_settings_v_version_profile_cover_image_id_media_id_fk" FOREIGN KEY ("version_profile_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ir_documents" ADD CONSTRAINT "ir_documents_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_ir_documents_v" ADD CONSTRAINT "_ir_documents_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "tenant_settings_profile_profile_cover_image_idx" ON "tenant_settings" USING btree ("profile_cover_image_id");
  CREATE INDEX "_tenant_settings_v_version_profile_version_profile_cover_idx" ON "_tenant_settings_v" USING btree ("version_profile_cover_image_id");
  CREATE INDEX "ir_documents_cover_image_idx" ON "ir_documents" USING btree ("cover_image_id");
  CREATE INDEX "_ir_documents_v_version_version_cover_image_idx" ON "_ir_documents_v" USING btree ("version_cover_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "tenant_settings_profile_regions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tenant_settings_profile_regions_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_tenant_settings_v_version_profile_regions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_tenant_settings_v_version_profile_regions_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "tenant_settings_profile_regions" CASCADE;
  DROP TABLE "tenant_settings_profile_regions_locales" CASCADE;
  DROP TABLE "_tenant_settings_v_version_profile_regions" CASCADE;
  DROP TABLE "_tenant_settings_v_version_profile_regions_locales" CASCADE;
  ALTER TABLE "tenant_settings" DROP CONSTRAINT "tenant_settings_profile_cover_image_id_media_id_fk";
  
  ALTER TABLE "_tenant_settings_v" DROP CONSTRAINT "_tenant_settings_v_version_profile_cover_image_id_media_id_fk";
  
  ALTER TABLE "ir_documents" DROP CONSTRAINT "ir_documents_cover_image_id_media_id_fk";
  
  ALTER TABLE "_ir_documents_v" DROP CONSTRAINT "_ir_documents_v_version_cover_image_id_media_id_fk";
  
  DROP INDEX "tenant_settings_profile_profile_cover_image_idx";
  DROP INDEX "_tenant_settings_v_version_profile_version_profile_cover_idx";
  DROP INDEX "ir_documents_cover_image_idx";
  DROP INDEX "_ir_documents_v_version_version_cover_image_idx";
  ALTER TABLE "tenant_settings" DROP COLUMN "profile_cover_image_id";
  ALTER TABLE "tenant_settings" DROP COLUMN "profile_map_pin_x";
  ALTER TABLE "tenant_settings" DROP COLUMN "profile_map_pin_y";
  ALTER TABLE "tenant_settings" DROP COLUMN "profile_map_location_latitude";
  ALTER TABLE "tenant_settings" DROP COLUMN "profile_map_location_longitude";
  ALTER TABLE "tenant_settings" DROP COLUMN "profile_google_maps_url";
  ALTER TABLE "tenant_settings_locales" DROP COLUMN "profile_hub_label";
  ALTER TABLE "tenant_settings_locales" DROP COLUMN "profile_short_description";
  ALTER TABLE "_tenant_settings_v" DROP COLUMN "version_profile_cover_image_id";
  ALTER TABLE "_tenant_settings_v" DROP COLUMN "version_profile_map_pin_x";
  ALTER TABLE "_tenant_settings_v" DROP COLUMN "version_profile_map_pin_y";
  ALTER TABLE "_tenant_settings_v" DROP COLUMN "version_profile_map_location_latitude";
  ALTER TABLE "_tenant_settings_v" DROP COLUMN "version_profile_map_location_longitude";
  ALTER TABLE "_tenant_settings_v" DROP COLUMN "version_profile_google_maps_url";
  ALTER TABLE "_tenant_settings_v_locales" DROP COLUMN "version_profile_hub_label";
  ALTER TABLE "_tenant_settings_v_locales" DROP COLUMN "version_profile_short_description";
  ALTER TABLE "ir_documents" DROP COLUMN "cover_image_id";
  ALTER TABLE "ir_documents" DROP COLUMN "summary";
  ALTER TABLE "_ir_documents_v" DROP COLUMN "version_cover_image_id";
  ALTER TABLE "_ir_documents_v" DROP COLUMN "version_summary";`)
}
