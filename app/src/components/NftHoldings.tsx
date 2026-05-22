import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { fonts, radii, ThemeTokens } from '../theme/tokens';
import { useTheme } from '../theme/ThemeProvider';
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

const NftArt: React.FC<{ kind: NftKind; t: ThemeTokens }> = ({ kind, t }) => (
  <View
    style={[
      styles.art,
      { backgroundColor: t.artBg, borderColor: t.line },
    ]}
  >
    {kind === 'kora' ? (
      <KoraGlyph size={32} color={t.ink} />
    ) : (
      <TicketIcon size={24} color={t.ink} strokeWidth={1.5} />
    )}
  </View>
);

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
        <TouchableOpacity onPress={onSeeAll} activeOpacity={0.7}>
          <Text style={[styles.seeMore, { color: t.inkMute }]}>
            {HOLDINGS.length} ativos{' '}
            <Text style={[styles.seeMoreArrow, { color: t.orange }]}>→</Text>
          </Text>
        </TouchableOpacity>
      </View>

    <View style={styles.grid}>
      {HOLDINGS.map((item) => (
        <View key={item.id} style={styles.cell}>
          <SoftCard
            radius={radii.cardSm}
            padding={9}
            style={item.accent ? { borderColor: t.orange } : undefined}
          >
            <NftArt kind={item.kind} t={t} />
            <Text
              style={[
                styles.category,
                { color: item.accent ? t.orange : t.inkMute },
              ]}
            >
              {item.category.toUpperCase()}
            </Text>
            <Text style={[styles.name, { color: t.ink }]} numberOfLines={1}>
              {item.name}
            </Text>
          </SoftCard>
        </View>
      ))}
      </View>
    </View>
  );
};

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
    fontFamily: fonts.mono.medium,
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  seeMore: {
    fontFamily: fonts.mono.medium,
    fontSize: 9,
    letterSpacing: 0.5,
  },
  seeMoreArrow: {
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
  art: {
    aspectRatio: 1.6,
    borderRadius: 9,
    marginBottom: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  category: {
    fontFamily: fonts.mono.medium,
    fontSize: 7,
    letterSpacing: 0.7,
  },
  name: {
    fontFamily: fonts.sans.semibold,
    fontSize: 11,
    marginTop: 2,
    letterSpacing: -0.1,
  },
});
