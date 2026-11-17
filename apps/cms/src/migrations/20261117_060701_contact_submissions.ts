import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_contact_submissions_locale" AS ENUM('en', 'id');
  CREATE TABLE "contact_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"submission_id" varchar NOT NULL,
  	"full_name" varchar NOT NULL,
  	"company" varchar NOT NULL,
  	"work_email" varchar NOT NULL,
  	"phone" varchar,
  	"message" varchar NOT NULL,
  	"locale" "enum_contact_submissions_locale" NOT NULL,
  	"submitted_at" timestamp(3) with time zone NOT NULL,
  	"team_notified_at" timestamp(3) with time zone,
  	"sender_notified_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "contact_submissions_id" integer;
  ALTER TABLE "contact_submissions" ADD CONSTRAINT "contact_submissions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "contact_submissions_tenant_idx" ON "contact_submissions" USING btree ("tenant_id");
  CREATE UNIQUE INDEX "contact_submissions_submission_id_idx" ON "contact_submissions" USING btree ("submission_id");
  CREATE INDEX "contact_submissions_updated_at_idx" ON "contact_submissions" USING btree ("updated_at");
  CREATE INDEX "contact_submissions_created_at_idx" ON "contact_submissions" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_submissions_fk" FOREIGN KEY ("contact_submissions_id") REFERENCES "public"."contact_submissions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_contact_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_submissions_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "contact_submissions" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "contact_submissions" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_contact_submissions_fk";
  
  DROP INDEX "payload_locked_documents_rels_contact_submissions_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "contact_submissions_id";
  DROP TYPE "public"."enum_contact_submissions_locale";`)
}
