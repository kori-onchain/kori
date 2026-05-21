import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { MOCK_CRYPTO_FAVORITES, MOCK_CRYPTO_PORTFOLIO } from '../data/crypto';

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
            opacity: 0.4 + (i / points.length) * 0.6,
          },
        ]}
      />
    ))}
  </View>
);

export const CryptoInvestments = () => (
  <View style={styles.container}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Favoritos</Text>
      <TouchableOpacity style={styles.seeAllButton}>
        <Text style={styles.seeAllText}>Ver todos</Text>
      </TouchableOpacity>
    </View>

    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.favoritesScroll}
    >
      {MOCK_CRYPTO_FAVORITES.map((crypto) => (
        <View key={crypto.id} style={styles.favoriteCard}>
          <View style={styles.cardHeader}>
            <View style={[styles.cryptoIconCircle, { backgroundColor: crypto.bgColor, borderColor: crypto.iconColor }]}>
              <Text style={[styles.cryptoIconText, { color: crypto.id === 'xrp' ? '#FFF' : crypto.iconColor }]}>
                {crypto.iconText}
              </Text>
            </View>
            <View style={styles.cryptoMeta}>
              <Text style={styles.cryptoName}>{crypto.name}</Text>
              <Text style={styles.cryptoSymbol}>{crypto.symbol}</Text>
            </View>
          </View>

          <Sparkline points={crypto.points} color={crypto.isPositive ? '#2E7D32' : '#C62828'} />

          <View style={styles.cardFooter}>
            <Text style={styles.balanceText}>{crypto.balance}</Text>
            <View style={[styles.badgePill, { backgroundColor: crypto.isPositive ? 'rgba(46, 125, 50, 0.1)' : 'rgba(198, 40, 40, 0.1)' }]}>
              <Feather
                name={crypto.isPositive ? 'trending-up' : 'trending-down'}
                size={12}
                color={crypto.isPositive ? '#4CAF50' : '#FF5252'}
                style={styles.pillIcon}
              />
              <Text style={[styles.badgeText, { color: crypto.isPositive ? '#4CAF50' : '#FF5252' }]}>
                {crypto.change}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>

    <View style={[styles.sectionHeader, { marginTop: 12 }]}>
      <Text style={styles.sectionTitle}>Portfólio</Text>
      <TouchableOpacity>
        <Feather name="sliders" size={18} color={COLORS.textSecondary} />
      </TouchableOpacity>
    </View>

    <View style={styles.portfolioContainer}>
      {MOCK_CRYPTO_PORTFOLIO.map((crypto, idx) => (
        <View
          key={crypto.id}
          style={[
            styles.portfolioRow,
            idx === MOCK_CRYPTO_PORTFOLIO.length - 1 && { borderBottomWidth: 0 },
          ]}
        >
          <View style={styles.portfolioInfo}>
            <View style={styles.portfolioMetaRow}>
              <Text style={styles.portfolioCryptoName}>{crypto.name}</Text>
              <View style={styles.portfolioBadge}>
                <Feather
                  name={crypto.isPositive ? 'arrow-up-right' : 'arrow-down-left'}
                  size={11}
                  color={crypto.isPositive ? '#4CAF50' : '#FF5252'}
                />
                <Text style={[styles.portfolioChangeText, { color: crypto.isPositive ? '#4CAF50' : '#FF5252' }]}>
                  {crypto.change}
                </Text>
              </View>
            </View>
            <View style={styles.amountContainer}>
              <Text style={styles.portfolioAmount}>{crypto.amount}</Text>
              <Text style={styles.portfolioSymbol}>{crypto.symbol}</Text>
              <Feather
                name={crypto.isPositive ? 'arrow-up' : 'arrow-down'}
                size={12}
                color={crypto.isPositive ? '#4CAF50' : '#FF5252'}
                style={{ marginLeft: 4 }}
              />
            </View>
          </View>

          <View style={styles.portfolioSparklineContainer}>
            <Sparkline points={crypto.points} color={crypto.isPositive ? '#2E7D32' : '#C62828'} />
          </View>

          <View style={[styles.cryptoIconCircle, { backgroundColor: crypto.bgColor, borderColor: crypto.iconColor }]}>
            <Text style={[styles.cryptoIconText, { color: crypto.iconColor }]}>
              {crypto.iconText}
            </Text>
          </View>
        </View>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '900',
  },
  seeAllButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  seeAllText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  favoritesScroll: {
    paddingRight: 24,
    gap: 16,
    marginBottom: 16,
  },
  favoriteCard: {
    width: 160,
    backgroundColor: '#161616',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 16,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cryptoIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cryptoIconText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cryptoMeta: {
    flex: 1,
  },
  cryptoName: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  cryptoSymbol: {
    color: '#666',
    fontSize: 10,
    fontWeight: '700',
  },
  sparklineContainer: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: 70,
    marginVertical: 14,
  },
  sparklineBar: {
    width: 3,
    borderRadius: 1.5,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '900',
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 12,
  },
  pillIcon: {
    marginRight: 2,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  portfolioContainer: {
    backgroundColor: '#161616',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  portfolioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  portfolioInfo: {
    flex: 2,
  },
  portfolioMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  portfolioCryptoName: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '600',
  },
  portfolioBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  portfolioChangeText: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 2,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  portfolioAmount: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '900',
    marginRight: 4,
  },
  portfolioSymbol: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  portfolioSparklineContainer: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
