import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_header_nav_items_children_link_type" ADD VALUE 'reference';
  ALTER TYPE "public"."enum_header_nav_items_link_type" ADD VALUE 'reference';
  ALTER TYPE "public"."enum_header_cta_link_type" ADD VALUE 'reference';
  ALTER TYPE "public"."enum__header_v_version_nav_items_children_link_type" ADD VALUE 'reference';
  ALTER TYPE "public"."enum__header_v_version_nav_items_link_type" ADD VALUE 'reference';
  ALTER TYPE "public"."enum__header_v_version_cta_link_type" ADD VALUE 'reference';
  ALTER TYPE "public"."enum_footer_link_columns_links_link_type" ADD VALUE 'reference';
  ALTER TYPE "public"."enum_footer_cta_band_primary_button_type" ADD VALUE 'reference';
  ALTER TYPE "public"."enum_footer_cta_band_secondary_button_type" ADD VALUE 'reference';
  ALTER TYPE "public"."enum_footer_part_of_link_type" ADD VALUE 'reference';
  ALTER TYPE "public"."enum__footer_v_version_link_columns_links_link_type" ADD VALUE 'reference';
  ALTER TYPE "public"."enum__footer_v_version_cta_band_primary_button_type" ADD VALUE 'reference';
  ALTER TYPE "public"."enum__footer_v_version_cta_band_secondary_button_type" ADD VALUE 'reference';
  ALTER TYPE "public"."enum__footer_v_version_part_of_link_type" ADD VALUE 'reference';
  ALTER TYPE "public"."enum_pages_redirect_to_type" ADD VALUE 'reference';
  ALTER TYPE "public"."enum__pages_v_version_redirect_to_type" ADD VALUE 'reference';
  ALTER TYPE "public"."enum_shared_pages_redirect_to_type" ADD VALUE 'reference';
  ALTER TYPE "public"."enum__shared_pages_v_version_redirect_to_type" ADD VALUE 'reference';
  ALTER TYPE "public"."enum_redirects_to_type" ADD VALUE 'reference';
  CREATE TABLE "header_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"shared_pages_id" integer,
  	"products_id" integer,
  	"solutions_id" integer,
  	"jobs_id" integer,
  	"posts_id" integer,
  	"categories_id" integer
  );
  
  CREATE TABLE "_header_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"shared_pages_id" integer,
  	"products_id" integer,
  	"solutions_id" integer,
  	"jobs_id" integer,
  	"posts_id" integer,
  	"categories_id" integer
  );
  
  CREATE TABLE "footer_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"shared_pages_id" integer,
  	"products_id" integer,
  	"solutions_id" integer,
  	"jobs_id" integer,
  	"posts_id" integer,
  	"categories_id" integer
  );
  
  CREATE TABLE "_footer_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"shared_pages_id" integer,
  	"products_id" integer,
  	"solutions_id" integer,
  	"jobs_id" integer,
  	"posts_id" integer,
  	"categories_id" integer
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"shared_pages_id" integer,
  	"products_id" integer,
  	"solutions_id" integer,
  	"jobs_id" integer,
  	"posts_id" integer,
  	"categories_id" integer
  );
  
  CREATE TABLE "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"shared_pages_id" integer,
  	"products_id" integer,
  	"solutions_id" integer,
  	"jobs_id" integer,
  	"posts_id" integer,
  	"categories_id" integer
  );
  
  CREATE TABLE "shared_pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"shared_pages_id" integer,
  	"products_id" integer,
  	"solutions_id" integer,
  	"jobs_id" integer,
  	"posts_id" integer,
  	"categories_id" integer
  );
  
  CREATE TABLE "_shared_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"shared_pages_id" integer,
  	"products_id" integer,
  	"solutions_id" integer,
  	"jobs_id" integer,
  	"posts_id" integer,
  	"categories_id" integer
  );
  
  CREATE TABLE "redirects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"shared_pages_id" integer,
  	"products_id" integer,
  	"solutions_id" integer,
  	"jobs_id" integer,
  	"posts_id" integer,
  	"categories_id" integer
  );
  
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_shared_pages_fk" FOREIGN KEY ("shared_pages_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_solutions_fk" FOREIGN KEY ("solutions_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_jobs_fk" FOREIGN KEY ("jobs_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_header_v_rels" ADD CONSTRAINT "_header_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_header_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_header_v_rels" ADD CONSTRAINT "_header_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_header_v_rels" ADD CONSTRAINT "_header_v_rels_shared_pages_fk" FOREIGN KEY ("shared_pages_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_header_v_rels" ADD CONSTRAINT "_header_v_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_header_v_rels" ADD CONSTRAINT "_header_v_rels_solutions_fk" FOREIGN KEY ("solutions_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_header_v_rels" ADD CONSTRAINT "_header_v_rels_jobs_fk" FOREIGN KEY ("jobs_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_header_v_rels" ADD CONSTRAINT "_header_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_header_v_rels" ADD CONSTRAINT "_header_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_shared_pages_fk" FOREIGN KEY ("shared_pages_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_solutions_fk" FOREIGN KEY ("solutions_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_jobs_fk" FOREIGN KEY ("jobs_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_rels" ADD CONSTRAINT "_footer_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_rels" ADD CONSTRAINT "_footer_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_rels" ADD CONSTRAINT "_footer_v_rels_shared_pages_fk" FOREIGN KEY ("shared_pages_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_rels" ADD CONSTRAINT "_footer_v_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_rels" ADD CONSTRAINT "_footer_v_rels_solutions_fk" FOREIGN KEY ("solutions_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_rels" ADD CONSTRAINT "_footer_v_rels_jobs_fk" FOREIGN KEY ("jobs_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_rels" ADD CONSTRAINT "_footer_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_rels" ADD CONSTRAINT "_footer_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_shared_pages_fk" FOREIGN KEY ("shared_pages_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_solutions_fk" FOREIGN KEY ("solutions_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_jobs_fk" FOREIGN KEY ("jobs_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_shared_pages_fk" FOREIGN KEY ("shared_pages_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_solutions_fk" FOREIGN KEY ("solutions_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_jobs_fk" FOREIGN KEY ("jobs_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_rels" ADD CONSTRAINT "shared_pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_rels" ADD CONSTRAINT "shared_pages_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_rels" ADD CONSTRAINT "shared_pages_rels_shared_pages_fk" FOREIGN KEY ("shared_pages_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_rels" ADD CONSTRAINT "shared_pages_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_rels" ADD CONSTRAINT "shared_pages_rels_solutions_fk" FOREIGN KEY ("solutions_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_rels" ADD CONSTRAINT "shared_pages_rels_jobs_fk" FOREIGN KEY ("jobs_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_rels" ADD CONSTRAINT "shared_pages_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_rels" ADD CONSTRAINT "shared_pages_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_shared_pages_v_rels" ADD CONSTRAINT "_shared_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_shared_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_shared_pages_v_rels" ADD CONSTRAINT "_shared_pages_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_shared_pages_v_rels" ADD CONSTRAINT "_shared_pages_v_rels_shared_pages_fk" FOREIGN KEY ("shared_pages_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_shared_pages_v_rels" ADD CONSTRAINT "_shared_pages_v_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_shared_pages_v_rels" ADD CONSTRAINT "_shared_pages_v_rels_solutions_fk" FOREIGN KEY ("solutions_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_shared_pages_v_rels" ADD CONSTRAINT "_shared_pages_v_rels_jobs_fk" FOREIGN KEY ("jobs_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_shared_pages_v_rels" ADD CONSTRAINT "_shared_pages_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_shared_pages_v_rels" ADD CONSTRAINT "_shared_pages_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_shared_pages_fk" FOREIGN KEY ("shared_pages_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_solutions_fk" FOREIGN KEY ("solutions_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_jobs_fk" FOREIGN KEY ("jobs_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "header_rels_order_idx" ON "header_rels" USING btree ("order");
  CREATE INDEX "header_rels_parent_idx" ON "header_rels" USING btree ("parent_id");
  CREATE INDEX "header_rels_path_idx" ON "header_rels" USING btree ("path");
  CREATE INDEX "header_rels_pages_id_idx" ON "header_rels" USING btree ("pages_id");
  CREATE INDEX "header_rels_shared_pages_id_idx" ON "header_rels" USING btree ("shared_pages_id");
  CREATE INDEX "header_rels_products_id_idx" ON "header_rels" USING btree ("products_id");
  CREATE INDEX "header_rels_solutions_id_idx" ON "header_rels" USING btree ("solutions_id");
  CREATE INDEX "header_rels_jobs_id_idx" ON "header_rels" USING btree ("jobs_id");
  CREATE INDEX "header_rels_posts_id_idx" ON "header_rels" USING btree ("posts_id");
  CREATE INDEX "header_rels_categories_id_idx" ON "header_rels" USING btree ("categories_id");
  CREATE INDEX "_header_v_rels_order_idx" ON "_header_v_rels" USING btree ("order");
  CREATE INDEX "_header_v_rels_parent_idx" ON "_header_v_rels" USING btree ("parent_id");
  CREATE INDEX "_header_v_rels_path_idx" ON "_header_v_rels" USING btree ("path");
  CREATE INDEX "_header_v_rels_pages_id_idx" ON "_header_v_rels" USING btree ("pages_id");
  CREATE INDEX "_header_v_rels_shared_pages_id_idx" ON "_header_v_rels" USING btree ("shared_pages_id");
  CREATE INDEX "_header_v_rels_products_id_idx" ON "_header_v_rels" USING btree ("products_id");
  CREATE INDEX "_header_v_rels_solutions_id_idx" ON "_header_v_rels" USING btree ("solutions_id");
  CREATE INDEX "_header_v_rels_jobs_id_idx" ON "_header_v_rels" USING btree ("jobs_id");
  CREATE INDEX "_header_v_rels_posts_id_idx" ON "_header_v_rels" USING btree ("posts_id");
  CREATE INDEX "_header_v_rels_categories_id_idx" ON "_header_v_rels" USING btree ("categories_id");
  CREATE INDEX "footer_rels_order_idx" ON "footer_rels" USING btree ("order");
  CREATE INDEX "footer_rels_parent_idx" ON "footer_rels" USING btree ("parent_id");
  CREATE INDEX "footer_rels_path_idx" ON "footer_rels" USING btree ("path");
  CREATE INDEX "footer_rels_pages_id_idx" ON "footer_rels" USING btree ("pages_id");
  CREATE INDEX "footer_rels_shared_pages_id_idx" ON "footer_rels" USING btree ("shared_pages_id");
  CREATE INDEX "footer_rels_products_id_idx" ON "footer_rels" USING btree ("products_id");
  CREATE INDEX "footer_rels_solutions_id_idx" ON "footer_rels" USING btree ("solutions_id");
  CREATE INDEX "footer_rels_jobs_id_idx" ON "footer_rels" USING btree ("jobs_id");
  CREATE INDEX "footer_rels_posts_id_idx" ON "footer_rels" USING btree ("posts_id");
  CREATE INDEX "footer_rels_categories_id_idx" ON "footer_rels" USING btree ("categories_id");
  CREATE INDEX "_footer_v_rels_order_idx" ON "_footer_v_rels" USING btree ("order");
  CREATE INDEX "_footer_v_rels_parent_idx" ON "_footer_v_rels" USING btree ("parent_id");
  CREATE INDEX "_footer_v_rels_path_idx" ON "_footer_v_rels" USING btree ("path");
  CREATE INDEX "_footer_v_rels_pages_id_idx" ON "_footer_v_rels" USING btree ("pages_id");
  CREATE INDEX "_footer_v_rels_shared_pages_id_idx" ON "_footer_v_rels" USING btree ("shared_pages_id");
  CREATE INDEX "_footer_v_rels_products_id_idx" ON "_footer_v_rels" USING btree ("products_id");
  CREATE INDEX "_footer_v_rels_solutions_id_idx" ON "_footer_v_rels" USING btree ("solutions_id");
  CREATE INDEX "_footer_v_rels_jobs_id_idx" ON "_footer_v_rels" USING btree ("jobs_id");
  CREATE INDEX "_footer_v_rels_posts_id_idx" ON "_footer_v_rels" USING btree ("posts_id");
  CREATE INDEX "_footer_v_rels_categories_id_idx" ON "_footer_v_rels" USING btree ("categories_id");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_pages_id_idx" ON "pages_rels" USING btree ("pages_id");
  CREATE INDEX "pages_rels_shared_pages_id_idx" ON "pages_rels" USING btree ("shared_pages_id");
  CREATE INDEX "pages_rels_products_id_idx" ON "pages_rels" USING btree ("products_id");
  CREATE INDEX "pages_rels_solutions_id_idx" ON "pages_rels" USING btree ("solutions_id");
  CREATE INDEX "pages_rels_jobs_id_idx" ON "pages_rels" USING btree ("jobs_id");
  CREATE INDEX "pages_rels_posts_id_idx" ON "pages_rels" USING btree ("posts_id");
  CREATE INDEX "pages_rels_categories_id_idx" ON "pages_rels" USING btree ("categories_id");
  CREATE INDEX "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_pages_id_idx" ON "_pages_v_rels" USING btree ("pages_id");
  CREATE INDEX "_pages_v_rels_shared_pages_id_idx" ON "_pages_v_rels" USING btree ("shared_pages_id");
  CREATE INDEX "_pages_v_rels_products_id_idx" ON "_pages_v_rels" USING btree ("products_id");
  CREATE INDEX "_pages_v_rels_solutions_id_idx" ON "_pages_v_rels" USING btree ("solutions_id");
  CREATE INDEX "_pages_v_rels_jobs_id_idx" ON "_pages_v_rels" USING btree ("jobs_id");
  CREATE INDEX "_pages_v_rels_posts_id_idx" ON "_pages_v_rels" USING btree ("posts_id");
  CREATE INDEX "_pages_v_rels_categories_id_idx" ON "_pages_v_rels" USING btree ("categories_id");
  CREATE INDEX "shared_pages_rels_order_idx" ON "shared_pages_rels" USING btree ("order");
  CREATE INDEX "shared_pages_rels_parent_idx" ON "shared_pages_rels" USING btree ("parent_id");
  CREATE INDEX "shared_pages_rels_path_idx" ON "shared_pages_rels" USING btree ("path");
  CREATE INDEX "shared_pages_rels_pages_id_idx" ON "shared_pages_rels" USING btree ("pages_id");
  CREATE INDEX "shared_pages_rels_shared_pages_id_idx" ON "shared_pages_rels" USING btree ("shared_pages_id");
  CREATE INDEX "shared_pages_rels_products_id_idx" ON "shared_pages_rels" USING btree ("products_id");
  CREATE INDEX "shared_pages_rels_solutions_id_idx" ON "shared_pages_rels" USING btree ("solutions_id");
  CREATE INDEX "shared_pages_rels_jobs_id_idx" ON "shared_pages_rels" USING btree ("jobs_id");
  CREATE INDEX "shared_pages_rels_posts_id_idx" ON "shared_pages_rels" USING btree ("posts_id");
  CREATE INDEX "shared_pages_rels_categories_id_idx" ON "shared_pages_rels" USING btree ("categories_id");
  CREATE INDEX "_shared_pages_v_rels_order_idx" ON "_shared_pages_v_rels" USING btree ("order");
  CREATE INDEX "_shared_pages_v_rels_parent_idx" ON "_shared_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_shared_pages_v_rels_path_idx" ON "_shared_pages_v_rels" USING btree ("path");
  CREATE INDEX "_shared_pages_v_rels_pages_id_idx" ON "_shared_pages_v_rels" USING btree ("pages_id");
  CREATE INDEX "_shared_pages_v_rels_shared_pages_id_idx" ON "_shared_pages_v_rels" USING btree ("shared_pages_id");
  CREATE INDEX "_shared_pages_v_rels_products_id_idx" ON "_shared_pages_v_rels" USING btree ("products_id");
  CREATE INDEX "_shared_pages_v_rels_solutions_id_idx" ON "_shared_pages_v_rels" USING btree ("solutions_id");
  CREATE INDEX "_shared_pages_v_rels_jobs_id_idx" ON "_shared_pages_v_rels" USING btree ("jobs_id");
  CREATE INDEX "_shared_pages_v_rels_posts_id_idx" ON "_shared_pages_v_rels" USING btree ("posts_id");
  CREATE INDEX "_shared_pages_v_rels_categories_id_idx" ON "_shared_pages_v_rels" USING btree ("categories_id");
  CREATE INDEX "redirects_rels_order_idx" ON "redirects_rels" USING btree ("order");
  CREATE INDEX "redirects_rels_parent_idx" ON "redirects_rels" USING btree ("parent_id");
  CREATE INDEX "redirects_rels_path_idx" ON "redirects_rels" USING btree ("path");
  CREATE INDEX "redirects_rels_pages_id_idx" ON "redirects_rels" USING btree ("pages_id");
  CREATE INDEX "redirects_rels_shared_pages_id_idx" ON "redirects_rels" USING btree ("shared_pages_id");
  CREATE INDEX "redirects_rels_products_id_idx" ON "redirects_rels" USING btree ("products_id");
  CREATE INDEX "redirects_rels_solutions_id_idx" ON "redirects_rels" USING btree ("solutions_id");
  CREATE INDEX "redirects_rels_jobs_id_idx" ON "redirects_rels" USING btree ("jobs_id");
  CREATE INDEX "redirects_rels_posts_id_idx" ON "redirects_rels" USING btree ("posts_id");
  CREATE INDEX "redirects_rels_categories_id_idx" ON "redirects_rels" USING btree ("categories_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "header_rels" CASCADE;
  DROP TABLE "_header_v_rels" CASCADE;
  DROP TABLE "footer_rels" CASCADE;
  DROP TABLE "_footer_v_rels" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  DROP TABLE "shared_pages_rels" CASCADE;
  DROP TABLE "_shared_pages_v_rels" CASCADE;
  DROP TABLE "redirects_rels" CASCADE;
  ALTER TABLE "header_nav_items_children" ALTER COLUMN "link_type" SET DATA TYPE text;
  ALTER TABLE "header_nav_items_children" ALTER COLUMN "link_type" SET DEFAULT 'internal'::text;
  DROP TYPE "public"."enum_header_nav_items_children_link_type";
  CREATE TYPE "public"."enum_header_nav_items_children_link_type" AS ENUM('internal', 'external');
  ALTER TABLE "header_nav_items_children" ALTER COLUMN "link_type" SET DEFAULT 'internal'::"public"."enum_header_nav_items_children_link_type";
  ALTER TABLE "header_nav_items_children" ALTER COLUMN "link_type" SET DATA TYPE "public"."enum_header_nav_items_children_link_type" USING "link_type"::"public"."enum_header_nav_items_children_link_type";
  ALTER TABLE "header_nav_items" ALTER COLUMN "link_type" SET DATA TYPE text;
  ALTER TABLE "header_nav_items" ALTER COLUMN "link_type" SET DEFAULT 'internal'::text;
  DROP TYPE "public"."enum_header_nav_items_link_type";
  CREATE TYPE "public"."enum_header_nav_items_link_type" AS ENUM('internal', 'external');
  ALTER TABLE "header_nav_items" ALTER COLUMN "link_type" SET DEFAULT 'internal'::"public"."enum_header_nav_items_link_type";
  ALTER TABLE "header_nav_items" ALTER COLUMN "link_type" SET DATA TYPE "public"."enum_header_nav_items_link_type" USING "link_type"::"public"."enum_header_nav_items_link_type";
  ALTER TABLE "header" ALTER COLUMN "cta_link_type" SET DATA TYPE text;
  ALTER TABLE "header" ALTER COLUMN "cta_link_type" SET DEFAULT 'internal'::text;
  DROP TYPE "public"."enum_header_cta_link_type";
  CREATE TYPE "public"."enum_header_cta_link_type" AS ENUM('internal', 'external');
  ALTER TABLE "header" ALTER COLUMN "cta_link_type" SET DEFAULT 'internal'::"public"."enum_header_cta_link_type";
  ALTER TABLE "header" ALTER COLUMN "cta_link_type" SET DATA TYPE "public"."enum_header_cta_link_type" USING "cta_link_type"::"public"."enum_header_cta_link_type";
  ALTER TABLE "_header_v_version_nav_items_children" ALTER COLUMN "link_type" SET DATA TYPE text;
  ALTER TABLE "_header_v_version_nav_items_children" ALTER COLUMN "link_type" SET DEFAULT 'internal'::text;
  DROP TYPE "public"."enum__header_v_version_nav_items_children_link_type";
  CREATE TYPE "public"."enum__header_v_version_nav_items_children_link_type" AS ENUM('internal', 'external');
  ALTER TABLE "_header_v_version_nav_items_children" ALTER COLUMN "link_type" SET DEFAULT 'internal'::"public"."enum__header_v_version_nav_items_children_link_type";
  ALTER TABLE "_header_v_version_nav_items_children" ALTER COLUMN "link_type" SET DATA TYPE "public"."enum__header_v_version_nav_items_children_link_type" USING "link_type"::"public"."enum__header_v_version_nav_items_children_link_type";
  ALTER TABLE "_header_v_version_nav_items" ALTER COLUMN "link_type" SET DATA TYPE text;
  ALTER TABLE "_header_v_version_nav_items" ALTER COLUMN "link_type" SET DEFAULT 'internal'::text;
  DROP TYPE "public"."enum__header_v_version_nav_items_link_type";
  CREATE TYPE "public"."enum__header_v_version_nav_items_link_type" AS ENUM('internal', 'external');
  ALTER TABLE "_header_v_version_nav_items" ALTER COLUMN "link_type" SET DEFAULT 'internal'::"public"."enum__header_v_version_nav_items_link_type";
  ALTER TABLE "_header_v_version_nav_items" ALTER COLUMN "link_type" SET DATA TYPE "public"."enum__header_v_version_nav_items_link_type" USING "link_type"::"public"."enum__header_v_version_nav_items_link_type";
  ALTER TABLE "_header_v" ALTER COLUMN "version_cta_link_type" SET DATA TYPE text;
  ALTER TABLE "_header_v" ALTER COLUMN "version_cta_link_type" SET DEFAULT 'internal'::text;
  DROP TYPE "public"."enum__header_v_version_cta_link_type";
  CREATE TYPE "public"."enum__header_v_version_cta_link_type" AS ENUM('internal', 'external');
  ALTER TABLE "_header_v" ALTER COLUMN "version_cta_link_type" SET DEFAULT 'internal'::"public"."enum__header_v_version_cta_link_type";
  ALTER TABLE "_header_v" ALTER COLUMN "version_cta_link_type" SET DATA TYPE "public"."enum__header_v_version_cta_link_type" USING "version_cta_link_type"::"public"."enum__header_v_version_cta_link_type";
  ALTER TABLE "footer_link_columns_links" ALTER COLUMN "link_type" SET DATA TYPE text;
  ALTER TABLE "footer_link_columns_links" ALTER COLUMN "link_type" SET DEFAULT 'internal'::text;
  DROP TYPE "public"."enum_footer_link_columns_links_link_type";
  CREATE TYPE "public"."enum_footer_link_columns_links_link_type" AS ENUM('internal', 'external');
  ALTER TABLE "footer_link_columns_links" ALTER COLUMN "link_type" SET DEFAULT 'internal'::"public"."enum_footer_link_columns_links_link_type";
  ALTER TABLE "footer_link_columns_links" ALTER COLUMN "link_type" SET DATA TYPE "public"."enum_footer_link_columns_links_link_type" USING "link_type"::"public"."enum_footer_link_columns_links_link_type";
  ALTER TABLE "footer" ALTER COLUMN "cta_band_primary_button_type" SET DATA TYPE text;
  ALTER TABLE "footer" ALTER COLUMN "cta_band_primary_button_type" SET DEFAULT 'internal'::text;
  DROP TYPE "public"."enum_footer_cta_band_primary_button_type";
  CREATE TYPE "public"."enum_footer_cta_band_primary_button_type" AS ENUM('internal', 'external');
  ALTER TABLE "footer" ALTER COLUMN "cta_band_primary_button_type" SET DEFAULT 'internal'::"public"."enum_footer_cta_band_primary_button_type";
  ALTER TABLE "footer" ALTER COLUMN "cta_band_primary_button_type" SET DATA TYPE "public"."enum_footer_cta_band_primary_button_type" USING "cta_band_primary_button_type"::"public"."enum_footer_cta_band_primary_button_type";
  ALTER TABLE "footer" ALTER COLUMN "cta_band_secondary_button_type" SET DATA TYPE text;
  ALTER TABLE "footer" ALTER COLUMN "cta_band_secondary_button_type" SET DEFAULT 'internal'::text;
  DROP TYPE "public"."enum_footer_cta_band_secondary_button_type";
  CREATE TYPE "public"."enum_footer_cta_band_secondary_button_type" AS ENUM('internal', 'external');
  ALTER TABLE "footer" ALTER COLUMN "cta_band_secondary_button_type" SET DEFAULT 'internal'::"public"."enum_footer_cta_band_secondary_button_type";
  ALTER TABLE "footer" ALTER COLUMN "cta_band_secondary_button_type" SET DATA TYPE "public"."enum_footer_cta_band_secondary_button_type" USING "cta_band_secondary_button_type"::"public"."enum_footer_cta_band_secondary_button_type";
  ALTER TABLE "footer" ALTER COLUMN "part_of_link_type" SET DATA TYPE text;
  ALTER TABLE "footer" ALTER COLUMN "part_of_link_type" SET DEFAULT 'internal'::text;
  DROP TYPE "public"."enum_footer_part_of_link_type";
  CREATE TYPE "public"."enum_footer_part_of_link_type" AS ENUM('internal', 'external');
  ALTER TABLE "footer" ALTER COLUMN "part_of_link_type" SET DEFAULT 'internal'::"public"."enum_footer_part_of_link_type";
  ALTER TABLE "footer" ALTER COLUMN "part_of_link_type" SET DATA TYPE "public"."enum_footer_part_of_link_type" USING "part_of_link_type"::"public"."enum_footer_part_of_link_type";
  ALTER TABLE "_footer_v_version_link_columns_links" ALTER COLUMN "link_type" SET DATA TYPE text;
  ALTER TABLE "_footer_v_version_link_columns_links" ALTER COLUMN "link_type" SET DEFAULT 'internal'::text;
  DROP TYPE "public"."enum__footer_v_version_link_columns_links_link_type";
  CREATE TYPE "public"."enum__footer_v_version_link_columns_links_link_type" AS ENUM('internal', 'external');
  ALTER TABLE "_footer_v_version_link_columns_links" ALTER COLUMN "link_type" SET DEFAULT 'internal'::"public"."enum__footer_v_version_link_columns_links_link_type";
  ALTER TABLE "_footer_v_version_link_columns_links" ALTER COLUMN "link_type" SET DATA TYPE "public"."enum__footer_v_version_link_columns_links_link_type" USING "link_type"::"public"."enum__footer_v_version_link_columns_links_link_type";
  ALTER TABLE "_footer_v" ALTER COLUMN "version_cta_band_primary_button_type" SET DATA TYPE text;
  ALTER TABLE "_footer_v" ALTER COLUMN "version_cta_band_primary_button_type" SET DEFAULT 'internal'::text;
  DROP TYPE "public"."enum__footer_v_version_cta_band_primary_button_type";
  CREATE TYPE "public"."enum__footer_v_version_cta_band_primary_button_type" AS ENUM('internal', 'external');
  ALTER TABLE "_footer_v" ALTER COLUMN "version_cta_band_primary_button_type" SET DEFAULT 'internal'::"public"."enum__footer_v_version_cta_band_primary_button_type";
  ALTER TABLE "_footer_v" ALTER COLUMN "version_cta_band_primary_button_type" SET DATA TYPE "public"."enum__footer_v_version_cta_band_primary_button_type" USING "version_cta_band_primary_button_type"::"public"."enum__footer_v_version_cta_band_primary_button_type";
  ALTER TABLE "_footer_v" ALTER COLUMN "version_cta_band_secondary_button_type" SET DATA TYPE text;
  ALTER TABLE "_footer_v" ALTER COLUMN "version_cta_band_secondary_button_type" SET DEFAULT 'internal'::text;
  DROP TYPE "public"."enum__footer_v_version_cta_band_secondary_button_type";
  CREATE TYPE "public"."enum__footer_v_version_cta_band_secondary_button_type" AS ENUM('internal', 'external');
  ALTER TABLE "_footer_v" ALTER COLUMN "version_cta_band_secondary_button_type" SET DEFAULT 'internal'::"public"."enum__footer_v_version_cta_band_secondary_button_type";
  ALTER TABLE "_footer_v" ALTER COLUMN "version_cta_band_secondary_button_type" SET DATA TYPE "public"."enum__footer_v_version_cta_band_secondary_button_type" USING "version_cta_band_secondary_button_type"::"public"."enum__footer_v_version_cta_band_secondary_button_type";
  ALTER TABLE "_footer_v" ALTER COLUMN "version_part_of_link_type" SET DATA TYPE text;
  ALTER TABLE "_footer_v" ALTER COLUMN "version_part_of_link_type" SET DEFAULT 'internal'::text;
  DROP TYPE "public"."enum__footer_v_version_part_of_link_type";
  CREATE TYPE "public"."enum__footer_v_version_part_of_link_type" AS ENUM('internal', 'external');
  ALTER TABLE "_footer_v" ALTER COLUMN "version_part_of_link_type" SET DEFAULT 'internal'::"public"."enum__footer_v_version_part_of_link_type";
  ALTER TABLE "_footer_v" ALTER COLUMN "version_part_of_link_type" SET DATA TYPE "public"."enum__footer_v_version_part_of_link_type" USING "version_part_of_link_type"::"public"."enum__footer_v_version_part_of_link_type";
  ALTER TABLE "pages" ALTER COLUMN "redirect_to_type" SET DATA TYPE text;
  ALTER TABLE "pages" ALTER COLUMN "redirect_to_type" SET DEFAULT 'internal'::text;
  DROP TYPE "public"."enum_pages_redirect_to_type";
  CREATE TYPE "public"."enum_pages_redirect_to_type" AS ENUM('internal', 'external');
  ALTER TABLE "pages" ALTER COLUMN "redirect_to_type" SET DEFAULT 'internal'::"public"."enum_pages_redirect_to_type";
  ALTER TABLE "pages" ALTER COLUMN "redirect_to_type" SET DATA TYPE "public"."enum_pages_redirect_to_type" USING "redirect_to_type"::"public"."enum_pages_redirect_to_type";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_redirect_to_type" SET DATA TYPE text;
  ALTER TABLE "_pages_v" ALTER COLUMN "version_redirect_to_type" SET DEFAULT 'internal'::text;
  DROP TYPE "public"."enum__pages_v_version_redirect_to_type";
  CREATE TYPE "public"."enum__pages_v_version_redirect_to_type" AS ENUM('internal', 'external');
  ALTER TABLE "_pages_v" ALTER COLUMN "version_redirect_to_type" SET DEFAULT 'internal'::"public"."enum__pages_v_version_redirect_to_type";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_redirect_to_type" SET DATA TYPE "public"."enum__pages_v_version_redirect_to_type" USING "version_redirect_to_type"::"public"."enum__pages_v_version_redirect_to_type";
  ALTER TABLE "shared_pages" ALTER COLUMN "redirect_to_type" SET DATA TYPE text;
  ALTER TABLE "shared_pages" ALTER COLUMN "redirect_to_type" SET DEFAULT 'internal'::text;
  DROP TYPE "public"."enum_shared_pages_redirect_to_type";
  CREATE TYPE "public"."enum_shared_pages_redirect_to_type" AS ENUM('internal', 'external');
  ALTER TABLE "shared_pages" ALTER COLUMN "redirect_to_type" SET DEFAULT 'internal'::"public"."enum_shared_pages_redirect_to_type";
  ALTER TABLE "shared_pages" ALTER COLUMN "redirect_to_type" SET DATA TYPE "public"."enum_shared_pages_redirect_to_type" USING "redirect_to_type"::"public"."enum_shared_pages_redirect_to_type";
  ALTER TABLE "_shared_pages_v" ALTER COLUMN "version_redirect_to_type" SET DATA TYPE text;
  ALTER TABLE "_shared_pages_v" ALTER COLUMN "version_redirect_to_type" SET DEFAULT 'internal'::text;
  DROP TYPE "public"."enum__shared_pages_v_version_redirect_to_type";
  CREATE TYPE "public"."enum__shared_pages_v_version_redirect_to_type" AS ENUM('internal', 'external');
  ALTER TABLE "_shared_pages_v" ALTER COLUMN "version_redirect_to_type" SET DEFAULT 'internal'::"public"."enum__shared_pages_v_version_redirect_to_type";
  ALTER TABLE "_shared_pages_v" ALTER COLUMN "version_redirect_to_type" SET DATA TYPE "public"."enum__shared_pages_v_version_redirect_to_type" USING "version_redirect_to_type"::"public"."enum__shared_pages_v_version_redirect_to_type";
  ALTER TABLE "redirects" ALTER COLUMN "to_type" SET DATA TYPE text;
  ALTER TABLE "redirects" ALTER COLUMN "to_type" SET DEFAULT 'internal'::text;
  DROP TYPE "public"."enum_redirects_to_type";
  CREATE TYPE "public"."enum_redirects_to_type" AS ENUM('internal', 'external');
  ALTER TABLE "redirects" ALTER COLUMN "to_type" SET DEFAULT 'internal'::"public"."enum_redirects_to_type";
  ALTER TABLE "redirects" ALTER COLUMN "to_type" SET DATA TYPE "public"."enum_redirects_to_type" USING "to_type"::"public"."enum_redirects_to_type";`)
}
