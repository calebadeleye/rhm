import { NativeModules, Platform } from 'react-native';

interface NavigationBarModuleInterface {
  setAppearance(colorHex: string, lightIcons: boolean): Promise<void>;
}

const NavigationBarModule = NativeModules.NavigationBarModule as NavigationBarModuleInterface | undefined;

/** Sets the Android system navigation bar's background color and icon
 * contrast. No-op on iOS (no equivalent system bar) and if the native
 * module isn't present. */
export function setNavigationBarAppearance(colorHex: string, lightIcons: boolean): void {
  if (Platform.OS !== 'android' || !NavigationBarModule) return;
  NavigationBarModule.setAppearance(colorHex, lightIcons).catch(() => {});
}
