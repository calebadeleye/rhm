import { StyleSheet, Text, View } from 'react-native';
import { CATEGORY_META } from '../data/daypartCategories';
import type { DaypartCategory } from '../types/schedule';

export function CategoryBadge({ category }: { category: DaypartCategory }) {
  const meta = CATEGORY_META[category];
  return (
    <View style={styles.row}>
      <View style={[styles.dot, { backgroundColor: meta.color }]} />
      <Text style={styles.label}>{meta.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  label: { fontSize: 12, fontWeight: '600', color: '#4a524d' },
});
