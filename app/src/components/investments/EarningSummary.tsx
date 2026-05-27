import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@theme/ThemeProvider";
import { fonts, radii } from "@theme/tokens";

export const EarningSummary: React.FC = () => {
  const { t } = useTheme();

  return (
    <View style={styles.container}>
      {/* Prominent Screen Title - Doubled in Size & More Muted */}
      <Text style={[styles.title, { color: t.inkDim }]}>Earning balance</Text>

      {/* Main Balance with Standard Thinner Font & Orange Decimal */}
      <View style={styles.balanceRow}>
        <Text style={[styles.balanceWhole, { color: t.ink }]}>$20,032</Text>
        <Text style={[styles.balanceDecimal, { color: t.orange }]}>.52</Text>
      </View>

      {/* Segmented Progress Bar using Kori Theme Colors */}
      <View style={styles.progressBar}>
        <View style={[styles.progressSegment, { flex: 0.5, backgroundColor: t.orange }]} />
        <View style={[styles.progressSegment, { flex: 0.35, backgroundColor: t.sol || "#9945ff" }]} />
        <View style={[styles.progressSegment, { flex: 0.1, backgroundColor: t.green }]} />
        <View style={[styles.progressSegment, { flex: 0.2, backgroundColor: t.inkFaint }]} />
      </View>

      {/* Available to earn label */}
      <Text style={[styles.availableText, { color: t.inkDim }]}>
        $10,890.26 available to earn
      </Text>

      {/* Action Buttons: Investir & Resgatar */}
      <View style={styles.actionButtonsRow}>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: "#FFB800" }]} activeOpacity={0.8}>
          <Text style={styles.actionBtnTextInvest}>Investir</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: "#FEF5E1", borderWidth: 1, borderColor: "#EED8B3" }]} activeOpacity={0.8}>
          <Text style={[styles.actionBtnTextRedeem, { color: "#8A521D" }]}>Resgatar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 6,
    paddingTop: 10,
  },
  title: {
    fontFamily: fonts.sans.semibold, // Semibold for a slightly less heavy/thick header
    fontSize: 32,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 16,
  },
  balanceWhole: {
    fontFamily: fonts.sans.regular, // Thinner font (Geist_400Regular)
    fontSize: 38, // Standard clean size
    letterSpacing: -0.6,
  },
  balanceDecimal: {
    fontFamily: fonts.sans.regular, // Thinner font
    fontSize: 24, // Standard clean size
    marginLeft: 1,
  },
  progressBar: {
    flexDirection: "row",
    height: 7,
    borderRadius: 3.5,
    overflow: "hidden",
    gap: 3,
    marginBottom: 10,
  },
  progressSegment: {
    height: "100%",
    borderRadius: 3.5,
  },
  availableText: {
    fontFamily: fonts.sans.medium,
    fontSize: 12,
    marginBottom: 20,
  },
  actionButtonsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
    alignSelf: "flex-start",
  },
  actionBtn: {
    borderRadius: radii.pill,
    paddingHorizontal: 28,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnTextInvest: {
    fontFamily: fonts.sans.bold,
    fontSize: 14,
    color: "#0a0a0a",
  },
  actionBtnTextRedeem: {
    fontFamily: fonts.sans.bold,
    fontSize: 14,
  },
});
export default EarningSummary;
