import { useMemo, useState } from 'react';
import { Image, Pressable, Share, StyleSheet, Text, View } from 'react-native';
import TrackPlayer, { useProgress } from 'react-native-track-player';
import { ChevronDown, Heart, MoreHorizontal, RotateCcw, RotateCw, Share2, Volume2 } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusPill } from '../components/StatusPill';
import { PlayButton } from '../components/PlayButton';
import { useNowPlaying } from '../hooks/useNowPlaying';
import { usePlayer } from '../hooks/usePlayer';
import { useStationSchedule } from '../hooks/useStationSchedule';
import { formatSeconds } from '../lib/format';
import { getCurrentAndNext } from '../lib/liveSchedule';
import { getPresenterForPlaylist } from '../data/presenterPhotos';
import { env } from '../config/env';
import { colors } from '../theme/colors';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Player'>;

const WAVEFORM_HEIGHTS = [10, 22, 14, 30, 18, 26, 12, 20, 28, 16, 24, 10, 18, 22, 14, 30, 20, 12, 26, 16];

export function PlayerScreen({ navigation }: Props) {
  const player = usePlayer();
  const nowPlayingQuery = useNowPlaying();
  const scheduleQuery = useStationSchedule();
  const progress = useProgress(500);
  const [isFavourite, setIsFavourite] = useState(false);

  const meta = player.currentMeta;
  const isEpisode = meta?.type === 'episode';
  const nowPlaying = nowPlayingQuery.data;

  const currentDaypart = useMemo(() => {
    if (isEpisode || !scheduleQuery.data) return null;
    return getCurrentAndNext(scheduleQuery.data, new Date(), env.stationTimezone).current;
  }, [isEpisode, scheduleQuery.data]);
  const currentPresenter = getPresenterForPlaylist(currentDaypart?.daypart.shortName);

  const artUrl = meta?.artUrl ?? nowPlaying?.song.artUrl ?? null;
  const title = meta?.title ?? nowPlaying?.song.title ?? 'Redemption Radio';
  const subtitle = currentPresenter
    ? `with ${currentPresenter.name}`
    : (meta?.subtitle ?? nowPlaying?.song.artist ?? '');

  const handleShare = () => {
    Share.share({
      message: `Listening to ${title} on Redemption Hour Radio — https://rhm.com.ng`,
    }).catch(() => {});
  };

  const handleSkip = (seconds: number) => {
    if (!isEpisode) return;
    TrackPlayer.seekBy(seconds).catch(() => {});
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
          <ChevronDown color={colors.ink.default} size={26} />
        </Pressable>
        {nowPlaying?.isLive && <StatusPill status="live" />}
        <Pressable onPress={handleShare} hitSlop={12}>
          <Share2 color={colors.ink.default} size={22} />
        </Pressable>
      </View>

      <View style={styles.artWrap}>
        {currentPresenter ? (
          <Image source={currentPresenter.photo} style={styles.art} />
        ) : artUrl ? (
          <Image source={{ uri: artUrl }} style={styles.art} />
        ) : (
          <View style={[styles.art, styles.artPlaceholder]}>
            <Text style={styles.artPlaceholderText}>RHM</Text>
          </View>
        )}
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
      <Text style={styles.subtitle} numberOfLines={1}>
        {subtitle || 'Redemption Hour Radio'}
      </Text>

      <View style={styles.waveform}>
        {WAVEFORM_HEIGHTS.map((height, index) => (
          <View
            key={index}
            style={[
              styles.waveformBar,
              { height, backgroundColor: index < WAVEFORM_HEIGHTS.length * 0.4 ? colors.brand[600] : colors.surface.muted },
            ]}
          />
        ))}
      </View>

      <View style={styles.timeRow}>
        {isEpisode ? (
          <>
            <Text style={styles.timeLabel}>{formatSeconds(progress.position)}</Text>
            <Text style={styles.timeLabel}>
              -{formatSeconds(Math.max(0, progress.duration - progress.position))}
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.timeLabel}>{formatSeconds(nowPlaying?.elapsedSeconds ?? 0)}</Text>
            <Text style={styles.timeLabel}>-{formatSeconds(nowPlaying?.remainingSeconds ?? 0)}</Text>
          </>
        )}
      </View>

      <View style={styles.controlsRow}>
        <Pressable onPress={() => handleSkip(-15)} disabled={!isEpisode} style={!isEpisode && styles.disabled}>
          <RotateCcw color={colors.ink.default} size={26} />
        </Pressable>
        <PlayButton
          isPlaying={player.isPlaying}
          isBuffering={player.isBuffering}
          onPress={player.togglePlayPause}
          size={72}
        />
        <Pressable onPress={() => handleSkip(30)} disabled={!isEpisode} style={!isEpisode && styles.disabled}>
          <RotateCw color={colors.ink.default} size={26} />
        </Pressable>
      </View>

      <View style={styles.volumeRow}>
        <Volume2 color={colors.ink.faint} size={18} />
        <View style={styles.volumeTrack}>
          <View style={styles.volumeFill} />
        </View>
      </View>

      <View style={styles.bottomRow}>
        <Pressable onPress={handleShare} style={styles.bottomButton}>
          <Share2 color={colors.ink.soft} size={18} />
        </Pressable>
        <Pressable onPress={() => setIsFavourite((v) => !v)} style={styles.bottomButton}>
          <Heart
            color={isFavourite ? colors.brand[600] : colors.ink.soft}
            fill={isFavourite ? colors.brand[600] : 'none'}
            size={18}
          />
        </Pressable>
        <Pressable style={styles.bottomButton}>
          <MoreHorizontal color={colors.ink.soft} size={18} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface.default, padding: 20 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  artWrap: { marginTop: 24, alignItems: 'center' },
  art: { width: '100%', aspectRatio: 1, borderRadius: 24, backgroundColor: colors.surface.muted },
  artPlaceholder: { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.brand[700] },
  artPlaceholderText: { color: '#ffffff', fontSize: 32, fontWeight: '900' },
  title: { marginTop: 24, fontSize: 22, fontWeight: '800', color: colors.ink.default, textAlign: 'center' },
  subtitle: { marginTop: 4, fontSize: 14, color: colors.ink.soft, textAlign: 'center' },
  waveform: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 3,
    height: 32,
    marginTop: 24,
  },
  waveformBar: { width: 3, borderRadius: 2 },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  timeLabel: { fontSize: 12, color: colors.ink.faint },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
    marginTop: 24,
  },
  disabled: { opacity: 0.3 },
  volumeRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 28 },
  volumeTrack: { flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.surface.muted },
  volumeFill: { width: '60%', height: 4, borderRadius: 2, backgroundColor: colors.brand[600] },
  bottomRow: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 28 },
  bottomButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
