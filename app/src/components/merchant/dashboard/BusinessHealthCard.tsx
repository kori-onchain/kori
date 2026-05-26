import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { fonts, radii } from "../../../theme/tokens";
import { useTheme } from "../../../theme/ThemeProvider";
import { SoftCard } from "../../ds/SoftCard";

export interface BusinessHealthCardProps {
  score: number;
  scoreMax: number;
  fillPct: number;
  level: string;
  trending: string;
  discountedRatePct: number;
  baseRatePct: number;
}

export const BusinessHealthCard: React.FC<BusinessHealthCardProps> = ({
  score,
  scoreMax,
  fillPct,
  level,
  trending,
  discountedRatePct,
  baseRatePct,
}) => {
  const { t } = useTheme();
  const safeFill = Math.max(0, Math.min(100, fillPct));

  return (
    <SoftCard radius={radii.card} padding={18} style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: t.ink }]}>Saúde do negócio</Text>
        <View
          style={[
            styles.tag,
            { backgroundColor: "rgba(74,222,128,0.14)" },
          ]}
        >
          <Text style={[styles.tagText, { color: t.green }]}>↑ {trending}</Text>
        </View>
      </View>

      <View style={styles.scoreRow}>
        <View style={styles.scoreText}>
          <Text style={[styles.scoreValue, { color: t.ink }]}>
            {score}
            <Text style={[styles.scoreMax, { color: t.inkMute }]}>
              /{scoreMax}
            </Text>
          </Text>
        </View>

        <View style={styles.barWrap}>
          <View style={styles.barLabels}>
            <Text style={[styles.barLabel, { color: t.inkMute }]}>
              SCORE ON-CHAIN
            </Text>
            <Text style={[styles.barLevel, { color: t.green }]}>{level}</Text>
          </View>
          <View style={[styles.track, { backgroundColor: t.line2 }]}>
            <View
              style={[
                styles.fill,
                { backgroundColor: t.green, width: `${safeFill}%` },
              ]}
            />
          </View>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: t.line }]} />

      <Text style={[styles.explain, { color: t.inkMute }]}>
        Seu histórico on-chain destravou antecipação a{" "}
        <Text style={[styles.explainStrong, { color: t.ink }]}>
          {discountedRatePct}% a.m.
        </Text>{" "}
        em vez de{" "}
        <Text style={[styles.explainStrong, { color: t.ink }]}>
          {baseRatePct}%
        </Text>
        . Mantenha as vendas pra chegar no nível Ótimo.
      </Text>
    </SoftCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  title: {
    fontFamily: fonts.sans.semibold,
    fontSize: 14,
    letterSpacing: -0.1,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.pill,
  },
  tagText: {
    fontFamily: fonts.mono.semibold,
    fontSize: 10,
    letterSpacing: 0.4,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  scoreText: {
    flexShrink: 0,
  },
  scoreValue: {
    fontFamily: fonts.sans.bold,
    fontSize: 38,
    letterSpacing: -1.4,
    lineHeight: 42,
  },
  scoreMax: {
    fontFamily: fonts.sans.medium,
    fontSize: 14,
    letterSpacing: -0.2,
  },
  barWrap: {
    flex: 1,
    gap: 6,
  },
  barLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  barLabel: {
    fontFamily: fonts.mono.medium,
    fontSize: 9,
    letterSpacing: 1.1,
  },
  barLevel: {
    fontFamily: fonts.mono.semibold,
    fontSize: 10,
    letterSpacing: 0.6,
  },
  track: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 3,
  },
  divider: {
    height: 1,
    marginVertical: 14,
  },
  explain: {
    fontFamily: fonts.sans.regular,
    fontSize: 12,
    lineHeight: 18,
  },
  explainStrong: {
    fontFamily: fonts.sans.bold,
  },
});
