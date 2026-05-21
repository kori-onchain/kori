import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { MOCK_CARDS } from '../data/cards';
import { MOCK_TRANSACTIONS } from '../data/transactions';
import { Transaction } from '../data/transactions';
import { Card } from '../data/cards';

// Miniatura do cartão usada como badge
const CardBadge: React.FC<{ card: Card }> = ({ card }) => (
  <View style={[styles.cardBadge, { backgroundColor: card.cardBg }]}>
    <View style={styles.badgeChip} />
    {card.network === 'mastercard' ? (
      <View style={styles.badgeMcWrapper}>
        <View style={[styles.badgeMcCircle, { backgroundColor: '#EB001B', left: 0 }]} />
        <View style={[styles.badgeMcCircle, { backgroundColor: '#F79E1B', right: 0 }]} />
      </View>
    ) : (
      <Text style={[styles.badgeVisa, { color: card.accentColor }]}>VISA</Text>
    )}
    <View style={styles.badgeGloss} />
  </View>
);

const TransactionRow: React.FC<{ item: Transaction; isLast: boolean }> = ({ item, isLast }) => {
  const card = item.cardId ? MOCK_CARDS.find((c) => c.id === item.cardId) : undefined;

  return (
    <>
      <TouchableOpacity style={styles.txItem} activeOpacity={0.75}>
        {/* Avatar / ícone com badge do cartão */}
        <View style={styles.txIcon}>
          {item.isAnonymous ? (
            <View style={styles.avatarWrapper}>
              <View style={[styles.avatar, { backgroundColor: '#1E1E1E' }]}>
                <Feather name="eye-off" size={16} color="#8E8E93" />
              </View>
            </View>
          ) : item.isAvatar ? (
            <View style={styles.avatarWrapper}>
              <View
                style={[
                  styles.avatar,
                  { backgroundColor: item.amount.startsWith('+') ? '#1B3D2A' : '#2A2040' },
                ]}
              >
                <Text
                  style={[
                    styles.avatarText,
                    { color: item.amount.startsWith('+') ? '#34C759' : '#9B8BFF' },
                  ]}
                >
                  {item.initials || 'TR'}
                </Text>
              </View>
              {card && (
                <View style={styles.cardBadgeContainer}>
                  <CardBadge card={card} />
                </View>
              )}
            </View>
          ) : (
            <View style={styles.avatarWrapper}>
              <View style={styles.actionIcon}>
                <Feather name="repeat" size={16} color={COLORS.textSecondary} />
              </View>
              {card && (
                <View style={styles.cardBadgeContainer}>
                  <CardBadge card={card} />
                </View>
              )}
            </View>
          )}
        </View>

        <View style={styles.txDetails}>
          <Text style={styles.txItemTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.txItemType}>{item.type}</Text>
        </View>

        <View style={styles.txAmounts}>
          <Text style={[styles.txAmount, { color: item.amountColor }]}>{item.amount}</Text>
          <Text style={[styles.txSubAmount, { color: item.subAmountColor }]}>{item.subAmount}</Text>
        </View>
      </TouchableOpacity>
      {!isLast && <View style={styles.rowDivider} />}
    </>
  );
};

interface TransactionsProps {
  onSeeAll?: () => void;
}

const PREVIEW_COUNT = 4;

export const Transactions: React.FC<TransactionsProps> = ({ onSeeAll }) => (
  <View style={styles.wrapper}>
    <View style={styles.section}>
      <View style={styles.txHeader}>
        <Text style={styles.txTitle}>Transações</Text>
        <TouchableOpacity style={styles.showAllBtn} onPress={onSeeAll} activeOpacity={0.7}>
          <Text style={styles.showAllText}>Show All</Text>
          <Feather name="chevron-right" size={16} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.txList}>
        {MOCK_TRANSACTIONS.slice(0, PREVIEW_COUNT).map((item, i) => (
          <TransactionRow key={item.id} item={item} isLast={i === PREVIEW_COUNT - 1} />
        ))}
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#161616',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#242424',
    marginTop: 8,
    marginBottom: 32,
    overflow: 'hidden',
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#1F1F1F',
    marginVertical: 2,
  },
  txHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  txTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '700',
  },
  showAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  showAllText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  txList: {
    paddingBottom: 4,
  },
  txItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  txIcon: {},

  // wrapper relativo para o badge do cartão
  avatarWrapper: {
    position: 'relative',
    width: 42,
    height: 42,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontWeight: '700',
    fontSize: 13,
  },
  actionIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#1E1E1E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },

  // Posicionamento do badge no canto inferior direito
  cardBadgeContainer: {
    position: 'absolute',
    bottom: -4,
    right: -6,
  },
  cardBadge: {
    width: 22,
    height: 14,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 2,
  },
  badgeChip: {
    position: 'absolute',
    top: 2,
    left: 2,
    width: 4,
    height: 3,
    backgroundColor: '#D4AF37',
    borderRadius: 1,
    opacity: 0.85,
  },
  badgeMcWrapper: {
    width: 9,
    height: 6,
    position: 'relative',
  },
  badgeMcCircle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0.93,
  },
  badgeVisa: {
    fontSize: 4,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  badgeGloss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },

  txDetails: {
    flex: 1,
    gap: 3,
  },
  txItemTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  txItemType: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  txAmounts: {
    alignItems: 'flex-end',
    gap: 3,
  },
  txAmount: {
    fontSize: 14,
    fontWeight: '700',
  },
  txSubAmount: {
    fontSize: 12,
    fontWeight: '500',
  },
});
