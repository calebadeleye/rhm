import { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export function StatusPill({ status }: { status: 'live' | 'upcoming' | 'ended' }) {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (status !== 'live') return undefined;
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.3, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [status, opacity]);

  const META: Record<'live' | 'upcoming' | 'ended', { label: string; bg: string; fg: string }> = useMemo(
    () => ({
      live: { label: 'LIVE', bg: colors.brand[600], fg: '#ffffff' },
      upcoming: { label: 'UPCOMING', bg: colors.surface.muted, fg: colors.ink.soft },
      ended: { label: 'ENDED', bg: colors.surface.muted, fg: colors.ink.faint },
    }),
    [colors],
  );
  const meta = META[status];
  return (
    <View style={[styles.pill, { backgroundColor: meta.bg }]}>
      {status === 'live' && <Animated.View style={[styles.dot, { opacity }]} />}
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
