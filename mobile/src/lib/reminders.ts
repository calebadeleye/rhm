import notifee, { AndroidImportance, TimestampTrigger, TriggerType } from '@notifee/react-native';
import { getNotificationsEnabled } from './preferences';

/** Schedules a local notification 5 minutes before a show starts. Replaces
 * the web app's .ics-download reminder flow with a native notification,
 * since RN has direct access to the OS notification scheduler. Respects the
 * Profile screen's notification preference toggle. */
export async function scheduleShowReminder(showId: number, title: string, start: Date): Promise<void> {
  if (!(await getNotificationsEnabled())) return;
  await notifee.requestPermission();

  const channelId = await notifee.createChannel({
    id: 'show-reminders',
    name: 'Show reminders',
    importance: AndroidImportance.HIGH,
  });

  const triggerTimestamp = start.getTime() - 5 * 60_000;
  if (triggerTimestamp <= Date.now()) return;

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: triggerTimestamp,
  };

  await notifee.createTriggerNotification(
    {
      id: `show-${showId}-${start.getTime()}`,
      title: 'Starting in 5 minutes',
      body: title,
      android: { channelId, pressAction: { id: 'default' } },
    },
    trigger,
  );
}

export async function cancelShowReminder(showId: number, startMs: number): Promise<void> {
  await notifee.cancelTriggerNotification(`show-${showId}-${startMs}`);
}
