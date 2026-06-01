import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { KoraInvestmentPool, koraApi } from "@/lib/koraApi";
import { useTheme } from "@theme/ThemeProvider";
import { fonts } from "@theme/tokens";
import { Button } from "@components/layout/Button";

export const EarningSummary: React.FC<{
  pool?: KoraInvestmentPool | null;
  onInvestPress?: () => void;
  onRedeemPress?: () => void;
}> = ({
  pool,
  onInvestPress,
  onRedeemPress,
}) => {
  const { t } = useTheme();
  // Mostra somente a posição do próprio usuário (aporte + rendimento),
  // não os números do pool inteiro — evita confusão na tela.
  const invested = pool?.userInvestedCents ?? 0;
  const yieldCents = pool?.userYieldCents ?? 0;
  const position = invested + yieldCents;
  const investedRatio = position > 0 ? invested / position : 1;
  const yieldRatio = position > 0 ? yieldCents / position : 0;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: t.inkDim }]}>
        Seu investimento
      </Text>

      <View style={styles.balanceRow}>
        <Text style={[styles.balanceWhole, { color: t.ink }]}>
          {koraApi.money.formatCents(position).replace(/,\d{2}$/, "")}
        </Text>
        <Text style={[styles.balanceDecimal, { color: t.orange }]}>
          {koraApi.money.formatCents(position).match(/,\d{2}$/)?.[0] ?? ",00"}
        </Text>
      </View>

      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressSegment,
            { flex: Math.max(investedRatio, 0.08), backgroundColor: t.orange },
          ]}
        />
        <View
          style={[
            styles.progressSegment,
            { flex: Math.max(yieldRatio, 0.04), backgroundColor: t.green },
          ]}
        />
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCol}>
          <Text style={[styles.statLabel, { color: t.inkMute }]}>Aporte</Text>
          <Text style={[styles.statValue, { color: t.ink }]}>
            {koraApi.money.formatCents(invested)}
          </Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: t.line }]} />
        <View style={styles.statCol}>
          <Text style={[styles.statLabel, { color: t.inkMute }]}>Rendimento</Text>
          <Text style={[styles.statValue, { color: t.green }]}>
            {koraApi.money.formatCents(yieldCents)}
          </Text>
        </View>
      </View>

      {pool?.expectedYieldLabel ? (
        <Text style={[styles.caption, { color: t.inkDim }]}>
          Rentabilidade esperada {pool.expectedYieldLabel}
        </Text>
      ) : null}

      <View style={styles.actionButtonsRow}>
        <Button label="Investir" variant="primary" onPress={onInvestPress} />
        <Button label="Resgatar" variant="secondary" onPress={onRedeemPress} />
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
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 12,
  },
  statCol: {
    flex: 1,
    gap: 3,
  },
  statLabel: {
    fontFamily: fonts.mono.regular,
    fontSize: 10,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  statValue: {
    fontFamily: fonts.sans.bold,
    fontSize: 17,
    letterSpacing: -0.3,
  },
  statDivider: {
    width: 1,
    height: 34,
  },
  caption: {
    fontFamily: fonts.sans.medium,
    fontSize: 12,
    marginBottom: 18,
  },
  actionButtonsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
});

export default EarningSummary;
