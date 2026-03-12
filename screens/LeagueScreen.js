import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

const LEAGUES = [
  { id: 'tur.1', name: 'Süper Lig', threshold: 4, espnSlug: 'tur.1', flag: '🇹🇷' },
  { id: 'eng.1', name: 'Premier League', threshold: 5, espnSlug: 'eng.1', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: 'esp.1', name: 'La Liga', threshold: 5, espnSlug: 'esp.1', flag: '🇪🇸' },
  { id: 'ita.1', name: 'Serie A', threshold: 5, espnSlug: 'ita.1', flag: '🇮🇹' },
  { id: 'ger.1', name: 'Bundesliga', threshold: 5, espnSlug: 'ger.1', flag: '🇩🇪' },
  { id: 'fra.1', name: 'Ligue 1', threshold: 3, espnSlug: 'fra.1', flag: '🇫🇷' },
  { id: 'uefa.champions', name: 'Şampiyonlar Ligi', threshold: 3, espnSlug: 'uefa.champions', flag: '🏆' },
  { id: 'uefa.europa', name: 'Avrupa Ligi', threshold: 3, espnSlug: 'uefa.europa', flag: '🏆' },
  { id: 'uefa.europa.conf', name: 'Konferans Ligi', threshold: 3, espnSlug: 'uefa.europa.conf', flag: '🏆' },
];

function LeagueCard({ item, theme, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.cardBorder,
          shadowColor: theme.shadow.color,
          shadowOpacity: theme.shadow.opacity,
        },
      ]}
    >
      <View style={styles.cardContent}>
        <Text style={styles.flag}>{item.flag}</Text>
        <View style={styles.cardText}>
          <Text style={[styles.name, { color: theme.text }]}>{item.name}</Text>
          <View style={styles.badgeRow}>
            <View style={[styles.badge, { backgroundColor: theme.badgeBg }]}>
              <Text style={[styles.badgeText, { color: theme.badgeText }]}>
                {item.threshold} kart sınırı
              </Text>
            </View>
          </View>
        </View>
        <Text style={[styles.chevron, { color: theme.textTertiary }]}>›</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function LeagueScreen({ navigation }) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <FlatList
        data={LEAGUES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        contentInsetAdjustmentBehavior="automatic"
        renderItem={({ item }) => (
          <LeagueCard
            item={item}
            theme={theme}
            onPress={() => navigation.navigate('Takımlar', { league: item })}
          />
        )}
      />
      <View style={[styles.bottomBar, { borderTopColor: theme.cardBorder }]}>
        <TouchableOpacity onPress={() => navigation.navigate('Legal', { type: 'privacy' })}>
          <Text style={[styles.footerLink, { color: theme.textTertiary }]}>
            Gizlilik Politikası
          </Text>
        </TouchableOpacity>
        <Text style={[styles.footerDot, { color: theme.textTertiary }]}>·</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Legal', { type: 'terms' })}>
          <Text style={[styles.footerLink, { color: theme.textTertiary }]}>
            Kullanım Koşulları
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { paddingTop: 8, paddingBottom: 20 },
  card: {
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 14,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  flag: { fontSize: 32, marginRight: 14 },
  cardText: { flex: 1 },
  name: { fontSize: 17, fontWeight: '600', letterSpacing: -0.2 },
  badgeRow: { flexDirection: 'row', marginTop: 6 },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: { fontSize: 12, fontWeight: '600' },
  chevron: { fontSize: 28, fontWeight: '300', marginLeft: 8 },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingBottom: 28,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  footerLink: { fontSize: 13, fontWeight: '500' },
  footerDot: { fontSize: 13 },
});
