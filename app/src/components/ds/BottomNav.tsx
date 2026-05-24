import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { fonts, radii } from '../../theme/tokens';
import { useTheme } from '../../theme/ThemeProvider';
import {
  HomeIcon,
  CardIcon,
  InvestIcon,
  ExperiencesIcon,
  QrIcon,
} from './icons';
import { SoftCard } from './SoftCard';

export type BottomNavTab =
  | 'inicio'
  | 'cartao'
  | 'investimentos'
  | 'experiencias';

interface BottomNavProps {
  activeTab: BottomNavTab;
  onChange: (tab: BottomNavTab) => void;
  /** Center scan action. */
  onScanPress?: () => void;
}

interface TabDef {
  id: BottomNavTab;
  label: string;
  Icon: React.FC<{ size?: number; color?: string; strokeWidth?: number }>;
}

const LEFT_TABS: TabDef[] = [
  { id: 'inicio', label: 'INICIO', Icon: HomeIcon },
  { id: 'cartao', label: 'CARTAO', Icon: CardIcon },
];

const RIGHT_TABS: TabDef[] = [
  { id: 'investimentos', label: 'INVEST', Icon: InvestIcon },
  { id: 'experiencias', label: 'EXP', Icon: ExperiencesIcon },
];

/**
 * Bottom navigation: 5-column grid with the QR scan FAB anchored in the
 * center column. 4 nav tabs flank it (2 left, 2 right). The QR slot is not
 * a tab — it triggers `onScanPress` and has no active state.
 */
export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChange,
  onScanPress,
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
      {LEFT_TABS.map(renderTab)}

      {/* Center QR FAB — raised, no active state */}
      <View style={styles.fabSlot}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onScanPress}
          style={styles.fabTouch}
        >
          <SoftCard radius={radii.pill} padding={0}>
            <View style={styles.fabInner}>
              <QrIcon size={22} color={t.ink} strokeWidth={1.7} />
            </View>
          </SoftCard>
        </TouchableOpacity>
      </View>

      {RIGHT_TABS.map(renderTab)}
    </View>
  );
};

const FAB_SIZE = 52;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 6,
    paddingBottom: Platform.OS === 'android' ? 14 : 24,
    paddingHorizontal: 8,
    alignItems: 'flex-start',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  label: {
    fontFamily: fonts.mono.medium,
    fontSize: 8,
    letterSpacing: 0.8,
    marginTop: 6,
  },
  fabSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  fabTouch: {
    // Lifts the QR FAB above the bar so it reads as an action, not a tab.
    marginTop: -22,
  },
  fabInner: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
