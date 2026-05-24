import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { fonts } from '../../theme/tokens';
import { useTheme } from '../../theme/ThemeProvider';
import {
  HomeIcon,
  CardIcon,
  InvestIcon,
  ExperiencesIcon,
} from './icons';

export type BottomNavTab =
  | 'inicio'
  | 'cartao'
  | 'investimentos'
  | 'experiencias';

interface BottomNavProps {
  activeTab: BottomNavTab;
  onChange: (tab: BottomNavTab) => void;
  /** Kept for compatibility with older callers. */
  onScanPress?: () => void;
}

interface TabDef {
  id: BottomNavTab;
  label: string;
  Icon: React.FC<{ size?: number; color?: string; strokeWidth?: number }>;
}

const TABS: TabDef[] = [
  { id: 'inicio', label: 'INICIO', Icon: HomeIcon },
  { id: 'cartao', label: 'CARTAO', Icon: CardIcon },
  { id: 'investimentos', label: 'INVEST', Icon: InvestIcon },
  { id: 'experiencias', label: 'EXP', Icon: ExperiencesIcon },
];

/**
 * Bottom navigation from the DS: four equal tabs with an orange indicator
 * line above the active icon.
 */
export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChange,
}) => {
  const { t } = useTheme();

  const renderTab = ({ id, label, Icon }: TabDef) => {
    const isActive = activeTab === id;
    const tint = isActive ? t.orange : t.inkMute;
    return (
      <TouchableOpacity
        key={id}
        style={styles.tab}
        activeOpacity={0.7}
        onPress={() => onChange(id)}
      >
        {isActive ? (
          <View
            style={[
              styles.indicator,
              { backgroundColor: t.orange, shadowColor: t.orange },
            ]}
          />
        ) : null}
        <Icon size={21} color={tint} strokeWidth={1.7} />
        <Text style={[styles.label, { color: tint }]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: t.bnavBg, borderTopColor: t.line },
      ]}
    >
      {TABS.map(renderTab)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'android' ? 20 : 28,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    top: -12,
    width: 26,
    height: 3,
    borderRadius: 2,
    elevation: 6,
  },
  label: {
    fontFamily: fonts.mono.medium,
    fontSize: 8,
    letterSpacing: 0.8,
    marginTop: 4,
  },
});
