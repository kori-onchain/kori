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

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_WIDTH = SCREEN_WIDTH - 48;

const KYCBanner = () => (
  <View style={[styles.banner, styles.kycBanner]}>
    <View style={styles.content}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>SEGURANÇA</Text>
      </View>
      <Text style={styles.title}>Verificação de{'\n'}Identidade</Text>
      <Text style={styles.subtitle}>
        Conclua o KYC para liberar todas as funcionalidades exclusivas.
      </Text>
      <TouchableOpacity style={styles.buttonWhite}>
        <Text style={styles.buttonTextDark}>Verificar conta</Text>
      </TouchableOpacity>
    </View>

    <Image source={require('../../assets/kyc_badge.png')} style={styles.kycImage} />
    <View style={[styles.circle, { top: -50, right: -30, width: 160, height: 160 }]} />
    <View style={[styles.circle, { bottom: -30, right: 60, width: 90, height: 90, opacity: 0.07 }]} />
  </View>
);

const BlackCardBanner = () => (
  <View style={[styles.banner, styles.blackCardBanner]}>
    <View style={styles.content}>
      <View style={[styles.badge, styles.goldBadge]}>
        <Text style={[styles.badgeText, styles.goldBadgeText]}>EXCLUSIVO</Text>
      </View>
      <Text style={styles.title}>Cartão{'\n'}Kora Black</Text>
      <Text style={styles.subtitle}>
        Cashback ilimitado, acesso a lounges e sem anuidade no 1º ano.
      </Text>
      <TouchableOpacity style={styles.buttonGold}>
        <Text style={styles.buttonTextDark}>Solicitar agora</Text>
      </TouchableOpacity>
    </View>

    <View style={styles.cardDecor}>
      <View style={styles.cardDecorChip} />
      <View style={styles.cardDecorStripe} />
      <Text style={styles.cardDecorLabel}>KORA BLACK</Text>
    </View>

    <View style={[styles.circle, { top: -40, right: -20, width: 140, height: 140, backgroundColor: 'rgba(212,175,55,0.08)' }]} />
    <View style={[styles.circle, { bottom: -20, left: -20, width: 100, height: 100, backgroundColor: 'rgba(212,175,55,0.05)' }]} />
  </View>
);

const ReferralBanner = () => (
  <View style={[styles.banner, styles.referralBanner]}>
    <View style={styles.content}>
      <View style={[styles.badge, styles.purpleBadge]}>
        <Text style={styles.badgeText}>RECOMPENSAS</Text>
      </View>
      <Text style={styles.title}>Indique e{'\n'}Ganhe</Text>
      <Text style={styles.subtitle}>
        Ganhe R$ 30 por cada amigo indicado que abrir conta na Kora.
      </Text>
      <TouchableOpacity style={styles.buttonPurple}>
        <Text style={styles.buttonTextWhite}>Indicar amigo</Text>
      </TouchableOpacity>
    </View>

    <View style={styles.referralDecor}>
      <Text style={styles.referralEmoji}>🎁</Text>
      <View style={styles.referralCoins}>
        <View style={[styles.coin, { bottom: 24, right: 0 }]} />
        <View style={[styles.coin, { bottom: 8, right: 18, width: 22, height: 22, borderRadius: 11 }]} />
        <View style={[styles.coin, { bottom: 0, right: 4, width: 16, height: 16, borderRadius: 8, opacity: 0.5 }]} />
      </View>
    </View>

    <View style={[styles.circle, { top: -50, right: -30, width: 160, height: 160, backgroundColor: 'rgba(139,92,246,0.08)' }]} />
    <View style={[styles.circle, { bottom: -20, right: 60, width: 80, height: 80, backgroundColor: 'rgba(139,92,246,0.06)' }]} />
  </View>
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
          <View key={i} style={[styles.dot, activeIndex === i && styles.dotActive]} />
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
  banner: {
    width: BANNER_WIDTH,
    minHeight: 168,
    borderRadius: 16,
    padding: 20,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    justifyContent: 'center',
  },
  kycBanner: {
    backgroundColor: '#1E1E1E',
    borderColor: '#333',
  },
  blackCardBanner: {
    backgroundColor: '#111009',
    borderColor: '#3A3000',
  },
  referralBanner: {
    backgroundColor: '#12101A',
    borderColor: '#2D1F4E',
  },
  content: {
    zIndex: 2,
    maxWidth: '62%',
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  goldBadge: {
    backgroundColor: 'rgba(212,175,55,0.15)',
  },
  goldBadgeText: {
    color: '#D4AF37',
  },
  purpleBadge: {
    backgroundColor: 'rgba(139,92,246,0.2)',
  },
  title: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 6,
    lineHeight: 24,
  },
  subtitle: {
    color: '#A0A0A0',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 14,
    lineHeight: 17,
  },
  buttonWhite: {
    backgroundColor: '#FFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  buttonGold: {
    backgroundColor: '#D4AF37',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  buttonPurple: {
    backgroundColor: '#7C3AED',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  buttonTextDark: {
    color: '#000',
    fontWeight: '700',
    fontSize: 12,
  },
  buttonTextWhite: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 12,
  },
  kycImage: {
    position: 'absolute',
    right: 6,
    bottom: 0,
    width: 110,
    height: 110,
    zIndex: 3,
    resizeMode: 'contain',
  },
  cardDecor: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -44,
    width: 90,
    height: 58,
    backgroundColor: '#1C1800',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    zIndex: 3,
    padding: 8,
    justifyContent: 'space-between',
  },
  cardDecorChip: {
    width: 20,
    height: 14,
    backgroundColor: '#D4AF37',
    borderRadius: 3,
    opacity: 0.9,
  },
  cardDecorStripe: {
    height: 2,
    backgroundColor: 'rgba(212,175,55,0.3)',
    borderRadius: 1,
  },
  cardDecorLabel: {
    color: '#D4AF37',
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 1,
  },
  referralDecor: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -40,
    width: 90,
    height: 80,
    zIndex: 3,
    alignItems: 'center',
  },
  referralEmoji: {
    fontSize: 52,
  },
  referralCoins: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 50,
    height: 40,
  },
  coin: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#8B5CF6',
    borderWidth: 2,
    borderColor: '#A78BFA',
    opacity: 0.8,
  },
  circle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.04)',
    zIndex: 1,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#333',
  },
  dotActive: {
    width: 18,
    backgroundColor: '#FFF',
  },
});
