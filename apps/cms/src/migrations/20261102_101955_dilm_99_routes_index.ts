import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_routes_locale" AS ENUM('en', 'id');
  CREATE TABLE "routes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"locale" "enum_routes_locale" NOT NULL,
  	"path" varchar NOT NULL,
  	"refs" jsonb DEFAULT '[]'::jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "routes_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"shared_pages_id" integer
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "routes_id" integer;
  ALTER TABLE "routes" ADD CONSTRAINT "routes_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "routes_rels" ADD CONSTRAINT "routes_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."routes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "routes_rels" ADD CONSTRAINT "routes_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "routes_rels" ADD CONSTRAINT "routes_rels_shared_pages_fk" FOREIGN KEY ("shared_pages_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "routes_tenant_idx" ON "routes" USING btree ("tenant_id");
  CREATE INDEX "routes_path_idx" ON "routes" USING btree ("path");
  CREATE INDEX "routes_updated_at_idx" ON "routes" USING btree ("updated_at");
  CREATE INDEX "routes_created_at_idx" ON "routes" USING btree ("created_at");
  CREATE UNIQUE INDEX "tenant_locale_path_idx" ON "routes" USING btree ("tenant_id","locale","path") NULLS NOT DISTINCT;
  CREATE INDEX "routes_rels_order_idx" ON "routes_rels" USING btree ("order");
  CREATE INDEX "routes_rels_parent_idx" ON "routes_rels" USING btree ("parent_id");
  CREATE INDEX "routes_rels_path_idx" ON "routes_rels" USING btree ("path");
  CREATE INDEX "routes_rels_pages_id_idx" ON "routes_rels" USING btree ("pages_id");
  CREATE INDEX "routes_rels_shared_pages_id_idx" ON "routes_rels" USING btree ("shared_pages_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_routes_fk" FOREIGN KEY ("routes_id") REFERENCES "public"."routes"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_routes_id_idx" ON "payload_locked_documents_rels" USING btree ("routes_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "routes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "routes_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "routes" CASCADE;
  DROP TABLE "routes_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_routes_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_routes_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "routes_id";
  DROP TYPE IF EXISTS "public"."enum_routes_locale";`)
}
