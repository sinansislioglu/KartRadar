import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { useTheme } from '../theme';
import { t } from '../i18n';

const ESPN_CORE = 'https://sports.core.api.espn.com/v2/sports/soccer/leagues';
const ESPN_SITE = 'https://site.api.espn.com/apis/site/v2/sports/soccer';

function getCurrentSeason() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  return month >= 7 ? year : year - 1;
}

async function fetchCurrentRoster(teamId, espnSlug) {
  const res = await fetch(`${ESPN_SITE}/${espnSlug}/teams/${teamId}/roster`);
  const data = await res.json();
  return (data.athletes || []).map((a) => ({
    id: String(a.id),
    name: a.displayName,
  }));
}

async function fetchCoreStats(espnSlug, playerId) {
  try {
    const season = getCurrentSeason();
    const res = await fetch(
      `${ESPN_CORE}/${espnSlug}/seasons/${season}/types/1/athletes/${playerId}/statistics/0`
    );
    const data = await res.json();
    let yc = 0, rc = 0;
    for (const cat of data.splits?.categories || []) {
      if (cat.name === 'general') {
        for (const s of cat.stats) {
          if (s.name === 'yellowCards') yc = s.value || 0;
          if (s.name === 'redCards') rc = s.value || 0;
        }
      }
    }
    return { yc, rc };
  } catch {
    return { yc: 0, rc: 0 };
  }
}

async function fetchFinishedMatchIds(teamId, espnSlug) {
  const season = getCurrentSeason();
  const res = await fetch(
    `${ESPN_SITE}/${espnSlug}/teams/${teamId}/schedule?season=${season}`
  );
  const data = await res.json();
  return (data.events || [])
    .filter((e) => e.competitions?.[0]?.status?.type?.state === 'post')
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((e) => e.id);
}

async function fetchInBatches(items, fn, batchSize = 5) {
  const results = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(fn));
    results.push(...batchResults);
  }
  return results;
}

async function fetchDoubleYellowReds(matchIds, teamId, espnSlug) {
  const summaries = await fetchInBatches(matchIds, (id) =>
    fetch(`${ESPN_SITE}/${espnSlug}/summary?event=${id}`).then((r) => r.json())
  );
  const playerCards = {};

  for (const summary of summaries) {
    for (const team of summary.rosters || []) {
      if (String(team.team?.id) !== String(teamId)) continue;
      for (const p of team.roster || []) {
        const pid = String(p.athlete?.id || '');
        let yc = 0, rc = 0;
        for (const s of p.stats || []) {
          if (s.name === 'yellowCards') yc = s.value || 0;
          if (s.name === 'redCards') rc = s.value || 0;
        }
        if (!playerCards[pid]) {
          playerCards[pid] = { doubleYellowReds: 0, directReds: 0, rawYC: 0 };
        }
        playerCards[pid].rawYC += yc;
        if (rc > 0 && yc > 0) {
          playerCards[pid].doubleYellowReds += 1;
        } else if (rc > 0) {
          playerCards[pid].directReds += 1;
        }
      }
    }
  }
  return playerCards;
}

function PlayerCard({ item, threshold, theme }) {
  const dots = [];
  for (let i = 0; i < threshold; i++) {
    dots.push(
      <View
        key={i}
        style={[
          styles.dot,
          i < item.yellow
            ? { backgroundColor: theme.yellow }
            : { backgroundColor: theme.separator },
        ]}
      />
    );
  }

  return (
    <View
      accessibilityLabel={`${item.name}, ${t('players.cardCount', { y: item.yellow, max: threshold })}`}
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
      <View style={styles.cardTop}>
        <View style={styles.playerInfo}>
          <Text style={[styles.name, { color: theme.text }]}>{item.name}</Text>
          <Text style={[styles.cardCount, { color: theme.textSecondary }]}>
            {t('players.cardCount', { y: item.yellow, max: threshold })}
          </Text>
        </View>
        <View style={[styles.warningBadge, { backgroundColor: theme.warningBg }]}>
          <Text style={[styles.warningText, { color: theme.warningText }]}>
            {t('players.oneCardPenalty')}
          </Text>
        </View>
      </View>
      <View style={styles.dotsRow}>{dots}</View>
    </View>
  );
}

