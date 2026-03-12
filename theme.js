import { useColorScheme } from 'react-native';

const palette = {
  yellow: '#FFD60A',
  yellowDim: '#B8960A',
  red: '#FF3B30',
  redSoft: '#FF6B6B',
  green: '#34C759',
  blue: '#0A84FF',
};

const light = {
  ...palette,
  bg: '#F2F2F7',
  card: '#FFFFFF',
  cardBorder: 'rgba(0,0,0,0.04)',
  text: '#1C1C1E',
  textSecondary: '#8E8E93',
  textTertiary: '#AEAEB2',
  navBg: '#FFFFFF',
  navText: '#1C1C1E',
  navTint: '#FFD60A',
  infoBg: 'rgba(10,132,255,0.08)',
  infoBorder: 'rgba(10,132,255,0.15)',
  infoText: '#0A84FF',
  separator: 'rgba(0,0,0,0.06)',
  shadow: { color: '#000', opacity: 0.08 },
  statusBar: 'dark',
  cardGradientStart: 'rgba(255,214,10,0.06)',
  cardGradientEnd: 'rgba(255,214,10,0)',
  badgeBg: 'rgba(255,214,10,0.12)',
  badgeText: '#B8960A',
  warningBg: 'rgba(255,59,48,0.08)',
  warningText: '#FF3B30',
};

const dark = {
  ...palette,
  bg: '#000000',
  card: '#1C1C1E',
  cardBorder: 'rgba(255,255,255,0.08)',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  textTertiary: '#636366',
  navBg: '#1C1C1E',
  navText: '#FFFFFF',
  navTint: '#FFD60A',
  infoBg: 'rgba(10,132,255,0.15)',
  infoBorder: 'rgba(10,132,255,0.25)',
  infoText: '#64D2FF',
  separator: 'rgba(255,255,255,0.08)',
  shadow: { color: '#000', opacity: 0.3 },
  statusBar: 'light',
  cardGradientStart: 'rgba(255,214,10,0.08)',
  cardGradientEnd: 'rgba(255,214,10,0)',
  badgeBg: 'rgba(255,214,10,0.15)',
  badgeText: '#FFD60A',
  warningBg: 'rgba(255,59,48,0.12)',
  warningText: '#FF6B6B',
};

export function useTheme() {
  const scheme = useColorScheme();
  return scheme === 'dark' ? dark : light;
}
