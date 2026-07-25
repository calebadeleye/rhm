import { useEffect, useState } from 'react';
import { getNotificationsEnabled, setNotificationsEnabled } from '../lib/preferences';

export function useNotificationsEnabled() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    getNotificationsEnabled().then(setEnabled);
  }, []);

  const update = async (value: boolean) => {
    setEnabled(value);
    await setNotificationsEnabled(value);
  };

  return { enabled, setEnabled: update };
}
