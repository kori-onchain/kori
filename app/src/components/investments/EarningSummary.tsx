import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@theme/ThemeProvider";
import { fonts } from "@theme/tokens";
import { Button } from "@components/layout/Button";

export const EarningSummary: React.FC = () => {
  const { t } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: t.inkDim }]}>
        Saldo de investimentos
      </Text>

      <View style={styles.balanceRow}>
        <Text style={[styles.balanceWhole, { color: t.ink }]}>R$ 20.032</Text>
        <Text style={[styles.balanceDecimal, { color: t.orange }]}>,52</Text>
      </View>

      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressSegment,
            { flex: 0.5, backgroundColor: t.orange },
          ]}
        />
        <View
          style={[
            styles.progressSegment,
            { flex: 0.35, backgroundColor: t.sol },
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
        R$ 10.890,26 disponivel para investir
      </Text>

      <View style={styles.actionButtonsRow}>
        <Button label="Investir" variant="primary" onPress={() => {}} />
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
    marginBottom: 20,
  },
  actionButtonsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
});

export default EarningSummary;
