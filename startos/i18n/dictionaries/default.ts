export const DEFAULT_LANG = 'en_US'
const dict = {
  // main.ts
  'Starting UniFi Network Application!': 0,
  'Web Interface': 1,
  'The web interface is ready': 2,
  'The web interface is not ready': 3,
  // interfaces.ts
  'Web UI': 4,
  'The UniFi Network Application web interface': 5,
  'Device Inform': 6,
  'UniFi device adoption and command/control': 7,
  'STUN': 8,
  'STUN service for UniFi devices': 9,
  'Device Discovery': 10,
  'L2 discovery for UniFi devices': 11,
} as const
/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
