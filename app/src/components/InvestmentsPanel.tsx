import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import { fonts, radii } from "../theme/tokens";
import { Button } from "./ds/Button";
import { InvestIcon, PlusIcon, ArrowRightIcon } from "./ds/icons";
import { SoftCard } from "./ds/SoftCard";
import { CryptoInvestments } from "./CryptoInvestments";

const Shortcut: React.FC<{
  label: string;
  icon: React.ReactNode;
  primary?: boolean;
}> = ({ label, icon, primary }) => {
  return (
    <Button
      label={label}
      icon={icon}
      variant={primary ? "primary" : "secondary"}
      full
      style={styles.shortcutButton}
    />
  );
};

export const InvestmentsPanel: React.FC = () => {
  const { t } = useTheme();

  return (
    <ScrollView
      style={{ backgroundColor: t.bg }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.container, { backgroundColor: t.bg }]}
    >
      <SoftCard
        radius={radii.card}
        padding={20}
        strong
        style={styles.summaryCard}
      >
        <View style={styles.summaryHeader}>
          <Text style={[styles.summaryLabel, { color: t.inkMute }]}>
            PATRIMONIO TOTAL
          </Text>
          <View style={styles.trendInline}>
            <InvestIcon size={13} color={t.green} strokeWidth={1.8} />
            <Text style={[styles.trendText, { color: t.green }]}>+14.8%</Text>
          </View>
        </View>

        <Text style={[styles.summaryValue, { color: t.ink }]}>
          R$ 42.980,50
        </Text>

        <View style={[styles.divider, { backgroundColor: t.line }]} />

        <View style={styles.summaryFooter}>
          <View style={styles.footerItem}>
            <Text style={[styles.footerLabel, { color: t.inkMute }]}>
              RENDA VARIAVEL
            </Text>
            <Text style={[styles.footerValue, { color: t.ink }]}>
              R$ 28.540,00
            </Text>
          </View>
          <View
            style={[styles.verticalDivider, { backgroundColor: t.line2 }]}
          />
          <View style={styles.footerItem}>
            <Text style={[styles.footerLabel, { color: t.inkMute }]}>
              CRYPTO ASSETS
            </Text>
            <Text style={[styles.footerValue, { color: t.ink }]}>
              R$ 14.440,50
            </Text>
          </View>
        </View>
      </SoftCard>

      <View style={styles.shortcutsRow}>
        <Shortcut
          label="Aplicar"
          primary
          icon={<PlusIcon size={16} color={t.btnPrimaryFg} />}
        />
        <Shortcut
          label="Resgatar"
          icon={<ArrowRightIcon size={16} color={t.ink} />}
        />
      </View>

      <View style={styles.cryptoSectionWrapper}>
        <CryptoInvestments />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  summaryCard: {
    marginTop: 12,
    marginBottom: 16,
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    fontFamily: fonts.mono.semibold,
    fontSize: 9,
    letterSpacing: 1.5,
  },
  trendInline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  trendText: {
    fontFamily: fonts.mono.semibold,
    fontSize: 10,
  },
  summaryValue: {
    fontFamily: fonts.sans.bold,
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.8,
    marginTop: 8,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  summaryFooter: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerItem: {
    flex: 1,
  },
  footerLabel: {
    fontFamily: fonts.mono.medium,
    fontSize: 8,
    letterSpacing: 1.1,
    marginBottom: 5,
  },
  footerValue: {
    fontFamily: fonts.sans.semibold,
    fontSize: 13,
    fontWeight: "700",
  },
  verticalDivider: {
    width: 1,
    height: 34,
    marginHorizontal: 16,
  },
  shortcutsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },
  shortcutButton: {
    minWidth: 0,
  },
  cryptoSectionWrapper: {
    marginTop: -4,
  },
});
