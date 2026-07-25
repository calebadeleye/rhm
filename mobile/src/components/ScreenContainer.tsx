import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type ScrollViewProps } from 'react-native';
import { colors } from '../theme/colors';

interface ScreenContainerProps extends ScrollViewProps {
  children: ReactNode;
  scroll?: boolean;
}

export function ScreenContainer({ children, scroll = true, style, ...rest }: ScreenContainerProps) {
  if (!scroll) {
    return <View style={[styles.container, style as object]}>{children}</View>;
  }
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      {...rest}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.warm,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
});
