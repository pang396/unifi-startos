import { i18n } from './i18n'
import { sdk } from './sdk'
import {
  uiPort,
  deviceCommandPort,
  stunPort,
  discoveryPort,
} from './utils'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  // Web UI (HTTPS)
  const uiMulti = sdk.MultiHost.of(effects, 'ui-multi')
  const uiMultiOrigin = await uiMulti.bindPort(uiPort, {
    protocol: 'https',
  })
  const ui = sdk.createInterface(effects, {
    name: i18n('Web UI'),
    id: 'ui',
    description: i18n('The UniFi Network Application web interface'),
    type: 'ui',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })
  const uiReceipt = await uiMultiOrigin.export([ui])

  // Device command/control (TCP 8080)
  const deviceMulti = sdk.MultiHost.of(effects, 'device-multi')
  const deviceMultiOrigin = await deviceMulti.bindPort(deviceCommandPort, {
    protocol: null,
    preferredExternalPort: deviceCommandPort,
    addSsl: null,
    secure: null,
  })
  const device = sdk.createInterface(effects, {
    name: i18n('Device Inform'),
    id: 'device-inform',
    description: i18n('UniFi device adoption and command/control'),
    type: 'p2p',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })
  const deviceReceipt = await deviceMultiOrigin.export([device])

  // STUN (UDP 3478)
  const stunMulti = sdk.MultiHost.of(effects, 'stun-multi')
  const stunMultiOrigin = await stunMulti.bindPort(stunPort, {
    protocol: null,
    preferredExternalPort: stunPort,
    addSsl: null,
    secure: null,
  })
  const stun = sdk.createInterface(effects, {
    name: i18n('STUN'),
    id: 'stun',
    description: i18n('STUN service for UniFi devices'),
    type: 'p2p',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })
  const stunReceipt = await stunMultiOrigin.export([stun])

  // Device discovery (UDP 10001)
  const discoveryMulti = sdk.MultiHost.of(effects, 'discovery-multi')
  const discoveryMultiOrigin = await discoveryMulti.bindPort(discoveryPort, {
    protocol: null,
    preferredExternalPort: discoveryPort,
    addSsl: null,
    secure: null,
  })
  const discovery = sdk.createInterface(effects, {
    name: i18n('Device Discovery'),
    id: 'discovery',
    description: i18n('L2 discovery for UniFi devices'),
    type: 'p2p',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })
  const discoveryReceipt = await discoveryMultiOrigin.export([discovery])

  return [uiReceipt, deviceReceipt, stunReceipt, discoveryReceipt]
})