export default function PlayersScreen({ route }) {
  const { team, league } = route.params;
  const theme = useTheme();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [matchCount, setMatchCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      setError(false);

      const [roster, matchIds] = await Promise.all([
        fetchCurrentRoster(team.id, league.espnSlug),
        fetchFinishedMatchIds(team.id, league.espnSlug),
      ]);

      setMatchCount(matchIds.length);

      const [coreStatsResults, teamCards] = await Promise.all([
        fetchInBatches(roster, async (p) => ({
          id: p.id,
          stats: await fetchCoreStats(league.espnSlug, p.id),
        })),
        fetchDoubleYellowReds(matchIds, team.id, league.espnSlug),
      ]);

      const riskPlayers = [];

      for (const player of roster) {
        const core = coreStatsResults.find((c) => c.id === player.id)?.stats || { yc: 0, rc: 0 };
        const tc = teamCards[player.id] || { doubleYellowReds: 0, directReds: 0, rawYC: 0 };

        const currentTeamRC = tc.doubleYellowReds + tc.directReds;
        const previousRC = Math.max(0, core.rc - currentTeamRC);
        const adjustedYC = core.yc - tc.doubleYellowReds - previousRC;
        const currentAccumulation = adjustedYC > 0 ? adjustedYC % league.threshold : 0;

        if (currentAccumulation === league.threshold - 1) {
          riskPlayers.push({ ...player, yellow: currentAccumulation });
        }
      }

      setPlayers(riskPlayers.sort((a, b) => a.name.localeCompare(b.name)));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [team.id, league.espnSlug, league.threshold]);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.bg }]}>
        <ActivityIndicator size="large" color={theme.yellow} />
        <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
          {t('players.loading')}
        </Text>
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
      {matchCount > 0 && (
        <View style={[styles.infoBar, { backgroundColor: theme.infoBg, borderBottomColor: theme.infoBorder }]}>
          <Text style={[styles.infoText, { color: theme.infoText }]}>
            {t('players.matchCount', { n: matchCount })}
          </Text>
        </View>
      )}

      {players.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>✅</Text>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>{t('players.clean')}</Text>
          <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
            {t('players.noPlayersAtLimit')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={players}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          contentInsetAdjustmentBehavior="automatic"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={theme.yellow} />
          }
          renderItem={({ item }) => (
            <PlayerCard item={item} threshold={league.threshold} theme={theme} />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 14, fontSize: 15, fontWeight: '500' },
  list: { paddingTop: 8, paddingBottom: 20 },
  infoBar: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  infoText: { fontSize: 13, fontWeight: '600', textAlign: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 80 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 22, fontWeight: '700' },
  emptySubtitle: { fontSize: 15, marginTop: 6 },
  card: {
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  playerInfo: { flex: 1, marginRight: 12 },
  name: { fontSize: 17, fontWeight: '600', letterSpacing: -0.2 },
  cardCount: { fontSize: 13, marginTop: 4, fontWeight: '500' },
  warningBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  warningText: { fontSize: 12, fontWeight: '700' },
  dotsRow: {
    flexDirection: 'row',
    marginTop: 14,
    gap: 6,
  },
  dot: {
    flex: 1,
    height: 6,
    borderRadius: 3,
  },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  errorIcon: { fontSize: 48, marginBottom: 12 },
  errorTitle: { fontSize: 20, fontWeight: '700' },
  errorSubtitle: { fontSize: 15, marginTop: 6, textAlign: 'center' },
  retryButton: { marginTop: 20, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10 },
  retryText: { fontSize: 15, fontWeight: '700', color: '#1C1C1E' },
});
