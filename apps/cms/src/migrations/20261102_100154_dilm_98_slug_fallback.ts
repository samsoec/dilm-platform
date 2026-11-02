import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" ADD COLUMN "slug_fallback" boolean DEFAULT false;
  ALTER TABLE "_pages_v" ADD COLUMN "version_slug_fallback" boolean DEFAULT false;
  ALTER TABLE "shared_pages" ADD COLUMN "slug_fallback" boolean DEFAULT false;
  ALTER TABLE "_shared_pages_v" ADD COLUMN "version_slug_fallback" boolean DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" DROP COLUMN "slug_fallback";
  ALTER TABLE "_pages_v" DROP COLUMN "version_slug_fallback";
  ALTER TABLE "shared_pages" DROP COLUMN "slug_fallback";
  ALTER TABLE "_shared_pages_v" DROP COLUMN "version_slug_fallback";`)
}
