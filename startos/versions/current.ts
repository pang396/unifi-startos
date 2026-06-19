import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'
export const current = VersionInfo.of({
  version: '10.0.162:1',
  releaseNotes: {
    en_US: 'Initial release. Wraps jacobalberty/unifi:v10.0.162.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
