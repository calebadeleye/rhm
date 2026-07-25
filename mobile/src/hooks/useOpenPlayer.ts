import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

/** Every tab screen sits one level below the root stack that owns the
 * full-screen Player modal, so opening it always means reaching up via
 * getParent() rather than navigating within the tab's own stack. */
export function useOpenPlayer() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return () => navigation.getParent<NativeStackNavigationProp<RootStackParamList>>()?.navigate('Player');
}
