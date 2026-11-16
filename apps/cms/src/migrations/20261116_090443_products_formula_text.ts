import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "products" ADD COLUMN "formula_text" varchar;
  ALTER TABLE "_products_v" ADD COLUMN "version_formula_text" varchar;
  CREATE INDEX "products_formula_text_idx" ON "products" USING btree ("formula_text");
  CREATE INDEX "_products_v_version_version_formula_text_idx" ON "_products_v" USING btree ("version_formula_text");
  UPDATE "products" SET "formula_text" = COALESCE((SELECT string_agg(t #>> '{}', '') FROM jsonb_path_query("formula", 'strict $.root.**.text') AS t), '') WHERE jsonb_typeof("formula" #> '{root}') = 'object';
  UPDATE "_products_v" SET "version_formula_text" = COALESCE((SELECT string_agg(t #>> '{}', '') FROM jsonb_path_query("version_formula", 'strict $.root.**.text') AS t), '') WHERE jsonb_typeof("version_formula" #> '{root}') = 'object';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "products_formula_text_idx";
  DROP INDEX "_products_v_version_version_formula_text_idx";
  ALTER TABLE "products" DROP COLUMN "formula_text";
  ALTER TABLE "_products_v" DROP COLUMN "version_formula_text";`)
}
