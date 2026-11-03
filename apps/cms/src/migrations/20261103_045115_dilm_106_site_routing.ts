import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "site_routing" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"products_page_id" integer,
  	"solutions_page_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "tenant_settings" ADD COLUMN "routing_career_page_id" integer;
  ALTER TABLE "tenant_settings" ADD COLUMN "routing_publication_page_id" integer;
  ALTER TABLE "_tenant_settings_v" ADD COLUMN "version_routing_career_page_id" integer;
  ALTER TABLE "_tenant_settings_v" ADD COLUMN "version_routing_publication_page_id" integer;
  ALTER TABLE "site_routing" ADD CONSTRAINT "site_routing_products_page_id_shared_pages_id_fk" FOREIGN KEY ("products_page_id") REFERENCES "public"."shared_pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_routing" ADD CONSTRAINT "site_routing_solutions_page_id_shared_pages_id_fk" FOREIGN KEY ("solutions_page_id") REFERENCES "public"."shared_pages"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "site_routing_products_page_idx" ON "site_routing" USING btree ("products_page_id");
  CREATE INDEX "site_routing_solutions_page_idx" ON "site_routing" USING btree ("solutions_page_id");
  ALTER TABLE "tenant_settings" ADD CONSTRAINT "tenant_settings_routing_career_page_id_pages_id_fk" FOREIGN KEY ("routing_career_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tenant_settings" ADD CONSTRAINT "tenant_settings_routing_publication_page_id_pages_id_fk" FOREIGN KEY ("routing_publication_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tenant_settings_v" ADD CONSTRAINT "_tenant_settings_v_version_routing_career_page_id_pages_id_fk" FOREIGN KEY ("version_routing_career_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tenant_settings_v" ADD CONSTRAINT "_tenant_settings_v_version_routing_publication_page_id_pages_id_fk" FOREIGN KEY ("version_routing_publication_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "tenant_settings_routing_routing_career_page_idx" ON "tenant_settings" USING btree ("routing_career_page_id");
  CREATE INDEX "tenant_settings_routing_routing_publication_page_idx" ON "tenant_settings" USING btree ("routing_publication_page_id");
  CREATE INDEX "_tenant_settings_v_version_routing_version_routing_caree_idx" ON "_tenant_settings_v" USING btree ("version_routing_career_page_id");
  CREATE INDEX "_tenant_settings_v_version_routing_version_routing_publi_idx" ON "_tenant_settings_v" USING btree ("version_routing_publication_page_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_routing" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "site_routing" CASCADE;
  ALTER TABLE "tenant_settings" DROP CONSTRAINT "tenant_settings_routing_career_page_id_pages_id_fk";
  
  ALTER TABLE "tenant_settings" DROP CONSTRAINT "tenant_settings_routing_publication_page_id_pages_id_fk";
  
  ALTER TABLE "_tenant_settings_v" DROP CONSTRAINT "_tenant_settings_v_version_routing_career_page_id_pages_id_fk";
  
  ALTER TABLE "_tenant_settings_v" DROP CONSTRAINT "_tenant_settings_v_version_routing_publication_page_id_pages_id_fk";
  
  DROP INDEX "tenant_settings_routing_routing_career_page_idx";
  DROP INDEX "tenant_settings_routing_routing_publication_page_idx";
  DROP INDEX "_tenant_settings_v_version_routing_version_routing_caree_idx";
  DROP INDEX "_tenant_settings_v_version_routing_version_routing_publi_idx";
  ALTER TABLE "tenant_settings" DROP COLUMN "routing_career_page_id";
  ALTER TABLE "tenant_settings" DROP COLUMN "routing_publication_page_id";
  ALTER TABLE "_tenant_settings_v" DROP COLUMN "version_routing_career_page_id";
  ALTER TABLE "_tenant_settings_v" DROP COLUMN "version_routing_publication_page_id";`)
}
