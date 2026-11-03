import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "shared_detail_templates_hot_hotspots" CASCADE;
  DROP TABLE "shared_detail_templates_hot_hotspots_locales" CASCADE;
  DROP TABLE "shared_detail_templates_hot" CASCADE;
  DROP TABLE "shared_detail_templates_hot_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_hot_v_hotspots" CASCADE;
  DROP TABLE "__shared_detail_templates_v_hot_v_hotspots_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_hot_v" CASCADE;
  DROP TABLE "__shared_detail_templates_v_hot_v_locales" CASCADE;
  DROP TYPE "public"."enum_shared_detail_templates_hot_hotspots_tone";
  DROP TYPE "public"."enum_shared_detail_templates_hot_heading_align";
  DROP TYPE "public"."enum___shared_detail_templates_v_hot_v_hotspots_tone";
  DROP TYPE "public"."enum___shared_detail_templates_v_hot_v_heading_align";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_shared_detail_templates_hot_hotspots_tone" AS ENUM('green', 'orange', 'navy');
  CREATE TYPE "public"."enum_shared_detail_templates_hot_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___shared_detail_templates_v_hot_v_hotspots_tone" AS ENUM('green', 'orange', 'navy');
  CREATE TYPE "public"."enum___shared_detail_templates_v_hot_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TABLE "shared_detail_templates_hot_hotspots" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tone" "enum_shared_detail_templates_hot_hotspots_tone" DEFAULT 'green',
  	"x" numeric,
  	"y" numeric
  );
  
  CREATE TABLE "shared_detail_templates_hot_hotspots_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_hot" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_detail_templates_hot_heading_align" DEFAULT 'left',
  	"image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_detail_templates_hot_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_hot_v_hotspots" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tone" "enum___shared_detail_templates_v_hot_v_hotspots_tone" DEFAULT 'green',
  	"x" numeric,
  	"y" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_hot_v_hotspots_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_hot_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_detail_templates_v_hot_v_heading_align" DEFAULT 'left',
  	"image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_hot_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "shared_detail_templates_hot_hotspots" ADD CONSTRAINT "shared_detail_templates_hot_hotspots_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_hot"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_hot_hotspots_locales" ADD CONSTRAINT "shared_detail_templates_hot_hotspots_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_hot_hotspots"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_hot" ADD CONSTRAINT "shared_detail_templates_hot_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_hot" ADD CONSTRAINT "shared_detail_templates_hot_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_hot_locales" ADD CONSTRAINT "shared_detail_templates_hot_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_hot"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_hot_v_hotspots" ADD CONSTRAINT "__shared_detail_templates_v_hot_v_hotspots_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_hot_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_hot_v_hotspots_locales" ADD CONSTRAINT "__shared_detail_templates_v_hot_v_hotspots_locales_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_hot_v_hotspots"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_hot_v" ADD CONSTRAINT "__shared_detail_templates_v_hot_v_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_hot_v" ADD CONSTRAINT "__shared_detail_templates_v_hot_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_hot_v_locales" ADD CONSTRAINT "__shared_detail_templates_v_hot_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_hot_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "shared_detail_templates_hot_hotspots_order_idx" ON "shared_detail_templates_hot_hotspots" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_hot_hotspots_parent_id_idx" ON "shared_detail_templates_hot_hotspots" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shared_detail_templates_hot_hotspots_locales_locale_parent_i" ON "shared_detail_templates_hot_hotspots_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_hot_order_idx" ON "shared_detail_templates_hot" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_hot_parent_id_idx" ON "shared_detail_templates_hot" USING btree ("_parent_id");
  CREATE INDEX "shared_detail_templates_hot_path_idx" ON "shared_detail_templates_hot" USING btree ("_path");
  CREATE INDEX "shared_detail_templates_hot_image_idx" ON "shared_detail_templates_hot" USING btree ("image_id");
  CREATE UNIQUE INDEX "shared_detail_templates_hot_locales_locale_parent_id_unique" ON "shared_detail_templates_hot_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_hot_v_hotspots_order_idx" ON "__shared_detail_templates_v_hot_v_hotspots" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_hot_v_hotspots_parent_id_idx" ON "__shared_detail_templates_v_hot_v_hotspots" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_hot_v_hotspots_locales_locale_pa" ON "__shared_detail_templates_v_hot_v_hotspots_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_hot_v_order_idx" ON "__shared_detail_templates_v_hot_v" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_hot_v_parent_id_idx" ON "__shared_detail_templates_v_hot_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_detail_templates_v_hot_v_path_idx" ON "__shared_detail_templates_v_hot_v" USING btree ("_path");
  CREATE INDEX "__shared_detail_templates_v_hot_v_image_idx" ON "__shared_detail_templates_v_hot_v" USING btree ("image_id");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_hot_v_locales_locale_parent_id_u" ON "__shared_detail_templates_v_hot_v_locales" USING btree ("_locale","_parent_id");`)
}
