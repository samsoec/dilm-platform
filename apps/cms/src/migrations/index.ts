import * as migration_20260926_154435_initial from './20260926_154435_initial';

export const migrations = [
  {
    up: migration_20260926_154435_initial.up,
    down: migration_20260926_154435_initial.down,
    name: '20260926_154435_initial'
  },
];
