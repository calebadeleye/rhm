import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Play } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { formatDurationMinutes, formatRelativeDateTime } from '../lib/format';
import type { Episode } from '../types/episodes';

interface EpisodeCardProps {
  episode: Episode;
  onPress: () => void;
  width?: number;
}

export function EpisodeCard({ episode, onPress, width }: EpisodeCardProps) {
  return (
    <Pressable onPress={onPress} style={[styles.card, width ? { width } : styles.flexCard]}>
      <View style={styles.artWrap}>
        {episode.artUrl ? (
          <Image source={{ uri: episode.artUrl }} style={styles.art} />
        ) : (
          <View style={[styles.art, styles.artPlaceholder]} />
        )}
        <View style={styles.playBadge}>
          <Play color="#ffffff" size={14} fill="#ffffff" />
        </View>
      </View>
      <Text style={typography.bodyBold} numberOfLines={1}>
        {episode.title}
      </Text>
      <Text style={typography.caption} numberOfLines={1}>
        {[formatRelativeDateTime(episode.publishedAt), formatDurationMinutes(episode.durationSeconds)]
          .filter(Boolean)
          .join(' • ')}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { gap: 6 },
  flexCard: { flex: 1 },
  artWrap: { position: 'relative' },
  art: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: colors.surface.muted,
  },
  artPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(28, 68, 35, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
