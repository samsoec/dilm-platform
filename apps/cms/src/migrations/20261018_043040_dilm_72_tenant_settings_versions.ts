import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum__tenant_settings_v_version_social_links_platform" AS ENUM('linkedin', 'instagram', 'facebook', 'youtube');
  CREATE TABLE "_tenant_settings_v_version_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"platform" "enum__tenant_settings_v_version_social_links_platform" NOT NULL,
  	"url" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tenant_settings_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_tenant_id" integer,
  	"version_brand_logo_on_dark_id" integer,
  	"version_brand_logo_on_light_id" integer,
  	"version_brand_legal_name" varchar,
  	"version_contact_email" varchar,
  	"version_contact_phone" varchar,
  	"version_wa_link" varchar,
  	"version_recruiter_email" varchar,
  	"version_default_seo_og_image_id" integer,
  	"version_analytics_id" varchar,
  	"version_updated_by_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_tenant_settings_v_locales" (
  	"version_site_name" varchar NOT NULL,
  	"version_brand_tagline" varchar,
  	"version_brand_address" varchar,
  	"version_default_seo_title" varchar,
  	"version_default_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "_tenant_settings_v_version_social_links" ADD CONSTRAINT "_tenant_settings_v_version_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tenant_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tenant_settings_v" ADD CONSTRAINT "_tenant_settings_v_parent_id_tenant_settings_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tenant_settings"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tenant_settings_v" ADD CONSTRAINT "_tenant_settings_v_version_tenant_id_tenants_id_fk" FOREIGN KEY ("version_tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tenant_settings_v" ADD CONSTRAINT "_tenant_settings_v_version_brand_logo_on_dark_id_media_id_fk" FOREIGN KEY ("version_brand_logo_on_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tenant_settings_v" ADD CONSTRAINT "_tenant_settings_v_version_brand_logo_on_light_id_media_id_fk" FOREIGN KEY ("version_brand_logo_on_light_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tenant_settings_v" ADD CONSTRAINT "_tenant_settings_v_version_default_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_default_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tenant_settings_v" ADD CONSTRAINT "_tenant_settings_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tenant_settings_v_locales" ADD CONSTRAINT "_tenant_settings_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tenant_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "_tenant_settings_v_version_social_links_order_idx" ON "_tenant_settings_v_version_social_links" USING btree ("_order");
  CREATE INDEX "_tenant_settings_v_version_social_links_parent_id_idx" ON "_tenant_settings_v_version_social_links" USING btree ("_parent_id");
  CREATE INDEX "_tenant_settings_v_parent_idx" ON "_tenant_settings_v" USING btree ("parent_id");
  CREATE INDEX "_tenant_settings_v_version_version_tenant_idx" ON "_tenant_settings_v" USING btree ("version_tenant_id");
  CREATE INDEX "_tenant_settings_v_version_brand_version_brand_logo_on_d_idx" ON "_tenant_settings_v" USING btree ("version_brand_logo_on_dark_id");
  CREATE INDEX "_tenant_settings_v_version_brand_version_brand_logo_on_l_idx" ON "_tenant_settings_v" USING btree ("version_brand_logo_on_light_id");
  CREATE INDEX "_tenant_settings_v_version_default_seo_version_default_s_idx" ON "_tenant_settings_v" USING btree ("version_default_seo_og_image_id");
  CREATE INDEX "_tenant_settings_v_version_version_updated_by_idx" ON "_tenant_settings_v" USING btree ("version_updated_by_id");
  CREATE INDEX "_tenant_settings_v_version_version_updated_at_idx" ON "_tenant_settings_v" USING btree ("version_updated_at");
  CREATE INDEX "_tenant_settings_v_version_version_created_at_idx" ON "_tenant_settings_v" USING btree ("version_created_at");
  CREATE INDEX "_tenant_settings_v_created_at_idx" ON "_tenant_settings_v" USING btree ("created_at");
  CREATE INDEX "_tenant_settings_v_updated_at_idx" ON "_tenant_settings_v" USING btree ("updated_at");
  CREATE UNIQUE INDEX "_tenant_settings_v_locales_locale_parent_id_unique" ON "_tenant_settings_v_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "_tenant_settings_v_version_social_links" CASCADE;
  DROP TABLE "_tenant_settings_v" CASCADE;
  DROP TABLE "_tenant_settings_v_locales" CASCADE;
  DROP TYPE "public"."enum__tenant_settings_v_version_social_links_platform";`)
}
