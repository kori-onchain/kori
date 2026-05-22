import React, { useEffect, useMemo, useState } from 'react';
import {
  Image,
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

type MarketFavorite = (typeof MOCK_CRYPTO_FAVORITES)[number] & {
  image?: string;
};

type CoinGeckoMarket = {
  id: string;
  image?: string;
  current_price?: number;
  price_change_percentage_24h?: number | null;
  sparkline_in_7d?: {
    price?: number[];
  };
};

const MARKET_IDS = MOCK_CRYPTO_FAVORITES.map((coin) => coin.coingeckoId).join(',');
const MARKET_URL =
  `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${MARKET_IDS}` +
  '&order=market_cap_desc&sparkline=true&price_change_percentage=24h';

const formatUsd = (value?: number) => {
  if (typeof value !== 'number') return null;
  if (value < 0.01) return `$${value.toFixed(6)}`;
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: value >= 100 ? 0 : 2,
  });
};

const normalizeSparkline = (prices?: number[]) => {
  if (!prices?.length) return null;

  const sample = prices.filter((_, index) => index % Math.ceil(prices.length / 12) === 0).slice(-12);
  const min = Math.min(...sample);
  const max = Math.max(...sample);
  const range = max - min || 1;

  return sample.map((price) => Math.round(24 + ((price - min) / range) * 76));
};

const useFavoriteMarkets = () => {
  const [items, setItems] = useState<MarketFavorite[]>(MOCK_CRYPTO_FAVORITES);

  useEffect(() => {
    let active = true;

    fetch(MARKET_URL)
      .then((response) => {
        if (!response.ok) throw new Error('market request failed');
        return response.json() as Promise<CoinGeckoMarket[]>;
      })
      .then((markets) => {
        if (!active) return;
        const byId = new Map(markets.map((market) => [market.id, market]));

        setItems(
          MOCK_CRYPTO_FAVORITES.map((item) => {
            const market = byId.get(item.coingeckoId);
            const change = market?.price_change_percentage_24h ?? null;
            const points = normalizeSparkline(market?.sparkline_in_7d?.price);

            return {
              ...item,
              image: market?.image ?? item.image,
              balance: formatUsd(market?.current_price) ?? item.balance,
              change:
                typeof change === 'number'
                  ? `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`
                  : item.change,
              isPositive:
                typeof change === 'number'
                  ? change >= 0
                  : item.isPositive,
              points: points ?? item.points,
            };
          }),
        );
      })
      .catch(() => {
        if (active) setItems(MOCK_CRYPTO_FAVORITES);
      });

    return () => {
      active = false;
    };
  }, []);

  return items;
};

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
            flex: 1,
          },
        ]}
      />
    ))}
  </View>
);

const FavoriteCard: React.FC<{
  item: MarketFavorite;
}> = ({ item }) => {
  const { t } = useTheme();
  const tint = item.isPositive ? t.green : t.orangeDark;
  return (
    <SoftCard radius={radii.cardSm} padding={0} flat>
      <View style={styles.favCardInner}>
        <View style={styles.favHeader}>
          <View
            style={[
              styles.favIcon,
              { backgroundColor: t.bgElev, borderColor: t.cardBorder },
            ]}
          >
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.favIconImage} />
            ) : (
              <Text
                style={[
                  styles.favIconText,
                  { color: item.id === 'xrp' ? t.ink : item.iconColor },
                ]}
              >
                {item.iconText}
              </Text>
            )}
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

        <View style={[styles.sparklineShell, { backgroundColor: t.bgElev }]}>
          <Sparkline points={item.points} color={tint} />
        </View>

        <View style={styles.favFooter}>
          <Text style={[styles.favBalance, { color: t.ink }]}>
            {item.balance}
          </Text>
          <Text style={[styles.favChange, { color: tint, backgroundColor: t.bgElev }]}>
            {item.change}
          </Text>
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
  const favorites = useFavoriteMarkets();
  const favoritesCount = useMemo(() => favorites.length, [favorites.length]);

  return (
    <View style={styles.container}>
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: t.inkMute }]}>FAVORITOS</Text>
      <TouchableOpacity activeOpacity={0.7}>
        <Text style={[styles.seeMore, { color: t.inkMute }]}>
          {favoritesCount} ativos <Text style={[styles.seeMoreArrow, { color: t.orange }]}>→</Text>
        </Text>
      </TouchableOpacity>
    </View>

    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.favoritesScroll}
    >
      {favorites.map((c) => (
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
    gap: 8,
  },
  favCardWrap: {
    width: 138,
  },
  favCardInner: {
    padding: 10,
  },
  favHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  favIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  favIconImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
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
    height: 30,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 2,
    width: '100%',
  },
  sparklineShell: {
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 6,
    marginVertical: 10,
  },
  sparklineBar: {
    borderRadius: 1.5,
    minWidth: 3,
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
    borderRadius: 999,
    overflow: 'hidden',
    paddingHorizontal: 6,
    paddingVertical: 3,
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
