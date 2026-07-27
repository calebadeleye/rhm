import { useMemo, type ReactNode } from 'react';
import { Linking, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { Bell, Mail, MapPin, Phone } from 'lucide-react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { useNotificationsEnabled } from '../hooks/useNotificationsEnabled';
import { ministryInfo } from '../data/ministry';
import { useTheme } from '../theme/ThemeContext';
import { useTypography } from '../theme/typography';

const CONTACT_EMAIL = 'redemptionhourorg@gmail.com';
const CONTACT_PHONE = '+2348034879983';

export function ProfileScreen() {
  const { enabled, setEnabled } = useNotificationsEnabled();
  const { colors } = useTheme();
  const typography = useTypography();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        sectionTitle: { textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 20, marginBottom: 8 },
        card: {
          backgroundColor: colors.surface.default,
          borderRadius: 16,
          padding: 16,
          gap: 12,
        },
        aboutText: { marginTop: 4 },
        pillar: { gap: 4 },
        pillarBorder: { borderTopWidth: 1, borderTopColor: colors.surface.muted, paddingTop: 12 },
        toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
        toggleText: { flex: 1, gap: 2 },
        contactRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
        contactLabel: { flex: 1 },
        version: { textAlign: 'center', marginTop: 24, fontSize: 12, color: colors.ink.faint },
      }),
    [colors],
  );

  return (
    <ScreenContainer>
      <Text style={typography.h1}>About</Text>

      <View style={styles.card}>
        <Text style={typography.h2}>{ministryInfo.radioName}</Text>
        <Text style={[typography.body, styles.aboutText]}>{ministryInfo.aboutShort}</Text>
      </View>

      <Text style={[typography.caption, styles.sectionTitle]}>What We Stand For</Text>
      <View style={styles.card}>
        {ministryInfo.pillars.map((pillar, index) => (
          <View key={pillar.title} style={[styles.pillar, index > 0 && styles.pillarBorder]}>
            <Text style={typography.bodyBold}>{pillar.title}</Text>
            <Text style={typography.caption}>{pillar.description}</Text>
          </View>
        ))}
      </View>

      <Text style={[typography.caption, styles.sectionTitle]}>Notifications</Text>
      <View style={styles.card}>
        <View style={styles.toggleRow}>
          <Bell color={colors.brand[600]} size={20} />
          <View style={styles.toggleText}>
            <Text style={typography.bodyBold}>Show reminders</Text>
            <Text style={typography.caption}>Get notified 5 minutes before a show you've saved starts.</Text>
          </View>
          <Switch
            value={enabled}
            onValueChange={setEnabled}
            trackColor={{ true: colors.brand[500], false: colors.surface.muted }}
          />
        </View>
      </View>

      <Text style={[typography.caption, styles.sectionTitle]}>Contact & Support</Text>
      <View style={styles.card}>
        <ContactRow
          icon={<Mail color={colors.brand[600]} size={18} />}
          label={CONTACT_EMAIL}
          onPress={() => Linking.openURL(`mailto:${CONTACT_EMAIL}`)}
          styles={styles}
          typography={typography}
        />
        <ContactRow
          icon={<Phone color={colors.brand[600]} size={18} />}
          label={CONTACT_PHONE}
          onPress={() => Linking.openURL(`tel:${CONTACT_PHONE}`)}
          styles={styles}
          typography={typography}
        />
        <ContactRow
          icon={<MapPin color={colors.brand[600]} size={18} />}
          label={ministryInfo.address}
          styles={styles}
          typography={typography}
        />
      </View>

      <Text style={styles.version}>{ministryInfo.name} · App v1.0.0</Text>
    </ScreenContainer>
  );
}

function ContactRow({
  icon,
  label,
  onPress,
  styles,
  typography,
}: {
  icon: ReactNode;
  label: string;
  onPress?: () => void;
  styles: ReturnType<typeof StyleSheet.create>;
  typography: ReturnType<typeof useTypography>;
}) {
  const content = (
    <>
      {icon}
      <Text style={[typography.body, styles.contactLabel]}>{label}</Text>
    </>
  );
  if (!onPress) {
    return <View style={styles.contactRow}>{content}</View>;
  }
  return (
    <Pressable style={styles.contactRow} onPress={onPress}>
      {content}
    </Pressable>
  );
}
