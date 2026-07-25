import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

const META: Record<'live' | 'upcoming' | 'ended', { label: string; bg: string; fg: string }> = {
  live: { label: 'LIVE', bg: colors.brand[600], fg: '#ffffff' },
  upcoming: { label: 'UPCOMING', bg: colors.surface.muted, fg: colors.ink.soft },
  ended: { label: 'ENDED', bg: colors.surface.muted, fg: colors.ink.faint },
};

export function StatusPill({ status }: { status: 'live' | 'upcoming' | 'ended' }) {
  const meta = META[status];
  return (
    <View style={[styles.pill, { backgroundColor: meta.bg }]}>
      {status === 'live' && <View style={styles.dot} />}
      <Text style={[styles.label, { color: meta.fg }]}>{meta.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ffffff',
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
