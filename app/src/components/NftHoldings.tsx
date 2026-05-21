import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, fonts, radii } from '../theme/tokens';
import { SoftCard } from './ds/SoftCard';
import { KoraGlyph, TicketIcon } from './ds/icons';

type NftKind = 'kora' | 'ticket';

interface NftItem {
  id: string;
  category: string;
  name: string;
  kind: NftKind;
  /** Apply the orange accent border (Founder tier and equivalents). */
  accent?: boolean;
}

const HOLDINGS: NftItem[] = [
  {
    id: 'founder-0271',
    category: 'Founder',
    name: 'Kora #0271',
    kind: 'kora',
    accent: true,
  },
  {
    id: 'ticket-lolla',
    category: 'Ingresso',
    name: 'Lollapalooza',
    kind: 'ticket',
  },
];

const NftArt: React.FC<{ kind: NftKind }> = ({ kind }) => (
  <View style={styles.art}>
    {kind === 'kora' ? (
      <KoraGlyph size={32} color={colors.ink} />
    ) : (
      <TicketIcon size={24} color={colors.ink} strokeWidth={1.5} />
    )}
  </View>
);

interface NftHoldingsProps {
  onSeeAll?: () => void;
}

export const NftHoldings: React.FC<NftHoldingsProps> = ({ onSeeAll }) => (
  <View style={styles.container}>
    <View style={styles.headerRow}>
      <Text style={styles.sectionTitle}>NFT HOLDINGS</Text>
      <TouchableOpacity onPress={onSeeAll} activeOpacity={0.7}>
        <Text style={styles.seeMore}>
          {HOLDINGS.length} ativos{' '}
          <Text style={styles.seeMoreArrow}>→</Text>
        </Text>
      </TouchableOpacity>
    </View>

    <View style={styles.grid}>
      {HOLDINGS.map((item) => (
        <View key={item.id} style={styles.cell}>
          <SoftCard
            radius={radii.cardSm}
            padding={9}
            style={item.accent ? styles.cardAccent : undefined}
          >
            <NftArt kind={item.kind} />
            <Text
              style={[
                styles.category,
                item.accent && styles.categoryAccent,
              ]}
            >
              {item.category.toUpperCase()}
            </Text>
            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>
          </SoftCard>
        </View>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.inkMute,
    fontFamily: fonts.mono.medium,
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  seeMore: {
    color: colors.inkMute,
    fontFamily: fonts.mono.medium,
    fontSize: 9,
    letterSpacing: 0.5,
  },
  seeMoreArrow: {
    color: colors.orange,
    fontFamily: fonts.mono.semibold,
    fontSize: 11,
  },
  grid: {
    flexDirection: 'row',
    gap: 8,
  },
  cell: {
    flex: 1,
  },
  cardAccent: {
    // Matches HTML mock: inset 0 0 0 1px rgba(255,107,61,0.22)
    borderColor: 'rgba(255,107,61,0.22)',
  },
  art: {
    aspectRatio: 1.6,
    borderRadius: 9,
    marginBottom: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.artBg,
    borderWidth: 1,
    borderColor: colors.line,
  },
  category: {
    color: colors.inkMute,
    fontFamily: fonts.mono.medium,
    fontSize: 7,
    letterSpacing: 0.7,
  },
  categoryAccent: {
    color: colors.orange,
  },
  name: {
    color: colors.ink,
    fontFamily: fonts.sans.semibold,
    fontSize: 11,
    marginTop: 2,
    letterSpacing: -0.1,
  },
});
