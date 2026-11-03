import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_pt_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_pages_pt_default_tab" AS ENUM('solutions', 'products');
  CREATE TYPE "public"."enum_pages_pt_cta_card_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_pages_pt_bottom_cta_first_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_pages_pt_bottom_cta_first_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_pages_pt_bottom_cta_second_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_pages_pt_bottom_cta_second_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_pages_pt_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum_pages_ps_btn_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_pages_ps_btn_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_pages_ps_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_pages_ps_source" AS ENUM('manual', 'all');
  CREATE TYPE "public"."enum_pages_ps_card_style" AS ENUM('imageOverlay', 'imageCard', 'textCard');
  CREATE TYPE "public"."enum_pages_ps_cta_card_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_pages_ps_bottom_cta_first_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_pages_ps_bottom_cta_first_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_pages_ps_bottom_cta_second_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_pages_ps_bottom_cta_second_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_pages_ps_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum_pages_ss_btn_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_pages_ss_btn_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_pages_ss_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_pages_ss_source" AS ENUM('manual', 'all');
  CREATE TYPE "public"."enum_pages_ss_card_style" AS ENUM('imageCard', 'textCard', 'imageTitle');
  CREATE TYPE "public"."enum_pages_ss_cta_card_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_pages_ss_bottom_cta_first_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_pages_ss_bottom_cta_first_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_pages_ss_bottom_cta_second_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_pages_ss_bottom_cta_second_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_pages_ss_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum_pages_pos_btn_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_pages_pos_btn_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_pages_pos_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_pages_pos_source" AS ENUM('manual', 'latest');
  CREATE TYPE "public"."enum_pages_pos_layout" AS ENUM('carousel', 'overlay', 'featured');
  CREATE TYPE "public"."enum_pages_pos_card_eyebrow" AS ENUM('category', 'entity');
  CREATE TYPE "public"."enum_pages_pos_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum_pages_jli_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_pages_jsh_btn_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_pages_jsh_btn_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_pages_jsh_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_pages_jsh_source" AS ENUM('manual', 'latest');
  CREATE TYPE "public"."enum_pages_jsh_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum_pages_ird_nav_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_pages_ird_document_types" AS ENUM('annual-report', 'financial-statement', 'sustainability-report', 'public-disclosure', 'shareholder-meeting', 'prospectus');
  CREATE TYPE "public"."enum_pages_ird_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___pages_v_pt_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___pages_v_pt_v_default_tab" AS ENUM('solutions', 'products');
  CREATE TYPE "public"."enum___pages_v_pt_v_cta_card_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___pages_v_pt_v_bottom_cta_first_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___pages_v_pt_v_bottom_cta_first_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___pages_v_pt_v_bottom_cta_second_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___pages_v_pt_v_bottom_cta_second_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___pages_v_pt_v_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum____pages_v_ps_v_btn_v_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum____pages_v_ps_v_btn_v_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___pages_v_ps_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___pages_v_ps_v_source" AS ENUM('manual', 'all');
  CREATE TYPE "public"."enum___pages_v_ps_v_card_style" AS ENUM('imageOverlay', 'imageCard', 'textCard');
  CREATE TYPE "public"."enum___pages_v_ps_v_cta_card_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___pages_v_ps_v_bottom_cta_first_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___pages_v_ps_v_bottom_cta_first_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___pages_v_ps_v_bottom_cta_second_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___pages_v_ps_v_bottom_cta_second_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___pages_v_ps_v_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum____pages_v_ss_v_btn_v_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum____pages_v_ss_v_btn_v_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___pages_v_ss_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___pages_v_ss_v_source" AS ENUM('manual', 'all');
  CREATE TYPE "public"."enum___pages_v_ss_v_card_style" AS ENUM('imageCard', 'textCard', 'imageTitle');
  CREATE TYPE "public"."enum___pages_v_ss_v_cta_card_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___pages_v_ss_v_bottom_cta_first_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___pages_v_ss_v_bottom_cta_first_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___pages_v_ss_v_bottom_cta_second_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___pages_v_ss_v_bottom_cta_second_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___pages_v_ss_v_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum____pages_v_pos_v_btn_v_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum____pages_v_pos_v_btn_v_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___pages_v_pos_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___pages_v_pos_v_source" AS ENUM('manual', 'latest');
  CREATE TYPE "public"."enum___pages_v_pos_v_layout" AS ENUM('carousel', 'overlay', 'featured');
  CREATE TYPE "public"."enum___pages_v_pos_v_card_eyebrow" AS ENUM('category', 'entity');
  CREATE TYPE "public"."enum___pages_v_pos_v_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum___pages_v_jli_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum____pages_v_jsh_v_btn_v_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum____pages_v_jsh_v_btn_v_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___pages_v_jsh_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___pages_v_jsh_v_source" AS ENUM('manual', 'latest');
  CREATE TYPE "public"."enum___pages_v_jsh_v_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum____pages_v_ird_v_nav_v_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___pages_v_ird_v_document_types" AS ENUM('annual-report', 'financial-statement', 'sustainability-report', 'public-disclosure', 'shareholder-meeting', 'prospectus');
  CREATE TYPE "public"."enum___pages_v_ird_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_pages_pt_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_pages_pt_default_tab" AS ENUM('solutions', 'products');
  CREATE TYPE "public"."enum_shared_pages_pt_cta_card_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_pages_pt_bottom_cta_first_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_pages_pt_bottom_cta_first_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_shared_pages_pt_bottom_cta_second_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_pages_pt_bottom_cta_second_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_shared_pages_pt_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum_shared_pages_ps_btn_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_pages_ps_btn_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_shared_pages_ps_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_pages_ps_source" AS ENUM('manual', 'all');
  CREATE TYPE "public"."enum_shared_pages_ps_card_style" AS ENUM('imageOverlay', 'imageCard', 'textCard');
  CREATE TYPE "public"."enum_shared_pages_ps_cta_card_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_pages_ps_bottom_cta_first_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_pages_ps_bottom_cta_first_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_shared_pages_ps_bottom_cta_second_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_pages_ps_bottom_cta_second_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_shared_pages_ps_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum_shared_pages_ss_btn_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_pages_ss_btn_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_shared_pages_ss_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_pages_ss_source" AS ENUM('manual', 'all');
  CREATE TYPE "public"."enum_shared_pages_ss_card_style" AS ENUM('imageCard', 'textCard', 'imageTitle');
  CREATE TYPE "public"."enum_shared_pages_ss_cta_card_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_pages_ss_bottom_cta_first_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_pages_ss_bottom_cta_first_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_shared_pages_ss_bottom_cta_second_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_pages_ss_bottom_cta_second_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_shared_pages_ss_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum_shared_pages_pos_btn_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_pages_pos_btn_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_shared_pages_pos_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_pages_pos_source" AS ENUM('manual', 'latest');
  CREATE TYPE "public"."enum_shared_pages_pos_layout" AS ENUM('carousel', 'overlay', 'featured');
  CREATE TYPE "public"."enum_shared_pages_pos_card_eyebrow" AS ENUM('category', 'entity');
  CREATE TYPE "public"."enum_shared_pages_pos_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum_shared_pages_jli_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_pages_jsh_btn_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_pages_jsh_btn_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_shared_pages_jsh_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_pages_jsh_source" AS ENUM('manual', 'latest');
  CREATE TYPE "public"."enum_shared_pages_jsh_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum_shared_pages_ird_nav_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_pages_ird_document_types" AS ENUM('annual-report', 'financial-statement', 'sustainability-report', 'public-disclosure', 'shareholder-meeting', 'prospectus');
  CREATE TYPE "public"."enum_shared_pages_ird_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___shared_pages_v_pt_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___shared_pages_v_pt_v_default_tab" AS ENUM('solutions', 'products');
  CREATE TYPE "public"."enum___shared_pages_v_pt_v_cta_card_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___shared_pages_v_pt_v_bottom_cta_first_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___shared_pages_v_pt_v_bottom_cta_first_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___shared_pages_v_pt_v_bottom_cta_second_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___shared_pages_v_pt_v_bottom_cta_second_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___shared_pages_v_pt_v_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum____shared_pages_v_ps_v_btn_v_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum____shared_pages_v_ps_v_btn_v_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___shared_pages_v_ps_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___shared_pages_v_ps_v_source" AS ENUM('manual', 'all');
  CREATE TYPE "public"."enum___shared_pages_v_ps_v_card_style" AS ENUM('imageOverlay', 'imageCard', 'textCard');
  CREATE TYPE "public"."enum___shared_pages_v_ps_v_cta_card_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___shared_pages_v_ps_v_bottom_cta_first_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___shared_pages_v_ps_v_bottom_cta_first_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___shared_pages_v_ps_v_bottom_cta_second_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___shared_pages_v_ps_v_bottom_cta_second_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___shared_pages_v_ps_v_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum____shared_pages_v_ss_v_btn_v_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum____shared_pages_v_ss_v_btn_v_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___shared_pages_v_ss_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___shared_pages_v_ss_v_source" AS ENUM('manual', 'all');
  CREATE TYPE "public"."enum___shared_pages_v_ss_v_card_style" AS ENUM('imageCard', 'textCard', 'imageTitle');
  CREATE TYPE "public"."enum___shared_pages_v_ss_v_cta_card_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___shared_pages_v_ss_v_bottom_cta_first_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___shared_pages_v_ss_v_bottom_cta_first_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___shared_pages_v_ss_v_bottom_cta_second_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___shared_pages_v_ss_v_bottom_cta_second_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___shared_pages_v_ss_v_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum____shared_pages_v_pos_v_btn_v_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum____shared_pages_v_pos_v_btn_v_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___shared_pages_v_pos_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___shared_pages_v_pos_v_source" AS ENUM('manual', 'latest');
  CREATE TYPE "public"."enum___shared_pages_v_pos_v_layout" AS ENUM('carousel', 'overlay', 'featured');
  CREATE TYPE "public"."enum___shared_pages_v_pos_v_card_eyebrow" AS ENUM('category', 'entity');
  CREATE TYPE "public"."enum___shared_pages_v_pos_v_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum___shared_pages_v_jli_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum____shared_pages_v_jsh_v_btn_v_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum____shared_pages_v_jsh_v_btn_v_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___shared_pages_v_jsh_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___shared_pages_v_jsh_v_source" AS ENUM('manual', 'latest');
  CREATE TYPE "public"."enum___shared_pages_v_jsh_v_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum____shared_pages_v_ird_v_nav_v_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___shared_pages_v_ird_v_document_types" AS ENUM('annual-report', 'financial-statement', 'sustainability-report', 'public-disclosure', 'shareholder-meeting', 'prospectus');
  CREATE TYPE "public"."enum___shared_pages_v_ird_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_detail_templates_pt_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_detail_templates_pt_default_tab" AS ENUM('solutions', 'products');
  CREATE TYPE "public"."enum_detail_templates_pt_cta_card_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_detail_templates_pt_bottom_cta_first_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_detail_templates_pt_bottom_cta_first_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_detail_templates_pt_bottom_cta_second_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_detail_templates_pt_bottom_cta_second_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_detail_templates_pt_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum_detail_templates_ps_btn_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_detail_templates_ps_btn_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_detail_templates_ps_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_detail_templates_ps_source" AS ENUM('manual', 'all');
  CREATE TYPE "public"."enum_detail_templates_ps_card_style" AS ENUM('imageOverlay', 'imageCard', 'textCard');
  CREATE TYPE "public"."enum_detail_templates_ps_cta_card_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_detail_templates_ps_bottom_cta_first_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_detail_templates_ps_bottom_cta_first_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_detail_templates_ps_bottom_cta_second_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_detail_templates_ps_bottom_cta_second_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_detail_templates_ps_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum_detail_templates_ss_btn_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_detail_templates_ss_btn_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_detail_templates_ss_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_detail_templates_ss_source" AS ENUM('manual', 'all');
  CREATE TYPE "public"."enum_detail_templates_ss_card_style" AS ENUM('imageCard', 'textCard', 'imageTitle');
  CREATE TYPE "public"."enum_detail_templates_ss_cta_card_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_detail_templates_ss_bottom_cta_first_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_detail_templates_ss_bottom_cta_first_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_detail_templates_ss_bottom_cta_second_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_detail_templates_ss_bottom_cta_second_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_detail_templates_ss_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum_detail_templates_pos_btn_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_detail_templates_pos_btn_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_detail_templates_pos_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_detail_templates_pos_source" AS ENUM('manual', 'latest');
  CREATE TYPE "public"."enum_detail_templates_pos_layout" AS ENUM('carousel', 'overlay', 'featured');
  CREATE TYPE "public"."enum_detail_templates_pos_card_eyebrow" AS ENUM('category', 'entity');
  CREATE TYPE "public"."enum_detail_templates_pos_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum_detail_templates_jli_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_detail_templates_jsh_btn_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_detail_templates_jsh_btn_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_detail_templates_jsh_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_detail_templates_jsh_source" AS ENUM('manual', 'latest');
  CREATE TYPE "public"."enum_detail_templates_jsh_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum_detail_templates_ird_nav_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_detail_templates_ird_document_types" AS ENUM('annual-report', 'financial-statement', 'sustainability-report', 'public-disclosure', 'shareholder-meeting', 'prospectus');
  CREATE TYPE "public"."enum_detail_templates_ird_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___detail_templates_v_pt_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___detail_templates_v_pt_v_default_tab" AS ENUM('solutions', 'products');
  CREATE TYPE "public"."enum___detail_templates_v_pt_v_cta_card_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___detail_templates_v_pt_v_bottom_cta_first_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___detail_templates_v_pt_v_bottom_cta_first_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___detail_templates_v_pt_v_bottom_cta_second_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___detail_templates_v_pt_v_bottom_cta_second_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___detail_templates_v_pt_v_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum____detail_templates_v_ps_v_btn_v_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum____detail_templates_v_ps_v_btn_v_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___detail_templates_v_ps_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___detail_templates_v_ps_v_source" AS ENUM('manual', 'all');
  CREATE TYPE "public"."enum___detail_templates_v_ps_v_card_style" AS ENUM('imageOverlay', 'imageCard', 'textCard');
  CREATE TYPE "public"."enum___detail_templates_v_ps_v_cta_card_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___detail_templates_v_ps_v_bottom_cta_first_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___detail_templates_v_ps_v_bottom_cta_first_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___detail_templates_v_ps_v_bottom_cta_second_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___detail_templates_v_ps_v_bottom_cta_second_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___detail_templates_v_ps_v_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum____detail_templates_v_ss_v_btn_v_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum____detail_templates_v_ss_v_btn_v_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___detail_templates_v_ss_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___detail_templates_v_ss_v_source" AS ENUM('manual', 'all');
  CREATE TYPE "public"."enum___detail_templates_v_ss_v_card_style" AS ENUM('imageCard', 'textCard', 'imageTitle');
  CREATE TYPE "public"."enum___detail_templates_v_ss_v_cta_card_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___detail_templates_v_ss_v_bottom_cta_first_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___detail_templates_v_ss_v_bottom_cta_first_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___detail_templates_v_ss_v_bottom_cta_second_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___detail_templates_v_ss_v_bottom_cta_second_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___detail_templates_v_ss_v_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum____detail_templates_v_pos_v_btn_v_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum____detail_templates_v_pos_v_btn_v_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___detail_templates_v_pos_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___detail_templates_v_pos_v_source" AS ENUM('manual', 'latest');
  CREATE TYPE "public"."enum___detail_templates_v_pos_v_layout" AS ENUM('carousel', 'overlay', 'featured');
  CREATE TYPE "public"."enum___detail_templates_v_pos_v_card_eyebrow" AS ENUM('category', 'entity');
  CREATE TYPE "public"."enum___detail_templates_v_pos_v_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum___detail_templates_v_jli_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum____detail_templates_v_jsh_v_btn_v_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum____detail_templates_v_jsh_v_btn_v_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___detail_templates_v_jsh_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___detail_templates_v_jsh_v_source" AS ENUM('manual', 'latest');
  CREATE TYPE "public"."enum___detail_templates_v_jsh_v_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum____detail_templates_v_ird_v_nav_v_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___detail_templates_v_ird_v_document_types" AS ENUM('annual-report', 'financial-statement', 'sustainability-report', 'public-disclosure', 'shareholder-meeting', 'prospectus');
  CREATE TYPE "public"."enum___detail_templates_v_ird_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_detail_templates_pt_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_detail_templates_pt_default_tab" AS ENUM('solutions', 'products');
  CREATE TYPE "public"."enum_shared_detail_templates_pt_cta_card_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_detail_templates_pt_bottom_cta_first_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_detail_templates_pt_bottom_cta_first_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_shared_detail_templates_pt_bottom_cta_second_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_detail_templates_pt_bottom_cta_second_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_shared_detail_templates_pt_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum_shared_detail_templates_ps_btn_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_detail_templates_ps_btn_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_shared_detail_templates_ps_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_detail_templates_ps_source" AS ENUM('manual', 'all');
  CREATE TYPE "public"."enum_shared_detail_templates_ps_card_style" AS ENUM('imageOverlay', 'imageCard', 'textCard');
  CREATE TYPE "public"."enum_shared_detail_templates_ps_cta_card_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_detail_templates_ps_bottom_cta_first_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_detail_templates_ps_bottom_cta_first_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_shared_detail_templates_ps_bottom_cta_second_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_detail_templates_ps_bottom_cta_second_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_shared_detail_templates_ps_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum_shared_detail_templates_ss_btn_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_detail_templates_ss_btn_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_shared_detail_templates_ss_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_detail_templates_ss_source" AS ENUM('manual', 'all');
  CREATE TYPE "public"."enum_shared_detail_templates_ss_card_style" AS ENUM('imageCard', 'textCard', 'imageTitle');
  CREATE TYPE "public"."enum_shared_detail_templates_ss_cta_card_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_detail_templates_ss_bottom_cta_first_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_detail_templates_ss_bottom_cta_first_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_shared_detail_templates_ss_bottom_cta_second_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_detail_templates_ss_bottom_cta_second_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_shared_detail_templates_ss_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum_shared_detail_templates_pos_btn_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_detail_templates_pos_btn_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_shared_detail_templates_pos_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_detail_templates_pos_source" AS ENUM('manual', 'latest');
  CREATE TYPE "public"."enum_shared_detail_templates_pos_layout" AS ENUM('carousel', 'overlay', 'featured');
  CREATE TYPE "public"."enum_shared_detail_templates_pos_card_eyebrow" AS ENUM('category', 'entity');
  CREATE TYPE "public"."enum_shared_detail_templates_pos_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum_shared_detail_templates_jli_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_detail_templates_jsh_btn_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_detail_templates_jsh_btn_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum_shared_detail_templates_jsh_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum_shared_detail_templates_jsh_source" AS ENUM('manual', 'latest');
  CREATE TYPE "public"."enum_shared_detail_templates_jsh_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum_shared_detail_templates_ird_nav_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum_shared_detail_templates_ird_document_types" AS ENUM('annual-report', 'financial-statement', 'sustainability-report', 'public-disclosure', 'shareholder-meeting', 'prospectus');
  CREATE TYPE "public"."enum_shared_detail_templates_ird_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___shared_detail_templates_v_pt_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___shared_detail_templates_v_pt_v_default_tab" AS ENUM('solutions', 'products');
  CREATE TYPE "public"."enum___shared_detail_templates_v_pt_v_cta_card_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___shared_detail_templates_v_pt_v_bottom_cta_first_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___shared_detail_templates_v_pt_v_bottom_cta_first_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___shared_detail_templates_v_pt_v_bottom_cta_second_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___shared_detail_templates_v_pt_v_bottom_cta_second_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___shared_detail_templates_v_pt_v_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum____shared_detail_templates_v_ps_v_btn_v_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum____shared_detail_templates_v_ps_v_btn_v_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___shared_detail_templates_v_ps_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___shared_detail_templates_v_ps_v_source" AS ENUM('manual', 'all');
  CREATE TYPE "public"."enum___shared_detail_templates_v_ps_v_card_style" AS ENUM('imageOverlay', 'imageCard', 'textCard');
  CREATE TYPE "public"."enum___shared_detail_templates_v_ps_v_cta_card_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___shared_detail_templates_v_ps_v_bottom_cta_first_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___shared_detail_templates_v_ps_v_bottom_cta_first_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___shared_detail_templates_v_ps_v_bottom_cta_second_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___shared_detail_templates_v_ps_v_bottom_cta_second_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___shared_detail_templates_v_ps_v_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum____shared_detail_templates_v_ss_v_btn_v_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum____shared_detail_templates_v_ss_v_btn_v_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___shared_detail_templates_v_ss_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___shared_detail_templates_v_ss_v_source" AS ENUM('manual', 'all');
  CREATE TYPE "public"."enum___shared_detail_templates_v_ss_v_card_style" AS ENUM('imageCard', 'textCard', 'imageTitle');
  CREATE TYPE "public"."enum___shared_detail_templates_v_ss_v_cta_card_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___shared_detail_templates_v_ss_v_bottom_cta_first_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___shared_detail_templates_v_ss_v_bottom_cta_first_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___shared_detail_templates_v_ss_v_bottom_cta_second_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___shared_detail_templates_v_ss_v_bottom_cta_second_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___shared_detail_templates_v_ss_v_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum____shared_detail_templates_v_pos_v_btn_v_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum____shared_detail_templates_v_pos_v_btn_v_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___shared_detail_templates_v_pos_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___shared_detail_templates_v_pos_v_source" AS ENUM('manual', 'latest');
  CREATE TYPE "public"."enum___shared_detail_templates_v_pos_v_layout" AS ENUM('carousel', 'overlay', 'featured');
  CREATE TYPE "public"."enum___shared_detail_templates_v_pos_v_card_eyebrow" AS ENUM('category', 'entity');
  CREATE TYPE "public"."enum___shared_detail_templates_v_pos_v_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum___shared_detail_templates_v_jli_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum____shared_detail_templates_v_jsh_v_btn_v_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum____shared_detail_templates_v_jsh_v_btn_v_style" AS ENUM('primary', 'light', 'text');
  CREATE TYPE "public"."enum___shared_detail_templates_v_jsh_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TYPE "public"."enum___shared_detail_templates_v_jsh_v_source" AS ENUM('manual', 'latest');
  CREATE TYPE "public"."enum___shared_detail_templates_v_jsh_v_appearance_background" AS ENUM('default', 'muted', 'dark', 'image');
  CREATE TYPE "public"."enum____shared_detail_templates_v_ird_v_nav_v_link_type" AS ENUM('internal', 'external', 'reference');
  CREATE TYPE "public"."enum___shared_detail_templates_v_ird_v_document_types" AS ENUM('annual-report', 'financial-statement', 'sustainability-report', 'public-disclosure', 'shareholder-meeting', 'prospectus');
  CREATE TYPE "public"."enum___shared_detail_templates_v_ird_v_heading_align" AS ENUM('center', 'left', 'split');
  CREATE TABLE "pages_pt" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_pages_pt_heading_align" DEFAULT 'center',
  	"default_tab" "enum_pages_pt_default_tab" DEFAULT 'solutions',
  	"cta_card_link_type" "enum_pages_pt_cta_card_link_type" DEFAULT 'internal',
  	"cta_card_link_new_tab" boolean DEFAULT false,
  	"cta_card_link_internal_path" varchar,
  	"cta_card_link_external_url" varchar,
  	"bottom_cta_first_type" "enum_pages_pt_bottom_cta_first_type" DEFAULT 'internal',
  	"bottom_cta_first_new_tab" boolean DEFAULT false,
  	"bottom_cta_first_internal_path" varchar,
  	"bottom_cta_first_external_url" varchar,
  	"bottom_cta_first_style" "enum_pages_pt_bottom_cta_first_style" DEFAULT 'primary',
  	"bottom_cta_second_type" "enum_pages_pt_bottom_cta_second_type" DEFAULT 'internal',
  	"bottom_cta_second_new_tab" boolean DEFAULT false,
  	"bottom_cta_second_internal_path" varchar,
  	"bottom_cta_second_external_url" varchar,
  	"bottom_cta_second_style" "enum_pages_pt_bottom_cta_second_style" DEFAULT 'primary',
  	"appearance_background" "enum_pages_pt_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_pt_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"solutions_tab_label" varchar,
  	"products_tab_label" varchar,
  	"cta_card_text" varchar,
  	"cta_card_link_label" varchar,
  	"bottom_cta_title" varchar,
  	"bottom_cta_description" varchar,
  	"bottom_cta_first_label" varchar,
  	"bottom_cta_second_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_ps_btn" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_ps_btn_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_pages_ps_btn_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "pages_ps_btn_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_ps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_pages_ps_heading_align" DEFAULT 'center',
  	"source" "enum_pages_ps_source" DEFAULT 'manual',
  	"card_style" "enum_pages_ps_card_style" DEFAULT 'imageCard',
  	"cta_card_link_type" "enum_pages_ps_cta_card_link_type" DEFAULT 'internal',
  	"cta_card_link_new_tab" boolean DEFAULT false,
  	"cta_card_link_internal_path" varchar,
  	"cta_card_link_external_url" varchar,
  	"bottom_cta_first_type" "enum_pages_ps_bottom_cta_first_type" DEFAULT 'internal',
  	"bottom_cta_first_new_tab" boolean DEFAULT false,
  	"bottom_cta_first_internal_path" varchar,
  	"bottom_cta_first_external_url" varchar,
  	"bottom_cta_first_style" "enum_pages_ps_bottom_cta_first_style" DEFAULT 'primary',
  	"bottom_cta_second_type" "enum_pages_ps_bottom_cta_second_type" DEFAULT 'internal',
  	"bottom_cta_second_new_tab" boolean DEFAULT false,
  	"bottom_cta_second_internal_path" varchar,
  	"bottom_cta_second_external_url" varchar,
  	"bottom_cta_second_style" "enum_pages_ps_bottom_cta_second_style" DEFAULT 'primary',
  	"appearance_background" "enum_pages_ps_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_ps_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"cta_card_text" varchar,
  	"cta_card_link_label" varchar,
  	"bottom_cta_title" varchar,
  	"bottom_cta_description" varchar,
  	"bottom_cta_first_label" varchar,
  	"bottom_cta_second_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_ss_btn" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_ss_btn_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_pages_ss_btn_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "pages_ss_btn_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_ss" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_pages_ss_heading_align" DEFAULT 'center',
  	"source" "enum_pages_ss_source" DEFAULT 'manual',
  	"card_style" "enum_pages_ss_card_style" DEFAULT 'imageCard',
  	"cta_card_link_type" "enum_pages_ss_cta_card_link_type" DEFAULT 'internal',
  	"cta_card_link_new_tab" boolean DEFAULT false,
  	"cta_card_link_internal_path" varchar,
  	"cta_card_link_external_url" varchar,
  	"bottom_cta_first_type" "enum_pages_ss_bottom_cta_first_type" DEFAULT 'internal',
  	"bottom_cta_first_new_tab" boolean DEFAULT false,
  	"bottom_cta_first_internal_path" varchar,
  	"bottom_cta_first_external_url" varchar,
  	"bottom_cta_first_style" "enum_pages_ss_bottom_cta_first_style" DEFAULT 'primary',
  	"bottom_cta_second_type" "enum_pages_ss_bottom_cta_second_type" DEFAULT 'internal',
  	"bottom_cta_second_new_tab" boolean DEFAULT false,
  	"bottom_cta_second_internal_path" varchar,
  	"bottom_cta_second_external_url" varchar,
  	"bottom_cta_second_style" "enum_pages_ss_bottom_cta_second_style" DEFAULT 'primary',
  	"appearance_background" "enum_pages_ss_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_ss_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"cta_card_text" varchar,
  	"cta_card_link_label" varchar,
  	"bottom_cta_title" varchar,
  	"bottom_cta_description" varchar,
  	"bottom_cta_first_label" varchar,
  	"bottom_cta_second_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_pos_btn" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_pos_btn_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_pages_pos_btn_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "pages_pos_btn_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_pos_it" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_pos_it_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_pos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_pages_pos_heading_align" DEFAULT 'center',
  	"source" "enum_pages_pos_source" DEFAULT 'manual',
  	"limit" numeric DEFAULT 3,
  	"layout" "enum_pages_pos_layout" DEFAULT 'carousel',
  	"card_eyebrow" "enum_pages_pos_card_eyebrow" DEFAULT 'category',
  	"appearance_background" "enum_pages_pos_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_pos_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"read_more_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_jli" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_pages_jli_heading_align" DEFAULT 'left',
  	"filters_search" boolean DEFAULT true,
  	"filters_department" boolean DEFAULT true,
  	"filters_location" boolean DEFAULT true,
  	"filters_job_type" boolean DEFAULT true,
  	"page_size" numeric DEFAULT 10,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_jli_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"search_placeholder" varchar,
  	"empty_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_jsh_btn" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_jsh_btn_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_pages_jsh_btn_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "pages_jsh_btn_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_jsh" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_pages_jsh_heading_align" DEFAULT 'center',
  	"source" "enum_pages_jsh_source" DEFAULT 'manual',
  	"limit" numeric DEFAULT 3,
  	"appearance_background" "enum_pages_jsh_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_jsh_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_ird_nav" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_ird_nav_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar
  );
  
  CREATE TABLE "pages_ird_nav_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_ird_document_types" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_pages_ird_document_types",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_ird" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_pages_ird_heading_align" DEFAULT 'left',
  	"page_size" numeric DEFAULT 5,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_ird_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "__pages_v_pt_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___pages_v_pt_v_heading_align" DEFAULT 'center',
  	"default_tab" "enum___pages_v_pt_v_default_tab" DEFAULT 'solutions',
  	"cta_card_link_type" "enum___pages_v_pt_v_cta_card_link_type" DEFAULT 'internal',
  	"cta_card_link_new_tab" boolean DEFAULT false,
  	"cta_card_link_internal_path" varchar,
  	"cta_card_link_external_url" varchar,
  	"bottom_cta_first_type" "enum___pages_v_pt_v_bottom_cta_first_type" DEFAULT 'internal',
  	"bottom_cta_first_new_tab" boolean DEFAULT false,
  	"bottom_cta_first_internal_path" varchar,
  	"bottom_cta_first_external_url" varchar,
  	"bottom_cta_first_style" "enum___pages_v_pt_v_bottom_cta_first_style" DEFAULT 'primary',
  	"bottom_cta_second_type" "enum___pages_v_pt_v_bottom_cta_second_type" DEFAULT 'internal',
  	"bottom_cta_second_new_tab" boolean DEFAULT false,
  	"bottom_cta_second_internal_path" varchar,
  	"bottom_cta_second_external_url" varchar,
  	"bottom_cta_second_style" "enum___pages_v_pt_v_bottom_cta_second_style" DEFAULT 'primary',
  	"appearance_background" "enum___pages_v_pt_v_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__pages_v_pt_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"solutions_tab_label" varchar,
  	"products_tab_label" varchar,
  	"cta_card_text" varchar,
  	"cta_card_link_label" varchar,
  	"bottom_cta_title" varchar,
  	"bottom_cta_description" varchar,
  	"bottom_cta_first_label" varchar,
  	"bottom_cta_second_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "___pages_v_ps_v_btn_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum____pages_v_ps_v_btn_v_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum____pages_v_ps_v_btn_v_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "___pages_v_ps_v_btn_v_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__pages_v_ps_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___pages_v_ps_v_heading_align" DEFAULT 'center',
  	"source" "enum___pages_v_ps_v_source" DEFAULT 'manual',
  	"card_style" "enum___pages_v_ps_v_card_style" DEFAULT 'imageCard',
  	"cta_card_link_type" "enum___pages_v_ps_v_cta_card_link_type" DEFAULT 'internal',
  	"cta_card_link_new_tab" boolean DEFAULT false,
  	"cta_card_link_internal_path" varchar,
  	"cta_card_link_external_url" varchar,
  	"bottom_cta_first_type" "enum___pages_v_ps_v_bottom_cta_first_type" DEFAULT 'internal',
  	"bottom_cta_first_new_tab" boolean DEFAULT false,
  	"bottom_cta_first_internal_path" varchar,
  	"bottom_cta_first_external_url" varchar,
  	"bottom_cta_first_style" "enum___pages_v_ps_v_bottom_cta_first_style" DEFAULT 'primary',
  	"bottom_cta_second_type" "enum___pages_v_ps_v_bottom_cta_second_type" DEFAULT 'internal',
  	"bottom_cta_second_new_tab" boolean DEFAULT false,
  	"bottom_cta_second_internal_path" varchar,
  	"bottom_cta_second_external_url" varchar,
  	"bottom_cta_second_style" "enum___pages_v_ps_v_bottom_cta_second_style" DEFAULT 'primary',
  	"appearance_background" "enum___pages_v_ps_v_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__pages_v_ps_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"cta_card_text" varchar,
  	"cta_card_link_label" varchar,
  	"bottom_cta_title" varchar,
  	"bottom_cta_description" varchar,
  	"bottom_cta_first_label" varchar,
  	"bottom_cta_second_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "___pages_v_ss_v_btn_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum____pages_v_ss_v_btn_v_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum____pages_v_ss_v_btn_v_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "___pages_v_ss_v_btn_v_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__pages_v_ss_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___pages_v_ss_v_heading_align" DEFAULT 'center',
  	"source" "enum___pages_v_ss_v_source" DEFAULT 'manual',
  	"card_style" "enum___pages_v_ss_v_card_style" DEFAULT 'imageCard',
  	"cta_card_link_type" "enum___pages_v_ss_v_cta_card_link_type" DEFAULT 'internal',
  	"cta_card_link_new_tab" boolean DEFAULT false,
  	"cta_card_link_internal_path" varchar,
  	"cta_card_link_external_url" varchar,
  	"bottom_cta_first_type" "enum___pages_v_ss_v_bottom_cta_first_type" DEFAULT 'internal',
  	"bottom_cta_first_new_tab" boolean DEFAULT false,
  	"bottom_cta_first_internal_path" varchar,
  	"bottom_cta_first_external_url" varchar,
  	"bottom_cta_first_style" "enum___pages_v_ss_v_bottom_cta_first_style" DEFAULT 'primary',
  	"bottom_cta_second_type" "enum___pages_v_ss_v_bottom_cta_second_type" DEFAULT 'internal',
  	"bottom_cta_second_new_tab" boolean DEFAULT false,
  	"bottom_cta_second_internal_path" varchar,
  	"bottom_cta_second_external_url" varchar,
  	"bottom_cta_second_style" "enum___pages_v_ss_v_bottom_cta_second_style" DEFAULT 'primary',
  	"appearance_background" "enum___pages_v_ss_v_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__pages_v_ss_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"cta_card_text" varchar,
  	"cta_card_link_label" varchar,
  	"bottom_cta_title" varchar,
  	"bottom_cta_description" varchar,
  	"bottom_cta_first_label" varchar,
  	"bottom_cta_second_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "___pages_v_pos_v_btn_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum____pages_v_pos_v_btn_v_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum____pages_v_pos_v_btn_v_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "___pages_v_pos_v_btn_v_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "___pages_v_pos_v_it_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "___pages_v_pos_v_it_v_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__pages_v_pos_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___pages_v_pos_v_heading_align" DEFAULT 'center',
  	"source" "enum___pages_v_pos_v_source" DEFAULT 'manual',
  	"limit" numeric DEFAULT 3,
  	"layout" "enum___pages_v_pos_v_layout" DEFAULT 'carousel',
  	"card_eyebrow" "enum___pages_v_pos_v_card_eyebrow" DEFAULT 'category',
  	"appearance_background" "enum___pages_v_pos_v_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__pages_v_pos_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"read_more_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__pages_v_jli_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___pages_v_jli_v_heading_align" DEFAULT 'left',
  	"filters_search" boolean DEFAULT true,
  	"filters_department" boolean DEFAULT true,
  	"filters_location" boolean DEFAULT true,
  	"filters_job_type" boolean DEFAULT true,
  	"page_size" numeric DEFAULT 10,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__pages_v_jli_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"search_placeholder" varchar,
  	"empty_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "___pages_v_jsh_v_btn_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum____pages_v_jsh_v_btn_v_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum____pages_v_jsh_v_btn_v_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "___pages_v_jsh_v_btn_v_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__pages_v_jsh_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___pages_v_jsh_v_heading_align" DEFAULT 'center',
  	"source" "enum___pages_v_jsh_v_source" DEFAULT 'manual',
  	"limit" numeric DEFAULT 3,
  	"appearance_background" "enum___pages_v_jsh_v_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__pages_v_jsh_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "___pages_v_ird_v_nav_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum____pages_v_ird_v_nav_v_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "___pages_v_ird_v_nav_v_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__pages_v_ird_v_document_types" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum___pages_v_ird_v_document_types",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "__pages_v_ird_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___pages_v_ird_v_heading_align" DEFAULT 'left',
  	"page_size" numeric DEFAULT 5,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__pages_v_ird_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "shared_pages_pt" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_pages_pt_heading_align" DEFAULT 'center',
  	"default_tab" "enum_shared_pages_pt_default_tab" DEFAULT 'solutions',
  	"cta_card_link_type" "enum_shared_pages_pt_cta_card_link_type" DEFAULT 'internal',
  	"cta_card_link_new_tab" boolean DEFAULT false,
  	"cta_card_link_internal_path" varchar,
  	"cta_card_link_external_url" varchar,
  	"bottom_cta_first_type" "enum_shared_pages_pt_bottom_cta_first_type" DEFAULT 'internal',
  	"bottom_cta_first_new_tab" boolean DEFAULT false,
  	"bottom_cta_first_internal_path" varchar,
  	"bottom_cta_first_external_url" varchar,
  	"bottom_cta_first_style" "enum_shared_pages_pt_bottom_cta_first_style" DEFAULT 'primary',
  	"bottom_cta_second_type" "enum_shared_pages_pt_bottom_cta_second_type" DEFAULT 'internal',
  	"bottom_cta_second_new_tab" boolean DEFAULT false,
  	"bottom_cta_second_internal_path" varchar,
  	"bottom_cta_second_external_url" varchar,
  	"bottom_cta_second_style" "enum_shared_pages_pt_bottom_cta_second_style" DEFAULT 'primary',
  	"appearance_background" "enum_shared_pages_pt_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_pages_pt_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"solutions_tab_label" varchar,
  	"products_tab_label" varchar,
  	"cta_card_text" varchar,
  	"cta_card_link_label" varchar,
  	"bottom_cta_title" varchar,
  	"bottom_cta_description" varchar,
  	"bottom_cta_first_label" varchar,
  	"bottom_cta_second_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_ps_btn" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_shared_pages_ps_btn_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_shared_pages_ps_btn_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "shared_pages_ps_btn_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_ps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_pages_ps_heading_align" DEFAULT 'center',
  	"source" "enum_shared_pages_ps_source" DEFAULT 'manual',
  	"card_style" "enum_shared_pages_ps_card_style" DEFAULT 'imageCard',
  	"cta_card_link_type" "enum_shared_pages_ps_cta_card_link_type" DEFAULT 'internal',
  	"cta_card_link_new_tab" boolean DEFAULT false,
  	"cta_card_link_internal_path" varchar,
  	"cta_card_link_external_url" varchar,
  	"bottom_cta_first_type" "enum_shared_pages_ps_bottom_cta_first_type" DEFAULT 'internal',
  	"bottom_cta_first_new_tab" boolean DEFAULT false,
  	"bottom_cta_first_internal_path" varchar,
  	"bottom_cta_first_external_url" varchar,
  	"bottom_cta_first_style" "enum_shared_pages_ps_bottom_cta_first_style" DEFAULT 'primary',
  	"bottom_cta_second_type" "enum_shared_pages_ps_bottom_cta_second_type" DEFAULT 'internal',
  	"bottom_cta_second_new_tab" boolean DEFAULT false,
  	"bottom_cta_second_internal_path" varchar,
  	"bottom_cta_second_external_url" varchar,
  	"bottom_cta_second_style" "enum_shared_pages_ps_bottom_cta_second_style" DEFAULT 'primary',
  	"appearance_background" "enum_shared_pages_ps_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_pages_ps_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"cta_card_text" varchar,
  	"cta_card_link_label" varchar,
  	"bottom_cta_title" varchar,
  	"bottom_cta_description" varchar,
  	"bottom_cta_first_label" varchar,
  	"bottom_cta_second_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_ss_btn" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_shared_pages_ss_btn_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_shared_pages_ss_btn_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "shared_pages_ss_btn_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_ss" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_pages_ss_heading_align" DEFAULT 'center',
  	"source" "enum_shared_pages_ss_source" DEFAULT 'manual',
  	"card_style" "enum_shared_pages_ss_card_style" DEFAULT 'imageCard',
  	"cta_card_link_type" "enum_shared_pages_ss_cta_card_link_type" DEFAULT 'internal',
  	"cta_card_link_new_tab" boolean DEFAULT false,
  	"cta_card_link_internal_path" varchar,
  	"cta_card_link_external_url" varchar,
  	"bottom_cta_first_type" "enum_shared_pages_ss_bottom_cta_first_type" DEFAULT 'internal',
  	"bottom_cta_first_new_tab" boolean DEFAULT false,
  	"bottom_cta_first_internal_path" varchar,
  	"bottom_cta_first_external_url" varchar,
  	"bottom_cta_first_style" "enum_shared_pages_ss_bottom_cta_first_style" DEFAULT 'primary',
  	"bottom_cta_second_type" "enum_shared_pages_ss_bottom_cta_second_type" DEFAULT 'internal',
  	"bottom_cta_second_new_tab" boolean DEFAULT false,
  	"bottom_cta_second_internal_path" varchar,
  	"bottom_cta_second_external_url" varchar,
  	"bottom_cta_second_style" "enum_shared_pages_ss_bottom_cta_second_style" DEFAULT 'primary',
  	"appearance_background" "enum_shared_pages_ss_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_pages_ss_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"cta_card_text" varchar,
  	"cta_card_link_label" varchar,
  	"bottom_cta_title" varchar,
  	"bottom_cta_description" varchar,
  	"bottom_cta_first_label" varchar,
  	"bottom_cta_second_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_pos_btn" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_shared_pages_pos_btn_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_shared_pages_pos_btn_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "shared_pages_pos_btn_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_pos_it" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "shared_pages_pos_it_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_pos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_pages_pos_heading_align" DEFAULT 'center',
  	"source" "enum_shared_pages_pos_source" DEFAULT 'manual',
  	"limit" numeric DEFAULT 3,
  	"layout" "enum_shared_pages_pos_layout" DEFAULT 'carousel',
  	"card_eyebrow" "enum_shared_pages_pos_card_eyebrow" DEFAULT 'category',
  	"appearance_background" "enum_shared_pages_pos_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_pages_pos_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"read_more_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_jli" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_pages_jli_heading_align" DEFAULT 'left',
  	"filters_search" boolean DEFAULT true,
  	"filters_department" boolean DEFAULT true,
  	"filters_location" boolean DEFAULT true,
  	"filters_job_type" boolean DEFAULT true,
  	"page_size" numeric DEFAULT 10,
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_pages_jli_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"search_placeholder" varchar,
  	"empty_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_jsh_btn" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_shared_pages_jsh_btn_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_shared_pages_jsh_btn_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "shared_pages_jsh_btn_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_jsh" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_pages_jsh_heading_align" DEFAULT 'center',
  	"source" "enum_shared_pages_jsh_source" DEFAULT 'manual',
  	"limit" numeric DEFAULT 3,
  	"appearance_background" "enum_shared_pages_jsh_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_pages_jsh_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_ird_nav" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_shared_pages_ird_nav_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar
  );
  
  CREATE TABLE "shared_pages_ird_nav_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_pages_ird_document_types" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_shared_pages_ird_document_types",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "shared_pages_ird" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_pages_ird_heading_align" DEFAULT 'left',
  	"page_size" numeric DEFAULT 5,
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_pages_ird_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_pt_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_pages_v_pt_v_heading_align" DEFAULT 'center',
  	"default_tab" "enum___shared_pages_v_pt_v_default_tab" DEFAULT 'solutions',
  	"cta_card_link_type" "enum___shared_pages_v_pt_v_cta_card_link_type" DEFAULT 'internal',
  	"cta_card_link_new_tab" boolean DEFAULT false,
  	"cta_card_link_internal_path" varchar,
  	"cta_card_link_external_url" varchar,
  	"bottom_cta_first_type" "enum___shared_pages_v_pt_v_bottom_cta_first_type" DEFAULT 'internal',
  	"bottom_cta_first_new_tab" boolean DEFAULT false,
  	"bottom_cta_first_internal_path" varchar,
  	"bottom_cta_first_external_url" varchar,
  	"bottom_cta_first_style" "enum___shared_pages_v_pt_v_bottom_cta_first_style" DEFAULT 'primary',
  	"bottom_cta_second_type" "enum___shared_pages_v_pt_v_bottom_cta_second_type" DEFAULT 'internal',
  	"bottom_cta_second_new_tab" boolean DEFAULT false,
  	"bottom_cta_second_internal_path" varchar,
  	"bottom_cta_second_external_url" varchar,
  	"bottom_cta_second_style" "enum___shared_pages_v_pt_v_bottom_cta_second_style" DEFAULT 'primary',
  	"appearance_background" "enum___shared_pages_v_pt_v_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_pages_v_pt_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"solutions_tab_label" varchar,
  	"products_tab_label" varchar,
  	"cta_card_text" varchar,
  	"cta_card_link_label" varchar,
  	"bottom_cta_title" varchar,
  	"bottom_cta_description" varchar,
  	"bottom_cta_first_label" varchar,
  	"bottom_cta_second_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "___shared_pages_v_ps_v_btn_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum____shared_pages_v_ps_v_btn_v_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum____shared_pages_v_ps_v_btn_v_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "___shared_pages_v_ps_v_btn_v_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_ps_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_pages_v_ps_v_heading_align" DEFAULT 'center',
  	"source" "enum___shared_pages_v_ps_v_source" DEFAULT 'manual',
  	"card_style" "enum___shared_pages_v_ps_v_card_style" DEFAULT 'imageCard',
  	"cta_card_link_type" "enum___shared_pages_v_ps_v_cta_card_link_type" DEFAULT 'internal',
  	"cta_card_link_new_tab" boolean DEFAULT false,
  	"cta_card_link_internal_path" varchar,
  	"cta_card_link_external_url" varchar,
  	"bottom_cta_first_type" "enum___shared_pages_v_ps_v_bottom_cta_first_type" DEFAULT 'internal',
  	"bottom_cta_first_new_tab" boolean DEFAULT false,
  	"bottom_cta_first_internal_path" varchar,
  	"bottom_cta_first_external_url" varchar,
  	"bottom_cta_first_style" "enum___shared_pages_v_ps_v_bottom_cta_first_style" DEFAULT 'primary',
  	"bottom_cta_second_type" "enum___shared_pages_v_ps_v_bottom_cta_second_type" DEFAULT 'internal',
  	"bottom_cta_second_new_tab" boolean DEFAULT false,
  	"bottom_cta_second_internal_path" varchar,
  	"bottom_cta_second_external_url" varchar,
  	"bottom_cta_second_style" "enum___shared_pages_v_ps_v_bottom_cta_second_style" DEFAULT 'primary',
  	"appearance_background" "enum___shared_pages_v_ps_v_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_pages_v_ps_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"cta_card_text" varchar,
  	"cta_card_link_label" varchar,
  	"bottom_cta_title" varchar,
  	"bottom_cta_description" varchar,
  	"bottom_cta_first_label" varchar,
  	"bottom_cta_second_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "___shared_pages_v_ss_v_btn_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum____shared_pages_v_ss_v_btn_v_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum____shared_pages_v_ss_v_btn_v_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "___shared_pages_v_ss_v_btn_v_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_ss_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_pages_v_ss_v_heading_align" DEFAULT 'center',
  	"source" "enum___shared_pages_v_ss_v_source" DEFAULT 'manual',
  	"card_style" "enum___shared_pages_v_ss_v_card_style" DEFAULT 'imageCard',
  	"cta_card_link_type" "enum___shared_pages_v_ss_v_cta_card_link_type" DEFAULT 'internal',
  	"cta_card_link_new_tab" boolean DEFAULT false,
  	"cta_card_link_internal_path" varchar,
  	"cta_card_link_external_url" varchar,
  	"bottom_cta_first_type" "enum___shared_pages_v_ss_v_bottom_cta_first_type" DEFAULT 'internal',
  	"bottom_cta_first_new_tab" boolean DEFAULT false,
  	"bottom_cta_first_internal_path" varchar,
  	"bottom_cta_first_external_url" varchar,
  	"bottom_cta_first_style" "enum___shared_pages_v_ss_v_bottom_cta_first_style" DEFAULT 'primary',
  	"bottom_cta_second_type" "enum___shared_pages_v_ss_v_bottom_cta_second_type" DEFAULT 'internal',
  	"bottom_cta_second_new_tab" boolean DEFAULT false,
  	"bottom_cta_second_internal_path" varchar,
  	"bottom_cta_second_external_url" varchar,
  	"bottom_cta_second_style" "enum___shared_pages_v_ss_v_bottom_cta_second_style" DEFAULT 'primary',
  	"appearance_background" "enum___shared_pages_v_ss_v_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_pages_v_ss_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"cta_card_text" varchar,
  	"cta_card_link_label" varchar,
  	"bottom_cta_title" varchar,
  	"bottom_cta_description" varchar,
  	"bottom_cta_first_label" varchar,
  	"bottom_cta_second_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "___shared_pages_v_pos_v_btn_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum____shared_pages_v_pos_v_btn_v_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum____shared_pages_v_pos_v_btn_v_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "___shared_pages_v_pos_v_btn_v_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "___shared_pages_v_pos_v_it_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "___shared_pages_v_pos_v_it_v_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_pos_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_pages_v_pos_v_heading_align" DEFAULT 'center',
  	"source" "enum___shared_pages_v_pos_v_source" DEFAULT 'manual',
  	"limit" numeric DEFAULT 3,
  	"layout" "enum___shared_pages_v_pos_v_layout" DEFAULT 'carousel',
  	"card_eyebrow" "enum___shared_pages_v_pos_v_card_eyebrow" DEFAULT 'category',
  	"appearance_background" "enum___shared_pages_v_pos_v_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_pages_v_pos_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"read_more_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_jli_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_pages_v_jli_v_heading_align" DEFAULT 'left',
  	"filters_search" boolean DEFAULT true,
  	"filters_department" boolean DEFAULT true,
  	"filters_location" boolean DEFAULT true,
  	"filters_job_type" boolean DEFAULT true,
  	"page_size" numeric DEFAULT 10,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_pages_v_jli_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"search_placeholder" varchar,
  	"empty_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "___shared_pages_v_jsh_v_btn_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum____shared_pages_v_jsh_v_btn_v_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum____shared_pages_v_jsh_v_btn_v_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "___shared_pages_v_jsh_v_btn_v_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_jsh_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_pages_v_jsh_v_heading_align" DEFAULT 'center',
  	"source" "enum___shared_pages_v_jsh_v_source" DEFAULT 'manual',
  	"limit" numeric DEFAULT 3,
  	"appearance_background" "enum___shared_pages_v_jsh_v_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_pages_v_jsh_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "___shared_pages_v_ird_v_nav_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum____shared_pages_v_ird_v_nav_v_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "___shared_pages_v_ird_v_nav_v_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_ird_v_document_types" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum___shared_pages_v_ird_v_document_types",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "__shared_pages_v_ird_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_pages_v_ird_v_heading_align" DEFAULT 'left',
  	"page_size" numeric DEFAULT 5,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_pages_v_ird_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "detail_templates_pt" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_detail_templates_pt_heading_align" DEFAULT 'center',
  	"default_tab" "enum_detail_templates_pt_default_tab" DEFAULT 'solutions',
  	"cta_card_link_type" "enum_detail_templates_pt_cta_card_link_type" DEFAULT 'internal',
  	"cta_card_link_new_tab" boolean DEFAULT false,
  	"cta_card_link_internal_path" varchar,
  	"cta_card_link_external_url" varchar,
  	"bottom_cta_first_type" "enum_detail_templates_pt_bottom_cta_first_type" DEFAULT 'internal',
  	"bottom_cta_first_new_tab" boolean DEFAULT false,
  	"bottom_cta_first_internal_path" varchar,
  	"bottom_cta_first_external_url" varchar,
  	"bottom_cta_first_style" "enum_detail_templates_pt_bottom_cta_first_style" DEFAULT 'primary',
  	"bottom_cta_second_type" "enum_detail_templates_pt_bottom_cta_second_type" DEFAULT 'internal',
  	"bottom_cta_second_new_tab" boolean DEFAULT false,
  	"bottom_cta_second_internal_path" varchar,
  	"bottom_cta_second_external_url" varchar,
  	"bottom_cta_second_style" "enum_detail_templates_pt_bottom_cta_second_style" DEFAULT 'primary',
  	"appearance_background" "enum_detail_templates_pt_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "detail_templates_pt_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"solutions_tab_label" varchar,
  	"products_tab_label" varchar,
  	"cta_card_text" varchar,
  	"cta_card_link_label" varchar,
  	"bottom_cta_title" varchar,
  	"bottom_cta_description" varchar,
  	"bottom_cta_first_label" varchar,
  	"bottom_cta_second_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_ps_btn" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_detail_templates_ps_btn_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_detail_templates_ps_btn_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "detail_templates_ps_btn_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_ps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_detail_templates_ps_heading_align" DEFAULT 'center',
  	"source" "enum_detail_templates_ps_source" DEFAULT 'manual',
  	"card_style" "enum_detail_templates_ps_card_style" DEFAULT 'imageCard',
  	"cta_card_link_type" "enum_detail_templates_ps_cta_card_link_type" DEFAULT 'internal',
  	"cta_card_link_new_tab" boolean DEFAULT false,
  	"cta_card_link_internal_path" varchar,
  	"cta_card_link_external_url" varchar,
  	"bottom_cta_first_type" "enum_detail_templates_ps_bottom_cta_first_type" DEFAULT 'internal',
  	"bottom_cta_first_new_tab" boolean DEFAULT false,
  	"bottom_cta_first_internal_path" varchar,
  	"bottom_cta_first_external_url" varchar,
  	"bottom_cta_first_style" "enum_detail_templates_ps_bottom_cta_first_style" DEFAULT 'primary',
  	"bottom_cta_second_type" "enum_detail_templates_ps_bottom_cta_second_type" DEFAULT 'internal',
  	"bottom_cta_second_new_tab" boolean DEFAULT false,
  	"bottom_cta_second_internal_path" varchar,
  	"bottom_cta_second_external_url" varchar,
  	"bottom_cta_second_style" "enum_detail_templates_ps_bottom_cta_second_style" DEFAULT 'primary',
  	"appearance_background" "enum_detail_templates_ps_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "detail_templates_ps_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"cta_card_text" varchar,
  	"cta_card_link_label" varchar,
  	"bottom_cta_title" varchar,
  	"bottom_cta_description" varchar,
  	"bottom_cta_first_label" varchar,
  	"bottom_cta_second_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_ss_btn" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_detail_templates_ss_btn_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_detail_templates_ss_btn_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "detail_templates_ss_btn_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_ss" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_detail_templates_ss_heading_align" DEFAULT 'center',
  	"source" "enum_detail_templates_ss_source" DEFAULT 'manual',
  	"card_style" "enum_detail_templates_ss_card_style" DEFAULT 'imageCard',
  	"cta_card_link_type" "enum_detail_templates_ss_cta_card_link_type" DEFAULT 'internal',
  	"cta_card_link_new_tab" boolean DEFAULT false,
  	"cta_card_link_internal_path" varchar,
  	"cta_card_link_external_url" varchar,
  	"bottom_cta_first_type" "enum_detail_templates_ss_bottom_cta_first_type" DEFAULT 'internal',
  	"bottom_cta_first_new_tab" boolean DEFAULT false,
  	"bottom_cta_first_internal_path" varchar,
  	"bottom_cta_first_external_url" varchar,
  	"bottom_cta_first_style" "enum_detail_templates_ss_bottom_cta_first_style" DEFAULT 'primary',
  	"bottom_cta_second_type" "enum_detail_templates_ss_bottom_cta_second_type" DEFAULT 'internal',
  	"bottom_cta_second_new_tab" boolean DEFAULT false,
  	"bottom_cta_second_internal_path" varchar,
  	"bottom_cta_second_external_url" varchar,
  	"bottom_cta_second_style" "enum_detail_templates_ss_bottom_cta_second_style" DEFAULT 'primary',
  	"appearance_background" "enum_detail_templates_ss_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "detail_templates_ss_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"cta_card_text" varchar,
  	"cta_card_link_label" varchar,
  	"bottom_cta_title" varchar,
  	"bottom_cta_description" varchar,
  	"bottom_cta_first_label" varchar,
  	"bottom_cta_second_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_pos_btn" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_detail_templates_pos_btn_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_detail_templates_pos_btn_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "detail_templates_pos_btn_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_pos_it" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "detail_templates_pos_it_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_pos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_detail_templates_pos_heading_align" DEFAULT 'center',
  	"source" "enum_detail_templates_pos_source" DEFAULT 'manual',
  	"limit" numeric DEFAULT 3,
  	"layout" "enum_detail_templates_pos_layout" DEFAULT 'carousel',
  	"card_eyebrow" "enum_detail_templates_pos_card_eyebrow" DEFAULT 'category',
  	"appearance_background" "enum_detail_templates_pos_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "detail_templates_pos_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"read_more_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_jli" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_detail_templates_jli_heading_align" DEFAULT 'left',
  	"filters_search" boolean DEFAULT true,
  	"filters_department" boolean DEFAULT true,
  	"filters_location" boolean DEFAULT true,
  	"filters_job_type" boolean DEFAULT true,
  	"page_size" numeric DEFAULT 10,
  	"block_name" varchar
  );
  
  CREATE TABLE "detail_templates_jli_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"search_placeholder" varchar,
  	"empty_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_jsh_btn" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_detail_templates_jsh_btn_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_detail_templates_jsh_btn_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "detail_templates_jsh_btn_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_jsh" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_detail_templates_jsh_heading_align" DEFAULT 'center',
  	"source" "enum_detail_templates_jsh_source" DEFAULT 'manual',
  	"limit" numeric DEFAULT 3,
  	"appearance_background" "enum_detail_templates_jsh_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "detail_templates_jsh_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_ird_nav" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_detail_templates_ird_nav_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar
  );
  
  CREATE TABLE "detail_templates_ird_nav_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "detail_templates_ird_document_types" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_detail_templates_ird_document_types",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "detail_templates_ird" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_detail_templates_ird_heading_align" DEFAULT 'left',
  	"page_size" numeric DEFAULT 5,
  	"block_name" varchar
  );
  
  CREATE TABLE "detail_templates_ird_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_pt_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___detail_templates_v_pt_v_heading_align" DEFAULT 'center',
  	"default_tab" "enum___detail_templates_v_pt_v_default_tab" DEFAULT 'solutions',
  	"cta_card_link_type" "enum___detail_templates_v_pt_v_cta_card_link_type" DEFAULT 'internal',
  	"cta_card_link_new_tab" boolean DEFAULT false,
  	"cta_card_link_internal_path" varchar,
  	"cta_card_link_external_url" varchar,
  	"bottom_cta_first_type" "enum___detail_templates_v_pt_v_bottom_cta_first_type" DEFAULT 'internal',
  	"bottom_cta_first_new_tab" boolean DEFAULT false,
  	"bottom_cta_first_internal_path" varchar,
  	"bottom_cta_first_external_url" varchar,
  	"bottom_cta_first_style" "enum___detail_templates_v_pt_v_bottom_cta_first_style" DEFAULT 'primary',
  	"bottom_cta_second_type" "enum___detail_templates_v_pt_v_bottom_cta_second_type" DEFAULT 'internal',
  	"bottom_cta_second_new_tab" boolean DEFAULT false,
  	"bottom_cta_second_internal_path" varchar,
  	"bottom_cta_second_external_url" varchar,
  	"bottom_cta_second_style" "enum___detail_templates_v_pt_v_bottom_cta_second_style" DEFAULT 'primary',
  	"appearance_background" "enum___detail_templates_v_pt_v_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__detail_templates_v_pt_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"solutions_tab_label" varchar,
  	"products_tab_label" varchar,
  	"cta_card_text" varchar,
  	"cta_card_link_label" varchar,
  	"bottom_cta_title" varchar,
  	"bottom_cta_description" varchar,
  	"bottom_cta_first_label" varchar,
  	"bottom_cta_second_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "___detail_templates_v_ps_v_btn_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum____detail_templates_v_ps_v_btn_v_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum____detail_templates_v_ps_v_btn_v_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "___detail_templates_v_ps_v_btn_v_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_ps_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___detail_templates_v_ps_v_heading_align" DEFAULT 'center',
  	"source" "enum___detail_templates_v_ps_v_source" DEFAULT 'manual',
  	"card_style" "enum___detail_templates_v_ps_v_card_style" DEFAULT 'imageCard',
  	"cta_card_link_type" "enum___detail_templates_v_ps_v_cta_card_link_type" DEFAULT 'internal',
  	"cta_card_link_new_tab" boolean DEFAULT false,
  	"cta_card_link_internal_path" varchar,
  	"cta_card_link_external_url" varchar,
  	"bottom_cta_first_type" "enum___detail_templates_v_ps_v_bottom_cta_first_type" DEFAULT 'internal',
  	"bottom_cta_first_new_tab" boolean DEFAULT false,
  	"bottom_cta_first_internal_path" varchar,
  	"bottom_cta_first_external_url" varchar,
  	"bottom_cta_first_style" "enum___detail_templates_v_ps_v_bottom_cta_first_style" DEFAULT 'primary',
  	"bottom_cta_second_type" "enum___detail_templates_v_ps_v_bottom_cta_second_type" DEFAULT 'internal',
  	"bottom_cta_second_new_tab" boolean DEFAULT false,
  	"bottom_cta_second_internal_path" varchar,
  	"bottom_cta_second_external_url" varchar,
  	"bottom_cta_second_style" "enum___detail_templates_v_ps_v_bottom_cta_second_style" DEFAULT 'primary',
  	"appearance_background" "enum___detail_templates_v_ps_v_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__detail_templates_v_ps_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"cta_card_text" varchar,
  	"cta_card_link_label" varchar,
  	"bottom_cta_title" varchar,
  	"bottom_cta_description" varchar,
  	"bottom_cta_first_label" varchar,
  	"bottom_cta_second_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "___detail_templates_v_ss_v_btn_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum____detail_templates_v_ss_v_btn_v_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum____detail_templates_v_ss_v_btn_v_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "___detail_templates_v_ss_v_btn_v_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_ss_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___detail_templates_v_ss_v_heading_align" DEFAULT 'center',
  	"source" "enum___detail_templates_v_ss_v_source" DEFAULT 'manual',
  	"card_style" "enum___detail_templates_v_ss_v_card_style" DEFAULT 'imageCard',
  	"cta_card_link_type" "enum___detail_templates_v_ss_v_cta_card_link_type" DEFAULT 'internal',
  	"cta_card_link_new_tab" boolean DEFAULT false,
  	"cta_card_link_internal_path" varchar,
  	"cta_card_link_external_url" varchar,
  	"bottom_cta_first_type" "enum___detail_templates_v_ss_v_bottom_cta_first_type" DEFAULT 'internal',
  	"bottom_cta_first_new_tab" boolean DEFAULT false,
  	"bottom_cta_first_internal_path" varchar,
  	"bottom_cta_first_external_url" varchar,
  	"bottom_cta_first_style" "enum___detail_templates_v_ss_v_bottom_cta_first_style" DEFAULT 'primary',
  	"bottom_cta_second_type" "enum___detail_templates_v_ss_v_bottom_cta_second_type" DEFAULT 'internal',
  	"bottom_cta_second_new_tab" boolean DEFAULT false,
  	"bottom_cta_second_internal_path" varchar,
  	"bottom_cta_second_external_url" varchar,
  	"bottom_cta_second_style" "enum___detail_templates_v_ss_v_bottom_cta_second_style" DEFAULT 'primary',
  	"appearance_background" "enum___detail_templates_v_ss_v_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__detail_templates_v_ss_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"cta_card_text" varchar,
  	"cta_card_link_label" varchar,
  	"bottom_cta_title" varchar,
  	"bottom_cta_description" varchar,
  	"bottom_cta_first_label" varchar,
  	"bottom_cta_second_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "___detail_templates_v_pos_v_btn_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum____detail_templates_v_pos_v_btn_v_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum____detail_templates_v_pos_v_btn_v_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "___detail_templates_v_pos_v_btn_v_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "___detail_templates_v_pos_v_it_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "___detail_templates_v_pos_v_it_v_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_pos_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___detail_templates_v_pos_v_heading_align" DEFAULT 'center',
  	"source" "enum___detail_templates_v_pos_v_source" DEFAULT 'manual',
  	"limit" numeric DEFAULT 3,
  	"layout" "enum___detail_templates_v_pos_v_layout" DEFAULT 'carousel',
  	"card_eyebrow" "enum___detail_templates_v_pos_v_card_eyebrow" DEFAULT 'category',
  	"appearance_background" "enum___detail_templates_v_pos_v_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__detail_templates_v_pos_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"read_more_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_jli_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___detail_templates_v_jli_v_heading_align" DEFAULT 'left',
  	"filters_search" boolean DEFAULT true,
  	"filters_department" boolean DEFAULT true,
  	"filters_location" boolean DEFAULT true,
  	"filters_job_type" boolean DEFAULT true,
  	"page_size" numeric DEFAULT 10,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__detail_templates_v_jli_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"search_placeholder" varchar,
  	"empty_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "___detail_templates_v_jsh_v_btn_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum____detail_templates_v_jsh_v_btn_v_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum____detail_templates_v_jsh_v_btn_v_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "___detail_templates_v_jsh_v_btn_v_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_jsh_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___detail_templates_v_jsh_v_heading_align" DEFAULT 'center',
  	"source" "enum___detail_templates_v_jsh_v_source" DEFAULT 'manual',
  	"limit" numeric DEFAULT 3,
  	"appearance_background" "enum___detail_templates_v_jsh_v_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__detail_templates_v_jsh_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "___detail_templates_v_ird_v_nav_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum____detail_templates_v_ird_v_nav_v_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "___detail_templates_v_ird_v_nav_v_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_ird_v_document_types" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum___detail_templates_v_ird_v_document_types",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "__detail_templates_v_ird_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___detail_templates_v_ird_v_heading_align" DEFAULT 'left',
  	"page_size" numeric DEFAULT 5,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__detail_templates_v_ird_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_pt" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_detail_templates_pt_heading_align" DEFAULT 'center',
  	"default_tab" "enum_shared_detail_templates_pt_default_tab" DEFAULT 'solutions',
  	"cta_card_link_type" "enum_shared_detail_templates_pt_cta_card_link_type" DEFAULT 'internal',
  	"cta_card_link_new_tab" boolean DEFAULT false,
  	"cta_card_link_internal_path" varchar,
  	"cta_card_link_external_url" varchar,
  	"bottom_cta_first_type" "enum_shared_detail_templates_pt_bottom_cta_first_type" DEFAULT 'internal',
  	"bottom_cta_first_new_tab" boolean DEFAULT false,
  	"bottom_cta_first_internal_path" varchar,
  	"bottom_cta_first_external_url" varchar,
  	"bottom_cta_first_style" "enum_shared_detail_templates_pt_bottom_cta_first_style" DEFAULT 'primary',
  	"bottom_cta_second_type" "enum_shared_detail_templates_pt_bottom_cta_second_type" DEFAULT 'internal',
  	"bottom_cta_second_new_tab" boolean DEFAULT false,
  	"bottom_cta_second_internal_path" varchar,
  	"bottom_cta_second_external_url" varchar,
  	"bottom_cta_second_style" "enum_shared_detail_templates_pt_bottom_cta_second_style" DEFAULT 'primary',
  	"appearance_background" "enum_shared_detail_templates_pt_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_detail_templates_pt_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"solutions_tab_label" varchar,
  	"products_tab_label" varchar,
  	"cta_card_text" varchar,
  	"cta_card_link_label" varchar,
  	"bottom_cta_title" varchar,
  	"bottom_cta_description" varchar,
  	"bottom_cta_first_label" varchar,
  	"bottom_cta_second_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_ps_btn" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_shared_detail_templates_ps_btn_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_shared_detail_templates_ps_btn_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "shared_detail_templates_ps_btn_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_ps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_detail_templates_ps_heading_align" DEFAULT 'center',
  	"source" "enum_shared_detail_templates_ps_source" DEFAULT 'manual',
  	"card_style" "enum_shared_detail_templates_ps_card_style" DEFAULT 'imageCard',
  	"cta_card_link_type" "enum_shared_detail_templates_ps_cta_card_link_type" DEFAULT 'internal',
  	"cta_card_link_new_tab" boolean DEFAULT false,
  	"cta_card_link_internal_path" varchar,
  	"cta_card_link_external_url" varchar,
  	"bottom_cta_first_type" "enum_shared_detail_templates_ps_bottom_cta_first_type" DEFAULT 'internal',
  	"bottom_cta_first_new_tab" boolean DEFAULT false,
  	"bottom_cta_first_internal_path" varchar,
  	"bottom_cta_first_external_url" varchar,
  	"bottom_cta_first_style" "enum_shared_detail_templates_ps_bottom_cta_first_style" DEFAULT 'primary',
  	"bottom_cta_second_type" "enum_shared_detail_templates_ps_bottom_cta_second_type" DEFAULT 'internal',
  	"bottom_cta_second_new_tab" boolean DEFAULT false,
  	"bottom_cta_second_internal_path" varchar,
  	"bottom_cta_second_external_url" varchar,
  	"bottom_cta_second_style" "enum_shared_detail_templates_ps_bottom_cta_second_style" DEFAULT 'primary',
  	"appearance_background" "enum_shared_detail_templates_ps_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_detail_templates_ps_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"cta_card_text" varchar,
  	"cta_card_link_label" varchar,
  	"bottom_cta_title" varchar,
  	"bottom_cta_description" varchar,
  	"bottom_cta_first_label" varchar,
  	"bottom_cta_second_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_ss_btn" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_shared_detail_templates_ss_btn_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_shared_detail_templates_ss_btn_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "shared_detail_templates_ss_btn_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_ss" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_detail_templates_ss_heading_align" DEFAULT 'center',
  	"source" "enum_shared_detail_templates_ss_source" DEFAULT 'manual',
  	"card_style" "enum_shared_detail_templates_ss_card_style" DEFAULT 'imageCard',
  	"cta_card_link_type" "enum_shared_detail_templates_ss_cta_card_link_type" DEFAULT 'internal',
  	"cta_card_link_new_tab" boolean DEFAULT false,
  	"cta_card_link_internal_path" varchar,
  	"cta_card_link_external_url" varchar,
  	"bottom_cta_first_type" "enum_shared_detail_templates_ss_bottom_cta_first_type" DEFAULT 'internal',
  	"bottom_cta_first_new_tab" boolean DEFAULT false,
  	"bottom_cta_first_internal_path" varchar,
  	"bottom_cta_first_external_url" varchar,
  	"bottom_cta_first_style" "enum_shared_detail_templates_ss_bottom_cta_first_style" DEFAULT 'primary',
  	"bottom_cta_second_type" "enum_shared_detail_templates_ss_bottom_cta_second_type" DEFAULT 'internal',
  	"bottom_cta_second_new_tab" boolean DEFAULT false,
  	"bottom_cta_second_internal_path" varchar,
  	"bottom_cta_second_external_url" varchar,
  	"bottom_cta_second_style" "enum_shared_detail_templates_ss_bottom_cta_second_style" DEFAULT 'primary',
  	"appearance_background" "enum_shared_detail_templates_ss_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_detail_templates_ss_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"cta_card_text" varchar,
  	"cta_card_link_label" varchar,
  	"bottom_cta_title" varchar,
  	"bottom_cta_description" varchar,
  	"bottom_cta_first_label" varchar,
  	"bottom_cta_second_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_pos_btn" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_shared_detail_templates_pos_btn_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_shared_detail_templates_pos_btn_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "shared_detail_templates_pos_btn_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_pos_it" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "shared_detail_templates_pos_it_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_pos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_detail_templates_pos_heading_align" DEFAULT 'center',
  	"source" "enum_shared_detail_templates_pos_source" DEFAULT 'manual',
  	"limit" numeric DEFAULT 3,
  	"layout" "enum_shared_detail_templates_pos_layout" DEFAULT 'carousel',
  	"card_eyebrow" "enum_shared_detail_templates_pos_card_eyebrow" DEFAULT 'category',
  	"appearance_background" "enum_shared_detail_templates_pos_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_detail_templates_pos_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"read_more_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_jli" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_detail_templates_jli_heading_align" DEFAULT 'left',
  	"filters_search" boolean DEFAULT true,
  	"filters_department" boolean DEFAULT true,
  	"filters_location" boolean DEFAULT true,
  	"filters_job_type" boolean DEFAULT true,
  	"page_size" numeric DEFAULT 10,
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_detail_templates_jli_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"search_placeholder" varchar,
  	"empty_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_jsh_btn" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_shared_detail_templates_jsh_btn_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum_shared_detail_templates_jsh_btn_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "shared_detail_templates_jsh_btn_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_jsh" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_detail_templates_jsh_heading_align" DEFAULT 'center',
  	"source" "enum_shared_detail_templates_jsh_source" DEFAULT 'manual',
  	"limit" numeric DEFAULT 3,
  	"appearance_background" "enum_shared_detail_templates_jsh_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_detail_templates_jsh_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_ird_nav" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_shared_detail_templates_ird_nav_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar
  );
  
  CREATE TABLE "shared_detail_templates_ird_nav_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_ird_document_types" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_shared_detail_templates_ird_document_types",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "shared_detail_templates_ird" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading_align" "enum_shared_detail_templates_ird_heading_align" DEFAULT 'left',
  	"page_size" numeric DEFAULT 5,
  	"block_name" varchar
  );
  
  CREATE TABLE "shared_detail_templates_ird_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_pt_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_detail_templates_v_pt_v_heading_align" DEFAULT 'center',
  	"default_tab" "enum___shared_detail_templates_v_pt_v_default_tab" DEFAULT 'solutions',
  	"cta_card_link_type" "enum___shared_detail_templates_v_pt_v_cta_card_link_type" DEFAULT 'internal',
  	"cta_card_link_new_tab" boolean DEFAULT false,
  	"cta_card_link_internal_path" varchar,
  	"cta_card_link_external_url" varchar,
  	"bottom_cta_first_type" "enum___shared_detail_templates_v_pt_v_bottom_cta_first_type" DEFAULT 'internal',
  	"bottom_cta_first_new_tab" boolean DEFAULT false,
  	"bottom_cta_first_internal_path" varchar,
  	"bottom_cta_first_external_url" varchar,
  	"bottom_cta_first_style" "enum___shared_detail_templates_v_pt_v_bottom_cta_first_style" DEFAULT 'primary',
  	"bottom_cta_second_type" "enum___shared_detail_templates_v_pt_v_bottom_cta_second_type" DEFAULT 'internal',
  	"bottom_cta_second_new_tab" boolean DEFAULT false,
  	"bottom_cta_second_internal_path" varchar,
  	"bottom_cta_second_external_url" varchar,
  	"bottom_cta_second_style" "enum___shared_detail_templates_v_pt_v_bottom_cta_second_style" DEFAULT 'primary',
  	"appearance_background" "enum___shared_detail_templates_v_pt_v_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_pt_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"solutions_tab_label" varchar,
  	"products_tab_label" varchar,
  	"cta_card_text" varchar,
  	"cta_card_link_label" varchar,
  	"bottom_cta_title" varchar,
  	"bottom_cta_description" varchar,
  	"bottom_cta_first_label" varchar,
  	"bottom_cta_second_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "___shared_detail_templates_v_ps_v_btn_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum____shared_detail_templates_v_ps_v_btn_v_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum____shared_detail_templates_v_ps_v_btn_v_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "___shared_detail_templates_v_ps_v_btn_v_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_ps_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_detail_templates_v_ps_v_heading_align" DEFAULT 'center',
  	"source" "enum___shared_detail_templates_v_ps_v_source" DEFAULT 'manual',
  	"card_style" "enum___shared_detail_templates_v_ps_v_card_style" DEFAULT 'imageCard',
  	"cta_card_link_type" "enum___shared_detail_templates_v_ps_v_cta_card_link_type" DEFAULT 'internal',
  	"cta_card_link_new_tab" boolean DEFAULT false,
  	"cta_card_link_internal_path" varchar,
  	"cta_card_link_external_url" varchar,
  	"bottom_cta_first_type" "enum___shared_detail_templates_v_ps_v_bottom_cta_first_type" DEFAULT 'internal',
  	"bottom_cta_first_new_tab" boolean DEFAULT false,
  	"bottom_cta_first_internal_path" varchar,
  	"bottom_cta_first_external_url" varchar,
  	"bottom_cta_first_style" "enum___shared_detail_templates_v_ps_v_bottom_cta_first_style" DEFAULT 'primary',
  	"bottom_cta_second_type" "enum___shared_detail_templates_v_ps_v_bottom_cta_second_type" DEFAULT 'internal',
  	"bottom_cta_second_new_tab" boolean DEFAULT false,
  	"bottom_cta_second_internal_path" varchar,
  	"bottom_cta_second_external_url" varchar,
  	"bottom_cta_second_style" "enum___shared_detail_templates_v_ps_v_bottom_cta_second_style" DEFAULT 'primary',
  	"appearance_background" "enum___shared_detail_templates_v_ps_v_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_ps_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"cta_card_text" varchar,
  	"cta_card_link_label" varchar,
  	"bottom_cta_title" varchar,
  	"bottom_cta_description" varchar,
  	"bottom_cta_first_label" varchar,
  	"bottom_cta_second_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "___shared_detail_templates_v_ss_v_btn_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum____shared_detail_templates_v_ss_v_btn_v_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum____shared_detail_templates_v_ss_v_btn_v_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "___shared_detail_templates_v_ss_v_btn_v_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_ss_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_detail_templates_v_ss_v_heading_align" DEFAULT 'center',
  	"source" "enum___shared_detail_templates_v_ss_v_source" DEFAULT 'manual',
  	"card_style" "enum___shared_detail_templates_v_ss_v_card_style" DEFAULT 'imageCard',
  	"cta_card_link_type" "enum___shared_detail_templates_v_ss_v_cta_card_link_type" DEFAULT 'internal',
  	"cta_card_link_new_tab" boolean DEFAULT false,
  	"cta_card_link_internal_path" varchar,
  	"cta_card_link_external_url" varchar,
  	"bottom_cta_first_type" "enum___shared_detail_templates_v_ss_v_bottom_cta_first_type" DEFAULT 'internal',
  	"bottom_cta_first_new_tab" boolean DEFAULT false,
  	"bottom_cta_first_internal_path" varchar,
  	"bottom_cta_first_external_url" varchar,
  	"bottom_cta_first_style" "enum___shared_detail_templates_v_ss_v_bottom_cta_first_style" DEFAULT 'primary',
  	"bottom_cta_second_type" "enum___shared_detail_templates_v_ss_v_bottom_cta_second_type" DEFAULT 'internal',
  	"bottom_cta_second_new_tab" boolean DEFAULT false,
  	"bottom_cta_second_internal_path" varchar,
  	"bottom_cta_second_external_url" varchar,
  	"bottom_cta_second_style" "enum___shared_detail_templates_v_ss_v_bottom_cta_second_style" DEFAULT 'primary',
  	"appearance_background" "enum___shared_detail_templates_v_ss_v_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_ss_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"cta_card_text" varchar,
  	"cta_card_link_label" varchar,
  	"bottom_cta_title" varchar,
  	"bottom_cta_description" varchar,
  	"bottom_cta_first_label" varchar,
  	"bottom_cta_second_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "___shared_detail_templates_v_pos_v_btn_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum____shared_detail_templates_v_pos_v_btn_v_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum____shared_detail_templates_v_pos_v_btn_v_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "___shared_detail_templates_v_pos_v_btn_v_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "___shared_detail_templates_v_pos_v_it_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "___shared_detail_templates_v_pos_v_it_v_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_pos_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_detail_templates_v_pos_v_heading_align" DEFAULT 'center',
  	"source" "enum___shared_detail_templates_v_pos_v_source" DEFAULT 'manual',
  	"limit" numeric DEFAULT 3,
  	"layout" "enum___shared_detail_templates_v_pos_v_layout" DEFAULT 'carousel',
  	"card_eyebrow" "enum___shared_detail_templates_v_pos_v_card_eyebrow" DEFAULT 'category',
  	"appearance_background" "enum___shared_detail_templates_v_pos_v_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_pos_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"read_more_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_jli_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_detail_templates_v_jli_v_heading_align" DEFAULT 'left',
  	"filters_search" boolean DEFAULT true,
  	"filters_department" boolean DEFAULT true,
  	"filters_location" boolean DEFAULT true,
  	"filters_job_type" boolean DEFAULT true,
  	"page_size" numeric DEFAULT 10,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_jli_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"search_placeholder" varchar,
  	"empty_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "___shared_detail_templates_v_jsh_v_btn_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum____shared_detail_templates_v_jsh_v_btn_v_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"style" "enum____shared_detail_templates_v_jsh_v_btn_v_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "___shared_detail_templates_v_jsh_v_btn_v_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_jsh_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_detail_templates_v_jsh_v_heading_align" DEFAULT 'center',
  	"source" "enum___shared_detail_templates_v_jsh_v_source" DEFAULT 'manual',
  	"limit" numeric DEFAULT 3,
  	"appearance_background" "enum___shared_detail_templates_v_jsh_v_appearance_background" DEFAULT 'default',
  	"appearance_background_image_id" integer,
  	"appearance_anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_jsh_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "___shared_detail_templates_v_ird_v_nav_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum____shared_detail_templates_v_ird_v_nav_v_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_internal_path" varchar,
  	"link_external_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "___shared_detail_templates_v_ird_v_nav_v_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_ird_v_document_types" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum___shared_detail_templates_v_ird_v_document_types",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "__shared_detail_templates_v_ird_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading_align" "enum___shared_detail_templates_v_ird_v_heading_align" DEFAULT 'left',
  	"page_size" numeric DEFAULT 5,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "__shared_detail_templates_v_ird_v_locales" (
  	"heading_eyebrow" varchar,
  	"heading_title" jsonb,
  	"heading_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages_pt" ADD CONSTRAINT "pages_pt_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_pt" ADD CONSTRAINT "pages_pt_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_pt_locales" ADD CONSTRAINT "pages_pt_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_pt"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_ps_btn" ADD CONSTRAINT "pages_ps_btn_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_ps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_ps_btn_locales" ADD CONSTRAINT "pages_ps_btn_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_ps_btn"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_ps" ADD CONSTRAINT "pages_ps_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_ps" ADD CONSTRAINT "pages_ps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_ps_locales" ADD CONSTRAINT "pages_ps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_ps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_ss_btn" ADD CONSTRAINT "pages_ss_btn_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_ss"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_ss_btn_locales" ADD CONSTRAINT "pages_ss_btn_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_ss_btn"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_ss" ADD CONSTRAINT "pages_ss_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_ss" ADD CONSTRAINT "pages_ss_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_ss_locales" ADD CONSTRAINT "pages_ss_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_ss"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_pos_btn" ADD CONSTRAINT "pages_pos_btn_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_pos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_pos_btn_locales" ADD CONSTRAINT "pages_pos_btn_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_pos_btn"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_pos_it" ADD CONSTRAINT "pages_pos_it_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_pos_it" ADD CONSTRAINT "pages_pos_it_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_pos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_pos_it_locales" ADD CONSTRAINT "pages_pos_it_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_pos_it"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_pos" ADD CONSTRAINT "pages_pos_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_pos" ADD CONSTRAINT "pages_pos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_pos_locales" ADD CONSTRAINT "pages_pos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_pos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_jli" ADD CONSTRAINT "pages_jli_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_jli_locales" ADD CONSTRAINT "pages_jli_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_jli"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_jsh_btn" ADD CONSTRAINT "pages_jsh_btn_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_jsh"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_jsh_btn_locales" ADD CONSTRAINT "pages_jsh_btn_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_jsh_btn"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_jsh" ADD CONSTRAINT "pages_jsh_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_jsh" ADD CONSTRAINT "pages_jsh_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_jsh_locales" ADD CONSTRAINT "pages_jsh_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_jsh"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_ird_nav" ADD CONSTRAINT "pages_ird_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_ird"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_ird_nav_locales" ADD CONSTRAINT "pages_ird_nav_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_ird_nav"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_ird_document_types" ADD CONSTRAINT "pages_ird_document_types_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages_ird"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_ird" ADD CONSTRAINT "pages_ird_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_ird_locales" ADD CONSTRAINT "pages_ird_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_ird"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_pt_v" ADD CONSTRAINT "__pages_v_pt_v_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__pages_v_pt_v" ADD CONSTRAINT "__pages_v_pt_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_pt_v_locales" ADD CONSTRAINT "__pages_v_pt_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_pt_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___pages_v_ps_v_btn_v" ADD CONSTRAINT "___pages_v_ps_v_btn_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_ps_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___pages_v_ps_v_btn_v_locales" ADD CONSTRAINT "___pages_v_ps_v_btn_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___pages_v_ps_v_btn_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_ps_v" ADD CONSTRAINT "__pages_v_ps_v_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__pages_v_ps_v" ADD CONSTRAINT "__pages_v_ps_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_ps_v_locales" ADD CONSTRAINT "__pages_v_ps_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_ps_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___pages_v_ss_v_btn_v" ADD CONSTRAINT "___pages_v_ss_v_btn_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_ss_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___pages_v_ss_v_btn_v_locales" ADD CONSTRAINT "___pages_v_ss_v_btn_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___pages_v_ss_v_btn_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_ss_v" ADD CONSTRAINT "__pages_v_ss_v_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__pages_v_ss_v" ADD CONSTRAINT "__pages_v_ss_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_ss_v_locales" ADD CONSTRAINT "__pages_v_ss_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_ss_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___pages_v_pos_v_btn_v" ADD CONSTRAINT "___pages_v_pos_v_btn_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_pos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___pages_v_pos_v_btn_v_locales" ADD CONSTRAINT "___pages_v_pos_v_btn_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___pages_v_pos_v_btn_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___pages_v_pos_v_it_v" ADD CONSTRAINT "___pages_v_pos_v_it_v_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "___pages_v_pos_v_it_v" ADD CONSTRAINT "___pages_v_pos_v_it_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_pos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___pages_v_pos_v_it_v_locales" ADD CONSTRAINT "___pages_v_pos_v_it_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___pages_v_pos_v_it_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_pos_v" ADD CONSTRAINT "__pages_v_pos_v_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__pages_v_pos_v" ADD CONSTRAINT "__pages_v_pos_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_pos_v_locales" ADD CONSTRAINT "__pages_v_pos_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_pos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_jli_v" ADD CONSTRAINT "__pages_v_jli_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_jli_v_locales" ADD CONSTRAINT "__pages_v_jli_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_jli_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___pages_v_jsh_v_btn_v" ADD CONSTRAINT "___pages_v_jsh_v_btn_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_jsh_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___pages_v_jsh_v_btn_v_locales" ADD CONSTRAINT "___pages_v_jsh_v_btn_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___pages_v_jsh_v_btn_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_jsh_v" ADD CONSTRAINT "__pages_v_jsh_v_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__pages_v_jsh_v" ADD CONSTRAINT "__pages_v_jsh_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_jsh_v_locales" ADD CONSTRAINT "__pages_v_jsh_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_jsh_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___pages_v_ird_v_nav_v" ADD CONSTRAINT "___pages_v_ird_v_nav_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_ird_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___pages_v_ird_v_nav_v_locales" ADD CONSTRAINT "___pages_v_ird_v_nav_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___pages_v_ird_v_nav_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_ird_v_document_types" ADD CONSTRAINT "__pages_v_ird_v_document_types_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."__pages_v_ird_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_ird_v" ADD CONSTRAINT "__pages_v_ird_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__pages_v_ird_v_locales" ADD CONSTRAINT "__pages_v_ird_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__pages_v_ird_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_pt" ADD CONSTRAINT "shared_pages_pt_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_pages_pt" ADD CONSTRAINT "shared_pages_pt_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_pt_locales" ADD CONSTRAINT "shared_pages_pt_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_pt"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_ps_btn" ADD CONSTRAINT "shared_pages_ps_btn_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_ps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_ps_btn_locales" ADD CONSTRAINT "shared_pages_ps_btn_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_ps_btn"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_ps" ADD CONSTRAINT "shared_pages_ps_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_pages_ps" ADD CONSTRAINT "shared_pages_ps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_ps_locales" ADD CONSTRAINT "shared_pages_ps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_ps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_ss_btn" ADD CONSTRAINT "shared_pages_ss_btn_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_ss"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_ss_btn_locales" ADD CONSTRAINT "shared_pages_ss_btn_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_ss_btn"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_ss" ADD CONSTRAINT "shared_pages_ss_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_pages_ss" ADD CONSTRAINT "shared_pages_ss_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_ss_locales" ADD CONSTRAINT "shared_pages_ss_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_ss"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_pos_btn" ADD CONSTRAINT "shared_pages_pos_btn_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_pos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_pos_btn_locales" ADD CONSTRAINT "shared_pages_pos_btn_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_pos_btn"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_pos_it" ADD CONSTRAINT "shared_pages_pos_it_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_pages_pos_it" ADD CONSTRAINT "shared_pages_pos_it_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_pos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_pos_it_locales" ADD CONSTRAINT "shared_pages_pos_it_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_pos_it"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_pos" ADD CONSTRAINT "shared_pages_pos_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_pages_pos" ADD CONSTRAINT "shared_pages_pos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_pos_locales" ADD CONSTRAINT "shared_pages_pos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_pos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_jli" ADD CONSTRAINT "shared_pages_jli_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_jli_locales" ADD CONSTRAINT "shared_pages_jli_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_jli"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_jsh_btn" ADD CONSTRAINT "shared_pages_jsh_btn_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_jsh"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_jsh_btn_locales" ADD CONSTRAINT "shared_pages_jsh_btn_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_jsh_btn"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_jsh" ADD CONSTRAINT "shared_pages_jsh_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_pages_jsh" ADD CONSTRAINT "shared_pages_jsh_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_jsh_locales" ADD CONSTRAINT "shared_pages_jsh_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_jsh"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_ird_nav" ADD CONSTRAINT "shared_pages_ird_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_ird"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_ird_nav_locales" ADD CONSTRAINT "shared_pages_ird_nav_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_ird_nav"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_ird_document_types" ADD CONSTRAINT "shared_pages_ird_document_types_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."shared_pages_ird"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_ird" ADD CONSTRAINT "shared_pages_ird_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_pages_ird_locales" ADD CONSTRAINT "shared_pages_ird_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_pages_ird"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_pt_v" ADD CONSTRAINT "__shared_pages_v_pt_v_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_pt_v" ADD CONSTRAINT "__shared_pages_v_pt_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_pt_v_locales" ADD CONSTRAINT "__shared_pages_v_pt_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_pt_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_pages_v_ps_v_btn_v" ADD CONSTRAINT "___shared_pages_v_ps_v_btn_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_ps_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_pages_v_ps_v_btn_v_locales" ADD CONSTRAINT "___shared_pages_v_ps_v_btn_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___shared_pages_v_ps_v_btn_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_ps_v" ADD CONSTRAINT "__shared_pages_v_ps_v_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_ps_v" ADD CONSTRAINT "__shared_pages_v_ps_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_ps_v_locales" ADD CONSTRAINT "__shared_pages_v_ps_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_ps_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_pages_v_ss_v_btn_v" ADD CONSTRAINT "___shared_pages_v_ss_v_btn_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_ss_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_pages_v_ss_v_btn_v_locales" ADD CONSTRAINT "___shared_pages_v_ss_v_btn_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___shared_pages_v_ss_v_btn_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_ss_v" ADD CONSTRAINT "__shared_pages_v_ss_v_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_ss_v" ADD CONSTRAINT "__shared_pages_v_ss_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_ss_v_locales" ADD CONSTRAINT "__shared_pages_v_ss_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_ss_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_pages_v_pos_v_btn_v" ADD CONSTRAINT "___shared_pages_v_pos_v_btn_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_pos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_pages_v_pos_v_btn_v_locales" ADD CONSTRAINT "___shared_pages_v_pos_v_btn_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___shared_pages_v_pos_v_btn_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_pages_v_pos_v_it_v" ADD CONSTRAINT "___shared_pages_v_pos_v_it_v_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "___shared_pages_v_pos_v_it_v" ADD CONSTRAINT "___shared_pages_v_pos_v_it_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_pos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_pages_v_pos_v_it_v_locales" ADD CONSTRAINT "___shared_pages_v_pos_v_it_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___shared_pages_v_pos_v_it_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_pos_v" ADD CONSTRAINT "__shared_pages_v_pos_v_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_pos_v" ADD CONSTRAINT "__shared_pages_v_pos_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_pos_v_locales" ADD CONSTRAINT "__shared_pages_v_pos_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_pos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_jli_v" ADD CONSTRAINT "__shared_pages_v_jli_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_jli_v_locales" ADD CONSTRAINT "__shared_pages_v_jli_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_jli_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_pages_v_jsh_v_btn_v" ADD CONSTRAINT "___shared_pages_v_jsh_v_btn_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_jsh_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_pages_v_jsh_v_btn_v_locales" ADD CONSTRAINT "___shared_pages_v_jsh_v_btn_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___shared_pages_v_jsh_v_btn_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_jsh_v" ADD CONSTRAINT "__shared_pages_v_jsh_v_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_jsh_v" ADD CONSTRAINT "__shared_pages_v_jsh_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_jsh_v_locales" ADD CONSTRAINT "__shared_pages_v_jsh_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_jsh_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_pages_v_ird_v_nav_v" ADD CONSTRAINT "___shared_pages_v_ird_v_nav_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_ird_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_pages_v_ird_v_nav_v_locales" ADD CONSTRAINT "___shared_pages_v_ird_v_nav_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___shared_pages_v_ird_v_nav_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_ird_v_document_types" ADD CONSTRAINT "__shared_pages_v_ird_v_document_types_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."__shared_pages_v_ird_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_ird_v" ADD CONSTRAINT "__shared_pages_v_ird_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_pages_v_ird_v_locales" ADD CONSTRAINT "__shared_pages_v_ird_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_pages_v_ird_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_pt" ADD CONSTRAINT "detail_templates_pt_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "detail_templates_pt" ADD CONSTRAINT "detail_templates_pt_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_pt_locales" ADD CONSTRAINT "detail_templates_pt_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_pt"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_ps_btn" ADD CONSTRAINT "detail_templates_ps_btn_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_ps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_ps_btn_locales" ADD CONSTRAINT "detail_templates_ps_btn_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_ps_btn"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_ps" ADD CONSTRAINT "detail_templates_ps_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "detail_templates_ps" ADD CONSTRAINT "detail_templates_ps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_ps_locales" ADD CONSTRAINT "detail_templates_ps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_ps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_ss_btn" ADD CONSTRAINT "detail_templates_ss_btn_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_ss"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_ss_btn_locales" ADD CONSTRAINT "detail_templates_ss_btn_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_ss_btn"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_ss" ADD CONSTRAINT "detail_templates_ss_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "detail_templates_ss" ADD CONSTRAINT "detail_templates_ss_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_ss_locales" ADD CONSTRAINT "detail_templates_ss_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_ss"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_pos_btn" ADD CONSTRAINT "detail_templates_pos_btn_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_pos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_pos_btn_locales" ADD CONSTRAINT "detail_templates_pos_btn_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_pos_btn"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_pos_it" ADD CONSTRAINT "detail_templates_pos_it_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "detail_templates_pos_it" ADD CONSTRAINT "detail_templates_pos_it_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_pos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_pos_it_locales" ADD CONSTRAINT "detail_templates_pos_it_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_pos_it"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_pos" ADD CONSTRAINT "detail_templates_pos_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "detail_templates_pos" ADD CONSTRAINT "detail_templates_pos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_pos_locales" ADD CONSTRAINT "detail_templates_pos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_pos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_jli" ADD CONSTRAINT "detail_templates_jli_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_jli_locales" ADD CONSTRAINT "detail_templates_jli_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_jli"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_jsh_btn" ADD CONSTRAINT "detail_templates_jsh_btn_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_jsh"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_jsh_btn_locales" ADD CONSTRAINT "detail_templates_jsh_btn_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_jsh_btn"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_jsh" ADD CONSTRAINT "detail_templates_jsh_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "detail_templates_jsh" ADD CONSTRAINT "detail_templates_jsh_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_jsh_locales" ADD CONSTRAINT "detail_templates_jsh_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_jsh"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_ird_nav" ADD CONSTRAINT "detail_templates_ird_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_ird"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_ird_nav_locales" ADD CONSTRAINT "detail_templates_ird_nav_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_ird_nav"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_ird_document_types" ADD CONSTRAINT "detail_templates_ird_document_types_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."detail_templates_ird"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_ird" ADD CONSTRAINT "detail_templates_ird_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "detail_templates_ird_locales" ADD CONSTRAINT "detail_templates_ird_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."detail_templates_ird"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_pt_v" ADD CONSTRAINT "__detail_templates_v_pt_v_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_pt_v" ADD CONSTRAINT "__detail_templates_v_pt_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_pt_v_locales" ADD CONSTRAINT "__detail_templates_v_pt_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_pt_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___detail_templates_v_ps_v_btn_v" ADD CONSTRAINT "___detail_templates_v_ps_v_btn_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_ps_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___detail_templates_v_ps_v_btn_v_locales" ADD CONSTRAINT "___detail_templates_v_ps_v_btn_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___detail_templates_v_ps_v_btn_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_ps_v" ADD CONSTRAINT "__detail_templates_v_ps_v_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_ps_v" ADD CONSTRAINT "__detail_templates_v_ps_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_ps_v_locales" ADD CONSTRAINT "__detail_templates_v_ps_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_ps_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___detail_templates_v_ss_v_btn_v" ADD CONSTRAINT "___detail_templates_v_ss_v_btn_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_ss_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___detail_templates_v_ss_v_btn_v_locales" ADD CONSTRAINT "___detail_templates_v_ss_v_btn_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___detail_templates_v_ss_v_btn_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_ss_v" ADD CONSTRAINT "__detail_templates_v_ss_v_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_ss_v" ADD CONSTRAINT "__detail_templates_v_ss_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_ss_v_locales" ADD CONSTRAINT "__detail_templates_v_ss_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_ss_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___detail_templates_v_pos_v_btn_v" ADD CONSTRAINT "___detail_templates_v_pos_v_btn_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_pos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___detail_templates_v_pos_v_btn_v_locales" ADD CONSTRAINT "___detail_templates_v_pos_v_btn_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___detail_templates_v_pos_v_btn_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___detail_templates_v_pos_v_it_v" ADD CONSTRAINT "___detail_templates_v_pos_v_it_v_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "___detail_templates_v_pos_v_it_v" ADD CONSTRAINT "___detail_templates_v_pos_v_it_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_pos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___detail_templates_v_pos_v_it_v_locales" ADD CONSTRAINT "___detail_templates_v_pos_v_it_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___detail_templates_v_pos_v_it_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_pos_v" ADD CONSTRAINT "__detail_templates_v_pos_v_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_pos_v" ADD CONSTRAINT "__detail_templates_v_pos_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_pos_v_locales" ADD CONSTRAINT "__detail_templates_v_pos_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_pos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_jli_v" ADD CONSTRAINT "__detail_templates_v_jli_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_jli_v_locales" ADD CONSTRAINT "__detail_templates_v_jli_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_jli_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___detail_templates_v_jsh_v_btn_v" ADD CONSTRAINT "___detail_templates_v_jsh_v_btn_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_jsh_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___detail_templates_v_jsh_v_btn_v_locales" ADD CONSTRAINT "___detail_templates_v_jsh_v_btn_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___detail_templates_v_jsh_v_btn_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_jsh_v" ADD CONSTRAINT "__detail_templates_v_jsh_v_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_jsh_v" ADD CONSTRAINT "__detail_templates_v_jsh_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_jsh_v_locales" ADD CONSTRAINT "__detail_templates_v_jsh_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_jsh_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___detail_templates_v_ird_v_nav_v" ADD CONSTRAINT "___detail_templates_v_ird_v_nav_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_ird_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___detail_templates_v_ird_v_nav_v_locales" ADD CONSTRAINT "___detail_templates_v_ird_v_nav_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___detail_templates_v_ird_v_nav_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_ird_v_document_types" ADD CONSTRAINT "__detail_templates_v_ird_v_document_types_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."__detail_templates_v_ird_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_ird_v" ADD CONSTRAINT "__detail_templates_v_ird_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__detail_templates_v_ird_v_locales" ADD CONSTRAINT "__detail_templates_v_ird_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__detail_templates_v_ird_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_pt" ADD CONSTRAINT "shared_detail_templates_pt_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_pt" ADD CONSTRAINT "shared_detail_templates_pt_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_pt_locales" ADD CONSTRAINT "shared_detail_templates_pt_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_pt"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_ps_btn" ADD CONSTRAINT "shared_detail_templates_ps_btn_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_ps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_ps_btn_locales" ADD CONSTRAINT "shared_detail_templates_ps_btn_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_ps_btn"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_ps" ADD CONSTRAINT "shared_detail_templates_ps_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_ps" ADD CONSTRAINT "shared_detail_templates_ps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_ps_locales" ADD CONSTRAINT "shared_detail_templates_ps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_ps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_ss_btn" ADD CONSTRAINT "shared_detail_templates_ss_btn_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_ss"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_ss_btn_locales" ADD CONSTRAINT "shared_detail_templates_ss_btn_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_ss_btn"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_ss" ADD CONSTRAINT "shared_detail_templates_ss_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_ss" ADD CONSTRAINT "shared_detail_templates_ss_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_ss_locales" ADD CONSTRAINT "shared_detail_templates_ss_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_ss"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_pos_btn" ADD CONSTRAINT "shared_detail_templates_pos_btn_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_pos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_pos_btn_locales" ADD CONSTRAINT "shared_detail_templates_pos_btn_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_pos_btn"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_pos_it" ADD CONSTRAINT "shared_detail_templates_pos_it_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_pos_it" ADD CONSTRAINT "shared_detail_templates_pos_it_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_pos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_pos_it_locales" ADD CONSTRAINT "shared_detail_templates_pos_it_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_pos_it"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_pos" ADD CONSTRAINT "shared_detail_templates_pos_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_pos" ADD CONSTRAINT "shared_detail_templates_pos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_pos_locales" ADD CONSTRAINT "shared_detail_templates_pos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_pos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_jli" ADD CONSTRAINT "shared_detail_templates_jli_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_jli_locales" ADD CONSTRAINT "shared_detail_templates_jli_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_jli"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_jsh_btn" ADD CONSTRAINT "shared_detail_templates_jsh_btn_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_jsh"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_jsh_btn_locales" ADD CONSTRAINT "shared_detail_templates_jsh_btn_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_jsh_btn"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_jsh" ADD CONSTRAINT "shared_detail_templates_jsh_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_jsh" ADD CONSTRAINT "shared_detail_templates_jsh_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_jsh_locales" ADD CONSTRAINT "shared_detail_templates_jsh_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_jsh"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_ird_nav" ADD CONSTRAINT "shared_detail_templates_ird_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_ird"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_ird_nav_locales" ADD CONSTRAINT "shared_detail_templates_ird_nav_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_ird_nav"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_ird_document_types" ADD CONSTRAINT "shared_detail_templates_ird_document_types_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."shared_detail_templates_ird"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_ird" ADD CONSTRAINT "shared_detail_templates_ird_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shared_detail_templates_ird_locales" ADD CONSTRAINT "shared_detail_templates_ird_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_detail_templates_ird"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_pt_v" ADD CONSTRAINT "__shared_detail_templates_v_pt_v_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_pt_v" ADD CONSTRAINT "__shared_detail_templates_v_pt_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_pt_v_locales" ADD CONSTRAINT "__shared_detail_templates_v_pt_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_pt_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_detail_templates_v_ps_v_btn_v" ADD CONSTRAINT "___shared_detail_templates_v_ps_v_btn_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_ps_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_detail_templates_v_ps_v_btn_v_locales" ADD CONSTRAINT "___shared_detail_templates_v_ps_v_btn_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___shared_detail_templates_v_ps_v_btn_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_ps_v" ADD CONSTRAINT "__shared_detail_templates_v_ps_v_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_ps_v" ADD CONSTRAINT "__shared_detail_templates_v_ps_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_ps_v_locales" ADD CONSTRAINT "__shared_detail_templates_v_ps_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_ps_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_detail_templates_v_ss_v_btn_v" ADD CONSTRAINT "___shared_detail_templates_v_ss_v_btn_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_ss_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_detail_templates_v_ss_v_btn_v_locales" ADD CONSTRAINT "___shared_detail_templates_v_ss_v_btn_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___shared_detail_templates_v_ss_v_btn_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_ss_v" ADD CONSTRAINT "__shared_detail_templates_v_ss_v_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_ss_v" ADD CONSTRAINT "__shared_detail_templates_v_ss_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_ss_v_locales" ADD CONSTRAINT "__shared_detail_templates_v_ss_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_ss_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_detail_templates_v_pos_v_btn_v" ADD CONSTRAINT "___shared_detail_templates_v_pos_v_btn_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_pos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_detail_templates_v_pos_v_btn_v_locales" ADD CONSTRAINT "___shared_detail_templates_v_pos_v_btn_v_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___shared_detail_templates_v_pos_v_btn_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_detail_templates_v_pos_v_it_v" ADD CONSTRAINT "___shared_detail_templates_v_pos_v_it_v_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "___shared_detail_templates_v_pos_v_it_v" ADD CONSTRAINT "___shared_detail_templates_v_pos_v_it_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_pos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_detail_templates_v_pos_v_it_v_locales" ADD CONSTRAINT "___shared_detail_templates_v_pos_v_it_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___shared_detail_templates_v_pos_v_it_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_pos_v" ADD CONSTRAINT "__shared_detail_templates_v_pos_v_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_pos_v" ADD CONSTRAINT "__shared_detail_templates_v_pos_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_pos_v_locales" ADD CONSTRAINT "__shared_detail_templates_v_pos_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_pos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_jli_v" ADD CONSTRAINT "__shared_detail_templates_v_jli_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_jli_v_locales" ADD CONSTRAINT "__shared_detail_templates_v_jli_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_jli_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_detail_templates_v_jsh_v_btn_v" ADD CONSTRAINT "___shared_detail_templates_v_jsh_v_btn_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_jsh_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_detail_templates_v_jsh_v_btn_v_locales" ADD CONSTRAINT "___shared_detail_templates_v_jsh_v_btn_v_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___shared_detail_templates_v_jsh_v_btn_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_jsh_v" ADD CONSTRAINT "__shared_detail_templates_v_jsh_v_appearance_background_image_id_media_id_fk" FOREIGN KEY ("appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_jsh_v" ADD CONSTRAINT "__shared_detail_templates_v_jsh_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_jsh_v_locales" ADD CONSTRAINT "__shared_detail_templates_v_jsh_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_jsh_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_detail_templates_v_ird_v_nav_v" ADD CONSTRAINT "___shared_detail_templates_v_ird_v_nav_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_ird_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "___shared_detail_templates_v_ird_v_nav_v_locales" ADD CONSTRAINT "___shared_detail_templates_v_ird_v_nav_v_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."___shared_detail_templates_v_ird_v_nav_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_ird_v_document_types" ADD CONSTRAINT "__shared_detail_templates_v_ird_v_document_types_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."__shared_detail_templates_v_ird_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_ird_v" ADD CONSTRAINT "__shared_detail_templates_v_ird_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_shared_detail_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "__shared_detail_templates_v_ird_v_locales" ADD CONSTRAINT "__shared_detail_templates_v_ird_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."__shared_detail_templates_v_ird_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_pt_order_idx" ON "pages_pt" USING btree ("_order");
  CREATE INDEX "pages_pt_parent_id_idx" ON "pages_pt" USING btree ("_parent_id");
  CREATE INDEX "pages_pt_path_idx" ON "pages_pt" USING btree ("_path");
  CREATE INDEX "pages_pt_appearance_appearance_background_image_idx" ON "pages_pt" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "pages_pt_locales_locale_parent_id_unique" ON "pages_pt_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_ps_btn_order_idx" ON "pages_ps_btn" USING btree ("_order");
  CREATE INDEX "pages_ps_btn_parent_id_idx" ON "pages_ps_btn" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_ps_btn_locales_locale_parent_id_unique" ON "pages_ps_btn_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_ps_order_idx" ON "pages_ps" USING btree ("_order");
  CREATE INDEX "pages_ps_parent_id_idx" ON "pages_ps" USING btree ("_parent_id");
  CREATE INDEX "pages_ps_path_idx" ON "pages_ps" USING btree ("_path");
  CREATE INDEX "pages_ps_appearance_appearance_background_image_idx" ON "pages_ps" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "pages_ps_locales_locale_parent_id_unique" ON "pages_ps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_ss_btn_order_idx" ON "pages_ss_btn" USING btree ("_order");
  CREATE INDEX "pages_ss_btn_parent_id_idx" ON "pages_ss_btn" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_ss_btn_locales_locale_parent_id_unique" ON "pages_ss_btn_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_ss_order_idx" ON "pages_ss" USING btree ("_order");
  CREATE INDEX "pages_ss_parent_id_idx" ON "pages_ss" USING btree ("_parent_id");
  CREATE INDEX "pages_ss_path_idx" ON "pages_ss" USING btree ("_path");
  CREATE INDEX "pages_ss_appearance_appearance_background_image_idx" ON "pages_ss" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "pages_ss_locales_locale_parent_id_unique" ON "pages_ss_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_pos_btn_order_idx" ON "pages_pos_btn" USING btree ("_order");
  CREATE INDEX "pages_pos_btn_parent_id_idx" ON "pages_pos_btn" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_pos_btn_locales_locale_parent_id_unique" ON "pages_pos_btn_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_pos_it_order_idx" ON "pages_pos_it" USING btree ("_order");
  CREATE INDEX "pages_pos_it_parent_id_idx" ON "pages_pos_it" USING btree ("_parent_id");
  CREATE INDEX "pages_pos_it_image_idx" ON "pages_pos_it" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_pos_it_locales_locale_parent_id_unique" ON "pages_pos_it_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_pos_order_idx" ON "pages_pos" USING btree ("_order");
  CREATE INDEX "pages_pos_parent_id_idx" ON "pages_pos" USING btree ("_parent_id");
  CREATE INDEX "pages_pos_path_idx" ON "pages_pos" USING btree ("_path");
  CREATE INDEX "pages_pos_appearance_appearance_background_image_idx" ON "pages_pos" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "pages_pos_locales_locale_parent_id_unique" ON "pages_pos_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_jli_order_idx" ON "pages_jli" USING btree ("_order");
  CREATE INDEX "pages_jli_parent_id_idx" ON "pages_jli" USING btree ("_parent_id");
  CREATE INDEX "pages_jli_path_idx" ON "pages_jli" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_jli_locales_locale_parent_id_unique" ON "pages_jli_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_jsh_btn_order_idx" ON "pages_jsh_btn" USING btree ("_order");
  CREATE INDEX "pages_jsh_btn_parent_id_idx" ON "pages_jsh_btn" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_jsh_btn_locales_locale_parent_id_unique" ON "pages_jsh_btn_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_jsh_order_idx" ON "pages_jsh" USING btree ("_order");
  CREATE INDEX "pages_jsh_parent_id_idx" ON "pages_jsh" USING btree ("_parent_id");
  CREATE INDEX "pages_jsh_path_idx" ON "pages_jsh" USING btree ("_path");
  CREATE INDEX "pages_jsh_appearance_appearance_background_image_idx" ON "pages_jsh" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "pages_jsh_locales_locale_parent_id_unique" ON "pages_jsh_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_ird_nav_order_idx" ON "pages_ird_nav" USING btree ("_order");
  CREATE INDEX "pages_ird_nav_parent_id_idx" ON "pages_ird_nav" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_ird_nav_locales_locale_parent_id_unique" ON "pages_ird_nav_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_ird_document_types_order_idx" ON "pages_ird_document_types" USING btree ("order");
  CREATE INDEX "pages_ird_document_types_parent_idx" ON "pages_ird_document_types" USING btree ("parent_id");
  CREATE INDEX "pages_ird_order_idx" ON "pages_ird" USING btree ("_order");
  CREATE INDEX "pages_ird_parent_id_idx" ON "pages_ird" USING btree ("_parent_id");
  CREATE INDEX "pages_ird_path_idx" ON "pages_ird" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_ird_locales_locale_parent_id_unique" ON "pages_ird_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__pages_v_pt_v_order_idx" ON "__pages_v_pt_v" USING btree ("_order");
  CREATE INDEX "__pages_v_pt_v_parent_id_idx" ON "__pages_v_pt_v" USING btree ("_parent_id");
  CREATE INDEX "__pages_v_pt_v_path_idx" ON "__pages_v_pt_v" USING btree ("_path");
  CREATE INDEX "__pages_v_pt_v_appearance_appearance_background_image_idx" ON "__pages_v_pt_v" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "__pages_v_pt_v_locales_locale_parent_id_unique" ON "__pages_v_pt_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___pages_v_ps_v_btn_v_order_idx" ON "___pages_v_ps_v_btn_v" USING btree ("_order");
  CREATE INDEX "___pages_v_ps_v_btn_v_parent_id_idx" ON "___pages_v_ps_v_btn_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "___pages_v_ps_v_btn_v_locales_locale_parent_id_unique" ON "___pages_v_ps_v_btn_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__pages_v_ps_v_order_idx" ON "__pages_v_ps_v" USING btree ("_order");
  CREATE INDEX "__pages_v_ps_v_parent_id_idx" ON "__pages_v_ps_v" USING btree ("_parent_id");
  CREATE INDEX "__pages_v_ps_v_path_idx" ON "__pages_v_ps_v" USING btree ("_path");
  CREATE INDEX "__pages_v_ps_v_appearance_appearance_background_image_idx" ON "__pages_v_ps_v" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "__pages_v_ps_v_locales_locale_parent_id_unique" ON "__pages_v_ps_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___pages_v_ss_v_btn_v_order_idx" ON "___pages_v_ss_v_btn_v" USING btree ("_order");
  CREATE INDEX "___pages_v_ss_v_btn_v_parent_id_idx" ON "___pages_v_ss_v_btn_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "___pages_v_ss_v_btn_v_locales_locale_parent_id_unique" ON "___pages_v_ss_v_btn_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__pages_v_ss_v_order_idx" ON "__pages_v_ss_v" USING btree ("_order");
  CREATE INDEX "__pages_v_ss_v_parent_id_idx" ON "__pages_v_ss_v" USING btree ("_parent_id");
  CREATE INDEX "__pages_v_ss_v_path_idx" ON "__pages_v_ss_v" USING btree ("_path");
  CREATE INDEX "__pages_v_ss_v_appearance_appearance_background_image_idx" ON "__pages_v_ss_v" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "__pages_v_ss_v_locales_locale_parent_id_unique" ON "__pages_v_ss_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___pages_v_pos_v_btn_v_order_idx" ON "___pages_v_pos_v_btn_v" USING btree ("_order");
  CREATE INDEX "___pages_v_pos_v_btn_v_parent_id_idx" ON "___pages_v_pos_v_btn_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "___pages_v_pos_v_btn_v_locales_locale_parent_id_unique" ON "___pages_v_pos_v_btn_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___pages_v_pos_v_it_v_order_idx" ON "___pages_v_pos_v_it_v" USING btree ("_order");
  CREATE INDEX "___pages_v_pos_v_it_v_parent_id_idx" ON "___pages_v_pos_v_it_v" USING btree ("_parent_id");
  CREATE INDEX "___pages_v_pos_v_it_v_image_idx" ON "___pages_v_pos_v_it_v" USING btree ("image_id");
  CREATE UNIQUE INDEX "___pages_v_pos_v_it_v_locales_locale_parent_id_unique" ON "___pages_v_pos_v_it_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__pages_v_pos_v_order_idx" ON "__pages_v_pos_v" USING btree ("_order");
  CREATE INDEX "__pages_v_pos_v_parent_id_idx" ON "__pages_v_pos_v" USING btree ("_parent_id");
  CREATE INDEX "__pages_v_pos_v_path_idx" ON "__pages_v_pos_v" USING btree ("_path");
  CREATE INDEX "__pages_v_pos_v_appearance_appearance_background_image_idx" ON "__pages_v_pos_v" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "__pages_v_pos_v_locales_locale_parent_id_unique" ON "__pages_v_pos_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__pages_v_jli_v_order_idx" ON "__pages_v_jli_v" USING btree ("_order");
  CREATE INDEX "__pages_v_jli_v_parent_id_idx" ON "__pages_v_jli_v" USING btree ("_parent_id");
  CREATE INDEX "__pages_v_jli_v_path_idx" ON "__pages_v_jli_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__pages_v_jli_v_locales_locale_parent_id_unique" ON "__pages_v_jli_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___pages_v_jsh_v_btn_v_order_idx" ON "___pages_v_jsh_v_btn_v" USING btree ("_order");
  CREATE INDEX "___pages_v_jsh_v_btn_v_parent_id_idx" ON "___pages_v_jsh_v_btn_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "___pages_v_jsh_v_btn_v_locales_locale_parent_id_unique" ON "___pages_v_jsh_v_btn_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__pages_v_jsh_v_order_idx" ON "__pages_v_jsh_v" USING btree ("_order");
  CREATE INDEX "__pages_v_jsh_v_parent_id_idx" ON "__pages_v_jsh_v" USING btree ("_parent_id");
  CREATE INDEX "__pages_v_jsh_v_path_idx" ON "__pages_v_jsh_v" USING btree ("_path");
  CREATE INDEX "__pages_v_jsh_v_appearance_appearance_background_image_idx" ON "__pages_v_jsh_v" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "__pages_v_jsh_v_locales_locale_parent_id_unique" ON "__pages_v_jsh_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___pages_v_ird_v_nav_v_order_idx" ON "___pages_v_ird_v_nav_v" USING btree ("_order");
  CREATE INDEX "___pages_v_ird_v_nav_v_parent_id_idx" ON "___pages_v_ird_v_nav_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "___pages_v_ird_v_nav_v_locales_locale_parent_id_unique" ON "___pages_v_ird_v_nav_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__pages_v_ird_v_document_types_order_idx" ON "__pages_v_ird_v_document_types" USING btree ("order");
  CREATE INDEX "__pages_v_ird_v_document_types_parent_idx" ON "__pages_v_ird_v_document_types" USING btree ("parent_id");
  CREATE INDEX "__pages_v_ird_v_order_idx" ON "__pages_v_ird_v" USING btree ("_order");
  CREATE INDEX "__pages_v_ird_v_parent_id_idx" ON "__pages_v_ird_v" USING btree ("_parent_id");
  CREATE INDEX "__pages_v_ird_v_path_idx" ON "__pages_v_ird_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__pages_v_ird_v_locales_locale_parent_id_unique" ON "__pages_v_ird_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_pt_order_idx" ON "shared_pages_pt" USING btree ("_order");
  CREATE INDEX "shared_pages_pt_parent_id_idx" ON "shared_pages_pt" USING btree ("_parent_id");
  CREATE INDEX "shared_pages_pt_path_idx" ON "shared_pages_pt" USING btree ("_path");
  CREATE INDEX "shared_pages_pt_appearance_appearance_background_image_idx" ON "shared_pages_pt" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "shared_pages_pt_locales_locale_parent_id_unique" ON "shared_pages_pt_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_ps_btn_order_idx" ON "shared_pages_ps_btn" USING btree ("_order");
  CREATE INDEX "shared_pages_ps_btn_parent_id_idx" ON "shared_pages_ps_btn" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shared_pages_ps_btn_locales_locale_parent_id_unique" ON "shared_pages_ps_btn_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_ps_order_idx" ON "shared_pages_ps" USING btree ("_order");
  CREATE INDEX "shared_pages_ps_parent_id_idx" ON "shared_pages_ps" USING btree ("_parent_id");
  CREATE INDEX "shared_pages_ps_path_idx" ON "shared_pages_ps" USING btree ("_path");
  CREATE INDEX "shared_pages_ps_appearance_appearance_background_image_idx" ON "shared_pages_ps" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "shared_pages_ps_locales_locale_parent_id_unique" ON "shared_pages_ps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_ss_btn_order_idx" ON "shared_pages_ss_btn" USING btree ("_order");
  CREATE INDEX "shared_pages_ss_btn_parent_id_idx" ON "shared_pages_ss_btn" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shared_pages_ss_btn_locales_locale_parent_id_unique" ON "shared_pages_ss_btn_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_ss_order_idx" ON "shared_pages_ss" USING btree ("_order");
  CREATE INDEX "shared_pages_ss_parent_id_idx" ON "shared_pages_ss" USING btree ("_parent_id");
  CREATE INDEX "shared_pages_ss_path_idx" ON "shared_pages_ss" USING btree ("_path");
  CREATE INDEX "shared_pages_ss_appearance_appearance_background_image_idx" ON "shared_pages_ss" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "shared_pages_ss_locales_locale_parent_id_unique" ON "shared_pages_ss_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_pos_btn_order_idx" ON "shared_pages_pos_btn" USING btree ("_order");
  CREATE INDEX "shared_pages_pos_btn_parent_id_idx" ON "shared_pages_pos_btn" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shared_pages_pos_btn_locales_locale_parent_id_unique" ON "shared_pages_pos_btn_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_pos_it_order_idx" ON "shared_pages_pos_it" USING btree ("_order");
  CREATE INDEX "shared_pages_pos_it_parent_id_idx" ON "shared_pages_pos_it" USING btree ("_parent_id");
  CREATE INDEX "shared_pages_pos_it_image_idx" ON "shared_pages_pos_it" USING btree ("image_id");
  CREATE UNIQUE INDEX "shared_pages_pos_it_locales_locale_parent_id_unique" ON "shared_pages_pos_it_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_pos_order_idx" ON "shared_pages_pos" USING btree ("_order");
  CREATE INDEX "shared_pages_pos_parent_id_idx" ON "shared_pages_pos" USING btree ("_parent_id");
  CREATE INDEX "shared_pages_pos_path_idx" ON "shared_pages_pos" USING btree ("_path");
  CREATE INDEX "shared_pages_pos_appearance_appearance_background_image_idx" ON "shared_pages_pos" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "shared_pages_pos_locales_locale_parent_id_unique" ON "shared_pages_pos_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_jli_order_idx" ON "shared_pages_jli" USING btree ("_order");
  CREATE INDEX "shared_pages_jli_parent_id_idx" ON "shared_pages_jli" USING btree ("_parent_id");
  CREATE INDEX "shared_pages_jli_path_idx" ON "shared_pages_jli" USING btree ("_path");
  CREATE UNIQUE INDEX "shared_pages_jli_locales_locale_parent_id_unique" ON "shared_pages_jli_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_jsh_btn_order_idx" ON "shared_pages_jsh_btn" USING btree ("_order");
  CREATE INDEX "shared_pages_jsh_btn_parent_id_idx" ON "shared_pages_jsh_btn" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shared_pages_jsh_btn_locales_locale_parent_id_unique" ON "shared_pages_jsh_btn_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_jsh_order_idx" ON "shared_pages_jsh" USING btree ("_order");
  CREATE INDEX "shared_pages_jsh_parent_id_idx" ON "shared_pages_jsh" USING btree ("_parent_id");
  CREATE INDEX "shared_pages_jsh_path_idx" ON "shared_pages_jsh" USING btree ("_path");
  CREATE INDEX "shared_pages_jsh_appearance_appearance_background_image_idx" ON "shared_pages_jsh" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "shared_pages_jsh_locales_locale_parent_id_unique" ON "shared_pages_jsh_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_ird_nav_order_idx" ON "shared_pages_ird_nav" USING btree ("_order");
  CREATE INDEX "shared_pages_ird_nav_parent_id_idx" ON "shared_pages_ird_nav" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shared_pages_ird_nav_locales_locale_parent_id_unique" ON "shared_pages_ird_nav_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_pages_ird_document_types_order_idx" ON "shared_pages_ird_document_types" USING btree ("order");
  CREATE INDEX "shared_pages_ird_document_types_parent_idx" ON "shared_pages_ird_document_types" USING btree ("parent_id");
  CREATE INDEX "shared_pages_ird_order_idx" ON "shared_pages_ird" USING btree ("_order");
  CREATE INDEX "shared_pages_ird_parent_id_idx" ON "shared_pages_ird" USING btree ("_parent_id");
  CREATE INDEX "shared_pages_ird_path_idx" ON "shared_pages_ird" USING btree ("_path");
  CREATE UNIQUE INDEX "shared_pages_ird_locales_locale_parent_id_unique" ON "shared_pages_ird_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_pages_v_pt_v_order_idx" ON "__shared_pages_v_pt_v" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_pt_v_parent_id_idx" ON "__shared_pages_v_pt_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_pages_v_pt_v_path_idx" ON "__shared_pages_v_pt_v" USING btree ("_path");
  CREATE INDEX "__shared_pages_v_pt_v_appearance_appearance_background_i_idx" ON "__shared_pages_v_pt_v" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "__shared_pages_v_pt_v_locales_locale_parent_id_unique" ON "__shared_pages_v_pt_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___shared_pages_v_ps_v_btn_v_order_idx" ON "___shared_pages_v_ps_v_btn_v" USING btree ("_order");
  CREATE INDEX "___shared_pages_v_ps_v_btn_v_parent_id_idx" ON "___shared_pages_v_ps_v_btn_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "___shared_pages_v_ps_v_btn_v_locales_locale_parent_id_unique" ON "___shared_pages_v_ps_v_btn_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_pages_v_ps_v_order_idx" ON "__shared_pages_v_ps_v" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_ps_v_parent_id_idx" ON "__shared_pages_v_ps_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_pages_v_ps_v_path_idx" ON "__shared_pages_v_ps_v" USING btree ("_path");
  CREATE INDEX "__shared_pages_v_ps_v_appearance_appearance_background_i_idx" ON "__shared_pages_v_ps_v" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "__shared_pages_v_ps_v_locales_locale_parent_id_unique" ON "__shared_pages_v_ps_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___shared_pages_v_ss_v_btn_v_order_idx" ON "___shared_pages_v_ss_v_btn_v" USING btree ("_order");
  CREATE INDEX "___shared_pages_v_ss_v_btn_v_parent_id_idx" ON "___shared_pages_v_ss_v_btn_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "___shared_pages_v_ss_v_btn_v_locales_locale_parent_id_unique" ON "___shared_pages_v_ss_v_btn_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_pages_v_ss_v_order_idx" ON "__shared_pages_v_ss_v" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_ss_v_parent_id_idx" ON "__shared_pages_v_ss_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_pages_v_ss_v_path_idx" ON "__shared_pages_v_ss_v" USING btree ("_path");
  CREATE INDEX "__shared_pages_v_ss_v_appearance_appearance_background_i_idx" ON "__shared_pages_v_ss_v" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "__shared_pages_v_ss_v_locales_locale_parent_id_unique" ON "__shared_pages_v_ss_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___shared_pages_v_pos_v_btn_v_order_idx" ON "___shared_pages_v_pos_v_btn_v" USING btree ("_order");
  CREATE INDEX "___shared_pages_v_pos_v_btn_v_parent_id_idx" ON "___shared_pages_v_pos_v_btn_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "___shared_pages_v_pos_v_btn_v_locales_locale_parent_id_uniqu" ON "___shared_pages_v_pos_v_btn_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___shared_pages_v_pos_v_it_v_order_idx" ON "___shared_pages_v_pos_v_it_v" USING btree ("_order");
  CREATE INDEX "___shared_pages_v_pos_v_it_v_parent_id_idx" ON "___shared_pages_v_pos_v_it_v" USING btree ("_parent_id");
  CREATE INDEX "___shared_pages_v_pos_v_it_v_image_idx" ON "___shared_pages_v_pos_v_it_v" USING btree ("image_id");
  CREATE UNIQUE INDEX "___shared_pages_v_pos_v_it_v_locales_locale_parent_id_unique" ON "___shared_pages_v_pos_v_it_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_pages_v_pos_v_order_idx" ON "__shared_pages_v_pos_v" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_pos_v_parent_id_idx" ON "__shared_pages_v_pos_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_pages_v_pos_v_path_idx" ON "__shared_pages_v_pos_v" USING btree ("_path");
  CREATE INDEX "__shared_pages_v_pos_v_appearance_appearance_background__idx" ON "__shared_pages_v_pos_v" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "__shared_pages_v_pos_v_locales_locale_parent_id_unique" ON "__shared_pages_v_pos_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_pages_v_jli_v_order_idx" ON "__shared_pages_v_jli_v" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_jli_v_parent_id_idx" ON "__shared_pages_v_jli_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_pages_v_jli_v_path_idx" ON "__shared_pages_v_jli_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__shared_pages_v_jli_v_locales_locale_parent_id_unique" ON "__shared_pages_v_jli_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___shared_pages_v_jsh_v_btn_v_order_idx" ON "___shared_pages_v_jsh_v_btn_v" USING btree ("_order");
  CREATE INDEX "___shared_pages_v_jsh_v_btn_v_parent_id_idx" ON "___shared_pages_v_jsh_v_btn_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "___shared_pages_v_jsh_v_btn_v_locales_locale_parent_id_uniqu" ON "___shared_pages_v_jsh_v_btn_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_pages_v_jsh_v_order_idx" ON "__shared_pages_v_jsh_v" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_jsh_v_parent_id_idx" ON "__shared_pages_v_jsh_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_pages_v_jsh_v_path_idx" ON "__shared_pages_v_jsh_v" USING btree ("_path");
  CREATE INDEX "__shared_pages_v_jsh_v_appearance_appearance_background__idx" ON "__shared_pages_v_jsh_v" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "__shared_pages_v_jsh_v_locales_locale_parent_id_unique" ON "__shared_pages_v_jsh_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___shared_pages_v_ird_v_nav_v_order_idx" ON "___shared_pages_v_ird_v_nav_v" USING btree ("_order");
  CREATE INDEX "___shared_pages_v_ird_v_nav_v_parent_id_idx" ON "___shared_pages_v_ird_v_nav_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "___shared_pages_v_ird_v_nav_v_locales_locale_parent_id_uniqu" ON "___shared_pages_v_ird_v_nav_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_pages_v_ird_v_document_types_order_idx" ON "__shared_pages_v_ird_v_document_types" USING btree ("order");
  CREATE INDEX "__shared_pages_v_ird_v_document_types_parent_idx" ON "__shared_pages_v_ird_v_document_types" USING btree ("parent_id");
  CREATE INDEX "__shared_pages_v_ird_v_order_idx" ON "__shared_pages_v_ird_v" USING btree ("_order");
  CREATE INDEX "__shared_pages_v_ird_v_parent_id_idx" ON "__shared_pages_v_ird_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_pages_v_ird_v_path_idx" ON "__shared_pages_v_ird_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__shared_pages_v_ird_v_locales_locale_parent_id_unique" ON "__shared_pages_v_ird_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_pt_order_idx" ON "detail_templates_pt" USING btree ("_order");
  CREATE INDEX "detail_templates_pt_parent_id_idx" ON "detail_templates_pt" USING btree ("_parent_id");
  CREATE INDEX "detail_templates_pt_path_idx" ON "detail_templates_pt" USING btree ("_path");
  CREATE INDEX "detail_templates_pt_appearance_appearance_background_ima_idx" ON "detail_templates_pt" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "detail_templates_pt_locales_locale_parent_id_unique" ON "detail_templates_pt_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_ps_btn_order_idx" ON "detail_templates_ps_btn" USING btree ("_order");
  CREATE INDEX "detail_templates_ps_btn_parent_id_idx" ON "detail_templates_ps_btn" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "detail_templates_ps_btn_locales_locale_parent_id_unique" ON "detail_templates_ps_btn_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_ps_order_idx" ON "detail_templates_ps" USING btree ("_order");
  CREATE INDEX "detail_templates_ps_parent_id_idx" ON "detail_templates_ps" USING btree ("_parent_id");
  CREATE INDEX "detail_templates_ps_path_idx" ON "detail_templates_ps" USING btree ("_path");
  CREATE INDEX "detail_templates_ps_appearance_appearance_background_ima_idx" ON "detail_templates_ps" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "detail_templates_ps_locales_locale_parent_id_unique" ON "detail_templates_ps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_ss_btn_order_idx" ON "detail_templates_ss_btn" USING btree ("_order");
  CREATE INDEX "detail_templates_ss_btn_parent_id_idx" ON "detail_templates_ss_btn" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "detail_templates_ss_btn_locales_locale_parent_id_unique" ON "detail_templates_ss_btn_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_ss_order_idx" ON "detail_templates_ss" USING btree ("_order");
  CREATE INDEX "detail_templates_ss_parent_id_idx" ON "detail_templates_ss" USING btree ("_parent_id");
  CREATE INDEX "detail_templates_ss_path_idx" ON "detail_templates_ss" USING btree ("_path");
  CREATE INDEX "detail_templates_ss_appearance_appearance_background_ima_idx" ON "detail_templates_ss" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "detail_templates_ss_locales_locale_parent_id_unique" ON "detail_templates_ss_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_pos_btn_order_idx" ON "detail_templates_pos_btn" USING btree ("_order");
  CREATE INDEX "detail_templates_pos_btn_parent_id_idx" ON "detail_templates_pos_btn" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "detail_templates_pos_btn_locales_locale_parent_id_unique" ON "detail_templates_pos_btn_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_pos_it_order_idx" ON "detail_templates_pos_it" USING btree ("_order");
  CREATE INDEX "detail_templates_pos_it_parent_id_idx" ON "detail_templates_pos_it" USING btree ("_parent_id");
  CREATE INDEX "detail_templates_pos_it_image_idx" ON "detail_templates_pos_it" USING btree ("image_id");
  CREATE UNIQUE INDEX "detail_templates_pos_it_locales_locale_parent_id_unique" ON "detail_templates_pos_it_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_pos_order_idx" ON "detail_templates_pos" USING btree ("_order");
  CREATE INDEX "detail_templates_pos_parent_id_idx" ON "detail_templates_pos" USING btree ("_parent_id");
  CREATE INDEX "detail_templates_pos_path_idx" ON "detail_templates_pos" USING btree ("_path");
  CREATE INDEX "detail_templates_pos_appearance_appearance_background_im_idx" ON "detail_templates_pos" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "detail_templates_pos_locales_locale_parent_id_unique" ON "detail_templates_pos_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_jli_order_idx" ON "detail_templates_jli" USING btree ("_order");
  CREATE INDEX "detail_templates_jli_parent_id_idx" ON "detail_templates_jli" USING btree ("_parent_id");
  CREATE INDEX "detail_templates_jli_path_idx" ON "detail_templates_jli" USING btree ("_path");
  CREATE UNIQUE INDEX "detail_templates_jli_locales_locale_parent_id_unique" ON "detail_templates_jli_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_jsh_btn_order_idx" ON "detail_templates_jsh_btn" USING btree ("_order");
  CREATE INDEX "detail_templates_jsh_btn_parent_id_idx" ON "detail_templates_jsh_btn" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "detail_templates_jsh_btn_locales_locale_parent_id_unique" ON "detail_templates_jsh_btn_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_jsh_order_idx" ON "detail_templates_jsh" USING btree ("_order");
  CREATE INDEX "detail_templates_jsh_parent_id_idx" ON "detail_templates_jsh" USING btree ("_parent_id");
  CREATE INDEX "detail_templates_jsh_path_idx" ON "detail_templates_jsh" USING btree ("_path");
  CREATE INDEX "detail_templates_jsh_appearance_appearance_background_im_idx" ON "detail_templates_jsh" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "detail_templates_jsh_locales_locale_parent_id_unique" ON "detail_templates_jsh_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_ird_nav_order_idx" ON "detail_templates_ird_nav" USING btree ("_order");
  CREATE INDEX "detail_templates_ird_nav_parent_id_idx" ON "detail_templates_ird_nav" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "detail_templates_ird_nav_locales_locale_parent_id_unique" ON "detail_templates_ird_nav_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "detail_templates_ird_document_types_order_idx" ON "detail_templates_ird_document_types" USING btree ("order");
  CREATE INDEX "detail_templates_ird_document_types_parent_idx" ON "detail_templates_ird_document_types" USING btree ("parent_id");
  CREATE INDEX "detail_templates_ird_order_idx" ON "detail_templates_ird" USING btree ("_order");
  CREATE INDEX "detail_templates_ird_parent_id_idx" ON "detail_templates_ird" USING btree ("_parent_id");
  CREATE INDEX "detail_templates_ird_path_idx" ON "detail_templates_ird" USING btree ("_path");
  CREATE UNIQUE INDEX "detail_templates_ird_locales_locale_parent_id_unique" ON "detail_templates_ird_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__detail_templates_v_pt_v_order_idx" ON "__detail_templates_v_pt_v" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_pt_v_parent_id_idx" ON "__detail_templates_v_pt_v" USING btree ("_parent_id");
  CREATE INDEX "__detail_templates_v_pt_v_path_idx" ON "__detail_templates_v_pt_v" USING btree ("_path");
  CREATE INDEX "__detail_templates_v_pt_v_appearance_appearance_backgrou_idx" ON "__detail_templates_v_pt_v" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "__detail_templates_v_pt_v_locales_locale_parent_id_unique" ON "__detail_templates_v_pt_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___detail_templates_v_ps_v_btn_v_order_idx" ON "___detail_templates_v_ps_v_btn_v" USING btree ("_order");
  CREATE INDEX "___detail_templates_v_ps_v_btn_v_parent_id_idx" ON "___detail_templates_v_ps_v_btn_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "___detail_templates_v_ps_v_btn_v_locales_locale_parent_id_un" ON "___detail_templates_v_ps_v_btn_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__detail_templates_v_ps_v_order_idx" ON "__detail_templates_v_ps_v" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_ps_v_parent_id_idx" ON "__detail_templates_v_ps_v" USING btree ("_parent_id");
  CREATE INDEX "__detail_templates_v_ps_v_path_idx" ON "__detail_templates_v_ps_v" USING btree ("_path");
  CREATE INDEX "__detail_templates_v_ps_v_appearance_appearance_backgrou_idx" ON "__detail_templates_v_ps_v" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "__detail_templates_v_ps_v_locales_locale_parent_id_unique" ON "__detail_templates_v_ps_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___detail_templates_v_ss_v_btn_v_order_idx" ON "___detail_templates_v_ss_v_btn_v" USING btree ("_order");
  CREATE INDEX "___detail_templates_v_ss_v_btn_v_parent_id_idx" ON "___detail_templates_v_ss_v_btn_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "___detail_templates_v_ss_v_btn_v_locales_locale_parent_id_un" ON "___detail_templates_v_ss_v_btn_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__detail_templates_v_ss_v_order_idx" ON "__detail_templates_v_ss_v" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_ss_v_parent_id_idx" ON "__detail_templates_v_ss_v" USING btree ("_parent_id");
  CREATE INDEX "__detail_templates_v_ss_v_path_idx" ON "__detail_templates_v_ss_v" USING btree ("_path");
  CREATE INDEX "__detail_templates_v_ss_v_appearance_appearance_backgrou_idx" ON "__detail_templates_v_ss_v" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "__detail_templates_v_ss_v_locales_locale_parent_id_unique" ON "__detail_templates_v_ss_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___detail_templates_v_pos_v_btn_v_order_idx" ON "___detail_templates_v_pos_v_btn_v" USING btree ("_order");
  CREATE INDEX "___detail_templates_v_pos_v_btn_v_parent_id_idx" ON "___detail_templates_v_pos_v_btn_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "___detail_templates_v_pos_v_btn_v_locales_locale_parent_id_u" ON "___detail_templates_v_pos_v_btn_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___detail_templates_v_pos_v_it_v_order_idx" ON "___detail_templates_v_pos_v_it_v" USING btree ("_order");
  CREATE INDEX "___detail_templates_v_pos_v_it_v_parent_id_idx" ON "___detail_templates_v_pos_v_it_v" USING btree ("_parent_id");
  CREATE INDEX "___detail_templates_v_pos_v_it_v_image_idx" ON "___detail_templates_v_pos_v_it_v" USING btree ("image_id");
  CREATE UNIQUE INDEX "___detail_templates_v_pos_v_it_v_locales_locale_parent_id_un" ON "___detail_templates_v_pos_v_it_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__detail_templates_v_pos_v_order_idx" ON "__detail_templates_v_pos_v" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_pos_v_parent_id_idx" ON "__detail_templates_v_pos_v" USING btree ("_parent_id");
  CREATE INDEX "__detail_templates_v_pos_v_path_idx" ON "__detail_templates_v_pos_v" USING btree ("_path");
  CREATE INDEX "__detail_templates_v_pos_v_appearance_appearance_backgro_idx" ON "__detail_templates_v_pos_v" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "__detail_templates_v_pos_v_locales_locale_parent_id_unique" ON "__detail_templates_v_pos_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__detail_templates_v_jli_v_order_idx" ON "__detail_templates_v_jli_v" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_jli_v_parent_id_idx" ON "__detail_templates_v_jli_v" USING btree ("_parent_id");
  CREATE INDEX "__detail_templates_v_jli_v_path_idx" ON "__detail_templates_v_jli_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__detail_templates_v_jli_v_locales_locale_parent_id_unique" ON "__detail_templates_v_jli_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___detail_templates_v_jsh_v_btn_v_order_idx" ON "___detail_templates_v_jsh_v_btn_v" USING btree ("_order");
  CREATE INDEX "___detail_templates_v_jsh_v_btn_v_parent_id_idx" ON "___detail_templates_v_jsh_v_btn_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "___detail_templates_v_jsh_v_btn_v_locales_locale_parent_id_u" ON "___detail_templates_v_jsh_v_btn_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__detail_templates_v_jsh_v_order_idx" ON "__detail_templates_v_jsh_v" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_jsh_v_parent_id_idx" ON "__detail_templates_v_jsh_v" USING btree ("_parent_id");
  CREATE INDEX "__detail_templates_v_jsh_v_path_idx" ON "__detail_templates_v_jsh_v" USING btree ("_path");
  CREATE INDEX "__detail_templates_v_jsh_v_appearance_appearance_backgro_idx" ON "__detail_templates_v_jsh_v" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "__detail_templates_v_jsh_v_locales_locale_parent_id_unique" ON "__detail_templates_v_jsh_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___detail_templates_v_ird_v_nav_v_order_idx" ON "___detail_templates_v_ird_v_nav_v" USING btree ("_order");
  CREATE INDEX "___detail_templates_v_ird_v_nav_v_parent_id_idx" ON "___detail_templates_v_ird_v_nav_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "___detail_templates_v_ird_v_nav_v_locales_locale_parent_id_u" ON "___detail_templates_v_ird_v_nav_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__detail_templates_v_ird_v_document_types_order_idx" ON "__detail_templates_v_ird_v_document_types" USING btree ("order");
  CREATE INDEX "__detail_templates_v_ird_v_document_types_parent_idx" ON "__detail_templates_v_ird_v_document_types" USING btree ("parent_id");
  CREATE INDEX "__detail_templates_v_ird_v_order_idx" ON "__detail_templates_v_ird_v" USING btree ("_order");
  CREATE INDEX "__detail_templates_v_ird_v_parent_id_idx" ON "__detail_templates_v_ird_v" USING btree ("_parent_id");
  CREATE INDEX "__detail_templates_v_ird_v_path_idx" ON "__detail_templates_v_ird_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__detail_templates_v_ird_v_locales_locale_parent_id_unique" ON "__detail_templates_v_ird_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_pt_order_idx" ON "shared_detail_templates_pt" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_pt_parent_id_idx" ON "shared_detail_templates_pt" USING btree ("_parent_id");
  CREATE INDEX "shared_detail_templates_pt_path_idx" ON "shared_detail_templates_pt" USING btree ("_path");
  CREATE INDEX "shared_detail_templates_pt_appearance_appearance_backgro_idx" ON "shared_detail_templates_pt" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "shared_detail_templates_pt_locales_locale_parent_id_unique" ON "shared_detail_templates_pt_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_ps_btn_order_idx" ON "shared_detail_templates_ps_btn" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_ps_btn_parent_id_idx" ON "shared_detail_templates_ps_btn" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shared_detail_templates_ps_btn_locales_locale_parent_id_uniq" ON "shared_detail_templates_ps_btn_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_ps_order_idx" ON "shared_detail_templates_ps" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_ps_parent_id_idx" ON "shared_detail_templates_ps" USING btree ("_parent_id");
  CREATE INDEX "shared_detail_templates_ps_path_idx" ON "shared_detail_templates_ps" USING btree ("_path");
  CREATE INDEX "shared_detail_templates_ps_appearance_appearance_backgro_idx" ON "shared_detail_templates_ps" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "shared_detail_templates_ps_locales_locale_parent_id_unique" ON "shared_detail_templates_ps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_ss_btn_order_idx" ON "shared_detail_templates_ss_btn" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_ss_btn_parent_id_idx" ON "shared_detail_templates_ss_btn" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shared_detail_templates_ss_btn_locales_locale_parent_id_uniq" ON "shared_detail_templates_ss_btn_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_ss_order_idx" ON "shared_detail_templates_ss" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_ss_parent_id_idx" ON "shared_detail_templates_ss" USING btree ("_parent_id");
  CREATE INDEX "shared_detail_templates_ss_path_idx" ON "shared_detail_templates_ss" USING btree ("_path");
  CREATE INDEX "shared_detail_templates_ss_appearance_appearance_backgro_idx" ON "shared_detail_templates_ss" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "shared_detail_templates_ss_locales_locale_parent_id_unique" ON "shared_detail_templates_ss_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_pos_btn_order_idx" ON "shared_detail_templates_pos_btn" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_pos_btn_parent_id_idx" ON "shared_detail_templates_pos_btn" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shared_detail_templates_pos_btn_locales_locale_parent_id_uni" ON "shared_detail_templates_pos_btn_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_pos_it_order_idx" ON "shared_detail_templates_pos_it" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_pos_it_parent_id_idx" ON "shared_detail_templates_pos_it" USING btree ("_parent_id");
  CREATE INDEX "shared_detail_templates_pos_it_image_idx" ON "shared_detail_templates_pos_it" USING btree ("image_id");
  CREATE UNIQUE INDEX "shared_detail_templates_pos_it_locales_locale_parent_id_uniq" ON "shared_detail_templates_pos_it_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_pos_order_idx" ON "shared_detail_templates_pos" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_pos_parent_id_idx" ON "shared_detail_templates_pos" USING btree ("_parent_id");
  CREATE INDEX "shared_detail_templates_pos_path_idx" ON "shared_detail_templates_pos" USING btree ("_path");
  CREATE INDEX "shared_detail_templates_pos_appearance_appearance_backgr_idx" ON "shared_detail_templates_pos" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "shared_detail_templates_pos_locales_locale_parent_id_unique" ON "shared_detail_templates_pos_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_jli_order_idx" ON "shared_detail_templates_jli" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_jli_parent_id_idx" ON "shared_detail_templates_jli" USING btree ("_parent_id");
  CREATE INDEX "shared_detail_templates_jli_path_idx" ON "shared_detail_templates_jli" USING btree ("_path");
  CREATE UNIQUE INDEX "shared_detail_templates_jli_locales_locale_parent_id_unique" ON "shared_detail_templates_jli_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_jsh_btn_order_idx" ON "shared_detail_templates_jsh_btn" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_jsh_btn_parent_id_idx" ON "shared_detail_templates_jsh_btn" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shared_detail_templates_jsh_btn_locales_locale_parent_id_uni" ON "shared_detail_templates_jsh_btn_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_jsh_order_idx" ON "shared_detail_templates_jsh" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_jsh_parent_id_idx" ON "shared_detail_templates_jsh" USING btree ("_parent_id");
  CREATE INDEX "shared_detail_templates_jsh_path_idx" ON "shared_detail_templates_jsh" USING btree ("_path");
  CREATE INDEX "shared_detail_templates_jsh_appearance_appearance_backgr_idx" ON "shared_detail_templates_jsh" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "shared_detail_templates_jsh_locales_locale_parent_id_unique" ON "shared_detail_templates_jsh_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_ird_nav_order_idx" ON "shared_detail_templates_ird_nav" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_ird_nav_parent_id_idx" ON "shared_detail_templates_ird_nav" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "shared_detail_templates_ird_nav_locales_locale_parent_id_uni" ON "shared_detail_templates_ird_nav_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "shared_detail_templates_ird_document_types_order_idx" ON "shared_detail_templates_ird_document_types" USING btree ("order");
  CREATE INDEX "shared_detail_templates_ird_document_types_parent_idx" ON "shared_detail_templates_ird_document_types" USING btree ("parent_id");
  CREATE INDEX "shared_detail_templates_ird_order_idx" ON "shared_detail_templates_ird" USING btree ("_order");
  CREATE INDEX "shared_detail_templates_ird_parent_id_idx" ON "shared_detail_templates_ird" USING btree ("_parent_id");
  CREATE INDEX "shared_detail_templates_ird_path_idx" ON "shared_detail_templates_ird" USING btree ("_path");
  CREATE UNIQUE INDEX "shared_detail_templates_ird_locales_locale_parent_id_unique" ON "shared_detail_templates_ird_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_pt_v_order_idx" ON "__shared_detail_templates_v_pt_v" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_pt_v_parent_id_idx" ON "__shared_detail_templates_v_pt_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_detail_templates_v_pt_v_path_idx" ON "__shared_detail_templates_v_pt_v" USING btree ("_path");
  CREATE INDEX "__shared_detail_templates_v_pt_v_appearance_appearance_b_idx" ON "__shared_detail_templates_v_pt_v" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_pt_v_locales_locale_parent_id_un" ON "__shared_detail_templates_v_pt_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___shared_detail_templates_v_ps_v_btn_v_order_idx" ON "___shared_detail_templates_v_ps_v_btn_v" USING btree ("_order");
  CREATE INDEX "___shared_detail_templates_v_ps_v_btn_v_parent_id_idx" ON "___shared_detail_templates_v_ps_v_btn_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "___shared_detail_templates_v_ps_v_btn_v_locales_locale_paren" ON "___shared_detail_templates_v_ps_v_btn_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_ps_v_order_idx" ON "__shared_detail_templates_v_ps_v" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_ps_v_parent_id_idx" ON "__shared_detail_templates_v_ps_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_detail_templates_v_ps_v_path_idx" ON "__shared_detail_templates_v_ps_v" USING btree ("_path");
  CREATE INDEX "__shared_detail_templates_v_ps_v_appearance_appearance_b_idx" ON "__shared_detail_templates_v_ps_v" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_ps_v_locales_locale_parent_id_un" ON "__shared_detail_templates_v_ps_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___shared_detail_templates_v_ss_v_btn_v_order_idx" ON "___shared_detail_templates_v_ss_v_btn_v" USING btree ("_order");
  CREATE INDEX "___shared_detail_templates_v_ss_v_btn_v_parent_id_idx" ON "___shared_detail_templates_v_ss_v_btn_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "___shared_detail_templates_v_ss_v_btn_v_locales_locale_paren" ON "___shared_detail_templates_v_ss_v_btn_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_ss_v_order_idx" ON "__shared_detail_templates_v_ss_v" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_ss_v_parent_id_idx" ON "__shared_detail_templates_v_ss_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_detail_templates_v_ss_v_path_idx" ON "__shared_detail_templates_v_ss_v" USING btree ("_path");
  CREATE INDEX "__shared_detail_templates_v_ss_v_appearance_appearance_b_idx" ON "__shared_detail_templates_v_ss_v" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_ss_v_locales_locale_parent_id_un" ON "__shared_detail_templates_v_ss_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___shared_detail_templates_v_pos_v_btn_v_order_idx" ON "___shared_detail_templates_v_pos_v_btn_v" USING btree ("_order");
  CREATE INDEX "___shared_detail_templates_v_pos_v_btn_v_parent_id_idx" ON "___shared_detail_templates_v_pos_v_btn_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "___shared_detail_templates_v_pos_v_btn_v_locales_locale_pare" ON "___shared_detail_templates_v_pos_v_btn_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___shared_detail_templates_v_pos_v_it_v_order_idx" ON "___shared_detail_templates_v_pos_v_it_v" USING btree ("_order");
  CREATE INDEX "___shared_detail_templates_v_pos_v_it_v_parent_id_idx" ON "___shared_detail_templates_v_pos_v_it_v" USING btree ("_parent_id");
  CREATE INDEX "___shared_detail_templates_v_pos_v_it_v_image_idx" ON "___shared_detail_templates_v_pos_v_it_v" USING btree ("image_id");
  CREATE UNIQUE INDEX "___shared_detail_templates_v_pos_v_it_v_locales_locale_paren" ON "___shared_detail_templates_v_pos_v_it_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_pos_v_order_idx" ON "__shared_detail_templates_v_pos_v" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_pos_v_parent_id_idx" ON "__shared_detail_templates_v_pos_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_detail_templates_v_pos_v_path_idx" ON "__shared_detail_templates_v_pos_v" USING btree ("_path");
  CREATE INDEX "__shared_detail_templates_v_pos_v_appearance_appearance__idx" ON "__shared_detail_templates_v_pos_v" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_pos_v_locales_locale_parent_id_u" ON "__shared_detail_templates_v_pos_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_jli_v_order_idx" ON "__shared_detail_templates_v_jli_v" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_jli_v_parent_id_idx" ON "__shared_detail_templates_v_jli_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_detail_templates_v_jli_v_path_idx" ON "__shared_detail_templates_v_jli_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_jli_v_locales_locale_parent_id_u" ON "__shared_detail_templates_v_jli_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___shared_detail_templates_v_jsh_v_btn_v_order_idx" ON "___shared_detail_templates_v_jsh_v_btn_v" USING btree ("_order");
  CREATE INDEX "___shared_detail_templates_v_jsh_v_btn_v_parent_id_idx" ON "___shared_detail_templates_v_jsh_v_btn_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "___shared_detail_templates_v_jsh_v_btn_v_locales_locale_pare" ON "___shared_detail_templates_v_jsh_v_btn_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_jsh_v_order_idx" ON "__shared_detail_templates_v_jsh_v" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_jsh_v_parent_id_idx" ON "__shared_detail_templates_v_jsh_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_detail_templates_v_jsh_v_path_idx" ON "__shared_detail_templates_v_jsh_v" USING btree ("_path");
  CREATE INDEX "__shared_detail_templates_v_jsh_v_appearance_appearance__idx" ON "__shared_detail_templates_v_jsh_v" USING btree ("appearance_background_image_id");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_jsh_v_locales_locale_parent_id_u" ON "__shared_detail_templates_v_jsh_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "___shared_detail_templates_v_ird_v_nav_v_order_idx" ON "___shared_detail_templates_v_ird_v_nav_v" USING btree ("_order");
  CREATE INDEX "___shared_detail_templates_v_ird_v_nav_v_parent_id_idx" ON "___shared_detail_templates_v_ird_v_nav_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "___shared_detail_templates_v_ird_v_nav_v_locales_locale_pare" ON "___shared_detail_templates_v_ird_v_nav_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "__shared_detail_templates_v_ird_v_document_types_order_idx" ON "__shared_detail_templates_v_ird_v_document_types" USING btree ("order");
  CREATE INDEX "__shared_detail_templates_v_ird_v_document_types_parent_idx" ON "__shared_detail_templates_v_ird_v_document_types" USING btree ("parent_id");
  CREATE INDEX "__shared_detail_templates_v_ird_v_order_idx" ON "__shared_detail_templates_v_ird_v" USING btree ("_order");
  CREATE INDEX "__shared_detail_templates_v_ird_v_parent_id_idx" ON "__shared_detail_templates_v_ird_v" USING btree ("_parent_id");
  CREATE INDEX "__shared_detail_templates_v_ird_v_path_idx" ON "__shared_detail_templates_v_ird_v" USING btree ("_path");
  CREATE UNIQUE INDEX "__shared_detail_templates_v_ird_v_locales_locale_parent_id_u" ON "__shared_detail_templates_v_ird_v_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_pt" CASCADE;
  DROP TABLE "pages_pt_locales" CASCADE;
  DROP TABLE "pages_ps_btn" CASCADE;
  DROP TABLE "pages_ps_btn_locales" CASCADE;
  DROP TABLE "pages_ps" CASCADE;
  DROP TABLE "pages_ps_locales" CASCADE;
  DROP TABLE "pages_ss_btn" CASCADE;
  DROP TABLE "pages_ss_btn_locales" CASCADE;
  DROP TABLE "pages_ss" CASCADE;
  DROP TABLE "pages_ss_locales" CASCADE;
  DROP TABLE "pages_pos_btn" CASCADE;
  DROP TABLE "pages_pos_btn_locales" CASCADE;
  DROP TABLE "pages_pos_it" CASCADE;
  DROP TABLE "pages_pos_it_locales" CASCADE;
  DROP TABLE "pages_pos" CASCADE;
  DROP TABLE "pages_pos_locales" CASCADE;
  DROP TABLE "pages_jli" CASCADE;
  DROP TABLE "pages_jli_locales" CASCADE;
  DROP TABLE "pages_jsh_btn" CASCADE;
  DROP TABLE "pages_jsh_btn_locales" CASCADE;
  DROP TABLE "pages_jsh" CASCADE;
  DROP TABLE "pages_jsh_locales" CASCADE;
  DROP TABLE "pages_ird_nav" CASCADE;
  DROP TABLE "pages_ird_nav_locales" CASCADE;
  DROP TABLE "pages_ird_document_types" CASCADE;
  DROP TABLE "pages_ird" CASCADE;
  DROP TABLE "pages_ird_locales" CASCADE;
  DROP TABLE "__pages_v_pt_v" CASCADE;
  DROP TABLE "__pages_v_pt_v_locales" CASCADE;
  DROP TABLE "___pages_v_ps_v_btn_v" CASCADE;
  DROP TABLE "___pages_v_ps_v_btn_v_locales" CASCADE;
  DROP TABLE "__pages_v_ps_v" CASCADE;
  DROP TABLE "__pages_v_ps_v_locales" CASCADE;
  DROP TABLE "___pages_v_ss_v_btn_v" CASCADE;
  DROP TABLE "___pages_v_ss_v_btn_v_locales" CASCADE;
  DROP TABLE "__pages_v_ss_v" CASCADE;
  DROP TABLE "__pages_v_ss_v_locales" CASCADE;
  DROP TABLE "___pages_v_pos_v_btn_v" CASCADE;
  DROP TABLE "___pages_v_pos_v_btn_v_locales" CASCADE;
  DROP TABLE "___pages_v_pos_v_it_v" CASCADE;
  DROP TABLE "___pages_v_pos_v_it_v_locales" CASCADE;
  DROP TABLE "__pages_v_pos_v" CASCADE;
  DROP TABLE "__pages_v_pos_v_locales" CASCADE;
  DROP TABLE "__pages_v_jli_v" CASCADE;
  DROP TABLE "__pages_v_jli_v_locales" CASCADE;
  DROP TABLE "___pages_v_jsh_v_btn_v" CASCADE;
  DROP TABLE "___pages_v_jsh_v_btn_v_locales" CASCADE;
  DROP TABLE "__pages_v_jsh_v" CASCADE;
  DROP TABLE "__pages_v_jsh_v_locales" CASCADE;
  DROP TABLE "___pages_v_ird_v_nav_v" CASCADE;
  DROP TABLE "___pages_v_ird_v_nav_v_locales" CASCADE;
  DROP TABLE "__pages_v_ird_v_document_types" CASCADE;
  DROP TABLE "__pages_v_ird_v" CASCADE;
  DROP TABLE "__pages_v_ird_v_locales" CASCADE;
  DROP TABLE "shared_pages_pt" CASCADE;
  DROP TABLE "shared_pages_pt_locales" CASCADE;
  DROP TABLE "shared_pages_ps_btn" CASCADE;
  DROP TABLE "shared_pages_ps_btn_locales" CASCADE;
  DROP TABLE "shared_pages_ps" CASCADE;
  DROP TABLE "shared_pages_ps_locales" CASCADE;
  DROP TABLE "shared_pages_ss_btn" CASCADE;
  DROP TABLE "shared_pages_ss_btn_locales" CASCADE;
  DROP TABLE "shared_pages_ss" CASCADE;
  DROP TABLE "shared_pages_ss_locales" CASCADE;
  DROP TABLE "shared_pages_pos_btn" CASCADE;
  DROP TABLE "shared_pages_pos_btn_locales" CASCADE;
  DROP TABLE "shared_pages_pos_it" CASCADE;
  DROP TABLE "shared_pages_pos_it_locales" CASCADE;
  DROP TABLE "shared_pages_pos" CASCADE;
  DROP TABLE "shared_pages_pos_locales" CASCADE;
  DROP TABLE "shared_pages_jli" CASCADE;
  DROP TABLE "shared_pages_jli_locales" CASCADE;
  DROP TABLE "shared_pages_jsh_btn" CASCADE;
  DROP TABLE "shared_pages_jsh_btn_locales" CASCADE;
  DROP TABLE "shared_pages_jsh" CASCADE;
  DROP TABLE "shared_pages_jsh_locales" CASCADE;
  DROP TABLE "shared_pages_ird_nav" CASCADE;
  DROP TABLE "shared_pages_ird_nav_locales" CASCADE;
  DROP TABLE "shared_pages_ird_document_types" CASCADE;
  DROP TABLE "shared_pages_ird" CASCADE;
  DROP TABLE "shared_pages_ird_locales" CASCADE;
  DROP TABLE "__shared_pages_v_pt_v" CASCADE;
  DROP TABLE "__shared_pages_v_pt_v_locales" CASCADE;
  DROP TABLE "___shared_pages_v_ps_v_btn_v" CASCADE;
  DROP TABLE "___shared_pages_v_ps_v_btn_v_locales" CASCADE;
  DROP TABLE "__shared_pages_v_ps_v" CASCADE;
  DROP TABLE "__shared_pages_v_ps_v_locales" CASCADE;
  DROP TABLE "___shared_pages_v_ss_v_btn_v" CASCADE;
  DROP TABLE "___shared_pages_v_ss_v_btn_v_locales" CASCADE;
  DROP TABLE "__shared_pages_v_ss_v" CASCADE;
  DROP TABLE "__shared_pages_v_ss_v_locales" CASCADE;
  DROP TABLE "___shared_pages_v_pos_v_btn_v" CASCADE;
  DROP TABLE "___shared_pages_v_pos_v_btn_v_locales" CASCADE;
  DROP TABLE "___shared_pages_v_pos_v_it_v" CASCADE;
  DROP TABLE "___shared_pages_v_pos_v_it_v_locales" CASCADE;
  DROP TABLE "__shared_pages_v_pos_v" CASCADE;
  DROP TABLE "__shared_pages_v_pos_v_locales" CASCADE;
  DROP TABLE "__shared_pages_v_jli_v" CASCADE;
  DROP TABLE "__shared_pages_v_jli_v_locales" CASCADE;
  DROP TABLE "___shared_pages_v_jsh_v_btn_v" CASCADE;
  DROP TABLE "___shared_pages_v_jsh_v_btn_v_locales" CASCADE;
  DROP TABLE "__shared_pages_v_jsh_v" CASCADE;
  DROP TABLE "__shared_pages_v_jsh_v_locales" CASCADE;
  DROP TABLE "___shared_pages_v_ird_v_nav_v" CASCADE;
  DROP TABLE "___shared_pages_v_ird_v_nav_v_locales" CASCADE;
  DROP TABLE "__shared_pages_v_ird_v_document_types" CASCADE;
  DROP TABLE "__shared_pages_v_ird_v" CASCADE;
  DROP TABLE "__shared_pages_v_ird_v_locales" CASCADE;
  DROP TABLE "detail_templates_pt" CASCADE;
  DROP TABLE "detail_templates_pt_locales" CASCADE;
  DROP TABLE "detail_templates_ps_btn" CASCADE;
  DROP TABLE "detail_templates_ps_btn_locales" CASCADE;
  DROP TABLE "detail_templates_ps" CASCADE;
  DROP TABLE "detail_templates_ps_locales" CASCADE;
  DROP TABLE "detail_templates_ss_btn" CASCADE;
  DROP TABLE "detail_templates_ss_btn_locales" CASCADE;
  DROP TABLE "detail_templates_ss" CASCADE;
  DROP TABLE "detail_templates_ss_locales" CASCADE;
  DROP TABLE "detail_templates_pos_btn" CASCADE;
  DROP TABLE "detail_templates_pos_btn_locales" CASCADE;
  DROP TABLE "detail_templates_pos_it" CASCADE;
  DROP TABLE "detail_templates_pos_it_locales" CASCADE;
  DROP TABLE "detail_templates_pos" CASCADE;
  DROP TABLE "detail_templates_pos_locales" CASCADE;
  DROP TABLE "detail_templates_jli" CASCADE;
  DROP TABLE "detail_templates_jli_locales" CASCADE;
  DROP TABLE "detail_templates_jsh_btn" CASCADE;
  DROP TABLE "detail_templates_jsh_btn_locales" CASCADE;
  DROP TABLE "detail_templates_jsh" CASCADE;
  DROP TABLE "detail_templates_jsh_locales" CASCADE;
  DROP TABLE "detail_templates_ird_nav" CASCADE;
  DROP TABLE "detail_templates_ird_nav_locales" CASCADE;
  DROP TABLE "detail_templates_ird_document_types" CASCADE;
  DROP TABLE "detail_templates_ird" CASCADE;
  DROP TABLE "detail_templates_ird_locales" CASCADE;
  DROP TABLE "__detail_templates_v_pt_v" CASCADE;
  DROP TABLE "__detail_templates_v_pt_v_locales" CASCADE;
  DROP TABLE "___detail_templates_v_ps_v_btn_v" CASCADE;
  DROP TABLE "___detail_templates_v_ps_v_btn_v_locales" CASCADE;
  DROP TABLE "__detail_templates_v_ps_v" CASCADE;
  DROP TABLE "__detail_templates_v_ps_v_locales" CASCADE;
  DROP TABLE "___detail_templates_v_ss_v_btn_v" CASCADE;
  DROP TABLE "___detail_templates_v_ss_v_btn_v_locales" CASCADE;
  DROP TABLE "__detail_templates_v_ss_v" CASCADE;
  DROP TABLE "__detail_templates_v_ss_v_locales" CASCADE;
  DROP TABLE "___detail_templates_v_pos_v_btn_v" CASCADE;
  DROP TABLE "___detail_templates_v_pos_v_btn_v_locales" CASCADE;
  DROP TABLE "___detail_templates_v_pos_v_it_v" CASCADE;
  DROP TABLE "___detail_templates_v_pos_v_it_v_locales" CASCADE;
  DROP TABLE "__detail_templates_v_pos_v" CASCADE;
  DROP TABLE "__detail_templates_v_pos_v_locales" CASCADE;
  DROP TABLE "__detail_templates_v_jli_v" CASCADE;
  DROP TABLE "__detail_templates_v_jli_v_locales" CASCADE;
  DROP TABLE "___detail_templates_v_jsh_v_btn_v" CASCADE;
  DROP TABLE "___detail_templates_v_jsh_v_btn_v_locales" CASCADE;
  DROP TABLE "__detail_templates_v_jsh_v" CASCADE;
  DROP TABLE "__detail_templates_v_jsh_v_locales" CASCADE;
  DROP TABLE "___detail_templates_v_ird_v_nav_v" CASCADE;
  DROP TABLE "___detail_templates_v_ird_v_nav_v_locales" CASCADE;
  DROP TABLE "__detail_templates_v_ird_v_document_types" CASCADE;
  DROP TABLE "__detail_templates_v_ird_v" CASCADE;
  DROP TABLE "__detail_templates_v_ird_v_locales" CASCADE;
  DROP TABLE "shared_detail_templates_pt" CASCADE;
  DROP TABLE "shared_detail_templates_pt_locales" CASCADE;
  DROP TABLE "shared_detail_templates_ps_btn" CASCADE;
  DROP TABLE "shared_detail_templates_ps_btn_locales" CASCADE;
  DROP TABLE "shared_detail_templates_ps" CASCADE;
  DROP TABLE "shared_detail_templates_ps_locales" CASCADE;
  DROP TABLE "shared_detail_templates_ss_btn" CASCADE;
  DROP TABLE "shared_detail_templates_ss_btn_locales" CASCADE;
  DROP TABLE "shared_detail_templates_ss" CASCADE;
  DROP TABLE "shared_detail_templates_ss_locales" CASCADE;
  DROP TABLE "shared_detail_templates_pos_btn" CASCADE;
  DROP TABLE "shared_detail_templates_pos_btn_locales" CASCADE;
  DROP TABLE "shared_detail_templates_pos_it" CASCADE;
  DROP TABLE "shared_detail_templates_pos_it_locales" CASCADE;
  DROP TABLE "shared_detail_templates_pos" CASCADE;
  DROP TABLE "shared_detail_templates_pos_locales" CASCADE;
  DROP TABLE "shared_detail_templates_jli" CASCADE;
  DROP TABLE "shared_detail_templates_jli_locales" CASCADE;
  DROP TABLE "shared_detail_templates_jsh_btn" CASCADE;
  DROP TABLE "shared_detail_templates_jsh_btn_locales" CASCADE;
  DROP TABLE "shared_detail_templates_jsh" CASCADE;
  DROP TABLE "shared_detail_templates_jsh_locales" CASCADE;
  DROP TABLE "shared_detail_templates_ird_nav" CASCADE;
  DROP TABLE "shared_detail_templates_ird_nav_locales" CASCADE;
  DROP TABLE "shared_detail_templates_ird_document_types" CASCADE;
  DROP TABLE "shared_detail_templates_ird" CASCADE;
  DROP TABLE "shared_detail_templates_ird_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_pt_v" CASCADE;
  DROP TABLE "__shared_detail_templates_v_pt_v_locales" CASCADE;
  DROP TABLE "___shared_detail_templates_v_ps_v_btn_v" CASCADE;
  DROP TABLE "___shared_detail_templates_v_ps_v_btn_v_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_ps_v" CASCADE;
  DROP TABLE "__shared_detail_templates_v_ps_v_locales" CASCADE;
  DROP TABLE "___shared_detail_templates_v_ss_v_btn_v" CASCADE;
  DROP TABLE "___shared_detail_templates_v_ss_v_btn_v_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_ss_v" CASCADE;
  DROP TABLE "__shared_detail_templates_v_ss_v_locales" CASCADE;
  DROP TABLE "___shared_detail_templates_v_pos_v_btn_v" CASCADE;
  DROP TABLE "___shared_detail_templates_v_pos_v_btn_v_locales" CASCADE;
  DROP TABLE "___shared_detail_templates_v_pos_v_it_v" CASCADE;
  DROP TABLE "___shared_detail_templates_v_pos_v_it_v_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_pos_v" CASCADE;
  DROP TABLE "__shared_detail_templates_v_pos_v_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_jli_v" CASCADE;
  DROP TABLE "__shared_detail_templates_v_jli_v_locales" CASCADE;
  DROP TABLE "___shared_detail_templates_v_jsh_v_btn_v" CASCADE;
  DROP TABLE "___shared_detail_templates_v_jsh_v_btn_v_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_jsh_v" CASCADE;
  DROP TABLE "__shared_detail_templates_v_jsh_v_locales" CASCADE;
  DROP TABLE "___shared_detail_templates_v_ird_v_nav_v" CASCADE;
  DROP TABLE "___shared_detail_templates_v_ird_v_nav_v_locales" CASCADE;
  DROP TABLE "__shared_detail_templates_v_ird_v_document_types" CASCADE;
  DROP TABLE "__shared_detail_templates_v_ird_v" CASCADE;
  DROP TABLE "__shared_detail_templates_v_ird_v_locales" CASCADE;
  DROP TYPE "public"."enum_pages_pt_heading_align";
  DROP TYPE "public"."enum_pages_pt_default_tab";
  DROP TYPE "public"."enum_pages_pt_cta_card_link_type";
  DROP TYPE "public"."enum_pages_pt_bottom_cta_first_type";
  DROP TYPE "public"."enum_pages_pt_bottom_cta_first_style";
  DROP TYPE "public"."enum_pages_pt_bottom_cta_second_type";
  DROP TYPE "public"."enum_pages_pt_bottom_cta_second_style";
  DROP TYPE "public"."enum_pages_pt_appearance_background";
  DROP TYPE "public"."enum_pages_ps_btn_link_type";
  DROP TYPE "public"."enum_pages_ps_btn_style";
  DROP TYPE "public"."enum_pages_ps_heading_align";
  DROP TYPE "public"."enum_pages_ps_source";
  DROP TYPE "public"."enum_pages_ps_card_style";
  DROP TYPE "public"."enum_pages_ps_cta_card_link_type";
  DROP TYPE "public"."enum_pages_ps_bottom_cta_first_type";
  DROP TYPE "public"."enum_pages_ps_bottom_cta_first_style";
  DROP TYPE "public"."enum_pages_ps_bottom_cta_second_type";
  DROP TYPE "public"."enum_pages_ps_bottom_cta_second_style";
  DROP TYPE "public"."enum_pages_ps_appearance_background";
  DROP TYPE "public"."enum_pages_ss_btn_link_type";
  DROP TYPE "public"."enum_pages_ss_btn_style";
  DROP TYPE "public"."enum_pages_ss_heading_align";
  DROP TYPE "public"."enum_pages_ss_source";
  DROP TYPE "public"."enum_pages_ss_card_style";
  DROP TYPE "public"."enum_pages_ss_cta_card_link_type";
  DROP TYPE "public"."enum_pages_ss_bottom_cta_first_type";
  DROP TYPE "public"."enum_pages_ss_bottom_cta_first_style";
  DROP TYPE "public"."enum_pages_ss_bottom_cta_second_type";
  DROP TYPE "public"."enum_pages_ss_bottom_cta_second_style";
  DROP TYPE "public"."enum_pages_ss_appearance_background";
  DROP TYPE "public"."enum_pages_pos_btn_link_type";
  DROP TYPE "public"."enum_pages_pos_btn_style";
  DROP TYPE "public"."enum_pages_pos_heading_align";
  DROP TYPE "public"."enum_pages_pos_source";
  DROP TYPE "public"."enum_pages_pos_layout";
  DROP TYPE "public"."enum_pages_pos_card_eyebrow";
  DROP TYPE "public"."enum_pages_pos_appearance_background";
  DROP TYPE "public"."enum_pages_jli_heading_align";
  DROP TYPE "public"."enum_pages_jsh_btn_link_type";
  DROP TYPE "public"."enum_pages_jsh_btn_style";
  DROP TYPE "public"."enum_pages_jsh_heading_align";
  DROP TYPE "public"."enum_pages_jsh_source";
  DROP TYPE "public"."enum_pages_jsh_appearance_background";
  DROP TYPE "public"."enum_pages_ird_nav_link_type";
  DROP TYPE "public"."enum_pages_ird_document_types";
  DROP TYPE "public"."enum_pages_ird_heading_align";
  DROP TYPE "public"."enum___pages_v_pt_v_heading_align";
  DROP TYPE "public"."enum___pages_v_pt_v_default_tab";
  DROP TYPE "public"."enum___pages_v_pt_v_cta_card_link_type";
  DROP TYPE "public"."enum___pages_v_pt_v_bottom_cta_first_type";
  DROP TYPE "public"."enum___pages_v_pt_v_bottom_cta_first_style";
  DROP TYPE "public"."enum___pages_v_pt_v_bottom_cta_second_type";
  DROP TYPE "public"."enum___pages_v_pt_v_bottom_cta_second_style";
  DROP TYPE "public"."enum___pages_v_pt_v_appearance_background";
  DROP TYPE "public"."enum____pages_v_ps_v_btn_v_link_type";
  DROP TYPE "public"."enum____pages_v_ps_v_btn_v_style";
  DROP TYPE "public"."enum___pages_v_ps_v_heading_align";
  DROP TYPE "public"."enum___pages_v_ps_v_source";
  DROP TYPE "public"."enum___pages_v_ps_v_card_style";
  DROP TYPE "public"."enum___pages_v_ps_v_cta_card_link_type";
  DROP TYPE "public"."enum___pages_v_ps_v_bottom_cta_first_type";
  DROP TYPE "public"."enum___pages_v_ps_v_bottom_cta_first_style";
  DROP TYPE "public"."enum___pages_v_ps_v_bottom_cta_second_type";
  DROP TYPE "public"."enum___pages_v_ps_v_bottom_cta_second_style";
  DROP TYPE "public"."enum___pages_v_ps_v_appearance_background";
  DROP TYPE "public"."enum____pages_v_ss_v_btn_v_link_type";
  DROP TYPE "public"."enum____pages_v_ss_v_btn_v_style";
  DROP TYPE "public"."enum___pages_v_ss_v_heading_align";
  DROP TYPE "public"."enum___pages_v_ss_v_source";
  DROP TYPE "public"."enum___pages_v_ss_v_card_style";
  DROP TYPE "public"."enum___pages_v_ss_v_cta_card_link_type";
  DROP TYPE "public"."enum___pages_v_ss_v_bottom_cta_first_type";
  DROP TYPE "public"."enum___pages_v_ss_v_bottom_cta_first_style";
  DROP TYPE "public"."enum___pages_v_ss_v_bottom_cta_second_type";
  DROP TYPE "public"."enum___pages_v_ss_v_bottom_cta_second_style";
  DROP TYPE "public"."enum___pages_v_ss_v_appearance_background";
  DROP TYPE "public"."enum____pages_v_pos_v_btn_v_link_type";
  DROP TYPE "public"."enum____pages_v_pos_v_btn_v_style";
  DROP TYPE "public"."enum___pages_v_pos_v_heading_align";
  DROP TYPE "public"."enum___pages_v_pos_v_source";
  DROP TYPE "public"."enum___pages_v_pos_v_layout";
  DROP TYPE "public"."enum___pages_v_pos_v_card_eyebrow";
  DROP TYPE "public"."enum___pages_v_pos_v_appearance_background";
  DROP TYPE "public"."enum___pages_v_jli_v_heading_align";
  DROP TYPE "public"."enum____pages_v_jsh_v_btn_v_link_type";
  DROP TYPE "public"."enum____pages_v_jsh_v_btn_v_style";
  DROP TYPE "public"."enum___pages_v_jsh_v_heading_align";
  DROP TYPE "public"."enum___pages_v_jsh_v_source";
  DROP TYPE "public"."enum___pages_v_jsh_v_appearance_background";
  DROP TYPE "public"."enum____pages_v_ird_v_nav_v_link_type";
  DROP TYPE "public"."enum___pages_v_ird_v_document_types";
  DROP TYPE "public"."enum___pages_v_ird_v_heading_align";
  DROP TYPE "public"."enum_shared_pages_pt_heading_align";
  DROP TYPE "public"."enum_shared_pages_pt_default_tab";
  DROP TYPE "public"."enum_shared_pages_pt_cta_card_link_type";
  DROP TYPE "public"."enum_shared_pages_pt_bottom_cta_first_type";
  DROP TYPE "public"."enum_shared_pages_pt_bottom_cta_first_style";
  DROP TYPE "public"."enum_shared_pages_pt_bottom_cta_second_type";
  DROP TYPE "public"."enum_shared_pages_pt_bottom_cta_second_style";
  DROP TYPE "public"."enum_shared_pages_pt_appearance_background";
  DROP TYPE "public"."enum_shared_pages_ps_btn_link_type";
  DROP TYPE "public"."enum_shared_pages_ps_btn_style";
  DROP TYPE "public"."enum_shared_pages_ps_heading_align";
  DROP TYPE "public"."enum_shared_pages_ps_source";
  DROP TYPE "public"."enum_shared_pages_ps_card_style";
  DROP TYPE "public"."enum_shared_pages_ps_cta_card_link_type";
  DROP TYPE "public"."enum_shared_pages_ps_bottom_cta_first_type";
  DROP TYPE "public"."enum_shared_pages_ps_bottom_cta_first_style";
  DROP TYPE "public"."enum_shared_pages_ps_bottom_cta_second_type";
  DROP TYPE "public"."enum_shared_pages_ps_bottom_cta_second_style";
  DROP TYPE "public"."enum_shared_pages_ps_appearance_background";
  DROP TYPE "public"."enum_shared_pages_ss_btn_link_type";
  DROP TYPE "public"."enum_shared_pages_ss_btn_style";
  DROP TYPE "public"."enum_shared_pages_ss_heading_align";
  DROP TYPE "public"."enum_shared_pages_ss_source";
  DROP TYPE "public"."enum_shared_pages_ss_card_style";
  DROP TYPE "public"."enum_shared_pages_ss_cta_card_link_type";
  DROP TYPE "public"."enum_shared_pages_ss_bottom_cta_first_type";
  DROP TYPE "public"."enum_shared_pages_ss_bottom_cta_first_style";
  DROP TYPE "public"."enum_shared_pages_ss_bottom_cta_second_type";
  DROP TYPE "public"."enum_shared_pages_ss_bottom_cta_second_style";
  DROP TYPE "public"."enum_shared_pages_ss_appearance_background";
  DROP TYPE "public"."enum_shared_pages_pos_btn_link_type";
  DROP TYPE "public"."enum_shared_pages_pos_btn_style";
  DROP TYPE "public"."enum_shared_pages_pos_heading_align";
  DROP TYPE "public"."enum_shared_pages_pos_source";
  DROP TYPE "public"."enum_shared_pages_pos_layout";
  DROP TYPE "public"."enum_shared_pages_pos_card_eyebrow";
  DROP TYPE "public"."enum_shared_pages_pos_appearance_background";
  DROP TYPE "public"."enum_shared_pages_jli_heading_align";
  DROP TYPE "public"."enum_shared_pages_jsh_btn_link_type";
  DROP TYPE "public"."enum_shared_pages_jsh_btn_style";
  DROP TYPE "public"."enum_shared_pages_jsh_heading_align";
  DROP TYPE "public"."enum_shared_pages_jsh_source";
  DROP TYPE "public"."enum_shared_pages_jsh_appearance_background";
  DROP TYPE "public"."enum_shared_pages_ird_nav_link_type";
  DROP TYPE "public"."enum_shared_pages_ird_document_types";
  DROP TYPE "public"."enum_shared_pages_ird_heading_align";
  DROP TYPE "public"."enum___shared_pages_v_pt_v_heading_align";
  DROP TYPE "public"."enum___shared_pages_v_pt_v_default_tab";
  DROP TYPE "public"."enum___shared_pages_v_pt_v_cta_card_link_type";
  DROP TYPE "public"."enum___shared_pages_v_pt_v_bottom_cta_first_type";
  DROP TYPE "public"."enum___shared_pages_v_pt_v_bottom_cta_first_style";
  DROP TYPE "public"."enum___shared_pages_v_pt_v_bottom_cta_second_type";
  DROP TYPE "public"."enum___shared_pages_v_pt_v_bottom_cta_second_style";
  DROP TYPE "public"."enum___shared_pages_v_pt_v_appearance_background";
  DROP TYPE "public"."enum____shared_pages_v_ps_v_btn_v_link_type";
  DROP TYPE "public"."enum____shared_pages_v_ps_v_btn_v_style";
  DROP TYPE "public"."enum___shared_pages_v_ps_v_heading_align";
  DROP TYPE "public"."enum___shared_pages_v_ps_v_source";
  DROP TYPE "public"."enum___shared_pages_v_ps_v_card_style";
  DROP TYPE "public"."enum___shared_pages_v_ps_v_cta_card_link_type";
  DROP TYPE "public"."enum___shared_pages_v_ps_v_bottom_cta_first_type";
  DROP TYPE "public"."enum___shared_pages_v_ps_v_bottom_cta_first_style";
  DROP TYPE "public"."enum___shared_pages_v_ps_v_bottom_cta_second_type";
  DROP TYPE "public"."enum___shared_pages_v_ps_v_bottom_cta_second_style";
  DROP TYPE "public"."enum___shared_pages_v_ps_v_appearance_background";
  DROP TYPE "public"."enum____shared_pages_v_ss_v_btn_v_link_type";
  DROP TYPE "public"."enum____shared_pages_v_ss_v_btn_v_style";
  DROP TYPE "public"."enum___shared_pages_v_ss_v_heading_align";
  DROP TYPE "public"."enum___shared_pages_v_ss_v_source";
  DROP TYPE "public"."enum___shared_pages_v_ss_v_card_style";
  DROP TYPE "public"."enum___shared_pages_v_ss_v_cta_card_link_type";
  DROP TYPE "public"."enum___shared_pages_v_ss_v_bottom_cta_first_type";
  DROP TYPE "public"."enum___shared_pages_v_ss_v_bottom_cta_first_style";
  DROP TYPE "public"."enum___shared_pages_v_ss_v_bottom_cta_second_type";
  DROP TYPE "public"."enum___shared_pages_v_ss_v_bottom_cta_second_style";
  DROP TYPE "public"."enum___shared_pages_v_ss_v_appearance_background";
  DROP TYPE "public"."enum____shared_pages_v_pos_v_btn_v_link_type";
  DROP TYPE "public"."enum____shared_pages_v_pos_v_btn_v_style";
  DROP TYPE "public"."enum___shared_pages_v_pos_v_heading_align";
  DROP TYPE "public"."enum___shared_pages_v_pos_v_source";
  DROP TYPE "public"."enum___shared_pages_v_pos_v_layout";
  DROP TYPE "public"."enum___shared_pages_v_pos_v_card_eyebrow";
  DROP TYPE "public"."enum___shared_pages_v_pos_v_appearance_background";
  DROP TYPE "public"."enum___shared_pages_v_jli_v_heading_align";
  DROP TYPE "public"."enum____shared_pages_v_jsh_v_btn_v_link_type";
  DROP TYPE "public"."enum____shared_pages_v_jsh_v_btn_v_style";
  DROP TYPE "public"."enum___shared_pages_v_jsh_v_heading_align";
  DROP TYPE "public"."enum___shared_pages_v_jsh_v_source";
  DROP TYPE "public"."enum___shared_pages_v_jsh_v_appearance_background";
  DROP TYPE "public"."enum____shared_pages_v_ird_v_nav_v_link_type";
  DROP TYPE "public"."enum___shared_pages_v_ird_v_document_types";
  DROP TYPE "public"."enum___shared_pages_v_ird_v_heading_align";
  DROP TYPE "public"."enum_detail_templates_pt_heading_align";
  DROP TYPE "public"."enum_detail_templates_pt_default_tab";
  DROP TYPE "public"."enum_detail_templates_pt_cta_card_link_type";
  DROP TYPE "public"."enum_detail_templates_pt_bottom_cta_first_type";
  DROP TYPE "public"."enum_detail_templates_pt_bottom_cta_first_style";
  DROP TYPE "public"."enum_detail_templates_pt_bottom_cta_second_type";
  DROP TYPE "public"."enum_detail_templates_pt_bottom_cta_second_style";
  DROP TYPE "public"."enum_detail_templates_pt_appearance_background";
  DROP TYPE "public"."enum_detail_templates_ps_btn_link_type";
  DROP TYPE "public"."enum_detail_templates_ps_btn_style";
  DROP TYPE "public"."enum_detail_templates_ps_heading_align";
  DROP TYPE "public"."enum_detail_templates_ps_source";
  DROP TYPE "public"."enum_detail_templates_ps_card_style";
  DROP TYPE "public"."enum_detail_templates_ps_cta_card_link_type";
  DROP TYPE "public"."enum_detail_templates_ps_bottom_cta_first_type";
  DROP TYPE "public"."enum_detail_templates_ps_bottom_cta_first_style";
  DROP TYPE "public"."enum_detail_templates_ps_bottom_cta_second_type";
  DROP TYPE "public"."enum_detail_templates_ps_bottom_cta_second_style";
  DROP TYPE "public"."enum_detail_templates_ps_appearance_background";
  DROP TYPE "public"."enum_detail_templates_ss_btn_link_type";
  DROP TYPE "public"."enum_detail_templates_ss_btn_style";
  DROP TYPE "public"."enum_detail_templates_ss_heading_align";
  DROP TYPE "public"."enum_detail_templates_ss_source";
  DROP TYPE "public"."enum_detail_templates_ss_card_style";
  DROP TYPE "public"."enum_detail_templates_ss_cta_card_link_type";
  DROP TYPE "public"."enum_detail_templates_ss_bottom_cta_first_type";
  DROP TYPE "public"."enum_detail_templates_ss_bottom_cta_first_style";
  DROP TYPE "public"."enum_detail_templates_ss_bottom_cta_second_type";
  DROP TYPE "public"."enum_detail_templates_ss_bottom_cta_second_style";
  DROP TYPE "public"."enum_detail_templates_ss_appearance_background";
  DROP TYPE "public"."enum_detail_templates_pos_btn_link_type";
  DROP TYPE "public"."enum_detail_templates_pos_btn_style";
  DROP TYPE "public"."enum_detail_templates_pos_heading_align";
  DROP TYPE "public"."enum_detail_templates_pos_source";
  DROP TYPE "public"."enum_detail_templates_pos_layout";
  DROP TYPE "public"."enum_detail_templates_pos_card_eyebrow";
  DROP TYPE "public"."enum_detail_templates_pos_appearance_background";
  DROP TYPE "public"."enum_detail_templates_jli_heading_align";
  DROP TYPE "public"."enum_detail_templates_jsh_btn_link_type";
  DROP TYPE "public"."enum_detail_templates_jsh_btn_style";
  DROP TYPE "public"."enum_detail_templates_jsh_heading_align";
  DROP TYPE "public"."enum_detail_templates_jsh_source";
  DROP TYPE "public"."enum_detail_templates_jsh_appearance_background";
  DROP TYPE "public"."enum_detail_templates_ird_nav_link_type";
  DROP TYPE "public"."enum_detail_templates_ird_document_types";
  DROP TYPE "public"."enum_detail_templates_ird_heading_align";
  DROP TYPE "public"."enum___detail_templates_v_pt_v_heading_align";
  DROP TYPE "public"."enum___detail_templates_v_pt_v_default_tab";
  DROP TYPE "public"."enum___detail_templates_v_pt_v_cta_card_link_type";
  DROP TYPE "public"."enum___detail_templates_v_pt_v_bottom_cta_first_type";
  DROP TYPE "public"."enum___detail_templates_v_pt_v_bottom_cta_first_style";
  DROP TYPE "public"."enum___detail_templates_v_pt_v_bottom_cta_second_type";
  DROP TYPE "public"."enum___detail_templates_v_pt_v_bottom_cta_second_style";
  DROP TYPE "public"."enum___detail_templates_v_pt_v_appearance_background";
  DROP TYPE "public"."enum____detail_templates_v_ps_v_btn_v_link_type";
  DROP TYPE "public"."enum____detail_templates_v_ps_v_btn_v_style";
  DROP TYPE "public"."enum___detail_templates_v_ps_v_heading_align";
  DROP TYPE "public"."enum___detail_templates_v_ps_v_source";
  DROP TYPE "public"."enum___detail_templates_v_ps_v_card_style";
  DROP TYPE "public"."enum___detail_templates_v_ps_v_cta_card_link_type";
  DROP TYPE "public"."enum___detail_templates_v_ps_v_bottom_cta_first_type";
  DROP TYPE "public"."enum___detail_templates_v_ps_v_bottom_cta_first_style";
  DROP TYPE "public"."enum___detail_templates_v_ps_v_bottom_cta_second_type";
  DROP TYPE "public"."enum___detail_templates_v_ps_v_bottom_cta_second_style";
  DROP TYPE "public"."enum___detail_templates_v_ps_v_appearance_background";
  DROP TYPE "public"."enum____detail_templates_v_ss_v_btn_v_link_type";
  DROP TYPE "public"."enum____detail_templates_v_ss_v_btn_v_style";
  DROP TYPE "public"."enum___detail_templates_v_ss_v_heading_align";
  DROP TYPE "public"."enum___detail_templates_v_ss_v_source";
  DROP TYPE "public"."enum___detail_templates_v_ss_v_card_style";
  DROP TYPE "public"."enum___detail_templates_v_ss_v_cta_card_link_type";
  DROP TYPE "public"."enum___detail_templates_v_ss_v_bottom_cta_first_type";
  DROP TYPE "public"."enum___detail_templates_v_ss_v_bottom_cta_first_style";
  DROP TYPE "public"."enum___detail_templates_v_ss_v_bottom_cta_second_type";
  DROP TYPE "public"."enum___detail_templates_v_ss_v_bottom_cta_second_style";
  DROP TYPE "public"."enum___detail_templates_v_ss_v_appearance_background";
  DROP TYPE "public"."enum____detail_templates_v_pos_v_btn_v_link_type";
  DROP TYPE "public"."enum____detail_templates_v_pos_v_btn_v_style";
  DROP TYPE "public"."enum___detail_templates_v_pos_v_heading_align";
  DROP TYPE "public"."enum___detail_templates_v_pos_v_source";
  DROP TYPE "public"."enum___detail_templates_v_pos_v_layout";
  DROP TYPE "public"."enum___detail_templates_v_pos_v_card_eyebrow";
  DROP TYPE "public"."enum___detail_templates_v_pos_v_appearance_background";
  DROP TYPE "public"."enum___detail_templates_v_jli_v_heading_align";
  DROP TYPE "public"."enum____detail_templates_v_jsh_v_btn_v_link_type";
  DROP TYPE "public"."enum____detail_templates_v_jsh_v_btn_v_style";
  DROP TYPE "public"."enum___detail_templates_v_jsh_v_heading_align";
  DROP TYPE "public"."enum___detail_templates_v_jsh_v_source";
  DROP TYPE "public"."enum___detail_templates_v_jsh_v_appearance_background";
  DROP TYPE "public"."enum____detail_templates_v_ird_v_nav_v_link_type";
  DROP TYPE "public"."enum___detail_templates_v_ird_v_document_types";
  DROP TYPE "public"."enum___detail_templates_v_ird_v_heading_align";
  DROP TYPE "public"."enum_shared_detail_templates_pt_heading_align";
  DROP TYPE "public"."enum_shared_detail_templates_pt_default_tab";
  DROP TYPE "public"."enum_shared_detail_templates_pt_cta_card_link_type";
  DROP TYPE "public"."enum_shared_detail_templates_pt_bottom_cta_first_type";
  DROP TYPE "public"."enum_shared_detail_templates_pt_bottom_cta_first_style";
  DROP TYPE "public"."enum_shared_detail_templates_pt_bottom_cta_second_type";
  DROP TYPE "public"."enum_shared_detail_templates_pt_bottom_cta_second_style";
  DROP TYPE "public"."enum_shared_detail_templates_pt_appearance_background";
  DROP TYPE "public"."enum_shared_detail_templates_ps_btn_link_type";
  DROP TYPE "public"."enum_shared_detail_templates_ps_btn_style";
  DROP TYPE "public"."enum_shared_detail_templates_ps_heading_align";
  DROP TYPE "public"."enum_shared_detail_templates_ps_source";
  DROP TYPE "public"."enum_shared_detail_templates_ps_card_style";
  DROP TYPE "public"."enum_shared_detail_templates_ps_cta_card_link_type";
  DROP TYPE "public"."enum_shared_detail_templates_ps_bottom_cta_first_type";
  DROP TYPE "public"."enum_shared_detail_templates_ps_bottom_cta_first_style";
  DROP TYPE "public"."enum_shared_detail_templates_ps_bottom_cta_second_type";
  DROP TYPE "public"."enum_shared_detail_templates_ps_bottom_cta_second_style";
  DROP TYPE "public"."enum_shared_detail_templates_ps_appearance_background";
  DROP TYPE "public"."enum_shared_detail_templates_ss_btn_link_type";
  DROP TYPE "public"."enum_shared_detail_templates_ss_btn_style";
  DROP TYPE "public"."enum_shared_detail_templates_ss_heading_align";
  DROP TYPE "public"."enum_shared_detail_templates_ss_source";
  DROP TYPE "public"."enum_shared_detail_templates_ss_card_style";
  DROP TYPE "public"."enum_shared_detail_templates_ss_cta_card_link_type";
  DROP TYPE "public"."enum_shared_detail_templates_ss_bottom_cta_first_type";
  DROP TYPE "public"."enum_shared_detail_templates_ss_bottom_cta_first_style";
  DROP TYPE "public"."enum_shared_detail_templates_ss_bottom_cta_second_type";
  DROP TYPE "public"."enum_shared_detail_templates_ss_bottom_cta_second_style";
  DROP TYPE "public"."enum_shared_detail_templates_ss_appearance_background";
  DROP TYPE "public"."enum_shared_detail_templates_pos_btn_link_type";
  DROP TYPE "public"."enum_shared_detail_templates_pos_btn_style";
  DROP TYPE "public"."enum_shared_detail_templates_pos_heading_align";
  DROP TYPE "public"."enum_shared_detail_templates_pos_source";
  DROP TYPE "public"."enum_shared_detail_templates_pos_layout";
  DROP TYPE "public"."enum_shared_detail_templates_pos_card_eyebrow";
  DROP TYPE "public"."enum_shared_detail_templates_pos_appearance_background";
  DROP TYPE "public"."enum_shared_detail_templates_jli_heading_align";
  DROP TYPE "public"."enum_shared_detail_templates_jsh_btn_link_type";
  DROP TYPE "public"."enum_shared_detail_templates_jsh_btn_style";
  DROP TYPE "public"."enum_shared_detail_templates_jsh_heading_align";
  DROP TYPE "public"."enum_shared_detail_templates_jsh_source";
  DROP TYPE "public"."enum_shared_detail_templates_jsh_appearance_background";
  DROP TYPE "public"."enum_shared_detail_templates_ird_nav_link_type";
  DROP TYPE "public"."enum_shared_detail_templates_ird_document_types";
  DROP TYPE "public"."enum_shared_detail_templates_ird_heading_align";
  DROP TYPE "public"."enum___shared_detail_templates_v_pt_v_heading_align";
  DROP TYPE "public"."enum___shared_detail_templates_v_pt_v_default_tab";
  DROP TYPE "public"."enum___shared_detail_templates_v_pt_v_cta_card_link_type";
  DROP TYPE "public"."enum___shared_detail_templates_v_pt_v_bottom_cta_first_type";
  DROP TYPE "public"."enum___shared_detail_templates_v_pt_v_bottom_cta_first_style";
  DROP TYPE "public"."enum___shared_detail_templates_v_pt_v_bottom_cta_second_type";
  DROP TYPE "public"."enum___shared_detail_templates_v_pt_v_bottom_cta_second_style";
  DROP TYPE "public"."enum___shared_detail_templates_v_pt_v_appearance_background";
  DROP TYPE "public"."enum____shared_detail_templates_v_ps_v_btn_v_link_type";
  DROP TYPE "public"."enum____shared_detail_templates_v_ps_v_btn_v_style";
  DROP TYPE "public"."enum___shared_detail_templates_v_ps_v_heading_align";
  DROP TYPE "public"."enum___shared_detail_templates_v_ps_v_source";
  DROP TYPE "public"."enum___shared_detail_templates_v_ps_v_card_style";
  DROP TYPE "public"."enum___shared_detail_templates_v_ps_v_cta_card_link_type";
  DROP TYPE "public"."enum___shared_detail_templates_v_ps_v_bottom_cta_first_type";
  DROP TYPE "public"."enum___shared_detail_templates_v_ps_v_bottom_cta_first_style";
  DROP TYPE "public"."enum___shared_detail_templates_v_ps_v_bottom_cta_second_type";
  DROP TYPE "public"."enum___shared_detail_templates_v_ps_v_bottom_cta_second_style";
  DROP TYPE "public"."enum___shared_detail_templates_v_ps_v_appearance_background";
  DROP TYPE "public"."enum____shared_detail_templates_v_ss_v_btn_v_link_type";
  DROP TYPE "public"."enum____shared_detail_templates_v_ss_v_btn_v_style";
  DROP TYPE "public"."enum___shared_detail_templates_v_ss_v_heading_align";
  DROP TYPE "public"."enum___shared_detail_templates_v_ss_v_source";
  DROP TYPE "public"."enum___shared_detail_templates_v_ss_v_card_style";
  DROP TYPE "public"."enum___shared_detail_templates_v_ss_v_cta_card_link_type";
  DROP TYPE "public"."enum___shared_detail_templates_v_ss_v_bottom_cta_first_type";
  DROP TYPE "public"."enum___shared_detail_templates_v_ss_v_bottom_cta_first_style";
  DROP TYPE "public"."enum___shared_detail_templates_v_ss_v_bottom_cta_second_type";
  DROP TYPE "public"."enum___shared_detail_templates_v_ss_v_bottom_cta_second_style";
  DROP TYPE "public"."enum___shared_detail_templates_v_ss_v_appearance_background";
  DROP TYPE "public"."enum____shared_detail_templates_v_pos_v_btn_v_link_type";
  DROP TYPE "public"."enum____shared_detail_templates_v_pos_v_btn_v_style";
  DROP TYPE "public"."enum___shared_detail_templates_v_pos_v_heading_align";
  DROP TYPE "public"."enum___shared_detail_templates_v_pos_v_source";
  DROP TYPE "public"."enum___shared_detail_templates_v_pos_v_layout";
  DROP TYPE "public"."enum___shared_detail_templates_v_pos_v_card_eyebrow";
  DROP TYPE "public"."enum___shared_detail_templates_v_pos_v_appearance_background";
  DROP TYPE "public"."enum___shared_detail_templates_v_jli_v_heading_align";
  DROP TYPE "public"."enum____shared_detail_templates_v_jsh_v_btn_v_link_type";
  DROP TYPE "public"."enum____shared_detail_templates_v_jsh_v_btn_v_style";
  DROP TYPE "public"."enum___shared_detail_templates_v_jsh_v_heading_align";
  DROP TYPE "public"."enum___shared_detail_templates_v_jsh_v_source";
  DROP TYPE "public"."enum___shared_detail_templates_v_jsh_v_appearance_background";
  DROP TYPE "public"."enum____shared_detail_templates_v_ird_v_nav_v_link_type";
  DROP TYPE "public"."enum___shared_detail_templates_v_ird_v_document_types";
  DROP TYPE "public"."enum___shared_detail_templates_v_ird_v_heading_align";`)
}
