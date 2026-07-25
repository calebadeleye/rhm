import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Search } from 'lucide-react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { EpisodeCard } from '../components/EpisodeCard';
import { useEpisodes } from '../hooks/useEpisodes';
import { usePlayer } from '../hooks/usePlayer';
import { useOpenPlayer } from '../hooks/useOpenPlayer';
import { CATEGORY_FILTERS } from '../data/daypartCategories';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import type { DaypartCategory } from '../types/schedule';

export function ListenAgainScreen() {
  const episodesQuery = useEpisodes();
  const player = usePlayer();
  const openPlayer = useOpenPlayer();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<DaypartCategory | 'all'>('all');

  const filtered = useMemo(() => {
    const episodes = episodesQuery.data ?? [];
    const query = search.trim().toLowerCase();
    return episodes.filter((episode) => {
      const matchesCategory = category === 'all' || episode.category === category;
      const matchesSearch = query.length === 0 || episode.title.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [episodesQuery.data, search, category]);

  return (
    <ScreenContainer scroll={false} style={styles.container}>
      <Text style={typography.h1}>Listen Again</Text>

      <View style={styles.searchBar}>
        <Search color={colors.ink.faint} size={18} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search programmes…"
          placeholderTextColor={colors.ink.faint}
          style={styles.searchInput}
        />
      </View>

      <FlatList
        horizontal
        data={CATEGORY_FILTERS}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
        renderItem={({ item }) => {
          const isSelected = item.id === category;
          return (
            <Pressable
              onPress={() => setCategory(item.id)}
              style={[styles.chip, isSelected && styles.chipSelected]}
            >
              <Text style={[styles.chipLabel, isSelected && styles.chipLabelSelected]}>{item.label}</Text>
            </Pressable>
          );
        }}
      />

      {episodesQuery.isLoading ? (
        <ActivityIndicator color={colors.brand[600]} style={styles.loading} />
      ) : filtered.length === 0 ? (
        <View style={styles.empty}>
          <Text style={typography.body}>
            {episodesQuery.data?.length === 0
              ? "No episodes are available for on-demand listening yet — check back soon."
              : 'No programmes match your search.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <EpisodeCard
              episode={item}
              width={undefined}
              onPress={async () => {
                await player.playEpisode(item);
                openPlayer();
              }}
            />
          )}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 16,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.ink.default },
  chipRow: { gap: 8, marginTop: 14, marginBottom: 16 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.surface.muted,
  },
  chipSelected: { backgroundColor: colors.brand[600] },
  chipLabel: { fontSize: 12, fontWeight: '700', color: colors.ink.soft },
  chipLabelSelected: { color: '#ffffff' },
  loading: { marginTop: 40 },
  empty: { alignItems: 'center', marginTop: 60, paddingHorizontal: 20 },
  gridRow: { gap: 14 },
  gridContent: { gap: 14, paddingBottom: 40 },
});
