import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useEffect, useState } from 'react';
import { useTheme } from '../theme';

async function fetchActiveTeamIds(espnSlug) {
  const res = await fetch(
    `https://site.api.espn.com/apis/site/v2/sports/soccer/${espnSlug}/scoreboard?dates=20260310-20261231`
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

  useEffect(() => {
    const load = async () => {
      try {
        const teamsRes = await fetch(
          `https://site.api.espn.com/apis/site/v2/sports/soccer/${league.espnSlug}/teams?season=2025`
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
      } catch (err) {
        console.error('Takımlar yüklenemedi:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.bg }]}>
        <ActivityIndicator size="large" color={theme.yellow} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <FlatList
        data={teams}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TeamCard
            item={item}
            theme={theme}
            onPress={() =>
              navigation.navigate('Oyuncular', {
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
});
