import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const typography = StyleSheet.create({
  h1: { fontSize: 26, fontWeight: '800', color: colors.ink.default },
  h2: { fontSize: 20, fontWeight: '700', color: colors.ink.default },
  h3: { fontSize: 16, fontWeight: '700', color: colors.ink.default },
  body: { fontSize: 14, fontWeight: '400', color: colors.ink.soft },
  bodyBold: { fontSize: 14, fontWeight: '600', color: colors.ink.default },
  caption: { fontSize: 12, fontWeight: '500', color: colors.ink.faint },
});
