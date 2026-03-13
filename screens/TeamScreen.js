import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, Image, RefreshControl } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { useTheme } from '../theme';
import { t } from '../i18n';

function getCurrentSeason() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  return month >= 7 ? year : year - 1;
}

function getDateRange() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}${m}${d}-${y}1231`;
}

async function fetchActiveTeamIds(espnSlug) {
  const res = await fetch(
    `https://site.api.espn.com/apis/site/v2/sports/soccer/${espnSlug}/scoreboard?dates=${getDateRange()}`
  );
  const data = await res.json();
  const activeIds = new Set();
  for (const event of data.events || []) {
    for (const comp of event.competitions || []) {
      for (const c of comp.competitors || []) {
        if (c.team?.id) activeIds.add(String(c.team.id));
      }
    }
  }
  return activeIds;
}

function TeamCard({ item, theme, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      accessibilityLabel={item.displayName}
      accessibilityRole="button"
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
        {item.logos?.[0]?.href ? (
          <Image source={{ uri: item.logos[0].href }} style={styles.logo} />
        ) : (
          <View style={[styles.logoPlaceholder, { backgroundColor: theme.separator }]} />
        )}
        <Text style={[styles.name, { color: theme.text }]}>{item.displayName}</Text>
        <Text style={[styles.chevron, { color: theme.textTertiary }]}>›</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function TeamScreen({ navigation, route }) {
  const { league } = route.params;
  const theme = useTheme();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      setError(false);
      const season = getCurrentSeason();
      const teamsRes = await fetch(
        `https://site.api.espn.com/apis/site/v2/sports/soccer/${league.espnSlug}/teams?season=${season}`
      );
      const teamsData = await teamsRes.json();
      let teamList =
        teamsData.sports?.[0]?.leagues?.[0]?.teams?.map((t) => t.team) || [];

      const uefaTournaments = ['uefa.champions', 'uefa.europa', 'uefa.europa.conf'];
      if (uefaTournaments.includes(league.espnSlug)) {
        const activeIds = await fetchActiveTeamIds(league.espnSlug);
        if (activeIds.size > 0) {
          teamList = teamList.filter((t) => activeIds.has(String(t.id)));
        }
      }

      setTeams(teamList.sort((a, b) => a.displayName.localeCompare(b.displayName)));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [league.espnSlug]);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.bg }]}>
        <ActivityIndicator size="large" color={theme.yellow} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.bg }]}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={[styles.errorTitle, { color: theme.text }]}>{t('error.title')}</Text>
        <Text style={[styles.errorSubtitle, { color: theme.textSecondary }]}>{t('error.subtitle')}</Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: theme.yellow }]}
          onPress={() => { setLoading(true); load(); }}
        >
          <Text style={styles.retryText}>{t('error.retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <FlatList
        data={teams}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={theme.yellow} />
        }
        renderItem={({ item }) => (
          <TeamCard
            item={item}
            theme={theme}
            onPress={() =>
              navigation.navigate('Players', {
                team: { id: item.id, name: item.displayName, logo: item.logos?.[0]?.href },
                league,
              })
            }
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { paddingTop: 8, paddingBottom: 20 },
  card: {
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 14,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  logo: { width: 36, height: 36, borderRadius: 8, marginRight: 14 },
  logoPlaceholder: { width: 36, height: 36, borderRadius: 8, marginRight: 14 },
  name: { flex: 1, fontSize: 16, fontWeight: '500', letterSpacing: -0.2 },
  chevron: { fontSize: 28, fontWeight: '300', marginLeft: 8 },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  errorIcon: { fontSize: 48, marginBottom: 12 },
  errorTitle: { fontSize: 20, fontWeight: '700' },
  errorSubtitle: { fontSize: 15, marginTop: 6, textAlign: 'center' },
  retryButton: { marginTop: 20, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10 },
  retryText: { fontSize: 15, fontWeight: '700', color: '#1C1C1E' },
});
