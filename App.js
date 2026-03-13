import { useColorScheme, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LeagueScreen from './screens/LeagueScreen';
import TeamScreen from './screens/TeamScreen';
import PlayersScreen from './screens/PlayersScreen';
import LegalScreen from './screens/LegalScreen';
import { t } from './i18n';

const Stack = createNativeStackNavigator();

const LightNav = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F2F2F7',
    card: '#FFFFFF',
    text: '#1C1C1E',
    primary: '#FFD60A',
  },
};

const DarkNav = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#000000',
    card: '#1C1C1E',
    text: '#FFFFFF',
    primary: '#FFD60A',
  },
};

const screenOptions = (isDark) => ({
  headerLargeTitle: true,
  headerLargeTitleShadowVisible: false,
  headerShadowVisible: false,
  headerTintColor: '#FFD60A',
  headerLargeTitleStyle: {
    fontWeight: '800',
    color: isDark ? '#FFFFFF' : '#1C1C1E',
  },
  headerTitleStyle: {
    fontWeight: '700',
    color: isDark ? '#FFFFFF' : '#1C1C1E',
  },
  headerStyle: {
    backgroundColor: isDark ? '#000000' : '#F2F2F7',
  },
});

export default function App() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return (
    <NavigationContainer theme={isDark ? DarkNav : LightNav}>
      <Stack.Navigator screenOptions={screenOptions(isDark)}>
        <Stack.Screen
          name="Leagues"
          component={LeagueScreen}
          options={{
            title: t('nav.home'),
            headerLeft: () => (
              <Image
                source={require('./assets/header-icon.png')}
                style={{ width: 36, height: 36 }}
                resizeMode="contain"
              />
            ),
          }}
        />
        <Stack.Screen name="Teams" component={TeamScreen} options={{ title: t('nav.teams') }} />
        <Stack.Screen name="Players" component={PlayersScreen} options={{ title: t('nav.players') }} />
        <Stack.Screen name="Legal" component={LegalScreen} />
      </Stack.Navigator>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </NavigationContainer>
  );
}
