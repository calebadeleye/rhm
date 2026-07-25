import type { NavigatorScreenParams } from '@react-navigation/native';

export type RootTabParamList = {
  HomeTab: undefined;
  ScheduleTab: undefined;
  ListenTab: undefined;
  PrayerTab: undefined;
  ProfileTab: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<RootTabParamList>;
  Player: undefined;
};
