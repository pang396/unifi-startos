import { i18n } from './i18n'
import { sdk } from './sdk'
import { uiPort } from './utils'
import { deviceCommandPort } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting UniFi Network Application!'))

  return sdk.Daemons.of(effects).addDaemon('primary', {
    subcontainer: sdk.SubContainer.of(
      effects,
      { imageId: 'unifi' },
      sdk.Mounts.of().mountVolume({
        volumeId: 'main',
        subpath: null,
        mountpoint: '/unifi',
        readonly: false,
      }),
      'unifi-sub',
    ),
    exec: {
      command: ['sh', '-c', 'mkdir -p /unifi/run && exec /usr/local/bin/docker-entrypoint.sh unifi'],
    },
    ready: {
      display: i18n('Web Interface'),
      gracePeriod: 180_000,
      fn: () =>
        sdk.healthCheck.checkPortListening(effects, uiPort, {
          successMessage: i18n('The web interface is ready'),
          errorMessage: i18n('The web interface is not ready'),
        }),
    },
    requires: [],
  })
})
