import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_footer_cta_band_buttons_link_type" AS ENUM('reference', 'internal', 'external');
  CREATE TYPE "public"."enum_footer_cta_band_buttons_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum__footer_v_version_cta_band_buttons_link_type" AS ENUM('reference', 'internal', 'external');
  CREATE TYPE "public"."enum__footer_v_version_cta_band_buttons_style" AS ENUM('primary', 'light', 'text');
  CREATE TABLE "footer_cta_band_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_footer_cta_band_buttons_link_type" DEFAULT 'internal' NOT NULL,
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_footer_cta_band_buttons_style" DEFAULT 'primary' NOT NULL
  );
  
  CREATE TABLE "footer_cta_band_buttons_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_footer_v_version_cta_band_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__footer_v_version_cta_band_buttons_link_type" DEFAULT 'internal' NOT NULL,
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum__footer_v_version_cta_band_buttons_style" DEFAULT 'primary' NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_footer_v_version_cta_band_buttons_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "footer" ADD COLUMN "contact_show" boolean DEFAULT true;
  ALTER TABLE "footer_locales" ADD COLUMN "brand_description" varchar;
  ALTER TABLE "_footer_v" ADD COLUMN "version_contact_show" boolean DEFAULT true;
  ALTER TABLE "_footer_v_locales" ADD COLUMN "version_brand_description" varchar;
  ALTER TABLE "footer_cta_band_buttons" ADD CONSTRAINT "footer_cta_band_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_cta_band_buttons_locales" ADD CONSTRAINT "footer_cta_band_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_cta_band_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_version_cta_band_buttons" ADD CONSTRAINT "_footer_v_version_cta_band_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_version_cta_band_buttons_locales" ADD CONSTRAINT "_footer_v_version_cta_band_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_v_version_cta_band_buttons"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "footer_cta_band_buttons_order_idx" ON "footer_cta_band_buttons" USING btree ("_order");
  CREATE INDEX "footer_cta_band_buttons_parent_id_idx" ON "footer_cta_band_buttons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_cta_band_buttons_locales_locale_parent_id_unique" ON "footer_cta_band_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_footer_v_version_cta_band_buttons_order_idx" ON "_footer_v_version_cta_band_buttons" USING btree ("_order");
  CREATE INDEX "_footer_v_version_cta_band_buttons_parent_id_idx" ON "_footer_v_version_cta_band_buttons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_footer_v_version_cta_band_buttons_locales_locale_parent_id_" ON "_footer_v_version_cta_band_buttons_locales" USING btree ("_locale","_parent_id");
  INSERT INTO "footer_cta_band_buttons" ("_order", "_parent_id", "id", "link_type", "link_new_tab", "link_internal_path", "link_external_url", "style")
  SELECT 1, "id", 'primary-' || "id", "cta_band_primary_button_type"::text::"enum_footer_cta_band_buttons_link_type", "cta_band_primary_button_new_tab", "cta_band_primary_button_internal_path", "cta_band_primary_button_external_url", 'primary'
  FROM "footer" WHERE "cta_band_primary_button_internal_path" IS NOT NULL OR "cta_band_primary_button_external_url" IS NOT NULL OR EXISTS (SELECT 1 FROM "footer_rels" r WHERE r."parent_id" = "footer"."id" AND r."path" = 'ctaBand.primaryButton.reference');
  INSERT INTO "footer_cta_band_buttons" ("_order", "_parent_id", "id", "link_type", "link_new_tab", "link_internal_path", "link_external_url", "style")
  SELECT 2, f."id", 'secondary-' || f."id", f."cta_band_secondary_button_type"::text::"enum_footer_cta_band_buttons_link_type", f."cta_band_secondary_button_new_tab", f."cta_band_secondary_button_internal_path", f."cta_band_secondary_button_external_url", 'light'
  FROM "footer" f
  LEFT JOIN "footer_locales" l ON l."_parent_id" = f."id" AND l."cta_band_secondary_button_label" IS NOT NULL
  WHERE l."id" IS NOT NULL
  GROUP BY f."id";
  INSERT INTO "footer_cta_band_buttons_locales" ("link_label", "_locale", "_parent_id")
  SELECT l."cta_band_primary_button_label", l."_locale", 'primary-' || l."_parent_id"
  FROM "footer_locales" l WHERE EXISTS (SELECT 1 FROM "footer_cta_band_buttons" b WHERE b."id" = 'primary-' || l."_parent_id");
  INSERT INTO "footer_cta_band_buttons_locales" ("link_label", "_locale", "_parent_id")
  SELECT l."cta_band_secondary_button_label", l."_locale", 'secondary-' || l."_parent_id"
  FROM "footer_locales" l WHERE EXISTS (SELECT 1 FROM "footer_cta_band_buttons" b WHERE b."id" = 'secondary-' || l."_parent_id");
  INSERT INTO "footer_rels" ("order", "parent_id", "path", "pages_id", "shared_pages_id", "products_id", "solutions_id", "jobs_id", "posts_id", "categories_id")
  SELECT CASE WHEN "path" = 'ctaBand.primaryButton.reference' THEN 1 ELSE 2 END, "parent_id", 'ctaBand.buttons.link.reference', "pages_id", "shared_pages_id", "products_id", "solutions_id", "jobs_id", "posts_id", "categories_id"
  FROM "footer_rels" WHERE "path" IN ('ctaBand.primaryButton.reference', 'ctaBand.secondaryButton.reference');`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DELETE FROM "footer_rels" WHERE "path" = 'ctaBand.buttons.link.reference';
  DROP TABLE "footer_cta_band_buttons" CASCADE;
  DROP TABLE "footer_cta_band_buttons_locales" CASCADE;
  DROP TABLE "_footer_v_version_cta_band_buttons" CASCADE;
  DROP TABLE "_footer_v_version_cta_band_buttons_locales" CASCADE;
  ALTER TABLE "footer" DROP COLUMN "contact_show";
  ALTER TABLE "footer_locales" DROP COLUMN "brand_description";
  ALTER TABLE "_footer_v" DROP COLUMN "version_contact_show";
  ALTER TABLE "_footer_v_locales" DROP COLUMN "version_brand_description";
  DROP TYPE "public"."enum_footer_cta_band_buttons_link_type";
  DROP TYPE "public"."enum_footer_cta_band_buttons_style";
  DROP TYPE "public"."enum__footer_v_version_cta_band_buttons_link_type";
  DROP TYPE "public"."enum__footer_v_version_cta_band_buttons_style";`)
}
