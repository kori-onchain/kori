import React from 'react';
import {
  ColorValue,
  Dimensions,
  ImageBackground,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import { fonts, radii, ThemeTokens } from '../theme/tokens';
import { useTheme } from '../theme/ThemeProvider';
import { SoftCard } from './ds/SoftCard';
import { KoraGlyph, TicketIcon } from './ds/icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = Math.min(238, Math.round(SCREEN_WIDTH * 0.58));
const KYC_BADGE = require('../../assets/kyc_badge.png');

type NftKind = 'kora' | 'ticket' | 'badge' | 'yield';

interface NftItem {
  id: string;
  category: string;
  name: string;
  description: string;
  kind: NftKind;
  network: string;
  rarity: string;
  /** Apply the orange accent border (Founder tier and equivalents). */
  accent?: boolean;
  image?: number;
}

const HOLDINGS: NftItem[] = [
  {
    id: 'founder-0271',
    category: 'Founder',
    name: 'Kora #0271',
    description: 'Acesso fundador',
    kind: 'kora',
    network: 'KORA',
    rarity: 'Genesis',
    accent: true,
  },
  {
    id: 'ticket-lolla',
    category: 'Ingresso',
    name: 'Lollapalooza',
    description: 'Ticket tokenizado',
    kind: 'ticket',
    network: 'Solana',
    rarity: 'VIP',
  },
  {
    id: 'kyc-pass',
    category: 'Badge',
    name: 'KYC Pass',
    description: 'Identidade verificada',
    kind: 'badge',
    network: 'Kora ID',
    rarity: 'Verified',
    image: KYC_BADGE,
  },
  {
    id: 'yield-key',
    category: 'Yield',
    name: 'Vault Key',
    description: 'Boost em rewards',
    kind: 'yield',
    network: 'DeFi',
    rarity: '+2.4%',
  },
];

const ArtPattern = ({ color }: { color: string }) => (
  <Svg
    pointerEvents="none"
    width="100%"
    height="100%"
    viewBox="0 0 220 132"
    style={StyleSheet.absoluteFill}
  >
    <Circle cx="184" cy="24" r="48" stroke={color} strokeOpacity={0.18} strokeWidth="1" />
    <Circle cx="36" cy="112" r="38" stroke={color} strokeOpacity={0.14} strokeWidth="1" />
    <Line x1="18" y1="24" x2="118" y2="124" stroke={color} strokeOpacity={0.12} strokeWidth="1" />
    <Line x1="118" y1="6" x2="210" y2="98" stroke={color} strokeOpacity={0.1} strokeWidth="1" />
    <Path
      d="M18 92 C58 52 90 122 136 66 C164 32 188 46 210 22"
      fill="none"
      stroke={color}
      strokeOpacity={0.13}
      strokeWidth="1.4"
    />
  </Svg>
);

const NftArt: React.FC<{ item: NftItem; t: ThemeTokens }> = ({ item, t }) => {
  const accent = item.accent ? t.orange : item.kind === 'yield' ? t.green : t.sol;
  const gradient: readonly [ColorValue, ColorValue] =
    item.kind === 'ticket'
      ? [t.sol, t.bgElev]
      : item.kind === 'yield'
        ? [t.green, t.bgElev]
        : [t.orangeDark, t.bgElev];

  const icon =
    item.kind === 'ticket' ? (
      <TicketIcon size={38} color={t.ink} strokeWidth={1.35} />
    ) : (
      <KoraGlyph size={48} color={t.ink} />
    );

  if (item.image) {
    return (
      <ImageBackground
        source={item.image}
        resizeMode="cover"
        imageStyle={styles.artImage}
        style={[styles.art, { borderColor: t.line }]}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.50)']}
          style={StyleSheet.absoluteFill}
        />
        <Text style={[styles.artBadge, { color: t.btnPrimaryFg, backgroundColor: t.btnPrimaryBg }]}>
          {item.rarity}
        </Text>
      </ImageBackground>
    );
  }

  return (
    <LinearGradient
      colors={gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.art, { borderColor: t.line }]}
    >
      <ArtPattern color={t.ink} />
      <View style={[styles.iconOrb, { backgroundColor: t.hairline, borderColor: t.line2 }]}>
        {icon}
      </View>
      <Text style={[styles.artBadge, { color: t.btnPrimaryFg, backgroundColor: t.btnPrimaryBg }]}>
        {item.rarity}
      </Text>
      <View style={[styles.glowDot, { backgroundColor: accent }]} />
    </LinearGradient>
  );
};

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

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carousel}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + 10}
      >
        {HOLDINGS.map((item) => (
          <View key={item.id} style={styles.cardWrap}>
            <SoftCard
              radius={radii.card}
              padding={0}
              strong={item.accent}
              style={item.accent ? { borderColor: t.orange } : undefined}
            >
              <View style={styles.cardInner}>
                <NftArt item={item} t={t} />
                <View style={styles.metaRow}>
                  <Text
                    style={[
                      styles.category,
                      { color: item.accent ? t.orange : t.inkMute },
                    ]}
                  >
                    {item.category.toUpperCase()}
                  </Text>
                  <Text style={[styles.network, { color: t.inkDim }]}>
                    {item.network}
                  </Text>
                </View>
                <Text style={[styles.name, { color: t.ink }]} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={[styles.description, { color: t.inkMute }]} numberOfLines={1}>
                  {item.description}
                </Text>
              </View>
            </SoftCard>
          </View>
        ))}
      </ScrollView>
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
  carousel: {
    gap: 10,
    paddingRight: 20,
  },
  cardWrap: {
    width: CARD_WIDTH,
  },
  cardInner: {
    padding: 9,
  },
  art: {
    height: 132,
    borderRadius: 11,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    overflow: 'hidden',
  },
  artImage: {
    borderRadius: 11,
  },
  iconOrb: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  artBadge: {
    position: 'absolute',
    left: 10,
    top: 10,
    borderRadius: 999,
    overflow: 'hidden',
    paddingHorizontal: 9,
    paddingVertical: 4,
    fontFamily: fonts.mono.semibold,
    fontSize: 8,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  glowDot: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  category: {
    fontFamily: fonts.mono.medium,
    fontSize: 8,
    letterSpacing: 0.7,
  },
  network: {
    fontFamily: fonts.mono.medium,
    fontSize: 8,
    letterSpacing: 0.3,
  },
  name: {
    fontFamily: fonts.sans.semibold,
    fontSize: 15,
    marginTop: 5,
    letterSpacing: -0.1,
  },
  description: {
    fontFamily: fonts.mono.regular,
    fontSize: 9,
    marginTop: 2,
    letterSpacing: 0.2,
  },
});
