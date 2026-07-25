import type { ImageSourcePropType } from 'react-native';

/** Maps an AzuraCast playlist short_name to a bundled on-air personality
 * photo/name, used as a richer fallback than the raw currently-playing
 * track art when that daypart is live. Mirrors the mapping AzuraCast is
 * configured with (see src/data/daypartCategories.ts on the web side). */
export const PRESENTER_BY_PLAYLIST: Record<string, { name: string; photo: ImageSourcePropType }> = {
  morning_praise: {
    name: 'Caleb Adeleye',
    photo: require('../assets/presenters/caleb-adeleye.png'),
  },
};

export function getPresenterForPlaylist(
  shortName: string | undefined,
): { name: string; photo: ImageSourcePropType } | null {
  if (!shortName) return null;
  return PRESENTER_BY_PLAYLIST[shortName] ?? null;
}
