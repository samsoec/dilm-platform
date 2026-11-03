import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."refresh_outcome" AS ENUM('ok', 'failed');
  CREATE TABLE "refresh_status" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"collection" varchar NOT NULL,
  	"doc_id" varchar NOT NULL,
  	"status" "refresh_outcome" NOT NULL,
  	"at" timestamp(3) with time zone NOT NULL,
  	"hosts" jsonb DEFAULT '[]'::jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "refresh_status_id" integer;
  CREATE INDEX "refresh_status_collection_idx" ON "refresh_status" USING btree ("collection");
  CREATE INDEX "refresh_status_updated_at_idx" ON "refresh_status" USING btree ("updated_at");
  CREATE INDEX "refresh_status_created_at_idx" ON "refresh_status" USING btree ("created_at");
  CREATE UNIQUE INDEX "collection_docId_idx" ON "refresh_status" USING btree ("collection","doc_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_refresh_status_fk" FOREIGN KEY ("refresh_status_id") REFERENCES "public"."refresh_status"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_refresh_status_id_idx" ON "payload_locked_documents_rels" USING btree ("refresh_status_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_refresh_status_fk";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_refresh_status_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "refresh_status_id";
  DROP TABLE IF EXISTS "refresh_status" CASCADE;
  DROP TYPE IF EXISTS "public"."refresh_outcome";`)
}
