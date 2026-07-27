import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, CalendarDays, Headphones, HeartHandshake, User } from 'lucide-react-native';
import { HomeScreen } from '../screens/HomeScreen';
import { ScheduleScreen } from '../screens/ScheduleScreen';
import { ListenAgainScreen } from '../screens/ListenAgainScreen';
import { PrayerRequestScreen } from '../screens/PrayerRequestScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { PlayerScreen } from '../screens/PlayerScreen';
import { useTheme } from '../theme/ThemeContext';
import type { RootStackParamList, RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

type IconProps = { color: string; size: number };
function HomeIcon({ color, size }: IconProps) {
  return <Home color={color} size={size} />;
}
function ScheduleIcon({ color, size }: IconProps) {
  return <CalendarDays color={color} size={size} />;
}
function ListenIcon({ color, size }: IconProps) {
  return <Headphones color={color} size={size} />;
}
function PrayerIcon({ color, size }: IconProps) {
  return <HeartHandshake color={color} size={size} />;
}
function ProfileIcon({ color, size }: IconProps) {
  return <User color={color} size={size} />;
}

function MainTabs() {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brand[600],
        tabBarInactiveTintColor: colors.ink.faint,
        tabBarStyle: { borderTopColor: colors.surface.muted, backgroundColor: colors.surface.default },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ title: 'Home', tabBarIcon: HomeIcon }}
      />
      <Tab.Screen
        name="ScheduleTab"
        component={ScheduleScreen}
        options={{ title: 'Schedule', tabBarIcon: ScheduleIcon }}
      />
      <Tab.Screen
        name="ListenTab"
        component={ListenAgainScreen}
        options={{ title: 'Listen', tabBarIcon: ListenIcon }}
      />
      <Tab.Screen
        name="PrayerTab"
        component={PrayerRequestScreen}
        options={{ title: 'Prayer', tabBarIcon: PrayerIcon }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ title: 'About', tabBarIcon: ProfileIcon }}
      />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const { mode, colors } = useTheme();
  const navigationTheme = {
    ...(mode === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(mode === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.surface.warm,
      card: colors.surface.default,
      border: colors.surface.muted,
      primary: colors.brand[600],
      text: colors.ink.default,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="Player" component={PlayerScreen} options={{ presentation: 'modal' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
