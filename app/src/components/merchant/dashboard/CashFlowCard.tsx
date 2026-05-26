import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "../../../icons";
import { fonts, radii } from "../../../theme/tokens";
import { useTheme } from "../../../theme/ThemeProvider";
import { SoftCard } from "../../ds/SoftCard";

export interface CashFlowCardProps {
  amountLabel: string;
  nextEntryText: string;
  onAdvance?: () => void;
}

export const CashFlowCard: React.FC<CashFlowCardProps> = ({
  amountLabel,
  nextEntryText,
  onAdvance,
}) => {
  const { t } = useTheme();

  return (
    <SoftCard radius={radii.card} padding={16} style={styles.card}>
      <View style={styles.row}>
        <View style={styles.left}>
          <Text style={[styles.label, { color: t.inkMute }]}>A RECEBER</Text>
          <Text style={[styles.amount, { color: t.ink }]}>{amountLabel}</Text>
          <Text style={[styles.sub, { color: t.inkMute }]}>
            {nextEntryText}
          </Text>
        </View>

        <TouchableOpacity
          onPress={onAdvance}
          activeOpacity={0.8}
          style={[styles.cta, { borderColor: t.orange }]}
        >
          <Feather name="zap" size={13} color={t.orange} />
          <Text style={[styles.ctaText, { color: t.orange }]}>Antecipar</Text>
        </TouchableOpacity>
      </View>
    </SoftCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  left: {
    flex: 1,
    gap: 4,
  },
  label: {
    fontFamily: fonts.mono.semibold,
    fontSize: 9,
    letterSpacing: 1.5,
  },
  amount: {
    fontFamily: fonts.sans.bold,
    fontSize: 22,
    letterSpacing: -0.4,
  },
  sub: {
    fontFamily: fonts.sans.medium,
    fontSize: 11,
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "transparent",
  },
  ctaText: {
    fontFamily: fonts.sans.semibold,
    fontSize: 12,
    letterSpacing: 0.1,
  },
});
