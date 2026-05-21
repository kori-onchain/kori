import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, fonts, radii } from '../theme/tokens';
import { MOCK_CARDS } from '../data/cards';
import { MOCK_TRANSACTIONS, Transaction } from '../data/transactions';
import { Card } from '../data/cards';
import { SoftCard } from './ds/SoftCard';
import { ArrowRightIcon, CardIcon, InvestIcon } from './ds/icons';
import Svg, { Path } from 'react-native-svg';

const PREVIEW_COUNT = 4;

const EyeOffIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 14,
  color = colors.inkDim,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 3 L21 21 M10.5 6.3 A9 9 0 0 1 21 12 A9 9 0 0 1 17 16.5 M6.5 7.5 A9 9 0 0 0 3 12 A9 9 0 0 0 12 18 C13.6 18 15 17.7 16 17.2"
      stroke={color}
      strokeWidth={1.7}
      strokeLinecap="round"
    />
    <Path
      d="M9.5 9.5 A3 3 0 0 0 14.5 14.5"
      stroke={color}
      strokeWidth={1.7}
      strokeLinecap="round"
    />
  </Svg>
);

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
  </View>
);

const pickRowIcon = (item: Transaction): React.ReactNode => {
  if (item.isAnonymous) {
    return <EyeOffIcon size={14} color={colors.inkDim} />;
  }
  if (item.isAvatar && item.initials) {
    return <Text style={styles.rowInitials}>{item.initials}</Text>;
  }
  // fallback "type" icons — simple visual cues
  if (/yield/i.test(item.title)) {
    return <InvestIcon size={14} color={colors.ink} strokeWidth={1.7} />;
  }
  if (/cart/i.test(item.title) || /padaria|mercado/i.test(item.title)) {
    return <CardIcon size={14} color={colors.ink} strokeWidth={1.7} />;
  }
  return <ArrowRightIcon size={14} color={colors.ink} strokeWidth={1.7} />;
};

interface TransactionsProps {
  onSeeAll?: () => void;
}

const Row: React.FC<{ item: Transaction; isLast: boolean }> = ({
  item,
  isLast,
}) => {
  const card = item.cardId ? MOCK_CARDS.find((c) => c.id === item.cardId) : undefined;
  const isIncoming = item.amount.trim().startsWith('+');

  return (
    <View style={[styles.row, isLast && styles.rowLast]}>
      <View style={styles.info}>
        <View style={styles.iconWrap}>
          <SoftCard radius={8} padding={0} flat>
            <View style={styles.iconInner}>{pickRowIcon(item)}</View>
          </SoftCard>
          {card && (
            <View style={styles.cardBadgeContainer}>
              <CardBadge card={card} />
            </View>
          )}
        </View>

        <View style={styles.text}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.sub} numberOfLines={1}>
            {item.type}
          </Text>
        </View>
      </View>

      <View style={styles.amounts}>
        <Text style={[styles.amount, isIncoming && styles.amountIn]}>
          {item.amount}
        </Text>
        <Text style={styles.subAmount}>{item.subAmount}</Text>
      </View>
    </View>
  );
};

export const Transactions: React.FC<TransactionsProps> = ({ onSeeAll }) => {
  const items = MOCK_TRANSACTIONS.slice(0, PREVIEW_COUNT);

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>HOJE · {items.length} MOVS</Text>
        <TouchableOpacity onPress={onSeeAll} activeOpacity={0.7}>
          <Text style={styles.seeMoreText}>
            Ver tudo <Text style={styles.seeMoreArrow}>→</Text>
          </Text>
        </TouchableOpacity>
      </View>

      {items.map((item, i) => (
        <Row key={item.id} item={item} isLast={i === items.length - 1} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 6,
  },
  sectionTitle: {
    color: colors.inkMute,
    fontFamily: fonts.mono.medium,
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  seeMoreText: {
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

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconWrap: {
    position: 'relative',
    width: 32,
    height: 32,
  },
  iconInner: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.cardSm,
  },
  rowInitials: {
    fontFamily: fonts.sans.semibold,
    color: colors.ink,
    fontSize: 11,
    letterSpacing: 0.3,
  },
  cardBadgeContainer: {
    position: 'absolute',
    bottom: -3,
    right: -4,
  },
  cardBadge: {
    width: 20,
    height: 13,
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

  text: {
    flex: 1,
    gap: 2,
  },
  title: {
    color: colors.ink,
    fontFamily: fonts.sans.medium,
    fontSize: 13,
  },
  sub: {
    color: colors.inkMute,
    fontFamily: fonts.mono.regular,
    fontSize: 10,
    letterSpacing: 0.3,
  },
  amounts: {
    alignItems: 'flex-end',
    gap: 2,
  },
  amount: {
    color: colors.ink,
    fontFamily: fonts.mono.semibold,
    fontSize: 12,
    letterSpacing: 0.2,
  },
  amountIn: {
    color: colors.green,
  },
  subAmount: {
    color: colors.inkMute,
    fontFamily: fonts.mono.regular,
    fontSize: 9,
    letterSpacing: 0.3,
  },
});
