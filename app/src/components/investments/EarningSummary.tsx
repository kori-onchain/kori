import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { KoraInvestmentPool, koraApi } from "@/lib/koraApi";
import { useTheme } from "@theme/ThemeProvider";
import { fonts } from "@theme/tokens";
import { Button } from "@components/layout/Button";

export const EarningSummary: React.FC<{
  pool?: KoraInvestmentPool | null;
  onInvestPress?: () => void;
}> = ({
  pool,
  onInvestPress,
}) => {
  const { t } = useTheme();
  const deployed = pool?.deployedCents ?? 2_003_252;
  const available = pool?.availableLiquidityCents ?? 1_089_026;
  const invested = pool?.userInvestedCents ?? 0;
  const yieldCents = pool?.userYieldCents ?? 0;
  const total = pool?.initialLiquidityCents ?? deployed + available;
  const deployedRatio = total > 0 ? Math.max(Math.min(deployed / total, 1), 0) : 0;
  const availableRatio = total > 0 ? Math.max(Math.min(available / total, 1), 0) : 0;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: t.inkDim }]}>
        Pool de recebiveis
      </Text>

      <View style={styles.balanceRow}>
        <Text style={[styles.balanceWhole, { color: t.ink }]}>
          {koraApi.money.formatCents(deployed).replace(/,\d{2}$/, "")}
        </Text>
        <Text style={[styles.balanceDecimal, { color: t.orange }]}>
          {koraApi.money.formatCents(deployed).match(/,\d{2}$/)?.[0] ?? ",00"}
        </Text>
      </View>

      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressSegment,
            { flex: Math.max(deployedRatio, 0.08), backgroundColor: t.orange },
          ]}
        />
        <View
          style={[
            styles.progressSegment,
            { flex: Math.max(availableRatio, 0.08), backgroundColor: t.sol },
          ]}
        />
        <View
          style={[
            styles.progressSegment,
            { flex: 0.1, backgroundColor: t.green },
          ]}
        />
        <View
          style={[
            styles.progressSegment,
            { flex: 0.2, backgroundColor: t.inkFaint },
          ]}
        />
      </View>

      <Text style={[styles.availableText, { color: t.inkDim }]}>
        {koraApi.money.formatCents(available)} disponivel para antecipacoes
        {pool?.expectedYieldLabel ? ` - ${pool.expectedYieldLabel}` : ""}
      </Text>
      <Text style={[styles.investedText, { color: t.ink }]}>
        Voce investiu {koraApi.money.formatCents(invested)}
      </Text>
      <Text style={[styles.yieldText, { color: t.green }]}>
        Rendimento {koraApi.money.formatCents(yieldCents)}
      </Text>

      <View style={styles.actionButtonsRow}>
        <Button label="Investir" variant="primary" onPress={onInvestPress} />
        <Button label="Resgatar" variant="secondary" onPress={() => {}} />
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
    fontFamily: fonts.sans.semibold,
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
    fontFamily: fonts.sans.regular,
    fontSize: 38,
    letterSpacing: -0.6,
  },
  balanceDecimal: {
    fontFamily: fonts.sans.regular,
    fontSize: 24,
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
    marginBottom: 8,
  },
  investedText: {
    fontFamily: fonts.sans.semibold,
    fontSize: 13,
    marginBottom: 6,
  },
  yieldText: {
    fontFamily: fonts.sans.semibold,
    fontSize: 13,
    marginBottom: 20,
  },
  actionButtonsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
});

export default EarningSummary;
