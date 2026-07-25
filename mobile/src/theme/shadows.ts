import { Platform } from 'react-native';

/** Mirrors the web app's `card` box-shadow token as a cross-platform RN
 * elevation/shadow style. */
export const cardShadow = Platform.select({
  ios: {
    shadowColor: '#1c4423',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  android: {
    elevation: 3,
  },
  default: {},
});
