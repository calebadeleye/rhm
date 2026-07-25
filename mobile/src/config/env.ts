/**
 * Dev builds can't reach `localhost` on a physical device or (for Android)
 * even the emulator without the special 10.0.2.2 alias, so point this at
 * your machine's LAN IP (e.g. "192.168.1.42") when testing on a device.
 * iOS Simulator can use "localhost" directly.
 */
const DEV_API_HOST = 'localhost';
const DEV_API_PORT = 4000;

const PROD_API_BASE_URL = 'https://rhm.com.ng/api';

export const env = {
  apiBaseUrl: __DEV__ ? `http://${DEV_API_HOST}:${DEV_API_PORT}/api` : PROD_API_BASE_URL,
  stationTimezone: 'UTC',
} as const;
