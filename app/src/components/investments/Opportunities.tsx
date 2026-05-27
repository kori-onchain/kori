import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from "react-native";
import { Feather } from "@/icons";
import { useTheme } from "@theme/ThemeProvider";
import { fonts, radii } from "@theme/tokens";
import { BuildingIcon, BriefcaseIcon, BanknoteIcon, MoneyBagIcon, TrendUpIcon } from "@components/layout/icons";
import { LinearGradient } from "expo-linear-gradient";
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgGrad,
  Stop,
  Circle,
} from "react-native-svg";

const { width: SCREEN_W } = Dimensions.get("window");
const CARD_W = SCREEN_W - 40;
const SNAP_INTERVAL = CARD_W + 12;

export const Opportunities: React.FC = () => {
  const { t } = useTheme();
  const [activeSlide, setActiveSlide] = useState(0);

  const handleScroll = (event: any) => {
    const scrollOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollOffset / SNAP_INTERVAL);
    if (index !== activeSlide) {
      setActiveSlide(index);
    }
  };

  return (
    <View style={styles.container}>
      {/* Section Title */}
      <Text style={[styles.sectionTitle, { color: t.ink }]}>Oportunidades</Text>

      {/* Horizontal Carousel (Paging snap scroll) */}
      <ScrollView
        horizontal
        pagingEnabled={false}
        snapToInterval={SNAP_INTERVAL}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.carouselContainer}
        style={styles.carouselScrollView}
      >
        {/* Slide 1: CDBs de 105% (Portuguese & Cash theme) */}
        <View style={[styles.card, { backgroundColor: t.bg2 || t.bgElev, borderColor: t.cardBorder }]}>
          <View style={styles.inner}>
            {/* Left copy section */}
            <View style={styles.leftContent}>
              <View style={[styles.badge, { backgroundColor: `${t.green}1F` }]}>
                <Text style={[styles.badgeText, { color: t.green }]}>
                  Rendimento Fixo!
                </Text>
              </View>
              <Text style={[styles.cardTitle, { color: t.ink }]}>
                CDBs de 105%
              </Text>
              <Text style={[styles.cardSubtitle, { color: t.inkDim }]}>
                Aproveite rentabilidade de 105% do CDI com liquidez diária.
              </Text>
            </View>

            {/* Right SVG visual illustration (CDB Golden Coin Progress) */}
            <View style={styles.rightContent}>
              <Svg width={120} height={104} viewBox="0 0 120 96">
                <Defs>
                  {/* Gold coin gradient */}
                  <SvgGrad id="goldCoinGrad" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0%" stopColor={t.orange} stopOpacity="0.6" />
                    <Stop offset="100%" stopColor={t.orange} stopOpacity="1" />
                  </SvgGrad>
                  <SvgGrad id="bgGlow" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0%" stopColor={t.orange} stopOpacity="0.08" />
                    <Stop offset="100%" stopColor={t.sol} stopOpacity="0.02" />
                  </SvgGrad>
                </Defs>

                {/* Muted glow background circle */}
                <Circle cx="76" cy="54" r="32" fill="url(#bgGlow)" />

                {/* Rotation / circular progress rings */}
                <Path
                  d="M 52,24 A 36,36 0 0,1 100,54"
                  fill="none"
                  stroke={t.orange}
                  strokeWidth="4"
                  strokeLinecap="round"
                  opacity="0.85"
                />
                <Path
                  d="M 100,54 A 36,36 0 0,1 70,88"
                  fill="none"
                  stroke={t.inkFaint}
                  strokeWidth="4"
                  strokeLinecap="round"
                  opacity="0.3"
                />

                {/* Curved arrows on rings */}
                <Path
                  d="M 100,54 L 97,48 M 100,54 L 105,49"
                  stroke={t.orange}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />

                {/* 3D Golden Coin at Center */}
                <Circle cx="76" cy="52" r="20" fill="url(#goldCoinGrad)" />
                <Circle cx="76" cy="52" r="16" fill="none" stroke={t.orangeDark} strokeWidth="1.5" />
                <Text x="76" y="58" fontSize="20" fontWeight="bold" fill={t.bg} textAnchor="middle">$</Text>

                {/* Green staking badge in circle */}
                <Circle cx="38" cy="38" r="14" fill={t.green} />
                <Circle cx="38" cy="38" r="6" fill="none" stroke={t.bg} strokeWidth="2" />
                <Path d="M 32,41 L 44,41" stroke={t.bg} strokeWidth="2" strokeLinecap="round" />
              </Svg>
            </View>
          </View>
        </View>

        {/* Slide 2: Renda Variável (Portuguese & Growth theme) */}
        <View style={[styles.card, { backgroundColor: t.bg2 || t.bgElev, borderColor: t.cardBorder }]}>
          <View style={styles.inner}>
            {/* Left copy section */}
            <View style={styles.leftContent}>
              <View style={[styles.badge, { backgroundColor: `${t.green}1F` }]}>
                <Text style={[styles.badgeText, { color: t.green }]}>
                  Oportunidade!
                </Text>
              </View>
              <Text style={[styles.cardTitle, { color: t.ink }]}>
                Renda Variável
              </Text>
              <Text style={[styles.cardSubtitle, { color: t.inkDim }]}>
                Diversifique com ações e fundos imobiliários de alto potencial.
              </Text>
            </View>

            {/* Right emerald gradient growth illustration inside the card */}
            <View style={styles.rightContentPiggy}>
              <LinearGradient
                colors={[t.green, "#059669"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.piggyGradient}
              >
                <View style={[styles.piggyDecoEmoji, { top: 8, right: 8 }]}>
                  <BuildingIcon size={12} color="rgba(255,255,255,0.6)" />
                </View>
                <View style={[styles.piggyDecoEmoji, { top: 8, left: 8 }]}>
                  <BriefcaseIcon size={12} color="rgba(255,255,255,0.6)" />
                </View>
                <View style={[styles.piggyDecoEmoji, { bottom: 8, left: 8 }]}>
                  <BanknoteIcon size={12} color="rgba(255,255,255,0.6)" />
                </View>
                <View style={[styles.piggyDecoEmoji, { bottom: 8, right: 8 }]}>
                  <MoneyBagIcon size={12} color="rgba(255,255,255,0.6)" />
                </View>
                <TrendUpIcon size={36} color="rgba(255,255,255,0.9)" />
              </LinearGradient>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Page Dots Indicator */}
      <View style={styles.indicatorRow}>
        <View style={[styles.indicatorDot, { backgroundColor: activeSlide === 0 ? t.ink : t.inkFaint }]} />
        <View style={[styles.indicatorDot, { backgroundColor: activeSlide === 1 ? t.ink : t.inkFaint }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: fonts.sans.bold,
    fontSize: 18,
    letterSpacing: -0.3,
    marginBottom: 14,
  },
  carouselScrollView: {
    marginHorizontal: -20,
  },
  carouselContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  card: {
    width: CARD_W,
    borderRadius: radii.card || 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 16,
    paddingRight: 10,
    height: 124,
  },
  leftContent: {
    flex: 1.2,
    justifyContent: "center",
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 5,
  },
  badgeText: {
    fontFamily: fonts.sans.semibold,
    fontSize: 9,
    letterSpacing: 0.2,
  },
  cardTitle: {
    fontFamily: fonts.sans.bold,
    fontSize: 16,
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontFamily: fonts.sans.medium,
    fontSize: 11,
    lineHeight: 15,
  },
  rightContent: {
    flex: 0.8,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  rightContentPiggy: {
    flex: 0.8,
    alignItems: "flex-end",
    justifyContent: "center",
    paddingRight: 4,
  },
  piggyGradient: {
    width: 106,
    height: 100,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  piggyEmoji: {
    fontSize: 36,
  },
  piggyDecoEmoji: {
    position: "absolute",
    fontSize: 12,
  },
  indicatorRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
  },
  indicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});

export default Opportunities;
