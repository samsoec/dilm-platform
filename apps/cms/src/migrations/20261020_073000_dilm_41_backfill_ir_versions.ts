import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  INSERT INTO "_ir_documents_v" (
    "parent_id", "version_tenant_id", "version_title", "version_document_type",
    "version_published_date", "version_first_published_at", "version_locale",
    "version_updated_by_id", "version_prefix", "version__objectkey",
    "version_updated_at", "version_created_at", "version_deleted_at",
    "version__status", "version_url", "version_thumbnail_u_r_l",
    "version_filename", "version_mime_type", "version_filesize",
    "version_width", "version_height", "version_focal_x", "version_focal_y",
    "created_at", "updated_at", "latest"
  )
  SELECT
    d."id", d."tenant_id", d."title", d."document_type"::text::"enum__ir_documents_v_version_document_type",
    d."published_date", d."first_published_at", d."locale"::text::"enum__ir_documents_v_version_locale",
    d."updated_by_id", d."prefix", d."_objectkey",
    d."updated_at", d."created_at", d."deleted_at",
    COALESCE(d."_status", 'published')::text::"enum__ir_documents_v_version_status", d."url", d."thumbnail_u_r_l",
    d."filename", d."mime_type", d."filesize",
    d."width", d."height", d."focal_x", d."focal_y",
    d."updated_at", d."updated_at", true
  FROM "ir_documents" d
  WHERE NOT EXISTS (
    SELECT 1 FROM "_ir_documents_v" v WHERE v."parent_id" = d."id"
  );`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`SELECT 1;`)
}
