import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Bell, CalendarDays } from 'lucide-react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { StatusPill } from '../components/StatusPill';
import { CategoryBadge } from '../components/CategoryBadge';
import { useStationSchedule } from '../hooks/useStationSchedule';
import {
  formatMinutes12,
  getOccurrencesForDate,
  getWeekStationDates,
  withStatus,
} from '../lib/liveSchedule';
import { getStationDateInfo } from '../lib/timezone';
import { scheduleShowReminder } from '../lib/reminders';
import { env } from '../config/env';
import { useTheme } from '../theme/ThemeContext';
import { useTypography } from '../theme/typography';
import type { DaypartOccurrence } from '../types/schedule';

const DAY_TABS = [
  { weekdayIndex: 1, label: 'MON' },
  { weekdayIndex: 2, label: 'TUE' },
  { weekdayIndex: 3, label: 'WED' },
  { weekdayIndex: 4, label: 'THU' },
  { weekdayIndex: 5, label: 'FRI' },
  { weekdayIndex: 6, label: 'SAT' },
  { weekdayIndex: 0, label: 'SUN' },
];

export function ScheduleScreen() {
  const scheduleQuery = useStationSchedule();
  const todayInfo = useMemo(() => getStationDateInfo(new Date(), env.stationTimezone), []);
  const [selectedWeekday, setSelectedWeekday] = useState(todayInfo.weekdayIndex);
  const { colors } = useTheme();
  const typography = useTypography();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        dayTabs: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 20,
          marginBottom: 20,
        },
        dayTab: {
          paddingVertical: 8,
          paddingHorizontal: 10,
          borderRadius: 10,
        },
        dayTabSelected: { backgroundColor: colors.brand[600] },
        dayTabLabel: { fontSize: 11, fontWeight: '700', color: colors.ink.faint },
        dayTabLabelSelected: { color: '#ffffff' },
        loading: { marginTop: 40 },
        empty: { alignItems: 'center', gap: 8, marginTop: 60 },
        list: { gap: 10 },
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          backgroundColor: colors.surface.default,
          borderRadius: 14,
          padding: 14,
        },
        rowLive: { backgroundColor: colors.liveHighlight.bg, borderWidth: 1, borderColor: colors.liveHighlight.border },
        time: { width: 68, fontSize: 12, fontWeight: '700', color: colors.ink.soft },
        rowBody: { flex: 1, gap: 4 },
        rowTitleLine: { flexDirection: 'row', alignItems: 'center', gap: 8 },
      }),
    [colors],
  );

  const occurrences = useMemo<DaypartOccurrence[]>(() => {
    if (!scheduleQuery.data) return [];
    const week = getWeekStationDates(todayInfo);
    const dateInfo = week.find((d) => d.weekdayIndex === selectedWeekday) ?? todayInfo;
    return withStatus(getOccurrencesForDate(scheduleQuery.data, dateInfo, env.stationTimezone), new Date());
  }, [scheduleQuery.data, selectedWeekday, todayInfo]);

  return (
    <ScreenContainer>
      <Text style={typography.h1}>Programme Schedule</Text>

      <View style={styles.dayTabs}>
        {DAY_TABS.map((day) => {
          const isSelected = day.weekdayIndex === selectedWeekday;
          return (
            <Pressable
              key={day.weekdayIndex}
              onPress={() => setSelectedWeekday(day.weekdayIndex)}
              style={[styles.dayTab, isSelected && styles.dayTabSelected]}
            >
              <Text style={[styles.dayTabLabel, isSelected && styles.dayTabLabelSelected]}>{day.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {scheduleQuery.isLoading ? (
        <ActivityIndicator color={colors.brand[600]} style={styles.loading} />
      ) : occurrences.length === 0 ? (
        <View style={styles.empty}>
          <CalendarDays color={colors.ink.faint} size={28} />
          <Text style={typography.body}>No programmes scheduled for this day.</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {occurrences.map((occ) => (
            <View
              key={`${occ.daypart.id}-${occ.startMinutes}`}
              style={[styles.row, occ.status === 'live' && styles.rowLive]}
            >
              <Text style={styles.time}>{formatMinutes12(occ.startMinutes)}</Text>
              <View style={styles.rowBody}>
                <View style={styles.rowTitleLine}>
                  <Text style={typography.bodyBold}>{occ.daypart.name}</Text>
                  {occ.status === 'live' && <StatusPill status="live" />}
                </View>
                <Text style={typography.caption} numberOfLines={1}>
                  {occ.daypart.description}
                </Text>
                <CategoryBadge category={occ.daypart.category} />
              </View>
              <Pressable
                hitSlop={10}
                onPress={() => scheduleShowReminder(occ.daypart.id, occ.daypart.name, occ.start)}
              >
                <Bell color={colors.brand[600]} size={18} />
              </Pressable>
            </View>
          ))}
        </View>
      )}
    </ScreenContainer>
  );
}
