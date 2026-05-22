import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { fonts, radii } from '../theme/tokens';
import { useTheme } from '../theme/ThemeProvider';
import { MOCK_CRYPTO_FAVORITES, MOCK_CRYPTO_PORTFOLIO } from '../data/crypto';
import { SoftCard } from './ds/SoftCard';

const Sparkline = ({ points, color }: { points: number[]; color: string }) => (
  <View style={styles.sparklineContainer}>
    {points.map((val, i) => (
      <View
        key={i}
        style={[
          styles.sparklineBar,
          {
            height: `${val}%`,
            backgroundColor: color,
            opacity: 0.35 + (i / points.length) * 0.6,
          },
        ]}
      />
    ))}
  </View>
);

const FavoriteCard: React.FC<{
  item: (typeof MOCK_CRYPTO_FAVORITES)[number];
}> = ({ item }) => {
  const { t } = useTheme();
  const tint = item.isPositive ? t.green : t.orangeDark;
  return (
    <SoftCard radius={radii.cardSm} padding={0}>
      <View style={styles.favCardInner}>
        <View style={styles.favHeader}>
          <View
            style={[
              styles.favIcon,
              { backgroundColor: item.bgColor, borderColor: item.iconColor },
            ]}
          >
            <Text
              style={[
                styles.favIconText,
                { color: item.id === 'xrp' ? t.ink : item.iconColor },
              ]}
            >
              {item.iconText}
            </Text>
          </View>
          <View style={styles.favMeta}>
            <Text style={[styles.favName, { color: t.ink }]} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={[styles.favSymbol, { color: t.inkMute }]}>
              {item.symbol}
            </Text>
          </View>
        </View>

        <Sparkline points={item.points} color={tint} />

        <View style={styles.favFooter}>
          <Text style={[styles.favBalance, { color: t.ink }]}>
            {item.balance}
          </Text>
          <Text style={[styles.favChange, { color: tint }]}>{item.change}</Text>
        </View>
      </View>
    </SoftCard>
  );
};

const PortfolioRow: React.FC<{
  item: (typeof MOCK_CRYPTO_PORTFOLIO)[number];
  isLast: boolean;
}> = ({ item, isLast }) => {
  const { t } = useTheme();
  const tint = item.isPositive ? t.green : t.orangeDark;
  return (
    <View
      style={[
        styles.pfRow,
        { borderBottomColor: t.line },
        isLast && styles.pfRowLast,
      ]}
    >
      <View style={styles.pfInfo}>
        <View style={styles.pfHeader}>
          <Text style={[styles.pfName, { color: t.inkDim }]}>{item.name}</Text>
          <Text style={[styles.pfChange, { color: tint }]}>{item.change}</Text>
        </View>
        <View style={styles.pfAmountRow}>
          <Text style={[styles.pfAmount, { color: t.ink }]}>{item.amount}</Text>
          <Text style={[styles.pfSymbol, { color: t.inkDim }]}>
            {item.symbol}
          </Text>
        </View>
      </View>

      <View style={styles.pfSparkline}>
        <Sparkline points={item.points} color={tint} />
      </View>

      <View
        style={[
          styles.pfIcon,
          { backgroundColor: item.bgColor, borderColor: item.iconColor },
        ]}
      >
        <Text style={[styles.pfIconText, { color: item.iconColor }]}>
          {item.iconText}
        </Text>
      </View>
    </View>
  );
};

export const CryptoInvestments = () => {
  const { t } = useTheme();

  return (
    <View style={styles.container}>
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: t.inkMute }]}>FAVORITOS</Text>
      <TouchableOpacity activeOpacity={0.7}>
        <Text style={[styles.seeMore, { color: t.inkMute }]}>
          Ver todos <Text style={[styles.seeMoreArrow, { color: t.orange }]}>→</Text>
        </Text>
      </TouchableOpacity>
    </View>

    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.favoritesScroll}
    >
      {MOCK_CRYPTO_FAVORITES.map((c) => (
        <View key={c.id} style={styles.favCardWrap}>
          <FavoriteCard item={c} />
        </View>
      ))}
    </ScrollView>

    <View style={[styles.sectionHeader, styles.portfolioHeader]}>
      <Text style={[styles.sectionTitle, { color: t.inkMute }]}>PORTFOLIO</Text>
    </View>

    <SoftCard radius={radii.card} padding={0}>
      <View style={styles.pfContainer}>
        {MOCK_CRYPTO_PORTFOLIO.map((c, i) => (
          <PortfolioRow
            key={c.id}
            item={c}
            isLast={i === MOCK_CRYPTO_PORTFOLIO.length - 1}
          />
        ))}
      </View>
    </SoftCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  portfolioHeader: {
    marginTop: 18,
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
  favoritesScroll: {
    paddingRight: 24,
    gap: 10,
  },
  favCardWrap: {
    width: 152,
  },
  favCardInner: {
    padding: 12,
  },
  favHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  favIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favIconText: {
    fontFamily: fonts.sans.bold,
    fontSize: 14,
  },
  favMeta: {
    flex: 1,
  },
  favName: {
    fontFamily: fonts.sans.semibold,
    fontSize: 12,
  },
  favSymbol: {
    fontFamily: fonts.mono.medium,
    fontSize: 9,
    letterSpacing: 0.3,
    marginTop: 1,
  },
  sparklineContainer: {
    height: 28,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: 70,
    marginVertical: 12,
  },
  sparklineBar: {
    width: 3,
    borderRadius: 1.5,
  },
  favFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  favBalance: {
    fontFamily: fonts.sans.bold,
    fontSize: 14,
    letterSpacing: -0.2,
  },
  favChange: {
    fontFamily: fonts.mono.semibold,
    fontSize: 10,
    letterSpacing: 0.3,
  },

  pfContainer: {
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  pfRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  pfRowLast: {
    borderBottomWidth: 0,
  },
  pfInfo: {
    flex: 2,
  },
  pfHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 3,
  },
  pfName: {
    fontFamily: fonts.mono.medium,
    fontSize: 10,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  pfChange: {
    fontFamily: fonts.mono.semibold,
    fontSize: 10,
    letterSpacing: 0.3,
  },
  pfAmountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 5,
  },
  pfAmount: {
    fontFamily: fonts.sans.bold,
    fontSize: 15,
    letterSpacing: -0.2,
  },
  pfSymbol: {
    fontFamily: fonts.mono.medium,
    fontSize: 10,
    letterSpacing: 0.3,
  },
  pfSparkline: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pfIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pfIconText: {
    fontFamily: fonts.sans.bold,
    fontSize: 13,
  },
});
