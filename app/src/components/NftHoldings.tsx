import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { fonts } from '../theme/tokens';
import { useTheme } from '../theme/ThemeProvider';
import { NftPill, NftPillType } from './ui/NftPill';

type NftKind = 'kora' | 'ticket' | 'badge' | 'yield';

interface NftItem {
  id: string;
  category: string;
  name: string;
  kind: NftKind;
  type?: NftPillType;
}

const HOLDINGS: NftItem[] = [
  {
    id: 'founder-0271',
    category: 'Founder',
    name: 'Kora #0271',
    kind: 'kora',
    type: 'founder',
  },
  {
    id: 'ticket-lolla',
    category: 'Ingresso',
    name: 'Lollapalooza',
    kind: 'ticket',
    type: 'ingresso',
  },
  {
    id: 'kyc-pass',
    category: 'Badge',
    name: 'KYC Pass',
    kind: 'badge',
  },
  {
    id: 'yield-key',
    category: 'Yield',
    name: 'Vault Key',
    kind: 'yield',
  },
];

interface NftHoldingsProps {
  onSeeAll?: () => void;
}

export const NftHoldings: React.FC<NftHoldingsProps> = ({ onSeeAll }) => {
  const { t } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.sectionTitle, { color: t.inkMute }]}>
          NFT HOLDINGS
        </Text>
        <TouchableOpacity
          onPress={onSeeAll}
          activeOpacity={0.7}
          style={styles.seeMoreButton}
        >
          <Text style={[styles.seeMore, { color: t.inkMute }]}>
            {HOLDINGS.length} ativos{' '}
          </Text>
          <Text style={[styles.seeMoreArrow, { color: t.orange }]}>→</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pillsRow}
      >
        {HOLDINGS.map((item) => (
          <NftPill
            key={item.id}
            name={item.name}
            category={item.category}
            type={item.type}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 14,
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  sectionTitle: {
    fontFamily: fonts.mono.medium,
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  seeMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeMore: {
    fontFamily: fonts.mono.medium,
    fontSize: 9,
  },
  seeMoreArrow: {
    fontFamily: fonts.mono.medium,
    fontSize: 9,
  },
  pillsRow: {
    gap: 8,
    paddingRight: 20,
  },
});
