import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { Pause, Play } from 'lucide-react-native';
import { colors } from '../theme/colors';

interface PlayButtonProps {
  isPlaying: boolean;
  isBuffering?: boolean;
  onPress: () => void;
  size?: number;
}

export function PlayButton({ isPlaying, isBuffering, onPress, size = 64 }: PlayButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, { width: size, height: size, borderRadius: size / 2 }]}
      accessibilityRole="button"
      accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
    >
      {isBuffering ? (
        <ActivityIndicator color="#ffffff" />
      ) : isPlaying ? (
        <Pause color="#ffffff" size={size * 0.4} fill="#ffffff" />
      ) : (
        <Play color="#ffffff" size={size * 0.4} fill="#ffffff" style={styles.playIcon} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.brand[600],
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.brand[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  playIcon: {
    marginLeft: 3,
  },
});
