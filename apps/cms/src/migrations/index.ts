import * as migration_20260926_154435_initial from './20260926_154435_initial';
import * as migration_20260926_192557_media_s3_storage from './20260926_192557_media_s3_storage';
import * as migration_20260927_041300_dilm_17_schema_collections from './20260927_041300_dilm_17_schema_collections';
import * as migration_20261008_042350_dilm_45_brand_identity from './20261008_042350_dilm_45_brand_identity';
import * as migration_20261008_065645_dilm_46_header_global from './20261008_065645_dilm_46_header_global';
import * as migration_20261008_070940_dilm_47_footer_global from './20261008_070940_dilm_47_footer_global';
import * as migration_20261014_140948_dilm_58_authoring_metadata from './20261014_140948_dilm_58_authoring_metadata';
import * as migration_20261014_232338_dilm_54_tenant_brand_color from './20261014_232338_dilm_54_tenant_brand_color';

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
    name: '20261014_232338_dilm_54_tenant_brand_color'
  },
];
