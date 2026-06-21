import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'unifi-network-application',
  title: 'UniFi Network Application',
  license: 'MIT',
  packageRepo: 'https://github.com/pang396/unifi-startos',
  upstreamRepo: 'https://github.com/jacobalberty/unifi-docker',
  marketingUrl: 'https://www.ui.com/',
  donationUrl: null,
  description: { short, long },
  volumes: ['main'],
  images: {
    unifi: {
      source: { dockerTag: 'jacobalberty/unifi:v10.0.162' },
      arch: ['x86_64', 'aarch64'],
    },
  },
  alerts: {
    install: null,
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  dependencies: {},
})
