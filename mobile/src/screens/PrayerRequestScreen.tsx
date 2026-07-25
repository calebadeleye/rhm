import { useState, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { CheckCircle2, HandHeart } from 'lucide-react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { prayerCategories, type PrayerCategoryId } from '../data/prayerCategories';
import { submitPrayerRequest } from '../api/prayerRequestService';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialForm = {
  name: '',
  email: '',
  phone: '',
  category: 'healing' as PrayerCategoryId,
  request: '',
  anonymous: false,
  consent: false,
};

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

export function PrayerRequestScreen() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!form.anonymous && form.name.trim().length < 2) {
      next.name = 'Please enter your name, or mark this request private.';
    }
    if (!form.anonymous && form.email.length > 0 && !EMAIL_PATTERN.test(form.email)) {
      next.email = 'Enter a valid email address.';
    }
    if (form.request.trim().length < 10) {
      next.request = 'Please share a little more detail (10+ characters).';
    }
    if (!form.consent) {
      next.consent = 'Please confirm consent to submit your request.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setStatus('submitting');
    setErrorMessage(null);
    try {
      await submitPrayerRequest({ ...form, website: '' });
      setForm(initialForm);
      setStatus('success');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong.');
    }
  };

  if (status === 'success') {
    return (
      <ScreenContainer>
        <View style={styles.successCard}>
          <CheckCircle2 color={colors.brand[600]} size={40} />
          <Text style={typography.h2}>Your request has been received</Text>
          <Text style={[typography.body, styles.center]}>
            Our prayer team will be praying for you. Requests are kept private and are never
            published without your permission.
          </Text>
          <Pressable onPress={() => setStatus('idle')} style={styles.submitButton}>
            <Text style={styles.submitButtonLabel}>Submit another request</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <HandHeart color={colors.brand[600]} size={44} />
        <Text style={typography.h1}>We are here to pray with you.</Text>
        <Text style={[typography.body, styles.center]}>
          Share your request in confidence and our prayer team will stand with you in faith.
        </Text>
      </View>

      {!form.anonymous && (
        <>
          <Field label="Your Name" error={errors.name}>
            <TextInput
              value={form.name}
              onChangeText={(name) => setForm((f) => ({ ...f, name }))}
              placeholder="Enter your name"
              placeholderTextColor={colors.ink.faint}
              style={styles.input}
            />
          </Field>
          <Field label="Your Email (optional)" error={errors.email}>
            <TextInput
              value={form.email}
              onChangeText={(email) => setForm((f) => ({ ...f, email }))}
              placeholder="you@example.com"
              placeholderTextColor={colors.ink.faint}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />
          </Field>
        </>
      )}

      <Field label="Prayer category">
        <View style={styles.chipRow}>
          {prayerCategories.map((cat) => {
            const isSelected = cat.id === form.category;
            return (
              <Pressable
                key={cat.id}
                onPress={() => setForm((f) => ({ ...f, category: cat.id }))}
                style={[styles.chip, isSelected && styles.chipSelected]}
              >
                <Text style={[styles.chipLabel, isSelected && styles.chipLabelSelected]}>{cat.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </Field>

      <Field label="Your Prayer Request" error={errors.request}>
        <TextInput
          value={form.request}
          onChangeText={(request) => setForm((f) => ({ ...f, request }))}
          placeholder="How can we pray for you?"
          placeholderTextColor={colors.ink.faint}
          multiline
          numberOfLines={5}
          style={[styles.input, styles.textarea]}
        />
      </Field>

      <View style={styles.toggleRow}>
        <View style={styles.toggleText}>
          <Text style={typography.bodyBold}>Keep my request private</Text>
          <Text style={typography.caption}>Submits without your name — only the prayer team will see it.</Text>
        </View>
        <Switch
          value={form.anonymous}
          onValueChange={(anonymous) => setForm((f) => ({ ...f, anonymous }))}
          trackColor={{ true: colors.brand[500], false: colors.surface.muted }}
        />
      </View>

      <View style={styles.consentRow}>
        <Switch
          value={form.consent}
          onValueChange={(consent) => setForm((f) => ({ ...f, consent }))}
          trackColor={{ true: colors.brand[500], false: colors.surface.muted }}
        />
        <Text style={[typography.caption, styles.consentText]}>
          I consent to Redemption Hour Ministries storing this request in order to pray for me.
          Requests are kept private and are never published without explicit permission.
        </Text>
      </View>
      {errors.consent && <Text style={styles.errorText}>{errors.consent}</Text>}

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      <Pressable
        onPress={handleSubmit}
        disabled={status === 'submitting'}
        style={[styles.submitButton, status === 'submitting' && styles.submitButtonDisabled]}
      >
        {status === 'submitting' ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <>
            <HandHeart color="#ffffff" size={18} />
            <Text style={styles.submitButtonLabel}>Submit Request</Text>
          </>
        )}
      </Pressable>
    </ScreenContainer>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={typography.bodyBold}>{label}</Text>
      {children}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', gap: 8, marginBottom: 24 },
  center: { textAlign: 'center' },
  field: { marginBottom: 16, gap: 6 },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.ink.default,
  },
  textarea: { minHeight: 120, textAlignVertical: 'top' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: colors.surface.muted,
  },
  chipSelected: { backgroundColor: colors.brand[600] },
  chipLabel: { fontSize: 12, fontWeight: '700', color: colors.ink.soft },
  chipLabelSelected: { color: '#ffffff' },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    gap: 12,
  },
  toggleText: { flex: 1, gap: 2 },
  consentRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  consentText: { flex: 1 },
  errorText: { fontSize: 12, fontWeight: '600', color: colors.danger, marginTop: 2 },
  successCard: { alignItems: 'center', gap: 12, paddingVertical: 60, paddingHorizontal: 20 },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.brand[600],
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 8,
  },
  submitButtonDisabled: { opacity: 0.6 },
  submitButtonLabel: { color: '#ffffff', fontWeight: '700', fontSize: 15 },
});
