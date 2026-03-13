import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../theme';
import { t } from '../i18n';

export default function LegalScreen({ route }) {
  const theme = useTheme();
  const { type } = route.params;
  const isPrivacy = type === 'privacy';
  const content = isPrivacy ? t('legal.privacyContent') : t('legal.termsContent');
  const title = isPrivacy ? t('legal.privacyTitle') : t('legal.termsTitle');

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.body, { color: theme.textSecondary }]}>{content}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 20 },
  body: { fontSize: 15, lineHeight: 24 },
});
