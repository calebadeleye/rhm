import { useMemo } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Bell, Clock, Sun } from 'lucide-react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { StatusPill } from '../components/StatusPill';
import { PlayButton } from '../components/PlayButton';
import { EpisodeCard } from '../components/EpisodeCard';
import { useNowPlaying } from '../hooks/useNowPlaying';
import { useStationSchedule } from '../hooks/useStationSchedule';
import { useEpisodes } from '../hooks/useEpisodes';
import { usePlayer } from '../hooks/usePlayer';
import { useOpenPlayer } from '../hooks/useOpenPlayer';
import { getCurrentAndNext, formatMinutes12 } from '../lib/liveSchedule';
import { getPresenterForPlaylist } from '../data/presenterPhotos';
import { env } from '../config/env';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import type { RootTabParamList } from '../navigation/types';

export function HomeScreen() {
  const nowPlayingQuery = useNowPlaying();
  const scheduleQuery = useStationSchedule();
  const episodesQuery = useEpisodes();
  const player = usePlayer();
  const openPlayer = useOpenPlayer();
  const tabNavigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();

  const { current, next } = useMemo(() => {
    if (!scheduleQuery.data) return { current: null, next: null };
    return getCurrentAndNext(scheduleQuery.data, new Date(), env.stationTimezone);
  }, [scheduleQuery.data]);

  const nowPlaying = nowPlayingQuery.data;
  const recentEpisodes = episodesQuery.data?.slice(0, 2) ?? [];
  const currentPresenter = getPresenterForPlaylist(current?.daypart.shortName);

  const handlePlay = async () => {
    if (!nowPlaying) return;
    await player.playLive(nowPlaying);
    openPlayer();
  };

  return (
    <ScreenContainer>
      <View style={styles.headerRow}>
        <Text style={styles.logo}>RHM</Text>
        <Bell color={colors.ink.soft} size={22} />
      </View>

      <View style={styles.greetingRow}>
        <View>
          <Text style={typography.h1}>Welcome back</Text>
          <Text style={typography.body}>Thank you for tuning in!</Text>
        </View>
        <Sun color={colors.brand[500]} size={26} />
      </View>

      <Pressable onPress={handlePlay} style={styles.liveCard}>
        {currentPresenter ? (
          <Image source={currentPresenter.photo} style={StyleSheet.absoluteFill} />
        ) : nowPlaying?.song.artUrl ? (
          <Image source={{ uri: nowPlaying.song.artUrl }} style={StyleSheet.absoluteFill} />
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.liveCardFallbackBg]} />
        )}
        <View style={styles.liveCardOverlay} />

        <View style={styles.liveCardContent}>
          {nowPlaying?.isLive && <StatusPill status="live" />}
          <Text style={styles.liveCardTitle} numberOfLines={2}>
            {current?.daypart.name ?? nowPlaying?.song.title ?? 'Redemption Radio'}
          </Text>
          <Text style={styles.liveCardSubtitle} numberOfLines={1}>
            {currentPresenter
              ? `with ${currentPresenter.name}`
              : nowPlaying?.streamerName
                ? `with ${nowPlaying.streamerName}`
                : nowPlaying?.song.artist}
          </Text>
          {current?.daypart.description ? (
            <Text style={styles.liveCardDescription} numberOfLines={2}>
              {current.daypart.description}
            </Text>
          ) : null}
        </View>

        <View style={styles.liveCardPlayButton}>
          {nowPlayingQuery.isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <PlayButton isPlaying={player.isPlaying && player.isLive} onPress={handlePlay} size={56} />
          )}
        </View>
      </Pressable>

      {next && (
        <View style={styles.upNextCard}>
          <Clock color={colors.brand[600]} size={18} />
          <View style={styles.upNextText}>
            <Text style={typography.caption}>UP NEXT • {formatMinutes12(next.startMinutes)}</Text>
            <Text style={typography.bodyBold}>{next.daypart.name}</Text>
            <Text style={typography.caption} numberOfLines={1}>
              {next.daypart.description}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.sectionHeaderRow}>
        <Text style={typography.h2}>Recent Programmes</Text>
        <Pressable onPress={() => tabNavigation.navigate('ListenTab')}>
          <Text style={styles.seeAll}>See all</Text>
        </Pressable>
      </View>

      {episodesQuery.isLoading ? (
        <ActivityIndicator color={colors.brand[600]} />
      ) : recentEpisodes.length === 0 ? (
        <Text style={typography.body}>No programmes available yet — check back soon.</Text>
      ) : (
        <View style={styles.recentGrid}>
          {recentEpisodes.map((episode) => (
            <EpisodeCard
              key={episode.id}
              episode={episode}
              onPress={async () => {
                await player.playEpisode(episode);
                openPlayer();
              }}
            />
          ))}
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  logo: { fontSize: 22, fontWeight: '900', color: colors.brand[700] },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  liveCard: {
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: colors.brand[800],
  },
  liveCardFallbackBg: { backgroundColor: colors.brand[700] },
  liveCardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(12, 37, 16, 0.55)',
  },
  liveCardContent: { flex: 1, padding: 18, justifyContent: 'flex-end', gap: 6 },
  liveCardTitle: { fontSize: 24, fontWeight: '800', color: '#ffffff' },
  liveCardSubtitle: { fontSize: 14, fontWeight: '600', color: '#e5f5e7' },
  liveCardDescription: { fontSize: 12, color: '#dcefe0' },
  liveCardPlayButton: { position: 'absolute', bottom: 16, right: 16 },
  upNextCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 24,
  },
  upNextText: { flex: 1, gap: 2 },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  seeAll: { color: colors.brand[600], fontWeight: '700', fontSize: 13 },
  recentGrid: { flexDirection: 'row', gap: 14 },
});
