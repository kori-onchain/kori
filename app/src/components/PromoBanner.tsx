import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { colors, fonts, radii } from '../theme/tokens';
import { SoftCard } from './ds/SoftCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_WIDTH = SCREEN_WIDTH - 48;

interface BannerShellProps {
  badgeLabel: string;
  badgeTone?: 'neutral' | 'reward';
  title: string;
  subtitle: string;
  cta: string;
  ctaVariant?: 'white' | 'outlineOrange';
  onPress?: () => void;
  decoration?: React.ReactNode;
}

const BannerShell: React.FC<BannerShellProps> = ({
  badgeLabel,
  badgeTone = 'neutral',
  title,
  subtitle,
  cta,
  ctaVariant = 'white',
  onPress,
  decoration,
}) => (
  <View style={styles.bannerOuter}>
    <SoftCard radius={radii.card} padding={0}>
      <View style={styles.bannerInner}>
        <View style={styles.content}>
          <View
            style={[
              styles.badge,
              badgeTone === 'reward' && styles.badgeReward,
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                badgeTone === 'reward' && styles.badgeTextReward,
              ]}
            >
              {badgeLabel}
            </Text>
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onPress}
            style={[
              styles.cta,
              ctaVariant === 'white' && styles.ctaWhite,
              ctaVariant === 'outlineOrange' && styles.ctaOutlineOrange,
            ]}
          >
            <Text
              style={[
                styles.ctaText,
                ctaVariant === 'white' && styles.ctaTextDark,
                ctaVariant === 'outlineOrange' && styles.ctaTextOrange,
              ]}
            >
              {cta}
            </Text>
          </TouchableOpacity>
        </View>

        {decoration && <View style={styles.decor}>{decoration}</View>}
      </View>
    </SoftCard>
  </View>
);

const KYCBanner = () => (
  <BannerShell
    badgeLabel="SEGURANCA"
    badgeTone="neutral"
    title={'Verificacao de\nIdentidade'}
    subtitle="Conclua o KYC para liberar todas as funcionalidades exclusivas."
    cta="Verificar conta"
    ctaVariant="white"
    decoration={
      <Image
        source={require('../../assets/kyc_badge.png')}
        style={styles.kycImage}
      />
    }
  />
);

const BlackCardBanner = () => (
  <BannerShell
    badgeLabel="EXCLUSIVO"
    badgeTone="neutral"
    title={'Cartao\nKora Black'}
    subtitle="Cashback ilimitado, acesso a lounges e sem anuidade no 1o ano."
    cta="Solicitar agora"
    ctaVariant="white"
    decoration={
      <View style={styles.cardDecor}>
        <View style={styles.cardDecorChip} />
        <View style={styles.cardDecorStripe} />
        <Text style={styles.cardDecorLabel}>KORA BLACK</Text>
      </View>
    }
  />
);

const ReferralBanner = () => (
  <BannerShell
    badgeLabel="RECOMPENSAS"
    badgeTone="reward"
    title={'Indique e\nGanhe +R$ 30'}
    subtitle="Ganhe R$ 30 por cada amigo indicado que abrir conta na Kora."
    cta="Indicar amigo"
    ctaVariant="white"
    decoration={
      <View style={styles.referralDecor}>
        <Text style={styles.referralEmoji}>🎁</Text>
      </View>
    }
  />
);

export const PromoBanner = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / BANNER_WIDTH);
    setActiveIndex(idx);
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={BANNER_WIDTH}
        snapToAlignment="start"
        contentContainerStyle={styles.scrollContent}
      >
        <KYCBanner />
        <BlackCardBanner />
        <ReferralBanner />
      </ScrollView>

      <View style={styles.dots}>
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            style={[styles.dot, activeIndex === i && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 24,
  },
  scrollContent: {
    gap: 0,
  },
  bannerOuter: {
    width: BANNER_WIDTH,
  },
  bannerInner: {
    minHeight: 168,
    padding: 20,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
  },
  content: {
    zIndex: 2,
    maxWidth: '62%',
  },
  badge: {
    backgroundColor: colors.line2,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  badgeText: {
    color: colors.ink,
    fontFamily: fonts.mono.semibold,
    fontSize: 9,
    letterSpacing: 1.4,
  },
  badgeReward: {
    backgroundColor: 'rgba(255,107,61,0.16)',
  },
  badgeTextReward: {
    color: colors.orange,
  },
  title: {
    color: colors.ink,
    fontFamily: fonts.sans.bold,
    fontWeight: '700',
    fontSize: 20,
    marginBottom: 6,
    lineHeight: 24,
    letterSpacing: -0.4,
  },
  subtitle: {
    color: colors.inkDim,
    fontFamily: fonts.sans.medium,
    fontSize: 12,
    marginBottom: 14,
    lineHeight: 17,
  },
  cta: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: radii.btn,
    alignSelf: 'flex-start',
  },
  ctaWhite: {
    backgroundColor: colors.ink,
  },
  ctaOutlineOrange: {
    borderWidth: 1,
    borderColor: colors.orange,
    backgroundColor: 'transparent',
  },
  ctaText: {
    fontFamily: fonts.sans.semibold,
    fontWeight: '600',
    fontSize: 12,
  },
  ctaTextDark: {
    color: colors.bg,
  },
  ctaTextOrange: {
    color: colors.orange,
  },
  decor: {
    position: 'absolute',
    right: 6,
    top: 0,
    bottom: 0,
    width: 130,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  kycImage: {
    width: 110,
    height: 110,
    resizeMode: 'contain',
  },
  cardDecor: {
    width: 90,
    height: 58,
    backgroundColor: colors.bgElev,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.line2,
    padding: 8,
    justifyContent: 'space-between',
  },
  cardDecorChip: {
    width: 20,
    height: 14,
    backgroundColor: colors.inkDim,
    borderRadius: 3,
  },
  cardDecorStripe: {
    height: 2,
    backgroundColor: colors.line2,
    borderRadius: 1,
  },
  cardDecorLabel: {
    color: colors.inkDim,
    fontFamily: fonts.mono.semibold,
    fontSize: 7,
    letterSpacing: 1,
  },
  referralDecor: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  referralEmoji: {
    fontSize: 56,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.inkFaint,
  },
  dotActive: {
    width: 18,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.ink,
  },
});
