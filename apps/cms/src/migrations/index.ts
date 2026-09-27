import * as migration_20260926_154435_initial from './20260926_154435_initial';
import * as migration_20260926_192557_media_s3_storage from './20260926_192557_media_s3_storage';

export const migrations = [
  {
    up: migration_20260926_154435_initial.up,
    down: migration_20260926_154435_initial.down,
    name: '20260926_154435_initial',
  },
  {
    up: migration_20260926_192557_media_s3_storage.up,
    down: migration_20260926_192557_media_s3_storage.down,
    name: '20260926_192557_media_s3_storage'
  },
];
