import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."detail_templates_record_type" AS ENUM('job', 'post', 'category');
  CREATE TYPE "public"."enum_detail_templates_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__detail_templates_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__detail_templates_v_published_locale" AS ENUM('en', 'id');
  CREATE TYPE "public"."shared_detail_templates_record_type" AS ENUM('product', 'solution');
  CREATE TYPE "public"."enum_shared_detail_templates_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__shared_detail_templates_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__shared_detail_templates_v_published_locale" AS ENUM('en', 'id');
  CREATE TABLE "detail_templates" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"record_type" "detail_templates_record_type",
  	"updated_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_detail_templates_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_detail_templates_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_tenant_id" integer,
  	"version_record_type" "detail_templates_record_type",
  	"version_updated_by_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__detail_templates_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__detail_templates_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "shared_detail_templates" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"record_type" "shared_detail_templates_record_type",
  	"updated_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_shared_detail_templates_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_shared_detail_templates_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_record_type" "shared_detail_templates_record_type",
  	"version_updated_by_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__shared_detail_templates_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__shared_detail_templates_v_published_locale",
  	"latest" boolean
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "detail_templates_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "shared_detail_templates_id" integer;
  ALTER TABLE "detail_templates" ADD CONSTRAINT "detail_templates_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "detail_templates" ADD CONSTRAINT "detail_templates_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_detail_templates_v" ADD CONSTRAINT "_detail_templates_v_parent_id_detail_templates_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."detail_templates"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_detail_templates_v" ADD CONSTRAINT "_detail_templates_v_version_tenant_id_tenants_id_fk" FOREIGN KEY ("version_tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_detail_templates_v" ADD CONSTRAINT "_detail_templates_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_detail_templates" ADD CONSTRAINT "shared_detail_templates_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_shared_detail_templates_v" ADD CONSTRAINT "_shared_detail_templates_v_parent_id_shared_detail_templates_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."shared_detail_templates"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_shared_detail_templates_v" ADD CONSTRAINT "_shared_detail_templates_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "detail_templates_tenant_idx" ON "detail_templates" USING btree ("tenant_id");
  CREATE INDEX "detail_templates_updated_by_idx" ON "detail_templates" USING btree ("updated_by_id");
  CREATE INDEX "detail_templates_updated_at_idx" ON "detail_templates" USING btree ("updated_at");
  CREATE INDEX "detail_templates_created_at_idx" ON "detail_templates" USING btree ("created_at");
  CREATE INDEX "detail_templates__status_idx" ON "detail_templates" USING btree ("_status");
  CREATE UNIQUE INDEX "tenant_recordType_idx" ON "detail_templates" USING btree ("tenant_id","record_type");
  CREATE INDEX "_detail_templates_v_parent_idx" ON "_detail_templates_v" USING btree ("parent_id");
  CREATE INDEX "_detail_templates_v_version_version_tenant_idx" ON "_detail_templates_v" USING btree ("version_tenant_id");
  CREATE INDEX "_detail_templates_v_version_version_updated_by_idx" ON "_detail_templates_v" USING btree ("version_updated_by_id");
  CREATE INDEX "_detail_templates_v_version_version_updated_at_idx" ON "_detail_templates_v" USING btree ("version_updated_at");
  CREATE INDEX "_detail_templates_v_version_version_created_at_idx" ON "_detail_templates_v" USING btree ("version_created_at");
  CREATE INDEX "_detail_templates_v_version_version__status_idx" ON "_detail_templates_v" USING btree ("version__status");
  CREATE INDEX "_detail_templates_v_created_at_idx" ON "_detail_templates_v" USING btree ("created_at");
  CREATE INDEX "_detail_templates_v_updated_at_idx" ON "_detail_templates_v" USING btree ("updated_at");
  CREATE INDEX "_detail_templates_v_snapshot_idx" ON "_detail_templates_v" USING btree ("snapshot");
  CREATE INDEX "_detail_templates_v_published_locale_idx" ON "_detail_templates_v" USING btree ("published_locale");
  CREATE INDEX "_detail_templates_v_latest_idx" ON "_detail_templates_v" USING btree ("latest");
  CREATE INDEX "version_tenant_version_recordType_idx" ON "_detail_templates_v" USING btree ("version_tenant_id","version_record_type");
  CREATE UNIQUE INDEX "shared_detail_templates_record_type_idx" ON "shared_detail_templates" USING btree ("record_type");
  CREATE INDEX "shared_detail_templates_updated_by_idx" ON "shared_detail_templates" USING btree ("updated_by_id");
  CREATE INDEX "shared_detail_templates_updated_at_idx" ON "shared_detail_templates" USING btree ("updated_at");
  CREATE INDEX "shared_detail_templates_created_at_idx" ON "shared_detail_templates" USING btree ("created_at");
  CREATE INDEX "shared_detail_templates__status_idx" ON "shared_detail_templates" USING btree ("_status");
  CREATE INDEX "_shared_detail_templates_v_parent_idx" ON "_shared_detail_templates_v" USING btree ("parent_id");
  CREATE INDEX "_shared_detail_templates_v_version_version_record_type_idx" ON "_shared_detail_templates_v" USING btree ("version_record_type");
  CREATE INDEX "_shared_detail_templates_v_version_version_updated_by_idx" ON "_shared_detail_templates_v" USING btree ("version_updated_by_id");
  CREATE INDEX "_shared_detail_templates_v_version_version_updated_at_idx" ON "_shared_detail_templates_v" USING btree ("version_updated_at");
  CREATE INDEX "_shared_detail_templates_v_version_version_created_at_idx" ON "_shared_detail_templates_v" USING btree ("version_created_at");
  CREATE INDEX "_shared_detail_templates_v_version_version__status_idx" ON "_shared_detail_templates_v" USING btree ("version__status");
  CREATE INDEX "_shared_detail_templates_v_created_at_idx" ON "_shared_detail_templates_v" USING btree ("created_at");
  CREATE INDEX "_shared_detail_templates_v_updated_at_idx" ON "_shared_detail_templates_v" USING btree ("updated_at");
  CREATE INDEX "_shared_detail_templates_v_snapshot_idx" ON "_shared_detail_templates_v" USING btree ("snapshot");
  CREATE INDEX "_shared_detail_templates_v_published_locale_idx" ON "_shared_detail_templates_v" USING btree ("published_locale");
  CREATE INDEX "_shared_detail_templates_v_latest_idx" ON "_shared_detail_templates_v" USING btree ("latest");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_detail_templates_fk" FOREIGN KEY ("detail_templates_id") REFERENCES "public"."detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_shared_detail_templates_fk" FOREIGN KEY ("shared_detail_templates_id") REFERENCES "public"."shared_detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_detail_templates_id_idx" ON "payload_locked_documents_rels" USING btree ("detail_templates_id");
  CREATE INDEX "payload_locked_documents_rels_shared_detail_templates_id_idx" ON "payload_locked_documents_rels" USING btree ("shared_detail_templates_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "detail_templates" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_detail_templates_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "shared_detail_templates" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_shared_detail_templates_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "detail_templates" CASCADE;
  DROP TABLE "_detail_templates_v" CASCADE;
  DROP TABLE "shared_detail_templates" CASCADE;
  DROP TABLE "_shared_detail_templates_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_detail_templates_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_shared_detail_templates_fk";
  
  DROP INDEX "payload_locked_documents_rels_detail_templates_id_idx";
  DROP INDEX "payload_locked_documents_rels_shared_detail_templates_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "detail_templates_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "shared_detail_templates_id";
  DROP TYPE "public"."detail_templates_record_type";
  DROP TYPE "public"."enum_detail_templates_status";
  DROP TYPE "public"."enum__detail_templates_v_version_status";
  DROP TYPE "public"."enum__detail_templates_v_published_locale";
  DROP TYPE "public"."shared_detail_templates_record_type";
  DROP TYPE "public"."enum_shared_detail_templates_status";
  DROP TYPE "public"."enum__shared_detail_templates_v_version_status";
  DROP TYPE "public"."enum__shared_detail_templates_v_published_locale";`)
}
