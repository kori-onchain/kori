import React, { useRef, useState } from "react";
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
} from "react-native";
import { fonts, radii } from "@theme/tokens";
import { useTheme } from "@theme/ThemeProvider";
import { SoftCard } from "@components/layout/SoftCard";
import { Button } from "@components/layout/Button";
import { GiftIcon } from "@components/layout/icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const BANNER_WIDTH = SCREEN_WIDTH - 48;

interface BannerShellProps {
  badgeLabel: string;
  badgeTone?: "neutral" | "reward";
  title: string;
  subtitle: string;
  cta: string;
  ctaVariant?: "white" | "outlineOrange";
  onPress?: () => void;
  decoration?: React.ReactNode;
}

const BannerShell: React.FC<BannerShellProps> = ({
  badgeLabel,
  badgeTone = "neutral",
  title,
  subtitle,
  cta,
  ctaVariant = "white",
  onPress,
  decoration,
}) => {
  const { t } = useTheme();

  return (
    <View style={styles.bannerOuter}>
      <SoftCard radius={radii.card} padding={0}>
        <View style={styles.bannerInner}>
          <View style={styles.content}>
            <View
              style={[
                styles.badge,
                { backgroundColor: t.line2 },
                badgeTone === "reward" && {
                  backgroundColor: `${t.orange}29`,
                },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  { color: t.ink },
                  badgeTone === "reward" && { color: t.orange },
                ]}
              >
                {badgeLabel}
              </Text>
            </View>

            <Text style={[styles.title, { color: t.ink }]}>{title}</Text>
            <Text style={[styles.subtitle, { color: t.inkDim }]}>
              {subtitle}
            </Text>

            <View style={styles.ctaWrap}>
              <Button
                label={cta}
                variant={ctaVariant === "white" ? "primary" : "ghost"}
                onPress={onPress}
                style={styles.cta}
                labelStyle={styles.ctaLabel}
              />
            </View>
          </View>

          {decoration && <View style={styles.decor}>{decoration}</View>}
        </View>
      </SoftCard>
    </View>
  );
};

const KYCBanner = ({ onPress }: { onPress?: () => void }) => (
  <BannerShell
    badgeLabel="SEGURANCA"
    badgeTone="neutral"
    title={"Verificacao de\nIdentidade"}
    subtitle="Conclua o KYC para liberar todas as funcionalidades exclusivas."
    cta="Verificar conta"
    ctaVariant="white"
    onPress={onPress}
    decoration={
      <Image
        source={require("../../assets/kyc_badge.png")}
        style={styles.kycImage}
      />
    }
  />
);

const BlackCardBanner = ({ onPress }: { onPress?: () => void }) => {
  const { t } = useTheme();
  return (
    <BannerShell
      badgeLabel="EXCLUSIVO"
      badgeTone="neutral"
      title={"Cartao\nKori Black"}
      subtitle="Cashback ilimitado, acesso a lounges e sem anuidade no 1o ano."
      cta="Solicitar agora"
      ctaVariant="white"
      onPress={onPress}
      decoration={
        <View
          style={[
            styles.cardDecor,
            {
              backgroundColor: t.bgElev,
              borderColor: t.line2,
            },
          ]}
        >
          <View
            style={[styles.cardDecorChip, { backgroundColor: t.inkDim }]}
          />
          <View
            style={[styles.cardDecorStripe, { backgroundColor: t.line2 }]}
          />
          <Text style={[styles.cardDecorLabel, { color: t.inkDim }]}>
            KORI BLACK
          </Text>
        </View>
      }
    />
  );
};

const ReferralBanner = ({ onPress }: { onPress?: () => void }) => {
  const { t } = useTheme();
  return (
    <BannerShell
      badgeLabel="RECOMPENSAS"
      badgeTone="reward"
      title={"Indique e\nGanhe +R$ 30"}
      subtitle="Ganhe R$ 30 por cada amigo indicado que abrir conta na Kori."
      cta="Indicar amigo"
      ctaVariant="white"
      onPress={onPress}
      decoration={
        <View style={styles.referralDecor}>
          <GiftIcon size={56} color={t.orange} />
        </View>
      }
    />
  );
};

interface PromoBannerProps {
  onVerify?: () => void;
  onOrderBlackCard?: () => void;
  onReferFriend?: () => void;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({
  onVerify,
  onOrderBlackCard,
  onReferFriend,
}) => {
  const { t } = useTheme();
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
        bounces={true}
        alwaysBounceHorizontal={true}
      >
        <KYCBanner onPress={onVerify} />
        <BlackCardBanner onPress={onOrderBlackCard} />
        <ReferralBanner onPress={onReferFriend} />
      </ScrollView>

      <View style={styles.dots}>
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { backgroundColor: t.inkFaint },
              activeIndex === i && [
                styles.dotActive,
                { backgroundColor: t.ink },
              ],
            ]}
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
    overflow: "hidden",
    position: "relative",
    justifyContent: "center",
  },
  content: {
    zIndex: 2,
    maxWidth: "62%",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  badgeText: {
    fontFamily: fonts.mono.semibold,
    fontSize: 9,
    letterSpacing: 1.4,
  },
  title: {
    fontFamily: fonts.sans.bold,
    fontWeight: "700",
    fontSize: 20,
    marginBottom: 6,
    lineHeight: 24,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontFamily: fonts.sans.medium,
    fontSize: 12,
    marginBottom: 14,
    lineHeight: 17,
  },
  ctaWrap: {
    alignSelf: "flex-start",
  },
  cta: {
    minHeight: 36,
    paddingVertical: 0,
    paddingHorizontal: 12,
  },
  ctaLabel: {
    fontSize: 12,
  },
  decor: {
    position: "absolute",
    right: 6,
    top: 0,
    bottom: 0,
    width: 130,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 3,
  },
  kycImage: {
    width: 110,
    height: 110,
    resizeMode: "contain",
  },
  cardDecor: {
    width: 90,
    height: 58,
    borderRadius: 10,
    borderWidth: 1,
    padding: 8,
    justifyContent: "space-between",
  },
  cardDecorChip: {
    width: 20,
    height: 14,
    borderRadius: 3,
  },
  cardDecorStripe: {
    height: 2,
    borderRadius: 1,
  },
  cardDecorLabel: {
    fontFamily: fonts.mono.semibold,
    fontSize: 7,
    letterSpacing: 1,
  },
  referralDecor: {
    alignItems: "center",
    justifyContent: "center",
  },
  referralEmoji: {
    fontSize: 56,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 18,
    height: 3,
    borderRadius: 2,
  },
});
