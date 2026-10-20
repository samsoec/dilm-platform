import * as migration_20260926_154435_initial from './20260926_154435_initial';
import * as migration_20260926_192557_media_s3_storage from './20260926_192557_media_s3_storage';
import * as migration_20260927_041300_dilm_17_schema_collections from './20260927_041300_dilm_17_schema_collections';
import * as migration_20261008_042350_dilm_45_brand_identity from './20261008_042350_dilm_45_brand_identity';
import * as migration_20261008_065645_dilm_46_header_global from './20261008_065645_dilm_46_header_global';
import * as migration_20261008_070940_dilm_47_footer_global from './20261008_070940_dilm_47_footer_global';
import * as migration_20261014_140948_dilm_58_authoring_metadata from './20261014_140948_dilm_58_authoring_metadata';
import * as migration_20261014_232338_dilm_54_tenant_brand_color from './20261014_232338_dilm_54_tenant_brand_color';
import * as migration_20261018_041320_dilm_70_authoring_stamps from './20261018_041320_dilm_70_authoring_stamps';
import * as migration_20261018_043040_dilm_72_tenant_settings_versions from './20261018_043040_dilm_72_tenant_settings_versions';
import * as migration_20261018_074116_dilm_80_query_presets from './20261018_074116_dilm_80_query_presets';
import * as migration_20261019_233054_dilm_84_sync_tried_at from './20261019_233054_dilm_84_sync_tried_at';
import * as migration_20261020_022848_dilm_65_user_sign_in_and_inviter from './20261020_022848_dilm_65_user_sign_in_and_inviter';
import * as migration_20261020_055944_dilm_41_ir_versions_drafts_trash from './20261020_055944_dilm_41_ir_versions_drafts_trash';
import * as migration_20261020_073000_dilm_41_backfill_ir_versions from './20261020_073000_dilm_41_backfill_ir_versions';
import * as migration_20261020_090000_dilm_74_trashed_by from './20261020_090000_dilm_74_trashed_by';
import * as migration_20261020_112607_dilm_92_ir_uploaded_by from './20261020_112607_dilm_92_ir_uploaded_by';
import * as migration_20261020_134510_dilm_93_ir_purge_status from './20261020_134510_dilm_93_ir_purge_status';

export const migrations = [
  {
    up: migration_20260926_154435_initial.up,
    down: migration_20260926_154435_initial.down,
    name: '20260926_154435_initial',
  },
  {
    up: migration_20260926_192557_media_s3_storage.up,
    down: migration_20260926_192557_media_s3_storage.down,
    name: '20260926_192557_media_s3_storage',
  },
  {
    up: migration_20260927_041300_dilm_17_schema_collections.up,
    down: migration_20260927_041300_dilm_17_schema_collections.down,
    name: '20260927_041300_dilm_17_schema_collections',
  },
  {
    up: migration_20261008_042350_dilm_45_brand_identity.up,
    down: migration_20261008_042350_dilm_45_brand_identity.down,
    name: '20261008_042350_dilm_45_brand_identity',
  },
  {
    up: migration_20261008_065645_dilm_46_header_global.up,
    down: migration_20261008_065645_dilm_46_header_global.down,
    name: '20261008_065645_dilm_46_header_global',
  },
  {
    up: migration_20261008_070940_dilm_47_footer_global.up,
    down: migration_20261008_070940_dilm_47_footer_global.down,
    name: '20261008_070940_dilm_47_footer_global',
  },
  {
    up: migration_20261014_140948_dilm_58_authoring_metadata.up,
    down: migration_20261014_140948_dilm_58_authoring_metadata.down,
    name: '20261014_140948_dilm_58_authoring_metadata',
  },
  {
    up: migration_20261014_232338_dilm_54_tenant_brand_color.up,
    down: migration_20261014_232338_dilm_54_tenant_brand_color.down,
    name: '20261014_232338_dilm_54_tenant_brand_color',
  },
  {
    up: migration_20261018_041320_dilm_70_authoring_stamps.up,
    down: migration_20261018_041320_dilm_70_authoring_stamps.down,
    name: '20261018_041320_dilm_70_authoring_stamps',
  },
  {
    up: migration_20261018_043040_dilm_72_tenant_settings_versions.up,
    down: migration_20261018_043040_dilm_72_tenant_settings_versions.down,
    name: '20261018_043040_dilm_72_tenant_settings_versions',
  },
  {
    up: migration_20261018_074116_dilm_80_query_presets.up,
    down: migration_20261018_074116_dilm_80_query_presets.down,
    name: '20261018_074116_dilm_80_query_presets',
  },
  {
    up: migration_20261019_233054_dilm_84_sync_tried_at.up,
    down: migration_20261019_233054_dilm_84_sync_tried_at.down,
    name: '20261019_233054_dilm_84_sync_tried_at',
  },
  {
    up: migration_20261020_022848_dilm_65_user_sign_in_and_inviter.up,
    down: migration_20261020_022848_dilm_65_user_sign_in_and_inviter.down,
    name: '20261020_022848_dilm_65_user_sign_in_and_inviter',
  },
  {
    up: migration_20261020_055944_dilm_41_ir_versions_drafts_trash.up,
    down: migration_20261020_055944_dilm_41_ir_versions_drafts_trash.down,
    name: '20261020_055944_dilm_41_ir_versions_drafts_trash',
  },
  {
    up: migration_20261020_073000_dilm_41_backfill_ir_versions.up,
    down: migration_20261020_073000_dilm_41_backfill_ir_versions.down,
    name: '20261020_073000_dilm_41_backfill_ir_versions',
  },
  {
    up: migration_20261020_090000_dilm_74_trashed_by.up,
    down: migration_20261020_090000_dilm_74_trashed_by.down,
    name: '20261020_090000_dilm_74_trashed_by',
  },
  {
    up: migration_20261020_112607_dilm_92_ir_uploaded_by.up,
    down: migration_20261020_112607_dilm_92_ir_uploaded_by.down,
    name: '20261020_112607_dilm_92_ir_uploaded_by',
  },
  {
    up: migration_20261020_134510_dilm_93_ir_purge_status.up,
    down: migration_20261020_134510_dilm_93_ir_purge_status.down,
    name: '20261020_134510_dilm_93_ir_purge_status'
  },
];
